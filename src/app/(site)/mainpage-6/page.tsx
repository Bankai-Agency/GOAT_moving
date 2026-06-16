import type { Metadata } from "next";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModalLazy } from "@site/ui/QuoteModalLazy";
import { FAQSection } from "@site/sections/FAQSection";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { ContactFooter } from "@site/sections/ContactFooter";
import { TerminalDraftClient } from "../_home/TerminalDraftClient";
import { defaultStickySteps, type StickyStep } from "../_home/stickyServicesData";
/* Same Terminal-industries-style redesign as /mainpage-5, parked at
   /mainpage-6 for an independent variant. The home-only Tier-B CSS is
   imported here so it's route-scoped to /mainpage-6, exactly like mp5. */
import "../_home/sticky-steps.css";
import "../_home/accent.css";
import "../_home/_mp5-dark.css";

export const metadata: Metadata = {
  title: "Homepage redesign v6 (preview) | GOAT Movers",
  description:
    "Terminal-industries-style homepage redesign — preview/parked variant (v6). Not indexed.",
  alternates: { canonical: "/mainpage-6" },
  robots: { index: false, follow: false },
};

/* mainpage-6 keeps the PREVIOUS clips for the services whose videos were
   refreshed on /mainpage-5 (the canonical service-*.mp4). This frozen-clip
   override is the only divergence between the two pages. */
/* The old mp6 clips are dark throughout (abstract renders on black), so a
   video first-frame would make a near-black poster. Use the bright service
   photos as the mp6 posters instead — mp5 keeps its (bright) video frames. */
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
const mp6Services = defaultStickySteps.map((step) => {
  const override = FROZEN[step.video];
  return override ? { ...step, ...override } : step;
});

export default function Mainpage6Preview() {
  return (
    <SmoothScrollProvider>
      {/* Preload the hero's first frame (the LCP paint). */}
      <link
        rel="preload"
        as="image"
        href="/frames-vhero/frame_0001.webp"
        type="image/webp"
      />
      <main>
        <TerminalDraftClient services={mp6Services} />
        <FAQSection />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModalLazy />
    </SmoothScrollProvider>
  );
}
