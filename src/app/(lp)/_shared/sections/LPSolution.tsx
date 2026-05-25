"use client";

import { useEffect, useRef } from "react";
import type { IncludedItem } from "./WhatsIncludedSection";

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

  /* requestAnimationFrame-based smoothing: target value is set
     synchronously on scroll, actual applied transform eases toward
     it on every frame (LERP with 0.12 factor). This breaks the
     direct 1:1 link between scroll wheel and card position — the
     cards lag/decelerate slightly, giving a much smoother motion
     than the previous "every-pixel-of-scroll → immediate translate"
     handler that felt jittery and abrupt. */
  useEffect(() => {
    /* Desktop only: scroll-driven horizontal translate of the track.
       Mobile uses native horizontal swipe (overflow-x: auto + snap),
       which is the standard pattern for touch and avoids the
       sticky-pin dead-zone that creates a big empty white area
       between this section and the next. */
    if (window.innerWidth < 1024) return;

    const el = sectionRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    let targetTx = 0;
    let currentTx = 0;
    let raf = 0;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(total, -rect.top));
      const progress = total > 0 ? scrolled / total : 0;
      const containerWidth = Math.min(1408, window.innerWidth);
      const trackLeft = (window.innerWidth - containerWidth) / 2 + 16;
      const cardGap = 20;
      const maxTx = Math.max(
        0,
        trackLeft + track.scrollWidth - window.innerWidth + cardGap,
      );
      targetTx = progress * maxTx;
    };

    const tick = () => {
      // LERP: easing factor controls smoothness (lower = smoother /
      // more lag, higher = snappier).
      currentTx += (targetTx - currentTx) * 0.05;
      if (Math.abs(targetTx - currentTx) < 0.5) currentTx = targetTx;
      track.style.transform = `translateX(-${currentTx}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => compute();
    compute();
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="solution"
      ref={sectionRef}
      /* Desktop: 200vh envelope so the JS scroll-driven horizontal
         translate has room to play out. Mobile: content-height —
         no fake long section, no sticky pin, no dead-zone. Cards
         use native horizontal swipe instead. */
      style={{ position: "relative" }}
      className="pt-[60px] lg:pt-[100px] pb-[60px] lg:pb-[80px] lg:h-[200vh]"
    >
      <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col lg:justify-center lg:overflow-hidden">
        {/* Header — content centered vertically in viewport via
            `justify-center` on the sticky flex-col. No extra mt:
            the center alignment handles the offset from sticky top
            naturally. */}
        <div className="max-w-[1408px] mx-auto px-4 w-full flex flex-col gap-3 lg:gap-4">
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
          {/* Mobile: native horizontal swipe — full-bleed `overflow-x:auto`
              + snap-x snap-mandatory. Padding-inline 16px gives the
              same left-edge alignment as the container above; the
              last card's right padding (added via track style) acts
              as snap-end breathing room. Desktop: keeps the JS-driven
              translate inside a centred max-w container. */}
          <div
            className="px-4 lg:max-w-[1408px] lg:mx-auto lg:px-4 w-full overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none"
            style={{ scrollbarWidth: "none" }}
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
                <div
                  key={i}
                  className="min-h-[320px] lg:min-h-[460px]"
                  style={{
                    /* Mobile: wider card (calc(100vw - 40px) ≈ 335
                       on a 375 viewport, vs the 311 we had before).
                       Desktop: capped at 480 as before. */
                    flex: "0 0 min(480px, calc(100vw - 40px))",
                    backgroundColor: "#f0f5ff",
                    borderRadius: 20,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 24,
                  }}
                >
                  <div
                    className="flex items-center justify-center [&_svg]:w-10 [&_svg]:h-10 [&_svg_path]:!fill-white [&_svg_circle]:!fill-white [&_svg_ellipse]:!fill-white"
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 16,
                      backgroundColor: "#0066ff",
                    }}
                  >
                    {it.icon}
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3
                      style={{
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontWeight: 500,
                        fontSize: 26,
                        lineHeight: 1.2,
                        letterSpacing: "-0.6px",
                        color: "#001f4d",
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {it.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontWeight: 400,
                        fontSize: 18,
                        lineHeight: 1.5,
                        letterSpacing: "-0.3px",
                        color: "rgba(0, 31, 77, 0.65)",
                        margin: 0,
                      }}
                    >
                      {it.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
