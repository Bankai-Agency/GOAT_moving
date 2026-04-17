/**
 * Per-city content for the /lp/* landing pages.
 *
 * Each city shares the same structure as Portland (the template): same blocks,
 * same typography, same CTAs. Only the content that actually differs by
 * location is stored per city here — everything else is baked into
 * `CityLandingPage` so every LP stays in sync.
 */

export type CityLPConfig = {
  /** URL slug under `/lp/{slug}`. */
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
    /** "Moving Truck & Fuel" description. */
    truck: string;
    /** "Equipment" description. */
    equipment: string;
    /** "Floor & Door Protection" description. */
    floorProtection: string;
  };
  /** "Local Moving" service card description. */
  localMovingDescription: string;
  /** Optional override for the "Commercial Moving" service card description. */
  commercialDescription?: string;
  /** Subtitle shown under "We're Already Moving People in {City}". */
  serviceAreaSubtitle: string;
  /** Names of neighborhoods rendered as cards in the Service Area grid. */
  neighborhoods: string[];
  /** 6 FAQs — first 4 are standard, last 2 are city-specific. */
  faqs: { question: string; answer: string }[];
};

const standardFaqAnswers = {
  pricing:
    "$400–$900 depending on size and distance. Studio/1BR $400–$700, 2BR $600–$900, 3BR+ $900+.",
  licensed: "Yes. Fully licensed and insured. Every move includes liability coverage.",
  damaged: "We resolve claims quickly. Report within 24 hours of delivery.",
  booking:
    "5–7 days recommended, especially in summer. Last-minute requests handled when possible.",
};

/** Build the four common FAQ questions + two city-specific ones. */
function buildFaqs(
  city: string,
  licenseState: "Oregon" | "Washington",
  extras: { question: string; answer: string }[],
): { question: string; answer: string }[] {
  return [
    { question: `How much do movers cost in ${city}?`, answer: standardFaqAnswers.pricing },
    { question: `Are you licensed and insured in ${licenseState}?`, answer: standardFaqAnswers.licensed },
    { question: "What happens if something gets damaged?", answer: standardFaqAnswers.damaged },
    { question: "How far in advance should I book?", answer: standardFaqAnswers.booking },
    ...extras,
  ];
}

/** All cities use hero photos with the mover framed on the LEFT third
 *  (per the Freepik prompt). To keep the mover visible on narrow mobile
 *  viewports, shift the crop focal point to ~25% from the left. */
const HERO_MOBILE_POSITION = "object-[25%_center]";

/* ────────────────────── OREGON ────────────────────── */

export const portlandConfig: CityLPConfig = {
  slug: "movers-portland",
  city: "Portland",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/portland-city2.png",
  heroImagePosition: HERO_MOBILE_POSITION,
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
  faqs: buildFaqs("Portland", "Oregon", [
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
  ]),
};

export const hillsboroConfig: CityLPConfig = {
  slug: "movers-hillsboro",
  city: "Hillsboro",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/hillsboro-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Hillsboro — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Hillsboro, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Hillsboro and the Westside tech corridor.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Hillsboro, the Silicon Forest, and the I-5 corridor.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — tuned for Orenco Station townhomes and Tanasbourne apartments.",
  },
  localMovingDescription:
    "Residential moves within Hillsboro and surrounding neighborhoods — Orenco Station, Tanasbourne, AmberGlen, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Orenco Station to Reedville — we cover the entire Hillsboro area and every neighborhood in between.",
  neighborhoods: [
    "Orenco Station",
    "Tanasbourne",
    "AmberGlen",
    "Downtown Hillsboro",
    "Aloha",
    "Witch Hazel",
    "Reedville",
    "Bethany",
  ],
  faqs: buildFaqs("Hillsboro", "Oregon", [
    {
      question: "Do you handle moves to and from Intel campuses?",
      answer:
        "Yes. We regularly handle relocations for tech workers across Hillsboro's Intel and Tanasbourne area.",
    },
    {
      question: "Do you charge extra for driving from Portland?",
      answer:
        "No. We serve Hillsboro directly. No distance surcharges, same pricing as any other city.",
    },
  ]),
};

