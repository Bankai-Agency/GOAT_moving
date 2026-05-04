"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { TruckSvg } from "@/components/motion/TruckSvg";

type City = { name: string; sub?: string; t: number; x: number; y: number };

const cities: City[] = [
  { name: "Seattle, WA", t: 0.04, x: 80, y: 90 },
  { name: "Tacoma, WA", t: 0.16, x: 220, y: 140 },
  { name: "Vancouver, WA", t: 0.34, x: 420, y: 210, sub: "HQ" },
  { name: "Portland, OR", t: 0.42, x: 510, y: 240 },
  { name: "Beaverton, OR", t: 0.5, x: 600, y: 270 },
  { name: "Hillsboro, OR", t: 0.58, x: 680, y: 290 },
  { name: "Tigard, OR", t: 0.66, x: 760, y: 310 },
  { name: "Tualatin, OR", t: 0.74, x: 850, y: 340 },
  { name: "Oregon City, OR", t: 0.86, x: 980, y: 370 },
  { name: "Salem, OR", t: 0.96, x: 1110, y: 410 },
];

const HIGHWAY_PATH =
  "M 60 80 Q 200 80 240 130 T 420 200 Q 500 230 540 245 T 720 290 Q 820 310 880 330 T 1140 410";

const label = "Where We Go";
const heading = "We move the I-5 corridor";
const subtitle = "Vancouver, Portland, Seattle, Salem and every town in between — same crew, same flat-rate pricing.";

export function ServiceAreaMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const highwayRef = useRef<SVGPathElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<SVGGElement[]>([]);

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

      const mql = window.matchMedia("(min-width: 1024px)");
      if (!mql.matches || !mapWrapRef.current || !highwayRef.current || !truckRef.current) return;

      /* Highway draw + truck along path + city pins, all scrubbed to
         the section's vertical scroll. */
      gsap.set(highwayRef.current, { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(truckRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mapWrapRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.5,
        },
      });

      tl.to(highwayRef.current, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      tl.to(
        truckRef.current,
        {
          autoAlpha: 1,
          motionPath: {
            path: highwayRef.current!,
            align: highwayRef.current!,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: "none",
          duration: 1,
        },
        0
      );

      /* Each pin pops as the truck crosses its `t` mark. */
      pinsRef.current.forEach((pin, i) => {
        const c = cities[i];
        const fill = pin.querySelector<SVGCircleElement>("[data-pin-fill]");
        const lab = pin.querySelector<SVGTextElement>("[data-pin-label]");
        if (fill) gsap.set(fill, { scale: 0, transformOrigin: "center center" });
        if (lab) gsap.set(lab, { autoAlpha: 0 });
        tl.to(fill, { scale: 1, ease: "back.out(2)", duration: 0.04 }, c.t);
        tl.to(lab, { autoAlpha: 1, ease: "power2.out", duration: 0.04 }, c.t);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="service-area" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-16">
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

        {/* Desktop: illustrated map with truck riding the highway. */}
        <div ref={mapWrapRef} className="hidden lg:block relative bg-[#141414] rounded-2xl overflow-hidden">
          <svg viewBox="0 0 1200 480" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1200" height="480" fill="url(#grid)" />

            {/* Highway base (dim) */}
            <path d={HIGHWAY_PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" strokeLinecap="round" />
            {/* Highway accent — drawn by ScrollTrigger via stroke-dashoffset */}
            <path
              ref={highwayRef}
              d={HIGHWAY_PATH}
              fill="none"
              stroke="#FFE533"
              strokeWidth="6"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />

            {/* City pins */}
            {cities.map((c, i) => (
              <g
                key={c.name}
                ref={(el) => {
                  if (el) pinsRef.current[i] = el;
                }}
                transform={`translate(${c.x} ${c.y})`}
              >
                <circle r="6" fill="none" stroke="rgba(255,229,51,0.35)" strokeWidth="1.5" />
                <circle data-pin-fill r="6" fill="#FFE533" />
                <text
                  data-pin-label
                  x="14"
                  y="6"
                  fontFamily="ui-monospace, monospace"
                  fontSize="13"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  {c.name}
                  {c.sub && (
                    <tspan fill="#FFE533" fontSize="10" dx="6">
                      {c.sub}
                    </tspan>
                  )}
                </text>
              </g>
            ))}
          </svg>

          {/* Truck rides the path via MotionPathPlugin. */}
          <div ref={truckRef} className="absolute top-0 left-0 will-change-transform pointer-events-none">
            <TruckSvg width={140} height={70} headlightsOn />
          </div>
        </div>

        {/* Mobile: city grid (no map / truck). */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {cities.map((c) => (
            <div key={c.name} className="bg-[#181818] rounded-xl p-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FFE533] shrink-0" />
              <span className="font-sans font-semibold text-base text-white">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
