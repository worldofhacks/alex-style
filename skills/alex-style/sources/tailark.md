# Tailark — marketing sections & landing pages
> 150 marketing section blocks + 10 full landing-page compositions across three kits (dusk/mist/veil) from tailark.com's OSS radix base — fills the arsenal's biggest concession (hand-building pricing, testimonials, footers, FAQs, stats, auth screens from brief tokens).

## At a glance
- **What**: shadcn-registry JSON payloads (single file each, inline `.content`) from the **radix base ONLY** of github.com/tailark/blocks, **pinned to commit `8139698115c1`** (recorded in `vendor/tailark/PIN.json`; sync refuses to run if upstream main moves past the pin — young, fast-moving repo). The base-ui base is excluded: it would smuggle a second primitive system (`@base-ui/react`) into a shadcn/Radix arsenal.
- **Vendored** (`vendor/tailark/`, ~1.2MB): `r/` — 255 payloads (150 blocks, 10 pages, 95 support items: kit `ui/*` primitives, headers/logo-clouds, `core-*` brand SVGs, `use-media` hook); `registry.json`; `extra/svgs/perplexity.tsx` (dusk-footer-2 imports it but no registry item ships it — vendored from the pin so nothing dangles); `LICENSE`; `PIN.json`. **Excluded**: 5 bundled dupes — `motion-primitives-{animated-group,infinite-slider,progressive-blur,text-effect}` → use `vendor/motion-primitives/core/<name>.tsx`, `magic-ui-border-beam` → `vendor/magicui/r/border-beam.json`. A second home for the same component poisons routing.
- **License**: MIT (upstream file is `LICENCE.md`, British spelling). The embedded `core-*` brand SVGs (Spotify, Vercel, Claude, OpenAI…) remain **trademarks** — same nominative-use law as svgl.
- **Index**: `vendor/_index/sections.tsv` — 160 rows: `name, kit, category, description, npm_deps, heavy_deps, vendored_file`. Sections NEVER appear in `components.tsv` — the kit column here is what makes the one-kit law greppable.
- **Project deps**: Next.js + Tailwind **>= 4.1** + shadcn tokens is the native target. Per-row `npm_deps` (transitive): `lucide-react` (swap to phosphor per the one-icon-family rule), `motion` ^12, `@radix-ui/*` via kit ui, `cva`, `next-themes` (veil footers). All match arsenal norms — no version traps.

## Routing (law)
- **Marketing sections and landing compositions ONLY**: hero, pricing, testimonials, footer, faqs, stats, logo-cloud, call-to-action, features, content, team, integrations, comparator, contact, login/sign-up/forgot-password, full-page. Application UI (dashboards, data tables, form workflows) is NOT Tailark's domain. Text effects, animated backgrounds, micro-animations keep their existing sources.
- **ONE KIT PER PROJECT — dusk OR mist OR veil.** The kits are three voices down to the primitives: dusk button = `rounded-full` pill, `shadow-black/10`, `active:scale-98`; mist button = `rounded-xl` base (default `rounded-md`, sm `rounded-full`), `hover:brightness-95`, extra `neutral` variant; veil = `font-serif` headlines + container queries. Mixing kits in one page breaks coherence exactly like mixing icon weights — same problem-shape, same rule. Enforce at grep time: always filter `$2=="<kit>"`.
- **Tailwind < 4.1 → hand-build path.** See the floor below; do not route Tailark there.

## When to use / when NOT
Use for:
- Any marketing section the arsenal previously hand-built: pricing, testimonials, footers, faqs, stats, team, auth screens.
- Full-page composition reference: `awk -F'\t' '$3=="full-page"' vendor/_index/sections.tsv` — 10 dusk landing pages showing section ordering (hero → features → stats → pricing → testimonials → CTA → footer) for orchestration.md briefs.
Not for:
- Tailwind v3 / v4.0 projects (silent no-op floor below) — hand-build from brief tokens instead.
- Application UI, dashboards, data-dense screens.
- Shipping as-is: every block is placeholder-content scaffolding (law below).

## How to consume (token discipline)
```bash
grep -i "pricing" vendor/_index/sections.tsv | awk -F'\t' '$2=="mist"'   # ALWAYS filter to the project's one kit
awk -F'\t' '$2=="dusk" && $3=="hero-section"' vendor/_index/sections.tsv
bash scripts/get-component.sh vendor/tailark/r/mist-pricing-1.json          # emits source
bash scripts/get-component.sh vendor/tailark/r/mist-pricing-1.json --deps   # @tailark-oss/* dep list
```
Resolve `@tailark-oss/<name>` registryDependencies RECURSIVELY: each maps to `vendor/tailark/r/<name>.json` (kit `ui/*` → project `components/ui/`, `core-*` svgs → `components/ui/svgs/`, `core-use-media` → `hooks/`), except the 5 excluded dupes which map to the motion-primitives/magicui vendors above. Never fetch oss.tailark.com or run the shadcn CLI against it — everything resolves locally (hard rule 1). `npm_deps` column already includes transitive deps, so install from the row, not from guesswork.

