"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TruckSvg } from "@/components/motion/TruckSvg";

const defaults = {
  heading: "Ready to experience the difference?",
  tagline: "Get your free, no-obligation quote today and let our family move yours",
  buttonText: "Get a Free Quote",
  image: "/images/cta-bg.jpg",
};

export function CTAArrivalBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Photo parallax */
  const photoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.02]);

  /* Truck arrives from off-screen right and parks at ~25% from left
     of the panel as the section crosses the viewport center. */
  const truckX = useTransform(scrollYProgress, [0.15, 0.55, 0.85], ["120%", "0%", "-8%"]);
  const truckOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.85, 0.95], [0, 1, 1, 0]);
  const headlightsOn = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);

  /* Yellow island slides up once the truck has parked. */
  const islandY = useTransform(scrollYProgress, [0.5, 0.7], ["120%", "0%"]);
  const islandOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);

  /* Heading fades in early. */
  const headingY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

  return (
    <section ref={sectionRef} id="cta" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[80px]">
      <div className="max-w-[1408px] mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="relative h-[600px] lg:h-[640px]">
            {/* Background photo with subtle parallax */}
            <motion.div className="absolute inset-0" style={{ y: photoY, scale: photoScale }}>
              <Image
                src={defaults.image}
                alt="GOAT Movers crew arriving"
                fill
                sizes="(max-width: 1024px) 200vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/35 lg:from-black/35 lg:via-black/5 lg:to-black/25" />

            {/* Heading top-left */}
            <motion.div
              className="absolute top-0 left-0 right-0 px-6 lg:px-12 pt-8 lg:pt-12"
              style={{ y: headingY, opacity: headingOpacity }}
            >
              <h2 className="font-sans font-bold text-[32px] lg:text-[56px] leading-[1.1] tracking-[-0.96px] lg:tracking-[-2.24px] text-white max-w-[600px]">
                {defaults.heading}
              </h2>
            </motion.div>

            {/* Truck pulls up — desktop only (the arrival beat). */}
            <motion.div
              className="hidden lg:block absolute bottom-[120px] left-[12%] origin-bottom-left"
              style={{ x: truckX, opacity: truckOpacity }}
            >
              <motion.div style={{ opacity: 1 }}>
                <TruckSvg width={260} height={130} headlightsOn />
              </motion.div>
              {/* Headlight glow on the wall to the left */}
              <motion.div
                className="absolute left-[-180px] bottom-[20px] w-[180px] h-[40px] rounded-full"
                style={{
                  background: "radial-gradient(closest-side, rgba(255,229,51,0.55), transparent)",
                  opacity: headlightsOn,
                }}
              />
            </motion.div>

            {/* Yellow island bar drops down */}
            <motion.div
              className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6"
              style={{ y: islandY, opacity: islandOpacity }}
            >
              <div className="bg-[#FFE533] rounded-xl lg:rounded-2xl px-5 lg:px-8 py-3 lg:py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <p className="font-sans font-normal text-sm lg:text-base leading-[1.4] text-[#0c0c0c]/80 lg:whitespace-nowrap">
                  {defaults.tagline}
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                  className="bg-[#0c0c0c] text-white h-[40px] lg:h-[44px] px-5 lg:px-7 rounded-lg font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] flex items-center justify-center hover:bg-[#1a1a1a] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0"
                >
                  {defaults.buttonText}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
