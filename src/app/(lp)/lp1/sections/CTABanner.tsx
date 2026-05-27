"use client";

import Image from "next/image";
import { LPButton } from "../ui/LPButton";

export type CTABannerProps = {
  heading?: string;
  tagline?: string;
  buttonText?: string;
  image?: string;
};

const defaults = {
  heading: "Ready to experience the difference?",
  tagline: "Get your free, no-obligation quote today and let our family move yours",
  buttonText: "Get a Free Quote",
  image: "/images/cta-bg.webp",
};

/* CTABanner — rebuilt as a clean stack:
     1. Section padding wrapper
     2. Rounded card (overflow hidden, fixed height)
     3. Full-bleed background photo (no overlay, no gradient, no
        drop-shadow on the heading — these all produced visible
        Mach-band / halo artefacts on the busy photo)
     4. Heading positioned top-left (plain white text)
     5. Blue tagline strip at the bottom with inline CTA button */
export function CTABanner({
  heading = defaults.heading,
  tagline = defaults.tagline,
  buttonText = defaults.buttonText,
  image = defaults.image,
}: CTABannerProps = {}) {
  return (
    <section id="cta" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[80px]">
      <div className="max-w-[1408px] mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden h-[600px] lg:h-[640px]">
          <Image
            src={image}
            alt="GOAT Movers team"
            fill
            sizes="(max-width: 1024px) 100vw, 1408px"
            quality={90}
            className="object-cover"
            priority={false}
          />

          {/* Elliptical wash anchored at the top-left corner — large
              enough to cover both heading lines on every viewport,
              strong enough to keep white text readable over busy
              photo areas (sky / tile / chrome). Radial (not linear)
              so there's no horizontal "band" edge to read as a
              stripe. Five-stop curve so the fade tapers smoothly to
              fully transparent well before reaching the blue CTA
              pill — the photo around the pill stays untouched. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background:
                "radial-gradient(ellipse 110% 75% at 0% 0%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 18%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 85%)",
            }}
          />

          {/* Heading — plain white text on top of the radial wash. */}
          <div className="absolute top-0 left-0 right-0 px-6 lg:px-12 pt-8 lg:pt-12 z-10">
            <h2 className="font-sans font-bold text-[32px] lg:text-[56px] leading-[1.1] tracking-[-0.96px] lg:tracking-[-2.24px] text-white max-w-[600px]">
              {heading}
            </h2>
          </div>

          {/* Bottom blue strip — tagline + CTA button. Sits on top of
              the photo as a solid panel so contrast is guaranteed
              without any overlay tricks on the image itself. */}
          <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6 z-10">
            <div className="bg-[#0066ff] rounded-xl lg:rounded-2xl px-5 lg:px-8 py-3 lg:py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
              <p className="font-sans font-normal text-sm lg:text-base leading-[1.4] text-white lg:whitespace-nowrap">
                {tagline}
              </p>
              <LPButton
                variant="secondary"
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
              >
                {buttonText}
              </LPButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
