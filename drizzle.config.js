// drizzle-kit config. Reads DATABASE_URL from the environment; if it isn't
// already set, it loads it from .env.local so `npx drizzle-kit push` works
// without exporting the var by hand.
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
      if (m) process.env.DATABASE_URL = m[1].replace(/^["']|["']$/g, "");
    }
  }
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.js",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL, ssl: "require" },
});
