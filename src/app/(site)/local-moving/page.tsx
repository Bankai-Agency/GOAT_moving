import type { Metadata } from "next";
import { localMovingContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import LocalMovingClient from "./LocalMovingClient";
import { JsonLd } from "@site/seo/JsonLd";
import { serviceSchema, SITE_URL } from "@site/seo/schema";
import { Breadcrumbs } from "@site/layout/Breadcrumbs";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(localMovingContent.meta, "/local-moving");

export default function LocalMovingPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Local Moving",
          description:
            "Residential local moving at a flat $125/hour in Vancouver, WA and Portland, OR. Truck, fuel, equipment included. Licensed & insured.",
          url: `${SITE_URL}/local-moving`,
          serviceType: "Local Moving",
        })}
      />
      <Breadcrumbs
        schemaOnly
        items={[
          { name: "Home", href: "/" },
          { name: "Local Moving" },
        ]}
      />
      <LocalMovingClient />
    </>
  );
}
