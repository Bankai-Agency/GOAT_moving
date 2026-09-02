"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { nbCity, sharedContent, siteContent } from "@/lib/content";

const YELP_URL = siteContent.social.yelp;
const GOOGLE_URL = siteContent.social.google;
const FALLBACK_AVATAR = "/images/reviewer-avatar.jpg";

export type ReviewItem = {
  name: string;
  location: string;
  rating: number;
  text: string;
  source: "yelp" | "google";
  avatar?: string;
};

export type ReviewsSectionProps = {
  label?: string;
  title?: React.ReactNode;
  reviews?: ReviewItem[];
};

/* Shared review list — edited in the admin (Общие блоки → Отзывы). */
const defaultReviews: ReviewItem[] = sharedContent.reviews.items.map((r) => ({
  ...r,
  location: nbCity(r.location),
}));

function Stars({ count = 5, variant = "yellow" }: { count?: number; variant?: "yellow" | "black" }) {
  const src = variant === "black" ? "/icons/star-black.svg" : "/icons/star-yellow.svg";
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Image key={i} src={src} alt="" width={20} height={20} />
      ))}
    </div>
  );
}

/* Desktop: inline card in horizontal carousel */
function SummaryCardDesktop() {
  return (
    <div className="bg-[#181818] rounded-2xl p-8 flex flex-col justify-between h-[374px] w-[calc(100vw-64px)] min-w-[calc(100vw-64px)] lg:w-[340px] lg:min-w-[340px] shrink-0 grow-0 select-none">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="font-sans font-bold text-[64px] leading-[1.2] tracking-[-2.56px] text-white">{siteContent.ratings.overall}</span>
            <span className="font-sans font-bold text-[32px] leading-[1.2] tracking-[-0.96px] text-white/60">/5</span>
          </div>
          {/* Brand-colored hover: Yelp → red, Google → blue.
              Fixed w-14 size — page-zoom scales the whole card proportionally,
              so the ratio to the 4,9/5 text is preserved at every resolution. */}
          <div className="flex gap-3 items-center shrink-0">
            <a href={YELP_URL} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#303030] hover:bg-[#FF2828] flex items-center justify-center transition-all duration-300 ease-out hover:scale-110">
              <Image src="/icons/yelp-white.svg" alt="Yelp" width={17} height={22} />
            </a>
            <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#303030] hover:bg-[#357DFF] flex items-center justify-center transition-all duration-300 ease-out hover:scale-110">
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            </a>
          </div>
        </div>
        <p className="font-sans font-normal text-xl leading-[1.4] tracking-[-0.6px] text-white">
          Visit our Yelp page to find out more about customer experience.
        </p>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="relative h-9 w-[130px] shrink-0">
          {["/images/avatar-1.jpg", "/images/avatar-2.jpg", "/images/avatar-3.jpg", "/images/avatar-4.jpg", "/images/avatar-5.jpg"].map((src, i) => (
            <div key={i} className="absolute top-0 w-9 h-9 rounded-full border-2 border-[#181818] overflow-hidden" style={{ left: `${i * 24}px` }}>
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 items-end text-right shrink-0">
          <Stars variant="yellow" />
          <span className="font-mono font-medium text-xs leading-[1.2] tracking-[-0.48px] uppercase text-white/50 whitespace-nowrap">{siteContent.ratings.fiveStarReviews} 5-Star Reviews</span>
        </div>
      </div>
    </div>
  );
}

/* Mobile: full-width summary card */
function SummaryCardMobile() {
  return (
    <div className="bg-[#181818] rounded-2xl p-6 flex flex-col justify-between h-[250px] w-full select-none">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="font-sans font-bold text-[32px] leading-[1.2] tracking-[-0.96px] text-white">{siteContent.ratings.overall}</span>
            <span className="font-sans font-bold text-2xl leading-[1.2] tracking-[-0.72px] text-white/60">/5</span>
          </div>
          <div className="flex gap-3 items-center">
            <a href={YELP_URL} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#303030] active:bg-[#FF2828] flex items-center justify-center transition-colors duration-200">
              <Image src="/icons/yelp-white.svg" alt="Yelp" width={17} height={22} />
            </a>
            <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#303030] active:bg-[#357DFF] flex items-center justify-center transition-colors duration-200">
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            </a>
          </div>
        </div>
        <p className="font-sans font-normal text-lg leading-[1.4] tracking-[-0.54px] text-white">
          Visit our Yelp page to find out more about customer experience.
        </p>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="relative h-9 w-[130px] shrink-0">
          {["/images/avatar-1.jpg", "/images/avatar-2.jpg", "/images/avatar-3.jpg", "/images/avatar-4.jpg", "/images/avatar-5.jpg"].map((src, i) => (
            <div key={i} className="absolute top-0 w-9 h-9 rounded-full border-2 border-[#181818] overflow-hidden" style={{ left: `${i * 24}px` }}>
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 items-end text-right shrink-0">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Image key={i} src="/icons/star-yellow.svg" alt="" width={18} height={18} />
            ))}
          </div>
          <span className="font-mono font-medium text-xs leading-[1.2] tracking-[-0.48px] uppercase text-white/50 whitespace-nowrap">{siteContent.ratings.fiveStarReviews} 5-Star Reviews</span>
        </div>
      </div>
    </div>
  );
}

/* Desktop review card — horizontal carousel, hover yellow.
   Only the Yelp/Google icon is clickable. */
function ReviewCardDesktop({ name, location, rating, text, avatar, source }: ReviewItem) {
  const reviewUrl = source === "yelp" ? YELP_URL : GOOGLE_URL;
  return (
    <div className="bg-[#181818] hover:bg-[#FFE533] rounded-2xl p-8 h-[374px] overflow-hidden w-[calc(100vw-64px)] min-w-[calc(100vw-64px)] lg:w-[340px] lg:min-w-[340px] shrink-0 grow-0 select-none transition-all duration-300 ease-out hover:shadow-[0_12px_32px_rgba(255,229,51,0.15)] group/card">
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
            <Image src={avatar ?? FALLBACK_AVATAR} alt={name} fill className="object-cover" />
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <span className="font-sans font-semibold text-2xl leading-[1.4] tracking-[-0.72px] text-white group-hover/card:text-black transition-colors duration-300 truncate">{name}</span>
            <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/60 group-hover/card:text-black/60 transition-colors duration-300 truncate">{location}</span>
          </div>
          <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="bg-[#303030] group-hover/card:bg-[#0c0c0c] w-14 h-14 rounded-full flex items-center justify-center shrink-0 hover:scale-110 transition-all duration-300 ease-out z-10" onClick={(e) => e.stopPropagation()}>
            {source === "google" ? (
              <Image src="/icons/google-color.svg" alt="Google" width={22} height={22} />
            ) : (
              <Image src="/icons/yelp-white.svg" alt="Yelp" width={17} height={22} />
            )}
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <div className="group-hover/card:hidden"><Stars count={rating} variant="yellow" /></div>
          <div className="hidden group-hover/card:flex"><Stars count={rating} variant="black" /></div>
          <p className="font-sans font-normal text-lg leading-[1.4] tracking-[-0.36px] text-white group-hover/card:text-black transition-colors duration-300">&ldquo;{text}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}

/* Mobile review card — full-width, 360px tall, 20px padding.
   Only the Yelp/Google icon is clickable. */
function ReviewCardMobile({ name, location, rating, text, avatar, source }: ReviewItem) {
  const reviewUrl = source === "yelp" ? YELP_URL : GOOGLE_URL;
  return (
    <div className="bg-[#181818] rounded-2xl p-5 h-[360px] overflow-hidden w-[calc(100vw-64px)] min-w-[calc(100vw-64px)] lg:w-[336px] lg:min-w-[336px] shrink-0 grow-0 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
            <Image src={avatar ?? FALLBACK_AVATAR} alt={name} fill className="object-cover" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <span className="font-sans font-semibold text-xl leading-[1.4] tracking-[-0.6px] text-white truncate">{name}</span>
            <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/60 truncate">{location}</span>
          </div>
          <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="bg-[#303030] w-14 h-14 rounded-full flex items-center justify-center shrink-0">
            {source === "google" ? (
              <Image src="/icons/google-color.svg" alt="Google" width={22} height={22} />
            ) : (
              <Image src="/icons/yelp-white.svg" alt="Yelp" width={17} height={22} />
            )}
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <Stars count={rating} variant="yellow" />
          <p className="font-sans font-normal text-base leading-[1.5] tracking-[-0.48px] text-white">&ldquo;{text}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection({
  label = sharedContent.reviews.label,
  title = sharedContent.reviews.title,
  reviews = defaultReviews,
}: ReviewsSectionProps = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mobileCanLeft, setMobileCanLeft] = useState(false);
  const [mobileCanRight, setMobileCanRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const totalDots = 6;
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScroll - 2);
    if (maxScroll <= 0) return;
    const ratio = el.scrollLeft / maxScroll;
    const dot = Math.round(ratio * (totalDots - 1));
    setActiveSlide(dot);
  }, [totalDots]);

  const updateMobileScrollState = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const el = mobileScrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setMobileCanLeft(el.scrollLeft > 2);
    setMobileCanRight(el.scrollLeft < maxScroll - 2);
  }, []);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    if (!scrollRef.current) return;
    const cardWidth = 340 + 16;
    scrollRef.current.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  }, []);

  const mobileScrollByCard = useCallback((direction: -1 | 1) => {
    if (!mobileScrollRef.current) return;
    const cardWidth = 336 + 8;
    mobileScrollRef.current.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  }, []);

  const scrollToDot = useCallback((dotIndex: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (dotIndex / (totalDots - 1)) * maxScroll;
    el.scrollTo({ left: target, behavior: "smooth" });
    setActiveSlide(dotIndex);
  }, [totalDots]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    if ((e.target as HTMLElement).closest("a")) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => updateScrollState();
    el.addEventListener("scroll", handler, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", handler);
  }, [updateScrollState]);

  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const handler = () => updateMobileScrollState();
    el.addEventListener("scroll", handler, { passive: true });
    updateMobileScrollState();
    return () => el.removeEventListener("scroll", handler);
  }, [updateMobileScrollState]);

  const pauseAutoScroll = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsPaused(false), 6000);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || !isInView) {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
      return;
    }
    autoScrollTimer.current = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const cardWidth = 340 + 16;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000);
    return () => { if (autoScrollTimer.current) clearInterval(autoScrollTimer.current); };
  }, [isPaused, isInView]);

  return (
    <section id="reviews" ref={sectionRef} className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-6 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-12">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
              {title}
            </h2>
            {/* Desktop nav arrows */}
            <div className="hidden lg:flex gap-2">
              <button onClick={() => { scrollByCard(-1); pauseAutoScroll(); }} disabled={!canScrollLeft} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ease-out ${canScrollLeft ? "bg-[#242424] hover:bg-[#303030] hover:scale-110 cursor-pointer" : "bg-[#181818] cursor-default"}`}>
                <Image src="/icons/arrow-left.svg" alt="Previous" width={19} height={16} className={canScrollLeft ? "opacity-100" : "opacity-30"} />
              </button>
              <button onClick={() => { scrollByCard(1); pauseAutoScroll(); }} disabled={!canScrollRight} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ease-out ${canScrollRight ? "bg-[#242424] hover:bg-[#303030] hover:scale-110 cursor-pointer" : "bg-[#181818] cursor-default"}`}>
                <Image src="/icons/arrow-right.svg" alt="Next" width={19} height={16} className={canScrollRight ? "opacity-100" : "opacity-30"} />
              </button>
            </div>
          </div>
        </div>

        {/* ===== MOBILE LAYOUT ===== */}
        <div className="flex flex-col gap-6 lg:hidden items-center">
          {/* Summary card — full width */}
          <SummaryCardMobile />

          {/* Horizontal scroll of review cards */}
          <div
            ref={mobileScrollRef}
            className="flex gap-2 w-full overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", maskImage: "linear-gradient(to right, black calc(100% - 50px), transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black calc(100% - 50px), transparent 100%)" }}
          >
            {reviews.map((review, i) => (
              <ReviewCardMobile key={i} {...review} />
            ))}
          </div>

          {/* Arrow navigation */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => mobileScrollByCard(-1)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${mobileCanLeft ? "bg-[#242424] cursor-pointer" : "bg-[#181818] cursor-default"}`}
            >
              <Image src="/icons/arrow-left.svg" alt="Previous" width={19} height={16} className={mobileCanLeft ? "opacity-100" : "opacity-30"} />
            </button>
            <button
              onClick={() => mobileScrollByCard(1)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${mobileCanRight ? "bg-[#242424] cursor-pointer" : "bg-[#181818] cursor-default"}`}
            >
              <Image src="/icons/arrow-right.svg" alt="Next" width={19} height={16} className={mobileCanRight ? "opacity-100" : "opacity-30"} />
            </button>
          </div>
        </div>

        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="hidden lg:flex flex-col gap-12 items-center">
          <div
            ref={scrollRef}
            onMouseDown={(e) => { handleMouseDown(e); pauseAutoScroll(); }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseEnter={pauseAutoScroll}
            className={`flex gap-4 w-full h-[374px] overflow-x-auto scrollbar-hide ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", maskImage: "linear-gradient(to right, black calc(100% - 50px), transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black calc(100% - 50px), transparent 100%)" }}
          >
            <SummaryCardDesktop />
            {reviews.map((review, i) => (
              <ReviewCardDesktop key={i} {...review} />
            ))}
          </div>
          {/* Pagination dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button key={i} onClick={() => { scrollToDot(i); pauseAutoScroll(); }} className={`rounded-full w-2 h-2 transition-colors duration-300 ease-out cursor-pointer ${i === activeSlide ? "bg-[#FFE533]" : "bg-[#242424]"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
