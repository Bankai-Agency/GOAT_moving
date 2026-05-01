"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CountUp } from "@/components/motion/CountUp";
import { fadeUp, staggerContainer } from "@/components/motion/variants";

type AboutStat = { icon: string; value: string; label: string };

const defaultStats: AboutStat[] = [
  { icon: "/icons/year.svg", value: "7+", label: "Years in Business" },
  { icon: "/icons/review.svg", value: "850+", label: "Verified Reviews" },
  { icon: "/icons/star.svg", value: "4.9", label: "Google Rating" },
  { icon: "/icons/license.svg", value: "100%", label: "Licensed & Insured" },
];

const defaults = {
  label: "About Us",
  title: "Family-Owned Movers Serving the I-5 Corridor Since 2019",
  description:
    "GOAT Movers is a fully licensed and insured moving company (USDOT #4232069) based in Vancouver, WA. We serve the entire I-5 corridor — Vancouver, Portland, Beaverton, Hillsboro, Camas, and beyond. 3,000+ moves completed, 850+ five-star reviews, and zero hidden fees.",
  videoPoster: "https://r2.vidzflow.com/thumbnails/TyAtuYsIfT_1749538484.jpg",
  videoSources: [
    { src: "https://r2.vidzflow.com/v/TyAtuYsIfT_720p_1749538480.mp4", type: "video/mp4" },
    { src: "https://r2.vidzflow.com/v/TyAtuYsIfT_1080p_1749538480.mp4", type: "video/mp4" },
  ],
};

/* The pinned video sits inside `.page-zoom` which scales every
   descendant by 0.7-1.0 depending on breakpoint. We use a 100vw/100vh
   base box and over-scale (1.6×) at peak so the video visually fills
   the viewport at every breakpoint — the overflow-hidden parent clips
   the excess on the larger (zoom: 1.0) breakpoints. */
const PEAK_SCALE = 1.6;
const REST_SCALE = 0.55;

export function AboutMotionSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [autoPlayed, setAutoPlayed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  /* Box → full-bleed → box, with a long held middle. */
  const innerScale = useTransform(
    scrollYProgress,
    [0.05, 0.22, 0.78, 0.92],
    [REST_SCALE, PEAK_SCALE, PEAK_SCALE, REST_SCALE]
  );
  const radius = useTransform(scrollYProgress, [0.05, 0.22, 0.78, 0.92], [16, 0, 0, 16]);
  const overlayOpacity = useTransform(scrollYProgress, [0.18, 0.28, 0.7, 0.82], [0, 0.18, 0.18, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.22, 0.32, 0.7, 0.78], [0, 1, 1, 0]);
  const captionY = useTransform(scrollYProgress, [0.22, 0.32], [40, 0]);

  /* Auto-play muted as soon as the section enters the viewport. */
  useEffect(() => {
    const node = trackRef.current;
    if (!node || autoPlayed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current
            .play()
            .then(() => {
              setAutoPlayed(true);
              observer.disconnect();
            })
            .catch(() => {/* autoplay blocked */});
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoPlayed]);

  return (
    <section id="about" className="bg-[#0c0c0c]">
      {/* Header — natural flow */}
      <div className="px-4 pt-[60px] lg:pt-[100px]">
        <div className="max-w-[1408px] mx-auto">
          <motion.div
            className="flex flex-col gap-6 lg:gap-12"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div variants={fadeUp} className="border-b border-white/16 pb-4 lg:pb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
                <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                  {defaults.label}
                </span>
              </div>
            </motion.div>
            <div className="flex flex-col gap-3 lg:gap-4">
              <motion.h2
                variants={fadeUp}
                className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white"
              >
                {defaults.title}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60"
              >
                {defaults.description}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pinned video moment — desktop only. 300vh scroll budget. */}
      <div ref={trackRef} className="hidden lg:block relative" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <motion.div
            className="relative bg-black overflow-hidden"
            style={{
              width: "100vw",
              height: "100vh",
              borderRadius: radius,
              scale: innerScale,
            }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={defaults.videoPoster}
              playsInline
              preload="metadata"
              loop
              muted
              autoPlay
            >
              {defaults.videoSources.map((s, i) => (
                <source key={i} src={s.src} type={s.type} />
              ))}
            </video>
            <motion.div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: overlayOpacity }} />
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none text-center px-4"
              style={{ opacity: captionOpacity, y: captionY }}
            >
              <span className="font-mono font-bold text-sm uppercase tracking-[2px] text-white/70">
                Inside a GOAT Movers crew
              </span>
              <span className="font-sans font-semibold text-2xl lg:text-3xl text-white">
                850+ five-star moves and counting
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile: original boxed video (no pin) */}
      <div className="lg:hidden px-4 pt-8">
        <div className="max-w-[1408px] mx-auto">
          <div className="relative w-full h-[240px] rounded-xl overflow-hidden">
            <video
              className="w-full h-full object-cover"
              poster={defaults.videoPoster}
              controls
              playsInline
              preload="metadata"
              muted
            >
              {defaults.videoSources.map((s, i) => (
                <source key={i} src={s.src} type={s.type} />
              ))}
            </video>
          </div>
        </div>
      </div>

      {/* Stats — count-up + stagger */}
      <div className="px-4 pt-8 lg:pt-16 pb-[60px] lg:pb-[100px]">
        <div className="max-w-[1408px] mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row gap-4 lg:gap-5"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {defaultStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="flex items-center gap-4 lg:gap-6 lg:flex-1 group/stat"
              >
                <div className="bg-[#181818] rounded-lg w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center shrink-0 shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)] group-hover/stat:bg-[#1e1e1e] group-hover/stat:shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover/stat:scale-105 transition-all duration-300 ease-out">
                  <Image src={stat.icon} alt="" width={36} height={36} className="w-6 h-6 lg:w-9 lg:h-9" />
                </div>
                <div className="flex flex-col gap-1">
                  <CountUp
                    value={stat.value}
                    className="font-sans font-bold text-2xl lg:text-[32px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.96px] text-white"
                  />
                  <span className="font-sans font-normal text-lg lg:text-xl leading-[1.4] tracking-[-0.54px] lg:tracking-[-0.6px] text-white/60">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
