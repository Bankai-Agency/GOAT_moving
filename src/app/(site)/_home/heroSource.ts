/**
 * Hero clip tiers.
 *
 * The scroll-scrubbed hero is an enhancement, never a blocker: the poster
 * image and the phrase reveal work without any video. Which clip (if any)
 * a visitor gets is decided once per page view from cheap signals, and the
 * hero effect can still step down at runtime when the clip is late or the
 * device seeks too slowly.
 *
 *   static  poster only, shorter pin. Reduced motion, data saver, a weak
 *           device (deviceMemory <= 2 or <= 2 cores).
 *   light   a small clip that loads within a few seconds on a slow 4G
 *           link (~1.6 Mbit/s): the phone cut on every phone and tablet
 *           (<= 991px), the 640x360 clip on a desktop that reports a
 *           2G/3G connection. The phone cut is a 4:5 crop (576x720) shown
 *           as a full-width band at the top of the screen, not a
 *           full-bleed portrait slice: the source is 1280x720, and a
 *           slice narrow enough to fill a phone screen was 404 px wide,
 *           stretched 3x and cutting the truck in half.
 *   full    the 1280x720 desktop clip, the original H.264 file. HEVC and
 *           AV1 twins were tried and dropped: at this keyframe density a
 *           re-encode that holds VMAF 96 against the original weighs
 *           3.9-4.2 MB next to the original's 4.4 MB, and the lighter
 *           ones (2.1 MB, VMAF 93) were visibly softer in a frame-by-
 *           frame scrub, where every frame stands still on screen.
 *
 * The same decision runs twice on purpose: `HERO_SOURCE_SCRIPT` is inlined
 * right after the <video> so the download starts while the HTML is still
 * parsing (hydration lands seconds later on a phone), and `chooseHeroSource`
 * repeats it from React for client-side navigation, where inline scripts do
 * not execute. Keep the two in sync.
 */

export type HeroTier = "static" | "light" | "full";
export type HeroCodec = "h264";

export type HeroChoice = {
  tier: HeroTier;
  /** Clip to load, null for the static tier. */
  src: string | null;
  /** Load the clip as one blob instead of pointing the <video> at the
      URL. Phones only: iOS Safari does not buffer a clip that is not
      playing, so a scrub that waits for buffered data never moved there;
      a blob is all in memory and every seek is local. */
  viaBlob: boolean;
  poster: string;
  codec: HeroCodec | null;
  /** Why this tier was picked (reported to analytics). */
  reason: string;
};

export const HERO_SOURCES = {
  portrait: "/videos/hero-phone.mp4",
  lite: "/videos/hero-lite.mp4",
  h264: "/videos/hero.mp4",
} as const;

export const HERO_POSTERS = {
  landscape: "/frames-vhero/frame_0001.webp",
  portrait: "/frames-vhero/frame_0001-phone.webp",
} as const;

export const MOBILE_QUERY = "(max-width: 991px)";

type NavigatorSignals = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

function baseTier(): { tier: HeroTier; reason: string } {
  const nav = navigator as NavigatorSignals;
  const conn = nav.connection;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { tier: "static", reason: "reduced-motion" };
  }
  if (conn && conn.saveData) return { tier: "static", reason: "save-data" };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) {
    return { tier: "static", reason: "low-memory" };
  }
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) {
    return { tier: "static", reason: "few-cores" };
  }
  if (window.matchMedia(MOBILE_QUERY).matches) return { tier: "light", reason: "mobile" };
  if (conn && /^(slow-)?2g$|^3g$/.test(conn.effectiveType ?? "")) {
    return { tier: "light", reason: "slow-network" };
  }
  return { tier: "full", reason: "desktop" };
}

/** Same decision as the inline script, for client-side navigation. */
export async function chooseHeroSource(): Promise<HeroChoice> {
  const base = baseTier();
  if (base.tier === "static") {
    return { tier: "static", src: null, viaBlob: false, poster: HERO_POSTERS.landscape, codec: null, reason: base.reason };
  }
  if (base.tier === "light") {
    const mobile = base.reason === "mobile";
    return {
      tier: "light",
      src: mobile ? HERO_SOURCES.portrait : HERO_SOURCES.lite,
      viaBlob: mobile,
      poster: mobile ? HERO_POSTERS.portrait : HERO_POSTERS.landscape,
      codec: "h264",
      reason: base.reason,
    };
  }
  return {
    tier: "full",
    src: HERO_SOURCES.h264,
    viaBlob: false,
    poster: HERO_POSTERS.landscape,
    codec: "h264",
    reason: base.reason,
  };
}

