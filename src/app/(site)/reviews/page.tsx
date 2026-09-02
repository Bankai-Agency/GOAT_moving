import type { Metadata } from "next";
import { reviewsPageContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import ReviewsClient from "./ReviewsClient";
import { JsonLd } from "@site/seo/JsonLd";
import { localBusinessSchema } from "@site/seo/schema";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(reviewsPageContent.meta, "/reviews");

export default function ReviewsPage() {
  return (
    <>
      {/* LocalBusiness schema carries AggregateRating (4.9/850 reviews) —
          rendering it on /reviews lets Google attach the rating to this URL. */}
      <JsonLd data={localBusinessSchema()} />
      <ReviewsClient />
    </>
  );
}
