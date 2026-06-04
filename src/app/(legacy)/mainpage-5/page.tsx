import type { Metadata } from "next";
import { Header } from "@site/layout/Header";
import { HeroSection } from "@site/sections/HeroSection";
import { AboutSection } from "@site/sections/AboutSection";
import { ServicesSection } from "@site/sections/ServicesSection";
import { ServiceAreaSection } from "@site/sections/ServiceAreaSection";
import { ReviewsSection } from "@site/sections/ReviewsSection";
import { GallerySection } from "@site/sections/GallerySection";
import { CTABanner } from "@site/sections/CTABanner";
import { FAQSection } from "@site/sections/FAQSection";
import { ContactFooter } from "@site/sections/ContactFooter";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModal } from "@site/ui/QuoteModal";
/* Token vars + button variant colors so the shared @site/* sections (now on
   MP5Button) render correctly here. This archive lives in its own route group,
   so it does NOT inherit (site)/layout.tsx — it keeps the original <Header/>.
   data-accent="blue" activates the body:has(...) .mp5-btn--* rules. */
import "@site/styles/_tokens.css";
import "@site/styles/_mp5-btn.css";

export const metadata: Metadata = {
  title: "Archived Homepage (v1) | GOAT Movers",
  description:
    "Archived previous homepage layout. Kept for reference and rollback. Not indexed.",
  alternates: { canonical: "/mainpage-5" },
  robots: { index: false, follow: false },
};

export default function ArchivedHome() {
  return (
    <div className="page-zoom" data-accent="blue">
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
