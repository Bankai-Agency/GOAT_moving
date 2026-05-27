import type { Metadata } from "next";
import { CityLandingPage } from "./CityLandingPage";
import { portlandConfig } from "./config/portland";

/* LP2 styles — dark-theme variant of LP1.
   - All `.theme-light[data-lp-root]` selectors were sed-replaced to
     `[data-lp-root]` so LP rules fire WITHOUT the theme-light flip.
   - No `theme-light` class on the wrapper → Tailwind hex classes
     render their authored (dark-theme) values.
   - `_lp2-invert.css` LAST: inverts cards/sections/text that were
     designed for light theme so they read on a dark page. */
import "./styles/_tokens.css";
import "./styles/accent.css";
import "./styles/mega-nav.css";
import "./styles/lp-theme.css";
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
import "./styles/_dark-zone.css";
import "./styles/_lp2-invert.css";

export const metadata: Metadata = {
  title: "Stress-Free Movers in Portland — Dark Theme | Goat Movers",
  description: portlandConfig.metaDescription,
  robots: { index: false, follow: false },
};

export default function LP2Page() {
  return (
    <div
      data-accent="blue"
      data-lp-root=""
      className="lp2-dark bg-[#0c0c0c] min-h-screen"
    >
      <CityLandingPage config={portlandConfig} />
    </div>
  );
}
