"use client";

import type { CSSProperties, ReactNode } from "react";

/* Shared accent CTA pill used across mainpage-5 — header Quote,
   mobile-menu Quote, morph CTA. Filled brand-blue body with white
   text and a white circular arrow nub on the right. Hover lifts +
   darkens, arrow slides right. Three sizes; pass `fullWidth` for
   the mobile-menu bottom CTA. */

export type AccentPillSize = "xs" | "sm" | "md" | "lg";

type Props = {
  size?: AccentPillSize;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
};

const SIZE = {
  xs: {
    height: 36,
    pl: 14,
    pr: 4,
    fontSize: 12,
    nub: 28,
    icon: 11,
    shadowBlur: 14,
    shadowAlpha: 0.4,
  },
  sm: {
    height: 44,
    pl: 18,
    pr: 5,
    fontSize: 14,
    nub: 34,
    icon: 12,
    shadowBlur: 22,
    shadowAlpha: 0.45,
  },
  md: {
    height: 56,
    pl: 28,
    pr: 6,
    fontSize: 16,
    nub: 44,
    icon: 14,
    shadowBlur: 32,
    shadowAlpha: 0.5,
  },
  lg: {
    height: 66,
    pl: 32,
    pr: 7,
    fontSize: 18,
    nub: 52,
    icon: 16,
    shadowBlur: 36,
    shadowAlpha: 0.5,
  },
} as const;

export function AccentPill({
  size = "sm",
  fullWidth = false,
  children,
  onClick,
  type = "button",
  ariaLabel,
}: Props) {
  const s = SIZE[size];

  const baseStyle: CSSProperties = {
    height: s.height,
    paddingLeft: s.pl,
    paddingRight: s.pr,
    borderRadius: 999,
    backgroundColor: "#0066ff",
    cursor: "pointer",
    border: 0,
    transition: "transform .25s ease, background-color .25s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: Math.round((s.height - s.nub) / 2 + 4),
    width: fullWidth ? "100%" : undefined,
    justifyContent: fullWidth ? "space-between" : undefined,
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      style={baseStyle}
      className="mp5-accent-pill group whitespace-nowrap"
    >
      <span
        style={{
          color: "#ffffff",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontWeight: 500,
          fontSize: s.fontSize,
          lineHeight: 1,
          letterSpacing: "-0.3px",
        }}
      >
        {children}
      </span>
      <span
        className="mp5-accent-pill__nub"
        style={{
          flexShrink: 0,
          width: s.nub,
          height: s.nub,
          borderRadius: 999,
          backgroundColor: "#ffffff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform .25s ease",
        }}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{
            color: "#0066ff",
            transition: "transform .25s ease",
          }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </button>
  );
}

export default AccentPill;
