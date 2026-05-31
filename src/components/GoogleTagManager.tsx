import Script from "next/script";

/**
 * Google Tag Manager loader — reads NEXT_PUBLIC_GTM_ID (e.g. "GTM-XXXXXXX").
 * When unset (local dev, preview without tracking), renders nothing.
 *
 * GA4 is configured INSIDE the GTM container (not via a standalone gtag
 * loader), so there is no separate GA4 script — GTM is the single source
 * of all tags (GA4, Google Ads conversions, pixels, etc.).
 *
 * Usage in app/layout.tsx:
 *   <body>
 *     <GoogleTagManagerNoScript />   ← must be the FIRST child of <body>
 *     ...
 *     <GoogleTagManager />           ← the <head> loader script
 *   </body>
 */
export function GoogleTagManager() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

/**
 * The <noscript> fallback iframe. Must render as the first child of <body>
 * so it works even when JavaScript is disabled.
 */
export function GoogleTagManagerNoScript() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
