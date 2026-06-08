import type { Metadata } from "next";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModalLazy } from "@site/ui/QuoteModalLazy";
import { FAQSection } from "@site/sections/FAQSection";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { ContactFooter } from "@site/sections/ContactFooter";
import { TerminalDraftClient } from "../_home/TerminalDraftClient";
import { Preloader } from "../_home/Preloader";
/* Terminal-industries-style redesign, parked at /mainpage-5 (the live home
   is the original layout at `/`). Stays in the (site) group so it keeps the
   shared TerminalNav chrome from (site)/layout.tsx; the home-only Tier-B CSS
   is imported here so it's route-scoped to /mainpage-5. */
import "../_home/sticky-steps.css";
import "../_home/accent.css";
import "../_home/_mp5-dark.css";

export const metadata: Metadata = {
  title: "Homepage redesign (preview) | GOAT Movers",
  description:
    "Terminal-industries-style homepage redesign — preview/parked version. Not indexed.",
  alternates: { canonical: "/mainpage-5" },
  robots: { index: false, follow: false },
};

export default function Mainpage5Preview() {
  return (
    <>
      {/* Logo-reveal preloader — covers the screen while the hero video
          buffers, then lifts (see Preloader.tsx). */}
      <Preloader />
      <SmoothScrollProvider>
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
    </>
  );
}
