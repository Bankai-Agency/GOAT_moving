/**
 * Per-city content for the location-based SEO pages (indexed, not noindex LPs).
 *
 * URL pattern: /{city}-movers
 *   e.g. /vancouver-movers, /portland-movers, /beaverton-movers
 *
 * The data now lives in `src/content/locations.json` and is edited through
 * the admin panel (Города). This module re-exports it so every existing
 * import path keeps working.
 */
export { locationConfigs, findLocation } from "@/lib/content";
export type { LocationConfig } from "@/lib/content";
