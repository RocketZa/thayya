// Drizzle client over the Supabase Postgres connection pooler.
//
// The DIRECT db.<ref>.supabase.co host is IPv6-only; on IPv4-only networks
// you MUST use the pooler host (aws-0-<region>.pooler.supabase.com). Set
// DATABASE_URL to the pooler connection string. prepare:false is required
// for the transaction-mode pooler (port 6543); it is harmless on session
// mode (5432). TLS is verified (ssl:"require") — never disabled.

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

// Cache the connection across hot reloads / serverless invocations.
function makeClient() {
  if (!url) return null;
  return postgres(url, {
    ssl: "require",
    prepare: false,
    max: 5,
    idle_timeout: 20,
    connect_timeout: 15,
  });
}

const g = globalThis;
if (!g.__thayyaPg) g.__thayyaPg = makeClient();
const client = g.__thayyaPg;

export const db = client ? drizzle(client, { schema }) : null;

// Repo functions call this so a missing DATABASE_URL fails with a clear
// message instead of a null-deref.
export function getDb() {
  if (!db) {
    throw new Error(
      "DATABASE_URL is not set — add the Supabase pooler connection string to .env.local"
    );
  }
  return db;
}
