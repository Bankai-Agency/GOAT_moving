"use client";

import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { WhatsIncludedSection } from "@/components/sections/WhatsIncludedSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { HowItWorksSection, EstimateIcon, PlanIcon, BoxIcon, TruckIcon } from "@/components/sections/HowItWorksSection";
import { OtherServicesSection } from "@/components/sections/OtherServicesSection";
import { WhyTrustSection } from "@/components/sections/WhyTrustSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

/* ===================== HERO ===================== */
function CMHero() {
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/commercial-moving-hero.jpg" alt="Commercial moving services in Vancouver WA and Portland OR" fill sizes="(max-width: 1024px) 200vw, 100vw" quality={90} className="object-cover object-[30%_center] lg:object-center" priority />
        <div className="absolute inset-0 bg-[rgba(7,7,7,0.3)]" />
      </div>
      <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
            <span className="text-white/60">Commercial Movers </span>
            <br />
            <span className="text-white">in Vancouver, WA &&nbsp;Portland,&nbsp;OR</span>
          </h1>
          <div className="flex flex-col gap-5 lg:gap-7 max-w-[720px]">
            <p className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white">
              Office relocations with minimal downtime. After-hours & weekend moves, IT equipment specialists, fully licensed and insured.
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

/* ===================== WHY TRUST ===================== */
const cmTrust = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#0c0c0c"/></svg>
    ),
    title: "Minimal Downtime",
    subtitle: "Weekend, evening, phased moves",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#0c0c0c"/></svg>
    ),
    title: "Licensed & Insured",
    subtitle: "USDOT #4232069, $1M liability",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" fill="#0c0c0c"/></svg>
    ),
    title: "After-Hours & Weekends",
    subtitle: "No overtime surcharge",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="#0c0c0c"/></svg>
    ),
    title: "Dedicated Project Manager",
    subtitle: "One point of contact, always",
  },
];

function CMWhyTrust() {
  return (
    <WhyTrustSection
      title="Why Businesses Choose GOAT for Their Office Move"
      description="Commercial moves aren't just residential with more boxes. They need planning, downtime minimization, and a crew that treats your office like their own. We've relocated offices, showrooms, and law firms across the I-5 corridor — ready before Monday morning, every time."
      imageAlt="GOAT movers commercial move crew"
      items={cmTrust}
    />
  );
}

/* ===================== WHAT'S INCLUDED ===================== */
const cmIncluded = [
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="white"/></svg>),
    title: "Pre-Move Site Survey",
    description: "We walk both locations with you, measure doorways, and flag anything unusual before moving day.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/></svg>),
    title: "Labeled Inventory System",
    description: "Every item tagged with origin and destination. Your team finds their workstation and supplies on day one.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M21 16V4H3v12h18zm0 2H3c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm-4 4H7v-2h10v2z" fill="white"/></svg>),
    title: "IT & Electronics Handling",
    description: "Monitors, servers, printers, and AV equipment wrapped, padded, and loaded by trained crew — not gear hurlers.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" fill="white"/></svg>),
    title: "File Cabinets & Documents",
    description: "Locking crates for sensitive paperwork. Chain of custody for HR, legal, and financial records.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="white"/></svg>),
    title: "Cubicle & Furniture\nDisassembly",
    description: "Workstations, conference tables, standing desks — broken down and rebuilt at the new location.",
  },
  {
    icon: (<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="white"/></svg>),
    title: "Setup at New Office",
    description: "We don't just drop boxes. Desks placed, equipment reconnected, common areas ready for business.",
  },
];

function CMWhatsIncluded() {
  return (
    <WhatsIncludedSection
      label="What's Included"
      title="What's Included in Your Commercial Move"
      subtitle="Full-service office relocation from site survey to final setup"
      items={cmIncluded}
    />
  );
}

/* ===================== HOW IT WORKS ===================== */
const cmSteps = [
  {
    icon: <EstimateIcon />,
    title: "Free Site Survey",
    description: "We visit both locations, talk to your team, and spot obstacles before they become problems.",
  },
  {
    icon: <PlanIcon />,
    title: "Custom Move Plan",
    description: "Written timeline with arrival times, packing schedule, and go-live target. Reviewed and approved by you.",
  },
  {
    icon: <TruckIcon />,
    title: "Move Execution",
    description: "Crew arrives on time, follows the plan. You get hourly updates — no need to micromanage.",
  },
  {
    icon: <BoxIcon />,
    title: "Setup & Sign-off",
    description: "Furniture placed per your floor plan. IT reconnected. Walk-through with your PM before we leave.",
  },
];

