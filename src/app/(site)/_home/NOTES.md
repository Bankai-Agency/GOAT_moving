# mainpage-5 — working notes

Reference notes for the `/mainpage-5` draft (terminal-industries-style
homepage redesign). NOT auto-loaded by Claude — when picking this page
back up, ask Claude to read this file first.

Branch: `draft/mainpage-5-terminal`. `noindex/nofollow`. Mounts
`SmoothScrollProvider` (Lenis momentum) wired to GSAP ScrollTrigger.

> ⚠️ Some details below are point-in-time snapshots from May 2026 —
> verify against current code before treating any pixel value or file
> path as authoritative.

---

## Scoping rules — DO NOT modify shared components

mainpage-5 reuses shared components (Header, Touchbar, FAQSection,
ContactFooter, QuoteForm, NavProgress). Past iterations broke other
pages by editing shared sources. Rules:

- Add scoped overrides to `src/app/(drafts)/mainpage-5/accent.css`
- Selector patterns:
  ```css
  /* Catches descendants of the page wrapper + elements rendered
     higher up (e.g. NavProgress in root layout) via body:has(). */
  body:has([data-accent="blue"]) #faq h2 { ... }

  /* Higher-specificity variant — beats theme-light's !important
     rules by chaining both wrapper classes + attr selector. */
  .theme-light[data-accent="blue"] [data-menu-logo] img[src*="logo"] { ... }
  ```
- Page wrapper in `page.tsx` carries BOTH:
  - `theme-light` — flips dark color tokens to light via `globals.css`
  - `data-accent="blue"` — mainpage-5-only accent + typography
- **Inline-style escape hatches** when accent.css can't win:
  - `backdrop-filter: blur(30px)` on `.mega-nav__bar` — PostCSS strips
    `backdrop-filter` from regular rules, so it's set inline on the bar div.
  - Testimonial blockquote: `style={{ color: "#fff" }}` to bypass
    theme-light's `text-white → near-black` flip.
  - PhoneDropdown panel colors: inline `style` for bg/color/Copy button.

## Special DOM markers

- `[data-hero-region]` on the hero wrapper — read by `TerminalNav`
  scroll-handler (forces header visible while inside hero) and by
  `Touchbar` (appears only after hero ends).
- `--mp5-bar-w` CSS var set on `.mega-nav` by a ResizeObserver — the
  `.mega-nav__dropdown-wrapper` inherits it so dropdown widths match
  the bar's content-fit width.

---

## Page structure (top → bottom)

1. **Hero** — 500vh sticky-pin with scroll-tied canvas frame-scrub
   (567 webp frames extracted from 5 user mp4s) + 8 char-stagger
   phrase reveals overlaid at the bottom of the video.
2. **Sticky Steps** — Osmo Supply pattern. 4 steps with grey→blue→ink
   char wave reveal on h2 + clip-path inset image reveal.
3. **MOS Morph** — "Mover's Operating System" → "MOS™" scroll-scrubbed
   shrink, subtle SVG grid backdrop.
4. **Benefits** — sticky-pin with two independent stacks (image strip
   on top + text strip on bottom). Each card's image and text panel
   slide down from above (`yPercent -100 → 0`) independently, synced
   via single GSAP scrub timeline. `zIndex i+1` so newer overlays older.
5. **Marquee** — full-bleed white bg with subtle SVG grid (matching
   MOS). Continuous infinite horizontal scroll, mono uppercase ink.
   6 phrases (USDOT #4232069, Licensed OR & WA, 3,000+ moves, 850+
   reviews, Zero hidden fees, Same-day quotes) with blue diamond
   separators. CSS keyframe `mp5-marquee` 38s linear infinite.
6. **Testimonial** — dark navy bg, white text inline-styled to bypass
   theme-light, parallax photo.
7. **FAQ** — shared FAQSection with mainpage-5 typography overrides:
   heading weight 500, eyebrow dot+stripe row hidden, 50/50 layout to
   match footer form alignment.
8. **ContactFooter** — shared component with comprehensive typography
   override to project-medium scale; QuoteForm step indicators white
   instead of blue on the blue bg.

---

## Header (`TerminalNav.tsx`) anatomy

- Container **78px** tall, padding `18px 24px` (terminal-industries exact).
  Content-fit width via `max-content` + `max-width: calc(100% - 2em)`, centered.
- Dark glass `rgba(0, 0, 0, 0.3)` + `blur(30px)` set via **inline style**
  (PostCSS strips `backdrop-filter` from regular CSS rules).
