#!/usr/bin/env node
/**
 * scripts/seed-admin-user.mjs — creates (or resets) the "owner" account.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-admin-user.mjs   (or `npm run db:seed`)
 *
 * Reads SEED_USERNAME / SEED_PASSWORD from the env, hashes the password
 * with bcrypt (cost 12) and upserts the row with role = 'owner' and
 * must_change_password = true, so the seed password is treated as temporary.
 * Safe to re-run: on conflict only the password/role are refreshed.
 */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
const SEED_USERNAME = (process.env.SEED_USERNAME ?? "").trim().toLowerCase();
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "";

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Did you run with --env-file=.env.local ?");
  process.exit(1);
}
if (!SEED_USERNAME || !SEED_PASSWORD) {
  console.error("❌ SEED_USERNAME and SEED_PASSWORD must be set in .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  const hash = await bcrypt.hash(SEED_PASSWORD, 12);
  const rows = await sql`
    INSERT INTO users (username, password_hash, role, must_change_password)
    VALUES (${SEED_USERNAME}, ${hash}, 'owner', true)
    ON CONFLICT (username) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          role = 'owner',
          must_change_password = true
    RETURNING id, username, role, created_at
  `;

  console.log("✅ Seed user ready:");
  console.table(rows);
  console.log(`\n   Username: ${SEED_USERNAME}`);
  console.log(`   Password: ${SEED_PASSWORD}  (you will be asked to change it on first login)`);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
