import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroMotionSection } from "@/components/sections/HeroMotionSection";
import { AboutMotionSection } from "@/components/sections/AboutMotionSection";
import { BigStatsPinnedSection } from "@/components/sections/BigStatsPinnedSection";
import { ServicesPinnedSection } from "@/components/sections/ServicesPinnedSection";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { CTAMotionBanner } from "@/components/sections/CTAMotionBanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { MarqueeBand } from "@/components/motion/MarqueeBand";

/* Working draft — built on top of /mainpage-2 (light theme) with
   scroll-driven animations (Lenis smooth scroll + Framer Motion).
   Adds a pinned big-stats section, marquee bands, dramatic hero
   stagger, scroll-jacked Services, and parallax CTA. Noindex. */
export const metadata: Metadata = {
  title: "Mainpage 4 — Motion Draft | GOAT Movers",
  description:
    "Working draft of the homepage with scroll-driven animations for GOAT Movers.",
  alternates: { canonical: "/mainpage-4" },
  robots: { index: false, follow: false },
};

export default function MainpageFour() {
  return (
    <SmoothScrollProvider>
      <div className="page-zoom theme-light">
        <Header />
        <main>
          <HeroMotionSection />
          <MarqueeBand
            items={[
              "GOAT Movers",
              "Licensed & Insured",
              "USDOT #4232069",
              "850+ Five-star Reviews",
              "Family-owned Since 2019",
              "Vancouver · Portland · Tacoma · Seattle",
            ]}
          />
          <AboutMotionSection />
          <BigStatsPinnedSection />
          <ServicesPinnedSection />
          <RevealOnScroll>
            <ServiceAreaSection />
          </RevealOnScroll>
          <MarqueeBand
            items={[
              "Free Quote in 5 Minutes",
              "No Hidden Fees",
              "No Charge for Stairs",
              "Fully Insured Crews",
            ]}
            speed={45}
          />
          <RevealOnScroll>
            <ReviewsSection />
          </RevealOnScroll>
          <RevealOnScroll>
            <GallerySection />
          </RevealOnScroll>
          <CTAMotionBanner />
          <RevealOnScroll>
            <FAQSection />
          </RevealOnScroll>
        </main>
        <RevealOnScroll>
          <ContactFooter />
        </RevealOnScroll>
        <Touchbar />
        <QuoteModal />
      </div>
    </SmoothScrollProvider>
  );
}
