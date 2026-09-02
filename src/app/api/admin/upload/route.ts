import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { saveUpload } from "@/lib/admin/image-store";

/**
 * POST /api/admin/upload — multipart/form-data with a single `file` field.
 * Saves the file under public/images/uploads/ (git commit in prod) and
 * returns { url, filename, bytes, kind }.
 *
 * Auth: requires a valid admin session. Unauthenticated callers get 401.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "expected multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing 'file' field" }, { status: 400 });
  }

  try {
    const result = await saveUpload(file, user.username);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
