"use client";

import Image from "next/image";

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
  image: "/images/cta-bg.jpg",
};

export function CTABanner({
  heading = defaults.heading,
  tagline = defaults.tagline,
  buttonText = defaults.buttonText,
  image = defaults.image,
}: CTABannerProps = {}) {
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[80px]">
      <div className="max-w-[1408px] mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
          {/* Full-height image background — taller */}
          <div className="relative h-[600px] lg:h-[640px]">
            <Image
              src={image}
              alt="GOAT Movers team"
              fill
              sizes="(max-width: 1024px) 200vw, 100vw"
              quality={90}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/30 lg:from-black/40 lg:via-black/10 lg:to-black/20" />

            {/* Heading overlaid on image — top left */}
            <div className="absolute top-0 left-0 right-0 px-6 lg:px-12 pt-8 lg:pt-12">
              <h2 className="font-sans font-bold text-[32px] lg:text-[56px] leading-[1.1] tracking-[-0.96px] lg:tracking-[-2.24px] text-white max-w-[600px]">
                {heading}
              </h2>
            </div>

            {/* Yellow floating island bar — with margins and rounded corners */}
            <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6">
              <div className="bg-[#FFE533] rounded-xl lg:rounded-2xl px-6 lg:px-10 py-5 lg:py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <p className="font-sans font-normal text-sm lg:text-base leading-[1.4] text-[#0c0c0c]/80 lg:whitespace-nowrap">
                  {tagline}
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                  className="bg-[#0c0c0c] text-white h-[44px] lg:h-[48px] px-6 lg:px-8 rounded-lg font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] flex items-center justify-center hover:bg-[#1a1a1a] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0"
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
