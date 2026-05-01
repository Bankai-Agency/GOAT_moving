"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

export function AboutMotionSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const [autoPlayed, setAutoPlayed] = useState(false);

  useEffect(() => {
    const node = videoWrapRef.current;
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
            .catch(() => {/* autoplay blocked — leave the click overlay */});
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoPlayed]);

  return (
    <section id="about" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-16">
        {/* Section label */}
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

          {/* Heading + description */}
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

        {/* Video — auto-plays muted on enter */}
        <motion.div
          ref={videoWrapRef}
          className="relative w-full h-[240px] lg:h-[577px] rounded-xl lg:rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={defaults.videoPoster}
            controls={autoPlayed}
            playsInline
            preload="metadata"
            loop
          >
            {defaults.videoSources.map((s, i) => (
              <source key={i} src={s.src} type={s.type} />
            ))}
          </video>
          {!autoPlayed && (
            <button
              type="button"
              aria-label="Play video"
              onClick={() => {
                videoRef.current?.play();
                setAutoPlayed(true);
              }}
              className="absolute inset-0 group/play cursor-pointer"
            >
              <span className="absolute inset-0 bg-black/40 group-hover/play:bg-black/30 transition-colors duration-300" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)] flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-[7px] group-hover/play:bg-[rgba(13,13,13,0.6)] group-hover/play:scale-105 transition-all duration-300 ease-out">
                <Image
                  src="/icons/play.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
                <span className="font-mono font-medium text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-white">
                  Watch Video
                </span>
              </span>
            </button>
          )}
        </motion.div>

        {/* Stats — count-up + stagger */}
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
    </section>
  );
}
