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
 *           link (~1.6 Mbit/s): the portrait cut on every phone and
 *           tablet (<= 991px), the 640x360 clip on a desktop that reports
 *           a 2G/3G connection.
 *   full    the 1280x720 desktop clip: AV1 when the browser decodes it in
 *           hardware, HEVC where the browser plays it (Safari, hardware),
 *           H.264 otherwise.
 *
 * The same decision runs twice on purpose: `HERO_SOURCE_SCRIPT` is inlined
 * right after the <video> so the download starts while the HTML is still
 * parsing (hydration lands seconds later on a phone), and `chooseHeroSource`
 * repeats it from React for client-side navigation, where inline scripts do
 * not execute. Keep the two in sync.
 */

export type HeroTier = "static" | "light" | "full";
export type HeroCodec = "h264" | "hevc" | "av1";

export type HeroChoice = {
  tier: HeroTier;
  /** Clip to load, null for the static tier. */
  src: string | null;
  poster: string;
  codec: HeroCodec | null;
  /** Why this tier was picked (reported to analytics). */
  reason: string;
};

export const HERO_SOURCES = {
  portrait: "/videos/hero-portrait.mp4",
  lite: "/videos/hero-lite.mp4",
  h264: "/videos/hero.mp4",
  hevc: "/videos/hero.hevc.mp4",
  av1: "/videos/hero.av1.mp4",
} as const;

export const HERO_POSTERS = {
  landscape: "/frames-vhero/frame_0001.webp",
  portrait: "/frames-vhero/frame_0001-portrait.webp",
} as const;

export const MOBILE_QUERY = "(max-width: 991px)";

/* Probe for hardware AV1 decode. `powerEfficient` is the signal that the
   frames are decoded by the GPU; software AV1 seeks are too slow for a
   scrub on a laptop CPU. */
const AV1_PROBE: MediaDecodingConfiguration = {
  type: "file",
  video: {
    contentType: 'video/mp4; codecs="av01.0.05M.08"',
    width: 1280,
    height: 720,
    bitrate: 1_700_000,
    framerate: 24,
  },
};
const HEVC_TYPE = 'video/mp4; codecs="hvc1.1.6.L93.B0"';

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
export async function chooseHeroSource(video: HTMLVideoElement): Promise<HeroChoice> {
  const base = baseTier();
  if (base.tier === "static") {
    return { tier: "static", src: null, poster: HERO_POSTERS.landscape, codec: null, reason: base.reason };
  }
  if (base.tier === "light") {
    const mobile = base.reason === "mobile";
    return {
      tier: "light",
      src: mobile ? HERO_SOURCES.portrait : HERO_SOURCES.lite,
      poster: mobile ? HERO_POSTERS.portrait : HERO_POSTERS.landscape,
      codec: "h264",
      reason: base.reason,
    };
  }
  let codec: HeroCodec = "h264";
  try {
    const mc = navigator.mediaCapabilities;
    if (mc && mc.decodingInfo) {
      const info = await Promise.race([
        mc.decodingInfo(AV1_PROBE),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 300)),
      ]);
      if (info && info.supported && info.smooth && info.powerEfficient) codec = "av1";
    }
  } catch {
    /* no probe, fall through */
  }
  if (codec === "h264" && video.canPlayType(HEVC_TYPE) === "probably") codec = "hevc";
  return { tier: "full", src: HERO_SOURCES[codec], poster: HERO_POSTERS.landscape, codec, reason: base.reason };
}

/** Writes the choice onto the DOM: tier attribute (CSS reads it for the
    pin height and to hide the video on the static tier), poster, src. */
export function applyHeroChoice(wrapper: HTMLElement, video: HTMLVideoElement, choice: HeroChoice) {
  wrapper.dataset.heroTier = choice.tier;
  wrapper.dataset.heroReason = choice.reason;
  if (choice.codec) wrapper.dataset.heroCodec = choice.codec;
  video.poster = choice.poster;
  if (choice.src) video.src = choice.src;
}

/** Reads a choice the inline script already made, if any. */
export function readHeroChoice(wrapper: HTMLElement, video: HTMLVideoElement): HeroChoice | null {
  const tier = wrapper.dataset.heroTier as HeroTier | undefined;
  if (!tier) return null;
  const src = video.getAttribute("src");
  if (tier !== "static" && !src) return null;
  return {
    tier,
    src,
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
function apply(tier,reason,src,poster,codec){
  w.setAttribute('data-hero-tier',tier);w.setAttribute('data-hero-reason',reason);
  if(codec)w.setAttribute('data-hero-codec',codec);
  if(poster)v.setAttribute('poster',poster);
  if(src)v.src=src;
}
function set(){
  if(done||v.getAttribute('src')||w.getAttribute('data-hero-tier'))return;done=true;
  var n=navigator,c=n.connection||{},mm=function(q){return window.matchMedia&&window.matchMedia(q).matches;};
  if(mm('(prefers-reduced-motion: reduce)'))return apply('static','reduced-motion',null,null,null);
  if(c.saveData)return apply('static','save-data',null,null,null);
  if(typeof n.deviceMemory==='number'&&n.deviceMemory<=2)return apply('static','low-memory',null,null,null);
  if(typeof n.hardwareConcurrency==='number'&&n.hardwareConcurrency<=2)return apply('static','few-cores',null,null,null);
  if(mm(${JSON.stringify(MOBILE_QUERY)}))return apply('light','mobile',S.portrait,P.portrait,'h264');
  if(/^(slow-)?2g$|^3g$/.test(c.effectiveType||''))return apply('light','slow-network',S.lite,P.landscape,'h264');
  var hevc=v.canPlayType(${JSON.stringify(HEVC_TYPE)})==='probably',settled=false;
  function full(codec){if(settled)return;settled=true;apply('full','desktop',S[codec],P.landscape,codec);}
  var mc=n.mediaCapabilities;
  if(mc&&mc.decodingInfo){
    setTimeout(function(){full(hevc?'hevc':'h264');},300);
    mc.decodingInfo(${JSON.stringify(AV1_PROBE)}).then(function(i){full(i&&i.supported&&i.smooth&&i.powerEfficient?'av1':hevc?'hevc':'h264');},function(){full(hevc?'hevc':'h264');});
  }else full(hevc?'hevc':'h264');
}
window.requestAnimationFrame(set);setTimeout(set,1500);
})();`;
