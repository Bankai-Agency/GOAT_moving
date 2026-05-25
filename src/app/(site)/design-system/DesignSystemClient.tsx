"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

/* ─── LP (terminal / light theme) ─────────────────────────────── */
/* Note: (drafts)/mainpage-5 ships its own AccentPill that's byte-identical
   to @lp/ui/AccentPill. We reuse the LP one (`AccentPill`) for the
   mainpage-5 tab to avoid a second dynamic-import path through the
   parens-containing draft directory — Turbopack chokes on that and
   spills the failure across other routes. */
import { LPButton } from "@lp/ui/LPButton";
import { LPInput, LPLabel, LPTextarea } from "@lp/ui/LPInput";
import { SelectDropdown as LPSelectDropdown } from "@lp/ui/SelectDropdown";
import { DatePicker as LPDatePicker } from "@lp/ui/DatePicker";
import { LeadForm as LPLeadForm } from "@lp/ui/LeadForm";
import { QuoteForm as LPQuoteForm } from "@lp/ui/QuoteForm";
import { StepQuoteForm as LPStepQuoteForm } from "@lp/ui/StepQuoteForm";
import { QuoteModal as LPQuoteModal } from "@lp/ui/QuoteModal";

import { CTABanner as LPCTABanner } from "@lp/sections/CTABanner";
import { AboutSection as LPAboutSection } from "@lp/sections/AboutSection";
import { ServicesSection as LPServicesSection } from "@lp/sections/ServicesSection";
import { HowItWorksSection as LPHowItWorks } from "@lp/sections/HowItWorksSection";
import {
  WhatsIncludedSection as LPWhatsIncluded,
  defaultIncludedItems as lpDefaultIncluded,
} from "@lp/sections/WhatsIncludedSection";
import { LPProcess } from "@lp/sections/LPProcess";
import { LPSolution } from "@lp/sections/LPSolution";
import { LPCtaForm } from "@lp/sections/LPCtaForm";
import { FAQSection as LPFAQSection } from "@lp/sections/FAQSection";
import { ReviewsSection as LPReviewsSection } from "@lp/sections/ReviewsSection";
import { ServiceAreaSection as LPServiceArea } from "@lp/sections/ServiceAreaSection";
import { LocalMovingRatesSection as LPRatesSection } from "@lp/sections/LocalMovingRatesSection";
import { ContactFooter as LPContactFooter } from "@lp/sections/ContactFooter";
import { Touchbar as LPTouchbar } from "@lp/sections/Touchbar";
import {
  EstimateIcon as LPEstimateIcon,
  PlanIcon as LPPlanIcon,
  TruckIcon as LPTruckIcon,
  HomeIcon as LPHomeIcon,
} from "@lp/sections/HowItWorksSection";

/* ─── Site (dark / yellow theme) ──────────────────────────────── */
import { FormInput as SiteFormInput } from "@site/ui/FormInput";
import { SelectDropdown as SiteSelectDropdown } from "@site/ui/SelectDropdown";
import { DatePicker as SiteDatePicker } from "@site/ui/DatePicker";
import { LeadForm as SiteLeadForm } from "@site/ui/LeadForm";
import { QuoteForm as SiteQuoteForm } from "@site/ui/QuoteForm";
import { StepQuoteForm as SiteStepQuoteForm } from "@site/ui/StepQuoteForm";
import { QuoteModal as SiteQuoteModal } from "@site/ui/QuoteModal";
import { RatingCards } from "@site/ui/RatingCards";
import { SuccessState } from "@site/ui/SuccessState";

import { HeroSection } from "@site/sections/HeroSection";
import { CTABanner as SiteCTABanner } from "@site/sections/CTABanner";
import { AboutSection as SiteAboutSection } from "@site/sections/AboutSection";
import { ServicesSection as SiteServicesSection } from "@site/sections/ServicesSection";
import { HowItWorksSection as SiteHowItWorks } from "@site/sections/HowItWorksSection";
import {
  WhatsIncludedSection as SiteWhatsIncluded,
  defaultIncludedItems as siteDefaultIncluded,
} from "@site/sections/WhatsIncludedSection";
import { FAQSection as SiteFAQSection } from "@site/sections/FAQSection";
import { ReviewsSection as SiteReviewsSection } from "@site/sections/ReviewsSection";
import { ServiceAreaSection as SiteServiceArea } from "@site/sections/ServiceAreaSection";
import { LocalMovingRatesSection as SiteRatesSection } from "@site/sections/LocalMovingRatesSection";
import { WhyTrustSection } from "@site/sections/WhyTrustSection";
import { FragileItemsSection } from "@site/sections/FragileItemsSection";
import { ServiceOptionsSection } from "@site/sections/ServiceOptionsSection";
import { OtherServicesSection } from "@site/sections/OtherServicesSection";
import { GallerySection } from "@site/sections/GallerySection";
import { ContactFooter as SiteContactFooter } from "@site/sections/ContactFooter";
import { Touchbar as SiteTouchbar } from "@site/layout/Touchbar";
import { Breadcrumbs } from "@site/layout/Breadcrumbs";

type Theme = "lp" | "site" | "mp5";
type SiteMode = "dark" | "light";

/* ───────────────────── Tokens (shared) ──────────────────────── */

