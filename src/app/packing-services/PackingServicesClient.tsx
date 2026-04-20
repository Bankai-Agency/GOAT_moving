"use client";

import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { WhatsIncludedSection } from "@/components/sections/WhatsIncludedSection";
import { ServiceOptionsSection } from "@/components/sections/ServiceOptionsSection";
import { FragileItemsSection } from "@/components/sections/FragileItemsSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { HowItWorksSection, EstimateIcon, DeliveryIcon, BoxIcon, TruckIcon } from "@/components/sections/HowItWorksSection";
import { OtherServicesSection } from "@/components/sections/OtherServicesSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

/* ===================== HERO ===================== */
function PKHero() {
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/packing-hero.jpg" alt="Packing and labor services in Vancouver WA and Portland OR" fill sizes="(max-width: 1024px) 200vw, 100vw" quality={90} className="object-cover object-[30%_top] lg:object-center" priority />
        <div className="absolute inset-0 bg-[rgba(7,7,7,0.3)]" />
      </div>
      <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
            <span className="text-white/60">Packing & Labor </span>
            <br />
            <span className="text-white">in Vancouver, WA &&nbsp;Portland,&nbsp;OR</span>
          </h1>
          <div className="flex flex-col gap-5 lg:gap-7 max-w-[720px]">
            <p className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white">
              Full-service packing, labor-only loading, PODS & U-Haul help. Quality materials, fragile specialists, same-day availability.
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

/* ===================== SERVICE TYPES ===================== */
const serviceTypeItems = [
  {
    icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" fill="#FFE533"/></svg>),
    title: "Full-Service Packing",
    description: "We pack everything — every room, every drawer, every fragile item. You keep working, we handle the boxes.",
    bestFor: "Best for: busy professionals, last-minute moves, families with young kids",
  },
  {
    icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#FFE533"/></svg>),
    title: "Partial Packing",
    description: "Pack only the parts you don't want to touch — kitchen, china cabinet, garage, or the whole living room.",
    bestFor: "Best for: fragile-heavy rooms, DIY movers who need help with tricky stuff",
  },
  {
    icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm16 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" fill="#FFE533"/></svg>),
    title: "Labor Only (Load / Unload)",
    description: "You rented the truck, PODS, or U-Haul. We bring the muscle — load it, unload it, or both. No truck, no driving.",
    bestFor: "Best for: PODS customers, U-Haul renters, same-building moves, storage loading",
  },
  {
    icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" fill="#FFE533"/></svg>),
    title: "Unpacking Services",
    description: "Boxes emptied, items placed where you want them, packing material hauled away. Walk into a livable home.",
    bestFor: "Best for: seniors, families settling fast, anyone who hates unpacking",
  },
];

function PKServiceTypes() {
  return (
    <ServiceOptionsSection
      label="What We Offer"
      title="Choose the Service That Fits Your Move"
      subtitle="Full, partial, labor-only, or unpacking — pick what you actually need."
      options={serviceTypeItems}
    />
  );
}

/* ===================== WHAT'S INCLUDED (materials) ===================== */
const pkIncluded = [
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" fill="white"/></svg>),
    title: "Quality Boxes &\nPacking Paper",
    description: "Double-walled boxes in small, medium, large, and dish-pack sizes. Acid-free paper for fragile items.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="white"/></svg>),
    title: "Bubble Wrap & Foam",
    description: "Heavy bubble wrap for dishes, electronics, lamps, and décor. Foam padding for furniture edges.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 15H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V20z" fill="white"/></svg>),
    title: "Wardrobe Boxes",
    description: "Hanging clothes stay on hangers — no folding, no wrinkles. Great for closets and suits.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="white"/></svg>),
    title: "TV & Mirror Boxes",
    description: "Adjustable picture and flat-screen TV boxes with foam corners. No cracked screens.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/></svg>),
    title: "Custom Crates",
    description: "Wooden crates for artwork, antiques, marble tops, and other pieces that can't go in cardboard.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16l-4-4h3v-4h2v4h3l-4 4z" fill="white"/></svg>),
    title: "Clear Labeling",
    description: "Every box labeled by room and contents. You'll know exactly which box has what before you open it.",
  },
];

function PKWhatsIncluded() {
  return (
    <WhatsIncludedSection
      label="What's Included"
      title="Materials & Services Included"
      subtitle="Everything we bring to pack your home right — no trips to the store"
      items={pkIncluded}
    />
  );
}

