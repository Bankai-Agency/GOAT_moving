import type { Metadata } from "next";
import { commercialContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import CommercialMovingClient from "./CommercialMovingClient";
import { JsonLd } from "@site/seo/JsonLd";
import { serviceSchema, SITE_URL } from "@site/seo/schema";
import { Breadcrumbs } from "@site/layout/Breadcrumbs";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(commercialContent.meta, "/commercial-moving");

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
