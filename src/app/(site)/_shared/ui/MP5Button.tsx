"use client";

import { forwardRef, type ReactNode, type MouseEventHandler, type Ref } from "react";

/* ════════════════════════════════════════════════════════════════
   MP5Button — canonical button for the corp site.

   Cloned from LPButton (lp1/ui/LPButton.tsx) with classes renamed
   to .mp5-btn so the corp-site namespace stays self-contained.

   Variants:
     primary   — solid accent → darker accent on hover (default CTA)
     secondary — outlined → fills on hover
     ghost     — transparent → light tint on hover

   Sizes:
     sm — 44px (header bar)
     md — 56px (forms, default)
     lg — 64px (large hero CTAs / mobile menu)
     xl — 76px (hero morph CTA, oversized accent moments)

   When `href` is set, renders as <a>. Otherwise <button>.
   Visual styling lives in @site/styles/_mp5-btn.css — keep all
   button rules there, not scattered across other CSS files.
   ════════════════════════════════════════════════════════════════ */

export type MP5ButtonVariant = "primary" | "secondary" | "ghost";
export type MP5ButtonSize = "sm" | "md" | "lg" | "xl";

type Props = {
  variant?: MP5ButtonVariant;
  size?: MP5ButtonSize;
  fullWidth?: boolean;
  href?: string;
  target?: "_blank" | "_self";
  rel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
};

const HEIGHT: Record<MP5ButtonSize, number> = { sm: 44, md: 56, lg: 64, xl: 76 };
const PADDING_X: Record<MP5ButtonSize, number> = { sm: 18, md: 24, lg: 32, xl: 40 };
const FONT_SIZE: Record<MP5ButtonSize, number> = { sm: 16, md: 16, lg: 18, xl: 20 };

const baseStyle = (size: MP5ButtonSize, fullWidth: boolean): React.CSSProperties => ({
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

const variantClassName: Record<MP5ButtonVariant, string> = {
  primary: "mp5-btn mp5-btn--primary",
  secondary: "mp5-btn mp5-btn--secondary",
  ghost: "mp5-btn mp5-btn--ghost",
};

export const MP5Button = forwardRef<HTMLElement, Props>(function MP5Button(
  {
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
  },
  ref,
) {
  const finalClassName = `${variantClassName[variant]} ${className}`.trim();
  const style = baseStyle(size, fullWidth);

  if (href) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
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
      ref={ref as Ref<HTMLButtonElement>}
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
});

export default MP5Button;
