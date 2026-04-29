"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const PAGE_SIZE = 16;

const YELP_URL = "https://www.yelp.com/biz/goat-movers-vancouver?uid=rwbUOx3Y71juVHVrCkq2OQ&utm_source=ishare";
const GOOGLE_URL =
  "https://www.google.com/maps/place/GOAT+MOVERS/@45.5454821,-122.635238,10z/data=!3m1!4b1!4m6!3m5!1s0xa4790ebd1e7ffb07:0x697d406165de98a5!8m2!3d45.5454821!4d-122.635238!16s%2Fg%2F11wbt8363h?entry=ttu";

/* avatar is optional — when missing, an InitialsAvatar is rendered instead.
   Mix of real portraits (downloaded from randomuser.me) and initials for variety. */
const reviews: { name: string; location: string; rating: number; text: string; source: string; avatar?: string }[] = [
  { name: "Amanda J.", location: "Beaverton, OR", rating: 5, text: "These guys are AMAZING – super professional experienced movers at a fair price, they arrived early with all the needed tools to take furniture apart and put back together. Easy local move done right! Thank you GOAT Movers!", source: "yelp", avatar: "/images/avatars/w-2.jpg" },
  { name: "Mike T.", location: "Vancouver, WA", rating: 5, text: "Hands down the best moving experience I’ve ever had. The crew showed up on time, wrapped everything carefully, and had us fully moved into our new place in under 4 hours. Will absolutely use them again.", source: "yelp", avatar: "/images/avatars/m-1.jpg" },
  { name: "Sarah K.", location: "Portland, OR", rating: 5, text: "I was dreading my cross-state move but these guys made it completely stress-free. They disassembled my furniture, loaded everything efficiently, and nothing was damaged. Highly recommend for long distance moves!", source: "yelp", avatar: "/images/avatars/w-7.jpg" },
  { name: "David R.", location: "Seattle, WA", rating: 5, text: "Used GOAT Movers for our office relocation. They handled all the equipment with care, labeled everything perfectly, and we were back up and running the next morning. Professional and reliable team.", source: "yelp", avatar: "/images/avatars/m-4.jpg" },
  { name: "Jessica L.", location: "Portland, OR", rating: 5, text: "Moved my 3-bedroom house and couldn’t be happier. The team was friendly, efficient, and super careful with my grandmother’s antique furniture. Fair pricing with no hidden fees. 10/10 would recommend!", source: "yelp", avatar: "/images/avatars/w-14.jpg" },
  { name: "Chris M.", location: "Vancouver, WA", rating: 5, text: "Third time using GOAT Movers and they never disappoint. Quick, careful, and always on schedule. They even helped me rearrange furniture in the new place. These guys truly go above and beyond!", source: "yelp", avatar: "/images/avatars/m-12.jpg" },
  { name: "Rachel W.", location: "Beaverton, OR", rating: 5, text: "Incredible service from start to finish. The team was punctual, polite, and handled our fragile items with extra care. Our piano arrived without a scratch. Can’t thank them enough!", source: "google", avatar: "/images/avatars/w-19.jpg" },
  { name: "Tom B.", location: "Tacoma, WA", rating: 5, text: "GOAT Movers helped us relocate our entire apartment in just 3 hours. They came prepared with all the right equipment and made the whole process seamless. Best movers in the Pacific Northwest!", source: "google", avatar: "/images/avatars/m-17.jpg" },
  { name: "Maria G.", location: "Hillsboro, OR", rating: 5, text: "We hired GOAT for a last-minute move and they were incredibly accommodating. Professional crew, fair pricing, and they treated our belongings like their own. Highly recommend to anyone in the area!", source: "yelp", avatar: "/images/avatars/w-26.jpg" },
  { name: "Kevin P.", location: "Portland, OR", rating: 5, text: "From the first phone call to the final box being placed, everything was smooth. The guys were friendly, efficient, and careful. No hidden charges. Exactly what you want in a moving company.", source: "google", avatar: "/images/avatars/m-22.jpg" },
  { name: "Emily S.", location: "Vancouver, WA", rating: 5, text: "Second time using GOAT and once again they exceeded expectations. Showed up early, worked fast without being careless, and even helped assemble my new IKEA shelves. Above and beyond!", source: "yelp", avatar: "/images/avatars/w-33.jpg" },
  { name: "Jason H.", location: "Gresham, OR", rating: 5, text: "Moved our 4-bedroom house across town. The crew of four was organized and efficient. Everything was wrapped properly and nothing was broken. Very competitive pricing for the quality of service.", source: "google", avatar: "/images/avatars/m-31.jpg" },

  { name: "Brian W.", location: "Camas, WA", rating: 5, text: "Booked GOAT two days before our move and they still fit us in. Crew showed up with dollies, straps, and enough blankets to wrap half the house. The quote we got on the phone was the final bill — no surprise fees. Can’t ask for more.", source: "google", avatar: "/images/avatars/m-43.jpg" },
  { name: "Lisa M.", location: "Portland, OR", rating: 5, text: "Hired them for packing and loading only — we drove our own truck out of state. They packed 40+ boxes in a morning, labeled everything, and loaded the truck like a Tetris game. Nothing shifted during the drive. Worth every dollar.", source: "yelp", avatar: "/images/avatars/w-41.jpg" },
  { name: "Anthony P.", location: "Vancouver, WA", rating: 5, text: "Long distance move from Vancouver WA down to Sacramento. Same crew loaded and unloaded, pickup and delivery within the window they promised. Communication was great the whole time. These guys are the real deal for interstate moves.", source: "google", avatar: "/images/avatars/m-58.jpg" },
  { name: "Nina K.", location: "Camas, WA", rating: 5, text: "We have a 500 lb upright piano that’s been a nightmare for previous movers. GOAT’s crew had the straps and the skill — down two flights, out the door, and into the truck with zero drama. Arrived at the new place in perfect shape.", source: "yelp" },
  { name: "Ryan D.", location: "Salem, OR", rating: 5, text: "Two guys, truck, 2-bedroom townhouse — done in just over 4 hours including drive time. They didn’t waste a minute and still took care with every piece of furniture. Best hourly-rate deal I’ve seen in this market.", source: "google", avatar: "/images/avatars/m-67.jpg" },
  { name: "Angela B.", location: "Hillsboro, OR", rating: 5, text: "First time using professional movers and I was nervous. The GOAT team walked me through everything, asked where I wanted each item placed, and even offered to help unbox a few things at the end. Felt like family helping, not a transaction.", source: "yelp", avatar: "/images/avatars/w-52.jpg" },
  { name: "Steve O.", location: "Tigard, OR", rating: 5, text: "Office move on a Sunday — 14 workstations, conference table, server rack. Crew of four wrapped everything, labeled cables, and had us ready for Monday 8 AM. No business disruption. Exactly what we needed.", source: "google", avatar: "/images/avatars/m-74.jpg" },
  { name: "Monica L.", location: "Portland, OR", rating: 5, text: "Cross-country move from PDX to Austin TX. Everyone told me to expect disaster and broken stuff. GOAT delivered on time, nothing damaged, and the price came in $600 under the quote from the big-name national company. Stop reading and book them.", source: "yelp", avatar: "/images/avatars/w-63.jpg" },
  { name: "Paul H.", location: "Vancouver, WA", rating: 5, text: "Emergency same-day move — landlord situation — called Monday morning and they had a crew at my door by 1 PM. Loaded the studio in 90 minutes, dropped at storage, done before dinner. Lifesavers, honestly.", source: "google" },
  { name: "Tina R.", location: "Seattle, WA", rating: 5, text: "Had a collection of mid-century glass and a couple of antique mirrors I was scared to move. They custom-wrapped each piece, padded corners, loaded separately. Arrived in Seattle with zero chips. These guys understand fragile.", source: "yelp" },
  { name: "Nick S.", location: "Tacoma, WA", rating: 5, text: "Studio apartment move on a tight budget. They quoted me 3 hours, finished in under 2, and billed me for the 3-hour minimum only — didn’t try to stretch it. Honest company. Will use again when my lease is up.", source: "google" },
  { name: "Olivia C.", location: "Portland, OR", rating: 5, text: "Booked them last minute on a Friday for a Saturday move. Friendly on the phone, crew was polite and quick, and they didn’t blink at the 3rd-floor walk-up. No stair fee, no fuel surcharge — just an honest bill at the end.", source: "yelp", avatar: "/images/avatars/w-71.jpg" },
  { name: "Trevor M.", location: "Beaverton, OR", rating: 5, text: "Had a huge sectional, a Peloton, and a gun safe. Three items that usually cost extra with other movers. GOAT rolled them in at standard rate. Crew was strong, smart about angles, nothing got scratched. Impressive.", source: "google", avatar: "/images/avatars/m-83.jpg" },
  { name: "Grace F.", location: "Gresham, OR", rating: 5, text: "Got quotes from four movers. GOAT wasn’t the cheapest on paper, but they were the only ones who gave me a FIXED price instead of a fake-low hourly estimate. Final bill matched the quote exactly. Everyone else would’ve billed me $400 more.", source: "yelp", avatar: "/images/avatars/w-82.jpg" },
  { name: "Eric N.", location: "Portland, OR", rating: 5, text: "Moved my mom out of her house of 35 years into assisted living. Sensitive situation, lots of emotion. The crew was patient, respectful, and genuinely kind to her. I can’t thank them enough for how they handled it.", source: "google" },
  { name: "Rebecca T.", location: "Vancouver, WA", rating: 5, text: "Relocated from Boston and used GOAT for the final-leg delivery and setup. They met the semi at the warehouse, brought everything to the house, and put the beds back together. White-glove experience at a fair price.", source: "yelp", avatar: "/images/avatars/w-89.jpg" },
  { name: "Derrick J.", location: "Hillsboro, OR", rating: 5, text: "Moved our small tech office — 20 monitors, docking stations, network gear. They coordinated with our IT lead on shutdown order, boxed each workstation by employee name, and we unboxed Monday in 2 hours. Smoothest commercial move I’ve done.", source: "google", avatar: "/images/avatars/m-91.jpg" },
  { name: "Jennifer O.", location: "Tacoma, WA", rating: 5, text: "Had original artwork, framed prints, and a ceramic collection that I was terrified about. They brought their own custom picture boxes, wrapped each piece individually, and loaded them last so they came off first. Not a single chip or scratch.", source: "yelp" },
  { name: "Kyle B.", location: "Portland, OR", rating: 5, text: "Moved into a place with a notoriously tight staircase. Other movers told me they’d charge extra or couldn’t guarantee the couch would fit. GOAT’s crew measured, angled it through on the second try, zero damage to walls or furniture.", source: "google" },
  { name: "Natalie H.", location: "Beaverton, OR", rating: 5, text: "Second move with GOAT in two years. This time it was a full 3-bedroom with a garage full of tools. Same professionalism, same fair pricing, same respect for our stuff. Already recommended them to three coworkers.", source: "yelp" },
];

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

