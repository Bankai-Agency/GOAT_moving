import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { NavProgress } from "@/components/layout/NavProgress";
import { ScrollReset } from "@/components/layout/ScrollReset";
import { Analytics } from "@/components/seo/Analytics";
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
        <ScrollReset />
        <NavProgress />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

