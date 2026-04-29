"use client";

import Image from "next/image";
import Link from "next/link";
import { QuoteForm } from "@/components/ui/QuoteForm";

function ContactForm() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:gap-5">
      {/* Left: heading + description */}
      <div className="lg:flex-1 flex flex-col">
        <div className="flex flex-col gap-4">
          <h3 className="font-sans font-semibold text-[28px] lg:text-[42px] leading-[1.2] tracking-[-0.84px] lg:tracking-[-1.26px] text-white lg:max-w-[495px]">
            Get a free moving estimate in just 5 minutes
          </h3>
          <p className="font-sans font-normal text-lg lg:text-xl leading-[1.4] tracking-[-0.54px] lg:tracking-[-0.6px] text-white/60 lg:max-w-[581px]">
            Fill out a few quick details about your move and we&apos;ll send you
            a personalized estimate — no hidden fees, no obligations. Safe,
            fast, and stress-free service in Vancouver, WA and Portland, OR.
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
          alt="GOAT Movers"
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
              Based in the heart of Vancouver, we started as a small company
              striving to assist people in the process of moving homes. We aimed
              to make people&apos;s lives easier by helping them move painlessly.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
              Navigation
            </span>
            <div className="flex flex-wrap gap-4 lg:gap-6 items-center">
              <Link href="/local-moving" className="hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
                Local Moving
              </Link>
              <Link href="/long-distance-moving" className="hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
                Long Distance
              </Link>
              <Link href="/commercial-moving" className="hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
                Commercial
              </Link>
              <Link href="/packing-services" className="hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
                Packing
              </Link>
              <Link href="/reviews" className="hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
                Reviews
              </Link>
              <Link href="/faq" className="hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
                FAQ
              </Link>
              <Link href="/contacts" className="hover-underline font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
                Contacts
              </Link>
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
          <a href="tel:+13805240846" className="hover-underline w-fit font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200">
            +1 380-524-0846
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
            Address
          </span>
          <div className="font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white flex flex-col gap-1">
            <a
              href="https://www.google.com/maps/search/?api=1&query=1178+Dock+St,+Tacoma,+WA+98402"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-underline w-fit hover:text-[#FFE533] transition-colors duration-200"
            >
              1178 Dock St, Tacoma, WA 98402
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=8101+NE+14th+Pl,+Portland,+OR+97211"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-underline w-fit hover:text-[#FFE533] transition-colors duration-200"
            >
              8101 NE 14th Pl, Portland, OR 97211
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
            Email
          </span>
          <a href="mailto:goatmoversla@gmail.com" className="hover-underline w-fit font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white hover:text-[#FFE533] transition-colors duration-200 break-all lg:break-normal">
            goatmoversla@gmail.com
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
            Social Media
          </span>
          <div className="flex gap-3">
            <a
              href="https://www.yelp.com/biz/goat-movers-vancouver?uid=rwbUOx3Y71juVHVrCkq2OQ&utm_source=ishare"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon social-icon--yelp"
            >
              <Image src="/icons/yelp-footer.svg" alt="Yelp" width={23} height={29} />
            </a>
            <a
              href="https://www.google.com/maps/place/GOAT+MOVERS/@45.5454821,-122.635238,10z/data=!3m1!4b1!4m6!3m5!1s0xa4790ebd1e7ffb07:0x697d406165de98a5!8m2!3d45.5454821!4d-122.635238!16s%2Fg%2F11wbt8363h?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon social-icon--google"
            >
              <Image src="/icons/google-footer.svg" alt="Google" width={27} height={28} />
            </a>
            <a
              href="https://www.instagram.com/goatmovers"
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
            Copyright © 2022-2026 GOAT Movers. All Rights Reserved.
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
            <a href="https://bankai.agency/ru" target="_blank" rel="noopener noreferrer" className="group/bankai flex gap-[3.81px] items-center shrink-0 transition-all duration-300 ease-out">
              <Image
                src="/icons/bankai-logo.svg"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 transition-all duration-300 ease-out group-hover/bankai:scale-125 group-hover/bankai:rotate-[-15deg] group-hover/bankai:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              />
              <span className="font-semibold text-[13.3px] leading-[16.3px] text-white/60 transition-all duration-300 ease-out group-hover/bankai:text-white group-hover/bankai:tracking-[2px]">
                BANKAI.AGENCY
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
