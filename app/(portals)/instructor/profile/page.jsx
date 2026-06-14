import { UserCog } from "lucide-react";
import { getCurrentUser } from "../../../../lib/auth";
import { findUserById } from "../../../../lib/db";
import ProfileClient from "./ProfileClient";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Profile · Instructor · Thayya™" };

export default async function InstructorProfile() {
  const user = await getCurrentUser();
  const instructorId = user?.instructorId;

  if (!instructorId) {
    return (
      <div className="p-wrap">
        <header className={styles.head}>
          <div>
            <div className="p-overline">Your Portfolio</div>
            <h1 className={`p-display ${styles.title}`}>Edit Profile</h1>
          </div>
        </header>
        <div className={`p-card ${styles.emptyCard}`}>
          <span className={`p-av-4 ${styles.emptyIcon}`}>
            <UserCog size={22} />
          </span>
          <div>
            <div className={styles.emptyTitle}>Switch to an instructor account to edit your portfolio</div>
            <p className={styles.emptyText}>
              Your public page, photo and styling live with your instructor profile. Sign in as an
              instructor to customise how members see you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const full = await findUserById(user.id);
  const initial = {
    name: full?.name || "",
    style: full?.style || "",
    city: full?.city || "",
    bio: full?.bio || "",
    tagline: full?.tagline || "",
    accentColor: full?.accentColor || "",
    instagram: full?.instagram || "",
    youtube: full?.youtube || "",
    avatarUrl: full?.avatarUrl || "",
  };

  return <ProfileClient initial={initial} instructorId={instructorId} name={initial.name} />;
}
