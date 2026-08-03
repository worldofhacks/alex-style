# sync_fonts() plan — fail-loud, pinned, atomic

> Slots into the existing `scripts/sync.sh` conventions observed by the audit: continue past
> individual failures, record a `failures[]` array in `vendor/MANIFEST.json`, pin exact versions
> (precedent: phosphor_core 2.1.1, lenis 1.3.25), atomic swap. Cadence: monthly with the rest.

## Steps

### 1. Metadata (Google Fonts, undocumented endpoint — treat as hostile)
```bash
curl -sS --fail --max-time 60 'https://fonts.google.com/metadata/fonts' -o "$TMP/metadata.json"
```
- **Anti-JSON prefix check (fail-loud, never silent):** if the first 4 bytes are `)]}'`, strip
  them; if the first non-whitespace byte after optional strip is not `{`, FAIL the step. Rationale:
  the endpoint historically shipped the `)]}'` XSSI prefix and today (verified 2026-08-02) ships
  clean pretty-printed JSON — it has already shape-drifted once; both forms must parse, anything
  else must scream.
- Assert: JSON parses AND `len(familyMetadataList) >= 1500` (today: 1,942). A silent format change
  must not vendor an empty index.

### 2. Tags CSV (google/fonts@main, undocumented 4-column schema)
```bash
curl -sS --fail --max-time 60 \
  'https://raw.githubusercontent.com/google/fonts/main/tags/all/families.csv' -o "$TMP/families.csv"
```
- Assert: family-level rows (column 2 empty) >= 15,000 (today: 24,296) AND distinct families
  >= 1,500 (today: 1,939). The schema already grew `wght@` per-instance rows once — the
  family-level count is the drift-proof invariant, and this assertion is strictly stronger than
  the gate's ">=1500 rows" wording.

### 3. Rebuild fonts.tsv
- Run the build script (filters + columns per fonts-tsv-plan.md) against the two temp downloads.
- Assert: output row count within ±20% of the previous vendored fonts.tsv (first run: >= 1,000).
- Assert: every pairing-table family present in the output (the table is the taste contract; a
  family vanishing upstream is a loud MANIFEST failure, not a silent row drop).

### 4. Woff2 shelf (per family in the pairing table — and ONLY those)
For each `fontsource_id`:
```bash
curl -sS --fail "https://api.fontsource.org/v1/fonts/$id" -o "$TMP/fs/$id.json"
```
- Assert `license == "OFL-1.1"` (any relicense → skip family + record failure; never vendor).
- Read `npmVersion` → build the PINNED URL (never `@latest`):
  - variable: `https://cdn.jsdelivr.net/fontsource/fonts/{id}:vf@{npmVersion}/latin-{axisfile}-normal.woff2`
  - static:   `https://cdn.jsdelivr.net/fontsource/fonts/{id}@{npmVersion}/latin-400-normal.woff2`
  - `axisfile` comes from the shelf list in fonts-tsv-plan.md; if the preferred axis file 404s,
    fall back to `latin-wght-normal` AND record a `failures[]` warning (a lost opsz/wdth file is
    a real capability regression the owner should see).
- Download; assert **bytes > 5120** AND first 4 bytes == `wOF2` (`77 4F 46 32`) — jsDelivr serves
  its 404s with 200-adjacent HTML bodies in some proxy configs; magic-byte check is cheap.
- Store as `vendor/fonts/woff2/{id}[-{axisfile}].woff2`.

### 5. Atomic swap + MANIFEST
- Build everything in `$TMP/fonts-next/`; on full success `mv` into `vendor/fonts/` (same
  convention as the other sources).
- On ANY step-1/2/3 assertion failure: keep the previous vendored copy untouched, append to
  MANIFEST `failures[]`, exit non-zero for that source only (sync.sh continues to next source).
- Per-family step-4 failures: keep that family's previous woff2, record, continue.

## MANIFEST.json additions

```json
"fonts": {
  "synced": "2026-08-02",
  "metadata_families": 1942,
  "tsv_rows": 1230,
  "anti_json_prefix_seen": false,
  "shelf": {
    "space-grotesk": { "npmVersion": "5.3.0", "file": "latin-wght-normal.woff2", "bytes": 22288, "sha256": "…" },
    "fraunces":      { "npmVersion": "5.3.0", "file": "latin-opsz-normal.woff2", "bytes": 67304, "sha256": "…" },
    "archivo-black": { "npmVersion": "5.3.0", "file": "latin-400-normal.woff2", "bytes": 18604, "sha256": "…" }
  },
  "failures": []
}
```

- `anti_json_prefix_seen` is recorded every run — a flip in that boolean is the early-warning
  signal that the endpoint is drifting again.
- Pins are per-family npmVersion (all 5.3.0 today because Fontsource releases the monorepo in
  lockstep, but the schema must not assume that stays true).
- sha256 per file: staleness diffing between monthly runs costs nothing and catches silent
  upstream re-releases under the same version (jsDelivr is immutable-by-version in theory; the
  hash makes it verified-in-practice).

## What sync NEVER does

- Never vendors the raw metadata JSON or families.csv (build-time inputs only — the gate's
  "never the raw families.csv").
- Never downloads a family outside the pairing table (shelf growth requires a table edit, which
  requires owner review — the taste gate is structural).
- Never uses `@latest` or unversioned jsDelivr paths.
- Never "fixes" a failed assertion by relaxing it in-place: thresholds live at the top of the
  script as named constants with the measured 2026-08-02 baselines in comments.
