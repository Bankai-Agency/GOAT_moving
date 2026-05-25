"use client";

import React from "react";

export type FragileItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type FragileItemsSectionProps = {
  label?: string;
  title?: string;
  subtitle?: string;
  items: FragileItem[];
};

/**
 * Compact "specialty list" block — intentionally visually different from
 * WhatsIncludedSection (the big 3×2 icon-card grid) so both can coexist on
 * the same page.
 *
 * Layout: horizontal rows. Each item renders as a single row with a round
 * icon on the LEFT and title + description stacked on the right. 3 columns
 * on desktop (rows read top-to-bottom in each column) for density.
 */
export function FragileItemsSection({
  label = "Specialties",
  title = "What We Specialize In",
  subtitle,
  items,
}: FragileItemsSectionProps) {
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
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

        {/* Item rows — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-6 lg:gap-y-8">
          {items.map((it, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 lg:gap-5 pb-6 lg:pb-8 border-b border-white/10 last:border-b-0 md:[&:nth-last-child(-n+2)]:md:border-b-0 lg:[&:nth-last-child(-n+3)]:lg:border-b-0"
            >
              {/* Round icon on the left — uniform 64/72px circle; `[&>svg]:*`
                  forces every icon SVG to render at the same pixel size
                  regardless of its inner viewBox, so icons visually match. */}
              <div className="shrink-0 w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-[#FFE533] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out [&>svg]:w-8 [&>svg]:h-8 lg:[&>svg]:w-9 lg:[&>svg]:h-9">
                {it.icon}
              </div>

              {/* Title + description */}
              <div className="flex flex-col gap-1.5 lg:gap-2 flex-1 min-w-0">
                <h3 className="font-sans font-bold text-lg lg:text-xl leading-[1.2] tracking-[-0.54px] lg:tracking-[-0.6px] text-white">
                  {it.title}
                </h3>
                <p className="font-sans font-normal text-sm lg:text-base leading-[1.5] tracking-[-0.48px] text-white/60">
                  {it.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
