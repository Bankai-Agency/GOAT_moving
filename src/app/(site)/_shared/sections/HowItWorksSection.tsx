"use client";

import React, { useEffect, useRef, useState } from "react";
import { sharedContent } from "@/lib/content";
import { SiteIcon, renderIcon } from "@/lib/content/icons";

export type HowItWorksStep = {
  /** Registry icon name (content JSON) or legacy JSX. */
  icon: React.ReactNode | string;
  title: string;
  description: string;
};

export type HowItWorksSectionProps = {
  label?: string;
  title?: string;
  steps?: HowItWorksStep[];
};

/* ProcessCard — dark #1a1a1a card with an always-on orbiting yellow
   spotlight + ring-glow + pulsing icon chip. Ported from the
   landing-page "How It Works" block (lp4 LPProcess) into the site so
   the corp pages get the same look WITHOUT importing from (lp). The
   icon SVG (yellow) is recolored to dark-on-yellow inside the chip. */
function ProcessCard({ step, index }: { step: HowItWorksStep; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    /* Mobile (<1024px): static spotlight at card centre, no RAF —
       the orbit × N cards × setState was a measurable lag source on
       phones. Desktop keeps the cosine-driven orbit. */
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      const el = cardRef.current;
      if (el) setPos({ x: el.offsetWidth / 2, y: el.offsetHeight / 2 });
      return;
    }

    let raf = 0;
    const phase = (index * Math.PI * 2) / 4; // 0, 90°, 180°, 270°
    const PERIOD = 6000;
    const start = performance.now();

    const tick = (t: number) => {
      const el = cardRef.current;
      if (el) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const cx = w / 2;
        const cy = h / 2;
        const a = ((t - start) / PERIOD) * Math.PI * 2 + phase;
        const rx = w * 0.35;
        const ry = h * 0.32;
        setPos({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden flex flex-col justify-between min-h-[260px] lg:min-h-[400px] p-6 lg:p-9 gap-4 lg:gap-6"
      style={{ backgroundColor: "#1a1a1a", borderRadius: 24 }}
    >
      {/* Orbiting spotlight — blurred so the glow smudges across the
          surface; the card's overflow:hidden clips the halo. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(255, 229, 51, 0.38), rgba(255, 229, 51, 0.14) 55%, transparent 95%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Border ring glow — radial-mask trick brightens the ring near
          the spotlight. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 24,
          background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, rgba(255, 229, 51, 0.70), transparent 60%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />

      {/* Yellow icon chip — pulsing halo; SVG recolored dark-on-yellow. */}
      <div
        className="solution-icon-pulse relative z-10 flex items-center justify-center text-[#0c0c0c] w-14 h-14 lg:w-[88px] lg:h-[88px] [&_svg_path]:!fill-[#0c0c0c] [&_svg_circle]:!fill-[#0c0c0c] [&_svg_ellipse]:!fill-[#0c0c0c] [&>div>svg]:w-7 [&>div>svg]:h-7 lg:[&>div>svg]:w-12 lg:[&>div>svg]:h-12"
        style={{ borderRadius: 14, backgroundColor: "#FFE533" }}
      >
        <div className="flex items-center justify-center">{renderIcon(step.icon, 36)}</div>
      </div>

      <div className="relative z-10 flex flex-col gap-2 lg:gap-3">
        <h3
          className="text-[22px] lg:text-[34px]"
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.6px",
            color: "#ffffff",
            margin: 0,
          }}
        >
          {step.title}
        </h3>
        <p
          className="text-[15px] lg:text-[18px]"
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontWeight: 400,
            lineHeight: 1.45,
            letterSpacing: "-0.2px",
            color: "rgba(255, 255, 255, 0.65)",
            margin: 0,
          }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

/* ─────────── Shared step icons (exported so service pages stay consistent) ─────────── */
export const EstimateIcon = () => <SiteIcon name="estimate" size={36} />;

export const CheckIcon = () => <SiteIcon name="check" size={36} />;

export const BoxIcon = () => <SiteIcon name="box" size={36} />;

export const DeliveryIcon = () => <SiteIcon name="delivery" size={36} />;

export const PlanIcon = () => <SiteIcon name="plan" size={36} />;

export const HomeIcon = () => <SiteIcon name="home" size={36} />;

export const TruckIcon = () => <SiteIcon name="truck" size={36} />;

/* Shared steps — edited in the admin (Общие блоки → How It Works). */
const defaultSteps: HowItWorksStep[] = sharedContent.howItWorks.steps;

export function HowItWorksSection({
  label = sharedContent.howItWorks.label,
  title = sharedContent.howItWorks.title,
  steps = defaultSteps,
}: HowItWorksSectionProps = {}) {
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-6 lg:gap-10">
        {/* Eyebrow row */}
        <div className="border-b border-white/16 pb-3 lg:pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
            <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
              {label}
            </span>
          </div>
        </div>

        {/* Two-column: sticky heading on the left, cards stacked on the
            right (terminal-industries "Our Value" pattern). */}
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_6fr] gap-10 lg:gap-12">
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white">
              {title}
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:gap-5">
            {steps.map((step, i) => (
              <ProcessCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
