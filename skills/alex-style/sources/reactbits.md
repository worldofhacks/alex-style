# React Bits — animated-component-registry

> Copy-paste showpiece motion: 139 bold animated React components (text reveals, cursor effects, WebGL hero backgrounds) vendored as self-contained registry JSONs with pinned deps.

## At a glance

- **What**: 139 animated/interactive React components by DavidHDev (44.6k stars, actively maintained). Categories per vendored llms.txt: Text Animations 23, Animations 31, Components 40, Backgrounds 45. Upstream ships 4 synced variants each (556 registry items); we vendor **TS+Tailwind only**.
- **License**: MIT + Commons Clause v1.0 ((c) 2026 David Haz). Commercial use IS allowed — free to use/copy/modify/distribute "as part of an application, website, or product". PROHIBITED: selling, sublicensing, or redistributing the components themselves (alone, bundled, or ported). Vendoring into a client project = fine; publishing a component library from them = banned. GitHub API reports the license as "Other"/NOASSERTION, so scanners flag it — real terms are in `vendor/reactbits/LICENSE.md`.
- **Vendored**: `vendor/reactbits/r/` — 139 `<Name>-TS-TW.json` registry items, each with full `.tsx` source in `files[].content` plus pinned npm `dependencies` (3–48KB each; Hyperspeed is the largest and the only multi-file item). Also `vendor/reactbits/llms.txt` (24KB catalog, 204 lines), `vendor/reactbits/registry.json` (227KB metadata for all 556 upstream items — grep only), `vendor/reactbits/LICENSE.md`.
- **Index**: `vendor/_index/components.tsv` (295 rows, 139 reactbits). Columns: source, name, title, description, npm_deps, registry_deps, vendored_file. Example: `awk -F'\t' '$1=="reactbits"' vendor/_index/components.tsv | grep -i cursor`
- **Project deps**: no base package — per component, read the item JSON's `dependencies`. Frequency across the 139 vendored items: ogl 31, gsap 29, three 22, motion 20, @react-three/fiber 7, postprocessing 4; 33 items are dep-free (pure React/Tailwind). NEVER `npm install react-bits` — that npm name is an unrelated abandoned package.

## When to use / when NOT

**Wins at:**
- Hero/landing text entrances: SplitText, BlurText, DecryptedText, TextType, RotatingText, CountUp, ScrollReveal.
- Full-bleed animated WebGL backgrounds: Aurora, LiquidEther, Hyperspeed, Particles, Silk, DarkVeil, Galaxy.
- Cursor and click micro-interactions: ClickSpark, Magnet, GlareHover, SplashCursor, TargetCursor, BlobCursor.
- Showpiece nav/galleries/cards: Dock, GooeyNav, CardNav, CircularGallery, DomeGallery, SpotlightCard, TiltedCard, MagicBento, LogoLoop.
- Turning one static hero/section memorable with a single copied component.

**Use a sibling instead:**
- App-shell primitives (buttons, forms, tables, dialogs, dashboards): hand-build on shadcn/ui plumbing re-dressed in brief tokens (stock shadcn look never ships) — React Bits has zero form/data primitives.
- Restrained product-UI motion: `motion-primitives` (subtle, composable) — React Bits' aesthetic is bold/portfolio-grade.
- shadcn-flavored marketing sections and device mockups: `magicui`; polished interactive widgets: `kokonutui`.
- Animated backgrounds without React copy-paste: `vanta` (runtime lib) or `shadergradient`.
- Performance/accessibility-critical pages: many components mount WebGL canvases + continuous rAF loops — prefer CSS (`animista`) or motion-primitives.
- Non-React stacks: React-only, no framework-agnostic build.

## How to consume (token discipline)

1. **Find** the component in the index (never browse the vendor tree):
   `awk -F'\t' '$1=="reactbits"' vendor/_index/components.tsv | grep -i aurora`
   Category browse / fuzzy lookup by effect name: `grep -i typewriter vendor/reactbits/llms.txt` (one line per component: doc URL, description, CLI PascalCase id).
