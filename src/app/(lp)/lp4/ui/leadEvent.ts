/* Single source of truth for the lead-conversion analytics event.
   Both the embedded StepQuoteForm and the popup QuoteModal call this on
   a successful submit, so GTM/GA4 receive ONE consistent event with
   stable parameters — instead of auto-tracking random per-render form
   field ids (the old "random form params" problem). Configure a custom
   "generate_lead" trigger in GTM off this dataLayer event. */

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function pushLeadEvent(params: {
  /** Which form produced the lead: "embedded_hero" | "modal" | … */
  formLocation: string;
  /** City slug/name when known (LP context). */
  city?: string;
}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "generate_lead",
    form_location: params.formLocation,
    city: params.city ?? "",
  });
}
