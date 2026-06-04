"use client";

import { useState, type CSSProperties } from "react";
import { SECTION_LIST, type SectionId } from "./LPSectionRenderer";

type Theme = "light" | "dark";

/* Per-section iframe height. Most LP sections size their content
   to roughly viewport-height (~720-900px) — hero is full 100dvh,
   reviews + service-area are shorter. Generous defaults so the
   iframe doesn't introduce its own scrollbar on common content. */
const HEIGHT: Record<SectionId, number> = {
  primitives: 760,
  nav: 220,
  hero: 920,
  services: 920,
  solution: 1100,
  about: 880,
  cta: 620,
  process: 940,
  reviews: 820,
  "lp-cta-form": 760,
  "service-area": 580,
  faq: 760,
  footer: 760,
  touchbar: 200,
};

/* Desktop iframe nominal width — close to the LP design grid
   (max-w-[1408px]). Mobile iframe is fixed 390px. */
const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 390;

export function DesignSystem2Client() {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#0a0a0a" : "#f5f7fb",
        color: theme === "dark" ? "#f1f3f6" : "#001f4d",
        fontFamily: "var(--font-geist-sans, system-ui)",
      }}
    >
      <Toolbar theme={theme} onThemeChange={setTheme} />

      <main style={{ maxWidth: 1720, margin: "0 auto", padding: "32px 24px 96px" }}>
        <header style={{ padding: "24px 0 32px" }}>
          <p
            style={{
              fontFamily: "var(--font-roboto-mono, ui-monospace)",
              textTransform: "uppercase",
              letterSpacing: 2,
              fontSize: 11,
              opacity: 0.6,
              margin: 0,
            }}
          >
            Design System 2
          </p>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 600,
              letterSpacing: "-1.4px",
              lineHeight: 1.05,
              margin: "8px 0 12px",
            }}
          >
            Portland Landing Page — Component Catalog
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.7, maxWidth: 720, margin: 0 }}>
            Every section, primitive, and animation used on{" "}
            <code style={{ fontFamily: "var(--font-roboto-mono, ui-monospace)" }}>/lp/movers-portland</code>.
            Desktop view on the left, mobile (390px) iframe on the right. Toggle Light / Dark
            to preview each section against the LP&apos;s native palette and the imitated
            DarkScrollZone state.
          </p>
        </header>

        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: "16px 0 24px",
            borderBottom:
              theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e6ec",
          }}
        >
          {SECTION_LIST.map((s) => (
            <a
              key={s.id}
              href={`#section-${s.id}`}
              style={{
                fontSize: 12,
                fontFamily: "var(--font-roboto-mono, ui-monospace)",
                textTransform: "uppercase",
                letterSpacing: 1.2,
                padding: "8px 14px",
                borderRadius: 999,
                border:
                  theme === "dark"
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid #e2e6ec",
                color: "inherit",
                textDecoration: "none",
                opacity: 0.85,
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "grid", gap: 56, paddingTop: 32 }}>
          {SECTION_LIST.map((s) => (
            <SectionShowcase key={s.id} id={s.id} label={s.label} description={s.description} theme={theme} />
          ))}
        </div>
      </main>
    </div>
  );
}

function Toolbar({ theme, onThemeChange }: { theme: Theme; onThemeChange: (t: Theme) => void }) {
  const isDark = theme === "dark";
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: isDark ? "rgba(10,10,10,0.85)" : "rgba(245,247,251,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e6ec",
      }}
    >
      <div
        style={{
          maxWidth: 1720,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <strong style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.2px" }}>
            DS2 · LP Portland
          </strong>
          <a
            href="/design-system"
            style={{
              fontSize: 12,
              opacity: 0.6,
              color: "inherit",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            ↳ legacy /design-system
          </a>
        </div>
        <ThemeSwitch theme={theme} onThemeChange={onThemeChange} />
      </div>
    </div>
  );
}

function ThemeSwitch({ theme, onThemeChange }: { theme: Theme; onThemeChange: (t: Theme) => void }) {
  const isDark = theme === "dark";
  const pill: CSSProperties = {
    fontFamily: "var(--font-roboto-mono, ui-monospace)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: 600,
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    transition: "all 0.18s ease",
  };
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        borderRadius: 999,
        backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#e8ecf2",
      }}
    >
      <button
        type="button"
        onClick={() => onThemeChange("light")}
        style={{
          ...pill,
          backgroundColor: !isDark ? "#0066ff" : "transparent",
          color: !isDark ? "#fff" : "inherit",
        }}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => onThemeChange("dark")}
        style={{
          ...pill,
          backgroundColor: isDark ? "#0066ff" : "transparent",
          color: isDark ? "#fff" : "inherit",
        }}
      >
        Dark
      </button>
    </div>
  );
}