2. **Check deps** before committing to it (WebGL deps = weight):
   `jq -r '.dependencies[]?' vendor/reactbits/r/SplitText-TS-TW.json`
3. **Extract** the source straight into the project (do not Read the whole JSON):
   `jq -r '.files[0].content' vendor/reactbits/r/Aurora-TS-TW.json > src/components/Aurora.tsx`
   Only Hyperspeed has 2 files — list them with `jq -r '.files[].path' vendor/reactbits/r/Hyperspeed-TS-TW.json` and extract each by index.
4. **Adapt**: rename/theme in place; then `npm install` exactly the pinned deps from step 2.

NEVER fully read: `vendor/reactbits/registry.json` (227KB) — grep it only; `https://reactbits.dev/llms-full.txt` — it is a trap (returns SPA HTML, not docs). Read at most ONE item JSON at a time, and prefer jq extraction over reading the biggest ones (Hyperspeed/SplashCursor/LiquidEther ≈ 42–48KB).

## Core usage

```bash
jq -r '.dependencies[]?' vendor/reactbits/r/SplitText-TS-TW.json
# -> gsap@^3.13.0  @gsap/react@^2.1.2
jq -r '.files[0].content' vendor/reactbits/r/SplitText-TS-TW.json > src/components/SplitText.tsx
npm install 'gsap@^3.13.0' '@gsap/react@^2.1.2'
```

```tsx
'use client'; // canvas/pointer/GSAP components are client-only in Next.js App Router
import SplitText from '@/components/SplitText';

<SplitText text="Ship faster" splitType="chars" delay={100} duration={0.6} />
```

Alternative when network is allowed and the project already uses shadcn: `npx shadcn@latest add https://reactbits.dev/r/SplitText-TS-TW` (auto-installs deps; `npx jsrepo@latest add <same URL>` also works).

## Pitfalls
- Commons Clause bans selling/redistributing the components **including ported or rewritten versions** — a from-reference rewrite does not escape the clause (LICENSE.md names ports explicitly). Shipping inside an app/site/product remains fine.

- **Variant naming is strict**: registry ids are PascalCase + `-JS|TS-CSS|TW` (`SplitText-TS-TW`); docs page URLs are kebab-case (`/text-animations/split-text`). Only TS-TW is vendored — other variants must be curled (see below).
- **Deps are per-component and mandatory**: manual copy skips the auto-install the shadcn CLI would do; always install the item's pinned `dependencies` or the import fails at build. `registryDependencies` is empty across all 139 vendored items — no chaining to worry about.
- **The docs site is a Vite SPA**: WebFetch on reactbits.dev component pages returns empty HTML. Only `llms.txt` and `/r/*.json` are useful text surfaces; `llms-full.txt` returns 200 but serves the SPA shell.
- **WebGL weight**: ogl/three/r3f components (53 of 139) run continuous rAF render loops. Client-only — add `'use client'` and dynamic-import with `ssr: false` in Next.js; cap to one WebGL background per page.
- **Runtime targets**: upstream targets react ^19 (mostly fine on 18, unverified) and Tailwind v4 — TW variants assume Tailwind is configured.
- **License scanners** will flag "NOASSERTION" — cite `vendor/reactbits/LICENSE.md` (MIT + Commons Clause; app use fine, resale/redistribution of components banned).

## Refresh / fallback

- Refresh vendored copy: `bash scripts/sync.sh reactbits`
- Catalog on demand: `curl -s https://reactbits.dev/llms.txt`
- Any item/variant on demand (full source + deps): `curl -s https://reactbits.dev/r/<Component>-<LANG>-<STYLE>` e.g. `https://reactbits.dev/r/SplitText-JS-CSS` for a non-TS/non-Tailwind project.
- Raw source without dep metadata: `curl -s https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/TextAnimations/SplitText/SplitText.tsx` (variant roots: `src/content` JS+CSS, `src/tailwind` JS+TW, `src/ts-default` TS+CSS, `src/ts-tailwind` TS+TW).
