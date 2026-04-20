import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationPage } from "../_locations/LocationPage";
import { locationConfigs } from "../_locations/locationConfigs";
import { JsonLd } from "@/components/seo/JsonLd";
import { cityPageSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo/schema";

type Params = { city: string };

/** Pre-render every city at build time. */
export function generateStaticParams() {
  return locationConfigs.map((c) => ({ city: c.slug }));
}

/** Ensure Next.js doesn't try to render unknown slugs as static pages. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city } = await params;
  const config = locationConfigs.find((c) => c.slug === city);
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: { canonical: `/${config.slug}` },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `/${config.slug}`,
      type: "website",
    },
  };
}

export default async function CityLocationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city } = await params;
  const config = locationConfigs.find((c) => c.slug === city);
  if (!config) notFound();

  const schemas = [
    ...cityPageSchema({
      city: config.city,
      state: config.state,
      slug: config.slug,
      description: config.metaDescription,
    }),
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: `${config.city}, ${config.state}`, url: `${SITE_URL}/${config.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <LocationPage config={config} />
    </>
  );
}
