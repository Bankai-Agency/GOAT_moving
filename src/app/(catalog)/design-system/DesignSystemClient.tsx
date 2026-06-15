"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";

/* ─── LP (terminal / light theme) ─────────────────────────────── */
/* Note: (drafts)/mainpage-5 ships its own AccentPill (split-pill with
   white circular arrow nub) — visually distinct from @lp/ui/LPButton.
   We do NOT import from the parens-containing draft directory because
   Turbopack chokes on those paths and spills failure across other
   routes. Instead the catalog's mainpage-5 specimens reproduce the
   AccentPill inline via `Mp5Pill` (defined below). Source of truth for
   the live component: (drafts)/mainpage-5/AccentPill.tsx. */
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
  reviewed = false,
}: {
  name: string;
  meta?: string;
  notes?: string;
  children: ReactNode;
  /** Render in a full-width frame, no inner padding — for sections that
      already manage their own horizontal padding. */
  fullBleed?: boolean;
  /** Marks this specimen as "last reviewed" — used as a manual
      bookmark while walking through the catalog fixing artifacts. */
  reviewed?: boolean;
}) {
  return (
    <section className="ds-specimen" data-reviewed={reviewed ? "true" : undefined}>
      <div className="ds-specimen__head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 className="ds-specimen__name">{name}</h3>
            {reviewed && <span className="ds-reviewed-chip">✓ Last reviewed</span>}
          </div>
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
  { title: "Local Moving", description: "Hourly local moves with truck, fuel and equipment included.", number: "1", image: "/images/service-local.webp" },
  { title: "Long Distance", description: "Interstate relocations — fully licensed (USDOT #4232069).", number: "2", image: "/images/service-longdistance.webp" },
  { title: "Commercial", description: "Office and commercial moves with minimal downtime.", number: "3", image: "/images/service-commercial.webp" },
  { title: "Packing & Labor", description: "Professional packing, loading-only labor, fragile handling.", number: "4", image: "/images/service-packing.webp" },
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

      <Specimen
        name="Primary button — btn-shine"
        meta={isLight ? "<button class='btn-shine'> — light variant" : "<button class='btn-shine'>"}
        notes={
          isLight
            ? "Self-contained light variant. Native bg-[#0066ff] + text-white, no theme-light flips required — build the white site around THIS markup."
            : "Yellow on desktop, white on mobile. Shine sweep + scale on hover."
        }
      >
        <div className="ds-row">
          {isLight ? (
            <button className="btn-shine rounded-lg h-[52px] px-6 flex items-center justify-center bg-[#0066ff] hover:bg-[#0052cc] transition-colors">
              <span className="font-mono font-bold text-base uppercase text-white">Get Free Quote</span>
            </button>
          ) : (
            <button className="btn-shine bg-[#FFE533] rounded-lg h-[52px] px-6 flex items-center justify-center">
              <span className="font-mono font-bold text-base uppercase text-[#0c0c0c]">Get Free Quote</span>
            </button>
          )}
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
          {isLight ? (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
              className="btn-shine rounded-lg h-[52px] px-6 flex items-center justify-center bg-[#0066ff] hover:bg-[#0052cc] transition-colors"
            >
              <span className="font-mono font-bold text-base uppercase text-white">Open Quote Modal</span>
            </button>
          ) : (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
              className="btn-shine bg-[#FFE533] rounded-lg h-[52px] px-6 flex items-center justify-center"
            >
              <span className="font-mono font-bold text-base uppercase text-[#0c0c0c]">Open Quote Modal</span>
            </button>
          )}
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

      <Specimen
        name="CTABanner"
        meta="@site/sections/CTABanner"
        reviewed
        notes="Last reviewed — next fixes start with the section below."
        fullBleed
      >
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

/* Local reproduction of (drafts)/mainpage-5/AccentPill — split-pill
   blue CTA with white circular arrow nub. Kept in sync manually with
   the source file (small surface, no React state). */
const MP5_PILL_SIZE = {
  xs: { height: 36, pl: 14, pr: 4, fontSize: 12, nub: 28, icon: 11 },
  sm: { height: 44, pl: 18, pr: 5, fontSize: 14, nub: 34, icon: 12 },
  md: { height: 56, pl: 28, pr: 6, fontSize: 16, nub: 44, icon: 14 },
  lg: { height: 66, pl: 32, pr: 7, fontSize: 18, nub: 52, icon: 16 },
} as const;

function Mp5Pill({
  size = "sm",
  fullWidth = false,
  children,
  onClick,
}: {
  size?: keyof typeof MP5_PILL_SIZE;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  const s = MP5_PILL_SIZE[size];
  const style: CSSProperties = {
    height: s.height,
    paddingLeft: s.pl,
    paddingRight: s.pr,
    borderRadius: 999,
    backgroundColor: "#0066ff",
    cursor: "pointer",
    border: 0,
    transition: "transform .25s ease, background-color .25s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: Math.round((s.height - s.nub) / 2 + 4),
    width: fullWidth ? "100%" : undefined,
    justifyContent: fullWidth ? "space-between" : undefined,
  };
  return (
    <button type="button" onClick={onClick} style={style} className="group whitespace-nowrap">
      <span
        style={{
          color: "#ffffff",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontWeight: 500,
          fontSize: s.fontSize,
          lineHeight: 1,
          letterSpacing: "-0.3px",
        }}
      >
        {children}
      </span>
      <span
        style={{
          flexShrink: 0,
          width: s.nub,
          height: s.nub,
          borderRadius: 999,
          backgroundColor: "#ffffff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform .25s ease",
        }}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ color: "#0066ff" }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </button>
  );
}

/* Morph CTA — the large split-pill button rendered inside the GOAT®
   morph section. Same shape as Mp5Pill but ships its own label/icon
   sizing so the visual hierarchy with the headline reads correctly. */
function Mp5MorphCta() {
  return (
    <button
      type="button"
      className="group inline-flex items-center gap-5 rounded-full bg-[#0066ff] pl-8 pr-2 py-2 cursor-pointer transition-[transform,background-color] duration-300 ease-out hover:bg-[#0052cc] hover:-translate-y-[2px]"
    >
      <span
        className="font-sans font-medium leading-none"
        style={{ color: "#ffffff", fontSize: 20, letterSpacing: "-0.4px" }}
      >
        Get a free quote
      </span>
      <span
        className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full transition-transform duration-300 ease-out group-hover:scale-110"
        style={{ backgroundColor: "#ffffff" }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ color: "#0066ff" }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </button>
  );
}

/* Vertical text-swap label used on every nav link. Hovering scrolls
   the duplicate copy up so the word appears to refresh itself.
   Reproduction needs the `.swap-label` CSS rules from mega-nav.css;
   we import that stylesheet at the design-system route level, so the
   class names work here without changes. */
function Mp5SwapLabel({ children }: { children: string }) {
  return (
    <span className="swap-label">
      <span className="swap-label__inner">
        <span className="swap-label__txt">{children}</span>
        <span className="swap-label__txt" aria-hidden>
          {children}
        </span>
      </span>
    </span>
  );
}

/* Sample data — drawn from TerminalDraftClient on /mainpage-5. */
const mp5HeroPhrases = [
  "We have reinvented the way America moves.",
  "Crew, trucks, and routes — coordinated on one platform.",
  "Predictable pricing. Vetted teams. Zero handoffs.",
];

const mp5StickySteps = [
  {
    eyebrow: "Service 01",
    h2: "Local Moving",
    p: "Residential moves across Vancouver, WA and Portland, OR. Packing, loading, transportation, unloading — all included.",
    image: "/images/service-local.webp",
  },
  {
    eyebrow: "Service 02",
    h2: "Long Distance",
    p: "Interstate relocations from the Pacific Northwest. USDOT-licensed and fully insured.",
    image: "/images/service-longdistance.webp",
  },
];

const mp5Benefits = [
  {
    label: "Step 01",
    title: "Get a Free Estimate",
    body: "Tell us your move details — pickup, drop-off, date, anything fragile — and we'll send back an honest, all-in quote. No phone tag, no obligations.",
    image: "/images/mp5-step-01.png",
  },
  {
    label: "Step 02",
    title: "We Show Up Ready",
    body: "On move day the crew rolls up on time with the right-size truck, padding, dollies, shrink-wrap, and the materials it takes to start working in the first ten minutes.",
    image: "/images/long-distance-hero.jpg",
  },
];

const mp5MarqueeItems = [
  "USDOT #4232069",
  "Licensed in OR & WA",
  "3,000+ moves",
  "850+ five-star reviews",
  "Zero hidden fees",
  "Same-day quotes",
];

function Mp5Content() {
  /* The mp5 catalog wraps every section in `theme-light` +
     `data-accent="blue"` (set at the page-shell level in
     DesignSystemClient render). Shared components imported from
     `@site/sections` — FAQSection, ContactFooter, Touchbar,
     QuoteModal — pick up the mainpage-5 visual language via the
     accent.css overrides loaded at the route level. */
  return (
    <>
      {/* 01 — Foundations */}
      <GroupHeader id="mp5-foundations" eyebrow="01 — Foundations" title="Foundations" blurb="Tokens used by the terminal-industries-style page on /mainpage-5. White surfaces, ink #001f4d, brand blue #0066ff." />

      <Specimen name="Palette" meta="(drafts)/mainpage-5/accent.css">
        <PaletteGrid theme="lp" />
      </Specimen>

      <Specimen name="Typography" meta="Geist Sans · Roboto Mono" notes="Headlines weight 400/500 — bold is intentionally rejected at this scale to keep the terminal-industries feel.">
        <div className="ds-type-stack">
          <TypeRow label="Hero" sample="We have reinvented the way America moves." style={{ fontSize: 120, lineHeight: 0.95, letterSpacing: "-3.6px", fontWeight: 400, color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)" }} />
          <TypeRow label="H2 morph" sample="Make the next move the easy one." style={{ fontSize: 112, lineHeight: 0.96, letterSpacing: "-3.4px", fontWeight: 400, color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)" }} />
          <TypeRow label="Sticky H2" sample="Local Moving" style={{ fontSize: 80, lineHeight: 0.92, letterSpacing: "-2.8px", fontWeight: 500, color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)" }} />
          <TypeRow label="Step H3" sample="Get a Free Estimate" style={{ fontSize: 32, lineHeight: 1.1, letterSpacing: "-1px", fontWeight: 400, color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)" }} />
          <TypeRow label="Marquee" sample="USDOT #4232069" style={{ fontSize: 80, lineHeight: 1, letterSpacing: "-1px", textTransform: "uppercase", color: "#001f4d", fontFamily: "var(--font-mono, monospace)" }} />
          <TypeRow label="Body L" sample="Residential moves across Vancouver, WA and Portland, OR." style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.3px", color: "rgba(0,31,77,0.7)" }} />
          <TypeRow label="Body M" sample="No hidden fees, no hourly surprises." style={{ fontSize: 16, lineHeight: 1.5, letterSpacing: "-0.3px", color: "rgba(0,31,77,0.7)" }} />
          <TypeRow label="Eyebrow" sample="STEP 01" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(0,31,77,0.55)", fontWeight: 500 }} />
          <TypeRow label="Blue eyebrow" sample="SERVICE 01" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0066ff", fontWeight: 500, opacity: 0.85 }} />
        </div>
      </Specimen>

      {/* 02 — Primitives */}
      <GroupHeader id="mp5-primitives" eyebrow="02 — Primitives" title="UI primitives" blurb="Buttons, labels and icons rendered across the mainpage-5 surface." />

      <Specimen name="AccentPill — sizes" meta="(drafts)/mainpage-5/AccentPill" notes="Split-pill blue body, white circular arrow nub. Four sizes — xs (mobile dense), sm (header), md (form), lg (mobile-menu bottom CTA).">
        <div className="ds-row">
          <Mp5Pill size="xs">Quote</Mp5Pill>
          <Mp5Pill size="sm">Get a Free Quote</Mp5Pill>
          <Mp5Pill size="md">Get a Free Quote</Mp5Pill>
          <Mp5Pill size="lg">Get a Free Quote</Mp5Pill>
        </div>
      </Specimen>

      <Specimen name="AccentPill — fullWidth" meta="(drafts)/mainpage-5/AccentPill" notes="Used at the bottom of the mobile menu — fills the column and pushes the nub to the right edge.">
        <div style={{ maxWidth: 360 }}>
          <Mp5Pill size="lg" fullWidth>Get a free quote</Mp5Pill>
        </div>
      </Specimen>

      <Specimen name="Morph CTA" meta="TerminalDraftClient — morph section" notes="The blue split-pill rendered inside the GOAT® morph section. Same shape as AccentPill, larger nub + label.">
        <div style={{ padding: "32px 0" }}>
          <Mp5MorphCta />
        </div>
      </Specimen>

      <Specimen name="SwapLabel — hover" meta="(drafts)/mainpage-5/TerminalNav · .swap-label" notes="Vertical text-swap on hover (icomat.co.uk / rejouice style). Hover the link to trigger.">
        <div className="ds-row" style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em", color: "#001f4d" }}>
          <a href="#" onClick={(e) => e.preventDefault()} className="mega-nav__bar-link" style={{ padding: "8px 0" }}>
            <span className="mega-nav__bar-link-label"><Mp5SwapLabel>Services</Mp5SwapLabel></span>
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="mega-nav__bar-link" style={{ padding: "8px 0" }}>
            <span className="mega-nav__bar-link-label"><Mp5SwapLabel>Reviews</Mp5SwapLabel></span>
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="mega-nav__bar-link" style={{ padding: "8px 0" }}>
            <span className="mega-nav__bar-link-label"><Mp5SwapLabel>Contacts</Mp5SwapLabel></span>
          </a>
        </div>
      </Specimen>

      <Specimen name="Phone pill" meta="(drafts)/mainpage-5/TerminalNav · PhoneLink" notes="Compact 44×44 circle next to the AccentPill in the header. White on dark glass, blue icon.">
        <div className="ds-row">
          <a href="tel:+13805240846" aria-label="Call" className="inline-flex items-center justify-center rounded-full" style={{ width: 44, height: 44, backgroundColor: "#ffffff", color: "#0066ff", border: "1px solid rgba(0,31,77,0.08)" }}>
            <svg viewBox="0 0 16 16" fill="currentColor" width={16} height={16} aria-hidden>
              <path d="M4.37 11.62c2.49 2.49 5.52 4.41 7.99 4.41 1.11 0 2.08-.39 2.87-1.25.46-.51.74-1.1.74-1.69 0-.43-.16-.84-.58-1.13l-2.64-1.88c-.4-.27-.74-.41-1.05-.41-.4 0-.74.22-1.13.61l-.61.6c-.04.05-.09.08-.15.1-.05.02-.11.03-.17.03-.14 0-.26-.05-.35-.09-.52-.28-1.43-1.06-2.28-1.91-.84-.84-1.62-1.75-1.9-2.29-.06-.11-.09-.22-.09-.34 0-.11.03-.22.13-.31l.6-.63c.39-.4.61-.74.61-1.13 0-.31-.14-.65-.42-1.06L4.04.6C3.74.18 3.32 0 2.86 0 2.29 0 1.7.26 1.21.75.36 1.55 0 2.54 0 3.63c0 2.47 1.88 5.5 4.37 7.99z" />
            </svg>
          </a>
        </div>
      </Specimen>

      <Specimen name="Icon set" meta="TerminalNav — Chevron · Arrow · Back · Phone">
        <div className="ds-row" style={{ color: "#001f4d" }}>
          {/* Chevron */}
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-label="Chevron">
            <path d="M6.6665 8.3335L9.99984 11.6668L13.3332 8.3335" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Arrow */}
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-label="Arrow">
            <path d="M8.3335 13.3335L11.6668 10.0002L8.3335 6.66683" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Back */}
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-label="Back">
            <path d="M11.6665 6.6665L8.33317 9.99984L11.6665 13.3332" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Phone */}
          <svg viewBox="0 0 16 16" fill="currentColor" width={20} height={20} aria-label="Phone">
            <path d="M4.37 11.62c2.49 2.49 5.52 4.41 7.99 4.41 1.11 0 2.08-.39 2.87-1.25.46-.51.74-1.1.74-1.69 0-.43-.16-.84-.58-1.13l-2.64-1.88c-.4-.27-.74-.41-1.05-.41-.4 0-.74.22-1.13.61l-.61.6c-.04.05-.09.08-.15.1-.05.02-.11.03-.17.03-.14 0-.26-.05-.35-.09-.52-.28-1.43-1.06-2.28-1.91-.84-.84-1.62-1.75-1.9-2.29-.06-.11-.09-.22-.09-.34 0-.11.03-.22.13-.31l.6-.63c.39-.4.61-.74.61-1.13 0-.31-.14-.65-.42-1.06L4.04.6C3.74.18 3.32 0 2.86 0 2.29 0 1.7.26 1.21.75.36 1.55 0 2.54 0 3.63c0 2.47 1.88 5.5 4.37 7.99z" />
          </svg>
        </div>
      </Specimen>

      {/* 03 — Background FX */}
      <GroupHeader id="mp5-fx" eyebrow="03 — Effects" title="Background FX" blurb="WebGL ring effect and grid backdrops unique to mainpage-5." />

      <Specimen name="MagicRings — WebGL" meta="(drafts)/mainpage-5/MagicRings" notes="Fragment-shader rings behind the morph CTA. Heavy WebGL component — preview as a static gradient mockup here; see live for the real animation.">
        <div style={{ position: "relative", height: 320, borderRadius: 16, overflow: "hidden", background: "#fbfcff" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(0,102,255,0.35) 0%, rgba(0,102,255,0.18) 22%, rgba(0,102,255,0.08) 38%, rgba(0,102,255,0.03) 56%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 28px, rgba(0,102,255,0.18) 28px, rgba(0,102,255,0.18) 30px)",
            mixBlendMode: "screen",
          }} />
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Link href="/mainpage-5#cta" className="ds-link" style={{ background: "rgba(255,255,255,0.7)", padding: "8px 14px", borderRadius: 999 }}>
              See it live on /mainpage-5 →
            </Link>
          </div>
        </div>
      </Specimen>

      <Specimen name="Grid backdrop" meta="TerminalDraftClient — SVG <pattern> 60×60" notes="Faint ink-0.06 hairline grid layered behind the morph and marquee sections.">
        <div style={{ position: "relative", height: 200, borderRadius: 16, overflow: "hidden", background: "#ffffff" }}>
          <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900">
            <defs>
              <pattern id="ds-mp5-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#001f4d" strokeOpacity="0.06" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1440" height="900" fill="url(#ds-mp5-grid)" />
          </svg>
        </div>
      </Specimen>

      {/* 04 — Layout & Chrome */}
      <GroupHeader id="mp5-chrome" eyebrow="04 — Layout" title="Layout & chrome" blurb="Floating navigation and mobile action bar." />

      <Specimen name="TerminalNav — floating bar" meta="(drafts)/mainpage-5/TerminalNav" notes="Dark glass content-fit bar with mega-menu dropdowns. Scroll-aware (hides on scroll-down). View on live page for full behaviour.">
        <div style={{ position: "relative", height: 120, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #1a1f33, #0a1024)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 24,
            backgroundColor: "rgba(0, 0, 0, 0.3)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            padding: "14px 18px", borderRadius: 8,
          }}>
            <span style={{ color: "#ffffff", fontWeight: 600, letterSpacing: "-0.3px" }}>GOAT</span>
            <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em" }}>Services</span>
            <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em" }}>Locations</span>
            <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em" }}>Reviews</span>
            <Mp5Pill size="xs">Quote</Mp5Pill>
          </div>
        </div>
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <Link href="/mainpage-5" className="ds-link">Open /mainpage-5 →</Link>
        </div>
      </Specimen>

      <Specimen name="Touchbar — mobile" meta="@site/layout/Touchbar" notes="Sticky bottom action bar — only visible ≤991px (mobile). Email · Call · Quote." fullBleed>
        <div className="ds-touchbar-stage">
          <SiteTouchbar />
        </div>
      </Specimen>

      {/* 05 — Hero */}
      <GroupHeader id="mp5-hero" eyebrow="05 — Hero" title="Hero" blurb="Frame-scrub video hero with rotating phrase stack. Real hero uses 567 webp frames scrubbed by scroll." />

      <Specimen name="Hero phrase" meta="TerminalDraftClient — heroPhrases[]" notes="Each phrase shares the same grid cell — only one is visible at a time, others fade via GSAP.">
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "linear-gradient(180deg, #0a1024 0%, #1a2247 60%, #2a3b6d 100%)", padding: "80px 32px" }}>
          {mp5HeroPhrases.map((phrase, i) => (
            <h1 key={i} style={{
              color: "#ffffff", fontWeight: 400,
              fontSize: 56, lineHeight: 0.95, letterSpacing: "-1.4px",
              opacity: i === 0 ? 1 : 0.25,
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              margin: 0, marginTop: i === 0 ? 0 : 16,
            }}>
              {phrase}
            </h1>
          ))}
          <p style={{ marginTop: 32, color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontFamily: "var(--font-mono, monospace)" }}>
            Frame-scrub: 567 frames · webp · 28 MB desktop
          </p>
        </div>
      </Specimen>

      {/* 06 — Page Sections */}
      <GroupHeader id="mp5-sections" eyebrow="06 — Sections" title="Page sections" blurb="The building blocks composed by TerminalDraftClient — sticky scroll-pinned services, intro benefits, marquee, testimonial, logo grid, morph CTA, CTA banner." />

      <Specimen name="Sticky service step" meta="TerminalDraftClient — sticky-steps__item" notes="Desktop variant: left text column (eyebrow + h2 + body) + right image column. Pinned in place while scroll advances through all 5 steps." fullBleed>
        <div style={{ padding: "48px 32px", background: "#ffffff", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className="sticky-steps__eyebrow" style={{ textTransform: "uppercase", fontFamily: "var(--font-mono, monospace)", fontSize: 13, letterSpacing: "0.14em", fontWeight: 500, color: "#0066ff", opacity: 0.85 }}>
              {mp5StickySteps[0].eyebrow}
            </span>
            <h2 style={{ margin: 0, fontSize: 72, fontWeight: 500, lineHeight: 0.92, letterSpacing: "-2.5px", color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
              {mp5StickySteps[0].h2}
            </h2>
            <p style={{ margin: 0, fontSize: 20, lineHeight: 1.4, color: "#001f4d", opacity: 0.65, maxWidth: "32ch" }}>
              {mp5StickySteps[0].p}
            </p>
          </div>
          <div style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 24, overflow: "hidden" }}>
            <Image src={mp5StickySteps[0].image} alt={mp5StickySteps[0].h2} fill sizes="(min-width: 1024px) 50vw, 100vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </Specimen>

      <Specimen name="Intro / how-it-works card" meta="TerminalDraftClient — benefits[]" notes="Image stack (with subtle gradient) + 12-column text grid below. Step number eyebrow + h3 + blue accent bar + body copy." fullBleed>
        <div style={{ background: "#ffffff" }}>
          <div style={{ position: "relative", height: 320 }}>
            <Image src={mp5Benefits[0].image} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
          </div>
          <div style={{ padding: "32px 32px 48px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(0,31,77,0.55)" }}>{mp5Benefits[0].label}</span>
              <h3 style={{ margin: 0, fontSize: 32, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-1px", color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>{mp5Benefits[0].title}</h3>
              <span aria-hidden style={{ display: "block", height: 2, width: 64, background: "#0066ff" }} />
            </div>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.3px", color: "rgba(0,31,77,0.7)", maxWidth: 760 }}>
              {mp5Benefits[0].body}
            </p>
          </div>
        </div>
      </Specimen>

      <Specimen name="Marquee" meta="TerminalDraftClient — marquee-track" notes="Continuously-scrolling band of mono caps with blue diamond separators on a faint ink grid." fullBleed>
        <div style={{ position: "relative", padding: "60px 0", background: "#ffffff", overflow: "hidden" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 40, whiteSpace: "nowrap", paddingLeft: 32 }}>
            {mp5MarqueeItems.slice(0, 4).map((item, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 40 }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", fontSize: 68, lineHeight: 1, letterSpacing: "-1px", color: "#001f4d" }}>{item}</span>
                <span aria-hidden style={{ display: "inline-block", width: 14, height: 14, transform: "rotate(45deg)", background: "#0066ff" }} />
              </span>
            ))}
          </div>
        </div>
      </Specimen>

      <Specimen name="Testimonial card" meta="TerminalDraftClient — testimonial section" notes="Quote + attribution. Sits between the services scroll and the trusted-logos grid.">
        <div style={{ padding: "40px 32px", background: "#ffffff", borderRadius: 24, border: "1px solid rgba(0,31,77,0.08)" }}>
          <p style={{ margin: 0, fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.8px", fontWeight: 400, color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
            “The crew showed up early, wrapped every piece of furniture and stuck to the quote — no surprises, no upsells. Easiest move we've ever had.”
          </p>
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: "#0066ff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: 600 }}>SK</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#001f4d", letterSpacing: "-0.2px" }}>Sarah K.</span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(0,31,77,0.5)" }}>Portland · 2-Bedroom · 2025</span>
            </div>
          </div>
        </div>
      </Specimen>

      <Specimen name="Morph CTA section" meta="TerminalDraftClient — morph section" notes="GOAT® word-mark cross-fades with the headline. Below sits the morph CTA on a MagicRings backdrop." fullBleed>
        <div style={{ position: "relative", padding: "120px 32px", background: "#ffffff", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(circle at 50% 50%, rgba(0,102,255,0.12), transparent 60%)",
          }} />
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 32, textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(0,31,77,0.55)" }}>Ready when you are</span>
            <h2 style={{ margin: 0, fontSize: 72, lineHeight: 0.96, letterSpacing: "-2.4px", fontWeight: 400, color: "#001f4d", fontFamily: "var(--font-sans, system-ui, sans-serif)", maxWidth: 900 }}>
              Make the next move the easy one.
            </h2>
            <Mp5MorphCta />
          </div>
        </div>
      </Specimen>

      <Specimen name="CTA Banner" meta="@site/sections/CTABanner" notes="Site CTA banner rendered inside the mp5 theme wrapper — flips to white/blue via accent.css overrides." fullBleed>
        <SiteCTABanner heading="Ready to book your move?" tagline="Fully licensed, fully insured, fully transparent." />
      </Specimen>

      {/* 07 — FAQ & Footer */}
      <GroupHeader id="mp5-faq-footer" eyebrow="07 — FAQ & Footer" title="FAQ & Footer" blurb="Shared site components rendered through the mp5 theme — accent.css repaints them into the mainpage-5 design language." />

      <Specimen name="FAQ" meta="@site/sections/FAQSection · accent.css (mp5)" notes="Flat hairline-divider list — no chunky cards. Mp5 typography rhythm." fullBleed>
        <div id="faq">
          <SiteFAQSection items={demoFaqs} />
        </div>
      </Specimen>

      <Specimen name="ContactFooter" meta="@site/sections/ContactFooter · accent.css (mp5)" notes="Site footer rendered with mp5 overrides — normal-weight type, 11px mono eyebrows, 13–14px footnotes. Whole page wraps in FooterParallax on live." fullBleed>
        <div id="contact">
          <SiteContactFooter />
        </div>
      </Specimen>

      <Specimen name="QuoteModal" meta="@site/ui/QuoteModal · accent.css (mp5)" notes="Light-flipped modal — listens for 'open-quote-modal'. Submit & inputs repainted via accent.css.">
        <div className="ds-row">
          <Mp5Pill size="md" onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}>
            Open Quote Modal
          </Mp5Pill>
        </div>
      </Specimen>

      {/* 08 — Pointers */}
      <GroupHeader id="mp5-live" eyebrow="08 — Live" title="See it in motion" blurb="The static specimens above lose the animations — open the live page to see the scrubs and pin choreography." />

      <Specimen name="Full draft page" meta="(drafts)/mainpage-5/page">
        <Link href="/mainpage-5" className="ds-link">
          Open /mainpage-5 →
        </Link>
      </Specimen>

      {/* QuoteModal lives at the end so the demo button can dispatch
         open-quote-modal into it. */}
      <SiteQuoteModal />
    </>
  );
}

/* ────────────────── Page shell ──────────────────────────────── */

export function DesignSystemClient() {
  const [theme, setTheme] = useState<Theme>("lp");
  const [siteMode, setSiteMode] = useState<SiteMode>("dark");
  /* The visual theme of the chrome itself — LP, mainpage-5 and
     Site/Light all read as light surfaces; only Site/Dark is dark. */
  const chromeIsLight =
    theme === "lp" || theme === "mp5" || (theme === "site" && siteMode === "light");

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

        /* Reviewed bookmark — a manual checkpoint so the user can mark
           the last specimen they walked through. Loud-by-design: solid
           accent border + glowing ring + saturated solid chip so it's
           impossible to miss while scrolling through the catalog. */
        .ds-specimen[data-reviewed="true"] {
          border-color: #16a34a !important;
          border-width: 2px;
          box-shadow:
            0 0 0 4px rgba(34, 197, 94, 0.22),
            0 12px 40px rgba(34, 197, 94, 0.28);
          position: relative;
        }
        /* Loud accent stripe down the left edge — visible even when the
           card is off-screen if the user scrolls fast. */
        .ds-specimen[data-reviewed="true"]::before {
          content: "";
          position: absolute;
          top: 0; bottom: 0; left: 0;
          width: 6px;
          background: #16a34a;
          border-top-left-radius: 14px;
          border-bottom-left-radius: 14px;
        }
        .ds-specimen[data-reviewed="true"] .ds-specimen__head {
          background: linear-gradient(90deg, rgba(34, 197, 94, 0.12), transparent 60%);
        }
        .ds-reviewed-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          background: #16a34a;
          color: #ffffff;
          border: 0;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
          line-height: 1;
          animation: ds-reviewed-pulse 1.8s ease-in-out infinite;
        }
        @keyframes ds-reviewed-pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 4px 20px rgba(34, 197, 94, 0.7), 0 0 0 4px rgba(34, 197, 94, 0.18); }
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
        /* Touchbar carries the lg:hidden Tailwind class so on the
           desktop DS view its display:none rule kicks in and the
           stage renders empty. Force it visible inside the stage on
           every viewport — DS is a static catalog, not a live page.
           Also pin it relative to the stage (instead of fixed-bottom)
           so it appears in flow. */
        .ds-touchbar-stage > * {
          position: relative !important;
          display: block !important;
          transform: none !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

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
