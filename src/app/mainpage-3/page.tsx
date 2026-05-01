import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

/* Working draft of the dark homepage with brand-blue accent (replaces
   the yellow #FFE533 with #005BFF site-wide via the `theme-blue` class).
   Kept noindex so it doesn't compete with the live `/` in search. */
export const metadata: Metadata = {
  title: "Mainpage 3 — Blue Accent Draft | GOAT Movers",
  description:
    "Working draft of the dark homepage with brand-blue accent for GOAT Movers.",
  alternates: { canonical: "/mainpage-3" },
  robots: { index: false, follow: false },
};

export default function MainpageThree() {
  return (
    <div className="page-zoom theme-blue">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ServiceAreaSection />
        <ReviewsSection />
        <GallerySection />
        <CTABanner />
        <FAQSection />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
