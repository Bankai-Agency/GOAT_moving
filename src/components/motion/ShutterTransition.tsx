"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const SHUTTER_COUNT = 10;
const SHUTTER_COLOR = "#005BFF";
const COVER_DURATION = 0.5;
const REVEAL_DURATION = 0.75;
const STAGGER = 0.03;

const shutterVariants: Variants = {
  /* Hidden above viewport */
  hidden: { y: "-100%" },
  /* Phase 1 — slide down to cover */
  cover: (i: number) => ({
    y: "0%",
    transition: {
      duration: COVER_DURATION,
      ease: [0.7, 0, 0.84, 0],
      delay: (SHUTTER_COUNT - 1 - i) * STAGGER,
    },
  }),
  /* Phase 2 — slide up to reveal new page */
  reveal: (i: number) => ({
    y: "-100%",
    transition: {
      duration: REVEAL_DURATION,
      ease: [0.16, 1, 0.3, 1],
      delay: (SHUTTER_COUNT - 1 - i) * STAGGER,
    },
  }),
};

type Phase = "hidden" | "cover" | "reveal";

/* Port of the Osmo "Shutter Page Transition" resource adapted for the
   Next.js App Router. We don't use Barba — instead we intercept
   internal link clicks at the document level, run the cover animation,
   then trigger router.push. usePathname tells us when the new page has
   mounted, at which point we run the reveal.

   Scope: only active while the user is on a `/mainpage-4*` route.
   Other routes (live `/`, drafts) keep their default instant
   navigation. Mount in the root layout once. */
export function ShutterTransition() {
  const currentPath = usePathname();
  const enabled = currentPath?.startsWith("/mainpage-4");
  if (!enabled) return null;
  return <ShutterTransitionInner />;
}

function ShutterTransitionInner() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("hidden");
  const pendingNavRef = useRef<string | null>(null);
  const lastPathnameRef = useRef(pathname);

  /* Click hijack: any internal `<a>` triggers the cover animation,
     then we navigate. */
  useEffect(() => {
    if (reduced) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;
      /* Skip in-page anchors, externals, mailto/tel, downloads, new-tab links. */
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;
        e.preventDefault();
        pendingNavRef.current = url.pathname + url.search + url.hash;
        setPhase("cover");
      } catch {
        /* ignore malformed URLs */
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduced]);

  /* Once cover finishes, push the route. The reveal is triggered by
     the pathname change effect below. */
  const onCoverComplete = useCallback(() => {
    const target = pendingNavRef.current;
    if (target) {
      pendingNavRef.current = null;
      router.push(target);
    }
  }, [router]);

  /* When pathname changes after a triggered cover, run the reveal. */
  useEffect(() => {
    if (pathname !== lastPathnameRef.current && phase === "cover") {
      lastPathnameRef.current = pathname;
      /* Small delay so the new page has a chance to render under the cover. */
      const t = setTimeout(() => setPhase("reveal"), 80);
      return () => clearTimeout(t);
    }
    lastPathnameRef.current = pathname;
  }, [pathname, phase]);

  const onRevealComplete = useCallback(() => setPhase("hidden"), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] grid grid-cols-10 overflow-clip"
      style={{ display: phase === "hidden" ? "none" : "grid" }}
    >
      {Array.from({ length: SHUTTER_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={shutterVariants}
          initial="hidden"
          animate={phase}
          onAnimationComplete={
            i === SHUTTER_COUNT - 1
              ? phase === "cover"
                ? onCoverComplete
                : phase === "reveal"
                  ? onRevealComplete
                  : undefined
              : undefined
          }
          style={{ backgroundColor: SHUTTER_COLOR, willChange: "transform" }}
        />
      ))}
    </div>
  );
}
