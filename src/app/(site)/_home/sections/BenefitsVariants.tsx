"use client";

import { GridStreaks } from "../GridStreaks";
import { homeContent } from "@/lib/content";

/* ════════════════════════════════════════════════════════════════
   BenefitsVariants — 5 replacement designs for the current
   horizontal-marquee block (#6 in TerminalDraftClient).

   Each variant is exported individually + the `BenefitsVariantsStack`
   composite renders all five in sequence, separated by a thin
   variant-label band, so the user can scroll through and compare.

   Shared data (single source of truth for fair comparison):
   ──────────────────────────────────────────────────────────── */

/* Trust metrics — edited in the admin (Главная → Цифры доверия). */
const TRUST_ITEMS = homeContent.trust.items;

const ACCENT = "#FFE533";

/* ──────────────────────────────────────────────────────────── */
/* V1 — STATIC METRIC GRID
   4-column grid of big mono numbers, eyebrow above + label below.
   Sits over the same GOAT-style 240px cell grid backdrop as the
   morph section, so it feels visually continuous with that block. */
export function BenefitsV1_Grid() {
  return (
    <section className="relative bg-[#0c0c0c] py-32 lg:py-48 overflow-hidden">
      {/* GOAT-style cell grid backdrop with vertical traveling streaks. */}
      <GridStreaks
        className="absolute inset-0 w-full h-full pointer-events-none"
        maxStreaks={5}
        streakAxis="v"
      />
      {/* Edge fade so grid dissolves into the page bg at top/bottom only. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #0c0c0c 0%, transparent 12%, transparent 88%, #0c0c0c 100%)",
        }}
      />
      <div className="relative max-w-[1408px] mx-auto px-6 lg:px-12">
        {/* Mobile: 1 card per row (full-width stack, 4 rows). Desktop:
            4 across. Each tile is its own separated card (gaps, no
            shared dividers). */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {TRUST_ITEMS.slice(0, 4).map((it) => (
            <div
              key={it.eyebrow}
              className="px-6 py-7 lg:px-8 lg:py-12 flex flex-col gap-4 lg:gap-6 min-h-[150px] lg:min-h-[360px] rounded-2xl"
              style={{ backgroundColor: ACCENT }}
            >
              <span className="font-mono uppercase text-[11px] lg:text-[10px] tracking-[2px] text-black/55">
                {it.eyebrow}
              </span>
              <span
                className="font-mono leading-[1] tabular-nums whitespace-nowrap text-black"
                style={{
                  fontSize: "clamp(40px, 11vw, 54px)",
                  letterSpacing: "-2.5px",
                }}
              >
                {it.value}
              </span>
              <span className="mt-auto font-sans text-[15px] lg:text-[17px] text-black/70 leading-tight">
                {it.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   COMPOSITE — renders the single chosen variant (A/B comparison collapsed).
   Drops into TerminalDraftClient where the old marquee sat.
   ──────────────────────────────────────────────────────────── */
export function BenefitsVariantsStack() {
  return (
    <>
      <BenefitsV1_Grid />
    </>
  );
}
