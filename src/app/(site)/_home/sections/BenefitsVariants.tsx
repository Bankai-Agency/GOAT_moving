"use client";

import { GridStreaks } from "../GridStreaks";

/* ════════════════════════════════════════════════════════════════
   BenefitsVariants — 5 replacement designs for the current
   horizontal-marquee block (#6 in TerminalDraftClient).

   Each variant is exported individually + the `BenefitsVariantsStack`
   composite renders all five in sequence, separated by a thin
   variant-label band, so the user can scroll through and compare.

   Shared data (single source of truth for fair comparison):
   ──────────────────────────────────────────────────────────── */

const TRUST_ITEMS = [
  { eyebrow: "DOT", value: "#4232069", label: "USDOT registered" },
  { eyebrow: "Licensed", value: "OR · WA", label: "Fully bonded & insured" },
  { eyebrow: "Moves", value: "3,000+", label: "Completed in PNW" },
  { eyebrow: "Reviews", value: "850+", label: "Verified 5-star ratings" },
  { eyebrow: "Pricing", value: "$0", label: "Hidden fees, ever" },
  { eyebrow: "Quote", value: "<2h", label: "Same-day response time" },
] as const;

const ACCENT = "#FFE533";

/* ── tiny shared eyebrow band so each variant carries an obvious
      label — makes side-by-side comparison readable. */
