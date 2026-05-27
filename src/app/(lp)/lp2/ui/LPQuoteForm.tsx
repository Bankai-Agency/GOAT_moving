"use client";

import { StepQuoteForm } from "./StepQuoteForm";
import type { LPSurface } from "./LPInput";

/* ════════════════════════════════════════════════════════════════
   LPQuoteForm — shared wrapper for the quote form. Renders in two
   surface modes:
     light — white card (LPCtaForm, modal). Default.
     glass — translucent dark glass bar (hero on dark photo).
   The form inside (labels, inputs, button) auto-adapts to the
   surface via the LPInput / LPLabel primitives.
   ════════════════════════════════════════════════════════════════ */

type Props = {
  city?: string;
  heading?: string;
  surface?: LPSurface;
  /** Extra Tailwind classes for the outer card (e.g. max-w / margins). */
  className?: string;
};

const SURFACE_CARD: Record<LPSurface, string> = {
  light:
    "bg-white rounded-xl lg:rounded-2xl p-5 lg:p-7 w-full shadow-[0_12px_40px_rgba(0,0,0,0.18)]",
  glass:
    "backdrop-blur-[30px] bg-[rgba(0,0,0,0.3)] rounded-2xl p-6 lg:p-7 w-full shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
};

export function LPQuoteForm({
  city,
  heading = "Get your free quote",
  surface = "light",
  className = "",
}: Props) {
  return (
    <div
      data-lp-quote-form
      data-surface={surface}
      className={`${SURFACE_CARD[surface]} ${className}`.trim()}
    >
      <StepQuoteForm heading={heading} city={city} surface={surface} />
    </div>
  );
}
