import type { Metadata } from "next";
import { TerminalNav } from "@site/layout/TerminalNav";
import { FAQSection } from "@site/sections/FAQSection";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModalLazy } from "@site/ui/QuoteModalLazy";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { ContactFooter } from "@site/sections/ContactFooter";
import { JsonLd } from "@site/seo/JsonLd";
import { localBusinessSchema, websiteSchema } from "@site/seo/schema";
import { TerminalDraftClient } from "@/app/(site)/_home/TerminalDraftClient";
import {
  defaultStickySteps,
  type StickyStep,
} from "@/app/(site)/_home/stickyServicesData";
import "@site/styles/_tokens.css";
import "@site/styles/mega-nav.css";
import "@site/styles/_mp5-btn.css";
import "@site/styles/mega-nav-dark.css";
import "@site/styles/footer-faq.css";
import "@site/styles/typography.css";
import "@site/styles/_page-gradient.css";
import "@/app/(site)/_home/sticky-steps.css";
import "@/app/(site)/_home/accent.css";
import "@/app/(site)/_home/_mp5-dark.css";

export const metadata: Metadata = {
  title: "Homepage previous version (parked) | GOAT Movers",
  description:
    "Previous GOAT Movers homepage version — parked preview. The live homepage is available at /.",
  alternates: { canonical: "/mainpage-6" },
  robots: { index: false, follow: false },
};

/* Preserve the previous production home at /mainpage-6. It lives outside
   (site), so it renders the shared site chrome and styles locally. */
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
  "/videos/service-packing.mp4": {
    video: "/videos/service-packing-prev.mp4",
    image: "/images/service-packing.webp",
    fit: "contain",
  },
};
const parkedHomeServices = defaultStickySteps.map((step) => {
  const override = FROZEN[step.video];
  return override ? { ...step, ...override } : step;
});

export default function Mainpage6ParkedHome() {
  return (
    <div data-accent="blue" className="mp5-dark">
      <TerminalNav />
      <SmoothScrollProvider>
        <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
        <link
          rel="preload"
          as="image"
          href="/frames-vhero/frame_0001.webp"
          type="image/webp"
        />
        <main>
          <TerminalDraftClient services={parkedHomeServices} />
          <FAQSection />
        </main>
        <ContactFooter />
        <Touchbar />
        <QuoteModalLazy />
      </SmoothScrollProvider>
    </div>
  );
}
