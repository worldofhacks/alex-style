# Atropos — layered 3D hover-depth scenes
> Multi-plane 3D hover SCENES @ 2.0.2 (MIT, zero-dep, 8.6KB working core): children with `data-atropos-offset` translate at different depths under one cursor-driven rotation, plus a projected shadow plane and a moving highlight sweep. A different GENRE from single-plane tilt — plain tilt keeps routing to reactbits `TiltedCard` / motion-primitives tilt.

## At a glance
- **What**: `atropos` **pinned 2.0.2** (nolimits4web) — 482-line zero-dependency core; vanilla UMD/ESM, React wrapper, and web-component variant all ship in ONE npm tarball. Per-layer engine verified in source: children carrying `[data-atropos-offset]` get `translate3d` proportional to rotation x offset (`atropos.mjs` ~line 197); shadow/highlight planes are created (and re-used, never duplicated) at init.
- **License**: MIT, (c) 2021 Vladimir Kharlampidi (`vendor/atropos/LICENSE`). Verified MIT at ALL 23 published versions — relicense history clean.
- **Vendored** (`vendor/atropos/`, ~91KB): 15-file curated allowlist — `atropos.{mjs,min.mjs,js,min.js}`, `atropos-react.mjs`, `atropos-element.{mjs,min.mjs}`, `atropos.{css,min.css}`, three `.d.ts`, `LICENSE`, `README.md`, `package.json` — plus `PIN.json` (per-file byte pins + tarball sha1). Excluded structurally: sourcemaps, `.scss`/`.less`, the element UMD builds, and any stray artifact (the round-2 audit reported a 572KB `axe.min.js` inside the upstream tarball; the registry tarball at the pinned sha1 carries none — the allowlist excludes it either way).
- **Index**: card-only source — NO TSV. This card is the route; the class boundary below is what keeps it from diluting `components.tsv` greps.
- **Project deps**: zero. React → `npm i atropos@2.0.2` (exact pin), `import Atropos from 'atropos/react'`. Vanilla/zero-build → copy `vendor/atropos/atropos.min.js` + `atropos.min.css`, one constructor call. CDN fallback (ordinary pages only): `https://cdn.jsdelivr.net/npm/atropos@2.0.2/atropos.min.js` + `.../atropos.min.css` — never unpinned.
- **Feature-frozen upstream** (last feature release 2023-07; repo alive): with zero deps and a 482-line surface, if a browser change ever bites, the fix is a PATCH IN VENDOR (marked `PATCHED(alex-style)`), not a version float.

## Routing (law) — the three-way depth boundary
- **Layered 3D hover SCENE** (multiple planes at different depths, shadow/highlight, product showcase / depth card) → **HERE, only here**. No other source produces this genre (verified head-to-head: reactbits `TiltedCard-TS-TW` is image-only single-plane with a hardcoded mobile warning; motion-primitives tilt is single-plane).
- **Single-plane tilt** (one image/card tilting as a unit) → reactbits `TiltedCard` / motion-primitives `tilt` via `components.tsv` — do NOT upgrade plain tilt to Atropos; a one-plane scene wastes its rAF loop for no visual gain.
- **Physics floating/falling/draggable elements** → grep `components.tsv` (e.g. reactbits `FallingText-TS-TW`); that is simulation, not hover depth.
- Scroll-driven parallax stays with GSAP ScrollTrigger + Lenis; Atropos is pointer-driven only (no scroll inputs).

## When to use / when NOT
Use for: hero product cards, feature/showcase cards with 2–4 depth layers, portfolio depth tiles (the layered-scene tier above TiltedCard), 3D-feeling CTAs on static pages (zero-build path is first-class).
NOT for: dashboards/app surfaces (decoration budget), lists/grids of many cards without the IntersectionObserver recipe below, anything inside an actively scrolling container (drift pitfall), plain tilt (routing law), touch-first surfaces where the hover is the ONLY affordance (design a static composition fallback — the scene must read as a card when nothing moves).

