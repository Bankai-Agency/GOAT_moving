"use client";

import type { ReactNode, MouseEventHandler } from "react";

/* ════════════════════════════════════════════════════════════════
   LPButton — single canonical button for the entire LP funnel.

   Variants:
     primary   — solid blue → darker blue on hover (default CTA)
     secondary — outlined blue → fills on hover
     ghost     — transparent → light blue tint on hover
                  (used only where explicitly specified)

   Sizes:
     sm — 44px (header bar)
     md — 56px (forms, default)
     lg — 64px (large hero CTAs)

   When `href` is set, renders as <a> (use for navigational CTAs
   like "Call ..." or "Back to home"). Otherwise renders <button>.

   No CSS-overrides needed — all styling lives here. If a button
   doesn't look right somewhere, fix THIS file, not lp-theme.css.
   ════════════════════════════════════════════════════════════════ */

export type LPButtonVariant = "primary" | "secondary" | "ghost";
export type LPButtonSize = "sm" | "md" | "lg";

type Props = {
  variant?: LPButtonVariant;
  size?: LPButtonSize;
  fullWidth?: boolean;
  /** Render as <a href={href}> instead of <button>. */
  href?: string;
  /** When rendering as <a>, the `target` attribute. */
  target?: "_blank" | "_self";
  /** When rendering as <a>, the `rel` attribute. */
  rel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
};

const HEIGHT: Record<LPButtonSize, number> = {
  sm: 44,
  md: 56,
  lg: 64,
};

const PADDING_X: Record<LPButtonSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
};

const FONT_SIZE: Record<LPButtonSize, number> = {
  sm: 16,
  md: 16,
  lg: 18,
};

const baseStyle = (size: LPButtonSize, fullWidth: boolean): React.CSSProperties => ({
  height: HEIGHT[size],
  paddingLeft: PADDING_X[size],
  paddingRight: PADDING_X[size],
  borderRadius: 12,
  border: 0,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  width: fullWidth ? "100%" : undefined,
  transition:
    "background-color .25s ease, color .25s ease, border-color .25s ease, transform .25s ease",
  fontFamily: "var(--font-sans, system-ui, sans-serif)",
  fontWeight: 500,
  fontSize: FONT_SIZE[size],
  letterSpacing: "-0.3px",
  lineHeight: 1,
});

const variantClassName: Record<LPButtonVariant, string> = {
  primary: "lp-btn lp-btn--primary",
  secondary: "lp-btn lp-btn--secondary",
  ghost: "lp-btn lp-btn--ghost",
};

export function LPButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  href,
  target,
  rel,
  type = "button",
  disabled = false,
  onClick,
  children,
  ariaLabel,
  className = "",
}: Props) {
  const finalClassName = `${variantClassName[variant]} ${className}`.trim();
  const style = baseStyle(size, fullWidth);

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        style={{ ...style, textDecoration: "none" }}
        className={finalClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
      style={style}
      className={finalClassName}
    >
      {children}
    </button>
  );
}

export default LPButton;
