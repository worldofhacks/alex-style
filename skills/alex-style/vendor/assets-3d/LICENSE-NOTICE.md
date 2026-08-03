# assets-3d — provenance and license record (CC0 audit trail)

Last synced: 2026-08-03. CC0 requires NO attribution — this file exists
as an audit trail (arsenal law: provenance is recorded even when the license
does not demand it). Per-asset rows incl. exact URLs, byte pins, and exclusion
evidence live in assets.tsv next to this file.

## Poly Haven HDRIs (hdri/)
License: CC0 1.0 public-domain dedication, declared site-wide at
polyhaven.com/license ("CC0 means absolute freedom"; redistribution, including
in sold products, is explicitly allowed) AND page-level on each asset page
(verified 2026-08-03: polyhaven.com/a/venice_sunset, polyhaven.com/a/studio_small_03
both tag cc0). Author: Greg Zaal. The dl.polyhaven.org URL scheme is stable but
not contractual — byte pins in sync.sh make any drift a loud failure.

## Khronos glTF-Sample-Assets (models/)
The repository has NO top-level license (GitHub API license: null, verified
2026-08-03) — each model's metadata.json legal[] array IS its license, which is
why metadata.json is vendored adjacent to every glb. Pinned commit:
2bac6f8c57bf471df0d2a1e8a8ec023c7801dddf (main @ 2026-04-27). Note the metadata license string is
"CC0" with the creativecommons.org/publicdomain/zero/1.0 legalcode URL — not
the SPDX id "CC0-1.0"; the sync gate checks both string and URL.
- SheenChair: legal[] = 1x CC0 (artist Eric Chadwick, owner Wayfair, LLC) — checked Models/SheenChair/metadata.json @ pin.
- ToyCar: legal[] = 2x CC0 (Guido Odendahl initial model + Eric Chadwick extensions, owner Public) — checked Models/ToyCar/metadata.json @ pin.
- DamagedHelmet is EXCLUDED: legal[] carries CC-BY-NC-4.0 (theblueturtle_ base
  model) under a CC-BY-4.0 conversion — an NC-tainted composite. Recorded as a
  data row in assets.tsv so no future sweep re-includes it by reflex.
