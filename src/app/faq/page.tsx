import type { Metadata } from "next";
import FAQClient from "./FAQClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/seo/schema";
import { allFaqs } from "./faqData";

export const metadata: Metadata = {
  title: "Moving FAQ — Vancouver, WA & Portland, OR | Pricing & Insurance",
  description:
    "Answers to the most common moving questions: cost, pricing structure, insurance, what's included, booking timelines. Based on 500+ moves in Vancouver, WA and Portland, OR.",
  keywords: [
    "moving FAQ",
    "moving cost questions",
    "moving company insurance",
    "how to book movers",
    "movers Vancouver WA FAQ",
    "movers Portland OR FAQ",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Moving FAQ — Pricing, Insurance, Process | GOAT Movers",
    description:
      "Get answers on pricing, insurance, same-day service, and more. Straight answers from GOAT Movers serving Vancouver, WA and Portland, OR.",
    url: "/faq",
    type: "website",
  },
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(allFaqs)} />
      <FAQClient />
    </>
  );
}
