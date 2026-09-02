#!/usr/bin/env node
/**
 * scripts/db-setup.mjs — creates the admin DB schema (users + invites).
 *
 * Run with:
 *   node --env-file=.env.local scripts/db-setup.mjs     (or `npm run db:setup`)
 *
 * Plain CREATE TABLE IF NOT EXISTS: idempotent, safe to re-run, no
 * interactive prompts (works in CI).
 */
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Did you run with --env-file=.env.local ?");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log("→ ensuring pgcrypto for gen_random_uuid()…");
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  console.log("→ creating users…");
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      username text NOT NULL,
      password_hash text NOT NULL,
      email text,
      name text,
      role text DEFAULT 'editor' NOT NULL,
      must_change_password boolean DEFAULT false NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      last_login_at timestamp with time zone,
      CONSTRAINT users_username_unique UNIQUE (username)
    )
  `;

  console.log("→ creating invites…");
  await sql`
    CREATE TABLE IF NOT EXISTS invites (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      token text NOT NULL,
      label text,
      created_by_id text NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      expires_at timestamp with time zone NOT NULL,
      used_at timestamp with time zone,
      used_by_user_id uuid,
      CONSTRAINT invites_token_unique UNIQUE (token)
    )
  `;

  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;
  console.log("\n✅ DB schema ready. Tables in public schema:");
  console.table(tables);
}

main().catch((err) => {
  console.error("❌ DB setup failed:", err);
  process.exit(1);
});
