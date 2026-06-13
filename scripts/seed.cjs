// Seeds the Supabase Postgres database with demo data.
// Run AFTER the schema exists:  npx drizzle-kit push  then  node scripts/seed.cjs
// Reads DATABASE_URL from .env.local. Idempotent: clears the 5 tables and
// re-inserts a deterministic demo set. Demo password for all accounts: thayya123
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const postgres = require("postgres");

// --- load DATABASE_URL from .env.local ---
let url = process.env.DATABASE_URL;
if (!url) {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
      if (m) url = m[1].replace(/^["']|["']$/g, "");
    }
  }
}
if (!url) {
  console.error("DATABASE_URL not set (add the Supabase pooler string to .env.local).");
  process.exit(1);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
const id = (p) => `${p}_${crypto.randomBytes(8).toString("hex")}`;
const now = Date.now();

(async () => {
  const sql = postgres(url, { ssl: "require", prepare: false });
  try {
    const pw = hashPassword("thayya123");

    const users = [
      { id: id("usr"), email: "member@thayya.test", password_hash: pw, role: "member", name: "Meera Pillai", instructor_id: null, points: 1240, created_at: now },
      { id: id("usr"), email: "anaya@thayya.test", password_hash: pw, role: "instructor", name: "Anaya Krishnan", instructor_id: "anaya", points: 0, created_at: now },
      { id: id("usr"), email: "admin@thayya.test", password_hash: pw, role: "admin", name: "Thayya Admin", instructor_id: null, points: 0, created_at: now },
    ];
    const memberId = users[0].id;

    const workshops = [
      { id: "aaja-nachle-intensive", title: "Aaja Nachle Intensive", instructor: "Anaya Krishnan", instructor_id: "anaya", date: "Wed 29 Apr", time: "7:00 PM", venue: "Indiranagar Studio", price: 600, spots_left: 3 },
      { id: "bollywood-cardio-beginner", title: "Bollywood Cardio · Beginner", instructor: "Anaya Krishnan", instructor_id: "anaya", date: "Mon 27 Apr", time: "6:30 PM", venue: "Whitefield Studio", price: 450, spots_left: 7 },
      { id: "saturday-morning-flow", title: "Saturday Morning Flow", instructor: "Anaya Krishnan", instructor_id: "anaya", date: "Sat 02 May", time: "8:00 AM", venue: "Cubbon Park · Outdoor", price: 350, spots_left: 22 },
      { id: "bombay-bounce", title: "Bombay Bounce", instructor: "Rohan Mehta", instructor_id: "rohan", date: "Tue 28 Apr", time: "7:00 PM", venue: "Bandra Studio", price: 500, spots_left: 3 },
      { id: "mohiniyattam-slow-flow", title: "Mohiniyattam Slow Flow", instructor: "Priya Nair", instructor_id: "priya", date: "Wed 29 Apr", time: "8:00 AM", venue: "Mylapore Studio", price: 400, spots_left: 12 },
    ];

    const bookings = [
      { id: id("bkg"), user_id: memberId, workshop_id: "aaja-nachle-intensive", title: "Aaja Nachle Intensive", instructor: "Anaya Krishnan", date: "Wed 29 Apr", time: "7:00 PM", price: 600, status: "upcoming", created_at: now },
      { id: id("bkg"), user_id: memberId, workshop_id: "saturday-morning-flow", title: "Saturday Morning Flow", instructor: "Anaya Krishnan", date: "Sat 02 May", time: "8:00 AM", price: 350, status: "upcoming", created_at: now },
    ];

    const tracks = [
      { id: id("trk"), instructor_id: "anaya", title: "Saanson Ki Mala (remix)", artist: "Thayya Sessions", duration: "3:42", mood: "Warm-up", bpm: 96, source: "Thayya Library", created_at: now },
      { id: id("trk"), instructor_id: "anaya", title: "Marigold Drums", artist: "Thayya Sessions", duration: "4:01", mood: "Peak", bpm: 128, source: "Thayya Library", created_at: now },
      { id: id("trk"), instructor_id: "anaya", title: "Pichkari Bass", artist: "Thayya Sessions", duration: "3:28", mood: "Peak", bpm: 130, source: "Thayya Library", created_at: now },
      { id: id("trk"), instructor_id: "anaya", title: "Kajra Re Reprise", artist: "Thayya Sessions", duration: "4:15", mood: "Groove", bpm: 112, source: "Thayya Library", created_at: now },
      { id: id("trk"), instructor_id: "anaya", title: "Tabla Sunrise", artist: "Thayya Sessions", duration: "3:55", mood: "Cool-down", bpm: 84, source: "Thayya Library", created_at: now },
      { id: id("trk"), instructor_id: "anaya", title: "Velvet Lehenga Theme", artist: "Thayya Sessions", duration: "4:00", mood: "Groove", bpm: 108, source: "Thayya Library", created_at: now },
    ];

    const playlist = {
      id: id("pl"),
      instructor_id: "anaya",
      name: "Friday Night Floor",
      track_ids: tracks.slice(0, 4).map((t) => t.id),
      created_at: now,
    };

    await sql.begin(async (tx) => {
      await tx`delete from playlists`;
      await tx`delete from tracks`;
      await tx`delete from bookings`;
      await tx`delete from workshops`;
      await tx`delete from users`;

      await tx`insert into users ${tx(users, "id", "email", "password_hash", "role", "name", "instructor_id", "points", "created_at")}`;
      await tx`insert into workshops ${tx(workshops, "id", "title", "instructor", "instructor_id", "date", "time", "venue", "price", "spots_left")}`;
      await tx`insert into bookings ${tx(bookings, "id", "user_id", "workshop_id", "title", "instructor", "date", "time", "price", "status", "created_at")}`;
      await tx`insert into tracks ${tx(tracks, "id", "instructor_id", "title", "artist", "duration", "mood", "bpm", "source", "created_at")}`;
      await tx`insert into playlists (id, instructor_id, name, track_ids, created_at)
               values (${playlist.id}, ${playlist.instructor_id}, ${playlist.name}, ${tx.json(playlist.track_ids)}, ${playlist.created_at})`;
    });

    console.log("Seeded: 3 users, 5 workshops, 2 bookings, 6 tracks, 1 playlist.");
    console.log("Demo logins (password thayya123): member@thayya.test, anaya@thayya.test, admin@thayya.test");
  } catch (e) {
    console.error("Seed failed:", e.message);
    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
})();
