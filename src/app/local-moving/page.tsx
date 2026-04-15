import type { Metadata } from "next";
import LocalMovingClient from "./LocalMovingClient";

export const metadata: Metadata = {
  title: "Local Movers in Vancouver, WA & Portland, OR — $125/hr",
  description:
    "Flat $125/hour local moving in Vancouver, WA and Portland, OR. No hidden fees, no stair charges, 3-hour minimum. Licensed & insured. Free estimate in 30 seconds.",
  keywords: [
    "local movers Vancouver WA",
    "local movers Portland OR",
    "residential moving company",
    "hourly movers",
    "apartment movers",
    "small move service",
  ],
  alternates: { canonical: "/local-moving" },
  openGraph: {
    title: "Local Movers in Vancouver, WA & Portland, OR | $125/hr",
    description:
      "Residential local moving at $125/hr with truck, fuel, and equipment included. Licensed & insured. Free estimate from GOAT Movers.",
    url: "/local-moving",
    type: "website",
  },
};

export default function LocalMovingPage() {
  return <LocalMovingClient />;
}
