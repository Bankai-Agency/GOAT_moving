import type { NextConfig } from "next";

/** Security + perf headers applied to every response. */
const securityHeaders = [
  /* Force HTTPS for 2 years + include subdomains. Only safe after HTTPS is verified in prod. */
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  /* Block MIME-sniffing — prevents browsers from executing .txt as JS, etc. */
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Disallow being embedded in <iframe> on other origins (clickjacking protection). */
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  /* Send the full URL to same-origin requests, just the origin cross-site. */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* Deny powerful APIs we don't use. Narrow as needed later. */
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  /* Cross-origin isolation default for opener. */
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/* The admin panel reads `public/` and `src/content` through Node fs in dev.
   Vercel's file tracer would otherwise bundle the whole public/ folder
   (hundreds of MB of photos) into every admin function; in prod those
   routes talk to the GitHub API instead, so the folder is excluded.

   Next matches these keys with picomatch `contains: true`, so "/admin"
   covers /admin/login, /admin/content/[...path], /api/admin/upload etc.

   Never exclude `.next/**` here: a route's own Turbopack server chunks
   (.next/server/chunks/ssr/*) are part of its trace, and stripping them
   leaves the function unable to load (ChunkLoadError, HTTP 500 in prod). */
const ADMIN_TRACE_EXCLUDES = ["public/**"];

const nextConfig: NextConfig = {
  /* Let next/image serve AVIF/WebP when the browser supports them. */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  outputFileTracingExcludes: {
    "*": [".git/**"],
    "/admin": ADMIN_TRACE_EXCLUDES,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
