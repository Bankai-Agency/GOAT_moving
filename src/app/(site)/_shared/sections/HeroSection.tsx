"use client";

import Image from "next/image";
import { RatingCards } from "@site/ui/RatingCards";
import { MP5Button } from "@site/ui/MP5Button";

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

              <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                <MP5Button
                  size="md"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                >
                  Get Free Estimate
                </MP5Button>
                <MP5Button size="md" variant="secondary" href="#services">
                  Our Services
                </MP5Button>
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
