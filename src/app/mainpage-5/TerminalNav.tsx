"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/components/motion/gsap";
import { locationConfigs } from "@/app/_locations/locationConfigs";
import { AccentPill } from "./AccentPill";

/* Mainpage-5 only — port of Osmo Supply's "Mega Navigation (Directional
   Hover)" resource. Behaviour preserved verbatim from the source script;
   adapted to React/Next + scoped to this page. Brand swap: purple
   (#6840ff) → blue (#0066ff). All [data-...] attributes are load-bearing
   for the GSAP init logic — do not rename. */

type DropdownItem = { label: string; href: string; desc?: string };

const servicesDropdown: DropdownItem[] = [
  { label: "Local Moving", href: "/local-moving", desc: "Same-day, same-team moves" },
  { label: "Long Distance", href: "/long-distance-moving", desc: "Cross-state with one crew" },
  { label: "Commercial", href: "/commercial-moving", desc: "Offices, warehouses, retail" },
  { label: "Packing & Labor", href: "/packing-services", desc: "Full-service packing" },
];

const locationsDropdown: DropdownItem[] = locationConfigs.map((c) => ({
  label: c.city,
  href: `/${c.slug}`,
  desc: c.stateLong,
}));

/* Mobile-only nav schema: mirrors the live `/` Header's mobile menu —
   plain links with two accordion sections (Services / Locations).
   Independent of the GSAP desktop dropdown data above so the mobile
   stack can render different labels (e.g. Locations show "City, ST"). */
type MobileNavLink = {
  label: string;
  href: string;
  items?: { label: string; href: string }[];
};

const mobileNavLinks: MobileNavLink[] = [
  {
    label: "Services",
    href: "#services",
    items: servicesDropdown.map((i) => ({ label: i.label, href: i.href })),
  },
  {
    label: "Locations",
    href: "#locations",
    items: locationConfigs.map((c) => ({
      label: `${c.city}, ${c.state}`,
      href: `/${c.slug}`,
    })),
  },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacts", href: "/contacts" },
];

