"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ContactFooter } from "@site/sections/ContactFooter";
import { Touchbar } from "@site/layout/Touchbar";
import { QuoteModal } from "@site/ui/QuoteModal";
import { Breadcrumbs } from "@site/layout/Breadcrumbs";
import { reviewsPageContent as content, siteContent, type ReviewItem } from "@/lib/content";

const PAGE_SIZE = 16;

const YELP_URL = siteContent.social.yelp;
const GOOGLE_URL = siteContent.social.google;

/* Review list — edited in the admin panel (Страницы → Отзывы). Avatar is
   optional: when missing, an InitialsAvatar is rendered instead. */
const reviews: ReviewItem[] = content.items;

/* Deterministic initials avatar — unique per name, no image files needed.
   Hash name → pick from a fixed palette; render first+last initial. */
const AVATAR_PALETTE = [
  { bg: "#F87171", fg: "#fff" }, // red
  { bg: "#FB923C", fg: "#fff" }, // orange
  { bg: "#FBBF24", fg: "#0c0c0c" }, // amber
  { bg: "#34D399", fg: "#0c0c0c" }, // emerald
  { bg: "#22D3EE", fg: "#0c0c0c" }, // cyan
  { bg: "#60A5FA", fg: "#fff" }, // blue
  { bg: "#818CF8", fg: "#fff" }, // indigo
  { bg: "#A78BFA", fg: "#fff" }, // violet
  { bg: "#F472B6", fg: "#fff" }, // pink
  { bg: "#FB7185", fg: "#fff" }, // rose
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]!.toUpperCase();
  return (parts[0][0]! + parts[parts.length - 1][0]!).toUpperCase();
}

function InitialsAvatar({ name, className = "" }: { name: string; className?: string }) {
  const { bg, fg } = AVATAR_PALETTE[hashName(name) % AVATAR_PALETTE.length];
  return (
    <div
      className={`flex items-center justify-center font-sans font-bold select-none ${className}`}
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}

function Stars({ count = 5, size = 18 }: { count?: number; size?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Image key={i} src="/icons/star-yellow.svg" alt="" width={size} height={size} />
      ))}
    </div>
  );
}

function ReviewCard({ name, location, rating, text, avatar, source }: ReviewItem) {
  const isYelp = source === "yelp";
  const sourceUrl = isYelp ? YELP_URL : GOOGLE_URL;
  const sourceIcon = isYelp ? "/icons/yelp-white.svg" : "/icons/google.svg";
  const sourceName = isYelp ? "Yelp" : "Google";
  /* Different aspect ratios: Yelp ≈ 0.79 (tall), Google ≈ 0.97 (near-square).
     Both SVGs use preserveAspectRatio="none", so dimensions must match the ratio. */
  const iconW = isYelp ? 15 : 17;
  const iconH = isYelp ? 19 : 17;

  return (
    <div className="bg-[#181818] rounded-xl lg:rounded-2xl p-5 lg:p-6 flex flex-col gap-5 group hover:bg-[#1e1e1e] transition-colors duration-300">
      <div className="flex gap-3 items-center">
        {avatar ? (
          <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden shrink-0">
            <Image src={avatar} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <InitialsAvatar
            name={name}
            className="w-11 h-11 lg:w-12 lg:h-12 rounded-full shrink-0 text-base lg:text-lg"
          />
        )}
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="font-sans font-semibold text-lg lg:text-xl leading-[1.3] tracking-[-0.54px] lg:tracking-[-0.6px] text-white">{name}</span>
          <span className="font-mono font-bold text-xs lg:text-sm leading-[1.2] tracking-[-0.56px] uppercase text-white/40">{location}</span>
        </div>
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#282828] flex items-center justify-center shrink-0 hover:bg-[#333] hover:scale-110 transition-all duration-300">
          <Image src={sourceIcon} alt={sourceName} width={iconW} height={iconH} />
        </a>
      </div>
      <Stars count={rating} />
      <p className="font-sans font-normal text-sm lg:text-base leading-[1.5] tracking-[-0.42px] lg:tracking-[-0.48px] text-white/70">“{text}”</p>
    </div>
  );
}

function RatingBadge({ href, logo, logoAlt, logoW, logoH, bg, platform, rating, count }: {
  href: string; logo: string; logoAlt: string; logoW: number; logoH: number; bg: string; platform: string; rating: string; count: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <div
        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Image src={logo} alt={logoAlt} width={logoW} height={logoH} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono font-bold text-[11px] lg:text-xs uppercase tracking-[-0.48px] text-white/50">{platform}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-sans font-bold text-lg lg:text-xl leading-[1] tracking-[-0.54px] text-white">{rating}</span>
          <Stars count={5} size={12} />
        </div>
        <span className="font-mono font-medium text-[10px] lg:text-[11px] uppercase tracking-[-0.44px] text-white/40 whitespace-nowrap">{count} reviews</span>
      </div>
    </a>
  );
}

