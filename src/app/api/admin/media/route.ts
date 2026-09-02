import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { listMedia } from "@/lib/admin/media";

/** GET /api/admin/media — the media library as JSON (for the picker modal). */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const items = await listMedia();
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