- GOAT logo kept native yellow on dark glass via:
  `.theme-light[data-accent="blue"] [data-menu-logo] img[src*="logo"] { filter: none !important }`
  (chains specificity past theme-light's recolor rule).
- Nav links: padding `14px 0` (no horizontal), gap 8px to chevron,
  font-size 14px / weight 500 / letter-spacing 0.42px.
- `SwapLabel` — vertical text-swap hover (icomat.co.uk / rejouice
  style). `translateY(-1em)` on hover, duplicate copy below rises in.
- `PhoneDropdown` — 41×41 ghost icon button. Floating dropdown with
  `tel:` link + Copy-to-clipboard button (CopyIcon SVG).
- Quote CTA (`BlueCta size="sm"`): h=44px, fs=13px, weight 700,
  tracking 0.6px, hover inverts white→blue.
- Scroll-aware: hides on scroll-down + reveals on sustained scroll-up
  ≥80px. Forced visible while `scrollY ≤ heroEnd` (detected via
  `[data-hero-region]` on the hero wrapper).
- `Touchbar` (mobile) also reads `[data-hero-region]` — appears only
  after scrolling past the hero.
- ResizeObserver on `.mega-nav__bar` sets `--mp5-bar-w` CSS var on
  `.mega-nav`; dropdown wrapper inherits it.
- Mobile menu: full-screen white overlay, nav links 22px INK with
  hover→blue. Phone+quote CTAs pinned bottom (justify-content
  space-between in the bar-inner) stretched to `flex-1` at h=56px
  fs=13px. Dropdown wrapper overridden to `width: auto; left: 0;
  right: 0` on `<= 991px` so slide-over fills the full viewport.

---

## Hero frame-scrub

- 5 user mp4s in `~/Downloads/VIDEO/{1..5}.mp4`
  (47s total, 3852×2152 @ 24fps).
- Extracted via `ffmpeg-static` npm package (no system ffmpeg/brew on
  this machine — binary at `node_modules/ffmpeg-static/ffmpeg`).
- Pipeline: concat demuxer → `fps=12` → `scale=1280:-2` → 567 webp
  frames @ `-q:v 70 -compression_level 4` → ~28MB total in
  `public/frames/frame_NNNN.webp`.
- `FRAME_COUNT = 567` constant in `TerminalDraftClient.tsx`.
- 8 hero phrases overlaid; splitter breaks on spaces AND hyphens so
  "Computer-vision" can wrap on narrow viewports.
- Mobile font: 58px (matches terminal-industries hero @ vw=390 exactly).
  sm 72px. lg 120px.
- Text aligned to bottom edge of video (`items-end`, pb-2 mobile /
  pb-3 desktop).

### ffmpeg-static extraction command

```bash
FF=$(node -e "console.log(require('ffmpeg-static'))")

cat > /tmp/list.txt <<EOF
file '/Users/dmitriy/Downloads/VIDEO/1.mp4'
file '/Users/dmitriy/Downloads/VIDEO/2.mp4'
file '/Users/dmitriy/Downloads/VIDEO/3.mp4'
file '/Users/dmitriy/Downloads/VIDEO/4.mp4'
file '/Users/dmitriy/Downloads/VIDEO/5.mp4'
EOF

$FF -hide_banner -loglevel warning \
  -f concat -safe 0 -i /tmp/list.txt \
  -vf "fps=12,scale=1280:-2" \
  -c:v libwebp -compression_level 4 -q:v 70 \
  -an -update 0 -y \
  public/frames/frame_%04d.webp
```

Without `-c:v libwebp` ffmpeg defaults to `libwebp_anim` → one
animated webp instead of a sequence.

Tunables: fps (4/8/12 — current is 12), scale (1280:-2 vs 1920:-2 for
retina ~2× size), `-q:v` (70 lossy, 75–80 higher quality).

After extracting, update `FRAME_COUNT` in `TerminalDraftClient.tsx` to
match `ls public/frames/ | wc -l`.

---

## Open follow-ups

- **Migrate hero from canvas+webp frame-scrub to `<video>` +
  `currentTime` scrubbing**. terminal-industries.com uses native
  `<video>` elements (12 on the page total) and scrubs
  `video.currentTime = scrollProgress * video.duration` via their own
  ScrollTrigger. Hardware-accelerated decode + native frame
  interpolation between keyframes is why their playback feels native
  and ours feels jerky ("рвано") regardless of frame count.
  Proposed plan: concat the 5 mp4s into one + replace canvas with
  `<video preload="auto">` + ScrollTrigger setting `video.currentTime`.
  User hasn't authorized migration yet.
- **Mobile burger menu** still uses Osmo's slide-over-panel pattern for
  sub-dropdowns. User wants terminal-style inline accordion (tap
  "Services" → list expands beneath instead of full-page slide).
  Only typography/sizing improved so far; structural change deferred.

## Trivia

- GOAT has NO moving-specific acronym expansion (no "Guaranteed
  Operations …" anywhere in code or live site); brand reads as
  "Greatest of All Time" only.

## Reference: terminal-industries.com — measured tokens

The visual benchmark. User keeps a Chrome MCP tab on it.

Desktop (vw=1280):
- Header bar **78px**, padding `18px 24px`
- Header glass `rgba(0, 0, 0, 0.3)` + `blur(30px)`, no border, no
  shadow, `border-radius: 8px`
- Header bar width: content-fit (`max-content`), narrower than the
  page container (≈55% on 1718px viewport)
- Nav links: 14px, weight 450 (variable), letter-spacing 0.42px,
  padding `14px 0`, gap 8px to chevron, no hover bg (color only)
- DEMO CTA: h **41px**, fs **11px**, weight **600**, padding `12px 32px`,
  radius **8px**, letter-spacing **1.5px**, Geist Mono

Mobile (vw=390):
- Hero h2 phrases: fs **58px**, weight 400, line-height 55.1px (≈0.95),
  letter-spacing normal, family SuisseIntl

Hero implementation: NOT canvas frame-scrub. They use multiple `<video>`
mp4 elements (12 on the page) and scrub `video.currentTime` directly.
Video sources example: `https://a.storyblok.com/f/337048/x/.../vid_3-{1,3,5}_prerender_1.mp4`.
They preload + cross-fade between videos at different scroll positions.

When user says "1 в 1 как у terminal" — inspect via Chrome MCP first,
copy exact values, and report measured diff. Their numbers are
intentional — match them rather than approximating.
