import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroArrivalSection } from "@/components/sections/HeroArrivalSection";
import { AboutMotionSection } from "@/components/sections/AboutMotionSection";
import { StoryPinSection } from "@/components/sections/StoryPinSection";
import { ServiceAreaMapSection } from "@/components/sections/ServiceAreaMapSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { CTAArrivalBanner } from "@/components/sections/CTAArrivalBanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { GlobalScrollProvider } from "@/components/motion/GlobalScrollProvider";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

/* "The Move Journey" draft. Hero (truck arrives) → About (full-bleed
   video pin) → StoryPin (truck drives beside the 4 services) →
   Service Area map (truck rides the I-5 line, cities pop) → Reviews →
   Gallery → CTA arrival (truck pulls up to the house). MoverCompanion
   sits OUTSIDE `.page-zoom` so its 100vw / 100vh references stay true.
   GlobalScrollProvider gives it (and any future consumer) a single
   shared `useScroll` observer. Noindex. */
export const metadata: Metadata = {
  title: "Mainpage 4 — Motion Draft | GOAT Movers",
  description:
    "Working draft of the homepage with scroll-driven moving-truck narrative for GOAT Movers.",
  alternates: { canonical: "/mainpage-4" },
  robots: { index: false, follow: false },
};

export default function MainpageFour() {
  return (
    <SmoothScrollProvider>
      <GlobalScrollProvider>
        <div className="page-zoom theme-light">
          <Header />
          <main>
            <HeroArrivalSection />
            <AboutMotionSection />
            <StoryPinSection />
            <ServiceAreaMapSection />
            <RevealOnScroll>
              <ReviewsSection />
            </RevealOnScroll>
            <RevealOnScroll>
              <GallerySection />
            </RevealOnScroll>
            <CTAArrivalBanner />
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
      </GlobalScrollProvider>
    </SmoothScrollProvider>
  );
}
