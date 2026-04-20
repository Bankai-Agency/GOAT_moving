import type { MetadataRoute } from "next";
import { locationConfigs } from "./_locations/locationConfigs";

const SITE_URL = "https://thegoatmovers.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                     lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/local-moving`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/long-distance-moving`, lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/commercial-moving`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/packing-services`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/reviews`,              lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/faq`,                  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contacts`,             lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = locationConfigs.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
