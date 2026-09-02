"use client";

import Image from "next/image";
import { MP5Button } from "@site/ui/MP5Button";
import { HeroMobileFade } from "@site/sections/HeroMobileFade";
import { ReviewsSection } from "@site/sections/ReviewsSection";
import { WhatsIncludedSection } from "@site/sections/WhatsIncludedSection";
import { ServiceOptionsSection } from "@site/sections/ServiceOptionsSection";
import { FragileItemsSection } from "@site/sections/FragileItemsSection";
import { CTABanner } from "@site/sections/CTABanner";
import { FAQSection } from "@site/sections/FAQSection";
import { HowItWorksSection } from "@site/sections/HowItWorksSection";
import { OtherServicesSection } from "@site/sections/OtherServicesSection";
import { ContactFooter } from "@site/sections/ContactFooter";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModal } from "@site/ui/QuoteModal";
import { packingContent as content, nbCity, siteContent } from "@/lib/content";
import { formatPhone, phoneHref } from "@/lib/content/phone";

/* Page copy lives in `src/content/services/packing-services.json`
   (admin panel → Страницы → Packing & Labor). */

/* ===================== HERO ===================== */
function PKHero() {
  const { hero } = content;
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden bg-black">
      <div aria-hidden className="lg:hidden absolute inset-0" style={{ background: "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)" }} />
      <div className="absolute inset-0 max-lg:top-[88px] max-lg:bottom-[46dvh]">
        <Image src={hero.image} alt={hero.imageAlt} fill sizes="(max-width: 1024px) 200vw, 100vw" quality={90} className="object-cover object-[30%_top] lg:object-center" priority />
        <div className="hidden lg:block absolute inset-0 bg-[rgba(7,7,7,0.55)]" />
        <HeroMobileFade />
      </div>
      <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
            <span className="text-[#FFE533]">{hero.h1Highlight} </span>
            <br />
            <span className="text-white">{nbCity(hero.h1Rest)}</span>
          </h1>
          <div className="flex flex-col gap-5 lg:gap-7 max-w-[720px]">
            <p className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white">
              {hero.subtitle}
            </p>
            <div className="mp5-hero-cta flex flex-col lg:flex-row gap-3 lg:gap-6">
              <MP5Button size="sm" onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}>
                Get Free Estimate
              </MP5Button>
              <MP5Button size="sm" variant="secondary" href={phoneHref(siteContent.phone)}>
                {formatPhone(siteContent.phone, "paren")}
              </MP5Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== MAIN ===================== */
export default function PackingServicesClient() {
  return (
    <div className="page-zoom">
      <main>
        <PKHero />
        <ServiceOptionsSection
          label={content.serviceTypes.label}
          title={content.serviceTypes.title}
          subtitle={content.serviceTypes.subtitle}
          options={content.serviceTypes.items}
        />
        <WhatsIncludedSection
          label={content.whatsIncluded.label}
          title={content.whatsIncluded.title}
          subtitle={content.whatsIncluded.subtitle}
          items={content.whatsIncluded.items}
        />
        <HowItWorksSection title={content.howItWorks.title} steps={content.howItWorks.steps} />
        <FragileItemsSection
          label={content.fragile.label}
          title={content.fragile.title}
          subtitle={content.fragile.subtitle}
          items={content.fragile.items}
        />
        <ReviewsSection />
        <CTABanner />
        <FAQSection title={content.faq.title} items={content.faq.items} />
        <OtherServicesSection title={content.otherServices.title} services={content.otherServices.items} />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
