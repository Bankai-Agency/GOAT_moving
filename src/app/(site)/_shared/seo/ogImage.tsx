import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared OG image renderer — used by the root and per-service `opengraph-image.tsx`.
 * One consistent layout, only the per-page copy differs.
 */
export function renderOGImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#FFE533",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 900,
              color: "#0c0c0c",
              letterSpacing: "-2px",
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>GOAT</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#FFE533", letterSpacing: "4px", marginTop: 4 }}>MOVERS</span>
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {eyebrow && (
            <span style={{ fontSize: 24, fontWeight: 700, color: "#FFE533", letterSpacing: "3px", textTransform: "uppercase" }}>{eyebrow}</span>
          )}
          <span style={{ fontSize: 84, fontWeight: 900, color: "#fff", letterSpacing: "-3px", lineHeight: 1 }}>{title}</span>
          <span style={{ fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.7)", lineHeight: 1.3 }}>{subtitle}</span>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 28px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 900, color: "#FFE533" }}>★ 4.9/5</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>850+ reviews</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 64, fontWeight: 900, color: "#FFE533", letterSpacing: "-2px", lineHeight: 1 }}>$125</span>
            <span style={{ fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>/hr</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
