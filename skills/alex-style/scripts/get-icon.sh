#!/usr/bin/env bash
# Extract a single Phosphor icon SVG from the vendored tarball (no network).
# Usage: get-icon.sh <name> [weight] [outfile]
#   weight: thin | light | regular (default) | bold | fill | duotone
#   outfile: path to write; omit to print SVG to stdout
# Names are kebab-case — search vendor/_index/icons.tsv first.
set -euo pipefail
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NAME="${1:?usage: get-icon.sh <name> [weight] [outfile]}"
WEIGHT="${2:-regular}"
FILE="$NAME"
[ "$WEIGHT" != "regular" ] && FILE="$NAME-$WEIGHT"
SVG="$(tar -xzOf "$SKILL_DIR/vendor/phosphor/core.tgz" "package/assets/$WEIGHT/$FILE.svg" 2>/dev/null)" \
  || { echo "not found: $WEIGHT/$FILE.svg — grep vendor/_index/icons.tsv for the right name" >&2; exit 1; }
if [ -n "${3:-}" ]; then mkdir -p "$(dirname "$3")"; printf '%s' "$SVG" > "$3"; echo "wrote $3"; else printf '%s\n' "$SVG"; fi
