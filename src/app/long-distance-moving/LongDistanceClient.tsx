"use client";

import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { WhatsIncludedSection } from "@/components/sections/WhatsIncludedSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQSection } from "@/components/sections/FAQSection";
import { HowItWorksSection, EstimateIcon, BoxIcon, TruckIcon, HomeIcon } from "@/components/sections/HowItWorksSection";
import { OtherServicesSection } from "@/components/sections/OtherServicesSection";
import { WhyTrustSection } from "@/components/sections/WhyTrustSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

/* ===================== HERO — identical style to Local Moving ===================== */
function LDHero() {
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/long-distance-hero.jpg"
          alt="Long distance moving services from Vancouver WA and Portland OR"
          fill
          sizes="(max-width: 1024px) 200vw, 100vw"
          quality={90}
          className="object-cover object-[70%_center] lg:object-center"
          priority
        />
        <div className="absolute inset-0 bg-[rgba(7,7,7,0.3)]" />
      </div>
      <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
            <span className="text-white/60">Long Distance Moving </span>
            <br />
            <span className="text-white">from Vancouver, WA & Portland, OR</span>
          </h1>
          <div className="flex flex-col gap-5 lg:gap-7 max-w-[640px]">
            <p className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white">
              Interstate relocations across the US — fully licensed, fully insured, zero hidden fees.
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

/* ===================== WHY TRUST GOAT ===================== */
const ldTrustPoints = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#0c0c0c"/></svg>,
    title: "Federally Licensed",
    subtitle: "FMCSA interstate authority, USDOT #4232069",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#0c0c0c"/></svg>,
    title: "Fully Insured",
    subtitle: "Protected from loading to final delivery",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0020 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" fill="#0c0c0c"/></svg>,
    title: "One Team, Start to Finish",
    subtitle: "Same crew loads and delivers, no hand-offs",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.31 16.86V19h-1.73v-1.67c-1.47-.3-2.76-1.27-2.85-2.99h1.72c.09.92.72 1.64 2.32 1.64 1.71 0 2.1-.86 2.1-1.39 0-.72-.39-1.41-2.34-1.87-2.17-.52-3.66-1.42-3.66-3.21 0-1.51 1.21-2.49 2.72-2.81V5h1.73v1.69c1.62.4 2.44 1.63 2.49 2.97h-1.71c-.04-.98-.56-1.64-1.94-1.64-1.31 0-2.1.59-2.1 1.43 0 .73.57 1.22 2.34 1.67 1.75.46 3.64 1.22 3.65 3.42-.01 1.61-1.21 2.48-2.73 2.77z" fill="#0c0c0c"/></svg>,
    title: "No Hidden Fees",
    subtitle: "Transparent pricing, no surprises at delivery",
  },
];

function LDWhyTrust() {
  return (
    <WhyTrustSection
      title="Why Trust GOAT Movers with Your Long Distance Move"
      description="Long distance moves have more variables — more miles, more regulations, more ways for things to go sideways. We handle interstate relocations from the Pacific Northwest with federal authority, one dedicated crew, and pricing you can actually plan around."
      image="/images/home-hero.jpg"
      imageAlt="GOAT movers long distance crew"
      items={ldTrustPoints}
      hideLabelDivider
    />
  );
}

