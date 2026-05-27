"use client";

import Image from "next/image";
import { LPQuoteForm } from "../ui/LPQuoteForm";

/* ════════════════════════════════════════════════════════════════
   LPCtaForm — CTA section with embedded quote form. Replaces the
   plain CTABanner in the LP. Layout (desktop): photo bg + h2 on
   the left, vertical StepQuoteForm on the right.
   ════════════════════════════════════════════════════════════════ */

type Props = {
  heading?: string;
  tagline?: string;
  city?: string;
  image?: string;
};

export function LPCtaForm({
  heading = "Ready to experience the difference?",
  tagline = "Get your free, no-obligation quote — no hidden fees, no obligations.",
  city,
  image = "/lp/cta-movers.jpg",
}: Props) {
  return (
    <section id="cta" className="px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
          {/* Image background + gradient overlays */}
          <div className="absolute inset-0">
            <Image
              src={image}
              alt="GOAT Movers team"
              fill
              sizes="(max-width: 1024px) 100vw, 1408px"
              quality={90}
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)",
              }}
            />
          </div>

          {/* Content grid: heading on left (centered vertically),
              form on right. */}
          <div
            data-lp-cta-form
            className="relative z-10 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-12 p-6 lg:p-12 min-h-[400px] lg:min-h-[560px]"
          >
            {/* Left — heading + tagline (top-aligned) */}
            <div className="flex flex-col gap-4 lg:gap-6 lg:justify-start">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
                <span
                  style={{
                    fontFamily: "var(--font-mono, ui-monospace, monospace)",
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: "-1px",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.75)",
                  }}
                >
                  Get Started
                </span>
              </div>
              <h2
                className="font-sans font-bold text-[32px] lg:text-[56px] leading-[1.05] tracking-[-1.4px] lg:tracking-[-2px] text-white m-0"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
              <p
                className="font-sans font-normal text-base lg:text-lg leading-[1.45] tracking-[-0.3px] text-white/80 m-0"
                style={{ maxWidth: 640 }}
              >
                {tagline}
              </p>
            </div>

            {/* Right — shared LPQuoteForm in glass surface. Same
                treatment as the hero form on /lp3 (mobile = frosted
                glass, desktop = dark glass; both painted via the
                `_lp2-invert.css` glass-form rule). */}
            <div className="lg:max-w-[520px] lg:ml-auto w-full">
              <LPQuoteForm city={city} surface="glass" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
