"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { fadeUp, staggerContainer } from "@/components/motion/variants";

type ServiceItem = {
  title: string;
  description: string;
  number: string;
  image: string;
  href?: string;
};

const services: ServiceItem[] = [
  {
    title: "Local Moving",
    description:
      "Residential moves within Vancouver, WA, Portland, OR, and surrounding areas. Packing, loading, transportation, unloading, and unpacking — all included with no hidden fees.",
    number: "01",
    image: "/images/service-local.png",
    href: "/local-moving",
  },
  {
    title: "Long Distance Moving",
    description:
      "Interstate moves across the US from the Pacific Northwest. Fully licensed (USDOT #4232069) and insured for cross-state relocations of any size.",
    number: "02",
    image: "/images/service-longdistance.jpg",
    href: "/long-distance-moving",
  },
  {
    title: "Commercial Moving",
    description:
      "Office and commercial relocations in Vancouver and Portland with minimal downtime. We handle equipment, furniture, and sensitive documents safely and on schedule.",
    number: "03",
    image: "/images/service-commercial.png",
    href: "/commercial-moving",
  },
  {
    title: "Packing & Labor",
    description:
      "Professional packing with quality materials for any size move. Same-building moves, loading/unloading labor, and expert handling of fragile and specialty items.",
    number: "04",
    image: "/images/service-packing.png",
    href: "/packing-services",
  },
];

const label = "Our Services";
const title = "Affordable Moving Services in Vancouver, WA & Portland, OR";
const subtitle = "Full-service moving — from packing to unloading. No hidden fees, no charge for stairs.";

/* Deck-stack card. The first card (index 0) is visible from the very
   beginning. Each subsequent card slides in from below the sticky frame
   and lands fully on top of the previous one as scroll progresses
   through that card's slot. After landing the card stays put. z-index
   increases per index so the latest card always covers the older ones. */
function StackingCard({
  service,
  index,
  total,
  progress,
}: {
  service: ServiceItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  /* Slot for cards 1..N-1: split the full track among them. Card 0 is
     always at rest. Web Animations API requires monotonically
     non-decreasing offsets, so card 0 needs a [0, 0+ε] degenerate
     range that maps to the resting [0%, 0%] output. */
  const slot = total > 1 ? 1 / (total - 1) : 1;
  const enterStart = Math.max(0, (index - 1) * slot);
  const enterEnd = Math.max(enterStart + 0.0001, index * slot);
  const fromY = index === 0 ? "0%" : "110%";

  const y = useTransform(progress, [enterStart, enterEnd], [fromY, "0%"]);
  const shadowOpacity = useTransform(progress, [enterStart, enterEnd], [0, index === 0 ? 0 : 0.5]);

  const cardBody = (
    <>
      <Image src={service.image} alt={service.title} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
        <div className="flex items-start justify-between">
          <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-[#FFE533]">
            {service.number} / 0{total}
          </span>
          <span className="font-sans font-light text-[120px] lg:text-[200px] leading-none tracking-[-6px] text-white/[0.08] select-none">
            {service.number}
          </span>
        </div>
        <div className="flex flex-col gap-4 max-w-[640px]">
          <h3 className="font-sans font-semibold text-[32px] lg:text-[56px] leading-[1.1] tracking-[-1.12px] lg:tracking-[-1.68px] text-white">
            {service.title}
          </h3>
          <p className="font-sans font-normal text-base lg:text-lg leading-[1.4] text-white/85">
            {service.description}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      style={{ y, zIndex: index + 1 }}
      className="absolute inset-x-0 top-0 h-full rounded-2xl overflow-hidden bg-[#181818]"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: "0 -20px 40px -10px rgba(0,0,0,0.45)",
          opacity: shadowOpacity,
        }}
      />
      {service.href ? (
        <Link href={service.href} className="block w-full h-full">
          {cardBody}
        </Link>
      ) : (
        <div className="block w-full h-full">{cardBody}</div>
      )}
    </motion.div>
  );
}

export function ServicesPinnedSection() {
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
              {title}
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
        <div ref={trackRef} className="hidden lg:block relative" style={{ height: `${services.length * 100}vh` }}>
          <div className="sticky top-[10vh] h-[80vh] relative">
            {services.map((s, i) => (
              <StackingCard
                key={s.title}
                service={s}
                index={i}
                total={services.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Mobile: simple stack with stagger reveal */}
        <motion.div
          className="grid grid-cols-1 gap-3 lg:hidden"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="relative bg-[#181818] h-[360px] rounded-2xl overflow-hidden"
            >
              {s.href ? (
                <Link href={s.href} className="block w-full h-full">
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 gap-2">
                    <span className="font-mono font-bold text-sm uppercase tracking-[-0.64px] text-[#FFE533]">
                      {s.number}
                    </span>
                    <h3 className="font-sans font-semibold text-[28px] leading-[1.2] tracking-[-0.84px] text-white">
                      {s.title}
                    </h3>
                    <p className="font-sans font-normal text-base leading-[1.4] text-white/80">
                      {s.description}
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
