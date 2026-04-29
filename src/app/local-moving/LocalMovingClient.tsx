"use client";

import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { WhatsIncludedSection } from "@/components/sections/WhatsIncludedSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { LocalMovingRatesSection } from "@/components/sections/LocalMovingRatesSection";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { OtherServicesSection } from "@/components/sections/OtherServicesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

function LocalHero() {
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/local-moving-hero.jpg"
          alt="Local moving services in Vancouver WA"
          fill
          sizes="(max-width: 1024px) 200vw, 100vw"
          quality={90}
          className="object-cover object-right lg:object-center"
          priority
        />
        <div className="absolute inset-0 bg-[rgba(7,7,7,0.3)]" />
      </div>
      <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
            <span className="text-[#FFE533]">Local Moving Services </span>
            <br />
            <span className="text-white">in Vancouver, WA</span>
          </h1>
          <div className="flex flex-col gap-5 lg:gap-7 max-w-[640px]">
            <p className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white">
              Residential moves in Vancouver, Portland, and the entire I-5
              corridor. Professional team, no hidden fees, no charge for stairs.
            </p>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                className="btn-shine bg-[#FFE533] h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-[#0c0c0c] uppercase tracking-[-0.64px] leading-[1.2] hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
              >
                Get Free Estimate
              </button>
              <a
                href="tel:+13805240846"
                className="border border-white h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-white uppercase tracking-[-0.64px] leading-[1.2] hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                +1 (380) 524-0846
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const localFaqs = [
  {
    question: "How long does a local move take?",
    answer:
      "A studio or 1-bedroom typically takes 2-3 hours. A 2-3 bedroom home takes 4-6 hours. Larger homes may take a full day.",
  },
  {
    question: "Do I need to pack everything before you arrive?",
    answer:
      "No — you can add packing services to your move. We offer professional packing with quality materials. Or you can pack yourself and we handle the loading and transport.",
  },
  {
    question: "Can you move just a few items?",
    answer:
      "Yes. We handle single-item moves like couches, dressers, or appliances. The 3-hour minimum still applies.",
  },
  {
    question: "What if I\u2019m moving to or from an apartment?",
    answer:
      "No problem. We move apartments, condos, townhomes, and houses. No extra charge for stairs or elevators.",
  },
  {
    question: "Do you move on weekends?",
    answer: "Yes, we\u2019re available Monday through Sunday, 8 AM to 6 PM.",
  },
];

export default function LocalMovingClient() {
  return (
    <div className="page-zoom">
      <Header />
      <main>
      <LocalHero />
      <WhatsIncludedSection />
      <HowItWorksSection />
      <LocalMovingRatesSection
        title="Local Moving Rates"
        subtitle="$125/hour flat rate — most local moves cost $400–$900 depending on size, stairs, and distance."
        hideCta
        estimates={[]}
      />
      <ServiceAreaSection />
      <ReviewsSection />
      <FAQSection title="Local Moving FAQ" items={localFaqs} />
      <OtherServicesSection />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
