"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { sharedContent } from "@/lib/content";
import { renderIcon } from "@/lib/content/icons";

export type WhyTrustItem = {
  /** Registry icon name (content JSON) or legacy JSX. */
  icon: React.ReactNode | string;
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
  /** Hide the thin divider line under the label (useful when the
      background image has faces/details the line cuts across). */
  hideLabelDivider?: boolean;
};

/* Shared defaults — edited in the admin (Общие блоки → Why GOAT). */
const defaultItems: WhyTrustItem[] = sharedContent.whyTrust.items;

const defaults = {
  label: sharedContent.whyTrust.label,
  title: sharedContent.whyTrust.title,
  description: sharedContent.whyTrust.description,
  image: sharedContent.whyTrust.image,
  imageAlt: sharedContent.whyTrust.imageAlt,
};

export function WhyTrustSection({
  label = defaults.label,
  title = defaults.title,
  description = defaults.description,
  image = defaults.image,
  imageAlt = defaults.imageAlt,
  items = defaultItems,
  hideLabelDivider = false,
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
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative w-full max-w-[1408px] mx-auto flex flex-col justify-between gap-10 lg:gap-16">
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className={hideLabelDivider ? "" : "border-b border-white/16 pb-4"}>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/80">{label}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:gap-5 max-w-[720px]">
            <h2 className="font-sans font-bold text-[32px] sm:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-1.5px] lg:tracking-[-2px] text-white">
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
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-[#242424] text-[#FFE533] flex items-center justify-center shrink-0">{renderIcon(p.icon, 28)}</div>
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-sans font-bold text-base lg:text-lg leading-[1.2] tracking-[-0.48px] text-white">{p.title}</h3>
                <p className="font-sans font-normal text-sm lg:text-base leading-[1.3] tracking-[-0.42px] text-white/70">{p.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
