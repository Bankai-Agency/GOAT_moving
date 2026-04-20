/**
 * Render one or more Schema.org JSON-LD payloads as a <script> tag.
 * Server component — no client JS shipped.
 */

type JsonLdValue = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          /* JSON.stringify produces safe escaping; no user input interpolated here. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