export const tigardConfig: CityLPConfig = {
  slug: "movers-tigard",
  city: "Tigard",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/tigard-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Tigard — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Tigard, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Tigard and the Washington County suburbs.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Tigard and the I-5 / 99W corridor.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — essential for Bridgeport apartment complexes and Bull Mountain homes.",
  },
  localMovingDescription:
    "Residential moves within Tigard and surrounding neighborhoods — Bridgeport, Bull Mountain, Metzger, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Bridgeport to King City — we cover the entire Tigard area and every neighborhood in between.",
  neighborhoods: [
    "Bridgeport",
    "Downtown Tigard",
    "Bull Mountain",
    "Metzger",
    "Summerfield",
    "King City",
    "Tualatin",
    "Durham",
  ],
  faqs: buildFaqs("Tigard", "Oregon", [
    {
      question: "Do you handle apartment complexes near Bridgeport Village?",
      answer:
        "Yes. We handle elevator reservations, loading zones, and tight parking common in the area.",
    },
    {
      question: "Can you avoid 99W and I-5 rush hours?",
      answer:
        "Yes. We plan your move window around Tigard's traffic patterns to avoid delays.",
    },
  ]),
};

export const lakeOswegoConfig: CityLPConfig = {
  slug: "movers-lake-oswego",
  city: "Lake Oswego",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/lake-oswego-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Lake Oswego — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Lake Oswego, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Lake Oswego and the South Metro.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Lake Oswego and the Portland metro.",
    equipment: "Dollies, furniture blankets, straps, specialty padding for antiques and fine furniture — all included.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — careful handling for Lake Grove estates and lakefront homes.",
  },
  localMovingDescription:
    "Residential moves within Lake Oswego and surrounding neighborhoods — First Addition, Lake Grove, Mountain Park, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From First Addition to Forest Highlands — we cover the entire Lake Oswego area and every neighborhood in between.",
  neighborhoods: [
    "First Addition",
    "Lake Grove",
    "Mountain Park",
    "Westlake",
    "Uplands",
    "Forest Highlands",
    "Palisades",
    "Hallinan",
  ],
  faqs: buildFaqs("Lake Oswego", "Oregon", [
    {
      question: "Can you handle antiques, pianos, and specialty items?",
      answer:
        "Yes. We regularly move pianos, pool tables, antiques, and oversized furniture with full protection.",
    },
    {
      question: "Do you follow HOA rules for moving truck access?",
      answer:
        "Yes. We coordinate with HOAs for lakefront and gated community access in advance.",
    },
  ]),
};

export const oregonCityConfig: CityLPConfig = {
  slug: "movers-oregon-city",
  city: "Oregon City",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/oregon-city-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Oregon City — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Oregon City, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Oregon City and Clackamas County.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Oregon City and the Clackamas area.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — crucial for historic Canemah homes and narrow hillside staircases.",
  },
  localMovingDescription:
    "Residential moves within Oregon City and surrounding neighborhoods — McLoughlin, Hilltop, Canemah, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From McLoughlin to Caufield — we cover the entire Oregon City area and every neighborhood in between.",
  neighborhoods: [
    "McLoughlin",
    "Hilltop",
    "Canemah",
    "South End",
    "Park Place",
    "Caufield",
    "Beavercreek",
    "Redland",
  ],
  faqs: buildFaqs("Oregon City", "Oregon", [
    {
      question: "Can you handle steep driveways and bluff homes?",
      answer:
        "Yes. Our crews come equipped for hillside and narrow-driveway access common in Oregon City.",
    },
    {
      question: "Do you serve historic downtown homes?",
      answer:
        "Yes. We handle older homes with narrow stairways and tight entryways regularly.",
    },
  ]),
};

