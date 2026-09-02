import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ghListDir, isGitHubBackend } from "./github";

/**
 * Media library — every image/video the site can reference, as public URLs.
 *
 * Locally this walks `public/`; in prod (GitHub backend) it lists the same
 * folders through the GitHub API, so files uploaded since the last deploy
 * are visible immediately.
 */

export type MediaKind = "image" | "video" | "icon";

export type MediaItem = {
  /** Public URL path, e.g. "/images/home-hero.png". */
  url: string;
  name: string;
  /** Folder shown as a filter chip: "images", "images/avatars", "uploads", "lp", "videos", "icons". */
  folder: string;
  bytes: number;
  kind: MediaKind;
};

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);
const VIDEO_EXTS = new Set(["mp4", "webm"]);

/** Folders under public/ that hold site media (relative paths). */
const MEDIA_FOLDERS = ["images", "images/avatars", "images/uploads", "lp", "videos", "icons"];

function kindOf(name: string): MediaKind | null {
  const ext = (name.split(".").pop() ?? "").toLowerCase();
  if (ext === "svg") return "icon";
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VIDEO_EXTS.has(ext)) return "video";
  return null;
}

function folderLabel(rel: string): string {
  return rel === "images/uploads" ? "uploads" : rel;
}

async function listViaGitHub(): Promise<MediaItem[]> {
  const items: MediaItem[] = [];
  for (const rel of MEDIA_FOLDERS) {
    const entries = await ghListDir(`public/${rel}`);
    for (const e of entries) {
      if (e.type !== "file") continue;
      const kind = kindOf(e.name);
      if (!kind) continue;
      items.push({ url: `/${rel}/${e.name}`, name: e.name, folder: folderLabel(rel), bytes: e.size, kind });
    }
  }
  return items;
}

function listViaFs(): MediaItem[] {
  const items: MediaItem[] = [];
  // Literal "public" join — the tracer excludes public/** for the admin
  // routes (next.config.ts), so this branch only ever runs locally.
  const publicDir = join(process.cwd(), "public");
  for (const rel of MEDIA_FOLDERS) {
    let names: string[] = [];
    try {
      names = readdirSync(join(publicDir, rel));
    } catch {
      continue;
    }
    for (const name of names) {
      const kind = kindOf(name);
      if (!kind) continue;
      let bytes = 0;
      try {
        const st = statSync(join(publicDir, rel, name));
        if (!st.isFile()) continue;
        bytes = st.size;
      } catch {
        continue;
      }
      items.push({ url: `/${rel}/${name}`, name, folder: folderLabel(rel), bytes, kind });
    }
  }
  return items;
}

export async function listMedia(): Promise<MediaItem[]> {
  const items = isGitHubBackend() ? await listViaGitHub() : listViaFs();
  items.sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name));
  return items;
}
