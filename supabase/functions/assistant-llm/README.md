# assistant-llm Edge Function

Runs the Thayya assistant's LLM call server-side in Supabase so the LLM API key
lives as a Supabase function secret and never ships with the Next.js app.

## Contract

`POST /functions/v1/assistant-llm`

Request body:

```json
{ "system": "string", "messages": [{ "role": "user", "content": "..." }], "tools": [] }
```

Success response (HTTP 200):

```json
{ "text": "string", "toolCalls": [{ "name": "string", "arguments": {} }] }
```

On any upstream error or timeout it still returns HTTP 200 with:

```json
{ "text": "", "toolCalls": [], "error": "llm_unavailable" }
```

so the Next.js caller can fall back to its deterministic path. It never returns
500 for upstream issues.

## Deploy

```sh
supabase functions deploy assistant-llm
```

## Set secrets

These are the upstream LLM credentials. They are stored as Supabase function
secrets and are NOT committed to the repo.

```sh
supabase secrets set \
  LLM_API_KEY=... \
  LLM_BASE_URL=... \
  LLM_MODEL=...
```

`LLM_BASE_URL` may be an Azure OpenAI Responses endpoint
(`.../openai/responses?api-version=...`) or a chat-completions style endpoint —
the function builds the request body accordingly. `LLM_MODEL` is the model id
(for example `openai/gpt-oss-120b`).

## Note

The currently seeded key returns HTTP 401 from the upstream provider, so the
deploy can wait until a working key is available. The function is ready: once a
valid `LLM_API_KEY` secret is set it will start returning live completions, and
until then the Next.js app continues to use its deterministic fallback.
