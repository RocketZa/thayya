// Drizzle schema for the Thayya data model (Supabase Postgres).
// Mirrors the shapes the app already used; createdAt is epoch-ms (bigint)
// to match the existing sort-by-createdAt code.

import {
  pgTable,
  text,
  integer,
  bigint,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("member"), // member | instructor | admin
  name: text("name").notNull(),
  instructorId: text("instructor_id"), // null unless an instructor profile
  points: integer("points").notNull().default(0),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const workshops = pgTable("workshops", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  instructor: text("instructor").notNull(),
  instructorId: text("instructor_id"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  venue: text("venue"),
  price: integer("price").notNull().default(0),
  spotsLeft: integer("spots_left").notNull().default(0),
});

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  workshopId: text("workshop_id").notNull(),
  title: text("title").notNull(),
  instructor: text("instructor").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  price: integer("price").notNull().default(0),
  status: text("status").notNull().default("upcoming"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey(),
  instructorId: text("instructor_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist"),
  duration: text("duration"),
  mood: text("mood"),
  bpm: integer("bpm"),
  source: text("source"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const playlists = pgTable("playlists", {
  id: text("id").primaryKey(),
  instructorId: text("instructor_id").notNull(),
  name: text("name").notNull(),
  trackIds: jsonb("track_ids").notNull().default([]),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});
