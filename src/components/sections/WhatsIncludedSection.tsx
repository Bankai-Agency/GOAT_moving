"use client";

import React, { useState } from "react";

function IncludedCard({ item, index }: { item: { icon: React.ReactNode; title: string; description: string }; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  // Different delays/positions per card so the blobs don't move in sync
  const a = index % 3;
  const b = index % 5;
  const c = (index + 2) % 4;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-xl lg:rounded-2xl min-h-[180px] lg:min-h-[280px] overflow-hidden bg-[#181818]"
    >
      {/* Animated yellow glow blobs — always floating, but hidden behind opaque layer until hover */}
      <div
        aria-hidden
        className="absolute top-[20%] left-[10%] w-48 h-48 lg:w-64 lg:h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,229,51,0.55) 0%, rgba(255,229,51,0) 70%)",
          filter: "blur(40px)",
          animation: "blob-float-a 6s ease-in-out infinite",
          animationDelay: `-${a * 1.5}s`,
          willChange: "transform",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-[5%] right-[10%] w-40 h-40 lg:w-56 lg:h-56 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,229,51,0.45) 0%, rgba(255,229,51,0) 70%)",
          filter: "blur(45px)",
          animation: "blob-float-b 5s ease-in-out infinite",
          animationDelay: `-${b * 1.1}s`,
          willChange: "transform",
        }}
      />
      <div
        aria-hidden
        className="absolute top-[40%] right-[25%] w-32 h-32 lg:w-44 lg:h-44 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,229,51,0.35) 0%, rgba(255,229,51,0) 70%)",
          filter: "blur(35px)",
          animation: "blob-float-c 7s ease-in-out infinite",
          animationDelay: `-${c * 1.3}s`,
          willChange: "transform",
        }}
      />

      {/* Default opaque layer → becomes frosted glass on hover, revealing the blobs through it */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-[background,backdrop-filter] duration-700 ease-out"
        style={{
          background: isHovered ? "rgba(24, 24, 24, 0.4)" : "rgba(24, 24, 24, 1)",
          backdropFilter: isHovered ? "blur(22px)" : "blur(0px)",
          WebkitBackdropFilter: isHovered ? "blur(22px)" : "blur(0px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col justify-between gap-8 lg:gap-0">
        {/* Top row: title left, icon right */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-sans font-bold text-xl lg:text-[26px] leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.78px] text-white whitespace-pre-line">
            {item.title}
          </h3>
          <div
            className="shrink-0 transition-opacity duration-500"
            style={{ opacity: isHovered ? 0.9 : 0.55 }}
          >
            {item.icon}
          </div>
        </div>

        {/* Bottom: description */}
        <p className="font-sans font-normal text-[15px] lg:text-base leading-[1.5] tracking-[-0.48px] text-white/60">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export type IncludedItem = { icon: React.ReactNode; title: string; description: string };

export const defaultIncludedItems: IncludedItem[] = [
  {
    icon: (
      <svg width="60" height="40" viewBox="10 90 500 330" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="m72.078 341.333h-50.744a32 32 0 0 0 32 32h5.6a58.374 58.374 0 0 1 13.144-32z" />
        <path d="m320 341.333h-157.411a58.374 58.374 0 0 1 13.142 32h144.269a10.667 10.667 0 0 0 10.667-10.667v-10.666a10.667 10.667 0 0 0 -10.667-10.667z" />
        <circle cx="117.334" cy="378.667" r="37.333" />
        <path d="m507.219 275.173-40.985-90.163a42.749 42.749 0 0 0 -38.834-25.01h-64.733a10.667 10.667 0 0 0 -10.667 10.667v167.817a58.588 58.588 0 0 1 101.064 34.849h26.936a32 32 0 0 0 32-32v-44.091a53.32 53.32 0 0 0 -4.781-22.069zm-48.633-8.507h-69.253a10.667 10.667 0 0 1 -10.666-10.666v-42.667a10.667 10.667 0 0 1 10.667-10.667h42.991a21.333 21.333 0 0 1 19.421 12.5l16.554 36.42a10.667 10.667 0 0 1 -9.714 15.081z" />
        <circle cx="394.667" cy="378.667" r="37.333" />
        <path d="m298.667 96h-245.334a32 32 0 0 0 -32 32v128h-10.1c-5.308 0-10.233 3.63-11.087 8.875a10.675 10.675 0 0 0 10.521 12.459h26.1c5.314 0 10.238 3.63 11.092 8.875a10.675 10.675 0 0 1 -10.521 12.459h-26.1c-5.313-.001-10.238 3.632-11.092 8.873a10.675 10.675 0 0 0 10.521 12.459h309.333a10.667 10.667 0 0 0 10.667-10.667v-181.333a32 32 0 0 0 -32-32z" />
      </svg>
    ),
    title: "Moving Truck & Fuel",
    description: "Full-size moving truck included. No mileage charges within your local area.",
  },
  {
    icon: (
      <svg width="60" height="32" viewBox="0 5.5 24 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0020 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" fill="white"/>
      </svg>
    ),
    title: "Professional Movers",
    description: "Trained crew. Careful with your belongings from start to finish.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="m30 15.5c0 .828-.672 1.5-1.5 1.5h-25c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5h.673c.658-3.904 3.203-7.162 6.666-8.818l.306 3.14c.04.412.399.722.819.674.412-.04.714-.406.674-.818l-.521-5.354c-.044-.447.307-.824.746-.824h6.273c.439 0 .79.377.747.823l-.521 5.354c-.04.412.262.778.674.818.025.004.049.005.073.005.381 0 .708-.29.746-.678l.306-3.14c3.463 1.655 6.008 4.913 6.666 8.818h.673c.828 0 1.5.672 1.5 1.5z" />
        <path d="m29.5 21h-1.5c0-1.103-.897-2-2-2h-20c-1.103 0-2 .897-2 2h-1.5c-.276 0-.5.224-.5.5v2c0 .276.224.5.5.5h1.5v2c0 .266.105.52.293.707l2 2c.187.188.442.293.707.293h6c.334 0 .646-.167.832-.445.742-1.111 1.718-2.236 2.168-2.516.45.279 1.426 1.404 2.168 2.516.186.278.498.445.832.445h6c.265 0 .52-.105.707-.293l2-2c.188-.187.293-.441.293-.707v-2h1.5c.276 0 .5-.224.5-.5v-2c0-.276-.224-.5-.5-.5zm-3.5 4.586-1.414 1.414h-5.058c-1.024-1.459-2.377-3-3.528-3s-2.504 1.541-3.528 3h-5.058l-1.414-1.414-.001-4.586h20.001z" />
      </svg>
    ),
    title: "Equipment",
    description: "Dollies, furniture blankets, straps, and tools — all included.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M481.429,332.892c-26.337-26.357-62.882-37.523-109.815-24.945L204.256,140.419l2.212-8.364c9.639-36.166-0.776-75.041-27.172-101.437C152.42,3.721,114.212-6.148,78.077,3.778c-5.153,1.415-9.164,5.464-10.529,10.631c-1.365,5.167,0.132,10.659,3.909,14.438l40.297,40.297c11.781,11.81,11.666,30.724,0.029,42.392c-11.545,11.576-30.951,11.558-42.45,0.029L29.028,71.257c-3.779-3.781-9.287-5.264-14.454-3.891c-5.168,1.372-9.202,5.393-10.612,10.551c-9.781,35.738-0.159,74.183,26.846,101.188c26.326,26.345,62.825,37.551,109.786,24.946l167.371,167.528c-12.49,46.919-1.716,83.11,24.975,109.801c26.91,26.93,65.136,36.726,101.192,26.833c5.154-1.414,9.166-5.464,10.532-10.631c1.366-5.167-0.13-10.66-3.909-14.44l-40.288-40.288c-11.781-11.81-11.666-30.726-0.029-42.392c11.689-11.629,31.052-11.444,42.45-0.015l40.308,40.297c3.779,3.779,9.287,5.262,14.453,3.889c5.167-1.373,9.201-5.392,10.611-10.549C518.041,398.352,508.421,359.897,481.429,332.892z" />
        <path d="M160.551,266.584L17.559,409.594c-23.401,23.401-23.401,61.455,0,84.855c23.401,23.401,61.455,23.401,84.855,0l142.989-143.006L160.551,266.584z M88.322,447.898c-5.86,5.86-15.35,5.86-21.21,0c-5.859-5.859-5.859-15.351,0-21.21l90.98-90.997c5.859-5.859,15.352-5.859,21.21,0c5.859,5.859,5.859,15.351,0,21.21L88.322,447.898z" />
        <path d="M507.596,30.253L481.737,4.394c-4.867-4.867-12.42-5.797-18.322-2.258l-79.547,47.723c-8.37,5.021-9.791,16.568-2.891,23.469l6.332,6.33l-100.98,100.567l42.435,42.435l100.98-100.567l8.919,8.921c6.901,6.899,18.449,5.479,23.469-2.891l47.723-79.547C513.393,42.673,512.463,35.12,507.596,30.253z" />
      </svg>
    ),
    title: "Furniture Disassembly/\nReassembly",
    description: "Bed frames and basic furniture taken apart and put back together at no extra cost.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="white"/>
      </svg>
    ),
    title: "Floor & Door Protection",
    description: "We protect your floors and doorframes during the move.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 511.734 511.734" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M410.534,151.467h2.133l29.867-29.867l-29.867-29.867l-32,32c-30.387-20.811-65.688-33.313-102.4-36.267v-44.8h42.667V0h-128v42.667H235.6v44.8c-36.712,2.954-72.013,15.456-102.4,36.267l-32-32L71.334,121.6l29.867,29.867c-81.149,85.42-77.686,220.451,7.734,301.6s220.451,77.687,301.6-7.734C488.756,362.994,488.756,233.806,410.534,151.467z M256.934,469.333c-94.257,0-170.667-76.41-170.667-170.667S162.677,128,256.934,128S427.6,204.41,427.6,298.667S351.19,469.333,256.934,469.333z" />
        <path d="M256.934,149.333c-82.475,0-149.333,66.859-149.333,149.333S174.459,448,256.934,448s149.333-66.859,149.333-149.333S339.408,149.333,256.934,149.333z M276.134,315.733c-10.015,10.015-26.252,10.015-36.267,0s-10.015-26.252,0-36.267l102.4-66.133L276.134,315.733z" />
      </svg>
    ),
    title: "Same-Day Service",
    description: "Most local moves completed in one visit — no waiting for a second trip.",
  },
];

export function WhatsIncludedSection({
  label = "What's Included",
  title = "What's Included in Every Local Move",
  subtitle = "One hourly rate — everything covered",
  items: itemsProp,
  columns = "auto",
}: {
  label?: string;
  title?: string;
  subtitle?: string;
  items?: IncludedItem[];
  /** "auto" (default): 3 on lg · "2": always 2 on lg (better for 4-item blocks). */
  columns?: "auto" | "2";
} = {}) {
  const data = itemsProp ?? defaultIncludedItems;
  const gridCols =
    columns === "2"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
              {title}
            </h2>
            <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] text-white/60 max-w-[600px]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className={`grid ${gridCols} gap-4 lg:gap-5`}>
          {data.map((item, i) => (
            <IncludedCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
