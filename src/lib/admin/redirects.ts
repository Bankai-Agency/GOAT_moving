import { findDocument } from "./documents";
import { readDocument, writeDocument } from "./content-store";

/**
 * 301 redirects kept in `src/content/redirects.json` and served by
 * `next.config.ts`. A page deleted from the admin can leave one behind so
 * its old address hands its link weight to another page instead of a 404.
 *
 * Pure content: the same save path (commit + rebuild) as every other document.
 */

export const REDIRECTS_DOC_ID = "redirects";

export type RedirectItem = { slug: string; from: string; to: string };

const PATH_RE = /^\/[a-z0-9\-._~/]*$/i;

/** `/lp/movers-portland` → `lp-movers-portland`: the item key inside the collection. */
export function redirectSlug(from: string): string {
  return from
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\//g, "-")
    .toLowerCase() || "root";
}

/**
 * A redirect target typed by hand: a site-relative path, normalized.
 * Returns `null` for "no redirect" (empty input) and an error message for
 * anything that would not work as a Next redirect destination.
 */
export function normalizeRedirectTarget(
  raw: string | undefined,
  fromUrl: string | null,
): { ok: true; value: string | null } | { ok: false; error: string } {
  const s = (raw ?? "").trim();
  if (!s) return { ok: true, value: null };
  if (/\s/.test(s) || !PATH_RE.test(s) || s.startsWith("//")) {
    return { ok: false, error: "Адрес для редиректа: только путь на этом сайте, начиная с «/» (например /portland-movers)." };
  }
  const value = s.length > 1 ? s.replace(/\/+$/, "") : s;
  if (fromUrl && value === fromUrl) {
    return { ok: false, error: "Редирект не может вести на удаляемую страницу." };
  }
  return { ok: true, value };
}

async function load() {
  const def = findDocument(REDIRECTS_DOC_ID);
  if (!def) throw new Error("Документ редиректов не зарегистрирован.");
  const doc = await readDocument(def);
  const items = ((doc?.data as { items?: RedirectItem[] } | null)?.items ?? []).filter(
    (r): r is RedirectItem => !!r && typeof r.from === "string" && typeof r.to === "string",
  );
  return { def, items };
}

/**
 * Add or replace the redirect for `from`. Committed with the skip marker:
 * the page change that follows triggers the one build that ships both.
 */
export async function upsertRedirect(from: string, to: string, actor: string): Promise<void> {
  const { def, items } = await load();
  const next = items.filter((r) => r.from !== from);
  next.push({ slug: redirectSlug(from), from, to });
  await writeDocument(def, { items: next }, `content(${def.id}): ${from} → ${to}`, actor, true);
}

/**
 * Drop the redirect for `from`, if any - a page created at an address that
 * used to redirect would otherwise stay hidden behind the redirect.
 */
export async function removeRedirectFor(from: string, actor: string): Promise<boolean> {
  const { def, items } = await load();
  const next = items.filter((r) => r.from !== from);
  if (next.length === items.length) return false;
  await writeDocument(def, { items: next }, `content(${def.id}): drop ${from}`, actor, true);
  return true;
}
