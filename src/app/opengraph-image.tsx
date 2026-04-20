import { renderOGImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/ogImage";

/* Default Open Graph / Twitter image for the whole site.
   Route-specific OG images live in per-route `opengraph-image.tsx` files. */

export const alt = "GOAT Movers — Licensed Movers in Vancouver, WA & Portland, OR";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return renderOGImage({
    title: "Top-Rated Movers",
    subtitle: "Vancouver, WA & Portland, OR · Licensed & insured.",
  });
}
