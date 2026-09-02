/**
 * Phone number helpers. The site stores ONE number in `site.json` (E.164,
 * e.g. "+13605240846"); every visible format is derived from it so changing
 * the number in the admin updates the whole site at once.
 */

export type PhoneStyle = "dashed" | "paren" | "short" | "parenShort";

function digitsOf(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** `tel:` href — always the bare E.164 form. */
export function phoneHref(raw: string): string {
  const d = digitsOf(raw);
  return `tel:+${d}`;
}

/**
 * Format a North-American number for display.
 *  - dashed:     +1 360-524-0846   (nav, footer)
 *  - paren:      +1 (360) 524-0846 (hero buttons, contacts card)
 *  - short:      360-524-0846      (mobile pills)
 *  - parenShort: (360) 524-0846    (meta titles)
 * Numbers that are not 10/11 digits are returned as typed.
 */
export function formatPhone(raw: string, style: PhoneStyle = "dashed"): string {
  const d = digitsOf(raw);
  if (d.length !== 10 && d.length !== 11) return raw;
  const cc = d.length === 11 ? d[0] : "1";
  const n = d.slice(-10);
  const a = n.slice(0, 3);
  const b = n.slice(3, 6);
  const c = n.slice(6);
  switch (style) {
    case "paren":
      return `+${cc} (${a}) ${b}-${c}`;
    case "short":
      return `${a}-${b}-${c}`;
    case "parenShort":
      return `(${a}) ${b}-${c}`;
    default:
      return `+${cc} ${a}-${b}-${c}`;
  }
}

/** Schema.org style: "+1-360-524-0846". */
export function phoneSchema(raw: string): string {
  const d = digitsOf(raw);
  if (d.length !== 10 && d.length !== 11) return raw;
  const cc = d.length === 11 ? d[0] : "1";
  const n = d.slice(-10);
  return `+${cc}-${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}`;
}
