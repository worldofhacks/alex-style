---
name: alex-style
description: Use when building or styling any web UI — landing pages, hero sections, dashboards, components, marketing sites — or when the user asks for beautiful, animated, or polished design, UI animations, animated backgrounds, gradients, icons, smooth scrolling, or design inspiration. Also use before reaching for the web to find components or animation code.
---

# Alex Style

A fully local design arsenal aggregated from 29 curated sources. Everything —
component source code, animation keyframes, icon SVGs, brand logos, shader
backgrounds, DOM-synced WebGL, 3D display + CC0 lighting assets, media effects,
player chrome, color ramps, review rulebooks, doc indexes, inspiration
metadata, color palettes — is vendored under `vendor/` in this skill directory.

**Hard rules**
1. **Never fetch from the web what is vendored here.** No WebFetch, no browser
   tools, no registry CLIs for anything in the table below. The only network use
   is `scripts/sync.sh` to refresh, and installing npm deps into the target project.
2. **Grep, don't read.** The TSV indexes in `vendor/_index/` are designed for
   `grep`. Files marked *never read fully* below will blow your context — always
   grep or extract single items.
3. **Read the source card before first use of a source** (`sources/<slug>.md`,
   60–120 lines each): license constraints, pitfalls, exact consume commands.
4. **For multi-section or multi-page builds, follow `orchestration.md`** —
   dispatch parallel section agents only after writing the design brief.

## The arsenal

