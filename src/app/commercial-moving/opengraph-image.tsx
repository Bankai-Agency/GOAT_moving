import { renderOGImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/ogImage";

export const alt = "Office & Commercial Movers in Vancouver, WA & Portland, OR";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return renderOGImage({
    eyebrow: "Commercial Moving",
    title: "Office & Business",
    subtitle: "After-hours moves. Ready Monday morning.",
  });
}
