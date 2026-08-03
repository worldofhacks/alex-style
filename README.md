# alex-style

A self-contained **design arsenal skill** for Claude Code. Twenty curated
design sources (component registries, animation runtimes, icon sets, brand
logos, CSS animation libraries, WebGL shader backgrounds, systematic color
ramps, design-review rulebooks, and inspiration galleries) aggregated into one
local, indexed, grep-able collection so design work never needs a browser, a
registry CLI, or repeated web fetches. Every source passed a quality gate
([adding-a-source.md](skills/alex-style/adding-a-source.md)) proving it raises
output quality over what the arsenal already had.

## What's inside

```
skills/alex-style/
├── SKILL.md            # entry point: arsenal table, routing, token discipline, licenses
├── orchestration.md    # parallel design-swarm playbook (brief → fan-out → review, resumable)
├── recipes.md          # 18 recipes + routing matrix; grep the covers: tags, read one recipe
├── adding-a-source.md  # the quality gate every new source must pass (11 steps)
├── sources/            # 20 per-source cards: license, pitfalls, consume commands, laws
├── scripts/
│   ├── sync.sh             # re-vendor everything (curl/git/tar only, no browser, no npm install)
│   ├── build-catalogs.mjs  # regenerate the grep indexes in vendor/_index/
│   ├── get-icon.sh         # extract one Phosphor SVG from the vendored tarball
│   ├── get-logo.sh         # extract one SVGL brand mark (light/dark/wordmark variants)
│   └── get-component.sh    # extract component source/deps (jq/node/python3, auto-detected)
├── evals/              # eval prompts + call-monitoring analyzer + static checkers
│   ├── check-arsenal.mjs   # self-test: one runnable contract per source (run after any sync)
│   └── README.md           # smoke vs full tiers, policy.json contract
└── vendor/             # ~24MB fully local arsenal, everything pinned in MANIFEST.json
    ├── _index/             # 14 grep-able TSVs: 303 components, 1,512 icons, 664 animations,
    │                       #   160 marketing sections, 646 application-UI items, 664 brand logos,
    │                       #   372 color-ramp steps, 29 shaders, 105 review rules, 100 palettes…
    ├── magicui/  kokonutui/  reactbits/  motion-primitives/  fancy/   # component source
    ├── tailark/  origin/                                     # marketing sections + application UI
    ├── gsap/  motion/  lenis/                                # llms.txt docs + official agent skills
    ├── phosphor/  svgl/  animista/                           # icons, brand logos, keyframes
    ├── paper-shaders/  vanta/  shadergradient/               # WebGL backgrounds (paper = default)
    ├── radix-colors/  review-packs/                          # color ramps, WIG + axe review law
    └── recent/  layers/                                      # inspiration metadata + palettes
proposals/              # gated proposals awaiting owner sign-off (not part of the skill)
```

