"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Touchbar() {
  const [visible, setVisible] = useState(false);
  /* `overDark` tracks whether the touchbar's footprint (bottom edge
     of the viewport) currently sits over an architecturally-dark
     zone — `[data-lp-dark-zone]` on the LP. Drives the bar's glass
     tint + text colour so the labels stay readable on every section
     (dark glass + white text over dark, light glass + ink text over
     light). Icons stay accent blue in both states. */
  const [overDark, setOverDark] = useState(false);

  // Show only after the user has scrolled past the hero. If the page
  // exposes a `[data-hero-region]` element (mainpage-5 sticky-pin
  // hero), wait until scroll passes its end. Otherwise fall back to
  // the original ~80vh threshold used on the rest of the site.
  useEffect(() => {
    const threshold = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero-region]");
      if (hero) {
        return hero.offsetTop + hero.offsetHeight - window.innerHeight;
      }
      return Math.max(window.innerHeight * 0.8, 600);
    };
    const darkZones = () =>
      document.querySelectorAll<HTMLElement>("[data-lp-dark-zone]");
    const onScroll = () => {
      setVisible(window.scrollY > threshold());
      /* Touchbar height ≈ 60px, sits at the very bottom of the
         viewport. Sample a point ~30px above the viewport bottom
         (touchbar centre) to decide which zone it sits over. */
      const probeY = window.innerHeight - 30;
      let inDark = false;
      for (const dz of Array.from(darkZones())) {
        const r = dz.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          inDark = true;
          break;
        }
      }
      setOverDark(inDark);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Glass + text palette — flips with `overDark`. Icons stay blue in
     both states for a consistent accent. */
  const bgRgba = overDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.55)";
  const textColor = overDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 31, 77, 0.85)";
  const ctaTextColor = overDark ? "#ffffff" : "#001f4d";
  const borderColor = overDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 31, 77, 0.1)";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ease-out"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      {/* Adaptive glass touchbar:
            • Dark glass + white text when sitting over a dark zone
              (Solution / Process).
            • Light glass + ink text when over any light section.
            • Icons stay accent blue (#0066ff) in both states. */}
      <div
        className="flex h-[60px] border-t transition-colors duration-200"
        style={{
          backgroundColor: bgRgba,
          borderTopColor: borderColor,
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
        }}
      >
        {/* Email */}
        <Link
          href="mailto:info@goat-moving.com"
          className="flex-1 flex flex-col items-center justify-center gap-1 active:bg-white/5 transition-colors"
          style={{ color: textColor }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span className="text-xs font-sans tracking-wide">Email</span>
        </Link>

        {/* Divider */}
        <div className="w-px" style={{ backgroundColor: borderColor }} />

        {/* Call */}
        <Link
          href="tel:+13805240846"
          className="flex-1 flex flex-col items-center justify-center gap-1 active:bg-white/5 transition-colors"
          style={{ color: textColor }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-xs font-sans tracking-wide">Call</span>
        </Link>

        {/* Divider */}
        <div className="w-px" style={{ backgroundColor: borderColor }} />

        {/* Get a Quote — primary CTA. */}
        <button
          onClick={() => window.dispatchEvent(new Event("open-quote-modal"))}
          className="flex-1 flex flex-col items-center justify-center gap-1 active:bg-white/5 transition-colors"
          style={{ color: ctaTextColor }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0066ff" stroke="#0066ff" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-xs font-sans tracking-wide">Get a Quote</span>
        </button>
      </div>
    </div>
  );
}
