# VFX-JS — preset WebGL post-effects on REAL DOM media
> `@vfx-js/core` **pinned 1.1.0** (MIT, zero deps) — glitch, RGB-shift, duotone, halftone & 22 total preset shaders applied to real page-flow `<img>`/`<video>`/`<canvas>`/text with one line of JS per element. The media-FX class: it transforms CONTENT, never generates backgrounds.

## At a glance
- **What**: one `VFX` instance = ONE fullscreen overlay canvas (z-index 9999, `pointer-events:none`, scroll-synced via per-frame transform) + ONE rAF loop; each `vfx.add(el, {shader})` draws that element's pixels through a GLSL preset at its live layout rect. 22 effect presets ship in `lib/esm/constants.js` (more than the docs claim — `rgbGlitch`, `invert`, `grayscale`, `vignette`, `chromatic` are undocumented; audited 2026-08-03). Uniform values may be FUNCTIONS — they are re-evaluated every frame, which is the scroll/pointer hook.
- **License**: MIT at every one of the 23 published versions (relicense history clean, verified in the registry). The 0.1.0-era `three@^0.165` dependency was **removed at 0.13.0** — 1.x is dependency-free, so no r134-class version-interplay trap is possible; `sync.sh` hard-fails if a runtime dep ever reappears. Wart: the package internally vendors a port of matt-way/gifuct-js (MIT) without its upstream copyright header — recorded in `licenses.tsv`, inherited when redistributing.
- **API BOUNDARY**: 1.0.0 (2026-05-16) broke the 0.x API. **This card is 1.x law; nearly every online snippet older than May 2026 uses the dead 0.x API** (`new VFXCore()`, three-based internals) — never copy them. Pin `1.1.0` exactly.
- **Vendored** (`vendor/vfx-js/`, ~372KB): `lib/esm/` runtime + `.d.ts` (69 files — tests/sourcemaps/cjs excluded), `LICENSE`, `README.md`, `package.json`. Runtime JS is 288KB raw / **~59KB gzip** (measured).
- **Index**: `vendor/_index/vfx-presets.tsv` — 22 rows: `preset, class, character, animation, uniform_params, mobile_safe, use_case`.
- **Project deps**: `npm i @vfx-js/core@1.1.0` (exact pin; zero transitive deps). Zero-build: `import { VFX } from "https://esm.sh/@vfx-js/core@1.1.0"` or jsdelivr `+esm` — pinned URL only, never floating.

## Routing (law)
- **Preset effects ON media/content** (hover-glitch tile, scroll-linked duotone footage, VHS RGB-shift video, shader enter/leave transitions on gallery images) → **HERE**, and only here.
- **Custom-shader / DOM-synced scroll distortion** (scroll-velocity image bending, hover flowmap ripple, fullscreen gallery morph with authored GLSL) → **curtains.js**. The boundary is preset-vs-custom and overlay-vs-plane: if you are writing GLSL or syncing plane geometry to scroll, it is curtains; if you are picking a named preset for real media, it is vfx-js.
- **Background generation** stays Paper Shaders (default) / vanta (pointer-reactive 3D) / shadergradient (R3F URL reproduction) — vfx-js is NEVER a background answer.
- **Text effects**: text mode is EXPERIMENTAL (`<foreignObject>` capture — fails on deeply nested elements). Single display headlines only, presets tagged `text-headline-EXPERIMENTAL` in the TSV; body copy and nested markup are banned. Ordinary text animation keeps routing to reactbits/magicui/GSAP SplitText.
- **One effect vocabulary per page** — same discipline as the one-text-effect rule: pick ONE preset family (e.g. glitch) for the page's media treatment; never mix glitch tiles with duotone footage and spring logos on one surface.
- `@vfx-js/effects` (separate package) is NOT adopted — do not install; it needs its own audit.

## Perf budget (measured 2026-08-03, live harness — law)
- **Cap ~3 registered elements per page** (hero video + 2 tiles is the ceiling). Per frame the player does: full canvas-size recompute + scroll re-sync (layout reads incl. `body.scrollHeight` — deliberate, iOS Safari address-bar workaround at `vfx-player.js` render()), one `getBoundingClientRect()` PER element, every uniform-function call, and for `<video>`/GIF a full-frame GPU texture re-upload. Offscreen elements are viewport-culled (`!hit.isVisible → continue` — verified in source and live: culling works).
- **Default `pixelRatio` is `window.devicePixelRatio`** — NOT a fixed 2. On a dPR-3 phone the overlay framebuffer is **9× the pixels** of `pixelRatio: 1` (measured: 14.3MP vs 1.6MP backing store on the same viewport; the canvas also pads 10% beyond the viewport each side by default). **Mobile law: `new VFX({ pixelRatio: 1 })`** on touch/narrow, and prefer `mobile_safe: yes` presets — `halftone` (15 texture taps/fragment) is desktop-only; `glitch`/`sinewave` are `caution`.
- Scroll-perf sample (audit-blocking condition, measured): hero `<video>` + scroll-linked duotone uniform + 2× glitch + 1× rgbShift — median frame 8.3ms, p95 9.3ms, zero dropped frames at 120Hz, desktop Chromium, at pixelRatio 1, 2 AND 3. Low-end mobile GPUs were NOT directly measured (no device in the audit loop) — the 9× fill-rate reduction at `pixelRatio: 1` is the measured lever; treat phones as fill-bound and cap accordingly.
- **The overlay canvas spends the page's ONE-WebGL-surface budget.** Never stack vfx-js over the same viewport region as curtains/vanta/paper-shaders canvases; a page gets one WebGL answer (recipes.md law).
- Stacking contexts: the overlay is `absolute` (or `fixed` with `scrollPadding: false`) at z-index 9999 on `document.body`. Sticky/fixed UI above 9999 will float over your effects; modals/menus below it will have effects drawn on top. Set `zIndex` in the constructor to slot the canvas into the page's layer plan — decide this at design time, not after the bug report.

