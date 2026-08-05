# Paper Shaders — print-register shader textures & gradient fields
> 29 zero-dependency WebGL2 shaders @ 0.0.78 (`@paper-design/shaders` + `@paper-design/shaders-react`, Apache-2.0): grain gradients, paper/halftone/dither textures, mesh/radial gradient fields, plus a vivid set (liquid metal, god rays, metaballs…). THE default for print-texture and 2D gradient-field backgrounds; representational 3D scenes stay with vanta, deformed 3D gradient planes with shadergradient.

## At a glance
- **What**: two npm packages, **pinned 0.0.78** (paper.design) — core is a 510-line readable `ShaderMount` (vanilla, one canvas per instance) + one fragment shader module per effect; react package wraps each shader as a JSX component (`GrainGradient`, `PaperTexture`, `Dithering`, …) with `"use client"` baked into the dist. Zero runtime deps (verified in both package.json). Core dist is 100% relative-import ESM — works as a native `<script type="module">` with no build step. Noise texture ships as a base64 data-URI (`get-shader-noise-texture.js`) — zero network at runtime.
- **License**: Apache-2.0, (c) 2026 Paper (`vendor/paper-shaders/core/LICENSE` + `NOTICE`). First non-MIT/BSD code source in the arsenal: redistribution is fine but LICENSE **and** NOTICE must travel with any redistributed copy — both are vendored in both packages and allowlist-protected; never strip them.
- **Vendored** (`vendor/paper-shaders/`, ~551KB): `core/` (82 files) + `react/` (76 files) — all dist JS + `.d.ts`, `package.json`, `LICENSE`, `NOTICE`, `README` per package; ALL `*.map` excluded structurally (~669KB, about half the tarball). `PIN.json` covers both packages with per-package tarball sha1 + per-file byte pins.
- **Index**: `vendor/_index/paper-shaders.tsv` — 29 rows: `shader  register  animated  key_params  notes`. Examples: `awk -F'\t' '$2=="editorial"' vendor/_index/paper-shaders.tsv` (the house-register set) · `awk -F'\t' '$3=="static"' …` (no-rAF textures) · `grep '^grain-gradient' …` (one shader's full param surface).
- **Project deps**: React → `npm i @paper-design/shaders-react@0.0.78` (EXACT pin — see law 1; pulls core automatically). Vanilla/zero-build → copy `vendor/paper-shaders/core/dist/` + core `LICENSE`/`NOTICE` into the project, import from `index.js`. No UMD build exists — module scripts only.

## Routing (law) — every option keeps its lane
- **Print texture / grain / halftone / dither / 2D gradient field** (paper-texture, grain-gradient, halftone, dithering, mesh/radial gradients…) → **HERE — the default for the house register**.
- **Representational animated scenes** (birds, fog, net, globe, clouds) → **vanta**; it also keeps the legacy UMD/script-tag niche paper cannot serve.
- **3D deformed gradient plane/sphere, or reproducing a shadergradient.co URL** → **shadergradient** (R3F; one urlString = one look).
- **Tiny static noise accent with zero canvas cost** → magicui `noise-texture` via `components.tsv` — don't spend a WebGL2 context on a 40px grain patch.
- **reactbits `Dither` / `Grainient`** remain available when their exact look is wanted — paper's `dithering` is simply the zero-dep default for the job (reactbits' needs three + R3F + postprocessing).

