"use client";

import Link from "next/link";

export type ServiceArea = {
  city: string;
  state?: string;
  href?: string;
};

export type ServiceAreaSectionProps = {
  label?: string;
  title?: string;
  subtitle?: string;
  areas?: ServiceArea[];
  /** "auto" (default): responsive md:2 lg:3 · "3": always 3 on lg · "4": always 4 on lg */
  columns?: "auto" | "3" | "4";
};

const defaultAreas: ServiceArea[] = [
  { city: "Vancouver", state: "WA", href: "/vancouver-movers" },
  { city: "Portland", state: "OR", href: "/portland-movers" },
  { city: "Beaverton", state: "OR", href: "/beaverton-movers" },
  { city: "Hillsboro", state: "OR", href: "/hillsboro-movers" },
  { city: "Tigard", state: "OR", href: "/tigard-movers" },
  { city: "Tualatin", state: "OR", href: "/tualatin-movers" },
  { city: "Camas", state: "WA", href: "/camas-movers" },
  { city: "Gresham", state: "OR", href: "/gresham-movers" },
  { city: "Oregon City", state: "OR", href: "/oregon-city-movers" },
];

function AreaCard({ city, state, href }: ServiceArea) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <h3 className="font-sans font-semibold text-lg lg:text-xl leading-[1.2] tracking-[-0.54px] lg:tracking-[-0.6px] text-white group-hover:text-[#FFE533] transition-colors duration-200">
          {city}
        </h3>
        {state && (
          <span className="font-mono font-bold text-sm uppercase tracking-[-0.48px] leading-[1.2] text-white/40 bg-white/[0.08] rounded-lg px-2.5 py-1">
            {state}
          </span>
        )}
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] group-hover:bg-[#FFE533] group-hover:rotate-[-45deg] transition-all duration-300 ease-out shrink-0">
        <svg width="14" height="12" viewBox="0 0 19 16" fill="none">
          <path
            d="M18.7071 8.70711C19.0976 8.31658 19.0976 7.68342 18.7071 7.29289L12.3431 0.928932C11.9526 0.538408 11.3195 0.538408 10.9289 0.928932C10.5384 1.31946 10.5384 1.95262 10.9289 2.34315L16.5858 8L10.9289 13.6569C10.5384 14.0474 10.5384 14.6805 10.9289 15.0711C11.3195 15.4616 11.9526 15.4616 12.3431 15.0711L18.7071 8.70711ZM0 9H18V7H0V9Z"
            fill="white"
            className="group-hover:fill-[#0c0c0c] transition-colors duration-200"
          />
        </svg>
      </div>
    </>
  );

  const common =
    "group flex items-center justify-between bg-[#181818] rounded-2xl px-5 py-4 lg:px-6 lg:py-5 hover:bg-[#1e1e1e] transition-all duration-200";

  if (href) {
    return (
      <Link href={href} className={common}>
        {content}
      </Link>
    );
  }
  return (
    <div
      className={`${common} cursor-pointer`}
      onClick={() => window.dispatchEvent(new Event("open-quote-modal"))}
      role="button"
      tabIndex={0}
    >
      {content}
    </div>
  );
}

export function ServiceAreaSection({
  label = "Service Area",
  title = "Serving Vancouver, WA — Portland, OR — and Beyond",
  subtitle = "Based in Vancouver, Washington, we cover the entire I-5 corridor. Whether you're moving across town or across states — we've got you covered.",
  areas = defaultAreas,
  columns = "auto",
}: ServiceAreaSectionProps = {}) {
  const gridCols =
    columns === "4"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : columns === "3"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="bg-[#0c0c0c] px-4 pb-[60px] lg:pb-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-12">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-12">
          <div className="border-b border-white/16 pb-4 lg:pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>

          {/* Heading + subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-0">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white max-w-[800px]">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[450px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Area cards grid */}
        <div className={`grid ${gridCols} gap-3`}>
          {areas.map((area) => (
            <AreaCard key={area.city} {...area} />
          ))}
        </div>
      </div>
    </section>
  );
}
