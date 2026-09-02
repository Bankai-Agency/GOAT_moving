/* Data for the sticky-steps services block. Plain module (no "use
   client") so server components (e.g. mainpage-6) can import the array
   directly while the client StickyServices component renders it.

   The content itself lives in `src/content/home.json` (edited through the
   admin panel → Главная → Услуги); this module only re-exports it so the
   existing call sites keep working. */
import { homeContent } from "@/lib/content";

export type { StickyStep } from "@/lib/content";

export const defaultStickySteps = homeContent.services;
