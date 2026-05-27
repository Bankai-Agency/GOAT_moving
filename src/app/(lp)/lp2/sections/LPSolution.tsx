"use client";

import { useEffect, useRef, useState } from "react";
import type { IncludedItem } from "./WhatsIncludedSection";

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
  const trackRef = useRef<HTMLDivElement>(null);

  /* requestAnimationFrame-based smoothing: target value is set
     synchronously on scroll, actual applied transform eases toward
     it on every frame (LERP with 0.12 factor). This breaks the
     direct 1:1 link between scroll wheel and card position — the
     cards lag/decelerate slightly, giving a much smoother motion
     than the previous "every-pixel-of-scroll → immediate translate"
     handler that felt jittery and abrupt. */
  useEffect(() => {
    /* Scroll-driven horizontal translate of the card track — same
       behaviour on every viewport. Mobile previously fell back to
       native overflow-x swipe; we now keep the sticky-pin pattern
       so mobile and desktop share identical motion. */
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
    const stickyEl = el.firstElementChild as HTMLElement | null;

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

  return (
    <section
      id="solution"
      ref={sectionRef}
      /* 200vh envelope on every viewport so the JS scroll-driven
         horizontal translate has room to play out. Sticky child below
         pins for the whole envelope. */
      style={{ position: "relative" }}
      /* Section height = sticky.h + pin_range. Pin range needs
         to cover maxTx for a 1:1 scrub:
           • Mobile: maxTx ≈ 140vh on a 400px phone → section
             needs ≈ 240vh (100vh sticky + 140vh pin).
           • Desktop: maxTx much smaller (cards capped at 480px),
             so 220vh is plenty.
         Don't reduce mobile below ~230vh — cards will be moving
         faster than scroll and feel like a teleport. The post-pin
         "exit" of the sticky child (~100vh) is the unavoidable
         tradeoff with this card width: either we keep it (and
         every card is fully visible during scrub) or we shrink
         cards / change layout. */
      className="pt-[60px] lg:pt-[100px] pb-[60px] lg:pb-[80px] h-[240vh] lg:h-[220vh]"
    >
      {/* Animated blob backdrop is rendered by the BlueBlobBackdrop
          wrapper around this section + AboutSection in
          CityLandingPage so the gradient flows continuously from
          Our Solution into Social Proof. No section-local backdrop
          needed here. */}
      {/* Sticky child fills the viewport on every breakpoint —
          guarantees nothing peeks under it during the pin phase.
          The scrub-during-exit strategy on mobile (see compute())
          handles the seamless hand-off to AboutSection. */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
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
