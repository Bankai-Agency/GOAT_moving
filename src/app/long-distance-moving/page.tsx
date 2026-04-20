import type { Metadata } from "next";
import LongDistanceClient from "./LongDistanceClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, SITE_URL } from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Long Distance Movers from Vancouver, WA & Portland, OR",
  description:
    "Interstate moves out of Vancouver, WA and Portland, OR. Licensed FMCSA carrier (USDOT #4232069), fully insured. Door-to-door delivery, no hidden fees. Free cross-state quote.",
  keywords: [
    "long distance movers Vancouver WA",
    "long distance movers Portland OR",
    "interstate moving company",
    "cross-state movers",
    "FMCSA licensed movers",
    "USDOT carrier",
    "Pacific Northwest moving",
  ],
  alternates: { canonical: "/long-distance-moving" },
  openGraph: {
    title: "Long Distance Movers from Vancouver, WA & Portland, OR",
    description:
      "Licensed interstate movers with USDOT #4232069. Door-to-door cross-state relocations, full insurance, transparent pricing. Free estimate from GOAT Movers.",
    url: "/long-distance-moving",
    type: "website",
  },
};

export default function LongDistanceMovingPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Long Distance Moving",
          description:
            "Licensed FMCSA interstate relocations from Vancouver, WA and Portland, OR (USDOT #4232069). Door-to-door delivery, full insurance, transparent pricing.",
          url: `${SITE_URL}/long-distance-moving`,
          serviceType: "Long Distance Moving",
        })}
      />
      <Breadcrumbs
        schemaOnly
        items={[
          { name: "Home", href: "/" },
          { name: "Long Distance Moving" },
        ]}
      />
      <LongDistanceClient />
    </>
  );
}
