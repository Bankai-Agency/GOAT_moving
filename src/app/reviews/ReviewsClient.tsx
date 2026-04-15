"use client";

import React from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

const YELP_URL = "https://www.yelp.com/biz/goat-movers-vancouver?uid=rwbUOx3Y71juVHVrCkq2OQ&utm_source=ishare";
const GOOGLE_URL = "https://www.google.com/maps/place/GOAT+MOVERS/@45.5454821,-122.635238,10z";

const reviews = [
  { name: "Amanda J.", location: "Los Angeles, CA", rating: 5, text: "These guys are AMAZING – super professional experienced movers at a fair price, they arrived early with all the needed tools to take furniture apart and put back together. Easy local move done right! Thank you GOAT Movers!", source: "yelp", avatar: "/images/avatar-1.jpg" },
  { name: "Mike T.", location: "Vancouver, WA", rating: 5, text: "Hands down the best moving experience I’ve ever had. The crew showed up on time, wrapped everything carefully, and had us fully moved into our new place in under 4 hours. Will absolutely use them again.", source: "yelp", avatar: "/images/avatar-2.jpg" },
  { name: "Sarah K.", location: "Portland, OR", rating: 5, text: "I was dreading my cross-state move but these guys made it completely stress-free. They disassembled my furniture, loaded everything efficiently, and nothing was damaged. Highly recommend for long distance moves!", source: "yelp", avatar: "/images/avatar-3.jpg" },
  { name: "David R.", location: "Seattle, WA", rating: 5, text: "Used GOAT Movers for our office relocation. They handled all the equipment with care, labeled everything perfectly, and we were back up and running the next morning. Professional and reliable team.", source: "yelp", avatar: "/images/avatar-4.jpg" },
  { name: "Jessica L.", location: "Portland, OR", rating: 5, text: "Moved my 3-bedroom house and couldn’t be happier. The team was friendly, efficient, and super careful with my grandmother’s antique furniture. Fair pricing with no hidden fees. 10/10 would recommend!", source: "yelp", avatar: "/images/avatar-5.jpg" },
  { name: "Chris M.", location: "Vancouver, WA", rating: 5, text: "Third time using GOAT Movers and they never disappoint. Quick, careful, and always on schedule. They even helped me rearrange furniture in the new place. These guys truly go above and beyond!", source: "yelp", avatar: "/images/reviewer-avatar.jpg" },
  { name: "Rachel W.", location: "Beaverton, OR", rating: 5, text: "Incredible service from start to finish. The team was punctual, polite, and handled our fragile items with extra care. Our piano arrived without a scratch. Can’t thank them enough!", source: "google", avatar: "/images/avatar-1.jpg" },
  { name: "Tom B.", location: "Tacoma, WA", rating: 5, text: "GOAT Movers helped us relocate our entire apartment in just 3 hours. They came prepared with all the right equipment and made the whole process seamless. Best movers in the Pacific Northwest!", source: "google", avatar: "/images/avatar-2.jpg" },
  { name: "Maria G.", location: "Hillsboro, OR", rating: 5, text: "We hired GOAT for a last-minute move and they were incredibly accommodating. Professional crew, fair pricing, and they treated our belongings like their own. Highly recommend to anyone in the area!", source: "yelp", avatar: "/images/avatar-3.jpg" },
  { name: "Kevin P.", location: "Portland, OR", rating: 5, text: "From the first phone call to the final box being placed, everything was smooth. The guys were friendly, efficient, and careful. No hidden charges. Exactly what you want in a moving company.", source: "google", avatar: "/images/avatar-4.jpg" },
  { name: "Emily S.", location: "Vancouver, WA", rating: 5, text: "Second time using GOAT and once again they exceeded expectations. Showed up early, worked fast without being careless, and even helped assemble my new IKEA shelves. Above and beyond!", source: "yelp", avatar: "/images/avatar-5.jpg" },
  { name: "Jason H.", location: "Gresham, OR", rating: 5, text: "Moved our 4-bedroom house across town. The crew of four was organized and efficient. Everything was wrapped properly and nothing was broken. Very competitive pricing for the quality of service.", source: "google", avatar: "/images/reviewer-avatar.jpg" },
];

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Image key={i} src="/icons/star-yellow.svg" alt="" width={18} height={18} />
      ))}
    </div>
  );
}

