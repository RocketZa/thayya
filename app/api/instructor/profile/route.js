import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth";
import { findUserById, updateInstructorProfile } from "../../../../lib/db";
import { storageConfigured, safeName, fileToBuffer, uploadToBucket } from "../../../../lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// The editable portfolio fields exposed to the instructor.
function editableProfile(u) {
  if (!u) return null;
  return {
    name: u.name || "",
    style: u.style || "",
    city: u.city || "",
    bio: u.bio || "",
    tagline: u.tagline || "",
    accentColor: u.accentColor || "",
    instagram: u.instagram || "",
    youtube: u.youtube || "",
    avatarUrl: u.avatarUrl || "",
  };
}

export async function GET() {
  const { user, error } = await requireUser(["instructor", "admin"]);
  if (error) return NextResponse.json({ error }, { status: 401 });

  const full = await findUserById(user.id);
  return NextResponse.json({ profile: editableProfile(full) });
}

export async function PATCH(req) {
  const { user, error } = await requireUser(["instructor", "admin"]);
  if (error) return NextResponse.json({ error }, { status: 401 });

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const fields = {};

  // text fields (only set when present in the form, so omitted fields are ignored)
  for (const key of ["name", "style", "city", "bio", "tagline", "instagram", "youtube"]) {
    if (form.has(key)) fields[key] = String(form.get(key) || "").trim().slice(0, 600);
  }

  // accent color must be a valid hex if provided
  if (form.has("accentColor")) {
    const raw = String(form.get("accentColor") || "").trim();
    if (raw && !HEX.test(raw)) {
      return NextResponse.json(
        { error: "Accent color must be a hex value like #e5816c." },
        { status: 400 }
      );
    }
    fields.accentColor = raw;
  }

  // optional photo upload
  const photo = form.get("photo");
  const hasPhoto = photo && typeof photo === "object" && typeof photo.arrayBuffer === "function" && photo.size > 0;
  if (hasPhoto) {
    if (!storageConfigured()) {
      return NextResponse.json(
        { error: "Photo uploads are not configured — set SUPABASE_SERVICE_ROLE_KEY (and SUPABASE_URL) on the server." },
        { status: 503 }
      );
    }
    try {
      const buffer = await fileToBuffer(photo);
      const folder = user.instructorId || user.id;
      const path = `${folder}/${Date.now()}-${safeName(photo.name)}`;
      const publicUrl = await uploadToBucket("avatars", path, buffer, photo.type || "image/jpeg");
      fields.avatarUrl = publicUrl;
    } catch (e) {
      return NextResponse.json(
        { error: `Could not upload the photo: ${e.message || "unknown error"}` },
        { status: 500 }
      );
    }
  }

  const profile = await updateInstructorProfile(user.id, fields);
  return NextResponse.json({ profile: editableProfile(profile) });
}

// allow POST as an alias for clients that prefer it
export const POST = PATCH;
