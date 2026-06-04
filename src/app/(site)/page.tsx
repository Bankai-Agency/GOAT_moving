import type { Metadata } from "next";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModalLazy } from "@site/ui/QuoteModalLazy";
import { FAQSection } from "@site/sections/FAQSection";
import { JsonLd } from "@site/seo/JsonLd";
import { localBusinessSchema, websiteSchema } from "@site/seo/schema";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { ContactFooter } from "@site/sections/ContactFooter";
import { TerminalDraftClient } from "./_home/TerminalDraftClient";
/* Home-only Tier-B CSS. Imported here (NOT in (site)/layout.tsx) so Next.js
   route-scopes it to "/" — corp pages carry data-accent="blue" but never load
   these files, so they don't inherit the home's page-specific overrides.
   Order mirrors the original draft: the layout ships _tokens/mega-nav/_mp5-btn/
   mega-nav-dark; the page adds sticky-steps → accent → _mp5-dark last so the
   dark inversion layer wins the final cascade tie. */
import "./_home/sticky-steps.css";
import "./_home/accent.css";
import "./_home/_mp5-dark.css";

export const metadata: Metadata = {
  title: "Movers in Vancouver, WA & Portland, OR | $125/hr — GOAT Movers",
  description:
    "Stress-free moving across the I-5 corridor. Local moves at $125/hr, long-distance, commercial & packing. Licensed, insured, 850+ five-star reviews. Get your free quote today.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Movers in Vancouver, WA & Portland, OR | GOAT Movers",
    description:
      "Licensed & insured moving company serving Vancouver, WA, Portland, OR, and the I-5 corridor. Flat $125/hr, fixed-price quotes, 850+ five-star reviews.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <SmoothScrollProvider>
      {/* Preload the hero's first frame (the LCP paint) — home-scoped, so
          corp pages never request it. */}
      <link
        rel="preload"
        as="image"
        href="/frames-vhero/frame_0001.webp"
        type="image/webp"
      />
      <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
      <main>
        <TerminalDraftClient />
        <FAQSection />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModalLazy />
    </SmoothScrollProvider>
  );
}
