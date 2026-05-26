"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* FooterParallax — Osmo Supply footer parallax port.

   Wraps the existing ContactFooter so its parallax behaviour is
   added without touching the footer's own markup / typography:
     • `[data-footer-parallax]` — the trigger wrapper (relative,
       overflow-hidden so the inner translate doesn't leak above).
     • `[data-footer-parallax-inner]` — the moving layer. Animated
       from yPercent: -25 to 0 across the scroll range.
     • `[data-footer-parallax-dark]` — a dark overlay that fades
       (opacity 0.5 → 0 in lockstep with the scroll progress).

   Scroll range: starts when the wrapper's top hits the viewport
   bottom, ends when the wrapper's top hits the viewport top —
   matches the resource's `clamp(top bottom)` / `clamp(top top)`. */
export function FooterParallax({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ScrollTrigger plugin must be registered in every effect that
       uses it — registering elsewhere is unreliable when this
       component mounts before SmoothScrollProvider's effects fire
       (see SESSION_CONTEXT for the full GSAP HMR / tree-shaking
       note). */
    gsap.registerPlugin(ScrollTrigger);

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const dark = darkRef.current;
    if (!wrap || !inner || !dark) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "clamp(top bottom)",
        end: "clamp(top top)",
        scrub: true,
      },
    });

    /* yPercent magnitude bumped to -75 (≈3x the Osmo default) so
       the footer obviously slides "out from under" the section
       above it — strong layering feel as the page scrolls into
       the footer. Dark overlay starts almost fully opaque so the
       fade-in reads as a dramatic reveal rather than a subtle wash. */
    tl.from(inner, { yPercent: -75, ease: "linear" });
    tl.from(dark, { opacity: 0.85, ease: "linear" }, "<");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
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
