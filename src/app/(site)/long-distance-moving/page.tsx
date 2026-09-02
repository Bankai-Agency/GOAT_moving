import type { Metadata } from "next";
import { longDistanceContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import LongDistanceClient from "./LongDistanceClient";
import { JsonLd } from "@site/seo/JsonLd";
import { serviceSchema, SITE_URL } from "@site/seo/schema";
import { Breadcrumbs } from "@site/layout/Breadcrumbs";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(longDistanceContent.meta, "/long-distance-moving");

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
