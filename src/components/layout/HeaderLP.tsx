"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Same visual look as the main Header, but every link is an in-page anchor.
 *  No back-link to the corporate site — the LP is a self-contained funnel. */

type AnchorLink = { label: string; href: string };

const navLinks: AnchorLink[] = [
  { label: "Pricing", href: "#pricing" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacts", href: "#contact" },
];

export function HeaderLP() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sticky header state
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const HERO_HEIGHT = 200;
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY <= HERO_HEIGHT) {
          setIsSticky(false);
          setIsVisible(true);
        } else {
          setIsSticky(true);
          if (currentScrollY < lastScrollY.current) setIsVisible(true);
          else setIsVisible(false);
        }
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleAnchor = (href: string) => {
    closeMobileMenu();
    if (href === "#top") {
      scrollToTop();
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`left-0 right-0 z-50 transition-all duration-300 ease-out border-b border-white/10 ${
          isSticky
            ? `fixed ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`
            : "absolute top-0"
        }`}
        style={isSticky ? { backdropFilter: "blur(15px)", backgroundColor: "rgba(12,12,12,0.85)" } : undefined}
      >
        <div className="max-w-[1408px] mx-auto px-4 flex items-center justify-between h-[84px]">
          {/* Logo — scrolls to top, no link */}
          <button
            onClick={scrollToTop}
            className="shrink-0 group/logo relative cursor-pointer"
            aria-label="Scroll to top"
          >
            <Image
              src="/icons/logo.svg"
              alt="GOAT Movers"
              width={82}
              height={39}
              priority
              className="transition-all duration-300 ease-out group-hover/logo:scale-110 group-hover/logo:brightness-125 group-hover/logo:drop-shadow-[0_0_12px_rgba(255,229,51,0.5)]"
            />
          </button>

          {/* Desktop Nav + CTA */}
          <div className="hidden lg:flex items-center gap-9">
            <nav
              className={`flex items-center gap-1 p-2 rounded-[7px] transition-all duration-300 ${
                isSticky ? "" : "backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)]"
              }`}
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleAnchor(link.href)}
                  className="flex items-center gap-1 px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] transition-all duration-200 ease-out whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div
              className={`flex items-center gap-1 p-2 rounded-[7px] transition-all duration-300 ${
                isSticky ? "" : "backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)]"
              }`}
            >
              <a
                href="tel:+13805240846"
                className="flex items-center gap-2.5 px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] text-white whitespace-nowrap hover:bg-white/10 transition-all duration-200 ease-out"
              >
                +1 380-524-0846
                <Image src="/icons/phone-yellow.svg" alt="" width={20} height={20} />
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event("open-quote-modal"))}
                className="btn-shine bg-[#FFE533] px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] text-[#0c0c0c] whitespace-nowrap hover:bg-[#f0d820] hover:shadow-[0_4px_16px_rgba(255,229,51,0.3)] transition-all duration-200 ease-out"
              >
                Get a Free Quote
              </button>
            </div>
          </div>

          {/* Mobile: phone + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href="tel:+13805240846"
              className="w-10 h-10 rounded-full backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)] flex items-center justify-center"
            >
              <Image src="/icons/phone-yellow.svg" alt="Call" width={18} height={18} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)] flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M14 4L4 14M4 4L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M1 1H17M1 7H17M1 13H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden flex flex-col transition-all duration-400 ease-out ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 -z-10">
          <Image src="/images/menu-bg.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="absolute inset-0 -z-[5] backdrop-blur-[59px] bg-[rgba(17,17,17,0.5)]" />

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 h-[84px] shrink-0">
          <button onClick={() => { closeMobileMenu(); scrollToTop(); }} className="shrink-0 cursor-pointer">
            <Image src="/icons/logo.svg" alt="GOAT Movers" width={82} height={39} />
          </button>
          <button
            onClick={closeMobileMenu}
            className="h-[44px] px-5 rounded-full bg-white/10 flex items-center justify-center cursor-pointer font-mono font-bold text-sm uppercase tracking-[-0.56px] text-white/70 hover:bg-white/15 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex flex-col justify-end px-4 pb-6 overflow-y-auto">
          <nav className="flex flex-col">
            {navLinks.map((link, i) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href)}
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.3s ease-out ${0.1 + i * 0.05}s, transform 0.3s ease-out ${0.1 + i * 0.05}s`,
                }}
                className="text-left font-sans font-semibold text-[32px] leading-[1.2] tracking-[-0.96px] text-white hover:text-[#FFE533] transition-colors duration-200 py-3 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom CTAs */}
        <div className="px-4 pb-8 flex flex-col gap-3 shrink-0">
          <a
            href="tel:+13805240846"
            className="flex items-center justify-center gap-2.5 h-[56px] rounded-lg bg-white/5 font-mono font-bold text-base uppercase tracking-[-0.64px] text-white hover:bg-white/10 transition-colors"
          >
            <Image src="/icons/phone-yellow.svg" alt="" width={20} height={20} />
            +1 380-524-0846
          </a>
          <button
            onClick={() => {
              closeMobileMenu();
              window.dispatchEvent(new Event("open-quote-modal"));
            }}
            className="flex items-center justify-center h-[56px] rounded-lg bg-[#FFE533] font-mono font-bold text-base uppercase tracking-[-0.64px] text-[#0c0c0c] hover:bg-[#f0d820] transition-colors"
          >
            Get a Free Quote
          </button>
        </div>
      </div>
    </>
  );
}
