---
name: alex-style
description: Use when building or styling any web UI — landing pages, hero sections, dashboards, components, marketing sites — or when the user asks for beautiful, animated, or polished design, UI animations, animated backgrounds, gradients, icons, smooth scrolling, or design inspiration. Also use before reaching for the web to find components or animation code.
---

# Alex Style

A fully local design arsenal aggregated from 19 curated sources. Everything —
component source code, animation keyframes, icon SVGs, doc indexes, inspiration
metadata, color palettes, font pairings — is vendored under `vendor/` in this
skill directory.

**Hard rules**
1. **Never fetch from the web what is vendored here.** No WebFetch, no browser
   tools, no registry CLIs for anything in the table below. The only network use
   is `scripts/sync.sh` to refresh, installing npm deps into the target project,
   and per-project font delivery (Fontshare kit downloads / next-font build-time
   fetches / one-time fontsource CDN file copies — `sources/typography.md`).
2. **Grep, don't read.** The TSV indexes in `vendor/_index/` are designed for
   `grep`. Files marked *never read fully* below will blow your context — always
   grep or extract single items.
3. **Read the source card before first use of a source** (`sources/<slug>.md`,
   60–120 lines each): license constraints, pitfalls, exact consume commands.
4. **For multi-section or multi-page builds, follow `orchestration.md`** —
   dispatch parallel section agents only after writing the design brief.

