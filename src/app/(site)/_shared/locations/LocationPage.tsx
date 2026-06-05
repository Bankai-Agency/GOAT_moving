"use client";

import Image from "next/image";
import { MP5Button } from "@site/ui/MP5Button";
import { ServicesSection } from "@site/sections/ServicesSection";
import { WhyTrustSection } from "@site/sections/WhyTrustSection";
import { WhatsIncludedSection, defaultIncludedItems } from "@site/sections/WhatsIncludedSection";
import { ReviewsSection } from "@site/sections/ReviewsSection";
import { HowItWorksSection } from "@site/sections/HowItWorksSection";
import { CTABanner } from "@site/sections/CTABanner";
import { FAQSection } from "@site/sections/FAQSection";
import { ContactFooter } from "@site/sections/ContactFooter";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModal } from "@site/ui/QuoteModal";
import type { LocationConfig } from "./locationConfigs";

export function LocationPage({ config }: { config: LocationConfig }) {
  const {
    city,
    cityDisplay,
    state,
    heroImage,
    heroImagePosition = "object-center",
  } = config;

  /* Non-breaking "City, ST" so the two-letter state code never orphans onto
     its own line in a heading (e.g. "…in Portland, OR"). Used for the visible
     headings + hero only; alt/sr-only text keeps the plain form. */
  const cityNb = cityDisplay.replace(/,\s+/g, ",\u00A0");
  const h1HighlightNb = config.h1Highlight.replace(/,\s+/g, ",\u00A0");

  /* ─── Services block: four cards with city-specific Local Moving copy ─── */
  const services = [
    {
      title: "Local Moving",
      description: config.localMovingDescription,
      number: "1",
      image: "/images/service-local.png",
      href: "/local-moving",
    },
    {
      title: "Long Distance Moving",
      description:
        config.longDistanceDescription ??
        `Interstate moves out of ${city} across the US. Fully licensed (USDOT #4232069) with door-to-door delivery and same-crew service.`,
      number: "2",
      image: "/images/service-longdistance.jpg",
      href: "/long-distance-moving",
    },
    {
      title: "Commercial Moving",
      description:
        config.commercialDescription ??
        `Office relocations in ${city} with minimal downtime. After-hours and weekend scheduling available.`,
      number: "3",
      image: "/images/service-commercial.png",
      href: "/commercial-moving",
    },
    {
      title: "Packing & Labor",
      description:
        config.packingDescription ??
        "Full-service packing, partial packing, and labor-only loading for PODS & U-Haul. Quality materials, fragile specialists, same-day availability.",
      number: "4",
      image: "/images/service-packing.png",
      href: "/packing-services",
    },
  ];

  /* ─── What's Included: default 6 items, no per-city overrides needed ─── */
  const includedItems = defaultIncludedItems;

  return (
    <div className="page-zoom">
      <main>

      {/* ========================== HERO ========================== */}
      <section className="relative h-screen min-h-[720px] lg:min-h-[900px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={`Professional movers in ${cityDisplay}`}
            fill
            sizes="(max-width: 1024px) 200vw, 100vw"
            quality={90}
            className={`object-cover ${heroImagePosition} lg:object-center`}
            priority
          />
          <div className="absolute inset-0 bg-[rgba(7,7,7,0.35)]" />
        </div>

        <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
          <div className="flex flex-col gap-4 lg:gap-6 max-w-[920px]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 w-fit bg-[rgba(13,13,13,0.55)] backdrop-blur-[10px] rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[-0.48px] leading-[1.2] text-white">
                {config.heroEyebrow}
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-sans font-bold text-[40px] lg:text-[80px] leading-[1.05] tracking-[-1.2px] lg:tracking-[-2.4px] text-white">
              <span className="text-[#FFE533]">{h1HighlightNb}</span>{" "}
              {config.h1Suffix}
            </h1>

            <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white max-w-[720px]">
              {config.heroSubtitle}
            </p>

            <div className="mp5-hero-cta flex flex-col lg:flex-row gap-3 lg:gap-4 pt-2">
              <MP5Button
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
              >
                Get Free Estimate
              </MP5Button>
              <MP5Button size="sm" variant="secondary" href="tel:+13805240846">
                +1 (380) 524-0846
              </MP5Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== OUR SERVICES ========================== */}
      <ServicesSection
        label="Our Services"
        title={`Full-Service Moving in ${cityNb}`}
        subtitle={config.servicesSubtitle}
        services={services}
      />

      {/* ========================== WHY GOAT (long-distance-style trust block) ========================== */}
      <WhyTrustSection
        label={`Why ${city}`}
        title={config.whyTitle}
        description={config.whyDescription}
        image="/images/long-distance-why-trust.png"
        imageAlt={`GOAT Movers crew working in ${cityDisplay}`}
      />

      {/* ========================== WHAT'S INCLUDED ========================== */}
      <WhatsIncludedSection
        label="What's Included"
        title={`Included in Every ${city} Move`}
        subtitle={config.whatsIncludedSubtitle}
        items={includedItems}
      />

      {/* ========================== REVIEWS ========================== */}
      <ReviewsSection
        title={`What ${cityNb} Customers Say`}
      />

      {/* ========================== HOW IT WORKS ========================== */}
      <HowItWorksSection
        title={`How Your ${city} Move Works`}
      />

      {/* ========================== CTA ========================== */}
      <CTABanner
        heading={config.ctaHeading}
        tagline={config.ctaTagline}
        buttonText="Get Your Free Quote"
      />

      {/* ========================== FAQ ========================== */}
      <FAQSection
        title={`Frequently Asked Questions — ${cityNb} Movers`}
        items={config.faqs}
      />

      {/* Hidden SEO helper — makes the state appear in rendered HTML for indexing */}
      <span className="sr-only">{`Movers in ${cityDisplay}. ${state} licensed moving company.`}</span>
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
