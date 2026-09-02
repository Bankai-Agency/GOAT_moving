"use client";

import { useEffect, useRef, useState } from "react";
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
import { commercialContent as content, nbCity, siteContent, type IconItem } from "@/lib/content";
import { SiteIcon } from "@/lib/content/icons";
import { formatPhone, phoneHref } from "@/lib/content/phone";

/* Page copy lives in `src/content/services/commercial-moving.json`
   (admin panel → Страницы → Commercial Moving). */

/* ===================== HERO ===================== */
function CMHero() {
  const { hero } = content;
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden bg-black">
      <div aria-hidden className="lg:hidden absolute inset-0" style={{ background: "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)" }} />
      <div className="absolute inset-0 max-lg:top-[88px] max-lg:bottom-[51dvh]">
        <Image src={hero.image} alt={hero.imageAlt} fill sizes="(max-width: 1024px) 200vw, 100vw" quality={90} className="object-cover object-[30%_center] lg:object-center" priority />
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

/* ===================== INDUSTRIES SERVED ===================== */

/* Industry card with the same hover the old What's Included cards had:
   floating yellow blob glows hidden behind an opaque layer that turns
   to frosted glass on hover (desktop) / scroll-into-view (mobile),
   revealing the glow through the blur. */
function IndustryCard({ ind, index }: { ind: IconItem; index: number }) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasHoverRef = useRef(true);

  // Different delays/positions per card so the blobs don't move in sync.
  const a = index % 3;
  const b = index % 5;
  const c = (index + 2) % 4;

  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches;
    hasHoverRef.current = !isMobile;
    if (!isMobile) return;

    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => { if (hasHoverRef.current) setIsActive(true); }}
      onMouseLeave={() => { if (hasHoverRef.current) setIsActive(false); }}
      className="group relative overflow-hidden rounded-xl lg:rounded-2xl bg-[#181818]"
    >
      {/* Animated yellow glow blobs — floating, hidden behind the opaque layer until active */}
      <div
        aria-hidden
        className="absolute top-[20%] left-[10%] w-48 h-48 lg:w-64 lg:h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,229,51,0.55) 0%, rgba(255,229,51,0) 70%)",
          filter: "blur(40px)",
          animation: "blob-float-a 6s ease-in-out infinite",
          animationDelay: `-${a * 1.5}s`,
          willChange: "transform",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-[5%] right-[10%] w-40 h-40 lg:w-56 lg:h-56 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,229,51,0.45) 0%, rgba(255,229,51,0) 70%)",
          filter: "blur(45px)",
          animation: "blob-float-b 5s ease-in-out infinite",
          animationDelay: `-${b * 1.1}s`,
          willChange: "transform",
        }}
      />
      <div
        aria-hidden
        className="absolute top-[40%] right-[25%] w-32 h-32 lg:w-44 lg:h-44 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,229,51,0.35) 0%, rgba(255,229,51,0) 70%)",
          filter: "blur(35px)",
          animation: "blob-float-c 7s ease-in-out infinite",
          animationDelay: `-${c * 1.3}s`,
          willChange: "transform",
        }}
      />

      {/* Opaque layer → frosted glass on active, revealing the blobs through it */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-[background,backdrop-filter] duration-700 ease-out"
        style={{
          background: isActive ? "rgba(24, 24, 24, 0.25)" : "rgba(24, 24, 24, 1)",
          backdropFilter: isActive ? "blur(22px)" : "blur(0px)",
          WebkitBackdropFilter: isActive ? "blur(22px)" : "blur(0px)",
        }}
      />

      {/* Content (unchanged layout): icon chip top, title + description pinned to bottom */}
      <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-4 lg:gap-5 min-h-[200px] lg:min-h-[240px]">
        <div
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl text-[#FFE533] flex items-center justify-center shrink-0 transition-all duration-500"
          style={{
            backgroundColor: isActive ? "rgba(255, 229, 51, 0.22)" : "rgba(255, 229, 51, 0.10)",
            boxShadow: isActive ? "0 0 28px rgba(255, 229, 51, 0.28)" : "none",
          }}
        >
          <SiteIcon name={ind.icon} size={28} />
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <h3 className="font-sans font-bold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.84px] text-white">
            {ind.title}
          </h3>
          <p className="font-sans font-normal text-base leading-[1.5] tracking-[-0.48px] text-white/60">
            {ind.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function CMIndustries() {
  const { industries } = content;
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">{industries.label}</span>
            </div>
          </div>
          <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
            {industries.title}
          </h2>
        </div>

        {/* Industry cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {industries.items.map((ind, i) => (
            <IndustryCard key={i} ind={ind} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== MAIN ===================== */
export default function CommercialMovingClient() {
  return (
    <div className="page-zoom">
      <main>
        <CMHero />
        <WhatsIncludedSection
          label={content.whatsIncluded.label}
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
        />
        <HowItWorksSection title={content.howItWorks.title} steps={content.howItWorks.steps} />
        <CMIndustries />
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
