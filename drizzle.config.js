// drizzle-kit config. Migrations run over the SESSION pooler (DIRECT_URL,
// port 5432) which is more reliable for DDL than the transaction pooler the
// app uses at runtime. Reads from the environment, falling back to .env.local
// / .env so `npx drizzle-kit push` works without exporting vars by hand.
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

function fromEnvFiles(key) {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(new RegExp(`^\\s*${key}\\s*=\\s*(.*)\\s*$`));
      if (m) return m[1].replace(/^["']|["']$/g, "");
    }
  }
  return undefined;
}

const url =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  fromEnvFiles("DIRECT_URL") ||
  fromEnvFiles("DATABASE_URL");

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.js",
  out: "./drizzle",
  dbCredentials: { url, ssl: "require" },
});