function VariantLabel({ index, name }: { index: number; name: string }) {
  return (
    <div className="w-full border-y border-white/[0.07] bg-[#0a0a0a] py-3">
      <div className="max-w-[1408px] mx-auto px-6 lg:px-12 flex items-center gap-4 font-mono uppercase text-[10px] tracking-[2px] text-white/40">
        <span className="text-[#FFE533]">benefits · variant {String(index).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-white/10" />
        <span>{name}</span>
      </div>
    </div>
  );
}

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

/* ──────────────────────────────────────────────────────────── */
/* V2 — SCROLL-SNAP CHIP RAIL
   Horizontal pillbox row that snaps on swipe. Yellow accent
   chip color, rounded full, mono caps. Mobile-first feel.   */
export function BenefitsV2_Rail() {
  return (
    <section className="relative bg-[#0c0c0c] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1408px] mx-auto px-6 lg:px-12 mb-8 lg:mb-12">
        <h3 className="font-sans font-normal text-[28px] lg:text-[44px] leading-[1.1] tracking-[-1px] text-white max-w-[800px]">
          Receipts, licenses, numbers — <span style={{ color: ACCENT }}>on the record.</span>
        </h3>
      </div>
      <div
        className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 px-6 lg:px-12 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {TRUST_ITEMS.map((it) => (
          <div
            key={it.eyebrow}
            className="snap-start shrink-0 w-[260px] lg:w-[340px] border border-white/12 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono uppercase text-[10px] tracking-[2px] text-white/45">
                {it.eyebrow}
              </span>
              <span
                className="font-mono text-[10px] tracking-[2px] uppercase"
                style={{ color: ACCENT }}
              >
                ●
              </span>
            </div>
            <div
              className="font-sans text-[32px] lg:text-[44px] leading-none tracking-[-1.5px] text-white mb-3"
            >
              {it.value}
            </div>
            <div className="font-sans text-[13px] text-white/60 leading-tight">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V3 — VERTICAL TICKER LIST
   Tall numbered rows, mono caps left + value right, hairlines
   between. Reads like a service-status board.                */
export function BenefitsV3_Ticker() {
  return (
    <section className="relative bg-[#0c0c0c] py-20 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <div className="flex items-baseline justify-between mb-10 lg:mb-14">
          <span className="font-mono uppercase text-[11px] tracking-[2px] text-white/45">
            /// proof-of-work
          </span>
          <span
            className="font-mono uppercase text-[11px] tracking-[2px]"
            style={{ color: ACCENT }}
          >
            live · 2026
          </span>
        </div>
        <ul>
          {TRUST_ITEMS.map((it, i) => (
            <li
              key={it.eyebrow}
              className="grid grid-cols-[40px_1fr_auto] gap-4 lg:gap-8 items-center py-5 lg:py-8 border-t border-white/[0.08] last:border-b"
            >
              <span className="font-mono text-[11px] text-white/35 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col">
                <span className="font-mono uppercase text-[10px] tracking-[2px] text-white/45 mb-1">
                  {it.eyebrow}
                </span>
                <span className="font-sans text-[16px] lg:text-[20px] text-white leading-tight">
                  {it.label}
                </span>
              </div>
              <span
                className="font-mono text-[24px] lg:text-[40px] leading-none tracking-[-0.5px] tabular-nums"
                style={{ color: ACCENT }}
              >
                {it.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V4 — DOUBLE MARQUEE BAND
   Two stacked horizontal rows scrolling OPPOSITE directions.
   Outer row: large white mono caps. Inner row: yellow smaller
   tickers. Compact, energetic, like a NASDAQ ribbon.        */
export function BenefitsV4_DoubleRow() {
  const items = TRUST_ITEMS.map((i) => `${i.eyebrow} · ${i.value}`);
  return (
    <section className="relative bg-[#0c0c0c] py-16 lg:py-24 overflow-hidden">
      <div className="overflow-hidden">
        <div className="bv4-track inline-flex items-center gap-12 lg:gap-20 whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="inline-flex items-center gap-12 lg:gap-20" aria-hidden={dup === 1 || undefined}>
              {items.map((t, i) => (
                <span key={`${dup}-${i}`} className="inline-flex items-center gap-12 lg:gap-20">
                  <span
                    className="font-mono uppercase text-[36px] sm:text-[56px] lg:text-[88px] leading-none tracking-[-1px] text-white"
                  >
                    {t}
                  </span>
                  <span aria-hidden style={{ color: ACCENT }} className="text-[22px] lg:text-[44px]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden mt-3 lg:mt-5">
        <div className="bv4-track-rev inline-flex items-center gap-10 lg:gap-16 whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="inline-flex items-center gap-10 lg:gap-16" aria-hidden={dup === 1 || undefined}>
              {["Same-day quotes", "Bonded crews", "Flat rates", "Background-checked movers", "Real-time tracking", "On-time guarantee"].map((t, i) => (
                <span key={`${dup}-${i}`} className="inline-flex items-center gap-10 lg:gap-16">
                  <span
                    className="font-mono uppercase text-[16px] sm:text-[22px] lg:text-[32px] leading-none tracking-[2px]"
                    style={{ color: ACCENT }}
                  >
                    {t}
                  </span>
                  <span aria-hidden className="text-[12px] lg:text-[18px] text-white/30">○</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bv4-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes bv4-marquee-rev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .bv4-track { animation: bv4-marquee 40s linear infinite; }
        .bv4-track-rev { animation: bv4-marquee-rev 28s linear infinite; }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V5 — YELLOW SLAB FEATURE STRIPE
   Full-bleed yellow band breaks up the dark page; 3 huge stat
   blocks with black mono numbers, no borders, just brand impact. */
export function BenefitsV5_YellowSlab() {
  const HERO_STATS = [
    { value: "850+", label: "Five-star reviews" },
    { value: "3K+", label: "Successful moves" },
    { value: "100%", label: "Licensed & bonded" },
  ];
  return (
    <section className="relative py-20 lg:py-32" style={{ backgroundColor: ACCENT }}>
      <div className="max-w-[1408px] mx-auto px-6 lg:px-12">
        <div className="flex items-baseline justify-between mb-12 lg:mb-16">
          <span className="font-mono uppercase text-[11px] tracking-[2px] text-black/55">
            /// numbers · 2026
          </span>
          <span className="font-mono uppercase text-[11px] tracking-[2px] text-black/55">
            usdot #4232069 · or · wa
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-3 border-t-2 border-black pt-5">
              <span className="font-sans font-normal text-[72px] sm:text-[96px] lg:text-[140px] leading-[0.9] tracking-[-3px] text-black">
                {s.value}
              </span>
              <span className="font-mono uppercase text-[12px] tracking-[2px] text-black/65">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   COMPOSITE — render all 5 stacked with variant-labels.
   Drops into TerminalDraftClient where the old marquee sat.
   ──────────────────────────────────────────────────────────── */
export function BenefitsVariantsStack() {
  return (
    <>
      <BenefitsV1_Grid />
    </>
  );
}