## REPLACE BEFORE SHIP (law — every block is placeholder scaffolding)
Shipping any of these unreplaced is worse than a plain hand-build — failure modes the hand-build path cannot even produce:
1. **Brand-SVG logo clouds** (Spotify/Vercel/Claude/Hulu/Slack/Clerk…): a real trademark on a fake customer wall implies false endorsement — legal + taste failure. Swap to the project's REAL logos via `vendor/svgl` + `bash scripts/get-logo.sh <brand>`; brands missing from `logos.tsv` become styled text wordmarks (svgl card law).
2. **Testimonial quotes AND avatars**: quotes are fabricated (one identical quote appears in 8 payloads) and avatars hotlink `avatars.githubusercontent.com` — real people's faces on invented praise. Never ship either; replace quote, name, AND image together.
3. **All placeholder copy**: below arsenal standard, with shipped grammar errors ("Pricing that scale with your business", "Includes :" — mist-pricing-1/2). Treat every headline/body as lorem ipsum — rewrite from the design brief.
4. **Image refs**: 12 `src="/…"` refs point at repo `public/` assets NOT in any payload (`/mail2.png`, `/payments.png`…) → guaranteed 404; 24 items hotlink `images.unsplash.com` → breaks `next/image` without `remotePatterns` and violates vendored-first. Replace with project assets, or a paper-shaders/CSS-gradient placeholder.

## Tailwind floor: >= 4.1 (silent no-op — no build error)
48 items use v4.1 `mask-*` utilities (`mask-t-from-25%`, `mask-radial-at-top-left`…). Below 4.1 they compile to NOTHING: the page renders, but the signature dusk/veil hero frame + edge-fade treatments simply vanish — output silently drops below the hand-build baseline. Also v4-only: container queries (`@container`/`@xl:`, 53 items) and `in-data-*` variants (20 items). **Check the target's Tailwind version FIRST; < 4.1 routes to the hand-build path.**

## Patch on copy (upstream defects verified at pin `8139698115c1`)
- **Mobile-nav a11y (all kit headers)**: the hamburger has only `aria-label` — no state semantics, no Escape. When copying any `*-header` file, add to the `<button>`: `aria-expanded={menuState} aria-controls="mobile-nav"`, add `id="mobile-nav"` to the menu wrapper `<div>`, and an Escape-close effect:
  ```tsx
  React.useEffect(() => {
    if (!menuState) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuState(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuState])
  ```
- **Helper filenames (mist/veil)**: helper payloads save as generic names (`header.tsx`, `table.tsx`, `theme-switcher.tsx`, `social-medias.tsx`) while their parent blocks import prefixed paths (`@/components/hero-section-1-header`). Save the helper file UNDER THE NAME THE BLOCK IMPORTS. Affected: mist-hero-section-1..4, mist-features-1, veil-hero-section-1..4, veil-footer-5, veil-footer-6 (2 helpers).
- **veil-testimonials-1** declares zero registryDependencies but imports `@/components/ui/card` — copy `veil-card` too.
- **dusk-hero-section-5** imports `hero-section-5-hero-video`; the dep file is `hero-section-5-video.tsx` — align one side.
- **dusk-footer-2** imports `ui/svgs/perplexity` — copy `vendor/tailark/extra/svgs/perplexity.tsx`.
- **Landing pages**: `page.tsx` imports `hero-section-N-hero-section` but the hero file is `hero-section-N.tsx` (landing-1,2,3,4,6,7,9,10); landing-5's page has several imports mangled to `@/components/pages-landing-five` — restore real names; landing-9 uses `content-1` without declaring `dusk-content-1` — copy it.
- **Non-Next projects**: every block leans on Next (85/160 files import `next/link`, 51 `next/image`). Mechanical swap: `Link` → `<a>` (drop the import), `Image` → `<img>` (width/height/alt survive; drop `priority`). veil footers also pull `next-themes` — replace the theme switcher or install it.
- **Icons**: blocks import `lucide-react`; swap to phosphor equivalents at copy time (one-icon-family rule, SKILL.md).

## Pitfalls
- **HEAVY flag in the TSV** (`HEAVY:dotted-map+recharts`): 4 items — dusk-features-7, dusk-landing-4/7/9 (chart + world-map decoration via `dusk-chart`). Vendored-but-flagged so nothing silently vanishes; take them only when the dependency weight is genuinely wanted, or cut the map/chart pane. swiper/three touch no radix payload at this pin (scanned each build anyway).
- Kit mixing sneaks in via bare greps — `grep pricing sections.tsv` matches all three kits; always filter column 2.
- Zero `prefers-reduced-motion` handling anywhere upstream (parity with baseline components, not a regression) — apply the arsenal's standard reduced-motion gates when a block animates (logo-cloud sliders, veil hero motion).
- 'use client' hygiene is good (static blocks are RSC-safe; only interactive files declare it) — don't add directives while copying.
- Upstream is React 19 / Next 16; sampled code is React-18-safe, but re-verify if pinning older.

## Refresh / fallback
- `bash scripts/sync.sh tailark && node scripts/build-catalogs.mjs`. Sync hard-fails if upstream main != `TAILARK_BLOCKS_SHA` (oss.tailark.com serves main, so a moved head means unaudited payloads) and keeps the previous copy on any gate miss (counts, sizes, closure, pin spot-check diff, MIT text).
- Bumping the pin is a deliberate edit to `TAILARK_BLOCKS_SHA` in `sync.sh`: re-run the audit spot-checks first (placeholder-copy drift, new heavy deps, kit additions, the patch-on-copy defect list above — upstream may fix some; retire notes as they land).
- Per-item fallback (verified 200, use only during re-audit, never at build time): `https://oss.tailark.com/r/radix/{name}.json`.
