# 3D Asset Shelf — assets-3d
> 2 Poly Haven 1K HDRIs (CC0, byte-pinned) — image-based lighting for model-viewer, drei, three, and OGL/curtains scenes. Lighting is WHY this shelf exists: an HDRI environment is the difference between product-grade 3D and gray hemisphere-lit primitives, and before this shelf the arsenal owned zero HDRIs and zero models.

## At a glance
- **What**: `vendor/assets-3d/` (~3.1MB, HDRI tier) — `hdri/venice_sunset_1k.hdr`
  (1,440,400 B, golden-hour marketing mood) + `hdri/studio_small_03_1k.hdr`
  (1,686,299 B, neutral product-studio). These are the exact files behind the
  r3f ecosystem's battle-tested defaults: drei's `preset="sunset"` and
  `preset="studio"` map to these very Poly Haven 1K files.
- **Also vendored**: `models/SheenChair.metadata.json` + `models/ToyCar.metadata.json`
  — Khronos per-model license evidence (all-`CC0` `legal[]` arrays, verified
  2026-08-03 at pin `2bac6f8c`), pre-cleared for the core glb tier below.
  `assets.tsv` is the curation ledger (include + pending + 8 evidence-backed
  exclusion rows); `LICENSE-NOTICE.md` is the provenance record.
- **License**: CC0 1.0 — **no attribution required, but provenance is recorded
  anyway** (arsenal law: the audit trail in `assets.tsv`/`LICENSE-NOTICE.md`
  outlives any future license question). Poly Haven declares CC0 site-wide AND
  page-level per asset ("CC0 means absolute freedom"; redistribution incl. in
  sold products explicitly allowed). The Khronos repo has **NO top-level
  license** (GitHub API `license: null`) — each model's `metadata.json`
  `legal[]` array IS its license, which is why metadata is vendored adjacent to
  every glb and why the sync gate re-checks all-CC0 at every tier.
- **Index**: `vendor/_index/assets-3d.tsv` — `file, kind (hdri|model),
  mood_tags, bytes, license, source_url, usage`. Tiny; reading fully is fine.

## Routing (law)
- **3D lighting / environment** (model-viewer `environment-image`, drei
  `<Environment files=…>`, three/OGL RGBELoader): the ONLY answer is this shelf.
  Never a drei/reactbits preset string — presets fetch HDRIs from
  **raw.githack.com at runtime** and silently break offline/production builds.
  Known live instance: the vendored reactbits `ModelViewer-TS-TW` defaults to
  `environmentPreset='forest'` → runtime raw.githack fetch; always override
  with `<Environment files="/venice_sunset_1k.hdr"/>` (local copy).
- **Placeholder/demo 3D models**: core glb tier (below) once signed off; until
  then users supply their own `.glb` — the model-viewer card states the same.
- **Shelf law**: these assets are scaffolding — lighting, placeholders, layout
  subjects. Project-specific models are PROJECT scope: a client product hero
  ships the client's own model (lit by these HDRIs), **never** a shelf glb as
  the final client asset without replacement. Also a taste rule: two demo
  models homogenize output fast (every 3D demo becomes a chair or a toy car) —
  reach for client/user assets by default in real work.

## Mood → file
| Look | File | Tags |
|---|---|---|
| Product shot, neutral studio, e-commerce | `hdri/studio_small_03_1k.hdr` | studio, neutral, product, high-contrast |
| Golden-hour marketing hero, warm outdoor | `hdri/venice_sunset_1k.hdr` | sunset, golden-hour, warm, marketing-hero |

## How to consume (token discipline)
1. `cat vendor/_index/assets-3d.tsv` (tiny) or grep by mood tag.
2. **Copy** the `.hdr` into the project (e.g. `/public/`) — `cp`, never
   read/cat/grep the binary (1.4–1.7MB of Radiance data will blow context).
3. Reference by local path in one of the recipes below. The file must arrive
   byte-identical: sizes are pinned in the TSV; a mismatch means a corrupted
   copy.

model-viewer (zero-build static pages — pairs with `sources/model-viewer.md`):
```html
<model-viewer src="/product.glb"
  environment-image="/studio_small_03_1k.hdr"  <!-- lighting only -->
  skybox-image="/venice_sunset_1k.hdr"          <!-- OPTIONAL: also visible as background -->
  camera-controls poster="/poster.webp"></model-viewer>
```
three.js (also the OGL/curtains path — plain equirect `.hdr` via RGBELoader):
```js
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
new RGBELoader().load('/venice_sunset_1k.hdr', (tex) => {
  tex.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = tex           // image-based lighting
  // scene.background = tex         // OPTIONAL: visible skybox too
})
```
React Three Fiber / drei (fixes the preset trap):
```jsx
<Environment files="/venice_sunset_1k.hdr" />   // NEVER preset="sunset" (runtime raw.githack fetch)
```

