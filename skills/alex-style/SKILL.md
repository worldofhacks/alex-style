---
name: alex-style
description: Use when building or styling any web UI — landing pages, hero sections, dashboards, components, marketing sites — or when the user asks for beautiful, animated, or polished design, UI animations, animated backgrounds, gradients, icons, smooth scrolling, or design inspiration. Also use before reaching for the web to find components or animation code.
---

# Alex Style

A fully local design arsenal aggregated from 13 curated sources. Everything —
component source code, animation keyframes, icon SVGs, doc indexes, inspiration
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
| `gsap` | GSAP 3.15 — core + ALL plugins now free (SplitText, ScrollTrigger, MorphSVG…) | `vendor/gsap/llms.txt` + official agent skills in `vendor/gsap/skills/` | grep `llms.txt` | `sources/gsap.md` |
| `motion` | Motion 12 (ex-Framer Motion), React + vanilla | `vendor/motion/llms.txt` doc index | grep `llms.txt` | `sources/motion.md` |
| `lenis` | Smooth scroll 1.3.25 | `vendor/lenis/` (llms.txt, READMEs, dist for zero-build) | read `llms.txt` (7KB, OK) | `sources/lenis.md` |
| `phosphor` | 1,512 icons × 6 weights = 9,072 SVGs (MIT) | SVGs stay compressed in `vendor/phosphor/core.tgz` | `_index/icons.tsv` | `sources/phosphor.md` |
| `animista` | 664 CSS keyframe animations (FreeBSD, attribution required) | `vendor/animista/keyframes.css` | `_index/animista.tsv` | `sources/animista.md` |
| `vanta` | 14 animated WebGL backgrounds + pinned three.r134 | `vendor/vanta/dist/` | `_index/vanta.tsv` | `sources/vanta.md` |
| `shadergradient` | 10 shader gradient presets (React/R3F) | `vendor/shadergradient/presets.ts` | `_index/shadergradient-presets.tsv` | `sources/shadergradient.md` |
| `recent` | 504 curated design references + 25 agent skills + 53 tools (metadata only) | `vendor/recent/` | `_index/inspiration.tsv`, `_index/recent-tools-skills.md` | `sources/recent.md` |
| `layers` | 1,000 design shots metadata + 100 palettes (5–6 colors) + tag taxonomy | `vendor/layers/` | `_index/inspiration.tsv`, `_index/palettes.tsv` | `sources/layers.md` |

## Routing: task → moves

All paths relative to this skill directory. Column layouts of each TSV are in
its `#` header line.

**Need a component** (hero, card, button, text effect, marquee, ticker, dock…)
```bash
grep -i "<concept>" vendor/_index/components.tsv        # 295 rows, 4 sources
grep -iE "ticker|count" vendor/_index/components.tsv    # e.g. stats/count-up
```
Not in the arsenal (hand-build from brief tokens): pricing tables, forms,
data tables, auth screens — use shadcn/ui or plain markup for those.
Then read ONLY the matched item file (`r/<name>.json` → `.files[0].content` has
full source; motion-primitives are plain `.tsx`). Copy into the project, install
its `npm_deps`, satisfy `registry_deps` (shadcn/ui parts). Extraction:
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
grep -o '@keyframes <name>{[^@]*' vendor/animista/keyframes.css   # extract one
```
Defaults (duration/easing/fill) are in the TSV — scale down to 150–250ms for
small surfaces (popovers, toasts). *Never read keyframes.css fully.*

**Need an animated background**
- WebGL scenes (birds, waves, fog, net, globe…): `_index/vanta.tsv` → card `sources/vanta.md` (three r134 trap!)
- Shader gradients (plane/sphere/water): `_index/shadergradient-presets.tsv` → `sources/shadergradient.md`
- Component-based (particles, grids, beams): grep `background\|grid\|particle` in `components.tsv`

**Need scroll behavior** (smooth scroll, scroll-driven animation)
→ `sources/lenis.md`; pair with GSAP ScrollTrigger via `sources/gsap.md`.

**Need imperative/timeline animation** (SVG morph, split text, complex sequences)
→ `sources/gsap.md`. Official GSAP agent guidance is vendored at
`vendor/gsap/skills/` — read the relevant skill before writing GSAP code.
Declarative React animation (springs, layout, gestures) → `sources/motion.md`.

**Need direction, inspiration, or a palette** (do this FIRST for new designs)
```bash
grep -i "<vertical or pattern>" vendor/_index/inspiration.tsv   # 1,504 curated refs
grep dark-ui vendor/_index/palettes.tsv | head -15               # real palettes, tagged dark-ui/light-ui/accent-only
```
Distill matches into a written design brief (see `orchestration.md`). Reference
metadata only — never copy imagery; sources are for *direction*, not assets.

**Building a full page/site** → `orchestration.md` (parallel swarm playbook).
**Combining sources** (hero + bg + scroll + icons) → `recipes.md`.

## Token discipline

| File | Access |
|---|---|
| `vendor/_index/*.tsv` (large: icons 1,512 / inspiration 1,504 / components 295 rows) | grep only |
| `vendor/_index/{vanta,shadergradient-presets,licenses,palettes}.tsv` (tiny) | reading fully is fine |
| `vendor/*/llms-full.txt` (magicui 648KB, kokonutui 369KB) | NEVER read; grep for a component name only as fallback |
| `vendor/animista/keyframes.css` (394KB, minified) | grep -o single keyframes |
| `vendor/phosphor/core.tgz` / `icons.ts` | `get-icon.sh` / grep TSV |
| `vendor/*/r/<name>.json`, `core/*.tsx` | read whole item — this is the payload |
| `sources/*.md`, `recipes.md`, `orchestration.md` | read whole file |
| `vendor/gsap/llms.txt`, `vendor/motion/llms.txt` | grep for topic, then read only the vendored skill/section |

## License constraints

For any license/resale/audit question: `cat vendor/_index/licenses.tsv` — one
row per source with resale/redistribution verdict, attribution needs, and the
license file path. Summary (full detail in each card):

- **MIT, no strings**: magicui, kokonutui, motion-primitives, phosphor, lenis, motion (core), vanta.
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
