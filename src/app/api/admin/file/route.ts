import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { ghReadFile, isGitHubBackend } from "@/lib/admin/github";

/**
 * GET /api/admin/file?p=/images/uploads/x.jpg
 *
 * Preview fallback for files uploaded since the last deploy: the CDN
 * doesn't serve them until Vercel rebuilds, so the admin reads them
 * straight from the GitHub branch. Locally this route is not needed
 * (Next serves public/ directly) and returns 404.
 *
 * Auth: admin session required.
 */
export const runtime = "nodejs";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
};

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const p = url.searchParams.get("p") ?? "";
  // Only public media paths, no traversal.
  if (!/^\/(images|lp|videos|icons)\/[a-z0-9/_.-]+$/i.test(p) || p.includes("..")) {
    return NextResponse.json({ error: "bad path" }, { status: 400 });
  }
  if (!isGitHubBackend()) return NextResponse.json({ error: "not found" }, { status: 404 });

  const buf = await ghReadFile(`public${p}`);
  if (!buf) return NextResponse.json({ error: "not found" }, { status: 404 });

  const ext = (p.split(".").pop() ?? "").toLowerCase();
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
  });
}
