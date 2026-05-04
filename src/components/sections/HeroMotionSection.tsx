"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { RatingCards } from "@/components/ui/RatingCards";

const headlineLine1 = "Top-Rated Movers";
const headlineLine2 = "in Vancouver, WA & Portland, OR";

const letter: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: -45 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.025 },
  }),
};

function LetterStagger({ text, className, baseIndex = 0 }: { text: string; className: string; baseIndex?: number }) {
  return (
    <span className={className} style={{ display: "inline-block", perspective: "1000px" }}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          custom={baseIndex + i}
          variants={letter}
          initial="hidden"
          animate="show"
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function HeroMotionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.75]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.85], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] lg:min-h-[900px] overflow-hidden">
      {/* Background image + overlay (heavy parallax) */}
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
      <motion.div
        className="relative h-full max-w-[1408px] mx-auto px-4 flex items-end pb-8 lg:pb-[72px]"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-6">
          {/* Left — heading + CTA */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <h1 className="font-sans font-bold text-[40px] lg:text-[96px] leading-none tracking-[-1.2px] lg:tracking-[-2.88px]">
              <LetterStagger text={headlineLine1} className="text-[#FFE533]" />
              <br />
              <LetterStagger text={headlineLine2} className="text-white" baseIndex={headlineLine1.length} />
            </h1>

            <motion.div
              className="flex flex-col gap-5 lg:gap-7 max-w-[569px]"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.15, delayChildren: 1.6 } },
              }}
            >
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="font-sans font-normal text-base lg:text-2xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.72px] text-white"
              >
                Local, long-distance, and commercial moves — 850+ five-star
                reviews, fully licensed & insured
              </motion.p>

              <motion.div
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.12 } },
                }}
                className="flex flex-col lg:flex-row gap-3 lg:gap-6"
              >
                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.9 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-quote-modal"))}
                  className="btn-shine bg-[#FFE533] h-[48px] lg:h-[52px] flex items-center justify-center px-8 rounded-lg font-mono font-bold text-sm lg:text-base text-[#0c0c0c] uppercase tracking-[-0.64px] leading-[1.2] hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
                >
                  Get Free Estimate
                </motion.button>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.9 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
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
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.8, delay: 1.9, ease: [0.16, 1, 0.3, 1] } }}
          >
            <RatingCards />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 2.4, duration: 0.6 } }}
      >
        <span className="font-mono font-bold text-xs uppercase tracking-[2px]">Scroll</span>
        <motion.span
          className="w-[1px] h-10 bg-white/40"
          animate={{ scaleY: [0.4, 1, 0.4], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
