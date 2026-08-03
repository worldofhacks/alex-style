# r3f + drei — React 3D scene/staging docs pack (pins and traps)
> Vendored `llms-full.txt` doc artifacts for react-three-fiber 9.7.0 and drei 10.7.7 plus this pins-and-traps card. DOCS PACK ONLY — the r3f/drei RUNTIME is never vendored (users npm-install into their project). Both artifacts are GREP-ONLY: never read fully.

## At a glance
- **What**: `vendor/r3f-drei/` — `r3f-llms-full.txt` (168KB, 20 pages: Canvas API, hooks, events) + `drei-llms-full.txt` (206KB, 134 pages incl. all 25 `/staging/*` pages: Environment, Stage, Float, ContactShadows, Caustics, Sky, Stars, Sparkles…) + `PIN.json` (sync date + byte sizes — the artifacts carry NO upstream version stamp, so PIN.json IS the staleness detector).
- **Why it exists**: six vendored payloads already depend on r3f/drei (reactbits ModelViewer, PixelTrail, FluidGlass, Beams, Antigravity, Dither) with zero local guidance, and drei's staging vocabulary is the composable grammar of award-site 3D heroes. This pack raises the React-3D ceiling without vendoring any runtime.
- **License**: MIT (both pmndrs packages, verified in the npm registry at the pinned docs versions).
- **HARD PAIRING**: adopted together with the 3D asset shelf (`vendor/assets-3d/`, HDRI tier). Every environment-lighting answer cites LOCAL `.hdr` files — never a drei preset (see TRAP 1).

## Version pins (law — copy exactly)
```bash
npm i three@0.185 @react-three/fiber@9.7.0 @react-three/drei@10.7.7
```
- **react `>=19 <19.3`** — r3f 9.7.0's peerDependencies window, verified in the registry. This is TIGHTER than "React 19": a routine React 19.3 upgrade in the user's project silently breaks peers (TRAP 3). Pin react/react-dom 19.2.x.
- **drei `10.7.7`** — latest stable. **Do NOT take the 11.x alphas** (publishing since 2026-01); re-sync this pack + re-audit this card when drei 11 goes STABLE. A docs pack contradicting the installed major is worse than no pack.
- three peer floors: r3f `>=0.156`, drei `>=0.159`; 0.185.x satisfies both and matches the model-viewer module build's era.

## The traps (each verified at source, 2026-08)
1. **drei Environment presets fetch the network at RUNTIME.** `core/useEnvironment.js` line 8: `const CUBEMAP_ROOT = 'https://raw.githack.com/pmndrs/drei-assets/456060a2…/hdri/'` — every `<Environment preset="…">` (and every drei/Stage default that implies one) fetches HDRIs from a third-party CDN at runtime. That violates hard rule 1 AND breaks offline/CSP builds. **In-arsenal reproduction: reactbits ModelViewer defaults `environmentPreset='forest'` — the defect is live in a vendored payload.** The fix, always:
   ```tsx
   // copy the HDRI from vendor/assets-3d/ into the project's /public first
   <Environment files="/assets/venice_sunset_1k.hdr" />          // ≙ preset="sunset"
   <Environment files="/assets/studio_small_03_1k.hdr" />        // ≙ preset="studio"
   ```
   (The shelf's files are literally drei's own preset sources at 1K — drop-in equivalents.)
2. **Never co-bundle with vanta's pinned three r134.** One page/bundle/island gets ONE three version; r3f 9.x needs modern three (≥0.156) and vanta hard-pins r134 — sharing a bundle recreates the silent-failure class the arsenal was burned by. Separate pages or drop one.
3. **The React peer ceiling** (see pins above): `>=19 <19.3` — treat React upgrades as a breaking change for 3D pages until r3f widens the window.

## Routing (law)
- **React app already committed to three/R3F** → this card + these docs (scene composition, staging, tuning the six vendored r3f-dependent payloads).
- **Zero-build/static page needing a 3D model** → the default stays **model-viewer** (`sources/model-viewer.md`, class `3d-model-viewer`) — one script tag, no React, poster/LCP story. Never answer a static-page 3D request with an R3F scaffold.
- Animated backgrounds stay with paper-shaders/vanta/shadergradient; scroll choreography stays GSAP ScrollTrigger (tween the camera / `camera-orbit`, no new animation layer).

## How to consume (token discipline — grep-only, LAW)
Both artifacts join the never-read-fully table in SKILL.md (same class as magicui's 648KB llms-full).
```bash
grep -n 'path="/staging/' vendor/r3f-drei/drei-llms-full.txt        # list staging pages
grep -n '<page path="/staging/environment"' vendor/r3f-drei/drei-llms-full.txt
# read ONLY the matched page block (~2-6KB), e.g. 120 lines from the match:
awk '/<page path="\/staging\/environment"/,/<\/page>/' vendor/r3f-drei/drei-llms-full.txt
grep -n 'frameloop' vendor/r3f-drei/r3f-llms-full.txt               # Canvas perf props
```
Set `frameloop="demand"` on scenes that only move on interaction; `dpr={[1, 1.5]}` caps mobile cost — both documented in the r3f canvas page.

## Reduced motion / mobile (host law applies)
- drei/r3f have no built-in `prefers-reduced-motion` handling: gate `<Float>`, auto-rotate, and camera drift behind `matchMedia('(prefers-reduced-motion: reduce)')` — static staged render is the fallback (staging still looks great frozen).
- Mobile tier: 3D heroes inherit the no-WebGL-on-mobile-tier law (recipes.md #mobile-budget) — poster image or static render on touch/narrow; if a scene must ship, `dpr={1}` and `frameloop="demand"`.
- SSR/Next: `<Canvas>` is client-only (`'use client'` + dynamic import, `ssr: false`).

## Pitfalls
- Docs churn is the #1 maintenance risk: drei 11 alphas since 2026-01. PIN.json's `synced_at` + byte sizes are the drift check — if upstream reshapes the export, sync's gates (byte floors, page-count floors, `/staging/environment` marker) keep the previous copy.
- The drei artifact contains HTML-escaped codesandbox embeds — noise to skip when reading a page block; the props tables are the signal.
- `<Stage>` and several staging helpers imply an environment preset internally — pass `environment={{ files: '/assets/…hdr' }}` (or `environment={null}` + your own lights) so TRAP 1 doesn't fire through a wrapper.
- This card is NOT an invitation to vendor r3f/drei/three runtimes — that debate is settled (rejected). npm-install in the user's project only.

## Refresh / fallback
- `bash scripts/sync.sh r3f-drei` — re-fetches both artifacts; gates: byte floors (150KB/190KB), non-HTML content, identity headers, page-count floors (15/100), `/staging/environment` present. Any miss keeps the previous copy.
- Scheduled re-sync trigger: **drei 11.0.0 stable on npm** → bump `DREI_DOCS_VERSION`, re-fetch, re-audit every pin and trap in this card before shipping the new pack.
- Artifact URLs (verified 200, 2026-08-03): `https://r3f.docs.pmnd.rs/llms-full.txt`, `https://drei.docs.pmnd.rs/llms-full.txt`.
