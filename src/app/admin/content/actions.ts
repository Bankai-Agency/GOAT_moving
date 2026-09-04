"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { findDocument, type DocumentDef } from "@/lib/admin/documents";
import { normalizeObject, type ValidationError } from "@/lib/admin/schema";
import { publishPendingCommit, readDocument, writeDocument } from "@/lib/admin/content-store";
import { isGitHubBackend } from "@/lib/admin/github";
import { REDIRECTS_DOC_ID, normalizeRedirectTarget, removeRedirectFor, upsertRedirect } from "@/lib/admin/redirects";
import { ICON_NAMES } from "@/lib/content/icons";

/* ───────────── types shared with the editor ───────────── */

export type SaveInput = {
  docId: string;
  /** Hash of the file the form was rendered from — rejects stale saves. */
  baseHash: string;
  value: unknown;
  deferBuild: boolean;
  /** Collections only. */
  itemMode?: "edit" | "new";
  /** Collections, itemMode "edit": key of the item as it was when loaded. */
  originalKey?: string;
};

export type SaveResult =
  | { ok: true; hash: string; deferred: boolean; message: string }
  | { ok: false; error: string; errors?: ValidationError[] };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_ICONS = new Set<string>(ICON_NAMES);

function itemUrl(def: DocumentDef, key: string): string | null {
  return def.itemUrl ? def.itemUrl.replace("{" + (def.itemKey ?? "slug") + "}", key) : null;
}

function revalidate(paths: (string | null)[]) {
  for (const p of paths) {
    if (!p) continue;
    try {
      revalidatePath(p);
    } catch {
      /* ignore — static pages are rebuilt by the deploy anyway */
    }
  }
}

/** Save a single document, or one item of a collection. */
export async function saveDocumentAction(input: SaveInput): Promise<SaveResult> {
  let actor: string;
  try {
    actor = (await requireUser()).username;
  } catch {
    return { ok: false, error: "Сессия истекла - войдите заново." };
  }

  const def = findDocument(input.docId);
  if (!def) return { ok: false, error: "Документ не найден." };

  let current;
  try {
    current = await readDocument(def);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Не удалось прочитать документ." };
  }
  if (!current) return { ok: false, error: `Файл ${def.file} не найден.` };
  if (current.hash !== input.baseHash) {
    return {
      ok: false,
      error: "Документ изменился с момента открытия (кто-то сохранил его раньше). Обновите страницу и повторите правки.",
    };
  }

  const errors: ValidationError[] = [];
  const normalized = normalizeObject(def.schema, input.value, { validIcons: VALID_ICONS, errors });
  if (def.id === REDIRECTS_DOC_ID) {
    // Hand-written redirects get the same checks as the ones the delete dialog writes.
    for (const k of ["from", "to"] as const) {
      const r = normalizeRedirectTarget(String(normalized[k] ?? ""), null);
      if (!r.ok) errors.push({ path: k, message: r.error });
      else if (!r.value) errors.push({ path: k, message: "Обязательное поле" });
      else normalized[k] = r.value;
    }
    if (normalized.from && normalized.from === normalized.to) {
      errors.push({ path: "to", message: "Адреса совпадают" });
    }
  }
  if (errors.length) return { ok: false, error: "Проверьте поля формы.", errors };

  const deferBuild = Boolean(input.deferBuild) && isGitHubBackend();
  const revalidatePaths: (string | null)[] = [...def.urls];

  let nextData: unknown;
  let commitMessage: string;
  let redirectTo: string | undefined;

  if (def.kind === "single") {
    nextData = normalized;
    commitMessage = `content(${def.id}): update`;
  } else {
    const keyField = def.itemKey ?? "slug";
    const key = String(normalized[keyField] ?? "").trim();
    if (!SLUG_RE.test(key)) {
      return {
        ok: false,
        error: "Проверьте поля формы.",
        errors: [{ path: keyField, message: "Slug: только строчные латинские буквы, цифры и дефис (например portland-movers)" }],
      };
    }
    const items = Array.isArray((current.data as { items?: unknown[] }).items)
      ? ([...(current.data as { items: unknown[] }).items] as Record<string, unknown>[])
      : [];
    const idx = items.findIndex((it) => it[keyField] === key);

    if (input.itemMode === "new") {
      if (idx !== -1) {
        return { ok: false, error: "Проверьте поля формы.", errors: [{ path: keyField, message: `«${key}» уже существует` }] };
      }
      items.push(normalized);
      commitMessage = `content(${def.id}): add ${key}`;
      redirectTo = `/admin/content/${def.id}/${key}`;
    } else {
      const original = input.originalKey ?? key;
      const origIdx = items.findIndex((it) => it[keyField] === original);
      if (origIdx === -1) return { ok: false, error: `Элемент «${original}» не найден - возможно, его удалили.` };
      if (key !== original && idx !== -1) {
        return { ok: false, error: "Проверьте поля формы.", errors: [{ path: keyField, message: `«${key}» уже существует` }] };
      }
      items[origIdx] = normalized;
      commitMessage = `content(${def.id}): update ${key}`;
      if (key !== original) {
        redirectTo = `/admin/content/${def.id}/${key}`;
        revalidatePaths.push(itemUrl(def, original));
      }
    }
    revalidatePaths.push(itemUrl(def, key));
    nextData = { ...(current.data as object), items };
  }

  let written;
  try {
    // A page that appears at an address which still redirects elsewhere would
    // stay hidden behind the redirect: drop it before the page lands.
    if (def.kind === "collection" && def.itemUrl) {
      const key = String(normalized[def.itemKey ?? "slug"] ?? "");
      const url = itemUrl(def, key);
      if (url && (input.itemMode === "new" || key !== (input.originalKey ?? key))) {
        await removeRedirectFor(url, actor);
      }
    }
    written = await writeDocument(def, nextData, commitMessage, actor, deferBuild);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Не удалось сохранить документ." };
  }

  revalidate(revalidatePaths);
  revalidate([`/admin/content/${def.id}`]);

  // New / renamed collection items live at a different admin URL: navigate
  // server-side so the client never re-renders the old URL (which would 404).
  if (redirectTo) redirect(`${redirectTo}?saved=${deferBuild ? "deferred" : "1"}`);

  const message = !isGitHubBackend()
    ? "Сохранено. Изменения уже применены на dev-сервере."
    : deferBuild
      ? "Сохранено без публикации. Когда закончите все правки - нажмите «Опубликовать накопленное» в списке документов."
      : "Сохранено. Сайт пересоберётся и обновится примерно через 2-3 минуты.";

  return { ok: true, hash: written.hash, deferred: deferBuild, message };
}

