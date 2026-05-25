"use client";

import { useEffect, useState } from "react";
import { LPButton } from "@lp/ui/LPButton";

type Props = {
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

/* Reads document.referrer on mount and points the button back to the
   page the user came from when it was an LP route on the same origin.
   Falls back to "/" for direct visits, off-site referrers, or when the
   referrer is the thank-you page itself (e.g. on a hard reload). */
export function BackToOriginLink({ fullWidth, size = "md" }: Props) {
  const [href, setHref] = useState<string>("/");
  const [label, setLabel] = useState<string>("Back to home");

  useEffect(() => {
    if (typeof window === "undefined") return;
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
