import Image from "next/image";

/* Reproduces the Figma frame "MacBook Pro 16" — 4" (1728×1117) 1:1.
   - mono text (nav / name / CTA): Roboto Mono, letter-spacing -0.01em
   - headline: Roboto Condensed Black 900, line-height 164/140
   Positions match the frame-relative coordinates from the design. */

const NAV = ["обо мне", "кейсы", "контакты"];

export default function PortfolioPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black font-[family-name:var(--font-roboto-mono-pf)]">
      {/* Full-bleed background */}
      <Image
        src="/portfolio/hero-field.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Name — top-left, white fill + red outline */}
      <div
        className="absolute left-[78px] top-[30px] z-10 uppercase text-white whitespace-pre-line"
        style={{
          fontWeight: 500,
          fontSize: "17.14px",
          lineHeight: 1.319,
          letterSpacing: "-0.01em",
          WebkitTextStroke: "3.57px #E52935",
          paintOrder: "stroke fill",
        }}
      >
        {"дмитрий\nли-литвинов"}
      </div>

      {/* Nav — centered */}
      <nav className="absolute left-1/2 top-[27px] z-10 flex -translate-x-1/2 items-center gap-[19px]">
        {NAV.map((label) => (
          <button
            key={label}
            type="button"
            className="rounded-[8px] bg-black/5 px-[42px] py-[14px] uppercase text-black transition-colors hover:bg-black/10"
            style={{
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: 1.319,
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* CTA — top-right, yellow */}
      <button
        type="button"
        className="absolute right-[74px] top-[27px] z-10 rounded-[8px] bg-[#EAFF00] px-[42px] py-[14px] uppercase text-black transition-transform hover:-translate-y-px"
        style={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: 1.319,
          letterSpacing: "-0.01em",
        }}
      >
        связаться
      </button>

      {/* Headline */}
      <h1
        className="absolute left-1/2 top-[53.56%] z-10 -translate-x-1/2 text-center uppercase text-white font-[family-name:var(--font-roboto-condensed)]"
        style={{
          width: "min(1280px, 92vw)",
          fontWeight: 900,
          fontSize: "min(140px, 8.102vw)",
          lineHeight: 1.1718,
          letterSpacing: "-0.01em",
        }}
      >
        продуктовый
        <br />
        дизайнер
      </h1>
    </main>
  );
}
