"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterProps = {
  text: string;
  /* ms per character */
  speed?: number;
  className?: string;
  /* start typing only when the element scrolls into view */
  triggerOnce?: boolean;
};

/* Tiny self-contained typewriter — IntersectionObserver triggers the
   character-by-character reveal when the element first enters view. */
export function Typewriter({ text, speed = 35, className, triggerOnce = true }: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || (triggerOnce && startedRef.current)) return;
        startedRef.current = true;
        if (triggerOnce) observer.disconnect();
        let i = 0;
        const tick = () => {
          i += 1;
          setShown(text.slice(0, i));
          if (i < text.length) setTimeout(tick, speed);
        };
        tick();
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [text, speed, triggerOnce]);

  return (
    <span ref={ref} className={className}>
      {shown}
      <span className="inline-block w-[2px] h-[0.9em] align-middle bg-current ml-1 animate-pulse" />
    </span>
  );
}
