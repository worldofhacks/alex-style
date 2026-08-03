# Fancy Components — wild tier: physics, SVG filters, path-following
> Curated 8-item subset of fancycomponents.dev (danielpetho/fancy, MIT) — physics gravity scenes, gooey/pixelate SVG filter primitives, and text/elements/marquees flowing along arbitrary SVG paths. WILD TIER: showpieces. One per page, never in dashboards. Vendored copies are a PATCHED FORK — never re-fetch from the live site.

## At a glance
- **What**: 8 components + 6 support hooks/utils snapshotted from `fancycomponents.dev/r/{name}.json`, pinned to danielpetho/fancy `f9f62c6` (2026-03-14). Physics: `gravity`, `cursor-attractor-and-gravity`, `elastic-line`. Filters: `gooey-svg-filter`, `pixelate-svg-filter`. Path-following: `text-along-path`, `element-along-svg-path`, `marquee-along-svg-path`.
- **Curated subset is LAW**: the entire ~25-item fancy text tier is excluded by default — every fancy text effect LOST its head-to-head source read against an existing vendored counterpart (`scramble-hover` is a strict feature subset of reactbits `DecryptedText`: same lineage, fewer triggers, in-place state-Set mutation). A second, worse home for the same effect is a routing regression, so do NOT re-vendor them ad hoc. Any future fancy item (drag-elements, screensaver, image-trail…) enters ONLY after a documented source-level win over its closest `components.tsv` counterpart (adding-a-source.md step 3). Default answer: no.
- **Patched fork**: vendored payloads carry four `PATCHED(alex-style)` fixes upstream still ships broken — (1) `registryDependencies` rewritten from absolute fancycomponents.dev URLs to local `vendor/fancy/r/` paths; (2) missing `"use client"` added to all three path-following components (they use motion/React hooks and fail as RSC imports upstream); (3) CJS `require` of poly-decomp → static ESM import (upstream throws `require is not defined` at runtime on Vite/ESM); (4) full-lodash import → `lodash.debounce`. Every item carries a `_vendoredFrom` stamp and patched items a `_patches` list; the catalog build refuses unstamped copies. **Re-fetching any item from the live site reintroduces all four defects.**
- **License**: MIT, (c) 2024 Daniel Petho (`vendor/fancy/LICENSE`). Single-maintainer upstream, slow cadence — we own the fork's maintenance.
- **Index**: rows live in `vendor/_index/components.tsv`, source `fancy`, every description prefixed `wild:` so these are reached intentionally, never as an accidental first grep hit.
- **Project deps**: physics items — `matter-js` + `@types/matter-js` (a real npm dep, same pattern as vanta's three.js: fine), `poly-decomp`, `svg-path-commander`, `lodash.debounce` (NOT `lodash` — patched). elastic-line + path trio — `motion` only. Filters — zero deps.

## Routing (law)
- **Physics / falling / draggable elements → `gravity` + `MatterBody` is PRIMARY.** reactbits `FallingText` is demoted to text-only use: its rAF loop is never cancelled on unmount (runs forever) and it double-steps the engine (`Runner.run` AND manual `Engine.update` per frame) — confirmed defects. Never copy FallingText's loop pattern into new code; `gravity`'s cleanup is the reference implementation.
- **Gooey/liquid/metaball or pixelate/8-bit treatments → the filter primitives here** (reactbits GooeyNav bakes its filter into one nav component; these are reusable on anything).
- **Text/elements/logos along a curve → the path trio** (reactbits `CurvedLoop` is a fixed-curve marquee only; these take any path `d`, auto-loop or scroll-driven).
- **WILD TIER discipline**: ONE fancy showpiece per page (it takes the page's showpiece slot — shader OR wild, not both; see recipes.md #statement-hero). Hero, section divider, 404, footer easter egg — yes. **Dashboards/app surfaces: BANNED** (recipes.md #dashboard-shell excludes the wild tier outright). Never as body-text/content furniture.
- Text effects fancy also ships (scramble, rotate, typewriter, letter-swap, highlighter, marquee…) → grep `components.tsv`; the reactbits/magicui versions are equal or better and already vendored.

## How to consume (token discipline)
```bash
awk -F'\t' '$1=="fancy"' vendor/_index/components.tsv     # all 8, wild:-prefixed
grep -i "wild:" vendor/_index/components.tsv               # wild tier across the arsenal
bash scripts/get-component.sh vendor/fancy/r/gravity.json --deps
```
Copy `.files[0].content` to the path in `.files[0].path` (`fancy/physics/…`, `fancy/blocks/…`). **fancy's `registry_deps` are LOCAL vendored files** (`vendor/fancy/r/calculate-position.json` etc.), not shadcn part names — copy each one's payload too (their paths: `utils/…`, `hooks/…`). Never point a shadcn CLI at fancycomponents.dev: live payloads are unpatched.

## Core usage — the recipes upstream omits (MANDATORY)

### Physics: reduced-motion + viewport gating (gravity / cursor-attractor)
No fancy component handles `prefers-reduced-motion` (grep-verified across all 14 files), and `autoStart` defaults to `true` — never ship that default. Law: `autoStart={false}`; `start()` only behind a reduced-motion check AND an IntersectionObserver; `stop()` off-screen and on unmount.
```tsx
"use client"
import { useEffect, useRef } from "react"
import Gravity, { MatterBody, type GravityRef } from "@/fancy/physics/gravity"

export function PhysicsMoment() {
  const g = useRef<GravityRef>(null)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return   // ships as a static composition
    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? g.current?.start() : g.current?.stop())         // no off-screen rAF/engine work
    if (box.current) io.observe(box.current)
    return () => { io.disconnect(); g.current?.stop() }
  }, [])
  return (
    <div ref={box} className="relative h-[60vh] overflow-hidden">        {/* contained, never full-bleed over scroll */}
      <Gravity ref={g} autoStart={false} className="h-full w-full">
        <MatterBody x="30%" y="10%"><span className="rounded-full border px-4 py-2">shipped</span></MatterBody>
        <MatterBody x="60%" y="0" bodyType="circle"><span className="text-3xl">●</span></MatterBody>
      </Gravity>
    </div>
  )
}
```
`gravity`'s own unmount cleanup is sound (verified: cancels its frameId, `Mouse.clearSourceEvents`, `Render.stop`, `Runner.stop`, `World.clear`, `Engine.clear`) — the defect class to never reintroduce is FallingText's uncancelled rAF. `reset()` re-seeds bodies at their start positions; `bodyType="svg"` builds vertex bodies from SVG children.

### SVG filters: Safari fallback (gooey / pixelate)
Upstream's own docs confirm **NO Safari support** ("the component doesn't support Safari, so you'll need to create a fallback"). This cannot be feature-queried — `CSS.supports("filter","url(#id)")` returns true in Safari while rendering is broken — so the honest gate is UA detection, and the fallback must be a DESIGNED static state (unfiltered layout, plain blur, or nothing), not a broken half-render:
```tsx
const isSafari = typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
// render the filter defs only off-Safari; apply the filter conditionally
{!isSafari && <GooeySvgFilter id="goo" strength={12} />}
<nav style={{ filter: isSafari ? undefined : "url(#goo)" }}>…</nav>
```
Keep filtered regions padded — SVG filter regions clip at their bounds. `id` must be unique per page; two identical filter ids cross-corrupt (same trap as svgl inline ids).

### Mobile / touch (pointer-based components)
- `cursor-attractor-and-gravity` and `elastic-line` are pointer-driven; touch devices have no persistent cursor. Ship a touch fallback: gate to `matchMedia("(pointer: fine)")` and render the static/`gravity` variant otherwise, or accept attract-to-`attractorPoint` only (its default is center, which works without a mouse).
- **Never full-bleed physics over scrollable mobile content**: `Mouse.create` attaches unconditionally (even with `isDraggable={false}`) and its touch handlers eat page scroll over the canvas. Contain physics in a fixed-height, non-scrolling section (as in the recipe above).

## Pitfalls
- `MatterBody` re-registers its body when its parent re-renders (effect deps include fresh object-literal defaults) — the simulation resets. Fine in static heroes; keep physics out of frequently-re-rendering state trees.
- Known upstream defect NOT patched (cosmetic): `grabCursor` mousedown/mouseup listeners are re-added on every resize without removal. Avoid rapid programmatic resizes of physics containers.
- `_patches`/`_vendoredFrom`/`PATCHED(alex-style)` markers are load-bearing — the catalog build fail-louds without them. Never strip them "for cleanliness"; keep the comments when copying into projects (they explain non-upstream lines to future readers).
- matter-js + poly-decomp + svg-path-commander is the heaviest dep set of any vendored component (~100KB min) — one more reason for one-showpiece-per-page.
- Path trio + SMIL: `text-along-path`'s auto-loop uses SMIL `<animate>`; scroll-driven mode uses motion `useScroll` — pick one mode, don't stack both on a page with Lenis-driven scroll effects.

## Refresh / fallback
- `bash scripts/sync.sh fancy && node scripts/build-catalogs.mjs` — re-fetches ONLY the curated list (fancycomponents.dev 308-redirects to www; the sync fetch follows it), re-applies all four patches with fail-loud anchor checks, re-verifies MIT at the pinned commit. If a patch anchor moved upstream, sync refuses and keeps the previous copy — re-audit the patch, never loosen the gate.
- Bumping `FANCY_COMMIT` in sync.sh is a deliberate edit: re-run the patch-anchor audit first. Upstream is single-maintainer and slow (last push 2026-03-14); quarterly checks suffice.
- Adding ANY new fancy item = full adding-a-source.md step-3 head-to-head vs its closest vendored counterpart, documented in this card. The text tier already lost — that verdict stands unless upstream ships a rewrite.
