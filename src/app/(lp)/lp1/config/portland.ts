/**
 * Portland landing page content for /lp1.
 *
 * Self-contained — no multi-city config tree. Adding a new city = copy
 * this file, rename the export, point a new route at it.
 */

export type LP1Config = {
  /** URL slug — unused on /lp1 (single route) but kept for parity. */
  slug: string;
  /** Short, displayed city name used in headings and copy. */
  city: string;
  /** Two-letter state code. */
  state: "OR" | "WA";
  /** Full state name used in "licensed and insured in …" FAQ copy. */
  licenseState: "Oregon" | "Washington";
  /** Public path to the hero background image. */
  heroImage: string;
  /** Optional Tailwind `object-position` override for the hero image on mobile. */
  heroImagePosition?: string;
  /** `<title>` shown in the browser tab and SERP. */
  metaTitle: string;
  /** `<meta name="description">` content. */
  metaDescription: string;
  /** Copy rendered below the social-proof heading. */
  aboutDescription: string;
  /** Text overrides for individual "What's Included" cards. */
  solutionCopy: {
    truck: string;
    equipment: string;
    floorProtection: string;
  };
  localMovingDescription: string;
  commercialDescription?: string;
  serviceAreaSubtitle: string;
  neighborhoods: string[];
  faqs: { question: string; answer: string }[];
  socialProofImage?: string;
};

/* Backwards-compat alias for callers that imported `CityLPConfig`. */
export type CityLPConfig = LP1Config;

export const portlandConfig: LP1Config = {
  slug: "movers-portland",
  city: "Portland",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/home-hero.png",
  heroImagePosition: "object-[25%_center]",
  metaTitle: "Stress-Free Movers in Portland — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Portland, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Portland and the I-5 corridor.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Portland and the I-5 corridor.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Portland's rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — essential for Pearl District walkups and historic Northwest buildings.",
  },
  localMovingDescription:
    "Residential moves within Portland and surrounding neighborhoods — Pearl District, Northwest, Sellwood, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From the Pearl District to Sellwood and the West Side suburbs — we cover the entire Portland metro and every neighborhood in between.",
  neighborhoods: [
    "Pearl District",
    "Northwest",
    "Downtown",
    "Sellwood",
    "Hawthorne",
    "St. Johns",
    "Beaverton",
    "Milwaukie",
  ],
  faqs: [
    {
      question: "How much do movers cost in Portland?",
      answer:
        "$400–$900 depending on size and distance. Studio/1BR $400–$700, 2BR $600–$900, 3BR+ $900+.",
    },
    {
      question: "Are you licensed and insured in Oregon?",
      answer: "Yes. Fully licensed and insured. Every move includes liability coverage.",
    },
    {
      question: "What happens if something gets damaged?",
      answer: "We resolve claims quickly. Report within 24 hours of delivery.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "5–7 days recommended, especially in summer. Last-minute requests handled when possible.",
    },
    {
      question: "Do you handle Pearl District high-rises and walkups?",
      answer:
        "Yes. We manage elevator reservations, COI requirements, and Northwest walkup moves regularly.",
    },
    {
      question: "Do you handle moves between Portland and Vancouver, WA?",
      answer:
        "Yes, cross-river moves are one of our most common routes. Same transparent pricing, no bridge surcharges.",
    },
  ],
  socialProofImage: "/lp/portland-city.jpg",
};