| Slug | What | Size | Index (grep this) | Card |
|---|---|---|---|---|
| `magicui` | 77 animated React components (shadcn-style, MIT) | full source in `vendor/magicui/r/*.json` | `_index/components.tsv` | `sources/magicui.md` |
| `kokonutui` | 46 polished React components (MIT) | `vendor/kokonutui/r/*.json` | `_index/components.tsv` | `sources/kokonutui.md` |
| `reactbits` | 139 animated components, TS+Tailwind variant (MIT+Commons Clause) | `vendor/reactbits/r/*.json` | `_index/components.tsv` | `sources/reactbits.md` |
| `motion-primitives` | 33 motion components (MIT) | `vendor/motion-primitives/core/*.tsx` + `docs/` | `_index/components.tsv` | `sources/motion-primitives.md` |
| `fancy` | 8 wild-tier showpieces (physics gravity, gooey/pixelate SVG filters, text/element/marquee along SVG paths) — curated PATCHED FORK of fancycomponents.dev (MIT); text tier excluded (lost head-to-heads to reactbits) | `vendor/fancy/r/*.json` (8 items + 6 support hooks/utils) | `_index/components.tsv` (`wild:` prefix) | `sources/fancy.md` |
| `atropos` | Layered 3D hover-depth SCENES @ 2.0.2 (MIT, zero-dep, 8.6KB working core) — per-layer `data-atropos-offset` planes + projected shadow + highlight sweep; vanilla/React/web-component from one pinned tarball; feature-frozen upstream (patch-in-vendor, never float) | 15-file curated tarball subset (~91KB) + `PIN.json` byte pins in `vendor/atropos/` | card-only, no TSV — `sources/atropos.md` IS the route | `sources/atropos.md` |
| `tailark` | 150 marketing sections + 10 full landing pages × 3 kits (dusk/mist/veil, MIT) — pricing/testimonials/footers/faqs/auth the arsenal previously hand-built; Tailwind >= 4.1 only | 255 payload JSONs (~1.2MB) in `vendor/tailark/r/` @ pinned commit | `_index/sections.tsv` | `sources/tailark.md` |
| `origin` | 646 application/form/data UI items — 600 numbered comps + 40 shadcn-style primitives + 5 hooks + 1 lib (MIT apps/origin subtree; Tailwind v4 REQUIRED) | payloads (~2.2MB) in `vendor/origin/r/*.json` + 10 navbar helpers | `_index/application-ui.tsv` | `sources/origin.md` |
| `gsap` | GSAP 3.15 — core + ALL plugins now free (SplitText, ScrollTrigger, MorphSVG…) | `vendor/gsap/llms.txt` + official agent skills in `vendor/gsap/skills/` | grep `llms.txt` | `sources/gsap.md` |
| `motion` | Motion 12 (ex-Framer Motion), React + vanilla | `vendor/motion/llms.txt` doc index | grep `llms.txt` | `sources/motion.md` |
| `lenis` | Smooth scroll 1.3.25 | `vendor/lenis/` (llms.txt, READMEs, dist for zero-build) | read `llms.txt` (7KB, OK) | `sources/lenis.md` |
| `phosphor` | 1,512 icons × 6 weights = 9,072 SVGs (MIT) | SVGs stay compressed in `vendor/phosphor/core.tgz` | `_index/icons.tsv` | `sources/phosphor.md` |
| `animista` | 664 CSS keyframe animations (FreeBSD, attribution required) | `vendor/animista/keyframes.css` | `_index/animista.tsv` | `sources/animista.md` |
| `paper-shaders` | 29 zero-dep WebGL2 shader backgrounds/textures @ 0.0.78 (Apache-2.0) — DEFAULT for ambient/gradient/texture/retro-print | ESM dist (~370K) in `vendor/paper-shaders/dist/` + per-shader docs | `_index/paper-shaders.tsv` | `sources/paper-shaders.md` |
| `vanta` | 14 animated WebGL backgrounds + pinned three.r134 | `vendor/vanta/dist/` | `_index/vanta.tsv` | `sources/vanta.md` |
| `shadergradient` | 10 shader gradient presets (React/R3F) | `vendor/shadergradient/presets.ts` | `_index/shadergradient-presets.tsv` | `sources/shadergradient.md` |
| `curtains` | DOM-synced WebGL 8.1.6 (MIT, zero-dep, frozen upstream) — page-flow `<img>`/`<video>`/`<canvas>` become distortable planes (scroll-bend, hover ripple, gallery morph); no-WebGL fallback = the original DOM element | `vendor/curtains/` (~2.1MB: UMD dist + src ESM + 18 doc pages + 10 stripped examples) | grep `documentation/*.html` by class/method (no TSV — nothing enumerable) | `sources/curtains.md` |
| `vfx-js` | 22 preset WebGL post-effects applied to REAL page media — img/video/canvas/text (glitch, rgb-shift, duotone, halftone, shader transitions) @ 1.1.0 (MIT, zero deps) — media-FX, never backgrounds | `vendor/vfx-js/lib/esm/` (~372KB, ~59KB gzip runtime) | `_index/vfx-presets.tsv` | `sources/vfx-js.md` |
| `noise` | 20 reference noise functions (GLSL + 2 WGSL) by the algorithm authors (MIT) — seamless-tiling psrdnoise w/ analytic-derivative flow, simplex/classic-periodic 2/3/4D, cellular/Worley; the INGREDIENTS layer for custom shaders (Paper Shaders stays the composed-effects source) | ~120KB text in `vendor/noise/{webgl-noise,psrdnoise}/` | `vendor/noise/functions.tsv` (23 rows) | `sources/noise.md` |
| `model-viewer` | Google `<model-viewer>` 4.3.1 — zero-build 3D display: one script tag + one element = camera-orbit glTF hero with poster fallback (Apache-2.0; self-contained build bundles its own three) | 4-file allowlist (~1.65MB, byte-pinned) in `vendor/model-viewer/dist/` | card-only (no TSV — single element); grep `dist/model-viewer.d.ts` for attributes | `sources/model-viewer.md` |
| `assets-3d` | 3D asset shelf — 2 Poly Haven 1K HDRIs (CC0, byte-pinned): studio + sunset image-based lighting for model-viewer/drei/three/OGL; Khronos CC0 glb core tier pinned but pending owner sign-off | `vendor/assets-3d/` (~3.1MB: `hdri/*.hdr` + license evidence + ledger) | `_index/assets-3d.tsv` | `sources/assets-3d.md` |
| `r3f-drei` | react-three-fiber 9.7.0 + drei 10.7.7 doc artifacts + pins-and-traps card (React 3D scene/staging; DOCS PACK ONLY — runtime never vendored) | 2 llms-full.txt (168KB + 206KB, GREP-ONLY) + PIN.json in `vendor/r3f-drei/` | grep the llms-full files (never read fully) | `sources/r3f-drei.md` |
| `recent` | 504 curated design references + 25 agent skills + 53 tools (metadata only) | `vendor/recent/` | `_index/inspiration.tsv`, `_index/recent-tools-skills.md` | `sources/recent.md` |
| `layers` | 1,000 design shots metadata + 100 palettes (5–6 colors) + tag taxonomy | `vendor/layers/` | `_index/inspiration.tsv`, `_index/palettes.tsv` | `sources/layers.md` |
| `svgl` | 665 official brand logos — light/dark/wordmark variants (MIT collection; marks remain trademarks) | 1,081 SVGs (~5.6MB) in `vendor/svgl/library/` | `_index/logos.tsv` | `sources/svgl.md` |
| `radix-colors` | 31 hand-tuned 12-step color scales, light+dark+alpha (MIT) — ramps/state/text steps + dark mapping; infrastructure, never the palette | `vendor/radix-colors/css/` (126 CSS files, ~140KB) | `_index/radix-colors.tsv` | `sources/radix-colors.md` |
| `review-packs` | Phase 4 review law: Vercel Web Interface Guidelines (93-rule checklist, MIT) + axe-core 4.12.1 a11y engine with closed 22-rule allowlist (MPL-2.0) | `vendor/review-packs/` (`wig/` + `axe/`, ~600KB) | `_index/review-rules.tsv` | `sources/review-packs.md` |
| `media-chrome` | Branded inline video players @ 4.19.2 (MIT, Mux) — 11 core chrome web components (vanilla 40-file subset, dependency-free) + iife bundle + 3 curated player.style themes; the ONLY styled-player answer (native `<video controls>` is unstylable) | `vendor/media-chrome/` (~700KB: ESM subset + `iife/all.js` + themes) | `_index/player-themes.tsv` | `sources/media-chrome.md` |
| `video-policy` | Stock-video sourcing law: Coverr/Pexels/Pixabay 2026 terms — video FILES never vendored (all three prohibit standalone redistribution); projects fetch their own footage; hotlinking banned | card only — nothing vendored, no sync fn | — (per-service dos/donts table lives in the card) | `sources/video-policy.md` |

