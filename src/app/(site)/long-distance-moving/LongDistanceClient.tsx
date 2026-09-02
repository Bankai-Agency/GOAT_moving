"use client";

import Image from "next/image";
import { MP5Button } from "@site/ui/MP5Button";
import { HeroMobileFade } from "@site/sections/HeroMobileFade";
import { ReviewsSection } from "@site/sections/ReviewsSection";
import { WhatsIncludedSection } from "@site/sections/WhatsIncludedSection";
import { CTABanner } from "@site/sections/CTABanner";
import { FAQSection } from "@site/sections/FAQSection";
import { HowItWorksSection } from "@site/sections/HowItWorksSection";
import { OtherServicesSection } from "@site/sections/OtherServicesSection";
import { WhyTrustSection } from "@site/sections/WhyTrustSection";
import { ContactFooter } from "@site/sections/ContactFooter";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModal } from "@site/ui/QuoteModal";
import { longDistanceContent as content, nbCity, siteContent } from "@/lib/content";
import { formatPhone, phoneHref } from "@/lib/content/phone";

/* Page copy lives in `src/content/services/long-distance-moving.json`
   (admin panel → Страницы → Long Distance). */

/* ===================== HERO — identical style to Local Moving ===================== */
function LDHero() {
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
              <MP5Button
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
              >
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

/* ===================== WHERE WE MOVE ===================== */
function WhereWeMove() {
  const { routes } = content;

  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {routes.label}
              </span>
            </div>
          </div>
          <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
            {routes.title}
          </h2>
        </div>

        {/* Route cards grid — boarding-pass style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {routes.items.map((route, i) => (
            <div
              key={i}
              className="bg-[#181818] rounded-xl lg:rounded-2xl p-6 lg:p-8 flex flex-col gap-6 lg:gap-7"
            >
              {/* Boarding-pass style FROM → TO row */}
              <div className="flex items-end justify-between gap-3">
                {/* FROM */}
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[-0.48px] leading-[1.2] text-white/50 truncate">
                    {route.fromName}
                  </span>
                  <span className="font-sans font-bold text-[40px] lg:text-[52px] leading-none tracking-[-1.2px] lg:tracking-[-1.56px] text-white">
                    {route.fromCode}
                  </span>
                </div>

                {/* Middle: dashed line with truck */}
                <div className="flex-1 flex items-center justify-center gap-2 pb-2 shrink min-w-0">
                  <span className="flex-1 h-[1.5px] bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.3)_0,rgba(255,255,255,0.3)_4px,transparent_4px,transparent_8px)]" />
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 512 512" fill="#FFE533" xmlns="http://www.w3.org/2000/svg">
                    <path d="m72.078 341.333h-50.744a32 32 0 0 0 32 32h5.6a58.374 58.374 0 0 1 13.144-32z" />
                    <path d="m320 341.333h-157.411a58.374 58.374 0 0 1 13.142 32h144.269a10.667 10.667 0 0 0 10.667-10.667v-10.666a10.667 10.667 0 0 0 -10.667-10.667z" />
                    <circle cx="117.334" cy="378.667" r="37.333" />
                    <path d="m507.219 275.173-40.985-90.163a42.749 42.749 0 0 0 -38.834-25.01h-64.733a10.667 10.667 0 0 0 -10.667 10.667v167.817a58.588 58.588 0 0 1 101.064 34.849h26.936a32 32 0 0 0 32-32v-44.091a53.32 53.32 0 0 0 -4.781-22.069zm-48.633-8.507h-69.253a10.667 10.667 0 0 1 -10.666-10.666v-42.667a10.667 10.667 0 0 1 10.667-10.667h42.991a21.333 21.333 0 0 1 19.421 12.5l16.554 36.42a10.667 10.667 0 0 1 -9.714 15.081z" />
                    <circle cx="394.667" cy="378.667" r="37.333" />
                    <path d="m298.667 96h-245.334a32 32 0 0 0 -32 32v128h-10.1c-5.308 0-10.233 3.63-11.087 8.875a10.675 10.675 0 0 0 10.521 12.459h26.1c5.314 0 10.238 3.63 11.092 8.875a10.675 10.675 0 0 1 -10.521 12.459h-26.1c-5.313-.001-10.238 3.632-11.092 8.873a10.675 10.675 0 0 0 10.521 12.459h309.333a10.667 10.667 0 0 0 10.667-10.667v-181.333a32 32 0 0 0 -32-32z" />
                  </svg>
                  <span className="flex-1 h-[1.5px] bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.3)_0,rgba(255,255,255,0.3)_4px,transparent_4px,transparent_8px)]" />
                </div>

                {/* TO */}
                <div className="flex flex-col gap-1 items-end min-w-0">
                  <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[-0.48px] leading-[1.2] text-white/50 truncate">
                    {route.toName}
                  </span>
                  <span className="font-sans font-bold text-[40px] lg:text-[52px] leading-none tracking-[-1.2px] lg:tracking-[-1.56px] text-[#FFE533]">
                    {route.toCode}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Cities served */}
              <p className="font-sans font-normal text-sm lg:text-base leading-[1.5] tracking-[-0.48px] text-white/60">
                {route.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LongDistanceClient() {
  return (
    <div className="page-zoom">
      <main>
        <LDHero />
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
        <WhereWeMove />
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
