"use client";

import { useEffect, useState } from "react";
import { LPButton } from "@/app/(lp)/lp4/ui/LPButton";

type Props = {
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

/* Points the "Back" button at the landing page the user submitted from.

   Primary source is the `?from=` query param that the LP quote forms
   append on `router.push("/thank-you?from=…")`. We can't rely on
   `document.referrer` here: the forms navigate via a client-side
   soft push, so the referrer still holds the page's ORIGINAL referrer
   (e.g. the Google Ads click), not the LP itself — which is why the
   button used to fall back to the corporate homepage.

   `from` must be a same-origin relative path ("/lp/movers-portland").
   We reject anything that isn't a single-slash-prefixed path to avoid
   open-redirect via protocol-relative ("//evil.com") or absolute URLs.
   Falls back to the referrer heuristic, then "/" for direct visits. */
export function BackToOriginLink({ fullWidth, size = "md" }: Props) {
  const [href, setHref] = useState<string>("/");
  const [label, setLabel] = useState<string>("Back to home");

  useEffect(() => {
    if (typeof window === "undefined") return;

    /* 1. Explicit ?from= passed by the LP forms (most reliable). */
    const from = new URLSearchParams(window.location.search).get("from");
    if (from && from.startsWith("/") && !from.startsWith("//")) {
      setHref(from);
      setLabel(from.startsWith("/lp/") ? "Back to landing" : "Back");
      return;
    }

    /* 2. Fallback: same-origin referrer (covers direct in-site links). */
    const ref = document.referrer;
    if (!ref) return;
    try {
      const url = new URL(ref);
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith("/lp/")) {
        setHref(url.pathname + url.search);
        setLabel("Back to landing");
        return;
      }
      if (url.pathname === "/thank-you") return;
      setHref(url.pathname + url.search);
    } catch {
      /* malformed referrer — keep defaults */
    }
  }, []);

  return (
    <LPButton variant="secondary" size={size} href={href} fullWidth={fullWidth}>
      {label}
    </LPButton>
  );
}
