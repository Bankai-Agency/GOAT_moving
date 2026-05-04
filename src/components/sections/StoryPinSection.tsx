"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/components/motion/gsap";

type Service = {
  number: string;
  tag: string;
  leftHeading: string;
  title: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  href?: string;
};

const services: Service[] = [
  {
    number: "01",
    tag: "Local Moving",
    leftHeading: "Same crew, same hands, every box.",
    title: "Local Moving",
    description:
      "Residential moves within Vancouver, WA, Portland, OR, and surrounding areas. Packing, loading, transportation, unloading, and unpacking — all included with no hidden fees.",
    price: "from $125 / hr",
    image: "/images/service-local.png",
    imageAlt: "Local moving crew loading a truck",
    href: "/local-moving",
  },
  {
    number: "02",
    tag: "Long Distance Moving",
    leftHeading: "Across state lines without the small print.",
    title: "Long Distance Moving",
    description:
      "Interstate moves across the US from the Pacific Northwest. Fully licensed (USDOT #4232069) and insured for cross-state relocations of any size.",
    price: "flat-rate quote",
    image: "/images/service-longdistance.jpg",
    imageAlt: "Long distance truck on the highway",
    href: "/long-distance-moving",
  },
  {
    number: "03",
    tag: "Commercial Moving",
    leftHeading: "Move offices on the weekend, open Monday.",
    title: "Commercial Moving",
    description:
      "Office and commercial relocations in Vancouver and Portland with minimal downtime. We handle equipment, furniture, and sensitive documents safely and on schedule.",
    price: "scheduled around you",
    image: "/images/service-commercial.png",
    imageAlt: "Commercial movers transporting office furniture",
    href: "/commercial-moving",
  },
  {
    number: "04",
    tag: "Packing & Labor",
    leftHeading: "Pack like it's your grandmother's china.",
    title: "Packing & Labor",
    description:
      "Professional packing with quality materials for any size move. Same-building moves, loading/unloading labor, and expert handling of fragile and specialty items.",
    price: "by-the-hour",
    image: "/images/service-packing.png",
    imageAlt: "Packing crew wrapping fragile items",
    href: "/packing-services",
  },
];

const label = "What We Do";
const heading = "Four ways we move your life";
const subtitle = "Pick the service that fits — every move comes with the same crew, same insurance, same flat-rate honesty.";

