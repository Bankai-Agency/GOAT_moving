# LP — Landing pages working notes

Reference notes for the three LP variants under `src/app/(lp)/`. NOT
auto-loaded by Claude — when picking LP work back up, ask Claude to
read this file first.

> ⚠️ Snapshot dated 2026-05-27. Verify against current code before
> treating any selector / pixel value as authoritative.

---

## What we have right now

Three variants of the same Portland landing page. **Same JSX, same
component tree, different style cascades.**

| Route | Theme | Key feature | Footer |
|---|---|---|---|
| `/lp1` | LIGHT | Original — white page, dark "islands" (hero photo, services photo cards, dark CTA banner). Cards in Solution + Process flash dark via `DarkScrollZone` (Porsche-style scroll veil). | Brand-blue island (`#005BFF` via `globals.css` `theme-light footer` flip) |
| `/lp2` | DARK + scroll transitions | Mirror of /lp1 — dark page, light islands. Scroll into Solution + Process triggers a WHITE veil (LightScrollZone) → area becomes light mid-scroll, transitions back. | **DARK** — JSX `bg-[#141414]` renders as-is, no theme-light flip. Earlier was blue (explicit override); reverted because all-dark footer reads better with the dark theme. |
| `/lp3` | DARK uniform | Same dark page as /lp2 but **DarkScrollZone wrappers removed** — page reads as one continuous dark surface, no veil. Solution cards keep their native dark `#1a1a1a` bg with blue radial-gradient spotlight overlay (the original LPSolutionCard design). | **BLUE** island via explicit override in `_lp2-invert.css` (`.lp2-dark footer { background: var(--lp-blue) }`). Decision independent from lp2. |

All three render via the same `CityLandingPage` component (each LP has
its own copy in its directory) with `portlandConfig` as content.

## Why we built it this way

The original /lp/[slug] LP system lived in `src/app/(lp)/_shared/` and
was shared across multiple city routes. It had grown organically over
many iterations and accumulated significant tech debt:

1. **2556-line `lp-theme.css`** — every visual override for every
   section, all in one file. Edits were slow because grep through 2.5k
   lines on every iteration.
2. **Catch-all Tailwind-class selectors** like
   `.theme-light[data-lp-root] #services .bg-\[\#181818\] { ... }` —
   targeted ANY element with that hex Tailwind class inside the
   section. Adding a new dark element accidentally inherited styling.
3. **`theme-light` flip cascade** — globals.css flipped every dark
   Tailwind hex (`bg-[#0c0c0c]` → white, etc.) and LP customizations
   were written to FIGHT those flips back to the desired colour using
   `!important`. A fix in one place was outweighed by a more-specific
   rule elsewhere — leading to "I changed it, you didn't" frustration.
4. **Cross-page leakage** — fix in `_shared/` propagated to every
   other LP whether intended or not.

So the work was:
1. **Isolate** the Portland LP into its own directory (`/lp1`) with no
   imports back to `_shared/`. Safe playground for changes.
2. **Refactor** the CSS into per-section files + introduce design
   tokens, so edits are local and traceable.
3. **Build alternative variants** (`/lp2`, `/lp3`) to explore dark
   theme without touching the original `/lp/[slug]` route.

---

## File structure

