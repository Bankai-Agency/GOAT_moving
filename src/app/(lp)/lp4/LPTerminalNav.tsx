"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LPButton } from "./ui/LPButton";
import { siteContent } from "@/lib/content";
import { formatPhone, phoneHref } from "@/lib/content/phone";

/* LP nav — same visual system as mainpage-5's TerminalNav (floating
   pill, mega-nav.css classes, mobile portal menu) but every link is
   an in-page anchor (the LP is a self-contained funnel — no retargets
   to other pages). Drops the GSAP dropdown machinery from TerminalNav
   since LPs have no Services / Locations dropdowns. */

type AnchorLink = { label: string; href: string };

const NAV_LINKS: AnchorLink[] = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacts", href: "#contact" },
];

const PHONE_DISPLAY = formatPhone(siteContent.phone, "dashed");
const PHONE_HREF = phoneHref(siteContent.phone);
const PHONE_SHORT = formatPhone(siteContent.phone, "short");

/* `showPhoneNumber` surfaces the full tappable number in the bar —
   centered between logo and burger on mobile, and as text + phone icon
   on desktop. Enabled on every city LP (CityLandingPage passes it).
   Defaults off so other shared callers (e.g. the thank-you page) keep
   the icon-only / burger-menu phone.
   `portland` is the Portland-only desktop variant: drops the duplicate
   "Get a free quote" button (the form already has one) and adds a
   "Call for a free quote" sub-line under the number. */
