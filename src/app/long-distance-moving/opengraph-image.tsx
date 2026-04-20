import { renderOGImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/ogImage";

export const alt = "Long Distance Movers from Vancouver, WA & Portland, OR";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return renderOGImage({
    eyebrow: "Long Distance",
    title: "Interstate Moves",
    subtitle: "USDOT #4232069 · Door-to-door · Fully insured.",
  });
}