function CMHowItWorks() {
  return <HowItWorksSection title="How Your Office Move Works" steps={cmSteps} />;
}

/* ===================== INDUSTRIES SERVED ===================== */
const industries = [
  {
    name: "Law Firms",
    desc: "Discreet handling of files, libraries, and client records",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFE533" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M3 7h18M7 7l-3 7c-.1.6.5 1 3 1s3.1-.4 3-1l-3-7M17 7l-3 7c-.1.6.5 1 3 1s3.1-.4 3-1l-3-7M5 21h14" />
      </svg>
    ),
  },
  {
    name: "Medical & Dental",
    desc: "Patient records, exam equipment, HIPAA-aware protocols",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFE533" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7Z" />
        <path d="M12 8v6M9 11h6" />
      </svg>
    ),
  },
  {
    name: "Retail & Showrooms",
    desc: "Inventory, displays, POS systems — ready to reopen fast",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFE533" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    name: "Tech & Startups",
    desc: "Server racks, monitors, standing desks, kitted workstations",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFE533" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    name: "Financial Services",
    desc: "Secure document transport, locked crates, sign-off chain",
    icon: (
      <svg width="28" height="28" viewBox="0 0 481 481" fill="#FFE533" xmlns="http://www.w3.org/2000/svg">
        <path d="M256.7,301.9h-27.5c-10,0-18.1-8.1-18.1-18.1s8.1-18.1,18.1-18.1h48.4c6.6,0,12-5.4,12-12c0-6.6-5.4-12-12-12h-22.7V225 c0-6.6-5.4-12-12-12s-12,5.4-12,12v16.7h-1.7c-23.2,0-42.1,18.9-42.1,42.1s18.9,42.1,42.1,42.1h27.5c10,0,18.1,8.1,18.1,18.1 s-8.1,18.1-18.1,18.1h-49.3c-6.6,0-12,5.4-12,12c0,6.6,5.4,12,12,12H231v17.1c0,6.6,5.4,12,12,12c6.6,0,12-5.4,12-12v-17.1h2 c0.1,0,0.2,0,0.3,0c23-0.3,41.5-19.1,41.5-42.1C298.8,320.8,279.9,301.9,256.7,301.9z" />
        <path d="M423.3,274.7c-12.6-29-30-57.1-52-83.4c-26.6-32-53.1-53.4-66.6-63.3l51-94.6c2.5-4.7,1.7-10.5-2.2-14.2 C340.3,6.3,326.3,0,310.7,0c-14.3,0-27.4,5.4-38.8,10.2c-9,3.7-17.5,7.3-24.4,7.3c-2.1,0-3.9-0.3-5.7-1C218,7.8,199.7,2.4,182,2.4 c-22.4,0-41.5,9-60.2,28.2c-3.9,4-4.5,10.3-1.4,15l55,83.1c-13.6,10.1-39.6,31.3-65.7,62.6c-21.9,26.3-39.4,54.4-52,83.4 c-15.8,36.5-23.8,74.6-23.8,113.2c0,51.3,41.8,93.1,93.1,93.1h227c51.3,0,93.1-41.8,93.1-93.1 C447.1,349.3,439.1,311.2,423.3,274.7z M146,40.6c11.6-10,22.7-14.4,36-14.4c14.2,0,30.2,4.8,51.5,12.7c4.4,1.6,9.1,2.4,13.9,2.4 c11.7,0,22.9-4.6,33.6-9.1c10.3-4.3,20.1-8.4,29.6-8.4c4.6,0,11.1,0.8,19.3,6.6l-48,89.2h-83.6L146,40.6z M354,457H127 c-38.1,0-69.1-31-69.1-69.1c0-64.1,23.5-124.9,69.7-180.7c29.2-35.3,58.9-57.2,67.9-63.6h89.8c9.1,6.3,38.7,28.3,67.9,63.6 c46.3,55.8,69.7,116.5,69.7,180.7C423.1,426,392.1,457,354,457z" />
      </svg>
    ),
  },
  {
    name: "Nonprofits & Churches",
    desc: "Budget-friendly planning, flexible scheduling, volunteer coordination",
    icon: (
      <svg width="28" height="28" viewBox="0 0 510 510" fill="#FFE533" xmlns="http://www.w3.org/2000/svg">
        <path d="m405 266.089v-63.449l-135.143-105.112.119-37.497 29.968.111v-30l-29.873-.111.095-30.008h-30l-.095 29.896-30.016-.111v30l29.92.111-.12 37.831-134.855 104.89v63.449l-105 86.827v157.06h510v-157.06zm-375 213.887v-112.94l75-62.02v174.959h-75zm180 0v-69.646c0-25.778 20.972-46.75 46.75-46.75s46.75 20.972 46.75 46.75v69.646zm123.5 0v-69.646c0-42.32-34.43-76.75-76.75-76.75s-76.75 34.43-76.75 76.75v69.646h-45v-262.664l120-93.333 120 93.333v262.664zm146.5 0h-75v-174.959l75 62.02z" />
        <path d="m255 179.976c-24.813 0-45 20.187-45 45s20.187 45 45 45 45-20.187 45-45-20.187-45-45-45zm0 60c-8.271 0-15-6.729-15-15s6.729-15 15-15 15 6.729 15 15-6.729 15-15 15z" />
      </svg>
    ),
  },
];

