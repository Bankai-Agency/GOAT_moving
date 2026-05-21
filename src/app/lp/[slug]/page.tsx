import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLandingPage } from "../_shared/CityLandingPage";
import { cityLPs } from "../_shared/cityConfigs";
/* Adopt the mainpage-5 visual system on LPs: white bg + #0066ff
   accent + ink (#001f4d) typography. `theme-light` (in globals.css)
   flips the original dark surfaces and yellow accents; mainpage-5's
   accent.css bumps the blue from #005BFF → #0066ff; lp-theme.css
   covers LP-specific gaps (hero "dark island", ink colour). */
import "@/app/mainpage-5/accent.css";
import "@/app/mainpage-5/mega-nav.css";
import "../_shared/lp-theme.css";

type Params = { slug: string };

/** Pre-render every city at build time. */
export function generateStaticParams() {
  return cityLPs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = cityLPs.find((c) => c.slug === slug);
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function CityLPPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const config = cityLPs.find((c) => c.slug === slug);
  if (!config) notFound();
  return (
    <div
      data-accent="blue"
      data-lp-root=""
      className="theme-light bg-[#ffffff] min-h-screen"
    >
      <CityLandingPage config={config} />
    </div>
  );
}
