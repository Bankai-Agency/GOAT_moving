"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { fadeUp, staggerContainer } from "@/components/motion/variants";

type ServicePanel = {
  number: string;
  title: string;
  description: string;
  image: string;
  href?: string;
};

const panels: ServicePanel[] = [
  {
    number: "01",
    title: "Local Moving",
    description:
      "Residential moves within Vancouver, WA, Portland, OR, and surrounding areas. Packing, loading, transportation, unloading, and unpacking — all included with no hidden fees.",
    image: "/images/service-local.png",
    href: "/local-moving",
  },
  {
    number: "02",
    title: "Long Distance Moving",
    description:
      "Interstate moves across the US from the Pacific Northwest. Fully licensed (USDOT #4232069) and insured for cross-state relocations of any size.",
    image: "/images/service-longdistance.jpg",
    href: "/long-distance-moving",
  },
  {
    number: "03",
    title: "Commercial Moving",
    description:
      "Office and commercial relocations in Vancouver and Portland with minimal downtime. We handle equipment, furniture, and sensitive documents safely and on schedule.",
    image: "/images/service-commercial.png",
    href: "/commercial-moving",
  },
  {
    number: "04",
    title: "Packing & Labor",
    description:
      "Professional packing with quality materials for any size move. Same-building moves, loading/unloading labor, and expert handling of fragile and specialty items.",
    image: "/images/service-packing.png",
    href: "/packing-services",
  },
];

const label = "What We Do";
const heading = "Four ways we move your life";
const subtitle = "Pick the service that fits — every move comes with the same crew, same insurance, same flat-rate honesty.";

/* Lightship-style stacking card. CSS `top` sets the resting peek; the
   y transform animates between off-screen "110%" entry and "0%"
   resting. z-index per index keeps newer cards on top. */
function PanelCard({
  panel,
  index,
  total,
  progress,
}: {
  panel: ServicePanel;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const peekPx = 56;
  const restingTopPx = index * peekPx;
  const slot = total > 1 ? 1 / (total - 1) : 1;
  const enterStart = Math.max(0, (index - 1) * slot);
  const enterEnd = Math.max(enterStart + 0.0001, index * slot);
  const fromY = index === 0 ? "0%" : "110%";
  const y = useTransform(progress, [enterStart, enterEnd], [fromY, "0%"]);
  const shadowOpacity = useTransform(progress, [enterStart, enterEnd], [0, index === 0 ? 0 : 0.5]);

  const body = (
    <>
      <Image src={panel.image} alt={panel.title} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
      <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
        <div className="flex items-start justify-between">
          <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-[#FFE533]">
            {panel.number} / 0{total}
          </span>
          <span className="font-sans font-light text-[120px] lg:text-[200px] leading-none tracking-[-6px] text-white/[0.08] select-none">
            {panel.number}
          </span>
        </div>
        <div className="flex flex-col gap-4 max-w-[640px]">
          <h3 className="font-sans font-semibold text-[32px] lg:text-[56px] leading-[1.1] tracking-[-1.12px] lg:tracking-[-1.68px] text-white">
            {panel.title}
          </h3>
          <p className="font-sans font-normal text-base lg:text-lg leading-[1.4] text-white/85">
            {panel.description}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      style={{ y, zIndex: index + 1, top: `${restingTopPx}px` }}
      className="absolute inset-x-0 h-full rounded-2xl overflow-hidden bg-[#181818]"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: "0 -20px 40px -10px rgba(0,0,0,0.45)", opacity: shadowOpacity }}
      />
      {panel.href ? (
        <Link href={panel.href} className="block w-full h-full">{body}</Link>
      ) : (
        <div className="block w-full h-full">{body}</div>
      )}
    </motion.div>
  );
}

export function StoryPinSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="services" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-16">
        {/* Section header */}
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
                {label}
              </span>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-0">
            <motion.h2
              variants={fadeUp}
              className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white max-w-[900px]"
            >
              {heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[450px]"
            >
              {subtitle}
            </motion.p>
          </div>
        </motion.div>

        {/* Desktop: stacking-deck scroll track. */}
        <div ref={trackRef} className="hidden lg:block relative" style={{ height: `${panels.length * 100}vh` }}>
          <div className="sticky top-[10vh] h-[80vh] relative">
            {panels.map((p, i) => (
              <PanelCard key={p.title} panel={p} index={i} total={panels.length} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        {/* Mobile: simple stagger reveal. */}
        <motion.div
          className="grid grid-cols-1 gap-3 lg:hidden"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {panels.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="relative bg-[#181818] h-[360px] rounded-2xl overflow-hidden"
            >
              {p.href ? (
                <Link href={p.href} className="block w-full h-full">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 gap-2">
                    <span className="font-mono font-bold text-sm uppercase tracking-[-0.64px] text-[#FFE533]">
                      {p.number}
                    </span>
                    <h3 className="font-sans font-semibold text-[28px] leading-[1.2] tracking-[-0.84px] text-white">
                      {p.title}
                    </h3>
                    <p className="font-sans font-normal text-base leading-[1.4] text-white/80">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
