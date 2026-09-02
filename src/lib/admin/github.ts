import { Octokit } from "@octokit/rest";

/**
 * GitHub write backend for the admin panel.
 *
 * On Vercel the filesystem is read-only, so every content save is a commit
 * to the repo (GITHUB_TOKEN + GITHUB_REPO). Vercel rebuilds the site from
 * that commit and the edit goes live a couple of minutes later.
 *
 * Locally (no GITHUB_TOKEN) the stores write straight to the working tree —
 * see `isGitHubBackend()` in each store.
 */

const REPO = process.env.GITHUB_REPO ?? "";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN = process.env.GITHUB_TOKEN ?? "";

/**
 * Commit-message marker that makes scripts/vercel-ignore-build.sh skip the
 * Vercel build for that commit ("save without publishing").
 */
export const SKIP_DEPLOY_MARKER = "[skip deploy]";

export function isGitHubBackend(): boolean {
  return Boolean(TOKEN && REPO);
}

export function githubBranch(): string {
  return BRANCH;
}

export function githubRepo(): string {
  return REPO;
}

function splitRepo(): { owner: string; repo: string } {
  const [owner, repo] = REPO.split("/");
  if (!owner || !repo) throw new Error(`Invalid GITHUB_REPO=${REPO}. Expected "owner/repo".`);
  return { owner, repo };
}

let _octokit: Octokit | null = null;
function octokit(): Octokit {
  if (!_octokit) _octokit = new Octokit({ auth: TOKEN });
  return _octokit;
}

/** Read a file from the branch; null when it doesn't exist. */
export async function ghReadFile(path: string): Promise<Buffer | null> {
  const { owner, repo } = splitRepo();
  try {
    const res = await octokit().repos.getContent({ owner, repo, path, ref: BRANCH });
    const data = res.data as { content?: string; encoding?: string; sha?: string };
    if (data.content && data.encoding === "base64") {
      return Buffer.from(data.content, "base64");
    }
    return null;
  } catch (err) {
    if ((err as { status?: number }).status === 404) return null;
    throw err;
  }
}

async function ghFileSha(path: string): Promise<string | undefined> {
  const { owner, repo } = splitRepo();
  try {
    const res = await octokit().repos.getContent({ owner, repo, path, ref: BRANCH });
    return (res.data as { sha?: string }).sha;
  } catch (err) {
    if ((err as { status?: number }).status === 404) return undefined;
    throw err;
  }
}

export async function ghFileExists(path: string): Promise<boolean> {
  return (await ghFileSha(path)) !== undefined;
}

/** Create or update a file with one commit. */
export async function ghWriteFile(
  path: string,
  content: Buffer | string,
  message: string,
): Promise<void> {
  const { owner, repo } = splitRepo();
  const sha = await ghFileSha(path);
  const buf = typeof content === "string" ? Buffer.from(content, "utf-8") : content;
  await octokit().repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch: BRANCH,
    message,
    content: buf.toString("base64"),
    sha,
  });
}

export type GhEntry = { name: string; path: string; type: "file" | "dir"; size: number };

/** Directory listing; empty array when the directory doesn't exist. */
export async function ghListDir(path: string): Promise<GhEntry[]> {
  const { owner, repo } = splitRepo();
  try {
    const res = await octokit().repos.getContent({ owner, repo, path, ref: BRANCH });
    if (!Array.isArray(res.data)) return [];
    return res.data
      .filter((e) => e.type === "file" || e.type === "dir")
      .map((e) => ({ name: e.name, path: e.path, type: e.type as "file" | "dir", size: e.size ?? 0 }));
  } catch (err) {
    if ((err as { status?: number }).status === 404) return [];
    throw err;
  }
}

export type GhCommit = { sha: string; date: string; author: string; message: string };

/** Recent commits touching `path` (a file or directory). */
export async function ghListCommits(path: string, limit = 10): Promise<GhCommit[]> {
  const { owner, repo } = splitRepo();
  const res = await octokit().repos.listCommits({ owner, repo, sha: BRANCH, path, per_page: limit });
  return res.data.map((c) => ({
    sha: c.sha.slice(0, 7),
    date: c.commit.author?.date ?? c.commit.committer?.date ?? "",
    author: c.commit.author?.name ?? c.author?.login ?? "",
    message: c.commit.message.split("\n")[0],
  }));
}

/**
 * "Publish" — an empty commit (same tree, new message) on the branch. It
 * carries no skip marker, so Vercel builds it, and the build includes every
 * draft commit accumulated before it.
 */
export async function ghEmptyCommit(message: string): Promise<void> {
  const { owner, repo } = splitRepo();
  const ref = await octokit().git.getRef({ owner, repo, ref: `heads/${BRANCH}` });
  const headSha = ref.data.object.sha;
  const head = await octokit().git.getCommit({ owner, repo, commit_sha: headSha });
  const commit = await octokit().git.createCommit({
    owner,
    repo,
    message,
    tree: head.data.tree.sha,
    parents: [headSha],
  });
  await octokit().git.updateRef({ owner, repo, ref: `heads/${BRANCH}`, sha: commit.data.sha });
}
