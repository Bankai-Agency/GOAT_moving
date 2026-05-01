"use client";

import { motion, useTransform } from "framer-motion";
import { TruckSvg } from "./TruckSvg";
import { useGlobalScrollProgress } from "./useGlobalScrollProgress";

/* Persistent truck on the right edge of the viewport (desktop only).
   Reads global scroll progress and animates two things:
     1. its vertical position (top) — so it appears to "drive down" the
        page as the user scrolls.
     2. an X offset — drives in from the right at page load, exits to
        the right at the very end.
   Lives outside `.page-zoom`, so all units below are real viewport
   units, no zoom compensation needed. Hidden on `< lg` per the plan. */
export function MoverCompanion() {
  const { scrollYProgress } = useGlobalScrollProgress();

  /* Drive in: starts off-screen right (x: 120%), settles to ~70% from
     left of viewport during 0-3% scroll. Exits at end (97-100%). */
  const x = useTransform(scrollYProgress, [0, 0.03, 0.97, 1], ["120%", "0%", "0%", "120%"]);

  /* Drives down: top moves from 64px (just below header) to ~70vh of
     the viewport, in proportion to scroll progress. */
  const top = useTransform(scrollYProgress, [0, 1], ["88px", "72vh"]);

  return (
    <motion.div
      className="hidden lg:block fixed right-6 z-40 pointer-events-none"
      style={{ x, top }}
      aria-hidden
    >
      <TruckSvg width={220} height={110} />
    </motion.div>
  );
}
