/**
 * FAQ data — imported by both FAQClient (UI) and page.tsx (FAQPage schema).
 * Keeping one source of truth guarantees schema never drifts from rendered content.
 *
 * The content lives in `src/content/faq.json` (admin panel → Страницы → FAQ).
 */
import { faqPageContent } from "@/lib/content";

export type { FaqItem as FAQ, FaqCategory as FAQCategory } from "@/lib/content";

export const faqCategories = faqPageContent.categories;

/** Flattened list for FAQPage schema. */
export const allFaqs = faqCategories.flatMap((c) => c.faqs);
