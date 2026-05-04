"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
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
const subtitle =
  "Pick the service that fits — every move comes with the same crew, same insurance, same flat-rate honesty.";

/* Services pin — nivisgear-style.

   Architecture (desktop):
   - section header lives in normal flow (revealed on scroll-in).
   - tall wrapper `track` is N×100vh of scroll-budget, in normal flow.
   - inside the wrapper a `sticky top-0 h-screen` element renders the
     entire visual (bg cross-fade, card stack, counter). CSS sticky
     pins it visually while you scroll through the wrapper, then
     releases when the wrapper bottom passes the viewport.
   - sticky is used instead of ScrollTrigger pin because pin inside
     `.page-zoom` desyncs (CSS zoom multiplies the compensating
     translate). Sticky lives in normal flow and behaves correctly.
   - one ScrollTrigger drives a scrub'd timeline that does the
     card swap (yPercent), bg cross-fade, progress bar, and counter
     update. Snap to N discrete points so each scroll-tick lands
     on one card. */
export function StoryPinSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsapPlugins();

    const ctx = gsap.context(() => {
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

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const trackEl = trackRef.current;
        if (!trackEl) return;

        const total = services.length;
        const cards = cardRefs.current.filter(Boolean);
        const bgs = bgRefs.current.filter(Boolean);
        if (cards.length !== total || bgs.length !== total) return;

        cards.forEach((c, i) => gsap.set(c, { yPercent: i === 0 ? 0 : 100 }));
        bgs.forEach((b, i) => gsap.set(b, { autoAlpha: i === 0 ? 1 : 0 }));
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: trackEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            snap: {
              snapTo: (value) => Math.round(value * (total - 1)) / (total - 1),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.05,
              ease: "power2.inOut",
            },
            onUpdate: (self) => {
              if (!counterRef.current) return;
              const idx = Math.min(total - 1, Math.floor(self.progress * total + 0.0001));
              const next = `0${idx + 1}`;
              if (counterRef.current.textContent !== next) {
                counterRef.current.textContent = next;
              }
            },
          },
        });

        if (progressRef.current) {
          tl.to(progressRef.current, { scaleX: 1, duration: total - 1 }, 0);
        }

        for (let i = 1; i < total; i++) {
          const at = i - 1;
          tl.to(cards[i - 1], { yPercent: -100, ease: "power2.inOut", duration: 1 }, at);
          tl.fromTo(
            cards[i],
            { yPercent: 100 },
            { yPercent: 0, ease: "power2.inOut", duration: 1 },
            at,
          );
          tl.to(bgs[i - 1], { autoAlpha: 0, ease: "power1.in", duration: 1 }, at);
          tl.to(bgs[i], { autoAlpha: 1, ease: "power1.out", duration: 1 }, at);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const total = services.length;

  return (
    <section ref={sectionRef} id="services" className="bg-[#0c0c0c]">
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

      <div className="lg:hidden px-4 pb-[60px] flex flex-col gap-6">
        {services.map((s) => (
          <ServiceCard key={s.title} service={s} />
        ))}
      </div>

      <div
        ref={trackRef}
        className="hidden lg:block relative"
        style={{ height: `calc(${total * 100}vh * var(--zoom-comp, 1))` }}
      >
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "calc(100vh * var(--zoom-comp, 1))" }}
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
            <div className="relative w-full max-w-[1408px] h-[78vh] overflow-hidden rounded-2xl">
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

          <div
            className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono text-xs uppercase tracking-[2px] pointer-events-none"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <span ref={counterRef} className="tabular-nums">
              01
            </span>
            <span
              className="relative w-32 h-px overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <span
                ref={progressRef}
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: "#ffffff", transform: "scaleX(0)" }}
              />
            </span>
            <span className="tabular-nums">0{total}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="relative h-full bg-[#181818] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <div className="relative overflow-hidden min-h-[320px] lg:min-h-0">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div data-card-right className="flex flex-col gap-6 p-8 lg:p-12">
        <div className="flex items-center gap-2 text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE533]" />
          <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[2px]">
            {service.number} · {service.tag}
          </span>
        </div>
        <h4 className="font-sans font-semibold text-[36px] lg:text-[48px] leading-[1.1] tracking-[-1px] text-white">
          {service.title}
        </h4>
        <p className="font-sans font-normal text-base lg:text-lg leading-[1.5] text-white/70">
          {service.description}
        </p>
        <div className="flex gap-3 mt-auto">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
            className="flex-1 bg-[#FFE533] text-[#0c0c0c] h-11 lg:h-12 px-5 rounded-lg font-mono font-bold text-xs lg:text-sm uppercase tracking-[1px] hover:bg-[#f0d820] transition-colors duration-300 cursor-pointer"
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
