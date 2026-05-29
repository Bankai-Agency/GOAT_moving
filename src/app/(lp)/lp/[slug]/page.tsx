import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLandingPage } from "../../lp4/CityLandingPage";
import { cityLPs, findCityBySlug } from "../../lp4/config/cities";

/* Production city LPs now render the lp4 design system (dark theme,
   yellow accent). Slugs are the short city form (`/lp/portland`,
   `/lp/vancouver-wa`). Style stack + wrapper mirror `/lp4/page.tsx`:
   - `.theme-light[data-lp-root]` selectors were sed-replaced to
     `[data-lp-root]` in lp4's CSS, so LP rules fire WITHOUT theme-light.
   - No `data-accent` on the wrapper — accent.css's
     `body:has([data-accent="blue"])` cascade would flip native yellow
     Tailwind classes to blue; omitting it lets the yellow render. */
import "../../lp4/styles/_tokens.css";
import "../../lp4/styles/accent.css";
import "../../lp4/styles/mega-nav.css";
import "../../lp4/styles/lp-theme.css";
import "../../lp4/styles/_hero.css";
import "../../lp4/styles/_services.css";
import "../../lp4/styles/_solution.css";
import "../../lp4/styles/_service-area.css";
import "../../lp4/styles/_faq.css";
import "../../lp4/styles/_cta.css";
import "../../lp4/styles/_about.css";
import "../../lp4/styles/_process.css";
import "../../lp4/styles/_reviews.css";
import "../../lp4/styles/_footer.css";
import "../../lp4/styles/_dark-zone.css";
import "../../lp4/styles/_lp2-invert.css";

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
  const config = findCityBySlug(slug);
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
  const config = findCityBySlug(slug);
  if (!config) notFound();
  return (
    <div data-lp-root="" className="lp2-dark bg-[#0c0c0c] min-h-screen">
      <CityLandingPage config={config} />
    </div>
  );
}