## Routing: task → moves

All paths relative to this skill directory. Column layouts of each TSV are in
its `#` header line.

**Need a component** (hero, card, button, text effect, marquee, ticker, dock…)
```bash
grep -i "<concept>" vendor/_index/components.tsv        # 303 rows, 5 sources
grep -iE "ticker|count" vendor/_index/components.tsv    # e.g. stats/count-up
```
Marketing sections (pricing, testimonials, footers, auth) → the sections block
below. Application/form/data UI → the application-ui block below. Still
hand-built from brief tokens: e-commerce blocks (cart, checkout, product grids)
and real charts — shadcn/ui or plain markup, reusing the page's entrance vocab.
Then read ONLY the matched item file (`r/<name>.json` → `.files[0].content` has
full source; motion-primitives are plain `.tsx`). Copy into the project, install
its `npm_deps`, satisfy `registry_deps` (shadcn/ui parts; `fancy` rows carry
LOCAL `vendor/fancy/r/` paths — copy those payloads too, NEVER fetch
fancycomponents.dev: vendored copies are a patched fork). Extraction:
`bash scripts/get-component.sh <item.json> [--deps|--files]` — works with jq,
node, or python3, whichever exists; prefer it over raw jq on unknown machines.
When adapting any copied component: replace `transition-all` with an explicit
property list and add a `focus-visible` ring — the two defects the review pack
finds most (fixing them at copy time beats fixing them in Phase 4).

**Need a wild-tier showpiece** (physics gravity, falling/draggable elements, gooey/pixelate SVG filter, text or marquee along an SVG path)
```bash
grep -i "wild:" vendor/_index/components.tsv             # 8 fancy showpieces, reached intentionally
awk -F'\t' '$1=="fancy"' vendor/_index/components.tsv
```
→ Read `sources/fancy.md` FIRST — wild tier is law: ONE showpiece per page (it
takes the shader/wild slot), NEVER on dashboards/app surfaces. SVG filters have
NO Safari support — UA-gate + designed static fallback mandatory. Physics ships
`autoStart={false}` + reduced-motion gate + IntersectionObserver start/stop.
Physics/falling/draggable route HERE (fancy `gravity` is primary); reactbits
`FallingText` is demoted — uncancelled rAF + double engine-step defects.

**Need a layered 3D hover-depth card** (multi-plane scene that tilts with the
cursor — layers at different depths, projected shadow, moving highlight;
product showcase / depth / portfolio-tier cards)
→ `sources/atropos.md` — card-only source, no TSV; the card is the route.
THREE-WAY DEPTH BOUNDARY (law): layered multi-plane hover SCENE → `atropos`
(only source in the genre). Single-plane tilt → reactbits `TiltedCard` /
motion-primitives tilt via `components.tsv` — never upgrade plain tilt to
Atropos. Physics floating/falling/draggable → `fancy` wild tier. Non-optional
in every build (library has ZERO built-in handling): prefers-reduced-motion
gate (skip init / `destroy()` on change) and `rotateTouch: 'scroll-y'` (the
default `true` sets `touch-action:none` and eats mobile page scroll). Cap
~6–8 instances/page — each runs a perpetual rAF loop even idle; grids
destroy/re-init offscreen via IntersectionObserver; never inside actively
scrolling containers (hover origin drifts — rect cached at pointerenter).

**Need a marketing section or full landing page** (hero, pricing, testimonials,
footer, faqs, stats, logo cloud, CTA, team, integrations, comparator, contact,
login/sign-up/forgot-password)
```bash
grep -i "pricing" vendor/_index/sections.tsv | awk -F'\t' '$2=="dusk"'  # 160 rows; ALWAYS filter to the project's ONE kit
awk -F'\t' '$3=="full-page"' vendor/_index/sections.tsv                  # 10 landing compositions (section-order reference)
```
LAW: ONE kit per project (dusk OR mist OR veil) — three voices down to button
radius; mixing kits breaks coherence like mixing icon weights. Tailwind >= 4.1
only: the `mask-*` hero treatments silently no-op below it (< 4.1 → hand-build
from brief tokens). Every block ships placeholder content that MUST be replaced
before ship (logo clouds → svgl, testimonial quotes+avatars, all copy, /public
+ Unsplash images) and `HEAVY:`-flagged rows carry recharts/dotted-map weight.
Card first: `sources/tailark.md` (patch-on-copy defect list included).
Full-page assembly recipe: `recipes.md` `#landing-scaffold`.