export const greshamConfig: CityLPConfig = {
  slug: "movers-gresham",
  city: "Gresham",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/gresham-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Gresham — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Gresham, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Gresham and East Multnomah County.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Gresham and the Portland metro.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — tuned for Rockwood apartments and Pleasant Valley homes.",
  },
  localMovingDescription:
    "Residential moves within Gresham and surrounding neighborhoods — Rockwood, Pleasant Valley, Powell Valley, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Rockwood to Kelly Creek — we cover the entire Gresham area and every neighborhood in between.",
  neighborhoods: [
    "Rockwood",
    "Pleasant Valley",
    "Downtown Gresham",
    "Powell Valley",
    "Centennial",
    "Kelly Creek",
    "Wilkes East",
    "Mt. Hood",
  ],
  faqs: buildFaqs("Gresham", "Oregon", [
    {
      question: "Do you charge Portland prices in Gresham?",
      answer: "No. Gresham gets the same transparent pricing as any other city we cover.",
    },
    {
      question: "Do you handle moves between Gresham and Portland?",
      answer: "Yes. Gresham-to-Portland is a common route for us with no extra distance fees.",
    },
  ]),
};

export const happyValleyConfig: CityLPConfig = {
  slug: "movers-happy-valley",
  city: "Happy Valley",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/happy-valley-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Happy Valley — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Happy Valley, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Happy Valley and the South Metro hills.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Happy Valley and the Portland metro.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — built for hillside homes and gated-community drives.",
  },
  localMovingDescription:
    "Residential moves within Happy Valley and surrounding neighborhoods — Altamont, Scouters Mountain, Mt. Scott, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Altamont to Eagle Landing — we cover the entire Happy Valley area and every neighborhood in between.",
  neighborhoods: [
    "Altamont",
    "Scouters Mountain",
    "Mt. Scott",
    "Rock Creek",
    "Sunnyside",
    "Eagle Landing",
    "Pleasant Valley",
    "Damascus",
  ],
  faqs: buildFaqs("Happy Valley", "Oregon", [
    {
      question: "Can you access gated communities?",
      answer:
        "Yes. We coordinate gate access and HOA requirements in advance so there are no delays.",
    },
    {
      question: "Do you handle steep driveway access?",
      answer: "Yes. Our crews plan routes and come equipped for Happy Valley's hillside homes.",
    },
  ]),
};

export const salemConfig: CityLPConfig = {
  slug: "movers-salem",
  city: "Salem",
  state: "OR",
  licenseState: "Oregon",
  heroImage: "/images/salem-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Salem — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Salem, OR. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Salem and the Mid-Willamette Valley.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Salem and the I-5 corridor.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — essential for downtown apartments and historic Salem homes.",
  },
  localMovingDescription:
    "Residential moves within Salem and surrounding neighborhoods — Downtown, South Salem, West Salem, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From South Salem to Keizer — we cover the entire Salem area and every neighborhood in between.",
  neighborhoods: [
    "Downtown",
    "South Salem",
    "West Salem",
    "Keizer",
    "Four Corners",
    "Northeast Salem",
    "Sunnyslope",
    "Pringle",
  ],
  faqs: buildFaqs("Salem", "Oregon", [
    {
      question: "Do you charge extra to serve Salem?",
      answer: "No. Salem gets the same pricing as Portland. No distance surcharges.",
    },
    {
      question: "Do you handle moves between Salem and Portland?",
      answer: "Yes. Salem-to-Portland is one of our regular routes with transparent pricing.",
    },
  ]),
};

/* ────────────────────── WASHINGTON ────────────────────── */

export const vancouverWaConfig: CityLPConfig = {
  slug: "movers-vancouver-wa",
  city: "Vancouver",
  state: "WA",
  licenseState: "Washington",
  heroImage: "/images/vancouver-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Vancouver — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Vancouver, WA. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Vancouver and the I-5 corridor.",
  solutionCopy: {
    truck:
      "Full-size truck and fuel included. No mileage charges across Vancouver and the I-5 corridor — including cross-river moves to Portland.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — essential for Mill Plain apartments and older homes in Hazel Dell and Downtown.",
  },
  localMovingDescription:
    "Residential moves within Vancouver, WA and surrounding neighborhoods — Mill Plain, Salmon Creek, Felida, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  commercialDescription:
    "Office and commercial relocations across Vancouver and the Portland metro with minimal downtime. Equipment, furniture, and sensitive documents handled safely and on schedule.",
  serviceAreaSubtitle:
    "From Salmon Creek to Mill Plain — we cover the entire Vancouver metro and every neighborhood in between.",
  neighborhoods: [
    "Downtown",
    "Felida",
    "Salmon Creek",
    "Hazel Dell",
    "Fisher's Landing",
    "Cascade Park",
    "Mill Plain",
    "Camas",
  ],
  faqs: buildFaqs("Vancouver", "Washington", [
    {
      question: "Do you handle moves between Vancouver, WA and Portland, OR?",
      answer:
        "Yes. Cross-river moves are one of our most common jobs. No bridge fees, same transparent pricing.",
    },
    {
      question: "Are you licensed in both Washington and Oregon?",
      answer: "Yes. Fully licensed in both states. Every move includes liability coverage.",
    },
  ]),
};

