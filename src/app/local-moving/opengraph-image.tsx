import { renderOGImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/ogImage";

export const alt = "Local Movers in Vancouver, WA & Portland, OR — $125/hr";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return renderOGImage({
    eyebrow: "Local Moving",
    title: "$125/hr Flat Rate",
    subtitle: "No hidden fees. Vancouver, WA & Portland, OR.",
  });
}
