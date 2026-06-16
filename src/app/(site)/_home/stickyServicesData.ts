/* Data for the sticky-steps services block. Plain module (no "use
   client") so server components (e.g. mainpage-6) can import the array
   directly while the client StickyServices component renders it. */
export type StickyStep = {
  eyebrow: string;
  h2: string;
  p: string;
  image: string;
  video: string;
  /* Mobile object-fit for the clip. Defaults to "cover" (full-frame
     footage). Use "contain" for a single centred subject on a solid bg
     (e.g. the old bubble-wrapped vase) that cover would crop. */
  fit?: "cover" | "contain";
};

/* Sticky-steps block now carries the GOAT service catalogue — same
   visual (Osmo Supply sticky-pin with char-wave h2 + clip-path image
   reveal), different content. Three core services (Local, Long
   Distance, Commercial) come from the live `/` ServicesSection; the
   four packing offerings (Full-Service, Partial, Labor Only,
   Unpacking) come from `/packing-services` to reflect what GOAT
   actually advertises beyond the four top-level pages. */
/* Per-step background video. The sticky-steps visual is now an
   autoplaying <video> (was a scroll-scrubbed canvas): the clip plays on
   its own, and scrolling only switches which step/video is shown. For
   now every step reuses the Local Moving clip as a placeholder — drop a
   distinct file path in a step's `video` to differentiate it. `image`
   stays as the <video poster> (first-paint fallback). */
const STEP_VIDEO = "/videos/service-local-moving.mp4";
export const defaultStickySteps: StickyStep[] = [
  {
    eyebrow: "Service 01",
    h2: "Local Moving",
    p: "Residential moves across Vancouver, WA, Portland, OR, and the surrounding metro. Packing, loading, transportation, unloading, unpacking — all included, no hidden fees.",
    image: "/images/service-local.webp",
    video: STEP_VIDEO,
  },
  {
    eyebrow: "Service 02",
    h2: "Long Distance",
    p: "Interstate relocations from the Pacific Northwest. USDOT-licensed (#4232069) and fully insured for cross-state moves of any size.",
    image: "/images/service-longdistance.webp",
    video: "/videos/service-long-distance.mp4",
  },
  {
    eyebrow: "Service 03",
    h2: "Commercial Moving",
    p: "Office and commercial relocations in Vancouver and Portland with minimal downtime. Equipment, furniture, and sensitive documents handled safely and on schedule.",
    image: "/images/service-commercial.webp",
    video: "/videos/service-commercial.mp4",
  },
  {
    eyebrow: "Service 04",
    h2: "Full-Service Packing",
    p: "We pack everything — every room, every drawer, every fragile item. You keep working, we handle the boxes. Best for busy professionals, last-minute moves, and families with young kids.",
    image: "/images/service-packing.webp",
    video: "/videos/service-packing.mp4",
  },
];