```
src/app/(lp)/
  _shared/                   ← ORIGINAL — still used by /lp/[slug].
  lp/[slug]/page.tsx         ← Production city LPs. Use _shared.
  lp1/                       ← Isolated Portland v2 (light theme).
    page.tsx                 ← Imports portland.ts + full styles stack.
    CityLandingPage.tsx      ← Same JSX as _shared but local imports.
    DarkScrollZone.tsx       ← Porsche fill-to-dark veil.
    FooterParallax.tsx
    LPTerminalNav.tsx
    config/portland.ts       ← Single-city config (no multi-city tree).
    sections/                ← All 14 sections cloned + L2-refactored.
    ui/                      ← LPButton / LPInput / LPQuoteForm / etc.
    styles/
      _tokens.css            ← Design tokens (hex + rgba + radii).
      accent.css             ← Yellow → blue accent overrides.
      mega-nav.css           ← Floating header bar styles.
      lp-theme.css           ← Global LP rules (shared dark-island
                                 infrastructure, body gradient, etc.).
      _hero.css              ← Per-section CSS files. Colocated
      _services.css           with their components conceptually.
      _solution.css           Loaded AFTER lp-theme.css so equal-
      _about.css              specificity ties go to the section.
      _cta.css
      _process.css
      _reviews.css
      _service-area.css
      _faq.css
      _footer.css
      _dark-zone.css         ← DarkScrollZone color-mix rules.
  lp2/                       ← Clone of lp1 + dark-theme inversion.
    styles/
      _lp2-invert.css        ← Override layer (loaded LAST).
      (other files: cloned from lp1, with `.theme-light[data-lp-root]`
       sed-replaced to `[data-lp-root]` so LP rules fire WITHOUT
       theme-light cascade)
    DarkScrollZone.tsx       ← Modified: veil bg #0c0c0c → #ffffff.
  lp3/                       ← Clone of lp2 minus DarkScrollZone.
    CityLandingPage.tsx      ← <DarkScrollZone> tags replaced with <>.
    (no DarkScrollZone.tsx file — deleted)
    styles/_lp2-invert.css   ← Same name but extra rules for the
                                 no-scroll-zone case (eyebrow border
                                 visibility, eyebrow text recolour,
                                 refined Reviews glass).
```

Per-variant page wrapper:
- `/lp1`: `<div data-accent="blue" data-lp-root="" className="theme-light bg-[#ffffff] ...">`
- `/lp2`: `<div data-accent="blue" data-lp-root="" className="lp2-dark bg-[#0c0c0c] ...">`
- `/lp3`: same as lp2 (still uses `lp2-dark` class — the inversion
  CSS file is also still called `_lp2-invert.css` for code reuse;
  rename if it ever becomes confusing).

Style import order (in page.tsx for each LP):
1. `_tokens.css` FIRST — variables must exist before rules reference.
2. `accent.css` + `mega-nav.css` — shared infrastructure.
3. `lp-theme.css` — global LP rules.
4. `_hero.css` … `_dark-zone.css` — per-section, in section order.
5. `_lp2-invert.css` (lp2, lp3 only) — LAST, overrides everything.

---

## Refactor history (chronological)

The session that produced this state, in rough order:

**0. Clone.** `cp -r src/app/(lp)/_shared src/app/(lp)/lp1`. Pixel-
identical to /lp/movers-portland. All imports relative → automatically
self-contained.

**1. Tokens (hex).** Created `_tokens.css` with 13 brand colours
(`--lp-blue`, `--lp-ink`, `--lp-dark-surface`, `--lp-yellow`, etc.).
perl with `(?<!\\)` negative lookbehind replaced ~210 hex values WHILE
preserving escape sequences in Tailwind-class selectors
(`.bg-\[\#181818\]`). **Then learned:** also have to mask attribute
selectors `[style*="#XXX"]` and `[class*="bg-[#XXX]"]` — those `#XXX`
substrings must NOT be replaced (they're matching against rendered
HTML, not value positions). Final perl masks `[attr*="..."]` first,
runs substitution, restores masks.

