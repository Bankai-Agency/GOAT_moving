/* What analytics fires after a quote form is submitted on production, with no
 * lead reaching anyone: the POST to /api/submit-quote is answered by a fake 200
 * inside the browser, and every beacon to Google / Clarity / Apps Script is
 * logged and then blocked. Use it to verify the GTM container before and after
 * a change (a generate_lead event should light up the conversion tags).
 *
 *   npm i --no-save playwright-core        # drives the installed Google Chrome
 *   node scripts/analytics-probe.js form https://thegoatmovers.net/contacts
 *   node scripts/analytics-probe.js form https://thegoatmovers.net/lp/movers-portland
 *   node scripts/analytics-probe.js load https://thegoatmovers.net/thank-you
 *
 * "form" opens the quote modal, fills it with test data, submits and reports
 * the dataLayer and the blocked requests; "load" only loads the page.
 */
const { chromium } = require("playwright-core");

const mode = process.argv[2] || "form";
const url = process.argv[3] || "https://thegoatmovers.net/contacts";

const WATCH = [
  "google-analytics.com", "analytics.google.com", "googleads.g.doubleclick.net",
  "googleadservices.com", "google.com/pagead", "google.com/ccm", "googlesyndication",
  "script.google.com", "clarity.ms", "api.ipify.org", "callrail.com", "stats.g.doubleclick",
];
const isWatched = (u) => WATCH.some((h) => u.includes(h));

function describe(u, body) {
  const out = [];
  const parse = (qs) => {
    const p = new URLSearchParams(qs);
    const en = p.get("en"); const label = p.get("label"); const tid = p.get("tid");
    const parts = [];
    if (en) parts.push("event=" + en);
    if (tid) parts.push("tid=" + tid);
    if (label) parts.push("label=" + label);
    if (p.get("dl")) parts.push("dl=" + p.get("dl"));
    if (p.get("dp")) parts.push("dp=" + p.get("dp"));
    if (p.get("Name") || p.get("Email")) parts.push("sheet: Name=" + p.get("Name") + " Email=" + p.get("Email"));
    return parts.join(" ");
  };
  const q = u.split("?")[1];
  if (q) out.push(parse(q));
  if (body) body.split("\n").forEach((line) => line.trim() && out.push("  body: " + parse(line)));
  return out.filter(Boolean).join("\n");
}

