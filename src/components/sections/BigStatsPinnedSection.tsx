"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type BigStat = { value: string; label: string; sub?: string };

const stats: BigStat[] = [
  { value: "850+", label: "Five-star reviews", sub: "Verified across Google & Yelp" },
  { value: "3,000+", label: "Successful moves", sub: "Across the I-5 corridor" },
  { value: "7 yrs", label: "In business", sub: "Family-owned since 2019" },
  { value: "100%", label: "Licensed & insured", sub: "USDOT #4232069" },
];

function PinnedStatSlide({
  stat,
  index,
  total,
  progress,
}: {
  stat: BigStat;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const slot = 1 / total;
  const start = index * slot;
  const peak = start + slot * 0.5;
  const end = (index + 1) * slot;
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.04), peak, Math.min(1, end + 0.04)],
    [0, 1, 0]
  );
  const y = useTransform(progress, [start, peak, end], [80, 0, -80]);
  const scale = useTransform(progress, [start, peak, end], [0.92, 1, 0.92]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
    >
      <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.5px] text-white/50 mb-6">
        0{index + 1} / 0{total}
      </span>
      <span className="font-sans font-bold text-[120px] lg:text-[260px] leading-[0.9] tracking-[-6px] lg:tracking-[-14px] text-white">
        {stat.value}
      </span>
      <span className="font-sans font-semibold text-2xl lg:text-5xl leading-[1.1] tracking-[-0.96px] lg:tracking-[-1.6px] text-white mt-6">
        {stat.label}
      </span>
      {stat.sub && (
        <span className="font-sans font-normal text-base lg:text-xl leading-[1.4] text-white/60 mt-3 max-w-[480px]">
          {stat.sub}
        </span>
      )}
    </motion.div>
  );
}

export function BigStatsPinnedSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="bg-[#0c0c0c]">
      {/* Mobile: stacked stats with stagger reveal. */}
      <div className="lg:hidden px-4 py-[60px] flex flex-col gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <span className="font-mono font-bold text-sm uppercase tracking-[-0.5px] text-white/50 mb-4">
              0{i + 1} / 0{stats.length}
            </span>
            <span className="font-sans font-bold text-[100px] leading-[0.9] tracking-[-4px] text-white">
              {s.value}
            </span>
            <span className="font-sans font-semibold text-2xl leading-[1.1] tracking-[-0.96px] text-white mt-4">
              {s.label}
            </span>
            {s.sub && (
              <span className="font-sans font-normal text-base text-white/60 mt-2">{s.sub}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Desktop: pinned scroll-driven slides. */}
      <div ref={trackRef} className="hidden lg:block relative" style={{ height: `${stats.length * 100}vh` }}>
        <div className="sticky top-0 h-screen relative overflow-hidden">
          {stats.map((s, i) => (
            <PinnedStatSlide
              key={s.label}
              stat={s}
              index={i}
              total={stats.length}
              progress={scrollYProgress}
            />
          ))}
          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-[#FFE533]"
            style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%", width: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}
