"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ServiceItem = {
  title: string;
  description: string;
  number: string;
  image: string;
  href?: string;
};

export type ServicesSectionProps = {
  label?: string;
  title?: React.ReactNode;
  subtitle?: string;
  services?: ServiceItem[];
};

const defaultServices: ServiceItem[] = [
  {
    title: "Local Moving",
    description:
      "Residential moves within Vancouver, WA, Portland, OR, and surrounding areas. Packing, loading, transportation, unloading, and unpacking — all included with no hidden fees.",
    number: "1",
    image: "/images/service-local.webp",
    href: "/local-moving",
  },
  {
    title: "Long Distance Moving",
    description:
      "Interstate moves across the US from the Pacific Northwest. Fully licensed (USDOT #4232069) and insured for cross-state relocations of any size.",
    number: "2",
    image: "/images/service-longdistance.webp",
    href: "/long-distance-moving",
  },
  {
    title: "Commercial Moving",
    description:
      "Office and commercial relocations in Vancouver and Portland with minimal downtime. We handle equipment, furniture, and sensitive documents safely and on schedule.",
    number: "3",
    image: "/images/service-commercial.webp",
    href: "/commercial-moving",
  },
  {
    title: "Packing & Labor",
    description:
      "Professional packing with quality materials for any size move. Same-building moves, loading/unloading labor, and expert handling of fragile and specialty items.",
    number: "4",
    image: "/images/service-packing.webp",
    href: "/packing-services",
  },
];

function ServiceCard({ title, description, number, image, href }: ServiceItem) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);

  const commonClass =
    "relative bg-[#181818] h-[420px] lg:h-[580px] rounded-2xl overflow-hidden flex flex-col justify-between group hover-lift cursor-pointer";

  const inner = (
    <>
      {/* Background image — BMW-style: always visible, fills the
          card. No hover-to-reveal pattern, no full-area dark wash. */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover transition-transform duration-[1.2s] ease-out ${
            isVisible ? "scale-100" : "scale-110"
          } lg:scale-100`}
        />
      </div>

      {/* Watermark number — softened so it reads as a faint stamp
          over the photo without competing with the bottom text. */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-light text-[100px] lg:text-[164px] leading-[1.2] tracking-[-4.92px] text-white/15 select-none pointer-events-none z-[1]">
        {number}
      </span>

      {/* Bottom content cluster — title + description stacked
          together on a single bottom-anchored dark gradient that
          fades to fully transparent ~halfway up the card. No
          top-of-card gradient, no arrow button (per BMW reference). */}
      <div className="relative z-10 mt-auto px-5 pb-5 pt-24 lg:px-8 lg:pb-8 lg:pt-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.78) 35%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="relative flex flex-col gap-2 lg:gap-3">
          <h3 className="font-sans font-semibold text-[28px] lg:text-[42px] leading-[1.15] tracking-[-0.84px] lg:tracking-[-1.26px] text-white">
            {title}
          </h3>
          <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/85">
            {description}
          </p>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link ref={setEl} href={href} className={commonClass}>
        {inner}
      </Link>
    );
  }

  return (
    <div
      ref={setEl}
      onClick={() => window.dispatchEvent(new Event("open-quote-modal"))}
      role="button"
      tabIndex={0}
      className={commonClass}
    >
      {inner}
    </div>
  );
}

export function ServicesSection({
  label = "Our Services",
  title = "Affordable Moving Services in Vancouver, WA & Portland, OR",
  subtitle = "Full-service moving — from packing to unloading. No hidden fees, no charge for stairs.",
  services = defaultServices,
}: ServicesSectionProps = {}) {
  return (
    <section id="services" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-16">
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
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white max-w-[900px]">
              {title}
            </h2>
            <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[450px]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Service cards grid — 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
