import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroMotionSection } from "@/components/sections/HeroMotionSection";
import { AboutMotionSection } from "@/components/sections/AboutMotionSection";
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

/* Working draft of the homepage with scroll-driven animations
   (Lenis smooth scroll + Framer Motion). Keeps existing dark theme,
   adds parallax / count-up / pinned-services / stagger reveals.
   Noindex so it doesn't compete with the live `/`. */
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
      <div className="page-zoom">
        <Header />
        <main>
          <HeroMotionSection />
          <AboutMotionSection />
          <ServicesPinnedSection />
          <RevealOnScroll>
            <ServiceAreaSection />
          </RevealOnScroll>
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
