"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsapPlugins } from "@/components/motion/gsap";

/* /mainpage-5 — terminal-industries-style structural draft.
   - Hero: CSS sticky pin over 300vh, canvas frame-scrub (120 webp
     frames from aimoving.app), one-shot text stagger on mount.
   - Numbered features: sticky-pin, 6 steps switched discretely on
     scroll, no auto-rotate.
   - 3 benefit panels: stack-pin, each subsequent panel slides up
     from below to cover the previous.
   - Marquee, testimonial w/ parallax photo, logo grid, form, banner,
     footer follow. All copy is generic placeholder. */

const features = [
  { n: "01", title: "Crew dispatch", body: "Real movers, vetted and trained, ready when you book." },
  { n: "02", title: "Inventory routing", body: "Every box and crate tracked from doorway to doorway." },
  { n: "03", title: "Insurance coverage", body: "Federally licensed coverage on every interstate haul." },
  { n: "04", title: "Live communication", body: "One dedicated coordinator from quote to unload." },
  { n: "05", title: "Flat-rate quoting", body: "What we say at the start is what you pay at the end." },
  { n: "06", title: "Same-team delivery", body: "The crew that loads is the crew that unloads." },
];

const benefits = [
  {
    label: "Benefit 01",
    title: "Reduce moving-day risk",
    body: "Pre-planned routes, professional packing, and federal coverage take the unknowns out of the day.",
    image: "/images/local-moving-hero.png",
  },
  {
    label: "Benefit 02",
    title: "Predictable budgets",
    body: "Flat-rate pricing means no surprise fuel surcharges, weight reweighs, or stair fees at the back end.",
    image: "/images/long-distance-hero.avif",
  },
  {
    label: "Benefit 03",
    title: "Single point of contact",
    body: "One coordinator owns your move end-to-end. No call-center handoffs, no losing track of where things stand.",
    image: "/images/commercial-moving-hero.png",
  },
];

const partners = [
  "Coca-Cola",
  "HP",
  "Microsoft",
  "Nike",
  "Adidas",
  "Boeing",
  "Intel",
  "Costco",
];

const clients = [
  { name: "Coca-Cola" },
  { name: "HP" },
  { name: "Microsoft" },
  { name: "Nike" },
  { name: "Adidas" },
  { name: "Boeing" },
];