**Need application/form/data UI** (date/time pickers, steppers, combobox/
multiselect, data tables, navbars, pagination, uploads, OTP/payment/phone
inputs, settings panels)
```bash
grep -i "<concept>" vendor/_index/application-ui.tsv     # 646 rows, origin only
awk -F'\t' '$3 ~ /(^|,)date(,|$)/' vendor/_index/application-ui.tsv   # exact-tag match
```
ROUTING LAW (`sources/origin.md`): origin serves application/form/data UI
ONLY — never heroes, marketing sections, or animation work (reactbits/magicui/
kokonutui set the taste ceiling there). Check the target's Tailwind major
FIRST: **v4 required** — on v3 the payloads' classes silently no-op and gut
exactly the focus/spacing/animation a11y affordances that justify using origin;
the card has the v3 downgrade mappings. `registryDependencies` are absolute
coss.com URLs — resolve LOCALLY by basename in `vendor/origin/r/`, never fetch.
The 20 navbar comps also import `vendor/origin/navbar-components/` helpers.

**Need an icon**
```bash
grep -i "<concept>" vendor/_index/icons.tsv             # searches names + tags
bash scripts/get-icon.sh <name> <weight>                 # emits single SVG
```
React projects: `npm i @phosphor-icons/react` and import by pascal_name instead.
Pick ONE weight per project (duotone/regular for UI chrome; fill for emphasis).
Note: non-regular SVG filenames carry the weight suffix (`heart-fill.svg`) —
`get-icon.sh` handles this; when swapping icons from copied components, replace
their lucide/radix icons with phosphor to keep one icon family.

**Need a brand logo** (customer strip, integration grid, "built with" footer)
```bash
grep -i "<brand>" vendor/_index/logos.tsv                # 664 brands; grep titles too ("Amazon Web Services", not just "aws")
bash scripts/get-logo.sh <name> [light|dark|wordmark|wordmark-dark]
```
HARD RULE: brand absent from `logos.tsv` → styled TEXT wordmark placeholder.
Never hand-draw/approximate a mark, never substitute phosphor `*-logo` glyphs,
never recolor/tint/CSS-invert — dark theme uses the `route_dark` column. Marks
are trademarks: nominative use only (real stacks/integrations), never fabricated
customer walls. Card first: `sources/svgl.md`.

**Need a micro-animation** (entrance, exit, attention, text effect)
```bash
grep -i "slide-in\|scale-in\|<concept>" vendor/_index/animista.tsv
grep -o '@keyframes <name>{[^@]*' vendor/animista/keyframes.css   # extract one
```
Defaults (duration/easing/fill) are in the TSV — scale down to 150–250ms for
small surfaces (popovers, toasts). *Never read keyframes.css fully.*

**Need an animated background**
- DEFAULT — ambient/gradient/texture/retro-print (mesh gradient, grain, dithering, halftone, liquid metal, god rays, metaballs…): `grep -i "<mood>" vendor/_index/paper-shaders.tsv` → card `sources/paper-shaders.md` (pinned 0.0.78 — license floor 0.0.77! WebGL2-fallback + reduced-motion recipes are mandatory)
- Mouse/touch-reactive or organic 3D scenes (birds, waves, fog, net, globe): `_index/vanta.tsv` → `sources/vanta.md` (three r134 trap!)
- Existing R3F project reproducing an exact shadergradient.co URL or true-3D sphere/orbit look: `_index/shadergradient-presets.tsv` → `sources/shadergradient.md` (demoted — default is paper-shaders)
- Component-based (particles, grids, beams): grep `background\|grid\|particle` in `components.tsv`

**Need page-media distortion** (images/video already in the page that bend on
scroll, hover flowmap ripple, fullscreen gallery morph — DOM-synced WebGL)
→ `sources/curtains.md` — the ONLY routing answer for this class. Boundary
(law): CUSTOM-shader distortion of EXISTING page media → `curtains`; PRESET
post-effects on media (glitch/duotone) → `vfx-js`; standalone generative
backgrounds stay with paper-shaders/vanta/shadergradient above. reactbits
GridDistortion/FlyingPosters remain widget answers (prop-fed, not page-flow).
Init is GATED on `prefers-reduced-motion` (skip planes → original media shows),
wired to lenis via `updateScrollValues` (one smoothing layer), and counts as
the page's ONE WebGL canvas. Failure mode is the feature: no WebGL → the
original `<img>` renders — verify with the card's `.no-curtains` snippet.

**Need an effect ON real media/content** (hover-glitch tile, scroll-linked duotone footage, VHS rgb-shift video, shader enter/leave transitions on gallery images)
```bash
grep -i "<mood or preset>" vendor/_index/vfx-presets.tsv    # 22 rows: class, mobile_safe, use_case
awk -F'\t' '$2=="transition"' vendor/_index/vfx-presets.tsv  # the 4 enter/leave transitions
```
→ Read `sources/vfx-js.md` FIRST — it is media-FX law: reduced-motion gate
skipping `vfx.add()` entirely + `VFX.init()` null-check (never the throwing
constructor) are MANDATORY (lib has zero built-in handling); cap ~3 registered
elements/page; `pixelRatio: 1` on mobile (default follows devicePixelRatio —
9× the fill cost at dPR 3); `remove()` every element BEFORE `destroy()` or
media stays invisible; ONE effect vocabulary per page. BOUNDARY: preset
effects ON media → vfx-js; custom-shader / DOM-synced scroll distortion →
curtains.js; background generation stays paper-shaders/vanta/shadergradient.
Its overlay canvas spends the page's one-WebGL-surface budget. Text mode is
EXPERIMENTAL — single headlines only (TSV tag `text-headline-EXPERIMENTAL`).

