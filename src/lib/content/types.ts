/**
 * Types for the editable site content stored as JSON under `src/content/`.
 *
 * Every document here is edited through the admin panel (`/admin`) and
 * consumed by the site via `@/lib/content`. Keep the shapes flat and
 * JSON-friendly: strings, numbers, booleans, arrays, plain objects.
 * Icons are referenced by name (see `./icons.tsx`).
 */

export type Meta = {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
};

export type ReviewItem = {
  name: string;
  location: string;
  rating: number;
  text: string;
  source: "yelp" | "google";
  /** Public image path. Optional — the reviews page falls back to initials. */
  avatar?: string;
};

export type FaqItem = { question: string; answer: string };

/** Card with an icon from the registry + title + description. */
export type IconItem = { icon: string; title: string; description: string };

/** "Why trust" bullet: icon + bold title + one-line subtitle. */
export type TrustItem = { icon: string; title: string; subtitle: string };

export type ServiceOption = IconItem & { bestFor?: string };

export type OtherService = { title: string; description: string; href: string; image?: string };

export type ServiceArea = { city: string; state?: string; href?: string };

export type Address = { label: string; mapUrl: string };

/* ───────────────────────── site.json ───────────────────────── */

export type SiteContent = {
  brand: string;
  /** E.164, e.g. "+13605240846". Display formats are derived in `./phone.ts`. */
  phone: string;
  email: string;
  hours: string;
  usdot: string;
  mc: string;
  addresses: Address[];
  mapEmbedUrl: string;
  social: { yelp: string; google: string; instagram: string };
  ratings: {
    overall: string;
    totalReviews: string;
    google: string;
    googleReviews: string;
    yelp: string;
    yelpReviews: string;
    lpVerifiedReviews: string;
    /** "N+ 5-Star Reviews" line on the reviews carousel summary card. */
    fiveStarReviews: string;
  };
  footer: {
    formHeading: string;
    formText: string;
    about: string;
    copyright: string;
  };
};

/* ───────────────────────── shared.json ───────────────────────── */

export type SharedContent = {
  reviews: { label: string; title: string; items: ReviewItem[] };
  whatsIncluded: { label: string; title: string; subtitle: string; items: IconItem[] };
  howItWorks: { label: string; title: string; steps: IconItem[] };
  whyTrust: {
    label: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    items: TrustItem[];
  };
  serviceArea: { label: string; title: string; subtitle: string; areas: ServiceArea[] };
  otherServices: { label: string; title: string; items: OtherService[] };
  ctaBanner: { heading: string; tagline: string; buttonText: string; image: string };
};

/* ───────────────────────── home.json ───────────────────────── */

export type StickyStep = {
  eyebrow: string;
  h2: string;
  p: string;
  /** Poster image (first paint) for the autoplaying clip. */
  image: string;
  video: string;
  fit?: "cover" | "contain";
};

export type HomeContent = {
  meta: Meta;
  hero: { phrases: string[] };
  mission: string;
  services: StickyStep[];
  ctaBeat: { eyebrow: string; headline: string; mark: string; buttonLabel: string };
  steps: { label: string; title: string; body: string; image: string }[];
  trust: { items: { eyebrow: string; value: string; label: string }[] };
  testimonials: {
    photo: string;
    quotes: { quote: string; author: string; role: string; rating: number }[];
  };
  faq: { label: string; title: string; items: FaqItem[] };
};

/* ───────────────────────── services/*.json ───────────────────────── */

export type ServiceHero = {
  image: string;
  imageAlt: string;
  h1Highlight: string;
  h1Rest: string;
  subtitle: string;
};

export type LocalMovingContent = {
  meta: Meta;
  hero: ServiceHero;
  rates: { title: string; subtitle: string };
  faq: { title: string; items: FaqItem[] };
  otherServices: { title: string; items: OtherService[] };
};

export type WhyTrustBlock = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  items: TrustItem[];
};

export type LongDistanceContent = {
  meta: Meta;
  hero: ServiceHero;
  whatsIncluded: { title: string; subtitle: string; items: IconItem[] };
  whyTrust: WhyTrustBlock;
  howItWorks: { title: string; steps: IconItem[] };
  routes: {
    label: string;
    title: string;
    items: { fromCode: string; fromName: string; toCode: string; toName: string; desc: string }[];
  };
  faq: { title: string; items: FaqItem[] };
  otherServices: { title: string; items: OtherService[] };
};

export type CommercialContent = {
  meta: Meta;
  hero: ServiceHero;
  whatsIncluded: { label: string; title: string; subtitle: string; items: IconItem[] };
  whyTrust: WhyTrustBlock;
  howItWorks: { title: string; steps: IconItem[] };
  industries: { label: string; title: string; items: IconItem[] };
  faq: { title: string; items: FaqItem[] };
  otherServices: { title: string; items: OtherService[] };
};

export type PackingContent = {
  meta: Meta;
  hero: ServiceHero;
  serviceTypes: { label: string; title: string; subtitle: string; items: ServiceOption[] };
  whatsIncluded: { label: string; title: string; subtitle: string; items: IconItem[] };
  howItWorks: { title: string; steps: IconItem[] };
  fragile: { label: string; title: string; subtitle: string; items: IconItem[] };
  faq: { title: string; items: FaqItem[] };
  otherServices: { title: string; items: OtherService[] };
};

/* ───────────────────────── other pages ───────────────────────── */

export type ReviewsPageContent = {
  meta: Meta;
  hero: { h1Highlight: string; h1Rest: string; subtitle: string };
  items: ReviewItem[];
};

export type FaqCategory = { id: string; label: string; faqs: FaqItem[] };

export type FaqPageContent = {
  meta: Meta;
  hero: { h1Highlight: string; h1Rest: string };
  categories: FaqCategory[];
};

export type ContactsPageContent = {
  meta: Meta;
  hero: { h1Highlight: string; h1Rest: string; subtitle: string };
};

/* ───────────────────────── locations.json (SEO city pages) ───────────────────────── */

export type LocationConfig = {
  /** URL slug under `/`. Example: "vancouver-movers" → `/vancouver-movers`. */
  slug: string;
  city: string;
  cityDisplay: string;
  state: "OR" | "WA";
  stateLong: "Oregon" | "Washington";
  heroImage: string;
  heroImagePosition?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroEyebrow: string;
  h1Highlight: string;
  h1Suffix: string;
  heroSubtitle: string;
  servicesSubtitle: string;
  localMovingDescription: string;
  longDistanceDescription?: string;
  commercialDescription?: string;
  packingDescription?: string;
  whyTitle: string;
  whyDescription: string;
  whatsIncludedSubtitle: string;
  ctaHeading: string;
  ctaTagline: string;
  faqs: FaqItem[];
};

/* ───────────────────────── lp-cities.json (ad landing pages) ───────────────────────── */

export type LpCityConfig = {
  slug: string;
  city: string;
  state: "OR" | "WA";
  licenseState: "Oregon" | "Washington";
  heroImage: string;
  heroImagePosition?: string;
  metaTitle: string;
  metaDescription: string;
  aboutDescription: string;
  solutionCopy: { truck: string; equipment: string; floorProtection: string };
  localMovingDescription: string;
  commercialDescription?: string;
  longDistanceImage?: string;
  serviceAreaSubtitle: string;
  neighborhoods: string[];
  faqs: FaqItem[];
  socialProofImage?: string;
  /** Reviews shown FIRST on this LP, before the shared list. */
  featuredReviews?: ReviewItem[];
};
