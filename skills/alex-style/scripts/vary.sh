#!/usr/bin/env bash
# vary.sh — anti-default sampler for the vendor/_index TSVs.
#
# LLMs given similar prompts re-pick the same rows from the head of a grep.
# This script injects real entropy: it emits the index header plus N rows
# sampled at random from the (optionally filtered) index, so every shortlist
# starts from a different slice of the arsenal. Selection stays with the
# model — sampling only decides what it looks at first.
#
# Usage:
#   bash scripts/vary.sh <tsv> [n] [egrep-pattern]
#   bash scripts/vary.sh vendor/_index/palettes.tsv 8 light-ui
#   bash scripts/vary.sh vendor/_index/inspiration.tsv 10 'health|clinic|wellness'
#   bash scripts/vary.sh vendor/_index/components.tsv 8 'ticker|count'
#
# Needs only bash + awk + sort + head (see SKILL.md Tooling assumptions).
set -euo pipefail

tsv="${1:?usage: vary.sh <tsv> [n] [egrep-pattern]}"
n="${2:-6}"
pat="${3:-}"

[ -f "$tsv" ] || { echo "vary.sh: no such index: $tsv" >&2; exit 1; }

# Echo the column-layout header so the caller never loses the schema.
head -1 "$tsv" | grep '^#' || true

if [ -n "$pat" ]; then
  rows="$(grep -v '^#' "$tsv" | grep -iE "$pat" || true)"
else
  rows="$(grep -v '^#' "$tsv")"
fi

if [ -z "$rows" ]; then
  echo "vary.sh: 0 rows match '$pat' — widen the pattern" >&2
  exit 1
fi

# Seed from $RANDOM + PID so two calls in the same second still differ.
printf '%s\n' "$rows" \
  | awk -v seed="${RANDOM:-1}$$" 'BEGIN{srand(seed)} {printf "%.8f\t%s\n", rand(), $0}' \
  | sort -n \
  | cut -f2- \
  | head -n "$n"
