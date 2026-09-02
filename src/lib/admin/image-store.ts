import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { SKIP_DEPLOY_MARKER, ghFileExists, ghWriteFile, isGitHubBackend } from "./github";

/**
 * Upload store — saves files picked in the admin under
 * `public/images/uploads/` so they are served as `/images/uploads/<name>`.
 *
 * Same two-backend pattern as the content store: GitHub commit in prod
 * (marked [skip deploy] — the content save that references the file
 * triggers the build), local filesystem in dev.
 *
 * File naming: `<original-name-slug>-<hash6>.<ext>` — recognizable in the
 * media library, collision-resistant, and the same file uploaded twice
 * dedupes to the same name.
 */

export const UPLOAD_DIR = "public/images/uploads";
export const UPLOAD_URL_PREFIX = "/images/uploads";

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"]);
const VIDEO_EXTS = new Set(["mp4", "webm"]);
/* Vercel serverless functions reject request bodies over ~4.5 MB. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export type UploadResult = { url: string; filename: string; bytes: number; kind: "image" | "video" };

function slugifyName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  const slug = base
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "file";
}

export async function saveUpload(file: File, actor: string): Promise<UploadResult> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)} MB). Лимит ${MAX_UPLOAD_BYTES / 1024 / 1024} MB — сожмите картинку перед загрузкой.`,
    );
  }
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const isImage = IMAGE_EXTS.has(ext);
  const isVideo = VIDEO_EXTS.has(ext);
  if (!isImage && !isVideo) {
    throw new Error(
      `Формат ${ext || "?"} не поддерживается. Разрешены: ${[...IMAGE_EXTS, ...VIDEO_EXTS].join(", ")}.`,
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 6);
  const filename = `${slugifyName(file.name)}-${hash}.${ext}`;
  const path = `${UPLOAD_DIR}/${filename}`;
  const url = `${UPLOAD_URL_PREFIX}/${filename}`;

  if (isGitHubBackend()) {
    if (!(await ghFileExists(path))) {
      await ghWriteFile(
        path,
        buf,
        `content: upload ${filename} ${SKIP_DEPLOY_MARKER}\n\nvia admin panel by ${actor}`,
      );
    }
  } else {
    // Literal path join — see the tracer note in content-store.ts.
    const absDir = join(process.cwd(), "public/images/uploads");
    if (!existsSync(absDir)) mkdirSync(absDir, { recursive: true });
    const absPath = join(absDir, filename);
    if (!existsSync(absPath)) writeFileSync(absPath, buf);
  }

  return { url, filename, bytes: file.size, kind: isVideo ? "video" : "image" };
}
