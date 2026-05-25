"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";

// Gallery slides for mobile carousel (1 big + 2 small per slide)
const mobileSlides = [
  { big: 0, small: [1, 2] },
  { big: 3, small: [4, 5] },
  { big: 6, small: [0, 3] },
];

const galleryImages = [
  { src: "/images/gallery-1.jpg", alt: "GOAT Movers carrying sofa" },
  { src: "/images/gallery-2.jpg", alt: "Moving crew at doorway" },
  { src: "/images/gallery-3.jpg", alt: "Moving truck loaded" },
  { src: "/images/gallery-4.jpg", alt: "GOAT Movers team on stairs" },
  { src: "/images/gallery-5.jpg", alt: "Mover carrying wrapped furniture" },
  { src: "/images/gallery-6.jpg", alt: "GOAT Movers branded cap and box" },
  { src: "/images/gallery-7.jpg", alt: "Mover wrapping mattress" },
];

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  images: typeof galleryImages;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Click anywhere on the backdrop (outside image / controls) closes the
     lightbox. The image, arrows, close button, and thumbnail strip stop
     propagation so clicks on them are never interpreted as "outside". */
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col animate-fade-in bg-black/90 backdrop-blur-sm cursor-zoom-out"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => { stop(e); onClose(); }}
        className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 ease-out cursor-pointer hover:scale-110 hover:rotate-90"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center relative px-2 lg:px-20 pt-6 pb-4">
        {/* Left arrow */}
        <button
          onClick={(e) => { stop(e); onPrev(); }}
          className="absolute left-2 lg:left-6 z-10 w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 ease-out cursor-pointer hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Image — clicking on it shouldn't close the lightbox */}
        <div
          className="relative w-full max-w-[1200px] aspect-[4/3] lg:aspect-auto lg:h-full lg:max-h-[70vh] mx-auto cursor-default"
          onClick={stop}
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-contain transition-opacity duration-300"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Right arrow */}
        <button
          onClick={(e) => { stop(e); onNext(); }}
          className="absolute right-2 lg:right-6 z-10 w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 ease-out cursor-pointer hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip — clicks should select, not close */}
      <div
        className="relative z-10 flex justify-center gap-1.5 lg:gap-2 pb-6 px-4 lg:px-6 overflow-x-auto cursor-default"
        onClick={stop}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`relative w-[60px] h-[44px] lg:w-[100px] lg:h-[70px] rounded-lg overflow-hidden shrink-0 cursor-pointer transition-all duration-200 ease-out ${
              i === currentIndex
                ? "ring-2 ring-white scale-105"
                : "opacity-50 hover:opacity-80 hover:scale-105"
            }`}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="100px" />
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileGalleryCarousel({ onImageClick }: { onImageClick: (index: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const updateSlide = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const slideWidth = el.clientWidth;
    const index = Math.round(el.scrollLeft / slideWidth);
    setActiveSlide(index);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateSlide, { passive: true });
    return () => el.removeEventListener("scroll", updateSlide);
  }, [updateSlide]);

  const scrollToSlide = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const slideWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: index * slideWidth, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:hidden items-center">
      {/* self-stretch overrides parent items-center so the scroll container
          is full-width — otherwise children w-full collapse to content width
          and you see multiple slides squished side-by-side. */}
      <div
        ref={scrollRef}
        className="flex w-full self-stretch gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {mobileSlides.map((slide, si) => (
          <div key={si} className="flex flex-col gap-[10px] w-full shrink-0 snap-center">
            {/* Big image */}
            <button
              onClick={() => onImageClick(slide.big)}
              className="relative w-full h-[207px] rounded-[12px] overflow-hidden gallery-zoom cursor-pointer"
            >
              <Image src={galleryImages[slide.big].src} alt={galleryImages[slide.big].alt} fill className="object-cover" />
            </button>
            {/* Two small images */}
            <div className="flex gap-[10px]">
              {slide.small.map((imgIdx, i) => (
                <button
                  key={i}
                  onClick={() => onImageClick(imgIdx)}
                  className="relative flex-1 h-[185px] rounded-[12px] overflow-hidden gallery-zoom cursor-pointer"
                >
                  <Image src={galleryImages[imgIdx].src} alt={galleryImages[imgIdx].alt} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination dots */}
      <div className="flex gap-2">
        {mobileSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`rounded-full w-2 h-2 transition-colors duration-300 ease-out cursor-pointer ${
              i === activeSlide ? "bg-[#FFE533]" : "bg-[#242424]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
  }, []);

  return (
    <>
      <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
        <div className="max-w-[1408px] mx-auto flex flex-col gap-6 lg:gap-16">
          {/* Section header */}
          <div className="flex flex-col gap-[36px] lg:gap-12">
            <div className="border-b border-white/16 pb-4 lg:pb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
                <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                  Gallery
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-0">
              <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white">
                GOAT in Action
              </h2>
              <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[450px]">
                See our team at work — real moves, real care
              </p>
            </div>
          </div>

          {/* Mobile: paginated carousel (1 big + 2 small per slide) */}
          <MobileGalleryCarousel onImageClick={openLightbox} />

          {/* Desktop grid — CSS Grid with flexible columns so it scales cleanly
              across 1024px → 1728px without hard-coded column widths breaking. */}
          <div
            className="hidden lg:grid gap-2.5 h-[615px]"
            style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.45fr) minmax(0,1.65fr)", gridTemplateRows: "1fr 1fr" }}
          >
            {/* Col 1: sofa (top, spans 2/3 of height) + trucks (bottom) */}
            <button onClick={() => openLightbox(0)} className="relative rounded-xl overflow-hidden gallery-zoom cursor-pointer" style={{ gridColumn: 1, gridRow: "1 / span 1" }}>
              <Image src="/images/gallery-1.jpg" alt="GOAT Movers carrying sofa" fill className="object-cover" sizes="25vw" />
            </button>
            <div className="grid grid-cols-2 gap-2.5" style={{ gridColumn: 1, gridRow: 2 }}>
              <button onClick={() => openLightbox(1)} className="relative rounded-xl overflow-hidden gallery-zoom cursor-pointer">
                <Image src="/images/gallery-2.jpg" alt="Moving crew at doorway" fill className="object-cover" sizes="12vw" />
              </button>
              <button onClick={() => openLightbox(2)} className="relative rounded-xl overflow-hidden gallery-zoom cursor-pointer">
                <Image src="/images/gallery-3.jpg" alt="Moving truck loaded" fill className="object-cover" sizes="12vw" />
              </button>
            </div>

            {/* Col 2: center tall image spans both rows */}
            <button onClick={() => openLightbox(3)} className="relative rounded-xl overflow-hidden gallery-zoom cursor-pointer" style={{ gridColumn: 2, gridRow: "1 / span 2" }}>
              <Image src="/images/gallery-4.jpg" alt="GOAT Movers team on stairs" fill className="object-cover" sizes="35vw" />
            </button>

            {/* Col 3: two small (top) + one wide bottom */}
            <div className="grid grid-cols-2 gap-2.5" style={{ gridColumn: 3, gridRow: 1 }}>
              <button onClick={() => openLightbox(4)} className="relative rounded-xl overflow-hidden gallery-zoom cursor-pointer">
                <Image src="/images/gallery-5.jpg" alt="Mover carrying wrapped furniture" fill className="object-cover" sizes="20vw" />
              </button>
              <button onClick={() => openLightbox(5)} className="relative rounded-xl overflow-hidden gallery-zoom cursor-pointer">
                <Image src="/images/gallery-6.jpg" alt="GOAT Movers branded cap and box" fill className="object-cover" sizes="20vw" />
              </button>
            </div>
            <button onClick={() => openLightbox(6)} className="relative rounded-xl overflow-hidden gallery-zoom cursor-pointer" style={{ gridColumn: 3, gridRow: 2 }}>
              <Image src="/images/gallery-7.jpg" alt="Mover wrapping mattress" fill className="object-cover" sizes="40vw" />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox overlay */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
          onSelect={setLightboxIndex}
        />
      )}
    </>
  );
}
