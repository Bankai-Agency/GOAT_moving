/**
 * Typed access to the editable site content (`src/content/*.json`).
 *
 * The JSON files are imported statically, so the content is baked into the
 * build. Edits made through the admin panel land in these files (locally in
 * dev, as a git commit in prod) and show up after the next build.
 */
import siteJson from "@/content/site.json";
import sharedJson from "@/content/shared.json";
import homeJson from "@/content/home.json";
import localMovingJson from "@/content/services/local-moving.json";
import longDistanceJson from "@/content/services/long-distance-moving.json";
import commercialJson from "@/content/services/commercial-moving.json";
import packingJson from "@/content/services/packing-services.json";
import reviewsJson from "@/content/reviews.json";
import faqJson from "@/content/faq.json";
import contactsJson from "@/content/contacts.json";
import locationsJson from "@/content/locations.json";
import lpCitiesJson from "@/content/lp-cities.json";
import type {
  CommercialContent,
  ContactsPageContent,
  FaqPageContent,
  HomeContent,
  LocalMovingContent,
  LocationConfig,
  LongDistanceContent,
  LpCityConfig,
  PackingContent,
  ReviewsPageContent,
  SharedContent,
  SiteContent,
} from "./types";

export type * from "./types";

export const siteContent = siteJson as SiteContent;
export const sharedContent = sharedJson as SharedContent;
export const homeContent = homeJson as HomeContent;
export const localMovingContent = localMovingJson as LocalMovingContent;
export const longDistanceContent = longDistanceJson as LongDistanceContent;
export const commercialContent = commercialJson as CommercialContent;
export const packingContent = packingJson as PackingContent;
export const reviewsPageContent = reviewsJson as ReviewsPageContent;
export const faqPageContent = faqJson as FaqPageContent;
export const contactsPageContent = contactsJson as ContactsPageContent;

/** SEO city pages (`/{city}-movers`), in display order. */
export const locationConfigs = (locationsJson as { items: LocationConfig[] }).items;

/** Ad landing pages (`/lp/movers-{city}`), in display order. */
export const cityLPs = (lpCitiesJson as { items: LpCityConfig[] }).items;

export function findLocation(slug: string): LocationConfig | undefined {
  return locationConfigs.find((c) => c.slug === slug);
}

export function findCityBySlug(slug: string): LpCityConfig | undefined {
  return cityLPs.find((c) => c.slug === slug);
}

/** Flattened FAQ list for the FAQPage schema. */
export const allFaqs = faqPageContent.categories.flatMap((c) => c.faqs);

/** "City, ST" with a non-breaking space so the state code never orphans. */
export function nbCity(s: string): string {
  return s.replace(/,\s+/g, ",\u00A0");
}