/* ===================== HOW IT WORKS ===================== */
const pkSteps = [
  {
    icon: <EstimateIcon />,
    title: "Free Estimate",
    description: "Walk-through (in person or via video) to count rooms, identify fragile items, and quote materials + labor.",
  },
  {
    icon: <DeliveryIcon />,
    title: "Materials Delivered",
    description: "Boxes, paper, tape, and wrap arrive the day before (or same day for fast jobs). Nothing for you to buy.",
  },
  {
    icon: <BoxIcon />,
    title: "Professional Packing",
    description: "Crew packs room-by-room. Fragile items wrapped individually. Every box labeled, every item inventoried.",
  },
  {
    icon: <TruckIcon />,
    title: "Ready for Transit",
    description: "Boxes stacked by destination room. If we're not moving them, they're prepped for your truck or movers.",
  },
];

function PKHowItWorks() {
  return <HowItWorksSection title="How Professional Packing Works" steps={pkSteps} />;
}

/* ===================== FRAGILE ITEMS ===================== */
const fragileItems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="230 70 540 860" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m256.52 100h487a0 0 0 0 1 0 0v232.91a243.48 243.48 0 0 1 -243.52 243.48 243.48 243.48 0 0 1 -243.48-243.48v-232.91a0 0 0 0 1 0 0z"
          fill="#0c0c0c"
        />
        <path
          d="m667.06 900c-169.79-46.86-124.52-256-100.14-332.92h-133.84c24.38 77 69.65 286.06-100.14 332.92z"
          fill="#0c0c0c"
        />
      </svg>
    ),
    title: "China & Glassware",
    description: "Dish packs with double walls, individual wrapping, cell dividers.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#0c0c0c"/></svg>),
    title: "Flat-Screen TVs",
    description: "Custom TV boxes with foam corners, screen-side pads, wardrobe protection.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16.05" cy="14.53" rx="10.22" ry="12.53" fill="#0c0c0c" />
        <path
          d="m25 30h-18a1 1 0 0 1 -1-.71l-4-13a1 1 0 0 1 .15-.88 1 1 0 0 1 .85-.41h3.91a1 1 0 0 1 0 2h-2.57l3.4 11h16.52l3.39-11h-2.46a1 1 0 1 1 0-2h3.81a1 1 0 0 1 .8.41 1 1 0 0 1 .16.88l-4 13a1 1 0 0 1 -.96.71z"
          fill="#0c0c0c"
        />
      </svg>
    ),
    title: "Artwork & Mirrors",
    description: "Telescoping picture boxes or custom wood crates for large pieces.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m9.4003906 51.6899414h45.1992188c2.9775391 0 5.4003906-2.4223633 5.4003906-5.3999023v-.0102539h-3.7990723c-.0068359.0001221-.0124512.0039062-.0192871.0039062s-.0124512-.0037842-.0192871-.0039062h-48.324707c-.0068359.0001221-.0124512.0039062-.0192871.0039062s-.0124512-.0037842-.0192871-.0039062h-3.7990723v.0102539c0 2.9775391 2.4228516 5.3999023 5.4003906 5.3999023zm17.3222656-4.2456055h10.5546875c.5527344 0 1 .4477539 1 1s-.4472656 1-1 1h-10.5546875c-.5527344 0-1-.4477539-1-1s.4472656-1 1-1z"
          fill="#0c0c0c"
        />
        <path
          d="m52.2412109 12.3071289h-40.4824218c-1.6210938 0-2.9404297 1.3188477-2.9404297 2.9399414v29.0327148h46.3632812v-29.0327148c0-1.6210938-1.3193359-2.9399414-2.9404297-2.9399414z"
          fill="#0c0c0c"
        />
      </svg>
    ),
    title: "Electronics & Computers",
    description: "Anti-static wrap, original boxes when available, shock-padded transit.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="#0c0c0c"/></svg>),
    title: "Musical Instruments",
    description: "Climate-aware handling for pianos, guitars, violins — shipped upright and secured.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="45 0 420 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M379.667,49v57.667c0,20.671,13.42,38.255,32,44.531v2.136v13h-17v30h17v3.878c0,22.491-18.298,40.789-40.79,40.789 c-17.584,0-33.135-11.208-38.696-27.891c-4.701-14.102-14.917-25.179-27.778-31.172c-6.837-3.186-14.419-4.937-22.321-4.937H271 v-29.667h17v-30h-17v-15.135c18.58-6.276,32-23.86,32-44.531V0h-94v57.667c0,20.671,13.42,38.255,32,44.531v15.135h-17v30h17V177 h-11.082c-7.902,0-15.484,1.751-22.321,4.937c-12.861,5.993-23.077,17.07-27.778,31.173c-5.561,16.682-21.112,27.89-38.696,27.89 c-22.491,0-40.79-18.298-40.79-40.789v-3.878h17v-30h-17v-13v-2.135c18.58-6.276,32-23.86,32-44.531V49h-94v57.667 c0,20.671,13.42,38.255,32,44.531v15.136h-17v30h17v3.878c0,39.033,31.756,70.789,70.79,70.789 c30.518,0,57.506-19.452,67.156-48.404c3.11-9.329,11.806-15.596,21.639-15.596H241v38.085 c-18.139,6.244-31.214,23.469-31.214,43.701c0,17.849,10.179,33.356,25.03,41.052c-12.368,25.3-31.273,66.909-31.273,84.836 c0,23.713,15.82,43.79,37.456,50.26V482h-59.913v30h149.826v-30H271v-17.066c21.636-6.47,37.456-26.547,37.456-50.26 c0-17.927-18.904-59.536-31.272-84.836c14.851-7.695,25.03-23.202,25.03-41.051c0-20.232-13.074-37.457-31.213-43.701V207h11.082 c9.833,0,18.529,6.268,21.638,15.596C313.371,251.548,340.36,271,370.877,271c39.034,0,70.79-31.756,70.79-70.789v-3.878h17v-30 h-17v-15.136c18.58-6.276,32-23.86,32-44.531V49H379.667z"
          fill="#0c0c0c"
        />
      </svg>
    ),
    title: "Antiques & Heirlooms",
    description: "White-glove wrapping, photo inventory before packing, extra insurance options.",
  },
];