function SectionShowcase({
  id,
  label,
  description,
  theme,
}: {
  id: SectionId;
  label: string;
  description: string;
  theme: Theme;
}) {
  const isDark = theme === "dark";
  const cardBg = isDark ? "#0f0f10" : "#ffffff";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e6ec";
  const subtle = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,31,77,0.55)";

  const height = HEIGHT[id];
  const previewSrc = `/design-system2/preview/${id}?theme=${theme}`;

  return (
    <section
      id={`section-${id}`}
      style={{
        borderRadius: 16,
        backgroundColor: cardBg,
        border: cardBorder,
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: "20px 24px",
          borderBottom: cardBorder,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-roboto-mono, ui-monospace)",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontSize: 11,
              color: subtle,
              margin: 0,
            }}
          >
            #{id}
          </p>
          <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.4px", margin: "4px 0 6px" }}>
            {label}
          </h2>
          <p style={{ fontSize: 14, color: subtle, margin: 0 }}>{description}</p>
        </div>
        <a
          href={previewSrc}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-roboto-mono, ui-monospace)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            padding: "8px 14px",
            borderRadius: 999,
            border: cardBorder,
            color: "inherit",
            textDecoration: "none",
            opacity: 0.85,
          }}
        >
          Open preview ↗
        </a>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `minmax(0, 1fr) ${MOBILE_WIDTH + 32}px`,
          gap: 16,
          padding: 16,
          alignItems: "start",
        }}
      >
        {/* Desktop preview — iframe rendered at DESKTOP_WIDTH then
            scaled to fit its column. transform-origin top-left so it
            anchors flush to the card. Height pre-scaled too so the
            visible box matches what user sees. */}
        <ViewportFrame
          variant="desktop"
          src={previewSrc}
          nominalWidth={DESKTOP_WIDTH}
          nominalHeight={height}
          theme={theme}
          subtle={subtle}
        />
        <ViewportFrame
          variant="mobile"
          src={previewSrc}
          nominalWidth={MOBILE_WIDTH}
          nominalHeight={height}
          theme={theme}
          subtle={subtle}
        />
      </div>
    </section>
  );
}

/* Renders an iframe at a nominal viewport width, scaled down via
   CSS transform to fit the column. The iframe itself reports the
   nominal width to its loaded page (so media queries fire as if
   the user really had that viewport), and the visible box is the
   transformed result. */
function ViewportFrame({
  variant,
  src,
  nominalWidth,
  nominalHeight,
  theme,
  subtle,
}: {
  variant: "desktop" | "mobile";
  src: string;
  nominalWidth: number;
  nominalHeight: number;
  theme: Theme;
  subtle: string;
}) {
  const isDark = theme === "dark";
  /* Desktop: scale to fit column. Mobile: render 1:1 at 390px. */
  const scale = variant === "desktop" ? 0.62 : 1;
  const containerHeight = nominalHeight * scale;
  const label = variant === "desktop" ? `Desktop · ${nominalWidth}px` : `Mobile · ${nominalWidth}px`;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <p
        style={{
          fontFamily: "var(--font-roboto-mono, ui-monospace)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: subtle,
          margin: 0,
        }}
      >
        {label}
      </p>
      <div
        style={{
          position: "relative",
          width: variant === "mobile" ? nominalWidth : "100%",
          height: containerHeight,
          borderRadius: 12,
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #d8dde6",
          overflow: "hidden",
          backgroundColor: isDark ? "#000" : "#fff",
        }}
      >
        <iframe
          title={`${variant} preview`}
          src={src}
          loading="lazy"
          style={{
            border: 0,
            width: nominalWidth,
            height: nominalHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
