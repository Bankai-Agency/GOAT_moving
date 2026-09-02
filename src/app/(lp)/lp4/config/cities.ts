/**
 * Multi-city content for the production `/lp/{slug}` route, rendered with
 * the lp4 design system (dark theme + yellow accent).
 *
 * The per-city copy now lives in `src/content/lp-cities.json` and is edited
 * through the admin panel (Лендинги). Slugs use the `movers-*` form
 * (`/lp/movers-portland`, `/lp/movers-vancouver-wa`) — matching the
 * existing live/ad URLs. This module re-exports the registry so the route
 * and the dev previews keep their import paths.
 */
export { cityLPs, findCityBySlug } from "@/lib/content";
export type { LP1Config } from "./portland";
