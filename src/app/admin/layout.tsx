import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Admin — GOAT Movers",
    template: "%s · Admin — GOAT Movers",
  },
  description: "Панель управления контентом сайта",
  robots: { index: false, follow: false },
};

/**
 * Admin route layout. The public site's root layout still wraps us (fonts,
 * globals.css) — the site-specific chrome (preloader, page-transition wipe,
 * nav progress bar) bails out on /admin paths itself.
 *
 * `data-theme` is applied BEFORE first paint by the inline script so a
 * light-theme user never sees a dark flash. `suppressHydrationWarning`
 * covers the attribute the script may have changed.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-admin="" data-theme="dark" suppressHydrationWarning>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var t=localStorage.getItem('goat-admin-theme');if(t==='light'||t==='dark'){var el=document.currentScript.parentElement;if(el)el.setAttribute('data-theme',t);}}catch(e){}})();",
        }}
      />
      {children}
    </div>
  );
}
