import { listInstructorOptions } from "../../../../lib/db";
import MusicAdminClient from "./MusicAdminClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Music — Thayya™" };

export default async function AdminMusicPage() {
  const instructors = await listInstructorOptions();
  return <MusicAdminClient instructors={instructors} />;
}
