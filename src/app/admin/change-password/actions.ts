"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth, envAuthMode, signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

type State = { error?: string };

/**
 * Forced/first-login password change. Verifies the current password, writes
 * the new hash, clears `mustChangePassword` and re-issues the session so the
 * proxy stops redirecting here.
 */
export async function changePassword(_prev: State, formData: FormData): Promise<State> {
  if (envAuthMode) redirect("/admin/dashboard");

  const session = await auth();
  if (!session?.user) return { error: "Нет сессии" };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const repeat = String(formData.get("repeat") ?? "");

  if (!current || !next || !repeat) return { error: "Заполните все поля" };
  if (next !== repeat) return { error: "Пароли не совпадают" };
  if (next.length < 6) return { error: "Минимум 6 символов" };
  if (next === current) return { error: "Новый пароль должен отличаться от текущего" };

  const userId = (session.user as { id?: string }).id;
  if (!userId) return { error: "Сессия без id - войдите заново" };

  const row = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!row) return { error: "Пользователь не найден" };

  const ok = await bcrypt.compare(current, row.passwordHash);
  if (!ok) return { error: "Текущий пароль неверный" };

  const nextHash = await bcrypt.hash(next, 12);
  await db.update(users).set({ passwordHash: nextHash, mustChangePassword: false }).where(eq(users.id, userId));

  try {
    await signIn("credentials", { username: row.username, password: next, redirect: false });
  } catch {
    redirect("/admin/logout");
  }

  redirect("/admin/dashboard");
}
