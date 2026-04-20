import { renderOGImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/ogImage";

export const alt = "Professional Packers & Labor-Only Movers";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return renderOGImage({
    eyebrow: "Packing & Labor",
    title: "Pack · Load · Protect",
    subtitle: "Fragile specialists. PODS & U-Haul loading available.",
  });
}
