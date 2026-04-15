"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export type WhyTrustItem = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

export type WhyTrustSectionProps = {
  label?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  items?: WhyTrustItem[];
};

const defaultItems: WhyTrustItem[] = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#0c0c0c"/></svg>
    ),
    title: "Minimal Downtime",
    subtitle: "Weekend, evening, phased moves",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#0c0c0c"/></svg>
    ),
    title: "Licensed & Insured",
    subtitle: "USDOT #4232069, $1M liability",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" fill="#0c0c0c"/></svg>
    ),
    title: "After-Hours & Weekends",
    subtitle: "No overtime surcharge",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="#0c0c0c"/></svg>
    ),
    title: "Dedicated Project Manager",
    subtitle: "One point of contact, always",
  },
];

const defaults = {
  label: "Why GOAT",
  title: "Why Businesses Choose GOAT for Their Office Move",
  description:
    "Commercial moves aren't just residential with more boxes. They need planning, downtime minimization, and a crew that treats your office like their own. We've relocated offices, showrooms, and law firms across the I-5 corridor — ready before Monday morning, every time.",
  image: "/images/hero-bg.jpg",
  imageAlt: "GOAT movers crew",
};

export function WhyTrustSection({
  label = defaults.label,
  title = defaults.title,
  description = defaults.description,
  image = defaults.image,
  imageAlt = defaults.imageAlt,
  items = defaultItems,
}: WhyTrustSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Respect reduced motion preference
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 when section is below viewport, 0 roughly when centered, 1 when above
      const progress = (vh - rect.top) / (vh + rect.height);
      // shift image up to ±160px
      setOffset((progress - 0.5) * 320);
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-[40px] lg:py-[60px] overflow-hidden min-h-[720px] lg:min-h-[860px] flex items-stretch"
    >
      <div
        className="absolute inset-x-0 -top-[200px] -bottom-[200px] will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 200vw, 100vw" quality={90} className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative w-full max-w-[1408px] mx-auto flex flex-col justify-between gap-10 lg:gap-16">
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/80">{label}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:gap-5 max-w-[720px]">
            <h2 className="font-sans font-bold text-[32px] lg:text-[56px] leading-[1.05] tracking-[-0.96px] lg:tracking-[-2.24px] text-white">
              {title}
            </h2>
            {description && (
              <p className="font-sans font-normal text-base lg:text-lg leading-[1.5] tracking-[-0.48px] text-white/90 max-w-[600px]">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((p, i) => (
            <div key={i} className="flex items-center gap-3 lg:gap-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-white flex items-center justify-center shrink-0">{p.icon}</div>
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-sans font-bold text-base lg:text-lg leading-[1.2] tracking-[-0.48px] text-white">{p.title}</h3>
                <p className="font-sans font-normal text-sm leading-[1.3] tracking-[-0.42px] text-white/70">{p.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
