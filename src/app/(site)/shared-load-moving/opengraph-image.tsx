import { renderOGImage, OG_SIZE, OG_CONTENT_TYPE } from "@site/seo/ogImage";

export const alt = "Shared Load Moving from Vancouver, WA & Portland, OR";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return renderOGImage({
    eyebrow: "Shared Load",
    title: "Pay for the Space You Use",
    subtitle: "1,000+ miles · 7-14 day window · USDOT #4232069",
  });
}
