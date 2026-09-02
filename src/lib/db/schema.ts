import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

/**
 * Admin users (editors + owner).
 *
 * - `username` — primary login identifier (login+password, no email flow).
 *   Unique, lowercase at insert-time.
 * - `passwordHash` — bcrypt (cost 12).
 * - `role` — 'owner' cannot be deleted; 'editor' is the default for invitees.
 * - `mustChangePassword` — set on the seed user and after an admin reset;
 *   cleared on the first password change.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email"),
  name: text("name"),
  role: text("role").notNull().default("editor"),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

/**
 * Invite tokens for onboarding additional editors.
 *
 * Flow: owner presses "Создать ссылку" → row inserted with a random token,
 * expiresAt = now + 7d. Share `/admin/register?token=...`. Invitee picks a
 * username + password → the invite is consumed and the user row created.
 */
export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  label: text("label"),
  createdById: text("created_by_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  usedByUserId: uuid("used_by_user_id"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Invite = typeof invites.$inferSelect;