/** Writes the choice onto the DOM: tier attribute (CSS reads it for the
    pin height and to hide the video on the static tier), poster, src. */
export function applyHeroChoice(wrapper: HTMLElement, video: HTMLVideoElement, choice: HeroChoice) {
  wrapper.dataset.heroTier = choice.tier;
  wrapper.dataset.heroReason = choice.reason;
  if (choice.codec) wrapper.dataset.heroCodec = choice.codec;
  if (choice.src) wrapper.dataset.heroSrc = choice.src;
  if (choice.viaBlob) wrapper.dataset.heroBlob = "1";
  video.poster = choice.poster;
  if (choice.src && !choice.viaBlob) video.src = choice.src;
}

type HeroClipWindow = Window & { __heroClip?: { url: string; blob: Promise<Blob> } };

/** The clip as a blob: the download the inline script already started for
    this URL, or a new one. */
export function fetchHeroBlob(url: string): Promise<Blob> {
  const pre = (window as HeroClipWindow).__heroClip;
  if (pre && pre.url === url) return pre.blob;
  return fetch(url).then((r) => {
    if (!r.ok) throw new Error(`hero clip ${r.status}`);
    return r.blob();
  });
}

/** Reads a choice the inline script already made, if any. */
export function readHeroChoice(wrapper: HTMLElement, video: HTMLVideoElement): HeroChoice | null {
  const tier = wrapper.dataset.heroTier as HeroTier | undefined;
  if (!tier) return null;
  const src = wrapper.dataset.heroSrc ?? null;
  if (tier !== "static" && !src) return null;
  return {
    tier,
    src,
    viaBlob: wrapper.dataset.heroBlob === "1",
    poster: video.poster,
    codec: (wrapper.dataset.heroCodec as HeroCodec | undefined) ?? (src ? "h264" : null),
    reason: wrapper.dataset.heroReason ?? "inline",
  };
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/** Hero field data for GTM/GA4: which tier was served and how it behaved. */
export function pushHeroEvent(event: string, data: Record<string, unknown>) {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

/* The pre-hydration copy of the decision above. Plain ES2017 on purpose:
   this string is not transpiled. It waits for the first rendering frame
   (stylesheets are in by then, so the clip does not compete with the CSS
   and fonts the first paint needs); a 1.5 s timer covers a tab that never
   gets a frame. */
export const HERO_SOURCE_SCRIPT = `(function(){
var w=document.querySelector('[data-hero-region]'),v=document.getElementById('hero-video');
if(!w||!v)return;
var S=${JSON.stringify(HERO_SOURCES)},P=${JSON.stringify(HERO_POSTERS)},done=false;
function apply(tier,reason,src,poster,codec,blob){
  w.setAttribute('data-hero-tier',tier);w.setAttribute('data-hero-reason',reason);
  if(codec)w.setAttribute('data-hero-codec',codec);
  if(poster)v.setAttribute('poster',poster);
  if(src)w.setAttribute('data-hero-src',src);
  if(src&&blob){
    w.setAttribute('data-hero-blob','1');
    try{var b=fetch(src).then(function(r){if(!r.ok)throw new Error('hero clip '+r.status);return r.blob();});b.catch(function(){});window.__heroClip={url:src,blob:b};}catch(e){}
  }else if(src)v.src=src;
}
function set(){
  if(done||v.getAttribute('src')||w.getAttribute('data-hero-tier'))return;done=true;
  var n=navigator,c=n.connection||{},mm=function(q){return window.matchMedia&&window.matchMedia(q).matches;};
  if(mm('(prefers-reduced-motion: reduce)'))return apply('static','reduced-motion',null,null,null);
  if(c.saveData)return apply('static','save-data',null,null,null);
  if(typeof n.deviceMemory==='number'&&n.deviceMemory<=2)return apply('static','low-memory',null,null,null);
  if(typeof n.hardwareConcurrency==='number'&&n.hardwareConcurrency<=2)return apply('static','few-cores',null,null,null);
  if(mm(${JSON.stringify(MOBILE_QUERY)}))return apply('light','mobile',S.portrait,P.portrait,'h264',true);
  if(/^(slow-)?2g$|^3g$/.test(c.effectiveType||''))return apply('light','slow-network',S.lite,P.landscape,'h264');
  apply('full','desktop',S.h264,P.landscape,'h264');
}
window.requestAnimationFrame(set);setTimeout(set,1500);
})();`;
