"use client";

import Image from "next/image";
import { RatingCards } from "@site/ui/RatingCards";

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/home-hero.png"
          alt="Professional movers at work"
          fill
          sizes="(max-width: 1024px) 200vw, 100vw"
          quality={90}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[rgba(7,7,7,0.3)]" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-6">
          {/* Left — heading + CTA */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* H1 */}
            <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
              <span className="text-[#FFE533]">Top-Rated Movers </span>
              <br />
              <span className="text-white">in Vancouver, WA & Portland, OR</span>
            </h1>

            {/* Subtitle + buttons */}
            <div className="flex flex-col gap-5 lg:gap-7 max-w-[569px]">
              <p className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white">
                Local, long-distance, and commercial moves — 850+ five-star
                reviews, fully licensed & insured
              </p>

              {/* CTA — same button as the home header (Header.tsx). Both live
                 inside .page-zoom, so they scale together; no zoom-comp here
                 (unlike the service-page heroes under TerminalNav). */}
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                <button
                  onClick={() => window.dispatchEvent(new Event("open-quote-modal"))}
                  className="btn-shine bg-[#FFE533] px-4 py-3 rounded-[4px] font-mono text-sm font-bold uppercase tracking-[-0.64px] leading-[1.2] text-[#0c0c0c] whitespace-nowrap hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
                >
                  Get Free Estimate
                </button>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] text-white whitespace-nowrap ring-1 ring-inset ring-white/30 hover:bg-white/10 hover:ring-white/50 transition-all duration-200 ease-out"
                >
                  Our Services
                </a>
              </div>
            </div>
          </div>

          {/* Rating cards — shared with LP hero */}
          <RatingCards />
        </div>
      </div>
    </section>
  );
}
