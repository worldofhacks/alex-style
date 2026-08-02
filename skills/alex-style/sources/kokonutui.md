# KokonutUI — component registry (React/Tailwind)
> Polished animated React components — strongest in AI-chat UI (prompt inputs, voice, thinking states) plus canvas backgrounds, cards, buttons, text effects.

## At a glance
- **What**: 46 free copy-paste TSX components by Dorian Baffier (kokonut-labs). Tailwind CSS v4 + Motion (v12) + shadcn/ui primitives. shadcn-compatible registry; no npm package exists.
- **License**: MIT ("Copyright (c) 2025 kokonutUI"), `vendor/kokonutui/LICENSE`. Unrestricted commercial use, modification, redistribution. Hard constraint: the paid Pro tier (kokonutui.pro, 70+ components/templates) is NOT MIT — never fetch or vendor from there.
- **Vendored** (`vendor/kokonutui/`): `r/` — 46 per-component JSONs, each self-contained with full inline TSX source + companion hooks/icons + dep metadata; `registry.json` (index, lists only 40 of the 46); `llms.txt` (12K catalog: one paragraph + docs URL per component); `llms-full.txt` (364K full source mirror — grep only, never read whole); `LICENSE`.
- **Index**: `vendor/_index/components.tsv` (46 kokonutui rows; columns: source, name, title, description, npm_deps, registry_deps, vendored_file). Example: `grep -P '^kokonutui\t' vendor/_index/components.tsv | grep -i glass`
- **Project deps**: none globally — per component, from the JSON's `dependencies`. `npm i motion lucide-react` covers most; shadcn primitives (button, textarea, drawer, dropdown-menu) listed under `registryDependencies` must exist in the project.

## When to use / when NOT
Use for:
- AI chat/assistant UI — this is its niche: `ai-prompt` (model-selector input), `ai-input-search` (web-search toggle), `ai-voice` (recording waveform), `ai-loading` (agent task log), `ai-text-loading` (shimmer thinking).
- Animated hero backgrounds: `beams-background`, `flow-field`, `background-paths`, `shape-hero`.
- Feature/marketing cards: `bento-grid`, `spotlight-cards`, `card-flip`, `liquid-glass-card`, `apple-activity-card`.
- Micro-interaction buttons (`particle-button`, `hold-button`, `gradient-button`, `attract-button`) and text effects (`glitch-text`, `matrix-text`, `type-writer`, `shimmer-text`, `scroll-text`).
- Small nav pieces: `morphic-navbar`, `toolbar`, `smooth-tab`, `smooth-drawer`, `action-search-bar`.

NOT for:
- Data-heavy app components (tables, forms, charts) — shadcn/ui core.
- Marketing-scale animated collections with more variety — `reactbits` (139 variants) or `magicui` (77).
- Scroll choreography / physics primitives — `motion-primitives` or GSAP/Lenis sources.
- Icons — bundles only a few AI-brand SVGs; use the phosphor source.
- Non-React/non-Tailwind stacks, or Tailwind v3/React 18 without willingness to adapt (source targets Tailwind v4 + React 19).
- Full page templates — free tier has none (Pro-only, paid).

## How to consume (token discipline)
1. Find the component in the index (never read `llms-full.txt` or `registry.json` wholesale):
   `grep -P '^kokonutui\t' vendor/_index/components.tsv | grep -i drawer`
2. Check its deps before touching source (columns 5–6 = npm deps, shadcn registry deps):
   `jq -r '[.dependencies, .registryDependencies]' vendor/kokonutui/r/smooth-drawer.json`
3. Read only the one component's source, with companion files labeled:
   `jq -r '.files[] | "// FILE: " + .path, .content' vendor/kokonutui/r/ai-prompt.json`
4. If you need prose/docs context, grep the catalog, don't read it top to bottom:
   `grep -A1 -i 'liquid glass' vendor/kokonutui/llms.txt`
5. `llms-full.txt` is a 364K fallback mirror: locate with `grep -n 'card-flip' vendor/kokonutui/llms-full.txt`, then Read that line range only.

## Core usage
Copy the vendored source into the project (registry model — you own the code):

```bash
# each .files[] entry maps to a project path: /components/kokonutui/... , /hooks/... , /components/icons/...
jq -r '.files[0].content' vendor/kokonutui/r/ai-prompt.json > src/components/kokonutui/ai-prompt.tsx
jq -r '.files[1].content' vendor/kokonutui/r/ai-prompt.json > src/hooks/use-auto-resize-textarea.ts
npm i motion lucide-react        # from .dependencies
npx shadcn@latest add textarea button dropdown-menu   # from .registryDependencies
```

Then use like any local component: `import AIPrompt from "@/components/kokonutui/ai-prompt"`. All components are `"use client"` and import `cn()` from `@/lib/utils` — a shadcn-style project (or a manual `cn` helper: `clsx` + `tailwind-merge`) is required. Canvas backgrounds (beams, flow-field) are SSR-safe (canvas work inside `useEffect`). Alternative in a live shadcn project: `npx shadcn@latest add @kokonutui/ai-prompt` (registered namespace) — but prefer vendored source, it needs no network.

## Pitfalls
- `registryDependencies` are shadcn primitives the source imports from `@/components/ui/*` — copy compiles but breaks at build if they're missing from the project.
- Declared deps can be incomplete: `switch-button` imports `next-themes` but lists only `lucide-react`; grep the extracted source for imports before shipping.
- `morphic-navbar` imports `next/link` — swap for your router outside Next.js.
- `smooth-drawer` needs the shadcn `drawer` primitive, which itself pulls in Vaul.
- Multi-file components: `.files[]` order matters — index 0 is the component, later entries are hooks/icons; write each to its `.path`-equivalent location, don't concatenate.
- Tailwind v4 syntax in source (e.g. arbitrary values, new color tokens) — minor class edits needed on Tailwind v3 projects.
- Uses `motion` (v12, `import { motion } from "motion/react"`), not the legacy `framer-motion` package — don't install both.
- `registry.json` lists 40 items but 46 are vendored (flow-field, spotlight-cards, loader, morphic-navbar, mouse-effect-card, slide-text-button missing from the index) — trust `vendor/_index/components.tsv` or `ls vendor/kokonutui/r/`, not the registry index.

## Refresh / fallback
- Refresh: `bash scripts/sync.sh kokonutui`
- On-demand (all verified):
  - `curl -s https://kokonutui.com/r/{name}.json` — full source + deps for any component, even the 6 not in the registry index
  - `curl -s https://kokonutui.com/llms.txt` — current catalog (10K)
  - `curl -s https://kokonutui.com/r/registry.json` — registry index with dep metadata
