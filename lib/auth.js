// Node-runtime auth helpers: bridges the edge-safe session JWT (lib/session)
// with the Node data store (lib/db). Server components and route handlers
// call getCurrentUser(); login/logout routes call the cookie helpers.

import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_S, signSession, verifySession } from "./session";
import { findUserById, publicUser } from "./db";

// Returns the identity carried in the signed session JWT — no database hit.
// The token is cryptographically verified (HS256), so the id/role/name/email/
// instructorId it carries are trustworthy without re-reading the users row.
// Use this for access checks and queries that only need identity; use
// getCurrentUser() only when you need live DB columns (points, avatar, etc.).
export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  if (!payload?.sub) return null;
  return {
    id: payload.sub,
    role: payload.role,
    name: payload.name,
    email: payload.email,
    instructorId: payload.instructorId || null,
  };
}

// Returns the public user record (live from the DB) for the active session,
// or null. Only call this when a fresh DB column is actually needed.
export async function getCurrentUser() {
  const session = await getSessionUser();
  if (!session) return null;
  const user = await findUserById(session.id);
  return publicUser(user);
}

// Builds the Set-Cookie options for a signed session token.
export async function sessionCookie(user) {
  const token = await signSession({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    instructorId: user.instructorId || null,
  });
  return {
    name: SESSION_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_S,
    },
  };
}

export function clearedCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    options: { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 },
  };
}

// Convenience for route handlers that must 401 unless a role matches.
// Uses the signed JWT identity (no DB round-trip) — handlers that need live
// DB columns should fetch them explicitly with findUserById/getCurrentUser.
export async function requireUser(roles = null) {
  const user = await getSessionUser();
  if (!user) return { user: null, error: "Not signed in." };
  if (roles && !roles.includes(user.role)) {
    return { user, error: "You don't have access to this." };
  }
  return { user, error: null };
}
