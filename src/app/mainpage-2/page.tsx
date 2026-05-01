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

/* Working draft of the homepage — duplicated so we can iterate on layout
   without touching the live `/`. Kept noindex so it doesn't compete with
   the real home in search results. */
export const metadata: Metadata = {
  title: "Mainpage 2 — Draft | GOAT Movers",
  description: "Working draft of the homepage layout for GOAT Movers.",
  alternates: { canonical: "/mainpage-2" },
  robots: { index: false, follow: false },
};

export default function MainpageTwo() {
  return (
    <div className="page-zoom theme-light">
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
