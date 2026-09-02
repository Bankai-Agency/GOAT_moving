"use server";

import { revalidatePath } from "next/cache";
import { envAuthMode, requireUser } from "@/lib/auth";
import { changeOwnPassword, updateProfile } from "@/lib/admin/users";

export type FormState = { error?: string; ok?: string };

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    if (envAuthMode) return { error: "Профиль доступен только с подключённой базой пользователей." };
    const me = await requireUser();
    const name = String(formData.get("name") ?? "").trim() || null;
    const email = String(formData.get("email") ?? "").trim() || null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Похоже на некорректный email" };
    }
    await updateProfile(me.id, { name, email });
    revalidatePath("/admin/settings");
    return { ok: "Сохранено" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Не удалось сохранить" };
  }
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    if (envAuthMode) return { error: "Пароль задаётся переменной ADMIN_PASSWORD." };
    const me = await requireUser();
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    const repeat = String(formData.get("repeat") ?? "");
    if (!current || !next || !repeat) return { error: "Заполните все поля" };
    if (next !== repeat) return { error: "Пароли не совпадают" };
    await changeOwnPassword(me.id, current, next);
    return { ok: "Пароль обновлён" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Не удалось сменить пароль" };
  }
}
