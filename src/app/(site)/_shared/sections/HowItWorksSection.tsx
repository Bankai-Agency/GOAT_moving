"use client";

import React, { useEffect, useRef, useState } from "react";

export type HowItWorksStep = {
  icon: React.ReactNode;
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
        className="solution-icon-pulse relative z-10 flex items-center justify-center w-14 h-14 lg:w-[88px] lg:h-[88px] [&_svg_path]:!fill-[#0c0c0c] [&_svg_circle]:!fill-[#0c0c0c] [&_svg_ellipse]:!fill-[#0c0c0c] [&>div>svg]:w-7 [&>div>svg]:h-7 lg:[&>div>svg]:w-12 lg:[&>div>svg]:h-12"
        style={{ borderRadius: 14, backgroundColor: "#FFE533" }}
      >
        <div className="flex items-center justify-center">{step.icon}</div>
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
export const EstimateIcon = () => (
  <svg width="36" height="36" viewBox="0 3 64 61" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m2.73083 52.2054c-2.8129349 5.6278 2.91723 11.7123 8.70327 9.2318l16.6256-7.1277c2.5161-1.0788 5.3645-1.0788 7.8806 0l16.6256 7.1277c5.7861 2.4805 11.5162-3.604 8.7033-9.2318l-23.2272-46.47015c-2.4893-4.980346-9.5947-4.980326-12.084.00001z" fill="#FFE533"/>
  </svg>
);

export const CheckIcon = () => (
  <svg width="36" height="36" viewBox="3 10 92 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m92.3744278 10.9533825c-17.5293427 5.7132702-39.7331848 21.0352192-60.3788681 47.3941746l-12.2056198-13.5040856c-1.9477062-2.0775528-5.3237267-2.0775528-7.1415873 0l-8.9594412 9.9982147c-1.6880126 1.9477043-1.5581672 4.9341888.2596931 6.7520485l27.5275745 26.3589401c2.3372402 2.2073975 5.9729557 1.5581665 7.531126-1.1686249 14.6727142-26.6186447 30.5140572-46.3553925 57.0028419-68.9487762 3.3760225-2.8566322.5193865-8.3102083-3.6357191-6.8818912z" fill="#FFE533"/>
  </svg>
);

export const BoxIcon = () => (
  <svg width="36" height="36" viewBox="0 0 475.078 475.077" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M438.536,146.177H36.547c-4.952,0-9.235,1.807-12.85,5.424c-3.617,3.615-5.424,7.898-5.424,12.847v274.084 c0,4.948,1.807,9.233,5.424,12.847c3.615,3.617,7.898,5.428,12.85,5.428h401.989c4.949,0,9.229-1.811,12.847-5.428 c3.614-3.613,5.421-7.898,5.421-12.847V164.448c0-4.952-1.8-9.231-5.421-12.847C447.769,147.984,443.485,146.177,438.536,146.177z M286.927,232.113c-3.613,3.616-7.898,5.424-12.847,5.424h-73.089c-4.946,0-9.229-1.809-12.847-5.424 c-3.615-3.617-5.424-7.898-5.424-12.85c0-4.948,1.809-9.231,5.424-12.847c3.617-3.617,7.9-5.426,12.847-5.426h73.096 c4.945,0,9.227,1.809,12.847,5.426c3.614,3.615,5.421,7.898,5.421,12.847C292.355,224.214,290.544,228.496,286.927,232.113z" fill="#FFE533"/>
    <path d="M469.658,23.695c-3.618-3.617-7.898-5.424-12.848-5.424H18.272c-4.948,0-9.231,1.807-12.847,5.424 C1.809,27.31,0,31.593,0,36.542v73.089c0,4.948,1.809,9.229,5.426,12.847c3.616,3.617,7.898,5.424,12.847,5.424h438.531 c4.948,0,9.233-1.807,12.854-5.424c3.613-3.617,5.42-7.898,5.42-12.847V36.542C475.078,31.59,473.271,27.31,469.658,23.695z" fill="#FFE533"/>
  </svg>
);

export const DeliveryIcon = () => (
  <svg width="36" height="36" viewBox="0 49 512 414" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m503.445 425.75 7.236-16.101c1.758-3.911 1.758-8.388 0-12.299l-7.236-16.1 7.236-16.101c2.086-4.642 1.677-10.024-1.087-14.297-2.765-4.272-7.506-6.853-12.595-6.853h-69.95c-20.309 50.604-57.587 92.625-104.755 119.001h174.706c5.089 0 9.83-2.58 12.595-6.853 2.764-4.272 3.173-9.655 1.087-14.297z" fill="#FFE533"/>
    <ellipse cx="207" cy="256" rx="60" ry="60" transform="matrix(.987 -.16 .16 .987 -38.334 36.463)" fill="#FFE533"/>
    <path d="m414 256c0-114.14-92.86-207-207-207s-207 92.86-207 207 92.86 207 207 207 207-92.86 207-207zm-207 90c-49.626 0-90-40.374-90-90s40.374-90 90-90 90 40.374 90 90-40.374 90-90 90z" fill="#FFE533"/>
  </svg>
);

export const PlanIcon = () => (
  <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m46 8h-6.25c-.89-3.45-4.03-6-7.75-6s-6.86 2.55-7.75 6h-6.25c-5.51 0-10 4.49-10 10v34c0 5.51 4.49 10 10 10h28c5.51 0 10-4.49 10-10v-34c0-5.51-4.49-10-10-10zm-29.33 33.77c.82-.73 2.09-.66 2.82.16l1.79 2.01 5.18-6.22c.71-.85 1.97-.96 2.82-.26.85.71.96 1.97.26 2.82l-6.67 8c-.37.45-.92.71-1.5.72h-.04c-.57 0-1.11-.24-1.49-.67l-3.33-3.73c-.74-.83-.67-2.09.16-2.83zm2.82-17.84 1.79 2.01 5.18-6.22c.71-.85 1.97-.96 2.82-.26.85.71.96 1.97.26 2.82l-6.67 8c-.37.45-.92.71-1.5.72h-.04c-.57 0-1.11-.24-1.49-.67l-3.33-3.73c-.74-.83-.67-2.09.16-2.83.82-.73 2.09-.66 2.82.16zm12.51 20.07c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2s-.9 2-2 2h-12c-1.1 0-2-.9-2-2zm14-16h-12c-1.1 0-2-.9-2-2s.9-2 2-2h12c1.1 0 2 .9 2 2s-.9 2-2 2z" fill="#FFE533"/>
  </svg>
);

export const HomeIcon = () => (
  <svg width="36" height="36" viewBox="0 30 512 450" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m499.3 207.2-198.3-166.3c-26-21.8-63.9-21.8-89.9 0l-198.5 166.3c-25.2 21.1-10.3 62.1 22.6 62.1h18v183.2c0 19.3 15.7 35 35 35h100.3v-118.4c0-37.3 30.2-67.5 67.5-67.5 37.3 0 67.5 30.2 67.5 67.5v118.3h100.3c19.3 0 35-15.7 35-35v-183.1h18c32.8 0 47.7-41 22.5-62.1z" fill="#FFE533"/>
  </svg>
);

export const TruckIcon = () => (
  <svg className="!w-[37px] !h-[22px] lg:!w-12 lg:!h-[30px]" viewBox="0 9 45 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.409,18.905l-4.946-7.924c-0.548-0.878-1.51-1.411-2.545-1.411H3c-1.657,0-3,1.343-3,3v16.86c0,1.657,1.343,3,3,3h0.787 c0.758,1.618,2.391,2.75,4.293,2.75s3.534-1.132,4.292-2.75h20.007c0.758,1.618,2.391,2.75,4.293,2.75 c1.9,0,3.534-1.132,4.291-2.75h0.787c1.656,0,3-1.343,3-3v-2.496C44.75,22.737,41.516,19.272,37.409,18.905z M8.087,32.395 c-1.084,0-1.963-0.879-1.963-1.963s0.879-1.964,1.963-1.964s1.963,0.88,1.963,1.964S9.171,32.395,8.087,32.395z M26.042,21.001 V15.57v-2.999h3.876l5.264,8.43H26.042z M36.671,32.395c-1.084,0-1.963-0.879-1.963-1.963s0.879-1.964,1.963-1.964 s1.963,0.88,1.963,1.964S37.755,32.395,36.671,32.395z" fill="#FFE533"/>
  </svg>
);

const defaultSteps: HowItWorksStep[] = [
  {
    icon: <EstimateIcon />,
    title: "Get a Free Estimate",
    description: "Tell us your move details — we’ll give you an honest quote with no obligations.",
  },
  {
    icon: <CheckIcon />,
    title: "We Show Up Ready",
    description: "Our crew arrives on time with the truck, equipment, and materials to get started.",
  },
  {
    icon: <BoxIcon />,
    title: "We Pack & Load",
    description: "Furniture wrapped, boxes stacked, everything secured in the truck.",
  },
  {
    icon: <TruckIcon />,
    title: "Delivery & Setup",
    description: "We unload at your new place, reassemble furniture, and put everything where you want it.",
  },
];

export function HowItWorksSection({
  label = "How It Works",
  title = "How Your Move Works",
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
