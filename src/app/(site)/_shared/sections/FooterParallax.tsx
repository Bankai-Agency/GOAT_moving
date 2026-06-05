"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* FooterParallax — Osmo Supply footer parallax port.

   Wraps the existing ContactFooter so its parallax behaviour is
   added without touching the footer's own markup / typography:
     • `[data-footer-parallax]` — the trigger wrapper (relative,
       overflow-hidden so the inner translate doesn't leak above).
     • `[data-footer-parallax-inner]` — the moving layer. Translated
       from -75% to 0% across the scroll range.
     • `[data-footer-parallax-dark]` — a dark overlay that fades
       (opacity 0.85 → 0 in lockstep with the scroll progress).

   Scroll range: progress 0 when the wrapper's top hits the viewport
   bottom, progress 1 when the wrapper's top hits the viewport top —
   matches the resource's `clamp(top bottom)` / `clamp(top top)`.

   Implemented with a plain passive scroll listener + rAF rather than
   GSAP ScrollTrigger. ScrollTrigger's global scroll/ticker machinery
   is torn down when the last trigger is killed (this is the only
   trigger on the corp pages), and it does NOT reliably re-bind on a
   client-side route change — the footer then froze at its hidden
   from-state (dark wash, content shoved up). Reading
   getBoundingClientRect each frame is self-contained per mount and,
   as a bonus, copes with the `.page-zoom` CSS `zoom` correctly since
   every measurement is in the same visual coordinate space. */
export function FooterParallax({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const dark = darkRef.current;
    if (!wrap || !inner || !dark) return;

    const FROM_Y = -75; // translateY(%) at progress 0
    const FROM_DARK = 0.85; // overlay opacity at progress 0
    /* Per-frame easing toward the scroll target — flattens the
       frame-to-frame jitter the CSS `zoom` introduces in the scroll
       position, the same reason the old ScrollTrigger used scrub. */
    const SMOOTH = 0.18;

    let raf = 0;
    let target = 0; // scroll-derived progress [0..1]
    let current = 0; // eased, last-applied progress
    let applied = -1; // guards redundant DOM writes

    inner.style.willChange = "transform";

    const measure = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const wrapTopDoc = scrollY + wrap.getBoundingClientRect().top;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      /* Progress 0 when the wrap's top hits the viewport bottom; progress
         1 when its top hits the viewport TOP — but clamp the end to the
         maximum scroll position so a footer shorter than the viewport
         (which can never reach the top) still finishes revealing when the
         page is scrolled to the bottom. Mirrors the old ScrollTrigger
         `clamp(top top)`. Without this the footer stayed shifted up at the
         page bottom (top clipped, black gap below). */
      const start = Math.max(0, wrapTopDoc - vh);
      const end = Math.min(maxScroll, wrapTopDoc);
      const denom = end - start;
      target = denom <= 0 ? 1 : Math.min(1, Math.max(0, (scrollY - start) / denom));
    };

    const apply = (p: number) => {
      if (Math.abs(p - applied) < 0.0005) return;
      applied = p;
      inner.style.transform = `translateY(${FROM_Y * (1 - p)}%)`;
      dark.style.opacity = String(FROM_DARK * (1 - p));
    };

    const tick = () => {
      current += (target - current) * SMOOTH;
      if (Math.abs(target - current) < 0.0008) current = target;
      apply(current);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => measure();

    // Snap to the correct state on mount (no slide-in jump after a
    // route change drops us straight onto the footer).
    measure();
    current = target;
    apply(current);
    raf = requestAnimationFrame(tick);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      inner.style.willChange = "";
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-footer-parallax=""
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div ref={innerRef} data-footer-parallax-inner="">
        {children}
      </div>
      <div
        ref={darkRef}
        data-footer-parallax-dark=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          pointerEvents: "none",
          backgroundColor: "#0c0c0c",
        }}
      />
    </div>
  );
}
