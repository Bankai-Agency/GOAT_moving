import type { Metadata } from "next";
import { DesignSystem2Client } from "./DesignSystem2Client";

/* Full LP1 styles stack — must match lp1/page.tsx import order
   so the catalog renders sections identically to the live LP1
   route. Token file FIRST so CSS variables are defined before
   any rule references them; per-section files LAST so they win
   equal-specificity ties; dark-zone last of all. */
import "../../(lp)/lp1/styles/_tokens.css";
import "../../(lp)/lp1/styles/accent.css";
import "../../(lp)/lp1/styles/mega-nav.css";
import "../../(lp)/lp1/styles/lp-theme.css";
import "../../(lp)/lp1/styles/_hero.css";
import "../../(lp)/lp1/styles/_services.css";
import "../../(lp)/lp1/styles/_solution.css";
import "../../(lp)/lp1/styles/_service-area.css";
import "../../(lp)/lp1/styles/_faq.css";
import "../../(lp)/lp1/styles/_cta.css";
import "../../(lp)/lp1/styles/_about.css";
import "../../(lp)/lp1/styles/_process.css";
import "../../(lp)/lp1/styles/_reviews.css";
import "../../(lp)/lp1/styles/_footer.css";
import "../../(lp)/lp1/styles/_dark-zone.css";

export const metadata: Metadata = {
  title: "Design System 2 — LP Portland Catalog",
  description:
    "Component + section catalog for the Portland landing page. Desktop and mobile previews, Light / Dark imitation.",
  robots: { index: false, follow: false },
};

export default function DesignSystem2Page() {
  return <DesignSystem2Client />;
}