| Source | Type | Vendored |
|---|---|---|
| [Magic UI](https://magicui.design) | animated React components (MIT) | 77 components, full source |
| [KokonutUI](https://kokonutui.com) | React components (MIT) | 46 components, full source |
| [React Bits](https://reactbits.dev) | animated components (MIT+Commons Clause) | 139 TS+Tailwind components |
| [Motion-Primitives](https://motion-primitives.com) | motion components (MIT) | 33 components + docs |
| [GSAP](https://gsap.com) | animation platform (free incl. all plugins) | llms.txt + official agent skills |
| [Motion](https://motion.dev) | React/vanilla animation (MIT) | llms.txt doc index |
| [Lenis](https://lenis.dev) | smooth scroll (MIT) | docs + zero-build dist |
| [Phosphor](https://phosphoricons.com) | icons (MIT) | 9,072 SVGs (compressed) + search index |
| [Animista](https://animista.net) | CSS animations (FreeBSD) | 664 keyframes + defaults |
| [Vanta.js](https://www.vantajs.com) | WebGL backgrounds (MIT) | 14 effects + pinned three.r134 |
| [ShaderGradient](https://shadergradient.co) | shader gradients (MIT) | 10 presets + docs |
| [recent.design](https://recent.design) | inspiration | 504 curated refs, 25 agent skills, 53 tools (metadata only) |
| [Layers](https://layers.to) | inspiration | 1,000 shot refs + 100 palettes (metadata only) |
| [Paper Shaders](https://shaders.paper.design) | zero-dep WebGL2 shader backgrounds (Apache-2.0, pinned 0.0.78) | 29 shaders, ESM dist + per-shader docs |
| [SVGL](https://svgl.app) | brand-logo SVGs (MIT collection; marks stay trademarks) | 665 brands, 1,081 SVGs, light/dark/wordmark variants |
| [Radix Colors](https://www.radix-ui.com/colors) | systematic color ramps (MIT) | 31 scales × 12 steps, light+dark, contrast-safe text steps |
| Review packs: [Vercel WIG](https://github.com/vercel-labs/web-interface-guidelines) + [axe-core](https://github.com/dequelabs/axe-core) | design-review rulebooks (MIT / MPL-2.0) | 93-rule checklist + a11y engine with closed 22-rule allowlist |
| [Tailark](https://tailark.com) | marketing section blocks (MIT, SHA-pinned) | 150 sections + 10 full pages × 3 kits, one-kit-per-project law |
| [Origin UI](https://coss.com/origin) | application/form/data UI (MIT `apps/origin` subtree) | 646 items, normalized tags, Tailwind v4 required |
| [Fancy Components](https://fancycomponents.dev) | wild-tier showpieces (MIT, curated patched fork) | 8 items: physics, gooey/pixelate filters, path-following |

## Requirements

**Using the skill** (design time, fully offline):

- `bash`, `grep`, `tar`: preinstalled on macOS and Linux
- any ONE of `jq` / `node` / `python3` for extracting component source from
  registry JSON; `scripts/get-component.sh` auto-detects which you have
- **Windows**: use WSL (recommended) or Git Bash. Git Bash ships bash/grep/tar;
  install Node for the JSON extraction.

**Refreshing the arsenal** (`scripts/sync.sh`, network required, ~2 min):

- `curl`, `git`, `jq` (the sync script itself uses jq), and `node`
  (for `build-catalogs.mjs`)

Nothing is installed globally and no code from the arsenal executes during
sync or use; components are data until you copy them into a project.

## Install

**One command (recommended)**: the [skills.sh](https://skills.sh) CLI installs
into Claude Code, Cursor, Codex, and 40+ other agents:

```bash
npx skills add https://github.com/worldofhacks/alex-style --skill alex-style
```

**Manual (Claude Code, global)**: clone once, symlink, `git pull` for updates:

```bash
git clone https://github.com/worldofhacks/alex-style
ln -s "$(pwd)/alex-style/skills/alex-style" ~/.claude/skills/alex-style
```

**Per-project**: copy or symlink `skills/alex-style` into the
project's `.claude/skills/` directory (this repo does exactly that).

After installing, any design request ("build a landing page", "make this
beautiful", "add an animated background") routes through the local arsenal.
For multi-section builds the skill runs a parallel agent swarm; see
[orchestration.md](skills/alex-style/orchestration.md).

## Refresh

```bash
bash skills/alex-style/scripts/sync.sh
node skills/alex-style/scripts/build-catalogs.mjs
```

Idempotent; run monthly. `vendor/MANIFEST.json` records the last sync and every
pin (versions AND commit SHAs — several sources refuse to sync if upstream moved
past the audited pin). A single source: `sync.sh reactbits`. After any sync:

```bash
node skills/alex-style/evals/check-arsenal.mjs   # one runnable contract per source
```

## Adding a source

New sources must pass the 11-step quality gate in
[adding-a-source.md](skills/alex-style/adding-a-source.md) — proven quality
uplift over the existing baseline, verified license (including relicense
history), pinned versions, fail-loud sync, and a curation filter written as
data. Pending proposals live in [proposals/](proposals/) until signed off.

## Licensing notes

`vendor/_index/licenses.tsv` has one row per source with the
resale/redistribution verdict. Highlights: React Bits (MIT + Commons Clause —
never resell the components themselves), GSAP (free Webflow license incl.
commercial + AI use), Animista (FreeBSD — ship the bundled notice with
distributed CSS), Paper Shaders (Apache-2.0 at ≥0.0.77 ONLY — earlier versions
are PolyForm Shield; sync enforces the floor), axe-core (MPL-2.0 — LICENSE
travels with `axe.min.js`, never ship it in product builds), SVGL and Tailark's
embedded brand SVGs (MIT collections, but logos remain trademarks — nominative
use only, never fabricated customer walls), Origin UI (MIT `apps/origin`
subtree only — the surrounding monorepo is AGPLv3 and is never vendored),
Fancy Components (MIT, vendored as a patched fork — refresh only via
`sync.sh fancy`). recent.design and Layers content is vendored as *metadata
only* for design direction; the referenced imagery remains its creators' and is
never copied into products.
