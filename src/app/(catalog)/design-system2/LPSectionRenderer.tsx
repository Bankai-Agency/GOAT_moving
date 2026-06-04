"use client";

import Image from "next/image";
import { type ReactNode, type CSSProperties } from "react";

import { LPTerminalNav } from "../../(lp)/lp1/LPTerminalNav";
import { AboutSection } from "../../(lp)/lp1/sections/AboutSection";
import { CTABanner } from "../../(lp)/lp1/sections/CTABanner";
import { LPCtaForm } from "../../(lp)/lp1/sections/LPCtaForm";
import { FAQSection } from "../../(lp)/lp1/sections/FAQSection";
import {
  EstimateIcon,
  PlanIcon,
  TruckIcon,
  HomeIcon,
} from "../../(lp)/lp1/sections/HowItWorksSection";
import { LPProcess } from "../../(lp)/lp1/sections/LPProcess";
import { ServicesSection } from "../../(lp)/lp1/sections/ServicesSection";
import { ServiceAreaSection } from "../../(lp)/lp1/sections/ServiceAreaSection";
import { LPSolution } from "../../(lp)/lp1/sections/LPSolution";
import { ReviewsSection } from "../../(lp)/lp1/sections/ReviewsSection";
import { ContactFooter } from "../../(lp)/lp1/sections/ContactFooter";
import { Touchbar } from "../../(lp)/lp1/sections/Touchbar";
import { LPQuoteForm } from "../../(lp)/lp1/ui/LPQuoteForm";
import { LPButton } from "../../(lp)/lp1/ui/LPButton";
import { LPInput, LPLabel, LPTextarea } from "../../(lp)/lp1/ui/LPInput";

import {
  demoCity,
  demoServices,
  demoIncluded,
  demoNeighborhoods,
  demoFaqs,
  demoHeroImage,
  demoSocialProofImage,
  demoAboutDescription,
  demoServiceAreaSubtitle,
  socialProofStats,
} from "./lpDemoData";

const processSteps = [
  {
    icon: <EstimateIcon />,
    title: "Get Your Free Quote",
    description:
      "We calculate and confirm your fixed price — no time windows, no last-minute changes.",
  },
  {
    icon: <PlanIcon />,
    title: "Approve Your Plan",
    description:
      "You confirm timing and scope. We lock it in — the price you see is the price you pay.",
  },
  {
    icon: <TruckIcon />,
    title: "Move Without Surprises",
    description:
      "We deliver exactly as agreed. No hidden fees, no hourly surprises, no stress.",
  },
  {
    icon: <HomeIcon />,
    title: "Settle Into Your New Place",
    description: `We unload, reassemble your furniture, and place everything where you want it — your ${demoCity} move, done right.`,
  },
];

import { SECTION_LIST as _SECTION_LIST, type SectionId as _SectionId } from "./sectionList";
export const SECTION_LIST = _SECTION_LIST;
export type SectionId = _SectionId;

/* Renders a single section by id. Used by both the showcase page and
   the iframe preview route. Sections that depend on heavy global state
   (DarkScrollZone, scroll observers) are rendered statically — the
   theme toggle handles the dark veil imitation via wrapper attrs. */
