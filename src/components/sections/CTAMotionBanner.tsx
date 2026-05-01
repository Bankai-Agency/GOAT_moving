"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp } from "@/components/motion/variants";

const defaults = {
  heading: "Ready to experience the difference?",
  tagline: "Get your free, no-obligation quote today and let our family move yours",
  buttonText: "Get a Free Quote",
  image: "/images/cta-bg.jpg",
};

export function CTAMotionBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.05]);

  return (
    <section ref={sectionRef} id="cta" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[80px]">
      <div className="max-w-[1408px] mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="relative h-[600px] lg:h-[640px]">
            <motion.div className="absolute inset-0" style={{ y: photoY, scale: photoScale }}>
              <Image
                src={defaults.image}
                alt="GOAT Movers team"
                fill
                sizes="(max-width: 1024px) 200vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/30 lg:from-black/40 lg:via-black/10 lg:to-black/20" />

            <motion.div
              className="absolute top-0 left-0 right-0 px-6 lg:px-12 pt-8 lg:pt-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="font-sans font-bold text-[32px] lg:text-[56px] leading-[1.1] tracking-[-0.96px] lg:tracking-[-2.24px] text-white max-w-[600px]">
                {defaults.heading}
              </h2>
            </motion.div>

            <motion.div
              className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
              }}
              viewport={{ once: true, amount: 0.5 }}
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