**Need a 3D model displayed** (product hero, device mockup, glTF/GLB viewer)
→ Class `3d-model-viewer`, DISJOINT from animated backgrounds: never answer a
model request with vanta/paper-shaders, never use model-viewer as a background.
DEFAULT (any stack, incl. zero-build): `sources/model-viewer.md` — copy
`vendor/model-viewer/dist/model-viewer.min.js` (self-contained, bundles its own
three — immune to the r134 trap), one `<model-viewer>` tag with MANDATORY
`poster` + `alt`; reduced-motion and mobile poster-only recipes are law in the
card. Max ONE live viewer per page (swap `src` for galleries). Lighting comes
from the 3D asset shelf HDRIs (`vendor/assets-3d/`, `sources/assets-3d.md`) —
`environment-image` is what separates product-grade from gray primitives.
React/R3F scene composition → reactbits `ModelViewer` (TRAP: default
`environmentPreset='forest'` runtime-fetches raw.githack — pass a local HDRI
via `Environment files=`). Scroll choreography = GSAP ScrollTrigger tweening
`camera-orbit` (recipes.md `#product-3d`) — no new animation library.

**Need 3D lighting or an HDRI environment** (product-hero lighting, environment-image, skybox, image-based lighting for any glb/three/OGL scene)
```bash
cat vendor/_index/assets-3d.tsv                       # tiny — 2 byte-pinned CC0 HDRIs (+ glbs once the core tier is signed off)
grep -i "studio\|sunset" vendor/_index/assets-3d.tsv
```
→ COPY the `.hdr` into the project (`cp`, never read the binary) and reference
by local path: model-viewer `environment-image` (+ optional `skybox-image`),
drei `<Environment files="/venice_sunset_1k.hdr"/>`, three/OGL via RGBELoader.
NEVER a preset string — `preset="sunset"`/`environmentPreset` fetch raw.githack
at runtime and break offline/production builds (the vendored reactbits
`ModelViewer-TS-TW` defaults to `preset='forest'` — always override with a
local file). Card first: `sources/assets-3d.md` — shelf law: scaffolding/
lighting/placeholders only; client heroes ship the client's own model (lit by
these HDRIs), never a shelf glb as the final asset.

**Need React 3D scene/staging** (drei Environment/Stage/Float/ContactShadows, r3f Canvas tuning, extending the six vendored r3f-dependent payloads)
```bash
grep -n 'path="/staging/' vendor/r3f-drei/drei-llms-full.txt      # 25 staging pages
awk '/<page path="\/staging\/environment"/,/<\/page>/' vendor/r3f-drei/drei-llms-full.txt
```
→ Read `sources/r3f-drei.md` FIRST — pins are law: `three@0.185
@react-three/fiber@9.7.0 @react-three/drei@10.7.7`, react `>=19 <19.3` (peer
CEILING, not just floor); never drei 11.x alphas. TRAP 1: drei Environment
presets runtime-fetch raw.githack — always `<Environment files=` with a local
HDRI copied from `vendor/assets-3d/` (reactbits ModelViewer's default
`environmentPreset='forest'` reproduces the defect in-arsenal). TRAP 2: never
co-bundle with vanta's three r134. This path is for React apps ALREADY
committed to three — a static/zero-build 3D model request routes to
model-viewer, never to an R3F scaffold.

**Writing a custom shader** (curtains.js plane, OGL background, three.js material, raw canvas) **that needs noise**
```bash
cat vendor/noise/functions.tsv                        # 23 rows: function → dims/tiling/derivatives/cost tier/use-for
awk -F'\t' '$6 ~ /cheap/' vendor/noise/functions.tsv  # mobile-tier candidates (mpsrdnoise2 is the mobile default)
```
→ SANCTIONED-NOISE LAW (`sources/noise.md`): custom shader noise imports from
`vendor/noise/` — NEVER transcribed from Shadertoy/blogs (CC-BY-NC default;
LYGIA stays rejected on Prosperity 3.0.0). Copy the ONE file you need with its
MIT header intact (for psrdnoise the header IS the license). Seamless loops →
psrdnoise2 (tiles at any integer period); flow → analytic-derivative variants;
cells → cellular family. This is the INGREDIENTS layer — a finished background
request still routes to paper-shaders first.

**Need scroll behavior** (smooth scroll, scroll-driven animation)
→ `sources/lenis.md`; pair with GSAP ScrollTrigger via `sources/gsap.md`.

**Need imperative/timeline animation** (SVG morph, split text, complex sequences)
→ `sources/gsap.md`. Official GSAP agent guidance is vendored at
`vendor/gsap/skills/` — read the relevant skill before writing GSAP code.
Declarative React animation (springs, layout, gestures) → `sources/motion.md`.

