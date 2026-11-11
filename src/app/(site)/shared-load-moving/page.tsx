import type { Metadata } from "next";
import { sharedLoadContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import SharedLoadClient from "./SharedLoadClient";
import { JsonLd } from "@site/seo/JsonLd";
import { serviceSchema, SITE_URL } from "@site/seo/schema";
import { Breadcrumbs } from "@site/layout/Breadcrumbs";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(sharedLoadContent.meta, "/shared-load-moving");

export default function SharedLoadMovingPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Shared Load Moving",
          description:
            "Consolidated long-distance moving from Vancouver, WA and Portland, OR for relocations of 1,000+ miles: belongings share the truck, the customer pays for the volume they take, delivery within a 7-14 day window. Licensed FMCSA carrier (USDOT #4232069).",
          url: `${SITE_URL}/shared-load-moving`,
          serviceType: "Shared Load Moving",
        })}
      />
      <Breadcrumbs
        schemaOnly
        items={[
          { name: "Home", href: "/" },
          { name: "Shared Load Moving" },
        ]}
      />
      <SharedLoadClient />
    </>
  );
}
