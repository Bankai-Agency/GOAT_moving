"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/components/motion/gsap";

const SHUTTER_COUNT = 10;
const SHUTTER_COLOR = "#005BFF";
const COVER_DURATION = 0.5;
const REVEAL_DURATION = 0.75;
const STAGGER_AMOUNT = 0.3;

/* GSAP port of the Osmo "Shutter Page Transition" resource adapted
   for the Next.js App Router. We don't use Barba — instead we
   intercept internal `<a>` clicks at the document level, run the
   cover GSAP timeline, then trigger router.push. usePathname tells us
   when the new page has mounted, at which point we run the reveal.

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
  const containerRef = useRef<HTMLDivElement>(null);
  const shutterRefs = useRef<HTMLDivElement[]>([]);
  const lastPathnameRef = useRef(pathname);
  const pendingNavRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<"hidden" | "cover" | "reveal">("hidden");
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Place shutters above the viewport on mount. */
  useEffect(() => {
    if (shutterRefs.current.length) {
      gsap.set(shutterRefs.current, { yPercent: -100 });
    }
  }, []);

  /* Document-level click hijack on internal links. */
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
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;
        e.preventDefault();
        pendingNavRef.current = url.pathname + url.search + url.hash;
        runCover();
      } catch {
        /* ignore malformed URLs */
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* When pathname changes after a triggered cover, run the reveal. */
  useEffect(() => {
    if (pathname !== lastPathnameRef.current && phase === "cover") {
      lastPathnameRef.current = pathname;
      const t = setTimeout(() => runReveal(), 80);
      return () => clearTimeout(t);
    }
    lastPathnameRef.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, phase]);

  function runCover() {
    setPhase("cover");
    gsap.to(shutterRefs.current, {
      yPercent: 0,
      duration: COVER_DURATION,
      ease: "power3.in",
      stagger: { amount: STAGGER_AMOUNT, from: "end" },
      onComplete: () => {
        const target = pendingNavRef.current;
        if (target) {
          pendingNavRef.current = null;
          router.push(target);
        }
      },
    });
  }

  function runReveal() {
    setPhase("reveal");
    gsap.to(shutterRefs.current, {
      yPercent: -100,
      duration: REVEAL_DURATION,
      ease: "expo.out",
      stagger: { amount: STAGGER_AMOUNT, from: "end" },
      onComplete: () => setPhase("hidden"),
    });
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] grid grid-cols-10 overflow-clip"
      style={{ display: phase === "hidden" ? "none" : "grid" }}
    >
      {Array.from({ length: SHUTTER_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) shutterRefs.current[i] = el;
          }}
          style={{ backgroundColor: SHUTTER_COLOR, willChange: "transform" }}
        />
      ))}
    </div>
  );
}
