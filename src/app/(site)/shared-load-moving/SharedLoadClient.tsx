"use client";

import Image from "next/image";
import Link from "next/link";
import { MP5Button } from "@site/ui/MP5Button";
import { HeroMobileFade } from "@site/sections/HeroMobileFade";
import { ReviewsSection } from "@site/sections/ReviewsSection";
import { WhatsIncludedSection } from "@site/sections/WhatsIncludedSection";
import { CTABanner } from "@site/sections/CTABanner";
import { FAQSection } from "@site/sections/FAQSection";
import { HowItWorksSection } from "@site/sections/HowItWorksSection";
import { OtherServicesSection } from "@site/sections/OtherServicesSection";
import { WhyTrustSection } from "@site/sections/WhyTrustSection";
import { ServiceOptionsSection } from "@site/sections/ServiceOptionsSection";
import { RoutesSection } from "@site/sections/RoutesSection";
import { ContactFooter } from "@site/sections/ContactFooter";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModal } from "@site/ui/QuoteModal";
import { sharedLoadContent as content, nbCity, siteContent } from "@/lib/content";
import { formatPhone, phoneHref } from "@/lib/content/phone";

/* Page copy lives in `src/content/services/shared-load-moving.json`
   (admin panel → Страницы → Shared Load Moving). The page mirrors the
   long distance page; the two blocks specific to shared load are the
   big-number facts (volume pricing / delivery window / distance) and
   the shared-vs-dedicated comparison with a link to the dedicated page. */

const openQuoteModal = () => window.dispatchEvent(new CustomEvent("open-quote-modal"));

/* ===================== HERO — identical style to Long Distance ===================== */
function SLHero() {
  const { hero } = content;
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden bg-black">
      <div aria-hidden className="lg:hidden absolute inset-0" style={{ background: "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)" }} />
      <div className="absolute inset-0 max-lg:top-[88px] max-lg:bottom-[53dvh]">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          sizes="(max-width: 1024px) 200vw, 100vw"
          quality={90}
          className="object-cover object-[70%_center] lg:object-center"
          priority
        />
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
          <div className="flex flex-col gap-5 lg:gap-7 max-w-[640px]">
            <p className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white">
              {hero.subtitle}
            </p>
            <div className="mp5-hero-cta flex flex-col lg:flex-row gap-3 lg:gap-6">
              <MP5Button size="sm" onClick={openQuoteModal}>
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

/* ===================== FACTS — "Cost-Effective Shared Truck Delivery" ===================== */
function SharedLoadFacts() {
  const { facts } = content;
  return (
    <section className="bg-black px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {facts.label}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white max-w-[900px]">
              {facts.title}
            </h2>
            <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] text-white/60 max-w-[700px]">
              {facts.subtitle}
            </p>
          </div>
        </div>

        {/* Big-number cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {facts.items.map((item) => (
            <div
              key={item.title}
              className="bg-[#181818] rounded-xl lg:rounded-2xl p-6 lg:p-8 flex flex-col gap-6 lg:gap-8"
            >
              <div className="flex flex-col gap-3">
                <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[-0.48px] leading-[1.2] text-white/50">
                  {item.label}
                </span>
                <span className="font-sans font-bold text-[44px] lg:text-[64px] leading-none tracking-[-1.32px] lg:tracking-[-1.92px] text-[#FFE533]">
                  {item.value}
                </span>
              </div>
              <div className="border-t border-white/10" />
              <div className="flex flex-col gap-2">
                <h3 className="font-sans font-bold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white">
                  {item.title}
                </h3>
                <p className="font-sans font-normal text-base leading-[1.5] tracking-[-0.48px] text-white/60">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-t border-white/16 pt-8 lg:pt-10">
          <p className="font-sans font-medium text-lg lg:text-2xl leading-[1.3] tracking-[-0.54px] lg:tracking-[-0.72px] text-white max-w-[720px]">
            {facts.note}
          </p>
          <div className="mp5-hero-cta shrink-0">
            <MP5Button size="sm" onClick={openQuoteModal}>
              {facts.ctaLabel}
            </MP5Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== SHARED vs DEDICATED ===================== */
function SharedVsDedicated() {
  const { options } = content;
  return (
    <ServiceOptionsSection
      label={options.label}
      title={options.title}
      subtitle={options.subtitle}
      options={options.items}
      footer={
        <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] text-white/60">
          {options.dedicated.text}{" "}
          <Link
            href={options.dedicated.href}
            className="hover-underline font-semibold text-[#FFE533] whitespace-nowrap"
          >
            {options.dedicated.linkLabel}
          </Link>
        </p>
      }
    />
  );
}

export default function SharedLoadClient() {
  return (
    <div className="page-zoom">
      <main>
        <SLHero />
        <SharedLoadFacts />
        <SharedVsDedicated />
        <WhatsIncludedSection
          title={content.whatsIncluded.title}
          subtitle={content.whatsIncluded.subtitle}
          items={content.whatsIncluded.items}
        />
        <WhyTrustSection
          title={content.whyTrust.title}
          description={content.whyTrust.description}
          image={content.whyTrust.image}
          imageAlt={content.whyTrust.imageAlt}
          items={content.whyTrust.items}
          hideLabelDivider
        />
        <HowItWorksSection title={content.howItWorks.title} steps={content.howItWorks.steps} />
        <RoutesSection {...content.routes} />
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
