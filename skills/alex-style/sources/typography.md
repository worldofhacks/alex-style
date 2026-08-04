# Typography — the pairing index (display / body / mono)
> 47 verified pairings across 16 aesthetic registers — the index that kills the Inter-for-everything / Playfair+Inter default. Metadata-only source (like `layers`/`recent`): ZERO binary assets vendored. Every row names the faces, the delivery route (fontsource npm vs Fontshare per-project kit), the license, and the metric-adjacent system fallback stack.

## At a glance
- **What**: `vendor/_index/typography.tsv` — 47 rows, 47 UNIQUE display faces. Columns in the `#` header: id, display/body/mono faces + sources, a same-register `alt_display` (from the OTHER delivery source where one exists — the drift/outage escape hatch), 3–6 mood tags, one of 16 registers, and `fallbacks` = `<display stack> / <body stack>`.
- **Two delivery routes, two legal worlds** (the `_src` prefix IS the law):
  - `fontsource:@fontsource[-variable]/<pkg> (OFL-1.1)` — npm packages carrying the font's own OFL-1.1 in their `license` field (all 56 packages in the index verified at v5.3.0, 2026-08). Self-host, subset, vendor freely — keep the license text. Every fontsource family here is also on Google Fonts under the same display name, so `next/font/google` covers all of them. `, static` marks families with no variable build (import per-weight).
  - `fontshare:<slug> (ITF-FFL, download-only)` — Indian Type Foundry faces (Satoshi, Clash Display, Zodiak, Boska…). NEVER vendored, NEVER copied between projects: each project downloads its own kit. All 17 slugs verified live (`license_type: itf_ffl`, 2026-08).
