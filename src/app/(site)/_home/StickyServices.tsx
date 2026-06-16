"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@site/motion/gsap";
import { defaultStickySteps, type StickyStep } from "./stickyServicesData";

/* Local accent for the sticky-steps char-wave (the parent keeps its own
   BLUE for the hero wave). */
const BLUE = "#FFE533";


/* ── Second services block (sticky-steps) — extracted so each page can
   pass its own `steps` (e.g. different per-step videos) while sharing the
   exact visual + scroll behaviour. */
export function StickyServices({ steps = defaultStickySteps }: { steps?: StickyStep[] }) {
  const stickyStepsRef = useRef<HTMLElement>(null);
  const mobileStepsWrapperRef = useRef<HTMLDivElement>(null);
  const mobileEyebrowRef = useRef<HTMLSpanElement>(null);
  const mobileH2Ref = useRef<HTMLHeadingElement>(null);
  const mobilePRef = useRef<HTMLParagraphElement>(null);

  /* ── SERVICES VISUAL: terminal-industries-style notch silhouette,
     scroll-driven. Each `.sticky-steps__visual.mp5-notch-shaped`
     element gets a CSS `clip-path: path('...')` recomputed in JS:
     rounded outer corners + a left-side tab notch whose vertical
     center slides through the card height as the user scrolls
     through the services section. Using CSS `path()` (not SVG
     url(#id)) is critical for performance — `url(#id)` clip-paths
     break GPU compositing on Chromium and tank canvas/image quality
     inside. ───────────────────────────────────────────────────── */
  useEffect(() => {
    registerGsapPlugins();
    const section = stickyStepsRef.current;
    if (!section) return;

    /* Silhouette parameters (CSS px, design-time terminal values). */
    const CORNER_R = 24;              // outer corner rounding
    const NOTCH_DEPTH = 30;           // how far the notch dents inward
    const ARC_R = 24;                 // notch arc radius
    const ARC_SPAN = 58;              // y-extent of each S-curve at top/bottom of notch
    const NOTCH_INNER_H = 296;        // inner vertical edge length (terminal: 296)

    const composePath = (W: number, H: number, notchCenterY: number) => {
      /* Total notch height = inner edge + 2 × S-curve regions. */
      const notchH = NOTCH_INNER_H + 2 * ARC_SPAN;
      const top = notchCenterY - notchH / 2;
      const bottom = notchCenterY + notchH / 2;
      /* Inset values for the S-curve: derived from terminal's geometry
         (4.72 / 25.28 within a 30-px depth window). */
      const sx1 = 4.72;
      const sx2 = 25.28;
      return [
        `M ${CORNER_R} 0`,
        `L ${W - CORNER_R} 0`,
        `A ${CORNER_R} ${CORNER_R} 0 0 1 ${W} ${CORNER_R}`,
        `L ${W} ${H - CORNER_R}`,
        `A ${CORNER_R} ${CORNER_R} 0 0 1 ${W - CORNER_R} ${H}`,
        `L ${CORNER_R} ${H}`,
        `A ${CORNER_R} ${CORNER_R} 0 0 1 0 ${H - CORNER_R}`,
        `L 0 ${bottom}`,
        /* Bottom S-curve of the notch: outer arc → diagonal → inner arc.
           Each arc covers a 14.92 px y-step; the diagonal between them
           covers 43.09 − 14.92 = 28.17 px. Together: 58 px = ARC_SPAN. */
        `A ${ARC_R} ${ARC_R} 0 0 1 ${sx1} ${bottom - 14.92}`,
        `L ${sx2} ${bottom - 43.09}`,
        `A ${ARC_R} ${ARC_R} 0 0 0 ${NOTCH_DEPTH} ${bottom - ARC_SPAN}`,
        /* Inner vertical edge. */
        `L ${NOTCH_DEPTH} ${top + ARC_SPAN}`,
        /* Top S-curve of the notch: mirror of the bottom S-curve.
           Inner arc 14.92 px → diagonal 28.17 px → outer arc 14.92 px.
           Endpoint y values: (top+58) → (top+43.09) → (top+14.92) → top. */
        `A ${ARC_R} ${ARC_R} 0 0 0 ${sx2} ${top + 43.09}`,
        `L ${sx1} ${top + 14.92}`,
        `A ${ARC_R} ${ARC_R} 0 0 1 0 ${top}`,
        `L 0 ${CORNER_R}`,
        `A ${CORNER_R} ${CORNER_R} 0 0 1 ${CORNER_R} 0`,
        `Z`,
      ].join(" ");
    };

    /* Notch travel range — center sweeps from 15% to 85% of card
       height as scroll progress goes 0 → 1. Wider range = more
       visible motion per scroll unit. */
    const notchYAtProgress = (H: number, p: number) =>
      H * (0.15 + 0.70 * p);

    let elements: HTMLElement[] = [];
    let lastProgress = 0;
    // Cache the last applied geometry per element so we can skip the
    // path() rebuild + style write when nothing changed — eliminates the
    // bulk of redundant per-tick work during fine scrolling.
    const lastKey = new WeakMap<HTMLElement, string>();

    const apply = (progress: number) => {
      lastProgress = progress;
      for (const el of elements) {
        const W = el.clientWidth;
        const H = el.clientHeight;
        if (!W || !H) continue;
        const cy = Math.round(notchYAtProgress(H, progress));
        const key = `${W}|${H}|${cy}`;
        if (lastKey.get(el) === key) continue;
        lastKey.set(el, key);
        const d = composePath(W, H, cy);
        el.style.clipPath = `path("${d}")`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (el.style as any).webkitClipPath = `path("${d}")`;
      }
    };

    const refresh = () => {
      elements = Array.from(
        section.querySelectorAll<HTMLElement>(".sticky-steps__visual.mp5-notch-shaped"),
      );
      apply(lastProgress);
    };

    refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(section);
    elements.forEach((el) => ro.observe(el));

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.4, // was 1 — less lag, snappier follow
        onUpdate: (self) => apply(self.progress),
      });
    }, section);

    return () => {
      ctx.revert();
      ro.disconnect();
    };
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
      // Dark theme: chars settle to WHITE (was INK on light theme).
      // GREY matches the mission headline off-state — darker than the
      // original #a8adb8 so the inactive steps recede on the dark page.
      const GREY = "#3a3a42";
      const INK = "#ffffff";

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

  /* ── SERVICES (mobile text swap): the per-step visual is now an
     autoplaying <video> (muted + looped) that plays on its own —
     scroll no longer scrubs frames, it only switches which step is
     active. Desktop renders one <video> per step. Mobile has a single
     pinned <video>; this effect swaps the eyebrow + h2 + p text as the
     scroll progress crosses each service segment boundary. ─── */
  useEffect(() => {
    registerGsapPlugins();
    const mobileWrapper = mobileStepsWrapperRef.current;
    if (!mobileWrapper) return;

    const eyebrowEl = mobileEyebrowRef.current;
    const h2El = mobileH2Ref.current;
    const pEl = mobilePRef.current;
    const totalSteps = steps.length;
    // Single pinned mobile <video> — its src is swapped per step (desktop
    // renders one <video> per step instead). This was missing, so on mobile
    // the clip never changed while the text did.
    const mobileVideo = mobileWrapper.querySelector<HTMLVideoElement>("video");
    let currentIdx = 0;
    const swapTo = (idx: number) => {
      if (idx === currentIdx) return;
      currentIdx = idx;
      const step = steps[idx];
      if (!step || !eyebrowEl || !h2El || !pEl) return;
      // Fade out text + video, swap the content AND the pinned video's clip,
      // then fade back in.
      const fadeTargets = [eyebrowEl, h2El, pEl, mobileVideo].filter(
        Boolean,
      ) as HTMLElement[];
      gsap.to(fadeTargets, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          eyebrowEl.textContent = step.eyebrow;
          h2El.textContent = step.h2;
          pEl.textContent = step.p;
          if (mobileVideo && mobileVideo.getAttribute("src") !== step.video) {
            mobileVideo.setAttribute("poster", step.image);
            mobileVideo.setAttribute("src", step.video);
            mobileVideo.load();
            void mobileVideo.play().catch(() => {});
          }
          // Per-step mobile object-fit: "contain" for a single centred
          // subject on a solid bg (e.g. the old vase clip) that cover would
          // crop; "cover" (default) for full-frame footage.
          if (mobileVideo) {
            mobileVideo.style.objectFit = step.fit ?? "cover";
          }
          gsap.fromTo(
            fadeTargets,
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

    const trigger = ScrollTrigger.create({
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

    return () => {
      trigger.kill();
    };
  }, []);

  /* ── SERVICES videos: play only the ACTIVE step's video, and only while
     the section is on-screen — cuts up to 4 concurrent decodes to 1 and
     stops all decoding once scrolled past. Videos keep autoPlay as a
     graceful fallback; this effect pauses the ones that shouldn't run. */
  useEffect(() => {
    const root = stickyStepsRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-sticky-steps-item]"),
    );
    const mobileVideo = root.querySelector<HTMLVideoElement>(
      ".sticky-steps__mobile video",
    );
    let inView = false;
    const sync = () => {
      items.forEach((item) => {
        const v = item.querySelector<HTMLVideoElement>("video");
        if (!v) return;
        const active =
          item.getAttribute("data-sticky-steps-item-status") === "active";
        if (inView && active) void v.play().catch(() => {});
        else v.pause();
      });
      if (mobileVideo) {
        if (inView) void mobileVideo.play().catch(() => {});
        else mobileVideo.pause();
      }
    };
    const mo = new MutationObserver(sync);
    items.forEach((item) =>
      mo.observe(item, {
        attributes: true,
        attributeFilter: ["data-sticky-steps-item-status"],
      }),
    );
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { rootMargin: "100px" },
    );
    io.observe(root);
    return () => {
      mo.disconnect();
      io.disconnect();
      items.forEach((item) =>
        item.querySelector<HTMLVideoElement>("video")?.pause(),
      );
      mobileVideo?.pause();
    };
  }, []);

  return (
      <section ref={stickyStepsRef} className="sticky-steps">

        {/* DESKTOP variant (≥992px) — hidden on mobile. */}
        <div className="sticky-steps__container hidden lg:block">
          <div data-sticky-steps-init className="sticky-steps__collection">
            <div className="sticky-steps__list">
              {steps.map((step, i) => (
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
                      {/* Notch-card silhouette: left-side tab cut, sharp
                          outer corners. SVG clipPath defined once at the
                          section top and referenced here via CSS
                          `clip-path: url(#mp5-notch-card-clip)` in the
                          .sticky-steps__visual rule (dark theme). */}
                      <div className="sticky-steps__visual mp5-notch-shaped">
                        {/* Autoplaying clip — plays on its own (muted, looped),
                            independent of scroll. Scroll only switches which
                            step is active. `image` is the poster fallback. */}
                        <video
                          className="sticky-steps__cover-image"
                          src={step.video}
                          poster={step.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="none"
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
           video below. The video autoplays (muted, looped) on its own;
           as the user scrolls through the section's 5-segment scroll
           budget, only the text content swaps with a fade animation. */}
        <div
          ref={mobileStepsWrapperRef}
          className="sticky-steps__mobile lg:hidden"
          style={{ position: "relative", height: `${steps.length * 100}vh` }}
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
                {steps[0].eyebrow}
              </span>
              <h2
                ref={mobileH2Ref}
                className="sticky-steps__h2"
                style={{ willChange: "opacity, transform" }}
              >
                {steps[0].h2}
              </h2>
              <p
                ref={mobilePRef}
                className="sticky-steps__p"
                style={{ willChange: "opacity, transform" }}
              >
                {steps[0].p}
              </p>
            </div>
            <div
              style={{
                flex: 1,
                position: "relative",
                borderRadius: "1.25em",
                overflow: "hidden",
                minHeight: "32vh",
                // Black fill so the `contain` letterbox on the packing clip
                // blends seamlessly with the clip's own black background
                // (other steps use cover and fully hide this).
                background: "#000",
              }}
            >
              <video
                className="sticky-steps__cover-image"
                src={steps[0].video}
                poster={steps[0].image}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
              />
            </div>
          </div>
        </div>
      </section>
  );
}
