import type { MetadataRoute } from "next";

const SITE_URL = "https://thegoatmovers.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/lp/", "/thank-you", "/mainpage-2", "/mainpage-3"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
