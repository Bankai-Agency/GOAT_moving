"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsapPlugins } from "@/components/motion/gsap";

/* /mainpage-5 — terminal-industries.com-style draft.

   Color system mirrors Terminal's structure but rebranded blue: white paper,
   deep-navy ink (#001f4d), royal-blue accent (#0066ff) with white text on
   accent for WCAG AA. Typography uses the project's existing Geist
   (font-sans) + Roboto Mono (font-mono) — visually close to Suisse + Geist
   Mono used by Terminal.

   Section order:
   1.  Hero (300vh sticky pin, canvas frame-scrub, char-stagger headline)
   2.  Intro statement (huge centered H2 on white)
   3.  Numbered features (sticky-pin, scroll-tied switch — active row goes
       blue, others fade; dark visualization panel on the right)
   4.  Morph — "Mover's Operating System" → "MOS™" (scroll-scrubbed)
   5.  Three benefit panels (stack-pin: each slides up to cover the prev),
       each with a tall media block + thin caption strip below
   6.  "Built by the industry" + grid logo wall
   7.  Testimonial (parallax photo + centered quote)
   8.  "Trusted by" + grid-line logo wall
   9.  Contact form (left pitch, right form)
   10. Final CTA banner (huge ink statement + blue pill)
   11. Footer (light, ink text)

   noindex/nofollow set on the page metadata. */

const features = [
  {
    n: "01",
    title: "Autonomous, agentic dispatch from booking to delivery",
    body: "Vetted movers and routed crews appear at the door without anyone making a phone call.",
  },
  {
    n: "02",
    title: "Single pane of glass visibility of every move",
    body: "One coordinator sees crew location, ETA, and inventory the whole way.",
  },
  {
    n: "03",
    title: "Managed by a unified platform with computer vision",
    body: "Every box, crate, and pallet is tracked and verified at load and unload.",
  },
  {
    n: "04",
    title: "Highly configurable to homes, offices, warehouses",
    body: "The same playbook scales from a studio apartment to a 30,000 sq ft warehouse.",
  },
  {
    n: "05",
    title: "Predictable, flat-rate pricing",
    body: "What we say at the start is what you pay at the end — no fuel surcharges, no reweighs.",
  },
  {
    n: "06",
    title: "Same-team delivery, end-to-end",
    body: "The crew that loads is the crew that unloads. No handoffs, no lost context.",
  },
];

const benefits = [
  {
    label: "Benefit 01",
    title: "A single solution for maximum, automated throughput",
    body: "Deep integrations anticipate incoming jobs so the crew, truck, and inventory are queued before the booking confirmation lands. We close the loop with on-site verification at every doorway.",
    image: "/images/local-moving-hero.png",
  },
  {
    label: "Benefit 02",
    title: "Easy, scalable operation",
    body: "Designed from the ground up for disruption-free moves. Modern UI for the coordinator, near-zero IT lift on your end. Configurable to any building, any access window, any crew size.",
    image: "/images/long-distance-hero.avif",
  },
  {
    label: "Benefit 03",
    title: "Rapid, repeatable ROI",
    body: "Flat-rate pricing scales linearly. We deploy fast, and the system gets better with every move — same crew, same trucks, sharper routes.",
    image: "/images/commercial-moving-hero.png",
  },
];

const trustedLogos = [
  "Ryder",
  "Prologis",
  "NFI",
  "Lineage",
  "Coca-Cola",
  "HP",
  "Microsoft",
  "Nike",
  "Adidas",
];

