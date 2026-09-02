import { randomBytes } from "node:crypto";
import { and, desc, eq, isNull, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, invites } from "@/lib/db/schema";

/**
 * DB-level helpers for the admin's "Пользователи" page and the invite flow.
 * Kept separate from auth.ts so auth.ts stays focused on session wiring.
 *
 * All helpers return plain objects (no drizzle QueryBuilder leak) so Server
 * Components can pass them into Client Components freely.
 */

const MAX_USERS = 5;

// ============================================================
// Users
// ============================================================

export type UserRow = {
  id: string;
  username: string;
  email: string | null;
  name: string | null;
  role: string;
  mustChangePassword: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
};

export async function listUsers(): Promise<UserRow[]> {
  const rows = await db.query.users.findMany({
    orderBy: (u) => [desc(u.createdAt)],
  });
  return rows.map(rowToPublic);
}

export async function getUser(id: string): Promise<UserRow | null> {
  const row = await db.query.users.findFirst({ where: eq(users.id, id) });
  return row ? rowToPublic(row) : null;
}

export async function countUsers(): Promise<number> {
  const all = await db.query.users.findMany({ columns: { id: true } });
  return all.length;
}

export async function deleteUser(id: string, callerId: string): Promise<void> {
  if (id === callerId) throw new Error("Нельзя удалить самого себя");
  const target = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!target) throw new Error("Пользователь не найден");
  if (target.role === "owner") throw new Error("Нельзя удалить владельца");
  await db.delete(users).where(eq(users.id, id));
}

export async function resetUserPassword(id: string, newPassword: string): Promise<void> {
  if (newPassword.length < 6) throw new Error("Минимум 6 символов");
  const hash = await bcrypt.hash(newPassword, 12);
  await db
    .update(users)
    .set({ passwordHash: hash, mustChangePassword: true })
    .where(eq(users.id, id));
}

export async function updateProfile(
  id: string,
  patch: { name?: string | null; email?: string | null },
): Promise<void> {
  await db
    .update(users)
    .set({
      name: patch.name ?? null,
      email: patch.email ?? null,
    })
    .where(eq(users.id, id));
}

export async function changeOwnPassword(id: string, current: string, next: string): Promise<void> {
  if (next.length < 6) throw new Error("Минимум 6 символов");
  if (next === current) throw new Error("Новый пароль должен отличаться от текущего");
  const row = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!row) throw new Error("Пользователь не найден");
  const ok = await bcrypt.compare(current, row.passwordHash);
  if (!ok) throw new Error("Текущий пароль неверный");
  const hash = await bcrypt.hash(next, 12);
  await db
    .update(users)
    .set({ passwordHash: hash, mustChangePassword: false })
    .where(eq(users.id, id));
}

// ============================================================
// Invites
// ============================================================

export type InviteRow = {
  id: string;
  token: string;
  label: string | null;
  createdAt: Date;
  expiresAt: Date;
  usedAt: Date | null;
};

const INVITE_TTL_DAYS = 7;

export async function listActiveInvites(): Promise<InviteRow[]> {
  const rows = await db.query.invites.findMany({
    where: and(isNull(invites.usedAt), gt(invites.expiresAt, new Date())),
    orderBy: (i) => [desc(i.createdAt)],
  });
  return rows.map((r) => ({
    id: r.id,
    token: r.token,
    label: r.label,
    createdAt: r.createdAt,
    expiresAt: r.expiresAt,
    usedAt: r.usedAt,
  }));
}

/**
 * Create an invite row and return the full shareable URL. `origin` comes
 * from the request so dev and prod both produce correct links.
 */
export async function issueInvite({
  label,
  createdById,
  origin,
}: {
  label: string | null;
  createdById: string;
  origin: string;
}): Promise<{ token: string; url: string }> {
  const userCount = await countUsers();
  const active = await listActiveInvites();
  if (userCount + active.length >= MAX_USERS) {
    throw new Error(`Достигнут лимит редакторов (${MAX_USERS}). Удалите кого-то или отзовите приглашение.`);
  }

  const token = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(invites).values({ token, label, createdById, expiresAt });

  const url = `${origin.replace(/\/$/, "")}/admin/register?token=${token}`;
  return { token, url };
}

export async function revokeInvite(id: string): Promise<void> {
  await db.delete(invites).where(eq(invites.id, id));
}

/**
 * Consume an invite by registering a new user. Checks token validity, the
 * user limit and username uniqueness, then inserts the user and marks the
 * invite used.
 */
export async function consumeInvite({
  token,
  username,
  password,
}: {
  token: string;
  username: string;
  password: string;
}): Promise<{ userId: string }> {
  if (!username || username.length < 3) throw new Error("Логин минимум 3 символа");
  if (!/^[a-z0-9_.-]+$/i.test(username)) {
    throw new Error("Логин: только латинские буквы, цифры, _ . -");
  }
  if (!password || password.length < 6) throw new Error("Пароль минимум 6 символов");

  const invite = await db.query.invites.findFirst({ where: eq(invites.token, token) });
  if (!invite) throw new Error("Приглашение не найдено");
  if (invite.usedAt) throw new Error("Приглашение уже использовано");
  if (invite.expiresAt < new Date()) throw new Error("Приглашение просрочено");

  const userCount = await countUsers();
  if (userCount >= MAX_USERS) throw new Error(`Достигнут лимит редакторов (${MAX_USERS}).`);

  const uname = username.toLowerCase();
  const dupe = await db.query.users.findFirst({ where: eq(users.username, uname) });
  if (dupe) throw new Error("Такой логин уже занят");

  const hash = await bcrypt.hash(password, 12);
  const [inserted] = await db
    .insert(users)
    .values({
      username: uname,
      passwordHash: hash,
      role: "editor",
      mustChangePassword: false,
    })
    .returning({ id: users.id });

  await db
    .update(invites)
    .set({ usedAt: new Date(), usedByUserId: inserted.id })
    .where(eq(invites.id, invite.id));
  return { userId: inserted.id };
}

/** Peek at an invite without consuming it — used by the register page. */
export async function inspectInvite(token: string): Promise<{
  valid: boolean;
  reason?: string;
  label?: string | null;
  expiresAt?: Date;
}> {
  const invite = await db.query.invites.findFirst({ where: eq(invites.token, token) });
  if (!invite) return { valid: false, reason: "not-found" };
  if (invite.usedAt) return { valid: false, reason: "used" };
  if (invite.expiresAt < new Date()) return { valid: false, reason: "expired" };
  return { valid: true, label: invite.label, expiresAt: invite.expiresAt };
}

// ============================================================
// Internal
// ============================================================

function rowToPublic(row: typeof users.$inferSelect): UserRow {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    name: row.name,
    role: row.role,
    mustChangePassword: row.mustChangePassword,
    createdAt: row.createdAt,
    lastLoginAt: row.lastLoginAt,
  };
}

export const LIMITS = { MAX_USERS };
