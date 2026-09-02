import type { Metadata } from "next";
import { faqPageContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import FAQClient from "./FAQClient";
import { JsonLd } from "@site/seo/JsonLd";
import { faqPageSchema } from "@site/seo/schema";
import { allFaqs } from "./faqData";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(faqPageContent.meta, "/faq");

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(allFaqs)} />
      <FAQClient />
    </>
  );
}
