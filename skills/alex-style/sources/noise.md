# Noise — shader-noise ingredients (stegu reference GLSL/WGSL)
> 20 reference noise implementations from the algorithm authors' own repos (Gustavson/McEwan, the simplex-noise paper lineage): seamless-tiling psrdnoise with analytic-derivative flow, simplex/classic-periodic noise 2/3/4D, and the cellular/Worley family. This is the INGREDIENTS layer for CUSTOM shaders — Paper Shaders stays the source of COMPOSED, finished effects.

## At a glance
- **What**: `vendor/noise/` — plain GLSL functions (plus two WGSL ports) vendored as text from stegu/webgl-noise `22434e0` and stegu/psrdnoise `419175a`, ~120KB total. Zero dependencies, zero runtime, zero version floors: each file is one self-contained function you paste or `?raw`-import into any fragment shader (curtains.js plane, OGL program, three.js ShaderMaterial, raw WebGL canvas; WGSL for future WebGPU surfaces).
- **License**: MIT, twice over — webgl-noise via `vendor/noise/webgl-noise/LICENSE` ((C) 2011 Ashima Arts + 2011–2016 Stefan Gustavson); psrdnoise via **in-file headers + README ONLY** — no upstream LICENSE file exists ((c) 2021 Stefan Gustavson and Ian McEwan; authored notice at `vendor/noise/psrdnoise/LICENSE-NOTICE.md`). **The in-file MIT headers are the operative license text — never strip them from copied shaders**; sync and the arsenal self-test hard-fail if a file loses its header.
- **Index**: `vendor/noise/functions.tsv` — 23 rows: `function, file, dims, tiling, derivatives, cost_tier, use_for`. This sub-index is the routing surface; the raw files are payloads.
- **Project deps**: none, ever. The code is vendored text — copy the one file you need into the project (e.g. `src/shaders/`), keep the header comment.

