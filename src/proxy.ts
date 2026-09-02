/**
 * Admin protection proxy (Next 16 "proxy" convention, formerly middleware).
 * Uses the Auth.js v5 `auth` helper, which runs the `authorized` callback
 * defined in src/lib/auth.ts for every matched request.
 *
 * Only /admin/* is matched — the public site is untouched. The admin API
 * routes under /api/admin/* check the session themselves.
 */
export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
