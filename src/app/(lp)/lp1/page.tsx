import type { Metadata } from "next";
import { CityLandingPage } from "./CityLandingPage";
import { portlandConfig } from "./config/portland";

/* LP1 styles — local copy of the LP design system. Edits here only
   affect /lp1; the original /lp/[slug] uses its own _shared/styles.

   Order matters: _tokens.css FIRST so CSS variables are defined
   before any rule references them. */
import "./styles/_tokens.css";
import "./styles/accent.css";
import "./styles/mega-nav.css";
import "./styles/lp-theme.css";
/* Per-section CSS — loaded AFTER lp-theme.css so any equal-specificity
   ties resolve the same way they did when the rules lived in
   lp-theme.css. */
import "./styles/_hero.css";
import "./styles/_services.css";
import "./styles/_solution.css";
import "./styles/_service-area.css";
import "./styles/_faq.css";
import "./styles/_cta.css";
import "./styles/_about.css";
import "./styles/_process.css";
import "./styles/_reviews.css";
import "./styles/_footer.css";
/* Dark zone goes LAST so its color-mix overrides win cascade ties
   against any per-section base styles. */
import "./styles/_dark-zone.css";

export const metadata: Metadata = {
  title: portlandConfig.metaTitle,
  description: portlandConfig.metaDescription,
  robots: { index: false, follow: false },
};

export default function LP1Page() {
  return (
    <div
      data-accent="blue"
      data-lp-root=""
      className="theme-light bg-[#ffffff] min-h-screen"
    >
      <CityLandingPage config={portlandConfig} />
    </div>
  );
}
