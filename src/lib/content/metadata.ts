import type { Metadata } from "next";
import type { Meta } from "./types";

/** Build the Next.js `metadata` object for a static page from content JSON. */
export function pageMetadata(meta: Meta, path: string): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: meta.ogTitle ?? meta.title,
      description: meta.ogDescription ?? meta.description,
      url: path,
      type: "website",
    },
  };
}
