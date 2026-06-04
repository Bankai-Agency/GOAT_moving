"use client";

import { LPDemoFrame, renderSection } from "../../LPSectionRenderer";
import type { SectionId } from "../../sectionList";

export function PreviewBody({
  section,
  theme,
}: {
  section: SectionId;
  theme: "light" | "dark";
}) {
  return <LPDemoFrame theme={theme}>{renderSection(section)}</LPDemoFrame>;
}
