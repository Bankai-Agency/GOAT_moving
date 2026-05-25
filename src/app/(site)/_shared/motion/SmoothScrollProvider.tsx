"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { bindScrollTriggerToLenis, registerGsapPlugins } from "./gsap";

/* Lenis-driven momentum smooth-scroll. Mounted only inside the
   /mainpage-4 draft so the live `/` keeps native scroll. Lenis
   instruments the native scroll, so any code reading window.scrollY
   (Header sticky listener, IntersectionObserver, ScrollTrigger,
   framer-motion useScroll) keeps working unchanged. We also bind
   GSAP's ScrollTrigger to Lenis's scroll event so pinned + scrub
   animations stay perfectly in sync. */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    /* Plugin registration first — every section relies on
       ScrollTrigger being on the gsap instance. */
    registerGsapPlugins();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    bindScrollTriggerToLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
