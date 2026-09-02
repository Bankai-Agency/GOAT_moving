import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Drizzle + Neon HTTP serverless driver (lazy).
 *
 * `neon-http` sends queries over HTTPS — no TCP pool to manage in a
 * serverless function. Admin traffic is tiny, so the per-query HTTP
 * overhead is fine.
 *
 * Lazy because `next build` imports this module while generating the route
 * graph, before any runtime env is available. We throw on the first real
 * query instead, so a missing DATABASE_URL shows up as an admin error, not
 * as a broken build of the public site.
 */

/** True when a Postgres connection string is configured. */
export const dbConfigured = Boolean(process.env.DATABASE_URL);

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getClient() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. See .env.example — for local dev create `.env.local`, " +
        "for prod set it in the Vercel project env vars.",
    );
  }
  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

/**
 * Proxy around the lazy client. Any property access triggers init on first use.
 * Typed as the full drizzle client so call sites don't see `| null`.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});

export { schema };
