import type { Metadata } from "next";
import ReviewsClient from "./ReviewsClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "GOAT Movers Reviews — 4.9★ Vancouver, WA & Portland, OR",
  description:
    "Read 850+ verified five-star reviews for GOAT Movers in Vancouver, WA and Portland, OR. Real stories from real customers about stress-free, on-time moves.",
  keywords: [
    "GOAT Movers reviews",
    "moving company reviews Vancouver WA",
    "moving company reviews Portland OR",
    "five-star movers",
    "Google reviews movers",
    "Yelp reviews movers",
  ],
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Customer Reviews — 4.9★ on Google & Yelp | GOAT Movers",
    description:
      "850+ verified five-star reviews from movers we've helped in Vancouver, WA and Portland, OR. See what real customers say.",
    url: "/reviews",
    type: "website",
  },
};

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