**Rule 0 — ambition (outranks every restraint below).** A plain request is a
request for the FULL treatment — "simple" means simple to use, never sparse.
Fill EVERY expressive role the stack allows, each from its arsenal source, and
prefer COMBINATIONS that cohere (that is what `recipes.md` exists for):
direction + palette (inspiration/palettes.tsv) → type with real hierarchy →
editorial furniture (kickers, pull-quotes, oversized numerals — recipes.md #9) →
one designed hero moment (animated background, illustration, or text effect) →
entrance choreography (animista/motion) → smooth scroll on marketing pages
(lenis, wired to gsap when scenes scroll) → one icon family (phosphor) →
social proof + stats. A build that leaves expressive roles unfilled — or uses
one source where a proven recipe combines three — is the defect. Restraint
rules are ceilings to build UP to, never targets.
Every prompt is ELEVATED before routing (orchestration.md Phase 0 step 0):
concept, signature moment, genre-ceiling plan, voice, aesthetic — you build
the elevated brief, never the literal minimum.
DEFAULT AESTHETIC — unless the user names their own: the house register, i.e.
studio-grade art direction — composed like an editorial spread (characterful
display type, kickers, pull-quotes, oversized numerals), warm living grounds
(tinted paper/cream/warm ink — raw #fff/#000 is a generated tell), one
saturated accent, asymmetric composition, and at least one visibly human touch.
Dynamic and functional, but art-driven: it must read as designed by a boutique
studio, never generated. Full spec + per-client translation rules:
orchestration.md Phase 0 "Aesthetic". A user-named aesthetic replaces the
register, never the craft bar.
VARIATION IS PART OF CRAFT: worked examples in cards and first rows of TSVs
are arbitrary, never defaults. For every hero moment, shortlist THREE candidate
treatments from different sources/classes and pick the one most specific to
THIS brief — if your pick is what every similar site would choose, re-pick.
Uniqueness is MECHANICAL, not aspirational: shortlists start from random
index slices — `bash scripts/vary.sh <tsv> <n> [pattern]` — never from grep
order, and every build is checked against, then appended to, `ledger.tsv`
(orchestration.md "Variation protocol") so signature choices — palette,
display face, hero treatment, background, text effect, motion family, human
touch, layout archetype — never repeat recent builds.
Judge your own output the way it will be judged (`evals/judging.md`): arsenal
utilization and variation, whether the page is impressive/exciting/engaging,
and craft.

## The arsenal

| Slug | What | Size | Index (grep this) | Card |
|---|---|---|---|---|
| `magicui` | 77 animated React components (shadcn-style, MIT) | full source in `vendor/magicui/r/*.json` | `_index/components.tsv` | `sources/magicui.md` |
| `kokonutui` | 46 polished React components (MIT) | `vendor/kokonutui/r/*.json` | `_index/components.tsv` | `sources/kokonutui.md` |
| `reactbits` | 139 animated components, TS+Tailwind variant (MIT+Commons Clause) | `vendor/reactbits/r/*.json` | `_index/components.tsv` | `sources/reactbits.md` |
| `motion-primitives` | 33 motion components (MIT) | `vendor/motion-primitives/core/*.tsx` + `docs/` | `_index/components.tsv` | `sources/motion-primitives.md` |
| `gsap` | GSAP 3.15 — core + ALL plugins now free (SplitText, ScrollTrigger, MorphSVG…) | `vendor/gsap/llms.txt` + official agent skills in `vendor/gsap/skills/` | grep `llms.txt` | `sources/gsap.md` |
| `motion` | Motion 12 (ex-Framer Motion), React + vanilla | `vendor/motion/llms.txt` doc index | grep `llms.txt` | `sources/motion.md` |
| `lenis` | Smooth scroll 1.3.25 | `vendor/lenis/` (llms.txt, READMEs, dist for zero-build) | read `llms.txt` (7KB, OK) | `sources/lenis.md` |
| `phosphor` | 1,512 icons × 6 weights = 9,072 SVGs (MIT) | SVGs stay compressed in `vendor/phosphor/core.tgz` | `_index/icons.tsv` | `sources/phosphor.md` |
| `animista` | 664 CSS keyframe animations (FreeBSD, attribution required) | `vendor/animista/keyframes.css` | `_index/animista.tsv` | `sources/animista.md` |
| `vanta` | 14 animated WebGL backgrounds + pinned three.r134 | `vendor/vanta/dist/` | `_index/vanta.tsv` | `sources/vanta.md` |
| `shadergradient` | 10 shader gradient presets (React/R3F) | `vendor/shadergradient/presets.ts` | `_index/shadergradient-presets.tsv` | `sources/shadergradient.md` |
| `recent` | 504 curated design references + 25 agent skills + 53 tools (metadata only) | `vendor/recent/` | `_index/inspiration.tsv`, `_index/recent-tools-skills.md` | `sources/recent.md` |
| `layers` | 1,000 design shots metadata + 100 palettes (5–6 colors) + tag taxonomy | `vendor/layers/` | `_index/inspiration.tsv`, `_index/palettes.tsv` | `sources/layers.md` |
| `atropos` | Layered 3D hover-depth SCENES @ 2.0.2 (MIT, zero-dep, 8.6KB working core) — per-layer `data-atropos-offset` planes + projected shadow + highlight sweep; vanilla/React/web-component from one pinned tarball | 15-file curated tarball subset (~91KB) + `PIN.json` byte pins in `vendor/atropos/` | card-only, no TSV — `sources/atropos.md` IS the route | `sources/atropos.md` |
| `rough-notation` | Hand-drawn ANNOTATIONS on live copy @ 0.5.1 (MIT, zero-dep bundled builds, ~10.7KB working core) — underline/circle/box/bracket/highlight/strike-through as animated SVG over real DOM text; vanilla IIFE/ESM + sanctioned React path via magicui `highlighter` | 10-file curated tarball subset (~45KB) + `PIN.json` byte pins in `vendor/rough-notation/` | card-only, no TSV — `sources/rough-notation.md` IS the route | `sources/rough-notation.md` |
| `roughjs` | Hand-sketched SHAPE PRIMITIVES @ 4.6.6 (MIT, 4 deps fully inlined in bundled builds, ~27KB working core) — wobbly line/rect/ellipse/polygon/arc/path, 7 fill styles, SVG/canvas/DOM-free generator; composes with DrawSVG (rough draws geometry, DrawSVG animates it) | 14-file curated tarball subset (~103KB) + `PIN.json` byte pins in `vendor/roughjs/` | card-only, no TSV — `sources/roughjs.md` IS the route | `sources/roughjs.md` |
| `paper-shaders` | 29 zero-dep WebGL2 shaders @ 0.0.78 (Apache-2.0, LICENSE+NOTICE travel) — print-register textures (grain, paper, halftone, dither) + 2D gradient fields + vivid set (liquid metal, god rays…); React components AND zero-build relative-import ESM from two pinned tarballs | curated tarball subsets, maps excluded (~551KB) + `PIN.json` sha1/byte pins in `vendor/paper-shaders/{core,react}/` | `_index/paper-shaders.tsv` | `sources/paper-shaders.md` |
| `fancy` | 15-item CURATED editorial/typographic subset @ f9f62c6 (MIT) — animated underline suite, letter-swap nav hovers, media-between-text, marquee/element/text-along-SVG-path, REAL variable-font axis animation, elastic line, gooey/pixelate SVG filters; rest of registry gated out as duplicates | `vendor/fancy/r/*.json` (15 items + 3 elastic-line hooks) + `PIN.json` commit pin | `_index/components.tsv` | `sources/fancy.md` |
| `typography` | 47 verified display/body/mono pairings across 16 registers (fontsource OFL-1.1 npm + Fontshare ITF-FFL download-only; metadata only, zero binaries) | 1 TSV, ~13KB | `_index/typography.tsv` | `sources/typography.md` |

## Routing: task → moves

All paths relative to this skill directory. Column layouts of each TSV are in
its `#` header line.

**Need a component** (hero, card, button, text effect, marquee, ticker, dock…)
```bash
grep -i "<concept>" vendor/_index/components.tsv        # 295 rows, 4 sources
bash scripts/vary.sh vendor/_index/components.tsv 8 "ticker|count"
# ^ when several classmates fit a role, shortlist from a RANDOM slice, not grep order
```
Not in the arsenal (hand-build from brief tokens): pricing tables, forms,
data tables, auth screens. Hand-build these as EDITORIAL objects — brief type
furniture, hairline rules, oversized numerals (recipes.md #9) — on plain
markup. shadcn/ui primitives are allowed ONLY as unstyled plumbing (focus,
aria, keyboard skeletons) and must be fully re-dressed in brief tokens: the
stock shadcn look — default card/button styling, muted-gray neutrals,
rounded-corner sameness — is a generated tell and NEVER ships.
Then read ONLY the matched item file (`r/<name>.json` → `.files[0].content` has
full source; motion-primitives are plain `.tsx`). Copy into the project, install
its `npm_deps`, satisfy `registry_deps` (shadcn/ui parts — plumbing only; any
visible primitive gets re-dressed in brief tokens). Extraction:
`bash scripts/get-component.sh <item.json> [--deps|--files]` — works with jq,
node, or python3, whichever exists; prefer it over raw jq on unknown machines.

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

**Need a micro-animation** (entrance, exit, attention, text effect)
```bash
grep -i "slide-in\|scale-in\|<concept>" vendor/_index/animista.tsv
bash scripts/vary.sh vendor/_index/animista.tsv 8 "<concept>"     # random-slice shortlist (664 rows)
grep -o '@keyframes <name>{[^@]*' vendor/animista/keyframes.css   # extract one
```
Defaults (duration/easing/fill) are in the TSV — scale down to 150–250ms for
small surfaces (popovers, toasts). *Never read keyframes.css fully.*

**Need an animated background or surface texture**
- Print textures (grain, paper, halftone, dither) + 2D gradient fields: `_index/paper-shaders.tsv` → `sources/paper-shaders.md` (zero-dep WebGL2; recolor law!)
- WebGL scenes (birds, waves, fog, net, globe…): `_index/vanta.tsv` → card `sources/vanta.md` (three r134 trap!)
- Shader gradients (plane/sphere/water): `_index/shadergradient-presets.tsv` → `sources/shadergradient.md`
- Component-based (particles, grids, beams): grep `background\|grid\|particle` in `components.tsv`
All four lanes stay open — route by the brief's register, never delist an option.

**Need a human touch** (hand-drawn annotation, organic motif, sketch accent)
- Annotate live copy (underline/circle/box/bracket/highlight/strike-through):
  `sources/rough-notation.md` — vanilla IIFE/ESM, or the vendored magicui
  `highlighter` wrapper in React (override its pink default with brief colors).
- Organic shapes/motifs/hachure texture blocks: `sources/roughjs.md` (accent-only law).
- Draw-on of custom-authored art paths: GSAP DrawSVG (`sources/gsap.md`).
The three-way boundary law lives in `sources/roughjs.md`; rotation via the
ledger's human_touch axis.

**Need type / a display face** (do this at brief time, with the palette)
```bash
bash scripts/vary.sh vendor/_index/typography.tsv 8 "<register|mood|vertical>"   # 47 pairings, 16 registers
```
Sample at PAIR level and ship the row — display/body/mono were chosen together;
never Frankenstein two rows' display faces. The display face is a ledger
signature axis (never repeat the last build's). `fontsource:` rows are npm/
self-host OK (OFL-1.1); `fontshare:` rows are ITF-FFL — per-project download
only, NEVER vendored or copied between projects. License box + per-stack
consume commands (next/font, @fontsource import, kit curl): `sources/typography.md`.

**Need depth/parallax** (hero layers, mouse-follow art, drifting section
images, hover-depth cards)
→ Scroll + mouse parallax: recipes.md `#8` (the depth system — GSAP
ScrollTrigger on the lenis spine + `gsap.quickTo`; no dedicated parallax lib
ever — they all lost the head-to-head to what is already vendored).
→ Layered 3D hover-depth CARDS → `sources/atropos.md` (card-only source).
Boundary law: multi-plane hover scene → `atropos`; single-plane tilt →
reactbits `TiltedCard`/motion-primitives tilt via `components.tsv` — never
upgrade plain tilt to atropos. Non-optional (library has ZERO built-in
handling): prefers-reduced-motion gate + `rotateTouch: 'scroll-y'`; cap 6–8
instances/page (perpetual rAF each), IntersectionObserver destroy/re-init in
grids.

**Need scroll behavior** (smooth scroll, scroll-driven animation)
→ `sources/lenis.md`; pair with GSAP ScrollTrigger via `sources/gsap.md`.

**Need imperative/timeline animation** (SVG morph, split text, complex sequences)
→ `sources/gsap.md`. Official GSAP agent guidance is vendored at
`vendor/gsap/skills/` — read the relevant skill before writing GSAP code.
Declarative React animation (springs, layout, gestures) → `sources/motion.md`.

**Need direction, inspiration, or a palette** (do this FIRST for new designs)
```bash
bash scripts/vary.sh vendor/_index/inspiration.tsv 10 "<vertical|pattern>"  # 1,504 curated refs, random slice
bash scripts/vary.sh vendor/_index/palettes.tsv 8 light-ui                  # tagged dark-ui/light-ui/accent-only
```
Always sample — never take the head of a grep; re-run for a fresh slice if
the sample is weak. Then run the ledger check (orchestration.md "Variation
protocol") before committing to signature choices. Distill into a written
design brief (see `orchestration.md`). Reference metadata only — never copy
imagery; sources are for *direction*, not assets.

**Building a full page/site** → `orchestration.md` (parallel swarm playbook).
**Combining sources** (hero + bg + scroll + icons) → `recipes.md` — its Craft
floor applies to EVERY build, swarm or solo, no matter how basic the prompt.

## Token discipline

| File | Access |
|---|---|
| `vendor/_index/*.tsv` (large: icons 1,512 / inspiration 1,504 / components 295 rows) | grep only |
| `vendor/_index/{vanta,shadergradient-presets,licenses,palettes,paper-shaders,typography}.tsv` (tiny) | reading fully is fine |
| `vendor/{rough-notation,roughjs}/*.d.ts` + `vendor/paper-shaders/*/dist` | `.d.ts` for options; dists are copy-not-read (normal use copies files without reading them) |
| `vendor/*/llms-full.txt` (magicui 648KB, kokonutui 369KB) | NEVER read; grep for a component name only as fallback |
| `vendor/animista/keyframes.css` (394KB, minified) | grep -o single keyframes |
| `vendor/phosphor/core.tgz` / `icons.ts` | `get-icon.sh` / grep TSV |
| `vendor/*/r/<name>.json`, `core/*.tsx` | read whole item — this is the payload |
| `sources/*.md`, `recipes.md`, `orchestration.md` | read whole file |
| `vendor/atropos/atropos.d.ts` (932B) + `atropos.mjs` (readable core) | `.d.ts` for options; read `atropos.mjs` only when patching — normal use copies `atropos.min.js` + `atropos.min.css` without reading |
| `vendor/gsap/llms.txt`, `vendor/motion/llms.txt` | grep for topic, then read only the vendored skill/section |

## License constraints

For any license/resale/audit question: `cat vendor/_index/licenses.tsv` — one
row per source with resale/redistribution verdict, attribution needs, and the
license file path. Summary (full detail in each card):

- **MIT, no strings**: magicui, kokonutui, motion-primitives, phosphor, lenis, motion (core), vanta, atropos.
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
