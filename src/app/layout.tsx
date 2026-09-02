import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { NavProgress } from "@/components/NavProgress";
import { ScrollReset } from "@/components/ScrollReset";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";
import { ShutterTransition } from "@/components/ShutterTransition";
import { Preloader } from "@/components/Preloader";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thegoatmovers.net"),
  title: {
    default: "Movers in Vancouver, WA & Portland, OR | $125/hr — GOAT Movers",
    template: "%s | GOAT Movers",
  },
  description:
    "Licensed & insured movers across Vancouver, WA, Portland, OR, and the I-5 corridor. Flat $125/hr local moving plus long-distance, commercial & packing. 850+ 5-star reviews.",
  keywords: [
    "movers Vancouver WA",
    "movers Portland OR",
    "local moving company",
    "long distance movers",
    "commercial movers",
    "packing services",
    "I-5 corridor movers",
    "GOAT Movers",
  ],
  openGraph: {
    siteName: "GOAT Movers",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  /* Populate via env var: NEXT_PUBLIC_GSC_VERIFICATION=<code from Search Console>.
     When unset, the meta tag is simply omitted. */
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* GTM noscript fallback — must be the first element in <body>. */}
        <GoogleTagManagerNoScript />
        {/* Pre-hydration: decide whether the logo-reveal preloader runs.
            Runs once per session and never on the LP funnel — by adding a
            `.preloaded` class to <html> BEFORE paint (so repeat visits / LP
            never flash the loader). The Preloader reads that class. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var k='goat_preloaded',p=location.pathname,lp=p.indexOf('/lp')===0||p==='/thank-you'||p.indexOf('/admin')===0,h=document.documentElement;if(lp){h.classList.add('preloaded');return;}if(sessionStorage.getItem(k)){h.classList.add('preloaded');}else{sessionStorage.setItem(k,'1');}}catch(e){}})();",
          }}
        />
        <Preloader />
        <ScrollReset />
        <NavProgress />
        <ShutterTransition />
        {children}
        {/* GTM loader. GA4 + Google Ads conversions are configured inside
            the container, so there is no separate gtag loader. */}
        <GoogleTagManager />
      </body>
    </html>
  );
}

