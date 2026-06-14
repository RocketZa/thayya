import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth";
import { listTracks, addTrack } from "../../../../lib/db";
import { storageConfigured, safeName, fileToBuffer, uploadToBucket } from "../../../../lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { user, error } = await requireUser(["instructor", "admin"]);
  if (error) return NextResponse.json({ error }, { status: 401 });
  const instructorId = user.instructorId;
  if (!instructorId) return NextResponse.json({ error: "No instructor profile." }, { status: 403 });

  return NextResponse.json({ tracks: await listTracks(instructorId) });
}

export async function POST(req) {
  const { user, error } = await requireUser(["instructor", "admin"]);
  if (error) return NextResponse.json({ error }, { status: 401 });
  const instructorId = user.instructorId;
  if (!instructorId) return NextResponse.json({ error: "No instructor profile." }, { status: 403 });

  const contentType = req.headers.get("content-type") || "";

  // Multipart path: a real audio file may be attached.
  if (contentType.includes("multipart/form-data")) {
    let formData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
    }

    const title = String(formData.get("title") || "").trim();
    if (!title) {
      return NextResponse.json({ error: "A track title is required." }, { status: 400 });
    }

    const artist = String(formData.get("artist") || "");
    const duration = String(formData.get("duration") || "");
    const mood = String(formData.get("mood") || "");
    const bpm = formData.get("bpm");
    let audioUrl = String(formData.get("audioUrl") || "").trim();
    let source = String(formData.get("source") || "").trim();

    const file = formData.get("file");
    const hasFile = file && typeof file === "object" && typeof file.arrayBuffer === "function" && file.size > 0;

    if (hasFile) {
      if (!storageConfigured()) {
        return NextResponse.json(
          { error: "File uploads are not configured. Set SUPABASE_SERVICE_ROLE_KEY (and SUPABASE_URL) in the server environment." },
          { status: 503 }
        );
      }
      try {
        const buffer = await fileToBuffer(file);
        const path = `${instructorId}/${Date.now()}-${safeName(file.name)}`;
        audioUrl = await uploadToBucket("audio", path, buffer, file.type || "audio/mpeg");
        if (!source) source = "Upload";
      } catch (e) {
        return NextResponse.json({ error: `Upload failed: ${e.message}` }, { status: 500 });
      }
    }

    const track = await addTrack(instructorId, {
      title,
      artist,
      duration,
      mood,
      bpm,
      source: source || undefined,
      audioUrl,
    });
    return NextResponse.json({ track });
  }

  // JSON path (backward compatible): pasted audioUrl only.
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { title, artist, duration, mood, bpm, source, audioUrl } = body || {};
  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "A track title is required." }, { status: 400 });
  }

  const track = await addTrack(instructorId, { title, artist, duration, mood, bpm, source, audioUrl });
  return NextResponse.json({ track });
}
