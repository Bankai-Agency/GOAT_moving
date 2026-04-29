"use client";

import Image from "next/image";
import { HeaderLP } from "@/components/layout/HeaderLP";
import { AboutSection } from "@/components/sections/AboutSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { HowItWorksSection, EstimateIcon, PlanIcon, TruckIcon, HomeIcon } from "@/components/sections/HowItWorksSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { WhatsIncludedSection, defaultIncludedItems } from "@/components/sections/WhatsIncludedSection";
import { LocalMovingRatesSection } from "@/components/sections/LocalMovingRatesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { StepQuoteForm } from "@/components/ui/StepQuoteForm";
import { LeadForm } from "@/components/ui/LeadForm";
import type { CityLPConfig } from "./cityConfigs";

/* ───────────── Constants shared across cities ───────────── */
const socialProofStats = [
  { icon: "/icons/star.svg", value: "4.9", label: "Google Rating" },
  { icon: "/icons/review.svg", value: "437+", label: "Verified Reviews" },
  { icon: "/icons/year.svg", value: "500+", label: "Moves Completed" },
  { icon: "/icons/license.svg", value: "100%", label: "Licensed & Insured" },
];

const pricingEstimates = [
  { title: "Studio / 1 Bedroom", price: "$400 – $700", crew: "2 movers + truck" },
  { title: "2 Bedroom", price: "$600 – $900", crew: "2–3 movers", popular: true },
  { title: "3+ Bedroom", price: "$900+", crew: "3–4 movers" },
] as const;