**Need a video player** (product demo, testimonial, tutorial — inline video the user controls)
```bash
cat vendor/_index/player-themes.tsv                      # 3 curated themes; controls column is a build-time census
```
→ Read `sources/media-chrome.md` FIRST — the video class boundary is law, one
answer per class: player UI → media-chrome; hero/background video → recipes.md
`#hero-video` with NO chrome (controls on ambience is a category error); video
effects → vfx-js — and effects NEVER stack on a chrome-controlled player
(canvas overlay vs control overlay). Web components work in any stack; React
imports `media-chrome/react` from npm at the exact pin 4.19.2 (never vendored —
that wrapper is where the ce-la-react dep lives). Themes run on
`dist/iife/all.js`/CDN/npm, NOT the copied ESM subset (they use controls beyond
the 11). Chrome inherits brief tokens via `--media-*` CSS vars (Radix bridge:
hover step 4, accent step 9, focus ring step 8); never remove
`--media-focus-box-shadow`.

**Need stock footage** (hero/background video, demo b-roll, testimonial filler)
→ Read `sources/video-policy.md` FIRST — it is sourcing law: download from
Coverr/Pexels/Pixabay INTO the project (never hotlink a stock CDN URL, never
vendor a clip into the arsenal — all three licenses ban standalone
redistribution); Coverr free-tier downloads get an attribution credit; none of
the three clear brands/trademarks or provide model releases. How footage
SHIPS (poster, autoplay contract, reduced-motion, Save-Data mobile tiers) →
`recipes.md` #hero-video; branded inline player chrome → media-chrome; effects
on media → vfx-js.

**Need direction, inspiration, or a palette** (do this FIRST for new designs)
```bash
grep -i "<vertical or pattern>" vendor/_index/inspiration.tsv   # 1,504 curated refs
grep dark-ui vendor/_index/palettes.tsv | head -15               # real palettes, tagged dark-ui/light-ui/accent-only
```
Distill matches into a written design brief (see `orchestration.md`). Reference
metadata only — never copy imagery; sources are for *direction*, not assets.

**Need tokens/ramps from a chosen palette** (hover/active states, borders, muted text, dark mode)
```bash
awk -F'\t' '$2==9 {print $1"\t"$3"\t"$7}' vendor/_index/radix-colors.tsv  # snap accent hex → nearest step-9 solid + safe foreground
awk -F'\t' '$1=="cyan"' vendor/_index/radix-colors.tsv                    # one full 12-step ramp, light+dark hexes + roles
```
Character comes from `palettes.tsv`/brand hexes FIRST; Radix supplies only the
ramps beneath it (`sources/radix-colors.md` — role split is law). Steps 11/12
are the text steps; check `step9_foreground` before white text on any solid.

**Building a full page/site** → `orchestration.md` (parallel swarm playbook).
**Combining sources** (hero + bg + scroll + icons) → `recipes.md` — grep its
`covers:` lines for your build type, then read only the matched recipe section.

**Reviewing a finished build (Phase 4 lenses)**
```bash
awk -F'\t' '$5=="yes"' vendor/_index/review-rules.tsv    # the 22 allowlisted axe rules
grep -i "<rule concept>" vendor/_index/review-rules.tsv  # 105 rows, impact + wcag tags
```
→ Read `sources/review-packs.md` FIRST — it is Phase 4 law: the WIG exclusion
list, the closed axe allowlist (never widen; tag-based runOnly forbidden), the
skip-silent contract (axe runs once, only when Playwright MCP + a served
preview exist), and the cannot-check list that keeps the prose lens alive. WIG
rule ids sharpen findings reviewers would already raise — never generate them.

## Token discipline