export const seattleConfig: CityLPConfig = {
  slug: "movers-seattle",
  city: "Seattle",
  state: "WA",
  licenseState: "Washington",
  heroImage: "/images/seattle-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Seattle — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Seattle, WA. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Seattle and the greater Puget Sound region.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Seattle and the Eastside.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Seattle's rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — essential for South Lake Union high-rises and historic Capitol Hill buildings.",
  },
  localMovingDescription:
    "Residential moves within Seattle and surrounding neighborhoods — Capitol Hill, Queen Anne, South Lake Union, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From South Lake Union to West Seattle — we cover the entire Seattle metro and every neighborhood in between.",
  neighborhoods: [
    "Capitol Hill",
    "Queen Anne",
    "South Lake Union",
    "Ballard",
    "Fremont",
    "Belltown",
    "West Seattle",
    "Magnolia",
  ],
  faqs: buildFaqs("Seattle", "Washington", [
    {
      question: "Can you handle high-rise and apartment moves?",
      answer:
        "Yes. We manage elevator reservations, loading dock scheduling, and COI requirements for Seattle buildings.",
    },
    {
      question: "Do you handle steep Seattle hills?",
      answer: "Yes. Queen Anne, Capitol Hill, and Magnolia are part of our daily routes.",
    },
  ]),
};

export const tacomaConfig: CityLPConfig = {
  slug: "movers-tacoma",
  city: "Tacoma",
  state: "WA",
  licenseState: "Washington",
  heroImage: "/images/tacoma-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Tacoma — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Tacoma, WA. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Tacoma and South Puget Sound.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Tacoma and the I-5 corridor.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — tuned for North End homes with narrow staircases and downtown buildings.",
  },
  localMovingDescription:
    "Residential moves within Tacoma and surrounding neighborhoods — North End, Stadium District, Downtown, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Stadium District to Federal Way — we cover the entire Tacoma area and every neighborhood in between.",
  neighborhoods: [
    "Tacoma Core",
    "North End",
    "Stadium District",
    "Downtown",
    "Lakewood",
    "Puyallup",
    "University Place",
    "Federal Way",
  ],
  faqs: buildFaqs("Tacoma", "Washington", [
    {
      question: "Do you handle Tacoma apartments and older homes?",
      answer:
        "Yes, including downtown buildings, narrow staircases in North End, and multi-level homes.",
    },
    {
      question: "Do you handle moves between Tacoma and Seattle?",
      answer: "Yes, one of our most common routes. Same transparent pricing.",
    },
  ]),
};

export const redmondConfig: CityLPConfig = {
  slug: "movers-redmond",
  city: "Redmond",
  state: "WA",
  licenseState: "Washington",
  heroImage: "/images/redmond-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Redmond — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Redmond, WA. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Redmond and the Eastside tech corridor.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Redmond and the Eastside.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — tuned for Overlake apartments and Education Hill homes.",
  },
  localMovingDescription:
    "Residential moves within Redmond and surrounding neighborhoods — Overlake, Downtown Redmond, Education Hill, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Overlake to Sammamish Valley — we cover the entire Redmond area and every neighborhood in between.",
  neighborhoods: [
    "Overlake",
    "Downtown Redmond",
    "Education Hill",
    "Grass Lawn",
    "Idylwood",
    "Sammamish Valley",
    "Bear Creek",
    "Willows",
  ],
  faqs: buildFaqs("Redmond", "Washington", [
    {
      question: "Do you handle Microsoft-area relocations?",
      answer:
        "Yes. We regularly help tech workers moving to and from Redmond, including from out of state.",
    },
    {
      question: "Can you avoid 520 and 405 rush hours?",
      answer: "Yes. We schedule your move window to avoid peak Eastside traffic.",
    },
  ]),
};

