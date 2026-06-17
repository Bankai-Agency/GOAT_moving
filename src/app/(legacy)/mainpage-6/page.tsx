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
import { JsonLd } from "@site/seo/JsonLd";
import { localBusinessSchema, websiteSchema } from "@site/seo/schema";
/* The original homepage, now PARKED at `/mainpage-6` (the production home
   `/` is the terminal-industries redesign). Lives in its own (legacy)
   route group with NO shared layout, so it keeps its own <Header/> (no
   TerminalNav). noindex — only `/` should be indexed.
   data-accent="blue" activates the body:has(...) .mp5-btn--* button rules. */
import "@site/styles/_tokens.css";
import "@site/styles/_mp5-btn.css";

export const metadata: Metadata = {
  title: "Homepage (classic, parked) | GOAT Movers",
  description:
    "Classic GOAT Movers homepage — parked preview. The live homepage is the redesigned version at /.",
  alternates: { canonical: "/mainpage-6" },
  robots: { index: false, follow: false },
};

export default function LegacyHome() {
  return (
    <div className="page-zoom" data-accent="blue">
      <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
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
