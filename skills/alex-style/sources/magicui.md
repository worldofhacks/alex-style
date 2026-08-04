# Magic UI — component registry (React/Tailwind animated components)

> The default grab-bag for marketing-page motion: marquees, bento grids, beams, backgrounds, device mockups, animated text/buttons — copy-paste TSX with deps declared per item.

## At a glance

- **What**: 77 free animated React components as shadcn registry-item JSON (full TSX source embedded in each file). React 18+/19, TypeScript, Tailwind (v4-ready: keyframes ship as `.css`/`.cssVars` in the item JSON). 29/77 need the `motion` npm package. No npm component package exists — registry/copy-paste only.
- **License**: MIT — commercial use, modification, redistribution all allowed. Magic UI **Pro** (templates/blocks at pro.magicui.design) is a separate PAID product; nothing Pro is vendored or in the registry. `@magicuidesign/mcp` is ISC (irrelevant to shipped code).
- **Vendored** (paths relative to skill dir):
  - `vendor/magicui/r/<name>.json` — 77 per-component registry items (source + deps + css)
  - `vendor/magicui/registry.json` — 108KB manifest, 247 items (77 ui, 168 example, 1 style, 1 lib)
  - `vendor/magicui/llms.txt` — 32KB one-line-per-component catalog with docs URLs
  - `vendor/magicui/llms-full.txt` — 636KB full source dump. **NEVER read fully; grep only.**
  - `vendor/magicui/skill/` — the maintainers' official agent skill (SKILL.md + references/): component-picking guidance and usage recipes; read SKILL.md when composing multiple magicui components.
- **Index**: `vendor/_index/components.tsv` (77 magicui rows; columns: source, name, title, description, npm_deps, registry_deps, vendored_file). Example:
  `grep '^magicui' vendor/_index/components.tsv | grep -i beam`
- **Project deps**: per-component only — most common is `npm install motion`. Check the item JSON before assuming.

## When to use / when NOT

**Use for**: landing/marketing hero motion (`blur-fade`, `text-animate`, `animated-gradient-text`, `hero-video-dialog`); logo/testimonial strips (`marquee`, `avatar-circles`, `tweet-card`); integration/feature showcases (`bento-grid`, `animated-beam`, `orbiting-circles`, `dock`, `icon-cloud`); decorative section backgrounds (`dot-pattern`, `grid-pattern`, `flickering-grid`, `meteors`, `particles`, `retro-grid`, `warp-background`); CTAs and stats (`shimmer-button`, `rainbow-button`, `number-ticker`, `border-beam`, `shine-border`); product shots in frames (`iphone`, `android`, `safari`, `terminal`); celebration (`confetti`).

**Do NOT use for**: app UI primitives (forms, tables, dialogs → hand-build on shadcn/ui plumbing, re-dressed in brief tokens — stock shadcn look never ships); non-React stacks (everything is `"use client"` TSX); restrained/enterprise dashboards (most components are deliberately high-motion — prefer `motion-primitives` for subtle motion); exotic shader/3D backgrounds (→ `reactbits`, `vanta`, `shadergradient`); CSS-only keyframe snippets for arbitrary elements (→ `animista`); charts/data-viz (only `number-ticker` and `animated-circular-progress-bar` exist here).

## How to consume (token discipline)

1. Find the component in the index (never browse the vendor dir or read `registry.json`):
   `grep '^magicui' vendor/_index/components.tsv | grep -i marquee`
   The last column is the vendored file; `npm_deps`/`registry_deps` columns tell you install cost upfront.
2. Extract just the source from the item JSON:
   `jq -r '.files[0].content' vendor/magicui/r/marquee.json`
3. Check for Tailwind keyframes/theme vars (present on CSS-driven items like `marquee`, `rainbow-button`; `null null` means none):
   `jq -c '.css, .cssVars' vendor/magicui/r/marquee.json`
4. Check deps: `jq -r '.dependencies[]?, .registryDependencies[]?' vendor/magicui/r/confetti.json` → `canvas-confetti`, `@types/canvas-confetti`, `button` (the last is a shadcn registry dep — install via `npx shadcn@latest add button`).
5. Only if usage is unclear, grep the demo out of the dump — never open it whole:
   `grep -n '===== COMPONENT: marquee' vendor/magicui/llms-full.txt` then Read ~80 lines from that offset.
6. For a quick browsable catalog with docs links, `vendor/magicui/llms.txt` is safe to read in full (32KB), but the TSV is cheaper.

Files that must NEVER be fully read: `vendor/magicui/llms-full.txt`, `vendor/magicui/registry.json`.

## Core usage

Copy the extracted TSX into the project and satisfy its deps:

```bash
jq -r '.files[0].content' vendor/magicui/r/marquee.json > src/components/magicui/marquee.tsx
# deps if listed:  npm install motion            # (marquee itself has none)
# registry deps:   npx shadcn@latest add button  # only when registryDependencies present
```

Every component imports `cn` from `@/lib/utils` (shadcn convention) — ensure it exists:

```ts
import { clsx, type ClassValue } from "clsx"; import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

If step 3 returned `.css`/`.cssVars`, merge them into globals: `@keyframes` blocks into CSS, `cssVars.theme` entries as `--animate-*` under Tailwind v4 `@theme inline` (v3: port to `tailwind.config` keyframes/animation). Alternative when the project already uses shadcn CLI: `npx shadcn@latest add @magicui/marquee` wires deps + css automatically.

## Pitfalls

- Skipping `.css`/`.cssVars` merge silently breaks CSS-driven components (marquee renders static, rainbow-button loses its gradient). Always run step 3.
- `registryDependencies` are shadcn components (e.g. `confetti`, `bento-grid`, `icon-cloud` need `button`) — copying the TSX alone will not compile.
- `motion` means the Motion-for-React package (`npm install motion`), NOT `framer-motion`; imports are `from "motion/react"`.
- Nearly all components are `"use client"` — fine in Next.js App Router, but they are not RSC-renderable; keep them out of server-only trees.
- `globe` needs `cobe@^0.6.4` + `motion` and a sized container; `tweet-card` needs `react-tweet` (network fetch at render).
- Item JSONs assume path alias `@/lib/utils`; fix imports if the project uses a different alias.
- Live-fetch URLs require the `.json` suffix: `https://magicui.design/r/<name>` without it returns a 308 redirect.

## Refresh / fallback

- `bash scripts/sync.sh magicui`
- On-demand (verified): `curl -s https://magicui.design/r/globe.json` (any component, full source + deps); `curl -s https://magicui.design/r/registry.json` (manifest); `curl -s https://magicui.design/llms.txt` (catalog).
- Raw GitHub mirror: `https://raw.githubusercontent.com/magicuidesign/magicui/main/apps/www/registry/magicui/<name>.tsx`
