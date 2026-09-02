/**
 * LP config type + the Portland config used by the /lp4 dev preview.
 *
 * City content lives in `src/content/lp-cities.json` and is edited through
 * the admin panel (Лендинги). This module keeps the historical type names
 * (`LP1Config` / `CityLPConfig`) so the lp4 components stay untouched.
 */
import { findCityBySlug, type LpCityConfig } from "@/lib/content";

export type LP1Config = LpCityConfig;

/* Backwards-compat alias for callers that imported `CityLPConfig`. */
export type CityLPConfig = LP1Config;

const portland = findCityBySlug("movers-portland");
if (!portland) {
  throw new Error("lp-cities.json: the movers-portland config is required by /lp4");
}

export const portlandConfig: LP1Config = portland;