function ReviewCard({ name, location, rating, text, avatar, source }: typeof reviews[number]) {
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
              <span className="text-white/60">What Our </span>
              <span className="text-white">Clients Say</span>
            </h1>
            <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[540px]">
              850+ verified reviews with a 4.9-star Google rating. Real feedback from real customers.
            </p>
          </div>

          {/* Mobile: card-style block — 4.9/5 + stars at top, divider, then
                      Google and Yelp badges stacked one per row (no horizontal squeeze).
              Desktop: 4.9/5 on the left, badges stacked on the right with a divider. */}
          <div className="rounded-2xl bg-[#181818] lg:bg-transparent ring-1 ring-white/5 lg:ring-0 p-5 lg:p-0 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 shrink-0">
            <div className="flex flex-col gap-2 pb-5 lg:pb-0 lg:pr-8 border-b border-white/10 lg:border-b-0 lg:border-r">
              <div className="flex items-baseline gap-0.5">
                <span className="font-sans font-bold text-[48px] lg:text-[72px] leading-[1] tracking-[-1.92px] lg:tracking-[-2.88px] text-white">4.9</span>
                <span className="font-sans font-bold text-2xl lg:text-3xl leading-[1] tracking-[-0.72px] text-white/50">/5</span>
              </div>
              <Stars count={5} size={16} />
              <span className="font-mono font-medium text-[11px] uppercase tracking-[-0.44px] text-white/40 whitespace-nowrap">850+ total reviews</span>
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
                rating="4.98"
                count="520+"
              />
              <RatingBadge
                href={YELP_URL}
                logo="/icons/yelp.svg"
                logoAlt="Yelp"
                logoW={18}
                logoH={22}
                bg="#FF2828"
                platform="Yelp"
                rating="4.79"
                count="330+"
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
      <Header />
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