**2. Per-section CSS extraction (L1 refactor).** Pulled 1361 lines
out of `lp-theme.css` (2556 → 1195) into 11 per-section files. Each
section's rules now live next to its conceptual component. **Rules
that touched multiple sections (e.g. shared "dark-island
infrastructure" for `.text-white/X` inside hero+services+cta) stayed
in `lp-theme.css`** as truly shared infrastructure.

**3. L2 semantic classes — 4 sections.** Replaced `.bg-[#181818]`
catch-alls with `lp1-stat-chip`, `lp1-service-card`,
`lp1-review-card`, `lp1-source-bubble`, `lp1-nav-arrow`. Each one:
- Add semantic class to JSX, remove the Tailwind hex class.
- Update CSS selectors. No more `!important` because no flip to
  fight.

**4. RGBA tokens.** Added 32 rgba variables (`--lp-ink-65`,
`--lp-white-18`, `--lp-glass-bg`, etc.) and the masking perl ran a
second time. ~210 more substitutions.

**5. Cleanup.** Removed dead files (`LocalMovingRatesSection.tsx`,
`BlueBlobBackdrop.tsx`, `LeadForm.tsx`), extracted `portland.ts` as
standalone config (replaced multi-city `cityConfigs.ts`), pruned
unused mega-nav dropdown rules (-364 lines).

**6. /design-system2 → lp1.** The catalog now imports from `lp1/`
instead of `_shared/`. Iterations on the catalog drive lp1 design.

**7. /lp2 dark variant.**
   - `cp -r lp1 lp2`.
   - perl: `.theme-light[data-lp-root]` → `[data-lp-root]` in lp2's
     CSS (so LP rules fire without theme-light on the wrapper).
   - `lp2/page.tsx` wrapper class: `theme-light bg-[#ffffff]` →
     `lp2-dark bg-[#0c0c0c]`.
   - Created `_lp2-invert.css` with ~15 override blocks: body
     gradient dark, headings white, dark-zone color-mix direction
     flipped (start dark, end light), DarkScrollZone veil bg dark →
     WHITE.
   - Stat chips, review cards, source bubbles, nav arrows, service-
     area chips all painted as frosted glass.
   - Footer painted brand-blue (matches the globals.css
     `theme-light footer { #005BFF }` rule that no longer fires).
   - FAQ ink text + dividers flipped to white-tinted.

**8. /lp3 uniform-dark variant.**
   - `cp -r lp2 lp3`.
   - Deleted `DarkScrollZone.tsx`; sed-replaced `<DarkScrollZone>` →
     `<>` in CityLandingPage so the wrappers degrade to React
     Fragments.
   - Added overrides for the no-dark-zone case:
     - Eyebrow border (`.border-[#001f4d]/12`) → white-15.
     - Eyebrow inline-styled text (`rgba(0, 31, 77, 0.6)`) →
       white-75 (Tailwind class overrides don't reach inline style).
   - Refined Reviews glass to a "header-style" recipe (4% white
     tint + 30px blur + 120% saturate + hairline white-08).
   - Solution cards reverted to their ORIGINAL design (dark `#1a1a1a`
     bg + blue radial-gradient spotlight + ring glow — the
     `LPSolutionCard` component already had this; removing the
     pale-blue override let it show through on the dark page).

---

## Architecture rules — DO NOT break

These are lessons paid for in iteration. Following them keeps fixes
local instead of cascading into other sections.

### 1. Never edit `_shared/` for LP changes
The lp1 / lp2 / lp3 routes are self-contained. Edits to `_shared/`
affect `/lp/[slug]` which is the production route. Touch `_shared/`
ONLY if changing `/lp/[slug]` is the explicit goal.

### 2. Tokens are the single source for colour
Hex literals and rgba should reference `var(--lp-X)` in every per-
section CSS file. The list lives in `_tokens.css`. To change the LP
palette: edit `_tokens.css`, NOT call sites.

Exceptions where literal hex is still OK:
- Inside Tailwind-class attribute substring matchers
  (`[style*="rgba(255, 229, 51"]` etc.) — these match against
  RENDERED HTML, not value positions.
- One-off hover colours that are truly section-unique
  (e.g. `#FF2828` Yelp red in source bubble hover).

### 3. Semantic classes beat Tailwind hex classes
For any element that needs CSS rules:
- BAD: `<div className="bg-[#181818] ...">` + `#services .bg-\[\#181818\] { ... }`
- GOOD: `<div className="lp1-card-dark ...">` + `#services .lp1-card-dark { ... }`

The Tailwind hex form makes the rule a CATCH-ALL on any element with
that class. The semantic form makes it explicit. Less surface area
for accidental matches.

L2 has been applied to 4 sections (about / services / reviews / the
hero CSS was mostly dead code and got cleaned out). Process /
Solution still use inline-styled hex on the JSX side — refactoring
them is L2-rest-of-page work.

### 4. `!important` is a code smell — but sometimes unavoidable
Every `!important` in `lp-theme.css` originally existed to BEAT the
`theme-light` flip cascade. Semantic-class rules can drop `!important`
because there's nothing to fight. Inline `style={{}}` in JSX still
requires `!important` to override (inline beats class specificity
without it).

### 5. Per-section CSS load order matters
`page.tsx` loads `lp-theme.css` BEFORE per-section files. So a
section-specific rule in `_services.css` wins on equal-specificity
ties against a generic rule in `lp-theme.css`. **Do not put section-
specific rules in `lp-theme.css`** — they'd lose to the per-section
rule that targets the same selector. Always extract.

### 6. lp2/lp3 use a different override layer
`_lp2-invert.css` loads LAST. Edits there override everything earlier
in the cascade. **Do not edit `lp-theme.css` directly in lp2/lp3
for dark-theme tweaks** — use `_lp2-invert.css` so the override
stays localised and easy to find.

### 7. Background gradient lives on `body`
`lp-theme.css` paints the page gradient on `body:has([data-lp-root])`.
The body element is an ANCESTOR of `[data-lp-root]`. CSS variables
inherit DOWN the tree only, so any var referenced in this rule MUST
also be defined on `:root` (which is the parent of body). That's why
`_tokens.css` defines its variables on `:root, [data-lp-root]` —
both scopes get them.

Forgetting this caused a real bug: defining tokens only on
`[data-lp-root]` meant the body bg gradient resolved `var(--lp-white)`
to undefined → fell through to the dark html background → entire
page went dark.

### 8. The dark-island infrastructure rule is shared
`lp-theme.css` has a multi-selector rule for
`.text-white/X` and `.border-white/X` that targets hero / services /
cta TOGETHER as "dark islands" (forces white text/borders to stay
white inside these regions, defeating the global text-white→ink
flip). If you refactor one of those sections to use a semantic class
INSTEAD of `bg-[#181818]`, you MUST update this rule too — otherwise
text inside the refactored section flips to ink and disappears on
the photo bg. The L2 refactor of services updated this rule.

### 9. DarkScrollZone sets `--dark-veil` on the wrapper element
The DarkScrollZone component (via requestAnimationFrame) writes
`--dark-veil` (0..1) to the `[data-lp-dark-zone]` wrapper. CSS rules
in `_dark-zone.css` and per-section CSS use `var(--dark-veil, 0)` in
`color-mix()` to interpolate between rest and scroll states. **The
variable is undefined outside the wrapper** — color-mix with
`var(--dark-veil, 0)` falls back to 0 (the "rest" state). In lp3
where wrappers are removed, only the fallback fires.

### 10. lp2 inverts the color-mix direction
The original (lp1) formulas use `(1 - var(--dark-veil, 0))` so at
veil=0 the first colour wins (start state = LIGHT) and at veil=1 the
second wins (end = DARK). In lp2 the formula is just
`var(--dark-veil, 0)` — at veil=0 the SECOND colour wins (start =
DARK), at veil=1 the FIRST wins (end = LIGHT). When adding new
dark-zone rules to lp2, follow the lp2 direction.

### 11. Verifying changes
The user runs `npm run dev` themselves on port 3000. **Never call
`preview_start`** — it kills their dev server. Verify via:
- `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/lp1`
- `curl -s http://localhost:3000/lp1 | grep -oE 'classname-pattern'`
- Reading source files.

For TypeScript correctness before push:
- `npx tsc --noEmit` — catches build errors that Vercel will trip on.
- `next dev` is more permissive than `next build`. Production build
  caught at least one bug we missed locally (LPInput controlled-form
  props in design-system2 showcase).

---

## Token system reference

Defined in `lp1/styles/_tokens.css` (cloned to lp2/lp3). Scope:
`:root, [data-lp-root]`.

### Brand
- `--lp-blue` `#0066ff` — primary accent
- `--lp-blue-hover` `#0052cc`
- `--lp-blue-pale` `#f0f5ff` — pale brand-blue card bg

### Ink (dark text on light surfaces)
- `--lp-ink` `#001f4d`
- `--lp-ink-04 / 12 / 40 / 45 / 55 / 60 / 65 / 70 / 75 / 85` —
  rgba(0, 31, 77, X) at the listed alpha steps

### Light surfaces
- `--lp-bg` / `--lp-white` `#ffffff`
- `--lp-surface` `#f5f7fb`
- `--lp-surface-light` `#f1f3f6`
- `--lp-hairline` `#e2e6ec`
- `--lp-white-03 / 08 / 10 / 12 / 15 / 16 / 18 / 20 / 22 / 25 / 30
   / 45 / 50 / 55 / 60 / 65 / 70 / 75 / 80 / 85 / 90` — rgba(255,
  255, 255, X)

### Dark surfaces
- `--lp-dark` `#0c0c0c` — page dark bg
- `--lp-dark-surface` `#181818` — card dark bg
- `--lp-dark-surface-2` `#242424` — secondary dark surface
- `--lp-dark-surface-3` `#303030` — tertiary dark surface

### Legacy yellow (kept tokenized so accent.css flip rules still work)
- `--lp-yellow` `#FFE533`

### Glass / overlays
- `--lp-glass-bg` `rgba(0, 0, 0, 0.3)` — canonical glass tint
- `--lp-glass-blur` `30px`
- `--lp-transparent` `rgba(0, 0, 0, 0)`

### Radii
- `--lp-r-sm` `8px`
- `--lp-r-md` `12px` (LP default)
- `--lp-r-lg` `16px`
- `--lp-r-xl` `20px`
- `--lp-r-2xl` `24px`
- `--lp-r-pill` `999px`

### Layout
- `--lp-section-pad-y-sm` `60px` (mobile section padding)
- `--lp-section-pad-y-lg` `100px` (desktop)
- `--lp-content-pad-x` `16px`
- `--lp-content-max` `1408px`

### Fonts
- `--lp-font-sans` — system / Geist
- `--lp-font-mono` — Roboto Mono

---

## Glass recipes — the 3 variants in use

All three are dark-page constructs.

### Card glass — "cheap" (avoid)
```css
background-color: var(--lp-white-08);
backdrop-filter: blur(20px);
border: 1px solid var(--lp-white-12);
box-shadow: 0 1px 2px var(--lp-ink-04), 0 4px 12px var(--lp-ink-04);
```
First attempt in lp2. Plastic-y. The white tint + shadow + border
make it read as a flat plate, not glass. **Don't use this for new
glass elements.**

### Header glass — "frosted ink" (canonical reference)
```css
background-color: var(--lp-glass-bg);   /* rgba(0, 0, 0, 0.3) */
backdrop-filter: blur(30px);            /* set INLINE in JSX */
border: 0;
box-shadow: none;
```
The floating `.mega-nav__bar`. Dark tint over the dark page reads
like dark glass picking up subtle blue from body gradient through
blur. **Backdrop-filter MUST be set inline in JSX, NOT in a CSS rule**
— PostCSS / lightningcss strips `backdrop-filter` from regular CSS
rules in this project.

### Card glass — "balanced" (use this for cards)
```css
background-color: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(30px) saturate(120%);
-webkit-backdrop-filter: blur(30px) saturate(120%);
border: 1px solid var(--lp-white-08);
box-shadow: none;
```
Used for lp3 review cards / source bubbles / nav arrows. The
`saturate(120%)` is the key — boosts the colour of whatever's
behind so the body gradient shines through the glass with more
saturation. Without saturate the glass looks pale and flat.

The hairline `white-08` border gives the card a discernable edge so
it doesn't dissolve into the page.

---

## Common gotchas

### perl substitution accidentally touches attribute selectors
`[style*="rgba(0, 31, 77, 0.6)"]` looks for that EXACT string in the
rendered HTML's `style` attribute. If you replace it with
`var(--lp-ink-60)`, the selector now matches nothing. The masking
perl pattern in `_tokens.css` history protects this — pre-process
attribute-selector strings to placeholders, do substitution, restore.

### Inline `style={{}}` beats class selectors without !important
Solution / Process cards set bg/color via inline `style={{}}` in
JSX. A regular CSS rule won't override that. Add `!important` to
beat inline. **The dark-zone color-mix rules in `_dark-zone.css` and
the inline overrides in `_lp2-invert.css` all carry `!important`
for this reason.**

### accent.css mostly uses `body:has([data-accent="blue"])` not theme-light
This means accent.css rules fire on lp2/lp3 even though theme-light
is absent. The yellow → blue flip works without theme-light. **But
some accent.css rules DO use `.theme-light[data-accent="blue"]`** —
those don't fire on lp2/lp3, which is why we had to manually re-
apply the white-logo filter in `_lp2-invert.css`.

### Tailwind backdrop-filter classes work, but CSS rule
`backdrop-filter` is stripped
PostCSS / Tailwind compile `lg:backdrop-blur-[30px]` to a JIT class
correctly. But a hand-written CSS rule like
`.foo { backdrop-filter: blur(30px) }` may be stripped by
lightningcss in production. **Reliable pattern: set
`backdrop-filter` inline in JSX (`style={{ backdropFilter: "blur(30px)" }}`)
or use Tailwind's `backdrop-blur-[Xpx]` arbitrary value.**

For lp2/lp3 we use CSS rule form and it currently works in dev. If
it breaks in production: move to inline style on the affected
elements.

### Adding a new dark element to a refactored section
If you add a new `<div>` to e.g. About section, do NOT use
`className="bg-[#181818]"` — instead use the section's semantic
class system. About uses `lp1-stat-chip` for icon chips; create a new
semantic class if the new element doesn't fit.

### Hover that uses Tailwind hex (`hover:bg-[#FF2828]`)
Tailwind compiles arbitrary hover variants fine. theme-light doesn't
flip them (no `:hover` flip rules in globals.css). So `hover:bg-X`
renders as `X` on hover in any LP variant. Keep these in JSX as-is
for cleanest hover transitions.

### The `bg-[#FFE533]` class is special
This is the legacy yellow. accent.css repaints it to brand blue via
`body:has([data-accent="blue"]) .bg-[#FFE533] { background-color:
var(--lp-blue) }`. If you remove the Tailwind class from JSX, you
lose the yellow → blue flip behaviour. **Don't remove it unless
you're replacing with an explicit brand-blue value.**

---

## Open / known limitations

These are NOT bugs — they're intentional trade-offs from time-boxed
decisions.

1. **L2 not complete.** Process / Solution / FAQ JSX still uses
   inline-styled hex (`#1a1a1a`, `#f0f5ff`, etc.) and `bg-[#181818]`
   Tailwind classes. Refactoring them to semantic classes is L2-
   rest-of-page work.

2. **L3 not started.** `theme-light` is still required for /lp1
   (`globals.css` flip cascade is its source of truth for light-
   surface paint). Fully detaching from theme-light would mean
   rewriting hundreds of rules — multi-day project.

3. **Touchbar doesn't render in lp2/lp3 dark mode tests yet.**
   The component reads `[data-lp-dark-zone]` to decide its glass
   tint (light vs dark glass adaptive). On lp3 (no dark-zone) it
   always picks the LIGHT branch — may not be right visually.

4. **Solution card text override scoped to lp2.** In lp3 we
   reverted the override so Solution cards stay dark `#1a1a1a` with
   blue spotlight. Process cards STILL go through the lp2 dark-zone
   color-mix which is dead-coded out by removing the wrapper —
   they render as pale-blue (the inline JSX bg). For consistency
   it'd be nice to either invert Process to dark + blue spotlight
   too, OR add a deliberate override pinning Process to pale-blue
   (currently it's accidental fallback).

5. **Footer treatment differs across variants.** lp1 = blue (via
   globals theme-light flip), lp2 = dark (JSX default), lp3 = blue
   (explicit override). The blue/dark choice is a design call —
   each variant's `_lp2-invert.css` (in lp2 + lp3) owns the
   decision independently. To change a variant, edit the footer
   block in its file; don't propagate to the others by default.

6. **`/design-system2` shows lp1 only.** The catalog imports from
   `(lp)/lp1/`. Switching it to render lp2 / lp3 would require
   plumbing a theme toggle through the iframe preview route. Not
   wired up.

7. **Mainpage-5 still uses theme-light.** That draft route hasn't
   been touched in this refactor. If/when it gets revisited, the
   same patterns (per-section CSS, semantic classes, tokens) apply.

---

## Quick-start commands

Useful one-liners for picking this up later:

```bash
# Verify all three routes still build / serve
for r in /lp1 /lp2 /lp3 /design-system2; do
  curl -s -o /dev/null -w "$r: %{http_code}\n" "http://localhost:3000$r"
done

# Check for any rule in lp-theme.css that still uses .theme-light prefix
# (lp2/lp3 should have 0; lp1 should have many — they're the source of truth)
for v in lp1 lp2 lp3; do
  echo "$v: $(grep -c '\.theme-light\[data-lp-root\]' \
    "src/app/(lp)/$v/styles/lp-theme.css" 2>/dev/null)"
done

# Find any new bg-[#XXX] Tailwind classes added to JSX that we should L2-refactor
grep -rE 'bg-\[#[0-9a-fA-F]+\]' src/app/\(lp\)/lp1/sections/ | \
  grep -v 'lp1-' | head

# Run typecheck before push (production build is stricter than dev)
npx tsc --noEmit
```
