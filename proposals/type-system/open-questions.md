# Open questions — genuine owner-taste calls

Ordered by how much they change the deliverables. Everything else in this package is proposed as
decided; these are the points where the data cannot answer and my taste shouldn't silently win.

## 1. How hard to skew away from popular families?
Current draft: top-20 hard-banned, ranks 21–30 allowed with a flag (4 flagged: DM Sans 22,
Nunito Sans 26, Playfair Display 27, Archivo Black 28 — justifications in pairing-table.md).
The strict alternative — ban top-30 outright — costs the canonical Didone (Playfair) and the only
4-axis rounded body (Nunito Sans); replacements exist (Bodoni Moda everywhere Didone is needed,
Figtree for rounded-ish bodies) but each is a real taste trade. **Where do you want the line, and
should the flag threshold be encoded in the card or stay table-only?**

## 2. Mono accent column?
Technical briefs almost always want a code/mono accent, and the table currently only reaches mono
via `technical-terminal` (Martian Mono as display). Proposal: add an optional `mono_accent` column
with one default (JetBrains Mono — variable wght 100–800, OFL, rank 64) and per-pair overrides
(IBM Plex Mono for `technical-docs` — static, era-matched; Space Mono for `brutalist-techno` —
`/Theme/Techno=100` like its display). Cost: +1–3 shelf files (~25–60 KB). **Include the column,
and if so is JetBrains Mono acceptable as the default given how strongly it codes "developer
tool"?**

## 3. Shelf size: 47 families vs the gate's "~40"
25 pairs → 47 unique families (~1.6–2.2 MB measured). Trimming to ~41: cut `editorial-scotch`
(also kills the DM Sans flag), `luxury-quiet`, and `playful-hand` — the three pairs whose niches
have nearest neighbors elsewhere in the table. **Trim to the letter of the gate, or accept 47 and
note it in the integration PR?**

## 4. Static display faces vs the "variable normal only" condition
The gate's shelf discipline says variable-only, but 9 of the best display cuts are single-weight
statics (Archivo Black, Boldonse, Dela Gothic One, Anton, Instrument Serif, DM Serif Display,
Italiana, Prata, Young Serif) — a strict reading guts the display column. Proposed amendment in
fonts-tsv-plan.md: single-static-weight families ship exactly one `latin-400-normal.woff2`;
multi-weight statics excluded except IBM Plex Serif (400+700, or mark its pair npm-only).
**Bless the amendment (and pick a side on Plex Serif)?**

## 5. Shantell Sans: wght file (79 KB) or full file (174 KB)?
The full file carries BNCE/INFM/SPAC — animatable bounce/informality axes that motion briefs
could use as sanctioned motion vocabulary. Doubles that family's cost. **Worth it?** (Same
question in miniature for Fraunces full w/ SOFT+WONK at 121 KB vs opsz-only at 67 KB — the WONK
knob is half of pair `editorial-wonky`'s pitch, so I lean full for Fraunces, wght for Shantell.)

## 6. Geist / Geist Mono
On Google Fonts since 2024-10, `isBrandFont=false` in the data, variable, OFL — but it is
Vercel's identity face and design-literate audiences read it as "Vercel clone". Currently
excluded from the table. **Keep excluded, or add as a bench/`fintech-modern` alternate?**

## 7. Newcomer density
~40% of table families are post-2023 additions (Boldonse, Zalando Sans, Atkinson Hyperlegible
Next, Big Shoulders 2025-cut, Schibsted, Bricolage, Onest, Young Serif, Instrument pair…). That is
deliberate — it is exactly where the data beats model memory — but it trades away some
battle-tested-ness. **Comfortable with this ratio, or rebalance toward classics?**

## 8. Scripts and handwriting
Excluded by policy (the audit's wedding-script failure mode) except Shantell Sans
(`/Script/Handwritten=100`) for community/zine briefs. `luxury-fashion` briefs sometimes want a
script accent (Pinyon-class); the table refuses. **Is "no scripts except Shantell" the right
default, or should there be one curated script accent for luxury/wedding verticals?**

## 9. Metadata-vs-tags disagreements
Italiana: GF category "Sans Serif", tags `/Serif/Modern=100` (tags are right — it has hairline
contrast). Proposal: fonts.tsv carries both columns untouched and the card says "structural tags
outrank category on conflict". **OK to encode that rule, or prefer hand-patching known-wrong rows
at build time?** (Hand-patching also covers Bodoni Moda's bogus `/Theme/Blackletter=100` — I lean
"carry the data verbatim, table carries the taste", because a patch list is one more thing to
maintain.)

## 10. Pin display weights per pair?
E.g. `calm-accessible` intends Hanken 700/800 for display; `brutalist-poster` intends Archivo
wdth≈62 for condensed labels. The table currently says this in prose ("why it works"); a v2 could
add machine-readable `display_weights` / `display_axis_settings` columns so Phase-0 briefs copy
exact `font-variation-settings`. **Wait for a taste pass first, or add the columns now?**
