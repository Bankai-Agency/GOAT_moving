"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top-of-page progress bar shown during client-side route transitions.
 * Starts when an internal link is clicked, completes when the pathname changes.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  // Listen for internal link clicks → start bar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // ignore modified clicks (open-in-new-tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank"
      )
        return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      setActive(true);
      setProgress(15);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Creep progress up while active
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 8 + 2 : p));
    }, 250);
    return () => clearInterval(iv);
  }, [active]);

  // Pathname changed → finish & hide
  useEffect(() => {
    if (!active) return;
    setProgress(100);
    const t = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Safety: if pathname never changes (e.g. same-route link), auto-hide after 4s
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 4000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ opacity: active || progress === 100 ? 1 : 0, transition: "opacity 300ms ease-out" }}
    >
      <div
        className="h-full bg-[#FFE533] shadow-[0_0_10px_rgba(255,229,51,0.7)]"
        style={{
          width: `${progress}%`,
          transition: "width 250ms ease-out",
        }}
      />
    </div>
  );
}
