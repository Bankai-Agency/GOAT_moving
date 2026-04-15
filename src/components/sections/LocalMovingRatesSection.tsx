"use client";

import React from "react";

export type RatesEstimate = {
  title: string;
  duration?: string;
  price: string;
  crew?: string;
  popular?: boolean;
};

export type RatesTrustBadge = {
  value: string;
  label: string;
};

export type LocalMovingRatesSectionProps = {
  label?: string;
  title?: string;
  subtitle?: string;
  hourlyLabel?: string;
  hourlyAmount?: string;
  hourlyUnit?: string;
  features?: string[];
  ctaLabel?: string;
  ctaFootnote?: string;
  estimates?: RatesEstimate[];
  trustBadges?: RatesTrustBadge[];
  /** Hide the big hourly-rate anchor card — compact mode: just estimates + CTA below. */
  hideHourlyCard?: boolean;
  /** Optional tagline rendered under the estimate cards (e.g., "Included: …"). */
  includedLine?: string;
  /** Hide the inline CTA + footnote that otherwise render under estimates in compact mode. */
  hideCta?: boolean;
};

const defaultFeatures = [
  "3-hour minimum for all moves",
  "No extra charge for stairs — ever",
  "Travel time billed at standard hourly rate",
  "Truck, fuel, equipment — all included",
];

const defaultEstimates: RatesEstimate[] = [
  { title: "Studio / 1-Bedroom", duration: "Typical duration: 2–3 hours", price: "$250 – $375" },
  { title: "2–3 Bedroom Home", duration: "Typical duration: 4–6 hours", price: "$500 – $750" },
];

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#FFE533" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#FFE533" />
  </svg>
);

export function LocalMovingRatesSection({
  label = "Pricing",
  title = "Local Moving Rates",
  subtitle,
  hourlyLabel = "Hourly Rate",
  hourlyAmount = "$125",
  hourlyUnit = "/hr",
  features = defaultFeatures,
  ctaLabel = "Get Free Estimate",
  ctaFootnote,
  estimates = defaultEstimates,
  trustBadges,
  hideHourlyCard = false,
  includedLine,
  hideCta = false,
}: LocalMovingRatesSectionProps = {}) {
  return (
    <section id="pricing" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:gap-4">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] text-white/60 max-w-[700px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Pricing content */}
        <div className="flex flex-col gap-5 lg:gap-8">
          {/* Hourly-rate anchor card — hidden in compact mode */}
          {!hideHourlyCard && (
            <div className="bg-[#181818] rounded-lg lg:rounded-2xl p-6 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
              <div className="flex flex-col gap-2 lg:min-w-[320px]">
                <p className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                  {hourlyLabel}
                </p>
                <p className="font-sans font-bold text-[56px] lg:text-[96px] leading-none tracking-[-1.68px] lg:tracking-[-2.88px] text-white">
                  {hourlyAmount}
                  <span className="text-[24px] lg:text-[36px] text-white/40">{hourlyUnit}</span>
                </p>
                {!hideCta && (
                  <>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                      className="btn-shine mt-4 bg-[#FFE533] h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-[#0c0c0c] uppercase tracking-[-0.64px] leading-[1.2] hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out w-full lg:w-fit cursor-pointer"
                    >
                      {ctaLabel}
                    </button>
                    {ctaFootnote && (
                      <span className="font-sans text-xs text-white/50">{ctaFootnote}</span>
                    )}
                  </>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 mt-1">
                      <CheckIcon />
                    </div>
                    <span className="font-sans text-base lg:text-lg leading-[1.4] text-white/80">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estimate cards — 3 across */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {estimates.map((est, i) => (
              <div
                key={i}
                className={`relative rounded-lg lg:rounded-2xl p-6 lg:p-8 flex flex-col gap-4 min-h-[200px] lg:min-h-[220px] transition-colors ${
                  est.popular
                    ? "bg-[#181818] ring-1 ring-[#FFE533]/50 shadow-[0_0_0_1px_rgba(255,229,51,0.15),0_20px_50px_rgba(255,229,51,0.08)]"
                    : "bg-[#181818]"
                }`}
              >
                {est.popular && (
                  <span className="absolute top-5 right-5 bg-[#FFE533] text-[#0c0c0c] font-mono font-bold text-[11px] uppercase tracking-[-0.48px] px-3 py-1.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#242424] flex items-center justify-center">
                    <HomeIcon />
                  </div>
                  <h3 className="font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] text-white">
                    {est.title}
                  </h3>
                </div>

                {est.duration && (
                  <p className="font-sans text-base lg:text-lg text-white/60">{est.duration}</p>
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <p className="font-sans font-bold text-[32px] lg:text-[40px] leading-none tracking-[-0.96px] lg:tracking-[-1.2px] text-white">
                    {est.price}
                  </p>
                  {est.crew && (
                    <p className="font-mono text-xs lg:text-sm uppercase tracking-[-0.48px] text-white/50">
                      {est.crew}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Included tagline (compact mode) */}
          {includedLine && (
            <p className="font-sans text-base lg:text-lg text-white/70 text-center">
              {includedLine}
            </p>
          )}

          {/* CTA + footnote — rendered below estimates when the anchor card is hidden and CTA is not suppressed */}
          {hideHourlyCard && !hideCta && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                className="btn-shine bg-[#FFE533] h-[52px] px-8 rounded-lg font-mono font-bold text-base uppercase tracking-[-0.64px] text-[#0c0c0c] hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
              >
                {ctaLabel}
              </button>
              {ctaFootnote && (
                <span className="font-sans text-xs text-white/50">{ctaFootnote}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
