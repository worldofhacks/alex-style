# fonts.tsv build plan + woff2 shelf list — PROPOSAL

> Builds the vendored index the gate demands ("a BUILT fonts.tsv … never the raw families.csv")
> and the offline woff2 shelf. Nothing here ships until the pairing table passes owner review.
> All numbers below are measured from live data on 2026-08-02, not estimated.

## Inputs (measured 2026-08-02)

| Input | Measured | Fail-loud gate |
|---|---|---|
| `https://fonts.google.com/metadata/fonts` | 2,691,018 B; 1,942 families; **no `)]}'` prefix today** (endpoint historically had one — strip-if-present must stay) | JSON parses AND `familyMetadataList >= 1500` |
| `https://raw.githubusercontent.com/google/fonts/main/tags/all/families.csv` | 29,172 rows; 24,296 family-level rows (col 2 empty); 1,939 distinct tagged families; 4,876 `wght@` per-instance rows to DROP | family-level rows >= 15,000 AND distinct families >= 1,500 (strictly stronger than the gate's ">=1500 rows" literal) |
| `https://api.fontsource.org/v1/fonts/{id}` | all 47 shelf ids resolve; all `license == "OFL-1.1"`; all `npmVersion == "5.3.0"` today | per-family: license must equal OFL-1.1 or the family is skipped + recorded |

## Row filter (family-level, measured yields)

Start: 1,942 metadata families.

1. Drop `isNoto == true` — 212 families (the audit's "Noto flood": 10 of top-12 naive sans hits).
2. Drop `isBrandFont == true` — 221 families (Roboto/Google Sans/Product Sans etc.).
3. Drop families without `latin` in `subsets` — 125.
   → eligible pool: **1,601**.
4. Keep rows with ≥1 structural tag (`/Sans/* /Serif/* /Slab/* /Script/* /Monospace /Theme/*`)
   scoring **>= 70** → **1,230 rows** (knobs measured: >=60 → 1,280; any structural → 1,482;
   only 3 pool families are fully untagged: Geomini, Hibur Mono, Saira Stencil).
5. Seasonal/special-use: 311 pool families carry a `/Seasonal/*` or `/Special use/*` tag >= 60,
   but ZERO have only such tags — so this is an **`oddity` flag column, not a row drop**
   (matches the audit's "keep reachable via an oddity flag rather than deletion").
6. Pairing-table membership overrides filter 4 (none of the 47 currently need the override, but
   the rule keeps the table authoritative if it ever adds an untagged family).

Recommendation: ship the >=70 cut (1,230 rows). The tsv is a fallback for unusual briefs; recall
beyond 1,230 well-classified families buys noise, not options.

## Columns (one row per family, tab-separated)

```
family            fontsource_id     category      structural_tags              expressive_top3        axes                        weights         has_italic  oddity   date_added   pairing_ids   popularity
Space Grotesk     space-grotesk     Sans Serif    /Sans/Neo Grotesque=100;...  Calm=71                wght 300-700                300..700        no          -        2020-10-06   brutalist-techno   65
```

- `structural_tags`: all structural tags >= 70 with scores, `;`-joined. The grep anchor.
- `expressive_top3`: top-3 expressive tags >= 60. Tiebreakers ONLY (card copy: "never a
  must-filter, never the sole ranker").
- `axes`: compact `tag lo-hi` list from metadata (the anti-CLS payload: agents cite real ranges).
- `weights`/`has_italic`: from metadata `fonts` keys — the other half of the anti-CLS payload.
- `oddity`: `seasonal`, `special-use`, `color-font` (metadata `colorCapabilities` non-empty OR no
  `wght` axis + `/Theme/*`-only structurals — exactly the Nabla/Honk/Kablammo signature, verified),
  else `-`.
- `pairing_ids`: which pairing-table rows use it (makes the table greppable from the tsv side).
- `popularity`: LAST column, header-commented `# informational only — never sort by this`.
  Kept because it's a useful existence/health signal at sync time; position + comment encode the ban.
- Sort order of the file: **alphabetical by family** — deliberately not popularity.

Build script: `scripts/build-fonts-tsv.mjs` (or a py in scripts/), consuming the two vendored raw
snapshots + the pairing table's front-matter family list; runs inside sync (see sync-plan.md).
The raw metadata JSON and families.csv are build-time inputs only — **neither is vendored**; only
fonts.tsv + the shelf ship.

## woff2 shelf list (ONLY pairing-table families — 47)

Rules (per gate + one amendment): Fontsource `OFL-1.1` only (all 47 verified); **latin, normal
style only**; variable file where the family is variable; pinned versioned jsDelivr URLs recorded
in MANIFEST — never `@latest`.

**Amendment needed to the gate's "variable only" letter (flagged in open-questions.md):** 9 display
families are single-weight statics (that's what a display cut IS for several of these). Proposal:
variable preferred; single-static-weight families ship exactly one `latin-400-normal.woff2`;
multi-weight static families are excluded from the shelf — the sole table exception is IBM Plex
Serif (static 100–700), which ships 400 + 700 only, or its pair is marked npm-only. Owner call.

URL patterns (all verified live):

```
variable: https://cdn.jsdelivr.net/fontsource/fonts/{id}:vf@{npmVersion}/latin-{axisfile}-normal.woff2
static:   https://cdn.jsdelivr.net/fontsource/fonts/{id}@{npmVersion}/latin-400-normal.woff2
```

`axisfile` semantics (probed live): `wght` = wght-only subset (smallest, always present for
variable families); `{axis}` (e.g. `wdth`, `opsz`) = that axis + wght; `full` = all axes (exists
only for 3+-axis families; 404s for 2-axis Archivo — sync must not assume it).

Per-family axis-file policy — default `wght`, EXCEPT where the pairing's rationale depends on the
axis:

| Family (id) | File | Reason |
|---|---|---|
| Archivo (`archivo`) | `latin-wdth-normal` (90,104 B verified) | wdth 62–125 is the poster/condensed mechanism of `brutalist-poster` |
| Fraunces (`fraunces`) | `latin-opsz-normal` (67,304 B verified) | opsz is the display/text mechanism; `full` (SOFT/WONK, 121,016 B verified) is an owner option |
| Newsreader (`newsreader`) | `latin-opsz-normal` | the opsz axis IS pair `editorial-opsz` |
| Bodoni Moda (`bodoni-moda`) | `latin-opsz-normal` | hairline preservation below display sizes |
| Big Shoulders (`big-shoulders`) | `latin-opsz-normal` | condensed crispness across sizes |
| Zalando Sans (`zalando-sans`) | `latin-wdth-normal` | body wdth cited in `brutalist-techno` |
| all other variable families | `latin-wght-normal` | wght is the only axis the brief modulates |
| Shantell Sans (`shantell-sans`) | `latin-wght-normal` (79,292 B) — `full` is 174,456 B | BNCE/INFM animation is an owner opt-in (open-questions.md #5) |

Static 400-only (one file each): `archivo-black`, `dela-gothic-one`, `boldonse`, `anton`,
`instrument-serif`, `dm-serif-display`, `italiana`, `prata`, `young-serif`.
Static multi-weight exception: `ibm-plex-serif` (400 + 700 or npm-only — owner call).

Variable, `latin-wght-normal`: `space-grotesk`, `unbounded`, `manrope`, `onest`,
`schibsted-grotesk`, `public-sans`, `chivo`, `playfair-display`, `source-sans-3`,
`hanken-grotesk`, `instrument-sans`, `dm-sans`, `jost`, `cinzel`, `eb-garamond`, `karla`,
`mulish`, `source-serif-4`, `atkinson-hyperlegible-next`, `lora`, `figtree`, `libre-franklin`,
`familjen-grotesk`, `ibm-plex-sans`, `martian-mono`, `baloo-2`, `nunito-sans`, `shantell-sans`,
`bricolage-grotesque`, `albert-sans`, `work-sans`.
(+ proposed mono accent `jetbrains-mono` — pending open-questions.md #2.)

## Verified sample URLs (required 3; ran 4 + 6 naming probes, all 2026-08-02)

| URL | Status | Bytes |
|---|---|---|
| `https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk:vf@5.3.0/latin-wght-normal.woff2` | 200 | 22,288 |
| `https://cdn.jsdelivr.net/fontsource/fonts/fraunces:vf@5.3.0/latin-opsz-normal.woff2` | 200 | 67,304 |
| `https://cdn.jsdelivr.net/fontsource/fonts/archivo-black@5.3.0/latin-400-normal.woff2` | 200 | 18,604 |
| `https://cdn.jsdelivr.net/fontsource/fonts/atkinson-hyperlegible-next:vf@5.3.0/latin-wght-normal.woff2` | 200 | 33,996 |

Naming probes also verified: `archivo` wght 34,928 B / wdth 90,104 B / full → 404;
`nunito-sans` wght 31,076 B / full 81,308 B; `shantell-sans` wght 79,292 B / full 174,456 B;
`fraunces` full 121,016 B; `ibm-plex-serif` static 400 19,580 B / 700 19,904 B.

**Footprint estimate:** 47 files, measured range 18.6–90 KB, median ~30 KB → **~1.6–2.2 MB**
(within the gate's 2–3 MB envelope; well under phosphor's tarball).

## Consumption (for the future sources/fonts.md card — orchestration wiring)

- Phase 0 cites a `pair_id` (primary) or a fonts.tsv query (fallback, structural-anchored).
- Phase 1 scaffold owns ALL font loading: npm projects → `npm i @fontsource-variable/{id}@{pin}`
  + one CSS import; zero-build/CSP (claude.ai artifacts block every external host) → copy shelf
  woff2 + 6-line `@font-face` with the tsv's verified weight range in `font-weight:`.
- Section agents never pick fonts (gate condition, restated on the card).
- Card query recipe (the anti-regression contract): structural tags anchor (`/Sans/Grotesque>=70`),
  expressive tags reorder survivors only, `oddity != '-'` excluded by default, popularity never
  sorts. Worked good/bad examples go on the card verbatim from the audit (Loud>=60 → Nabla/Honk
  vs `/Sans/Grotesque>=60` sorted-by-Loud → Archivo Black, Dela Gothic One, Space Grotesk).
