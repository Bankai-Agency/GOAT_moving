"use client";

import React from "react";

export type ServiceOption = {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Optional tagline ("Best for: busy professionals, families..."). */
  bestFor?: string;
};

export type ServiceOptionsSectionProps = {
  label?: string;
  title?: string;
  subtitle?: string;
  options: ServiceOption[];
};

/**
 * Horizontal-row "feature list" layout: each option is a full-width row with
 * an icon pill on the left, title + description in the middle, and a compact
 * "Best for" blurb on the right. Rows are separated by thin dividers — no
 * card chrome, no watermark numbers, no oversized whitespace.
 *
 * Visually distinct from WhatsIncludedSection (card grid with hover blobs),
 * HowItWorksSection (tall step cards) and FragileItemsSection (icon-left row
 * grid).
 */
export function ServiceOptionsSection({
  label = "What We Offer",
  title = "Choose the Service That Fits Your Needs",
  subtitle,
  options,
}: ServiceOptionsSectionProps) {
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-12">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-4 lg:pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white max-w-[900px]">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] text-white/60 max-w-[700px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Option rows — single-column list with dividers between rows */}
        <div className="bg-[#181818] rounded-2xl overflow-hidden">
          {options.map((opt, i) => (
            <div
              key={opt.title}
              className={`group relative flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 px-6 lg:px-8 py-6 lg:py-8 hover:bg-[#1e1e1e] transition-colors duration-300 ${
                i > 0 ? "border-t border-white/[0.06]" : ""
              }`}
            >
              {/* Icon pill */}
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-[#242424] group-hover:bg-[#2a2a2a] flex items-center justify-center shrink-0 transition-colors duration-300">
                {opt.icon}
              </div>

              {/* Title + description */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5 lg:gap-2 lg:pr-6">
                <h3 className="font-sans font-bold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white">
                  {opt.title}
                </h3>
                <p className="font-sans font-normal text-base leading-[1.5] tracking-[-0.48px] text-white/60">
                  {opt.description}
                </p>
              </div>

              {/* Best-for — pinned to the right on desktop, stacked below on mobile */}
              {opt.bestFor && (
                <div className="lg:w-[360px] lg:shrink-0 lg:pl-8 lg:border-l lg:border-white/[0.08] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFE533]" />
                    <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[-0.48px] text-white/60">
                      Best For
                    </span>
                  </div>
                  <p className="font-sans font-medium text-base lg:text-lg leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.54px] text-white">
                    {opt.bestFor.replace(/^Best for:\s*/i, "")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
