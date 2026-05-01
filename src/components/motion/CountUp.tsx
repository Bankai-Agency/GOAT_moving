"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type CountUpProps = {
  /* Source string like "850+", "4.9", "100%", "7+". Numeric portion is
     animated; prefix/suffix are kept verbatim. */
  value: string;
  duration?: number;
  className?: string;
};

function parse(value: string) {
  const match = value.match(/^(\D*)(\d[\d.,]*)(\D*)$/);
  if (!match) return { prefix: "", target: 0, suffix: value, decimals: 0 };
  const [, prefix, num, suffix] = match;
  const cleaned = num.replace(",", ".");
  const target = parseFloat(cleaned);
  const decimals = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;
  return { prefix, target, suffix, decimals };
}

export function CountUp({ value, duration = 1.5, className }: CountUpProps) {
  const { prefix, target, suffix, decimals } = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() => (reduced ? target : 0));
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();
        const start = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          setDisplay(target * ease(t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
