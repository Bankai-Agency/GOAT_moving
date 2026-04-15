import type { Metadata } from "next";
import PackingServicesClient from "./PackingServicesClient";

export const metadata: Metadata = {
  title: "Professional Packers & Labor-Only Movers — Vancouver, WA & Portland",
  description:
    "Full-service packing, partial packing, and labor-only loading for PODS & U-Haul in Vancouver, WA and Portland, OR. Fragile specialists, quality materials, same-day availability.",
  keywords: [
    "packing services Vancouver WA",
    "packing services Portland OR",
    "professional packers",
    "labor only movers",
    "PODS loading",
    "U-Haul loading help",
    "fragile packing",
  ],
  alternates: { canonical: "/packing-services" },
  openGraph: {
    title: "Professional Packers & Labor-Only Movers | GOAT Movers",
    description:
      "Full-service packing, labor-only loading, PODS & U-Haul help. Quality materials, fragile specialists, same-day availability in Vancouver, WA and Portland, OR.",
    url: "/packing-services",
    type: "website",
  },
};

export default function PackingServicesPage() {
  return <PackingServicesClient />;
}
