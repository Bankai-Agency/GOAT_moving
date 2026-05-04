"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { TruckSvg } from "@/components/motion/TruckSvg";
import { useDirectionalHover } from "@/components/motion/useDirectionalHover";

const defaults = {
  heading: "Ready to experience the difference?",
  tagline: "Get your free, no-obligation quote today and let our family move yours",
  buttonText: "Get a Free Quote",
  image: "/images/cta-bg.jpg",
};

export function CTAArrivalBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const headlightRef = useRef<HTMLDivElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useDirectionalHover<HTMLButtonElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Photo parallax — full section scroll. */
      gsap.fromTo(
        photoRef.current,
        { yPercent: -8, scale: 1.08 },
        {
          yPercent: 8,
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      /* Heading rises in early. */
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 50%", scrub: true },
        }
      );

      /* Truck arrives + parks (desktop only). */
      const mql = window.matchMedia("(min-width: 1024px)");
      if (mql.matches && truckRef.current) {
        gsap.fromTo(
          truckRef.current,
          { xPercent: 120, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "center 60%", scrub: true },
          }
        );
        gsap.to(truckRef.current, {
          xPercent: -8,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: { trigger: sectionRef.current, start: "center 50%", end: "bottom top", scrub: true },
        });
        if (headlightRef.current) {
          gsap.fromTo(
            headlightRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: sectionRef.current, start: "top 50%", end: "center 50%", scrub: true },
            }
          );
        }
      }

      /* Yellow island slides up after the truck has parked. */
      gsap.fromTo(
        islandRef.current,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "center 60%", end: "bottom 70%", scrub: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[80px]">
      <div className="max-w-[1408px] mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="relative h-[600px] lg:h-[640px]">
            <div ref={photoRef} className="absolute inset-0 will-change-transform">
              <Image
                src={defaults.image}
                alt="GOAT Movers crew arriving"
                fill
                sizes="(max-width: 1024px) 200vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/35 lg:from-black/35 lg:via-black/5 lg:to-black/25" />

            <div ref={headingRef} className="absolute top-0 left-0 right-0 px-6 lg:px-12 pt-8 lg:pt-12">
              <h2 className="font-sans font-bold text-[32px] lg:text-[56px] leading-[1.1] tracking-[-0.96px] lg:tracking-[-2.24px] text-white max-w-[600px]">
                {defaults.heading}
              </h2>
            </div>

            <div ref={truckRef} className="hidden lg:block absolute bottom-[120px] left-[12%] origin-bottom-left">
              <TruckSvg width={260} height={130} headlightsOn />
              <div
                ref={headlightRef}
                className="absolute left-[-180px] bottom-[20px] w-[180px] h-[40px] rounded-full"
                style={{ background: "radial-gradient(closest-side, rgba(255,229,51,0.55), transparent)" }}
              />
            </div>

            <div ref={islandRef} className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6">
              <div className="bg-[#FFE533] rounded-xl lg:rounded-2xl px-5 lg:px-8 py-3 lg:py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <p className="font-sans font-normal text-sm lg:text-base leading-[1.4] text-[#0c0c0c]/80 lg:whitespace-nowrap">
                  {defaults.tagline}
                </p>
                <button
                  ref={ctaButtonRef}
                  onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                  style={{ "--dir-circle-bg": "#FFE533" } as React.CSSProperties}
                  className="dir-btn bg-[#0c0c0c] text-white h-[40px] lg:h-[44px] px-5 lg:px-7 rounded-lg font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] flex items-center justify-center hover:scale-[1.02] hover:text-[#0c0c0c] transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span className="dir-circle-wrap"><span className="dir-circle" /></span>
                  {defaults.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
