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
/**
 * How long after the window `load` event the container is fetched when the
 * visitor has not touched the page yet. The first pointer, key, touch,
 * wheel or scroll event loads it right away, whichever comes first.
 *
 * Why not simply `lazyOnload`: the container (GTM + two gtag loaders +
 * Clarity + CallRail) costs 3-4 s of main thread on a phone. Loaded right
 * after `load` it lands inside the window PageSpeed measures, and the page
 * is still hydrating, so every tap in those seconds waits behind it. Loaded
 * on the first interaction the tags are in place before anything a visitor
 * can do (a form needs a tap first), and the timer covers people who only
 * read. The trade-off: a visitor who leaves within ~3.5 s of load without
 * touching anything is not seen by GA4 / Clarity at all.
 */
const GTM_IDLE_DELAY_MS = 3500;

export function GoogleTagManager() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  // A plain inline script, not next/script: the listeners must exist from
  // the first parse so a very early tap still counts, and `dataLayer` must
  // exist before any form can push `generate_lead` into it.
  const loader = `(function(w,d,s,l,i,t){w[l]=w[l]||[];var done=false,
evs=['pointerdown','keydown','touchstart','wheel','scroll'],o={capture:true,passive:true};
function load(){if(done)return;done=true;evs.forEach(function(e){w.removeEventListener(e,load,o)});
w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;
f.parentNode.insertBefore(j,f)}
evs.forEach(function(e){w.addEventListener(e,load,o)});
function arm(){setTimeout(load,t)}
if(d.readyState==='complete')arm();else w.addEventListener('load',arm);
})(window,document,'script','dataLayer','${id}',${GTM_IDLE_DELAY_MS});`;

  return <script id="gtm-init" dangerouslySetInnerHTML={{ __html: loader }} />;
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
