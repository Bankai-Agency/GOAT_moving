import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { TerminalDraftClient } from "./TerminalDraftClient";

/* Mainpage-5 — terminal-industries-inspired structural skeleton.
   Section order: hero → numbered feature carousel → 3 benefit panels →
   partner marquee → testimonial → client logo grid → inline CTA →
   contact form → footer-CTA banner → footer.
   Draft. noindex / disallowed in robots.ts (add separately when ready). */
export const metadata: Metadata = {
  title: "Mainpage 5 — Industrial Draft | GOAT Movers",
  description:
    "Working structural draft of the homepage in an industrial-platform layout — placeholder copy, real GOAT assets.",
  alternates: { canonical: "/mainpage-5" },
  robots: { index: false, follow: false },
};

export default function MainpageFive() {
  return (
    <div className="bg-[#0c0c0c] min-h-screen">
      <Header />
      <main>
        <TerminalDraftClient />
      </main>
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