const FRAME_COUNT = 120;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(4, "0")}.webp`;

/* Inline color constants — Tailwind v4 arbitrary values use these
   throughout. Kept in one place so a brand tweak is one PR. */
const INK = "#001f4d";
const PAPER = "#ffffff";
const BLUE = "#0066ff";

export function TerminalDraftClient() {
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const introRefs = useRef<HTMLDivElement[]>([]);

  const featuresWrapperRef = useRef<HTMLDivElement>(null);
  const featureItemRefs = useRef<HTMLLIElement[]>([]);
  const [activeFeature, setActiveFeature] = useState(0);

  const morphWrapperRef = useRef<HTMLDivElement>(null);
  const morphLongRef = useRef<HTMLSpanElement>(null);
  const morphShortRef = useRef<HTMLSpanElement>(null);

  const benefitsWrapperRef = useRef<HTMLDivElement>(null);
  const benefitCardRefs = useRef<HTMLDivElement[]>([]);

  const testimonialPhotoRef = useRef<HTMLDivElement>(null);

  /* ── HERO: canvas frame-scrub + char-stagger headline reveal ─────────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = heroWrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapperEl || !canvasEl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const images: HTMLImageElement[] = [];
    let lastDrawn = -1;

    const fitCanvas = () => {
      const w = canvasEl.clientWidth;
      const h = canvasEl.clientHeight;
      canvasEl.width = w * dpr;
      canvasEl.height = h * dpr;
    };

    const draw = (idx: number) => {
      const c = canvasEl.getContext("2d");
      if (!c) return;
      let img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) {
        for (let j = idx; j >= 0; j--) {
          if (images[j]?.complete && images[j].naturalWidth) {
            img = images[j];
            break;
          }
        }
      }
      if (!img) return;
      const cw = canvasEl.width;
      const ch = canvasEl.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      c.clearRect(0, 0, cw, ch);
      c.drawImage(img, dx, dy, dw, dh);
      lastDrawn = idx;
    };

    fitCanvas();
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (lastDrawn < 0) draw(0);
        else if (i === lastDrawn) draw(i);
      };
      images.push(img);
    }

    const onResize = () => {
      fitCanvas();
      if (lastDrawn >= 0) draw(lastDrawn);
    };
    window.addEventListener("resize", onResize);

    // Per-char split for the H1 — characters scrub in along with the
    // frame timeline. StrictMode safe.
    const h1El = heroTextRef.current?.querySelector<HTMLHeadingElement>(
      "h1[data-hero-line]",
    );
    if (h1El) {
      const original = h1El.dataset.original ?? h1El.textContent ?? "";
      h1El.dataset.original = original;
      h1El.innerHTML = "";
      original.split("").forEach((ch) => {
        const span = document.createElement("span");
        span.className = "hero-char";
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.willChange = "opacity";
        // Use a non-breaking space so the inline-block span preserves
        // word boundaries (a regular " " collapses inside inline-block).
        span.textContent = ch === " " ? "\u00A0" : ch;
        h1El.appendChild(span);
      });
    }

    const ctx = gsap.context(() => {
      const scrubObj = { f: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      tl.to(
        scrubObj,
        {
          f: FRAME_COUNT - 1,
          ease: "none",
          snap: { f: 1 },
          duration: 1,
          onUpdate: () => draw(Math.round(scrubObj.f)),
        },
        0,
      );

      const kicker = heroTextRef.current?.querySelector<HTMLElement>(
        "span[data-hero-line]",
      );
      if (kicker) {
        tl.fromTo(
          kicker,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.06 },
          0.02,
        );
      }

      const chars = h1El?.querySelectorAll<HTMLElement>(".hero-char");
      if (chars && chars.length) {
        tl.to(
          chars,
          {
            opacity: 1,
            ease: "none",
            duration: 0.001,
            stagger: { each: 0.37 / chars.length, from: "start" },
          },
          0.08,
        );
      }

      const subtitle = heroTextRef.current?.querySelector<HTMLElement>(
        "p[data-hero-line]",
      );
      if (subtitle) {
        tl.fromTo(
          subtitle,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
          0.5,
        );
      }
    });

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  /* ── INTRO sections: per-line reveal on enter ─────────────────────────── */
  useEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      introRefs.current.filter(Boolean).forEach((el) => {
        const items = el.querySelectorAll<HTMLElement>("[data-intro-line]");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 75%" },
          },
        );
      });
    });
    return () => ctx.revert();
  }, []);

  /* ── NUMBERED FEATURES: sticky-pin step switch on scroll ─────────────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = featuresWrapperRef.current;
    if (!wrapperEl) return;
    const total = features.length;
    const ctx = gsap.context(() => {
      gsap.to(
        {},
        {
          ease: "none",
          scrollTrigger: {
            trigger: wrapperEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            onUpdate: (self) => {
              const idx = Math.min(
                total - 1,
                Math.floor(self.progress * total + 0.0001),
              );
              setActiveFeature((prev) => (prev === idx ? prev : idx));
            },
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── MORPH: long phrase shrinks to 3-letter monogram on scroll ──────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = morphWrapperRef.current;
    const longEl = morphLongRef.current;
    const shortEl = morphShortRef.current;
    if (!wrapperEl || !longEl || !shortEl) return;

    const ctx = gsap.context(() => {
      gsap.set(shortEl, { opacity: 0, scale: 0.6 });
      gsap.set(longEl, { opacity: 1, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      // First half: long phrase fades + scales down. Second half: 3-letter
      // monogram fades up to dominate the screen.
      tl.to(longEl, { opacity: 0, scale: 0.5, ease: "power2.in", duration: 0.5 }, 0);
      tl.fromTo(
        shortEl,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, ease: "power2.out", duration: 0.5 },
        0.5,
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── BENEFITS: stack-pin (each slides up to cover the previous) ──────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = benefitsWrapperRef.current;
    if (!wrapperEl) return;
    const cards = benefitCardRefs.current.filter(Boolean);
    if (cards.length !== benefits.length) return;

    const ctx = gsap.context(() => {
      cards.forEach((c, i) => {
        gsap.set(c, { yPercent: i === 0 ? 0 : 100, zIndex: i + 1 });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      for (let i = 1; i < cards.length; i++) {
        tl.fromTo(
          cards[i],
          { yPercent: 100 },
          { yPercent: 0, duration: 1 },
          i - 1,
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── TESTIMONIAL: parallax on the photo ─────────────────────────────── */
  useEffect(() => {
    registerGsapPlugins();
    const photoEl = testimonialPhotoRef.current;
    if (!photoEl) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        photoEl,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: photoEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── 1. HERO — 300vh wrapper, sticky inner pinned screen ───────────── */}
      <div
        ref={heroWrapperRef}
        className="relative w-full"
        style={{ height: "300vh" }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55 pointer-events-none"
          />
          <div
            ref={heroTextRef}
            className="relative h-full max-w-[1408px] mx-auto px-6 lg:px-12 flex flex-col items-center justify-center text-center gap-6 lg:gap-8 pt-[120px] pb-[60px]"
          >
            <span
              data-hero-line
              className="font-mono text-[11px] lg:text-xs uppercase tracking-[2px] text-white/70"
            >
              The new industry standard for moving
            </span>
            <h1
              data-hero-line
              className="font-sans font-normal text-[44px] sm:text-[68px] lg:text-[120px] leading-[0.95] tracking-[-1.5px] lg:tracking-[-3.6px] text-white max-w-[1280px]"
            >
              We have reinvented the way America moves.
            </h1>
            <p
              data-hero-line
              className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.4px] text-white/80 max-w-[640px]"
            >
              Crew, equipment, insurance, and routing — coordinated end-to-end so the
              day of your move never becomes a problem to solve in real time.
            </p>
          </div>
        </section>
      </div>

      {/* ── 2. INTRO STATEMENT — light bg, single huge centered H2 ──────── */}
      <section
        ref={(el) => {
          if (el) introRefs.current[0] = el;
        }}
        className="relative bg-[#ffffff] px-6 lg:px-12 py-[120px] lg:py-[200px] min-h-[90vh] flex items-center"
      >
        <div className="max-w-[1280px] mx-auto w-full text-center flex flex-col gap-10 lg:gap-14">
          <span
            data-intro-line
            className="font-mono text-[11px] lg:text-xs uppercase tracking-[2px] text-[#001f4d]/55"
          >
            Moving the world by making goods flow
          </span>
          <h2
            data-intro-line
            className="font-sans font-normal text-[40px] sm:text-[60px] lg:text-[88px] leading-[0.98] tracking-[-1.2px] lg:tracking-[-3.2px] text-[#001f4d]"
          >
            Imagine your move as one continuous operation seamlessly connecting
            doorstep to doorstep.
          </h2>
        </div>
      </section>

      {/* ── 3. NUMBERED FEATURES — sticky-pin, scroll-tied switch ────────── */}
      <div
        ref={featuresWrapperRef}
        className="relative bg-[#ffffff]"
        style={{ height: `${(features.length + 1) * 100}vh` }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          <div className="max-w-[1408px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: stacked feature list. Active row is blue, others fade. */}
            <ul className="lg:col-span-6 flex flex-col">
              <li className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55 pb-8 lg:pb-12">
                The system
              </li>
              {features.map((f, i) => {
                const isActive = i === activeFeature;
                return (
                  <li
                    key={f.n}
                    ref={(el) => {
                      if (el) featureItemRefs.current[i] = el;
                    }}
                    className="border-t border-[#001f4d]/10 py-6 lg:py-8 grid grid-cols-[auto_1fr] gap-x-6 lg:gap-x-10 transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0.25 }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[2px] tabular-nums text-[#001f4d]/60 pt-2">
                      {f.n}
                    </span>
                    <div className="flex flex-col gap-3">
                      <h3
                        className="font-sans font-normal text-[24px] lg:text-[40px] leading-[1.1] tracking-[-0.6px] lg:tracking-[-1.2px] transition-colors duration-500"
                        style={{ color: isActive ? "#001f4d" : "#001f4d" }}
                      >
                        {f.title}
                      </h3>
                      <p
                        className="font-sans text-sm lg:text-base text-[#001f4d]/55 leading-[1.5] max-w-[520px] transition-all duration-500"
                        style={{
                          maxHeight: isActive ? 200 : 0,
                          opacity: isActive ? 1 : 0,
                          overflow: "hidden",
                        }}
                      >
                        {f.body}
                      </p>
                    </div>
                  </li>
                );
              })}
              <li className="border-t border-[#001f4d]/10" />
            </ul>

            {/* Right: dark visualization panel. <video> placeholder so a real
                file can be dropped in later via /public/videos. Holds an SVG
                grid + live counter to give a feel of motion in the meantime. */}
            <div className="lg:col-span-6 relative aspect-[4/5] lg:aspect-[5/6] rounded-md overflow-hidden bg-[#001f4d] shadow-[0_24px_60px_rgba(0,31,77,0.18)]">
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
              {/* Decorative wireframe grid — gives the empty <video> some
                  texture so the panel reads as a "yard visualization". */}
              <svg
                aria-hidden
                className="absolute inset-0 w-full h-full opacity-40"
                viewBox="0 0 600 720"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="grid-mp5"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke={BLUE}
                      strokeOpacity="0.18"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="600" height="720" fill="url(#grid-mp5)" />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-10 text-white">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[2px] text-white/60">
                  <span>Yard · 44C</span>
                  <span>Check in · 2:34 PM</span>
                </div>
                <div className="flex items-end justify-between">
                  <span
                    className="font-sans font-normal text-[80px] lg:text-[120px] leading-none tracking-[-3px] tabular-nums"
                    style={{ color: BLUE }}
                  >
                    {features[activeFeature].n}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/60 pb-3">
                    / 0{features.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 4. MORPH — "Mover's Operating System" → "MOS™" ───────────────── */}
      <div
        ref={morphWrapperRef}
        className="relative bg-[#ffffff]"
        style={{ height: "200vh" }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            {/* Subtle grid backdrop hints at Terminal's "engineering" vibe. */}
            <svg
              aria-hidden
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 1440 900"
            >
              <defs>
                <pattern
                  id="grid-morph"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke={INK}
                    strokeOpacity="0.06"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="1440" height="900" fill="url(#grid-morph)" />
            </svg>
          </div>
          <div className="relative max-w-[1408px] mx-auto px-6 lg:px-12 flex flex-col items-center gap-6 lg:gap-10 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
              That&apos;s the
            </span>
            <div className="relative w-full flex items-center justify-center">
              <span
                ref={morphLongRef}
                className="font-sans font-normal text-[40px] sm:text-[60px] lg:text-[100px] leading-[0.95] tracking-[-1.2px] lg:tracking-[-3px] text-[#001f4d] inline-block"
              >
                Mover&apos;s Operating System.
              </span>
              <span
                ref={morphShortRef}
                aria-hidden
                className="absolute font-sans font-normal text-[120px] sm:text-[200px] lg:text-[320px] leading-none tracking-[-4px] lg:tracking-[-12px] text-[#001f4d] inline-block"
              >
                MOS<sup className="text-[0.25em] align-top">™</sup>
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ── 5. THREE BENEFIT PANELS — stack-pin (each covers the previous) ─ */}
      <div
        ref={benefitsWrapperRef}
        className="relative"
        style={{ height: `${(benefits.length + 1) * 100}vh` }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden bg-[#ffffff]">
          {benefits.map((b, i) => (
            <div
              key={b.label}
              ref={(el) => {
                if (el) benefitCardRefs.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform bg-[#ffffff]"
            >
              <div className="h-full grid grid-rows-[1fr_auto]">
                {/* Top: full-bleed media panel */}
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={b.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
                {/* Bottom: thin caption strip — Benefit 0X label + title + body */}
                <div className="relative bg-[#ffffff]">
                  <div className="max-w-[1408px] mx-auto px-6 lg:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
                    <div className="lg:col-span-4 flex flex-col gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
                        {b.label}
                      </span>
                      <h3 className="font-sans font-normal text-[22px] lg:text-[32px] leading-[1.1] tracking-[-0.6px] lg:tracking-[-1px] text-[#001f4d]">
                        {b.title}
                      </h3>
                    </div>
                    <p className="lg:col-span-8 font-sans text-base lg:text-lg leading-[1.5] tracking-[-0.3px] text-[#001f4d]/70 max-w-[760px]">
                      {b.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ── 6. BUILT BY THE INDUSTRY — light bg, big H2 + grid logo wall ─── */}
      <section
        ref={(el) => {
          if (el) introRefs.current[1] = el;
        }}
        className="relative bg-[#ffffff] px-6 lg:px-12 py-[100px] lg:py-[180px]"
      >
        <div className="max-w-[1408px] mx-auto flex flex-col gap-16 lg:gap-24">
          <h2
            data-intro-line
            className="font-sans font-normal text-[36px] sm:text-[56px] lg:text-[88px] leading-[0.98] tracking-[-1px] lg:tracking-[-3.2px] text-[#001f4d] text-center max-w-[1100px] mx-auto"
          >
            Built by the industry, for the industry — operators who want a new
            standard for moving.
          </h2>
          {/* Grid logo wall — light grid lines like Terminal, plus + marks at
              intersections. Each logo cell has matching outline. */}
          <div className="relative">
            <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-5 pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="border-l border-[#001f4d]/8 first:border-l-0"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 border-y border-[#001f4d]/8">
              {trustedLogos.slice(0, 5).map((l) => (
                <div
                  key={l}
                  className="aspect-[16/9] flex items-center justify-center border-r border-[#001f4d]/8 last:border-r-0 first:border-l-0"
                >
                  <span className="font-sans font-normal text-2xl lg:text-3xl tracking-[-0.6px] text-[#001f4d]/45">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIAL — parallax photo + centered light quote ───────── */}
      <section className="relative h-[100vh] lg:h-[110vh] w-full overflow-hidden bg-[#001f4d]">
        <div ref={testimonialPhotoRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/home-hero.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover scale-110"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/45" />
        <div className="relative h-full max-w-[1100px] mx-auto px-6 lg:px-12 flex flex-col items-center justify-center text-center gap-8">
          <blockquote className="font-sans font-normal text-[26px] sm:text-[36px] lg:text-[56px] leading-[1.18] tracking-[-0.8px] lg:tracking-[-1.8px] text-white max-w-[1000px]">
            &ldquo;We have not seen this kind of accuracy with crew dispatch
            technology — this is a significant milestone in the race to modernize
            the moving industry.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-1">
            <span className="font-sans font-normal text-base lg:text-lg text-white">
              Karen Jones
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-white/65">
              Operations Lead, Logistics Partner
            </span>
          </div>
        </div>
      </section>

      {/* ── 8. TRUSTED BY — light bg, big H2 + 6-cell grid logo wall ─────── */}
      <section
        ref={(el) => {
          if (el) introRefs.current[2] = el;
        }}
        className="relative bg-[#ffffff] px-6 lg:px-12 py-[100px] lg:py-[180px]"
      >
        <div className="max-w-[1408px] mx-auto flex flex-col gap-16 lg:gap-24">
          <h2
            data-intro-line
            className="font-sans font-normal text-[36px] sm:text-[56px] lg:text-[88px] leading-[0.98] tracking-[-1px] lg:tracking-[-3.2px] text-[#001f4d] text-center max-w-[1100px] mx-auto"
          >
            Trusted by leading operators looking for real moving innovation.
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 border-y border-[#001f4d]/8">
            {trustedLogos.slice(0, 6).map((l, i) => (
              <div
                key={l}
                className={`aspect-[16/9] flex items-center justify-center border-[#001f4d]/8 ${
                  i % 3 !== 0 ? "border-l" : ""
                } ${i >= 3 ? "border-t" : ""}`}
              >
                <span className="font-sans font-normal text-2xl lg:text-3xl tracking-[-0.6px] text-[#001f4d]/45">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CONTACT FORM — light bg, left pitch + right form ─────────── */}
      <section className="relative bg-[#ffffff] px-6 lg:px-12 py-[100px] lg:py-[160px] border-t border-[#001f4d]/8">
        <div className="max-w-[1408px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
              Take a closer look
            </span>
            <h3 className="font-sans font-normal text-[32px] lg:text-[56px] leading-[1.05] tracking-[-1px] lg:tracking-[-1.8px] text-[#001f4d]">
              Contact us and we will be in touch — same day, your way.
            </h3>
            <p className="font-sans text-base lg:text-lg leading-[1.5] text-[#001f4d]/70 max-w-[440px]">
              Tell us where you&apos;re going and roughly when. We&apos;ll come back
              with a flat-rate quote and a slot on the calendar.
            </p>
            <ul className="flex flex-col gap-3 mt-2">
              {["30-minute intro call", "Move plan & flat-rate quote", "Crew & truck reservation"].map(
                (it) => (
                  <li
                    key={it}
                    className="flex items-center gap-3 font-sans text-base lg:text-lg text-[#001f4d]"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: BLUE }}
                    />
                    {it}
                  </li>
                ),
              )}
            </ul>
          </div>
          <form className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Full name" placeholder="John Doe" />
            <FormField label="Role / position" placeholder="Project manager" />
            <FormField label="Phone number" placeholder="(323) 555-0147" />
            <FormField label="Email" placeholder="name@email.com" type="email" />
            <FormField
              label="Move type"
              placeholder="Local, long-distance, commercial…"
              full
            />
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
                Tell us about the move
              </label>
              <textarea
                rows={5}
                className="bg-transparent border border-[#001f4d]/15 rounded-md px-5 py-4 text-[#001f4d] placeholder:text-[#001f4d]/35 focus:outline-none focus:border-[#001f4d]/55 transition-colors resize-none font-sans"
                placeholder="Origin, destination, square footage, target date…"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="h-[52px] px-8 rounded-md font-mono font-bold text-[11px] uppercase tracking-[1.5px] text-white hover:opacity-90 transition-opacity duration-300 cursor-pointer"
                style={{ background: BLUE }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── 10. FINAL CTA BANNER — huge ink statement + blue pill ────────── */}
      <section className="relative bg-[#ffffff] px-6 lg:px-12 py-[120px] lg:py-[200px] border-t border-[#001f4d]/8">
        <div className="max-w-[1408px] mx-auto flex flex-col items-center gap-12 lg:gap-16 text-center">
          <h2 className="font-sans font-normal text-[44px] sm:text-[68px] lg:text-[120px] leading-[0.95] tracking-[-1.5px] lg:tracking-[-3.6px] text-[#001f4d] max-w-[1280px]">
            The way America moves starts today.
          </h2>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-quote-modal"))
            }
            className="h-[58px] px-12 rounded-lg font-mono font-bold text-[11px] uppercase tracking-[1.98px] text-white hover:opacity-90 transition-opacity duration-300 cursor-pointer"
            style={{ background: BLUE }}
          >
            Take charge of your move
          </button>
        </div>
      </section>

      {/* ── 11. FOOTER — light bg, ink text, blue accents ────────────────── */}
      <footer className="relative bg-[#ffffff] px-6 lg:px-12 pt-[60px] lg:pt-[100px] pb-[40px] border-t border-[#001f4d]/12">
        <div className="max-w-[1408px] mx-auto flex flex-col gap-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
                Technology
              </span>
              <Link href="/local-moving" className="text-[#001f4d] hover:opacity-70 text-sm">Local moving</Link>
              <Link href="/long-distance-moving" className="text-[#001f4d] hover:opacity-70 text-sm">Long distance</Link>
              <Link href="/commercial-moving" className="text-[#001f4d] hover:opacity-70 text-sm">Commercial</Link>
              <Link href="/packing-services" className="text-[#001f4d] hover:opacity-70 text-sm">Packing</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
                Company
              </span>
              <Link href="/reviews" className="text-[#001f4d] hover:opacity-70 text-sm">Reviews</Link>
              <Link href="/faq" className="text-[#001f4d] hover:opacity-70 text-sm">FAQ</Link>
              <Link href="/contacts" className="text-[#001f4d] hover:opacity-70 text-sm">Contact</Link>
              <Link href="/privacy" className="text-[#001f4d] hover:opacity-70 text-sm">Privacy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
                Reach us
              </span>
              <a href="tel:+13805240846" className="text-[#001f4d] hover:opacity-70 text-sm">+1 (380) 524-0846</a>
              <a href="mailto:info@goatmovers.com" className="text-[#001f4d] hover:opacity-70 text-sm">info@goatmovers.com</a>
              <span className="text-[#001f4d]/55 text-sm">Give us a call today.</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
                Locations
              </span>
              <span className="text-[#001f4d] text-sm">Vancouver, WA</span>
              <span className="text-[#001f4d] text-sm">Portland, OR</span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-8 border-t border-[#001f4d]/12">
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
              © {new Date().getFullYear()} GOAT Movers · USDOT #4232069
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
              Built for operators
            </span>
          </div>
        </div>
      </footer>

      {/* Suppress unused-var warnings for the constants we keep around for
          future tweaks (PAPER, INK referenced in inline styles where needed). */}
      <span aria-hidden style={{ display: "none", color: PAPER, background: INK }} />
    </>
  );
}

/* ── Tiny field component for the contact form ───────────────────────────── */
function FormField({
  label,
  placeholder,
  type = "text",
  full = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <label className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent border border-[#001f4d]/15 rounded-md px-5 h-[52px] text-[#001f4d] placeholder:text-[#001f4d]/35 focus:outline-none focus:border-[#001f4d]/55 transition-colors font-sans"
      />
    </div>
  );
}
