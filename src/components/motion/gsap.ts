"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

/* Single registration site for GSAP + plugins. Importing this module
   from any client component guarantees plugins are wired exactly once
   (registering twice in dev with HMR is a no-op but throws warnings). */
let registered = false;
if (!registered && typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  registered = true;
}

/* Wire ScrollTrigger to Lenis's scroll callback so pinned + scrub
   animations stay perfectly in sync with the smooth-scrolled position
   instead of the (lerped) native scrollTop. Call once after Lenis is
   instantiated. Typed loosely so we don't import Lenis from this file. */
type LenisLike = {
  on: (event: "scroll", callback: () => void) => void;
};
export function bindScrollTriggerToLenis(lenis: LenisLike) {
  lenis.on("scroll", () => {
    ScrollTrigger.update();
  });
  /* Lenis ticks via requestAnimationFrame; let GSAP's ticker drive
     ScrollTrigger refresh so its measurement runs after Lenis frame. */
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger, MotionPathPlugin };