function CMIndustries() {
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">Industries We Serve</span>
            </div>
          </div>
          <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
            Industries We Move
          </h2>
        </div>

        {/* Industry cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {industries.map((ind, i) => (
            <div
              key={i}
              className="bg-[#181818] rounded-xl lg:rounded-2xl p-6 lg:p-8 flex flex-col gap-4 lg:gap-5 min-h-[200px] lg:min-h-[240px]"
            >
              {/* Icon */}
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-[#FFE533]/10 flex items-center justify-center shrink-0">
                {ind.icon}
              </div>

              {/* Title + description grouped, pinned to bottom */}
              <div className="mt-auto flex flex-col gap-2">
                <h3 className="font-sans font-bold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.84px] text-white">
                  {ind.name}
                </h3>
                <p className="font-sans font-normal text-base leading-[1.5] tracking-[-0.48px] text-white/60">
                  {ind.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== FAQ ===================== */
const cmFaqs = [
  {
    question: "How much does a commercial move cost?",
    answer: "Office moves are quoted per project, not per hour — too many variables. Most small-office moves (under 10 people) run $1,500–$4,000. Mid-size offices (10–40 people) range $4,000–$12,000. We provide a fixed, written quote after a free site survey so there are no surprises.",
  },
  {
    question: "Can you move us after hours or on the weekend?",
    answer: "Yes — most commercial moves we do happen Friday evening through Sunday so the team walks in Monday ready to work. No overtime surcharge. Same hourly rate whenever you need us.",
  },
  {
    question: "Do you handle IT equipment and servers?",
    answer: "Yes. We wrap, pad, and crate monitors, desktops, printers, and AV gear. For server racks and network closets, we coordinate with your IT team on disconnect/reconnect timing. We don't unplug anything without a sign-off.",
  },
  {
    question: "Are you insured for commercial buildings?",
    answer: "Yes. We carry $1M commercial general liability and can provide certificates of insurance (COI) naming your landlord and building management as additional insured. Just let us know who needs to be listed.",
  },
  {
    question: "Can you disassemble and reassemble office furniture?",
    answer: "Yes. Cubicles, workstations, conference tables, standing desks — we break them down, transport, and rebuild per your floor plan. Hardware is bagged and labeled by piece.",
  },
  {
    question: "Do you offer storage between move-out and move-in?",
    answer: "Yes. If your new space isn't ready, we offer secure short-term storage in our Vancouver warehouse. Inventoried, labeled, and delivered whenever you need it.",
  },
  {
    question: "What areas do you serve for commercial moves?",
    answer: "All of the Vancouver, WA and Portland, OR metro — including Beaverton, Hillsboro, Tigard, Camas, Gresham, and surrounding areas. We also handle interstate commercial relocations for growing companies.",
  },
];

function CMFAQSection() {
  return <FAQSection title="Commercial Moving FAQ" items={cmFaqs} />;
}

/* ===================== OTHER SERVICES ===================== */
const cmOtherServices = [
  { title: "Local Moving", description: "Residential moves in Vancouver, WA and Portland, OR metro.", href: "/local-moving", image: "/images/service-local.png" },
  { title: "Long Distance Moving", description: "Interstate moves, licensed FMCSA carrier.", href: "/long-distance-moving", image: "/images/service-longdistance.jpg" },
  { title: "Packing Services", description: "Professional packing with quality materials.", href: "/packing-services", image: "/images/service-packing.png" },
];

function CMOtherServices() {
  return <OtherServicesSection title="Explore Our Other Services" services={cmOtherServices} />;
}

/* ===================== MAIN ===================== */
export default function CommercialMovingClient() {
  return (
    <div className="page-zoom">
      <Header />
      <main>
        <CMHero />
        <CMWhatsIncluded />
        <CMWhyTrust />
        <CMHowItWorks />
        <CMIndustries />
        <ReviewsSection />
        <CTABanner />
        <CMFAQSection />
        <CMOtherServices />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