| File | Access |
|---|---|
| `vendor/_index/*.tsv` (large: icons 1,512 / inspiration 1,504 / components 295 rows) | grep only |
| `vendor/_index/{vanta,shadergradient-presets,licenses,palettes}.tsv` (tiny) | reading fully is fine |
| `vendor/*/llms-full.txt` (magicui 648KB, kokonutui 369KB) | NEVER read; grep for a component name only as fallback |
| `vendor/animista/keyframes.css` (394KB, minified) | grep -o single keyframes |
| `vendor/phosphor/core.tgz` / `icons.ts` | `get-icon.sh` / grep TSV |
| `vendor/*/r/<name>.json`, `core/*.tsx` | read whole item — this is the payload |
| `sources/*.md`, `orchestration.md` | read whole file |
| `recipes.md` | grep the `covers:` lines, then read only the matched recipe section |
| `vendor/gsap/llms.txt`, `vendor/motion/llms.txt` | grep for topic, then read only the vendored skill/section |
| `vendor/_index/radix-colors.tsv` (372 rows) | awk/grep by scale/step; pulling one scale (12 rows) is the normal unit |
| `vendor/radix-colors/css/*.css` (126 files, ~1KB each) | copy the 4–6 files you ship into project styles; never bulk-read the directory |
| `vendor/_index/paper-shaders.tsv` (29 rows, long param lines) | grep by mood/shader name; reading fully is fine |
| `vendor/paper-shaders/dist/` + `docs/shaders/<name>.md` | copy dist, don't read; read only the one doc page for the shader in use |
| `vendor/_index/logos.tsv` (664 rows) | grep only |
| `vendor/svgl/index.json` (126KB) | NEVER read — grep `logos.tsv` instead |
| `vendor/svgl/library/*.svg` | copy via `get-logo.sh`; read a single SVG only when prefixing ids for inlining |
| `vendor/review-packs/axe/axe.min.js` (573KB minified engine) | NEVER read; copy beside the served preview at review time, delete after the run |
| `vendor/review-packs/wig/*.md`, `axe/{allowlist.json,rule-descriptions.md}` | read whole; prefer grepping `_index/review-rules.tsv` for rule lookups |
| `vendor/atropos/atropos.d.ts` (932B) + `atropos.mjs` (482-line readable core) | `.d.ts` for the options surface; read `atropos.mjs` only when patching in-vendor — normal use copies `atropos.min.js` + `atropos.min.css` without reading |
| `vendor/atropos/*.min.*`, `atropos-element*`, `atropos.js` | copy, never read — minified/UMD build artifacts |
| `vendor/curtains/documentation/*.html` (18 pages ~1MB; plane-class.html 172KB) | NEVER read whole — grep by class/method name, then read only the matched region |
| `vendor/curtains/dist/*.js` (125KB min / 356KB umd) | NEVER read — copy `curtains.umd.min.js` for zero-build ship |
| `vendor/curtains/examples/*/js/*.setup.js` + `src/**` | read ONE file when adapting/patching; examples are reference reading, not runnable-as-is |
| `vendor/model-viewer/dist/model-viewer{,-module}.min.js` (1.02MB + 464KB) | NEVER read; copy the self-contained build into the project; module build only per the card's three ^0.183 scope |
| `vendor/model-viewer/dist/model-viewer.d.ts` (89KB) | grep by attribute/property name only (`cameraOrbit`, `reveal`…), never read whole |
| `vendor/assets-3d/hdri/*.hdr` (binary Radiance, 1.4–1.7MB each) | NEVER read/cat/grep — `cp` into the project and reference by path |
| `vendor/_index/assets-3d.tsv` + `vendor/assets-3d/{assets.tsv,LICENSE-NOTICE.md}` (tiny) | reading fully is fine — assets.tsv is the curation ledger |
| `vendor/media-chrome/dist/iife/all.js` (241KB minified IIFE) | NEVER read; copy beside fully-offline zero-build pages — the only iife build that defines `<media-theme>` |
| `vendor/media-chrome/dist/*.js` (40-file ESM subset) + `themes/<name>/template.html` | read ONE component when tuning / read a theme template whole when customizing; never bulk-read the tree |
| `vendor/_index/vfx-presets.tsv` (22 rows) + `_index/player-themes.tsv` (3 rows) | reading fully is fine |
| `vendor/vfx-js/lib/esm/` | copy/import, don't read; exceptions: `constants.js` for ONE preset's GLSL, `*.d.ts` for API shape |
| `vendor/noise/functions.tsv` (23 rows) | reading fully is fine; grep by use-for/cost tier |
| `vendor/noise/{webgl-noise,psrdnoise}/*.{glsl,wgsl}` (2-25KB each) | copy the ONE function file you need WITH its MIT header; never bulk-read the tree |
| `vendor/r3f-drei/r3f-llms-full.txt` (168KB) + `drei-llms-full.txt` (206KB) | NEVER read fully — grep for the component/prop, then read ONLY the matched `<page …>` block |
| `vendor/_index/sections.tsv` (160 rows) | grep only; ALWAYS filter the kit column (`awk -F'\t' '$2=="dusk"'`) |
| `vendor/tailark/r/<name>.json` | read whole item — payload; resolve `@tailark-oss/*` deps to sibling files in `r/` (5 excluded dupes map to motion-primitives/magicui vendors — card has the map) |
| `vendor/_index/application-ui.tsv` (646 rows) | grep only |
| `vendor/origin/registry.json` (646-item upstream index, ~280KB) | NEVER read — grep `application-ui.tsv` instead |
| `vendor/origin/r/<name>.json` | read whole item; for giants like `comp-542` (~119KB, 18 files) extract via `get-component.sh` instead of reading |
| `vendor/origin/navbar-components/*.tsx` (10 helpers, 1–5KB) | read/copy whole file when a navbar payload imports it |

## License constraints

For any license/resale/audit question: `cat vendor/_index/licenses.tsv` — one
row per source with resale/redistribution verdict, attribution needs, and the
license file path. Summary (full detail in each card):

