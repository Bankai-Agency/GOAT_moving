"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@site/motion/gsap";
import { defaultStickySteps, type StickyStep } from "./stickyServicesData";

/* Local accent for the sticky-steps char-wave (the parent keeps its own
   BLUE for the hero wave). */
const BLUE = "#FFE533";

/* Lighter twins of the H.264 service clips, listed first in <source> so a
   browser that can play one never fetches the H.264 file. AV1: about half
   the bytes at the same picture (checked against the H.264 file at
   VMAF >= 97 by scripts/video-av1.sh, which is also how to regenerate
   it). HEVC: for Safari without AV1 (every iPhone before 15 Pro, Intel and
   M1/M2 Macs), which would otherwise pull the 4 MB H.264 file. Listed by
   hand rather than derived from the name, so a clip without a twin simply
   plays its H.264 one. A browser skips a <source> it cannot decode by its
   codecs string without fetching a byte of it. */
const AV1_CLIPS: Record<string, string> = {
  // The other three clips are grainier: their AV1 encodes either miss the
  // VMAF bar or come out no smaller than the H.264 file, so they have none.
  "/videos/service-long-distance.mp4": "/videos/service-long-distance.av1.mp4",
};
const HEVC_CLIPS: Record<string, string> = {
  "/videos/service-long-distance.mp4": "/videos/service-long-distance.hevc.mp4",
};
const AV1_TYPE = 'video/mp4; codecs="av01.0.08M.08"';
const HEVC_TYPE = 'video/mp4; codecs="hvc1"';
const H264_TYPE = "video/mp4";

/* Phone set. The pinned mobile panel shows the clip in a box about
   340x250 CSS px with object-fit: cover, so more than half of a
   1244x1664 desktop frame was downloaded only to be cropped away, at a
   bitrate above what a slow 4G link carries. These are centre crops at
   720 px (the part `cover` showed anyway), 0.2-0.65 MB each, with posters
   cut from their first frames. Used when the panel is phone-sized; a
   tablet in the mobile layout keeps the desktop files. */
const PHONE_CLIPS: Record<string, string> = {
  "/videos/service-local-moving.mp4": "/videos/service-local-moving-m.mp4",
  "/videos/service-long-distance.mp4": "/videos/service-long-distance-m.mp4",
  "/videos/service-commercial.mp4": "/videos/service-commercial-m.mp4",
  "/videos/service-packing.mp4": "/videos/service-packing-m.mp4",
};
const PHONE_POSTERS: Record<string, string> = {
  "/images/service-local-moving-poster.webp": "/images/service-local-moving-poster-m.webp",
  "/images/service-long-distance-poster.webp": "/images/service-long-distance-poster-m.webp",
  "/images/service-commercial-poster.webp": "/images/service-commercial-poster-m.webp",
  "/images/service-packing-poster.webp": "/images/service-packing-poster-m.webp",
};
const PHONE_PANEL_MAX_WIDTH = 500;

function ClipSources({ src }: { src: string }) {
  const av1 = AV1_CLIPS[src];
  const hevc = HEVC_CLIPS[src];
  return (
    <>
      {av1 && <source src={av1} type={AV1_TYPE} />}
      {hevc && <source src={hevc} type={HEVC_TYPE} />}
      <source src={src} type={H264_TYPE} />
    </>
  );
}

/* Same thing for the single pinned mobile <video>, whose clip is swapped
   per step at runtime: replace its <source> children, then load(). */
function setClipSources(video: HTMLVideoElement, src: string) {
  video.querySelectorAll("source").forEach((el) => el.remove());
  const add = (href: string, type: string) => {
    const el = document.createElement("source");
    el.src = href;
    el.type = type;
    video.appendChild(el);
  };
  if (AV1_CLIPS[src]) add(AV1_CLIPS[src], AV1_TYPE);
  if (HEVC_CLIPS[src]) add(HEVC_CLIPS[src], HEVC_TYPE);
  add(src, H264_TYPE);
  video.dataset.clip = src;
}

/* The poster is an <img> under the <video>, not the poster attribute, and
   the <video> stays transparent until a frame of the clip has actually
   been presented (data-playing, faded in by CSS). Safari drops a poster
   attribute the moment load() or play() is called, before the first frame
   is decoded, so every clip start blinked: once for the step's own fade
   and once more for the blank between poster and first frame. */
function revealWhenPlaying(video: HTMLVideoElement) {
  if (video.dataset.playing !== undefined) return;
  const show = () => {
    video.dataset.playing = "";
  };
  video.addEventListener(
    "playing",
    () => {
      if ("requestVideoFrameCallback" in video) video.requestVideoFrameCallback(show);
      else show();
    },
    { once: true },
  );
}