## Core usage — the gates the library omits (MANDATORY in every build)
Grep-verified: the library has **zero built-in `prefers-reduced-motion` handling** and the bare constructor **throws** without WebGL. Every recipe ships BOTH gates:

```js
// 1) reduced-motion gate: skip vfx.add() entirely — the plain playing media
//    IS the design under the media query (never freeze mid-effect)
// 2) VFX.init() null-check pattern — returns null when WebGL is unavailable
//    (verified live); never `new VFX()` unguarded, it throws
import { VFX } from "@vfx-js/core";      // @1.1.0

let vfx = null;
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  vfx = VFX.init({ pixelRatio: matchMedia("(pointer: coarse)").matches ? 1 : undefined });
  vfx?.add(document.querySelector("#hero-img"), { shader: "glitch" });
}
// no WebGL / reduced motion → vfx is null and the original media renders untouched
```

Scroll-driven uniforms compose with GSAP ScrollTrigger — uniform FUNCTIONS are evaluated every frame, so hand them a ScrollTrigger-owned value; do NOT create a second scroll listener:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const state = { p: 0 };
ScrollTrigger.create({
  trigger: "#footage", start: "top bottom", end: "bottom top",
  onUpdate: (self) => (state.p = self.progress),
});
vfx?.add(document.querySelector("#footage"), {
  shader: "duotone",
  uniforms: {
    color1: [0.08, 0.08, 0.42, 1], color2: [1.0, 0.85, 0.7, 1],
    speed: () => state.p,            // re-read every frame by the player
  },
});
```

React/Next (client-only — the constructor touches `document`): **`remove()` every element, THEN `destroy()`** — measured: `destroy()` alone does NOT restore element opacity, and the page's real media stays invisible (`opacity: 0`, video `0.0001`):

```tsx
"use client";
useEffect(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const vfx = VFX.init({});
  if (!vfx) return;                       // no WebGL → plain media, done
  const el = ref.current!;
  vfx.add(el, { shader: "rgbShift" });
  return () => { vfx.remove(el); vfx.destroy(); };  // remove FIRST — destroy() alone leaves el at opacity 0
}, []);
```

## Graceful degradation (verified live)
No WebGL → `VFX.init()` returns `null` and the original `<img>`/`<video>` renders completely untouched — the fallback IS the page. Same for the reduced-motion gate (add() never runs). This inverts the vanta/shadergradient blank-canvas failure mode; there is nothing to design a fallback FOR, provided the two gates above are present and you never use the throwing constructor.

## Pitfalls
- **`destroy()` does not un-hide media** (measured): registered elements keep inline `opacity: 0` (video `0.0001`) after `destroy()`. Always `vfx.remove(el)` per element first. Teardown WAS verified clean otherwise: zero leaked canvases, zero still-scheduled rAF after destroy.
- **0.x snippets are poison** — anything pre-May-2026 (most blog posts, the Codrops-era articles) targets the rewritten-away API. Author from this card and the vendored `.d.ts` only.
- `add()` on an `<img>` waits for `load`, `<video>` for `canplay` — on SSR/hydration call after mount; changing `img.src` later needs `vfx.update(el)` (videos refresh automatically).
- Uniform functions run EVERY frame on the rAF — keep them O(1) reads (no layout reads, no allocation); feed them from ScrollTrigger/lenis state as above.
- The overlay canvas covers the viewport even for one 100px element — the fill cost is viewport-sized, not element-sized. Small accent effects on huge pages still pay full-canvas clear each frame; budget by page, not by element size.
- `scrollPadding: false` switches the canvas to `position: fixed` (no per-frame transform sync) — cheaper, but effects clip exactly at the viewport edge during fast scrolls.
- GIF sources route through the internal gifuct-js port and re-upload per frame like video — treat an animated GIF as a video for the element cap.
- Transitions (`*Transition` presets) are driven by auto-fed `enterTime`/`leaveTime`/`intersection` uniforms on viewport enter/leave — they need no scroll wiring; do not also animate the same element with ScrollTrigger.

## Refresh / fallback
- `bash scripts/sync.sh vfx-js && node scripts/build-catalogs.mjs` — re-fetches the pinned tarball; gates: exact version, MIT license text, **zero runtime deps** (tripwire for a returning three.js dep), 69-file/300KB curation floor, all 23 shader keys present, `VFX.init`/rAF-cancel contracts greppable. Any miss keeps the previous copy.
- Bumping `VFX_JS_VERSION` is a deliberate edit: re-read the upstream CHANGELOG for API/preset changes, re-run the preset extraction against `constants.js` (the TSV builder fail-louds on any drift, both directions), and re-measure the file-count gate. Never bump below 1.0.0.
- Upstream: github.com/fand/vfx-js (active — 10 releases in 2026). Docs: amagi.dev/vfx-js (1.x). The docs UNDER-list the shipped presets; `constants.js` is authoritative.
