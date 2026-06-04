import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* Full LP1 styles stack — same order as lp1/page.tsx. */
import "../../../../(lp)/lp1/styles/_tokens.css";
import "../../../../(lp)/lp1/styles/accent.css";
import "../../../../(lp)/lp1/styles/mega-nav.css";
import "../../../../(lp)/lp1/styles/lp-theme.css";
import "../../../../(lp)/lp1/styles/_hero.css";
import "../../../../(lp)/lp1/styles/_services.css";
import "../../../../(lp)/lp1/styles/_solution.css";
import "../../../../(lp)/lp1/styles/_service-area.css";
import "../../../../(lp)/lp1/styles/_faq.css";
import "../../../../(lp)/lp1/styles/_cta.css";
import "../../../../(lp)/lp1/styles/_about.css";
import "../../../../(lp)/lp1/styles/_process.css";
import "../../../../(lp)/lp1/styles/_reviews.css";
import "../../../../(lp)/lp1/styles/_footer.css";
import "../../../../(lp)/lp1/styles/_dark-zone.css";

import { SECTION_LIST, type SectionId } from "../../sectionList";
import { PreviewBody } from "./PreviewBody";

export const metadata: Metadata = {
  title: "DS2 — Preview",
  robots: { index: false, follow: false },
};

const VALID_IDS = new Set(SECTION_LIST.map((s) => s.id));

type Params = Promise<{ section: string }>;
type Search = Promise<{ theme?: string }>;

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { section } = await params;
  const { theme: themeParam } = await searchParams;

  if (!VALID_IDS.has(section as SectionId)) {
    notFound();
  }

  const theme: "light" | "dark" = themeParam === "dark" ? "dark" : "light";

  return <PreviewBody section={section as SectionId} theme={theme} />;
}
