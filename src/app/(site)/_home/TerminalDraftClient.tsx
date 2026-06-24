"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type Ref } from "react";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@site/motion/gsap";
import { MP5Button } from "@site/ui/MP5Button";
import dynamic from "next/dynamic";
import { GridStreaks } from "./GridStreaks";
import { BenefitsVariantsStack } from "./sections/BenefitsVariants";
import { TestimonialVariantsStack } from "./sections/TestimonialVariants";
import { StickyServices } from "./StickyServices";
import { defaultStickySteps, type StickyStep } from "./stickyServicesData";

/* THREE.js is heavy and has exactly one consumer (MagicRings), used only
   in the CTA section below the fold — code-split it so the THREE chunk
   loads when the rings mount, not in the home's initial JS. Client-only
   (WebGL) so ssr:false. */
const MagicRings = dynamic(() => import("./MagicRings"), { ssr: false });

/* /mainpage-5 — terminal-industries.com-style draft.

   Color system mirrors Terminal's structure but rebranded blue: white paper,
   deep-navy ink (#000000), royal-blue accent (#0066ff) with white text on
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
    image: "/images/mp5-step-01.png",
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
/* Hero source = v.mov (1920×1080, 24fps, 18.6s) extracted to
   webp at fps=12 / scale 1280 → 222 frames (~9.4 MB), scrubbed by scroll
   (same frame-sequence mechanic as the print-foundry hero). */
/* Hero is now a single <video> (public/videos/hero.mp4, 1280×720 @ 24fps)
   scrubbed by scroll — see the hero effect below. Replaced the old
   222-webp canvas frame-sequence (main-thread decode + 222 requests +
   12fps). frame_0001.webp is kept only as the <video> poster. */

const heroPhrases = [
  "Your move, handled from the first box to the last.",
  "Licensed, bonded, and fully insured.",
  "Flat-rate quotes — no hidden fees, ever.",
  "Local, long-distance, and commercial moves.",
  "Careful crews who treat your home like their own.",
  "850+ five-star reviews across Oregon & Washington.",
  "Same-day quotes. On time, every time.",
  "GOAT Movers — the greatest way to move.",
];

/* Per-phrase placement — the text "wanders" to the open zone of the
   frame instead of sitting in one fixed spot (print-foundry style).
   The VIDEOHERO truck owns the centre + lower-middle of every frame,
   so phrases stay along the TOP band, the corners and the side edges
   and never sit over the lower-centre subject. Percentage insets so
   the same anchors hold on desktop + mobile; a couple of centred
   beats use translateX(-50%). */
type HeroPos = {
  top?: string; bottom?: string; left?: string; right?: string;
  transform?: string; textAlign: "left" | "right" | "center"; maxWidth: string;
};
const heroPhrasePositions: HeroPos[] = [
  /* 0 ≈0.11 — photoreal truck centre-right & low → top-left over the sky. */
  { top: "14%", left: "5%", textAlign: "left", maxWidth: "min(720px, 90vw)" },
  /* 1 ≈0.23 — truck centre-right, sun-flare upper-LEFT → top-right, clear of both. */
  { top: "14%", right: "5%", textAlign: "right", maxWidth: "min(740px, 90vw)" },
  /* 2 ≈0.34 — wireframe truck CENTRED & wide (owns the middle). Was sitting on
     its box; move to the open top band, left, kept above the truck roof. */
  { top: "13%", left: "5%", textAlign: "left", maxWidth: "min(900px, 66vw)" },
  /* 3 ≈0.46 — wireframe truck centred. Was lower-left over the cab/wheels →
     top band, right. */
  { top: "13%", right: "5%", textAlign: "right", maxWidth: "min(840px, 64vw)" },
  /* 4 ≈0.57 — wireframe truck centred (brightest). Was upper-right on the box
     → top band, left. */
  { top: "13%", left: "5%", textAlign: "left", maxWidth: "min(900px, 66vw)" },
  /* 5 ≈0.69 — flash (frame washes bright); bottom-left, the text-shadow carries it. */
  { bottom: "15%", left: "5%", textAlign: "left", maxWidth: "min(680px, 90vw)" },
  /* 6 ≈0.80 — map; pin + route own the centre-right. Top-left over the open
     grid, narrowed so it never reaches the pin. */
  { top: "12%", left: "5%", textAlign: "left", maxWidth: "min(540px, 40vw)" },
  /* 7 ≈0.92 — map climax; kept at the bottom, centred (the original spot —
     reads as the closing line under the route). */
  { bottom: "12%", left: "50%", transform: "translateX(-50%)", textAlign: "center", maxWidth: "min(1000px, 92vw)" },
];


