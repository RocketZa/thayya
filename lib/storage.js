// Supabase Storage helper — server-side uploads via the Storage REST API.
// Files are POSTed to our own Node API routes, which call uploadToBucket()
// here with the service-role key (bypasses Storage RLS); no client keys are
// exposed. We use plain fetch against the REST endpoint rather than
// @supabase/supabase-js, which pulls in a realtime WebSocket client that
// throws on Node < 22 in serverless runtimes.
//
// Required env (server-only):
//   SUPABASE_URL                e.g. https://zaayolrdgxtxdbxvwtez.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   Project Settings → API → service_role secret
//
// Buckets used: "audio" (track files), "avatars" (instructor photos).
// Both are public-read; see scripts/setup-storage.sql.

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function storageConfigured() {
  return Boolean(url && serviceKey);
}

const SAFE = /[^a-z0-9._-]+/gi;
export function safeName(name) {
  const base = String(name || "file").toLowerCase().replace(SAFE, "-").replace(/-+/g, "-");
  return base.replace(/^-|-$/g, "") || "file";
}

function encodePath(path) {
  return String(path)
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

// Upload a Buffer/Uint8Array to `bucket` at `path` and return the public URL.
export async function uploadToBucket(bucket, path, data, contentType) {
  if (!storageConfigured()) {
    throw new Error(
      "Supabase Storage is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    );
  }
  const encoded = encodePath(path);
  const res = await fetch(`${url}/storage/v1/object/${bucket}/${encoded}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": contentType || "application/octet-stream",
      "x-upsert": "true",
    },
    body: data,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Storage upload failed (${res.status}): ${detail}`);
  }
  return `${url}/storage/v1/object/public/${bucket}/${encoded}`;
}

// Read a File (from multipart/form-data) into a Buffer.
export async function fileToBuffer(file) {
  const ab = await file.arrayBuffer();
  return Buffer.from(ab);
}