function ReviewsHero() {
  return (
    <section className="bg-[#0c0c0c]">
      <div className="max-w-[1408px] mx-auto px-4 w-full pt-6 lg:pt-10 pb-[40px] lg:pb-[60px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-10">
          <div className="flex flex-col gap-4 lg:gap-5">
            <h1 className="font-sans font-bold text-[36px] lg:text-[72px] leading-none tracking-[-1.08px] lg:tracking-[-2.16px]">
              <span className="text-[#FFE533]">{content.hero.h1Highlight} </span>
              <span className="text-white">{content.hero.h1Rest}</span>
            </h1>
            <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[540px]">
              {content.hero.subtitle}
            </p>
          </div>

          {/* Mobile: card-style block — 4.9/5 + stars at top, divider, then
                      Google and Yelp badges stacked one per row (no horizontal squeeze).
              Desktop: 4.9/5 on the left, badges stacked on the right with a divider. */}
          <div className="rounded-2xl bg-[#181818] lg:bg-transparent ring-1 ring-white/5 lg:ring-0 p-5 lg:p-0 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 shrink-0">
            <div className="flex flex-col gap-2 pb-5 lg:pb-0 lg:pr-8 border-b border-white/10 lg:border-b-0 lg:border-r">
              <div className="flex items-baseline gap-0.5">
                <span className="font-sans font-bold text-[48px] lg:text-[72px] leading-[1] tracking-[-1.92px] lg:tracking-[-2.88px] text-white">{siteContent.ratings.overall}</span>
                <span className="font-sans font-bold text-2xl lg:text-3xl leading-[1] tracking-[-0.72px] text-white/50">/5</span>
              </div>
              <Stars count={5} size={16} />
              <span className="font-mono font-medium text-[11px] uppercase tracking-[-0.44px] text-white/40 whitespace-nowrap">{siteContent.ratings.totalReviews} total reviews</span>
            </div>
            <div className="flex flex-col gap-4 lg:gap-6">
              <RatingBadge
                href={GOOGLE_URL}
                logo="/icons/google.svg"
                logoAlt="Google"
                logoW={22}
                logoH={22}
                bg="#357DFF"
                platform="Google"
                rating={siteContent.ratings.google}
                count={siteContent.ratings.googleReviews}
              />
              <RatingBadge
                href={YELP_URL}
                logo="/icons/yelp.svg"
                logoAlt="Yelp"
                logoW={18}
                logoH={22}
                bg="#FF2828"
                platform="Yelp"
                rating={siteContent.ratings.yelp}
                count={siteContent.ratings.yelpReviews}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Simple Prev / [numbers] / Next pagination. */
function Pagination({ page, totalPages, onChange }: {
  page: number; totalPages: number; onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-10 lg:mt-12">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="h-11 px-5 rounded-lg bg-[#181818] text-white font-mono font-bold text-sm uppercase tracking-[-0.56px] hover:bg-[#242424] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        &larr; Prev
      </button>
      <div className="flex items-center gap-1.5 mx-2">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`w-11 h-11 rounded-lg font-mono font-bold text-sm uppercase tracking-[-0.56px] transition-colors duration-200 cursor-pointer ${
              p === page
                ? "bg-[#FFE533] text-[#0c0c0c]"
                : "bg-[#181818] text-white hover:bg-[#242424]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="h-11 px-5 rounded-lg bg-[#181818] text-white font-mono font-bold text-sm uppercase tracking-[-0.56px] hover:bg-[#242424] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        Next &rarr;
      </button>
    </div>
  );
}

export default function ReviewsClient() {
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const pageReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Switch page + scroll to the top of the grid. We use getBoundingClientRect
     + window.scrollTo with a header offset because scrollIntoView under the
     `page-zoom` CSS transform was landing in the middle of the section. */
  const handlePageChange = (next: number) => {
    setPage(next);
    requestAnimationFrame(() => {
      const el = gridRef.current;
      if (!el) return;
      const HEADER_OFFSET = 88; // sticky header + breathing room
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  return (
    <div className="page-zoom">
      <main>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Reviews" }]} />
        <ReviewsHero />
        <section className="bg-[#0c0c0c] px-4 pb-[60px] lg:pb-[100px]">
          <div className="max-w-[1408px] mx-auto" ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {pageReviews.map((review, i) => (
                <ReviewCard key={`${review.name}-${(page - 1) * PAGE_SIZE + i}`} {...review} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </div>
        </section>
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
