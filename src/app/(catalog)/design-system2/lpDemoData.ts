/* Demo data used by both the showcase page and the iframe preview
   route. Mirrors what CityLandingPage builds at runtime for Portland,
   but extracted as plain objects so the section renderers stay pure. */

import { portlandConfig } from "../../(lp)/lp1/config/portland";
import { defaultIncludedItems } from "../../(lp)/lp1/sections/WhatsIncludedSection";

const cfg = portlandConfig;
export const demoCity = cfg.city;

export const socialProofStats = [
  { icon: "/icons/star.svg", value: "4.9", label: "Google Rating" },
  { icon: "/icons/review.svg", value: "437+", label: "Verified Reviews" },
  { icon: "/icons/year.svg", value: "500+", label: "Moves Completed" },
  { icon: "/icons/license.svg", value: "100%", label: "Licensed & Insured" },
];

export const demoServices = [
  {
    title: "Local Moving",
    description: cfg.localMovingDescription,
    number: "1",
    image: "/images/service-local.webp",
  },
  {
    title: "Long Distance Moving",
    description: `Interstate moves out of ${cfg.city} across the US. Fully licensed (USDOT #4232069) and insured for cross-state relocations of any size.`,
    number: "2",
    image: "/images/service-longdistance.webp",
  },
  {
    title: "Commercial Moving",
    description:
      cfg.commercialDescription ??
      `Office and commercial relocations across ${cfg.city} with minimal downtime. Equipment, furniture, and sensitive documents handled safely and on schedule.`,
    number: "3",
    image: "/images/service-commercial.webp",
  },
  {
    title: "Packing & Labor",
    description:
      "Professional packing with quality materials, same-building moves, and loading/unloading labor. Expert handling of fragile and specialty items.",
    number: "4",
    image: "/images/service-packing.webp",
  },
];

export const demoIncluded = defaultIncludedItems.map((item) => {
  switch (item.title) {
    case "Moving Truck & Fuel":
      return { ...item, description: cfg.solutionCopy.truck };
    case "Equipment":
      return { ...item, description: cfg.solutionCopy.equipment };
    case "Floor & Door Protection":
      return { ...item, description: cfg.solutionCopy.floorProtection };
    default:
      return item;
  }
});

export const demoNeighborhoods = cfg.neighborhoods.map((n) => ({ city: n }));
export const demoFaqs = cfg.faqs;
export const demoHeroImage = cfg.heroImage;
export const demoSocialProofImage = cfg.socialProofImage;
export const demoAboutDescription = cfg.aboutDescription;
export const demoServiceAreaSubtitle = cfg.serviceAreaSubtitle;
