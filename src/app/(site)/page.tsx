import type { Metadata } from "next";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModalLazy } from "@site/ui/QuoteModalLazy";
import { FAQSection } from "@site/sections/FAQSection";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { ContactFooter } from "@site/sections/ContactFooter";
import { JsonLd } from "@site/seo/JsonLd";
import { localBusinessSchema, websiteSchema } from "@site/seo/schema";
import { TerminalDraftClient } from "./_home/TerminalDraftClient";
/* Production homepage `/` — promoted from the /mainpage-5 preview.
   Home-only Tier-B CSS is imported here so it stays route-scoped. */
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
      <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
      {/* Preload the hero's first frame (the LCP paint). */}
      <link
        rel="preload"
        as="image"
        href="/frames-vhero/frame_0001.webp"
        type="image/webp"
      />
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
