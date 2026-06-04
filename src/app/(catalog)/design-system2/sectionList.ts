/* Plain (server-safe) section registry. Lives outside the
   "use client" boundary so server components (the preview route)
   can import the list + type without it being turned into a
   client-reference proxy. */

export type SectionId =
  | "primitives"
  | "nav"
  | "hero"
  | "services"
  | "solution"
  | "about"
  | "cta"
  | "process"
  | "reviews"
  | "lp-cta-form"
  | "service-area"
  | "faq"
  | "footer"
  | "touchbar";

export const SECTION_LIST: { id: SectionId; label: string; description: string }[] = [
  { id: "primitives", label: "Primitives", description: "Buttons, inputs, labels — atomic building blocks" },
  { id: "nav", label: "Floating Nav", description: "LPTerminalNav — pill-shaped header" },
  { id: "hero", label: "Hero", description: "Full-bleed photo + headline + quote form" },
  { id: "services", label: "Services", description: "4-card service grid with hover" },
  { id: "solution", label: "Our Solution", description: "WhatsIncluded cards with spotlight + halo" },
  { id: "about", label: "Social Proof", description: "Trust stats + video poster" },
  { id: "cta", label: "CTA Banner", description: "Photo-backed CTA with dark gradient" },
  { id: "process", label: "Process", description: "4-step process with cursor spotlight" },
  { id: "reviews", label: "Reviews", description: "Star rating + testimonials carousel" },
  { id: "lp-cta-form", label: "Lead-capture CTA", description: "Embedded quote form before footer" },
  { id: "service-area", label: "Service Area", description: "Neighborhood chips" },
  { id: "faq", label: "FAQ", description: "Accordion FAQ" },
  { id: "footer", label: "Footer", description: "ContactFooter — blue island with form" },
  { id: "touchbar", label: "Touchbar (mobile)", description: "Sticky mobile bottom CTA" },
];
