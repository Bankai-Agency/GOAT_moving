"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* DarkScrollZone — Porsche-style "fill-to-dark" scroll reveal.
   ─────────────────────────────────────────────────────────────
   Renders a viewport-wide `position: fixed` dark veil whose
   OPACITY is driven by two scroll-derived ramps:

     • Entry: 0→1 over half a viewport as the wrapper's TOP
       crosses into view (heading + subtitle of the first inner
       section become fully visible at progress ≈ 1).
     • Exit: 1→0 as the designated exit anchor's MIDPOINT crosses
       the upper half of the viewport. The anchor is the first
       descendant carrying `[data-dark-zone-exit]`; if no such
       element exists, the wrapper's bottom edge is used.

   The veil's HEIGHT is full viewport at all times — sections
   inside the zone (including the one that triggers the exit
   fade) are painted dark by the veil while it's opaque, then
   smoothly revert to their light styling as opacity drops.

   The combined progress is also exposed as a CSS custom
   property `--dark-veil` (0..1) on the wrapper so descendant
   CSS (text / card colour blends in lp-theme.css) animates in
   lockstep with the veil. */
export function DarkScrollZone({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const veil = veilRef.current;
    if (!wrapper || !veil) return;

    const exitAnchor =
      wrapper.querySelector<HTMLElement>("[data-dark-zone-exit]") ?? wrapper;

    let raf = 0;
    let current = 0;

    const tick = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const anchorRect = exitAnchor.getBoundingClientRect();
      const vh = window.innerHeight;
      const band = vh * 0.5;

      /* Entry ramp keyed to wrapper top. */
      const inProg = Math.max(0, Math.min(1, (band - wrapperRect.top) / band));

      /* Exit ramp keyed to anchor midpoint: starts dropping when
         the midpoint reaches the upper-half band of the viewport,
         fully transparent once the midpoint crosses the top. */
      const anchorMid = anchorRect.top + anchorRect.height / 2;
      const outProg = Math.max(0, Math.min(1, anchorMid / band));

      const target = Math.min(inProg, outProg);
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.001) current = target;

      wrapper.style.setProperty("--dark-veil", current.toFixed(3));
      veil.style.opacity = current.toFixed(3);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-lp-dark-zone=""
      className="relative"
      style={{ "--dark-veil": "0" } as CSSProperties}
    >
      {/* Fixed full-viewport LIGHT veil — LP2 dark-theme inversion.
          Page is dark by default; during scroll the veil fades IN
          (white) so the area becomes light. Card colour-mix rules
          in _dark-zone.css interpolate from dark → light as the
          --dark-veil variable grows. */}
      <div
        ref={veilRef}
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[40]"
        style={{
          backgroundColor: "#ffffff",
          opacity: 0,
        }}
      />
      {/* Children lifted above the veil so their content remains
          visible while the veil paints everything behind. */}
      <div className="relative z-[50]">{children}</div>
    </div>
  );
}
