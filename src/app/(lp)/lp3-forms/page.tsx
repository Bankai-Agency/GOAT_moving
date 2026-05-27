import type { Metadata } from "next";
import { LPQuoteForm } from "../lp3/ui/LPQuoteForm";

/* Preview-only route for picking the dark-form treatment on /lp3.
   Renders three LPQuoteForm variants side-by-side on the lp3 dark
   page so a visual decision can be made before committing.

   All three pass `surface="glass"` so the INPUTS render with the
   dark fill + white text from `.lp-input--glass`. The CARD
   background is then overridden per variant via the inline <style>
   block below. Delete this route once a variant is chosen. */
import "../lp3/styles/_tokens.css";
import "../lp3/styles/accent.css";
import "../lp3/styles/mega-nav.css";
import "../lp3/styles/lp-theme.css";
import "../lp3/styles/_hero.css";
import "../lp3/styles/_services.css";
import "../lp3/styles/_solution.css";
import "../lp3/styles/_service-area.css";
import "../lp3/styles/_faq.css";
import "../lp3/styles/_cta.css";
import "../lp3/styles/_about.css";
import "../lp3/styles/_process.css";
import "../lp3/styles/_reviews.css";
import "../lp3/styles/_footer.css";
import "../lp3/styles/_dark-zone.css";
import "../lp3/styles/_lp2-invert.css";

export const metadata: Metadata = {
  title: "LP3 form variants — preview",
  robots: { index: false, follow: false },
};

const OVERRIDES = `
  /* A — frosted white glass (review-card recipe) */
  .lp3-pv-frosted [data-lp-quote-form] {
    background-color: rgba(255, 255, 255, 0.04) !important;
    backdrop-filter: blur(30px) saturate(120%) !important;
    -webkit-backdrop-filter: blur(30px) saturate(120%) !important;
    border: 1px solid var(--lp-white-08) !important;
    box-shadow: none !important;
  }
  /* B — dark glass (mega-nav recipe). Surface="glass" already gives
     rgba(0,0,0,0.3) + blur 30. Soften the heavy 0.5 shadow + add a
     hairline so it doesn't dissolve into the page. */
  .lp3-pv-dark-glass [data-lp-quote-form] {
    border: 1px solid var(--lp-white-08) !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35) !important;
  }
  /* C — solid #181818 (--lp-dark-surface), no blur. */
  .lp3-pv-solid [data-lp-quote-form] {
    background-color: var(--lp-dark-surface) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: 1px solid var(--lp-white-08) !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
  }
`;

export default function LP3FormsPreview() {
  return (
    <div
      data-accent="blue"
      data-lp-root=""
      className="lp2-dark bg-[#0c0c0c] min-h-screen"
    >
      <style dangerouslySetInnerHTML={{ __html: OVERRIDES }} />

      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <h1 className="text-white text-3xl font-semibold mb-2">
          LP3 — quote-form variants
        </h1>
        <p className="text-white/60 mb-10 max-w-[720px]">
          Three darker treatments for{" "}
          <code className="text-white/80">LPQuoteForm</code> on /lp3. Inputs use
          <code className="text-white/80"> surface=&quot;glass&quot;</code> in
          all three — only the card background changes.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-white text-lg font-semibold">
              A — Frosted white glass
            </h2>
            <p className="text-white/60 text-sm leading-snug">
              rgba(255,255,255,0.04) + blur 30 + saturate 120 + hairline
              white-08. Same recipe as Reviews cards / chips on /lp3.
            </p>
            <div className="lp3-pv-frosted">
              <LPQuoteForm city="Portland" surface="glass" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-white text-lg font-semibold">
              B — Dark glass
            </h2>
            <p className="text-white/60 text-sm leading-snug">
              rgba(0,0,0,0.3) + blur 30. Same recipe as the floating mega-nav
              header. Reads as dark glass picking up body gradient.
            </p>
            <div className="lp3-pv-dark-glass">
              <LPQuoteForm city="Portland" surface="glass" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-white text-lg font-semibold">
              C — Solid #181818
            </h2>
            <p className="text-white/60 text-sm leading-snug">
              Opaque dark surface (--lp-dark-surface), no blur. Heaviest visual
              weight — same plate density as service cards.
            </p>
            <div className="lp3-pv-solid">
              <LPQuoteForm city="Portland" surface="glass" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