- **Vendored**: nothing but this TSV. No woff2, no kits — by design (FFL forbids it; OFL doesn't need it).
- **Project deps**: at most one `@fontsource[-variable]/*` install, or zero (kit / CDN file copy).

## What this index is for
The display face is a LEDGER SIGNATURE AXIS (orchestration.md "Variation protocol"): never repeat the most recent build's display face — with 47 unique display faces there is no excuse. Sample at PAIR level and ship the row:
```bash
bash scripts/vary.sh vendor/_index/typography.tsv 8 "<register|mood|vertical>"
bash scripts/vary.sh vendor/_index/typography.tsv 8 'fashion|luxury'
```
The pairing is the curated unit — display/body contrast, register, and fallbacks were chosen together. NEVER Frankenstein two rows' display faces into one build. The ONLY sanctioned substitution is a row's own `alt_display` (same register, usually the other delivery source — e.g. when a Fontshare download is blocked or the ledger vetoes the display face).
Register ↔ brief mapping: house default (studio-editorial) → `warm-editorial-serif`, `boutique-magazine-serif`, `text-serif-editorial`, `warm-essayistic`, `characterful-grotesk-over-serif`, `slab-newsprint`. User-named aesthetics → their registers: fashion/luxury → `high-contrast-fashion-serif`/`dark-luxe`; tech/dev-tool → `technical-editorial-mono`/`grotesk-poster`; brutalist/poster → `grotesk-poster`/`condensed-impact`; friendly app → `rounded-friendly`; kids/candy → `playful-display`; minimal → `quiet-swiss`; gallery/arty → `arty-geometric-over-serif`. The pool spans BOTH worlds so no style is pigeonholed.

## How to consume (per stack)
**Next.js** — `next/font/google` for any fontsource-listed face (auto-generates a metric-tuned fallback → zero CLS):
```tsx
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
const display = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-display' })
const body = Hanken_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-body' })
```
Fontshare faces → download the kit (below), then `next/font/local`:
```tsx
import localFont from 'next/font/local'
const display = localFont({ src: './fonts/ClashDisplay-Variable.woff2', display: 'swap', variable: '--font-display' })
```
**Bundler (Vite/Astro/CRA)** — one install + one import; family name gets a ` Variable` suffix:
```bash
npm i @fontsource-variable/fraunces
```
```js
import '@fontsource-variable/fraunces'   // then: font-family: 'Fraunces Variable', Georgia, serif
```
Static-marked rows: `npm i @fontsource/instrument-serif` + `import '@fontsource/instrument-serif'` (400 only; add `/700.css` etc. deliberately — cap 2 weights). No ` Variable` suffix.
**Zero-build, Fontshare face** — per-project kit download (transient 500s: retry, or append `?formats=woff2`):
```bash
curl -sL "https://api.fontshare.com/v2/fonts/download/<slug>" -o kit.zip && unzip -q kit.zip
# verified kit layout: <Family>_Complete/Fonts/WEB/fonts/<Family>-Variable.woff2  (single-style faces
# like Tanker ship <Family>-Regular.woff2 instead)  +  License/FFL.txt
# copy ONLY the 1–2 woff2 you need into the project — never the whole kit (Satoshi ZIP = 3.3MB / 63 files)
```
```css
@font-face {
  font-family: 'Clash Display';
  src: url('/fonts/ClashDisplay-Variable.woff2') format('woff2');
  font-weight: 200 700; font-display: swap;
}
@font-face { /* size-adjust-tuned stand-in: the swap flash keeps the layout */
  font-family: 'Clash Display Fallback'; src: local('Arial');
  size-adjust: 98%; ascent-override: 96%; descent-override: 24%; line-gap-override: 0%;
}
:root { --font-display: 'Clash Display', 'Clash Display Fallback', Futura, sans-serif; }
```
**Zero-build, Google/fontsource face** — copy ONE variable woff2 from the fontsource CDN mirror (or google-webfonts-helper), same @font-face pattern, and keep the OFL text alongside:
```bash
curl -sL "https://cdn.jsdelivr.net/npm/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2" -o public/fonts/fraunces-var.woff2
curl -sL "https://cdn.jsdelivr.net/npm/@fontsource-variable/fraunces/LICENSE" -o public/fonts/fraunces-LICENSE
```

## LICENSE BOX — read before touching any `fontshare:` row
**FFL §02 "Limitations of usage" (verbatim, from `License/FFL.txt` in every kit):** "The Fonts may not - beyond the permitted copies and the uses defined herein - be distributed, duplicated, loaned, resold or licensed in any way, whether by lending, donating or give otherwise to a person or entity. This includes the distribution of the Fonts by e-mail, on USB sticks, CD-ROMs, or other media, uploading them in a public server or making the fonts available on peer-to-peer networks. A passing on to external designers or service providers (design agencies, repro studios, printers, etc.) is also not permitted." Same section: "You may not modify, edit, adapt, translate, reverse engineer, decompile or disassemble, alter or otherwise copy the Font Software or the designs embodied therein in whole or in part".
In practice, FFL faces are **per-project, download-only**:
- Each project runs its OWN kit download. Never copy the files from a previous project, never vendor them into this skill, never commit them to a repo that changes hands or a public template/starter.
- Never upload to a public server for others to fetch (self-hosting on YOUR site for YOUR pages is the licensed use; a font CDN is not), never pass to service providers — they download their own.
- **No subsetting/modification, ever**: no glyphhanger, no pyftsubset, no re-compression of FFL woff2s. (OFL faces: subset and self-host freely — ship the license text.)
- **Trap**: "if it's on npm and claims to be Satoshi, it's infringing" — there is no official npm package for ANY Fontshare FFL face; never install one.
- Commercial use, logos, and PDF embedding (read-only) are all fine (§01/§03). Attribution optional.

## Performance laws
- Variable single-file woff2 only — 40KB-class each (verified: Fraunces variable = 36.6KB). Budget display + body + optional mono ≈ **90–150KB total**; a static-only family counts per weight file, so cap it at 2 weights.
- Preload the 1–2 critical files: `<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/<display>.woff2">`.
- Never copy a whole kit into `public/` — WEB/ ships eot/ttf/woff duplicates you must not serve.
- `font-display: swap` everywhere; the row's `fallbacks` column is the flash-of-fallback experience — wire those exact system faces into the family stack AND the size-adjust stand-in (next/font does both automatically).

## Pitfalls
- fontsource variable CSS families end in ` Variable` (`'Syne Variable'`); Fontshare kit CSS uses the plain name (`'Clash Display'`). Don't mix conventions in tokens — pick per row and keep it.
- Single-style faces have no `-Variable.woff2`: Fontshare kits ship `<Family>-Regular.woff2`; `static`-marked fontsource rows import per-weight CSS.
- The Fontshare catalog drifts (100 faces at verification). Before first use in a new project, re-verify the slug: `curl -s 'https://api.fontshare.com/v2/fonts?limit=120' | jq -r '.fonts[]|select(.slug=="zodiak").license_type'` → expect `itf_ffl`. Missing slug → use the row's `alt_display`.
- Body faces are text faces on purpose — never promote a second display face into the body slot, and never demote the pairing to Inter "just to be safe": the defaults this index kills (Inter body, Playfair+Inter, stock Poppins headers) NEVER ship.
- `next/font/google` downloads at BUILD time (network carve-out applies, same class as npm installs); zero-build file copies are one-time curls into the project, not runtime fetches.

## Refresh / fallback
- Metadata-only: nothing to sync; no `sync.sh` stanza. Re-verify ad hoc:
  - `npm view @fontsource-variable/<pkg> version license` (expect OFL-1.1; fall back to `@fontsource/<pkg>` for static families)
  - `curl -s 'https://api.fontshare.com/v2/fonts?limit=120' | jq -r '.fonts[]|[.slug,.license_type]|@tsv'`
- A row that fails re-verification is repaired via its `alt_display`, then fixed in the TSV — never guessed around.
