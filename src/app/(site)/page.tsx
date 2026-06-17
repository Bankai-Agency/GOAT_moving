import type { Metadata } from "next";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModalLazy } from "@site/ui/QuoteModalLazy";
import { FAQSection } from "@site/sections/FAQSection";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { ContactFooter } from "@site/sections/ContactFooter";
import { JsonLd } from "@site/seo/JsonLd";
import { localBusinessSchema, websiteSchema } from "@site/seo/schema";
import { TerminalDraftClient } from "./_home/TerminalDraftClient";
import { defaultStickySteps, type StickyStep } from "./_home/stickyServicesData";
/* Production homepage `/` — the Terminal-industries-style redesign
   (formerly parked at /mainpage-6). Home-only Tier-B CSS imported here
   so it's route-scoped to the home, exactly like the mainpage drafts. */
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

/* Keep the PREVIOUS clips for the services whose videos were refreshed on
   /mainpage-5 (the canonical service-*.mp4). The old clips are dark
   throughout, so a video first-frame would make a near-black poster — use
   the bright service photos as posters instead. This frozen-clip override
   is the divergence the home (ex-mp6) carries vs /mainpage-5. */
const FROZEN: Record<string, Partial<StickyStep>> = {
  "/videos/service-local-moving.mp4": {
    video: "/videos/service-local-moving-prev.mp4",
    image: "/images/service-local.webp",
  },
  "/videos/service-long-distance.mp4": {
    video: "/videos/service-long-distance-prev.mp4",
    image: "/images/service-longdistance.webp",
  },
  "/videos/service-commercial.mp4": {
    video: "/videos/service-commercial-prev.mp4",
    image: "/images/service-commercial.webp",
  },
  // Old packing clip is the bubble-wrapped vase → contain on mobile so it
  // isn't cropped (the new mp5 clip is full-frame footage → cover).
  "/videos/service-packing.mp4": {
    video: "/videos/service-packing-prev.mp4",
    image: "/images/service-packing.webp",
    fit: "contain",
  },
};
const homeServices = defaultStickySteps.map((step) => {
  const override = FROZEN[step.video];
  return override ? { ...step, ...override } : step;
});

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
        <TerminalDraftClient services={homeServices} />
        <FAQSection />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModalLazy />
    </SmoothScrollProvider>
  );
}
