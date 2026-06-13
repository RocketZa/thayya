// Supabase Edge Function: assistant-llm
//
// Runs the Thayya assistant's LLM call server-side so the LLM API key lives as
// a Supabase function secret and never ships with the Next.js app.
//
// Secrets (set via `supabase secrets set ...`, NOT committed):
//   LLM_API_KEY   - upstream provider key
//   LLM_BASE_URL  - Azure OpenAI Responses endpoint (".../openai/responses?...")
//                   or a chat-completions style endpoint
//   LLM_MODEL     - model id, e.g. openai/gpt-oss-120b
//
// Contract:
//   POST { system, messages, tools }
//   -> 200 { text, toolCalls: [{ name, arguments }] }
//   -> 200 { text: "", toolCalls: [], error: "llm_unavailable" } on any
//      upstream error/timeout (never 500, so the caller can fall back).
//
// This mirrors the request-building and normalization logic that previously
// lived in the Next app's lib/llm.js. TLS verification is left ON — Supabase
// infra has normal trust; we never disable it.

// Deno global is provided by the Supabase Edge runtime.
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const TIMEOUT_MS = 30000;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info",
};

interface Message {
  role: string;
  content?: unknown;
}

interface ToolDef {
  function: {
    name: string;
    description?: string;
    parameters?: unknown;
  };
}

interface ChatRequest {
  system?: string;
  messages?: Message[];
  tools?: ToolDef[];
}

// Build the request body. Responses API uses `input`; chat-completions uses
// `messages`. We detect via the URL.
function buildBody(opts: {
  baseUrl: string;
  model: string;
  system?: string;
  messages?: Message[];
  tools?: ToolDef[];
}) {
  const { baseUrl, model, system, messages, tools } = opts;
  const isResponses = baseUrl.includes("/responses");

  if (isResponses) {
    const input: Array<{ role: string; content: string }> = [];
    if (system) input.push({ role: "system", content: system });
    for (const m of messages || []) {
      input.push({ role: m.role, content: String(m.content ?? "") });
    }
    const body: Record<string, unknown> = { model, input };
    if (tools && tools.length) {
      // Responses API expects flat function tools.
      body.tools = tools.map((t) => ({
        type: "function",
        name: t.function.name,
        description: t.function.description,
        parameters: t.function.parameters,
      }));
      body.tool_choice = "auto";
    }
    return body;
  }

  // chat-completions style
  const msgs: Array<{ role: string; content: string }> = [];
  if (system) msgs.push({ role: "system", content: system });
  for (const m of messages || []) {
    msgs.push({ role: m.role, content: String(m.content ?? "") });
  }
  const body: Record<string, unknown> = { model, messages: msgs };
  if (tools && tools.length) {
    body.tools = tools;
    body.tool_choice = "auto";
  }
  return body;
}

function parseArgs(raw: unknown): Record<string, unknown> {
  if (raw == null) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  try {
    return JSON.parse(String(raw));
  } catch {
    return {};
  }
}

interface ToolCall {
  name: string | undefined;
  arguments: Record<string, unknown>;
}

interface Normalized {
  text: string;
  toolCalls: ToolCall[];
}

// Defensively normalize whichever response shape comes back into
// { text, toolCalls: [{ name, arguments }] }.
function normalize(data: unknown): Normalized {
  const result: Normalized = { text: "", toolCalls: [] };
  if (!data || typeof data !== "object") return result;
  const d = data as Record<string, any>;

  // ---- Responses API shape: top-level `output` array ----
  if (Array.isArray(d.output)) {
    const textParts: string[] = [];
    for (const item of d.output) {
      if (!item || typeof item !== "object") continue;
      // function calls surface as their own output items
      if (item.type === "function_call" || item.type === "tool_call") {
        result.toolCalls.push({
          name: item.name || item.function?.name,
          arguments: parseArgs(item.arguments ?? item.function?.arguments),
        });
        continue;
      }
      // message items carry a `content` array of parts
      if (Array.isArray(item.content)) {
        for (const part of item.content) {
          if (!part || typeof part !== "object") continue;
          if (typeof part.text === "string") textParts.push(part.text);
          if (part.type === "function_call" || part.type === "tool_call") {
            result.toolCalls.push({
              name: part.name || part.function?.name,
              arguments: parseArgs(part.arguments ?? part.function?.arguments),
            });
          }
        }
      }
    }
    if (typeof d.output_text === "string" && !textParts.length) {
      textParts.push(d.output_text);
    }
    result.text = textParts.join("\n").trim();
    return result;
  }

  // convenience field some Responses deployments include
  if (typeof d.output_text === "string") {
    result.text = d.output_text.trim();
  }

  // ---- chat-completions shape: choices[0].message ----
  if (Array.isArray(d.choices) && d.choices.length) {
    const msg = d.choices[0].message || {};
    if (typeof msg.content === "string") result.text = msg.content.trim();
    if (Array.isArray(msg.tool_calls)) {
      for (const tc of msg.tool_calls) {
        result.toolCalls.push({
          name: tc.function?.name || tc.name,
          arguments: parseArgs(tc.function?.arguments ?? tc.arguments),
        });
      }
    }
  }

  return result;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

const UNAVAILABLE = { text: "", toolCalls: [], error: "llm_unavailable" };

// Call the upstream LLM. Returns normalized { text, toolCalls } or null on any
// error/timeout.
async function callUpstream(payload: ChatRequest): Promise<Normalized | null> {
  const baseUrl = Deno.env.get("LLM_BASE_URL");
  const apiKey = Deno.env.get("LLM_API_KEY");
  const model = Deno.env.get("LLM_MODEL");
  if (!baseUrl || !apiKey || !model) return null;

  const body = buildBody({
    baseUrl,
    model,
    system: payload.system,
    messages: payload.messages,
    tools: payload.tools,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Azure prefers `api-key`; some gateways want a bearer token. Try api-key
  // first, then fall back to Authorization on a 401.
  const headerVariants: Array<Record<string, string>> = [
    { "api-key": apiKey },
    { Authorization: `Bearer ${apiKey}` },
  ];

  try {
    for (let i = 0; i < headerVariants.length; i++) {
      let res: Response;
      try {
        res = await fetch(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headerVariants[i] },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
      } catch {
        // network/TLS failure — no point trying the other header
        return null;
      }

      if (res.status === 401 && i + 1 < headerVariants.length) {
        // try the next auth scheme
        continue;
      }
      if (!res.ok) return null;

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        return null;
      }
      return normalize(data);
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  // CORS preflight (harmless; this is invoked server-side from our Next app).
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json(UNAVAILABLE, 200);
  }

  let payload: ChatRequest;
  try {
    payload = (await req.json()) as ChatRequest;
  } catch {
    return json(UNAVAILABLE, 200);
  }

  const result = await callUpstream(payload);
  if (!result) return json(UNAVAILABLE, 200);

  return json({ text: result.text, toolCalls: result.toolCalls }, 200);
});
