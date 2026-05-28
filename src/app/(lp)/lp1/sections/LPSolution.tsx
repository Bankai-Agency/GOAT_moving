"use client";

import { useEffect, useRef, useState } from "react";
import type { IncludedItem } from "./WhatsIncludedSection";

/* Per-card spotlight + border glow — same auto-traversing radial
   gradient as LPProcessCard, but tuned for a DARK (#1a1a1a) card
   surface. Process's 0.18 / 0.55 alphas read clearly on light blue
   (#f0f5ff); on dark we double them so the blue spotlight is just
   as visible without dominating. */
function LPSolutionCard({
  item,
  index,
  flexBasis = "min(480px, calc(100vw - 40px))",
}: {
  item: IncludedItem;
  index: number;
  /** Override the card's flex-basis. Default is desktop-style
   *  (caps at 480px, otherwise viewport - 40px). Mobile carousel
   *  passes a narrower value (e.g. `calc(100vw - 80px)`) so the
   *  edge of the next card peeks into the viewport. */
  flexBasis?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    /* Mobile (<1024px): static spotlight at card centre, no RAF.
       The orbit animation × 4 cards × setState was the source of
       Solution-section lag on phones. Desktop keeps the original
       cosine-driven orbit since it has the CPU budget and the
       motion reads as intentional polish there. */
    if (typeof window !== "undefined" &&
        window.matchMedia("(max-width: 1023px)").matches) {
      const el = cardRef.current;
      if (el) setPos({ x: el.offsetWidth / 2, y: el.offsetHeight / 2 });
      return;
    }

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
      className="relative overflow-hidden min-h-[320px] lg:min-h-[460px] h-full"
      style={{
        flex: `0 0 ${flexBasis}`,
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
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  /* Pin+scroll-jack mechanic — DESKTOP ONLY (≥1024px). On mobile
     we render a separate horizontal-scroll container (native
     `overflow-x-auto` + scroll-snap, see JSX below). Mobile gets
     hardware-accelerated native swipe, no scroll-jack fighting
     the platform; desktop keeps the pin+translate scrub which
     reads as intentional cinematic motion on mouse wheel. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    const el = sectionRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    let targetTx = 0;
    let currentTx = 0;
    let raf = 0;

    /* Cards scrub ONLY during the pin phase on every breakpoint —
       so by the time the sticky releases, every card has been
       fully visible at the centre of the viewport. The post-pin
       "exit" phase (sticky_child sliding up out of viewport) is
       the tradeoff: ~100vh of scroll where the cards are at
       maxTx but the section is still on screen. There's no way
       around this with the current card width (≈ 85vw on mobile
       × 4 cards = ~140vh of scrub needed for a 1:1 ratio); making
       the scrub continue into the exit phase causes cards 3 & 4
       to finish their horizontal travel while they're already
       partially off-screen vertically — which is exactly the
       "last cards I never see" complaint we just fixed. */
    /* Reference the DESKTOP sticky-child explicitly via ref (was:
       `el.firstElementChild`, which now points at the mobile-only
       branch — display:none on desktop → offsetHeight = 0 → pin
       math off → cards under-scrub while page scrolls past). */
    const stickyEl = pinRef.current;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const stickyHeight = stickyEl?.offsetHeight ?? window.innerHeight;
      const total = el.offsetHeight - stickyHeight;
      const scrolled = Math.max(0, Math.min(total, -rect.top));
      const progress = total > 0 ? scrolled / total : 0;
      const containerWidth = Math.min(1408, window.innerWidth);
      /* On mobile the container is full-bleed (no centring inset)
         so trackLeft collapses to the left padding only. */
      const trackLeft =
        window.innerWidth >= 1024
          ? (window.innerWidth - containerWidth) / 2 + 16
          : 16;
      const cardGap = 20;
      const maxTx = Math.max(
        0,
        trackLeft + track.scrollWidth - window.innerWidth + cardGap,
      );
      targetTx = progress * maxTx;
    };

    const tick = () => {
      /* LERP: easing factor controls smoothness (lower = smoother /
         more lag, higher = snappier). 0.05 was so slow that with a
         tight pin range (h-[110vh] mobile = ~10vh budget vs ~220vw
         of horizontal motion) targetTx jumped to maxTx after a few
         pixels of scroll, and currentTx visibly "snapped" toward
         it over many frames — looked like the cards teleported to
         the end. 0.18 keeps the track within ~5 frames of the
         target so the motion stays tied to scroll position. */
      currentTx += (targetTx - currentTx) * 0.18;
      if (Math.abs(targetTx - currentTx) < 0.5) currentTx = targetTx;
      track.style.transform = `translateX(-${currentTx}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => compute();
    const onResize = () => compute();
    compute();
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Header block — shared between mobile + desktop renders. */
  const header = (
    <div className="max-w-[1408px] mx-auto px-4 w-full flex flex-col gap-3 lg:gap-4">
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
  );

  return (
    <section
      id="solution"
      ref={sectionRef}
      /* Section height: desktop gets the scroll envelope for the
         JS pin+horizontal-translate mechanic; mobile is auto
         (just header + native horizontal-scroll cards in normal
         flow, no scroll-jack). */
      style={{ position: "relative" }}
      className="pt-[60px] lg:pt-[100px] pb-[60px] lg:pb-[80px] lg:h-[220vh]"
    >
      {/* MOBILE (<1024px) — header in normal flow + native
          horizontal-swipe cards. No pin, no scroll-jack, no
          viewport-dependent math. Native overflow-x is hardware
          accelerated and respects momentum / rubber-band /
          scroll-snap natively. */}
      <div className="lg:hidden">
        {header}
        <div
          /* Scroll container is full viewport width. Inner flex
             has `px-4` (16px) for the first/last gutter. Without
             `scroll-pl-4`, scroll-snap snaps the snap-start item
             to viewport x=0 — ignoring the padding — and first
             card visually lands at the screen edge. `scroll-pl-4`
             makes the snap "start" line live 16px in, so card 1
             snaps to the same 16px gutter as the header. */
          className="mt-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-3 px-4" style={{ width: "max-content" }}>
            {items.map((it, i) => (
              /* Width on the snap-start WRAPPER (the actual flex
                 item). LPSolutionCard's own `flex: 0 0 ...` does
                 nothing here since the wrapper sits between it
                 and the flex container. `shrink-0` belt-and-
                 braces so the wrapper holds its width even if
                 flex container math tries to compress.

                 calc(100vw - 70px) gives ~38px peek of the next
                 card on a 390vp phone (still clear swipe cue)
                 and lets longer titles like
                 "Furniture Disassembly/Reassembly" wrap to 2 lines
                 instead of 3. */
              <div
                key={i}
                className="snap-start shrink-0"
                style={{ width: "calc(100vw - 70px)" }}
              >
                <LPSolutionCard item={it} index={i} flexBasis="100%" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP (≥1024px) — sticky-pin + JS-driven horizontal
          translate. Section's lg:h-[220vh] gives the scroll
          budget; the sticky child below stays pinned for the
          whole envelope. */}
      <div
        ref={pinRef}
        className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden"
      >
        {header}

        <div className="mt-8 lg:mt-12 w-full">
          <div className="px-4 lg:max-w-[1408px] lg:mx-auto lg:px-4 w-full overflow-visible">
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
