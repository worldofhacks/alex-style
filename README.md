# alex-style

A self-contained **design arsenal skill** for Claude Code. Thirteen curated
design sources (component registries, animation runtimes, icon sets, CSS
animation libraries, WebGL backgrounds, and inspiration galleries) aggregated
into one local, indexed, grep-able collection so design work never needs a
browser, a registry CLI, or repeated web fetches.

## What's inside

```
skills/alex-style/
├── SKILL.md            # entry point: arsenal table, routing, token discipline, licenses
├── orchestration.md    # parallel design-swarm playbook (brief → fan-out → review)
├── recipes.md          # proven cross-source combinations
├── sources/            # 13 per-source cards: license, pitfalls, consume commands
├── scripts/
│   ├── sync.sh             # re-vendor everything (curl/git/tar only, no browser, no npm install)
│   ├── build-catalogs.mjs  # regenerate the grep indexes in vendor/_index/
│   ├── get-icon.sh         # extract one Phosphor SVG from the vendored tarball
│   └── get-component.sh    # extract component source/deps (jq/node/python3, auto-detected)
└── vendor/             # ~10MB fully local arsenal
    ├── _index/             # grep-able TSVs: 295 components, 1,512 icons, 664 animations,
    │                       #   14 vanta effects, 10 shader presets, 100 palettes, 1,504 refs
    ├── magicui/  kokonutui/  reactbits/  motion-primitives/   # full component source
    ├── gsap/  motion/  lenis/                                 # llms.txt docs + official agent skills
    ├── phosphor/  animista/  vanta/  shadergradient/          # icons, keyframes, WebGL runtimes
    └── recent/  layers/                                       # inspiration metadata + palettes
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

Idempotent; run monthly. `vendor/MANIFEST.json` records the last sync. A single
source: `sync.sh reactbits`.

## Licensing notes

Component/runtime sources are MIT except: React Bits (MIT + Commons Clause: use
in products freely, never resell the components themselves), GSAP (free Webflow
license incl. commercial + AI use), Animista (FreeBSD: keep the bundled notice
in distributed CSS). recent.design and Layers content is vendored as *metadata
only* for design direction; the referenced imagery remains its creators' and is
never copied into products.
