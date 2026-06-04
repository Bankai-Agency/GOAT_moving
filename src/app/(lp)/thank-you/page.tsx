import type { Metadata } from "next";
import { LPTerminalNav } from "@/app/(lp)/lp4/LPTerminalNav";
import { ContactFooter } from "@/app/(lp)/lp4/sections/ContactFooter";
import { Touchbar } from "@/app/(lp)/lp4/sections/Touchbar";
import { QuoteModal } from "@/app/(lp)/lp4/ui/QuoteModal";
import { LPButton } from "@/app/(lp)/lp4/ui/LPButton";
import { BackToOriginLink } from "./BackToOriginLink";
/* Thank-you page mirrors the lp4 landing visual system (dark #0c0c0c
   bg + brand-yellow #FFE533 accent). Style stack + wrapper match
   `/lp/[slug]/page.tsx`:
   - lp4's CSS uses `[data-lp-root]` selectors (theme-light removed),
     so LP rules fire on this wrapper too.
   - `_lp2-invert.css` recolours `.lp-btn` variants for the dark theme
     via `body:has(.lp2-dark[data-lp-root])`, so the wrapper MUST carry
     both `lp2-dark` and `data-lp-root` or the buttons lose their styling.
   - No `data-accent` — accent.css's `[data-accent="blue"]` cascade
     would flip the native yellow back to blue. */
import "@/app/(lp)/lp4/styles/_tokens.css";
import "@/app/(lp)/lp4/styles/accent.css";
import "@/app/(lp)/lp4/styles/mega-nav.css";
import "@/app/(lp)/lp4/styles/lp-theme.css";
import "@/app/(lp)/lp4/styles/_hero.css";
import "@/app/(lp)/lp4/styles/_services.css";
import "@/app/(lp)/lp4/styles/_solution.css";
import "@/app/(lp)/lp4/styles/_service-area.css";
import "@/app/(lp)/lp4/styles/_faq.css";
import "@/app/(lp)/lp4/styles/_cta.css";
import "@/app/(lp)/lp4/styles/_about.css";
import "@/app/(lp)/lp4/styles/_process.css";
import "@/app/(lp)/lp4/styles/_reviews.css";
import "@/app/(lp)/lp4/styles/_footer.css";
import "@/app/(lp)/lp4/styles/_dark-zone.css";
import "@/app/(lp)/lp4/styles/_lp2-invert.css";

export const metadata: Metadata = {
  title: "Thank You — Your Quote Request Was Received",
  description:
    "Thanks for choosing GOAT Movers. We've received your request and will follow up shortly.",
  /* Service page — keep out of search results so users only land here via a real submission. */
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <div data-lp-root="" className="lp2-dark bg-[#0c0c0c] min-h-screen">
      <LPTerminalNav />
      <div className="page-zoom">
        <main className="bg-[#0c0c0c]">
          <section className="min-h-screen flex flex-col lg:items-center lg:justify-center px-4 pt-[120px] lg:pt-[160px] pb-[40px] lg:pb-[60px]">
            <div className="flex-1 lg:flex-none flex flex-col items-center justify-center text-center gap-6 lg:gap-8 max-w-[640px] mx-auto w-full">
              {/* Certified-check badge — yellow burst + dark check, matches
                  the lp4 brand-yellow accent palette. */}
              <div className="w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] flex items-center justify-center drop-shadow-[0_16px_50px_rgba(255,229,51,0.25)]">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path
                    d="m61.49 31.13c-2.25-1.26-3.86-3.33-4.53-5.82s-.31-5.08 1.01-7.3c.19-.31.19-.7.01-1.01s-.51-.5-.87-.5h-.15c-2.53 0-4.9-.98-6.69-2.77-1.82-1.83-2.81-4.25-2.77-6.83 0-.36-.19-.7-.5-.88s-.7-.18-1.01.01c-2.22 1.32-4.81 1.68-7.3 1.01s-4.56-2.28-5.82-4.53c-.35-.63-1.39-.63-1.74 0-1.26 2.25-3.33 3.86-5.82 4.53s-5.08.31-7.3-1.01c-.31-.19-.69-.19-1.01-.01-.31.18-.5.52-.5.88.04 2.58-.95 5-2.77 6.83-1.79 1.79-4.16 2.77-6.69 2.77h-.14c-.33-.02-.7.19-.88.5s-.18.7.01 1.01c1.32 2.22 1.68 4.81 1.01 7.3s-2.28 4.56-4.53 5.82c-.31.17-.51.51-.51.87s.2.7.51.87c2.25 1.26 3.86 3.33 4.53 5.82s.31 5.08-1.01 7.3c-.19.31-.19.7-.01 1.01s.56.5.88.5c2.61-.06 5 .95 6.83 2.77 1.82 1.83 2.81 4.25 2.77 6.83 0 .36.19.7.5.88.32.18.7.18 1.01-.01 2.22-1.32 4.81-1.68 7.3-1.01s4.56 2.28 5.82 4.53c.17.31.51.51.87.51s.7-.2.87-.51c1.26-2.25 3.33-3.86 5.82-4.53s5.08-.31 7.3 1.01c.31.19.7.19 1.01.01s.5-.52.5-.88c-.04-2.58.95-5 2.77-6.83 1.79-1.79 4.16-2.77 6.69-2.77h.15c.36 0 .69-.19.87-.5s.18-.7-.01-1.01c-1.32-2.22-1.68-4.81-1.01-7.3s2.28-4.56 4.53-5.82c.31-.17.51-.51.51-.87s-.2-.7-.51-.87z"
                    fill="#FFE533"
                  />
                  <path
                    d="m40.87 22.16c-.39-.39-1.03-.39-1.42 0l-9.66 9.66-5.25-5.24c-.39-.39-1.02-.39-1.41 0l-3.95 3.95c-.19.18-.29.44-.29.7 0 .27.1.52.29.71l9.9 9.9c.2.2.46.29.71.29.26 0 .51-.09.71-.29l14.32-14.32c.19-.19.29-.44.29-.71 0-.26-.1-.52-.29-.7z"
                    fill="#0c0c0c"
                  />
                </svg>
              </div>

              <h1 className="font-sans font-bold text-[28px] sm:text-[34px] lg:text-[48px] leading-[1.1] tracking-[-1.12px] lg:tracking-[-1.92px] whitespace-nowrap">
                <span className="text-[#FFE533]">Thanks! </span>
                <span className="text-white">Your request is in.</span>
              </h1>

              <p className="font-sans font-normal text-base lg:text-xl leading-[1.5] tracking-[-0.3px] text-white/70 max-w-[520px]">
                Our team will review the details and get back to you with a personalized
                quote within 24 hours. If your move is urgent, give us a call now.
              </p>

              {/* Desktop CTA row — primary call + secondary back. */}
              <div className="hidden lg:flex flex-row gap-4 mt-2">
                <LPButton variant="primary" size="md" href="tel:+13805240846">
                  Call +1 380-524-0846
                </LPButton>
                <BackToOriginLink size="md" />
              </div>
            </div>

            {/* Mobile CTAs pinned to viewport bottom (matches the original layout). */}
            <div className="lg:hidden max-w-[640px] mx-auto w-full flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <LPButton variant="primary" size="md" href="tel:+13805240846" fullWidth>
                  Call +1 380-524-0846
                </LPButton>
              </div>
              <div className="flex-1">
                <BackToOriginLink size="md" fullWidth />
              </div>
            </div>
          </section>
        </main>
        <ContactFooter />
        <Touchbar />
      </div>
      <QuoteModal />
    </div>
  );
}
