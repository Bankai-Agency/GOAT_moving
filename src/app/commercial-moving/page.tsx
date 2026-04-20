import type { Metadata } from "next";
import CommercialMovingClient from "./CommercialMovingClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, SITE_URL } from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Office & Commercial Movers in Vancouver, WA & Portland, OR",
  description:
    "Office and commercial relocations in Vancouver, WA and Portland, OR. After-hours & weekend moves, minimal downtime, IT equipment specialists. Licensed, insured, COI on request.",
  keywords: [
    "commercial movers Vancouver WA",
    "commercial movers Portland OR",
    "office relocation",
    "business movers",
    "IT equipment movers",
    "cubicle moving",
    "after-hours moving",
  ],
  alternates: { canonical: "/commercial-moving" },
  openGraph: {
    title: "Office & Commercial Movers in Vancouver, WA & Portland, OR",
    description:
      "Commercial moving with minimal downtime. After-hours & weekend service, IT equipment handling, full insurance and COI available. Free quote from GOAT Movers.",
    url: "/commercial-moving",
    type: "website",
  },
};

export default function CommercialMovingPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Commercial Moving",
          description:
            "Office and commercial relocations across Vancouver, WA and Portland, OR. After-hours and weekend service, IT equipment handling, full insurance and COI available.",
          url: `${SITE_URL}/commercial-moving`,
          serviceType: "Commercial Moving",
        })}
      />
      <Breadcrumbs
        schemaOnly
        items={[
          { name: "Home", href: "/" },
          { name: "Commercial Moving" },
        ]}
      />
      <CommercialMovingClient />
    </>
  );
}
