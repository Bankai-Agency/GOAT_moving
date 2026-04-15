import type { Metadata } from "next";
import ReviewsClient from "./ReviewsClient";

export const metadata: Metadata = {
  title: "Customer Reviews — 4.9★ on Google & Yelp",
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
  return <ReviewsClient />;
}
