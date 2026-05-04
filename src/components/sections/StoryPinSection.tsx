"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";

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

/* Slot height per card (in viewport units). Cards have a slight
   negative margin so each new card's top peek over the previous.   */
const CARD_VH = 90;
const OVERLAP_VH = 12;

export function StoryPinSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
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

      /* Background cross-fade — driven by which card is currently
         centered in the viewport. Each card has a corresponding bg
         layer; we tween its opacity to 1 when its card enters the
         viewport center, and to 0 when leaves. */
      cardRefs.current.forEach((card, i) => {
        const bg = bgRefs.current[i];
        if (!card || !bg) return;
        gsap.set(bg, { opacity: i === 0 ? 1 : 0 });

        ScrollTriggerActivator(card, bg, bgRefs.current);
      });

      /* Card reveal — three columns stagger in as each card hits the
         viewport. */
      cardRefs.current.forEach((card) => {
        const left = card.querySelector<HTMLElement>("[data-card-left]");
        const center = card.querySelector<HTMLElement>("[data-card-center]");
        const right = card.querySelector<HTMLElement>("[data-card-right]");

        if (left && center && right) {
          gsap.from([left, right], {
            scrollTrigger: { trigger: card, start: "top 75%" },
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
          });
          gsap.from(center, {
            scrollTrigger: { trigger: card, start: "top 75%" },
            y: 80,
            scale: 0.92,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.05,
          });
        }

        const img = card.querySelector<HTMLElement>("[data-card-img]");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: 6 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px] overflow-hidden">
      {/* Sticky blurred background layer — each service has its own
          bg image stacked here, fading in when its card is in view. */}
      <div ref={bgLayerRef} className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 h-screen w-full">
          {services.map((s, i) => (
            <div
              key={s.title}
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
                className="object-cover scale-110"
                style={{ filter: "blur(60px) saturate(1.05) brightness(0.85)" }}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-16">
        <div ref={headerRef} className="flex flex-col gap-6 lg:gap-12">
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

        <div className="flex flex-col">
          {services.map((s, i) => (
            <div
              key={s.title}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="relative"
              style={{
                marginTop: i === 0 ? 0 : `-${OVERLAP_VH}vh`,
                minHeight: `${CARD_VH}vh`,
              }}
            >
              <ServiceCard service={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Wires a card to its background image: bg fades in as the card
   reaches viewport center, and fades back out as it leaves. Other
   bgs are not touched here — each card has its own activator, so a
   later card's "fade in" naturally overlays the earlier one. */
function ScrollTriggerActivator(card: HTMLElement, bg: HTMLElement, allBgs: HTMLElement[]) {
  gsap.to(bg, {
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: card,
      start: "top 60%",
      end: "top 30%",
      scrub: true,
      onEnter: () => fadeOthers(bg, allBgs),
      onEnterBack: () => fadeOthers(bg, allBgs),
    },
  });
}

function fadeOthers(active: HTMLElement, all: HTMLElement[]) {
  all.forEach((bg) => {
    if (bg === active) return;
    gsap.to(bg, { opacity: 0, duration: 0.6, ease: "power2.out" });
  });
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="relative bg-[#181818] rounded-2xl overflow-visible grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[520px]">
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

      <div
        data-card-center
        className="lg:col-span-5 relative overflow-visible min-h-[320px] lg:min-h-[520px]"
      >
        <div
          data-card-img
          className="absolute inset-x-4 lg:inset-x-0 lg:-top-12 lg:-bottom-8 top-0 bottom-0 will-change-transform"
        >
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover rounded-xl lg:rounded-2xl"
          />
        </div>
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
