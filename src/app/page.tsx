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

export const metadata: Metadata = {
  title: "Movers in Vancouver, WA & Portland, OR | $125/hr — GOAT Movers",
  description:
    "Stress-free moving across the I-5 corridor. Local moves at $125/hr, long-distance, commercial & packing. Licensed, insured, 850+ five-star reviews. Get your free quote today.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Movers in Vancouver, WA & Portland, OR | GOAT Movers",
    description:
      "Licensed & insured moving company serving Vancouver, WA, Portland, OR, and the I-5 corridor. Flat $125/hr, fixed-price quotes, 850+ five-star reviews.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ServiceAreaSection />
      <ReviewsSection />
      <GallerySection />
      <CTABanner />
      <FAQSection />
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </>
  );
}