## Routing (law)
- **INGREDIENTS vs DISHES**: need a finished animated background/texture → **paper-shaders** (composed effects, the DEFAULT). Reach HERE only when writing a CUSTOM shader — curtains.js displacement planes (recipe 20 #media-distortion), OGL ambient backgrounds (recipe 5 #ambient-bg), three.js materials, raw canvas.
- **SANCTIONED-NOISE RULE**: any custom shader that needs noise imports it from this source — NEVER transcribed from Shadertoy or blog posts. Shadertoy defaults to CC-BY-NC (bulk import already rejected); pasting "some noise function from a demo" is the legal failure mode this source exists to close.
- **LYGIA stays REJECTED** (Prosperity 3.0.0 — not open source; commercial use requires a paid license). Do not re-propose it; this source is its license-clean replacement slot.
- `webgl-noise` upstream also ships `src/psrdnoise2D.glsl` (2016 draft) — **excluded as data**: superseded by the 2021 psrdnoise rewrite vendored here. Never fetch it; a second home for the same function is a routing regression.

## Which noise for which job
```bash
cat vendor/noise/functions.tsv                        # 23 rows — reading fully is fine
grep -i "tiling\|flow" vendor/noise/functions.tsv     # seamless/flow candidates
awk -F'\t' '$6 ~ /cheap/' vendor/noise/functions.tsv  # mobile-tier candidates
```
- **Seamless looping background** → `psrdnoise2.glsl` — `period` tiles at ANY integer size (pixels match across the seam; that contract is the eval fixture), `alpha` rotates gradients for flow. THE default.
- **Liquid/smoke flow fields** → `psrddnoise2/3.glsl` (analytic 1st+2nd derivatives — curl without 4x finite-difference taps) or `noise3Dgrad.glsl`.
- **Cells/voronoi/caustics** → `cellular2D/3D.glsl` (accurate F1/F2) or `cellular2x2/2x2x2.glsl` (fast, F2 approximate).
- **MOBILE**: `mpsrdnoise2.glsl` is the mobile default — correct on 16-bit mediump GPUs. `psrddnoise3` is very-high cost: desktop only, never the mobile tier (cost_tier column is law, not advice).
- **Loop time cheaply**: sample a circle in the extra dimension (`noise3D` for 2D fields, `noise4D`/`pnoise` for 3D) or drive `psrdnoise`'s `alpha` — full period = perfect loop.

## Core usage

### OGL fragment shader (inject the vendored function)
```js
// copy vendor/noise/psrdnoise/psrdnoise2.glsl → src/shaders/psrdnoise2.glsl (header intact)
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import psrdnoise2 from './shaders/psrdnoise2.glsl?raw'   // Vite ?raw; webpack: asset/source

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime; uniform vec3 uColorA; uniform vec3 uColorB; varying vec2 vUv;
  ${psrdnoise2}                                          // defines float psrdnoise(vec2, vec2, float, out vec2)
  void main() {
    vec2 g;                                              // analytic gradient (free flow vector)
    // period vec2(4.0) → seamless tile every 4 units; alpha rotates gradients = liquid drift
    float n = 0.5 + 0.5 * psrdnoise(vUv * 4.0, vec2(4.0), uTime * 0.4, g);
    gl_FragColor = vec4(mix(uColorA, uColorB, n), 1.0);
  }`
// host-surface law still applies: reduced-motion → freeze uTime (a psrdnoise frame
// is a designed static texture at any t); WebGL-fail → CSS gradient from brief tokens.
```

### three.js ShaderMaterial (include pattern)
```js
// copy vendor/noise/webgl-noise/noise3D.glsl → src/shaders/noise3D.glsl (header intact)
import * as THREE from 'three'
import snoise3 from './shaders/noise3D.glsl?raw'

const material = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform float uTime; varying vec2 vUv;
    ${snoise3}                                           // defines float snoise(vec3)
    void main(){ gl_FragColor = vec4(vec3(0.5 + 0.5 * snoise(vec3(vUv * 3.0, uTime * 0.1))), 1.0); }`,
})
// Reusable alternative: THREE.ShaderChunk.noise3D = snoise3, then `#include <noise3D>`
// in any shader — register ONCE at startup, before the first material compiles.
```
curtains.js displacement planes consume these the same way (string-inject into the plane's fragment shader) — the worked recipe lives in `sources/curtains.md` (#media-distortion).

## Pitfalls
- **Header preservation is compliance, not style**: for psrdnoise the file header IS the MIT license text. Copy files whole; never "clean up" the comments.
- The `-min` variants are code-golfed but identical in API/cost class — prefer the full files in projects (readable for tuning); `-min` only when shader string size actually matters.
- `cellular2x2`/`cellular2x2x2` trade accuracy for speed: F2 (second-closest) is approximate — fine for F1-based cell looks, wrong for F2−F1 crack patterns (use `cellular2D`/`cellular3D`).
- GLSL version: files are written for GLSL ES 1.00 (WebGL1) and compile unchanged on WebGL2; in `#version 300 es` shaders they also compile (no reserved-word collisions), but don't mix with the WGSL ports — those are for WebGPU surfaces only (none in the arsenal today).
- One function per file — injecting two files that both define internal helpers (`mod289`, `permute`) into ONE shader string collides. Need two noise types in one shader → dedupe the helper functions manually (they are identical), or namespace one copy.
- Cost tiers compound with resolution: full-screen `psrddnoise3` at devicePixelRatio 2 is a mobile GPU killer — cap pixelRatio ≤1.5 on the host surface (curtains/OGL cards carry the budget law).

## Refresh / fallback
- `bash scripts/sync.sh noise` — re-fetches every allowlisted file at the pinned SHAs; gates: MIT header intact in every file, per-file ≥1KB, total ≥100KB, LICENSE is the MIT grant, functions.tsv row count exact. Any miss keeps the previous copy.
- Both repos are frozen-by-design reference math (webgl-noise last push 2025-04-27, psrdnoise 2023-03-07 — this is a feature, not rot). Bumping `NOISE_WEBGL_SHA`/`NOISE_PSRD_SHA` in sync.sh is a deliberate edit: re-verify the MIT headers and the file inventory first; annual check is plenty.
- Raw pins (verified 200, 2026-08-03): `https://raw.githubusercontent.com/stegu/webgl-noise/<sha>/src/<file>.glsl`, `https://raw.githubusercontent.com/stegu/psrdnoise/<sha>/src/<file>`.
