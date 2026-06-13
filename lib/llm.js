// LLM client for the Thayya assistant.
//
// The actual LLM call runs server-side in a Supabase Edge Function so the LLM
// API key lives as a Supabase function secret and never ships with this app.
// This module just proxies to that function. The request-building and
// response-normalization logic now lives there — see
// supabase/functions/assistant-llm/index.ts.
//
// This module NEVER throws: chat() returns a normalized result on success or
// null on any failure, so the caller can fall back to a deterministic path.

const TIMEOUT_MS = 30000;

function env(name) {
  return process.env[name];
}

// True when the Supabase URL and anon key are configured. The route uses this
// to decide whether to attempt the LLM path at all; the deterministic fallback
// handles the rest.
export async function llmAvailable() {
  return Boolean(
    env("NEXT_PUBLIC_SUPABASE_URL") && env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

// Core call. POSTs { system, messages, tools } to the assistant-llm Edge
// Function and returns its normalized { text, toolCalls } — or null on any
// error (including the function reporting "llm_unavailable" with empty text).
export async function chat({ system, messages, tools }) {
  const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return null;

  const endpoint = `${supabaseUrl}/functions/v1/assistant-llm`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({ system, messages, tools }),
        signal: controller.signal,
      });
    } catch {
      return null;
    }

    if (!res.ok) return null;

    let data;
    try {
      data = await res.json();
    } catch {
      return null;
    }

    // The function returns { text:"", toolCalls:[], error:"llm_unavailable" }
    // when the upstream LLM failed — treat that as a fallback signal.
    if (data && data.error === "llm_unavailable" && !data.text) return null;

    return {
      text: typeof data?.text === "string" ? data.text : "",
      toolCalls: Array.isArray(data?.toolCalls) ? data.toolCalls : [],
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
