"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@site/motion/gsap";

/* Column-wipe page transition (GOAT), adapted from the Osmo resource for
   the Next.js App Router — Barba/Lenis don't apply here. Five vertical
   yellow columns sweep down to cover the screen (staggered right→left),
   the GOAT logo fades in over them, the route swaps behind, then the
   columns continue down to reveal the new page (staggered left→right).

   We intercept internal <a> clicks in the CAPTURE phase so Next's <Link>
   bails (it checks `!e.defaultPrevented`); we own the navigation: run the
   cover, push the route, then run the reveal once the new page mounts
   (detected via usePathname). MIN_HOLD keeps the screen covered long
   enough to read the logo even when the next page mounts instantly. A
   watchdog guarantees the reveal runs even if the route never changes.

   Scope: every route EXCEPT the LP funnel (`/lp*`, `/thank-you`).
   Fallback: prefers-reduced-motion gets an instant navigation. Mounted
   once in the root layout. */

const COLUMN_COUNT = 5;
const COLUMN_COLOR = "#FFE533";
const COVER_DURATION = 0.6;
const REVEAL_DURATION = 0.6;
const STAGGER_EACH = 0.06;
/* Minimum time the screen stays fully covered (so the logo is readable)
   before the reveal starts, measured from when the cover finishes. */
const MIN_HOLD_MS = 600;
/* If the route never changes (redirect/blocked push) reveal anyway so the
   columns can't get stranded covering the screen. */
const WATCHDOG_MS = 1800;

const isLpPath = (p: string) => p.startsWith("/lp") || p === "/thank-you";

export function ShutterTransition() {
  const currentPath = usePathname();
  if (currentPath && isLpPath(currentPath)) return null;
  return <ColumnWipeInner />;
}

function ColumnWipeInner() {
  const router = useRouter();
  const pathname = usePathname();
  const columns = useRef<HTMLDivElement[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);
  const lastPathnameRef = useRef(pathname);
  const pendingNavRef = useRef<string | null>(null);
  const phaseRef = useRef<"hidden" | "cover" | "reveal">("hidden");
  const coverDoneAtRef = useRef(0);
  const watchdogRef = useRef<number | undefined>(undefined);
  const [phase, setPhase] = useState<"hidden" | "cover" | "reveal">("hidden");

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setBoth = (p: "hidden" | "cover" | "reveal") => {
    phaseRef.current = p;
    setPhase(p);
  };

  /* Park the columns above the viewport and hide the logo on mount. */
  useEffect(() => {
    if (columns.current.length) gsap.set(columns.current, { yPercent: 0 });
    if (logoRef.current) gsap.set(logoRef.current, { autoAlpha: 0, scale: 0.92 });
  }, []);

  /* Document-level click hijack on internal links. Capture phase: we run
     BEFORE Next's <Link>; preventDefault makes it bail so we own the nav.
     No stopPropagation, so other onClick handlers still fire. */
  useEffect(() => {
    if (reduced) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (isLpPath(url.pathname)) return;

      // Already mid-transition: swallow so we don't double-navigate.
      if (phaseRef.current !== "hidden") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      pendingNavRef.current = url.pathname + url.search + url.hash;
      runCover();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* When the route actually changes after a cover, run the reveal — but
     not before the screen has been covered for MIN_HOLD_MS. */
  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname;
      if (phaseRef.current === "cover") {
        window.clearTimeout(watchdogRef.current);
        const elapsed = performance.now() - coverDoneAtRef.current;
        const wait = Math.max(80, MIN_HOLD_MS - elapsed);
        const t = window.setTimeout(() => runReveal(), wait);
        return () => window.clearTimeout(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => () => window.clearTimeout(watchdogRef.current), []);

  function runCover() {
    setBoth("cover");
    const tl = gsap.timeline({
      onComplete: () => {
        coverDoneAtRef.current = performance.now();
        const target = pendingNavRef.current;
        if (target) {
          pendingNavRef.current = null;
          router.push(target);
        }
        window.clearTimeout(watchdogRef.current);
        watchdogRef.current = window.setTimeout(() => {
          if (phaseRef.current === "cover") runReveal();
        }, WATCHDOG_MS);
      },
    });
    tl.fromTo(
      columns.current,
      { yPercent: 0 },
      {
        yPercent: 100,
        duration: COVER_DURATION,
        ease: "power2.inOut",
        stagger: { each: STAGGER_EACH, from: "end" },
      },
      0,
    );
    if (logoRef.current) {
      tl.fromTo(
        logoRef.current,
        { autoAlpha: 0, scale: 0.92 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        0.3,
      );
    }
  }

  function runReveal() {
    window.clearTimeout(watchdogRef.current);
    setBoth("reveal");
    const tl = gsap.timeline({
      onComplete: () => {
        setBoth("hidden");
        gsap.set(columns.current, { yPercent: 0 });
        if (logoRef.current) gsap.set(logoRef.current, { autoAlpha: 0, scale: 0.92 });
      },
    });
    if (logoRef.current) {
      tl.to(logoRef.current, { autoAlpha: 0, scale: 0.96, duration: 0.3, ease: "power2.in" }, 0);
    }
    tl.to(
      columns.current,
      {
        yPercent: 200,
        duration: REVEAL_DURATION,
        ease: "power2.inOut",
        stagger: { each: STAGGER_EACH, from: "start" },
      },
      0.12,
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] overflow-clip"
      style={{ display: phase === "hidden" ? "none" : "block" }}
    >
      {/* Sweeping columns — seamless (no divider lines). */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { if (el) columns.current[i] = el; }}
            className="relative h-full"
            style={{
              flex: "1 0 0%",
              top: "-100%",
              backgroundColor: COLUMN_COLOR,
              /* Bleed the fill 1px on every side so sub-pixel rounding
                 between adjacent columns can't leave a see-through seam
                 during the transform. */
              boxShadow: `0 0 0 1px ${COLUMN_COLOR}`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Centered GOAT logo (black on the yellow columns). */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* logo.svg has preserveAspectRatio="none" and no intrinsic size,
            so it stretches to whatever box it's given. Pin the box to the
            SVG's viewBox ratio (82.4061 × 38.6467) so it renders 1:1. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/logo.svg"
          alt=""
          className="w-[150px] sm:w-[210px]"
          style={{
            filter: "brightness(0)",
            aspectRatio: "82.4061 / 38.6467",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