const log = [];
const safe = (v) => { try { return decodeURIComponent(v); } catch (e) { return v; } };
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  const t0 = Date.now();
  const stamp = () => String(((Date.now() - t0) / 1000).toFixed(1)).padStart(5) + "s";

  await context.route("**/*", async (route) => {
    const req = route.request();
    const u = req.url();
    if (u.includes("/api/submit-quote")) {
      log.push(`${stamp()} [INTERCEPTED] POST /api/submit-quote body=${req.postData()}`);
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (isWatched(u)) {
      const host = new URL(u).host + new URL(u).pathname.replace(/\/[A-Za-z0-9_-]{30,}/g, "/…");
      log.push(`${stamp()} [BLOCKED] ${req.method()} ${host}\n  ${describe(u, req.postData())}`.trimEnd());
      return route.abort();
    }
    return route.continue();
  });

  // GA4 and Ads send beacons whose bodies Playwright cannot read once blocked:
  // hook the senders inside the page and report every event name they carry.
  await context.addInitScript(() => {
    const report = (kind, url, body) => {
      const done = (t) => console.log("BEACON " + kind + " " + url + " :: BODY " + (t || ""));
      if (body == null) return done("");
      if (typeof body === "string") return done(body);
      if (body instanceof Blob) return body.text().then(done);
      if (body instanceof ArrayBuffer) return done(new TextDecoder().decode(body));
      if (body instanceof URLSearchParams) return done(body.toString());
      done(String(body));
    };
    const isG = (u) => /google|doubleclick/.test(u);
    const sb = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, body) => { if (isG(String(url))) report("sendBeacon", String(url), body); return sb(url, body); };
    const of = window.fetch.bind(window);
    window.fetch = (input, init) => { const u = typeof input === "string" ? input : input.url; if (isG(u)) report("fetch", u, init && init.body); return of(input, init); };
    const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u) { this.__u = String(u); return oo.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function (b) { if (isG(this.__u || "")) report("xhr", this.__u, b); return os.apply(this, arguments); };
  });
  page.on("console", (m) => {
    const t = m.text();
    if (!t.startsWith("BEACON ")) return;
    try {
    const [head, body] = t.split(" :: BODY ");
    const url = head.split(" ")[2] || "";
    const all = (url.split("?")[1] || "") + "\n" + (body || "");
    const events = [...all.matchAll(/(?:^|[&\n?])en=([^&\n]+)/g)].map((x) => safe(x[1]));
    const tid = (all.match(/(?:^|[&?])tid=([^&\n]+)/) || [])[1];
    const label = (all.match(/(?:^|[&?])label=([^&\n]+)/) || [])[1];
    const dl = (all.match(/(?:^|[&?])dl=([^&\n]+)/) || [])[1];
    if (events.length || label) log.push(`${stamp()} [BEACON] ${new URL(url).host}${new URL(url).pathname} tid=${tid || "-"} events=${events.join(",") || "-"}${label ? " label=" + label : ""}${dl ? " dl=" + safe(dl) : ""}`);
    } catch (e) { log.push(`${stamp()} [BEACON?] unparsed: ${t.slice(0, 200)}`); }
  });

  page.on("framenavigated", (f) => { if (f === page.mainFrame()) log.push(`${stamp()} [NAV] ${f.url()}`); });
  page.on("console", (m) => { if (m.type() === "error") log.push(`${stamp()} [console.error] ${m.text().slice(0, 160)}`); });

  const dumpDataLayer = () => page.evaluate(() => (window.dataLayer || []).map((e) => {
    const o = {};
    for (const k of Object.keys(e)) {
      if (k === "event" || k.startsWith("form_") || k.startsWith("lead_") || k === "city" || k === "gtm.uniqueEventId") {
        o[k] = typeof e[k] === "object" ? "[obj]" : e[k];
      }
    }
    return o;
  }));

  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(5000);
  log.push(`${stamp()} --- page loaded; dataLayer so far: ${JSON.stringify(await dumpDataLayer())}`);

  if (mode === "form") {
    await page.locator('input[placeholder="Enter your name"]').first().waitFor({ state: "attached", timeout: 15000 });
    const lpIds = await page.locator("#lp-input-fullName").count();
    log.push(`${stamp()} landing ids present (#lp-input-fullName): ${lpIds}`);
    let name = (lpIds ? page.locator("#lp-input-fullName") : page.locator('input[placeholder="Enter your name"]')).filter({ visible: true }).first();
    if ((await name.count()) === 0) {
      const openers = page.locator("button, a").filter({ hasText: /quote|estimate/i }).filter({ visible: true });
      const n = await openers.count();
      for (let i = 0; i < Math.min(n, 5); i++) {
        const text = (await openers.nth(i).innerText()).trim();
        log.push(`${stamp()} [ACTION] click opener "${text}"`);
        await openers.nth(i).click();
        await page.waitForTimeout(2500);
        name = page.locator('input[placeholder="Enter your name"]').filter({ visible: true }).first();
        if (await name.count()) break;
      }
    }
    log.push(`${stamp()} visible name inputs: ${await name.count()} of ${await page.locator('input[placeholder="Enter your name"]').count()}`);
    await name.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    if (!(await name.isVisible())) {
      const why = await page.evaluate(() => {
        let el = document.querySelector('input[placeholder="Enter your name"]');
        const chain = [];
        while (el && chain.length < 8) {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          chain.push(`${el.tagName.toLowerCase()} d=${cs.display} v=${cs.visibility} o=${cs.opacity} ${Math.round(r.width)}x${Math.round(r.height)}`);
          el = el.parentElement;
        }
        return chain.join(" | ");
      });
      log.push(`${stamp()} [WARN] form input hidden: ${why}`);
    }
    const scoped = page.locator("form").filter({ has: name });
    await name.fill("Test Bankai");
    const phone = (lpIds ? page.locator("#lp-input-phone") : scoped.locator('input[type="tel"]')).filter({ visible: true }).first();
    const email = (lpIds ? page.locator("#lp-input-email") : scoped.locator('input[type="email"]')).filter({ visible: true }).first();
    await phone.fill("+1 (503) 555-0100");
    if (await email.count()) await email.fill("test.bankai@example.com");
    log.push(`${stamp()} [ACTION] filled step-1 fields`);
    const cont = page.locator("button", { hasText: /continue/i }).filter({ visible: true }).first();
    if (await cont.count()) {
      log.push(`${stamp()} [ACTION] click "${(await cont.innerText()).trim()}"`);
      await cont.click();
      await page.waitForTimeout(1500);
    }
    const addr = page.locator('input[placeholder="Address"]').filter({ visible: true });
    if (await addr.count() >= 2) {
      await addr.nth(0).fill("123 Test St, Portland, OR");
      await addr.nth(1).fill("456 Test Ave, Seattle, WA");
      log.push(`${stamp()} [ACTION] filled step-2 addresses`);
    }
    const reqs = page.locator('input[required]:not([type="checkbox"]):not([type="radio"])').filter({ visible: true });
    for (let i = 0; i < await reqs.count(); i++) {
      if (!(await reqs.nth(i).inputValue())) await reqs.nth(i).fill("Test value " + i);
    }
    let submit = page.locator('button[type="submit"]').filter({ visible: true }).first();
    if (!(await submit.count())) submit = page.locator("button", { hasText: /submit|send|get .*quote/i }).filter({ visible: true }).first();
    await submit.waitFor({ state: "visible", timeout: 10000 }).catch(async () => {
      const btns = await page.locator("form button").filter({ visible: true }).allInnerTexts();
      log.push(`${stamp()} [WARN] no visible submit; visible form buttons: ${JSON.stringify(btns)}`);
    });
    log.push(`${stamp()} [ACTION] click "${(await submit.innerText()).trim()}"`);
    await submit.click();
    await page.waitForURL(/thank-you/, { timeout: 20000 }).catch(() => log.push(`${stamp()} [WARN] no navigation to /thank-you`));
    await page.waitForTimeout(7000);
    log.push(`${stamp()} --- after submit; dataLayer: ${JSON.stringify(await dumpDataLayer())}`);
  }

  console.log(log.join("\n"));
  await browser.close();
})().catch((e) => { console.log(log.join("\n")); console.error("PROBE FAILED", e.message); process.exit(1); });
