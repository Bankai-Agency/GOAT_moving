"use client";

import { createContext, useContext } from "react";
import { type MotionValue, useMotionValue } from "framer-motion";

/* Page-level scroll progress (0..1 over the whole document) and the
   raw scrollY pixel value, exposed via React context so each section
   and the MoverCompanion can read the same values without setting up
   their own observers. Provided by `<GlobalScrollProvider>` mounted
   in the page root. */
export type GlobalScrollProgress = {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

const fallbackY = { get: () => 0 } as unknown as MotionValue<number>;

const GlobalScrollContext = createContext<GlobalScrollProgress>({
  scrollY: fallbackY,
  scrollYProgress: fallbackY,
});

export const GlobalScrollContextProvider = GlobalScrollContext.Provider;

export function useGlobalScrollProgress(): GlobalScrollProgress {
  return useContext(GlobalScrollContext);
}

/* Helper for SSR-safe stub values (used when consumers want a stable
   MotionValue-shaped fallback before mount). */
export function useStubMotionValue(initial = 0) {
  return useMotionValue(initial);
}
