# Adding a source — the quality gate

No source enters the arsenal without passing this gate. The bar, in priority
order: (1) highest-quality output, no matter what; (2) most robust solution;
(3) easiest for the end user. License + vendorability verification alone is
NOT admission — a candidate must prove it *raises* quality against what is
already vendored. Lateral moves and worse-duplicates are rejected by default.

Run the steps in order; any hard failure stops the evaluation.

1. **Name the hole.** Cite the exact SKILL.md/orchestration.md line or a
   measured baseline defect the source fixes. A purely lateral addition stops
   here unless it wins head-to-head at step 3.
2. **Sample-audit ≥5 REAL items end-to-end** (full payload source, not demos
   or docs pages), spanning the easy-to-hard range of the catalog.
3. **Head-to-head every overlap.** Any candidate item overlapping an existing
   vendored item must beat it in a source-level comparison or be excluded —
   default-exclude on ties. A second, worse home for the same effect is a
   routing regression, not an addition.
4. **Verify a11y and reduced-motion in the samples** (grep `aria-`,
   `focus-visible`, `prefers-reduced-motion`; check keyboard paths). Every gap
   found becomes a card recipe or a `wild` tag — never silence, and never
   assume the demo page proved it.
5. **Dep-weight and version-trap check.** Enumerate npm deps, peer matrices,
   and version floors (Tailwind major/minor, React, WebGL, pinned engines).
   Every SILENT-failure floor (classes that no-op, licenses that flip) gets a
   card warning plus an explicit fallback routing path. (Precedent: vanta
   requires three r134; Tailwind 4.1 mask utilities no-op silently below 4.1.)
6. **License rider recorded BEFORE vendoring.** License text, relicense
   history across versions, and trademark/redistribution nuance land in
   `licenses.tsv`. Forbid any version range that crosses a license boundary.
   (Precedent: @paper-design/shaders < 0.0.77 is PolyForm Shield, not Apache.)
7. **Pin everything.** Commit SHA or exact version in `vendor/MANIFEST.json`,
   never `main`/`latest`; docs, indexes, and engine/data sync from one tag.
8. **Sync fail-loud.** Assert parse success, row/item counts, and minimum file
   sizes; on any miss keep the previous vendored copy and append to MANIFEST
   `failures[]`. A silent empty index is worse than a stale one.
9. **Write the curation filter BEFORE vendoring, as data** (tags/paths/dep
   rules, not vibes), together with the card's MUST-rules covering every
   regression path the audit identified (replace-before-ship, one-kit,
   role-split, closed allowlists).
10. **Routing-dilution mitigation.** New items land in a class-scoped TSV or
    behind a domain-split routing rule; a new source must never become the
    second-best answer inside an existing grep surface. Bundle same-phase
    prose sources into one routing row (precedent: `review-packs` = WIG + axe).
11. **One runnable eval assertion per source** (expected grep hit, `get-*.sh`
    emits valid output, pinned version matches MANIFEST, allowlist unchanged),
    and count end-user integration steps vs baseline — more steps without a
    quality gain fails the gate.

Integration touch-points a new source must cover (all five, or drift bugs
follow): `scripts/sync.sh` (function + case + pin), `scripts/build-catalogs.mjs`
(index block + licenses row), `SKILL.md` (arsenal row + routing + token
discipline), `sources/<slug>.md` (card carrying the audit's conditions as law),
`evals/policy.json` (slug + any grep-only patterns).