/* Drops the clip: its download is aborted, the decoder is released and
   the element turns transparent again, showing the poster image under it. */
function clearClipSources(video: HTMLVideoElement) {
  delete video.dataset.playing;
  if (!video.dataset.clip) return;
  video.pause();
  video.querySelectorAll("source").forEach((el) => el.remove());
  delete video.dataset.clip;
  video.load();
}

/* Both layouts (desktop list, mobile pinned panel) are always in the DOM
   and one of them is display:none. A hidden <video> still downloads and
   decodes when played, so everything below asks this first. */
const isShown = (el: Element | null) => Boolean(el && el.getClientRects().length);

/* What the mobile-panel effect exposes to the playback effect. */
type MobileClipControl = {
  setInView: (inView: boolean) => void;
  primePoster: () => void;
  refresh: () => void;
};


/* ── Second services block (sticky-steps) — extracted so each page can
   pass its own `steps` (e.g. different per-step videos) while sharing the
   exact visual + scroll behaviour. */
export function StickyServices({ steps = defaultStickySteps }: { steps?: StickyStep[] }) {
  const stickyStepsRef = useRef<HTMLElement>(null);
  const mobileStepsWrapperRef = useRef<HTMLDivElement>(null);
  const mobileEyebrowRef = useRef<HTMLSpanElement>(null);
  const mobileH2Ref = useRef<HTMLHeadingElement>(null);
  const mobilePRef = useRef<HTMLParagraphElement>(null);
  const mobileClipRef = useRef<MobileClipControl | null>(null);

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
    const mobilePoster = mobileWrapper.querySelector<HTMLImageElement>("[data-mobile-poster]");
    const mobileMedia = mobileVideo?.parentElement ?? null;
    let currentIdx = 0;

    /* The pinned <video> starts with no sources and its poster <img>
       with no src: either would be fetched at page load even inside a
       display:none subtree, several screens above where it is seen. The playback
       effect below primes the poster when the section comes near and
       starts the clip when it is on screen. */
    let inView = false;
    let clipTimer: ReturnType<typeof setTimeout> | null = null;
    const assetsFor = (idx: number) => {
      const step = steps[idx];
      const w = mobileVideo ? mobileVideo.clientWidth : 0;
      const phone = w > 0 && w <= PHONE_PANEL_MAX_WIDTH;
      return {
        clip: (phone && PHONE_CLIPS[step.video]) || step.video,
        poster: (phone && PHONE_POSTERS[step.image]) || step.image,
      };
    };
    const showPoster = (idx: number) => {
      if (!mobileVideo || !isShown(mobileVideo)) return;
      const { poster } = assetsFor(idx);
      if (mobilePoster && mobilePoster.getAttribute("src") !== poster) {
        mobilePoster.setAttribute("src", poster);
      }
    };
    const playClip = (idx: number) => {
      if (!mobileVideo || !inView || !isShown(mobileVideo)) return;
      const { clip } = assetsFor(idx);
      if (mobileVideo.dataset.clip !== clip) {
        delete mobileVideo.dataset.playing;
        setClipSources(mobileVideo, clip);
        mobileVideo.load();
      }
      revealWhenPlaying(mobileVideo);
      void mobileVideo.play().catch(() => {});
    };
    const cancelClipTimer = () => {
      if (clipTimer) clearTimeout(clipTimer);
      clipTimer = null;
    };
    mobileClipRef.current = {
      setInView: (v) => {
        if (v === inView) return;
        inView = v;
        if (v) {
          showPoster(currentIdx);
          playClip(currentIdx);
        } else {
          cancelClipTimer();
          mobileVideo?.pause();
        }
      },
      primePoster: () => showPoster(currentIdx),
      // Layout changed (rotation, resize across the breakpoint).
      refresh: () => {
        if (!mobileVideo) return;
        if (!isShown(mobileVideo)) {
          cancelClipTimer();
          clearClipSources(mobileVideo);
        } else if (inView) {
          showPoster(currentIdx);
          playClip(currentIdx);
        }
      },
    };

    const swapTo = (idx: number) => {
      if (idx === currentIdx) return;
      currentIdx = idx;
      const step = steps[idx];
      if (!step || !eyebrowEl || !h2El || !pEl) return;
      // Fade out text + media box, swap the content AND the pinned clip,
      // then fade back in. The box (poster image + video) fades as one;
      // the video's own opacity belongs to revealWhenPlaying.
      const fadeTargets = [eyebrowEl, h2El, pEl, mobileMedia].filter(
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
          if (mobileVideo && mobileVideo.dataset.clip !== assetsFor(idx).clip) {
            /* The step's poster shows at once; its clip only if the
               visitor stays on the step. A swipe crosses a step in under
               a second, and loading every clip on the way aborted each
               download half-finished and paid for bytes nobody saw. */
            clearClipSources(mobileVideo);
            showPoster(idx);
            cancelClipTimer();
            clipTimer = setTimeout(() => playClip(currentIdx), 350);
          }
          // Per-step mobile object-fit: "contain" for a single centred
          // subject on a solid bg (e.g. the old vase clip) that cover would
          // crop; "cover" (default) for full-frame footage.
          if (mobileVideo) {
            mobileVideo.style.objectFit = step.fit ?? "cover";
          }
          if (mobilePoster) {
            mobilePoster.style.objectFit = step.fit ?? "cover";
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
        // On desktop this wrapper is display:none; its progress is noise.
        if (!isShown(mobileWrapper)) return;
        const idx = Math.min(
          totalSteps - 1,
          Math.floor(self.progress * totalSteps),
        );
        swapTo(idx);
      },
    });

    return () => {
      trigger.kill();
      cancelClipTimer();
      mobileClipRef.current = null;
      if (mobileVideo) clearClipSources(mobileVideo);
    };
  }, []);

  /* ── SERVICES videos: play only the ACTIVE step's video of the layout
     that is actually displayed, and only while the section is on-screen:
     one decoder instead of up to five, none once scrolled past. This
     effect is also what starts playback at all (the <video> tags carry no
     autoPlay), so a clip is fetched the first time its step is active on
     screen, not at load. Posters are deferred the same way (data-poster)
     and attached when the section is within a screen and a half. */
  useEffect(() => {
    const root = stickyStepsRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-sticky-steps-item]"),
    );
    const desktopVideos = items
      .map((item) => item.querySelector<HTMLVideoElement>("video"))
      .filter((v): v is HTMLVideoElement => Boolean(v));
    const desktopPosters = Array.from(
      root.querySelectorAll<HTMLImageElement>("[data-sticky-steps-item] img[data-poster]"),
    );
    let inView = false;
    let near = false;
    const primePosters = () => {
      if (!near) return;
      desktopPosters.forEach((img) => {
        const poster = img.dataset.poster;
        if (poster && !img.getAttribute("src") && isShown(img)) img.setAttribute("src", poster);
      });
      mobileClipRef.current?.primePoster();
    };
    const sync = () => {
      items.forEach((item) => {
        const v = item.querySelector<HTMLVideoElement>("video");
        if (!v) return;
        const active =
          item.getAttribute("data-sticky-steps-item-status") === "active";
        if (inView && active && isShown(v)) {
          revealWhenPlaying(v);
          void v.play().catch(() => {});
        } else v.pause();
      });
      mobileClipRef.current?.setInView(inView);
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
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near = true;
        primePosters();
      },
      { rootMargin: "150% 0px" },
    );
    nearIo.observe(root);
    // Rotation or a resize across the breakpoint swaps which layout shows.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        primePosters();
        sync();
        mobileClipRef.current?.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      mo.disconnect();
      io.disconnect();
      nearIo.disconnect();
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      desktopVideos.forEach((v) => v.pause());
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
                        {/* Looping clip, started by the effect below only
                            for the ACTIVE step while the section is on
                            screen. No `autoPlay`: it overrides
                            preload="none" and made all four files download
                            in full at page load, ahead of the hero video.
                            `image` is the poster until then: an <img>
                            under the video whose src is attached when
                            the section comes near (a poster is fetched at
                            page load even when hidden). The video fades
                            in over it once a frame is presented. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="sticky-steps__cover-image"
                          data-poster={step.image}
                          alt=""
                          aria-hidden
                          decoding="async"
                        />
                        <video
                          className="sticky-steps__cover-image sticky-steps__clip"
                          loop
                          muted
                          playsInline
                          preload="none"
                        >
                          <ClipSources src={step.video} />
                        </video>
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
              {/* No poster src and no <source> in the markup: the effects
                  above attach the poster image when the section comes
                  near and the clip (phone-sized or desktop file) when it
                  is on screen. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="sticky-steps__cover-image"
                data-mobile-poster=""
                alt=""
                aria-hidden
                decoding="async"
              />
              <video
                className="sticky-steps__cover-image sticky-steps__clip"
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