const PALETTES = {
  lp: [
    { name: "White", value: "#ffffff", text: "#001f4d" },
    { name: "Ink (text)", value: "#001f4d", text: "#ffffff" },
    { name: "Brand Blue", value: "#0066ff", text: "#ffffff" },
    { name: "Blue hover", value: "#0052cc", text: "#ffffff" },
    { name: "Pale Blue", value: "#f0f5ff", text: "#001f4d" },
    { name: "Surface", value: "#f5f7fb", text: "#001f4d" },
    { name: "Hairline", value: "#e2e6ec", text: "#001f4d" },
    { name: "Dark island", value: "#0c0c0c", text: "#ffffff" },
  ],
  site: [
    { name: "Background", value: "#0c0c0c", text: "#ffffff" },
    { name: "Surface 1", value: "#141414", text: "#ffffff" },
    { name: "Surface 2", value: "#181818", text: "#ffffff" },
    { name: "Surface 3", value: "#242424", text: "#ffffff" },
    { name: "Accent Yellow", value: "#FFE533", text: "#0c0c0c" },
    { name: "Accent hover", value: "#f0d820", text: "#0c0c0c" },
    { name: "Text", value: "#ffffff", text: "#0c0c0c" },
    { name: "Muted", value: "#6B7280", text: "#ffffff" },
  ],
};

/* ───────────────────── Helpers ──────────────────────────────── */

function GroupHeader({ id, eyebrow, title, blurb }: { id: string; eyebrow: string; title: string; blurb?: string }) {
  return (
    <header id={id} className="ds-group-header">
      <span className="ds-eyebrow">{eyebrow}</span>
      <h2 className="ds-group-title">{title}</h2>
      {blurb && <p className="ds-group-blurb">{blurb}</p>}
    </header>
  );
}

function Specimen({
  name,
  meta,
  notes,
  children,
  fullBleed = false,
}: {
  name: string;
  meta?: string;
  notes?: string;
  children: ReactNode;
  /** Render in a full-width frame, no inner padding — for sections that
      already manage their own horizontal padding. */
  fullBleed?: boolean;
}) {
  return (
    <section className="ds-specimen">
      <div className="ds-specimen__head">
        <div>
          <h3 className="ds-specimen__name">{name}</h3>
          {meta && <code className="ds-specimen__meta">{meta}</code>}
        </div>
        {notes && <p className="ds-specimen__notes">{notes}</p>}
      </div>
      <div className={fullBleed ? "ds-specimen__bodyFull" : "ds-specimen__body"}>{children}</div>
    </section>
  );
}

