"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════
   TestimonialVariants — 5 replacement designs for the current
   single-quote-over-photo block (#7 in TerminalDraftClient).

   Shared quote data (single source of truth):
   ──────────────────────────────────────────────────────────── */

const QUOTES = [
  {
    quote:
      "We have not seen this kind of accuracy with crew dispatch technology — this is a significant milestone in the race to modernize the moving industry.",
    author: "Karen Jones",
    role: "Operations Lead, Logistics Partner",
    rating: 5,
  },
  {
    quote:
      "On time, on budget, and every box accounted for. The crew treated my place like it was theirs. Easiest move I've ever done.",
    author: "Marcus Rivera",
    role: "Customer · Portland → Seattle",
    rating: 5,
  },
  {
    quote:
      "Their estimate was the only one that matched the final invoice. No surprises, no upsells — just a clean, well-run operation.",
    author: "Priya Shah",
    role: "Customer · Beaverton",
    rating: 5,
  },
  {
    quote:
      "The same-day quote came in under two hours and they showed up two days later. Hard to believe a moving company can actually do this.",
    author: "Linnea Vance",
    role: "Customer · Vancouver, WA",
    rating: 5,
  },
] as const;

const PHOTO = "/images/home-hero.png";
const ACCENT = "#FFE533";

function VariantLabel({ index, name }: { index: number; name: string }) {
  return (
    <div className="w-full border-y border-white/[0.07] bg-[#0a0a0a] py-3">
      <div className="max-w-[1408px] mx-auto px-6 lg:px-12 flex items-center gap-4 font-mono uppercase text-[10px] tracking-[2px] text-white/40">
        <span style={{ color: ACCENT }}>testimonial · variant {String(index).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-white/10" />
        <span>{name}</span>
      </div>
    </div>
  );
}

function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <span
      className="inline-flex"
      style={{ gap: Math.max(2, Math.round(size * 0.18)) }}
      aria-label={`${count} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill={i < count ? ACCENT : "rgba(255,255,255,0.12)"}
          aria-hidden
        >
          <path d="M8 0l2.47 5 5.53.8-4 3.9.94 5.5L8 12.6 3.06 15.2 4 9.7 0 5.8l5.53-.8L8 0z" />
        </svg>
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V1 — BIG QUOTE OVER MUTED PHOTO (close to current, refined)
   Big quote, photo darkened, but author block moved to corners
   and a small open-quote glyph in yellow gives composition.   */
export function TestimonialV1_HeroQuote() {
  return (
    <section className="relative min-h-[80vh] lg:min-h-[100vh] w-full overflow-hidden bg-[#000000]">
      <div className="absolute inset-0">
        <Image src={PHOTO} alt="" fill sizes="100vw" className="object-cover scale-105 opacity-60" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
      <div className="relative h-full min-h-[80vh] lg:min-h-[100vh] max-w-[1408px] mx-auto px-6 lg:px-12 flex flex-col justify-between py-16 lg:py-24">
        <div className="flex items-start justify-between">
          <span
            className="font-serif text-[120px] lg:text-[200px] leading-none"
            style={{ color: ACCENT }}
            aria-hidden
          >
            “
          </span>
          <span className="font-mono uppercase text-[10px] tracking-[2px] text-white/45 mt-6">
            client · 2026
          </span>
        </div>
        <blockquote
          style={{ color: "#fff" }}
          className="font-sans font-normal text-[28px] sm:text-[40px] lg:text-[64px] leading-[1.1] tracking-[-1px] lg:tracking-[-2px] max-w-[1100px]"
        >
          {QUOTES[0].quote}
        </blockquote>
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <span style={{ color: "#fff" }} className="font-sans text-lg">
              {QUOTES[0].author}
            </span>
            <span className="font-mono uppercase text-[11px] tracking-[2px] text-white/55">
              {QUOTES[0].role}
            </span>
          </div>
          <Stars count={QUOTES[0].rating} />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V2 — WALL OF QUOTES (3-up grid)
   Three quote cards side-by-side, dark bg, hairline borders,
   stars + author block. Reads like Trustpilot embed.        */
export function TestimonialV2_Wall() {
  return (
    <section className="relative bg-[#0c0c0c] py-20 lg:py-32">
      <div className="max-w-[1408px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12 lg:mb-16 flex-wrap gap-6">
          <h3 className="font-sans font-normal text-[32px] lg:text-[56px] leading-[1.05] tracking-[-1.2px] text-white max-w-[760px]">
            850+ five-star reviews. <span style={{ color: ACCENT }}>Here are three.</span>
          </h3>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[44px] leading-none text-white tabular-nums">4.9</span>
              <Stars count={5} />
            </div>
            <span className="font-mono uppercase text-[10px] tracking-[2px] text-white/45">
              avg · 850+ reviews
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08]">
          {QUOTES.slice(0, 3).map((q) => (
            <article key={q.author} className="bg-[#0c0c0c] p-7 lg:p-10 flex flex-col gap-6">
              <Stars count={q.rating} />
              <blockquote className="font-sans text-[17px] lg:text-[19px] leading-[1.45] text-white/85 flex-1">
                {q.quote}
              </blockquote>
              <div className="flex flex-col gap-1 pt-4 border-t border-white/[0.08]">
                <span className="font-sans text-[15px] text-white">{q.author}</span>
                <span className="font-mono uppercase text-[10px] tracking-[2px] text-white/45">
                  {q.role}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V3 — YELLOW PULL-QUOTE SLAB
   Full-bleed yellow block. Massive black quote, no photo, no
   noise. Brand-impact moment with a tiny author block at btm. */
export function TestimonialV3_YellowSlab() {
  return (
    <section className="relative py-24 lg:py-40" style={{ backgroundColor: ACCENT }}>
      <div className="max-w-[1408px] mx-auto px-6 lg:px-12">
        <div className="flex items-baseline justify-between mb-10 lg:mb-14">
          <span className="font-mono uppercase text-[11px] tracking-[2px] text-black/55">
            /// client testimonial
          </span>
          <span className="font-mono uppercase text-[11px] tracking-[2px] text-black/55">
            verified · 2026
          </span>
        </div>
        <blockquote className="font-sans font-normal text-[36px] sm:text-[56px] lg:text-[96px] leading-[1.02] tracking-[-2px] lg:tracking-[-4px] text-black max-w-[1200px]">
          <span style={{ color: "rgba(0,0,0,0.4)" }}>“</span>
          {QUOTES[0].quote}
          <span style={{ color: "rgba(0,0,0,0.4)" }}>”</span>
        </blockquote>
        <div className="flex items-end justify-between mt-12 lg:mt-20 pt-6 border-t-2 border-black/85 flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[17px] lg:text-[20px] text-black">
              {QUOTES[0].author}
            </span>
            <span className="font-mono uppercase text-[11px] tracking-[2px] text-black/65">
              {QUOTES[0].role}
            </span>
          </div>
          <Stars count={QUOTES[0].rating} />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V4 — SPLIT: METRICS + QUOTE
   Left: 3 stat cells (NPS / count / avg). Right: featured quote
   with author. Side-by-side, no photo, very brand-deck.       */
export function TestimonialV4_Split() {
  const stats = [
    { v: "4.9", l: "Avg rating" },
    { v: "850+", l: "Reviews" },
    { v: "98%", l: "Recommend rate" },
  ];
  return (
    <section className="relative bg-[#0c0c0c] py-20 lg:py-32">
      <div className="max-w-[1408px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="font-mono uppercase text-[11px] tracking-[2px] text-white/45 mb-10 block">
              /// what clients measure
            </span>
            <div className="flex flex-col">
              {stats.map((s) => (
                <div
                  key={s.l}
                  className="flex items-baseline justify-between gap-6 py-6 lg:py-8 border-t border-white/[0.08] last:border-b"
                >
                  <span className="font-mono uppercase text-[11px] tracking-[2px] text-white/55">
                    {s.l}
                  </span>
                  <span
                    className="font-sans text-[52px] lg:text-[80px] leading-none tracking-[-1.5px] tabular-nums"
                    style={{ color: ACCENT }}
                  >
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span
              className="font-serif text-[80px] lg:text-[140px] leading-[0.7] mb-2"
              style={{ color: ACCENT }}
              aria-hidden
            >
              “
            </span>
            <blockquote className="font-sans font-normal text-[24px] sm:text-[32px] lg:text-[44px] leading-[1.15] tracking-[-1px] text-white">
              {QUOTES[0].quote}
            </blockquote>
            <div className="mt-8 lg:mt-12 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 border border-white/15">
                <Image src={PHOTO} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[17px] text-white">{QUOTES[0].author}</span>
                <span className="font-mono uppercase text-[10px] tracking-[2px] text-white/55">
                  {QUOTES[0].role}
                </span>
              </div>
              <span className="ml-auto"><Stars count={5} /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* V5 — AUTO-ROTATING CAROUSEL
   One quote at a time, large. Cycles every 6s. Dot indicators
   + author + stars. Single-focus, can manually skip.         */
export function TestimonialV5_Carousel() {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % QUOTES.length);
    }, 6500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const q = QUOTES[idx];
  return (
    <section className="relative bg-[#0c0c0c] py-24 lg:py-40 overflow-hidden min-h-[80vh] lg:min-h-[100vh] flex items-center">
      {/* Background photo — darkened so the quote stays readable. */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src={PHOTO}
          alt=""
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority={false}
        />
      </div>
      {/* Compromise overlay stack: photo stays visibly readable while
          text retains contrast.
          1. Light global darken (35%) — keeps photo recognizable.
          2. Vignette only at the outer edges (transparent until ~60%),
             so the photo's centre stays bright.
          3. Page-bg fade at top/bottom only, to blend into the dark
             page above and below without darkening the middle. */}
      <div aria-hidden className="absolute inset-0 bg-black/35" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 90%, rgba(12,12,12,0.95) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,12,12,0.85) 0%, rgba(12,12,12,0) 18%, rgba(12,12,12,0) 82%, rgba(12,12,12,0.9) 100%)",
        }}
      />
      {/* Soft yellow glow remains, kept subtle. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(255,229,51,0.18) 0%, transparent 55%)",
        }}
      />
      <div
        className="relative w-full max-w-[1100px] mx-auto px-6 lg:px-12 text-center"
        style={{
          /* Text-shadow buys readability over the brighter photo
             without needing a heavy overlay on the whole section. */
          textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        <blockquote
          key={idx}
          className="tv5-fade font-sans font-normal text-[24px] sm:text-[36px] lg:text-[56px] leading-[1.15] tracking-[-1px] lg:tracking-[-2px] text-white min-h-[200px] lg:min-h-[300px] flex items-center justify-center"
        >
          “{q.quote}”
        </blockquote>
        <div className="mt-8 lg:mt-12 flex flex-col items-center gap-2">
          <span className="font-sans font-normal text-[22px] sm:text-[26px] lg:text-[32px] leading-[1.1] tracking-[-0.6px] text-white">
            {q.author}
          </span>
          <span className="font-mono uppercase text-[12px] lg:text-[13px] tracking-[2.5px] text-white/80">
            {q.role}
          </span>
        </div>
        <div className="mt-10 flex items-center justify-center gap-2">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              aria-label={`Quote ${i + 1}`}
              onClick={() => setIdx(i)}
              className="tv5-dot"
              style={{
                width: i === idx ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === idx ? ACCENT : "rgba(255,255,255,0.2)",
                border: 0,
                cursor: "pointer",
                transition: "width .35s ease, background-color .35s ease",
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes tv5-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .tv5-fade { animation: tv5-fade-in .55s ease both; }
      `}</style>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   COMPOSITE — render all 5 stacked with variant-labels.
   ──────────────────────────────────────────────────────────── */
export function TestimonialVariantsStack() {
  return <TestimonialV5_Carousel />;
}