export function LPTerminalNav({
  showPhoneNumber = false,
  portland = false,
}: {
  showPhoneNumber?: boolean;
  portland?: boolean;
}) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalMounted, setPortalMounted] = useState(false);

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  /* Body scroll lock while mobile menu is open. */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* Close the menu if viewport grows past mobile breakpoint. */
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onResize = () => {
      if (window.innerWidth > 991) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileMenuOpen]);

  /* Scroll-aware show/hide — hide on downward scroll, reveal on
     sustained upward scroll. Mirrors TerminalNav behaviour for visual
     parity. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const REVEAL_THRESHOLD = 80;
    const TOP_LOCK = 32;

    let lastY = window.scrollY;
    let accumUp = 0;
    let visible = true;

    const apply = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      /* Slide only — NO opacity. Animating the nav's opacity made the
         bar's backdrop-filter blur snap in on reveal (Chrome composites
         backdrop-filter oddly under an animating ancestor opacity),
         which read as a jump from transparent → blur on scroll-up.
         -130% fully clears the bar (its height + the top inset) so it
         stays hidden without needing opacity. */
      nav.style.transform = v ? "translateY(0)" : "translateY(-130%)";
      nav.style.pointerEvents = v ? "" : "none";
    };

    nav.style.transition = "transform .35s cubic-bezier(0.16, 1, 0.3, 1)";

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y <= TOP_LOCK) {
        accumUp = 0;
        apply(true);
      } else if (delta > 0) {
        accumUp = 0;
        apply(false);
      } else if (delta < 0) {
        accumUp += -delta;
        if (accumUp >= REVEAL_THRESHOLD) apply(true);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      nav.style.transform = "";
      nav.style.opacity = "";
      nav.style.pointerEvents = "";
      nav.style.transition = "";
    };
  }, []);

  /* Mirror bar width onto a CSS variable — kept for visual parity
     with TerminalNav, even though we have no dropdown wrapper that
     uses it on the LP. Harmless if unused. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const bar = nav.querySelector<HTMLElement>(".mega-nav__bar");
    if (!bar) return;
    const sync = () =>
      nav.style.setProperty("--mp5-bar-w", `${bar.offsetWidth}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(bar);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      nav.style.removeProperty("--mp5-bar-w");
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  /* Scroll-to-anchor handler. Smooth scrolls to section, closes the
     mobile menu if open, and updates the URL hash. */
  const handleAnchor = (href: string) => {
    closeMobileMenu();
    if (href === "#top" || href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      ref={navRef}
      data-menu-open="false"
      data-menu-wrap=""
      data-mp5-mobile-open={mobileMenuOpen ? "true" : "false"}
      className="mega-nav"
      aria-label="Primary"
    >
      <div
        className="mega-nav__bar"
        style={{
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
        }}
      >
        <div className="mega-nav__container">
          <div className="mega-nav__bar-start">
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              data-menu-logo=""
              className="mega-nav__bar-logo"
              aria-label="GOAT Movers — Top"
            >
              <Image
                src="/icons/logo.svg"
                alt="GOAT Movers"
                width={82}
                height={39}
                priority
              />
            </button>

            {/* Mobile-only phone (Portland A/B variant). Sits as the
               MIDDLE flex item of .mega-nav__bar-start, which is
               space-between on mobile — so it lands between the logo and
               the burger. Visibility is driven by the .lp-nav-mobile-phone
               CSS class (mega-nav.css) on the same 991px breakpoint the
               nav uses, NOT a Tailwind `lg:` (1024px) class, to avoid a
               992–1024px gap where it would double up with the desktop
               number pill. Number shown without country code per spec. */}
            {showPhoneNumber && (
              <a
                href={PHONE_HREF}
                aria-label={`Call GOAT Movers at ${PHONE_DISPLAY}`}
                className="lp-nav-mobile-phone"
                style={{
                  alignItems: "center",
                  gap: 6,
                  height: 36,
                  padding: "0 0.75em",
                  borderRadius: 999,
                  /* Portland: transparent pill with yellow border + yellow
                     text/icon (outlined "call" CTA). Other cities keep the
                     solid yellow pill. */
                  ...(portland
                    ? {
                        backgroundColor: "transparent",
                        color: "#FFE533",
                        border: "1px solid #FFE533",
                      }
                    : { backgroundColor: "#FFE533", color: "#0c0c0c" }),
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.3px",
                  lineHeight: 1,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <PhoneSvg style={{ width: 14, height: 14 }} />
                {PHONE_SHORT}
              </a>
            )}

            <div data-nav-list="" data-mobile-nav="" className="mega-nav__bar-inner">
              <ul className="mega-nav__bar-list">
                {NAV_LINKS.map((link) => (
                  <li key={link.label} data-nav-list-item="">
                    <button
                      type="button"
                      onClick={() => handleAnchor(link.href)}
                      className="mega-nav__bar-link"
                    >
                      <span className="mega-nav__bar-link-label">
                        <SwapLabel>{link.label}</SwapLabel>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <ul data-nav-list-item="" className="mega-nav__bar-list is--actions">
                <li className="mega-nav__bar-action">
                  <PhoneLink showNumber={showPhoneNumber} portland={portland} />
                </li>
                {/* Portland drops this CTA — it duplicates the form's
                    "Get a free quote" button (see `portland` prop). */}
                {!portland && (
                  <li className="mega-nav__bar-action">
                    <LPButton
                      size="sm"
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("open-quote-modal"))
                      }
                    >
                      Get a free quote
                    </LPButton>
                  </li>
                )}
              </ul>
            </div>

            <div className="mega-nav__bar-end">
              <button
                data-burger-toggle=""
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="mega-nav__burger"
                type="button"
              >
                <span data-burger-line="top" className="mega-nav__burger-line" />
                <span data-burger-line="bot" className="mega-nav__burger-line" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu — portalled to body to escape any transformed
         ancestor (the scroll-hide effect puts a transform on this
         <nav>, which would shrink a position:fixed descendant to
         the nav's containing block; see TerminalNav for the same
         fix). */}
      {portalMounted &&
        createPortal(
          <div
            className="lg:hidden"
            aria-hidden={!mobileMenuOpen}
            style={{
              position: "fixed",
              inset: 0,
              /* Above the Touchbar (z-50) and any sticky LP cards. */
              zIndex: 60,
              display: "flex",
              flexDirection: "column",
              opacity: mobileMenuOpen ? 1 : 0,
              pointerEvents: mobileMenuOpen ? "auto" : "none",
              transition: "opacity .35s ease-out",
              /* Background applied directly to the overlay (instead
                 of a separate z-index:-1 child) so it always paints
                 opaquely. The separate-layer pattern would render
                 the menu as a translucent overlay on this page.
                 Dark navy base + blue radial accent + diagonal navy
                 linear fade — mirrors the body gradient so the menu
                 reads as part of the same atmospheric palette. */
              backgroundColor: "#0c0c0c",
              backgroundImage: `
                radial-gradient(ellipse 80% 60% at 15% 15%, rgba(255, 229, 51, 0.20), transparent 60%),
                linear-gradient(160deg, #0c0c0c 0%, #18140a 100%)
              `,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >

            {/* Spacer below the floating bar */}
            <div style={{ flexShrink: 0, height: "92px" }} />

            {/* Nav links — pinned to bottom via margin-top: auto on
               the <nav> (avoids the flex `justify-content: flex-end`
               + `overflow-y: auto` clipping bug). */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "8px 24px 24px",
                overflowY: "auto",
                minHeight: 0,
              }}
            >
              <nav style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
                {NAV_LINKS.map((link, idx) => (
                  <div
                    key={link.label}
                    style={{
                      borderTop:
                        idx === 0 ? "1px solid rgba(255,255,255,0.10)" : "0",
                      borderBottom: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleAnchor(link.href)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "18px 0",
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: 22,
                        fontWeight: 400,
                        lineHeight: 1.2,
                        letterSpacing: "-0.5px",
                        color: "#ffffff",
                        textAlign: "left",
                        transition: "color .2s ease",
                      }}
                    >
                      {link.label}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom CTA pair — outlined phone pill + AccentPill */}
            <div
              style={{
                padding: "0 24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flexShrink: 0,
              }}
            >
              {/* Portland drops the outlined phone link here — it
                 duplicates the bar's outlined phone CTA. Other cities keep
                 it. */}
              {!portland && (
                <a
                  href={PHONE_HREF}
                  onClick={closeMobileMenu}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    height: 66,
                    borderRadius: 12,
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.18)",
                    fontFamily: "var(--font-sans, system-ui, sans-serif)",
                    fontSize: 18,
                    fontWeight: 500,
                    letterSpacing: "-0.3px",
                    color: "#ffffff",
                    textDecoration: "none",
                    transition: "background-color .2s ease, border-color .2s ease",
                  }}
                >
                  <PhoneSvg style={{ color: "#FFE533" }} />
                  {PHONE_DISPLAY}
                </a>
              )}
              <LPButton
                size="lg"
                fullWidth
                onClick={() => {
                  closeMobileMenu();
                  window.dispatchEvent(new CustomEvent("open-quote-modal"));
                }}
                className={portland ? "capitalize" : undefined}
              >
                {portland ? "Get my free quote" : "Get a free quote"}
              </LPButton>
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
}

/* Phone pill in the desktop bar (mirrors mainpage-5). Default is a
   compact yellow icon-only circle; `showNumber` (Portland A/B variant)
   expands it to icon + full number written out in digits. */
function PhoneLink({
  showNumber = false,
  portland = false,
}: {
  showNumber?: boolean;
  portland?: boolean;
}) {
  /* Desktop bar with the number: plain TEXT + phone icon (not a filled
     pill). White text, yellow on hover. Portland renders it at the
     form-heading scale (26px / 600 / -0.6px, matching .lp-form-heading)
     so the number reads as the primary header CTA, and drops the trailing
     margin since no "Get a free quote" button follows. */
  if (showNumber) {
    return (
      <a
        href={PHONE_HREF}
        aria-label={`Call GOAT Movers at ${PHONE_DISPLAY}`}
        className={`inline-flex items-center gap-2 ${portland ? "" : "mr-4"} cursor-pointer text-white hover:text-[#FFE533] transition-colors duration-200`}
        style={{
          textDecoration: "none",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontSize: portland ? 19 : 16,
          fontWeight: 600,
          letterSpacing: portland ? "-0.4px" : "-0.3px",
          whiteSpace: "nowrap",
        }}
      >
        <PhoneSvg className="w-4 h-4" />
        {PHONE_SHORT}
      </a>
    );
  }
  /* Default: compact yellow icon-only circle (e.g. the thank-you page
     and other bars that don't surface the number). */
  return (
    <a
      href={PHONE_HREF}
      aria-label="Call GOAT Movers"
      className="mp5-phone-pill inline-flex items-center justify-center cursor-pointer rounded-full"
      style={{
        width: 44,
        height: 44,
        backgroundColor: "#FFE533",
        color: "#0c0c0c",
        border: "0",
        textDecoration: "none",
        transition: "transform .25s ease, background-color .25s ease",
      }}
    >
      <PhoneSvg className="w-4 h-4" />
    </a>
  );
}

function PhoneSvg({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M4.37 11.62c2.49 2.49 5.52 4.41 7.99 4.41 1.11 0 2.08-.39 2.87-1.25.46-.51.74-1.1.74-1.69 0-.43-.16-.84-.58-1.13l-2.64-1.88c-.4-.27-.74-.41-1.05-.41-.4 0-.74.22-1.13.61l-.61.6c-.04.05-.09.08-.15.1-.05.02-.11.03-.17.03-.14 0-.26-.05-.35-.09-.52-.28-1.43-1.06-2.28-1.91-.84-.84-1.62-1.75-1.9-2.29-.06-.11-.09-.22-.09-.34 0-.11.03-.22.13-.31l.6-.63c.39-.4.61-.74.61-1.13 0-.31-.14-.65-.42-1.06L4.04.6C3.74.18 3.32 0 2.86 0 2.29 0 1.7.26 1.21.75.36 1.55 0 2.54 0 3.63c0 2.47 1.88 5.5 4.37 7.99z" />
    </svg>
  );
}

/* Vertical text-swap label — mirrors mainpage-5's SwapLabel. */
function SwapLabel({ children }: { children: string }) {
  return (
    <span className="swap-label">
      <span className="swap-label__inner">
        <span className="swap-label__txt">{children}</span>
        <span className="swap-label__txt" aria-hidden>
          {children}
        </span>
      </span>
    </span>
  );
}