## How to consume (token discipline)
Zero-build — two file copies + one constructor (markup shape is REQUIRED: `atropos > atropos-scale > atropos-rotate > atropos-inner`):
```html
<link rel="stylesheet" href="/atropos/atropos.min.css">
<div class="atropos" id="card">
  <div class="atropos-scale"><div class="atropos-rotate"><div class="atropos-inner">
    <img data-atropos-offset="-4" src="bg.webp" alt="">      <!-- negative = deeper -->
    <h3   data-atropos-offset="0">Mid plane</h3>
    <img data-atropos-offset="6" src="fg.webp" alt="">       <!-- positive = closer -->
  </div></div></div>
</div>
<script src="/atropos/atropos.min.js"></script>
<script>
  // MANDATORY reduced-motion gate — the library has ZERO built-in
  // prefers-reduced-motion handling (grep-verified across all builds).
  // Skipped init degrades to a perfectly fine static card.
  const rm = matchMedia('(prefers-reduced-motion: reduce)')
  let card = rm.matches ? null : Atropos({ el: '#card', rotateTouch: 'scroll-y' })
  rm.addEventListener('change', () => {                     // destroy() if the user flips it mid-session
    if (rm.matches) { card?.destroy(); card = null }
    else card ??= Atropos({ el: '#card', rotateTouch: 'scroll-y' })
  })
</script>
```
React — `npm i atropos@2.0.2`, wrapper renders the scale/rotate/inner shells for you (init in `useEffect`, `destroy()` on cleanup — StrictMode-safe, verified in the vendored `atropos-react.mjs`):
```tsx
'use client'
import Atropos from 'atropos/react'
import 'atropos/css'
import { useSyncExternalStore } from 'react'

const rmStore = {
  subscribe: (cb: () => void) => { const m = matchMedia('(prefers-reduced-motion: reduce)'); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) },
  getSnapshot: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
}
export function DepthCard() {
  const still = useSyncExternalStore(rmStore.subscribe, rmStore.getSnapshot, () => false)
  const layers = (<>
    <img data-atropos-offset="-4" src="/bg.webp" alt="" />
    <h3 data-atropos-offset="0">Mid plane</h3>
    <img data-atropos-offset="6" src="/fg.webp" alt="" />
  </>)
  if (still) return <div className="relative">{layers}</div>          // static composition, same layout
  return <Atropos rotateTouch="scroll-y" className="relative">{layers}</Atropos>
}
```
Reading the source: `atropos.d.ts` (932B) for the full options surface; `atropos.mjs` only when patching in-vendor or debugging. Never read the `.min.*` files.

## Non-optional defaults (law, with the why)
1. **Reduced-motion gate (above) is MANDATORY** — grep-verified: zero `prefers-reduced-motion`/`matchMedia` anywhere in the library. Skip init (or `destroy()` on change). Vendor-time smoke test proves the skipped-init card still renders as a static composition.
2. **`rotateTouch: 'scroll-y'` is the default posture for in-page cards** — the library default `rotateTouch: true` sets `touch-action: none` on the card and EATS page scroll on mobile. `'scroll-y'` maps to `touch-action: pan-y` (vertical scroll survives); a mostly-horizontal gesture (≤45°) still claims rotation for that gesture only — this brief `touch-action:none` during a claimed gesture is BY DESIGN, don't "fix" it. Use bare `true` only for full-screen/modal scenes where nothing scrolls behind.
3. **Cap ~6–8 instances per page** — every instance runs a PERPETUAL rAF loop from construction, even idle (the internal style queue self-reschedules unconditionally, `atropos.mjs` ~lines 97–113; `destroy()` is the only off-switch). In grids, destroy/re-init offscreen cards:
```js
const options = { el: card, rotateTouch: 'scroll-y' }
let inst = null
new IntersectionObserver(([e]) =>
  e.isIntersecting ? (inst ??= Atropos(options)) : (inst?.destroy(), inst = null)
).observe(card)
// safe: destroy() removes all 8 listeners + cancels the rAF + deletes el.__atropos__;
// re-init re-uses the existing shadow/highlight planes (source-verified, no duplication)
```

## Pitfalls
- **Scroll-while-hover origin drift**: the bounding rect is cached at pointerenter (`atropos.mjs` ~line 221) and only invalidated on leave — scrolling while hovering drifts the rotation origin (upstream issue #43). Never mount inside actively scrolling containers (Lenis-smoothed sections included); page-level scroll is fine because hover + scroll rarely overlap there and the drift resets on re-enter.
- Vanilla markup shape is load-bearing: init silently no-ops the depth planes if `.atropos-scale/.atropos-rotate/.atropos-inner` are missing (the React/web-component variants render them for you).
- `destroy()` does not remove the shadow/highlight DOM or touch classes — harmless for re-init (planes are re-used), but remove the nodes yourself if you're tearing the card down to plain markup.
- `data-atropos-offset` is a percentage multiplier, not px: keep it in the −6…+8 range; big values shear layers outside the card bounds. `data-atropos-opacity="0;1"` fades layers with rotation.
- Web-component variant (`atropos-element.mjs`) exists and is vendored, but the vanilla + React paths are the sanctioned routes; don't mix variants on one page.
- SSR: all builds touch DOM only at init (module top-level is clean) — init client-side only; the React wrapper already does.

## Refresh / fallback
- `bash scripts/sync.sh atropos` — re-fetches the pinned tarball; gates: registry sha1 `8024e84…`, version == 2.0.2, MIT in package.json AND license text, zero-dep invariant, all 15 allowlisted files at EXACT byte pins, total inside 80–200KB. Any miss keeps the previous copy (verified: 404, sha mismatch, and byte-drift paths all keep it).
- Bumping `ATROPOS_VERSION` is a deliberate edit: re-run the adding-a-source audit, re-pin sha1 + all 15 byte sizes in `sync_atropos`, and re-run the browser smoke suite (3-layer offsets, gesture claim, reduced-motion skip; Chromium 151 + Firefox 153 both passed at vendor time 2026-08-03 — the 2021-era upstream Firefox issue is confirmed stale).
- Upstream is feature-frozen: expect no fixes. A future browser regression gets a `PATCHED(alex-style)` in-vendor fix with fail-loud anchors, never a float to an unaudited version.
