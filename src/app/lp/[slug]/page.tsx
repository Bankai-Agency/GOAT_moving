import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLandingPage } from "../_shared/CityLandingPage";
import { cityLPs } from "../_shared/cityConfigs";

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
  return <CityLandingPage config={config} />;
}
