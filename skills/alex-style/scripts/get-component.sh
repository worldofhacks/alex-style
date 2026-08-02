#!/usr/bin/env bash
# Extract component source (or deps) from a vendored registry item JSON.
# Works with whichever of jq / node / python3 is installed — no hard jq dependency.
#
# Usage: get-component.sh <path/to/item.json> [file_index]   # print source of files[N] (default 0)
#        get-component.sh <path/to/item.json> --deps         # print npm + registry deps, one per line
#        get-component.sh <path/to/item.json> --files        # list bundled file paths (multi-file items)
set -euo pipefail
ITEM="${1:?usage: get-component.sh <item.json> [file_index|--deps|--files]}"
MODE="${2:-0}"
[ -f "$ITEM" ] || { echo "not found: $ITEM — grep vendor/_index/components.tsv for the right path" >&2; exit 1; }

if command -v jq >/dev/null 2>&1; then
  case "$MODE" in
    --deps)  jq -r '(.dependencies // [])[], (.registryDependencies // [])[]' "$ITEM" ;;
    --files) jq -r '.files[].path' "$ITEM" ;;
    *)       jq -r ".files[$MODE].content" "$ITEM" ;;
  esac
elif command -v node >/dev/null 2>&1; then
  node -e '
    const d = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const m = process.argv[2];
    if (m === "--deps") console.log([...(d.dependencies ?? []), ...(d.registryDependencies ?? [])].join("\n"));
    else if (m === "--files") console.log(d.files.map(f => f.path).join("\n"));
    else console.log(d.files[Number(m)].content);
  ' "$ITEM" "$MODE"
elif command -v python3 >/dev/null 2>&1; then
  python3 -c '
import json, sys
d = json.load(open(sys.argv[1])); m = sys.argv[2]
if m == "--deps": print("\n".join((d.get("dependencies") or []) + (d.get("registryDependencies") or [])))
elif m == "--files": print("\n".join(f["path"] for f in d["files"]))
else: print(d["files"][int(m)]["content"])
' "$ITEM" "$MODE"
else
  echo "need one of: jq, node, python3" >&2; exit 1
fi
