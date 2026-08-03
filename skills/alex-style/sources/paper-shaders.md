# Paper Shaders — shader-backgrounds
> 29 zero-dependency WebGL2 shaders (mesh gradients, grain, dithering, halftone, liquid metal, god rays, metaballs…) by paper.design — the DEFAULT source for ambient/gradient/texture/retro-print backgrounds.

## At a glance
- **What**: `@paper-design/shaders` **pinned 0.0.78** — a `ShaderMount` runtime + 29 fragment shaders as readable ESM with embedded GLSL. Typed params, curated presets, built-in IntersectionObserver viewport pause + hidden-tab pause; `speed=0` cancels rAF entirely (a true zero-cost static frame). React wrapper `@paper-design/shaders-react` (thin typed components, `'use client'` baked in, SSR-safe — server pass renders a plain div).
- **License**: Apache-2.0 (`vendor/paper-shaders/LICENSE` + `NOTICE` — ship BOTH alongside redistributed dist files, per Apache §4d NOTICE preservation). **License floor: 0.0.47–0.0.76 are PolyForm Shield 1.0.0, NOT open source — never install, resolve, or downgrade below 0.0.77; never float the version.** `sync.sh` hard-fails below the floor.
- **Vendored** (`vendor/paper-shaders/`, ~750K): `dist/` — full ESM tree without sourcemaps (29 shaders + runtime; ~252K readable JS + ~120K `.d.ts`; only relative imports → self-hosts under strict CSP, e.g. Artifacts); `docs/` — Mintlify `llms.txt` + 28 per-shader `.md` pages + `overview.md`; `LICENSE`, `NOTICE`, `README.md`, `package.json`. The react wrapper is NOT vendored — npm-only by design.
- **Index**: `vendor/_index/paper-shaders.tsv` — 29 rows: `shader, key_params, animated_vs_static, mood_tags, presets, description, dist_file, doc_file`.
- **Project deps**: React → `npm i @paper-design/shaders-react@0.0.78` (exact pin; peers react ^18||^19; single dep). Vanilla → none: copy the vendored dist tree, or pinned CDN `https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.78/+esm` (never unpinned).

## Routing (law)
- **Default HERE** for ambient, gradient, texture, retro-print/halftone, liquid, and glow backgrounds — React AND vanilla/zero-build static pages.
- **vanta** only for mouse/touch-reactive or organic 3D scenes (birds, fog, net, globe) — Paper Shaders has no pointer uniforms.
- **shadergradient** only for existing R3F projects reproducing an exact shadergradient.co/customize URL or its true-3D sphere/orbit presets.

## When to use / when NOT
Use for:
- Hero/section ambience: mesh-gradient, grain-gradient, warp, simplex-noise, god-rays, smoke-ring.
- Retro-print/editorial texture: dithering, halftone-cmyk, halftone-dots, image-dithering, paper-texture.
- Liquid/metal/organic accents: liquid-metal, metaballs, water, gem-smoke; glowing frames: pulsing-border.
- Zero-cost static texture (no rAF loop at all): dot-grid, waves, static-mesh-gradient, static-radial-gradient, and any animated shader at `speed={0}`.

NOT for:
- Pointer-reactive backgrounds → **vanta**. Exact shadergradient.co URL / 3D sphere-orbit → **shadergradient**.
- WebGL-free contexts (email, SSR output, static screenshots) — canvas is client-only.
- More than 3–5 shader instances per page (perf budget below).

## How to consume (token discipline)
1. Pick by mood/use-case: `grep -i 'retro-print\|ambient' vendor/_index/paper-shaders.tsv` (params + defaults are in the row). List all: `cut -f1 vendor/_index/paper-shaders.tsv | tail -n +2`.
2. Param semantics + presets: read ONE doc page, `vendor/paper-shaders/docs/shaders/<name>.md` (~5K each). gem-smoke has no upstream page — read the header of `dist/shaders/gem-smoke.js` instead.
3. dist files are unminified source with embedded GLSL — reading ONE shader file to tune is fine; never bulk-read the tree.
4. Ship it: React installs the pinned wrapper; vanilla copies `vendor/paper-shaders/dist/` intact (shaders import `../shader-utils.js` — keep the tree structure).

## Core usage — the three recipes the library omits (MANDATORY in every build)
The package has NO built-in prefers-reduced-motion handling and NO WebGL2 fallback (the constructor hard-throws "WebGL is not supported in this browser" → unguarded mounts white-screen the background). Always ship all three:

