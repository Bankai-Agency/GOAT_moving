"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { IncludedItem } from "./WhatsIncludedSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Per-card spotlight + border glow — same auto-traversing radial
   gradient as LPProcessCard, but tuned for a DARK (#1a1a1a) card
   surface. Process's 0.18 / 0.55 alphas read clearly on light blue
   (#f0f5ff); on dark we double them so the blue spotlight is just
   as visible without dominating. */
function LPSolutionCard({ item, index }: { item: IncludedItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    /* Per-index phase offset — 4 cards get 0, 90°, 180°, 270° so
       they don't all pulse in sync. Pattern matches LPProcessCard. */
    const phase = (index * Math.PI * 2) / 4;
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
      className="relative overflow-hidden min-h-[320px] lg:min-h-[460px]"
      style={{
        flex: "0 0 min(480px, calc(100vw - 40px))",
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: 20,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 24,
      }}
    >
      {/* Inner spotlight — bumped alphas (0.32 / 0.10) so the blue
          glow registers against the dark card. Tracks the same
          ellipse as LPProcess. Radius bumped to 420px + an extra
          `filter: blur(40px)` so the glow smudges across the whole
          card surface (user asked for it to "размазалось по
          карточке"). The card has `overflow: hidden` so the blur
          halo clips at the card edge — no leak. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(0, 102, 255, 0.38), rgba(0, 102, 255, 0.14) 55%, transparent 95%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Border ring glow — same radial-mask trick as LPProcess; alpha
          bumped to 0.70 so the ring brightens visibly on the dark
          surface. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 20,
          background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, rgba(0, 102, 255, 0.70), transparent 60%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />

      <div
        className="lp-process-icon-pulse relative z-10 flex items-center justify-center [&_svg]:w-10 [&_svg]:h-10 [&_svg_path]:!fill-white [&_svg_circle]:!fill-white [&_svg_ellipse]:!fill-white"
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: "#0066ff",
        }}
      >
        {item.icon}
      </div>
      <div className="relative z-10 flex flex-col gap-3">
        <h3
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontWeight: 500,
            fontSize: 26,
            lineHeight: 1.2,
            letterSpacing: "-0.6px",
            color: "#ffffff",
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: 1.5,
            letterSpacing: "-0.3px",
            color: "rgba(255, 255, 255, 0.65)",
            margin: 0,
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LPSolution — sticky-pin horizontal-scroll Our Solution section.
   Header + cards both live inside a sticky h-screen container so
   they stay pinned together while the cards translate horizontally
   (vertical scroll → horizontal motion).
   ════════════════════════════════════════════════════════════════ */

type Props = {
  label?: string;
  title?: string;
  subtitle?: string;
  items: IncludedItem[];
};

export function LPSolution({
  label = "Our Solution",
  title = "How We Make Moving Predictable and Stress-Free",
  subtitle = "One hourly rate — everything your move needs, included.",
  items,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* Horizontal scroll driven by vertical via GSAP ScrollTrigger.
     Replaces the previous hand-rolled CSS-sticky + scroll handler
     which had viewport-dependent bugs (empty trailing space, scroll
     felt too fast on small phones). ScrollTrigger handles all of:
       • Cross-viewport stability (recomputes on resize via
         invalidateOnRefresh)
       • Pin behavior with NO unwanted exit phase — when pin ends,
         the next section starts immediately (pinSpacing matches
         the scroll budget exactly)
       • iOS Safari quirks (address-bar collapse etc.)
       • Smooth scrubbing (scrub: 1) without LERP hand-tuning. */
  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const SCROLL_RATIO_MOBILE = 1.5;
    const SCROLL_RATIO_DESKTOP = 1.2;

    const getDistance = () => {
      const containerWidth = Math.min(1408, window.innerWidth);
      const trackLeft =
        window.innerWidth >= 1024
          ? (window.innerWidth - containerWidth) / 2 + 16
          : 16;
      const cardGap = 20;
      return Math.max(
        0,
        trackLeft + track.scrollWidth - window.innerWidth + cardGap,
      );
    };
    const getRatio = () =>
      window.innerWidth >= 1024 ? SCROLL_RATIO_DESKTOP : SCROLL_RATIO_MOBILE;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance() * getRatio()}`,
          pin: pin,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solution"
      ref={sectionRef}
      /* No hardcoded section height — ScrollTrigger sets the
         pinSpacing dynamically to match the scroll budget needed
         (`end: "+=N"`). Section content is just the pinned pin
         child; everything else (height, pin behavior, exit) is
         managed by ScrollTrigger. */
      style={{ position: "relative" }}
      className="pt-[60px] lg:pt-[100px] pb-[60px] lg:pb-[80px]"
    >
      {/* Pin child fills the viewport (h-screen) during the pin
          phase. ScrollTrigger's `pin: pin` keeps it fixed at the
          viewport top while the page scrolls past, and releases
          it sharply at the end of the pin range (no sticky-style
          exit phase). */}
      <div ref={pinRef} className="h-screen flex flex-col justify-center overflow-hidden">
        {/* Header — content centered vertically in viewport via
            `justify-center` on the sticky flex-col. No extra mt:
            the center alignment handles the offset from sticky top
            naturally. */}
        <div className="max-w-[1408px] mx-auto px-4 w-full flex flex-col gap-3 lg:gap-4">
          {/* Bullet + label sit on top of a thin underline (same
              pattern as ServicesSection / AboutSection) so the
              eyebrow rhythm is consistent across the LP. */}
          <div className="border-b border-[#001f4d]/12 pb-3 lg:pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#0066ff]" />
              <span
                style={{
                  fontFamily: "var(--font-mono, ui-monospace, monospace)",
                  fontWeight: 600,
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
          <h2 className="font-sans font-bold text-[32px] sm:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-1.5px] lg:tracking-[-2px] text-[#001f4d] m-0">
            {title}
          </h2>
          <p
            className="font-sans font-normal text-base lg:text-lg leading-[1.45] tracking-[-0.3px] text-[#001f4d]/65 m-0"
            style={{ maxWidth: 720 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Horizontal track — cards aligned to the same max-w
            container as the header above. mt-8 lg:mt-12 matches
            the eyebrow→cards rhythm of Services-style sections;
            removed the previous flex-1 + items-center which
            inflated the gap by vertically centering the track in
            the remaining h-screen space. */}
        <div className="mt-8 lg:mt-12 w-full">
          {/* JS-driven horizontal translate on every viewport — same
              motion on mobile and desktop. `overflow-visible` lets the
              track extend past the centred container as it slides; the
              outer section's `overflow-hidden` clips it to viewport. */}
          <div
            className="px-4 lg:max-w-[1408px] lg:mx-auto lg:px-4 w-full overflow-visible"
          >
            <div
              ref={trackRef}
              className="flex gap-4 lg:gap-5"
              style={{
                willChange: "transform",
                width: "max-content",
              }}
            >
              {items.map((it, i) => (
                <LPSolutionCard key={i} item={it} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
