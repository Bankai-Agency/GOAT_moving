"use client";

import { useScroll } from "framer-motion";
import { GlobalScrollContextProvider } from "./useGlobalScrollProgress";

/* Mounts a single page-level useScroll observer and broadcasts the
   resulting MotionValues (scrollY + scrollYProgress) via context. Any
   descendant component can call `useGlobalScrollProgress()` to read
   them without installing its own observer. Lives outside `.page-zoom`
   so children that opt into "real viewport" coordinates (the
   MoverCompanion) can use this directly without zoom compensation. */
export function GlobalScrollProvider({ children }: { children: React.ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  return (
    <GlobalScrollContextProvider value={{ scrollY, scrollYProgress }}>
      {children}
    </GlobalScrollContextProvider>
  );
}
