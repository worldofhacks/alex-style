# Radix Colors — color infrastructure (ramps, states, text, dark mode)
> 31 hand-tuned 12-step scales (light + dark + alpha) as plain CSS custom properties; the deterministic lookup for hover/active/border/muted/text steps and the entire dark mapping. It is NOT a palette source.

## At a glance
- **What**: `@radix-ui/colors` 3.0.0 — 25 accent scales + 6 tinted grays (mauve/slate/sage/olive/sand + pure gray), each as `{scale}.css` (light), `{scale}-dark.css`, plus `-alpha` variants and `black-alpha.css`/`white-alpha.css` overlays. Pure CSS vars (`--blue-9`), hex + display-p3 behind `@supports` guards. Light files scope `:root, .light, .light-theme`; dark files scope `.dark, .dark-theme` ONLY (see Pitfalls).
- **License**: MIT ((c) 2021 Radix, `vendor/radix-colors/LICENSE`). Redistribution fine, no attribution required.
- **Vendored** (`vendor/radix-colors/`): `css/` — all 126 `*.css` files (~138KB; JS/TS module builds deliberately excluded — same data, dead weight); `LICENSE`.
- **Index**: `vendor/_index/radix-colors.tsv` — 372 rows: `scale, step(1-12), light_hex, dark_hex, semantic_role, gray_pairing, step9_foreground`. `step9_foreground` is computed WCAG contrast vs white on step 9 (`dark` when <3.0:1) — consult it BEFORE putting text on any solid.
- **Project deps**: none, ever. NEVER `npm install @radix-ui/colors` in a target project — copy/paste the vendored CSS files (zero-build parity with artifacts). Upstream frozen since 2023-10; pinned 3.0.0 in `vendor/MANIFEST.json`.

## ROLE SPLIT — this is law
**Layers palettes (`_index/palettes.tsv`) or the client's brand hexes are the ONLY source of character and identity. Radix is infrastructure.** Radix supplies: neutral ramps (steps 1–8), interactive state steps (3–5), border steps (6–8), text steps (11–12), and the dark-mode mapping. A design brief must NEVER cite Radix as its palette — pick the character palette FIRST (Phase 0), then map ramps via Radix. WHY: Radix steps are deliberately desaturated and systematic; sourcing accents from Radix converges every build onto the same shadcn-app look and erases the curated-community character this arsenal exists for. Radix scales are also "not intended to be customised" (their docs) — never invent custom ramps; brand hexes live ALONGSIDE the scales.

