#!/usr/bin/env bash
# alex-style sync — vendors all 13 sources into <skill>/vendor/ in one shot.
# Uses ONLY curl, git, tar, jq. No browser automation, no npm install, no code execution.
# Idempotent: re-run any time to refresh. Continues past individual failures and
# reports a summary; exits non-zero if any source failed entirely.
#
# Usage:  bash scripts/sync.sh [source ...]     # no args = all sources
# Sources: magicui kokonutui reactbits motion-primitives gsap motion lenis
#          phosphor animista vanta shadergradient recent layers

set -u
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR="$SKILL_DIR/vendor"
UA="alex-style-sync/1.0 (local design asset aggregator)"
FAILURES=()
OK=()

# Pinned versions (bump deliberately; sync verifies latest via npm registry where noted)
PHOSPHOR_CORE_VERSION="2.1.1"
LENIS_VERSION="1.3.25"

say()  { printf '\033[1;34m[sync]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*" >&2; }
fail() { warn "$1"; FAILURES+=("$1"); }

# fetch URL OUTFILE [extra curl args...]
fetch() {
  local url="$1" out="$2"; shift 2
  mkdir -p "$(dirname "$out")"
  if curl -fsSL --retry 3 --retry-delay 2 -A "$UA" "$@" -o "$out.tmp" "$url"; then
    mv "$out.tmp" "$out"; return 0
  else
    rm -f "$out.tmp"; return 1
  fi
}

# sparse_clone REPO_URL BRANCH DEST_TMP path...
sparse_clone() {
  local url="$1" branch="$2" dest="$3"; shift 3
  rm -rf "$dest"
  git clone --quiet --depth 1 --filter=blob:none --sparse --branch "$branch" "$url" "$dest" || return 1
  git -C "$dest" sparse-checkout set "$@" || return 1
}

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# tiny helper for parallel per-name fetches (BSD xargs -I with long inline commands fails)
# usage: <names on stdin> | fetch_many OUTDIR URL_PREFIX URL_SUFFIX OUT_SUFFIX
cat > "$TMP/fetch_one.sh" <<'HELPER'
#!/bin/sh
# $1=name $2=outdir $3=url_prefix $4=url_suffix $5=out_suffix
curl -fsSL --retry 2 -o "$2/$1$5" "$3$1$4" 2>/dev/null || echo "MISS $1"
HELPER
chmod +x "$TMP/fetch_one.sh"
fetch_many() {
  mkdir -p "$1"
  xargs -P 8 -I{} "$TMP/fetch_one.sh" {} "$1" "$2" "$3" "$4"
}

# ---------------------------------------------------------------- Magic UI
sync_magicui() {
  local d="$VENDOR/magicui"
  say "Magic UI: registry + llms docs + per-component JSON"
  fetch "https://magicui.design/r/registry.json" "$d/registry.json" || { fail "magicui registry.json"; return; }
  fetch "https://magicui.design/llms.txt" "$d/llms.txt" || fail "magicui llms.txt"
  fetch "https://magicui.design/llms-full.txt" "$d/llms-full.txt" || fail "magicui llms-full.txt"
  fetch "https://raw.githubusercontent.com/magicuidesign/magicui/main/LICENSE.md" "$d/LICENSE.md" || warn "magicui LICENSE miss"
  jq -r '.items[] | select(.type == "registry:ui") | .name' "$d/registry.json" \
    | fetch_many "$d/r" "https://magicui.design/r/" ".json" ".json" \
    | sed 's/^MISS /  missing: /'
  say "Magic UI: $(ls "$d/r" | wc -l | tr -d ' ') component JSONs vendored"
  # the maintainers' own agent skill (component reference + usage recipes)
  if sparse_clone "https://github.com/magicuidesign/magicui" main "$TMP/magicui-skill" skills; then
    rm -rf "$d/skill"
    cp -R "$TMP/magicui-skill/skills/magic-ui" "$d/skill" 2>/dev/null \
      || warn "magicui skills/magic-ui dir not found in clone"
  else
    warn "magicui skill clone failed"
  fi
}

# ---------------------------------------------------------------- KokonutUI
sync_kokonutui() {
  local d="$VENDOR/kokonutui"
  say "KokonutUI: registry + llms docs + per-component JSON"
  fetch "https://kokonutui.com/r/registry.json" "$d/registry.json" || { fail "kokonutui registry.json"; return; }
  fetch "https://kokonutui.com/llms.txt" "$d/llms.txt" || fail "kokonutui llms.txt"
  fetch "https://kokonutui.com/llms-full.txt" "$d/llms-full.txt" || fail "kokonutui llms-full.txt"
  fetch "https://raw.githubusercontent.com/kokonut-labs/kokonutui/main/LICENSE" "$d/LICENSE" || fail "kokonutui LICENSE"
  # registry.json names + extra published names not in the index (verified to exist)
  { jq -r '.items[].name' "$d/registry.json";
    printf '%s\n' flow-field spotlight-cards loader morphic-navbar mouse-effect-card slide-text-button ai-prompt; } \
    | sort -u \
    | fetch_many "$d/r" "https://kokonutui.com/r/" ".json" ".json" > /dev/null
  say "KokonutUI: $(ls "$d/r" | wc -l | tr -d ' ') component JSONs vendored"
}

# ---------------------------------------------------------------- React Bits
sync_reactbits() {
  local d="$VENDOR/reactbits"
  say "React Bits: llms index + registry + TS-Tailwind variant sources"
  fetch "https://reactbits.dev/llms.txt" "$d/llms.txt" || fail "reactbits llms.txt"
  fetch "https://reactbits.dev/r/registry.json" "$d/registry.json" || { fail "reactbits registry.json"; return; }
  fetch "https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md" "$d/LICENSE.md" || fail "reactbits LICENSE.md"
  jq -r '.items[].name | select(endswith("-TS-TW"))' "$d/registry.json" \
    | fetch_many "$d/r" "https://reactbits.dev/r/" "" ".json" \
    | sed 's/^MISS /  missing: /'
  say "React Bits: $(ls "$d/r" | wc -l | tr -d ' ') TS-TW component JSONs vendored"
}

# ---------------------------------------------------------------- Motion-Primitives
sync_motion_primitives() {
  local d="$VENDOR/motion-primitives"
  say "Motion-Primitives: sparse clone (core components + registry + docs)"
  if sparse_clone "https://github.com/ibelick/motion-primitives" main "$TMP/mp" \
      components/core public/c app/docs; then
    rm -rf "$d"; mkdir -p "$d"
    cp -R "$TMP/mp/components/core" "$d/core"
    cp "$TMP/mp/public/c/registry.json" "$d/registry.json"
    [ -d "$TMP/mp/app/docs" ] && cp -R "$TMP/mp/app/docs" "$d/docs"
    fetch "https://raw.githubusercontent.com/ibelick/motion-primitives/main/LICENCE.md" "$d/LICENSE.md" \
      || fetch "https://raw.githubusercontent.com/ibelick/motion-primitives/main/LICENSE.md" "$d/LICENSE.md" \
      || warn "motion-primitives license file not fetched"
    say "Motion-Primitives: $(ls "$d/core" | wc -l | tr -d ' ') core components vendored"
  else
    fail "motion-primitives sparse clone"
  fi
}

# ---------------------------------------------------------------- GSAP
sync_gsap() {
  local d="$VENDOR/gsap"
  say "GSAP: llms.txt + official gsap-skills repo"
  fetch "https://gsap.com/llms.txt" "$d/llms.txt" || fail "gsap llms.txt"
  if git clone --quiet --depth 1 "https://github.com/greensock/gsap-skills" "$TMP/gsap-skills"; then
    rm -rf "$d/skills"; mkdir -p "$d"
    cp -R "$TMP/gsap-skills/skills" "$d/skills" 2>/dev/null || cp -R "$TMP/gsap-skills" "$d/skills"
    rm -rf "$d/skills/.git"
    say "GSAP: official agent skills vendored ($(ls "$d/skills" | wc -l | tr -d ' ') entries)"
  else
    fail "gsap-skills clone"
  fi
}

# ---------------------------------------------------------------- Motion (motion.dev)
sync_motion() {
  local d="$VENDOR/motion"
  say "Motion: llms.txt master doc index"
  fetch "https://motion.dev/llms.txt" "$d/llms.txt" || fail "motion llms.txt"
}

# ---------------------------------------------------------------- Lenis
sync_lenis() {
  local d="$VENDOR/lenis"
  say "Lenis: llms.txt + READMEs + pinned dist for zero-build use"
  fetch "https://www.lenis.dev/llms.txt" "$d/llms.txt" || fail "lenis llms.txt"
  fetch "https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md" "$d/README.md" || fail "lenis README"
  fetch "https://raw.githubusercontent.com/darkroomengineering/lenis/main/packages/react/README.md" "$d/README.react.md" || warn "lenis react README miss"
  fetch "https://raw.githubusercontent.com/darkroomengineering/lenis/main/packages/snap/README.md" "$d/README.snap.md" || warn "lenis snap README miss"
  fetch "https://unpkg.com/lenis@$LENIS_VERSION/dist/lenis.min.js" "$d/dist/lenis.min.js" || fail "lenis dist js"
  fetch "https://unpkg.com/lenis@$LENIS_VERSION/dist/lenis.css" "$d/dist/lenis.css" || fail "lenis dist css"
}

# ---------------------------------------------------------------- Phosphor Icons
sync_phosphor() {
  local d="$VENDOR/phosphor"
  say "Phosphor: core tarball (9,072 SVGs, kept compressed) + icon catalog"
  mkdir -p "$d"
  if fetch "https://registry.npmjs.org/@phosphor-icons/core/-/core-$PHOSPHOR_CORE_VERSION.tgz" "$d/core.tgz"; then
    # extract only the small metadata files; SVGs stay inside the tarball
    tar -xzf "$d/core.tgz" -C "$TMP" package/LICENSE 2>/dev/null && cp "$TMP/package/LICENSE" "$d/LICENSE"
  else
    fail "phosphor core tarball"
  fi
  # canonical machine-readable catalog (1,512 entries with tags/categories)
  fetch "https://raw.githubusercontent.com/phosphor-icons/core/main/src/icons.ts" "$d/icons.ts" || fail "phosphor icons.ts"
}

# ---------------------------------------------------------------- Animista
sync_animista() {
  local d="$VENDOR/animista"
  say "Animista: full keyframes dump + per-family metadata + license"
  fetch "https://raw.githubusercontent.com/vikrantyadav611/tailwindcss-animistacss/master/CSS/animista__keyframes.css" \
    "$d/keyframes.css" || fail "animista keyframes.css"
  fetch "https://raw.githubusercontent.com/kekeh/angular-mydatepicker/master/CSS-ANIMATION-LICENSE" \
    "$d/LICENSE.txt" || warn "animista license copy miss (FreeBSD, (c) 2017 Ana Travas — add manually)"
  if git clone --quiet --depth 1 "https://github.com/amihhs/unocss-preset-animista" "$TMP/animista-meta"; then
    local metadir
    metadir="$(find "$TMP/animista-meta" -type d -name animista -path '*src*' | head -1)"
    if [ -n "$metadir" ]; then
      rm -rf "$d/meta"; cp -R "$metadir" "$d/meta"
      say "Animista: metadata families vendored ($(find "$d/meta" -name '*.ts' | wc -l | tr -d ' ') files)"
    else
      warn "animista meta dir not found in clone"
    fi
  else
    fail "animista meta clone"
  fi
}

# ---------------------------------------------------------------- Vanta.js
sync_vanta() {
  local d="$VENDOR/vanta"
  say "Vanta: dist builds + pinned three.r134 + readable src (defaultOptions)"
  if sparse_clone "https://github.com/tengbao/vanta" master "$TMP/vanta" dist src vendor; then
    rm -rf "$d"; mkdir -p "$d"
    cp -R "$TMP/vanta/dist" "$d/dist"
    mkdir -p "$d/src"; cp "$TMP/vanta/src"/*.js "$d/src/" 2>/dev/null  # includes _base.js + helpers
    cp "$TMP/vanta/vendor/three.r134.min.js" "$d/three.r134.min.js" 2>/dev/null || warn "vanta three.r134 miss"
    fetch "https://raw.githubusercontent.com/tengbao/vanta/master/README.md" "$d/README.md" || warn "vanta README miss"
    fetch "https://raw.githubusercontent.com/tengbao/vanta/master/LICENSE.md" "$d/LICENSE.md" || warn "vanta LICENSE miss"
    say "Vanta: $(ls "$d/dist" | grep -c 'min.js') dist builds vendored"
  else
    fail "vanta sparse clone"
  fi
}

# ---------------------------------------------------------------- ShaderGradient
sync_shadergradient() {
  local d="$VENDOR/shadergradient"
  say "ShaderGradient: presets catalog + README"
  fetch "https://raw.githubusercontent.com/ruucm/shadergradient/main/packages/shadergradient/src/presets.ts" \
    "$d/presets.ts" || fail "shadergradient presets.ts"
  fetch "https://raw.githubusercontent.com/ruucm/shadergradient/main/README.md" "$d/README.md" || fail "shadergradient README"
}

# ---------------------------------------------------------------- recent.design
sync_recent() {
  local d="$VENDOR/recent"
  say "recent.design: metadata-only catalog via public tRPC API (media stays on their CDN)"
  mkdir -p "$d"
  fetch "https://recent.design/sitemap.xml" "$d/sitemap.xml" || warn "recent sitemap miss"
  # categories
  fetch "https://api.recent.design/trpc/categories.list?input=%7B%7D" "$d/categories.json" || warn "recent categories miss"
  # paginated items pull per feed -> JSONL of trimmed metadata
  local feed cursor page input url out
  for feed in all tools skills; do
    out="$d/items.$feed.jsonl"; : > "$out"; cursor=""; page=0
    while [ $page -lt 30 ]; do
      page=$((page + 1))
      if [ -n "$cursor" ]; then
        input=$(jq -rn --arg c "$cursor" --arg f "$feed" '{limit:50, feed:$f, sort:"recent", cursor:$c} | tojson | @uri')
      else
        input=$(jq -rn --arg f "$feed" '{limit:50, feed:$f, sort:"recent"} | tojson | @uri')
      fi
      url="https://api.recent.design/trpc/items.list?input=$input"
      if ! curl -fsSL --retry 2 -o "$TMP/recent-page.json" "$url"; then
        warn "recent $feed page $page fetch failed"; break
      fi
      jq -c '(.result.data.json // .result.data)
             | (.items // [])[]
             | {id, title, tagline, description, category, format,
                creator: (.creator.name // .creator.handle // null),
                source: (.source.url // null),
                installCommand: (.installCommand // null),
                githubUrl: (.githubUrl // null), githubStars: (.githubStars // null)}' \
        "$TMP/recent-page.json" >> "$out" 2>/dev/null
      cursor=$(jq -r '(.result.data.json // .result.data) | .nextCursor // empty' "$TMP/recent-page.json")
      [ -z "$cursor" ] && break
    done
    say "recent.design [$feed]: $(wc -l < "$out" | tr -d ' ') items"
  done
  [ -s "$d/items.all.jsonl" ] || fail "recent items pull"
}

# ---------------------------------------------------------------- Layers
sync_layers() {
  local d="$VENDOR/layers"
  say "Layers: tags + color palettes + shot metadata (metadata only, no images)"
  mkdir -p "$d"
  fetch "https://layers.to/api/v1/tags?take=30" "$d/tags.json" || fail "layers tags"
  fetch "https://layers.to/palettes/list?take=100" "$d/palettes.json" || fail "layers palettes"
  local out="$d/shots.jsonl" cursor="" page=0 url
  : > "$out"
  while [ $page -lt 10 ]; do
    page=$((page + 1))
    url="https://layers.to/api/v1/layers?take=100"
    [ -n "$cursor" ] && url="$url&cursor=$cursor"
    if ! curl -fsSL --retry 2 -H "Referer: https://layers.to/" -o "$TMP/layers-page.json" "$url"; then
      warn "layers page $page fetch failed"; break
    fi
    jq -c '(.layers // .data // [])[]
           | {id, title, description,
              imageUrl: (.imageUrl // null),
              user: (.user.username // null), createdAt}' \
      "$TMP/layers-page.json" >> "$out" 2>/dev/null
    cursor=$(jq -r '.pagination.nextCursor // .nextCursor // empty' "$TMP/layers-page.json")
    [ -z "$cursor" ] && break
  done
  say "Layers: $(wc -l < "$out" | tr -d ' ') shot metadata records"
  [ -s "$out" ] || fail "layers shots pull"
}

# ---------------------------------------------------------------- main
ALL_SOURCES=(magicui kokonutui reactbits motion-primitives gsap motion lenis phosphor animista vanta shadergradient recent layers)
SOURCES=("${@:-}")
[ -z "${SOURCES[0]:-}" ] && SOURCES=("${ALL_SOURCES[@]}")

mkdir -p "$VENDOR"
for s in "${SOURCES[@]}"; do
  case "$s" in
    magicui)            sync_magicui ;;
    kokonutui)          sync_kokonutui ;;
    reactbits)          sync_reactbits ;;
    motion-primitives)  sync_motion_primitives ;;
    gsap)               sync_gsap ;;
    motion)             sync_motion ;;
    lenis)              sync_lenis ;;
    phosphor)           sync_phosphor ;;
    animista)           sync_animista ;;
    vanta)              sync_vanta ;;
    shadergradient)     sync_shadergradient ;;
    recent)             sync_recent ;;
    layers)             sync_layers ;;
    *) warn "unknown source: $s" ;;
  esac
done

# manifest
jq -n --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      --arg phosphor "$PHOSPHOR_CORE_VERSION" --arg lenis "$LENIS_VERSION" \
      --argjson failures "$(printf '%s\n' "${FAILURES[@]:-}" | jq -R . | jq -s 'map(select(length>0))')" \
      '{synced_at: $date, pinned: {phosphor_core: $phosphor, lenis: $lenis}, failures: $failures}' \
  > "$VENDOR/MANIFEST.json"

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  warn "sync finished with ${#FAILURES[@]} failure(s):"
  printf '  - %s\n' "${FAILURES[@]}" >&2
  exit 1
fi
say "sync complete — all sources vendored under $VENDOR"
