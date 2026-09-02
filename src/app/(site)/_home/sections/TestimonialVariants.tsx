"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { homeContent } from "@/lib/content";

/* ════════════════════════════════════════════════════════════════
   TestimonialVariants — 5 replacement designs for the current
   single-quote-over-photo block (#7 in TerminalDraftClient).

   Shared quote data (single source of truth):
   ──────────────────────────────────────────────────────────── */

/* Testimonial carousel — edited in the admin (Главная → Цитаты). */
const QUOTES = homeContent.testimonials.quotes;

const PHOTO = homeContent.testimonials.photo;
const ACCENT = "#FFE533";

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
   COMPOSITE — renders the single chosen variant (A/B comparison collapsed).
   ──────────────────────────────────────────────────────────── */
export function TestimonialVariantsStack() {
  return <TestimonialV5_Carousel />;
}