export type DeleteInput = {
  docId: string;
  baseHash: string;
  key: string;
  deferBuild: boolean;
  /** Pages only: where the old address should 301 to. Empty = plain 404. */
  redirectTo?: string;
};

/**
 * Remove one item from a collection document. For a page, optionally leave a
 * 301 behind: the redirect is committed first with the skip marker, so the
 * page change that follows triggers the one build that ships both.
 */
export async function deleteItemAction(input: DeleteInput): Promise<SaveResult> {
  let actor: string;
  try {
    actor = (await requireUser()).username;
  } catch {
    return { ok: false, error: "Сессия истекла - войдите заново." };
  }
  const def = findDocument(input.docId);
  if (!def || def.kind !== "collection") return { ok: false, error: "Документ не найден." };

  const current = await readDocument(def);
  if (!current) return { ok: false, error: `Файл ${def.file} не найден.` };
  if (current.hash !== input.baseHash) {
    return { ok: false, error: "Документ изменился с момента открытия. Обновите страницу и повторите." };
  }
  const keyField = def.itemKey ?? "slug";
  const all = (current.data as { items?: Record<string, unknown>[] }).items ?? [];
  if (!all.some((it) => it[keyField] === input.key)) {
    return { ok: false, error: `Элемент «${input.key}» не найден - возможно, его уже удалили.` };
  }
  const items = all.filter((it) => it[keyField] !== input.key);

  const pageUrl = itemUrl(def, input.key);
  const target = normalizeRedirectTarget(input.redirectTo, pageUrl);
  if (!target.ok) return { ok: false, error: target.error };
  if (target.value && !pageUrl) {
    return { ok: false, error: "У этого элемента нет адреса на сайте, редирект не нужен." };
  }

  const deferBuild = Boolean(input.deferBuild) && isGitHubBackend();
  try {
    if (pageUrl && target.value) await upsertRedirect(pageUrl, target.value, actor);
    await writeDocument(
      def,
      { ...(current.data as object), items },
      `content(${def.id}): remove ${input.key}${target.value ? ` (301 → ${target.value})` : ""}`,
      actor,
      deferBuild,
    );
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Не удалось удалить." };
  }
  revalidate([...def.urls, pageUrl, target.value, `/admin/content/${def.id}`]);
  // The deleted item's page no longer exists — leave it server-side.
  const q = new URLSearchParams({ deleted: input.key });
  if (target.value) q.set("redirect", target.value);
  if (deferBuild) q.set("deferred", "1");
  redirect(`/admin/content/${def.id}?${q.toString()}`);
}

export type PublishState = { error?: string; ok?: boolean };

/** "Опубликовать накопленное": one empty commit → one Vercel build. */
export async function publishPending(_prev: PublishState, _formData: FormData): Promise<PublishState> {
  let actor: string;
  try {
    actor = (await requireUser()).username;
  } catch {
    return { error: "Сессия истекла - войдите заново." };
  }
  try {
    await publishPendingCommit(actor);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Не удалось запустить публикацию." };
  }
  return { ok: true };
}
