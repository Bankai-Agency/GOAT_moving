import type { Metadata } from "next";
import { packingContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import PackingServicesClient from "./PackingServicesClient";
import { JsonLd } from "@site/seo/JsonLd";
import { serviceSchema, SITE_URL } from "@site/seo/schema";
import { Breadcrumbs } from "@site/layout/Breadcrumbs";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(packingContent.meta, "/packing-services");

export default function PackingServicesPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Packing & Labor Services",
          description:
            "Full-service packing, partial packing, and labor-only loading for PODS and U-Haul in Vancouver, WA and Portland, OR. Fragile specialists, quality materials, same-day availability.",
          url: `${SITE_URL}/packing-services`,
          serviceType: "Packing Services",
        })}
      />
      <Breadcrumbs
        schemaOnly
        items={[
          { name: "Home", href: "/" },
          { name: "Packing & Labor" },
        ]}
      />
      <PackingServicesClient />
    </>
  );
}