function PKFragile() {
  return (
    <FragileItemsSection
      label="Fragile Specialists"
      title="Items We Specialize In"
      subtitle="Delicate pieces that need more than just bubble wrap — handled with care, packed to arrive intact."
      items={fragileItems}
    />
  );
}

/* ===================== FAQ ===================== */
const pkFaqs = [
  {
    question: "How much does professional packing cost?",
    answer: "Packing is priced per hour plus materials. A standard 2-bedroom home takes 4–6 hours with two packers — typically $400–$700 including boxes and paper. A 3–4 bedroom home runs $700–$1,400. We give you a fixed materials estimate upfront.",
  },
  {
    question: "How long does it take to pack a house?",
    answer: "A studio or 1-bedroom: 2–4 hours. A 2-bedroom: 4–6 hours. A 3-bedroom: 6–10 hours. A 4+ bedroom: full day or two. Fragile-heavy homes (lots of china, collectibles) take longer — we'll tell you upfront.",
  },
  {
    question: "Can you pack just the kitchen or fragile rooms?",
    answer: "Yes — partial packing is one of our most popular services. Most people can pack clothes and books themselves but want help with kitchens, china cabinets, and garages. Pick any rooms you want covered.",
  },
  {
    question: "Do you offer labor-only for PODS or U-Haul?",
    answer: "Yes. Bring your own container or rental truck, we bring the crew. 2-hour minimum. We load, unload, or both. Same hourly rate as full moves.",
  },
  {
    question: "What materials do you bring?",
    answer: "Boxes (small, medium, large, dish-pack, wardrobe, TV), packing paper, bubble wrap, tape, furniture pads, and shrink wrap. You don't buy a thing. Leftover unused materials are credited back.",
  },
  {
    question: "Can you pack the day before the move?",
    answer: "Yes, and most clients prefer it. Pack day 1, move day 2 — less stress, fewer mistakes. We can also pack and move same day if timeline is tight.",
  },
  {
    question: "Do you unpack at the destination?",
    answer: "Yes. Unpacking is a separate service — boxes emptied, items placed on surfaces, debris hauled away. Priced hourly. Most people do it for kitchens and closets only.",
  },
];

function PKFAQSection() {
  return <FAQSection title="Packing & Labor FAQ" items={pkFaqs} />;
}

/* ===================== OTHER SERVICES ===================== */
const pkOtherServices = [
  { title: "Local Moving", description: "Residential moves in Vancouver, WA and Portland, OR metro.", href: "/local-moving", image: "/images/service-local.png" },
  { title: "Long Distance Moving", description: "Interstate moves, licensed FMCSA carrier.", href: "/long-distance-moving", image: "/images/service-longdistance.jpg" },
  { title: "Commercial Moving", description: "Office relocations with minimal downtime.", href: "/commercial-moving", image: "/images/service-commercial.png" },
];

function PKOtherServices() {
  return <OtherServicesSection title="Explore Our Other Services" services={pkOtherServices} />;
}

/* ===================== MAIN ===================== */
export default function PackingServicesClient() {
  return (
    <div className="page-zoom">
      <Header />
      <main>
        <PKHero />
        <PKServiceTypes />
        <PKWhatsIncluded />
        <PKHowItWorks />
        <PKFragile />
        <ReviewsSection />
        <CTABanner />
        <PKFAQSection />
        <PKOtherServices />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
