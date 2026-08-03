#!/usr/bin/env bash
# Extract a single SVGL brand-logo SVG from the vendored library (no network).
# Usage: get-logo.sh <name> [variant] [outfile]
#   variant: light (default) | dark | wordmark | wordmark-dark
#   outfile: path to write; omit to print SVG to stdout
# Names are the slug column of vendor/_index/logos.tsv — grep it first (col 2
# holds human titles, e.g. "Amazon Web Services" for slug `aws`).
# HARD RULE: brand not in logos.tsv → styled TEXT wordmark placeholder.
# Never hand-draw/approximate a mark, never substitute phosphor *-logo glyphs.
set -euo pipefail
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NAME="${1:?usage: get-logo.sh <name> [light|dark|wordmark|wordmark-dark] [outfile]}"
VARIANT="${2:-light}"
TSV="$SKILL_DIR/vendor/_index/logos.tsv"
[ -f "$TSV" ] || { echo "missing $TSV — run: bash scripts/sync.sh svgl && node scripts/build-catalogs.mjs" >&2; exit 1; }
case "$VARIANT" in
  light)                       COL=4 ;;
  dark)                        COL=5 ;;
  wordmark)                    COL=6 ;;
  wordmark-dark|wordmark_dark) COL=7 ;;
  *) echo "unknown variant: $VARIANT (light|dark|wordmark|wordmark-dark)" >&2; exit 1 ;;
esac
ROW="$(awk -F'\t' -v n="$NAME" '$1==n{print; exit}' "$TSV")"
[ -n "$ROW" ] || { echo "not found: $NAME — grep -i '$NAME' vendor/_index/logos.tsv (titles are human names: 'Amazon Web Services', not 'aws'). Still absent? Use a styled TEXT wordmark — NEVER draw or approximate a mark (sources/svgl.md)" >&2; exit 1; }
FILE="$(printf '%s' "$ROW" | awk -F'\t' -v c="$COL" '{print $c}')"
[ -n "$FILE" ] || { echo "no $VARIANT route for $NAME — a missing dark route usually means the colored light mark is theme-safe (use it as-is; NEVER CSS-invert); a missing wordmark → icon + styled text. See sources/svgl.md" >&2; exit 1; }
SVG_PATH="$SKILL_DIR/vendor/svgl/library/$FILE"
[ -f "$SVG_PATH" ] || { echo "index/library mismatch: $FILE not vendored — re-run: bash scripts/sync.sh svgl" >&2; exit 1; }
if [ -n "${3:-}" ]; then mkdir -p "$(dirname "$3")"; cp "$SVG_PATH" "$3"; echo "wrote $3"; else cat "$SVG_PATH"; fi
