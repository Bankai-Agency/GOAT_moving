import "./bankai-link.css";

/* Bankai Agency attribution link with the red lightning hover
   animation (pure CSS — see bankai-link.css). Drops into any footer's
   "Design & development by" line. Source animation:
   ~/Projects/bankai-logo-animation.html. */

const BOLT_PATH =
  "M0.530008 4.43966L13.5591 0.442106C13.9327 0.327463 14.2106 0.789407 13.9342 1.06577L7.92691 7.0731C7.73792 7.26208 7.87176 7.58523 8.13904 7.58523H11.1043C11.4395 7.58523 11.6063 7.99129 11.368 8.2269L5.15569 14.3686C4.91884 14.6028 4.51705 14.435 4.51705 14.1019V10.8682C4.51705 10.7025 4.38273 10.5682 4.21705 10.5682H0.75C0.335786 10.5682 0 10.2324 0 9.81818V5.15667C0 4.82719 0.215025 4.5363 0.530008 4.43966Z";

/* Mini bolts that flicker around the main bolt on hover (decorative). */
const MINI_BOLTS = [
  { size: 10, fill: "#ef4444" },
  { size: 8, fill: "#f87171" },
  { size: 7, fill: "#fca5a5" },
  { size: 9, fill: "#ef4444" },
  { size: 8, fill: "#f87171" },
];

export function BankaiLink({
  href = "https://bankai.agency/ru",
}: {
  href?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bankai-link shrink-0"
      aria-label="Bankai Agency"
    >
      <span className="bankai-icon" aria-hidden>
        <span className="mini-bolts">
          {MINI_BOLTS.map((b, i) => (
            <svg
              key={i}
              className="mini-bolt"
              xmlns="http://www.w3.org/2000/svg"
              width={b.size}
              height={b.size}
              viewBox="0 0 15 15"
              fill="none"
            >
              <path d={BOLT_PATH} fill={b.fill} />
            </svg>
          ))}
        </span>
        <svg
          className="main-bolt"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
        >
          <path d={BOLT_PATH} fill="white" fillOpacity="0.6" />
        </svg>
      </span>
      <span className="bankai-text">BANKAI.AGENCY</span>
    </a>
  );
}
