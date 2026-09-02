import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, dbConfigured } from "./db";
import { users } from "./db/schema";

/**
 * Auth.js v5 config — credentials-only, JWT session.
 *
 * Two account backends:
 *   1. Postgres (`DATABASE_URL` set) — users/invites tables, managed on
 *      /admin/users. This is the production setup.
 *   2. Env fallback (no DATABASE_URL) — a single owner account from
 *      `ADMIN_USERNAME` + `ADMIN_PASSWORD`. Handy for local dev and for a
 *      first deploy before the database is provisioned.
 *
 * The session is a signed JWT cookie (stateless), so no session table is
 * needed. `authorized` runs from `src/proxy.ts` on every /admin/* request.
 */

const ENV_USERNAME = (process.env.ADMIN_USERNAME ?? "").trim().toLowerCase();
const ENV_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

/** True when logins are checked against ADMIN_USERNAME / ADMIN_PASSWORD. */
export const envAuthMode = !dbConfigured;

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  username: string;
  role: string;
  mustChangePassword: boolean;
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  // Auth.js needs a signing secret. A fixed dev-only fallback keeps
  // `npm run dev` working before .env.local exists; production must set
  // AUTH_SECRET (Auth.js refuses to start without it there).
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV !== "production" ? "goat-admin-dev-secret-change-me" : undefined),
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(raw) {
        const username = typeof raw?.username === "string" ? raw.username.trim().toLowerCase() : "";
        const password = typeof raw?.password === "string" ? raw.password : "";
        if (!username || !password) return null;

        if (envAuthMode) {
          if (!ENV_USERNAME || !ENV_PASSWORD) return null;
          if (username !== ENV_USERNAME || password !== ENV_PASSWORD) return null;
          return {
            id: "env-owner",
            name: ENV_USERNAME,
            username: ENV_USERNAME,
            role: "owner",
            mustChangePassword: false,
          } as unknown as { id: string; name: string };
        }

        const row = await db.query.users.findFirst({
          where: eq(users.username, username),
        });
        if (!row) return null;

        const ok = await bcrypt.compare(password, row.passwordHash);
        if (!ok) return null;

        await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, row.id));

        return {
          id: row.id,
          name: row.name ?? row.username,
          email: row.email ?? undefined,
          username: row.username,
          role: row.role,
          mustChangePassword: row.mustChangePassword,
        } as unknown as { id: string; name: string };
      },
    }),
  ],
  callbacks: {
    /**
     * Gate every /admin/* request — runs from proxy.ts. `true` lets the
     * request through, `false` redirects to `pages.signIn`, a Response
     * short-circuits (used to bounce logged-in users away from /login).
     */
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      const onAdminArea = pathname.startsWith("/admin");
      const onLogin = pathname === "/admin/login";
      const onRegister = pathname.startsWith("/admin/register");
      const onChangePassword = pathname.startsWith("/admin/change-password");
      const onLogout = pathname === "/admin/logout";
      const isLoggedIn = Boolean(session?.user);
      const mustChange = Boolean((session?.user as Partial<SessionUser> | undefined)?.mustChangePassword);

      if (!onAdminArea) return true;

      if (isLoggedIn && (onLogin || onRegister)) {
        return Response.redirect(new URL("/admin/dashboard", request.nextUrl));
      }
      if (!isLoggedIn && !(onLogin || onRegister)) {
        return false;
      }
      if (isLoggedIn && mustChange && !onChangePassword && !onLogout) {
        return Response.redirect(new URL("/admin/change-password", request.nextUrl));
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // `user` is only present on initial sign-in — persist the extras into the JWT.
        const u = user as unknown as SessionUser;
        token.id = u.id;
        token.username = u.username;
        token.role = u.role;
        token.mustChangePassword = u.mustChangePassword;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const s = session.user as typeof session.user & Partial<SessionUser>;
        s.id = token.id as string;
        s.username = token.username as string;
        s.role = token.role as string;
        s.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
});

/** Current session user or null. Server-only helper for pages and actions. */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await auth();
  const u = session?.user as (Partial<SessionUser> & { name?: string | null }) | undefined;
  if (!u?.id || !u.username) return null;
  return {
    id: u.id,
    name: u.name ?? null,
    email: u.email ?? null,
    username: u.username,
    role: u.role ?? "editor",
    mustChangePassword: Boolean(u.mustChangePassword),
  };
}

/** Throws when there is no session — for server actions and route handlers. */
export async function requireUser(): Promise<SessionUser> {
  const u = await currentUser();
  if (!u) throw new Error("Not authenticated");
  return u;
}
