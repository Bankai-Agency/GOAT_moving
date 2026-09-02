"use client";

import React, { useEffect, useRef, useState } from "react";
import { sharedContent } from "@/lib/content";
import { renderIcon } from "@/lib/content/icons";

/** `icon` is a registry name (content JSON) or legacy JSX. */
export type IncludedItem = { icon: React.ReactNode | string; title: string; description: string };

/* ════════════════════════════════════════════════════════════════
   SolutionCard — dark card with an auto-orbiting yellow spotlight +
   ring-glow + pulsing icon chip. Ported from the landing-page
   "Our Solution" block (lp4) into the site so the corp pages get the
   same look WITHOUT importing from (lp). Card surface is dark #1a1a1a;
   the icon SVG is recolored to dark-on-yellow inside the chip.
   ════════════════════════════════════════════════════════════════ */
function SolutionCard({
  item,
  index,
  flexBasis = "min(480px, calc(100vw - 40px))",
}: {
  item: IncludedItem;
  index: number;
  flexBasis?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    /* Mobile (<1024px): static spotlight at card centre, no RAF —
       the orbit × N cards × setState was the source of scroll lag on
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
    /* Per-index phase offset so cards don't all pulse in sync. */
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
      {/* Inner spotlight — orbits the card centre, blurred so the glow
          smudges across the whole surface. `overflow:hidden` clips the
          halo at the card edge. */}
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
          borderRadius: 20,
          background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, rgba(255, 229, 51, 0.70), transparent 60%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />

      <div
        className="solution-icon-pulse relative z-10 flex items-center justify-center text-[#0c0c0c] [&_svg]:w-10 [&_svg]:h-10 [&_svg_path]:!fill-[#0c0c0c] [&_svg_circle]:!fill-[#0c0c0c] [&_svg_ellipse]:!fill-[#0c0c0c] [&_svg_rect]:!fill-[#0c0c0c]"
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: "#FFE533",
        }}
      >
        {renderIcon(item.icon, 48)}
      </div>
      <div className="relative z-10 flex flex-col gap-3">
        <h3
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontWeight: 600,
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

/* Shared "What's Included" cards — edited in the admin (Общие блоки). */
export const defaultIncludedItems: IncludedItem[] = sharedContent.whatsIncluded.items;

/* ════════════════════════════════════════════════════════════════
   WhatsIncludedSection — sticky-pin horizontal-scroll "Our Solution"
   layout (ported from lp4) adapted for the DARK corp site. Header +
   cards live inside a sticky h-screen container so they stay pinned
   together while the cards translate horizontally on desktop scroll.
   Mobile renders a native horizontal-swipe carousel. Public API
   (props + `defaultIncludedItems` + `IncludedItem`) is unchanged so
   every existing call site keeps working.
   ════════════════════════════════════════════════════════════════ */
export function WhatsIncludedSection({
  label = sharedContent.whatsIncluded.label,
  title = sharedContent.whatsIncluded.title,
  subtitle = sharedContent.whatsIncluded.subtitle,
  items: itemsProp,
}: {
  label?: string;
  title?: string;
  subtitle?: string;
  items?: IncludedItem[];
} = {}) {
  const items = itemsProp ?? defaultIncludedItems;

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  /* Pin + scroll-jack — DESKTOP ONLY (≥1024px). Mobile uses native
     overflow-x swipe (see JSX below), so no scroll-jack fighting the
     platform. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    const el = sectionRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    let targetTx = 0;
    let currentTx = 0;
    let raf = 0;

    const stickyEl = pinRef.current;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const stickyHeight = stickyEl?.offsetHeight ?? window.innerHeight;
      const total = el.offsetHeight - stickyHeight;
      const scrolled = Math.max(0, Math.min(total, -rect.top));
      const progress = total > 0 ? scrolled / total : 0;
      const containerWidth = Math.min(1408, window.innerWidth);
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
      /* LERP toward target so wheel scroll reads as smooth scrub. */
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

  /* Header block — shared between mobile + desktop renders. White on
     the dark site (vs. the LP's ink-on-light original). */
  const header = (
    <div className="max-w-[1408px] mx-auto px-4 w-full flex flex-col gap-3 lg:gap-4">
      <div className="border-b border-white/16 pb-3 lg:pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
          <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
            {label}
          </span>
        </div>
      </div>
      <h2 className="font-sans font-bold text-[32px] sm:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-1.5px] lg:tracking-[-2px] text-white m-0">
        {title}
      </h2>
      <p
        className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] text-white/60 m-0"
        style={{ maxWidth: 720 }}
      >
        {subtitle}
      </p>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative" }}
      className="bg-[#0c0c0c] pt-[60px] lg:pt-[100px] pb-[60px] lg:pb-[80px] lg:h-[220vh]"
    >
      {/* MOBILE (<1024px) — header in flow + native horizontal-swipe
          cards. No pin, no scroll-jack. */}
      <div className="lg:hidden">
        {header}
        <div
          className="mt-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-3 px-4" style={{ width: "max-content" }}>
            {items.map((it, i) => (
              <div
                key={i}
                className="snap-start shrink-0"
                style={{ width: "calc(100vw - 70px)" }}
              >
                <SolutionCard item={it} index={i} flexBasis="100%" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP (≥1024px) — sticky-pin + JS-driven horizontal
          translate. Section's lg:h-[220vh] gives the scroll budget. */}
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
                <SolutionCard key={i} item={it} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
