/**
 * Hero scroll regression check: drives the home page like a phone on a slow
 * connection and like a desktop, and reports what the hero did.
 *
 * Lighthouse never scrolls, so the two bugs this guards against are
 * invisible to it: the page jumping back to the top while the clip loads,
 * and the clip never following the finger. Run it against the dev server
 * or production:
 *
 *   npm i --no-save playwright-core        # drives the installed Google Chrome
 *   node scripts/hero-scroll-check.js http://localhost:3200/
 *   node scripts/hero-scroll-check.js https://thegoatmovers.net/
 *
 * Exit code 1 when a check fails. Nothing is submitted; the page is only
 * scrolled.
 */
const { chromium, devices } = require("playwright-core");

const URL = process.argv[2] || "https://thegoatmovers.net/";
const SLOW_4G = { offline: false, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8, latency: 150 };
const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failures.push(label);
};

/* Records backward scroll jumps and the hero's dataLayer events. */
const INIT = () => {
  window.__hero = { jumps: [], events: [] };
  let last = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < last - 150) window.__hero.jumps.push({ from: Math.round(last), to: Math.round(y), t: Math.round(performance.now()) });
    last = y;
  }, { passive: true });
  const dl = (window.dataLayer = window.dataLayer || []);
  const push = dl.push.bind(dl);
  dl.push = (...args) => { for (const a of args) if (a && typeof a.event === "string" && a.event.startsWith("hero_")) window.__hero.events.push(a); return push(...args); };
};

const probe = (page) => page.evaluate(() => {
  const w = document.querySelector("[data-hero-region]");
  const v = document.querySelector("#hero-video");
  return {
    y: Math.round(window.scrollY),
    tier: w && w.getAttribute("data-hero-tier"),
    reason: w && w.getAttribute("data-hero-reason"),
    codec: w && w.getAttribute("data-hero-codec"),
    pinVh: w ? +(w.getBoundingClientRect().height / window.innerHeight).toFixed(1) : null,
    src: w ? (w.getAttribute("data-hero-src") || "").split("/").pop() : null,
    blob: v ? (v.getAttribute("src") || "").startsWith("blob:") : false,
    videoHidden: v ? getComputedStyle(v).display === "none" : null,
    t: v ? +v.currentTime.toFixed(2) : null,
    ready: v ? v.readyState : null,
    jumps: window.__hero.jumps,
    events: window.__hero.events.map((e) => e.event),
  };
});

async function swipe(cdp, page, times) {
  for (let i = 0; i < times; i++) {
    const x = 195, y0 = 700, dist = 500, steps = 10;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: y0 }] });
    for (let s = 1; s <= steps; s++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y0 - (dist * s) / steps }] });
      await page.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(400);
  }
}

async function phoneSlow(browser) {
  console.log("\n--- phone, slow 4G, CPU x4 ---");
  const ctx = await browser.newContext({ ...devices["iPhone 13"], locale: "en-US" });
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", SLOW_4G);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await swipe(cdp, page, 6);
  await page.waitForTimeout(12000);
  const s = await probe(page);
  console.log(JSON.stringify(s));
  check(s.tier === "light" && s.src === "hero-phone.mp4" && s.blob, "phone gets the light tier with the phone clip as a blob");
  check(s.pinVh !== null && s.pinVh <= 3.05, `phone pin is three screens (got ${s.pinVh})`);
  check(s.jumps.length === 0, `no backward scroll jump while loading (got ${JSON.stringify(s.jumps)})`);
  check(s.y > 1000, `the swipes moved the page (y=${s.y})`);
  check(s.events.includes("hero_tier"), "hero_tier reported to dataLayer");
  check(s.t > 0 && !s.events.includes("hero_downgrade"), `clip followed the scroll and did not step down (t=${s.t}, events=${s.events})`);
  await ctx.close();
}

async function phoneReducedMotion(browser) {
  console.log("\n--- phone, prefers-reduced-motion ---");
  const ctx = await browser.newContext({ ...devices["iPhone 13"], locale: "en-US", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const s = await probe(page);
  console.log(JSON.stringify(s));
  check(s.tier === "static" && !s.src, "reduced motion gets the static tier, no clip requested");
  check(s.videoHidden === true, "static tier hides the <video> so the poster shows");
  check(s.pinVh !== null && s.pinVh <= 2.55, `static pin is two and a half screens (got ${s.pinVh})`);
  await ctx.close();
}

async function desktop(browser) {
  console.log("\n--- desktop 1440x900 ---");
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US" });
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  await page.addInitScript(() => { try { sessionStorage.setItem("goat_preloaded", "1"); } catch {} });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 600); await page.waitForTimeout(350); }
  await page.waitForTimeout(1500);
  const s = await probe(page);
  console.log(JSON.stringify(s));
  check(s.tier === "full" && s.src === "hero.mp4", `desktop gets the full tier with the original clip (${s.src})`);
  check(s.pinVh !== null && s.pinVh >= 4.9, `desktop pin is five screens (got ${s.pinVh})`);
  check(s.t > 0, `clip followed the wheel (t=${s.t})`);
  check(s.jumps.length === 0, "no backward scroll jump");
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    await phoneSlow(browser);
    await phoneReducedMotion(browser);
    await desktop(browser);
  } finally {
    await browser.close();
  }
  console.log(failures.length ? `\n${failures.length} check(s) failed` : "\nall checks passed");
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error("FAILED", e); process.exit(1); });
