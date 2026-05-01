"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RatingCards } from "@/components/ui/RatingCards";
import { fadeUp, slideInRight, popIn, staggerContainer } from "@/components/motion/variants";

const headline1 = "Top-Rated Movers";
const headline2 = "in Vancouver, WA & Portland, OR";

function WordStagger({ text, className }: { text: string; className: string }) {
  return (
    <motion.span
      className={className}
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="show"
    >
      {text.split(" ").map((word, i) => (
        <motion.span key={i} variants={fadeUp} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function HeroMotionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.6]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      {/* Background image + overlay (parallax) */}
      <motion.div className="absolute inset-0" style={{ y: photoY, scale: photoScale }}>
        <Image
          src="/images/home-hero.jpg"
          alt="Professional movers at work"
          fill
          sizes="(max-width: 1024px) 200vw, 100vw"
          quality={90}
          className="object-cover"
          priority
        />
      </motion.div>
      <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

      {/* Content */}
      <div className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-6">
          {/* Left — heading + CTA */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
              <WordStagger text={headline1} className="text-white/60" />
              <br />
              <WordStagger text={headline2} className="text-white" />
            </h1>

            <motion.div
              className="flex flex-col gap-5 lg:gap-7 max-w-[569px]"
              variants={staggerContainer(0.12, 0.6)}
              initial="hidden"
              animate="show"
            >
              <motion.p
                variants={fadeUp}
                className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white"
              >
                Local, long-distance, and commercial moves — 850+ five-star
                reviews, fully licensed & insured
              </motion.p>

              <motion.div variants={staggerContainer(0.1)} className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                <motion.button
                  variants={popIn}
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                  className="btn-shine bg-[#FFE533] h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-[#0c0c0c] uppercase tracking-[-0.64px] leading-[1.2] hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
                >
                  Get Free Estimate
                </motion.button>
                <motion.div variants={popIn}>
                  <Link
                    href="#services"
                    className="border border-white h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-white uppercase tracking-[-0.64px] leading-[1.2] hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-300 ease-out"
                  >
                    Our Services
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Rating cards */}
          <motion.div variants={slideInRight} initial="hidden" animate="show" transition={{ delay: 0.5 }}>
            <RatingCards />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
