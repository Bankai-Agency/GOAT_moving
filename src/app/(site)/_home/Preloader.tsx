"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "./preloader.css";

/* Logo-reveal preloader (Osmo "Logo Reveal Loader" port) for mainpage-5.

   Covers the screen on first load while the hero <video> buffers, then
   wipes the GOAT logo in, fills a progress bar, and lifts away. Unlike
   the stock resource (a fixed 3s timeline) the EXIT is gated on REAL
   readiness: it won't lift until the hero video has buffered enough
   (readyState >= 3) — or a safety timeout — so the hero plays smoothly
   the moment the loader clears. Text is split per-char manually (no
   SplitText dependency). data-* hooks are load-bearing. */
export function Preloader() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    gsap.registerPlugin(CustomEase);
    if (!gsap.parseEase("loaderEase")) {
      CustomEase.create("loaderEase", "0.65, 0.01, 0.05, 0.99");
    }

    const q = <T extends Element = HTMLElement>(s: string) =>
      wrap.querySelector(s) as T | null;
    const bg = q("[data-load-bg]");
    const progressBar = q("[data-load-progress]");
    const logo = q("[data-load-logo]");
    const container = q("[data-load-container]");
    const textEls = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-load-text]"),
    );

    // Lock scroll while the loader covers the screen.
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const unlock = () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };

    // Manual per-char split (matches the hero; no SplitText needed).
    const splitChars = (el: HTMLElement) => {
      const text = el.textContent ?? "";
      el.textContent = "";
      const chars: HTMLSpanElement[] = [];
      for (const ch of text) {
        const s = document.createElement("span");
        s.textContent = ch === " " ? " " : ch;
        s.style.display = "inline-block";
        s.style.willChange = "transform, opacity";
        el.appendChild(s);
        chars.push(s);
      }
      return chars;
    };
    const firstChars = textEls[0] ? splitChars(textEls[0]) : [];
    const secondChars = textEls[1] ? splitChars(textEls[1]) : [];

    gsap.set(textEls, { autoAlpha: 1 });
    gsap.set([...firstChars, ...secondChars], { autoAlpha: 0, yPercent: 125 });

    // ── Intro: progress fill + logo wipe + two-word char sequence ──
    const intro = gsap.timeline({ defaults: { ease: "loaderEase" } });
    intro
      .to(progressBar, { scaleX: 0.9, duration: 2.6 }, 0)
      .to(logo, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.6 }, 0);
    if (firstChars.length) {
      intro.to(firstChars, { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.02 }, 0.15);
      intro.to(firstChars, { autoAlpha: 0, yPercent: -125, duration: 0.4, stagger: 0.02 }, ">+=0.5");
    }
    if (secondChars.length) {
      intro.to(secondChars, { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.02 }, "<");
      intro.to(secondChars, { autoAlpha: 0, yPercent: -125, duration: 0.4, stagger: 0.02 }, ">+=0.5");
    }

    // ── Readiness gate: hero video buffered (readyState>=3) or timeout ──
    const MAX_MS = 7000;
    const t0 = performance.now();
    let rafId = 0;
    const ready = new Promise<void>((resolve) => {
      const check = () => {
        const v = document.querySelector<HTMLVideoElement>(
          "[data-hero-region] video",
        );
        if ((v && v.readyState >= 3) || performance.now() - t0 > MAX_MS) {
          resolve();
          return;
        }
        rafId = requestAnimationFrame(check);
      };
      rafId = requestAnimationFrame(check);
    });

    let killed = false;
    let exit: gsap.core.Timeline | null = null;

    // Lift only after BOTH the intro has played and the hero is ready.
    Promise.all([intro.then(() => undefined), ready]).then(() => {
      if (killed) return;
      exit = gsap.timeline({ defaults: { ease: "loaderEase" }, onComplete: unlock });
      exit
        .to(progressBar, { scaleX: 1, duration: 0.4 })
        .to(container, { autoAlpha: 0, duration: 0.5 })
        .to(progressBar, { scaleX: 0, transformOrigin: "right center", duration: 0.5 }, "<")
        .to(bg, { yPercent: -101, duration: 1 }, "<0.1")
        .set(wrap, { display: "none" });
    });

    return () => {
      killed = true;
      cancelAnimationFrame(rafId);
      intro.kill();
      exit?.kill();
      unlock();
    };
  }, []);

  return (
    <div ref={wrapRef} data-load-wrap className="loader">
      <div data-load-bg className="loader__bg">
        <div data-load-progress className="loader__bg-bar" />
      </div>
      <div data-load-container className="loader__container">
        <div className="loader__logo-wrap">
          <div className="loader__logo-item is--base">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/logo.svg" alt="" className="loader__logo-img" />
          </div>
          <div data-load-logo className="loader__logo-item is--top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/logo.svg" alt="" className="loader__logo-img" />
          </div>
        </div>
        <div className="loader__text-wrap">
          <span data-load-text data-load-reset className="loader__text-el">
            Hold tight
          </span>
          <span data-load-text data-load-reset className="loader__text-el">
            Goat Movers
          </span>
        </div>
      </div>
    </div>
  );
}
