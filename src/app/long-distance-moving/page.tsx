import type { Metadata } from "next";
import LongDistanceClient from "./LongDistanceClient";

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
  return <LongDistanceClient />;
}