React:
```tsx
'use client'
import { MeshGradient } from '@paper-design/shaders-react'   // npm i @paper-design/shaders-react@0.0.78

export function Bg() {
  // recipe 1: reduced motion → speed 0 (same look as a frozen frame; rAF fully stops)
  const still = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  // recipe 2: WebGL2 feature-detect — render a CSS gradient from the brief tokens instead of mounting
  const webgl2 = typeof document !== 'undefined' && !!document.createElement('canvas').getContext('webgl2')
  if (!webgl2) return <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#241d9a,#9f50d3)' }} />
  return <MeshGradient colors={['#e0eaff', '#241d9a', '#f75092', '#9f50d3']} speed={still ? 0 : 1}
    style={{ position: 'absolute', inset: 0 }} />
}
```
Zero-build (vendored dist copied to `/public/paper-shaders/` — survives strict CSP; on ordinary pages the pinned jsdelivr URL works too):
```html
<div id="bg" style="position:absolute; inset:0"></div>
<script type="module">
  import { ShaderMount, meshGradientFragmentShader } from '/paper-shaders/index.js'
  // or: from 'https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.78/+esm'
  const el = document.getElementById('bg')
  const speed = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1
  try {
    new ShaderMount(el, meshGradientFragmentShader, {
      u_colors: [[0.88,0.92,1,1], [0.14,0.11,0.6,1], [0.97,0.31,0.57,1]], u_colorsCount: 3,
      u_distortion: 0.8, u_swirl: 0.1, u_grainMixer: 0, u_grainOverlay: 0,
      u_fit: 2, u_scale: 1, u_rotation: 0, u_offsetX: 0, u_offsetY: 0,
      u_originX: 0.5, u_originY: 0.5, u_worldWidth: 0, u_worldHeight: 0,
    }, {}, speed)
  } catch { el.style.background = 'linear-gradient(160deg,#241d9a,#9f50d3)' }  // recipe 2: no WebGL2
</script>
```
Recipe 3 — perf budget (from the official performance doc): **max 3–5 shaders per page**; set `minPixelRatio={1}` on mobile (default targets 2x for antialiasing); browsers cap concurrent WebGL contexts at **8–16** and every mount consumes one. Off-viewport and hidden-tab pausing is automatic — no wiring needed.

## Pitfalls
- **Version pin is a license boundary, not a preference**: anything below 0.0.77 is PolyForm Shield. Pin `0.0.78` exactly in package.json AND CDN URLs; a floating `^0.0.x` or a stale mirror can silently land on non-open licensing.
- **Pre-1.0 API churn**: prop renames shipped at 0.0.54 (`effectScale`→`size`, `highlights`→`edges`) and 0.0.55 (`pxSize`→`size`, `foldsNumber`→`foldCount`). All vendored snippets, docs, and TSV params are valid at 0.0.78 ONLY — if a user installs `latest`, verify props against upstream CHANGELOG first.
- Whole-library CDN import is ~195K unminified — fine for a one-page hero; the disciplined path is self-hosting the runtime + the one shader you use (~9K gzipped).
- `animated_vs_static` in the TSV: `static`/`static-default` shaders never start a rAF loop; `animated` ones do (until `speed={0}`). Prefer static-* shaders when the design only needs a still gradient.
- Image-input shaders (halftone-*, image-dithering, fluted-glass, water, heatmap, liquid-metal, gem-smoke) take an `image` param — cross-origin image URLs need CORS headers.
- React + strict CSP: the vendored dist covers vanilla self-hosting; React projects still install the (non-vendored) wrapper from npm at the exact pin.

## Refresh / fallback
- `bash scripts/sync.sh paper-shaders` — re-fetches the pinned tarball (hard-fails below 0.0.77, verifies Apache-2.0 in package.json AND license text) + Mintlify docs; keeps the previous copy on any gate miss.
- Version bumps are deliberate edits to `PAPER_SHADERS_VERSION` in `sync.sh`: first check `https://raw.githubusercontent.com/paper-design/shaders/main/CHANGELOG.md` for prop renames and re-confirm the license is still Apache-2.0.
- Docs index (verified 200): `https://paper-design-shaders.mintlify.app/llms.txt`; per-shader pages at `…mintlify.app/shaders/<name>.md`.
