/**
 * Schema.org JSON-LD builders for GOAT Movers.
 *
 * Used to emit <script type="application/ld+json"> payloads that search
 * engines and AI assistants consume for rich results / knowledge panels.
 *
 * All builders return plain objects — wrap them with <JsonLd> to render.
 */

import { siteContent } from "@/lib/content";
import { phoneSchema } from "@/lib/content/phone";

export const SITE_URL = "https://thegoatmovers.net";
export const BRAND_NAME = siteContent.brand;

/**
 * "1178 Dock St, Tacoma, WA 98402" → PostalAddress parts. Addresses that
 * don't follow the "street, city, ST 12345" shape are skipped (the footer
 * still shows them as typed).
 */
function parseAddress(label: string) {
  const m = /^(.+?),\s*([^,]+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/.exec(label.trim());
  if (!m) return null;
  return {
    streetAddress: m[1],
    addressLocality: m[2],
    addressRegion: m[3],
    postalCode: m[4],
    addressCountry: "US",
  };
}

const parsedAddresses = siteContent.addresses
  .map((a) => parseAddress(a.label))
  .filter((a): a is NonNullable<typeof a> => a !== null);

/* Centralized source of truth — contact details, rating and social links
   come from src/content/site.json (admin panel → Контакты). */
export const BUSINESS = {
  name: BRAND_NAME,
  legalName: siteContent.brand,
  telephone: phoneSchema(siteContent.phone),
  email: siteContent.email,
  usdot: siteContent.usdot,
  priceRange: "$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Debit Card",
  openingHours: "Mo-Su 08:00-20:00",
  /* Operating locations; the last one listed in site.json (Portland) is
     used as the primary address. */
  addresses: [...parsedAddresses].reverse(),
  geo: { latitude: 45.5454821, longitude: -122.635238 },
  /* Aggregate across Yelp + Google, consistent with what the UI advertises. */
  aggregateRating: {
    ratingValue: siteContent.ratings.overall,
    reviewCount: parseInt(siteContent.ratings.totalReviews.replace(/\D/g, ""), 10) || 0,
    bestRating: "5",
    worstRating: "1",
  },
  sameAs: [siteContent.social.yelp.split("?")[0], siteContent.social.google, siteContent.social.instagram],
  areaServed: [
    "Vancouver, WA",
    "Portland, OR",
    "Beaverton, OR",
    "Hillsboro, OR",
    "Tigard, OR",
    "Tualatin, OR",
    "Gresham, OR",
    "Oregon City, OR",
    "Camas, WA",
    "Seattle, WA",
    "Tacoma, WA",
  ],
};

type Thing = Record<string, unknown>;

/* Reusable reference to the organization (so multiple schemas on a page can
   share the same business entity without duplicating its full description). */
export function organizationRef() {
  return { "@type": "MovingCompany", "@id": `${SITE_URL}/#organization` };
}

export function localBusinessSchema(): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo.svg`,
    image: `${SITE_URL}/images/home-hero.jpg`,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted: BUSINESS.paymentAccepted,
    openingHours: BUSINESS.openingHours,
    address: BUSINESS.addresses.map((a) => ({ "@type": "PostalAddress", ...a })),
    geo: { "@type": "GeoCoordinates", ...BUSINESS.geo },
    areaServed: BUSINESS.areaServed.map((n) => ({ "@type": "City", name: n })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.aggregateRating.ratingValue,
      reviewCount: BUSINESS.aggregateRating.reviewCount,
      bestRating: BUSINESS.aggregateRating.bestRating,
      worstRating: BUSINESS.aggregateRating.worstRating,
    },
    sameAs: BUSINESS.sameAs,
    identifier: { "@type": "PropertyValue", propertyID: "USDOT", value: BUSINESS.usdot },
  };
}

export function websiteSchema(): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND_NAME,
    publisher: organizationRef(),
    inLanguage: "en-US",
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType,
    provider: organizationRef(),
    areaServed: BUSINESS.areaServed.map((n) => ({ "@type": "City", name: n })),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "125", priceCurrency: "USD", unitCode: "HUR" },
    },
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** City-specific service page schema: MovingCompany with area-served narrowed to the city,
   plus a Service referencing the org. Used on /[city] routes. */
export function cityPageSchema(opts: {
  city: string;
  state: string;
  slug: string;
  description: string;
}): Thing[] {
  const url = `${SITE_URL}/${opts.slug}`;
  const location = `${opts.city}, ${opts.state}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "MovingCompany",
      name: `${BRAND_NAME} — ${location}`,
      description: opts.description,
      url,
      telephone: BUSINESS.telephone,
      priceRange: BUSINESS.priceRange,
      image: `${SITE_URL}/images/home-hero.jpg`,
      areaServed: { "@type": "City", name: location },
      provider: organizationRef(),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: BUSINESS.aggregateRating.ratingValue,
        reviewCount: BUSINESS.aggregateRating.reviewCount,
        bestRating: BUSINESS.aggregateRating.bestRating,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Moving Services in ${location}`,
      description: opts.description,
      url,
      serviceType: "Moving Services",
      provider: organizationRef(),
      areaServed: { "@type": "City", name: location },
    },
  ];
}
