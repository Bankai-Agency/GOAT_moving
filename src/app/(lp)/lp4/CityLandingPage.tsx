"use client";

import { useEffect, type CSSProperties } from "react";
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
import { ReviewsSection, portlandReviews } from "./sections/ReviewsSection";
import { ContactFooter } from "./sections/ContactFooter";
/* DarkScrollZone removed in lp3 — uniform dark page, no scroll-veil transitions. */
import { FooterParallax } from "./FooterParallax";
import { Touchbar } from "./sections/Touchbar";
import { QuoteModal } from "./ui/QuoteModal";
import { LPQuoteForm } from "./ui/LPQuoteForm";
import type { CityLPConfig } from "./config/portland";

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
  /* A/B test flag — ONLY Portland gets the revised hero (smaller two-
     line headline, labelled rating strip, price-hook subheads, and a
     shorter mobile height so the form peeks above the fold). Every
     other city stays on the original baseline until the test ends. */
  const isPortland = config.slug === "movers-portland";
  /* Rating-strip labels (Yelp/Google/Verified) are desktop-only on the
     baseline; on Portland mobile they stay visible per the hero spec. */
  const ratingLabelCls = isPortland ? "" : "hidden lg:inline";
  /* Desktop hero top padding. Portland pushes the whole hero block
     (text + form) lower per client; other cities keep the tighter
     baseline. clamp(120px,18dvh,200px) holds the safe 120px on short
     viewports (≤~667px tall — the form would otherwise clip at the
     bottom) and scales the block downward only where there's room. */
  const heroDesktopTopPad = isPortland ? "lg:pt-[clamp(120px,18dvh,200px)]" : "lg:pt-[108px]";

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
      image: "/images/service-local.webp",
    },
    {
      title: "Long Distance Moving",
      description: `Interstate moves out of ${city} across the US. Fully licensed (USDOT #4232069) and insured for cross-state relocations of any size.`,
      number: "2",
      image: config.longDistanceImage ?? "/images/service-longdistance.webp",
    },
    {
      title: "Commercial Moving",
      description:
        config.commercialDescription ??
        `Office and commercial relocations across ${city} with minimal downtime. Equipment, furniture, and sensitive documents handled safely and on schedule.`,
      number: "3",
      image: "/images/service-commercial.webp",
    },
    {
      title: "Packing & Labor",
      description:
        "Professional packing with quality materials, same-building moves, and loading/unloading labor. Expert handling of fragile and specialty items.",
      number: "4",
      image: "/images/service-packing.webp",
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
      <LPTerminalNav showPhoneNumber portland={isPortland} />
      <main>

      {/* ───────────── 1. HERO ─────────────
          Hero is OUTSIDE .page-zoom so it renders at the device's
          true 100dvh — the rest of the page is zoomed down to fit
          the design reference grid but the hero must stay full-bleed
          on every screen size.
          Full-bleed: image stretches to the viewport edges (no side
          margins, no rounded corners) and fills 100dvh including the
          area beneath the floating nav. Inner content stays aligned
          to the standard 1408px content grid + horizontal padding. */}
      <section className="bg-[#0c0c0c]">
        {/* data-lp-hero marks this card as a "dark island" inside the
           light theme — keeps text/border whites white over the photo
           bg, see _shared/lp-theme.css. */}
        <div data-lp-hero="" className={`relative bg-[#181818] overflow-hidden h-[100dvh] ${isPortland ? "lp-hero--portland" : ""}`}>
          {/* Image + overlays. Desktop: full-bleed (inset-0). Mobile: a
             BAND from below the floating nav (top-[88px]) down to just
             above the headline (bottom-[38dvh]); both edges dissolve
             gradually into the hero's solid #181818 so the image → dark
             transition is smooth, not a hard cut. */}
          <div className={`absolute inset-0 max-lg:top-[88px] ${isPortland ? "max-lg:bottom-[20dvh]" : "max-lg:bottom-[38dvh]"} max-lg:overflow-hidden`}>
            <Image
              src={heroImage}
              alt={`Professional movers in ${city}`}
              fill
              sizes="100vw"
              quality={90}
              className={`object-cover ${isPortland ? "object-[40%_center] lg:object-[center_35%] lg:scale-[1.2] lg:translate-x-[-9%] max-lg:scale-[1.1] max-lg:origin-center" : "object-[62%_center] lg:object-[center_25%]"}`}
              priority
            />
            {/* Gradient overlays — dark where text is, clear where mover is.
               Desktop: dark on the LEFT (text column) + bottom. */}
            <div className="hidden lg:block absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, transparent 70%)' }} />
            <div className="hidden lg:block absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)' }} />
            {/* Mobile: the image is a band sitting below the nav. Dissolve
               BOTH edges into the hero's solid #181818 — top into the dark
               nav strip, bottom into the dark headline area. */}
            <div className="lg:hidden absolute inset-0" style={{ background: 'linear-gradient(to bottom, #181818 0%, rgba(24,24,24,0.5) 15%, rgba(24,24,24,0.15) 30%, transparent 46%)' }} />
            <div className="lg:hidden absolute inset-0" style={{ background: 'linear-gradient(to top, #181818 0%, rgba(24,24,24,0.82) 14%, rgba(24,24,24,0.45) 32%, rgba(24,24,24,0.15) 46%, transparent 62%)' }} />
          </div>

          {/* Content layer — h-full so it stretches exactly to 100dvh.
             Two-level structure to align with other LP sections:
               • Outer: full-viewport width + px-4 + top padding for nav.
               • Inner: max-w-[1408px] mx-auto — same container width.
             Image stays full-bleed since it's in a sibling absolute div. */}
          <div className={`relative z-10 h-full px-4 pt-[100px] ${heroDesktopTopPad} lg:pb-[108px]`}>
          <div className="max-w-[1408px] mx-auto h-full">

          {/* Hero content. Desktop: justify-start pins the grid below
              the floating nav (pt-[108px] clears the 20px+78px bar) — the
              quote form is taller than the centered space, so centering
              pushed its top edge up under the nav. items-center on the
              grid still vertically centers the shorter text column next
              to the tall form. Mobile keeps justify-end. */}
          <div className={`relative flex flex-col justify-end lg:justify-start h-full ${isPortland ? "pb-[2dvh]" : "pb-6"} lg:pb-0 gap-5 lg:gap-5`}>
            {/* Desktop: two columns — text on left, form on right
                aligned to the bottom (items-end). Mobile collapses
                to a single column; the form for mobile renders
                below the hero image (lg:hidden block further down). */}
            <div className={`grid grid-cols-1 ${isPortland ? "lg:grid-cols-[minmax(0,1fr)_520px] lg:items-end" : "lg:grid-cols-[1fr_520px] lg:items-center"} lg:gap-12`}>
              {/* LEFT — rating + h1 + description */}
              <div className="flex flex-col gap-4 lg:gap-5">
                {/* Rating strip — same glass settings as the floating
                   nav (rgba(0,0,0,0.3) + blur(30px)) so the bullets
                   read as the same surface family. */}
                <div className={`inline-flex items-center gap-2 w-fit lg:backdrop-blur-[30px] lg:bg-[rgba(0,0,0,0.3)] lg:rounded-full lg:px-4 lg:py-2 lg:overflow-hidden ${isPortland ? "max-lg:flex-wrap max-lg:gap-y-1.5" : ""}`}>
                  {/* Yelp + Google grouped so the two ratings never split
                     across lines on narrow mobile (customer request). */}
                  <div className="inline-flex items-center gap-2 whitespace-nowrap">
                  <a href="https://www.yelp.com/biz/goat-movers-vancouver" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 lg:gap-2 pr-2.5 lg:pr-3 border-r border-white/15 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded bg-[#FF2828] shrink-0"><Image src="/icons/yelp-white.svg" alt="Yelp" width={12} height={12} style={{ width: "auto", height: "12px" }} /></div>
                    <span className="font-sans font-semibold text-xs lg:text-sm text-white whitespace-nowrap"><span className={ratingLabelCls}>Yelp </span><span className="text-white">4.79</span><span className="text-white/40">/5</span></span>
                  </a>
                  <a href="https://www.google.com/maps/place/GOAT+MOVERS/@45.5454821,-122.635238,10z/data=!3m1!4b1!4m6!3m5!1s0xa4790ebd1e7ffb07:0x697d406165de98a5!8m2!3d45.5454821!4d-122.635238!16s%2Fg%2F11wbt8363h?entry=ttu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 lg:gap-2 pl-0.5 lg:pl-1 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded bg-white shrink-0"><Image src="/icons/google-color.svg" alt="Google" width={14} height={14} /></div>
                    <span className="font-sans font-semibold text-xs lg:text-sm text-white whitespace-nowrap"><span className={ratingLabelCls}>Google </span><span className="text-white">4.98</span><span className="text-white/40">/5</span></span>
                  </a>
                  </div>
                  <span className={`inline-block pl-2.5 ml-0.5 lg:pl-3 lg:ml-1 border-l border-white/15 font-sans font-medium text-xs lg:text-sm tracking-[-0.3px] text-white/70 whitespace-nowrap ${isPortland ? "max-lg:hidden" : ""}`}>437+<span className={ratingLabelCls}> Verified</span> Reviews</span>
                </div>
                {/* Hero headline + subheads.
                   A/B test: ONLY Portland (slug "movers-portland") gets
                   the revised "Top-Rated …" headline + price-hook subheads.
                   Every other city keeps the original "Stress-Free Movers
                   in {city}" variant as the A/B baseline — do not unify
                   these until the test concludes. */}
                {isPortland ? (
                  <>
                    {/* Single white color — no accent span. Two lines on
                       every viewport: "Top-Rated" / "{city} Movers".
                       At lg:88px "Portland Movers" still fits the left
                       column on one line. */}
                    <h1 className="font-sans font-normal text-[clamp(32px,9vw,44px)] sm:text-[64px] lg:text-[88px] leading-[0.98] lg:leading-[0.95] tracking-[-1.2px] sm:tracking-[-2px] lg:tracking-[-2.6px] text-white">
                      Top-Rated
                      <br />
                      {city} Movers
                    </h1>
                    {/* Single subhead: price hook (rate highlighted) +
                       the trust line. The secondary "$400–$900" budget
                       line was removed per client — a PDF price block
                       will replace it later. */}
                    <p className="font-sans font-normal text-xl sm:text-2xl lg:text-[28px] leading-[1.3] tracking-[-0.5px] text-white max-w-[560px]">
                      Trusted in&nbsp;{config.licenseState}{" "}from&nbsp;
                      <span className="text-[#FFE533] font-semibold">$125/hr</span>
                      <br />
                      Careful handling&nbsp;—&nbsp;no&nbsp;hidden fees
                    </p>
                  </>
                ) : (
                  <>
                    {/* Original A/B baseline — all non-Portland cities.
                       Typography matched to mainpage-5: font-normal, big
                       sizes, tight tracking, low line-height. */}
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
                  </>
                )}
              </div>

              {/* RIGHT — shared LPQuoteForm (white card) on desktop.
                  Same surface as LPCtaForm so both forms read
                  identically. White contrasts strongly with the
                  dark hero photo behind.
                  `lg:self-start` top-aligns the card so step 2 (which
                  is taller than step 1) grows downward instead of
                  pushing the top edge up under the floating nav. */}
              <div className="hidden lg:block relative z-40 w-full max-w-[520px] lg:ml-auto lg:self-start">
                <LPQuoteForm city={city} surface="glass" portland={isPortland} />
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
          <LPQuoteForm city={city} surface="glass" portland={isPortland} />
        </div>
      </section>

      {/* All non-hero sections live INSIDE .page-zoom so they
          scale proportionally to the 1728px reference. */}
      <div className="page-zoom">

      {/* Portland A/B: Reviews section front-loaded directly after the
          hero. Other cities keep it in its original slot (see #7 below).
          Only one instance renders per page, so the id="reviews" anchor
          stays unique. */}
      {isPortland && (
        <ReviewsSection title={<>Real Moves. Real Reviews. No&nbsp;Surprises.</>} reviews={isPortland ? portlandReviews : undefined} />
      )}

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

      {/* 3. Solution — the ONLY architecturally-dark section in this
          top group. DarkScrollZone wraps it alone with an exit anchor
          at the section's bottom; veil holds at full opacity through
          the entire Solution scroll and fades only in the last ~50vh
          as the section exits. Adjacent sections below (SP, CTABanner)
          are plain light sections. */}
      <>
        <div className="relative">
      <LPSolution
        label="Our Solution"
        title={`How We Make Moving in ${city} Predictable and Stress‑Free`}
        subtitle={`One hourly rate — everything your ${city} move needs, included.`}
        items={includedItems}
      />
          <div
            data-dark-zone-exit
            aria-hidden
            className="absolute left-0 right-0 bottom-0 h-px pointer-events-none"
          />
        </div>
      </>

      {/* 4. Social proof — plain LIGHT section. Background gradient
          comes from the shared body gradient in lp-theme.css so this
          section reads identically to its neighbors (no unique blob
          backdrop). */}
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


      {/* 5. CTA banner— emotional / aspirational, click-to-modal.
            Sits straight after Social Proof so the credibility momentum
            from the stats / testimonial leads into a single-action CTA. */}
      <CTABanner
        heading={`Ready to Move in ${city}?`}
        tagline="No hidden fees. No hourly surprises. Fully licensed and insured."
        buttonText="Get Your Free Quote"
        image={isPortland ? "/images/cta-portland.webp" : undefined}
      />

      {/* 6. Process — uniform dark, no scroll-zone transition. */}
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

      {/* 7. Testimonials — non-Portland only. Portland renders this
            right after the hero (see top of .page-zoom). */}
      {!isPortland && (
        <ReviewsSection title={<>Real Moves. Real Reviews. No&nbsp;Surprises.</>} reviews={isPortland ? portlandReviews : undefined} />
      )}

      {/* 8. Lead-capture CTA with embedded form — utilitarian
            "fill the form right here, get a real number". Fully
            light — no dark zone wrapper, no veil borrowing. */}
      <LPCtaForm
        heading="Tell Us About Your Move"
        tagline={`Share a few details and we'll send a real ${city} quote — not a sales pitch. Most moves estimated in under a minute.`}
        city={city}
        portland={isPortland}
      />

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

      <FooterParallax>
        <ContactFooter />
      </FooterParallax>
      <Touchbar portland={isPortland} />
      <QuoteModal />
      </div>
      </main>
    </>
  );
}