export function TerminalNav() {
  const navRef = useRef<HTMLElement>(null);

  /* Mobile menu — React-state driven full-screen overlay (port of live
     `/` Header pattern). Independent of the GSAP machinery above which
     drives the desktop click-toggle dropdowns. On mobile the GSAP
     `.mega-nav__bar-inner` overlay is hidden via CSS (display:none)
     so the two systems don't fight. */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  /* SSR-safe portal: only render the overlay after mount so server
     output matches client and `document.body` exists. */
  const [portalMounted, setPortalMounted] = useState(false);
  useEffect(() => { setPortalMounted(true); }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMobileSubmenu(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* Close the mobile menu if the viewport grows past the mobile
     breakpoint (e.g. tablet rotated to landscape) so body scroll lock
     doesn't get stranded with the menu hidden by CSS. */
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onResize = () => {
      if (window.innerWidth > 991) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  /* Scroll-aware visibility: hide on any downward scroll, reveal only
     after a sustained upward scroll (>= REVEAL_THRESHOLD px). At the
     very top of the page the bar always stays visible. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const REVEAL_THRESHOLD = 80;
    const TOP_LOCK = 32; // always visible while within this distance from top

    let lastY = window.scrollY;
    let accumUp = 0;
    let visible = true;

    const apply = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      nav.style.transform = v ? "translateY(0)" : "translateY(-110%)";
      nav.style.opacity = v ? "1" : "0";
      nav.style.pointerEvents = v ? "" : "none";
    };

    nav.style.transition =
      "transform .35s cubic-bezier(0.16, 1, 0.3, 1), opacity .35s ease-out";

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      // Within the hero region the bar always stays visible — even on
      // scroll-down — so the user keeps quick access to nav while the
      // long sticky-pinned hero plays through.
      const hero = document.querySelector<HTMLElement>("[data-hero-region]");
      if (hero) {
        const heroEnd = hero.offsetTop + hero.offsetHeight - window.innerHeight;
        if (y <= heroEnd) {
          accumUp = 0;
          apply(true);
          lastY = y;
          return;
        }
      }
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

  /* Mirror the bar's rendered width onto a CSS variable so the
     dropdown wrapper can size itself identically — the bar uses
     content-fit (max-content) so its width changes with viewport
     and content. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const bar = nav.querySelector<HTMLElement>(".mega-nav__bar");
    if (!bar) return;
    const sync = () => {
      nav.style.setProperty("--mp5-bar-w", `${bar.offsetWidth}px`);
    };
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

  useEffect(() => {
    const root = navRef.current;
    if (!root) return;

    /* ── Ported from Osmo's initMegaNavDirectionalHover, scoped to root.
       Timing tweaked to match the SOS-MOVING dropdown feel: a smooth
       fade-up of items with the [0.5,0,0,1] ease and a longer container
       morph. The per-link char-lift + slide-in arrow live in CSS. */
    const DUR = {
      bgMorph: 0.45,
      contentIn: 0.4,
      contentOut: 0.22,
      stagger: 0.18,
      backdropIn: 0.3,
      backdropOut: 0.2,
      openScale: 0.45,
      closeScale: 0.28,
    };
    const SOS_EASE = "power3.out";
    const $ = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector<T>(sel);
    const $$ = <T extends Element = HTMLElement>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));

    const menuWrap = root;
    const navList = $("[data-nav-list]");
    const dropWrapper = $("[data-dropdown-wrapper]");
    const dropContainer = $("[data-dropdown-container]");
    const backdrop = $("[data-menu-backdrop]");
    const burger = $<HTMLButtonElement>("[data-burger-toggle]");
    const backBtn = $("[data-mobile-back]");
    const logo = $("[data-menu-logo]");
    const toggles = $$<HTMLButtonElement>("[data-dropdown-toggle]");
    const panels = $$<HTMLElement>("[data-nav-content]");
    const lineTop = $("[data-burger-line='top']");
    const lineMid = $("[data-burger-line='mid']");
    const lineBot = $("[data-burger-line='bot']");

    if (
      !navList || !dropWrapper || !dropContainer || !backdrop ||
      !burger || !backBtn || !logo || !lineTop || !lineMid || !lineBot
    ) return;

    type State = {
      isOpen: boolean;
      activePanel: string | null;
      activePanelIndex: number;
      isMobile: boolean;
      mobileMenuOpen: boolean;
      mobilePanelActive: string | null;
      hoverTimer: ReturnType<typeof setTimeout> | null;
      leaveTimer: ReturnType<typeof setTimeout> | null;
      tl: gsap.core.Timeline | null;
      mobileTl: gsap.core.Timeline | null;
      mobilePanelTl: gsap.core.Timeline | null;
    };
    const state: State = {
      isOpen: false,
      activePanel: null,
      activePanelIndex: -1,
      isMobile: window.innerWidth <= 991,
      mobileMenuOpen: false,
      mobilePanelActive: null,
      hoverTimer: null,
      leaveTimer: null,
      tl: null,
      mobileTl: null,
      mobilePanelTl: null,
    };

    const getPanel = (name: string | null) =>
      name ? root.querySelector<HTMLElement>(`[data-nav-content="${name}"]`) : null;
    const getToggle = (name: string | null) =>
      name ? root.querySelector<HTMLButtonElement>(`[data-dropdown-toggle="${name}"]`) : null;
    const getFade = (el: Element) =>
      Array.from(el.querySelectorAll<HTMLElement>("[data-menu-fade]"));
    const getNavItems = () =>
      Array.from(navList.querySelectorAll<HTMLElement>("[data-nav-list-item]"));
    const getIndex = (name: string | null) => {
      const t = getToggle(name);
      return t ? toggles.indexOf(t) : -1;
    };
    const stagger = (n: number) => (n <= 1 ? 0 : { amount: DUR.stagger });

    function clearTimers() {
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      if (state.leaveTimer) clearTimeout(state.leaveTimer);
      state.hoverTimer = state.leaveTimer = null;
    }

    function killTl(key: "tl" | "mobileTl" | "mobilePanelTl") {
      if (state[key]) {
        state[key]!.kill();
        state[key] = null;
      }
    }

    function killDropdown() {
      killTl("tl");
      gsap.killTweensOf(dropContainer!);
      gsap.killTweensOf(backdrop!);
      panels.forEach((p) => {
        gsap.killTweensOf(p);
        gsap.killTweensOf(getFade(p));
      });
    }

    function killMobile() {
      killTl("mobileTl");
      gsap.killTweensOf([navList!, lineTop!, lineMid!, lineBot!]);
    }

    function killMobilePanel() {
      killTl("mobilePanelTl");
      gsap.killTweensOf(getNavItems());
      gsap.killTweensOf([backBtn!, logo!]);
      panels.forEach((p) => {
        gsap.killTweensOf(p);
        gsap.killTweensOf(getFade(p));
      });
    }

    function resetToggles() {
      toggles.forEach((t) => t.setAttribute("aria-expanded", "false"));
    }

    function resetDesktop() {
      panels.forEach((p) => {
        gsap.set(p, { visibility: "hidden", opacity: 0, pointerEvents: "none", xPercent: 0 });
        gsap.set(getFade(p), { autoAlpha: 0, x: 0, y: 0 });
      });
      gsap.set(dropContainer!, { height: 0 });
      gsap.set(backdrop!, { autoAlpha: 0 });
      menuWrap.setAttribute("data-menu-open", "false");
      resetToggles();
    }

    function setupMobile() {
      panels.forEach((p) => {
        gsap.set(p, { autoAlpha: 0, xPercent: 0, visibility: "visible", pointerEvents: "none" });
        gsap.set(getFade(p), { xPercent: 20, autoAlpha: 0 });
      });
      gsap.set(getNavItems(), { xPercent: 0, y: 0, autoAlpha: 1 });
      gsap.set(navList!, { autoAlpha: 0, x: 0 });
      gsap.set(backBtn!, { autoAlpha: 0 });
      gsap.set(logo!, { autoAlpha: 1 });
      gsap.set(dropContainer!, { clearProps: "height" });
      gsap.set(backdrop!, { autoAlpha: 0 });
    }

    function measurePanel(name: string) {
      const el = getPanel(name);
      if (!el) return 0;
      const s = el.style;
      const prev = [s.visibility, s.opacity, s.pointerEvents] as const;
      Object.assign(s, { visibility: "visible", opacity: "0", pointerEvents: "none" });
      const h = el.getBoundingClientRect().height;
      [s.visibility, s.opacity, s.pointerEvents] = prev;
      return h;
    }

    function openDropdown(panelName: string) {
      if (state.isOpen && state.activePanel === panelName) return;
      if (state.isOpen) return switchPanel(state.activePanel!, panelName);

      const height = measurePanel(panelName);
      if (!height) return;

      killDropdown();
      resetDesktop();

      const el = getPanel(panelName);
      if (!el) return;
      const fade = getFade(el);
      const toggle = getToggle(panelName);

      state.isOpen = true;
      state.activePanel = panelName;
      state.activePanelIndex = getIndex(panelName);
      menuWrap.setAttribute("data-menu-open", "true");
      if (toggle) toggle.setAttribute("aria-expanded", "true");

      gsap.set(dropContainer!, { height: 0 });

      const tl = gsap.timeline();
      state.tl = tl;
      tl.to(backdrop!, { autoAlpha: 1, duration: DUR.backdropIn, ease: "power2.out" }, 0);
      tl.to(dropContainer!, { height, duration: DUR.openScale, ease: SOS_EASE }, 0);
      tl.set(el, { visibility: "visible", opacity: 1, pointerEvents: "auto" }, 0.05);
      if (fade.length) {
        // SOS-style fade-up of items: bigger initial offset (y: 20) and
        // tighter per-item stagger (~25ms) for a quicker cascade.
        tl.fromTo(
          fade,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: DUR.contentIn, stagger: 0.025, ease: SOS_EASE },
          0.1,
        );
      }
    }

    function closeDropdown() {
      if (!state.isOpen) return;
      const el = getPanel(state.activePanel);
      const fade = el ? getFade(el) : [];

      killDropdown();

      const tl = gsap.timeline({
        onComplete() {
          state.isOpen = false;
          state.activePanel = null;
          state.activePanelIndex = -1;
          state.tl = null;
          resetDesktop();
        },
      });
      state.tl = tl;
      if (fade.length) tl.to(fade, { autoAlpha: 0, y: -4, duration: DUR.contentOut * 0.7, ease: "power2.in" }, 0);
      tl.to(dropContainer!, { height: 0, duration: DUR.closeScale, ease: "power2.in" }, 0.05);
      tl.to(backdrop!, { autoAlpha: 0, duration: DUR.backdropOut, ease: "power2.out" }, 0);
      if (el) tl.set(el, { visibility: "hidden", opacity: 0, pointerEvents: "none" });
    }

    function switchPanel(fromName: string, toName: string) {
      const dir = getIndex(toName) > getIndex(fromName) ? 1 : -1;
      const fromEl = getPanel(fromName);
      const toEl = getPanel(toName);
      if (!fromEl || !toEl) return;

      const fromFade = getFade(fromEl);
      const toFade = getFade(toEl);
      const toHeight = measurePanel(toName);
      if (!toHeight) return;

      killDropdown();

      panels.forEach((p) => {
        gsap.set(p, { visibility: "hidden", opacity: 0, pointerEvents: "none", xPercent: 0 });
        gsap.set(getFade(p), { autoAlpha: 0, x: 0, y: 0 });
      });
      gsap.set(fromEl, { visibility: "visible", opacity: 1, pointerEvents: "auto", x: 0 });
      if (fromFade.length) gsap.set(fromFade, { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(backdrop!, { autoAlpha: 1 });

      const toToggle = getToggle(toName);
      state.activePanel = toName;
      state.activePanelIndex = getIndex(toName);
      resetToggles();
      if (toToggle) toToggle.setAttribute("aria-expanded", "true");

      // SOS-style switch: from-panel fades down + out, container morphs,
      // to-panel fades up + in. dir is unused but kept so callers don't
      // need to change.
      void dir;
      const tl = gsap.timeline();
      state.tl = tl;

      if (fromFade.length) {
        tl.to(fromFade, { autoAlpha: 0, y: 16, duration: DUR.contentOut, ease: "power2.in" }, 0);
      }
      tl.set(fromEl, { visibility: "hidden", opacity: 0, pointerEvents: "none" }, DUR.contentOut);
      if (fromFade.length) tl.set(fromFade, { y: 0 }, DUR.contentOut);
      tl.to(dropContainer!, { height: toHeight, duration: DUR.bgMorph, ease: SOS_EASE }, 0.05);
      tl.set(toEl, { visibility: "visible", opacity: 1, pointerEvents: "auto" }, DUR.contentOut * 0.5);
      if (toFade.length) {
        tl.fromTo(
          toFade,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: DUR.contentIn, stagger: 0.025, ease: SOS_EASE },
          DUR.contentOut * 0.6,
        );
      }
    }

    /* Hover-to-open removed — desktop now uses click-toggle. */

    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (state.isMobile) {
        if (state.mobilePanelActive) closeMobilePanel();
        else if (state.mobileMenuOpen) closeMobileMenu();
        return;
      }
      if (state.isOpen) {
        const t = getToggle(state.activePanel);
        closeDropdown();
        if (t) t.focus();
      }
    }

    function handleDocClick(e: MouseEvent) {
      if (state.isMobile || !state.isOpen) return;
      const target = e.target as Element;
      if (!target.closest("[data-menu-wrap]")) closeDropdown();
    }

    function focusFirstLink(panelName: string) {
      setTimeout(() => {
        const el = getPanel(panelName);
        if (!el) return;
        const link = el.querySelector<HTMLAnchorElement>("a");
        if (!link) return;
        gsap.set(link, { visibility: "visible" });
        link.focus();
      }, 80);
    }

    function handleKeydownOnToggle(e: KeyboardEvent) {
      if (state.isMobile) return;
      const t = e.currentTarget as HTMLElement;
      const name = t.getAttribute("data-dropdown-toggle");
      if (!name) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (state.isOpen && state.activePanel === name) closeDropdown();
        else { openDropdown(name); focusFirstLink(name); }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!state.isOpen || state.activePanel !== name) openDropdown(name);
        focusFirstLink(name);
      }
      if (e.key === "Tab" && !e.shiftKey && state.isOpen && state.activePanel === name) {
        e.preventDefault();
        const link = getPanel(name)?.querySelector<HTMLAnchorElement>("a");
        if (link) link.focus();
      }
    }

    function handleKeydownInPanel(e: KeyboardEvent) {
      if (state.isMobile || !state.isOpen) return;
      const el = getPanel(state.activePanel);
      if (!el) return;
      const links = Array.from(el.querySelectorAll<HTMLAnchorElement>("a"));
      const idx = links.indexOf(document.activeElement as HTMLAnchorElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        links[(idx + 1) % links.length]?.focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx <= 0) {
          const t = getToggle(state.activePanel);
          if (t) t.focus();
        } else links[idx - 1].focus();
      }
      if (e.key === "Tab" && !e.shiftKey && idx === links.length - 1) {
        e.preventDefault();
        const curIdx = toggles.indexOf(getToggle(state.activePanel)!);
        const next = curIdx < toggles.length - 1 ? toggles[curIdx + 1] : null;
        closeDropdown();
        if (next) next.focus();
      }
      if (e.key === "Tab" && e.shiftKey && idx === 0) {
        e.preventDefault();
        const t = getToggle(state.activePanel);
        if (t) t.focus();
      }
    }

    function animateBurger(toX: boolean) {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      if (toX) {
        tl.to(lineTop!, { y: "0.3125em", duration: 0.15 }, 0);
        tl.to(lineBot!, { y: "-0.3125em", duration: 0.15 }, 0);
        tl.to(lineMid!, { autoAlpha: 0, duration: 0.1 }, 0.1);
        tl.to(lineTop!, { rotation: 45, duration: 0.2 }, 0.15);
        tl.to(lineBot!, { rotation: -45, duration: 0.2 }, 0.15);
      } else {
        tl.to(lineTop!, { rotation: 0, duration: 0.2 }, 0);
        tl.to(lineBot!, { rotation: 0, duration: 0.2 }, 0);
        tl.to(lineTop!, { y: 0, duration: 0.15 }, 0.15);
        tl.to(lineBot!, { y: 0, duration: 0.15 }, 0.15);
        tl.to(lineMid!, { autoAlpha: 1, duration: 0.1 }, 0.15);
      }
      return tl;
    }

    function openMobileMenu() {
      killMobile();
      state.mobileMenuOpen = true;
      menuWrap.setAttribute("data-menu-open", "true");
      burger!.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";

      const items = getNavItems();
      const tl = gsap.timeline();
      state.mobileTl = tl;
      tl.add(animateBurger(true), 0);
      tl.to(navList!, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0);
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power3.out" },
          0.15,
        );
      }
    }

    function closeMobileMenu() {
      const hadPanel = state.mobilePanelActive;
      const panelEl = hadPanel ? getPanel(hadPanel) : null;

      killMobile();
      killMobilePanel();

      menuWrap.setAttribute("data-menu-open", "false");
      state.mobileMenuOpen = false;
      state.mobilePanelActive = null;
      burger!.setAttribute("aria-expanded", "false");

      const tl = gsap.timeline({
        onComplete() {
          document.body.style.overflow = "";
          state.mobileTl = null;
          setupMobile();
        },
      });
      state.mobileTl = tl;
      tl.add(animateBurger(false), 0);

      if (hadPanel && panelEl) {
        tl.to(panelEl, { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0.05);
        tl.to(backBtn!, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0.05);
      }
      tl.to(navList!, { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0.05);
    }

    function openMobilePanel(panelName: string) {
      const el = getPanel(panelName);
      if (!el) return;
      killMobilePanel();
      state.mobilePanelActive = panelName;

      const navItems = getNavItems();
      const panelFade = getFade(el);

      const tl = gsap.timeline();
      state.mobilePanelTl = tl;

      if (navItems.length) {
        tl.to(navItems, {
          xPercent: -10, autoAlpha: 0,
          duration: 0.35, stagger: 0.03, ease: "power2.in",
        }, 0);
      }
      tl.to(logo!, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0);
      tl.to(backBtn!, { autoAlpha: 1, duration: 0.25, ease: "power2.inOut" }, 0.15);
      tl.set(el, { autoAlpha: 1, xPercent: 0, pointerEvents: "auto" }, 0.2);
      if (panelFade.length) {
        tl.fromTo(
          panelFade,
          { xPercent: 8, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 0.3, stagger: stagger(panelFade.length), ease: "power3.out" },
          0.25,
        );
      }
    }

    function closeMobilePanel() {
      if (!state.mobilePanelActive) return;
      const el = getPanel(state.mobilePanelActive);
      if (!el) return;
      killMobilePanel();

      const navItems = getNavItems();

      const tl = gsap.timeline({
        onComplete() {
          state.mobilePanelActive = null;
          state.mobilePanelTl = null;
        },
      });
      state.mobilePanelTl = tl;

      tl.to(el, {
        xPercent: 20, autoAlpha: 0,
        duration: 0.3, ease: "power2.in",
      }, 0);
      tl.set(el, { autoAlpha: 0, pointerEvents: "none" }, 0.25);
      tl.to(backBtn!, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0);
      tl.to(logo!, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0.15);
      if (navItems.length) {
        tl.fromTo(
          navItems,
          { xPercent: -20, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 0.35, stagger: 0.03, ease: "power3.out" },
          0.25,
        );
      }
    }

    function handleToggleClick(e: Event) {
      const t = e.currentTarget as HTMLElement;
      const name = t.getAttribute("data-dropdown-toggle");
      if (!name) return;

      if (state.isMobile) {
        if (!state.mobileMenuOpen) return;
        e.preventDefault();
        openMobilePanel(name);
        return;
      }

      // Desktop click-toggle: same panel → close, different panel →
      // switch via the existing directional logic, none open → open.
      // Stop propagation so the document-level outside-click handler
      // doesn't see the click and start fighting the open animation.
      e.preventDefault();
      e.stopPropagation();
      if (state.isOpen && state.activePanel === name) closeDropdown();
      else openDropdown(name);
    }

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = window.innerWidth;
    function handleResize() {
      const w = window.innerWidth;
      if (w === lastWidth) return;
      lastWidth = w;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const was = state.isMobile;
        state.isMobile = window.innerWidth <= 991;

        if (was && !state.isMobile) {
          killMobile(); killMobilePanel();
          gsap.set(navList!, { clearProps: "all" });
          gsap.set(getNavItems(), { clearProps: "all" });
          gsap.set(backBtn!, { autoAlpha: 0 });
          gsap.set(logo!, { clearProps: "all" });
          gsap.set([lineTop!, lineMid!, lineBot!], { rotation: 0, y: 0, autoAlpha: 1 });
          panels.forEach((p) => {
            gsap.set(p, { clearProps: "all" });
            gsap.set(getFade(p), { clearProps: "all" });
          });
          burger!.setAttribute("aria-expanded", "false");
          state.mobileMenuOpen = false;
          state.mobilePanelActive = null;
          document.body.style.overflow = "";
          resetDesktop();
        }
        if (!was && state.isMobile) {
          killDropdown();
          state.isOpen = false;
          state.activePanel = null;
          state.activePanelIndex = -1;
          clearTimers();
          menuWrap.setAttribute("data-menu-open", "false");
          resetToggles();
          setupMobile();
        }
      }, 150);
    }

    /* ── Bind listeners. Desktop dropdowns are click-toggle (no hover). */
    toggles.forEach((btn) => {
      btn.addEventListener("keydown", handleKeydownOnToggle);
      btn.addEventListener("click", handleToggleClick);
    });
    panels.forEach((p) => p.addEventListener("keydown", handleKeydownInPanel));
    backdrop.addEventListener("click", closeDropdown);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleDocClick);
    /* Burger click is bound via React onClick on the JSX button — see
       the mobile-menu state at the top of the component. The original
       GSAP open/close mobile-menu timelines (openMobileMenu /
       closeMobileMenu / openMobilePanel / closeMobilePanel) are kept
       above as dead code so the rest of the desktop dropdown logic
       compiles, but they are never reached at runtime. */
    window.addEventListener("resize", handleResize);

    /* ── Init. */
    if (state.isMobile) setupMobile();
    else resetDesktop();

    return () => {
      toggles.forEach((btn) => {
        btn.removeEventListener("keydown", handleKeydownOnToggle);
        btn.removeEventListener("click", handleToggleClick);
      });
      panels.forEach((p) => p.removeEventListener("keydown", handleKeydownInPanel));
      backdrop.removeEventListener("click", closeDropdown);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleDocClick);
      /* Burger / backBtn click listeners were never bound — burger is
         driven by React onClick, backBtn (mobile slide-over) is unused. */
      window.removeEventListener("resize", handleResize);
      clearTimers();
      if (resizeTimer) clearTimeout(resizeTimer);
      killDropdown();
      killMobile();
      killMobilePanel();
      document.body.style.overflow = "";
    };
  }, []);

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
            <Link
              data-menu-logo=""
              href="/"
              className="mega-nav__bar-logo"
              aria-label="GOAT Movers — Home"
            >
              <Image
                src="/icons/logo.svg"
                alt="GOAT Movers"
                width={82}
                height={39}
                priority
              />
            </Link>
            <div data-nav-list="" data-mobile-nav="" className="mega-nav__bar-inner">
              <ul className="mega-nav__bar-list">
                <li data-nav-list-item="">
                  <button
                    data-dropdown-toggle="services"
                    aria-expanded="false"
                    aria-haspopup="true"
                    className="mega-nav__bar-link is--dropdown"
                  >
                    <span className="mega-nav__bar-link-label"><SwapLabel>Services</SwapLabel></span>
                    <ChevronIcon className="mega-nav__bar-link-icon is--dropdown" />
                  </button>
                </li>
                <li data-nav-list-item="">
                  <button
                    data-dropdown-toggle="locations"
                    aria-expanded="false"
                    aria-haspopup="true"
                    className="mega-nav__bar-link is--dropdown"
                  >
                    <span className="mega-nav__bar-link-label"><SwapLabel>Locations</SwapLabel></span>
                    <ChevronIcon className="mega-nav__bar-link-icon is--dropdown" />
                  </button>
                </li>
                <li data-nav-list-item="">
                  <Link href="/reviews" className="mega-nav__bar-link">
                    <span className="mega-nav__bar-link-label"><SwapLabel>Reviews</SwapLabel></span>
                  </Link>
                </li>
                <li data-nav-list-item="">
                  <Link href="/faq" className="mega-nav__bar-link">
                    <span className="mega-nav__bar-link-label"><SwapLabel>FAQ</SwapLabel></span>
                  </Link>
                </li>
                <li data-nav-list-item="">
                  <Link href="/contacts" className="mega-nav__bar-link">
                    <span className="mega-nav__bar-link-label"><SwapLabel>Contacts</SwapLabel></span>
                  </Link>
                </li>
              </ul>
              <ul data-nav-list-item="" className="mega-nav__bar-list is--actions">
                <li className="mega-nav__bar-action">
                  <PhoneLink />
                </li>
                <li className="mega-nav__bar-action">
                  <AccentPill
                    size="sm"
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("open-quote-modal"))
                    }
                  >
                    Get a free quote
                  </AccentPill>
                </li>
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
            <div data-mobile-back="" className="mega-nav__back">
              <button
                aria-label="Back to menu"
                className="mega-nav__bar-link is--back"
                type="button"
              >
                <BackIcon className="mega-nav__bar-link-icon" />
                <span className="mega-nav__bar-link-label">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div data-dropdown-wrapper="" className="mega-nav__dropdown-wrapper">
        <div data-dropdown-container="" className="mega-nav__dropdown-container">
          <div data-dropdown-bg="" className="mega-nav__dropdown-bg" />

          <div
            data-panel-state=""
            data-nav-content="services"
            role="region"
            aria-label="Services menu"
            className="mega-nav__dropdown-panel"
          >
            <div className="mega-nav__dropdown-inner">
              <FeatureCard
                href="/local-moving"
                src="/images/local-moving-hero.png"
                alt="GOAT moving services"
                label="All Services"
              />
              <div className="mega-nav__panel-grid">
                <span data-menu-fade="" className="mega-nav__panel-grid-label">
                  Moving services
                </span>
                {servicesDropdown.map((item) => (
                  <div key={item.href} data-menu-fade="">
                    <PanelLink href={item.href} label={item.label} desc={item.desc} />
                  </div>
                ))}
                <div data-menu-fade="">
                  <PanelLink
                    href="/reviews"
                    label="Reviews"
                    desc="See what customers say"
                  />
                </div>
                <div data-menu-fade="">
                  <PanelLink
                    href="/faq"
                    label="FAQ"
                    desc="Common questions"
                  />
                </div>
                <div data-menu-fade="">
                  <PanelLink
                    href="/contacts"
                    label="Contact"
                    desc="Get in touch"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            data-panel-state=""
            data-nav-content="locations"
            role="region"
            aria-label="Locations menu"
            className="mega-nav__dropdown-panel"
          >
            <div className="mega-nav__dropdown-inner">
              <FeatureCard
                href={locationsDropdown[0]?.href ?? "/"}
                src="/images/location-vancouver.jpg"
                alt="Service areas"
                label="Service areas"
              />
              <div className="mega-nav__panel-grid">
                <span data-menu-fade="" className="mega-nav__panel-grid-label">
                  Cities we serve
                </span>
                {locationsDropdown.map((item) => (
                  <div key={item.href} data-menu-fade="">
                    <PanelLink href={item.href} label={item.label} desc={item.desc} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-menu-backdrop="" className="mega-nav__backdrop" />

      {/* ── Mobile menu — light terminal-industries-style overlay.
         White bg with subtle blur, ink typography, accordion
         submenus that expand inline (Services / Locations). Bottom:
         tel link + AccentPill quote button.

         Rendered into a Portal on `document.body` because the parent
         <nav> applies a CSS `transform` (scroll-hide animation) —
         a transform creates a containing block, which would shrink
         this fixed-positioned overlay down to the 78px nav height
         and clip everything except the bottom CTA pair. The portal
         escapes that containing block and the overlay reliably
         fills the viewport. ──────────────────── */}
      {portalMounted && createPortal(
      <div
        className="lg:hidden"
        aria-hidden={!mobileMenuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          transition: "opacity .35s ease-out",
        }}
      >
        {/* Light glass: solid white with subtle blur. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            backgroundColor: "#ffffff",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />

        {/* Spacer below the 78px nav bar (header float-margin 10px + bar 60px content + a bit). */}
        <div style={{ flexShrink: 0, height: "92px" }} />

        {/* Nav links — all items pinned to the BOTTOM of the
           available middle area (just above the CTA pair). We use
           `margin-top: auto` on the inner <nav> rather than
           `justify-content: flex-end` on the parent: the flex-end
           pattern combined with `overflow-y: auto` causes the START
           of the overflowing content to be CLIPPED and unreachable
           by scroll on short viewports (Safari with address bar
           expanded, small phones) — so only the bottom CTA pair
           remained visible. With margin-top: auto the gap collapses
           to 0 as soon as content can't fit, and the natural top
           anchor lets the user scroll to all items. */}
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
            {/* All nav items render in document order; the parent's
               `justifyContent: flex-end` pushes them as a group to
               the bottom of the nav scroll area. */}
            {mobileNavLinks.filter(l => l.items).map((link, idx) => (
              <div
                key={link.label}
                style={{
                  borderTop:
                    idx === 0 ? "1px solid rgba(0,31,77,0.10)" : "0",
                  borderBottom: "1px solid rgba(0,31,77,0.10)",
                }}
              >
                {link.items ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileSubmenu(
                          mobileSubmenu === link.label ? null : link.label,
                        )
                      }
                      aria-expanded={mobileSubmenu === link.label}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "18px 0",
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: 24,
                        fontWeight: 400,
                        lineHeight: 1.2,
                        letterSpacing: "-0.6px",
                        color: "#001f4d",
                        textAlign: "left",
                        transition: "color .2s ease",
                      }}
                    >
                      {link.label}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{
                          color: "rgba(0,31,77,0.45)",
                          transform:
                            mobileSubmenu === link.label
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          transition: "transform .25s ease",
                          flexShrink: 0,
                        }}
                        aria-hidden
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      style={{
                        overflow: "hidden",
                        display: "grid",
                        gridTemplateColumns:
                          link.label === "Locations"
                            ? "repeat(2, minmax(0, 1fr))"
                            : "1fr",
                        columnGap: 16,
                        rowGap: 0,
                        maxHeight:
                          mobileSubmenu === link.label ? "800px" : "0px",
                        opacity: mobileSubmenu === link.label ? 1 : 0,
                        paddingBottom:
                          mobileSubmenu === link.label ? 12 : 0,
                        transition:
                          "max-height .3s ease-out, opacity .3s ease-out, padding-bottom .3s ease-out",
                      }}
                    >
                      {link.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          style={{
                            display: "block",
                            padding: "10px 0",
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: 18,
                            fontWeight: 400,
                            lineHeight: 1.25,
                            letterSpacing: "-0.4px",
                            color: "rgba(0,31,77,0.7)",
                            textDecoration: "none",
                            transition: "color .2s ease",
                          }}
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "18px 0",
                      fontFamily: "var(--font-sans, system-ui, sans-serif)",
                      fontSize: 24,
                      fontWeight: 400,
                      lineHeight: 1.2,
                      letterSpacing: "-0.6px",
                      color: "#001f4d",
                      textDecoration: "none",
                      transition: "color .2s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Secondary items (Reviews / FAQ / Contacts) follow
               immediately — all items together, pinned bottom of
               nav area via the parent's `justifyContent: flex-end`.
               No `border-top` here: the previous primary item
               (Locations) already paints its `border-bottom` and a
               stacked second 1px line read as a thicker bar. */}
            {mobileNavLinks.filter(l => !l.items).map((link) => (
              <div
                key={link.label}
                style={{
                  borderTop: 0,
                  borderBottom: "1px solid rgba(0,31,77,0.10)",
                }}
              >
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "18px 0",
                    fontFamily: "var(--font-sans, system-ui, sans-serif)",
                    fontSize: 22,
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: "-0.5px",
                    color: "#001f4d",
                    textDecoration: "none",
                    transition: "color .2s ease",
                  }}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom CTA buttons — phone (outlined pill) + Quote AccentPill. */}
        <div
          style={{
            padding: "0 24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <a
            href={`tel:${PHONE_RAW}`}
            onClick={closeMobileMenu}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              height: 66,
              borderRadius: 999,
              backgroundColor: "transparent",
              border: "1px solid rgba(0,31,77,0.18)",
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.3px",
              color: "#001f4d",
              textDecoration: "none",
              transition: "background-color .2s ease, border-color .2s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden
              style={{ color: "#0066ff" }}
            >
              <path d="M4.37 11.62c2.49 2.49 5.52 4.41 7.99 4.41 1.11 0 2.08-.39 2.87-1.25.46-.51.74-1.1.74-1.69 0-.43-.16-.84-.58-1.13l-2.64-1.88c-.4-.27-.74-.41-1.05-.41-.4 0-.74.22-1.13.61l-.61.6c-.04.05-.09.08-.15.1-.05.02-.11.03-.17.03-.14 0-.26-.05-.35-.09-.52-.28-1.43-1.06-2.28-1.91-.84-.84-1.62-1.75-1.9-2.29-.06-.11-.09-.22-.09-.34 0-.11.03-.22.13-.31l.6-.63c.39-.4.61-.74.61-1.13 0-.31-.14-.65-.42-1.06L4.04.6C3.74.18 3.32 0 2.86 0 2.29 0 1.7.26 1.21.75.36 1.55 0 2.54 0 3.63c0 2.47 1.88 5.5 4.37 7.99z" />
            </svg>
            {PHONE_DISPLAY}
          </a>
          <AccentPill
            size="lg"
            fullWidth
            onClick={() => {
              closeMobileMenu();
              window.dispatchEvent(new CustomEvent("open-quote-modal"));
            }}
          >
            Get a free quote
          </AccentPill>
        </div>
      </div>,
      document.body,
      )}
    </nav>
  );
}

/* Phone icon — direct `tel:` link, no dropdown. Tap on mobile dials
   immediately; click on desktop offers the system dial handler. */
const PHONE_DISPLAY = "+1 380-524-0846";
const PHONE_RAW = "+13805240846";

function PhoneLink() {
  return (
    <a
      href={`tel:${PHONE_RAW}`}
      aria-label="Call GOAT Movers"
      className="mp5-phone-pill inline-flex items-center justify-center cursor-pointer rounded-full"
      style={{
        width: 44,
        height: 44,
        backgroundColor: "#ffffff",
        color: "#0066ff",
        border: "0",
        textDecoration: "none",
        transition: "transform .25s ease, background-color .25s ease",
      }}
    >
      <PhoneIcon className="w-4 h-4" />
    </a>
  );
}

/* Vertical text-swap label (icomat.co.uk / rejouice style). The visible
   word slides up and a duplicate beneath rises into its place; both
   copies are identical so it reads as the same text refreshing itself. */
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

function FeatureCard({
  href,
  src,
  alt,
  label,
}: {
  href: string;
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <Link
      data-menu-fade=""
      href={href}
      className="mega-nav__panel-feature"
      aria-label={label}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="240px"
        className="mega-nav__panel-feature-img"
      />
      <div className="mega-nav__panel-feature-overlay">
        <span className="mega-nav__panel-feature-label">{label}</span>
        <span className="mega-nav__panel-feature-cta" aria-hidden>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m8 14 4-4-4-4" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function PanelLink({
  href,
  label,
  desc,
  onNavigate,
}: {
  href: string;
  label: string;
  desc?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link href={href} className="mega-nav__panel-link" onClick={onNavigate}>
      <span className="mega-nav__panel-link-body">
        <span className="mega-nav__panel-link-text">
          {label.split("").map((ch, i) => (
            <span
              key={i}
              className="mega-nav__panel-link-char"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
        {desc && <span className="mega-nav__panel-link-desc">{desc}</span>}
      </span>
      <svg
        className="mega-nav__panel-link-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6.6665 8.3335L9.99984 11.6668L13.3332 8.3335"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M8.3335 13.3335L11.6668 10.0002L8.3335 6.66683"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M11.6665 6.6665L8.33317 9.99984L11.6665 13.3332"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M4.37 11.62c2.49 2.49 5.52 4.41 7.99 4.41 1.11 0 2.08-.39 2.87-1.25.46-.51.74-1.1.74-1.69 0-.43-.16-.84-.58-1.13l-2.64-1.88c-.4-.27-.74-.41-1.05-.41-.4 0-.74.22-1.13.61l-.61.6c-.04.05-.09.08-.15.1-.05.02-.11.03-.17.03-.14 0-.26-.05-.35-.09-.52-.28-1.43-1.06-2.28-1.91-.84-.84-1.62-1.75-1.9-2.29-.06-.11-.09-.22-.09-.34 0-.11.03-.22.13-.31l.6-.63c.39-.4.61-.74.61-1.13 0-.31-.14-.65-.42-1.06L4.04.6C3.74.18 3.32 0 2.86 0 2.29 0 1.7.26 1.21.75.36 1.55 0 2.54 0 3.63c0 2.47 1.88 5.5 4.37 7.99z" />
    </svg>
  );
}
