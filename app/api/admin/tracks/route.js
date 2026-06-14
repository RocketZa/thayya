import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth";
import {
  listInstructorOptions,
  instructorExists,
  listTracks,
  addTrack,
} from "../../../../lib/db";
import { storageConfigured, safeName, fileToBuffer, uploadToBucket } from "../../../../lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: always returns the instructor roster for the picker. If ?instructorId=
// is supplied, also returns that instructor's tracks.
export async function GET(req) {
  const { error } = await requireUser(["admin"]);
  if (error) return NextResponse.json({ error }, { status: 401 });

  const instructors = await listInstructorOptions();

  const { searchParams } = new URL(req.url);
  const instructorId = searchParams.get("instructorId");
  if (instructorId) {
    if (!(await instructorExists(instructorId))) {
      return NextResponse.json({ instructors, tracks: [] });
    }
    return NextResponse.json({ instructors, tracks: await listTracks(instructorId) });
  }

  return NextResponse.json({ instructors });
}

// POST: admin uploads a track into a chosen instructor's library.
// Accepts multipart/form-data with instructorId + (optional) audio file + fields.
export async function POST(req) {
  const { error } = await requireUser(["admin"]);
  if (error) return NextResponse.json({ error }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Send the track as multipart/form-data." }, { status: 400 });
  }

  let formData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const instructorId = String(formData.get("instructorId") || "").trim();
  if (!instructorId) {
    return NextResponse.json({ error: "Pick an instructor first." }, { status: 400 });
  }
  if (!(await instructorExists(instructorId))) {
    return NextResponse.json({ error: "That instructor does not exist." }, { status: 400 });
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
      if (!source) source = "Admin upload";
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
    source: source || "Admin upload",
    audioUrl,
  });
  return NextResponse.json({ track });
}
