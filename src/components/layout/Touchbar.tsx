"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Touchbar() {
  const [visible, setVisible] = useState(false);

  // Show only after the user has scrolled past the hero (~80% of viewport height)
  useEffect(() => {
    const threshold = () => Math.max(window.innerHeight * 0.8, 600);
    const onScroll = () => {
      setVisible(window.scrollY > threshold());
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ease-out"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <div className="flex h-[60px] bg-[#0c0c0c] border-t border-white/10">
        {/* Email */}
        <Link
          href="mailto:info@goat-moving.com"
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white/80 active:bg-white/5 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFE533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span className="text-xs font-sans tracking-wide">Email</span>
        </Link>

        {/* Divider */}
        <div className="w-px bg-white/10" />

        {/* Call */}
        <Link
          href="tel:+13805240846"
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white/80 active:bg-white/5 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFE533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-xs font-sans tracking-wide">Call</span>
        </Link>

        {/* Divider */}
        <div className="w-px bg-white/10" />

        {/* Get a Quote */}
        <button
          onClick={() => window.dispatchEvent(new Event("open-quote-modal"))}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white/80 active:bg-white/5 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFE533" stroke="#FFE533" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-xs font-sans tracking-wide">Get a Quote</span>
        </button>
      </div>
    </div>
  );
}
