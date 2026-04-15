"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { locationConfigs } from "@/app/_locations/locationConfigs";

const servicesDropdown = [
  { label: "Local Moving", href: "/local-moving" },
  { label: "Long Distance Moving", href: "/long-distance-moving" },
  { label: "Commercial Moving", href: "/commercial-moving" },
  { label: "Packing & Labor", href: "/packing-services" },
];

const locationsDropdown = locationConfigs.map((c) => ({
  label: `${c.city}, ${c.state}`,
  href: `/${c.slug}`,
}));

type NavLink = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  items?: { label: string; href: string }[];
  badge?: string;
};

const navLinks: NavLink[] = [
  { label: "Services", href: "#services", hasDropdown: true, items: servicesDropdown },
  { label: "Locations", href: "#locations", hasDropdown: true, items: locationsDropdown },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacts", href: "/contacts" },
];

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Sticky header state
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateDropdownPos = useCallback((label: string) => {
    const btn = buttonRefs.current[label];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMobileSubmenu(null);
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Scroll listener for sticky header
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

          if (currentScrollY < lastScrollY.current) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
            setOpenDropdown(null);
          }
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeDropdownItems = openDropdown
    ? navLinks.find((l) => l.label === openDropdown)?.items
    : null;

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
        <div className="max-w-[1408px] mx-auto px-4 flex items-center justify-between h-[84px] lg:h-[84px] border-b border-white/10 lg:border-b-0">
          {/* Logo */}
          <Link href="/" className="shrink-0 group/logo relative">
            <Image
              src="/icons/logo.svg"
              alt="GOAT Movers"
              width={82}
              height={39}
              priority
              className="transition-all duration-300 ease-out group-hover/logo:scale-110 group-hover/logo:brightness-125 group-hover/logo:drop-shadow-[0_0_12px_rgba(255,229,51,0.5)]"
            />
          </Link>

          {/* Desktop Nav + CTA */}
          <div className="hidden lg:flex items-center gap-9">
            {/* Navigation */}
            <nav className={`flex items-center gap-1 p-2 rounded-[7px] transition-all duration-300 ${
              isSticky ? "" : "backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)]"
            }`}>
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <button
                    key={link.label}
                    ref={(el) => { buttonRefs.current[link.label] = el; }}
                    onClick={() => {
                      if (openDropdown === link.label) {
                        setOpenDropdown(null);
                      } else {
                        setOpenDropdown(link.label);
                        updateDropdownPos(link.label);
                      }
                    }}
                    className="flex items-center gap-1 px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] transition-all duration-200 ease-out whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="ml-1 bg-[#FFE533] text-[#0c0c0c] font-mono font-bold text-[10px] uppercase leading-none tracking-[0] rounded-[3px] px-1.5 py-0.5">
                        {link.badge}
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 text-current opacity-70 transition-transform duration-200 ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] transition-all duration-200 ease-out whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="bg-[#FFE533] text-[#0c0c0c] font-mono font-bold text-[10px] uppercase leading-none tracking-[0] rounded-[3px] px-1.5 py-0.5">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </nav>

            {/* Phone + CTA */}
            <div className={`flex items-center gap-1 p-2 rounded-[7px] transition-all duration-300 ${
              isSticky ? "" : "backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)]"
            }`}>
              <a
                href="tel:+13805240846"
                className="flex items-center gap-2.5 px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] text-white whitespace-nowrap hover:bg-white/10 transition-all duration-200 ease-out"
              >
                +1 380-524-0846
                <Image
                  src="/icons/phone-yellow.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event("open-quote-modal"))}
                className="btn-shine bg-[#FFE533] px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] text-[#0c0c0c] whitespace-nowrap hover:bg-[#f0d820] hover:shadow-[0_4px_16px_rgba(255,229,51,0.3)] transition-all duration-200 ease-out"
              >
                Request a Quote
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

        {/* Desktop Dropdown */}
        {activeDropdownItems && (
          <div
            className="hidden lg:flex fixed z-[60] rounded-[7px] p-2 flex-col gap-1 animate-dropdown-in backdrop-blur-[20px] bg-[rgba(13,13,13,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            {activeDropdownItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className="px-4 py-3 rounded-[4px] font-mono text-sm font-medium uppercase tracking-[-0.56px] leading-[1.2] text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden flex flex-col transition-all duration-400 ease-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background image + dark overlay + glass */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/menu-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="absolute inset-0 -z-[5] backdrop-blur-[59px] bg-[rgba(17,17,17,0.5)]" />

        {/* Top bar: logo + close */}
        <div className="flex items-center justify-between px-4 h-[84px] shrink-0">
          <Link href="/" onClick={closeMobileMenu} className="shrink-0">
            <Image src="/icons/logo.svg" alt="GOAT Movers" width={82} height={39} />
          </Link>
          <button
            onClick={closeMobileMenu}
            className="h-[44px] px-5 rounded-full bg-white/10 flex items-center justify-center cursor-pointer font-mono font-bold text-sm uppercase tracking-[-0.56px] text-white/70 hover:bg-white/15 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Nav links — pushed to bottom with flex-1 spacer */}
        <div className="flex-1 flex flex-col justify-end px-4 pb-6 overflow-y-auto">
          <nav className="flex flex-col">
            {[...navLinks, { label: "Contacts", href: "/contacts", hasDropdown: false, items: undefined }].map((link, i) => (
              <div
                key={link.label}
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.3s ease-out ${0.1 + i * 0.05}s, transform 0.3s ease-out ${0.1 + i * 0.05}s`,
                }}
              >
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileSubmenu(mobileSubmenu === link.label ? null : link.label)}
                      className="w-full flex items-center gap-3 font-sans font-semibold text-[32px] leading-[1.2] tracking-[-0.96px] text-white hover:text-[#FFE533] transition-colors duration-200 py-3 cursor-pointer"
                    >
                      {link.label}
                      <svg
                        className={`w-6 h-6 text-white/40 transition-transform duration-200 ${
                          mobileSubmenu === link.label ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div
                      className={`flex flex-col gap-1 pl-1 overflow-hidden transition-all duration-300 ease-out ${
                        mobileSubmenu === link.label ? "max-h-[300px] opacity-100 pb-2" : "max-h-0 opacity-0"
                      }`}
                    >
                      {link.items?.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="font-sans font-normal text-xl leading-[1.2] tracking-[-0.6px] text-white/50 hover:text-[#FFE533] transition-colors duration-200 py-2"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 font-sans font-semibold text-[32px] leading-[1.2] tracking-[-0.96px] text-white hover:text-[#FFE533] transition-colors duration-200 py-3"
                  >
                    {link.label}
                    {(link as NavLink).badge && (
                      <span className="bg-[#FFE533] text-[#0c0c0c] font-mono font-bold text-xs uppercase leading-none tracking-[0] rounded-[4px] px-2 py-1">
                        {(link as NavLink).badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom CTA buttons */}
        <div className="px-4 pb-8 flex flex-col gap-3 shrink-0">
          <a
            href="tel:+13805240846"
            className="flex items-center justify-center gap-2.5 h-[56px] rounded-lg bg-white/5 font-mono font-bold text-base uppercase tracking-[-0.64px] text-white hover:bg-white/10 transition-colors"
          >
            <Image src="/icons/phone-yellow.svg" alt="" width={20} height={20} />
            +1 380-524-0846
          </a>
          <button
            onClick={() => { closeMobileMenu(); window.dispatchEvent(new Event("open-quote-modal")); }}
            className="flex items-center justify-center h-[56px] rounded-lg bg-[#FFE533] font-mono font-bold text-base uppercase tracking-[-0.64px] text-[#0c0c0c] hover:bg-[#f0d820] transition-colors"
          >
            Get a Free Quote
          </button>
        </div>
      </div>
    </>
  );
}
