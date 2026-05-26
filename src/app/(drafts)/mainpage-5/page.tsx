import type { Metadata } from "next";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModal } from "@site/ui/QuoteModal";
import { FAQSection } from "@site/sections/FAQSection";
import { ContactFooter } from "@site/sections/ContactFooter";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { FooterParallax } from "../../(lp)/_shared/FooterParallax";
import { TerminalDraftClient } from "./TerminalDraftClient";
import { TerminalNav } from "./TerminalNav";
import "./mega-nav.css";
import "./sticky-steps.css";
import "./accent.css";

/* Mainpage-5 — terminal-industries-inspired structural skeleton.
   Section order: hero → numbered feature carousel → 3 benefit panels →
   partner marquee → testimonial → client logo grid → inline CTA →
   contact form → footer-CTA banner → footer.
   Draft. noindex / disallowed in robots.ts (add separately when ready). */
export const metadata: Metadata = {
  title: "Mainpage 5 — Industrial Draft | GOAT Movers",
  description:
    "Working structural draft of the homepage in an industrial-platform layout — placeholder copy, real GOAT assets.",
  alternates: { canonical: "/mainpage-5" },
  robots: { index: false, follow: false },
};

export default function MainpageFive() {
  return (
    <SmoothScrollProvider>
      <div data-accent="blue" className="theme-light bg-[#ffffff] min-h-screen">
        <TerminalNav />
        <main>
          <TerminalDraftClient />
          <FAQSection />
        </main>
        <FooterParallax>
          <ContactFooter />
        </FooterParallax>
        <Touchbar />
        <QuoteModal />
      </div>
    </SmoothScrollProvider>
  );
}
