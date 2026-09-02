import { signOut } from "@/lib/auth";

/**
 * GET /admin/logout — signs the user out and redirects to /admin/login.
 * A plain GET so the sidebar "Выйти" link works without a form.
 */
export async function GET() {
  await signOut({ redirectTo: "/admin/login" });
  // `signOut` throws a redirect that Next handles; this line is unreachable.
  return new Response(null, { status: 302 });
}
