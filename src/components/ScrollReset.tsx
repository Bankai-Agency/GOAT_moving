"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reset scroll position to the top on every route change.
 *
 * Without this, navigating to a new page momentarily renders it at the
 * previous scroll position, then the browser/Next animates back to top —
 * visible as the new page "sliding up" because globals.css sets
 * `scroll-behavior: smooth` on <html>.
 *
 * `behavior: "instant"` overrides the CSS smooth-scroll for this one call,
 * so in-page anchor links still get the smooth animation.
 */
export function ScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
