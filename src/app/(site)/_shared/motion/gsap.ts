"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

/* Register GSAP plugins exactly once. Called from
   SmoothScrollProvider's useEffect — works around tree-shaking that
   was eliding the previous module-level side-effect block (no
   plugins were actually being attached, so every `scrollTrigger:`
   config was silently a no-op). */
let registered = false;
export function registerGsapPlugins() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  registered = true;
  /* Expose for in-browser debugging only — easy to inspect via
     console / preview eval whether ScrollTrigger is alive and how
     many triggers were created. Safe to ship: it's just a reference. */
  (window as unknown as { __gsap?: typeof gsap; __ST?: typeof ScrollTrigger }).__gsap = gsap;
  (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;
}

/* Wire ScrollTrigger to Lenis's scroll callback so pinned + scrub
   animations stay perfectly in sync with the smooth-scrolled position
   instead of the (lerped) native scrollTop. */
type LenisLike = {
  on: (event: "scroll", callback: () => void) => void;
};
export function bindScrollTriggerToLenis(lenis: LenisLike) {
  lenis.on("scroll", () => {
    ScrollTrigger.update();
  });
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger, MotionPathPlugin };
