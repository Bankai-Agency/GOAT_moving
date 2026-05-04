"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsapPlugins } from "@/components/motion/gsap";

type AboutStat = { icon: string; value: string; label: string };

const defaultStats: AboutStat[] = [
  { icon: "/icons/year.svg", value: "7+", label: "Years in Business" },
  { icon: "/icons/review.svg", value: "850+", label: "Verified Reviews" },
  { icon: "/icons/star.svg", value: "4.9", label: "Google Rating" },
  { icon: "/icons/license.svg", value: "100%", label: "Licensed & Insured" },
];

const defaults = {
  label: "About Us",
  title: "Family-Owned Movers Serving the I-5 Corridor Since 2019",
  description:
    "GOAT Movers is a fully licensed and insured moving company (USDOT #4232069) based in Vancouver, WA. We serve the entire I-5 corridor — Vancouver, Portland, Beaverton, Hillsboro, Camas, and beyond. 3,000+ moves completed, 850+ five-star reviews, and zero hidden fees.",
  videoPoster: "https://r2.vidzflow.com/thumbnails/TyAtuYsIfT_1749538484.jpg",
  videoSources: [
    { src: "https://r2.vidzflow.com/v/TyAtuYsIfT_720p_1749538480.mp4", type: "video/mp4" },
    { src: "https://r2.vidzflow.com/v/TyAtuYsIfT_1080p_1749538480.mp4", type: "video/mp4" },
  ],
};

export function AboutMotionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [autoPlayed, setAutoPlayed] = useState(false);

  /* Auto-play muted as soon as the section enters the viewport. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || autoPlayed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current
            .play()
            .then(() => {
              setAutoPlayed(true);
              observer.disconnect();
            })
            .catch(() => {/* autoplay blocked */});
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoPlayed]);

  /* Header reveal + count-up + pinned video moment, all in one
     gsap.context so cleanup is one call. */
  useEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      /* Header stagger reveal */
      gsap.from([labelRef.current, headingRef.current, descRef.current], {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      /* Stat count-ups + entrance stagger */
      const statEls = statsRef.current?.querySelectorAll<HTMLElement>(".about-stat") ?? [];
      gsap.from(statEls, {
        scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
      statEls.forEach((stat) => {
        const target = stat.querySelector<HTMLElement>(".about-stat-value");
        if (!target) return;
        const raw = target.dataset.value || "0";
        const match = raw.match(/^(\D*)(\d[\d.,]*)(\D*)$/);
        if (!match) return;
        const [, prefix, num, suffix] = match;
        const cleaned = num.replace(",", ".");
        const end = parseFloat(cleaned);
        const decimals = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: end,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: stat, start: "top 85%", once: true },
          onUpdate: () => {
            target.textContent = `${prefix}${counter.v.toFixed(decimals)}${suffix}`;
          },
        });
      });

      /* Pinned video moment — desktop only. ScrollTrigger pins the
         sticky inner; scrub ties the scale + radius animation 1:1 to
         scroll progress over a 300vh track. */
      const mql = window.matchMedia("(min-width: 1024px)");
      if (mql.matches && pinTrackRef.current && videoFrameRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTrackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: stickyRef.current,
            pinSpacing: false,
            pinType: "transform",
          },
        });
        /* Scale 0.55 → 1.6 → 0.55, radius 16 → 0 → 16 over the track. */
        tl.fromTo(
          videoFrameRef.current,
          { scale: 0.55, borderRadius: 16 },
          { scale: 1.6, borderRadius: 0, ease: "power2.inOut", duration: 0.22 }
        )
          .to(videoFrameRef.current, { scale: 1.6, borderRadius: 0, duration: 0.56 })
          .to(videoFrameRef.current, {
            scale: 0.55,
            borderRadius: 16,
            ease: "power2.inOut",
            duration: 0.22,
          });

        /* Caption fades in / out during the held middle. */
        if (captionRef.current) {
          gsap.fromTo(
            captionRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: pinTrackRef.current,
                start: "top top+=20%",
                end: "top top+=70%",
                scrub: true,
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="bg-[#0c0c0c]">
      {/* Header — natural flow */}
      <div className="px-4 pt-[60px] lg:pt-[100px]">
        <div className="max-w-[1408px] mx-auto">
          <div className="flex flex-col gap-6 lg:gap-12">
            <div ref={labelRef} className="border-b border-white/16 pb-4 lg:pb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
                <span className="font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                  {defaults.label}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:gap-4">
              <h2
                ref={headingRef}
                className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-1.28px] lg:tracking-[-2.56px] text-white"
              >
                {defaults.title}
              </h2>
              <p
                ref={descRef}
                className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60"
              >
                {defaults.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned video moment — desktop only. 300vh scroll budget. */}
      <div ref={pinTrackRef} className="hidden lg:block relative" style={{ height: "300vh" }}>
        <div ref={stickyRef} className="h-screen w-full flex items-center justify-center overflow-hidden">
          <div
            ref={videoFrameRef}
            className="relative bg-black overflow-hidden"
            style={{ width: "100vw", height: "100vh" }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={defaults.videoPoster}
              playsInline
              preload="metadata"
              loop
              muted
              autoPlay
            >
              {defaults.videoSources.map((s, i) => (
                <source key={i} src={s.src} type={s.type} />
              ))}
            </video>
            <div
              ref={captionRef}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none text-center px-4"
            >
              <span className="font-mono font-bold text-sm uppercase tracking-[2px] text-white/70">
                Inside a GOAT Movers crew
              </span>
              <span className="font-sans font-semibold text-2xl lg:text-3xl text-white">
                850+ five-star moves and counting
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: original boxed video (no pin) */}
      <div className="lg:hidden px-4 pt-8">
        <div className="max-w-[1408px] mx-auto">
          <div className="relative w-full h-[240px] rounded-xl overflow-hidden">
            <video
              className="w-full h-full object-cover"
              poster={defaults.videoPoster}
              controls
              playsInline
              preload="metadata"
              muted
            >
              {defaults.videoSources.map((s, i) => (
                <source key={i} src={s.src} type={s.type} />
              ))}
            </video>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pt-8 lg:pt-16 pb-[60px] lg:pb-[100px]">
        <div className="max-w-[1408px] mx-auto">
          <div ref={statsRef} className="flex flex-col lg:flex-row gap-4 lg:gap-5">
            {defaultStats.map((stat) => (
              <div
                key={stat.label}
                className="about-stat flex items-center gap-4 lg:gap-6 lg:flex-1 group/stat"
              >
                <div className="bg-[#181818] rounded-lg w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center shrink-0 shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)] group-hover/stat:bg-[#1e1e1e] group-hover/stat:shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover/stat:scale-105 transition-all duration-300 ease-out">
                  <Image src={stat.icon} alt="" width={36} height={36} className="w-6 h-6 lg:w-9 lg:h-9" />
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className="about-stat-value font-sans font-bold text-2xl lg:text-[32px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.96px] text-white"
                    data-value={stat.value}
                  >
                    {stat.value.replace(/\d/g, "0")}
                  </span>
                  <span className="font-sans font-normal text-lg lg:text-xl leading-[1.4] tracking-[-0.54px] lg:tracking-[-0.6px] text-white/60">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
