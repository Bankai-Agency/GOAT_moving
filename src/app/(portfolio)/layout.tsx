import type { Metadata } from "next";
import { Roboto_Condensed, Roboto_Mono } from "next/font/google";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin", "cyrillic"],
  weight: ["900"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

const robotoMonoPortfolio = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-roboto-mono-pf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Дмитрий Ли-Литвинов — продуктовый дизайнер",
  description: "Портфолио продуктового дизайнера Дмитрия Ли-Литвинова.",
};

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${robotoCondensed.variable} ${robotoMonoPortfolio.variable}`}>
      {children}
    </div>
  );
}
