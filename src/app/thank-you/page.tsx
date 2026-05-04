import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

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
    <div className="page-zoom">
      <Header />
      <main className="bg-[#0c0c0c]">
        {/* Mobile: icon + heading + text vertically centered, buttons pinned to bottom.
            Desktop: everything centered together as one group. */}
        <section className="min-h-screen flex flex-col lg:items-center lg:justify-center px-4 pt-[120px] lg:pt-[160px] pb-[40px] lg:pb-[60px]">
          <div className="flex-1 lg:flex-none flex flex-col items-center justify-center text-center gap-6 lg:gap-8 max-w-[640px] mx-auto w-full">
            {/* Certified-check badge icon — same starburst as the inline success state */}
            <div className="w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] flex items-center justify-center drop-shadow-[0_16px_50px_rgba(255,229,51,0.35)]">
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

            <h1 className="font-sans font-bold text-[28px] sm:text-[34px] lg:text-[48px] leading-[1.1] tracking-[-1.12px] lg:tracking-[-1.92px] text-white whitespace-nowrap">
              <span className="text-[#FFE533]">Thanks! </span>
              <span className="text-white">Your request is in.</span>
            </h1>

            <p className="font-sans font-normal text-base lg:text-xl leading-[1.5] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/70 max-w-[520px]">
              Our team will review the details and get back to you with a personalized
              quote within 24 hours. If your move is urgent, give us a call now.
            </p>

            {/* Desktop: buttons centered with content. */}
            <div className="hidden lg:flex flex-row gap-4 mt-2">
              <a
                href="tel:+13805240846"
                className="btn-shine bg-[#FFE533] h-[52px] flex items-center justify-center px-7 rounded-lg font-mono font-bold text-base text-[#0c0c0c] uppercase tracking-[-0.64px] leading-[1.2] hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                Call +1 380-524-0846
              </a>
              <Link
                href="/"
                className="border border-white h-[52px] flex items-center justify-center px-7 rounded-lg font-mono font-bold text-base text-white uppercase tracking-[-0.64px] leading-[1.2] hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                Back to home
              </Link>
            </div>
          </div>

          {/* Mobile: buttons pinned to the bottom of the viewport. */}
          <div className="lg:hidden max-w-[640px] mx-auto w-full flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+13805240846"
              className="btn-shine bg-[#FFE533] h-[48px] flex items-center justify-center w-full sm:w-auto px-7 rounded-lg font-mono font-bold text-sm text-[#0c0c0c] uppercase tracking-[-0.64px] leading-[1.2] hover:bg-[#f0d820] transition-all duration-300 ease-out"
            >
              Call +1 380-524-0846
            </a>
            <Link
              href="/"
              className="border border-white h-[48px] flex items-center justify-center w-full sm:w-auto px-7 rounded-lg font-mono font-bold text-sm text-white uppercase tracking-[-0.64px] leading-[1.2] hover:bg-white/10 transition-all duration-300 ease-out"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
