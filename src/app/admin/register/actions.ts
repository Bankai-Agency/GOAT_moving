"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { envAuthMode, signIn } from "@/lib/auth";
import { consumeInvite } from "@/lib/admin/users";

type State = { error?: string };

/**
 * Consumes the invite token, creates the user, signs them in and lands on
 * the dashboard.
 */
export async function registerFromInvite(_prev: State, formData: FormData): Promise<State> {
  if (envAuthMode) return { error: "Регистрация недоступна без базы пользователей." };

  const token = String(formData.get("token") ?? "");
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const repeat = String(formData.get("repeat") ?? "");

  if (!token) return { error: "Приглашение не указано" };
  if (password !== repeat) return { error: "Пароли не совпадают" };

  try {
    await consumeInvite({ token, username, password });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Не удалось создать пользователя" };
  }

  try {
    await signIn("credentials", { username: username.toLowerCase(), password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Пользователь создан, но вход не удался. Попробуйте войти вручную." };
    throw err;
  }

  redirect("/admin/dashboard");
}