- **MIT, no strings**: magicui, kokonutui, motion-primitives, phosphor, lenis, motion (core), vanta, radix-colors, wig, atropos, curtains.
- **paper-shaders**: Apache-2.0 at the pinned 0.0.78 — ship `vendor/paper-shaders/LICENSE` + `NOTICE` with redistributed dist files; **never install/resolve below 0.0.77** (PolyForm Shield licensing there), never float the version.
- **svgl**: MIT covers the collection, NOT the marks — logos stay trademarks of their owners. Nominative use only; never fabricate customer walls or imply endorsement; no logo-pack resale.
- **axe-core**: MPL-2.0 — redistribute `axe.min.js` only unmodified with its LICENSE alongside; the Phase 4 review-time copy in the served dir must be deleted after the run; never ship in product builds.
- **tailark**: MIT (upstream `LICENCE.md`) — but the embedded `core-*` brand SVGs (Spotify, Vercel, Claude, OpenAI…) remain trademarks: replace placeholder logo clouds with the project's real logos (svgl law); never ship them as fake customer walls.
- **origin**: MIT — the `apps/origin` subtree of cosscom/coss ONLY ("Originally Copyright (c) 2025 Origin UI"); the monorepo ROOT is **AGPLv3**. Sync extracts nothing outside `apps/origin/`; never vendor or copy anything else from that repo.
- **fancy**: MIT — ship freely; but vendored copies are an alex-style PATCHED FORK of a curated 8-item subset. Refreshing items from the live site (instead of `sync.sh fancy`) reintroduces the four patched defects; the text tier stays excluded (routing law, `sources/fancy.md`).
- **model-viewer**: Apache-2.0 at the pinned 4.3.1 — ship `vendor/model-viewer/LICENSE` alongside redistributed dist files (no upstream NOTICE file at this version; embedded BSD-3-Clause lit headers are standard and compatible).
- **assets-3d**: CC0 1.0 (Poly Haven HDRIs — page-level declarations verified; redistribution incl. sold products explicitly allowed). No attribution required — provenance recorded anyway in `vendor/assets-3d/{assets.tsv,LICENSE-NOTICE.md}`. The Khronos glTF repo has NO top-level license: per-model `metadata.json` `legal[]` arrays ARE the license — a model enters the shelf only if EVERY entry is CC0.
- **media-chrome**: MIT (Mux) — vendored copy is a curated VANILLA SUBSET (react/cjs/menu/cast/airplay/live excluded); React consumers install `media-chrome@4.19.2` from npm. player.style themes are MIT per-theme; brand-lookalike themes are **permanently excluded** on trade-dress grounds — never vendor, never imitate their look.
- **vfx-js**: MIT at every published version (1.x is zero-dep; the old three.js dep died at 0.13.0). Wart: upstream internally vendors a gifuct-js port without its MIT copyright header — inherited when redistributing; recorded in `licenses.tsv`, not a blocker. Pin 1.1.0 exactly; never install below 1.0.0.
- **noise**: MIT twice over — webgl-noise ships `vendor/noise/webgl-noise/LICENSE`; psrdnoise has NO upstream LICENSE file (MIT via in-file headers + README; authored notice at `vendor/noise/psrdnoise/LICENSE-NOTICE.md`). The in-file headers are the operative license text — never strip them from copied shaders. LYGIA stays rejected (Prosperity 3.0.0); Shadertoy transcription stays banned.
- **r3f-drei**: MIT (both pmndrs packages) — vendored artifacts are doc exports only; the r3f/drei runtime is NEVER vendored (npm-install at the card's exact pins). Environment lighting must cite local `vendor/assets-3d/` HDRIs — drei presets runtime-fetch raw.githack (hard rule 1 violation).
- **video-policy**: standing law — stock video FILES are NEVER vendored into the arsenal and never hotlinked; all three sanctioned services (Coverr/Pexels/Pixabay) prohibit standalone redistribution (clause quotes + fetch dates in `sources/video-policy.md`). Projects download their own footage; Coverr free tier requires attribution (2026 terms).
- **shadergradient**: MIT declared in package.json/README only — no LICENSE file exists upstream; flag legal if formal text is required.
- **reactbits**: MIT + Commons Clause — ship freely in products; NEVER resell/redistribute the components themselves, **including ported/rewritten versions** (no component-library or template-pack products).
- **gsap**: free incl. all plugins & commercial + AI use; don't bundle gsap runtime files into paid template packs (declare as npm dep); can't build no-code animation tools competing with Webflow.
- **animista**: FreeBSD — distributed CSS must ship the FULL license text from `vendor/animista/LICENSE.txt` (notice + conditions + disclaimer; a one-line credit alone doesn't satisfy it).
- **recent, layers**: metadata vendored for reference/direction ONLY. Never copy imagery into products; never treat as assets.

## Tooling assumptions

Design-time flows need only `bash`/`grep`/`tar` plus one of jq/node/python3
(`get-component.sh` auto-picks). If a command in a source card fails because a
tool is missing (e.g. no `jq`), switch to the helper scripts rather than
installing anything. Refresh additionally needs `curl`, `git`, `jq`, `node`.

## Refresh

```bash
bash scripts/sync.sh            # re-vendor everything (curl/git/tar only)
node scripts/build-catalogs.mjs # regenerate _index/
```
Run monthly or when a source ships something new. `vendor/MANIFEST.json` records
last sync. Single source: `bash scripts/sync.sh reactbits`.
Adding a NEW source: it must pass the quality gate in `adding-a-source.md` first.