## Core glb tier — pinned upstream, NEEDS OWNER SIGN-OFF (not vendored)
The 12.7MB core tier exists upstream, is fully pinned and license-cleared, and
lands with one command once the owner signs off — until then only its 2KB
license evidence is vendored:
- **Tier A (current)**: HDRI-only, 3,126,699 B — lighting for user-supplied models.
- **Tier B** (+`SheenChair.glb`, 4,125,648 B → ~7.2MB total): Wayfair fabric
  chair with KHR sheen — furniture/product-demo placeholder (legal[]: 1× CC0,
  Eric Chadwick / Wayfair, LLC).
- **Tier C — full core** (+`ToyCar.glb`, 5,422,412 B → 12,674,759 B total):
  clearcoat/playful product-demo subject (legal[]: 2× CC0, Odendahl + Chadwick).
  Honest math: ≈ +53% on the ~24MB pending vendor baseline — owner sign-off,
  not a default.
- Adopt: `ASSETS3D_TIER=core bash scripts/sync.sh assets-3d` — byte pins +
  glTF magic + all-CC0 `legal[]` gates run before the swap; once landed, the
  sign-off is sticky (a default re-sync re-fetches the glbs rather than
  silently dropping them). An extended pack (night/neutral HDRIs, more CC0
  models, e.g. WaterBottle) is opt-in only — new ledger rows first.
- **Khronos rule (data, not vibes)**: a model enters ONLY if EVERY
  `metadata.json` `legal[]` entry is CC0 (the metadata string is `"CC0"` +
  publicdomain/zero/1.0 URL — not the SPDX id). The repo mixes licenses —
  `assets.tsv` records the exclusions with evidence: **DamagedHelmet**
  (CC-BY-NC base model — NC-tainted composite; the famous demo helmet is
  legally unusable here), MaterialsVariantsShoe (CC-BY, owner-opt-in with
  attribution row only), FlightHelmet/ABeautifulGame/MosquitoInAmber (23–46MB),
  BoomBox/Lantern/WaterBottle (weaker value-per-MB). No HDRI above 1K.

## Pitfalls
- **Byte pins are the content gate**: assets are immutable files, so ANY size
  drift at sync or on disk means swapped content — sync and the catalog
  builder both fail loud and keep the previous copy. Never "fix" a mismatch by
  editing the pin; re-audit the upstream file first.
- 1K resolution is a deliberate ceiling: for *lighting* (environment-image /
  scene.environment) 1K is visually indistinguishable from 4K at a fraction of
  the bytes. As a visible `skybox-image`/background 1K reads soft on large
  viewports — acceptable for ambience, wrong for a hero backdrop; prefer
  lighting-only use, or a designed gradient/paper-shaders background behind
  the canvas.
- `.hdr` files are binary Radiance (`#?RADIANCE` magic) — serve as static
  files; no CORS gymnastics needed when self-hosted (same-origin, always the
  arsenal default).
- Sync stays **curl-only**: no gltf-transform/meshopt/draco tooling in the sync
  path (would drag npm tooling into `sync.sh`) — documented future option if
  model optimization is ever needed.
- Poly Haven's URL scheme is stable but not contractual — the byte pins are
  what make a moved/re-rendered upstream loud instead of silent.

## Refresh / fallback
- `bash scripts/sync.sh assets-3d` — re-fetches HDRIs (+ glbs if the core tier
  is on disk or `ASSETS3D_TIER=core`), gates every byte pin, Radiance/glTF
  magic, and all-CC0 `legal[]` arrays; keeps the previous copy on any miss.
- Pins live in `sync.sh`: `ASSETS3D_*_BYTES` + `KHRONOS_GLTF_SHA`
  (`2bac6f8c57bf471df0d2a1e8a8ec023c7801dddf`, main @ 2026-04-27; MANIFEST key
  `khronos_gltf`). Bumping the Khronos SHA is a deliberate edit: re-verify
  every `legal[]` array at the new SHA first — the license lives per-model and
  can change per-commit.
- Assets are frozen content: an annual check is enough unless a consumer card
  (model-viewer / r3f docs pack) reports a broken path.
