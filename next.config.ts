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

const nextConfig: NextConfig = {
  /* Let next/image serve AVIF/WebP when the browser supports them. */
  images: {
    formats: ["image/avif", "image/webp"],
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
