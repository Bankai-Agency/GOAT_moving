"use client";

import { useEffect } from "react";
import Image from "next/image";
import { LPTerminalNav } from "./LPTerminalNav";
import { AboutSection } from "./sections/AboutSection";
import { CTABanner } from "./sections/CTABanner";
import { LPCtaForm } from "./sections/LPCtaForm";
import { FAQSection } from "./sections/FAQSection";
import { EstimateIcon, PlanIcon, TruckIcon, HomeIcon } from "./sections/HowItWorksSection";
import { LPProcess } from "./sections/LPProcess";
import { ServicesSection } from "./sections/ServicesSection";
import { ServiceAreaSection } from "./sections/ServiceAreaSection";
import { defaultIncludedItems } from "./sections/WhatsIncludedSection";
import { LPSolution } from "./sections/LPSolution";
import { LocalMovingRatesSection } from "./sections/LocalMovingRatesSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { ContactFooter } from "./sections/ContactFooter";
import { Touchbar } from "./sections/Touchbar";
import { QuoteModal } from "./ui/QuoteModal";
import { LPQuoteForm } from "./ui/LPQuoteForm";
import { LeadForm } from "./ui/LeadForm";
import type { CityLPConfig } from "./config/cityConfigs";

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
  const { city, heroImage, heroImagePosition = "object-center", socialProofImage } = config;

  /* Footer Navigation column reuses ContactFooter's hard-coded
     /local-moving / /reviews / /contacts <Link>s. On the LP those
     would yank the user off-page — intercept the clicks and remap
     to the LP's anchor sections instead. */
  useEffect(() => {
    const HREF_TO_ANCHOR: Record<string, string> = {
      "/local-moving": "#services",
      "/long-distance-moving": "#services",
      "/commercial-moving": "#services",
      "/packing-services": "#services",
      "/reviews": "#reviews",
      "/faq": "#faq",
      "/contacts": "#contact",
    };
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const footer = target.closest("footer#contact");
      if (!footer) return;
      const href = target.getAttribute("href") || "";
      const anchor = HREF_TO_ANCHOR[href];
      if (!anchor) return;
      e.preventDefault();
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

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
    <>
      {/* Floating nav lives OUTSIDE .page-zoom so it renders at the
         same 1:1 scale as mainpage-5's TerminalNav (the rest of the
         LP keeps its proportional `zoom` scale-down for visual
         continuity with the existing pages). */}
      <LPTerminalNav />
      <div className="page-zoom">
      <main>

      {/* ───────────── 1. HERO ─────────────
          Full-bleed: image stretches to the viewport edges (no side
          margins, no rounded corners) and fills 100dvh including the
          area beneath the floating nav. Inner content stays aligned
          to the standard 1408px content grid + horizontal padding. */}
      <section className="bg-[#0c0c0c]">
        {/* data-lp-hero marks this card as a "dark island" inside the
           light theme — keeps text/border whites white over the photo
           bg, see _shared/lp-theme.css. */}
        <div data-lp-hero="" className="relative bg-[#181818] h-[100dvh] overflow-hidden">
          {/* Image + overlays fill the full hero box — no clip radius. */}
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={`Professional movers in ${city}`}
              fill
              sizes="100vw"
              quality={90}
              className={`object-cover object-[45%_center] lg:object-[center_25%]`}
              priority
            />
            {/* Gradient overlays — dark where text is, clear where mover is */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, transparent 70%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)' }} />
          </div>

          {/* Content layer — h-full so it stretches exactly to 100dvh.
             Two-level structure to align with other LP sections:
               • Outer: full-viewport width + px-4 + top padding for nav.
               • Inner: max-w-[1408px] mx-auto — same container width.
             Image stays full-bleed since it's in a sibling absolute div. */}
          <div className="relative z-10 h-full px-4 pt-[100px] lg:pt-[108px] lg:pb-[108px]">
          <div className="max-w-[1408px] mx-auto h-full">

          {/* Hero content — flex justify-center pins copy to the
              vertical CENTER of the full-screen hero (was justify-end
              which glued it to the bottom). */}
          <div className="relative flex flex-col justify-end lg:justify-center h-full pb-6 lg:pb-0 gap-5 lg:gap-5">
            {/* Desktop: two columns — text on left, form on right
                aligned to the bottom (items-end). Mobile collapses
                to a single column; the form for mobile renders
                below the hero image (lg:hidden block further down). */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] lg:items-center lg:gap-12">
              {/* LEFT — rating + h1 + description */}
              <div className="flex flex-col gap-4 lg:gap-5">
                {/* Rating strip — same glass settings as the floating
                   nav (rgba(0,0,0,0.3) + blur(30px)) so the bullets
                   read as the same surface family. */}
                <div className="inline-flex items-center gap-2 backdrop-blur-[30px] bg-[rgba(0,0,0,0.3)] rounded-full pl-2.5 pr-3 py-1.5 lg:px-4 lg:py-2 w-fit">
                  <a href="https://www.yelp.com/biz/goat-movers-vancouver" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 lg:gap-2 pr-2.5 lg:pr-3 border-r border-white/15 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded bg-[#FF2828] shrink-0"><Image src="/icons/yelp-white.svg" alt="Yelp" width={12} height={12} style={{ width: "auto", height: "12px" }} /></div>
                    <span className="font-sans font-semibold text-xs lg:text-sm text-white whitespace-nowrap"><span className="hidden lg:inline">Yelp </span><span className="text-white">4.79</span><span className="text-white/40">/5</span></span>
                  </a>
                  <a href="https://www.google.com/maps/place/GOAT+MOVERS/@45.5454821,-122.635238,10z/data=!3m1!4b1!4m6!3m5!1s0xa4790ebd1e7ffb07:0x697d406165de98a5!8m2!3d45.5454821!4d-122.635238!16s%2Fg%2F11wbt8363h?entry=ttu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 lg:gap-2 pl-0.5 lg:pl-1 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded bg-white shrink-0"><Image src="/icons/google-color.svg" alt="Google" width={14} height={14} /></div>
                    <span className="font-sans font-semibold text-xs lg:text-sm text-white whitespace-nowrap"><span className="hidden lg:inline">Google </span><span className="text-white">4.98</span><span className="text-white/40">/5</span></span>
                  </a>
                  <span className="inline-block pl-2.5 ml-0.5 lg:pl-3 lg:ml-1 border-l border-white/15 font-sans font-medium text-xs lg:text-sm tracking-[-0.3px] text-white/70 whitespace-nowrap">437+<span className="hidden lg:inline"> Verified</span> Reviews</span>
                </div>
                {/* Typography matched to mainpage-5: font-normal (not
                   bold), larger sizes, tighter tracking, lower line-
                   height for big text. */}
                <h1 className="font-sans font-normal text-[56px] sm:text-[72px] lg:text-[112px] leading-[0.95] tracking-[-1.4px] sm:tracking-[-2px] lg:tracking-[-3.4px] text-white">
                  Stress-Free
                  <br />
                  Movers in
                  <br />
                  <span className="text-[#FFE533]">{city}</span>
                </h1>
                <p className="font-sans font-normal text-base lg:text-xl leading-[1.5] tracking-[-0.3px] text-white/80 max-w-[560px]">
                  We show up on time, handle your belongings with care, and give you a clear quote upfront. Most moves in {city} cost $400–$900.
                </p>
              </div>

              {/* RIGHT — shared LPQuoteForm (white card) on desktop.
                  Same surface as LPCtaForm so both forms read
                  identically. White contrasts strongly with the
                  dark hero photo behind. */}
              <div className="hidden lg:block relative z-40 w-full max-w-[520px] lg:ml-auto">
                <LPQuoteForm city={city} />
              </div>
            </div>
          </div>
          </div>
        </div>
        </div>

        {/* Mobile form — BELOW the hero image (not overlaid).
            Same shared LPQuoteForm wrapper for visual consistency.
            `shadow-none!` strips the card's default drop-shadow on
            this instance — it sits on the white page bg and the
            shadow reads as a grey halo there. */}
        <div className="lg:hidden mx-4 mt-4">
          <LPQuoteForm city={city} className="shadow-none!" />
        </div>
      </section>

      {/* 2. Services (moved up — was after CTABanner) */}
      <ServicesSection
        label="Our Services"
        title={
          <>
            Find the Right Moving Service
            <br />
            for Your Situation
          </>
        }
        subtitle={`Full-service moving across ${city} — from packing to unloading. No hidden fees, no charge for stairs.`}
        services={services}
      />

      {/* 3. Solution / Benefits — LP-only horizontal-scroll layout. */}
      <LPSolution
        label="Our Solution"
        title={`How We Make Moving in ${city} Predictable and Stress‑Free`}
        subtitle={`One hourly rate — everything your ${city} move needs, included.`}
        items={includedItems}
      />

      {/* 4. Social proof */}
      <AboutSection
        label="Social Proof"
        title={
          <>
            Trusted by Hundreds
            <br />
            of&nbsp;{city} Customers
          </>
        }
        description={config.aboutDescription}
        stats={socialProofStats}
        {...(socialProofImage ? { videoPoster: socialProofImage } : {})}
      />


      {/* 5. Process — LP-only layout (left sticky heading + right
            card stack, always-on auto-animating spotlight). The
            section already provides id="process" internally, so no
            wrapper div needed. */}
      <LPProcess
        title={
          <>
            Your Move,
            <br className="hidden lg:block" />{" "}
            Fully Controlled
          </>
        }
        steps={processSteps}
      />

      {/* 6. CTA banner (with button) — emotional / aspirational
            angle: shorter, punchier headline + click-to-modal flow. */}
      <CTABanner
        heading={`Ready to Move in ${city}?`}
        tagline="No hidden fees. No hourly surprises. Fully licensed and insured."
        buttonText="Get Your Free Quote"
      />

      {/* 8. Testimonials — default reviews carousel */}
      <ReviewsSection title={<>Real Moves. Real Reviews. No&nbsp;Surprises.</>} />

      {/* 9. Service area — neighborhoods */}
      <ServiceAreaSection
        label="Service Area"
        title={`We're Already Moving People in ${city}`}
        subtitle={config.serviceAreaSubtitle}
        areas={neighborhoodsAreas}
        columns="4"
      />

      {/* 10. FAQ */}
      <FAQSection title="Frequently Asked Questions" items={config.faqs} />
      </main>

      {/* 11. Lead-capture CTA with embedded form — utilitarian
            angle: "fill the form right here, get a real number".
            Distinct content from the click-to-modal CTABanner above
            so the two CTAs don't duplicate the same message. */}
      <LPCtaForm
        heading="Tell Us About Your Move"
        tagline={`Share a few details and we'll send a real ${city} quote — not a sales pitch. Most moves estimated in under a minute.`}
        city={city}
      />

      <ContactFooter />
      <Touchbar />
      <QuoteModal />
      </div>
    </>
  );
}