/* ===================== WHAT'S INCLUDED — same design as Local, LD content ===================== */
const ldIncluded = [
  { icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H11.5v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.65c.09 1.72 1.38 2.69 2.85 2.99V19h1.73v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.65-3.42z" fill="white"/></svg>, title: "Moving Truck & Fuel", description: "Dedicated truck for your move. Fuel costs included in your quote." },
  { icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0020 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" fill="white"/></svg>, title: "Professional Crew", description: "Experienced movers trained for long distance relocations." },
  { icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M20 2H4c-1.1 0-2 .9-2 2v3c0 .74.4 1.38 1 1.72V20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8.72c.6-.34 1-.98 1-1.72V4c0-1.1-.9-2-2-2zm-1 18H5V9h14v11zm1-13H4V4h16v3z" fill="white"/><path d="M9 12h6v2H9v-2z" fill="white"/></svg>, title: "Equipment & Materials", description: "Dollies, blankets, straps, and tools for safe transport." },
  { icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="white"/></svg>, title: "Furniture Protection", description: "All furniture wrapped and padded for the road." },
  { icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="white"/></svg>, title: "Disassembly &\nReassembly", description: "Bed frames and basic furniture taken apart and put back together." },
  { icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="white"/></svg>, title: "Door-to-Door Delivery", description: "We pick up at your old home and deliver straight to your new one — no storage stops in between." },
];

function LDWhatsIncluded() {
  return (
    <WhatsIncludedSection
      title="What's Included in Your Long Distance Move"
      subtitle="Everything you need for a smooth interstate relocation"
      items={ldIncluded}
    />
  );
}

/* ===================== HOW IT WORKS — same design as Local, LD steps ===================== */
const ldSteps = [
  { icon: <EstimateIcon />, title: "Free Estimate", description: "Tell us where you’re moving from and to, what you’re moving, and your timeline. We’ll give you an honest quote." },
  { icon: <BoxIcon />, title: "Packing & Loading", description: "Our crew packs and loads everything securely for the long haul. Furniture wrapped, boxes organized, truck packed tight." },
  { icon: <TruckIcon />, title: "Transport", description: "Your belongings travel safely to your new home. We handle the entire route." },
  { icon: <HomeIcon />, title: "Delivery & Setup", description: "We unload, reassemble furniture, and place everything where you want it." },
];

function LDHowItWorks() {
  return (
    <HowItWorksSection title="How Your Long Distance Move Works" steps={ldSteps} />
  );
}
function WhereWeMove() {
  const routes = [
    { fromCode: "VAN", fromName: "Vancouver, WA", toCode: "CA", toName: "California", desc: "Los Angeles, San Francisco, San Diego, Sacramento and all CA cities" },
    { fromCode: "PDX", fromName: "Portland, OR", toCode: "TX", toName: "Texas", desc: "Houston, Dallas, Austin, San Antonio and all TX cities" },
    { fromCode: "VAN", fromName: "Vancouver, WA", toCode: "AZ", toName: "Arizona", desc: "Phoenix, Tucson, Scottsdale, Mesa and all AZ cities" },
    { fromCode: "PDX", fromName: "Portland, OR", toCode: "NV", toName: "Nevada", desc: "Las Vegas, Reno, Henderson and all NV cities" },
    { fromCode: "VAN", fromName: "Vancouver, WA", toCode: "CO", toName: "Colorado", desc: "Denver, Colorado Springs, Boulder and all CO cities" },
    { fromCode: "PDX", fromName: "Portland, OR", toCode: "WA", toName: "Washington", desc: "Seattle, Tacoma, Spokane, Olympia and all WA cities" },
  ];

  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                Where We Move
              </span>
            </div>
          </div>
          <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
            Popular Long Distance Routes
          </h2>
        </div>

        {/* Route cards grid — boarding-pass style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {routes.map((route, i) => (
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

const longDistanceFaqs = [
  {
    question: "How much does a long distance move cost?",
    answer: "Long distance moving costs depend on the weight of your shipment, distance, and services needed. Most interstate moves from Vancouver/Portland range from $3,000 to $8,000. We provide free binding estimates so you know the exact cost before moving day."
  },
  {
    question: "How long does a long distance move take?",
    answer: "Transit times depend on the distance. Moves within the West Coast typically take 3–5 days. Cross-country moves to the East Coast take 7–14 days. We give you a delivery window and keep you updated throughout."
  },
  {
    question: "Are my belongings insured during the move?",
    answer: "Yes. Every long distance move includes basic carrier liability at $0.60 per pound per item. We also offer full-value protection plans that cover the replacement value of your belongings. Ask us for details during your estimate."
  },
  {
    question: "Do you store items if my new home isn’t ready?",
    answer: "Yes. We offer short-term and long-term storage in our secure, climate-controlled warehouse. Your items stay on our inventory and are delivered whenever you’re ready."
  },
  {
    question: "What can’t you move long distance?",
    answer: "Federal regulations prohibit us from transporting hazardous materials, perishable food, plants, and live animals. We’ll provide a full list of non-allowable items before your move."
  },
];

function LDFAQSection() {
  return <FAQSection title="Long Distance Moving FAQ" items={longDistanceFaqs} />;
}

const ldOtherServices = [
  { title: "Local Moving", description: "Professional local moves in Vancouver, WA and Portland, OR metro area.", href: "/local-moving", image: "/images/service-local.png" },
  { title: "Commercial Moving", description: "Office and business relocations with minimal downtime.", href: "/commercial-moving", image: "/images/service-commercial.png" },
  { title: "Packing Services", description: "Full-service packing with quality materials for a stress-free move.", href: "/packing-services", image: "/images/service-packing.png" },
];

function LDOtherServices() {
  return <OtherServicesSection title="Explore Our Other Services" services={ldOtherServices} />;
}

export default function LongDistanceClient() {
  return (
    <div className="page-zoom">
      <Header />
      <main>
        <LDHero />
        <LDWhatsIncluded />
        <LDWhyTrust />
        <LDHowItWorks />
        <WhereWeMove />
        <ReviewsSection />
        <CTABanner />
        <LDFAQSection />
        <LDOtherServices />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