export const issaquahConfig: CityLPConfig = {
  slug: "movers-issaquah",
  city: "Issaquah",
  state: "WA",
  licenseState: "Washington",
  heroImage: "/images/issaquah-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Issaquah — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Issaquah, WA. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Issaquah and the East Puget Sound foothills.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Issaquah and the Eastside.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — built for multi-level hillside homes and narrow entryways.",
  },
  localMovingDescription:
    "Residential moves within Issaquah and surrounding neighborhoods — Issaquah Highlands, Gilman, Squak Mountain, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Issaquah Highlands to Providence Point — we cover the entire Issaquah area and every neighborhood in between.",
  neighborhoods: [
    "Issaquah Highlands",
    "Gilman",
    "Squak Mountain",
    "Talus",
    "Olde Town",
    "Providence Point",
    "Sammamish",
    "Klahanie",
  ],
  faqs: buildFaqs("Issaquah", "Washington", [
    {
      question: "Can you handle steep driveways and multi-level homes?",
      answer:
        "Yes. Many Issaquah homes are built on hills. Our crews plan ahead and come equipped.",
    },
    {
      question: "Do you handle Issaquah Highlands gated communities?",
      answer: "Yes. We coordinate gate access and HOA requirements in advance.",
    },
  ]),
};

export const everettConfig: CityLPConfig = {
  slug: "movers-everett",
  city: "Everett",
  state: "WA",
  licenseState: "Washington",
  heroImage: "/images/everett-city.png",
  heroImagePosition: HERO_MOBILE_POSITION,
  metaTitle: "Stress-Free Movers in Everett — $125/Hour | Goat Movers",
  metaDescription:
    "Professional movers in Everett, WA. Fixed price, no hidden fees. 437+ five-star reviews. Get your exact moving price in 30 seconds.",
  aboutDescription:
    "We show up on time, handle your belongings with care, and we're licensed and insured for every move across Everett and North Puget Sound.",
  solutionCopy: {
    truck: "Full-size truck and fuel included. No mileage charges across Everett and the I-5 corridor.",
    equipment: "Dollies, furniture blankets, straps, and tools — plus shrink wrap for Pacific Northwest rainy days.",
    floorProtection:
      "Floor runners, door-jamb pads, and wall guards — tuned for North Everett historic homes and Silver Lake apartments.",
  },
  localMovingDescription:
    "Residential moves within Everett and surrounding neighborhoods — North Everett, South Everett, Bayside, and beyond. Packing, loading, transportation, and unloading with no hidden fees.",
  serviceAreaSubtitle:
    "From Port Gardner to Silver Lake — we cover the entire Everett area and every neighborhood in between.",
  neighborhoods: [
    "North Everett",
    "South Everett",
    "Bayside",
    "Port Gardner",
    "Silver Lake",
    "Holly",
    "Boulevard Bluffs",
    "Mukilteo",
  ],
  faqs: buildFaqs("Everett", "Washington", [
    {
      question: "Do you charge extra to drive to Everett?",
      answer: "No. Everett gets the same pricing as Seattle. No distance surcharges.",
    },
    {
      question: "Do you handle moves between Everett and Seattle?",
      answer: "Yes. Everett-to-Seattle is a common route for us with transparent pricing.",
    },
  ]),
};

/* ────────────────────── REGISTRY ────────────────────── */

/** Master list of all city LPs — used for routing, page generation, and the header menu. */
export const cityLPs: CityLPConfig[] = [
  portlandConfig,
  hillsboroConfig,
  tigardConfig,
  lakeOswegoConfig,
  oregonCityConfig,
  greshamConfig,
  happyValleyConfig,
  salemConfig,
  vancouverWaConfig,
  seattleConfig,
  tacomaConfig,
  redmondConfig,
  issaquahConfig,
  everettConfig,
];
