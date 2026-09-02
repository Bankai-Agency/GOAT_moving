"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { deleteUser as deleteUserDb, issueInvite, resetUserPassword, revokeInvite } from "@/lib/admin/users";

type InviteState = { error?: string; url?: string };
type MessageState = { error?: string; ok?: string };

/** Public origin for the invite link — from request headers so dev and prod both work. */
async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function createInvite(_prev: InviteState, formData: FormData): Promise<InviteState> {
  try {
    const me = await requireUser();
    const label = String(formData.get("label") ?? "").trim() || null;
    const origin = await siteOrigin();
    const { url } = await issueInvite({ label, createdById: me.id, origin });
    revalidatePath("/admin/users");
    return { url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown error" };
  }
}

export async function revokeInviteAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (id) await revokeInvite(id);
  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const me = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteUserDb(id, me.id);
  revalidatePath("/admin/users");
}

export async function resetPasswordAction(_prev: MessageState, formData: FormData): Promise<MessageState> {
  try {
    await requireUser();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Нет id" };
    // One-shot temporary password; the user is forced to rotate it on next login.
    const temp = randomBytes(6).toString("base64url");
    await resetUserPassword(id, temp);
    revalidatePath("/admin/users");
    return { ok: `Временный пароль: ${temp}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown error" };
  }
}