## When to use / when NOT
Use for:
- Deriving semantic tokens from a chosen palette: bg/surface/hover/active/border/muted/text in one lookup instead of per-run invention (the arsenal's #1 measured defect source — 5/98 layers palettes have no AA pair, none carry state steps).
- Dark mode: every scale has a same-step-number dark file — same token names, coherent inversion for free.
- Alpha overlays (`--black-a1..a12`, `--white-a1..a12`, per-scale `-alpha`) for scrims, shadows, glass surfaces.

NOT for:
- Choosing the design's colors → `_index/palettes.tsv` (layers) or brand hexes. Character first, always.
- Illustration/gradient/hero fills that carry identity → keep the raw brand hex (`--brand`), see recipe below.
- Custom brand ramp generation — out of scope; snap to the nearest Radix scale instead.

## How to consume (token discipline)
The TSV is 372 rows (~16KB) — awk/grep it; single-scale pulls are fine. Never read all 126 CSS files; copy the 4–6 files you need.
```bash
awk -F'\t' '$2==9 {print $1"\t"$3"\t"$7}' vendor/_index/radix-colors.tsv   # snap table: every step-9 solid + safe foreground
awk -F'\t' '$1=="cyan"' vendor/_index/radix-colors.tsv                      # one full ramp, light+dark, roles
awk -F'\t' 'NR>1 {print $1"\t"$6}' vendor/_index/radix-colors.tsv | sort -u # designated gray pairing per scale
cp vendor/radix-colors/css/{cyan,cyan-dark,slate,slate-dark}.css <project>/styles/   # ship exactly what you use
```

## The 12-step contract & gray pairing
Steps mean the same thing in every scale: **1–2** app/subtle background · **3–5** component bg / hover / active · **6–8** subtle border / border+focus / strong border · **9–10** solid accent + hover (step 9 = purest chroma) · **11–12** low-contrast text / high-contrast body text.

Designated gray per accent (verified from radix-ui/themes `getMatchingGrayColor()` — the docs table omits gold/bronze):
| Gray | Pairs with |
|---|---|
| `mauve` | tomato, red, ruby, crimson, pink, plum, purple, violet |
| `slate` | iris, indigo, blue, sky, cyan |
| `sage` | mint, teal, jade, green |
| `olive` | grass, lime |
| `sand` | yellow, amber, orange, brown, gold, bronze |

Pure `gray` pairs with anything (neutral vibe). Use the designated gray, not `gray`, unless the brief calls for clinical neutrality.

## Accent recipe: snap to nearest hue
1. Take the brief's accent hex (from the layers palette / brand). Compute its hue; pick the Radix scale whose step-9 hue is nearest (eyeball via the snap-table one-liner above). Match lightness class too: a mid/deep brand hex snaps to a solid scale (cyan, blue), not a hue-adjacent pastel scale (sky, mint) whose 9–10 need dark text.
2. Use that scale's steps 3–10 for ALL interactive states (hover, active, focus ring, solid buttons) and its steps 11–12 for tinted text.
3. Keep the raw brand hex as `--brand` for hero fills, illustrations, and big identity moments; when it's close to the snapped step 9, you may override `--accent-9` with the brand hex — but then check its own contrast (e.g. `#32aad5` measures 2.68:1 vs white → dark foreground).
4. Grays come from the pairing table, keyed off the snapped scale.

## shadcn token bridge (registry components keep working, both modes)
```css
:root {
  --background: var(--gray-1);  --card: var(--gray-2);   --popover: var(--gray-2);
  --secondary: var(--gray-3);   --muted: var(--gray-3);  --border: var(--gray-6);
  --input: var(--gray-7);       --ring: var(--accent-8); --primary: var(--accent-9);
  --muted-foreground: var(--gray-11);                    --foreground: var(--gray-12);
}
```
Substitute the designated gray + snapped accent for `gray`/`accent`. Dark mode = the same mappings resolve from the `-dark` files automatically once `class="dark"` is on `<html>` — do not write a second token block. `--primary-foreground`: white only if the scale's `step9_foreground` is `white`; else a near-black (accent step 12 dark-file value works).

## Contrast rules (verbatim — these are the shipped-bug traps)
- **Steps 11 and 12 are the text steps.** Step 12 = body text (measured >10:1 on step-2 bg everywhere, e.g. blue 12.0:1). Step 11 = secondary text.
- **Step 11's guarantee is APCA Lc 60, NOT WCAG 4.5:1.** Light-mode yellow-11 measures 4.42:1 and amber-11 4.43:1 on step 2 — marginally below AA body. Treat step 11 on yellow/amber (light) as large-text only. Never restate "step 11 is AA-safe".
- **Consult `step9_foreground` before putting text on step-9/10 solids.** `dark` scales: sky, mint, lime, yellow, amber (measured 1.26–1.58:1 vs white — white text is invisible), plus orange, which computes 2.97:1 — under the 3:1 large-text floor. (Radix's APCA-based docs list orange as white-foreground; the index errs WCAG-safe. If you keep white on orange-9 per upstream, it is large-text/UI only.)
- **White on ANY step 9 is UI/large-text territory** (blue-9, the best case class, is 3.26:1; cyan-9 is 3.00:1 exactly). Body text on a solid uses a step-12 foreground or gets checked first.

## Worked example (palette → tokens)
Brief palette: layers `cmbhztcmh000al80cd86lbtbu` = `#32aad5,#541424,#ace4dc,#9c7464,#2c5f56,#d8bebd` (dark-ui,light-ui).
Accent `#32aad5` (hue ≈196°, mid-depth solid) → snaps to **cyan** (`#00a2c7`, 191°; sky is hue-adjacent but pastel) → designated gray **slate**. Ship `cyan.css, cyan-dark.css, slate.css, slate-dark.css` + the bridge:
```css
:root { /* character: layers palette; infrastructure: Radix cyan/slate */
  --brand: #32aad5;            /* hero/illustration fills — identity stays layers */
  --background: var(--slate-1); --card: var(--slate-2);  --muted: var(--slate-3);
  --border: var(--slate-6);     --input: var(--slate-7); --ring: var(--cyan-8);
  --primary: var(--cyan-9);     --primary-foreground: white;  /* cyan step9_foreground=white (3.00:1 — large text/UI) */
  --muted-foreground: var(--slate-11); --foreground: var(--slate-12);
}
```
Deep `#541424` / `#2c5f56` etc. remain free accents for sections and illustrations — Radix never replaces them.

## Pitfalls
- Dark files scope `.dark, .dark-theme` — NOT `:root`. Without a `.dark` class on `<html>`/`<body>` the dark vars never apply. For a dark-only page, either add the class or paste the dark file's block re-scoped to `:root`.
- The `-alpha` scales are step-matched transparencies (`--blue-a9` composites to exactly `--blue-9` on white) — use them over imagery/tinted bgs; `black-alpha`/`white-alpha` are the universal scrim/glass overlays (rgba, not in the TSV).
- The p3 `@supports` blocks are progressive enhancement — keep them when pasting; they're why wide-gamut screens look richer. The TSV carries the sRGB hex only.
- Steps 1–2 are near-invisible tints; don't use them as card borders (that's 6), and don't use step 9 for large text-bearing surfaces (3–5 are the component fills).

## Refresh / fallback
- `bash scripts/sync.sh radix-colors` — re-fetches the pinned 3.0.0 npm tarball, gates on 126 CSS files / ≥100KB / MIT LICENSE, atomic-swaps. Upstream is frozen; annual check is plenty. Then `node scripts/build-catalogs.mjs`.
- On-demand single scale (verified 200): `curl -s https://unpkg.com/@radix-ui/colors@3.0.0/cyan.css`
