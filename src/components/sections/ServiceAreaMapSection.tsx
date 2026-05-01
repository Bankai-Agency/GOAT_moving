"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TruckSvg } from "@/components/motion/TruckSvg";
import { fadeUp, staggerContainer } from "@/components/motion/variants";

/* Cities placed roughly along the I-5 corridor — each as a fraction of
   the highway path (0..1). The truck rides the path; each pin pops as
   the truck reaches it. Coordinates picked to look right at the SVG
   viewBox 0 0 1200 480. */
type City = { name: string; sub?: string; t: number; x: number; y: number };

const cities: City[] = [
  { name: "Seattle, WA", t: 0.04, x: 80, y: 90 },
  { name: "Tacoma, WA", t: 0.16, x: 220, y: 140 },
  { name: "Vancouver, WA", t: 0.34, x: 420, y: 210, sub: "HQ" },
  { name: "Portland, OR", t: 0.42, x: 510, y: 240 },
  { name: "Beaverton, OR", t: 0.5, x: 600, y: 270 },
  { name: "Hillsboro, OR", t: 0.58, x: 680, y: 290 },
  { name: "Tigard, OR", t: 0.66, x: 760, y: 310 },
  { name: "Tualatin, OR", t: 0.74, x: 850, y: 340 },
  { name: "Oregon City, OR", t: 0.86, x: 980, y: 370 },
  { name: "Salem, OR", t: 0.96, x: 1110, y: 410 },
];

/* SVG path for the highway (a soft S-curve from top-left to
   bottom-right). Used both as the visible road and as the trajectory
   for the truck. */
const HIGHWAY_PATH =
  "M 60 80 Q 200 80 240 130 T 420 200 Q 500 230 540 245 T 720 290 Q 820 310 880 330 T 1140 410";

const label = "Where We Go";
const heading = "We move the I-5 corridor";
const subtitle = "Vancouver, Portland, Seattle, Salem and every town in between — same crew, same flat-rate pricing.";

export function ServiceAreaMapSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  /* Truck rides the path 0..1 over the section's whole scroll. */
  const pathProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section id="service-area" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div ref={trackRef} className="max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-16">
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
            <motion.h2 variants={fadeUp} className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white max-w-[900px]">
              {heading}
            </motion.h2>
            <motion.p variants={fadeUp} className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[450px]">
              {subtitle}
            </motion.p>
          </div>
        </motion.div>

        {/* Desktop: illustrated map with truck on path. */}
        <div className="hidden lg:block relative bg-[#141414] rounded-2xl overflow-hidden">
          <svg viewBox="0 0 1200 480" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            {/* faint background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <linearGradient id="hw" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE533" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FFE533" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect width="1200" height="480" fill="url(#grid)" />

            {/* Highway base (dim) */}
            <path d={HIGHWAY_PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" strokeLinecap="round" />
            {/* Highway accent (covered portion) */}
            <motion.path
              d={HIGHWAY_PATH}
              fill="none"
              stroke="url(#hw)"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ pathLength: pathProgress }}
            />

            {/* City pins */}
            {cities.map((c) => (
              <CityPin key={c.name} city={c} progress={pathProgress} />
            ))}
          </svg>

          {/* Truck rides the path via offset-path. Sits above SVG. */}
          <motion.div
            className="absolute top-0 left-0 will-change-transform"
            style={{
              offsetPath: `path("${HIGHWAY_PATH}")`,
              offsetDistance: useTransform(pathProgress, (v) => `${v * 100}%`),
              /* Container size needs to match the SVG aspect for the
                 offset-path coordinates to align with the visible
                 highway. We use width = 100% of the wrapper at
                 viewBox 1200×480. */
              width: 1200,
              height: 480,
              transform: "translate(-110px, -55px)",
            }}
          >
            <TruckSvg width={140} height={70} headlightsOn />
          </motion.div>
        </div>

        {/* Mobile: city grid (no map, no truck) */}
        <motion.div
          className="grid grid-cols-2 gap-3 lg:hidden"
          variants={staggerContainer(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cities.map((c) => (
            <motion.div
              key={c.name}
              variants={fadeUp}
              className="bg-[#181818] rounded-xl p-4 flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFE533] shrink-0" />
              <span className="font-sans font-semibold text-base text-white">{c.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CityPin({ city, progress }: { city: City; progress: ReturnType<typeof useTransform<number, number>> }) {
  /* Each city pops once the truck passes its `t` mark on the path. */
  const fillScale = useTransform(progress, [city.t - 0.04, city.t], [0, 1]);
  const labelOpacity = useTransform(progress, [city.t - 0.02, city.t + 0.02], [0, 1]);
  return (
    <g transform={`translate(${city.x} ${city.y})`}>
      {/* outer ring (always visible) */}
      <circle r="6" fill="none" stroke="rgba(255,229,51,0.35)" strokeWidth="1.5" />
      {/* fill, scales in as truck reaches */}
      <motion.circle r="6" fill="#FFE533" style={{ scale: fillScale }} />
      {/* label */}
      <motion.text
        x="14"
        y="6"
        style={{ opacity: labelOpacity }}
        fontFamily="ui-mono, monospace"
        fontSize="13"
        fontWeight="700"
        fill="#ffffff"
      >
        {city.name}
        {city.sub && (
          <tspan fill="#FFE533" fontSize="10" dx="6">
            {city.sub}
          </tspan>
        )}
      </motion.text>
    </g>
  );
}
