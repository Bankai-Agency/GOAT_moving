import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import {
  SKIP_DEPLOY_MARKER,
  ghEmptyCommit,
  ghListCommits,
  ghReadFile,
  ghWriteFile,
  isGitHubBackend,
} from "./github";
import type { DocumentDef } from "./documents";

/**
 * Content store — reads and writes the JSON documents under `src/content/`
 * for the admin editor.
 *
 * Two backends, picked at call time:
 *   1. GitHub API (prod) when GITHUB_TOKEN + GITHUB_REPO are set — a save is
 *      a commit to the branch; Vercel rebuilds and the edit goes live.
 *   2. Local filesystem (dev) otherwise — the file changes in the working
 *      tree and Next's dev server picks it up immediately.
 *
 * Reads also prefer GitHub in prod so the editor shows edits made since the
 * last deploy (the serverless FS only has the files from the last build).
 */

const CONTENT_DIR = "src/content";

/** Only registry-known relative file names reach the fs/API — no traversal. */
function contentRel(def: DocumentDef): string {
  const rel = def.file.replace(/^src\/content\//, "");
  if (!/^[a-z0-9][a-z0-9/_-]*\.json$/i.test(rel) || rel.includes("..")) {
    throw new Error(`Bad content file: ${def.file}`);
  }
  return rel;
}

export function docHash(raw: string): string {
  return createHash("sha1").update(raw, "utf-8").digest("hex").slice(0, 16);
}

export type ReadResult = { raw: string; data: unknown; hash: string };

export async function readDocument(def: DocumentDef): Promise<ReadResult | null> {
  const rel = contentRel(def);
  let raw: string | null = null;

  if (isGitHubBackend()) {
    const buf = await ghReadFile(`${CONTENT_DIR}/${rel}`);
    raw = buf ? buf.toString("utf-8") : null;
  } else {
    // Literal directory join keeps Vercel's file tracer scoped to
    // src/content instead of bundling the whole cwd.
    const abs = join(process.cwd(), "src/content", rel);
    if (existsSync(abs)) raw = readFileSync(abs, "utf-8");
  }
  if (raw === null) return null;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`${def.file}: файл повреждён (невалидный JSON).`);
  }
  return { raw, data, hash: docHash(raw) };
}

export function serializeDocument(data: unknown): string {
  return JSON.stringify(data, null, 2) + "\n";
}

export async function writeDocument(
  def: DocumentDef,
  data: unknown,
  commitMessage: string,
  actor: string,
  deferBuild = false,
): Promise<{ raw: string; hash: string }> {
  const rel = contentRel(def);
  const raw = serializeDocument(data);
  const marker = deferBuild ? ` ${SKIP_DEPLOY_MARKER}` : "";
  const msg = `${commitMessage}${marker}\n\nvia admin panel by ${actor}`;

  if (isGitHubBackend()) {
    await ghWriteFile(`${CONTENT_DIR}/${rel}`, raw, msg);
  } else {
    const abs = join(process.cwd(), "src/content", rel);
    writeFileSync(abs, raw, "utf-8");
  }
  return { raw, hash: docHash(raw) };
}

/**
 * "Опубликовать накопленное": an empty commit without the skip marker so
 * Vercel builds everything saved with "без публикации".
 */
export async function publishPendingCommit(actor: string): Promise<void> {
  if (!isGitHubBackend()) {
    throw new Error("Публикация нужна только на проде: в dev правки применяются сразу.");
  }
  await ghEmptyCommit(`content: publish pending admin edits\n\nvia admin panel by ${actor}`);
}

export type ContentCommit = { sha: string; date: string; author: string; message: string };

/** Recent commits touching the content folder (git log locally, GitHub API in prod). */
export async function recentContentCommits(limit = 8): Promise<ContentCommit[]> {
  if (isGitHubBackend()) {
    try {
      return await ghListCommits(CONTENT_DIR, limit);
    } catch {
      return [];
    }
  }
  try {
    const out = execSync(
      `git log -n ${limit} --pretty=format:%h%x09%cI%x09%an%x09%s -- src/content public/images/uploads`,
      { encoding: "utf-8", cwd: process.cwd(), timeout: 3000 },
    );
    return out
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [sha, date, author, ...rest] = line.split("\t");
        return { sha, date, author, message: rest.join("\t") };
      });
  } catch {
    return [];
  }
}
