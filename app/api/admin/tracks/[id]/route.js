import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/auth";
import { instructorExists, removeTrack } from "../../../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DELETE /api/admin/tracks/:id?instructorId=...
// Admin removes a track from the chosen instructor's library.
export async function DELETE(req, { params }) {
  const { error } = await requireUser(["admin"]);
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const instructorId = String(searchParams.get("instructorId") || "").trim();
  if (!instructorId) {
    return NextResponse.json({ error: "instructorId is required." }, { status: 400 });
  }
  if (!(await instructorExists(instructorId))) {
    return NextResponse.json({ error: "That instructor does not exist." }, { status: 400 });
  }

  const removed = await removeTrack(instructorId, id);
  if (!removed) return NextResponse.json({ error: "Track not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
