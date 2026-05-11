"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/components/motion/gsap";
import MagicRings from "./MagicRings";

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
   4.  CTA Beat — quiet headline + microcopy + outline pill, scroll-
       scrubbed fade-up entrance, opens QuoteModal on click
   5.  Three benefit panels (stack-pin: each slides up to cover the prev),
       each with a tall media block + thin caption strip below
   6.  "Built by the industry" + grid logo wall
   7.  Testimonial (parallax photo + centered quote)
   8.  "Trusted by" + grid-line logo wall
   9.  Contact form (left pitch, right form)
   10. Final CTA banner (huge ink statement + blue pill)
   11. Footer (light, ink text)

   noindex/nofollow set on the page metadata. */

/* "Benefits" block now carries the real GOAT how-it-works steps — same
   visual (sticky-pin with image + text stacks), different content. Copy
   sourced from `HowItWorksSection.tsx`. */
const benefits = [
  {
    label: "Step 01",
    title: "Get a Free Estimate",
    body: "Tell us your move details — pickup, drop-off, date, anything fragile — and we'll send back an honest, all-in quote. No phone tag, no obligations.",
    image: "/images/home-hero.png",
  },
  {
    label: "Step 02",
    title: "We Show Up Ready",
    body: "On move day the crew rolls up on time with the right-size truck, padding, dollies, shrink-wrap, and the materials it takes to start working in the first ten minutes.",
    image: "/images/long-distance-hero.jpg",
  },
  {
    label: "Step 03",
    title: "We Pack & Load",
    body: "Furniture wrapped, boxes stacked, electronics and fragiles boxed with care. Everything secured in the truck so nothing shifts on the road.",
    image: "/images/packing-hero.png",
  },
  {
    label: "Step 04",
    title: "Delivery & Setup",
    body: "We unload at your new place, reassemble the furniture we disassembled, and put boxes in the rooms you want them. The job ends with you settled in, not at the curb.",
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

/* Hero frame-scrub: two source sets — landscape 1280×716 (5 stitched
   mp4s, 567 frames) for desktop, portrait 720×1280 (single mp4, 556
   frames) for mobile. Selected at hero-mount time via matchMedia
   (`≤991px`). Both extracted via ffmpeg-static at fps=12 → webp q=70
   compression_level 4. ~28 MB desktop / ~15 MB mobile. */
const FRAMES_DESKTOP = {
  count: 567,
  path: (i: number) =>
    `/frames/frame_${String(i + 1).padStart(4, "0")}.webp`,
};
const FRAMES_MOBILE = {
  count: 556,
  path: (i: number) =>
    `/frames-mobile/frame_${String(i + 1).padStart(4, "0")}.webp`,
};

/* Services-section frames: 4 best clips trimmed out of "Services
   Video.mov" (black gaps removed via ffmpeg trim+concat). fps=15 +
   scale 1024×576 + webp q=70 → 147 frames, ~5.4 MB. Higher fps than
   previous 10fps so per-frame steps look fluid rather than choppy
   when scrubbed by the user's scroll. */
const FRAMES_SERVICES = {
  count: 147,
  path: (i: number) =>
    `/frames-services/frame_${String(i + 1).padStart(4, "0")}.webp`,
};


const heroPhrases = [
  "We have reinvented the way America moves.",
  "Crew, trucks, and routes — coordinated on one platform.",
  "From booking to unload, every step is verified.",
  "Predictable pricing. Vetted teams. Zero handoffs.",
  "Same-day quotes. Same-team delivery.",
  "Computer-vision inventory at every doorway.",
  "Real-time visibility from quote to delivery.",
  "A new operating system for moving.",
];

/* Sticky-steps block now carries the GOAT service catalogue — same
   visual (Osmo Supply sticky-pin with char-wave h2 + clip-path image
   reveal), different content. Three core services (Local, Long
   Distance, Commercial) come from the live `/` ServicesSection; the
   four packing offerings (Full-Service, Partial, Labor Only,
   Unpacking) come from `/packing-services` to reflect what GOAT
   actually advertises beyond the four top-level pages. */
const stickySteps = [
  {
    eyebrow: "Service 01",
    h2: "Local Moving",
    p: "Residential moves across Vancouver, WA, Portland, OR, and the surrounding metro. Packing, loading, transportation, unloading, unpacking — all included, no hidden fees.",
    image: "/images/service-local.png",
  },
  {
    eyebrow: "Service 02",
    h2: "Long Distance",
    p: "Interstate relocations from the Pacific Northwest. USDOT-licensed (#4232069) and fully insured for cross-state moves of any size.",
    image: "/images/service-longdistance.jpg",
  },
  {
    eyebrow: "Service 03",
    h2: "Commercial Moving",
    p: "Office and commercial relocations in Vancouver and Portland with minimal downtime. Equipment, furniture, and sensitive documents handled safely and on schedule.",
    image: "/images/service-commercial.png",
  },
  {
    eyebrow: "Service 04",
    h2: "Full-Service Packing",
    p: "We pack everything — every room, every drawer, every fragile item. You keep working, we handle the boxes. Best for busy professionals, last-minute moves, and families with young kids.",
    image: "/images/service-packing.png",
  },
  {
    eyebrow: "Service 05",
    h2: "Packing Services",
    p: "Partial packing, supply drops, fragile-only handling, or unpacking at the new place — pick exactly the parts you don't want to touch. Quality boxes, paper, and wrap included.",
    image: "/images/packing-hero.jpg",
  },
];

/* Inline color constants — Tailwind v4 arbitrary values use these
   throughout. Kept in one place so a brand tweak is one PR. */
const INK = "#001f4d";
const PAPER = "#ffffff";
const BLUE = "#0066ff";

export function TerminalDraftClient() {
  /* Mobile flag — used to swap a few component props (MagicRings
     density). Deterministic initial value via lazy init so the
     first render already has the correct match. Desktop stays
     exactly at the original tuning (no false→true churn that would
     re-trigger renders or briefly mis-render WebGL). SSR-safe via
     the `typeof window` guard. */
  const [isMobileView] = useState<boolean>(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 991px)").matches,
  );

  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const introRefs = useRef<HTMLDivElement[]>([]);

  const stickyStepsRef = useRef<HTMLElement>(null);
  const servicesCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  /* Mobile-only refs: one sticky panel that shows ONE
     title + description + canvas. Text content swaps on scroll
     instead of rendering five separate stacked items. */
  const mobileStepsWrapperRef = useRef<HTMLDivElement>(null);
  const mobileEyebrowRef = useRef<HTMLSpanElement>(null);
  const mobileH2Ref = useRef<HTMLHeadingElement>(null);
  const mobilePRef = useRef<HTMLParagraphElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement | null>(null);

  /* Morph CTA: long phrase scatters char-by-char and reforms as the
     GOAT® brand mark, then a CTA pill rises. All tied to scroll-scrub
     so the beat lands during the section's sticky-pin window. */
  const morphWrapperRef = useRef<HTMLDivElement>(null);
  const morphEyebrowRef = useRef<HTMLSpanElement>(null);
  const morphHeadlineRef = useRef<HTMLHeadingElement>(null);
  const morphShortRef = useRef<HTMLSpanElement>(null);
  const morphCtaRef = useRef<HTMLButtonElement>(null);
  const morphRingsRef = useRef<HTMLDivElement>(null);

  const benefitsWrapperRef = useRef<HTMLDivElement>(null);
  const benefitImageRefs = useRef<HTMLDivElement[]>([]);
  const benefitTextRefs = useRef<HTMLDivElement[]>([]);

  const testimonialPhotoRef = useRef<HTMLDivElement>(null);

  /* ── HERO: canvas frame-scrub + char-stagger headline reveal ─────────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = heroWrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapperEl || !canvasEl) return;

    /* Pick frame set once at mount based on viewport width. No live
       switching on resize — the two videos have different content
       (landscape vs portrait crop) so swapping mid-scroll would jar.
       Reload on cross-breakpoint is acceptable. */
    const isMobile = window.matchMedia("(max-width: 991px)").matches;
    const FRAMES = isMobile ? FRAMES_MOBILE : FRAMES_DESKTOP;
    const FRAME_COUNT = FRAMES.count;
    const FRAME_PATH = FRAMES.path;

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
      /* Center-fit horizontally + vertically, but on mobile shift
         the frame ~8% of canvas width to the left so the subject
         (which sits slightly right-of-centre in the portrait crop)
         lands closer to viewport centre. */
      const dx = (cw - dw) / 2 - (isMobile ? cw * 0.08 : 0);
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

    // Per-char split for every phrase — each phrase gets its own
    // staggered reveal window during scroll. StrictMode safe.
    const phraseEls = Array.from(
      heroTextRef.current?.querySelectorAll<HTMLHeadingElement>(
        "h1[data-hero-phrase]",
      ) ?? [],
    );
    phraseEls.forEach((el) => {
      const original = el.dataset.original ?? el.textContent ?? "";
      el.dataset.original = original;
      el.innerHTML = "";
      // Split on whitespace AND hyphens, keeping the delimiters as
      // their own segments so hyphens become independent line-break
      // candidates (otherwise long hyphenated words like
      // "Computer-vision" overflow narrow viewports).
      const segments = original.split(/(\s|-)/).filter((s) => s.length > 0);
      segments.forEach((seg) => {
        if (/^\s+$/.test(seg)) {
          el.appendChild(document.createTextNode(seg));
          return;
        }
        if (seg === "-") {
          // Hyphen as its own animatable char — break-friendly.
          const dash = document.createElement("span");
          dash.className = "hero-char";
          dash.style.display = "inline-block";
          dash.style.opacity = "0";
          dash.style.willChange = "opacity";
          dash.textContent = "-";
          el.appendChild(dash);
          return;
        }
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";
        seg.split("").forEach((ch) => {
          const span = document.createElement("span");
          span.className = "hero-char";
          span.style.display = "inline-block";
          span.style.opacity = "0";
          span.style.willChange = "opacity";
          span.textContent = ch;
          wordSpan.appendChild(span);
        });
        el.appendChild(wordSpan);
      });
    });

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

      // Sequential per-character reveal across the pinned hero scroll —
      // each phrase staggers its chars in, holds, then staggers them out
      // before the next phrase begins.
      if (phraseEls.length) {
        const N = phraseEls.length;
        const slot = 0.92 / N;
        const fadeIn = slot * 0.55;
        const hold = slot * 0.20;
        const fadeOut = slot * 0.25;

        phraseEls.forEach((el, i) => {
          const chars = el.querySelectorAll<HTMLElement>(".hero-char");
          if (!chars.length) return;
          // Each char starts transparent + blue. A wave of opacity reveals
          // chars in blue, and a longer trailing wave eases their color
          // to white — Terminal-style soft shimmer.
          gsap.set(chars, { color: BLUE });
          const start = 0.04 + i * slot;
          // Wave 1 (opacity 0 → 1, still blue): each char eases in
          // smoothly, with a generous overlap between neighbours.
          const stagIn = (fadeIn * 0.5) / chars.length;
          tl.to(
            chars,
            {
              opacity: 1,
              ease: "power2.out",
              duration: stagIn * 8,
              stagger: { each: stagIn, from: "start" },
            },
            start,
          );
          // Wave 2 (color blue → white): trails the opacity wave with an
          // even longer per-char duration so the blue tint lingers, then
          // softly resolves to white.
          const stagColor = (fadeIn * 0.5) / chars.length;
          tl.to(
            chars,
            {
              color: "#ffffff",
              ease: "power3.out",
              duration: stagColor * 14,
              stagger: { each: stagColor, from: "start" },
            },
            start + stagIn * 3,
          );
          if (i < N - 1) {
            const stagOut = fadeOut / chars.length;
            tl.to(
              chars,
              {
                opacity: 0,
                ease: "power2.in",
                duration: stagOut * 4,
                stagger: { each: stagOut, from: "start" },
              },
              start + fadeIn + hold,
            );
          }
        });
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

  /* ── STICKY STEPS: status updates + per-character blue→white wave on
     each step's h2, scrubbed to the step's scroll progress (mirrors the
     hero phrase reveal). ─────────────────────────────────────────────── */
  useEffect(() => {
    registerGsapPlugins();
    const root = stickyStepsRef.current;
    if (!root) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-sticky-steps-item]"),
    );
    if (!items.length) return;

    // Split each h2 into per-character spans, word-by-word so words
    // never break mid-line.
    items.forEach((item) => {
      const h2 = item.querySelector<HTMLHeadingElement>("[data-step-h2]");
      if (!h2) return;
      const original = h2.dataset.original ?? h2.textContent ?? "";
      h2.dataset.original = original;
      h2.innerHTML = "";
      original.split(" ").forEach((word, wi, words) => {
        if (word.length) {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";
          word.split("").forEach((ch) => {
            const span = document.createElement("span");
            span.className = "sticky-steps__char";
            span.textContent = ch;
            wordSpan.appendChild(span);
          });
          h2.appendChild(wordSpan);
        }
        if (wi < words.length - 1) {
          h2.appendChild(document.createTextNode(" "));
        }
      });
    });

    const ctx = gsap.context(() => {
      // Activate-on-trigger: chars sit in muted grey by default; when
      // a step becomes active its chars play a blue → ink wave (and
      // its image reveals via a clip-path inset, ported from Osmo's
      // Sticky Features pattern). When the step leaves the active
      // slot, chars ease back to grey and the image collapses again.
      const GREY = "#a8adb8";
      const INK = "#001f4d";

      const playWave = (item: HTMLElement) => {
        const chars = Array.from(
          item.querySelectorAll<HTMLElement>(".sticky-steps__char"),
        );
        if (!chars.length) return;
        gsap.killTweensOf(chars);
        const stagIn = 0.5 / chars.length;
        const tl = gsap.timeline();
        // Wave 1: each char ticks instantly to blue (the leading edge
        // of the sweep).
        tl.to(
          chars,
          {
            color: BLUE,
            duration: 0.001,
            ease: "none",
            stagger: { each: stagIn, from: "start" },
          },
          0,
        );
        // Wave 2: each char settles to ink, lagging behind the blue
        // wave so a coloured tail trails across the line.
        tl.to(
          chars,
          {
            color: INK,
            duration: stagIn * 14,
            ease: "power3.out",
            stagger: { each: stagIn, from: "start" },
          },
          stagIn * 4,
        );
      };

      const resetGrey = (item: HTMLElement) => {
        const chars = Array.from(
          item.querySelectorAll<HTMLElement>(".sticky-steps__char"),
        );
        if (!chars.length) return;
        gsap.killTweensOf(chars);
        gsap.to(chars, {
          color: GREY,
          duration: 0.4,
          ease: "power2.out",
        });
      };

/* clip-path collapse/reveal removed — the canvas video stays
         present at all times; only the per-step h2 char-wave plays
         on step entry. */

      // Status updates per step: flip data-sticky-steps-item-status to
      // before/active/after as each anchor crosses the viewport centre.
      const setActiveStep = (activeIndex: number) => {
        items.forEach((item, index) => {
          let status = "active";
          if (index < activeIndex) status = "before";
          if (index > activeIndex) status = "after";
          item.setAttribute("data-sticky-steps-item-status", status);
        });
      };

      items.forEach((item, index) => {
        const anchor = item.querySelector<HTMLElement>(
          "[data-sticky-steps-anchor]",
        );
        if (!anchor) return;
        ScrollTrigger.create({
          trigger: anchor,
          start: "center center",
          onEnter: () => {
            setActiveStep(index);
            playWave(item);
          },
          onEnterBack: () => {
            setActiveStep(index);
            playWave(item);
          },
          onLeave: () => {
            resetGrey(item);
          },
          onLeaveBack: () => {
            resetGrey(item);
          },
        });
      });

      // Initial: first item is active, but we don't auto-fire the wave —
      // the trigger will fire onEnter when the user scrolls into section.
      setActiveStep(0);
    });

    return () => ctx.revert();
  }, []);

  /* ── SERVICES VIDEO: scroll-tied playback. Frame index 0 maps to
     the top of the sticky-steps section, frame N-1 to the bottom —
     so as the user scrolls through the services, the Services Video
     plays through in sync. Every step's canvas draws the same shared
     frame; clip-path stays uncollapsed so the visual is always
     present on screen. ─── */
  useEffect(() => {
    registerGsapPlugins();
    const rootEl = stickyStepsRef.current;
    if (!rootEl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = FRAMES_SERVICES.count;
    const images: HTMLImageElement[] = [];
    let lastDrawn = -1;

    const fitCanvas = (canvas: HTMLCanvasElement) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };

    const drawTo = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const c = canvas.getContext("2d");
      if (!c) return;
      const cw = canvas.width;
      const ch = canvas.height;
      if (!cw || !ch || !img.naturalWidth) return;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      c.clearRect(0, 0, cw, ch);
      c.drawImage(img, dx, dy, dw, dh);
    };

    const draw = (idx: number) => {
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
      // Draw to every per-step canvas (desktop) AND the single mobile
      // canvas — both stay in sync from the same frame index.
      servicesCanvasRefs.current.forEach((canvas) => {
        if (canvas) drawTo(canvas, img);
      });
      if (mobileCanvasRef.current) drawTo(mobileCanvasRef.current, img);
      lastDrawn = idx;
    };

    const fitAll = () => {
      servicesCanvasRefs.current.forEach((c) => c && fitCanvas(c));
      if (mobileCanvasRef.current) fitCanvas(mobileCanvasRef.current);
      if (lastDrawn >= 0) draw(lastDrawn);
    };
    fitAll();

    for (let i = 0; i < N; i++) {
      const img = new window.Image();
      img.src = FRAMES_SERVICES.path(i);
      img.onload = () => {
        if (lastDrawn < 0) draw(0);
        else if (i === lastDrawn) draw(i);
      };
      images.push(img);
    }

    const onResize = () => fitAll();
    window.addEventListener("resize", onResize);

    // Mobile sticky panel — swap eyebrow + h2 + p contents as the
    // scroll progress crosses each service segment boundary. The
    // canvas continues to scrub through frames; only text changes.
    const eyebrowEl = mobileEyebrowRef.current;
    const h2El = mobileH2Ref.current;
    const pEl = mobilePRef.current;
    const totalSteps = stickySteps.length;
    let currentIdx = 0;
    const swapTo = (idx: number) => {
      if (idx === currentIdx) return;
      currentIdx = idx;
      const step = stickySteps[idx];
      if (!step || !eyebrowEl || !h2El || !pEl) return;
      // Fade-out current, swap content, fade-in.
      gsap.to([eyebrowEl, h2El, pEl], {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          eyebrowEl.textContent = step.eyebrow;
          h2El.textContent = step.h2;
          pEl.textContent = step.p;
          gsap.fromTo(
            [eyebrowEl, h2El, pEl],
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power3.out",
              stagger: 0.06,
            },
          );
        },
      });
    };

    const mobileWrapper = mobileStepsWrapperRef.current;
    let mobileTrigger: ScrollTrigger | null = null;
    if (mobileWrapper) {
      mobileTrigger = ScrollTrigger.create({
        trigger: mobileWrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.min(
            totalSteps - 1,
            Math.floor(self.progress * totalSteps),
          );
          swapTo(idx);
        },
      });
    }

    // GSAP timeline + scrub catch-up: frame index lerps toward the
    // scroll position with a 2.5s catch-up, so quick scrolls smear
    // smoothly over a few seconds of soft frame advance instead of
    // jumping. Strictly scroll-driven — when scroll stops, the index
    // gradually settles to the target frame and stays put.
    const ctx = gsap.context(() => {
      const scrubObj = { f: 0 };
      gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 2.5,
        },
      }).to(scrubObj, {
        f: N - 1,
        ease: "none",
        duration: 1,
        onUpdate: () => {
          const idx = Math.min(N - 1, Math.max(0, Math.round(scrubObj.f)));
          if (idx !== lastDrawn) draw(idx);
        },
      });
    });

    return () => {
      window.removeEventListener("resize", onResize);
      if (mobileTrigger) mobileTrigger.kill();
      ctx.revert();
    };
  }, []);

  /* ── CTA BEAT: long phrase types in with a blue→ink char wave →
     scatters upward with random rotation → GOAT® brand mark waves in
     with its own blue→ink color settle → CTA pill rises. All tied to
     a single scroll-scrub timeline over the section's sticky-pin. ── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = morphWrapperRef.current;
    const eyebrowEl = morphEyebrowRef.current;
    const headlineEl = morphHeadlineRef.current;
    const shortEl = morphShortRef.current;
    const ctaEl = morphCtaRef.current;
    if (!wrapperEl || !eyebrowEl || !headlineEl || !shortEl || !ctaEl) return;

    const BLUE_LOCAL = "#0066ff";
    const INK_LOCAL = "#001f4d";

    /* Split a text element into per-character spans grouped by word.
       Words use white-space: nowrap so they never break mid-letter; a
       text node between words preserves natural wrapping points. */
    const splitChars = (el: HTMLElement): HTMLElement[] => {
      const original = el.dataset.original ?? el.textContent ?? "";
      el.dataset.original = original;
      el.innerHTML = "";
      const chars: HTMLElement[] = [];
      original.split(" ").forEach((word, wi, words) => {
        if (word.length) {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";
          word.split("").forEach((ch) => {
            const span = document.createElement("span");
            span.style.display = "inline-block";
            span.style.willChange = "transform, opacity";
            span.textContent = ch;
            wordSpan.appendChild(span);
            chars.push(span);
          });
          el.appendChild(wordSpan);
        }
        if (wi < words.length - 1) {
          el.appendChild(document.createTextNode(" "));
        }
      });
      return chars;
    };

    const longChars = splitChars(headlineEl);
    const shortChars = splitChars(shortEl);

    // Deterministic pseudo-random per char so dissolve angles are stable
    // across re-renders (avoids hydration mismatches and frame jitter).
    const seededRot = (i: number) =>
      ((Math.sin(i * 7.31) + 1) / 2) * 30 - 15; // -15° … +15°

    const ctx = gsap.context(() => {
      gsap.set(eyebrowEl, { opacity: 0, y: 20 });
      gsap.set(ctaEl, { opacity: 0, y: 30 });
      gsap.set(longChars, {
        opacity: 0,
        y: 18,
        color: BLUE_LOCAL,
      });
      gsap.set(shortChars, {
        opacity: 0,
        y: 28,
        scale: 0.7,
        color: BLUE_LOCAL,
      });

      // Scroll-scrub timeline — runs over the FIRST 100vh of the
      // section's 300vh pin range (1/3 of the total pinned scroll).
      // After scrub completes, the timeline freezes at its final
      // frame and the section stays pinned for another 200vh as the
      // user keeps scrolling, then the Steps card slides over.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "+=100%", // = 100vh of scroll = 1/3 of the 300vh pin
          scrub: 0.4,
        },
      });

      const easeOut = "power2.out";
      const easeIn = "power2.in";

      // 1. Eyebrow + headline char-wave in (blue→ink), staggered L→R.
      tl.to(eyebrowEl, { opacity: 1, y: 0, ease: easeOut, duration: 0.06 }, 0.00);
      tl.to(
        longChars,
        {
          opacity: 1,
          y: 0,
          ease: easeOut,
          duration: 0.15,
          stagger: { each: 0.004, from: "start" },
        },
        0.04,
      );
      tl.to(
        longChars,
        {
          color: INK_LOCAL,
          ease: "power3.out",
          duration: 0.15,
          stagger: { each: 0.004, from: "start" },
        },
        0.08,
      );

      // 2. Hold — headline fully visible while the user keeps scrolling.
      // 3. Scatter — chars drift up + recolour to blue and clear OUT
      //    completely before GOAT begins entering.
      longChars.forEach((ch, i) => {
        tl.to(
          ch,
          {
            opacity: 0,
            y: -42,
            rotation: seededRot(i),
            color: BLUE_LOCAL,
            ease: easeIn,
            duration: 0.10,
          },
          0.38 + i * 0.003,
        );
      });

      // 4. GOAT® chars surge in from below — only AFTER the headline
      //    has finished scattering, so the two never share opacity.
      tl.to(
        shortChars,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "back.out(1.4)",
          duration: 0.20,
          stagger: { each: 0.025, from: "start" },
        },
        0.60,
      );
      tl.to(
        shortChars,
        {
          color: INK_LOCAL,
          ease: "power3.out",
          duration: 0.20,
          stagger: { each: 0.025, from: "start" },
        },
        0.66,
      );

      // 5. GOAT® settles slightly smaller + up to make room for the CTA
      //    pill, which rises into the cleared space.
      tl.to(
        shortEl,
        { scale: 0.86, yPercent: -8, ease: "power2.inOut", duration: 0.14 },
        0.84,
      );
      tl.to(
        ctaEl,
        { opacity: 1, y: 0, ease: easeOut, duration: 0.14 },
        0.88,
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── CTA MAGIC RINGS: fade in when the section's sticky pin starts
     (top of wrapper hits viewport top), fade back out on scroll-up
     past that point. The rings WebGL stays mounted continuously
     (rAF runs internally) but is invisible outside the section so
     the animation doesn't "spoil" before the user arrives. ───── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = morphWrapperRef.current;
    const ringsEl = morphRingsRef.current;
    if (!wrapperEl || !ringsEl) return;

    const ctx = gsap.context(() => {
      gsap.set(ringsEl, { opacity: 0 });
      gsap.to(ringsEl, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          toggleActions: "play none none reverse",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ── STEPS CARD CORNER FLATTEN: the Steps section rises from below
     CTA with rounded top corners (visible "card edge"). Once the
     section's top reaches viewport top and sticky-pins, the corners
     should disappear so it reads as a full-bleed section — no more
     visible "card" framing. Scrub border-radius 40 → 0 across the
     rise-up scroll range. */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = benefitsWrapperRef.current;
    if (!wrapperEl) return;
    const sectionEl = wrapperEl.querySelector<HTMLElement>("section");
    if (!sectionEl) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionEl,
        { borderTopLeftRadius: "2.5em", borderTopRightRadius: "2.5em" },
        {
          borderTopLeftRadius: "0em",
          borderTopRightRadius: "0em",
          ease: "none",
          scrollTrigger: {
            trigger: wrapperEl,
            start: "top bottom",
            end: "top top",
            scrub: 0.3,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── STEPS BLOCK: clean cross-fade between steps — replaces the
     prior "sliding-card cascade" pattern. The image gets a subtle
     ken-burns settle (scale 1.06 → 1.0) as it fades in, the text
     stack swaps via opacity + slight y-rise, and the step number
     ticks on a horizontal blue accent bar that grows beneath the
     title for the active step. All scroll-tied with light scrub
     so transitions feel intentional, not jerky. ─────────────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = benefitsWrapperRef.current;
    if (!wrapperEl) return;
    const images = benefitImageRefs.current.filter(Boolean);
    const texts = benefitTextRefs.current.filter(Boolean);
    if (images.length !== benefits.length || texts.length !== benefits.length)
      return;

    /* Split each step's title h3 into per-character spans so we can
       stagger-reveal them as a char wave on step entry. Idempotent —
       data-original preserves source text so subsequent runs don't
       chain-split. */
    const splitH3Chars = (el: HTMLElement): HTMLElement[] => {
      const original = el.dataset.original ?? el.textContent ?? "";
      el.dataset.original = original;
      el.innerHTML = "";
      const chars: HTMLElement[] = [];
      original.split(" ").forEach((word, wi, words) => {
        if (word.length) {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";
          word.split("").forEach((ch) => {
            const span = document.createElement("span");
            span.style.display = "inline-block";
            span.style.willChange = "transform, opacity";
            span.textContent = ch;
            wordSpan.appendChild(span);
            chars.push(span);
          });
          el.appendChild(wordSpan);
        }
        if (wi < words.length - 1) {
          el.appendChild(document.createTextNode(" "));
        }
      });
      return chars;
    };

    const titleChars: HTMLElement[][] = texts.map((el) => {
      const h3 = el.querySelector<HTMLElement>("h3");
      return h3 ? splitH3Chars(h3) : [];
    });

    const ctx = gsap.context(() => {
      // Initial state — first image at rest, others stacked off-screen
      // right (card-deal pattern). Z-index ascends so newer cards
      // overlay older ones on top.
      images.forEach((el, i) => {
        gsap.set(el, {
          xPercent: i === 0 ? 0 : 100,
          zIndex: i + 1,
        });
      });
      texts.forEach((el, i) => {
        // Text containers themselves are NOT slid — instead inner
        // elements (eyebrow, title chars, body, bar) animate
        // individually. zIndex still ascending so active step is on
        // top for clip/clickability.
        gsap.set(el, {
          autoAlpha: i === 0 ? 1 : 0,
          zIndex: i + 1,
        });
        const eyebrow = el.querySelector<HTMLElement>("[data-step-label]") ?? el.querySelector<HTMLElement>(".font-mono");
        const body = el.querySelector<HTMLElement>("p");
        const bar = el.querySelector<HTMLElement>("[data-step-bar]");
        if (eyebrow) gsap.set(eyebrow, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 14 });
        if (body) gsap.set(body, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 18 });
        if (bar) gsap.set(bar, { scaleX: i === 0 ? 1 : 0, transformOrigin: "left center" });
        if (titleChars[i]?.length) {
          gsap.set(titleChars[i], {
            autoAlpha: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 14,
          });
        }
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2, // smoother catch-up than 0.6 → buttery transitions
          invalidateOnRefresh: true,
        },
      });

      // First step's title chars wave in on initial entry so the very
      // first step reveals with the same animation as subsequent ones.
      const firstEyebrow = texts[0].querySelector<HTMLElement>(".font-mono");
      const firstBody = texts[0].querySelector<HTMLElement>("p");
      const firstBar = texts[0].querySelector<HTMLElement>("[data-step-bar]");
      if (firstEyebrow) {
        gsap.set(firstEyebrow, { autoAlpha: 0, y: 14 });
        tl.to(firstEyebrow, { autoAlpha: 1, y: 0, duration: 0.25 }, 0);
      }
      if (titleChars[0]?.length) {
        gsap.set(titleChars[0], { autoAlpha: 0, y: 14 });
        tl.to(
          titleChars[0],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: { each: 0.018, from: "start" },
            ease: "power3.out",
          },
          0.05,
        );
      }
      if (firstBody) {
        gsap.set(firstBody, { autoAlpha: 0, y: 18 });
        tl.to(firstBody, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.25);
      }
      if (firstBar) {
        gsap.set(firstBar, { scaleX: 0 });
        tl.to(firstBar, { scaleX: 1, duration: 0.4 }, 0.30);
      }

      for (let i = 1; i < benefits.length; i++) {
        const pos = i - 1;
        const outEyebrow = texts[i - 1].querySelector<HTMLElement>(".font-mono");
        const inEyebrow = texts[i].querySelector<HTMLElement>(".font-mono");
        const outBody = texts[i - 1].querySelector<HTMLElement>("p");
        const inBody = texts[i].querySelector<HTMLElement>("p");
        const outBar = texts[i - 1].querySelector<HTMLElement>("[data-step-bar]");
        const inBar = texts[i].querySelector<HTMLElement>("[data-step-bar]");

        // ── IMAGE — slides in from right, longer + smoother than
        //    before (0.85 → 1.4, power3 → power4.inOut). The slow
        //    glide makes the card-deal feel cinematic. ───────────
        tl.fromTo(
          images[i],
          { xPercent: 100 },
          { xPercent: 0, duration: 1.4, ease: "power4.inOut" },
          pos + 0.50,
        );

        // ── TEXT exit — per-element fade-out + slight upward drift.
        //    All elements lift together so the block clears decisively.
        if (outEyebrow)
          tl.to(outEyebrow, { autoAlpha: 0, y: -10, duration: 0.30, ease: "power2.in" }, pos + 0.50);
        if (titleChars[i - 1]?.length)
          tl.to(
            titleChars[i - 1],
            {
              autoAlpha: 0,
              y: -10,
              duration: 0.25,
              stagger: { each: 0.012, from: "start" },
              ease: "power2.in",
            },
            pos + 0.50,
          );
        if (outBody)
          tl.to(outBody, { autoAlpha: 0, y: -14, duration: 0.30, ease: "power2.in" }, pos + 0.52);
        if (outBar)
          tl.to(
            outBar,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.30,
              ease: "power2.in",
            },
            pos + 0.50,
          );
        // Outgoing text container — hide via autoAlpha so its
        // inner children don't bleed through during incoming.
        tl.to(texts[i - 1], { autoAlpha: 0, duration: 0.01 }, pos + 0.80);
        tl.set(texts[i], { autoAlpha: 1 }, pos + 0.80);

        // ── TEXT enter — eyebrow + title chars (stagger) + body +
        //    accent bar each fade-up sequentially.
        if (inEyebrow)
          tl.fromTo(
            inEyebrow,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.30 },
            pos + 0.82,
          );
        if (titleChars[i]?.length)
          tl.fromTo(
            titleChars[i],
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.40,
              stagger: { each: 0.018, from: "start" },
              ease: "power3.out",
            },
            pos + 0.86,
          );
        if (inBody)
          tl.fromTo(
            inBody,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.35 },
            pos + 1.00,
          );
        if (inBar)
          tl.fromTo(
            inBar,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.40 },
            pos + 1.05,
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
        data-hero-region=""
        className="relative w-full"
        style={{ height: "500vh" }}
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
            className="relative h-full max-w-[1408px] mx-auto px-6 lg:px-12 flex items-end justify-center text-center pt-[120px] pb-2 lg:pb-3"
          >
            <div className="grid w-full max-w-[1280px]">
              {heroPhrases.map((phrase, i) => (
                <h1
                  key={i}
                  data-hero-phrase
                  style={{ gridArea: "1 / 1" }}
                  className="font-sans font-normal text-[58px] sm:text-[72px] lg:text-[120px] leading-[0.95] tracking-[-1.4px] sm:tracking-[-2px] lg:tracking-[-3.6px] text-white"
                >
                  {phrase}
                </h1>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── 2. STICKY STEPS — desktop: per-item Osmo Supply pattern
         with char-wave on h2; mobile: single sticky panel with
         scroll-driven text-swap + shared canvas. ──────────────── */}
      <section ref={stickyStepsRef} className="sticky-steps">
        {/* DESKTOP variant (≥992px) — hidden on mobile. */}
        <div className="sticky-steps__container hidden lg:block">
          <div data-sticky-steps-init className="sticky-steps__collection">
            <div className="sticky-steps__list">
              {stickySteps.map((step, i) => (
                <div
                  key={i}
                  data-sticky-steps-item=""
                  data-sticky-steps-item-status={i === 0 ? "active" : "after"}
                  className="sticky-steps__item"
                >
                  <div data-sticky-steps-anchor className="sticky-steps__text">
                    <span className="sticky-steps__eyebrow">{step.eyebrow}</span>
                    <h2 data-step-h2 className="sticky-steps__h2">
                      {step.h2}
                    </h2>
                    <p className="sticky-steps__p">{step.p}</p>
                  </div>
                  <div className="sticky-steps__media">
                    <div className="sticky-steps__sticky">
                      <div className="sticky-steps__visual">
                        <canvas
                          ref={(el) => {
                            servicesCanvasRefs.current[i] = el;
                          }}
                          className="sticky-steps__cover-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE variant (≤991px) — one sticky panel: text above,
           canvas below. As the user scrolls through the section's
           5-segment scroll budget, the text content swaps with a
           fade animation; the canvas stays in place and scrubs
           through the services video. */}
        <div
          ref={mobileStepsWrapperRef}
          className="sticky-steps__mobile lg:hidden"
          style={{ position: "relative", height: `${stickySteps.length * 100}vh` }}
        >
          <div
            className="sticky-steps__mobile-pin"
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              padding: "92px 24px 88px",
              boxSizing: "border-box",
              gap: "16px",
            }}
          >
            <div
              className="sticky-steps__mobile-text"
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <span
                ref={mobileEyebrowRef}
                className="sticky-steps__eyebrow"
                style={{ display: "inline-block", willChange: "opacity, transform" }}
              >
                {stickySteps[0].eyebrow}
              </span>
              <h2
                ref={mobileH2Ref}
                className="sticky-steps__h2"
                style={{ willChange: "opacity, transform" }}
              >
                {stickySteps[0].h2}
              </h2>
              <p
                ref={mobilePRef}
                className="sticky-steps__p"
                style={{ willChange: "opacity, transform" }}
              >
                {stickySteps[0].p}
              </p>
            </div>
            <div
              style={{
                flex: 1,
                position: "relative",
                borderRadius: "1.25em",
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0, 31, 77, 0.15)",
                minHeight: "32vh",
              }}
            >
              <canvas
                ref={(el) => {
                  mobileCanvasRef.current = el;
                }}
                className="sticky-steps__cover-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CTA BEAT — quiet statement + microcopy + outline pill,
         scroll-tied entrance. Replaces the prior "Greatest of All
         Time. → GOAT®" morph. The wrapper is 200vh sticky-pinned so
         the moment lands and holds before scroll continues. The grid
         backdrop carries over from the morph for visual continuity
         with the surrounding white sections. ─────────────────── */}
      <div
        ref={morphWrapperRef}
        className="relative bg-[#ffffff]"
        /* 400vh: gives the scrub-text animation room (first ~100vh of
           pin) plus a long hold (next ~100vh) before Steps starts to
           overlay during the final ~100vh of pin. Section sticky-pin
           range = wrapper_height - viewport = 300vh of scroll. */
        style={{ height: "400vh" }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* MagicRings WebGL backdrop — animated glowing rings in
             brand colours, subtle to keep the headline+CTA readable.
             Opacity is GSAP-controlled: stays at 0 until the section
             pins (sticky `top top`), then fades in. So the rings
             only animate when the user has reached the CTA, not while
             the section is still below the viewport. */}
          <div
            ref={morphRingsRef}
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <MagicRings
              color="#0066ff"
              colorTwo="#3380ff"
              /* Mobile tweaks: baseRadius bumped to 0.7 so the inner-
                 most ring lands OUTSIDE the headline + microcopy
                 stack — wave outlines no longer cross the text on
                 narrow viewports. Desktop params (ringCount 5,
                 baseRadius 0.65, etc.) intentionally untouched. */
              ringCount={isMobileView ? 7 : 5}
              speed={0.7}
              attenuation={isMobileView ? 8 : 10}
              lineThickness={isMobileView ? 3 : 2.2}
              baseRadius={isMobileView ? 0.7 : 0.65}
              radiusStep={isMobileView ? 0.1 : 0.12}
              scaleRate={0.1}
              opacity={isMobileView ? 0.75 : 0.5}
              blur={0}
              noiseAmount={0.03}
              rotation={0}
              ringGap={1.5}
              fadeIn={0.7}
              fadeOut={0.5}
              followMouse={false}
              parallax={0.05}
              clickBurst={false}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none">
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
            <span
              ref={morphEyebrowRef}
              className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55"
              style={{ willChange: "transform, opacity" }}
            >
              Ready when you are
            </span>
            {/* Headline + GOAT mark share the same centred slot. The
               h2 sits in-flow and defines the box height; the GOAT
               span overlays absolutely so the morph cross-fades on
               the same line. Both are JS-split into per-character
               spans on mount for the wave animations. */}
            <div className="relative w-full flex items-center justify-center">
              <h2
                ref={morphHeadlineRef}
                className="font-sans font-normal text-[40px] sm:text-[64px] lg:text-[112px] leading-[0.96] tracking-[-1.4px] lg:tracking-[-3.4px] text-[#001f4d] max-w-[1100px]"
              >
                Make the next move the easy one.
              </h2>
              <span
                ref={morphShortRef}
                aria-hidden
                className="absolute font-sans font-normal text-[120px] sm:text-[200px] lg:text-[320px] leading-none tracking-[-4px] lg:tracking-[-12px] text-[#001f4d] inline-block"
              >
                GOAT®
              </span>
            </div>
            {/* Accent CTA: solid brand-blue split-pill. Filled body
               with white text + white circular arrow nub. Hover lifts
               + brightens, arrow slides right. Drops shadow so it
               pops off the MagicRings backdrop. */}
            <button
              ref={morphCtaRef}
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-quote-modal"))
              }
              style={{ willChange: "transform, opacity" }}
              className="mp5-morph-cta group inline-flex items-center gap-3 lg:gap-5 rounded-full bg-[#0066ff] pl-6 lg:pl-8 pr-1.5 lg:pr-2 py-1.5 lg:py-2 cursor-pointer transition-[transform,background-color] duration-300 ease-out hover:bg-[#0052cc] hover:-translate-y-[2px] mt-2 lg:mt-4"
            >
              <span
                className="font-sans font-medium text-[16px] lg:text-[20px] leading-none tracking-[-0.4px]"
                style={{ color: "#ffffff" }}
              >
                Get a free quote
              </span>
              <span
                className="shrink-0 inline-flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-full transition-transform duration-300 ease-out group-hover:scale-110"
                style={{ backgroundColor: "#ffffff" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-[2px]"
                  style={{ color: "#0066ff" }}
                  aria-hidden
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* ── 5. STEPS BLOCK — slides up over the preceding CTA as the
         user scrolls into it (negative top margin pulls the start
         under the CTA's sticky end). Rounded top corners give it
         a "card lifting up" feel. Inside: image cross-fade with
         ken-burns + text slide-replace + blue accent bar. ───── */}
      <div
        ref={benefitsWrapperRef}
        className="relative z-[5]"
        style={{
          height: `${benefits.length * 100}vh`,
          /* -200vh aligns Steps' sticky-pin start with the LAST 100vh
             of CTA's 300vh pin range. Steps slides over CTA during
             the final third of CTA's pin — after the text animation
             has played AND a long hold period. */
          marginTop: "-200vh",
        }}
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden bg-[#ffffff] grid grid-rows-[1fr_auto] rounded-t-[2.5em]">
          {/* Image stack — opacity cross-fade with ken-burns settle */}
          <div className="relative w-full overflow-hidden">
            {benefits.map((b, i) => (
              <div
                key={`img-${b.label}`}
                ref={(el) => {
                  if (el) benefitImageRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ willChange: "opacity, transform" }}
              >
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
            ))}
          </div>

          {/* Text stack — same independent slide-from-above */}
          <div className="relative w-full overflow-hidden bg-[#ffffff]">
            {/* Reserve height by rendering one card statically, then
                stack the absolute layers on top. */}
            <div className="invisible">
              <div className="max-w-[1408px] mx-auto px-6 lg:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[2px]">
                    {benefits[0].label}
                  </span>
                  <h3 className="font-sans font-normal text-[22px] lg:text-[32px] leading-[1.1] tracking-[-0.6px] lg:tracking-[-1px]">
                    {benefits[0].title}
                  </h3>
                  <span className="block h-[2px] w-16 bg-[#0066ff]" />
                </div>
                <p className="lg:col-span-8 font-sans text-base lg:text-lg leading-[1.5] tracking-[-0.3px] max-w-[760px]">
                  {benefits[0].body}
                </p>
              </div>
            </div>
            {benefits.map((b, i) => (
              <div
                key={`text-${b.label}`}
                ref={(el) => {
                  if (el) benefitTextRefs.current[i] = el;
                }}
                /* No per-card bg-white — was producing a flash during
                   the cross-fade as outgoing card faded to show parent
                   white behind it. Parent already has bg-white. */
                className="absolute inset-0"
                style={{ willChange: "opacity, transform" }}
              >
                <div className="max-w-[1408px] mx-auto px-6 lg:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#001f4d]/55">
                      {b.label}
                    </span>
                    <h3 className="font-sans font-normal text-[22px] lg:text-[32px] leading-[1.1] tracking-[-0.6px] lg:tracking-[-1px] text-[#001f4d]">
                      {b.title}
                    </h3>
                    {/* Blue accent bar — GSAP scales it from 0 → 1
                       (left origin) as this step becomes active. */}
                    <span
                      data-step-bar
                      aria-hidden
                      className="block h-[2px] w-16 bg-[#0066ff]"
                    />
                  </div>
                  <p className="lg:col-span-8 font-sans text-base lg:text-lg leading-[1.5] tracking-[-0.3px] text-[#001f4d]/70 max-w-[760px]">
                    {b.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── 6. MARQUEE — full-bleed horizontal scrolling band on white
         (with subtle grid backdrop matching the morph), ink mono caps with
         blue diamond separators; continuous loop. ──────────────── */}
      <section className="relative bg-[#ffffff] py-[60px] lg:py-[100px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg
            aria-hidden
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1440 900"
          >
            <defs>
              <pattern
                id="grid-marquee"
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
            <rect width="1440" height="900" fill="url(#grid-marquee)" />
          </svg>
        </div>
        <div className="relative marquee-track inline-flex items-center gap-10 lg:gap-16 whitespace-nowrap will-change-transform">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1 ? true : undefined}
              className="inline-flex items-center gap-10 lg:gap-16"
            >
              {[
                "USDOT #4232069",
                "Licensed in OR & WA",
                "3,000+ moves",
                "850+ five-star reviews",
                "Zero hidden fees",
                "Same-day quotes",
              ].map((item, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="inline-flex items-center gap-10 lg:gap-16"
                >
                  <span
                    className="font-mono uppercase text-[44px] sm:text-[68px] lg:text-[112px] leading-none tracking-[-1px]"
                    style={{ color: INK }}
                  >
                    {item}
                  </span>
                  <span
                    aria-hidden
                    className="text-[28px] lg:text-[56px] leading-none"
                    style={{ color: BLUE }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </div>
          ))}
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
          <blockquote
            style={{ color: "#ffffff" }}
            className="font-sans font-normal text-[26px] sm:text-[36px] lg:text-[56px] leading-[1.18] tracking-[-0.8px] lg:tracking-[-1.8px] max-w-[1000px]"
          >
            &ldquo;We have not seen this kind of accuracy with crew dispatch
            technology — this is a significant milestone in the race to modernize
            the moving industry.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-1">
            <span
              style={{ color: "#ffffff" }}
              className="font-sans font-normal text-base lg:text-lg"
            >
              Karen Jones
            </span>
            <span
              style={{ color: "rgba(255,255,255,0.65)" }}
              className="font-mono text-[11px] uppercase tracking-[2px]"
            >
              Operations Lead, Logistics Partner
            </span>
          </div>
        </div>
      </section>

      {/* Suppress unused-var warnings for the constants we keep around for
          future tweaks (PAPER, INK referenced in inline styles where needed). */}
      <span aria-hidden style={{ display: "none", color: PAPER, background: INK }} />
    </>
  );
}


