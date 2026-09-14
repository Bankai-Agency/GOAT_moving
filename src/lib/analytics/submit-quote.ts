/**
 * The one place a quote form talks to the server and to analytics.
 *
 * Every form on the site (embedded, modal, landing pages) posts the same
 * payload to /api/submit-quote. This helper does that post and, when the
 * server accepted the lead, pushes ONE `generate_lead` event into the GTM
 * dataLayer. GTM hangs the conversion tags on that event (GA4 "Send Form",
 * Google Ads conversion, enhanced conversions, the Google-Sheet log) instead
 * of scraping form fields by id and reading the text of a button - the old
 * way silently stopped working when the forms were rebuilt.
 *
 * `lead_email` / `lead_phone` / `lead_name` are for Google Ads enhanced
 * conversions (GTM's User-Provided Data variable reads them); the GA4 event
 * tag must NOT forward them as event parameters.
 */

export type QuotePayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
};

export type LeadMeta = {
  /** Which form produced the lead: "embedded_hero" | "modal" | "embedded_form". */
  formLocation: string;
  /** City slug or name when the page has one (city pages, landing pages). */
  city?: string;
};

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/** Push the conversion event. Exported for tests and for forms that submit elsewhere. */
export function pushLeadEvent(meta: LeadMeta, lead: QuotePayload = {}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "generate_lead",
    form_location: meta.formLocation,
    city: meta.city ?? "",
    lead_name: (lead.fullName ?? "").trim(),
    lead_email: (lead.email ?? "").trim().toLowerCase(),
    lead_phone: (lead.phone ?? "").replace(/[^\d+]/g, ""),
  });
}

/**
 * POST the quote and report the lead. Resolves to whether the server
 * accepted it; never throws, so a form can always move on to /thank-you.
 */
export async function submitQuote(values: QuotePayload, meta: LeadMeta): Promise<boolean> {
  let ok = false;
  try {
    const res = await fetch("/api/submit-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    ok = res.ok;
  } catch (err) {
    console.error("Submit failed:", err);
  }
  if (ok) pushLeadEvent(meta, values);
  return ok;
}
