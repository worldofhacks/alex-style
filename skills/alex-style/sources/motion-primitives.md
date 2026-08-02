# Motion-Primitives — component registry (React + motion)
> 33 copy-paste animated React components by ibelick (shadcn-style, built on the `motion` runtime): hero text effects, morphing dialogs, macOS dock, hover physics, counters, marquees, scroll reveals.

## At a glance
- **What**: 33 self-contained `registry:ui` TSX components + ~94 demo files + per-component prop-table docs. All are `'use client'` React 18+ / TypeScript / Tailwind utilities. No form controls, no WebGL — polish and micro-interaction layer only.
- **License**: MIT (vendor/motion-primitives/LICENSE.md, (c) 2024 ibelick). Commercial use, modification, redistribution all fine. HARD CONSTRAINT: "Motion Primitives Pro" (pro.motion-primitives.com — sections, templates) is a separate PAID product, not MIT, not vendored — never reproduce Pro assets.
- **Vendored** (paths relative to skill dir):
  - `vendor/motion-primitives/core/` — 33 component .tsx files (2–8KB each, no cross-imports)
  - `vendor/motion-primitives/docs/<name>/` — 33 dirs, each with `page.mdx` (usage + "## Component API" prop tables) and demo .tsx files (~94 demos total)
  - `vendor/motion-primitives/registry.json` — shadcn-schema catalog, 33 items (~18KB)
  - `vendor/motion-primitives/LICENSE.md`
- **Index**: `vendor/_index/components.tsv` (33 `motion-primitives` rows; columns: source, name, title, description, npm_deps, registry_deps, vendored_file). Example: `grep '^motion-primitives' vendor/_index/components.tsv | grep -i text`
- **Project deps**: `npm install motion` (works v11/v12; import path is `motion/react`). Add `react-use-measure` only for infinite-slider, sliding-number, toolbar-expandable. Add `lucide-react` for carousel, dialog, morphing-dialog, toolbar-dynamic, toolbar-expandable (they import icons directly — registry.json under-declares this).

## When to use / when NOT
**Use for:**
- Hero/marketing text: staggered reveals (text-effect), shimmer (text-shimmer, text-shimmer-wave), rotating headlines (text-loop, text-morph, text-roll, text-scramble), circular text (spinning-text)
- Animated stats: animated-number (spring counter), sliding-number (odometer digits)
- Signature interactions: dock (macOS magnify), magnetic, tilt, spotlight, glow-effect, border-trail, cursor
- Marquees/logo clouds: infinite-slider (h/v, hover-speed)
- Shared-layout morphs: morphing-dialog (card→modal), morphing-popover, transition-panel, animated-background (moving tab/segmented highlight)
- Scroll polish: scroll-progress, in-view, animated-group (staggered entrances), progressive-blur, image-comparison

**NOT for:**
- App primitives (buttons, forms, tables, selects) — use shadcn/ui; only motion-flavored accordion/dialog/carousel/disclosure here
- WebGL/canvas backgrounds — use `vanta`, `shadergradient`, or `reactbits` backgrounds
- Larger flashy component variety (device mocks, bento grids, particles) — `magicui` or `reactbits`; sleeker card/input widgets — `kokonutui`
- CSS-only / non-React projects — everything needs React + the `motion` runtime; use `animista` for pure CSS keyframes
- Full marketing sections/templates — that is paid Pro, not in this registry

## How to consume (token discipline)
1. Pick from the index (never read registry.json wholesale):
   `grep '^motion-primitives' vendor/_index/components.tsv | cut -f2,4,5`
2. Read the ONE component file listed in the vendored_file column:
   `cat vendor/motion-primitives/core/text-effect.tsx`
   Files are self-contained; exported prop types at the top of the file usually suffice as API docs.
3. Only if the API is non-obvious (compound components: morphing-dialog, morphing-popover, carousel, accordion, disclosure, toolbar-*), read ONE demo:
   `ls vendor/motion-primitives/docs/morphing-dialog/` then `cat vendor/motion-primitives/docs/morphing-dialog/morphing-dialog-basic-1.tsx`
4. For a full prop table without reading the whole mdx:
   `sed -n '/## Component API/,$p' vendor/motion-primitives/docs/text-effect/page.mdx`
- NEVER fully read: `vendor/motion-primitives/registry.json` (grep/jq it), any `docs/<name>/page.mdx` above the Component API section (duplicates demos), `docs/layout.tsx`, `docs/navigation.ts`, `docs/installation/`.

## Core usage
Copy the component source into the project (e.g. `components/core/text-effect.tsx` or wherever the project keeps ui components), install deps, fix import aliases:
```tsx
// after: npm install motion   (+ clsx tailwind-merge for the cn() helper)
import { TextEffect } from '@/components/core/text-effect';

export function Hero() {
  return (
    <TextEffect per='word' as='h1' preset='fade-in-blur' speedReveal={1.1}>
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}
```
25 of 33 components import `cn` from `@/lib/utils` — ensure the standard shadcn helper exists (`clsx` + `tailwind-merge`) or rewrite the import. No Radix dependency anywhere in core. SSR/Next.js App Router: fine — all files carry `'use client'`. Tailwind: plain utilities, works on v3 and v4.

## Pitfalls
- registry.json/index `npm_deps` lists only `motion` for carousel, dialog, morphing-dialog, toolbar-dynamic, toolbar-expandable — but their source imports `lucide-react`. Install it or swap icons, or the build breaks.
- Import path is `motion/react` (the Framer Motion successor), NOT `framer-motion`. Do not mix both packages in one project.
- Components assume the `@/` path alias and `@/lib/utils` cn() — un-aliased projects need import rewrites in every file.
- motion-primitives.com (including `/c/*.json` registry URLs) is fronted by a Vercel Security Checkpoint that 429-blocks curl — never fetch from the website; use vendored files or raw.githubusercontent.com.
- npm package `motion-primitives` is the CLI installer only (v0.1.0) — there is no importable component library; always vendor source.
- Marketing copy says "50+ components"; the registry truth is 33 (rest are demo variations). Docs demos import from `@/components/core/<name>` — adjust to the project's actual location.
- Author labels the project beta; APIs can shift between syncs — re-read the vendored file after a refresh rather than trusting cached knowledge.

## Refresh / fallback
- `bash scripts/sync.sh motion-primitives`
- On-demand (verified working):
  - Catalog: `curl -s https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/registry.json`
  - One component with source embedded in files[].content: `curl -s https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/text-effect.json`
  - Plain source: `curl -s https://raw.githubusercontent.com/ibelick/motion-primitives/main/components/core/text-effect.tsx`