export function StoryPinSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      /* Header reveal */
      if (headerRef.current) {
        const items = headerRef.current.querySelectorAll<HTMLElement>(":scope > *");
        gsap.from(items, {
          scrollTrigger: { trigger: headerRef.current, start: "top 80%" },
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        });
      }

      const mql = window.matchMedia("(min-width: 1024px)");
      if (!mql.matches || !trackRef.current || !portalRef.current) return;

      const total = services.length;
      const cards = cardRefs.current.filter(Boolean);
      const bgs = bgRefs.current.filter(Boolean);
      if (cards.length !== total || bgs.length !== total) return;

      gsap.set(portalRef.current, { autoAlpha: 0 });
      gsap.set(cards, { yPercent: 100 });
      gsap.set(cards[0], { yPercent: 0 });
      gsap.set(bgs, { autoAlpha: 0 });
      gsap.set(bgs[0], { autoAlpha: 1 });

      /* Separate visibility trigger — toggles the portal in sync with
         the track. Using `onToggle` (instead of onEnter/onLeave on
         the scrub trigger) so it fires correctly when ScrollTrigger
         refreshes mid-pin. */
      const portalEl = portalRef.current;
      const setVisibility = (visible: boolean) => {
        gsap.to(portalEl, { autoAlpha: visible ? 1 : 0, duration: 0.3, overwrite: true });
      };
      gsap.set(portalEl, { autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: ({ isActive }) => setVisibility(isActive),
        onRefresh: ({ isActive }) => setVisibility(isActive),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      for (let i = 1; i < total; i++) {
        const at = i - 1;
        tl.to(cards[i - 1], { yPercent: -100, ease: "power2.in", duration: 1 }, at);
        tl.fromTo(
          cards[i],
          { yPercent: 100 },
          { yPercent: 0, ease: "power2.out", duration: 1 },
          at
        );
        tl.to(bgs[i - 1], { autoAlpha: 0, ease: "power2.in", duration: 1 }, at);
        tl.to(bgs[i], { autoAlpha: 1, ease: "power2.out", duration: 1 }, at);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  const total = services.length;

  return (
    <section ref={sectionRef} id="services" className="bg-[#0c0c0c] overflow-hidden">
      {/* Header — natural flow */}
      <div className="px-4 pt-[60px] lg:pt-[100px] pb-8 lg:pb-16">
        <div ref={headerRef} className="max-w-[1408px] mx-auto flex flex-col gap-6 lg:gap-12">
          <div className="border-b border-white/16 pb-4 lg:pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-0">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white max-w-[900px]">
              {heading}
            </h2>
            <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[450px]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: simple stacked list */}
      <div className="lg:hidden px-4 pb-[60px] flex flex-col gap-6">
        {services.map((s) => (
          <ServiceCard key={s.title} service={s} />
        ))}
      </div>

      {/* Desktop: empty scroll-track that drives the portal carousel.
          The actual visual lives in `document.body` (mounted via the
          portal below), `position: fixed` to escape `.page-zoom` and
          fill the real viewport. */}
      <div ref={trackRef} className="hidden lg:block" style={{ height: `${total * 100}vh` }} />

      {/* Portal carousel — only mounted client-side. */}
      {mounted &&
        createPortal(
          <div
            ref={portalRef}
            aria-hidden
            className="hidden lg:block fixed inset-0 z-[40] overflow-hidden invisible"
          >
            {services.map((s, i) => (
              <div
                key={`bg-${s.title}`}
                ref={(el) => {
                  if (el) bgRefs.current[i] = el;
                }}
                className="absolute inset-0 will-change-[opacity]"
              >
                <Image
                  src={s.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover scale-125"
                  style={{ filter: "blur(64px) saturate(1.05) brightness(0.7)" }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}

            <div className="relative h-full w-full flex items-center justify-center px-12">
              <div className="relative w-full max-w-[1408px] h-[80vh]">
                {services.map((s, i) => (
                  <div
                    key={`card-${s.title}`}
                    ref={(el) => {
                      if (el) cardRefs.current[i] = el;
                    }}
                    className="absolute inset-0 will-change-transform"
                  >
                    <ServiceCard service={s} />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute top-6 right-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[2px] text-white/70">
              <span>01</span>
              <span className="w-12 h-px bg-white/30" />
              <span>0{total}</span>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="relative h-full bg-[#181818] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <div
        data-card-left
        className="lg:col-span-3 flex flex-col justify-between p-8 lg:p-12 gap-12 lg:gap-0 min-h-[260px]"
      >
        <h3 className="font-sans font-bold text-[28px] lg:text-[44px] leading-[1.05] tracking-[-1px] lg:tracking-[-1.8px] text-white">
          {service.leftHeading}
        </h3>
        <div className="flex items-center gap-2 text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE533]" />
          <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[2px]">
            {service.number} · {service.tag}
          </span>
        </div>
      </div>

      <div className="lg:col-span-5 relative overflow-hidden min-h-[320px] lg:min-h-0">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div data-card-right className="lg:col-span-4 flex flex-col gap-6 p-8 lg:p-12">
        <h4 className="font-sans font-semibold text-[28px] lg:text-[36px] leading-[1.1] tracking-[-1px] text-white">
          {service.title}
        </h4>
        <p className="font-sans font-normal text-base lg:text-lg leading-[1.5] text-white/65">
          {service.description}
        </p>
        <div className="border-t border-white/10 pt-5 flex items-center justify-between">
          <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.5px] text-white">
            {service.price}
          </span>
          <span className="font-mono font-bold text-xs uppercase tracking-[1.5px] text-[#FFE533]">
            in stock
          </span>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
            className="flex-1 bg-white text-[#0c0c0c] h-11 lg:h-12 px-5 rounded-lg font-mono font-bold text-xs lg:text-sm uppercase tracking-[1px] hover:bg-[#FFE533] transition-colors duration-300 cursor-pointer"
          >
            Get Quote
          </button>
          {service.href && (
            <Link
              href={service.href}
              className="flex-1 border border-white/20 text-white h-11 lg:h-12 px-5 rounded-lg font-mono font-bold text-xs lg:text-sm uppercase tracking-[1px] hover:border-white hover:bg-white/5 transition-all duration-300 inline-flex items-center justify-center gap-1.5"
            >
              Learn more <span aria-hidden>↗</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
