"use client";

type TruckSvgProps = {
  width?: number;
  height?: number;
  /* Toggles a subtle yellow glow ahead of the headlights when the
     truck reaches the CTA "arrival" beat. */
  headlightsOn?: boolean;
  className?: string;
};

/* Side-view box truck. Drawn entirely in SVG so we can scale freely
   and tint via CSS — no external image asset. Geometry is hand-tuned
   to read at small sizes (~96 px wide) without losing the silhouette.
   Coordinate system: 320×160, cab on the left, box body on the right. */
export function TruckSvg({
  width = 240,
  height = 120,
  headlightsOn = false,
  className,
}: TruckSvgProps) {
  return (
    <svg
      viewBox="0 0 320 160"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Headlight beam (only when toggled on) */}
      {headlightsOn && (
        <>
          <defs>
            <linearGradient id="beam" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stopColor="#FFE533" stopOpacity="0" />
              <stop offset="100%" stopColor="#FFE533" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <polygon points="32,108 -120,72 -120,140 32,124" fill="url(#beam)" />
        </>
      )}

      {/* Box body */}
      <rect x="64" y="38" width="216" height="86" rx="6" fill="#FFE533" stroke="#0c0c0c" strokeWidth="3" />
      {/* Box body horizontal panels */}
      <line x1="76" y1="62" x2="268" y2="62" stroke="#0c0c0c" strokeOpacity="0.18" strokeWidth="1.5" />
      <line x1="76" y1="100" x2="268" y2="100" stroke="#0c0c0c" strokeOpacity="0.18" strokeWidth="1.5" />
      {/* Brand wordmark on the side */}
      <text
        x="172"
        y="86"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="0.02em"
        fill="#0c0c0c"
      >
        GOAT
      </text>
      <text
        x="172"
        y="106"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.18em"
        fill="#0c0c0c"
      >
        MOVERS
      </text>

      {/* Cab */}
      <path
        d="M 8 124 L 8 78 Q 8 70 16 70 L 36 70 L 52 50 L 64 50 L 64 124 Z"
        fill="#0c0c0c"
        stroke="#0c0c0c"
        strokeWidth="2"
      />
      {/* Cab window */}
      <path d="M 18 78 L 38 78 L 50 60 L 18 60 Z" fill="#FFE533" opacity="0.22" />
      {/* Door handle */}
      <rect x="48" y="92" width="10" height="3" rx="1" fill="#FFE533" opacity="0.6" />

      {/* Bumper / chassis line */}
      <rect x="6" y="124" width="276" height="6" fill="#0c0c0c" />

      {/* Wheels */}
      <g>
        <circle cx="48" cy="138" r="14" fill="#0c0c0c" />
        <circle cx="48" cy="138" r="5" fill="#FFE533" />
      </g>
      <g>
        <circle cx="232" cy="138" r="14" fill="#0c0c0c" />
        <circle cx="232" cy="138" r="5" fill="#FFE533" />
      </g>
    </svg>
  );
}
