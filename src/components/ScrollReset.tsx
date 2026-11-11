"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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
 *
 * The reset is skipped on the initial mount. On a phone with a slow
 * connection hydration lands several seconds after the first paint, and
 * by then the visitor is already a few screens into the page: running the
 * reset there threw them back to the top of the hero ("the first animation
 * cannot be scrolled"). Only a real pathname change triggers it.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const lastPathname = useRef(pathname);
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
