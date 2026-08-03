# ShaderGradient — shader-gradients
> Animated 3D shader gradient backgrounds (plane/sphere/waterPlane deformed by GLSL noise) as two React components; one urlString prop can encode an entire look.

## At a glance
- **What**: `@shadergradient/react` (npm latest 2.4.20, ESM-only) — `ShaderGradientCanvas` wrapper + `ShaderGradient` renderer on three.js/react-three-fiber. ~40 typed props (colors, mesh type, noise, orbit camera, lighting, film grain) or a single shadergradient.co/customize URL via `control='query'`. 10 named presets exported as data (`presets`, `presetsArray`).
- **License**: MIT (declared in package.json of both npm packages and README). Commercial use permitted. Caveat: repo has NO root LICENSE file — grant rests on package.json/README declaration; flag if legal needs actual license text. Figma plugin has a paid Pro tier, but that applies to the plugin only, not the npm library.
- **Vendored**: `vendor/shadergradient/README.md` (220 lines: install, compat matrix, full MeshT/GradientT type list, urlString example) and `vendor/shadergradient/presets.ts` (460 lines: all 10 preset configs as full prop objects). The runtime itself is NOT vendored — it is an npm install.
- **Index**: `vendor/_index/shadergradient-presets.tsv` (10 rows: preset_key, title, key_props incl. all 3 colors). Example: `grep -i '^mint' vendor/_index/shadergradient-presets.tsv`
- **Project deps**: `npm i @shadergradient/react @react-three/fiber three three-stdlib camera-controls && npm i -D @types/three`

## When to use / when NOT
Use for:
- Full-bleed animated hero / login / waitlist backgrounds in React or Next.js where CSS gradients feel flat.
- Ambient motion behind glassmorphism cards (waterPlane at low `uSpeed`, e.g. cottonCandy / nightyNight presets).
- Dark-mode aurora/nebula sections (sphere presets: pensive, interstella, universe).
- Reproducing an exact look from a shadergradient.co/customize URL — paste string, zero tuning. Uniquely codegen-friendly: one query string = one complete look.

NOT for:
- Vanilla JS / Vue / Svelte / static HTML → React-only runtime; use **vanta** (zero-build dists) or CSS gradients instead.
- JS-weight-sensitive pages: pulls three.js (~600 KB+ min) + R3F for a background → CSS-only motion via **animista**, or a static palette from **layers** (`palettes.tsv`).
- SSR/static screenshots/email — WebGL canvas is client-only (IntersectionObserver lazy-load).
- Icons/components/typography — this source does exactly one thing.

## How to consume (token discipline)
Never read `presets.ts` top-to-bottom (460 lines) — pick presets from the TSV, extract one block. README.md: grep sections, don't re-read whole.
1. Pick a preset by color/mesh/mood: `grep 'waterPlane' vendor/_index/shadergradient-presets.tsv` (or grep a hex like `#910aff`, or `cut -f1,2` for the name list).
2. Need the full prop object (positions, rotations, camera angles the TSV omits)? Extract exactly one preset: `awk '/^  pensive: \{/,/^  \},/' vendor/shadergradient/presets.ts` (keys: halo pensive mint interstella nightyNight violaOrientalis universe sunset mandarin cottonCandy).
3. Need types/props reference: `sed -n '/Available Gradient Properties/,/# Examples/p' vendor/shadergradient/README.md`. Compat matrix: `sed -n '/Compatibility matrix/,/# Packages/p' vendor/shadergradient/README.md`.
4. In code, prefer importing `presets.pensive.props` from the package over pasting the extracted block; spread + override colors.

## Core usage
```tsx
'use client' // required in Next.js App Router — WebGL is client-only
import { ShaderGradientCanvas, ShaderGradient, presets } from '@shadergradient/react'

export function Bg() {
  return (
    <ShaderGradientCanvas style={{ position: 'absolute', inset: 0 }} pixelDensity={1.5} pointerEvents='none'>
      <ShaderGradient {...presets.mint.props} color1='#94ffd1' uSpeed={0.2} />
    </ShaderGradientCanvas>
  )
}
```
URL-string mode (from the visual editor, or hand-built query params — param names match prop names, `%23` = `#`):
```tsx
<ShaderGradient control='query' urlString='https://www.shadergradient.co/customize?animate=on&cDistance=3.6&color1=%2352ff89&color2=%23dbba95&color3=%23d0bce1&lightType=3d&type=plane&uSpeed=0.4&uStrength=4' />
```
Motion cheat sheet: `uSpeed` 0.1–0.4 typical; `uStrength` = deformation amount; `grain='on'` adds film grain; `lightType='3d'` (default-ish, no network) vs `'env'` (HDR fetch, see Pitfalls).

## Pitfalls
- **Next.js 15 App Router**: MUST pair React 19 + R3F ^9 + three >=0.158. R3F v8 is structurally incompatible with App Router (repo issue #138). Next 14 / Next 15 Pages / Vite: React 18 or 19 with matching R3F 8.x/9.x. No transpilePackages needed on valid combos.
- **Peer deps are on you**: README install line above is mandatory — `@react-three/fiber three three-stdlib camera-controls` are not auto-installed by the package.
- **`lightType='env'` fetches HDRs at runtime** from `https://ruucm.github.io/shadergradient/ui@0.0.0/assets/hdr/{city,dawn,lobby}.hdr` (~1.5 MB each). Blocked under strict CSP (e.g. Artifacts) / offline. Self-host and set `envBasePath` on ShaderGradientCanvas, or stick to `lightType='3d'` (needs no HDR; `envPreset` is inert then). Only the interstella preset uses `env`.
- ESM-only package (no CJS). Wrap in `'use client'` for App Router; canvas lazy-loads via IntersectionObserver (`lazyLoad`, `threshold`, `rootMargin` props tune it).
- Install `@shadergradient/react` (v2), NOT legacy `shadergradient` (v1.3.5, bundled store — dead end). `@shadergradient/ui` is not on npm (Framer/Figma internal).
- Preset key is `nightyNight` (sic) and `violaOrientalis` — not "night" / "viola".

## Refresh / fallback
- `bash scripts/sync.sh shadergradient` — refetches README.md + presets.ts into `vendor/shadergradient/`.
- `curl -sL https://raw.githubusercontent.com/ruucm/shadergradient/main/packages/shadergradient/src/presets.ts` — presets source of truth.
- `curl -sL https://raw.githubusercontent.com/ruucm/shadergradient/main/README.md` — canonical compact docs (no llms.txt exists; shadergradient.co/llms.txt 404s).
- `npm view @shadergradient/react version peerDependencies` — check for releases past 2.4.20.
