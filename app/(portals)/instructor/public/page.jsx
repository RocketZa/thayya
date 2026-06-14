import Link from "next/link";
import { Star, AtSign, Play } from "lucide-react";
import { getCurrentUser } from "../../../../lib/auth";
import { findUserById, listWorkshopsForInstructor } from "../../../../lib/db";
import Avatar from "../../../components/art/Avatar";
import { PUBLIC_PAGE } from "../data";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Public Page · Instructor · Thayya™" };

const DEFAULT_ACCENT = "#e5816c";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function whenLabel(w) {
  if (w.startsAt != null) {
    const d = new Date(Number(w.startsAt));
    if (!Number.isNaN(d.getTime())) {
      const base = `${DAYS[d.getDay()]} ${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
      return w.time ? `${base} · ${w.time}` : base;
    }
  }
  return [w.date, w.time].filter(Boolean).join(" · ") || "Date to be announced";
}

// Normalise a social handle/URL into a full link, or null when empty.
function socialLink(value, kind) {
  const v = String(value || "").trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  if (kind === "instagram") return `https://instagram.com/${handle}`;
  return `https://youtube.com/${handle}`;
}

export default async function InstructorPublic() {
  const { overlinePrefix, bookTitle } = PUBLIC_PAGE;
  const user = await getCurrentUser();
  const instructorId = user?.instructorId;

  const profileUser = instructorId ? await findUserById(user.id) : null;
  const workshops = instructorId ? await listWorkshopsForInstructor(instructorId) : [];

  const name = profileUser?.name || "Instructor";
  const nameParts = name.split(/\s+/);
  const first = nameParts[0];
  const lastAccent = nameParts.slice(1).join(" ");
  const handle = instructorId || "you";
  const overline = [profileUser?.city, profileUser?.style].filter(Boolean).join(" · ") || "Thayya Instructor";
  const ratingText = profileUser?.rating ? `${profileUser.rating} rating` : "New instructor";
  const accent =
    profileUser?.accentColor && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(profileUser.accentColor)
      ? profileUser.accentColor
      : DEFAULT_ACCENT;
  const tagline = profileUser?.tagline || "";
  const avatarUrl = profileUser?.avatarUrl || "";
  const instagramUrl = socialLink(profileUser?.instagram, "instagram");
  const youtubeUrl = socialLink(profileUser?.youtube, "youtube");

  return (
    <div className="p-wrap">
      <header className={styles.head}>
        <div className="p-overline">
          {overlinePrefix}
          <span className={`gradient-text ${styles.handle}`}>{handle}</span>
        </div>
        <h1 className={`p-display ${styles.title}`}>How members see you</h1>
      </header>

      {/* Browser-chrome preview frame */}
      <div className={styles.frame} style={{ "--accent": accent }}>
        <div className={styles.chrome}>
          <div className={styles.dots}>
            <span className={styles.dot} style={{ background: "#e5816c" }} />
            <span className={styles.dot} style={{ background: "#e5b470" }} />
            <span className={styles.dot} style={{ background: "#9cb48a" }} />
          </div>
          <div className={styles.url}>thayya.com/{handle}</div>
        </div>

        <div className={styles.preview}>
          <div className="grain" />
          <div className={styles.profileGrid}>
            <div className={styles.avatar}>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={`${name} photo`} className={styles.avatarImg} />
              ) : (
                <Avatar fill seed={instructorId} name={name} rounded="squircle" />
              )}
              <div className="grain" />
            </div>
            <div className={styles.profileInfo}>
              <div className="p-overline">{overline}</div>
              <h2 className={`p-display ${styles.name}`}>
                {first}{" "}
                {lastAccent ? <span className="gradient-text">{lastAccent}</span> : null}
              </h2>
              {tagline ? <p className={styles.tagline}>{tagline}</p> : null}
              {profileUser?.bio ? <p className={styles.bio}>{profileUser.bio}</p> : null}
              <div className={styles.statsRow}>
                <span className={styles.rating}>
                  <Star size={16} fill="currentColor" className={styles.star} /> {ratingText}
                </span>
                {(instagramUrl || youtubeUrl) ? (
                  <span className={styles.socials}>
                    {instagramUrl ? (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.social}
                        aria-label="Instagram"
                      >
                        <AtSign size={16} />
                      </a>
                    ) : null}
                    {youtubeUrl ? (
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.social}
                        aria-label="YouTube"
                      >
                        <Play size={16} />
                      </a>
                    ) : null}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className={`p-display ${styles.bookTitle}`}>{bookTitle}</div>
          {workshops.length === 0 ? (
            <p className={styles.bio}>No workshops scheduled yet.</p>
          ) : (
            <div className={styles.bookGrid}>
              {workshops.map((w) => (
                <div key={w.id} className={styles.bookCard}>
                  <div className={`p-display ${styles.bookCardTitle}`}>{w.title}</div>
                  <div className={styles.bookWhen}>{whenLabel(w)}</div>
                  <div className={styles.bookFoot}>
                    <span className={`p-display gradient-text ${styles.price}`}>
                      ₹{(Number(w.price) || 0).toLocaleString("en-IN")}
                    </span>
                    <Link
                      href={`/member/book?workshopId=${w.id}`}
                      className={styles.bookChip}
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
