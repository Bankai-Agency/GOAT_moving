import type { Metadata } from "next";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModalLazy } from "@site/ui/QuoteModalLazy";
import { FAQSection } from "@site/sections/FAQSection";
import { SmoothScrollProvider } from "@site/motion/SmoothScrollProvider";
import { ContactFooter } from "@site/sections/ContactFooter";
import { JsonLd } from "@site/seo/JsonLd";
import { localBusinessSchema, websiteSchema } from "@site/seo/schema";
import { TerminalDraftClient } from "./_home/TerminalDraftClient";
/* Production homepage `/` — promoted from the /mainpage-5 preview.
   Home-only Tier-B CSS is imported here so it stays route-scoped. */
import "./_home/sticky-steps.css";
import "./_home/accent.css";
import "./_home/_mp5-dark.css";

/* Title / description are edited in the admin panel (Главная → SEO). */
export const metadata: Metadata = pageMetadata(homeContent.meta, "/");

export default function Home() {
  return (
    <SmoothScrollProvider>
      <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
      {/* Preload the hero's first frame (the LCP paint). */}
      <link
        rel="preload"
        as="image"
        href="/frames-vhero/frame_0001.webp"
        type="image/webp"
      />
      <main>
        <TerminalDraftClient />
        <FAQSection />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModalLazy />
    </SmoothScrollProvider>
  );
}