const FRAME_COUNT = 120;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(4, "0")}.webp`;

export function TerminalDraftClient() {
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const featuresWrapperRef = useRef<HTMLDivElement>(null);
  const stepNumberRef = useRef<HTMLSpanElement>(null);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const stepBodyRef = useRef<HTMLParagraphElement>(null);
  const prevFeatureRef = useRef<number>(0);
  const benefitsWrapperRef = useRef<HTMLDivElement>(null);
  const benefitCardRefs = useRef<HTMLDivElement[]>([]);
  const accentRef = useRef<HTMLDivElement>(null);
  const introRefs = useRef<HTMLDivElement[]>([]);
  const testimonialPhotoRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  /* ── HERO: canvas frame-scrub + one-shot text reveal ─────────────────── */
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
      // If requested frame not loaded yet, fall back to the latest
      // already-loaded frame so the canvas isn't blank during preload.
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

    // Split the h1 into per-char spans so we can scrub-fade each
    // character along with the frame timeline. We also clean any
    // prior split (StrictMode double-mount).
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
        span.textContent = ch === " " ? " " : ch;
        h1El.appendChild(span);
      });
    }

    const ctx = gsap.context(() => {
      // Single ScrollTrigger drives everything — frame index AND
      // staggered text reveal — bound to the outer wrapper's scroll
      // progress. Inner sticky element handles the visual pin via
      // CSS, no ScrollTrigger.pin needed.
      const scrubObj = { f: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      // (a) Frame scrub — runs the whole timeline (duration 1),
      //     so frame index advances linearly with scroll progress.
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

      // (b) Kicker fades in early (progress 0.02 → 0.08).
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

      // (c) H1 chars — staggered fade-in over progress 0.08 → 0.45.
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

      // (d) Subtitle reveals after the title (progress 0.5 → 0.62).
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

      // (e) CTAs land last (progress 0.65 → 0.78).
      const ctas = heroTextRef.current?.querySelector<HTMLElement>(
        "div[data-hero-line]",
      );
      if (ctas) {
        tl.fromTo(
          ctas,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.13 },
          0.65,
        );
      }
    });

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  /* ── NUMBERED FEATURES: sticky-pin, scroll-tied step switch ─────────── */
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
              const idx = Math.min(total - 1, Math.floor(self.progress * total + 0.0001));
              setActiveFeature((prev) => (prev === idx ? prev : idx));
            },
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── NUMBERED FEATURES: count-up + crossfade on step change ─────────── */
  useEffect(() => {
    const prev = prevFeatureRef.current;
    if (prev === activeFeature) return;

    // (a) Count-up the big numeral. Tween a number through prev → next
    //     with snap so we see whole-integer ticks.
    const numEl = stepNumberRef.current;
    if (numEl) {
      const obj = { n: prev + 1 };
      gsap.to(obj, {
        n: activeFeature + 1,
        duration: 0.45,
        ease: "power2.out",
        snap: { n: 1 },
        onUpdate: () => {
          numEl.textContent = String(Math.round(obj.n)).padStart(2, "0");
        },
      });
    }

    // (b) Crossfade title + body — quick fade-out of the prior copy and
    //     fade-in of the new (state has already updated, so refs hold
    //     the new text).
    const titleEl = stepTitleRef.current;
    const bodyEl = stepBodyRef.current;
    if (titleEl && bodyEl) {
      gsap.fromTo(
        [titleEl, bodyEl],
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.06,
        },
      );
    }

    prevFeatureRef.current = activeFeature;
  }, [activeFeature]);

  /* ── 3 BENEFIT PANELS: stack-pin + char-reveal on each title ─────────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = benefitsWrapperRef.current;
    if (!wrapperEl) return;
    const cards = benefitCardRefs.current.filter(Boolean);
    if (cards.length !== benefits.length) return;

    // Split each card title into per-char spans so they can scrub-fade
    // in sync with the stack timeline. Repeat-mount safe.
    const cardCharSets: HTMLElement[][] = cards.map((card) => {
      const titleEl = card.querySelector<HTMLHeadingElement>("h3");
      if (!titleEl) return [];
      const original = titleEl.dataset.original ?? titleEl.textContent ?? "";
      titleEl.dataset.original = original;
      titleEl.innerHTML = "";
      const charNodes: HTMLElement[] = [];
      original.split("").forEach((ch) => {
        const span = document.createElement("span");
        span.className = "benefit-char";
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.willChange = "opacity";
        span.textContent = ch === " " ? " " : ch;
        titleEl.appendChild(span);
        charNodes.push(span);
      });
      return charNodes;
    });

    const ctx = gsap.context(() => {
      // Initial: first card visible (chars too), others below.
      cards.forEach((c, i) => {
        gsap.set(c, { yPercent: i === 0 ? 0 : 100, zIndex: i + 1 });
      });
      // First card's title chars start at full opacity (they're already
      // on screen at progress 0). Subsequent cards' chars start hidden
      // and reveal as their card slides in.
      cardCharSets.forEach((charNodes, i) => {
        gsap.set(charNodes, { opacity: i === 0 ? 1 : 0 });
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
        // Slide the new card in from below.
        tl.fromTo(
          cards[i],
          { yPercent: 100 },
          { yPercent: 0, duration: 1 },
          i - 1,
        );
        // Stagger-reveal that card's title chars over the latter half
        // of the slide so the title finishes "typing" just as the card
        // settles.
        const charNodes = cardCharSets[i];
        if (charNodes.length) {
          tl.to(
            charNodes,
            {
              opacity: 1,
              ease: "none",
              duration: 0.001,
              stagger: { each: 0.5 / charNodes.length, from: "start" },
            },
            i - 1 + 0.45,
          );
        }
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── ACCENT PANEL: parallax on the bg image (single sticky-screen) ──── */
  useEffect(() => {
    registerGsapPlugins();
    const accentEl = accentRef.current;
    if (!accentEl) return;
    const bgImg = accentEl.querySelector<HTMLElement>("[data-accent-bg]");
    const ctx = gsap.context(() => {
      if (bgImg) {
        gsap.fromTo(
          bgImg,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: accentEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── INTRO SECTIONS: simple reveal on enter ─────────────────────────── */
  useEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      introRefs.current.filter(Boolean).forEach((el) => {
        const items = el.querySelectorAll<HTMLElement>("[data-intro-line]");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 75%" },
          },
        );
      });
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
        { yPercent: -8 },
        {
          yPercent: 8,
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
      {/* ── 1. HERO — outer 300vh wrapper, sticky inner pinned screen ────── */}
      <div
        ref={heroWrapperRef}
        className="relative w-full"
        style={{ height: "300vh" }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden border-b border-white/10">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none"
          />
          <div
            ref={heroTextRef}
            className="relative h-full max-w-[1408px] mx-auto px-6 lg:px-12 flex flex-col justify-end pb-[60px] lg:pb-[100px] pt-[120px] gap-6 lg:gap-8"
          >
            <span
              data-hero-line
              className="font-mono text-xs lg:text-sm uppercase tracking-[2px] text-white/60"
            >
              Movers · Vancouver, WA · Portland, OR · Interstate
            </span>
            <h1
              data-hero-line
              className="font-sans font-semibold text-[44px] sm:text-[64px] lg:text-[120px] leading-[0.95] tracking-[-1.5px] lg:tracking-[-3.6px] text-white max-w-[1100px]"
            >
              The operating layer for residential and commercial moves.
            </h1>
            <p
              data-hero-line
              className="font-sans font-normal text-lg lg:text-2xl leading-[1.4] tracking-[-0.5px] text-white/80 max-w-[640px]"
            >
              Crew, equipment, insurance, and routing — coordinated end-to-end so the
              day of your move never becomes a problem to solve in real time.
            </p>
            <div data-hero-line className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                className="bg-[#FFE533] text-[#0c0c0c] h-[52px] px-7 rounded-md font-mono font-bold text-sm uppercase tracking-[1px] hover:bg-[#f0d820] transition-colors duration-300 cursor-pointer"
              >
                Request demo
              </button>
              <Link
                href="/contacts"
                className="border border-white/40 bg-black/30 backdrop-blur text-white h-[52px] px-7 rounded-md font-mono font-bold text-sm uppercase tracking-[1px] hover:border-white hover:bg-black/50 transition-all duration-300 inline-flex items-center justify-center"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── 1.5. INTRO — centered breath between hero and the system ─────── */}
      <section
        ref={(el) => {
          if (el) introRefs.current[0] = el;
        }}
        className="relative bg-[#0c0c0c] border-b border-white/10 px-6 lg:px-12 py-[80px] lg:py-[140px] min-h-[80vh] flex items-center"
      >
        <div className="max-w-[1100px] mx-auto w-full text-center flex flex-col gap-8 lg:gap-12">
          <span
            data-intro-line
            className="font-mono text-xs lg:text-sm uppercase tracking-[2px] text-white/50"
          >
            What we move
          </span>
          <h2
            data-intro-line
            className="font-sans font-semibold text-[36px] lg:text-[80px] leading-[1.05] tracking-[-1px] lg:tracking-[-2.4px] text-white"
          >
            Apartments, houses, offices, warehouses — same crew, same playbook.
          </h2>
          <p
            data-intro-line
            className="font-sans text-base lg:text-xl leading-[1.5] tracking-[-0.4px] text-white/70 max-w-[680px] mx-auto"
          >
            We run the move as a single coordinated operation rather than a series
            of handoffs. Vetted movers, dedicated trucks, and one coordinator
            holding the line from quote to unload.
          </p>
        </div>
      </section>

      {/* ── 2. NUMBERED FEATURES — sticky-pin, scroll-tied switch ────────── */}
      <div
        ref={featuresWrapperRef}
        className="relative"
        style={{ height: `${(features.length + 1) * 100}vh` }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center border-b border-white/10">
          <div className="max-w-[1408px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="font-mono text-xs uppercase tracking-[2px] text-white/50">
                The system
              </span>
              <div className="flex items-baseline gap-4">
                <span
                  ref={stepNumberRef}
                  className="font-sans font-bold text-[120px] lg:text-[200px] leading-none tracking-[-6px] text-white tabular-nums"
                >
                  {features[activeFeature].n}
                </span>
                <span className="font-mono text-sm uppercase tracking-[2px] text-white/40">
                  / 0{features.length}
                </span>
              </div>
              <h3
                ref={stepTitleRef}
                className="font-sans font-semibold text-2xl lg:text-4xl leading-[1.1] tracking-[-0.8px] text-white"
              >
                {features[activeFeature].title}
              </h3>
              <p
                ref={stepBodyRef}
                className="font-sans text-base lg:text-lg text-white/60 leading-[1.5] max-w-[440px]"
              >
                {features[activeFeature].body}
              </p>
            </div>
            <ul className="lg:col-span-7 flex flex-col">
              {features.map((f, i) => (
                <li key={f.n}>
                  <div
                    className={`w-full text-left flex items-center justify-between py-5 lg:py-7 border-t border-white/10 transition-colors duration-300 ${
                      i === activeFeature ? "text-white" : "text-white/40"
                    }`}
                  >
                    <span className="font-mono text-xs uppercase tracking-[2px] tabular-nums">
                      {f.n}
                    </span>
                    <span className="font-sans font-medium text-lg lg:text-2xl leading-[1.2] tracking-[-0.4px] flex-1 ml-6 lg:ml-12">
                      {f.title}
                    </span>
                    <span
                      aria-hidden
                      className={`font-mono text-lg transition-transform duration-300 ${
                        i === activeFeature ? "translate-x-1" : ""
                      }`}
                    >
                      →
                    </span>
                  </div>
                </li>
              ))}
              <li className="border-t border-white/10" />
            </ul>
          </div>
        </section>
      </div>

      {/* ── 2.5. INTRO — bridge into the benefits stack ──────────────────── */}
      <section
        ref={(el) => {
          if (el) introRefs.current[1] = el;
        }}
        className="relative bg-[#0c0c0c] border-b border-white/10 px-6 lg:px-12 py-[80px] lg:py-[140px] min-h-[70vh] flex items-center"
      >
        <div className="max-w-[1100px] mx-auto w-full text-center flex flex-col gap-8 lg:gap-12">
          <span
            data-intro-line
            className="font-mono text-xs lg:text-sm uppercase tracking-[2px] text-white/50"
          >
            Why it works
          </span>
          <h2
            data-intro-line
            className="font-sans font-semibold text-[36px] lg:text-[80px] leading-[1.05] tracking-[-1px] lg:tracking-[-2.4px] text-white"
          >
            Three things you get on every move.
          </h2>
        </div>
      </section>

      {/* ── 3. THREE BENEFIT PANELS — stack-pin (next covers previous) ───── */}
      <div
        ref={benefitsWrapperRef}
        className="relative"
        style={{ height: `${(benefits.length + 1) * 100}vh` }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden border-b border-white/10">
          {benefits.map((b, i) => (
            <div
              key={b.label}
              ref={(el) => {
                if (el) benefitCardRefs.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              <div className="absolute inset-0">
                <Image
                  src={b.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />
              </div>
              <div className="relative h-full max-w-[1408px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                <div className="lg:col-span-3">
                  <span className="font-mono text-xs uppercase tracking-[2px] text-white/70">
                    {b.label}
                  </span>
                </div>
                <div className="lg:col-span-9 flex flex-col gap-6 lg:gap-8">
                  <h3 className="font-sans font-semibold text-[36px] lg:text-[80px] leading-[1.05] tracking-[-1px] lg:tracking-[-2.4px] text-white max-w-[900px]">
                    {b.title}
                  </h3>
                  <p className="font-sans text-base lg:text-xl leading-[1.5] tracking-[-0.4px] text-white/80 max-w-[640px]">
                    {b.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ── 3.5. ACCENT PANEL — single sticky screen, contrasting bg ─────── */}
      <div ref={accentRef} className="relative h-[120vh] w-full">
        <section className="sticky top-0 h-screen w-full overflow-hidden border-b border-white/10 bg-[#FFE533]">
          <div
            data-accent-bg
            className="absolute inset-0 will-change-transform mix-blend-multiply opacity-30"
          >
            <Image
              src="/images/cta-bg.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover scale-110"
            />
          </div>
          <div className="relative h-full max-w-[1408px] mx-auto px-6 lg:px-12 flex flex-col justify-center gap-10 lg:gap-16">
            <span className="font-mono text-xs lg:text-sm uppercase tracking-[2px] text-[#0c0c0c]/70">
              The promise
            </span>
            <h2 className="font-sans font-semibold text-[44px] sm:text-[64px] lg:text-[120px] leading-[0.95] tracking-[-1.5px] lg:tracking-[-3.6px] text-[#0c0c0c] max-w-[1100px]">
              No surprise fees. No swapped crews. No moving-day chaos.
            </h2>
            <p className="font-sans font-normal text-lg lg:text-2xl leading-[1.4] tracking-[-0.5px] text-[#0c0c0c]/80 max-w-[700px]">
              Built for residential and commercial relocations across the Pacific
              Northwest and the country — same crew start to finish, flat-rate
              quoting, federally licensed coverage.
            </p>
          </div>
        </section>
      </div>

      {/* ── 4. PARTNER MARQUEE ───────────────────────────────────────────── */}
      <section className="relative py-10 lg:py-16 border-b border-white/10 overflow-hidden bg-[#0c0c0c]">
        <div className="max-w-[1408px] mx-auto px-6 lg:px-12 mb-8">
          <span className="font-mono text-xs uppercase tracking-[2px] text-white/50">
            Trusted by
          </span>
        </div>
        <div className="flex gap-12 lg:gap-20 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {[...partners, ...partners].map((p, i) => (
            <span
              key={i}
              className="font-sans font-semibold text-2xl lg:text-4xl tracking-[-0.5px] text-white/40 shrink-0"
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* ── 5. TESTIMONIAL — parallax photo + pull-quote ─────────────────── */}
      <section className="relative px-6 lg:px-12 py-[80px] lg:py-[140px] border-b border-white/10 bg-[#0c0c0c]">
        <div className="max-w-[1408px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col gap-8 lg:gap-12">
            <span className="font-mono text-xs uppercase tracking-[2px] text-white/50">
              Customer perspective
            </span>
            <blockquote className="font-sans font-medium text-[28px] lg:text-[56px] leading-[1.15] tracking-[-1px] lg:tracking-[-1.8px] text-white">
              The whole thing was professional from the first call to the last box. We
              ran an interstate move with zero downtime and no surprises on the bill.
            </blockquote>
            <div className="flex flex-col gap-1">
              <span className="font-sans font-semibold text-base lg:text-lg text-white">
                Operations Lead
              </span>
              <span className="font-mono text-sm uppercase tracking-[1.5px] text-white/50">
                Logistics partner
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-md overflow-hidden">
            <div ref={testimonialPhotoRef} className="absolute inset-0 will-change-transform">
              <Image
                src="/images/home-hero.png"
                alt="Customer testimonial portrait"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CLIENT LOGO GRID ──────────────────────────────────────────── */}
      <section className="relative px-6 lg:px-12 py-[60px] lg:py-[100px] border-b border-white/10 bg-[#0c0c0c]">
        <div className="max-w-[1408px] mx-auto flex flex-col gap-10">
          <span className="font-mono text-xs uppercase tracking-[2px] text-white/50">
            Operators we work with
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
            {clients.map((c, i) => (
              <div key={i} className="flex items-center justify-center h-20">
                <span className="font-sans font-bold text-2xl lg:text-3xl tracking-[-0.5px] text-white/50">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. INLINE CTA ────────────────────────────────────────────────── */}
      <section className="relative px-6 lg:px-12 py-[40px] lg:py-[60px] border-b border-white/10 bg-[#0c0c0c]">
        <div className="max-w-[1408px] mx-auto">
          <Link
            href="/local-moving"
            className="inline-flex items-center gap-3 font-sans font-medium text-2xl lg:text-4xl tracking-[-0.5px] text-white hover:text-[#FFE533] transition-colors duration-300"
          >
            See how the system works
            <span aria-hidden className="text-3xl lg:text-5xl">↗</span>
          </Link>
        </div>
      </section>

      {/* ── 8. CONTACT FORM ──────────────────────────────────────────────── */}
      <section className="relative px-6 lg:px-12 py-[80px] lg:py-[140px] border-b border-white/10 bg-[#0c0c0c]">
        <div className="max-w-[1408px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-[2px] text-white/50">
              Contact
            </span>
            <h3 className="font-sans font-semibold text-[36px] lg:text-[64px] leading-[1.05] tracking-[-1px] lg:tracking-[-2px] text-white">
              Talk to a coordinator.
            </h3>
            <p className="font-sans text-base lg:text-lg leading-[1.5] text-white/60 max-w-[440px]">
              Tell us where you&apos;re going and roughly when. We&apos;ll come back
              with a flat-rate quote and a slot on the calendar.
            </p>
          </div>
          <form className="lg:col-span-7 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Full name"
                className="bg-transparent border border-white/15 rounded-md px-5 h-[52px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent border border-white/15 rounded-md px-5 h-[52px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <select
              className="bg-transparent border border-white/15 rounded-md px-5 h-[52px] text-white/60 focus:outline-none focus:border-white/40 transition-colors"
              defaultValue=""
            >
              <option value="" disabled>
                Move type
              </option>
              <option className="bg-[#0c0c0c]" value="local">Local</option>
              <option className="bg-[#0c0c0c]" value="long-distance">Long distance</option>
              <option className="bg-[#0c0c0c]" value="commercial">Commercial</option>
            </select>
            <textarea
              placeholder="Tell us about the move"
              rows={5}
              className="bg-transparent border border-white/15 rounded-md px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#FFE533] text-[#0c0c0c] h-[52px] px-8 rounded-md font-mono font-bold text-sm uppercase tracking-[1px] hover:bg-[#f0d820] transition-colors duration-300 cursor-pointer"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── 9. FOOTER CTA BANNER ─────────────────────────────────────────── */}
      <section className="relative px-6 lg:px-12 py-[60px] lg:py-[100px] border-b border-white/10 bg-[#FFE533]">
        <div className="max-w-[1408px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <h3 className="font-sans font-semibold text-[36px] lg:text-[80px] leading-[1] tracking-[-1px] lg:tracking-[-2.4px] text-[#0c0c0c] max-w-[900px]">
            Move better, with people who actually do it.
          </h3>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-3 font-mono font-bold text-sm uppercase tracking-[1px] text-[#0c0c0c] border border-[#0c0c0c] h-[52px] px-7 rounded-md hover:bg-[#0c0c0c] hover:text-[#FFE533] transition-colors duration-300 self-start"
          >
            Get started <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>

      {/* ── 10. FOOTER ───────────────────────────────────────────────────── */}
      <footer className="relative px-6 lg:px-12 py-[40px] lg:py-[60px] bg-[#0c0c0c]">
        <div className="max-w-[1408px] mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[2px] text-white/40">
                Services
              </span>
              <Link href="/local-moving" className="text-white/70 hover:text-white text-sm">Local moving</Link>
              <Link href="/long-distance-moving" className="text-white/70 hover:text-white text-sm">Long distance</Link>
              <Link href="/commercial-moving" className="text-white/70 hover:text-white text-sm">Commercial</Link>
              <Link href="/packing-services" className="text-white/70 hover:text-white text-sm">Packing</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[2px] text-white/40">
                Company
              </span>
              <Link href="/reviews" className="text-white/70 hover:text-white text-sm">Reviews</Link>
              <Link href="/faq" className="text-white/70 hover:text-white text-sm">FAQ</Link>
              <Link href="/contacts" className="text-white/70 hover:text-white text-sm">Contact</Link>
              <Link href="/privacy" className="text-white/70 hover:text-white text-sm">Privacy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[2px] text-white/40">
                Reach
              </span>
              <a href="tel:+13805240846" className="text-white/70 hover:text-white text-sm">+1 (380) 524-0846</a>
              <a href="mailto:info@goatmovers.com" className="text-white/70 hover:text-white text-sm">info@goatmovers.com</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[2px] text-white/40">
                Locations
              </span>
              <span className="text-white/70 text-sm">Vancouver, WA</span>
              <span className="text-white/70 text-sm">Portland, OR</span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-8 border-t border-white/10">
            <span className="font-mono text-xs uppercase tracking-[2px] text-white/40">
              © {new Date().getFullYear()} GOAT Movers
            </span>
            <span className="font-mono text-xs uppercase tracking-[2px] text-white/40">
              USDOT #4232069
            </span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