export function CityLandingPage({ config }: { config: CityLPConfig }) {
  const { city, heroImage, heroImagePosition = "object-center" } = config;

  /* Solution items: start from defaults, override only descriptions that vary by city. */
  const includedItems = defaultIncludedItems.map((item) => {
    switch (item.title) {
      case "Moving Truck & Fuel":
        return { ...item, description: config.solutionCopy.truck };
      case "Professional Movers":
        return { ...item, description: "Trained, background-checked crew. Careful with your belongings from door to door." };
      case "Equipment":
        return { ...item, description: config.solutionCopy.equipment };
      case "Furniture Disassembly/\nReassembly":
        return { ...item, description: "Bed frames, IKEA pieces, and basic furniture taken apart and put back together at no extra cost." };
      case "Floor & Door Protection":
        return { ...item, description: config.solutionCopy.floorProtection };
      case "Same-Day Service":
        return { ...item, description: `Most local ${city} moves completed in a single visit — no second trip, no second bill.` };
      default:
        return item;
    }
  });

  /* Services: 4 cards. Local Moving copy is city-specific; the rest follow a shared template. */
  /* LP cards: no href — clicking opens the quote modal instead of navigating away. */
  const services = [
    {
      title: "Local Moving",
      description: config.localMovingDescription,
      number: "1",
      image: "/images/service-local.png",
    },
    {
      title: "Long Distance Moving",
      description: `Interstate moves out of ${city} across the US. Fully licensed (USDOT #4232069) and insured for cross-state relocations of any size.`,
      number: "2",
      image: "/images/service-longdistance.jpg",
    },
    {
      title: "Commercial Moving",
      description:
        config.commercialDescription ??
        `Office and commercial relocations across ${city} with minimal downtime. Equipment, furniture, and sensitive documents handled safely and on schedule.`,
      number: "3",
      image: "/images/service-commercial.png",
    },
    {
      title: "Packing & Labor",
      description:
        "Professional packing with quality materials, same-building moves, and loading/unloading labor. Expert handling of fragile and specialty items.",
      number: "4",
      image: "/images/service-packing.png",
    },
  ];

  /* Process: 4 steps. First three are shared; step 4 references the city. */
  const processSteps = [
    {
      icon: <EstimateIcon />,
      title: "Get Your Free Quote",
      description: "We calculate and confirm your fixed price — no time windows, no last-minute changes.",
    },
    {
      icon: <PlanIcon />,
      title: "Approve Your Plan",
      description: "You confirm timing and scope. We lock it in — the price you see is the price you pay.",
    },
    {
      icon: <TruckIcon />,
      title: "Move Without Surprises",
      description: "We deliver exactly as agreed. No hidden fees, no hourly surprises, no stress.",
    },
    {
      icon: <HomeIcon />,
      title: "Settle Into Your New Place",
      description: `We unload, reassemble your furniture, and place everything where you want it — your ${city} move, done right.`,
    },
  ];

  const neighborhoodsAreas = config.neighborhoods.map((n) => ({ city: n }));

  return (
    <div className="page-zoom">
      <HeaderLP />
      <main>

      {/* ───────────── 1. HERO ─────────────
          Image container stretches to (viewport - 32px × 2) on desktop
          for a cinematic look, while the inner content (title, form, rating
          strip) stays aligned to the standard 1408px content grid. */}
      <section className="bg-[#0c0c0c] pt-[100px] lg:pt-[108px] pb-[24px] lg:pb-[24px]">
        <div className="mx-4 lg:mx-8 relative rounded-2xl bg-[#181818] min-h-[560px] lg:min-h-[calc(100dvh_-_132px)]">
          {/* Image + overlays clipped to rounded corners, but content grid is NOT
              clipped — so form dropdowns (date/size) can extend below the hero. */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <Image
              src={heroImage}
              alt={`Professional movers in ${city}`}
              fill
              sizes="(max-width: 1024px) 200vw, 100vw"
              quality={90}
              className={`object-cover ${heroImagePosition} lg:object-[center_25%]`}
              priority
            />
            {/* Gradient overlays — dark where text is, clear where mover is */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, transparent 70%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)' }} />
          </div>

          {/* Inner content grid — constrained to 1408px, centered */}
          <div className="relative z-10 min-h-[560px] lg:min-h-[calc(100dvh_-_132px)] max-w-[1408px] mx-auto">

          {/* Hero content — pinned to bottom, hero grows if content overflows */}
          <div className="relative flex flex-col justify-end min-h-[560px] lg:min-h-[calc(100dvh_-_132px)] p-6 lg:px-0 lg:pb-[48px] lg:pt-8 gap-5 lg:gap-5">
            {/* Rating strip + title + description */}
            <div className="flex flex-col gap-4 lg:gap-5">
              {/* Rating strip */}
              <div className="inline-flex items-center gap-2 backdrop-blur-[15px] bg-[rgba(13,13,13,0.5)] rounded-full pl-2.5 pr-3 py-1.5 lg:px-4 lg:py-2 w-fit">
                <a href="https://www.yelp.com/biz/goat-movers-vancouver" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 lg:gap-2 pr-2.5 lg:pr-3 border-r border-white/15 hover:opacity-80 transition-opacity">
                  <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded bg-[#FF2828] shrink-0"><Image src="/icons/yelp.svg" alt="Yelp" width={12} height={12} /></div>
                  <span className="font-sans font-semibold text-xs lg:text-sm text-white whitespace-nowrap"><span className="hidden lg:inline">Yelp </span><span className="text-[#FFE533]">4.79</span><span className="text-white/40">/5</span></span>
                </a>
                <a href="https://www.google.com/maps/place/GOAT+MOVERS/@45.5454821,-122.635238,10z/data=!3m1!4b1!4m6!3m5!1s0xa4790ebd1e7ffb07:0x697d406165de98a5!8m2!3d45.5454821!4d-122.635238!16s%2Fg%2F11wbt8363h?entry=ttu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 lg:gap-2 pl-0.5 lg:pl-1 hover:opacity-80 transition-opacity">
                  <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded bg-[#357DFF] shrink-0"><Image src="/icons/google.svg" alt="Google" width={12} height={12} /></div>
                  <span className="font-sans font-semibold text-xs lg:text-sm text-white whitespace-nowrap"><span className="hidden lg:inline">Google </span><span className="text-[#FFE533]">4.98</span><span className="text-white/40">/5</span></span>
                </a>
                <span className="inline-block pl-2.5 ml-0.5 lg:pl-3 lg:ml-1 border-l border-white/15 font-mono font-bold text-[10px] lg:text-xs uppercase tracking-[-0.48px] text-white/70 whitespace-nowrap">437+<span className="hidden lg:inline"> Verified</span> Reviews</span>
              </div>
              <h1 className="font-sans font-bold text-[40px] lg:text-[80px] leading-[1.05] tracking-[-1.2px] lg:tracking-[-2.4px] text-white">
                Stress-Free
                <br />
                Movers in
                <br />
                <span className="text-[#FFE533]">{city}</span>
              </h1>
              <p className="font-sans font-bold text-[28px] lg:text-[40px] leading-[1.1] tracking-[-0.84px] lg:tracking-[-1.2px] text-white">
                $125/Hour
              </p>
              <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/80 max-w-[500px]">
                We show up on time, handle your belongings with care, and give you a clear quote upfront. Most moves in {city} cost $400–$900.
              </p>

              {/* Desktop: horizontal form bar — right after description.
                  Elevated z-index so date/size dropdowns overlay the next section. */}
              <div className="hidden lg:block mt-4 backdrop-blur-[20px] bg-[rgba(24,24,24,0.85)] rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative z-40">
                <StepQuoteForm heading="Get your free quote" city={city} horizontal />
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Mobile form — BELOW the hero image (not overlaid). Hidden on desktop. */}
        <div className="lg:hidden mx-4 mt-4 bg-[#181818] rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <StepQuoteForm heading="Get your free quote" city={city} />
        </div>
      </section>

      {/* 2. Social proof */}
      <AboutSection
        label="Social Proof"
        title={`Trusted by Hundreds of ${city} Customers`}
        description={config.aboutDescription}
        stats={socialProofStats}
      />

      {/* 3. Solution / Benefits */}
      <WhatsIncludedSection
        label="Our Solution"
        title={`How We Make Moving in ${city} Predictable and Stress-Free`}
        subtitle={`One hourly rate — everything your ${city} move needs, included.`}
        items={includedItems}
      />


      {/* CTA banner right after pricing */}
      <CTABanner
        heading={`Get Your Free Moving Quote in ${city} in 30 Seconds`}
        tagline="No hidden fees. No hourly surprises. Fully licensed and insured."
        buttonText="Get Your Free Quote"
      />

      {/* 6. Services */}
      <ServicesSection
        label="Our Services"
        title="Find the Right Moving Service for Your Situation"
        subtitle={`Full-service moving across ${city} — from packing to unloading. No hidden fees, no charge for stairs.`}
        services={services}
      />

      {/* 7. Process */}
      <div id="process">
        <HowItWorksSection
          title="How Your Move Works — Simple, Clear, Fully Controlled"
          steps={processSteps}
        />
      </div>

      {/* 8. Testimonials — default reviews carousel */}
      <ReviewsSection title="Real Moves. Real Reviews. No Surprises." />

      {/* 9. Service area — neighborhoods */}
      <ServiceAreaSection
        label="Service Area"
        title={`We're Already Moving People in ${city}`}
        subtitle={config.serviceAreaSubtitle}
        areas={neighborhoodsAreas}
        columns="4"
      />

      {/* 10. FAQ */}
      <FAQSection title="Frequently Asked Questions" items={config.faqs} />
      </main>

      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