function ReviewCard({ name, location, rating, text, avatar, source }: typeof reviews[number]) {
  const sourceUrl = source === "yelp" ? YELP_URL : GOOGLE_URL;
  const sourceIcon = source === "yelp" ? "/icons/yelp-white.svg" : "/icons/google.svg";
  const sourceName = source === "yelp" ? "Yelp" : "Google";

  return (
    <div className="bg-[#181818] rounded-xl lg:rounded-2xl p-5 lg:p-6 flex flex-col gap-5 group hover:bg-[#1e1e1e] transition-colors duration-300">
      <div className="flex gap-3 items-center">
        <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden shrink-0">
          <Image src={avatar} alt={name} fill className="object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="font-sans font-semibold text-lg lg:text-xl leading-[1.3] tracking-[-0.54px] lg:tracking-[-0.6px] text-white">{name}</span>
          <span className="font-mono font-bold text-xs lg:text-sm leading-[1.2] tracking-[-0.56px] uppercase text-white/40">{location}</span>
        </div>
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#282828] flex items-center justify-center shrink-0 hover:bg-[#333] hover:scale-110 transition-all duration-300">
          <Image src={sourceIcon} alt={sourceName} width={15} height={19} />
        </a>
      </div>
      <Stars count={rating} />
      <p className="font-sans font-normal text-sm lg:text-base leading-[1.5] tracking-[-0.42px] lg:tracking-[-0.48px] text-white/70">“{text}”</p>
    </div>
  );
}

function SummaryCard() {
  return (
    <div className="bg-[#181818] rounded-xl lg:rounded-2xl p-5 lg:p-6 flex flex-col justify-between gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className="font-sans font-bold text-[48px] lg:text-[56px] leading-[1.2] tracking-[-1.92px] lg:tracking-[-2.24px] text-white">4,9</span>
          <span className="font-sans font-bold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] text-white/60">/5</span>
        </div>
        <div className="flex gap-2 items-center">
          <a href={YELP_URL} target="_blank" rel="noopener noreferrer" className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#282828] hover:bg-[#FFE533] flex items-center justify-center transition-all duration-300 hover:scale-110 group/yelp">
            <Image src="/icons/yelp-white.svg" alt="Yelp" width={15} height={19} className="group-hover/yelp:hidden" />
            <Image src="/icons/yelp-black.svg" alt="Yelp" width={15} height={19} className="hidden group-hover/yelp:block" />
          </a>
          <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#282828] hover:bg-[#FFE533] flex items-center justify-center transition-all duration-300 hover:scale-110 group/google">
            <Image src="/icons/google.svg" alt="Google" width={18} height={19} className="group-hover/google:hidden" />
            <Image src="/icons/google-black.svg" alt="Google" width={18} height={19} className="hidden group-hover/google:block" />
          </a>
        </div>
      </div>
      <p className="font-sans font-normal text-base lg:text-lg leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.54px] text-white/70">
        850+ verified 5-star reviews on Yelp and Google. Real feedback from real customers.
      </p>
      <div className="flex items-end justify-between">
        <div className="relative h-9 w-[130px]">
          {["/images/avatar-1.jpg", "/images/avatar-2.jpg", "/images/avatar-3.jpg", "/images/avatar-4.jpg", "/images/avatar-5.jpg"].map((src, i) => (
            <div key={i} className="absolute top-0 w-9 h-9 rounded-lg border-2 border-[#181818] overflow-hidden" style={{ left: i * 24 + "px" }}>
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Stars count={5} />
          <span className="font-mono font-medium text-xs leading-[1.2] tracking-[-0.56px] uppercase text-white/40">65+ 5 Stars</span>
        </div>
      </div>
    </div>
  );
}

function ReviewsHero() {
  return (
    <section className="bg-[#0c0c0c] min-h-[260px] lg:min-h-[340px] flex items-end">
      <div className="max-w-[1408px] mx-auto px-4 w-full pb-8 lg:pb-12">
        <div className="flex flex-col gap-4 lg:gap-5 pt-[100px]">
          <h1 className="font-sans font-bold text-[36px] lg:text-[72px] leading-none tracking-[-1.08px] lg:tracking-[-2.16px]">
            <span className="text-white/60">What Our </span>
            <span className="text-white">Clients Say</span>
          </h1>
          <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[540px]">
            850+ verified reviews with a 4.9-star Google rating. Real feedback from real customers.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ReviewsClient() {
  return (
    <>
      <Header />
      <ReviewsHero />
      <section className="bg-[#0c0c0c] px-4 pb-[60px] lg:pb-[100px]">
        <div className="max-w-[1408px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            <SummaryCard />
            {reviews.map((review, i) => (
              <ReviewCard key={`${review.name}-${i}`} {...review} />
            ))}
          </div>
        </div>
      </section>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </>
  );
}
