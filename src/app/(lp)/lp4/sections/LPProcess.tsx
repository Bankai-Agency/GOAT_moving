"use client";

import React, { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════
   LPProcess — replaces HowItWorksSection on the LP.

   Layout (terminal-industries.com/yos-vs-yms "Our Value" pattern):
     • Desktop:  two-column grid. Left column = sticky section
                 heading. Right column = cards stacked vertically.
     • Mobile:   heading on top, cards stacked below.

   Card visual: keeps the spotlight + border-glow + icon-lit
   mechanic from the original `HowItWorksCard`, BUT:
     • Always-on (no mouse / no IntersectionObserver gating)
     • Self-animating via requestAnimationFrame — the spotlight
       traces a slow elliptical path inside the card, so the
       effect lives even when the user isn't interacting.
     • Each card has a phase offset so the four cards don't all
       sync up — looks organic, not robotic.
     • Accent recolored yellow → brand blue (#FFE533) to match LP.

   The shared HowItWorksSection is NOT edited — this is an LP-only
   replacement (project rule).
   ════════════════════════════════════════════════════════════════ */

export type LPProcessStep = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type LPProcessProps = {
  label?: string;
  /** Title accepts a ReactNode so callers can drop in a `<br/>` to
   *  control where the line breaks — `clamp`-style auto-wrap on a
   *  big h2 in a constrained column often breaks at awkward spots. */
  title?: React.ReactNode;
  steps: LPProcessStep[];
};

function LPProcessCard({ step, index }: { step: LPProcessStep; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  /* Auto-animation on desktop only — orbit ellipse inside card,
     `phase` offset per index desyncs the four cards. On mobile
     (<1024px) the spotlight is static at card centre — the orbit
     loop × 4 cards × setState at 60fps was a measurable lag
     source on phones. */
  useEffect(() => {
    if (typeof window !== "undefined" &&
        window.matchMedia("(max-width: 1023px)").matches) {
      const el = cardRef.current;
      if (el) setPos({ x: el.offsetWidth / 2, y: el.offsetHeight / 2 });
      return;
    }

    let raf = 0;
    const phase = (index * Math.PI * 2) / 4; // 0, 90°, 180°, 270°
    const PERIOD = 6000; // ms — one full ellipse traversal
    const start = performance.now();

    const tick = (t: number) => {
      const el = cardRef.current;
      if (el) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const cx = w / 2;
        const cy = h / 2;
        const a = ((t - start) / PERIOD) * Math.PI * 2 + phase;
        // Ellipse: wider on x, narrower on y; stays well inside the card.
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
      /* Card height: tall enough that the sticky-scroll on the left
         heading reads as anchored, but not so tall that empty space
         dominates. 380 mobile / 460 desktop — ~20% less than the
         previous 560 attempt. Padding and inner gap dialed in so
         icon and text fill the surface naturally. */
      className="relative overflow-hidden flex flex-col justify-between min-h-[260px] lg:min-h-[400px] p-6 lg:p-9 gap-4 lg:gap-6"
      style={{
        backgroundColor: "#fffce6",
        borderRadius: 24,
      }}
    >
      {/* Animated yellow spotlight — on /lp4 the card bg is dark
          (#1a1a1a via _lp2-invert.css override), so alphas bumped
          to Solution-level intensity (0.38 / 0.14 inner,
          0.70 ring) — the lower 0.22 / 0.55 alphas read as a
          muddy olive on the dark surface. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(255, 229, 51, 0.38), rgba(255, 229, 51, 0.14) 55%, transparent 95%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Animated border glow — radial mask cuts the gradient to a
          1.5px ring around the card edge. Radius reduced too so the
          ring brightens only the section of border under the spot. */}
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

      {/* Icon container — blue tile (accent), white icon inside.
          Bumped to 88×88 with a 48×48 inner SVG so the icon has
          presence on the larger card surface. */}
      <div
        className="relative z-10 flex items-center justify-center w-14 h-14 lg:w-[88px] lg:h-[88px] [&_svg_path]:!fill-[#0c0c0c] [&_svg_circle]:!fill-[#0c0c0c] [&_svg_ellipse]:!fill-[#0c0c0c] [&>div>svg]:w-7 [&>div>svg]:h-7 lg:[&>div>svg]:w-12 lg:[&>div>svg]:h-12 lp-process-icon-pulse"
        style={{
          borderRadius: 14,
          backgroundColor: "#FFE533",
        }}
      >
        <div className="flex items-center justify-center">
          {step.icon}
        </div>
      </div>

      {/* Text block — title 22 mobile / 34 desktop; body 15 / 18.
          Sizes scale down on mobile to keep the card compact. */}
      <div className="relative z-10 flex flex-col gap-2 lg:gap-3">
        <h3
          className="text-[22px] lg:text-[34px]"
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.6px",
            color: "#001f4d",
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
            color: "rgba(0, 31, 77, 0.65)",
            margin: 0,
          }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function LPProcess({
  label = "How It Works",
  title = "How Your Move Works — Simple, Clear, Fully Controlled",
  steps,
}: LPProcessProps) {
  return (
    <section id="process" className="px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-6 lg:gap-10">
        {/* Eyebrow row — bullet + label wrapped in the same border-b
            underline pattern as ServicesSection / LPSolution /
            AboutSection so the section rhythm stays consistent. */}
        <div className="border-b border-[#001f4d]/12 pb-3 lg:pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
            <span
              style={{
                fontFamily: "var(--font-mono, ui-monospace, monospace)",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-1px",
                textTransform: "uppercase",
                color: "rgba(0, 31, 77, 0.6)",
              }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Two-column: sticky heading on left, scrolling cards on right.
            6fr/6fr — gives the right column more room (cards wider)
            without narrowing the left below the threshold where
            "Your Move, / Fully Controlled" wraps at the same lines
            as before. */}
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_6fr] gap-10 lg:gap-12">
          {/* LEFT — heading. `lg:sticky` pins it within the section so
              as the user scrolls through the cards on the right, the
              headline stays visible. `top-[120px]` clears the floating
              nav (78px) + breathing room. */}
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            {/* Use the SAME markup as every other section h2 on the LP
                (font-sans + font-bold + matching text/leading/tracking
                classes). This way the `section h2.font-bold` rules in
                lp-theme.css apply — weight bumps to 700, sizes scale
                to 32/64/96 across breakpoints, and the color flips
                from white → ink via the theme-light cascade. */}
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white">
              {title}
            </h2>
          </div>

          {/* RIGHT — cards stacked vertically. */}
          <div className="flex flex-col gap-4 lg:gap-5">
            {steps.map((step, i) => (
              <LPProcessCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
