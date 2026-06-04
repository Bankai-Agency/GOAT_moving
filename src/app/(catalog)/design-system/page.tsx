import type { Metadata } from "next";
import { DesignSystemClient } from "./DesignSystemClient";

/* The LP theme is opt-in via `.theme-light[data-lp-root]` + `data-accent="blue"`
   on a wrapper div, but the rules live in these CSS files. Import them at the
   route level so LP sections inside the design-system page pick up the
   mainpage-5 visual language when the LP tab is active. */
import "../../(lp)/_shared/styles/accent.css";
import "../../(lp)/_shared/styles/mega-nav.css";
import "../../(lp)/_shared/styles/lp-theme.css";
/* Artifact-fix overrides for the Site / Light sub-tab.
   Lives next to the page so it only loads on /design-system. */
import "./site-light.css";

export const metadata: Metadata = {
  title: "Design System — GOAT Movers",
  description:
    "Internal catalog of every UI primitive, form piece, and page section used across the site and the city landing pages.",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return <DesignSystemClient />;
}
