"use client";

import Image from "next/image";
import Link from "next/link";
import { BankaiLink } from "@/components/BankaiLink";
import { QuoteForm } from "@site/ui/QuoteForm";
import { siteContent } from "@/lib/content";
import { formatPhone, phoneHref } from "@/lib/content/phone";
import { FooterParallax } from "./FooterParallax";

/* Contact details, footer copy and social links come from
   `src/content/site.json` (admin panel → Контакты и общие данные). */
const { footer, social } = siteContent;

const navLinkClass =
  "hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200";

const NAV_LINKS = [
  { href: "/local-moving", label: "Local Moving" },
  { href: "/long-distance-moving", label: "Long Distance" },
  { href: "/commercial-moving", label: "Commercial" },
  { href: "/packing-services", label: "Packing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Contacts" },
];

function ContactForm() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:gap-5">
      {/* Left: heading + description */}
      <div className="lg:flex-1 flex flex-col">
        <div className="flex flex-col gap-4">
          <h3 className="font-sans font-semibold text-[28px] lg:text-[42px] leading-[1.2] tracking-[-0.84px] lg:tracking-[-1.26px] text-white lg:max-w-[495px]">
            {footer.formHeading}
          </h3>
          <p className="font-sans font-normal text-lg lg:text-xl leading-[1.4] tracking-[-0.54px] lg:tracking-[-0.6px] text-white/60 lg:max-w-[581px]">
            {footer.formText}
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="lg:flex-1 flex flex-col gap-5">
        <QuoteForm />
      </div>
    </div>
  );
}

function FooterContent() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-5">
      {/* Left column: logo, about, navigation */}
      <div className="lg:flex-1 flex flex-col gap-8 lg:justify-between">
        <Image
          src="/icons/logo-white.svg"
          alt={siteContent.brand}
          width={148}
          height={70}
          className="w-[124px] lg:w-[148px] h-auto"
        />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
              About
            </span>
            <p className="font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white max-w-[537px]">
              {footer.about}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
              Navigation
            </span>
            <div className="flex flex-wrap gap-4 lg:gap-6 items-center">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={navLinkClass}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right column: contact info */}
      <div className="lg:flex-1 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
            Phone
          </span>
          <a href={phoneHref(siteContent.phone)} className="hover-underline w-fit font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
            {formatPhone(siteContent.phone, "dashed")}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
            Address
          </span>
          <div className="font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white flex flex-col gap-1">
            {siteContent.addresses.map((a) => (
              <a
                key={a.label}
                href={a.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-underline w-fit hover:text-[#FFE533] transition-colors duration-200"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
            Email
          </span>
          <a href={`mailto:${siteContent.email}`} className="hover-underline w-fit font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200 break-all lg:break-normal">
            {siteContent.email}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
            Social Media
          </span>
          <div className="flex gap-3">
            <a
              href={social.yelp}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon social-icon--yelp"
            >
              <Image src="/icons/yelp-footer.svg" alt="Yelp" width={23} height={29} />
            </a>
            <a
              href={social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon social-icon--google"
            >
              <Image src="/icons/google-footer.svg" alt="Google" width={27} height={28} />
            </a>
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon social-icon--instagram"
            >
              <Image src="/icons/instagram.svg" alt="Instagram" width={27} height={27} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactFooter() {
  return (
    <FooterParallax>
    <footer id="contact" className="bg-[#141414] px-4 pt-16 lg:pt-20 pb-[76px] lg:pb-10">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-8">
        {/* Contact form section */}
        <div className="flex flex-col gap-[36px] lg:gap-12">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                Contacts
              </span>
            </div>
          </div>
          <ContactForm />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Footer content */}
        <FooterContent />

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Bottom bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <p className="font-sans font-normal text-lg leading-[1.4] tracking-[-0.36px] text-white/60 lg:w-[638px]">
            {footer.copyright}
          </p>
          <Link
            href="/privacy"
            className="w-fit font-sans font-normal text-lg leading-[1.4] tracking-[-0.36px] text-white/60 hover:text-[#FFE533] hover:underline transition-colors duration-200"
          >
            Privacy policy
          </Link>
          <div className="flex gap-3 items-center lg:justify-end lg:flex-1 whitespace-nowrap">
            <span className="font-sans font-normal text-lg leading-[1.4] tracking-[-0.36px] text-white/60">
              Design &amp; development by
            </span>
            <BankaiLink />
          </div>
        </div>
      </div>
    </footer>
    </FooterParallax>
  );
}
