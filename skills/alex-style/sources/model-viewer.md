# model-viewer — 3d-model-viewer
> Google's `<model-viewer>` 4.3.1 — the zero-build 3D display slot: one script tag + one HTML element gives camera-orbit glTF/GLB display with poster fallback. DEFAULT route for product-3D on pages.

## At a glance
- **What**: `@google/model-viewer` **pinned 4.3.1** (Apache-2.0, Google-maintained — releases Mar/Jun 2026). A web component: `<model-viewer src="x.glb" camera-controls poster="x.webp">` renders an orbit-able, touch-friendly 3D model with poster/reveal loading, image-based lighting (`environment-image`), tone mapping (`aces`/`agx`/`neutral`), shadows, and optional AR.
- **License**: Apache-2.0 (`vendor/model-viewer/LICENSE` — ship it alongside redistributed dist files; no upstream NOTICE at 4.3.1). Bundle embeds standard BSD-3-Clause (lit) headers — compatible.
- **Vendored** (`vendor/model-viewer/`, ~1.65MB, exact 4-file allowlist, byte-pinned in `sync.sh`): `dist/model-viewer.min.js` (1,068,903 B — **the PRIMARY build: bundles its own three**, zero external imports, so it is structurally immune to the arsenal's r134-class version traps); `dist/model-viewer-module.min.js` (475,096 B — imports EXTERNAL `three` ^0.183, scoped below); `dist/model-viewer.d.ts` (89,180 B attribute index); `LICENSE`. Excluded as data: sourcemaps, both UMD variants, the gstatic draco/basis decoders (hooks recorded in Pitfalls).
- **Index**: card-only — a single element needs no TSV; routing lives in SKILL.md's 3D block.
- **Weight budget (law)**: 289KB gzip is the heaviest single runtime the arsenal recommends — treat it as **video-hero budget**: it earns its bytes only as the page's centerpiece, and `poster` + `loading="lazy"` defer the cost off the critical path.

## Routing (law)
- Class **`3d-model-viewer`** — display a 3D model (product hero, device mockup, artifact viewer) on ANY page, zero-build or framework. Disjoint from `webgl-background`: never offer vanta/paper-shaders for a model request, never offer model-viewer as a background.
- **React/R3F projects already composing a scene** → `vendor/reactbits/r/ModelViewer-TS-TW.json` is the React-path alternative (glTF/FBX/OBJ, R3F+drei). TRAP: it is React+bundler-only AND its default `environmentPreset='forest'` **runtime-fetches an HDRI from raw.githack** — offline/production builds break silently. Pass a local file via drei `<Environment files="/assets/venice_sunset_1k.hdr">` instead. For "just show a model", model-viewer wins even in React (mount the element client-side).
- Scroll choreography → NO new library: GSAP ScrollTrigger tweens `camera-orbit`/`exposure` (recipes.md `#product-3d`). Backgrounds stay with paper-shaders/vanta; DOM media distortion stays with curtains.

## When to use / when NOT
Use for:
- Product/device heroes on static or zero-build pages (recipes.md `#zero-build` + `#product-3d`), portfolio artifact viewers, spec-section 3D callouts.
- Any "display a glTF/GLB" request — this is the arsenal's default answer.

NOT for:
- Ambient/animated backgrounds → paper-shaders/vanta. Composed multi-object React scenes with staging/physics → R3F path (`sources/r3f-drei.md` if landed).
- More than ONE live viewer per page (law): WebGL context ceiling is ~8 browser-wide and each viewer takes one — galleries swap `src` on a single element instead of mounting many.
- Email/SSR-only/screenshot outputs — the canvas is client-only; the poster image is the SSR story.

## How to consume (token discipline)
1. Read this card, then copy `vendor/model-viewer/dist/model-viewer.min.js` into the project (e.g. `/public/`). NEVER read the dist files — minified, ~1MB.
2. Attribute/property lookup: `grep -i '<propName>' vendor/model-viewer/dist/model-viewer.d.ts` (e.g. `cameraOrbit`, `interactionPrompt`, `environmentImage`) — 89KB, grep by name, never read whole.
3. Assets: HDRIs and demo models come from the 3D asset shelf — `vendor/assets-3d/` (`sources/assets-3d.md`). If the shelf landed HDRI-only (or is absent), **users supply their own `.glb`** — the shelf's glbs are placeholder/demo subjects anyway; client heroes always use the client's model with the shelf's HDRIs.

## Core usage — the mandatory recipes (the bundle has NONE of this built in)
Grep-verified: `prefers-reduced-motion` occurs **zero** times in the bundle — the card is the only guard. Always ship all three blocks.

```html
<script type="module" src="/model-viewer.min.js"></script>

<model-viewer id="hero3d" src="/client-product.glb"
  alt="Aurora headphones — interactive 3D view, drag or arrow keys to rotate"
  poster="/product-poster.webp" reveal="auto" loading="lazy"
  camera-controls auto-rotate interaction-prompt="auto"
  environment-image="/assets/studio_small_03_1k.hdr"
  shadow-intensity="1" tone-mapping="neutral" exposure="1"
  style="width:100%; height:520px"></model-viewer>

<script>
  const mv = document.getElementById('hero3d')
  // recipe 1 — reduced motion (MANDATORY): drop idle motion + prompt wiggle, keep the poster/orbit
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mv.removeAttribute('auto-rotate')
    mv.setAttribute('interaction-prompt', 'none')
  }
  // recipe 2 — mobile tier (#mobile-budget law: no WebGL on the mobile tier by default):
  // touch/narrow devices keep the POSTER until a deliberate tap starts the 3D
  if (matchMedia('(pointer: coarse), (max-width: 768px)').matches) {
    mv.setAttribute('reveal', 'interaction')
  }
</script>
```
- **Poster/loading law**: every viewer ships `poster` + `reveal` + `loading="lazy"` (below the fold). No-WebGL browsers, slow devices, and reduced-data users then see the poster image — **never a blank box**; this is also the LCP story (poster paints immediately, the 289KB runtime loads off-path).
- **Recipe 3 — lighting (what separates product-grade from gray primitives)**: always set `environment-image` from the shelf's HDRIs — `studio_small_03_1k.hdr` = product-studio, `venice_sunset_1k.hdr` = golden-hour marketing (`vendor/assets-3d/`, see `sources/assets-3d.md` for exact paths). Default hemisphere lighting reads as an unfinished demo.
- **a11y**: `alt` is mandatory (screen-reader description of the model + how to interact). With `camera-controls` the viewer is tab-focusable and arrow keys orbit the camera — keep it on; the `a11y` attribute accepts a JSON translation map for the built-in interaction strings.
- Scroll choreography: GSAP ScrollTrigger tweening ``mv.cameraOrbit = `${deg}deg 75deg 105%` `` — full pattern in recipes.md `#product-3d`.

## Pitfalls
- **`model-viewer-module.min.js` is a NAMED TRAP**: it imports bare `three` (peer **^0.183**) and exists ONLY for projects already shipping a modern three that must share one instance. It must **NEVER share a bundle/island with vanta's pinned r134** — resolution would silently break one of them. Default is always the self-contained build. (Co-load smoke test 2026-08: self-contained build + vanta r134 on one page = no collision, no `window.THREE` write, `THREE.REVISION` stays 134; console shows a benign "Multiple instances of Three.js" warning — but two three copies + two WebGL contexts means you should still pick ONE 3D surface per page.)
- **Compressed models fetch decoders from gstatic at runtime**: draco/ktx2 `.glb`s make the runtime pull `https://www.gstatic.com/draco/versioned/decoders/1.5.6/` or `https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/` — a silent network dependency (deliberately NOT vendored; the shelf ships uncompressed glbs). Offline/strict-CSP builds must self-host: set `ModelViewerElement.dracoDecoderLocation` / `.ktx2TranscoderLocation` before first load, or ship uncompressed models.
- **One live viewer per page** (see NOT above) — swap `src` for galleries; each `<model-viewer>` costs a WebGL context and its own render loop.
- AR attributes (`ar`, `ar-modes`) reach for device APIs (WebXR/Quick Look/Scene Viewer) — scope recommendations to core viewing unless the brief asks for AR.
- The element is client-only: in SSR frameworks import/`<script>` it in a client-mounted context and keep the poster as the server-rendered fallback.

## Refresh / fallback
- `bash scripts/sync.sh model-viewer` — re-fetches the pinned tarball; gates: version + Apache-2.0 (package.json AND license text), exact byte pins on all 4 files, ~1.5MB floor, self-contained-build grep (`from"three"` absent in min.js, present in module.min.js), no-THREE-global grep. Any miss keeps the previous copy.
- Version bumps are deliberate edits to `MODEL_VIEWER_VERSION` in `sync.sh`: re-record all four byte pins, re-run the audit greps, and re-run the vanta co-load smoke test before the card ships the new pin.
- Watch list: **gpu-curtains** (WebGPU) was DEFERRED as a routing answer (WebGPU-only, no fallback ≈ 18% blank-canvas reach in 2026); unrelated to this slot but re-audit the 3D category when WebGPU is default-on across Firefox platforms + iOS 26+ majority (~2027).
- CDN fallback for ordinary pages (never unpinned): `https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js`.
