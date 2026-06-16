"use client";

import React, { useEffect, useRef, useState } from "react";

export type IncludedItem = { icon: React.ReactNode; title: string; description: string };

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
        className="solution-icon-pulse relative z-10 flex items-center justify-center [&_svg]:w-10 [&_svg]:h-10 [&_svg_path]:!fill-[#0c0c0c] [&_svg_circle]:!fill-[#0c0c0c] [&_svg_ellipse]:!fill-[#0c0c0c] [&_svg_rect]:!fill-[#0c0c0c]"
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: "#FFE533",
        }}
      >
        {item.icon}
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

export const defaultIncludedItems: IncludedItem[] = [
  {
    icon: (
      <svg width="60" height="40" viewBox="10 90 500 330" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="m72.078 341.333h-50.744a32 32 0 0 0 32 32h5.6a58.374 58.374 0 0 1 13.144-32z" />
        <path d="m320 341.333h-157.411a58.374 58.374 0 0 1 13.142 32h144.269a10.667 10.667 0 0 0 10.667-10.667v-10.666a10.667 10.667 0 0 0 -10.667-10.667z" />
        <circle cx="117.334" cy="378.667" r="37.333" />
        <path d="m507.219 275.173-40.985-90.163a42.749 42.749 0 0 0 -38.834-25.01h-64.733a10.667 10.667 0 0 0 -10.667 10.667v167.817a58.588 58.588 0 0 1 101.064 34.849h26.936a32 32 0 0 0 32-32v-44.091a53.32 53.32 0 0 0 -4.781-22.069zm-48.633-8.507h-69.253a10.667 10.667 0 0 1 -10.666-10.666v-42.667a10.667 10.667 0 0 1 10.667-10.667h42.991a21.333 21.333 0 0 1 19.421 12.5l16.554 36.42a10.667 10.667 0 0 1 -9.714 15.081z" />
        <circle cx="394.667" cy="378.667" r="37.333" />
        <path d="m298.667 96h-245.334a32 32 0 0 0 -32 32v128h-10.1c-5.308 0-10.233 3.63-11.087 8.875a10.675 10.675 0 0 0 10.521 12.459h26.1c5.314 0 10.238 3.63 11.092 8.875a10.675 10.675 0 0 1 -10.521 12.459h-26.1c-5.313-.001-10.238 3.632-11.092 8.873a10.675 10.675 0 0 0 10.521 12.459h309.333a10.667 10.667 0 0 0 10.667-10.667v-181.333a32 32 0 0 0 -32-32z" />
      </svg>
    ),
    title: "Moving Truck & Fuel",
    description: "Full-size moving truck included. No mileage charges within your local area.",
  },
  {
    icon: (
      <svg width="60" height="32" viewBox="0 5.5 24 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0020 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" fill="white"/>
      </svg>
    ),
    title: "Professional Movers",
    description: "Trained crew. Careful with your belongings from start to finish.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="m30 15.5c0 .828-.672 1.5-1.5 1.5h-25c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5h.673c.658-3.904 3.203-7.162 6.666-8.818l.306 3.14c.04.412.399.722.819.674.412-.04.714-.406.674-.818l-.521-5.354c-.044-.447.307-.824.746-.824h6.273c.439 0 .79.377.747.823l-.521 5.354c-.04.412.262.778.674.818.025.004.049.005.073.005.381 0 .708-.29.746-.678l.306-3.14c3.463 1.655 6.008 4.913 6.666 8.818h.673c.828 0 1.5.672 1.5 1.5z" />
        <path d="m29.5 21h-1.5c0-1.103-.897-2-2-2h-20c-1.103 0-2 .897-2 2h-1.5c-.276 0-.5.224-.5.5v2c0 .276.224.5.5.5h1.5v2c0 .266.105.52.293.707l2 2c.187.188.442.293.707.293h6c.334 0 .646-.167.832-.445.742-1.111 1.718-2.236 2.168-2.516.45.279 1.426 1.404 2.168 2.516.186.278.498.445.832.445h6c.265 0 .52-.105.707-.293l2-2c.188-.187.293-.441.293-.707v-2h1.5c.276 0 .5-.224.5-.5v-2c0-.276-.224-.5-.5-.5zm-3.5 4.586-1.414 1.414h-5.058c-1.024-1.459-2.377-3-3.528-3s-2.504 1.541-3.528 3h-5.058l-1.414-1.414-.001-4.586h20.001z" />
      </svg>
    ),
    title: "Equipment",
    description: "Dollies, furniture blankets, straps, and tools — all included.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M481.429,332.892c-26.337-26.357-62.882-37.523-109.815-24.945L204.256,140.419l2.212-8.364c9.639-36.166-0.776-75.041-27.172-101.437C152.42,3.721,114.212-6.148,78.077,3.778c-5.153,1.415-9.164,5.464-10.529,10.631c-1.365,5.167,0.132,10.659,3.909,14.438l40.297,40.297c11.781,11.81,11.666,30.724,0.029,42.392c-11.545,11.576-30.951,11.558-42.45,0.029L29.028,71.257c-3.779-3.781-9.287-5.264-14.454-3.891c-5.168,1.372-9.202,5.393-10.612,10.551c-9.781,35.738-0.159,74.183,26.846,101.188c26.326,26.345,62.825,37.551,109.786,24.946l167.371,167.528c-12.49,46.919-1.716,83.11,24.975,109.801c26.91,26.93,65.136,36.726,101.192,26.833c5.154-1.414,9.166-5.464,10.532-10.631c1.366-5.167-0.13-10.66-3.909-14.44l-40.288-40.288c-11.781-11.81-11.666-30.726-0.029-42.392c11.689-11.629,31.052-11.444,42.45-0.015l40.308,40.297c3.779,3.779,9.287,5.262,14.453,3.889c5.167-1.373,9.201-5.392,10.611-10.549C518.041,398.352,508.421,359.897,481.429,332.892z" />
        <path d="M160.551,266.584L17.559,409.594c-23.401,23.401-23.401,61.455,0,84.855c23.401,23.401,61.455,23.401,84.855,0l142.989-143.006L160.551,266.584z M88.322,447.898c-5.86,5.86-15.35,5.86-21.21,0c-5.859-5.859-5.859-15.351,0-21.21l90.98-90.997c5.859-5.859,15.352-5.859,21.21,0c5.859,5.859,5.859,15.351,0,21.21L88.322,447.898z" />
        <path d="M507.596,30.253L481.737,4.394c-4.867-4.867-12.42-5.797-18.322-2.258l-79.547,47.723c-8.37,5.021-9.791,16.568-2.891,23.469l6.332,6.33l-100.98,100.567l42.435,42.435l100.98-100.567l8.919,8.921c6.901,6.899,18.449,5.479,23.469-2.891l47.723-79.547C513.393,42.673,512.463,35.12,507.596,30.253z" />
      </svg>
    ),
    title: "Furniture Disassembly/\nReassembly",
    description: "Bed frames and basic furniture taken apart and put back together at no extra cost.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="white"/>
      </svg>
    ),
    title: "Floor & Door Protection",
    description: "We protect your floors and doorframes during the move.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 511.734 511.734" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M410.534,151.467h2.133l29.867-29.867l-29.867-29.867l-32,32c-30.387-20.811-65.688-33.313-102.4-36.267v-44.8h42.667V0h-128v42.667H235.6v44.8c-36.712,2.954-72.013,15.456-102.4,36.267l-32-32L71.334,121.6l29.867,29.867c-81.149,85.42-77.686,220.451,7.734,301.6s220.451,77.687,301.6-7.734C488.756,362.994,488.756,233.806,410.534,151.467z M256.934,469.333c-94.257,0-170.667-76.41-170.667-170.667S162.677,128,256.934,128S427.6,204.41,427.6,298.667S351.19,469.333,256.934,469.333z" />
        <path d="M256.934,149.333c-82.475,0-149.333,66.859-149.333,149.333S174.459,448,256.934,448s149.333-66.859,149.333-149.333S339.408,149.333,256.934,149.333z M276.134,315.733c-10.015,10.015-26.252,10.015-36.267,0s-10.015-26.252,0-36.267l102.4-66.133L276.134,315.733z" />
      </svg>
    ),
    title: "Same-Day Service",
    description: "Most local moves completed in one visit — no waiting for a second trip.",
  },
];

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
  label = "What's Included",
  title = "What's Included in Every Local Move",
  subtitle = "One hourly rate — everything covered",
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
