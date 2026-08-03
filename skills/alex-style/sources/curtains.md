# curtains.js — DOM-synced WebGL planes
> Real page-flow `<img>`/`<video>`/`<canvas>` elements become distortable WebGL planes (scroll-bend, hover flowmap ripple, GSAP fullscreen gallery morph — the signature award-site pattern). The arsenal's FIRST and ONLY source for the DOM-synced WebGL class.

## At a glance
- **What**: `curtainsjs` **pinned 8.1.6** — zero-dep WebGL1/2 library that turns DOM media into planes with automatic position/size/scroll sync. NOT three.js-based: it can never collide with the vanta r134 trap or any three version. Frozen upstream (maintenance-mode final release; author's energy is on gpu-curtains) — pin exact, expect no fixes; the 482-line core class is small enough that the arsenal owns patches in-vendor if a browser ever regresses.
- **License**: MIT (`vendor/curtains/LICENSE.txt`).
- **Vendored** (`vendor/curtains/`, ~2.1MB): `dist/curtains.umd.min.js` (125KB, zero-build) + `dist/curtains.umd.js`; full `src/` ESM tree (34 files — what `npm i curtainsjs` resolves); `documentation/` (18 offline HTML pages — grep-only, see below); `examples/` (10 audited reference dirs, third-party runtimes STRIPPED — see `examples/VENDOR-NOTE.md`); LICENSE/README/CHANGELOG/package.json.
- **Project deps**: none. npm: `npm i curtainsjs@8.1.6` — **ESM-only** (`exports: './src/index.mjs'`, no CJS build; `require('curtainsjs')` fails — same accepted pattern as shadergradient). Zero-build: one `<script src>` of the UMD file; it attaches `Curtains`, `Plane`, `ShaderPass`, `PingPongPlane`, `Texture`… directly to `window`.

## Routing (law)
- **'DOM-synced WebGL / image-scroll-hover distortion' routes ONLY here.** Three-way boundary, recorded as data so it never blurs:
  - CUSTOM-shader / scroll-synced distortion of EXISTING page media → **curtains** (this card).
  - PRESET post-effects on DOM media (glitch, duotone…) → **vfx-js**.
  - Standalone generative BACKGROUNDS → **paper-shaders** (default) / vanta / shadergradient — curtains never generates ambience; it distorts media the page already has.
- reactbits `GridDistortion`/`FlyingPosters` stay widget answers (prop-fed isolated canvases, not page-flow enhancement); hover-distortion wrapper libraries stay rejected — that genre is a curtains recipe, not a new source.
- A curtains canvas **spends the page's one-WebGL-surface budget** (recipes.md `#media-distortion`) — never stack it with vanta/paper-shaders/vfx-js on the same viewport region.
- Custom shader noise (flow, grain, voronoi displacement) imports from the arsenal's sanctioned shader-noise source (stegu webgl-noise/psrdnoise card) — NEVER transcribed from Shadertoy/blogs (CC-BY-NC contamination).

## Failure mode is the feature (verify it, don't fear it)
No WebGL, JS error, or reduced-motion skip → visitors see the ORIGINAL `<img>`/`<video>`, a normal working page — the inverse of vanta/shadergradient's blank-canvas risk. This only holds if you wire it:
```css
.plane img { opacity: 0; }              /* hidden only while WebGL drives the texture */
.no-curtains .plane img { opacity: 1; } /* fallback: the original element simply shows */
```
```js
const curtains = new Curtains({
  container: 'canvas',                                  // fixed full-page canvas host div
  pixelRatio: Math.min(1.5, window.devicePixelRatio),   // MANDATORY cap ≤1.5–2 (perf)
})
  .onError(() => document.body.classList.add('no-curtains'))  // ALWAYS set — fallback class
  .onContextLost(() => curtains.restoreContext())             // ALWAYS set — GPU eviction recovery
```
Verify before ship: force-disable WebGL (Chrome DevTools → Rendering → emulate `--disable-webgl`, or Safari develop menu) and confirm the untouched originals render. The arsenal eval fixture asserts exactly this.

## Core usage — mandatory gates in EVERY build
**1. Reduced-motion: skip plane creation entirely** (grep-verified: the library has ZERO built-in `prefers-reduced-motion` handling — this gate is card law, not library behavior; the DOM fallback then serves motion-sensitive users automatically):
```js
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.plane').forEach((el) =>
    new Plane(curtains, el, { vertexShader, fragmentShader }))  // <img data-sampler="uTexture"> inside .plane
}
```
**2. Lenis wiring — THE canonical custom-scroll pattern.** The vendored custom-scroll example used locomotive-scroll; sync STRIPPED it (arsenal law: ONE smoothing layer = lenis) and this recipe supersedes it 1:1:
```js
const curtains = new Curtains({ container: 'canvas', watchScroll: false,   // lenis owns scroll
  pixelRatio: Math.min(1.5, window.devicePixelRatio) })
const lenis = new Lenis()                        // rAF loop per sources/lenis.md
lenis.on('scroll', ({ scroll }) => {
  curtains.updateScrollValues(0, scroll)         // feed lenis' position to every plane
  curtains.needRender()                          // render-on-demand: draw only while scroll moves
})
curtains.disableDrawing()                        // idle = zero GPU work; needRender() wakes frames
```
**3. React — no wrapper dep exists or is needed.** Client-only init, full disposal on unmount:
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { Curtains, Plane } from 'curtainsjs'     // npm i curtainsjs@8.1.6 (ESM-only)
export function DistortedMedia() {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {                              // never at module top level — DOM-only lib
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const curtains = new Curtains({ container: 'canvas', pixelRatio: Math.min(1.5, window.devicePixelRatio) })
      .onError(() => document.body.classList.add('no-curtains'))
      .onContextLost(() => curtains.restoreContext())
    new Plane(curtains, el.current!, { vertexShader, fragmentShader })
    return () => curtains.dispose()              // disposes renderer + scroll manager (StrictMode-safe)
  }, [])
  return <div ref={el} className="plane"><img src="/photo.jpg" alt="…" data-sampler="uTexture" /></div>
}
```

## How to consume (token discipline)
1. API lookups: **grep `vendor/curtains/documentation/*.html` by class/method name** (`grep -l 'setRenderTarget' vendor/curtains/documentation/*.html`), then read only the matched region. **NEVER read a doc page whole** — 18 pages total ~1MB; `plane-class.html` alone is 172KB.
2. Working patterns: read ONE example setup file (`vendor/curtains/examples/<dir>/js/*.setup.js`, 3–24KB each) — they are production-grade (fallback class, context-lost recovery, `onLeaveView`/`onReEnterView` frustum culling, render-on-demand), not demos. Examples are reference reading, not runnable-as-is (media + stripped runtimes).
3. Ship it: zero-build copies `dist/curtains.umd.min.js`; npm installs the exact pin. Never read `dist/*.js`.

## Pitfalls
- **ESM-only on npm** — no CJS. Bundlers and Vite are fine; `require()` fails. Zero-build uses the UMD file.
- **WebGL1-era GLSL conventions** (`uMVMatrix`, `aVertexPosition`, `uTextureMatrix0`) differ from three/OGL naming — don't mix shader snippets across sources in one page without renaming.
- The stripped gsap gallery example references a deleted bundled `gsap.min.js` — load GSAP per `sources/gsap.md` (pinned spine), never re-fetch the stale copy.
- Video planes: call `plane.playVideos()` from a user gesture on mobile (autoplay policy); pair with `#hero-video` poster law.
- Don't init inside SSR or at import time; don't skip `dispose()` on unmount — contexts leak toward the browser's 8–16 WebGL-context cap.

## Refresh / fallback
- `bash scripts/sync.sh curtains` — re-fetches the pinned npm tarball (version+MIT gates, exact 125,310-byte UMD check) + the pinned-commit repo tarball (docs/examples; cross-checks the commit's package.json == 8.1.6), strips locomotive-scroll/gsap dupes with post-strip gates, keeps the previous copy on any miss.
- Upstream is FROZEN: no tags exist, so `CURTAINS_COMMIT` in sync.sh is the docs pin. A version bump would be an upstream surprise — treat it as a re-audit trigger, not a routine refresh.
- **WATCH-LIST — gpu-curtains (WebGPU successor, same author): NOT a peer, never re-propose it as a parallel adoption.** Verified Aug 2026: WebGPU-only with NO fallback (its "compatibility mode" is WebGPU-compat, not WebGL) — ~18% of visitors would get a blank canvas, recreating the vanta-r134 silent-failure class at the browser level, plus 0.x API churn. Re-audit ~2027 (trigger: WebGPU default-on across Firefox platforms AND iOS 26+ majority share) as slot SUCCESSOR replacing curtains.js — never alongside it.