/* Brand accent used by the hero char-wave (~L399). The morph + sticky-steps
   waves declare their own local INK/BLUE constants where needed. */
const BLUE = "#FFE533";

export function TerminalDraftClient({ services = defaultStickySteps }: { services?: StickyStep[] } = {}) {
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const introRefs = useRef<HTMLDivElement[]>([]);

  const missionHeadlineRef = useRef<HTMLHeadingElement>(null);


  /* Morph CTA: long phrase scatters char-by-char and reforms as the
     GOAT® brand mark, then a CTA pill rises. All tied to scroll-scrub
     so the beat lands during the section's sticky-pin window. */
  const morphWrapperRef = useRef<HTMLDivElement>(null);
  const morphEyebrowRef = useRef<HTMLSpanElement>(null);
  const morphHeadlineRef = useRef<HTMLHeadingElement>(null);
  const morphShortRef = useRef<HTMLSpanElement>(null);
  const morphCtaRef = useRef<HTMLButtonElement>(null);

  const benefitsWrapperRef = useRef<HTMLDivElement>(null);
  const benefitImageRefs = useRef<HTMLDivElement[]>([]);
  const benefitTextRefs = useRef<HTMLDivElement[]>([]);

  /* ── HERO: canvas frame-scrub + char-stagger headline reveal ─────────── */
  useEffect(() => {
    registerGsapPlugins();
    const wrapperEl = heroWrapperRef.current;
    const videoEl = videoRef.current;
    if (!wrapperEl || !videoEl) return;

    /* Pick the source by viewport — a lighter 960×540 file on phones, the
       1280×720 file on desktop. Chosen once at mount (cross-breakpoint
       reload acceptable). Set in JS rather than JSX so SSR and client
       agree on the src (a static mobile src would double-download on
       desktop and vice-versa). */
    const isMobile = window.matchMedia("(max-width: 991px)").matches;
    videoEl.src = isMobile ? "/videos/hero-mobile.mp4" : "/videos/hero.mp4";

    /* Hero is a native <video> scrubbed by scroll (was a canvas webp
       frame-sequence). Hardware-accelerated decode + one streamed file
       instead of 222 separate webp requests → smooth, no load lag. We
       never call play(); the scroll timeline drives `currentTime`. */
    let videoDuration = videoEl.duration || 0;
    const onMeta = () => { videoDuration = videoEl.duration || 0; };
    videoEl.addEventListener("loadedmetadata", onMeta);
    // Kick off buffering even though we never autoplay.
    try { videoEl.load(); } catch { /* ignore */ }

    /* Mobile horizontal focal point — keep the driver cab fully in frame
       through the whole truck, then re-centre for the map. The 16:9 clip
       plays: photoreal truck driving → wireframe truck on a grid → flash →
       map/navigation. In every truck frame the cab (front bumper included)
       sits LEFT of centre, so a centred object-cover crop on a portrait
       phone clips the cab nose. The crop only shows a ~26%-wide slice, so
       we hold it LEFT (object-position 28% → cab nose fully visible) for
       the entire truck, then ease to centre UNDER the flash so the map +
       route pin read centred:
         p<0.62   : hold 28% — whole cab in frame (photoreal AND wireframe)
         0.62–0.72: ease 28% → 50% under the flash (masks the swing)
         p>0.72   : 50% — map/navigation centred
       Desktop stays centred (the class default). Composition isn't moved —
       only the crop window. Breakpoint picked once at mount. */
    const applyFocal = (p: number) => {
      if (!isMobile) return;
      let x: number;
      if (p < 0.62) {
        x = 0.28; // hold left so the whole cab (nose included) stays in frame
      } else {
        const f = Math.min(1, Math.max(0, (p - 0.62) / (0.72 - 0.62)));
        x = 0.28 + 0.22 * f; // 28% → 50% over the flash
      }
      videoEl.style.objectPosition = `${x * 100}% 50%`;
    };
    applyFocal(0);

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
      // Un-hide the container now that we control its chars (each starts
      // opacity:0 below). CSS keeps phrases hidden until this runs so they
      // never flash-overlap before the scroll reveal initialises.
      el.style.opacity = "1";
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
      const vid = { t: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      // Scrub the video playhead across the pinned scroll. `vid.t` is a
      // normalised 0→1 progress mapped onto currentTime; the browser
      // decodes the needed frame on the GPU. Same timeline position/length
      // as the old frame tween, so the phrase reveals below stay in sync.
      tl.to(
        vid,
        {
          t: 1,
          ease: "none",
          duration: 1,
          onUpdate: () => {
            applyFocal(vid.t);
            if (!videoDuration || videoEl.readyState < 2) return;
            // Clamp just shy of the end — some browsers snap an exact
            // `duration` seek back to 0.
            videoEl.currentTime = Math.min(
              vid.t * videoDuration,
              videoDuration - 0.05,
            );
          },
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
      videoEl.removeEventListener("loadedmetadata", onMeta);
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

  /* ── MISSION HEADLINE: same grey → blue → white char-wave used by
     the sticky-steps h2's. Fires once when the headline enters the
     viewport. Splits text into per-character spans on mount. ────── */
  useEffect(() => {
    registerGsapPlugins();
    const h2 = missionHeadlineRef.current;
    if (!h2) return;

    /* Per-word, per-char split — same pattern as sticky-steps so
       words never break mid-line on narrow viewports. */
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
          span.className = "mp5-mission-char";
          span.textContent = ch;
          wordSpan.appendChild(span);
        });
        h2.appendChild(wordSpan);
      }
      if (wi < words.length - 1) {
        h2.appendChild(document.createTextNode(" "));
      }
    });

    const chars = Array.from(
      h2.querySelectorAll<HTMLElement>(".mp5-mission-char"),
    );
    if (!chars.length) return;

    /* Dark muted grey (was #a8adb8 — too light on dark page).
       Reads as "off" without disappearing entirely against #0c0c0c. */
    const GREY = "#3a3a42";
    const BLUE = "#FFE533";
    const WHITE = "#ffffff";

    /* Start at muted grey — wave is scrubbed to scroll progress. */
    gsap.set(chars, { color: GREY });

    const ctx = gsap.context(() => {
      /* Wave is mapped to a TIGHT scroll range so completion happens
         while the headline is still on-screen — not after the user
         has scrolled into the next section.
           start "top 80%": wave begins right as the headline enters
                            from below.
           end   "top 25%": wave completes when the headline reaches
                            ~25% from top — fully on-screen, mid-air.
         scrub 1 keeps the lag buttery without trailing into next sec. */
      const stagIn = 1 / chars.length;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: h2,
          start: "top 80%",
          end: "top 25%",
          scrub: 1,
        },
      });
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
      tl.to(
        chars,
        {
          color: WHITE,
          duration: stagIn * 10,
          ease: "power2.out",
          stagger: { each: stagIn, from: "start" },
        },
        stagIn * 3,
      );
    }, h2);

    return () => ctx.revert();
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

    const BLUE_LOCAL = "#FFE533";
    /* Dark theme: morph chars settle to WHITE (was INK on light theme). */
    const INK_LOCAL = "#ffffff";

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
  /* (MagicRings fade-in useEffect removed — rings WebGL was
     replaced by the GridPulses canvas, which is always visible
     and self-paced.) */

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
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            poster="/frames-vhero/frame_0001.webp"
            muted
            playsInline
            preload="auto"
            aria-hidden
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55 pointer-events-none"
          />
          <div
            ref={heroTextRef}
            className="absolute inset-0 px-6 lg:px-12 pointer-events-none"
          >
            {heroPhrases.map((phrase, i) => {
              /* Desktop: phrases "wander" to the open zone per frame
                 (positions below). Mobile: all phrases are re-anchored
                 to the bottom band via a CSS media query in accent.css
                 (`[data-hero-phrase]` @ max-width:991px) — done in CSS
                 not JS so it's correct on first paint regardless of
                 hydration / viewport-read timing. */
              const pos: HeroPos = heroPhrasePositions[i % heroPhrasePositions.length];
              return (
                <h1
                  key={i}
                  data-hero-phrase
                  style={{
                    position: "absolute",
                    top: pos.top,
                    bottom: pos.bottom,
                    left: pos.left,
                    right: pos.right,
                    transform: pos.transform,
                    textAlign: pos.textAlign,
                    maxWidth: pos.maxWidth,
                    textShadow:
                      "0 2px 24px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.6)",
                  }}
                  className="font-sans font-normal text-[clamp(29px,6.2vw,76px)] leading-[1.05] tracking-[-0.025em] text-white"
                >
                  {phrase}
                </h1>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── 1.5 MISSION — post-hero text beat, terminal-industries
         style: one short poetic statement, large type, centered with
         ample vertical breathing room. White on dark. */}
      <section className="relative w-full py-[160px] lg:py-[260px] overflow-hidden">
        <div className="max-w-[1408px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2
            ref={missionHeadlineRef}
            className="font-sans font-normal text-[min(3.25em,9.7vw)] lg:text-[80px] leading-[1.08] tracking-[-0.02em] lg:tracking-[-3px] max-w-[1100px] text-center text-balance"
          >
            {/* No non-breaking spaces — let text-wrap:balance pack
               even, full lines on mobile (a few balanced lines rather
               than ragged phrase-per-line breaks). */}
            {"Moving done right — same crew, same price, every box accounted for."}
          </h2>
        </div>
      </section>

      {/* ── 2. STICKY STEPS — desktop: per-item Osmo Supply pattern
         with char-wave on h2; mobile: single sticky panel with
         scroll-driven text-swap + shared canvas. ──────────────── */}
      <StickyServices steps={services} />

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
          {/* Static cell grid (canvas 2D) — provides the structural
              cell outlines that the MagicRings waves expand over. */}
          <GridStreaks className="mp5-morph-grid absolute inset-0 w-full h-full pointer-events-none" />
          {/* MagicRings WebGL — concentric expanding rings emanating
              from centre (the "wave" effect). Yellow brand tones,
              subtle opacity so headline + CTA stay readable.

              `mask-image` fades the rings to transparent within ~14%
              of the top/bottom edges so they dissolve into the page
              bg instead of being hard-clipped by the section's
              `overflow-hidden`. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            }}
          >
            {/* One centred emitter with a large radius: the ring's LEFT
                arc reads as "(" near the left edge and its RIGHT arc as ")"
                near the right edge, while the centre (ring hole) stays clear
                and the top/bottom are faded by the mask — two edge waves
                that curve toward their own edges, no visible full circle. */}
            <MagicRings
              color="#FFE533"
              colorTwo="#FFF788"
              ringCount={5}
              speed={0.7}
              attenuation={isMobileView ? 8 : 10}
              lineThickness={isMobileView ? 3 : 2.2}
              baseRadius={isMobileView ? 0.3 : 0.5}
              radiusStep={isMobileView ? 0.025 : 0.05}
              scaleRate={0.1}
              opacity={isMobileView ? 0.45 : 0.35}
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
          <div className="relative max-w-[1408px] mx-auto px-6 lg:px-12 flex flex-col items-center gap-6 lg:gap-10 text-center">
            <span
              ref={morphEyebrowRef}
              className="font-mono text-[11px] uppercase tracking-[2px] text-[#000000]/55"
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
                className="font-sans font-normal text-[40px] sm:text-[64px] lg:text-[112px] leading-[0.96] tracking-[-1.4px] lg:tracking-[-3.4px] text-[#000000] max-w-[1100px]"
              >
                Make the next move the easy one.
              </h2>
              <span
                ref={morphShortRef}
                aria-hidden
                className="absolute font-sans font-normal text-[120px] sm:text-[200px] lg:text-[320px] leading-none tracking-[-4px] lg:tracking-[-12px] text-[#000000] inline-block"
              >
                GOAT®
              </span>
            </div>
            {/* Accent CTA — MP5Button xl (matches header style at a
               larger scale). morphCtaRef is forwarded to the underlying
               <button> so GSAP can scrub opacity/transform on it. */}
            <MP5Button
              ref={morphCtaRef as Ref<HTMLElement>}
              size="lg"
              className="mp5-morph-cta mt-2 lg:mt-4"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-quote-modal"))
              }
            >
              Get a free quote
            </MP5Button>
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
        <section className="mp5-benefits-pin sticky top-0 h-screen w-full overflow-hidden bg-[#ffffff] grid grid-rows-[1fr_auto] rounded-t-[2.5em]">
          {/* Image stack — opacity cross-fade with ken-burns settle */}
          <div className="mp5-benefits-image-stack relative w-full overflow-hidden">
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
                  <span className="block h-[2px] w-16 bg-[#FFE533]" />
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
                    <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#000000]/55">
                      {b.label}
                    </span>
                    <h3 className="font-sans font-normal text-[22px] lg:text-[32px] leading-[1.1] tracking-[-0.6px] lg:tracking-[-1px] text-[#000000]">
                      {b.title}
                    </h3>
                    {/* Blue accent bar — GSAP scales it from 0 → 1
                       (left origin) as this step becomes active. */}
                    <span
                      data-step-bar
                      aria-hidden
                      className="block h-[2px] w-16 bg-[#FFE533]"
                    />
                  </div>
                  <p className="lg:col-span-8 font-sans text-base lg:text-lg leading-[1.5] tracking-[-0.3px] text-[#000000]/70 max-w-[760px]">
                    {b.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── 6. BENEFITS — 5 design variants stacked for A/B comparison.
         Originally a single full-bleed horizontal marquee on white;
         replaced with `BenefitsVariantsStack` so the user can scroll
         through 5 alternative treatments back-to-back and pick one.
         Once a winner is chosen, replace the stack with the single
         chosen variant (see sections/BenefitsVariants.tsx). ──────── */}
      <BenefitsVariantsStack />

      {/* ── 7. TESTIMONIAL — A/B variant stack (pick a winner, then collapse) ── */}
      <TestimonialVariantsStack />
    </>
  );
}