function PaletteGrid({ theme }: { theme: keyof typeof PALETTES }) {
  return (
    <div className="ds-palette">
      {PALETTES[theme].map((c) => (
        <div key={c.name} className="ds-swatch" style={{ background: c.value, color: c.text }}>
          <span className="ds-swatch__name">{c.name}</span>
          <span className="ds-swatch__value">{c.value.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

function TypeRow({ label, sample, className, style }: { label: string; sample: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className="ds-type-row">
      <div className="ds-type-label">{label}</div>
      <div className={className} style={style}>{sample}</div>
    </div>
  );
}

/* Demo data shared between themes. */

const demoServices = [
  { title: "Local Moving", description: "Hourly local moves with truck, fuel and equipment included.", number: "1", image: "/images/service-local.png" },
  { title: "Long Distance", description: "Interstate relocations — fully licensed (USDOT #4232069).", number: "2", image: "/images/service-longdistance.jpg" },
  { title: "Commercial", description: "Office and commercial moves with minimal downtime.", number: "3", image: "/images/service-commercial.png" },
  { title: "Packing & Labor", description: "Professional packing, loading-only labor, fragile handling.", number: "4", image: "/images/service-packing.png" },
];

const demoSteps = [
  { icon: <LPEstimateIcon />, title: "Get a Quote", description: "Tell us what you're moving — get a clear price." },
  { icon: <LPPlanIcon />, title: "Approve the Plan", description: "Confirm timing and scope. Price you see is the price you pay." },
  { icon: <LPTruckIcon />, title: "Move Without Surprises", description: "We arrive on time, treat your stuff with care." },
  { icon: <LPHomeIcon />, title: "Settle In", description: "We reassemble, place, and clean up — done." },
];

const demoFaqs = [
  { question: "Are you licensed and insured?", answer: "Yes — fully licensed under USDOT #4232069 and carrying both liability and cargo insurance." },
  { question: "What is your hourly rate?", answer: "Flat $125/hr for local moves. No extra for stairs, no fuel surcharges, no hidden fees." },
  { question: "Do you charge for travel time?", answer: "Just a one-time $50 trip fee for moves inside our service area." },
];

const demoFragileItems = [
  { icon: <span className="text-[#FFE533] text-2xl font-bold">🎹</span>, title: "Pianos & Heavy Items", description: "Upright and grand pianos, safes, gym equipment." },
  { icon: <span className="text-[#FFE533] text-2xl font-bold">🖼️</span>, title: "Fine Art & Antiques", description: "Custom crating for paintings, sculptures, mirrors." },
  { icon: <span className="text-[#FFE533] text-2xl font-bold">📺</span>, title: "Electronics", description: "Pro packing for TVs, monitors, audio gear." },
];

const demoServiceOptions = [
  { icon: <span className="text-[#FFE533] text-2xl">📦</span>, title: "Full-Service Move", description: "We pack, load, transport, unload, and unpack.", bestFor: "Best for: busy families, executive moves." },
  { icon: <span className="text-[#FFE533] text-2xl">🚚</span>, title: "Loading-Only Labor", description: "You bring the truck — we provide the muscle and skill.", bestFor: "Best for: U-Haul, PODS, rental trucks." },
  { icon: <span className="text-[#FFE533] text-2xl">🛠️</span>, title: "Same-Building Move", description: "Apartment-to-apartment, office reshuffle, in-house moves.", bestFor: "Best for: apartments, condos, offices." },
];

/* ════════════════════════════════════════════════════════════════
   Section catalogs — one per theme. Each catalog returns the same
   ordered list of (group, items[]) so we can render either tab.
   ════════════════════════════════════════════════════════════════ */

function LPContent() {
  return (
    <>
      <GroupHeader id="lp-foundations" eyebrow="01 — Foundations" title="Foundations" blurb="Tokens that the LP theme inherits via theme-light + data-accent='blue'." />
      <Specimen name="Palette" meta="lp-theme.css · accent.css">
        <PaletteGrid theme="lp" />
      </Specimen>

      <Specimen name="Typography" meta="Geist Sans · Roboto Mono" notes="Headlines weight 500/600 — mainpage-5 rejects bold.">
        <div className="ds-type-stack">
          <TypeRow label="Display" sample="Stress-Free Movers" style={{ fontSize: 72, lineHeight: 1.0, letterSpacing: "-2.5px", fontWeight: 500, color: "#001f4d" }} />
          <TypeRow label="H2" sample="How Your Move Works" style={{ fontSize: 56, lineHeight: 1.05, letterSpacing: "-1.8px", fontWeight: 600, color: "#001f4d" }} />
          <TypeRow label="H3 card" sample="Moving Truck & Fuel" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.6px", fontWeight: 600, color: "#001f4d" }} />
          <TypeRow label="Body L" sample="Most local moves in your city cost $400–$900." style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.3px", color: "rgba(0,31,77,0.8)" }} />
          <TypeRow label="Body M" sample="No hidden fees, no hourly surprises." style={{ fontSize: 16, lineHeight: 1.5, color: "rgba(0,31,77,0.7)" }} />
          <TypeRow label="Mono eyebrow" sample="OUR SOLUTION" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(0,31,77,0.6)", fontWeight: 500 }} />
        </div>
      </Specimen>

      <GroupHeader id="lp-primitives" eyebrow="02 — Primitives" title="UI primitives" blurb="Stand-alone interactive bits — buttons, inputs, dropdowns." />

      <Specimen name="LPButton — sizes" meta="@lp/ui/LPButton" notes="Three sizes (sm · md · lg) and three variants (primary · secondary · ghost). Replaces the older AccentPill.">
        <div className="ds-row">
          <LPButton size="sm">Quote</LPButton>
          <LPButton size="md">Get a Free Quote</LPButton>
          <LPButton size="lg">Get a Free Quote</LPButton>
        </div>
      </Specimen>

      <Specimen name="LPButton — variants">
        <div className="ds-row">
          <LPButton variant="primary" size="md">Primary</LPButton>
          <LPButton variant="secondary" size="md">Secondary</LPButton>
          <LPButton variant="ghost" size="md">Ghost</LPButton>
        </div>
      </Specimen>

      <Specimen name="LPButton — fullWidth">
        <div style={{ maxWidth: 320 }}>
          <LPButton size="md" fullWidth>Get a Free Quote</LPButton>
        </div>
      </Specimen>

      <Specimen name="LPInput / LPLabel / LPTextarea" meta="@lp/ui/LPInput" notes="Newer LP form primitives. surface='light' on white cards · surface='glass' on dark overlays.">
        <div className="ds-grid-2" style={{ maxWidth: 720 }}>
          <LPInput label="Full name" placeholder="Enter your name" value="" onChange={() => {}} />
          <LPInput label="Email" type="email" placeholder="your@email.com" value="" onChange={() => {}} />
          <LPInput label="Phone" type="tel" placeholder="+1 (555) 123-4567" value="" onChange={() => {}} />
          <LPInput label="With error" placeholder="Address" value="" onChange={() => {}} error="Address is required" />
        </div>
        <div style={{ marginTop: 16, maxWidth: 720 }}>
          <LPLabel>Standalone label</LPLabel>
          <LPTextarea placeholder="Any special requests or details..." value="" onChange={() => {}} />
        </div>
      </Specimen>

      <Specimen name="LPInput — glass surface" meta="@lp/ui/LPInput · surface='glass'" notes="Used on the hero glass form bar (dark photo bg).">
        <div className="ds-grid-2" style={{ maxWidth: 720, padding: 24, borderRadius: 16, background: "linear-gradient(135deg, #0c0c0c, #1a1a1a)" }}>
          <LPInput surface="glass" label="Full name" placeholder="Enter your name" value="" onChange={() => {}} />
          <LPInput surface="glass" label="Phone" type="tel" placeholder="(555) 123-4567" required value="" onChange={() => {}} />
        </div>
      </Specimen>

      <Specimen name="LPTextarea" meta="@lp/ui/LPInput · LPTextarea">
        <div style={{ maxWidth: 520 }}>
          <LPTextarea label="Additional information" placeholder="Any special requests or details…" value="" onChange={() => {}} />
        </div>
      </Specimen>

      <Specimen name="SelectDropdown (legacy)" meta="@lp/ui/SelectDropdown" notes="Still used in step-2 'Move size'. Pending migration to canonical LP primitive.">
        <div style={{ maxWidth: 360 }}>
          <LPSelectDropdown label="Move size" options={["Studio", "1 Bedroom", "2 Bedroom", "3+ Bedroom", "Commercial"]} />
        </div>
      </Specimen>

      <Specimen name="DatePicker (legacy)" meta="@lp/ui/DatePicker" notes="Still used in step-2 'Move date'. Pending migration to canonical LP primitive.">
        <div style={{ maxWidth: 360 }}>
          <LPDatePicker label="Move date" placeholder="Choose date" />
        </div>
      </Specimen>

      <GroupHeader id="lp-forms" eyebrow="03 — Forms" title="Composed forms" blurb="Multi-input form combinations used in heroes, modals, footers." />

      <Specimen name="LeadForm" meta="@lp/ui/LeadForm" notes="Two-field capture: name + phone → fires open-quote-modal event.">
        <div style={{ maxWidth: 420, padding: 24, background: "#0c0c0c", borderRadius: 16 }}>
          <LPLeadForm heading="Get your free quote" submitLabel="Free Quote" footnote="Takes 30 seconds." />
        </div>
      </Specimen>

      <Specimen name="StepQuoteForm" meta="@lp/ui/StepQuoteForm" notes="Two-step quote form (hero + LPCtaForm).">
        <div style={{ maxWidth: 480, padding: 24, background: "#0c0c0c", borderRadius: 16 }}>
          <LPStepQuoteForm heading="Get your free quote" city="Portland" />
        </div>
      </Specimen>

      <Specimen name="QuoteForm" meta="@lp/ui/QuoteForm" notes="Full two-step quote form used inside QuoteModal.">
        <div style={{ maxWidth: 520, padding: 24, background: "#0c0c0c", borderRadius: 16 }}>
          <LPQuoteForm heading="Tell us about your move" />
        </div>
      </Specimen>

      <Specimen name="QuoteModal" meta="@lp/ui/QuoteModal" notes="Listens for 'open-quote-modal' event. Click to preview.">
        <div className="ds-row">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
            className="btn-shine"
            style={{ paddingLeft: 24, paddingRight: 24 }}
          >
            <span className="font-mono font-bold text-base uppercase">Open Quote Modal</span>
          </button>
        </div>
      </Specimen>

      <GroupHeader id="lp-layout" eyebrow="04 — Layout" title="Layout & chrome" />

      <Specimen
        name="LPTerminalNav"
        meta="@lp/LPTerminalNav"
        notes="Floating glass nav — rendered live on every LP. Click to preview."
      >
        <Link href="/lp/movers-portland" className="ds-link">
          View on /lp/movers-portland →
        </Link>
      </Specimen>

      <Specimen name="Touchbar" meta="@lp/sections/Touchbar" notes="Sticky bottom action bar — phone + quote modal." fullBleed>
        <div className="ds-touchbar-stage">
          <LPTouchbar />
        </div>
      </Specimen>

      <GroupHeader id="lp-sections" eyebrow="05 — Sections" title="Page sections" blurb="The building blocks LPs compose into a city page." />

      <Specimen name="ServicesSection" meta="@lp/sections/ServicesSection" fullBleed>
        <LPServicesSection services={demoServices} />
      </Specimen>

      <Specimen name="LPSolution" meta="@lp/sections/LPSolution" notes="Sticky-pin horizontal scroll." fullBleed>
        <LPSolution items={lpDefaultIncluded} />
      </Specimen>

      <Specimen name="WhatsIncludedSection" meta="@lp/sections/WhatsIncludedSection" fullBleed>
        <LPWhatsIncluded />
      </Specimen>

      <Specimen name="AboutSection" meta="@lp/sections/AboutSection" fullBleed>
        <LPAboutSection />
      </Specimen>

      <Specimen name="LPProcess" meta="@lp/sections/LPProcess" notes="Left sticky heading + right card stack." fullBleed>
        <LPProcess steps={demoSteps} />
      </Specimen>

      <Specimen name="HowItWorksSection" meta="@lp/sections/HowItWorksSection" fullBleed>
        <LPHowItWorks />
      </Specimen>

      <Specimen name="CTABanner" meta="@lp/sections/CTABanner" fullBleed>
        <LPCTABanner heading="Ready to book your move?" tagline="Fully licensed, fully insured, fully transparent." />
      </Specimen>

      <Specimen name="ReviewsSection" meta="@lp/sections/ReviewsSection" fullBleed>
        <LPReviewsSection />
      </Specimen>

      <Specimen name="ServiceAreaSection" meta="@lp/sections/ServiceAreaSection" fullBleed>
        <LPServiceArea
          areas={[
            { city: "Downtown" },
            { city: "Pearl District" },
            { city: "Northwest" },
            { city: "Sellwood" },
            { city: "Hawthorne" },
            { city: "Beaverton" },
            { city: "Hillsboro" },
            { city: "Gresham" },
          ]}
          columns="4"
        />
      </Specimen>

      <Specimen name="LocalMovingRatesSection" meta="@lp/sections/LocalMovingRatesSection" fullBleed>
        <LPRatesSection />
      </Specimen>

      <Specimen name="FAQSection" meta="@lp/sections/FAQSection" fullBleed>
        <LPFAQSection items={demoFaqs} />
      </Specimen>

      <Specimen name="LPCtaForm" meta="@lp/sections/LPCtaForm" fullBleed>
        <LPCtaForm city="Portland" />
      </Specimen>

      <Specimen name="ContactFooter" meta="@lp/sections/ContactFooter" fullBleed>
        <LPContactFooter />
      </Specimen>

      {/* Quote modal lives at the end so the open-modal demo button works */}
      <LPQuoteModal />
    </>
  );
}

function SiteContent({ mode = "dark" }: { mode?: SiteMode }) {
  const isLight = mode === "light";
  /* Foundations swap palette + sample text colours when in Light mode.
     LP palette tokens already match what we want for white-mode Site. */
  const heading = isLight ? "#001f4d" : "#ffffff";
  const body = isLight ? "rgba(0,31,77,0.8)" : "rgba(255,255,255,0.8)";
  const bodyMid = isLight ? "rgba(0,31,77,0.7)" : "rgba(255,255,255,0.7)";
  const muted = isLight ? "rgba(0,31,77,0.55)" : "rgba(255,255,255,0.4)";
  return (
    <>
      <GroupHeader
        id="site-foundations"
        eyebrow="01 — Foundations"
        title="Foundations"
        blurb={isLight ? "Адаптация под белый — синий акцент #0066ff, ink текст #001f4d." : "Dark base + yellow accent. Default theme — no wrapper class required."}
      />
      <Specimen name="Palette" meta={isLight ? "site-light.css" : "globals.css"}>
        <PaletteGrid theme={isLight ? "lp" : "site"} />
      </Specimen>

      <Specimen name="Typography" meta="Geist Sans · Roboto Mono">
        <div className="ds-type-stack">
          <TypeRow label="Display" sample="Movers in Vancouver, WA" style={{ fontSize: 64, lineHeight: 1.0, letterSpacing: "-2px", fontWeight: isLight ? 600 : 700, color: heading }} />
          <TypeRow label="H2" sample="What's Included" style={{ fontSize: 48, lineHeight: 1.05, letterSpacing: "-1.4px", fontWeight: isLight ? 600 : 700, color: heading }} />
          <TypeRow label="H3 card" sample="Moving Truck & Fuel" style={{ fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.5px", fontWeight: 600, color: heading }} />
          <TypeRow label="Body L" sample="Licensed, insured, on-time." style={{ fontSize: 18, lineHeight: 1.5, color: body }} />
          <TypeRow label="Body M" sample="No hidden fees, no surprises." style={{ fontSize: 16, lineHeight: 1.5, color: bodyMid }} />
          <TypeRow label="Mono eyebrow" sample="HOW IT WORKS" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: isLight ? 12 : 16, fontWeight: isLight ? 500 : 700, letterSpacing: isLight ? "2px" : "-0.64px", textTransform: "uppercase", color: muted }} />
        </div>
      </Specimen>

      <GroupHeader id="site-primitives" eyebrow="02 — Primitives" title="UI primitives" />

      <Specimen name="Primary button — btn-shine" meta="<button class='btn-shine'>" notes="Yellow on desktop, white on mobile. Shine sweep + scale on hover.">
        <div className="ds-row">
          <button className="btn-shine bg-[#FFE533] rounded-lg h-[52px] px-6 flex items-center justify-center">
            <span className="font-mono font-bold text-base uppercase text-[#0c0c0c]">Get Free Quote</span>
          </button>
        </div>
      </Specimen>

      <Specimen name="FormInput" meta="@site/ui/FormInput">
        <div className="ds-grid-2" style={{ maxWidth: 720 }}>
          <SiteFormInput label="Full name" placeholder="Enter your name" />
          <SiteFormInput label="Email" type="email" placeholder="your@email.com" />
          <SiteFormInput label="Phone" type="tel" placeholder="+1 (555) 123-4567" />
          <SiteFormInput label="Required" placeholder="Enter address" required />
        </div>
      </Specimen>

      <Specimen name="SelectDropdown" meta="@site/ui/SelectDropdown">
        <div style={{ maxWidth: 360 }}>
          <SiteSelectDropdown label="Move size" options={["Studio", "1 Bedroom", "2 Bedroom", "3+ Bedroom", "Commercial"]} />
        </div>
      </Specimen>

      <Specimen name="DatePicker" meta="@site/ui/DatePicker">
        <div style={{ maxWidth: 360 }}>
          <SiteDatePicker label="Move date" placeholder="Choose date" />
        </div>
      </Specimen>

      <Specimen name="RatingCards" meta="@site/ui/RatingCards">
        <RatingCards />
      </Specimen>

      <Specimen name="SuccessState" meta="@site/ui/SuccessState" notes="Shown after a successful quote submission.">
        <div style={{ maxWidth: 420 }}>
          <SuccessState />
        </div>
      </Specimen>

      <GroupHeader id="site-forms" eyebrow="03 — Forms" title="Composed forms" />

      <Specimen name="LeadForm" meta="@site/ui/LeadForm">
        <div className="bg-[#181818] rounded-2xl p-6" style={{ maxWidth: 420 }}>
          <SiteLeadForm heading="Get your free quote" submitLabel="Free Quote" footnote="Takes 30 seconds." />
        </div>
      </Specimen>

      <Specimen name="StepQuoteForm" meta="@site/ui/StepQuoteForm">
        <div className="bg-[#181818] rounded-2xl p-6" style={{ maxWidth: 480 }}>
          <SiteStepQuoteForm heading="Get your free quote" />
        </div>
      </Specimen>

      <Specimen name="QuoteForm" meta="@site/ui/QuoteForm">
        <div className="bg-[#181818] rounded-2xl p-6" style={{ maxWidth: 520 }}>
          <SiteQuoteForm heading="Tell us about your move" />
        </div>
      </Specimen>

      <Specimen name="QuoteModal" meta="@site/ui/QuoteModal">
        <div className="ds-row">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
            className="btn-shine bg-[#FFE533] rounded-lg h-[52px] px-6 flex items-center justify-center"
          >
            <span className="font-mono font-bold text-base uppercase text-[#0c0c0c]">Open Quote Modal</span>
          </button>
        </div>
      </Specimen>

      <GroupHeader id="site-layout" eyebrow="04 — Layout" title="Layout & chrome" />

      <Specimen
        name="Header"
        meta="@site/layout/Header"
        notes="Sticky/scroll-aware top nav with services + locations dropdowns. Rendered live on every site page."
      >
        <Link href="/local-moving" className="ds-link">
          View on /local-moving →
        </Link>
      </Specimen>

      <Specimen name="Breadcrumbs" meta="@site/layout/Breadcrumbs">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/local-moving" }, { name: "Local Moving" }]} />
      </Specimen>

      <Specimen name="Touchbar" meta="@site/layout/Touchbar" fullBleed>
        <div className="ds-touchbar-stage">
          <SiteTouchbar />
        </div>
      </Specimen>

      <GroupHeader id="site-sections" eyebrow="05 — Sections" title="Page sections" />

      <Specimen name="HeroSection" meta="@site/sections/HeroSection" fullBleed>
        <HeroSection />
      </Specimen>

      <Specimen name="ServicesSection" meta="@site/sections/ServicesSection" fullBleed>
        <SiteServicesSection services={demoServices} />
      </Specimen>

      <Specimen name="WhatsIncludedSection" meta="@site/sections/WhatsIncludedSection" fullBleed>
        <SiteWhatsIncluded items={siteDefaultIncluded} />
      </Specimen>

      <Specimen name="AboutSection" meta="@site/sections/AboutSection" fullBleed>
        <SiteAboutSection />
      </Specimen>

      <Specimen name="HowItWorksSection" meta="@site/sections/HowItWorksSection" fullBleed>
        <SiteHowItWorks />
      </Specimen>

      <Specimen name="LocalMovingRatesSection" meta="@site/sections/LocalMovingRatesSection" fullBleed>
        <SiteRatesSection />
      </Specimen>

      <Specimen name="WhyTrustSection" meta="@site/sections/WhyTrustSection" fullBleed>
        <WhyTrustSection />
      </Specimen>

      <Specimen name="ServiceOptionsSection" meta="@site/sections/ServiceOptionsSection" fullBleed>
        <ServiceOptionsSection options={demoServiceOptions} />
      </Specimen>

      <Specimen name="FragileItemsSection" meta="@site/sections/FragileItemsSection" fullBleed>
        <FragileItemsSection items={demoFragileItems} />
      </Specimen>

      <Specimen name="OtherServicesSection" meta="@site/sections/OtherServicesSection" fullBleed>
        <OtherServicesSection />
      </Specimen>

      <Specimen name="CTABanner" meta="@site/sections/CTABanner" fullBleed>
        <SiteCTABanner />
      </Specimen>

      <Specimen name="ReviewsSection" meta="@site/sections/ReviewsSection" fullBleed>
        <SiteReviewsSection />
      </Specimen>

      <Specimen name="GallerySection" meta="@site/sections/GallerySection" fullBleed>
        <GallerySection />
      </Specimen>

      <Specimen name="ServiceAreaSection" meta="@site/sections/ServiceAreaSection" fullBleed>
        <SiteServiceArea />
      </Specimen>

      <Specimen name="FAQSection" meta="@site/sections/FAQSection" fullBleed>
        <SiteFAQSection />
      </Specimen>

      <Specimen name="ContactFooter" meta="@site/sections/ContactFooter" fullBleed>
        <SiteContactFooter />
      </Specimen>

      <SiteQuoteModal />
    </>
  );
}

/* ────────────────── mainpage-5 catalog ──────────────────────── */

function Mp5Content() {
  return (
    <>
      <GroupHeader id="mp5-foundations" eyebrow="01 — Foundations" title="Foundations" blurb="Tokens used by the terminal-industries-style draft on /mainpage-5." />
      <Specimen name="Palette" meta="mainpage-5/accent.css">
        <PaletteGrid theme="lp" />
      </Specimen>

      <Specimen name="Typography" meta="Geist Sans · Roboto Mono" notes="font-normal/medium headings — bold rejected at this scale.">
        <div className="ds-type-stack">
          <TypeRow label="Hero" sample="Moving made simple" style={{ fontSize: 112, lineHeight: 0.95, letterSpacing: "-3.4px", fontWeight: 400, color: "#001f4d" }} />
          <TypeRow label="H2" sample="How it works" style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: "-2.25px", fontWeight: 500, color: "#001f4d" }} />
          <TypeRow label="Eyebrow" sample="OUR SOLUTION" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(0,31,77,0.6)", fontWeight: 500 }} />
        </div>
      </Specimen>

      <GroupHeader id="mp5-primitives" eyebrow="02 — Primitives" title="UI primitives" blurb="Mainpage-5 ships its own AccentPill (duplicated in @lp/ui)." />

      <Specimen name="AccentPill — sizes" meta="(drafts)/mainpage-5/AccentPill">
        <div className="ds-row">
          <LPButton size="xs">Quote</LPButton>
          <LPButton size="sm">Quote</LPButton>
          <LPButton size="md">Get a Free Quote</LPButton>
          <LPButton size="lg">Get a Free Quote</LPButton>
        </div>
      </Specimen>

      <GroupHeader id="mp5-fx" eyebrow="03 — Effects" title="Background FX" blurb="WebGL hero effects unique to the draft." />

      <Specimen
        name="MagicRings"
        meta="(drafts)/mainpage-5/MagicRings"
        notes="WebGL fragment-shader ring effect behind the mainpage-5 hero headline. Embedded via dynamic import on the live page."
      >
        <Link href="/mainpage-5" className="ds-link">
          See it live on /mainpage-5 →
        </Link>
      </Specimen>

      <GroupHeader id="mp5-layout" eyebrow="04 — Layout" title="Layout & chrome" />

      <Specimen
        name="TerminalNav"
        meta="(drafts)/mainpage-5/TerminalNav"
        notes="Floating glass top nav with mega-menu. Rendered live on /mainpage-5."
      >
        <Link href="/mainpage-5" className="ds-link">
          View on /mainpage-5 →
        </Link>
      </Specimen>

      <Specimen
        name="Full draft page"
        meta="(drafts)/mainpage-5/page"
        notes="The full TerminalDraftClient page — hero scrub, sticky steps, all the FX."
      >
        <Link href="/mainpage-5" className="ds-link">
          Open /mainpage-5 →
        </Link>
      </Specimen>
    </>
  );
}

/* ────────────────── Page shell ──────────────────────────────── */

export function DesignSystemClient() {
  const [theme, setTheme] = useState<Theme>("lp");
  const [siteMode, setSiteMode] = useState<SiteMode>("dark");
  /* The visual theme of the chrome itself — LP and Site/Light both
     read as light surfaces; everything else reads as dark. */
  const chromeIsLight = theme === "lp" || (theme === "site" && siteMode === "light");

  return (
    <div className="ds-root" data-ds-theme={theme} data-ds-site-mode={siteMode} data-chrome-light={chromeIsLight}>
      {/* Style sheet for the design-system chrome itself — kept inline so
         the page works without touching globals.css. */}
      <style jsx global>{`
        .ds-root {
          --ds-bg: #0c0c0c;
          --ds-surface: #141414;
          --ds-text: #ffffff;
          --ds-muted: rgba(255, 255, 255, 0.6);
          --ds-hairline: rgba(255, 255, 255, 0.08);
          background: var(--ds-bg);
          color: var(--ds-text);
          min-height: 100vh;
        }
        .ds-root[data-chrome-light="true"] {
          --ds-bg: #ffffff;
          --ds-surface: #f5f7fb;
          --ds-text: #001f4d;
          --ds-muted: rgba(0, 31, 77, 0.6);
          --ds-hairline: rgba(0, 31, 77, 0.1);
        }
        .ds-shell { padding: 96px 24px 120px; max-width: 1408px; margin: 0 auto; }
        @media (min-width: 1024px) { .ds-shell { padding: 120px 48px 160px; } }

        .ds-topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          padding: 16px 24px;
          background: color-mix(in srgb, var(--ds-bg) 88%, transparent);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--ds-hairline);
        }
        .ds-topbar__title {
          font-family: var(--font-mono, monospace);
          font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--ds-muted);
        }
        .ds-tabs {
          display: inline-flex; padding: 4px; border-radius: 999px;
          background: color-mix(in srgb, var(--ds-text) 8%, transparent);
        }
        .ds-tab {
          padding: 8px 18px; border-radius: 999px; border: 0; cursor: pointer;
          font-family: var(--font-mono, monospace);
          font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--ds-muted); background: transparent;
          transition: color .2s ease, background .2s ease;
        }
        .ds-tab[data-active="true"] {
          background: var(--ds-text); color: var(--ds-bg);
        }

        .ds-hero {
          padding: 24px 0 56px;
          border-bottom: 1px solid var(--ds-hairline);
          margin-bottom: 56px;
        }
        .ds-hero h1 {
          font-size: 56px; line-height: 1.0; letter-spacing: -2px;
          font-weight: 600; max-width: 800px;
        }
        @media (min-width: 1024px) { .ds-hero h1 { font-size: 88px; letter-spacing: -3px; } }
        .ds-hero p { color: var(--ds-muted); max-width: 640px; margin-top: 20px; font-size: 18px; line-height: 1.5; }

        .ds-group-header { margin: 96px 0 32px; padding-top: 24px; border-top: 1px solid var(--ds-hairline); }
        .ds-eyebrow {
          display: inline-block;
          font-family: var(--font-mono, monospace);
          font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--ds-muted);
        }
        .ds-group-title { font-size: 40px; line-height: 1.05; letter-spacing: -1.2px; font-weight: 600; margin-top: 8px; }
        .ds-group-blurb { color: var(--ds-muted); max-width: 600px; margin-top: 8px; font-size: 16px; line-height: 1.5; }

        .ds-specimen {
          margin: 32px 0;
          border: 1px solid var(--ds-hairline);
          border-radius: 16px;
          overflow: hidden;
          background: color-mix(in srgb, var(--ds-bg) 96%, var(--ds-text) 4%);
        }
        .ds-specimen__head {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 24px; padding: 18px 22px; border-bottom: 1px solid var(--ds-hairline);
        }
        .ds-specimen__name { font-size: 17px; font-weight: 600; letter-spacing: -0.3px; }
        .ds-specimen__meta {
          display: block; margin-top: 6px;
          font-family: var(--font-mono, monospace); font-size: 12px;
          color: var(--ds-muted);
        }
        .ds-specimen__notes { color: var(--ds-muted); max-width: 360px; font-size: 13px; line-height: 1.5; text-align: right; }
        .ds-specimen__body {
          padding: 32px 22px;
          background: var(--ds-bg);
        }
        .ds-specimen__bodyFull {
          padding: 0; background: var(--ds-bg);
        }

        .ds-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
        .ds-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .ds-grid-2 { grid-template-columns: 1fr; } }

        .ds-palette {
          display: grid; gap: 12px;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
        .ds-swatch {
          aspect-ratio: 1.4 / 1;
          border-radius: 12px; padding: 14px;
          display: flex; flex-direction: column; justify-content: space-between;
          border: 1px solid var(--ds-hairline);
        }
        .ds-swatch__name { font-size: 14px; font-weight: 600; letter-spacing: -0.2px; }
        .ds-swatch__value { font-family: var(--font-mono, monospace); font-size: 11px; opacity: 0.75; }

        .ds-type-stack { display: flex; flex-direction: column; gap: 24px; }
        .ds-type-row { display: grid; grid-template-columns: 120px 1fr; gap: 24px; align-items: baseline; padding-bottom: 24px; border-bottom: 1px dashed var(--ds-hairline); }
        .ds-type-row:last-child { border-bottom: 0; padding-bottom: 0; }
        .ds-type-label { font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ds-muted); }

        .ds-link {
          font-family: var(--font-mono, monospace);
          font-size: 13px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--ds-text); text-decoration: underline;
          text-underline-offset: 4px; text-decoration-color: var(--ds-hairline);
        }
        .ds-link:hover { text-decoration-color: currentColor; }

        .ds-touchbar-stage {
          position: relative;
          min-height: 140px;
          background: ${chromeIsLight ? "#f5f7fb" : "#0c0c0c"};
        }
        .ds-touchbar-stage > * { position: relative !important; }

        /* Sub-tab pill (Site only). Sits to the right of the main tabs. */
        .ds-subtabs {
          display: inline-flex; padding: 3px; border-radius: 999px;
          background: color-mix(in srgb, var(--ds-text) 6%, transparent);
          margin-left: 12px;
        }
        .ds-subtab {
          padding: 6px 14px; border-radius: 999px; border: 0; cursor: pointer;
          font-family: var(--font-mono, monospace);
          font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--ds-muted); background: transparent;
          transition: color .2s ease, background .2s ease;
        }
        .ds-subtab[data-active="true"] {
          background: var(--ds-text); color: var(--ds-bg);
        }

        /* "Адаптация" banner — shown at the top of Site/Light. */
        .ds-adaptation-banner {
          margin: 0 0 32px;
          padding: 18px 22px;
          border: 1px solid rgba(0, 102, 255, 0.18);
          background: linear-gradient(90deg, rgba(0, 102, 255, 0.05), transparent);
          border-radius: 12px;
          display: flex; align-items: center; gap: 16px;
        }
        .ds-adaptation-banner__chip {
          font-family: var(--font-mono, monospace);
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 10px; border-radius: 999px;
          background: #0066ff; color: #ffffff;
          flex-shrink: 0;
        }
        .ds-adaptation-banner__copy { font-size: 14px; line-height: 1.5; color: #001f4d; }

        /* mainpage-5 magic-rings demo stage. */
        .ds-mp5-stage {
          position: relative;
          height: 480px;
          border-radius: 16px;
          overflow: hidden;
          background: #050510;
        }
      `}</style>

      {/* Tab bar */}
      <div className="ds-topbar">
        <span className="ds-topbar__title">GOAT · Design System</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div className="ds-tabs" role="tablist">
            <button
              type="button" role="tab"
              aria-selected={theme === "lp"} data-active={theme === "lp"}
              onClick={() => setTheme("lp")} className="ds-tab"
            >
              Landing Pages
            </button>
            <button
              type="button" role="tab"
              aria-selected={theme === "site"} data-active={theme === "site"}
              onClick={() => setTheme("site")} className="ds-tab"
            >
              Main Site
            </button>
            <button
              type="button" role="tab"
              aria-selected={theme === "mp5"} data-active={theme === "mp5"}
              onClick={() => setTheme("mp5")} className="ds-tab"
            >
              mainpage-5
            </button>
          </div>

          {/* Sub-tabs appear only when Main Site is active. */}
          {theme === "site" && (
            <div className="ds-subtabs" role="tablist" aria-label="Site theme mode">
              <button
                type="button" role="tab"
                aria-selected={siteMode === "dark"} data-active={siteMode === "dark"}
                onClick={() => setSiteMode("dark")} className="ds-subtab"
              >
                Dark
              </button>
              <button
                type="button" role="tab"
                aria-selected={siteMode === "light"} data-active={siteMode === "light"}
                onClick={() => setSiteMode("light")} className="ds-subtab"
              >
                Белый
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── LP tab ────────────────────────────────────────────── */}
      {theme === "lp" && (
        <div data-accent="blue" data-lp-root="" className="theme-light">
          <div className="ds-shell">
            <header className="ds-hero">
              <h1>Landing Page system</h1>
              <p>Components used on /lp/[slug] city landing pages — white surfaces, ink (#001f4d) text, brand blue (#0066ff) accent. Theme is activated via the <code>theme-light</code> class plus <code>data-lp-root</code> and <code>data-accent=&quot;blue&quot;</code> on a wrapper.</p>
            </header>
            <LPContent />
          </div>
        </div>
      )}

      {/* ── Main Site tab — Dark sub-mode ─────────────────────── */}
      {theme === "site" && siteMode === "dark" && (
        <div className="ds-shell">
          <header className="ds-hero">
            <h1>Main Site system</h1>
            <p>Components used on the main marketing site — dark surfaces (#0c0c0c), yellow accent (#FFE533), white type. This is the default theme — no wrapper class required.</p>
          </header>
          <SiteContent mode="dark" />
        </div>
      )}

      {/* ── Main Site tab — Light/Белый sub-mode ──────────────── */}
      {theme === "site" && siteMode === "light" && (
        <div
          data-accent="blue"
          data-site-light-root=""
          className="theme-light"
          style={{ background: "#ffffff" }}
        >
          <div className="ds-shell">
            <header className="ds-hero">
              <h1>Main Site · Белый</h1>
              <p>Те же компоненты сайта, но переведённые на белый фон + синий акцент <code>#0066ff</code>. Активируется обёрткой <code>theme-light</code> + <code>data-site-light-root</code> + <code>data-accent=&quot;blue&quot;</code>. <code>globals.css</code> + <code>(lp)/_shared/styles/accent.css</code> + локальный <code>site-light.css</code> правят артефакты (текст на синей кнопке, чёрные ховеры, рамки, заголовки).</p>
            </header>
            <div className="ds-adaptation-banner">
              <span className="ds-adaptation-banner__chip">Адаптация</span>
              <span className="ds-adaptation-banner__copy">Те же исходные компоненты — переоформлены под белую тему. Если что-то выглядит сломанно (невидимый текст, чёрный ховер, не тот цвет рамки) — это артефакт адаптации, его место в <code>site-light.css</code>.</span>
            </div>
            <SiteContent mode="light" />
          </div>
        </div>
      )}

      {/* ── mainpage-5 tab ────────────────────────────────────── */}
      {theme === "mp5" && (
        <div data-accent="blue" className="theme-light" style={{ background: "#ffffff" }}>
          <div className="ds-shell">
            <header className="ds-hero">
              <h1>mainpage-5 system</h1>
              <p>Visual reference for the terminal-industries-style redesign on <code>/mainpage-5</code>. White surfaces, brand blue <code>#0066ff</code>, ink <code>#001f4d</code>. LPs adopt this language via the LP tab.</p>
            </header>
            <Mp5Content />
          </div>
        </div>
      )}
    </div>
  );
}