export function renderSection(id: SectionId): ReactNode {
  switch (id) {
    case "primitives":
      return <PrimitivesShowcase />;
    case "nav":
      return (
        <div style={{ minHeight: 220, paddingTop: 12 }}>
          <LPTerminalNav />
        </div>
      );
    case "hero":
      return <HeroDemo />;
    case "services":
      return (
        <ServicesSection
          label="Our Services"
          title={
            <>
              Find the Right Moving Service
              <br />
              for Your Situation
            </>
          }
          subtitle={`Full-service moving across ${demoCity} — from packing to unloading. No hidden fees, no charge for stairs.`}
          services={demoServices}
        />
      );
    case "solution":
      return (
        <LPSolution
          label="Our Solution"
          title={`How We Make Moving in ${demoCity} Predictable and Stress‑Free`}
          subtitle={`One hourly rate — everything your ${demoCity} move needs, included.`}
          items={demoIncluded}
        />
      );
    case "about":
      return (
        <AboutSection
          label="Social Proof"
          title={
            <>
              Trusted by Hundreds
              <br />
              of&nbsp;{demoCity} Customers
            </>
          }
          description={demoAboutDescription}
          stats={socialProofStats}
          {...(demoSocialProofImage ? { videoPoster: demoSocialProofImage } : {})}
        />
      );
    case "cta":
      return (
        <CTABanner
          heading={`Ready to Move in ${demoCity}?`}
          tagline="No hidden fees. No hourly surprises. Fully licensed and insured."
          buttonText="Get Your Free Quote"
        />
      );
    case "process":
      return (
        <LPProcess
          title={
            <>
              Your Move,
              <br className="hidden lg:block" /> Fully Controlled
            </>
          }
          steps={processSteps}
        />
      );
    case "reviews":
      return <ReviewsSection title={<>Real Moves. Real Reviews. No&nbsp;Surprises.</>} />;
    case "lp-cta-form":
      return (
        <LPCtaForm
          heading="Tell Us About Your Move"
          tagline={`Share a few details and we'll send a real ${demoCity} quote — not a sales pitch. Most moves estimated in under a minute.`}
          city={demoCity}
        />
      );
    case "service-area":
      return (
        <ServiceAreaSection
          label="Service Area"
          title={`We're Already Moving People in ${demoCity}`}
          subtitle={demoServiceAreaSubtitle}
          areas={demoNeighborhoods}
          columns="4"
        />
      );
    case "faq":
      return <FAQSection title="Frequently Asked Questions" items={demoFaqs} />;
    case "footer":
      return <ContactFooter />;
    case "touchbar":
      return (
        <div style={{ position: "relative", minHeight: 140 }}>
          <Touchbar />
        </div>
      );
  }
}

/* ── Primitives showcase ─────────────────────────────────────── */

function PrimitivesShowcase() {
  return (
    <div style={{ padding: "48px 24px", display: "grid", gap: 40 }}>
      <PrimitivesGroup title="Buttons — primary">
        <LPButton size="sm">Small (44px)</LPButton>
        <LPButton size="md">Medium (56px)</LPButton>
        <LPButton size="lg">Large (64px)</LPButton>
      </PrimitivesGroup>
      <PrimitivesGroup title="Buttons — secondary">
        <LPButton variant="secondary" size="sm">Small</LPButton>
        <LPButton variant="secondary" size="md">Medium</LPButton>
        <LPButton variant="secondary" size="lg">Large</LPButton>
      </PrimitivesGroup>
      <PrimitivesGroup title="Buttons — ghost">
        <LPButton variant="ghost" size="sm">Small</LPButton>
        <LPButton variant="ghost" size="md">Medium</LPButton>
        <LPButton variant="ghost" size="lg">Large</LPButton>
      </PrimitivesGroup>
      <PrimitivesGroup title="Inputs — light surface">
        <div style={{ display: "grid", gap: 12, maxWidth: 380 }}>
          <div>
            <LPLabel surface="light" htmlFor="ds2-name-light">Full name</LPLabel>
            <LPInput surface="light" id="ds2-name-light" placeholder="Your name" value="" onChange={() => {}} />
          </div>
          <div>
            <LPLabel surface="light" htmlFor="ds2-msg-light">Message</LPLabel>
            <LPTextarea surface="light" id="ds2-msg-light" rows={3} placeholder="Tell us more" value="" onChange={() => {}} />
          </div>
        </div>
      </PrimitivesGroup>
      <PrimitivesGroup title="Inputs — glass surface (on dark)">
        <div
          style={{
            background: "#0c0c0c",
            padding: 20,
            borderRadius: 12,
            display: "grid",
            gap: 12,
            maxWidth: 380,
          }}
        >
          <div>
            <LPLabel surface="glass" htmlFor="ds2-name-glass">Full name</LPLabel>
            <LPInput surface="glass" id="ds2-name-glass" placeholder="Your name" value="" onChange={() => {}} />
          </div>
          <div>
            <LPLabel surface="glass" htmlFor="ds2-msg-glass">Message</LPLabel>
            <LPTextarea surface="glass" id="ds2-msg-glass" rows={3} placeholder="Tell us more" value="" onChange={() => {}} />
          </div>
        </div>
      </PrimitivesGroup>
    </div>
  );
}

function PrimitivesGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4
        style={{
          fontFamily: "var(--font-mono, ui-monospace)",
          textTransform: "uppercase",
          letterSpacing: 2,
          fontSize: 11,
          color: "rgba(0, 31, 77, 0.55)",
          marginBottom: 14,
        }}
      >
        {title}
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Hero (replica of CityLandingPage hero) ─────────────────── */

function HeroDemo() {
  return (
    <section className="bg-[#0c0c0c]">
      <div
        data-lp-hero=""
        className="relative bg-[#181818] h-[100dvh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src={demoHeroImage}
            alt={`Professional movers in ${demoCity}`}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover object-[45%_center] lg:object-[center_25%]"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
            }}
          />
        </div>
        <div className="relative z-10 h-full px-4 pt-[100px] lg:pt-[108px] lg:pb-[108px]">
          <div className="max-w-[1408px] mx-auto h-full">
            <div className="relative flex flex-col justify-end lg:justify-center h-full pb-6 lg:pb-0 gap-5 lg:gap-5">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] lg:items-center lg:gap-12">
                <div className="flex flex-col gap-4 lg:gap-5">
                  <div className="inline-flex items-center gap-2 lg:backdrop-blur-[30px] lg:bg-[rgba(0,0,0,0.3)] lg:rounded-full lg:px-4 lg:py-2 w-fit">
                    <span className="font-sans font-semibold text-xs lg:text-sm text-white">
                      4.9 · 437+ Verified Reviews
                    </span>
                  </div>
                  <h1 className="font-sans font-normal text-[56px] sm:text-[72px] lg:text-[112px] leading-[0.95] tracking-[-1.4px] sm:tracking-[-2px] lg:tracking-[-3.4px] text-white">
                    Stress-Free
                    <br />
                    Movers in
                    <br />
                    <span className="text-[#FFE533]">{demoCity}</span>
                  </h1>
                  <p className="font-sans font-normal text-base lg:text-xl leading-[1.5] tracking-[-0.3px] text-white/80 max-w-[560px]">
                    We show up on time, handle your belongings with care, and give you a clear quote upfront. Most moves in {demoCity} cost $400–$900.
                  </p>
                </div>
                <div className="hidden lg:block relative z-40 w-full max-w-[520px] lg:ml-auto lg:self-start">
                  <LPQuoteForm city={demoCity} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden mx-4 mt-4">
        <LPQuoteForm city={demoCity} className="shadow-none!" />
      </div>
    </section>
  );
}

/* ── LP theme wrapper ─────────────────────────────────────────
   Wraps any section in the LP theme root attrs so all the LP CSS
   rules apply. When `theme="dark"` additionally drops a
   `data-lp-dark-zone` wrapper with `--dark-veil: 1` set inline —
   this triggers every color-mix interpolation in `lp-theme.css`
   at full strength, simulating the moment the DarkScrollZone veil
   is fully opaque. A solid #0c0c0c backdrop is painted behind so
   the transparent section bg reads as truly dark. */
export function LPDemoFrame({
  theme,
  children,
}: {
  theme: "light" | "dark";
  children: ReactNode;
}) {
  return (
    <div
      data-accent="blue"
      data-lp-root=""
      className="theme-light"
      style={{
        backgroundColor: theme === "dark" ? "#0c0c0c" : "#ffffff",
      }}
    >
      {theme === "dark" ? (
        <div
          data-lp-dark-zone=""
          style={{ "--dark-veil": "1", backgroundColor: "#0c0c0c" } as CSSProperties}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
