"use client";

import { motion } from "framer-motion";

type MarqueeBandProps = {
  items: string[];
  /* Pixels per second */
  speed?: number;
  className?: string;
};

/* Infinite-scrolling text band. Used between sections to create the
   "industrial readout" feel from terminal-industries.com. */
export function MarqueeBand({
  items,
  speed = 60,
  className = "bg-[#FFE533] text-[#0c0c0c]",
}: MarqueeBandProps) {
  const text = items.join("  •  ");
  const repeated = Array(8).fill(text);
  const distance = 1600;
  const duration = distance / speed;

  return (
    <div className={`overflow-hidden border-y border-white/10 ${className}`}>
      <motion.div
        className="flex gap-12 py-5 lg:py-7 whitespace-nowrap font-mono font-bold text-lg lg:text-2xl uppercase tracking-[-0.5px]"
        animate={{ x: [0, -distance] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((t, i) => (
          <span key={i} className="shrink-0">
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
