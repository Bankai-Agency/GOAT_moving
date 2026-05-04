"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { RatingCards } from "@/components/ui/RatingCards";
import { useDirectionalHover } from "@/components/motion/useDirectionalHover";

const headlineLine1 = "Top-Rated Movers";
const headlineLine2 = "in Vancouver, WA & Portland, OR";

function splitToLetters(text: string) {
  return text.split("").map((ch, i) => (
    <span
      key={i}
      data-letter
      className="inline-block"
      style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
    >
      {ch}
    </span>
  ));
}

export function HeroArrivalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const ctaRef = useDirectionalHover<HTMLButtonElement>();
  const outlineRef = useDirectionalHover<HTMLAnchorElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Scroll cue (just the bouncing line — no entrance animation). */
      const cueLine = cueRef.current?.querySelector<HTMLElement>("[data-cue-line]");
      if (cueLine) {
        gsap.fromTo(
          cueLine,
          { scaleY: 0.4 },
          { scaleY: 1, duration: 1.8, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "top center" }
        );
      }

      /* Scroll-driven parallax (photo Y / scale, overlay opacity,
         content y + opacity for the exit). All on-load entrance
         animations have been removed per user request — the hero
         lands instantly and only animates as the user scrolls. */
      gsap.to(photoRef.current, {
        yPercent: 30,
        scale: 1.22,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(overlayRef.current, {
        opacity: 0.7,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(contentRef.current, {
        yPercent: -12,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "30% top", end: "bottom top", scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      {/* Background photo */}
      <div ref={photoRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/home-hero.jpg"
          alt="Professional movers at work"
          fill
          sizes="(max-width: 1024px) 200vw, 100vw"
          quality={90}
          className="object-cover"
          priority
        />
      </div>
      <div ref={overlayRef} className="absolute inset-0 bg-black" style={{ opacity: 0.32 }} />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-6">
          <div className="flex flex-col gap-4 lg:gap-6">
            <h1
              ref={headlineRef}
              className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]"
              style={{ perspective: "1000px" }}
            >
              <span className="text-white/60">{splitToLetters(headlineLine1)}</span>
              <br />
              <span className="text-white">{splitToLetters(headlineLine2)}</span>
            </h1>

            <div className="flex flex-col gap-5 lg:gap-7 max-w-[569px]">
              <p
                ref={subRef}
                className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white"
              >
                Local, long-distance, and commercial moves — 850+ five-star
                reviews, fully licensed & insured
              </p>

              <div ref={buttonsRef} className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                <button
                  ref={ctaRef}
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                  style={{ "--dir-circle-bg": "#0c0c0c" } as React.CSSProperties}
                  className="dir-btn btn-shine bg-[#FFE533] h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-[#0c0c0c] uppercase tracking-[-0.64px] leading-[1.2] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] hover:text-white transition-all duration-300 ease-out cursor-pointer"
                >
                  <span className="dir-circle-wrap"><span className="dir-circle" /></span>
                  Get Free Estimate
                </button>
                <Link
                  ref={outlineRef}
                  href="#services"
                  style={{ "--dir-circle-bg": "#ffffff" } as React.CSSProperties}
                  className="dir-btn border border-white h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-white uppercase tracking-[-0.64px] leading-[1.2] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] hover:text-[#0c0c0c] transition-all duration-300 ease-out"
                >
                  <span className="dir-circle-wrap"><span className="dir-circle" /></span>
                  Our Services
                </Link>
              </div>
            </div>
          </div>

          <div ref={ratingRef}>
            <RatingCards />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={cueRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
      >
        <span className="font-mono font-bold text-xs uppercase tracking-[2px]">Scroll</span>
        <span data-cue-line className="block w-[1px] h-10 bg-white/40" />
      </div>
    </section>
  );
}
