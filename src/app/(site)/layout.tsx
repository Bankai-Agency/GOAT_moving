import "@site/styles/_tokens.css";
import "@site/styles/mega-nav.css";
import "@site/styles/_mp5-btn.css";
import "@site/styles/mega-nav-dark.css";
import "@site/styles/footer-faq.css";
import "@site/styles/typography.css";
import "@site/styles/_page-gradient.css";
import { TerminalNav } from "@site/layout/TerminalNav";

/* Shared chrome for every corp page under (site)/.

   The wrapper carries BOTH `data-accent="blue"` and `mp5-dark`:
     • `data-accent="blue"` activates the `_tokens.css` vars and the
       `_mp5-btn.css` button rules (scoped `body:has([data-accent="blue"])`).
     • `mp5-dark` activates `mega-nav-dark.css` (the dark dropdown plate).

   It deliberately does NOT import the home's page-specific overrides
   (accent.css / sticky-steps.css / _mp5-dark.css) — the corp site is
   already dark+yellow via globals.css :root, so it needs only the chrome
   + buttons, not the full mainpage-5 inversion layer.

   TerminalNav renders here (outside each page's `.page-zoom`) so it sits
   at 1:1 scale and its `position: fixed` behaves identically on every
   page, including the home. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-accent="blue" className="mp5-dark">
      <TerminalNav />
      {children}
    </div>
  );
}
