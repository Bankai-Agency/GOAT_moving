"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, staggerContainer } from "./variants";

type RevealProps = {
  children: React.ReactNode;
  variants?: Variants;
  /* Fraction of the element that must be visible before animating. */
  amount?: number;
  /* Stagger child motion items inside this reveal (seconds between each). */
  stagger?: number;
  delay?: number;
  className?: string;
};

/* Generic "fade-up when in view" wrapper. For per-child stagger, pass a
   `stagger` value and use `<motion.div variants={fadeUp}>` items inside. */
export function RevealOnScroll({
  children,
  variants,
  amount = 0.3,
  stagger,
  delay = 0,
  className,
}: RevealProps) {
  const v: Variants = stagger ? staggerContainer(stagger, delay) : (variants ?? fadeUp);

  return (
    <motion.div
      className={className}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