## When to use / when NOT
Use for: editorial/print-flavored hero and section backgrounds (grain-gradient is the flagship), paper/cardboard surfaces behind cards, halftone/dither treatments of brand imagery (image-required filters: image-dithering, halftone-dots, halftone-cmyk, fluted-glass, heatmap), static gradient fields that outclass CSS gradients, and — deliberately — the vivid set (liquid-metal on a logo, pulsing-border, god-rays) when the brief is tech-forward.
NOT for: representational scenes (routing law), dashboards/data-dense UI (decoration budget), repeated per-card textures (law 4 — render once, reuse as image), pages that must run without WebGL2, non-module legacy script-tag environments (vanta's niche).

## How to consume (token discipline)
Pick from the TSV first; read a shader's `.d.ts` (`vendor/paper-shaders/core/dist/shaders/<name>.d.ts`) only when tuning past `key_params` — each carries the full uniform docs. Never read dist `.js` shader files into context (GLSL strings); `core/dist/shader-mount.js` (510 lines) only when patching or debugging.

React — one component per shader, colors as CSS strings straight from brief tokens (`"use client"` is baked into the dist — works directly in a Next.js App Router server tree):
```tsx
import { GrainGradient } from '@paper-design/shaders-react'

export function HeroField({ still }: { still: boolean }) {   // still = prefers-reduced-motion match
  return (
    <GrainGradient
      style={{ position: 'absolute', inset: 0, background: '#101216' }} // CSS fallback (law 6)
      colors={['#3e6172', '#a49b74', '#568c50']} colorBack="#101216"    // brief tokens — NEVER the neon defaults (law 2)
      shape="blob" softness={0.5} intensity={0.4} noise={0.3}
      speed={still ? 0 : 0.6}                                           // freeze, never unmount (law 3)
    />
  )
}
```
Zero-build — copy `vendor/paper-shaders/core/dist/` (plus core `LICENSE`+`NOTICE`) to e.g. `/paper-shaders/`, then one manual mount (all imports verified present in the vendored dist):
```html
<div id="bg" style="position:absolute; inset:0; background:#101216"></div>
<script type="module">
  import { ShaderMount, grainGradientFragmentShader, getShaderColorFromString,
    getShaderNoiseTexture, GrainGradientShapes, ShaderFitOptions,
    defaultObjectSizing as s } from '/paper-shaders/index.js'
  const speed = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.6
  try {
    const mount = new ShaderMount(document.querySelector('#bg'), grainGradientFragmentShader, {
      u_colorBack: getShaderColorFromString('#101216'),
      u_colors: ['#3e6172', '#a49b74', '#568c50'].map(getShaderColorFromString),  // brief tokens (law 2)
      u_colorsCount: 3, u_softness: 0.5, u_intensity: 0.4, u_noise: 0.3,
      u_shape: GrainGradientShapes.blob, u_noiseTexture: getShaderNoiseTexture(),
      u_fit: ShaderFitOptions[s.fit], u_scale: s.scale, u_rotation: s.rotation,
      u_originX: s.originX, u_originY: s.originY, u_offsetX: s.offsetX, u_offsetY: s.offsetY,
      u_worldWidth: s.worldWidth, u_worldHeight: s.worldHeight,
    }, undefined, speed)  // ctor: (el, fragShader, uniforms, glAttrs?, speed?, frame?, minPixelRatio?, maxPixelCount?)
    // later: mount.setSpeed(0) to freeze · mount.setUniforms({…}) to retune · mount.dispose() on teardown
  } catch { /* no WebGL2 — CSS fallback background already showing (law 6) */ }
</script>
```

## Non-optional defaults (law, with the why)
1. **PIN IS LAW** — upstream ships breaking changes under 0.0.x (param renames, uniform changes). Never float, never `^`/`~`; install and vendor at exactly 0.0.78. Re-sync is a deliberate re-audit, not a refresh.
2. **Recolor ALWAYS** — default presets are neon (`GrainGradient` ships `#7300ff #eba8ff #00bfff #2a00ff`), the exact generated look this arsenal exists to avoid. Every color prop comes from brief tokens; a shader left on defaults is a defect.
3. **Reduced-motion = `speed=0`, never unmount** — the static frame IS the design (source-verified: at speed 0 the rAF loop stops entirely, zero recurring cost). Unmounting throws away the texture; freezing keeps it.
4. **Canvas budget is shared with vanta**: max 1–2 animated shader canvases per page, TOTAL. Every instance holds a WebGL2 context even when static — for a repeated per-card texture, render once and reuse as an image (or route to magicui noise-texture), never mount per card.
5. **Prefer static shaders by default** — 9 of 29 consume no time uniform at all (TSV `animated=static`), 8 more read as finished stills at speed=0. Animate deliberately, not by default.
6. **WebGL2 required — CSS fallback background is mandatory** on the container (the constructor THROWS without WebGL2; the react component renders a bare canvas). Minimum: the shader's own colorBack so failure is invisible. For hero-scale surfaces make the fallback DESIGNED: layer brief-token gradient washes (radial/linear) over colorBack so a permanent failure still reads as art direction, never a blank.
7. **Mount after `load`, retry once** (vanilla path): the very FIRST WebGL2 context on a page can fail in headless/cold-GPU environments even where WebGL2 is supported — the constructor throws partway (canvas + style tag exist, but no `data-paper-shader` attr and no `element.paperShaderMount`; a bare try/catch at module-eval time silently eats the shader). Wrap the mount in a function, call it on window `load` (or immediately if `readyState === 'complete'`), and on throw retry ONCE inside `requestAnimationFrame` before accepting the CSS fallback. Field-verified failure mode (2026-08-04 test build).
8. **`minPixelRatio` defaults to 2** (renders 2x even on 1x screens for antialiasing) — lower it (`minPixelRatio={1}`) on mobile for full-viewport shaders; budget: full-screen 4K-class pixel counts are the default ceiling (`maxPixelCount`).

## Pitfalls
- **Single-vendor startup stewardship**: paper.design is one company; treat like atropos — offline vendoring + a readable 510-line mount means any future breakage is a `PATCHED(alex-style)` in-vendor fix, never a forced float.
- **No UMD**: module scripts only (`type="module"`); legacy script-tag pages route to vanta.
- **Apache-2.0 NOTICE travels**: any redistributed copy of the dist (zero-build path copies it into projects!) must carry `LICENSE` + `NOTICE`. Copy all of `core/dist/` + the two files, not cherry-picked shader modules.
- Auto-pause is built in (IntersectionObserver + visibilitychange — offscreen/hidden shaders stop) — do NOT bolt an atropos-style observer recipe on top; it's redundant here.
- Image-filter shaders (`image` required: image-dithering, halftone-*, fluted-glass, heatmap) accept URL strings or HTMLImageElement; same-origin/CORS-clean images only, or the texture upload fails.
- `halftone-dots` declares `u_time` but never consumes it — it is static in practice; don't burn an animation-budget slot on it.

## Refresh / fallback
- `bash scripts/sync.sh paper-shaders` — re-fetches BOTH pinned tarballs; gates: per-package registry sha1 (`4c866be9…` core, `b9219503…` react), version == 0.0.78, Apache-2.0 in package.json AND LICENSE text, NOTICE present, zero-dep invariant (core), `*.map` never staged, PIN.json regenerated. Any miss keeps the previous copy.
- Bumping the version is a deliberate edit: 0.0.x is a breaking-change stream — re-run the adding-a-source audit, re-pin both sha1s, re-verify the 29-shader catalog against the new dist (names ARE the API), and re-check the neon defaults claim in law 2.
- On-demand fetch: `npm view @paper-design/shaders@0.0.78 dist.shasum` (expect `4c866be9df2a50aea458c7f0b563637c7972f91d`) · tarballs at `https://registry.npmjs.org/@paper-design/shaders/-/shaders-0.0.78.tgz` and `…/shaders-react/-/shaders-react-0.0.78.tgz`.
