#!/usr/bin/env bash
# alex-style sync — vendors all 17 sources into <skill>/vendor/ in one shot.
# Uses ONLY curl, git, tar, jq. No browser automation, no npm install, no code execution.
# Idempotent: re-run any time to refresh. Continues past individual failures and
# reports a summary; exits non-zero if any source failed entirely.
#
# Usage:  bash scripts/sync.sh [source ...]     # no args = all sources
# Sources: magicui kokonutui reactbits motion-primitives gsap motion lenis
#          phosphor animista vanta shadergradient recent layers
#          radix-colors paper-shaders svgl review-packs tailark origin fancy
#          atropos curtains model-viewer assets-3d media-chrome vfx-js noise r3f-drei

set -u
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR="$SKILL_DIR/vendor"
UA="alex-style-sync/1.0 (local design asset aggregator)"
FAILURES=()
OK=()

# Pinned versions (bump deliberately; sync verifies latest via npm registry where noted)
PHOSPHOR_CORE_VERSION="2.1.1"
LENIS_VERSION="1.3.25"
# @radix-ui/colors is stable/frozen upstream since 2023-10 — annual check is enough.
RADIX_COLORS_VERSION="3.0.0"
# LICENSE BOUNDARY: @paper-design/shaders 0.0.47-0.0.76 are PolyForm Shield, NOT
# Apache-2.0 — sync_paper_shaders hard-fails below 0.0.77. Check CHANGELOG for
# prop renames before bumping.
PAPER_SHADERS_VERSION="0.0.78"
# engine + rule-descriptions.md must come from the SAME tag (doc regenerates per release)
AXE_CORE_VERSION="4.12.1"
# Tailark pins a COMMIT SHA: oss.tailark.com serves whatever main is deployed and the
# repo is young/fast-moving. sync_tailark refuses to run if live main differs from this
# pin. Bump deliberately: re-run the audit checks in sources/tailark.md first.
TAILARK_BLOCKS_SHA="8139698115c1341bfd2e3e286c04bb4d8146f472"
# Origin UI frozen post-acquisition snapshot; 3c6058e4 is the LAST commit touching
# apps/origin (2026-05-08). Only apps/origin/ is MIT — repo ROOT is AGPLv3.
ORIGIN_COSS_SHA="3c6058e484e51e1fc14849c9b59a9cca6269c539"
# danielpetho/fancy — curated 8-item PATCHED-FORK subset; sync_fancy applies four
# vendor-time patches with fail-loud anchor checks. Re-audit anchors before bumping.
FANCY_COMMIT="f9f62c61207b2dd3210476dd98af3c9a5be24094"
# --- wave 3 pins (see each source card for bump rules; all sync fns fail loud on drift) ---
ATROPOS_VERSION="2.0.2"
ATROPOS_TARBALL_SHA1="8024e845487a69662b70fdb83f5e81039c934def"
CURTAINS_VERSION="8.1.6"
CURTAINS_COMMIT="840acaf7d960931350a4e9334b78161aa9b471b7"
MODEL_VIEWER_VERSION="4.3.1"
KHRONOS_GLTF_SHA="2bac6f8c57bf471df0d2a1e8a8ec023c7801dddf"
ASSETS3D_VENICE_BYTES=1440400      # venice_sunset_1k.hdr — HEAD-verified 2026-08-03
ASSETS3D_STUDIO_BYTES=1686299      # studio_small_03_1k.hdr — HEAD-verified 2026-08-03
ASSETS3D_SHEENCHAIR_BYTES=4125648  # SheenChair.glb @ pin (CORE TIER — only after owner sign-off: ASSETS3D_TIER=core)
ASSETS3D_TOYCAR_BYTES=5422412      # ToyCar.glb @ pin (CORE TIER — same gate)
MEDIA_CHROME_VERSION="4.19.2"
PLAYER_STYLE_SHA="12c9ad656e98998f998d24f0b94e6cddc0e07796"
VFX_JS_VERSION="1.1.0"
NOISE_WEBGL_SHA="22434e04d7753f7e949e8d724ab3da2864c17a0f"
NOISE_PSRD_SHA="419175a270862ce7ae692038fafafb42ec0427e9"
DREI_DOCS_VERSION="10.7.7"
R3F_FIBER_DOCS_VERSION="9.7.0"

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

# ---------------------------------------------------------------- Radix Colors
sync_radix_colors() {
  local d="$VENDOR/radix-colors"
  say "Radix Colors: @radix-ui/colors $RADIX_COLORS_VERSION npm tarball → CSS scales only (no npm install)"
  local tgz="$TMP/radix-colors.tgz" ex="$TMP/radix-colors-pkg"
  fetch "https://registry.npmjs.org/@radix-ui/colors/-/colors-$RADIX_COLORS_VERSION.tgz" "$tgz" \
    || { fail "radix-colors tarball fetch (keeping previous copy)"; return; }
  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "radix-colors tarball extract (keeping previous copy)"; return; }
  # quality gate: 3.0.0 ships exactly 126 *.css (31 scales × light/dark/alpha/dark-alpha
  # + black/white alpha), ~138KB total, plus an MIT LICENSE. Anything else = bad tarball.
  local n bytes
  n=$(ls "$ex/package"/*.css 2>/dev/null | wc -l | tr -d ' ')
  bytes=$(wc -c "$ex/package"/*.css 2>/dev/null | tail -1 | awk '{print $1}')
  if [ "$n" -ne 126 ] || [ "${bytes:-0}" -lt 100000 ]; then
    fail "radix-colors gate: expected 126 css files / ≥100KB, got $n files / ${bytes:-0} bytes — keeping previous copy"
    return
  fi
  if ! grep -q "MIT License" "$ex/package/LICENSE" 2>/dev/null; then
    fail "radix-colors gate: LICENSE missing or not MIT — keeping previous copy"
    return
  fi
  # vendor the CSS only (skip index.js/.mjs/types — same data duplicated as JS modules);
  # stage then atomic swap so a partial copy can never clobber a good vendor dir
  rm -rf "$d.new"; mkdir -p "$d.new/css"
  cp "$ex/package"/*.css "$d.new/css/" || { fail "radix-colors css copy"; rm -rf "$d.new"; return; }
  cp "$ex/package/LICENSE" "$d.new/LICENSE" || { fail "radix-colors LICENSE copy"; rm -rf "$d.new"; return; }
  rm -rf "$d"; mv "$d.new" "$d"
  say "Radix Colors: $(ls "$d/css" | wc -l | tr -d ' ') CSS files vendored ($bytes bytes; upstream frozen since 2023-10)"
}

# ---------------------------------------------------------------- Paper Shaders
sync_paper_shaders() {
  local d="$VENDOR/paper-shaders"
  say "Paper Shaders: pinned core dist (no sourcemaps) + LICENSE/NOTICE + Mintlify docs"

  # LICENSE-BOUNDARY GUARD (judge mandate): versions 0.0.47-0.0.76 are PolyForm
  # Shield 1.0.0, NOT Apache-2.0. Never vendor below 0.0.77; never float this pin.
  local floor="0.0.77"
  if [ "$(printf '%s\n%s\n' "$floor" "$PAPER_SHADERS_VERSION" | sort -V | head -1)" != "$floor" ]; then
    fail "paper-shaders: pinned version $PAPER_SHADERS_VERSION is below the Apache-2.0 floor 0.0.77 (PolyForm Shield licensing) — refusing to vendor"
    return
  fi

  fetch "https://registry.npmjs.org/@paper-design/shaders/-/shaders-$PAPER_SHADERS_VERSION.tgz" \
    "$TMP/paper-shaders.tgz" || { fail "paper-shaders tarball"; return; }
  rm -rf "$TMP/paper-shaders"; mkdir -p "$TMP/paper-shaders"
  tar -xzf "$TMP/paper-shaders.tgz" -C "$TMP/paper-shaders" || { fail "paper-shaders tarball extract"; return; }
  local pkg="$TMP/paper-shaders/package"

  # verify the tarball IS the pinned version and IS Apache-2.0, from its own package.json
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$pkg/package.json")" || { fail "paper-shaders package.json parse"; return; }
  got_license="$(jq -r '.license // empty' "$pkg/package.json")"
  [ "$got_version" = "$PAPER_SHADERS_VERSION" ] \
    || { fail "paper-shaders version mismatch: tarball says '$got_version', pinned $PAPER_SHADERS_VERSION"; return; }
  if [ "$(printf '%s\n%s\n' "$floor" "$got_version" | sort -V | head -1)" != "$floor" ]; then
    fail "paper-shaders: resolved version $got_version < 0.0.77 — PolyForm Shield territory, refusing to vendor"
    return
  fi
  [ "$got_license" = "Apache-2.0" ] \
    || { fail "paper-shaders license is '$got_license', expected Apache-2.0 — refusing to vendor"; return; }
  grep -q "Apache License" "$pkg/LICENSE" \
    || { fail "paper-shaders LICENSE text is not the Apache License — refusing to vendor"; return; }

  # stage everything; only replace the live vendor dir after every gate passes
  local stage="$TMP/paper-shaders-stage"
  rm -rf "$stage"; mkdir -p "$stage"
  cp -R "$pkg/dist" "$stage/dist"
  find "$stage/dist" -name '*.js.map' -delete   # ~436KB of dead weight; dist JS is readable source
  cp "$pkg/LICENSE" "$stage/LICENSE"
  [ -f "$pkg/NOTICE" ] && cp "$pkg/NOTICE" "$stage/NOTICE"       # Apache NOTICE must ship alongside
  [ -f "$pkg/README.md" ] && cp "$pkg/README.md" "$stage/README.md"
  cp "$pkg/package.json" "$stage/package.json"                    # keeps version+license auditable offline

  local shader_count dist_bytes
  shader_count="$(find "$stage/dist/shaders" -name '*.js' ! -name '*.map' 2>/dev/null | wc -l | tr -d ' ')"
  dist_bytes="$(find "$stage/dist" -type f \( -name '*.js' ! -name '*.map' \) -exec cat {} + | wc -c | tr -d ' ')"
  if [ "$shader_count" -lt 29 ] || [ "$dist_bytes" -lt 200000 ]; then
    fail "paper-shaders dist sanity: $shader_count shaders / $dist_bytes bytes (want >=29 / >=200000) — keeping previous copy"
    return
  fi

  # Mintlify docs: llms.txt index + per-shader pages (28 upstream + overview;
  # gem-smoke has no doc page — the catalog builder falls back to its dist source)
  mkdir -p "$stage/docs/shaders"
  fetch "https://paper-design-shaders.mintlify.app/llms.txt" "$stage/docs/llms.txt" \
    || { fail "paper-shaders docs llms.txt"; return; }
  grep -oE 'shaders/shaders/[a-z0-9-]+\.md' "$stage/docs/llms.txt" \
    | sed 's|shaders/shaders/||; s|\.md$||' | sort -u \
    | fetch_many "$stage/docs/shaders" "https://paper-design-shaders.mintlify.app/shaders/" ".md" ".md" \
    | sed 's/^MISS /  missing: /'
  local doc_count
  doc_count="$(ls "$stage/docs/shaders" 2>/dev/null | grep -c '\.md$' || true)"
  if [ "${doc_count:-0}" -lt 25 ]; then
    fail "paper-shaders docs sanity: only ${doc_count:-0} shader pages (want >=25) — keeping previous copy"
    return
  fi
  local f
  for f in "$stage/docs/shaders"/*.md; do
    if [ "$(wc -c < "$f" | tr -d ' ')" -lt 500 ]; then
      fail "paper-shaders doc $(basename "$f") suspiciously small (<500B) — keeping previous copy"
      return
    fi
  done

  # all gates passed — atomically swap in the new copy
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Paper Shaders: $shader_count shaders ($dist_bytes bytes dist) + $doc_count doc pages vendored @ $PAPER_SHADERS_VERSION"
}

# ---------------------------------------------------------------- SVGL
sync_svgl() {
  local d="$VENDOR/svgl"
  say "SVGL: brand-logo index (api.svgl.app) + full SVG library snapshot (pheralb/svgl@main)"
  # stage in $TMP and swap in only after every gate passes — never leave an empty/partial vendor dir
  local stage="$TMP/svgl-stage"
  rm -rf "$stage"; mkdir -p "$stage"
  fetch "https://api.svgl.app" "$stage/index.json" || { fail "svgl api index fetch"; return; }
  local count
  count=$(jq 'length' "$stage/index.json" 2>/dev/null) \
    || { fail "svgl index.json did not parse as JSON — keeping previous copy"; return; }
  [ "$count" -ge 500 ] \
    || { fail "svgl index has $count items (<500 floor; last audit: 665) — keeping previous copy"; return; }
  fetch "https://codeload.github.com/pheralb/svgl/tar.gz/refs/heads/main" "$stage/repo.tgz" \
    || { fail "svgl repo tarball fetch"; return; }
  mkdir -p "$stage/src"
  tar -xzf "$stage/repo.tgz" -C "$stage/src" --strip-components=1 \
    || { fail "svgl tarball extract"; return; }
  [ -d "$stage/src/static/library" ] \
    || { fail "svgl tarball layout changed (static/library missing) — keeping previous copy"; return; }
  local nfiles kb
  nfiles=$(find "$stage/src/static/library" -name '*.svg' | wc -l | tr -d ' ')
  kb=$(du -sk "$stage/src/static/library" | cut -f1)
  [ "$nfiles" -ge 900 ] \
    || { fail "svgl library has $nfiles SVGs (<900 floor; last audit: 1081) — keeping previous copy"; return; }
  [ "$kb" -ge 2000 ] \
    || { fail "svgl library is ${kb}KB (<2MB floor; last audit: ~5.6MB on disk) — keeping previous copy"; return; }
  grep -q "MIT License" "$stage/src/LICENSE" \
    || { fail "svgl LICENSE is no longer MIT — STOP and re-audit before vendoring"; return; }
  # quarterly-diff breadcrumb: rebrands age silently (upstream already ships a Stripe icon/wordmark era mismatch)
  if [ -f "$d/index.json" ]; then
    local prev; prev=$(jq 'length' "$d/index.json" 2>/dev/null || echo '?')
    say "SVGL: index $prev -> $count entries (diff quarterly; spot-check high-visibility marks for rebrands)"
  fi
  rm -rf "$d"; mkdir -p "$d/library"
  cp "$stage/src/static/library/"*.svg "$d/library/"
  cp "$stage/index.json" "$d/index.json"
  cp "$stage/src/LICENSE" "$d/LICENSE"
  say "SVGL: $count index entries, $nfiles SVGs (${kb}KB) vendored"
}

# ---------------------------------------------------------------- Review packs (WIG + axe-core)
# Bundled Phase 4 review sources: Vercel Web Interface Guidelines vendored
# VERBATIM (curation lives in sources/review-packs.md as a name-keyed exclusion
# list — never edit the vendored files) and the axe-core engine pinned to
# $AXE_CORE_VERSION with its rule reference pulled from the SAME version tag
# (rule-descriptions.md regenerates per release — fetching develop silently
# misdocuments rule tiers/IDs). Each sub-source validates in $TMP and installs
# only on pass, so a failed refresh keeps the previous vendored copy.
sync_review_packs() {
  local d="$VENDOR/review-packs"
  say "Review packs: Vercel WIG (verbatim) + axe-core $AXE_CORE_VERSION engine + rule reference"

  # -- wig/ : two-file MIT ruleset. NEVER vendor the web-design-guidelines
  #    skill wrapper instead — its live-WebFetch mechanism violates hard rule 1.
  local w="$TMP/wig" f
  rm -rf "$w"; mkdir -p "$w"
  for f in command.md AGENTS.md README.md LICENSE; do
    fetch "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/$f" "$w/$f" \
      || { fail "review-packs wig $f"; return; }
  done
  { [ "$(wc -c < "$w/command.md")" -ge 4000 ] && [ "$(grep -c '^- ' "$w/command.md")" -ge 80 ]; } \
    || { fail "review-packs wig command.md failed sanity check (empty/truncated/reshaped) — previous copy kept"; return; }
  grep -q 'MIT License' "$w/LICENSE" \
    || { fail "review-packs wig LICENSE no longer reads as MIT — inspect upstream before vendoring"; return; }
  mkdir -p "$d"; rm -rf "$d/wig"; cp -R "$w" "$d/wig"

  # -- axe/ : pinned npm tarball. MPL-2.0 file-level copyleft is satisfied by
  #    shipping axe.min.js UNMODIFIED (header intact) with its LICENSE alongside.
  local a="$TMP/axe" nrules
  rm -rf "$a"; mkdir -p "$a"
  fetch "https://registry.npmjs.org/axe-core/-/axe-core-$AXE_CORE_VERSION.tgz" "$a/axe-core.tgz" \
    || { fail "review-packs axe-core tarball"; return; }
  tar -xzf "$a/axe-core.tgz" -C "$a" package/axe.min.js package/LICENSE \
    || { fail "review-packs axe tarball extract"; return; }
  tar -xzf "$a/axe-core.tgz" -C "$a" package/LICENSE-3RD-PARTY.txt 2>/dev/null \
    || warn "review-packs axe LICENSE-3RD-PARTY.txt miss (non-fatal)"
  [ "$(wc -c < "$a/package/axe.min.js")" -ge 409600 ] \
    || { fail "review-packs axe.min.js under 400KB — truncated or wrong artifact"; return; }
  head -c 64 "$a/package/axe.min.js" | grep -q "axe v$AXE_CORE_VERSION" \
    || { fail "review-packs axe.min.js header is not v$AXE_CORE_VERSION"; return; }
  fetch "https://raw.githubusercontent.com/dequelabs/axe-core/v$AXE_CORE_VERSION/doc/rule-descriptions.md" \
    "$a/rule-descriptions.md" \
    || { fail "review-packs rule-descriptions.md at tag v$AXE_CORE_VERSION"; return; }
  nrules="$(grep -c '^| \[' "$a/rule-descriptions.md" || true)"
  [ "$nrules" -gt 100 ] \
    || { fail "review-packs rule-descriptions.md parsed $nrules rules (need >100) — format changed?"; return; }
  rm -rf "$d/axe"; mkdir -p "$d/axe"
  cp "$a/package/axe.min.js" "$a/package/LICENSE" "$d/axe/"
  [ -f "$a/package/LICENSE-3RD-PARTY.txt" ] && cp "$a/package/LICENSE-3RD-PARTY.txt" "$d/axe/"
  cp "$a/rule-descriptions.md" "$d/axe/rule-descriptions.md"

  # -- closed design-review allowlist: runOnly RULE values. Tag-based runOnly
  #    ('wcag2a', 'best-practice') is FORBIDDEN — it re-imports the landmark/
  #    region noise cluster wholesale. target-size is the only sanctioned opt-in.
  cat > "$d/axe/allowlist.json" <<'ALLOWLIST'
{
  "_law": "Closed 22-rule set for the Phase 4 axe pass (law lives in sources/review-packs.md). Never widen ad hoc; tag-based runOnly is forbidden; 'target-size' is the only sanctioned opt-in.",
  "runOnly": {
    "type": "rule",
    "values": [
      "color-contrast", "link-in-text-block",
      "button-name", "link-name", "input-button-name", "select-name", "label", "summary-name",
      "image-alt", "svg-img-alt", "role-img-alt",
      "aria-allowed-attr", "aria-valid-attr", "aria-valid-attr-value", "aria-required-attr",
      "aria-hidden-focus", "aria-command-name", "nested-interactive",
      "meta-viewport",
      "tabindex", "scrollable-region-focusable",
      "heading-order"
    ]
  },
  "optional_opt_in": ["target-size"]
}
ALLOWLIST
  jq -e '.runOnly.type == "rule" and (.runOnly.values | length == 22)' "$d/axe/allowlist.json" > /dev/null \
    || { fail "review-packs allowlist.json is not the closed 22-rule set"; return; }
  say "Review packs: wig 4 files + axe $AXE_CORE_VERSION ($nrules documented rules, 22-rule allowlist)"
}

# ---------------------------------------------------------------- Tailark
# RADIX BASE ONLY (judge mandate): the base-ui base would introduce a second
# primitive system (@base-ui/react) beside the arsenal's shadcn/Radix
# assumption — instant incoherence. Payloads come from oss.tailark.com
# (/r/radix/{name}.json, inline .content) which serves whatever main is
# deployed, so the pin gate below is what makes this a snapshot, not a float.
sync_tailark() {
  local d="$VENDOR/tailark"
  say "Tailark: radix-base marketing blocks (oss.tailark.com) @ tailark/blocks ${TAILARK_BLOCKS_SHA:0:12}"

  # BUNDLED DUPES — EXCLUDED (judge mandate): these five are copies of
  # components already vendored elsewhere in the arsenal; a second, staler home
  # for the same effect is a routing regression, not an addition.
  #   motion-primitives-*  -> vendor/motion-primitives/core/<name>.tsx
  #   magic-ui-border-beam -> vendor/magicui/r/border-beam.json
  local dupes="motion-primitives-animated-group
motion-primitives-infinite-slider
motion-primitives-progressive-blur
motion-primitives-text-effect
magic-ui-border-beam"

  # PIN GATE: upstream is young and moving (audit day: pushed 4 days prior).
  # If main has moved past the pin, oss.tailark.com no longer serves the
  # audited snapshot — keep the previous copy; re-audit (kit drift, new deps,
  # placeholder-copy changes) and bump TAILARK_BLOCKS_SHA deliberately.
  local sha
  sha="$(curl -fsSL --retry 3 -A "$UA" "https://api.github.com/repos/tailark/blocks/commits/main" | jq -r '.sha // empty')"
  [ -n "$sha" ] || { fail "tailark: cannot resolve tailark/blocks main SHA via GitHub API — keeping previous copy"; return; }
  if [ "$sha" != "$TAILARK_BLOCKS_SHA" ]; then
    fail "tailark: upstream main $sha != pinned $TAILARK_BLOCKS_SHA — payloads would not match the audited pin; re-audit and bump deliberately (keeping previous copy)"
    return
  fi

  local stage="$TMP/tailark-stage" raw="https://raw.githubusercontent.com/tailark/blocks/$TAILARK_BLOCKS_SHA"
  rm -rf "$stage"; mkdir -p "$stage/r" "$stage/extra/svgs"

  fetch "https://oss.tailark.com/r/radix/registry.json" "$stage/registry.json" \
    || { fail "tailark registry.json fetch"; return; }
  local total blocks pages
  total=$(jq '.items|length' "$stage/registry.json" 2>/dev/null) \
    || { fail "tailark registry.json did not parse as JSON — keeping previous copy"; return; }
  blocks=$(jq '[.items[]|select(.type=="registry:block")]|length' "$stage/registry.json")
  pages=$(jq '[.items[]|select(.type=="registry:page")]|length' "$stage/registry.json")
  { [ "$total" -ge 240 ] && [ "$blocks" -ge 140 ] && [ "$pages" -ge 10 ]; } \
    || { fail "tailark registry gate: $total items / $blocks blocks / $pages pages (floors 240/140/10; audit: 260/150/10) — keeping previous copy"; return; }

  # per-item payloads, minus the 5 dupes
  jq -r '.items[].name' "$stage/registry.json" | grep -vxF "$dupes" \
    | fetch_many "$stage/r" "https://oss.tailark.com/r/radix/" ".json" ".json" \
    | sed 's/^MISS /  missing: /'
  local expected got bytes
  expected=$((total - 5))
  got=$(ls "$stage/r" | wc -l | tr -d ' ')
  [ "$got" -eq "$expected" ] \
    || { fail "tailark payloads: fetched $got of $expected — keeping previous copy"; return; }
  bytes=$(find "$stage/r" -name '*.json' -exec cat {} + | wc -c | tr -d ' ')
  [ "$bytes" -ge 900000 ] \
    || { fail "tailark payloads total $bytes bytes (<900KB floor; audit: ~1.11MB for 255 payloads) — keeping previous copy"; return; }

  # every payload must parse and carry real inline source
  local f
  for f in "$stage/r"/*.json; do
    jq -e '[.files[].content | length] | add > 0' "$f" >/dev/null 2>&1 \
      || { fail "tailark payload $(basename "$f") unparseable or has empty content — keeping previous copy"; return; }
  done

  # CLOSURE GATE (judge mandate): every @tailark-oss/ registryDependency across
  # all vendored payloads must resolve to a vendored payload or to one of the 5
  # arsenal-mapped dupes — anything else means dangling imports in copied blocks.
  local missing_deps
  missing_deps=$(jq -rs --arg dupes "$dupes" '
      ([.[].name] + ($dupes | split("\n"))) as $have
      | [.[] | (.registryDependencies // [])[] | sub("^@tailark-oss/"; "")]
      | unique | map(select(. as $n | $have | index($n) | not)) | .[]' \
      "$stage/r"/*.json)
  [ -z "$missing_deps" ] \
    || { fail "tailark closure gate: unresolved registryDependencies: $(printf '%s ' $missing_deps) — keeping previous copy"; return; }

  # PIN ASSERTION (judge mandate): payloads must match the pinned commit. The
  # registry build rewrites only import paths, so spot-check three payloads
  # (one per kit, chosen because ALL their imports are covered by the known
  # rewrites) against raw@SHA; trailing-newline-insensitive compare.
  local name kit path
  for name in dusk-faqs-1 mist-pricing-1 veil-features-1; do
    kit="${name%%-*}"
    path=$(jq -r '.files[0].path' "$stage/r/$name.json")
    jq -r '.files[0].content' "$stage/r/$name.json" > "$TMP/tailark-payload"
    fetch "$raw/registry/bases/radix/$path" "$TMP/tailark-raw" \
      || { fail "tailark pin assertion: raw fetch of $path @ pin failed"; return; }
    sed -E "s|@/registry/bases/radix/$kit/ui/|@/components/ui/|g; s|@/registry/core/ui/|@/components/ui/|g; s|@/registry/core/hooks/|@/hooks/|g" \
      "$TMP/tailark-raw" > "$TMP/tailark-raw-rw"
    [ "$(cat "$TMP/tailark-payload")" = "$(cat "$TMP/tailark-raw-rw")" ] \
      || { fail "tailark pin assertion: $name payload != raw@$TAILARK_BLOCKS_SHA after import rewrite — served payloads drifted from the pin; keeping previous copy"; return; }
  done

  # perplexity mark: dusk-footer-2 imports @/components/ui/svgs/perplexity but
  # NO registry item ships it (upstream gap) — vendor the raw file at the pin
  # so nothing dangles ("nothing silently vanishes").
  fetch "$raw/registry/core/ui/svgs/perplexity.tsx" "$stage/extra/svgs/perplexity.tsx" \
    || { fail "tailark extra perplexity.tsx fetch @ pin"; return; }
  grep -q "Perplexity" "$stage/extra/svgs/perplexity.tsx" \
    || { fail "tailark extra perplexity.tsx does not look like the Perplexity component"; return; }

  # license: upstream file is LICENCE.md (British spelling), MIT
  fetch "$raw/LICENCE.md" "$stage/LICENSE" || { fail "tailark LICENCE.md fetch @ pin"; return; }
  grep -q "MIT License" "$stage/LICENSE" \
    || { fail "tailark LICENSE no longer reads as MIT — STOP and re-audit before vendoring"; return; }

  # pin record — keeps the snapshot auditable offline
  jq -n --arg sha "$TAILARK_BLOCKS_SHA" --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson total "$total" --argjson vendored "$got" \
        '{repo: "github.com/tailark/blocks", base: "radix only", sha: $sha, synced_at: $date,
          registry_items: $total, vendored_payloads: $vendored, excluded_dupes: 5}' \
    > "$stage/PIN.json"

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Tailark: $got payloads ($bytes bytes) + registry + perplexity patch + LICENSE @ ${TAILARK_BLOCKS_SHA:0:12} (5 bundled dupes excluded; heavy-dep blocks flagged at index time)"
}

# ============================================================================
# ORIGIN FRAGMENT for scripts/sync.sh (Wave 2)
# Orchestrator integration:
#   1. Pin var (goes in the "Pinned versions" block at the top of sync.sh —
#      see pins.txt):
#        ORIGIN_COSS_SHA="3c6058e484e51e1fc14849c9b59a9cca6269c539"
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "origin"; case statement gains:  origin) sync_origin ;;
#   4. MANIFEST jq gains: --arg origin_coss "$ORIGIN_COSS_SHA" and
#      "origin_coss: $origin_coss" inside .pinned (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- Origin UI
# Application/form/data UI registry (legacy Origin UI, frozen post-acquisition
# snapshot inside the cosscom/coss monorepo — upstream still lands compile-keeping
# patches, e.g. 2026-05-08 "patch Next/React"). LICENSE BOUNDARY (judge mandate):
# ONLY apps/origin/ is MIT ("Originally Copyright (c) 2025 Origin UI") — the
# monorepo ROOT is AGPLv3, so vendoring anything outside apps/origin/ is a
# license breach. This function extracts four apps/origin paths and hard-fails
# unless the fetched apps/origin/LICENSE.md reads as MIT.
# Transport decision (harness-verified 2026-08-02): ONE codeload tarball at the
# pinned SHA (~2.3MB, 0.7s), NOT 646 per-item fetches from coss.com/origin/r/.
# The tarball is a single atomic transaction, SHA-consistent with registry.json
# (a per-item pull is unpinnable and can interleave with an upstream deploy),
# and the same transaction carries the 10 navbar-components helpers + LICENSE.md,
# which the live endpoint cannot serve (they are not registry items). Repo
# payloads verified byte-identical to coss.com serving (comp-542, 118,964 B both).
sync_origin() {
  local d="$VENDOR/origin"
  say "Origin UI: pinned cosscom/coss tarball → 646 payloads + navbar helpers (apps/origin only)"

  local tgz="$TMP/origin.tgz" ex="$TMP/origin-ex" root
  fetch "https://codeload.github.com/cosscom/coss/tar.gz/$ORIGIN_COSS_SHA" "$tgz" \
    || { fail "origin tarball fetch @ $ORIGIN_COSS_SHA (keeping previous copy)"; return; }
  rm -rf "$ex"; mkdir -p "$ex"
  # scoped extraction — apps/origin paths ONLY; AGPL-rooted files never touch the stage.
  # codeload roots the tarball at coss-<SHA>/, so exact prefixes work on BSD and GNU tar.
  tar -xzf "$tgz" -C "$ex" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/LICENSE.md" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/registry.json" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/public/r" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/registry/default/components/navbar-components" \
    || { fail "origin tarball extract (layout changed?) — keeping previous copy"; return; }
  root="$ex/coss-$ORIGIN_COSS_SHA/apps/origin"

  # LICENSE gate: apps/origin must be MIT; anything else means the subtree was
  # relicensed — STOP and re-audit, never vendor.
  grep -q "MIT License" "$root/LICENSE.md" \
    || { fail "origin apps/origin/LICENSE.md is not MIT — license boundary moved, refusing to vendor"; return; }

  # registry gates: the catalog is FROZEN at this SHA, so counts are EXACT
  # (646 = 600 component + 40 ui + 5 hook + 1 lib). Bumping ORIGIN_COSS_SHA is
  # a deliberate edit — re-verify these counts against the new registry then.
  local counts
  counts="$(jq -r '[(.items|length),
                    ([.items[]|select(.type=="registry:component")]|length),
                    ([.items[]|select(.type=="registry:ui")]|length),
                    ([.items[]|select(.type=="registry:hook")]|length),
                    ([.items[]|select(.type=="registry:lib")]|length)] | map(tostring) | join(" ")' \
             "$root/registry.json" 2>/dev/null)" \
    || { fail "origin registry.json did not parse — keeping previous copy"; return; }
  [ "$counts" = "646 600 40 5 1" ] \
    || { fail "origin registry gate: counts '$counts' != '646 600 40 5 1' — keeping previous copy"; return; }

  # payload gates: exactly 646 JSONs, all parse, every registry item has one, >=1.8MB total
  local n bytes
  n=$(ls "$root/public/r"/*.json 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -eq 646 ] \
    || { fail "origin payload gate: $n JSONs in public/r (want 646) — keeping previous copy"; return; }
  cat "$root/public/r"/*.json | jq -s 'length == 646' | grep -q true \
    || { fail "origin payload gate: payloads failed to parse as 646 JSON docs — keeping previous copy"; return; }
  bytes=$(find "$root/public/r" -name '*.json' -exec cat {} + | wc -c | tr -d ' ')
  [ "$bytes" -ge 1800000 ] \
    || { fail "origin payload gate: $bytes bytes total (<1.8MB floor; audit: ~2.18MB) — keeping previous copy"; return; }
  local unmatched
  unmatched="$(comm -23 <(jq -r '.items[].name' "$root/registry.json" | sort -u) \
                        <(ls "$root/public/r" | sed 's/\.json$//' | sort -u))"
  [ -z "$unmatched" ] \
    || { fail "origin payload gate: registry items missing payloads: $(echo "$unmatched" | tr '\n' ' ')"; return; }

  # closure gate (judge mandate): every registryDependencies URL in every payload
  # (absolute https://coss.com/origin/r/<name>.json form) must resolve to a LOCAL
  # payload by basename — this guarantees zero-network compiles for comp-542,
  # every navbar, every date picker. The 40 ui + 5 hooks + 1 lib are vendored
  # as ordinary payloads, so the closure is complete inside vendor/origin/r/.
  local missing_deps
  missing_deps="$(jq -r '.registryDependencies // [] | .[]' "$root/public/r"/*.json \
                   | sed 's|.*/||; s|\.json$||' | sort -u \
                   | comm -23 - <(ls "$root/public/r" | sed 's/\.json$//' | sort -u))"
  [ -z "$missing_deps" ] \
    || { fail "origin closure gate: registryDependencies without local payloads: $(echo "$missing_deps" | tr '\n' ' ')"; return; }

  # navbar helpers gate (judge mandate): the 20 navbar comps import these 10
  # files (logo, theme-toggle, user-menu, team-switcher, ...), which are NOT
  # registry items and ship in NO payload — without them every navbar item
  # fails to compile. Smallest upstream file is 963B, so 400B floor catches truncation.
  local nn f
  nn=$(ls "$root/registry/default/components/navbar-components"/*.tsx 2>/dev/null | wc -l | tr -d ' ')
  [ "$nn" -eq 10 ] \
    || { fail "origin navbar-helpers gate: $nn .tsx files (want 10) — keeping previous copy"; return; }
  for f in "$root/registry/default/components/navbar-components"/*.tsx; do
    [ "$(wc -c < "$f" | tr -d ' ')" -ge 400 ] \
      || { fail "origin navbar helper $(basename "$f") under 400B — truncated; keeping previous copy"; return; }
  done

  # all gates passed — stage, then atomic swap (a failed refresh keeps the previous copy)
  local stage="$TMP/origin-stage"
  rm -rf "$stage"; mkdir -p "$stage/r" "$stage/navbar-components"
  cp "$root/LICENSE.md" "$stage/LICENSE.md"
  cp "$root/registry.json" "$stage/registry.json"
  cp "$root/public/r"/*.json "$stage/r/"
  cp "$root/registry/default/components/navbar-components"/*.tsx "$stage/navbar-components/"
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Origin UI: 646 payloads ($bytes bytes) + 10 navbar helpers vendored @ ${ORIGIN_COSS_SHA:0:12} (apps/origin MIT subtree only)"
}

# ---------------------------------------------------------------- Fancy Components
# CURATED SUBSET ONLY — wild-tier physics/filter/path showpieces (8 items + 6
# support hooks/utils). The entire ~25-item fancy text tier is EXCLUDED BY
# DEFAULT: every fancy text effect lost its head-to-head source read against an
# existing vendored counterpart (scramble-hover is a strict feature subset of
# reactbits DecryptedText — same lineage, fewer triggers, worse state handling).
# A second, worse home for the same effect is a routing regression; any future
# fancy item enters ONLY after a documented source-level win over its closest
# components.tsv counterpart (adding-a-source.md step 3; law in sources/fancy.md).
#
# Vendored copies are a MAINTAINED FORK: four vendor-time patches below fix
# defects upstream still ships (each marked PATCHED(alex-style) in the payload).
# A raw re-fetch from the live site without the patches is a regression — that
# is why patch 1 rewrites registryDependencies to local paths: no agent or
# shadcn CLI may ever resolve against fancycomponents.dev.
#
# Fetch gotcha (verified): fancycomponents.dev 308-redirects /r/*.json to www.
# fetch()'s `curl -fsSL` includes -L and follows it — never swap in a bare curl
# without -L here.
sync_fancy() {
  local d="$VENDOR/fancy"
  say "Fancy Components: curated physics/filter/path subset — patched fork @ ${FANCY_COMMIT:0:7}"

  # Curation filter AS DATA — the only items allowed in. The components list
  # must mirror the FANCY_DESC map in build-catalogs.mjs (8 indexed rows).
  local components=(gravity cursor-attractor-and-gravity elastic-line
    gooey-svg-filter pixelate-svg-filter
    text-along-path element-along-svg-path marquee-along-svg-path)
  # Transitive registryDependencies closure (audited 2026-08): support files are
  # vendored so every payload resolves locally, but they are NOT index rows.
  local support=(calculate-position svg-path-to-vertices use-mouse-position-ref
    use-dimensions use-elastic-line-events use-mouse-position)

  # stage in $TMP; the live vendor dir is replaced only after every gate passes
  local stage="$TMP/fancy-stage"
  rm -rf "$stage"; mkdir -p "$stage/r"

  # LICENSE from the PINNED commit (registry JSON payloads carry no license text)
  fetch "https://raw.githubusercontent.com/danielpetho/fancy/$FANCY_COMMIT/LICENSE" "$stage/LICENSE" \
    || { fail "fancy LICENSE fetch at pinned commit"; return; }
  grep -q "MIT License" "$stage/LICENSE" \
    || { fail "fancy LICENSE is no longer MIT — STOP and re-audit before vendoring"; return; }

  local n
  for n in "${components[@]}" "${support[@]}"; do
    fetch "https://fancycomponents.dev/r/$n.json" "$stage/r/$n.json" \
      || { fail "fancy item $n fetch"; return; }
    # gate: parses as JSON, is the item we asked for, payload is not a stub
    jq -e --arg n "$n" '.name == $n and (.files[0].content | length >= 300)' "$stage/r/$n.json" > /dev/null \
      || { fail "fancy item $n: wrong/truncated payload (<300 chars or name mismatch) — keeping previous copy"; return; }
  done
  local count kb
  count=$(ls "$stage/r" | wc -l | tr -d ' ')
  kb=$(du -sk "$stage/r" | cut -f1)
  [ "$count" -eq 14 ] \
    || { fail "fancy: expected 14 item JSONs, got $count — keeping previous copy"; return; }
  [ "$kb" -ge 48 ] \
    || { fail "fancy: staged payloads are ${kb}KB (<48KB floor; last audit 104KB on disk) — keeping previous copy"; return; }

  # ---- vendor-time patches (maintained-fork mandate) ----
  local f
  # PATCH 1 — registryDependencies: absolute https://fancycomponents.dev/r/*.json
  # URLs -> local vendor/fancy/r/ paths. Live payloads are UNPATCHED; leaving the
  # URLs in would route agents/CLIs back to the defective upstream copies.
  # Every item (patched or not) also gets a _vendoredFrom provenance stamp so
  # build-catalogs.mjs can refuse to index a copy that bypassed this function.
  for f in "$stage/r"/*.json; do
    jq --arg commit "$FANCY_COMMIT" \
       '._vendoredFrom = "danielpetho/fancy@\($commit) via fancycomponents.dev/r — alex-style maintained fork (sync_fancy applies vendor-time patches); never re-fetch items from the live site"
        | if .registryDependencies then
            .registryDependencies |= map(sub("^https://(www\\.)?fancycomponents\\.dev/r/"; "vendor/fancy/r/"))
            | ._patches = ((._patches // []) + ["PATCHED(alex-style): registryDependencies rewritten to local vendor/fancy/r/ paths"])
          else . end' "$f" > "$f.patched" \
      || { fail "fancy patch 1 (registry deps) failed on $(basename "$f")"; return; }
    mv "$f.patched" "$f"
  done

  # PATCH 2 — missing "use client": all three path-following components use
  # React/motion hooks (useScroll/useRef/useState) but upstream omits the
  # directive — importing them from an RSC fails. scramble-hover HAS it; the
  # inconsistency is upstream's, confirmed at audit.
  for n in text-along-path element-along-svg-path marquee-along-svg-path; do
    f="$stage/r/$n.json"
    if jq -e '.files[0].content | startswith("\"use client\"")' "$f" > /dev/null; then
      warn "fancy $n: upstream now ships \"use client\" — patch 2 no-op (re-audit the other patches on next bump)"
      continue
    fi
    jq '.files[0].content |= ("\"use client\" // PATCHED(alex-style): directive missing upstream — component uses React/motion hooks and fails as an RSC import\n\n" + .)
        | ._patches = ((._patches // []) + ["PATCHED(alex-style): added missing use-client directive"])' \
      "$f" > "$f.patched" \
      || { fail "fancy patch 2 (use client) failed on $n"; return; }
    mv "$f.patched" "$f"
  done

  # PATCH 3 — require("poly-decomp") -> static ESM import. The CJS require in a
  # client component passes the build and then throws "require is not defined"
  # at RUNTIME on Vite/ESM stacks.
  # PATCH 4 — `import { debounce } from "lodash"` pulls full lodash for one
  # function -> lodash.debounce package (import AND dependencies[] rewritten;
  # .cancel() exists on lodash.debounce, used by the resize cleanup).
  for n in gravity cursor-attractor-and-gravity; do
    f="$stage/r/$n.json"
    # anchors must exist EXACTLY — if upstream moved them, refuse and re-audit
    # rather than silently vendoring a half-patched fork
    jq -e '.files[0].content | test("Common\\.setDecomp\\(require\\(\"poly-decomp\"\\)\\)") and test("import \\{ debounce \\} from \"lodash\"")' "$f" > /dev/null \
      || { fail "fancy $n: patch 3/4 anchors moved upstream — re-audit patches before vendoring; keeping previous copy"; return; }
    jq '.files[0].content |= (
          sub("^\"use client\"\n"; "\"use client\"\n\n// PATCHED(alex-style): the CJS require of poly-decomp breaks Vite/ESM at runtime — static import instead\n// @ts-ignore -- poly-decomp ships no type declarations\nimport decomp from \"poly-decomp\"\n")
          | sub("Common\\.setDecomp\\(require\\(\"poly-decomp\"\\)\\)"; "Common.setDecomp(decomp) // PATCHED(alex-style): was a CJS require of poly-decomp")
          | sub("import \\{ debounce \\} from \"lodash\""; "import debounce from \"lodash.debounce\" // PATCHED(alex-style): was a full-lodash import for one function")
        )
        | .dependencies |= map(if . == "lodash" then "lodash.debounce" else . end)
        | ._patches = ((._patches // []) + ["PATCHED(alex-style): poly-decomp require -> ESM import", "PATCHED(alex-style): lodash -> lodash.debounce (import + dependencies)"])' \
      "$f" > "$f.patched" \
      || { fail "fancy patches 3/4 failed on $n"; return; }
    mv "$f.patched" "$f"
  done

  # ---- post-patch verification gates (all fail-loud, previous copy kept) ----
  for n in gravity cursor-attractor-and-gravity; do
    f="$stage/r/$n.json"
    jq -r '.files[0].content' "$f" | grep -qF 'require(' \
      && { fail "fancy $n: require() still present after patch 3"; return; }
    jq -r '.files[0].content' "$f" | grep -qF 'import decomp from "poly-decomp"' \
      || { fail "fancy $n: poly-decomp ESM import missing after patch 3"; return; }
    jq -r '.files[0].content' "$f" | grep -qF 'from "lodash"' \
      && { fail "fancy $n: full-lodash import still present after patch 4"; return; }
    jq -e '(.dependencies | index("lodash")) == null and (.dependencies | index("lodash.debounce")) != null' "$f" > /dev/null \
      || { fail "fancy $n: dependencies[] not rewritten to lodash.debounce"; return; }
  done
  for n in text-along-path element-along-svg-path marquee-along-svg-path; do
    jq -e '.files[0].content | startswith("\"use client\"")' "$stage/r/$n.json" > /dev/null \
      || { fail "fancy $n: use-client directive missing after patch 2"; return; }
  done
  local dep
  for f in "$stage/r"/*.json; do
    # no payload may still reference the live site…
    jq -e '[(.registryDependencies // [])[] | select(test("fancycomponents"))] | length == 0' "$f" > /dev/null \
      || { fail "fancy: $(basename "$f") registryDependencies still reference the live site after patch 1"; return; }
    # …and every local dep must exist in the curated closure (catches upstream
    # adding a new registryDependency the support list doesn't cover yet)
    for dep in $(jq -r '(.registryDependencies // [])[]' "$f"); do
      [ -f "$stage/r/$(basename "$dep")" ] \
        || { fail "fancy: $(basename "$f") needs $(basename "$dep") — outside the curated closure; update the support list deliberately"; return; }
    done
  done

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Fancy: $count curated item JSONs (${kb}KB) + MIT LICENSE vendored — patched fork pinned to danielpetho/fancy@${FANCY_COMMIT:0:7}"
}

# ---------------------------------------------------------------- Atropos
# Layered 3D hover-depth SCENES (per-layer [data-atropos-offset] translate
# planes + projected shadow + moving highlight sweep) — a different GENRE from
# single-plane tilt, which keeps routing to reactbits TiltedCard /
# motion-primitives tilt (class law in sources/atropos.md).
#
# CURATION ALLOWLIST AS DATA (judge mandate): exactly 15 files from package/,
# each with an EXACT byte pin. The npm tarball at a pinned version is immutable
# (registry policy forbids republish), so ANY size drift means a republished or
# foreign artifact — fail loud, keep the previous copy. Everything not named is
# STRUCTURALLY excluded: *.map (4 files, ~122KB dead weight), *.scss/*.less
# (source styles), atropos-element.js/.min.js (UMD element builds — the .mjs
# pair is kept), and any stray artifact. The round-2 audit reported a stray
# 572KB axe.min.js inside the upstream tarball; the registry tarball at
# dist.shasum 8024e84 (re-verified 2026-08-03) does NOT contain it — either
# way the allowlist makes the exclusion structural: nothing outside the 15 can
# ever land.
#
# Upstream is FEATURE-FROZEN (last feature release 2023-07; zero runtime deps
# at all 23 published versions, so no silent version floor is possible; repo
# alive, 482-line core we can patch in-vendor if a browser change ever bites).
# Bumping ATROPOS_VERSION is a deliberate edit: re-run the adding-a-source
# audit and re-pin the sha1 + all 15 byte sizes below.
sync_atropos() {
  local d="$VENDOR/atropos"
  say "Atropos: layered 3D hover scenes — pinned npm tarball @ $ATROPOS_VERSION (15-file allowlist)"

  # allowlist as data: <file> <exact bytes at 2.0.2>, verified against the
  # registry tarball at dist.shasum $ATROPOS_TARBALL_SHA1 on 2026-08-03
  local allow="atropos.mjs 16428
atropos.min.mjs 7015
atropos.js 17374
atropos.min.js 6925
atropos-react.mjs 4772
atropos-element.mjs 19005
atropos-element.min.mjs 9575
atropos.css 1957
atropos.min.css 1666
atropos.d.ts 932
atropos-react.d.ts 528
atropos-element.d.ts 1526
LICENSE 1077
README.md 304
package.json 1660"

  local tgz="$TMP/atropos.tgz" ex="$TMP/atropos-ex"
  fetch "https://registry.npmjs.org/atropos/-/atropos-$ATROPOS_VERSION.tgz" "$tgz" \
    || { fail "atropos tarball fetch @ $ATROPOS_VERSION (keeping previous copy)"; return; }

  # integrity gate: npm dist.shasum (sha1) is immutable at a pinned version —
  # a mismatch is a republished/tampered artifact, never vendor it. Tool is
  # best-effort portable (shasum on macOS, sha1sum on Linux); when neither
  # exists the per-file byte pins below still catch drift.
  local sha=""
  if command -v shasum >/dev/null 2>&1; then sha="$(shasum -a 1 "$tgz" | awk '{print $1}')"
  elif command -v sha1sum >/dev/null 2>&1; then sha="$(sha1sum "$tgz" | awk '{print $1}')"
  fi
  if [ -n "$sha" ] && [ "$sha" != "$ATROPOS_TARBALL_SHA1" ]; then
    fail "atropos tarball sha1 $sha != pinned $ATROPOS_TARBALL_SHA1 — republished/foreign artifact, refusing to vendor"
    return
  fi
  [ -n "$sha" ] || warn "atropos: no shasum/sha1sum on PATH — relying on per-file byte pins only"

  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "atropos tarball extract — keeping previous copy"; return; }

  # identity gates from the artifact itself: pinned version, MIT in
  # package.json AND in the LICENSE text, and the zero-dep invariant (held
  # across all 23 published versions at audit — a new runtime dep means the
  # library changed shape: re-audit, never auto-vendor)
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$ex/package/package.json")" \
    || { fail "atropos package.json parse — keeping previous copy"; return; }
  got_license="$(jq -r '.license // empty' "$ex/package/package.json")"
  [ "$got_version" = "$ATROPOS_VERSION" ] \
    || { fail "atropos version mismatch: tarball says '$got_version', pinned $ATROPOS_VERSION — keeping previous copy"; return; }
  [ "$got_license" = "MIT" ] \
    || { fail "atropos license is '$got_license', expected MIT — refusing to vendor"; return; }
  grep -q "MIT License" "$ex/package/LICENSE" \
    || { fail "atropos LICENSE text is not the MIT License — refusing to vendor"; return; }
  jq -e '(.dependencies // {}) | length == 0' "$ex/package/package.json" > /dev/null \
    || { fail "atropos grew runtime dependencies — re-audit before vendoring; keeping previous copy"; return; }

  # stage EXACTLY the allowlist — per-file existence + exact byte pins
  local stage="$TMP/atropos-stage" name bytes actual
  rm -rf "$stage"; mkdir -p "$stage"
  while read -r name bytes; do
    [ -f "$ex/package/$name" ] \
      || { fail "atropos: allowlisted file $name missing from tarball — keeping previous copy"; return; }
    actual=$(wc -c < "$ex/package/$name" | tr -d ' ')
    [ "$actual" -eq "$bytes" ] \
      || { fail "atropos: $name is $actual bytes, pinned $bytes — tarball drifted from the audited artifact; keeping previous copy"; return; }
    cp "$ex/package/$name" "$stage/$name" \
      || { fail "atropos: copy of $name failed — keeping previous copy"; return; }
  done <<< "$allow"

  # count + envelope gates (judge mandate: exactly 15 files, total under 200KB)
  local n total
  n=$(ls "$stage" | wc -l | tr -d ' ')
  [ "$n" -eq 15 ] \
    || { fail "atropos: staged $n files != 15 allowlisted — keeping previous copy"; return; }
  total=$(find "$stage" -type f -exec cat {} + | wc -c | tr -d ' ')
  { [ "$total" -ge 80000 ] && [ "$total" -lt 200000 ]; } \
    || { fail "atropos: staged total $total bytes outside the 80000-200000 envelope (audit: 90,744) — keeping previous copy"; return; }

  # PIN.json — the per-file byte manifest (auditable offline; the arsenal
  # self-test asserts version/count against it). NOTE: files_json is built in
  # a separate ASSIGNMENT on purpose — macOS bash 3.2 mis-parses a nested
  # single-quoted awk/jq program inside an argument-position "$(...)" (brace
  # expansion fires inside the quoted program); assignment position is safe.
  local files_json
  files_json="$(cd "$stage" && wc -c -- * | awk '$2 != "total" {print $2, $1}' \
    | jq -Rn '[inputs | split(" ") | {name: .[0], bytes: (.[1] | tonumber)}] | sort_by(.name)')" \
    || { fail "atropos PIN.json byte listing failed — keeping previous copy"; return; }
  jq -n --arg version "$ATROPOS_VERSION" --arg sha1 "$ATROPOS_TARBALL_SHA1" \
        --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson files "$files_json" \
        '{package: "atropos", version: $version, tarball_sha1: $sha1, synced_at: $date,
          allowlist_files: ($files | length), total_bytes: ([$files[].bytes] | add), files: $files,
          excluded: "everything not in files[] — *.map, *.scss, *.less, atropos-element(.min).js UMD builds, and any stray artifact (round-2 audit reported a 572KB axe.min.js; the registry tarball at this sha1 has none — the allowlist makes the exclusion structural either way)"}' \
    > "$stage/PIN.json" \
    || { fail "atropos PIN.json write failed — keeping previous copy"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Atropos: 15 files ($total bytes) + PIN.json vendored @ $ATROPOS_VERSION — layered-scene class only; card law: reduced-motion gate + rotateTouch:'scroll-y' (sources/atropos.md)"
}

# ---------------------------------------------------------------- curtains.js
# DOM-synced WebGL planes — page-flow <img>/<video>/<canvas> elements become
# distortable WebGL planes (scroll-bend, hover ripple, gallery morph: the
# signature award-site class). FIRST and ONLY routing answer for this class;
# gpu-curtains (same author, WebGPU-only, no fallback) is WATCH-LIST ONLY in
# sources/curtains.md — never vendor it as a peer (judge mandate: ~18% of
# visitors would get a blank canvas; re-audit ~2027 as slot SUCCESSOR).
# Upstream is maintenance-mode, FROZEN at 8.1.6 (author's energy on
# gpu-curtains): pin exact, expect no releases — a pin bump here is itself a
# re-audit trigger. The repo has NO git tags, so docs/examples pin a COMMIT SHA
# and this function cross-checks that commit's package.json against the npm pin.
# Two transports, both immutable at their pins:
#   1. npm tarball curtainsjs@$CURTAINS_VERSION -> dist (UMD zero-build) +
#      src ESM tree + LICENSE (npm consumption is ESM-only: no CJS build)
#   2. codeload tarball @ $CURTAINS_COMMIT -> documentation/*.html + the 10
#      audited example dirs (examples/tests + shared examples/medias/ heavy
#      media never touch the stage — scoped extraction)
# THIRD-PARTY STRIP (BLOCKING, judge mandate): the custom-scroll example bundles
# locomotive-scroll.min.js/.css — arsenal law is ONE smoothing layer (lenis);
# sources/curtains.md ships the lenis wiring as THE canonical custom-scroll
# pattern, superseding the example. The gsap gallery example bundles a stale
# gsap.min.js — a second, staler home for an arsenal source (GSAP routes via
# vendor/gsap pins). All three are deleted at stage time and gated absent.
sync_curtains() {
  local d="$VENDOR/curtains"
  say "curtains.js: npm dist+src @ $CURTAINS_VERSION + docs/examples @ ${CURTAINS_COMMIT:0:7} (locomotive/gsap dupes stripped)"

  # Curation filter AS DATA — the 10 audited example dirs; nothing else from examples/.
  local example_dirs=(basic-plane simple-video-plane multiple-textures
    multiple-planes-scroll-effect multiple-planes-scroll-effect-custom-scroll
    post-processing-scroll-effect post-processing-displacement
    ping-pong-shading-flowmap gsap-click-to-fullscreen-gallery
    plane-properties-transforms-cheat-sheet)
  # Third-party runtime dupes that must never enter the vendor tree (see header).
  local strip_names=(locomotive-scroll.min.js locomotive-scroll.min.css gsap.min.js)

  local stage="$TMP/curtains-stage"
  rm -rf "$stage"; mkdir -p "$stage"

  # ---- transport 1: npm tarball (dist + src + LICENSE) ----
  fetch "https://registry.npmjs.org/curtainsjs/-/curtainsjs-$CURTAINS_VERSION.tgz" "$TMP/curtains.tgz" \
    || { fail "curtains npm tarball fetch @ $CURTAINS_VERSION (keeping previous copy)"; return; }
  rm -rf "$TMP/curtains-pkg"; mkdir -p "$TMP/curtains-pkg"
  tar -xzf "$TMP/curtains.tgz" -C "$TMP/curtains-pkg" \
    || { fail "curtains npm tarball extract (keeping previous copy)"; return; }
  local pkg="$TMP/curtains-pkg/package"

  # version + license gates from the tarball's own package.json
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$pkg/package.json")" \
    || { fail "curtains package.json parse"; return; }
  got_license="$(jq -r '.license // empty' "$pkg/package.json")"
  [ "$got_version" = "$CURTAINS_VERSION" ] \
    || { fail "curtains version mismatch: tarball says '$got_version', pinned $CURTAINS_VERSION"; return; }
  [ "$got_license" = "MIT" ] \
    || { fail "curtains license is '$got_license', expected MIT — refusing to vendor"; return; }
  grep -q "MIT License" "$pkg/LICENSE.txt" \
    || { fail "curtains LICENSE.txt is not the MIT text — refusing to vendor"; return; }

  # dist gates: the npm tarball is immutable at the pin, so the audited UMD byte
  # size is EXACT (125,310 B — audit 2026-08); any other number is a wrong or
  # tampered artifact, not drift.
  local minb umdb nsrc srcb
  minb=$(wc -c < "$pkg/dist/curtains.umd.min.js" 2>/dev/null | tr -d ' ')
  umdb=$(wc -c < "$pkg/dist/curtains.umd.js" 2>/dev/null | tr -d ' ')
  [ "${minb:-0}" -eq 125310 ] \
    || { fail "curtains dist gate: curtains.umd.min.js is ${minb:-0} bytes (audited exact: 125310) — keeping previous copy"; return; }
  [ "${umdb:-0}" -ge 300000 ] \
    || { fail "curtains dist gate: curtains.umd.js ${umdb:-0} bytes (<300KB floor; audit: 355,786) — keeping previous copy"; return; }
  nsrc=$(find "$pkg/src" -type f | wc -l | tr -d ' ')
  srcb=$(find "$pkg/src" -type f -exec cat {} + | wc -c | tr -d ' ')
  { [ "$nsrc" -eq 34 ] && [ "$srcb" -ge 300000 ]; } \
    || { fail "curtains src gate: $nsrc files / $srcb bytes (want 34 / >=300000) — keeping previous copy"; return; }
  [ -f "$pkg/src/index.mjs" ] \
    || { fail "curtains src/index.mjs missing — it is the ONLY npm entry (package is ESM-only)"; return; }

  mkdir -p "$stage/dist"
  cp "$pkg/dist/curtains.umd.min.js" "$pkg/dist/curtains.umd.js" "$stage/dist/" \
    || { fail "curtains dist copy"; return; }
  cp -R "$pkg/src" "$stage/src"
  cp "$pkg/LICENSE.txt" "$stage/LICENSE.txt"
  cp "$pkg/README.md" "$stage/README.md" 2>/dev/null || warn "curtains README miss (non-fatal)"
  cp "$pkg/CHANGELOG.md" "$stage/CHANGELOG.md" 2>/dev/null || warn "curtains CHANGELOG miss (non-fatal)"
  cp "$pkg/package.json" "$stage/package.json"   # keeps version+license auditable offline

  # ---- transport 2: repo tarball at the pinned commit (docs + examples) ----
  local rtgz="$TMP/curtains-repo.tgz" rex="$TMP/curtains-repo" root e
  fetch "https://codeload.github.com/martinlaxenaire/curtainsjs/tar.gz/$CURTAINS_COMMIT" "$rtgz" \
    || { fail "curtains repo tarball fetch @ $CURTAINS_COMMIT (keeping previous copy)"; return; }
  rm -rf "$rex"; mkdir -p "$rex"
  # scoped extraction — documentation + the 10 audited example dirs + package.json;
  # the shared examples/medias/ tree (heavy video/images) never touches the stage
  local paths=("curtainsjs-$CURTAINS_COMMIT/package.json" "curtainsjs-$CURTAINS_COMMIT/documentation")
  for e in "${example_dirs[@]}"; do paths+=("curtainsjs-$CURTAINS_COMMIT/examples/$e"); done
  tar -xzf "$rtgz" -C "$rex" "${paths[@]}" \
    || { fail "curtains repo tarball extract (layout changed?) — keeping previous copy"; return; }
  root="$rex/curtainsjs-$CURTAINS_COMMIT"

  # cross-transport pin gate: the repo has no tags, so THIS is what makes the
  # SHA a version pin — docs/examples must be the same release as the npm dist.
  [ "$(jq -r '.version // empty' "$root/package.json")" = "$CURTAINS_VERSION" ] \
    || { fail "curtains commit pin gate: repo package.json @ ${CURTAINS_COMMIT:0:7} is not $CURTAINS_VERSION — docs would not match dist; keeping previous copy"; return; }

  # documentation: *.html ONLY (grep-only surface per SKILL.md token discipline).
  # documentation/{images,js} are ~7MB of site chrome — heavy-media mandate, never vendored.
  mkdir -p "$stage/documentation"
  cp "$root/documentation/"*.html "$stage/documentation/" \
    || { fail "curtains documentation html copy — keeping previous copy"; return; }
  local ndocs pcb
  ndocs=$(ls "$stage/documentation" | grep -c '\.html$' || true)
  [ "${ndocs:-0}" -eq 18 ] \
    || { fail "curtains docs gate: ${ndocs:-0} html pages (want exactly 18 @ this pin) — keeping previous copy"; return; }
  pcb=$(wc -c < "$stage/documentation/plane-class.html" 2>/dev/null | tr -d ' ')
  [ "${pcb:-0}" -ge 150000 ] \
    || { fail "curtains docs gate: plane-class.html ${pcb:-0} bytes (<150KB floor; audit: 172,480) — keeping previous copy"; return; }
  [ -f "$stage/documentation/get-started.html" ] \
    || { fail "curtains docs gate: get-started.html missing — keeping previous copy"; return; }

  # examples: copy the 10 audited dirs, strip the third-party dupes, gate the strip
  mkdir -p "$stage/examples"
  for e in "${example_dirs[@]}"; do
    [ -d "$root/examples/$e" ] \
      || { fail "curtains example dir $e missing @ pin — keeping previous copy"; return; }
    cp -R "$root/examples/$e" "$stage/examples/$e"
    [ -f "$stage/examples/$e/index.html" ] \
      || { fail "curtains example $e has no index.html — keeping previous copy"; return; }
  done
  local n
  for n in "${strip_names[@]}"; do
    find "$stage/examples" -name "$n" -type f -delete
  done
  # post-strip gates: no third-party runtime dupe and no heavy media may remain
  [ -z "$(find "$stage" \( -name 'locomotive-scroll*' -o -name 'gsap.min.js' \) -type f)" ] \
    || { fail "curtains strip gate: third-party runtime dupes survived the strip — keeping previous copy"; return; }
  [ -z "$(find "$stage" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.avif' -o -iname '*.mp4' -o -iname '*.webm' -o -iname '*.mov' \))" ] \
    || { fail "curtains media gate: heavy media leaked into the stage — keeping previous copy"; return; }
  local nex
  nex=$(find "$stage/examples" -type f ! -name 'VENDOR-NOTE.md' | wc -l | tr -d ' ')
  [ "$nex" -eq 28 ] \
    || { fail "curtains examples gate: $nex files after strip (want exactly 28 @ this pin) — keeping previous copy"; return; }
  # the custom-scroll setup JS anchors the card's canonical lenis translation
  grep -q "updateScrollValues" "$stage/examples/multiple-planes-scroll-effect-custom-scroll/js/multiple.planes.parallax.setup.js" \
    || { fail "curtains anchor gate: updateScrollValues wiring missing from custom-scroll example — keeping previous copy"; return; }

  # breadcrumb so nobody "fixes" the stripped examples by re-fetching the dupes
  cat > "$stage/examples/VENDOR-NOTE.md" <<'NOTE'
# Stripped third-party runtimes (alex-style vendor law)

sync_curtains deletes three bundled files from these examples at sync time:

- `multiple-planes-scroll-effect-custom-scroll/js/locomotive-scroll.min.js`
- `multiple-planes-scroll-effect-custom-scroll/locomotive-scroll.min.css`
- `gsap-click-to-fullscreen-gallery/js/gsap.min.js`

Locomotive-scroll: the arsenal allows ONE smoothing layer — lenis. The lenis
wiring in `sources/curtains.md` (custom-scroll recipe) SUPERSEDES this
example's locomotive setup 1:1 (`watchScroll: false` + `lenis.on('scroll')` ->
`curtains.updateScrollValues()` + `curtains.needRender()`).
gsap.min.js: a stale bundled copy of an arsenal source — load GSAP per
`sources/gsap.md` instead.

The examples are reference reading, not runnable-as-is; never re-fetch the
stripped files from upstream.
NOTE

  # all gates passed — atomic swap (a failed refresh keeps the previous copy)
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "curtains: dist ($minb + $umdb B) + $nsrc src files + $ndocs doc pages + $nex example files vendored @ $CURTAINS_VERSION / ${CURTAINS_COMMIT:0:7}"
}

# ============================================================================
# MODEL-VIEWER FRAGMENT for scripts/sync.sh (Wave 3)
# Orchestrator integration:
#   1. Pin var (goes in the "Pinned versions" block at the top of sync.sh —
#      see pins.txt):
#        MODEL_VIEWER_VERSION="4.3.1"
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "model-viewer"; case statement gains:
#        model-viewer)       sync_model_viewer ;;
#   4. MANIFEST jq gains: --arg model_viewer "$MODEL_VIEWER_VERSION" and
#      "model_viewer: $model_viewer" inside .pinned (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- model-viewer
# Zero-build 3D display slot: Google's <model-viewer> custom element — one
# script tag + one HTML tag gives camera-orbit glTF display with poster
# fallback (class 3d-model-viewer; disjoint from webgl-background routing).
# CURATION FILTER AS DATA (audit 2026-08): vendor EXACTLY 4 files from the
# pinned npm tarball, byte-pinned below —
#   dist/model-viewer.min.js          1,068,903 B  PRIMARY self-contained ESM:
#       bundles its OWN three (grep 'from"three"' = 0 imports) — structurally
#       immune to the arsenal's r134-class version traps
#   dist/model-viewer-module.min.js     475,096 B  imports EXTERNAL bare three
#       (peer ^0.183) — NAMED TRAP, card scopes it; must NEVER share a bundle
#       or island with vanta's pinned r134
#   dist/model-viewer.d.ts               89,180 B  attribute/property API index
#   LICENSE                              11,358 B  Apache-2.0 text
# EXCLUDED as data: all *.map files; both UMD variants (module script tags are
# baseline in 2026 — UMD adds ~2MB for no slot); lib/ + src/ trees; the gstatic
# draco/basis decoders (NOT npm files — model-viewer runtime-fetches them from
#   https://www.gstatic.com/draco/versioned/decoders/1.5.6/ and
#   https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/
# only when a model is draco/ktx2-compressed; the dracoDecoderLocation/
# ktx2TranscoderLocation self-host hooks are recorded in sources/model-viewer.md
# so that dependency can never become invisible).
# Byte sizes are EXACT pins: the 4.3.1 tarball is immutable, so any drift means
# a wrong/tampered artifact — fail loud, keep the previous copy. Bumping
# MODEL_VIEWER_VERSION is a deliberate edit: re-record all four byte pins and
# re-run the audit greps (self-contained check, THREE-global check) first.
sync_model_viewer() {
  local d="$VENDOR/model-viewer"
  say "model-viewer: @google/model-viewer $MODEL_VIEWER_VERSION — 4-file allowlist (self-contained + module builds)"

  fetch "https://registry.npmjs.org/@google/model-viewer/-/model-viewer-$MODEL_VIEWER_VERSION.tgz" \
    "$TMP/model-viewer.tgz" \
    || { fail "model-viewer tarball fetch @ $MODEL_VIEWER_VERSION (keeping previous copy)"; return; }
  local ex="$TMP/model-viewer-ex"
  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$TMP/model-viewer.tgz" -C "$ex" \
    package/package.json package/LICENSE package/dist/model-viewer.min.js \
    package/dist/model-viewer-module.min.js package/dist/model-viewer.d.ts \
    || { fail "model-viewer tarball extract (layout changed?) — keeping previous copy"; return; }
  local pkg="$ex/package"

  # identity gates: the tarball must BE the pinned version and BE Apache-2.0,
  # from its own package.json AND the license text itself
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$pkg/package.json")" \
    || { fail "model-viewer package.json parse — keeping previous copy"; return; }
  got_license="$(jq -r '.license // empty' "$pkg/package.json")"
  [ "$got_version" = "$MODEL_VIEWER_VERSION" ] \
    || { fail "model-viewer version mismatch: tarball says '$got_version', pinned $MODEL_VIEWER_VERSION — keeping previous copy"; return; }
  [ "$got_license" = "Apache-2.0" ] \
    || { fail "model-viewer license is '$got_license', expected Apache-2.0 — refusing to vendor"; return; }
  grep -q "Apache License" "$pkg/LICENSE" \
    || { fail "model-viewer LICENSE text is not the Apache License — refusing to vendor"; return; }

  # byte pins — exact per-file sizes at the immutable 4.3.1 tarball, plus the
  # ~1.5MB+ bundle floor as a belt-and-braces total
  local spec f want got total=0
  for spec in "dist/model-viewer.min.js:1068903" \
              "dist/model-viewer-module.min.js:475096" \
              "dist/model-viewer.d.ts:89180" \
              "LICENSE:11358"; do
    f="${spec%%:*}"; want="${spec##*:}"
    got="$(wc -c < "$pkg/$f" | tr -d ' ')"
    [ "$got" -eq "$want" ] \
      || { fail "model-viewer byte-pin miss: $f is $got bytes, pinned $want — wrong artifact; keeping previous copy"; return; }
    total=$((total + got))
  done
  [ "$total" -ge 1500000 ] \
    || { fail "model-viewer bundle floor: $total bytes total (<1.5MB) — keeping previous copy"; return; }

  # structural gates (the audit's r134-immunity facts, asserted every sync):
  # PRIMARY build must be self-contained (zero external three imports), the
  # module build must be the external-three variant (so the named trap stays
  # detectable), the custom element must be defined, and neither build may
  # write a THREE global (collision-free beside vanta's pinned r134).
  grep -q 'from"three"' "$pkg/dist/model-viewer.min.js" \
    && { fail "model-viewer.min.js imports external three — not the self-contained build; re-audit before vendoring"; return; }
  grep -q 'from"three"' "$pkg/dist/model-viewer-module.min.js" \
    || { fail "model-viewer-module.min.js has no external three import — wrong artifact; keeping previous copy"; return; }
  grep -q 'customElements.define' "$pkg/dist/model-viewer.min.js" \
    || { fail "model-viewer.min.js does not define a custom element — wrong artifact; keeping previous copy"; return; }
  grep -Eq 'window\.THREE|globalThis\.THREE' "$pkg/dist/model-viewer.min.js" "$pkg/dist/model-viewer-module.min.js" \
    && { fail "model-viewer build writes a THREE global (audit had zero) — vanta co-load guarantee broken; re-audit"; return; }

  # all gates passed — stage, then atomic swap (a failed refresh keeps the previous copy)
  local stage="$TMP/model-viewer-stage"
  rm -rf "$stage"; mkdir -p "$stage/dist"
  cp "$pkg/dist/model-viewer.min.js" "$pkg/dist/model-viewer-module.min.js" \
     "$pkg/dist/model-viewer.d.ts" "$stage/dist/" \
    || { fail "model-viewer dist copy"; return; }
  cp "$pkg/LICENSE" "$stage/LICENSE" || { fail "model-viewer LICENSE copy"; return; }
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "model-viewer: 4-file allowlist vendored @ $MODEL_VIEWER_VERSION ($total bytes; self-contained build verified import-free)"
}

# ============================================================================
# ASSETS-3D FRAGMENT for scripts/sync.sh (Wave 3)
# Orchestrator integration:
#   1. Pin vars (go in the "Pinned versions" block at the top of sync.sh —
#      see pins.txt): ASSETS3D_VENICE_BYTES, ASSETS3D_STUDIO_BYTES,
#      KHRONOS_GLTF_SHA, ASSETS3D_SHEENCHAIR_BYTES, ASSETS3D_TOYCAR_BYTES.
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "assets-3d"; case statement gains:
#        assets-3d)          sync_assets_3d ;;
#   4. MANIFEST jq gains: --arg khronos_gltf "$KHRONOS_GLTF_SHA" and
#      "khronos_gltf: $khronos_gltf" inside .pinned (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- 3D Asset Shelf
# Poly Haven 1K HDRIs (CC0) + Khronos glTF per-model license evidence.
# HDRI TIER BY DEFAULT (judge-approved 3.1MB): image-based lighting is the
# difference between product-grade 3D and gray primitives — these two .hdr files
# feed model-viewer environment-image, drei <Environment files=>, and any
# three/OGL/curtains scene via RGBELoader.
# The 12.7MB CORE TIER (SheenChair.glb + ToyCar.glb placeholder models) needs
# SEPARATE OWNER SIGN-OFF: it syncs ONLY with ASSETS3D_TIER=core — or
# automatically once a signed-off core tier already exists on disk (a landed
# sign-off is sticky; a default re-sync must never silently delete vendored glbs).
#
# LICENSE MODEL (audit-verified 2026-08-03):
#  - Poly Haven: site-wide + page-level CC0 ("CC0 means absolute freedom",
#    Public Domain; both asset pages tag cc0). No attribution required —
#    provenance is recorded anyway in assets.tsv + LICENSE-NOTICE.md (audit trail).
#  - KhronosGroup/glTF-Sample-Assets has NO top-level license (GitHub API
#    license: null) — per-model metadata.json legal[] arrays ARE the license.
#    RULE: a model enters the shelf ONLY if EVERY legal[] entry is CC0 (the
#    metadata uses the string "CC0" with the CC0 1.0 legalcode URL — the gate
#    checks both; note this is NOT the SPDX id "CC0-1.0"). DamagedHelmet stays
#    excluded: its legal[] carries a CC-BY-NC entry (NC-tainted composite).
#    The CC0 gate runs at EVERY tier so the vendored evidence can never go
#    stale against a moved pin.
#
# Byte pins are the content gate: assets are immutable files, so ANY size drift
# means upstream swapped content — fail loud, keep previous copy, re-audit.
# Sync stays curl-only by mandate: NO gltf-transform/meshopt optimization in the
# sync path (documented future option in sources/assets-3d.md).
sync_assets_3d() {
  local d="$VENDOR/assets-3d"
  local tier="${ASSETS3D_TIER:-hdri}"
  # sticky sign-off: an existing core tier is never silently dropped by a default re-sync
  if [ "$tier" != "core" ] && ls "$d/models/"*.glb >/dev/null 2>&1; then
    tier="core"
    say "assets-3d: existing core tier detected — re-syncing glbs too (sign-off is sticky)"
  fi
  say "3D asset shelf [$tier tier]: Poly Haven 1K HDRIs (CC0) + Khronos license evidence @ ${KHRONOS_GLTF_SHA:0:12}"

  local stage="$TMP/assets3d-stage"
  rm -rf "$stage"; mkdir -p "$stage/hdri" "$stage/models"

  # -- HDRIs: fetch + exact byte pin + Radiance magic. dl.polyhaven.org URL
  #    scheme verified 2026-08-03 (HTTP 200, content-type image/vnd.radiance).
  local entry name want got
  for entry in "venice_sunset_1k.hdr $ASSETS3D_VENICE_BYTES" \
               "studio_small_03_1k.hdr $ASSETS3D_STUDIO_BYTES"; do
    name="${entry%% *}"; want="${entry##* }"
    fetch "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/$name" "$stage/hdri/$name" \
      || { fail "assets-3d hdri $name fetch — keeping previous copy"; return; }
    got=$(wc -c < "$stage/hdri/$name" | tr -d ' ')
    [ "$got" -eq "$want" ] \
      || { fail "assets-3d $name byte pin: got $got want $want — upstream content drifted; re-audit before bumping the pin (keeping previous copy)"; return; }
    head -c 10 "$stage/hdri/$name" | grep -q '#?RADIANCE' \
      || { fail "assets-3d $name is not a Radiance .hdr (magic header missing) — keeping previous copy"; return; }
  done

  # -- Khronos license evidence: metadata.json at the PIN for both core-tier
  #    models; all-CC0 gate runs regardless of tier (evidence IS the license).
  local m
  for m in SheenChair ToyCar; do
    fetch "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/$KHRONOS_GLTF_SHA/Models/$m/metadata.json" \
      "$stage/models/$m.metadata.json" \
      || { fail "assets-3d $m metadata.json fetch @ pin — keeping previous copy"; return; }
    jq -e '(.legal | length) >= 1 and ([.legal[] | .license == "CC0" and ((.licenseUrl // "") | test("publicdomain/zero/1\\.0"))] | all)' \
      "$stage/models/$m.metadata.json" > /dev/null \
      || { fail "assets-3d $m legal[] is no longer all-CC0 — license moved upstream, the model may NOT sit on the shelf; keeping previous copy"; return; }
  done

  # -- core tier (OWNER SIGN-OFF ONLY): glbs + byte pins; metadata.json is
  #    already adjacent in models/ (audit mandate: per-file provenance IS the
  #    license, so it travels NEXT TO every glb).
  local glb_status="core-tier-pending-signoff"
  if [ "$tier" = "core" ]; then
    glb_status="vendored"
    for entry in "SheenChair $ASSETS3D_SHEENCHAIR_BYTES" "ToyCar $ASSETS3D_TOYCAR_BYTES"; do
      m="${entry%% *}"; want="${entry##* }"
      fetch "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/$KHRONOS_GLTF_SHA/Models/$m/glTF-Binary/$m.glb" \
        "$stage/models/$m.glb" \
        || { fail "assets-3d $m.glb fetch @ pin — keeping previous copy"; return; }
      got=$(wc -c < "$stage/models/$m.glb" | tr -d ' ')
      [ "$got" -eq "$want" ] \
        || { fail "assets-3d $m.glb byte pin: got $got want $want — keeping previous copy"; return; }
      head -c 4 "$stage/models/$m.glb" | grep -q 'glTF' \
        || { fail "assets-3d $m.glb is not binary glTF (magic missing) — keeping previous copy"; return; }
    done
  fi

  # -- assets.tsv — the curation filter AS DATA (adding-a-source.md #9), incl.
  #    evidence-backed EXCLUSION rows so no future sweep re-includes them by
  #    reflex. Written before the swap; the self-gate below re-verifies it.
  cat > "$stage/assets.tsv" <<LEDGER
# file	kind	mood_tags	bytes	license	artist_or_owner	source_url	usage	status	evidence_or_reason
# RULE: no HDRI above 1K resolution enters the shelf (2K/4K/8K variants exist upstream — extended pack is owner opt-in only).
# RULE: no model enters unless EVERY metadata.json legal[] entry is CC0 (string "CC0" + publicdomain/zero/1.0 URL); CC-BY = owner opt-in with an attribution row; sync gates this at every tier.
# RULE: shelf assets are scaffolding/lighting/placeholders — client heroes ship the client's own model (with these HDRIs), never the demo glbs.
hdri/venice_sunset_1k.hdr	hdri	sunset,golden-hour,warm,marketing-hero	$ASSETS3D_VENICE_BYTES	CC0	Greg Zaal / Poly Haven	https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr	environment-image	vendored	page-level CC0 verified 2026-08-03 at polyhaven.com/a/venice_sunset; drei preset "sunset" is this exact file
hdri/studio_small_03_1k.hdr	hdri	studio,neutral,product,high-contrast	$ASSETS3D_STUDIO_BYTES	CC0	Greg Zaal / Poly Haven	https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr	environment-image	vendored	page-level CC0 verified 2026-08-03 at polyhaven.com/a/studio_small_03; drei preset "studio" is this exact file
models/SheenChair.glb	model	furniture,fabric,sheen,product-demo	$ASSETS3D_SHEENCHAIR_BYTES	CC0	Eric Chadwick (owner: Wayfair, LLC)	https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/$KHRONOS_GLTF_SHA/Models/SheenChair/glTF-Binary/SheenChair.glb	placeholder,hero-model	$glb_status	legal[] all-CC0 in models/SheenChair.metadata.json (checked: Models/SheenChair/metadata.json @ khronos_pin $KHRONOS_GLTF_SHA)
models/ToyCar.glb	model	toy,car,clearcoat,playful,product-demo	$ASSETS3D_TOYCAR_BYTES	CC0	Guido Odendahl + Eric Chadwick (owner: Public)	https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/$KHRONOS_GLTF_SHA/Models/ToyCar/glTF-Binary/ToyCar.glb	placeholder,hero-model	$glb_status	legal[] all-CC0 x2 entries in models/ToyCar.metadata.json (checked: Models/ToyCar/metadata.json @ khronos_pin $KHRONOS_GLTF_SHA)
Models/DamagedHelmet	model	-	-	CC-BY + CC-BY-NC	ctxwing / theblueturtle_	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/DamagedHelmet	-	excluded	legal[] = [CC-BY-4.0 conversion (ctxwing), CC-BY-NC-4.0 base model (theblueturtle_)] verified @ khronos_pin $KHRONOS_GLTF_SHA — NC-tainted composite, unusable commercially
Models/MaterialsVariantsShoe	model	-	-	CC-BY-4.0	Shopify	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MaterialsVariantsShoe	-	excluded	CC-BY requires attribution — owner opt-in ONLY, with an attribution row added here first
Models/FlightHelmet	model	-	-	CC0	-	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/FlightHelmet	-	excluded	46MB and no .glb form — fails the size bar regardless of license
Models/ABeautifulGame	model	-	-	CC0	-	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ABeautifulGame	-	excluded	23-41MB size class — fails the size bar
Models/MosquitoInAmber	model	-	-	CC0	-	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MosquitoInAmber	-	excluded	23-41MB size class — fails the size bar
Models/BoomBox	model	-	-	CC0	Microsoft	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/BoomBox	-	excluded	8.5-10MB — weaker value-per-MB than the two core picks
Models/Lantern	model	-	-	CC0	Microsoft	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Lantern	-	excluded	8.5-10MB — weaker value-per-MB than the two core picks
Models/WaterBottle	model	-	-	CC0	Microsoft	https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/WaterBottle	-	excluded	CC0 and small-ish but weaker value-per-MB — extended-pack candidate, owner opt-in
LEDGER

  # -- ledger self-gate (audit mandate: byte-equality of every asset vs
  #    assets.tsv on sync): every status=vendored row must exist in the stage
  #    with EXACT bytes; row counts must match the tier.
  local f k tags b lic artist url usage s ev nvendored
  while IFS=$'\t' read -r f k tags b lic artist url usage s ev; do
    [ "$s" = "vendored" ] || continue
    [ -f "$stage/$f" ] \
      || { fail "assets-3d ledger says $f is vendored but it is missing from the stage"; return; }
    got=$(wc -c < "$stage/$f" | tr -d ' ')
    [ "$got" -eq "$b" ] \
      || { fail "assets-3d ledger byte mismatch for $f: staged $got != ledger $b"; return; }
  done < <(grep -v '^#' "$stage/assets.tsv")
  nvendored=$(grep -v '^#' "$stage/assets.tsv" | awk -F'\t' '$9=="vendored"' | wc -l | tr -d ' ')
  if [ "$tier" = "core" ]; then
    [ "$nvendored" -eq 4 ] || { fail "assets-3d core tier: $nvendored vendored ledger rows (want 4)"; return; }
  else
    [ "$nvendored" -eq 2 ] || { fail "assets-3d hdri tier: $nvendored vendored ledger rows (want 2)"; return; }
  fi
  [ "$(grep -v '^#' "$stage/assets.tsv" | awk -F'\t' '$9=="excluded"' | wc -l | tr -d ' ')" -eq 8 ] \
    || { fail "assets-3d: exclusion evidence rows != 8 — ledger reshaped, refusing to vendor"; return; }

  # -- provenance record (CC0 needs no attribution; this is the audit trail)
  cat > "$stage/LICENSE-NOTICE.md" <<NOTICE
# assets-3d — provenance and license record (CC0 audit trail)

Last synced: $(date -u +%Y-%m-%d). CC0 requires NO attribution — this file exists
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
$KHRONOS_GLTF_SHA (main @ 2026-04-27). Note the metadata license string is
"CC0" with the creativecommons.org/publicdomain/zero/1.0 legalcode URL — not
the SPDX id "CC0-1.0"; the sync gate checks both string and URL.
- SheenChair: legal[] = 1x CC0 (artist Eric Chadwick, owner Wayfair, LLC) — checked Models/SheenChair/metadata.json @ pin.
- ToyCar: legal[] = 2x CC0 (Guido Odendahl initial model + Eric Chadwick extensions, owner Public) — checked Models/ToyCar/metadata.json @ pin.
- DamagedHelmet is EXCLUDED: legal[] carries CC-BY-NC-4.0 (theblueturtle_ base
  model) under a CC-BY-4.0 conversion — an NC-tainted composite. Recorded as a
  data row in assets.tsv so no future sweep re-includes it by reflex.
NOTICE

  # all gates passed — atomic swap (a failed refresh keeps the previous copy)
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  local total
  total=$(find "$d" \( -name '*.hdr' -o -name '*.glb' \) -exec cat {} + | wc -c | tr -d ' ')
  say "3D asset shelf: $nvendored assets vendored ($total bytes, $tier tier) + 2 license-evidence files + ledger @ khronos ${KHRONOS_GLTF_SHA:0:12}"
}

# ============================================================================
# MEDIA-CHROME FRAGMENT for scripts/sync.sh (Wave 3)
# Orchestrator integration:
#   1. Pin vars (top-of-file "Pinned versions" block — see pins.txt):
#        MEDIA_CHROME_VERSION="4.19.2"
#        PLAYER_STYLE_SHA="12c9ad656e98998f998d24f0b94e6cddc0e07796"
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "media-chrome"; case statement gains:
#        media-chrome)       sync_media_chrome ;;
#   4. MANIFEST jq gains: --arg media_chrome "$MEDIA_CHROME_VERSION"
#      --arg player_style "$PLAYER_STYLE_SHA" and, inside .pinned:
#      media_chrome: $media_chrome, player_style: $player_style (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- media-chrome
# Branded inline video players — the arsenal's ONLY styled-player-chrome answer
# (native <video controls> is unstylable; the only other video-adjacent vendored
# items are a lightbox, a lens, a text-mask and a glow — none render controls).
# VANILLA SUBSET ONLY (judge mandate, corrected intake): media-chrome declares
# ce-la-react ^0.3.2 but grep proves it is imported ONLY by dist/react/* and
# dist/cjs/react/* — the web-components subset is genuinely dependency-free.
# React consumers install media-chrome/react from npm; the wrapper is NEVER
# vendored. Tarball is 5.1MB unpacked (NOT the researcher's 1.2MB) — vendored
# subset is the 40-file ESM import CLOSURE of 11 core controls
# (+ media-theme-element so the vendored themes render) + dist/iife/all.js
# (241KB — the ONLY iife bundle that defines <media-theme>; iife/index.js does
# NOT, verified at 4.19.2) + 3 curated player.style themes at a pinned commit.
# Subset drift risk: future versions may reshuffle dist internals — bumping
# MEDIA_CHROME_VERSION is a deliberate edit; re-run the closure audit first
# (the closure gate below fails loud if upstream adds an import we don't stage).
# THEME LAW (judge mandate): allowlist = minimal/microvideo/sutro (original
# designs, MIT, verified free of external asset loads). Brand-lookalike themes
# (notflix, yt, vimeonova, winamp, instaplay) are PERMANENTLY EXCLUDED on
# trade-dress grounds — never fetch, never "defer for later review".
sync_media_chrome() {
  local d="$VENDOR/media-chrome"
  say "media-chrome: vanilla dist subset @ $MEDIA_CHROME_VERSION + player.style themes @ ${PLAYER_STYLE_SHA:0:12}"

  # CURATION FILTER AS DATA — the ESM import closure of the 11 core controls,
  # media-theme-element, constants and lang/en (closure computed at audit
  # 2026-08; the closure gate below re-verifies every staged import resolves).
  local subset=(
    constants.js lang/en.js
    media-controller.js media-control-bar.js media-play-button.js
    media-mute-button.js media-volume-range.js media-time-range.js
    media-time-display.js media-duration-display.js media-fullscreen-button.js
    media-poster-image.js media-loading-indicator.js
    media-theme-element.js
    media-chrome-button.js media-chrome-range.js media-container.js
    media-gesture-receiver.js media-text-display.js media-tooltip.js
    media-preview-chapter-display.js media-preview-thumbnail.js
    media-preview-time-display.js
    media-store/media-store.js media-store/request-map.js
    media-store/state-mediator.js media-store/util.js
    utils/attribute-token-list.js utils/captions.js utils/element-utils.js
    utils/fullscreen-api.js utils/i18n.js utils/platform-tests.js
    utils/range-animation.js utils/resize-observer.js
    utils/server-safe-globals.js utils/template-parts.js
    utils/template-processor.js utils/time.js utils/utils.js
  )
  # THEME ALLOWLIST AS DATA (owner-approved). Adding a name here is a deliberate
  # audit event; brand-lookalikes are permanently banned above.
  local themes=(minimal microvideo sutro)

  local tgz="$TMP/media-chrome.tgz" ex="$TMP/media-chrome-ex"
  fetch "https://registry.npmjs.org/media-chrome/-/media-chrome-$MEDIA_CHROME_VERSION.tgz" "$tgz" \
    || { fail "media-chrome tarball fetch @ $MEDIA_CHROME_VERSION (keeping previous copy)"; return; }
  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "media-chrome tarball extract — keeping previous copy"; return; }
  local pkg="$ex/package"

  # pin + license gates from the tarball's own package.json. NOTE: the LICENSE
  # file has NO "MIT License" heading — it opens with the Mux copyright line and
  # the MIT permission grant, so gate on the grant text, not the heading.
  local got_version got_license got_deps
  got_version="$(jq -r '.version // empty' "$pkg/package.json")" \
    || { fail "media-chrome package.json parse — keeping previous copy"; return; }
  got_license="$(jq -r '.license // empty' "$pkg/package.json")"
  [ "$got_version" = "$MEDIA_CHROME_VERSION" ] \
    || { fail "media-chrome version mismatch: tarball says '$got_version', pinned $MEDIA_CHROME_VERSION"; return; }
  [ "$got_license" = "MIT" ] \
    || { fail "media-chrome license is '$got_license', expected MIT — refusing to vendor"; return; }
  grep -q "Permission is hereby granted, free of charge" "$pkg/LICENSE" \
    || { fail "media-chrome LICENSE text is not the MIT permission grant — refusing to vendor"; return; }
  grep -q "Mux, Inc" "$pkg/LICENSE" \
    || { fail "media-chrome LICENSE lost the Mux copyright line — inspect upstream before vendoring"; return; }
  # dependency-surface gate: ce-la-react must remain the ONLY declared dep (it
  # never ships — react/cjs are excluded below). A new dep = re-audit, not sync.
  got_deps="$(jq -r '.dependencies | keys | join(",")' "$pkg/package.json")"
  [ "$got_deps" = "ce-la-react" ] \
    || { fail "media-chrome dependency surface changed ('$got_deps' != 'ce-la-react') — re-audit the vanilla-subset claim before vendoring"; return; }

  # stage the subset; a missing file means upstream reshuffled dist — fail loud
  local stage="$TMP/media-chrome-stage" f
  rm -rf "$stage"; mkdir -p "$stage/dist/iife" "$stage/themes"
  for f in "${subset[@]}"; do
    [ -f "$pkg/dist/$f" ] \
      || { fail "media-chrome subset file dist/$f missing from tarball — dist reshuffled, re-run the closure audit before bumping"; return; }
    mkdir -p "$stage/dist/$(dirname "$f")"
    cp "$pkg/dist/$f" "$stage/dist/$f"
  done
  # EXCLUDED BY LAW (never stage): dist/react + dist/cjs (drag ce-la-react),
  # dist/menu, cast/airplay/live/loop/pip/seek/captions/playback-rate buttons,
  # dialogs, vscode.*.json data files, custom-elements.json, *.map, *.d.ts —
  # the npm package serves those needs; the vendored subset is the audited core.

  # CLOSURE GATE: every relative import in every staged ESM file must resolve
  # inside the stage — an unresolved import means upstream grew the graph and
  # copied components would 404 at runtime. (Imports use double quotes at
  # 4.19.2; JSDoc `import('...')` type comments don't match this pattern.)
  local spec resolved
  for f in $(find "$stage/dist" -name '*.js' ! -path '*/iife/*'); do
    for spec in $(grep -oE '(from|import) "\.[^"]+"' "$f" | sed -E 's/^(from|import) "//; s/"$//'); do
      resolved="$(cd "$(dirname "$f")" && cd "$(dirname "$spec")" 2>/dev/null && pwd)/$(basename "$spec")"
      [ -f "$resolved" ] \
        || { fail "media-chrome closure gate: $(basename "$f") imports $spec — outside the staged subset; update the subset list deliberately"; return; }
    done
  done

  # subset sanity: exactly the audited file count + byte floor (audit: 40 files,
  # 316,666 bytes at 4.19.2 — floors catch truncation, exact count catches drift)
  local n bytes
  n=$(find "$stage/dist" -name '*.js' ! -path '*/iife/*' | wc -l | tr -d ' ')
  [ "$n" -eq 40 ] \
    || { fail "media-chrome subset: $n staged JS files (want exactly 40) — keeping previous copy"; return; }
  bytes=$(find "$stage/dist" -name '*.js' ! -path '*/iife/*' -exec cat {} + | wc -c | tr -d ' ')
  [ "$bytes" -ge 250000 ] \
    || { fail "media-chrome subset: $bytes bytes (<250KB floor; audit: ~317KB) — keeping previous copy"; return; }

  # iife/all.js — the zero-build offline bundle. MUST be all.js: it is the only
  # iife build that defines <media-theme> (needed by the vendored themes);
  # iife/index.js does not (verified 4.19.2 — do not "optimize" to the smaller file).
  cp "$pkg/dist/iife/all.js" "$stage/dist/iife/all.js" \
    || { fail "media-chrome iife/all.js missing from tarball — keeping previous copy"; return; }
  [ "$(wc -c < "$stage/dist/iife/all.js")" -ge 200000 ] \
    || { fail "media-chrome iife/all.js under 200KB (audit: 241,078 B) — truncated; keeping previous copy"; return; }
  grep -qF 'customElements.define("media-theme"' "$stage/dist/iife/all.js" \
    || { fail "media-chrome iife/all.js no longer defines <media-theme> — themes would not render; keeping previous copy"; return; }

  # a11y contract gate — the audited reason this source earned its slot; if the
  # shipped dist loses it, the adoption rationale is void: STOP and re-audit.
  grep -qF '"ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"' "$stage/dist/media-chrome-range.js" \
    || { fail "media-chrome: arrow-key handling gone from media-chrome-range.js — a11y contract broken, re-audit before vendoring"; return; }
  grep -qF 'aria-label' "$stage/dist/media-play-button.js" \
    || { fail "media-chrome: aria-label wiring gone from media-play-button.js — a11y contract broken, re-audit before vendoring"; return; }

  # the vanilla subset must be dependency-free: zero ce-la-react references
  grep -rq "ce-la-react" "$stage/dist" \
    && { fail "media-chrome: ce-la-react reference inside the staged vanilla subset — react wrapper leaked in; keeping previous copy"; return; }

  # ---- player.style themes @ pinned commit (immutable raw fetches) ----
  local t raw="https://raw.githubusercontent.com/muxinc/player.style/$PLAYER_STYLE_SHA"
  for t in "${themes[@]}"; do
    mkdir -p "$stage/themes/$t"
    fetch "$raw/themes/$t/template.html" "$stage/themes/$t/template.html" \
      || { fail "media-chrome theme $t template.html fetch @ pin"; return; }
    fetch "$raw/themes/$t/package.json" "$stage/themes/$t/package.json" \
      || { fail "media-chrome theme $t package.json fetch @ pin"; return; }
    [ "$(jq -r '.license // empty' "$stage/themes/$t/package.json")" = "MIT" ] \
      || { fail "media-chrome theme $t license is not MIT — refusing to vendor"; return; }
    [ "$(wc -c < "$stage/themes/$t/template.html")" -ge 10000 ] \
      || { fail "media-chrome theme $t template.html under 10KB (smallest audited: 16,295 B) — truncated"; return; }
    grep -q "<media-controller" "$stage/themes/$t/template.html" \
      || { fail "media-chrome theme $t template has no <media-controller> — not a theme template"; return; }
    grep -q 'slot="media"' "$stage/themes/$t/template.html" \
      || { fail "media-chrome theme $t template lost its media slot — layout changed, re-audit"; return; }
    # OFFLINE GATE (judge mandate): themes must reference no external assets —
    # fonts/CDN icons would leak requests from fully-offline zero-build pages.
    # (xmlns namespace declarations and URLs inside comments are not loads.)
    grep -qE 'src="https?://|href="https?://|url\(https?://|url\("https?://|@import' "$stage/themes/$t/template.html" \
      && { fail "media-chrome theme $t references an external asset — offline contract broken; keeping previous copy"; return; }
  done

  # license + provenance travel with the payload
  cp "$pkg/LICENSE" "$stage/LICENSE"
  cp "$pkg/package.json" "$stage/package.json"   # keeps version+license auditable offline
  jq -n --arg mc "$MEDIA_CHROME_VERSION" --arg ps "$PLAYER_STYLE_SHA" \
        --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson files "$n" --argjson bytes "$bytes" \
        '{package: "media-chrome", version: $mc, subset: "vanilla web-components import closure (11 core controls + media-theme-element)",
          subset_files: $files, subset_bytes: $bytes, iife: "dist/iife/all.js (defines media-theme; iife/index.js does not)",
          themes_repo: "github.com/muxinc/player.style", themes_sha: $ps,
          themes: ["minimal", "microvideo", "sutro"],
          themes_excluded_permanently: ["notflix", "yt", "vimeonova", "winamp", "instaplay"],
          themes_exclusion_reason: "brand-lookalike trade dress — fails the marketing-grade bar; excluded, not deferred",
          synced_at: $date}' > "$stage/PIN.json" \
    || { fail "media-chrome PIN.json write"; return; }

  # all gates passed — atomic swap (a failed refresh keeps the previous copy)
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "media-chrome: $n-file vanilla subset ($bytes bytes) + iife/all.js + ${#themes[@]} themes vendored @ $MEDIA_CHROME_VERSION / ${PLAYER_STYLE_SHA:0:12}"
}

# ============================================================================
# VFX-JS FRAGMENT for scripts/sync.sh (Wave 3)
# Orchestrator integration:
#   1. Pin var (goes in the "Pinned versions" block at the top of sync.sh —
#      see pins.txt):  VFX_JS_VERSION="1.1.0"
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "vfx-js"; case statement gains:  vfx-js) sync_vfx_js ;;
#   4. MANIFEST jq gains: --arg vfx_js "$VFX_JS_VERSION" and
#      "vfx_js: $vfx_js" inside .pinned (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- VFX-JS
# Preset WebGL post-effects applied to REAL DOM media (img/video/canvas/text)
# — @vfx-js/core pinned npm tarball. ZERO runtime deps at 1.x: the 0.1.0-era
# three@^0.165 dep was removed at 0.13.0 (verified across all 23 registry
# versions on 2026-08-03; MIT at every one, no relicense) — so no r134-class
# version-interplay trap is possible. The zero-dep gate below is a tripwire:
# a dependencies block reappearing on a bump means the trap came back.
# API BOUNDARY: 1.0.0 (2026-05-16) broke the 0.x API — the card is authored
# from 1.x only and pre-May-2026 online snippets are wrong; never bump DOWN.
# Curation filter AS DATA: lib/esm MINUS *.test.* and *.map (tests + maps are
# ~700KB dead weight; dist JS is readable source) + LICENSE + README +
# package.json. lib/cjs is EXCLUDED — ESM+types serve bundlers and zero-build
# alike; vendoring CJS would double the bytes for no consumer.
sync_vfx_js() {
  local d="$VENDOR/vfx-js"
  say "VFX-JS: @vfx-js/core $VFX_JS_VERSION npm tarball → lib/esm subset (no tests/maps/cjs)"

  local tgz="$TMP/vfx-js.tgz" ex="$TMP/vfx-js-pkg" pkg
  fetch "https://registry.npmjs.org/@vfx-js/core/-/core-$VFX_JS_VERSION.tgz" "$tgz" \
    || { fail "vfx-js tarball fetch @ $VFX_JS_VERSION (keeping previous copy)"; return; }
  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "vfx-js tarball extract (keeping previous copy)"; return; }
  pkg="$ex/package"

  # gates: version + license + ZERO runtime deps, from the tarball's own
  # package.json — never trust the registry listing alone
  local got_version got_license got_deps
  got_version="$(jq -r '.version // empty' "$pkg/package.json")" \
    || { fail "vfx-js package.json parse (keeping previous copy)"; return; }
  got_license="$(jq -r '.license // empty' "$pkg/package.json")"
  got_deps="$(jq -r '.dependencies // {} | length' "$pkg/package.json")"
  [ "$got_version" = "$VFX_JS_VERSION" ] \
    || { fail "vfx-js version mismatch: tarball says '$got_version', pinned $VFX_JS_VERSION"; return; }
  [ "$got_license" = "MIT" ] \
    || { fail "vfx-js license is '$got_license', expected MIT — refusing to vendor"; return; }
  [ "$got_deps" -eq 0 ] \
    || { fail "vfx-js has $got_deps runtime deps (audited 1.1.0 has ZERO; a returned three.js dep is the r134-class trap) — refusing to vendor"; return; }
  grep -q "MIT License" "$pkg/LICENSE" \
    || { fail "vfx-js LICENSE text is not the MIT License — refusing to vendor"; return; }

  # stage the curated subset; the live vendor dir is replaced only after every
  # gate passes (tar create/extract pair keeps the esm/ subtree layout intact)
  local stage="$TMP/vfx-js-stage"
  rm -rf "$stage"; mkdir -p "$stage/lib"
  ( cd "$pkg/lib" && tar -cf - --exclude='*.map' --exclude='*.test.*' esm ) \
      | tar -xf - -C "$stage/lib" \
    || { fail "vfx-js esm subset copy (keeping previous copy)"; return; }
  cp "$pkg/LICENSE" "$stage/LICENSE" || { fail "vfx-js LICENSE copy"; return; }
  cp "$pkg/README.md" "$stage/README.md" 2>/dev/null || warn "vfx-js README miss (non-fatal)"
  cp "$pkg/package.json" "$stage/package.json"   # keeps version+license+zero-deps auditable offline

  # subset gates: the pin is EXACT and the tarball frozen, so counts are exact
  # equalities at 1.1.0 (69 files / 367,505 B measured at audit) — floors kept
  # slightly under to survive byte-neutral upstream re-releases of the SAME pin.
  # Bumping VFX_JS_VERSION is a deliberate edit: re-measure and update these.
  local nfiles bytes
  nfiles=$(find "$stage/lib/esm" -type f | wc -l | tr -d ' ')
  bytes=$(find "$stage/lib/esm" -type f -exec cat {} + | wc -c | tr -d ' ')
  [ "$nfiles" -eq 69 ] \
    || { fail "vfx-js esm subset: $nfiles files (want exactly 69 at 1.1.0) — keeping previous copy"; return; }
  [ "$bytes" -ge 300000 ] \
    || { fail "vfx-js esm subset: $bytes bytes (<300KB floor; audit: 367,505) — keeping previous copy"; return; }
  find "$stage/lib/esm" \( -name '*.map' -o -name '*.test.*' \) | grep -q . \
    && { fail "vfx-js curation filter leaked tests/sourcemaps into the stage — keeping previous copy"; return; }

  # preset gate: constants.js must ship the full audited shaders map — 22
  # effect presets + the 'none' identity copy shader (23 keys @ 1.1.0; the
  # docs claim fewer, the shipped source is authoritative). A missing key
  # means the preset API reshaped: STOP, re-audit card + TSV before vendoring.
  local p
  for p in none uvGradient rainbow glitch pixelate rgbGlitch rgbShift halftone \
           sinewave shine blink spring duotone tritone hueShift \
           warpTransition slitScanTransition pixelateTransition focusTransition \
           invert grayscale vignette chromatic; do
    grep -q "^    $p:" "$stage/lib/esm/constants.js" \
      || { fail "vfx-js constants.js missing preset '$p' — shaders map reshaped, re-audit before vendoring"; return; }
  done
  grep -q "export const shaders = {" "$stage/lib/esm/constants.js" \
    || { fail "vfx-js constants.js lost the shaders map export — keeping previous copy"; return; }

  # runnable-contract gates: the two entry points every recipe depends on
  grep -q "static init(options)" "$stage/lib/esm/vfx.js" \
    || grep -q "static init" "$stage/lib/esm/vfx.js" \
    || { fail "vfx-js vfx.js lost VFX.init (null-fallback contract) — keeping previous copy"; return; }
  grep -q "cancelAnimationFrame" "$stage/lib/esm/vfx-player.js" \
    || { fail "vfx-js vfx-player.js lost rAF cancellation (destroy contract) — keeping previous copy"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "VFX-JS: $nfiles esm files ($bytes bytes) + LICENSE vendored @ $VFX_JS_VERSION (zero runtime deps verified)"
}

# ============================================================================
# NOISE FRAGMENT for scripts/sync.sh (Wave 3)
# Orchestrator integration:
#   1. Pin vars (go in the "Pinned versions" block at the top of sync.sh —
#      see pins.txt):
#        NOISE_WEBGL_SHA="22434e04d7753f7e949e8d724ab3da2864c17a0f"
#        NOISE_PSRD_SHA="419175a270862ce7ae692038fafafb42ec0427e9"
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "noise"; case statement gains:  noise) sync_noise ;;
#   4. MANIFEST jq gains: --arg noise_webgl "$NOISE_WEBGL_SHA"
#      --arg noise_psrd "$NOISE_PSRD_SHA" and, inside .pinned:
#      "noise_webgl: $noise_webgl, noise_psrd: $noise_psrd" (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- Noise (stegu)
# INGREDIENTS layer (judge mandate): GLSL/WGSL reference noise implementations
# from the algorithm authors' own repos (Gustavson/McEwan, the simplex-noise
# paper lineage) — seamless tiling, analytic-derivative flow, cellular/Worley —
# for CUSTOM shaders in OGL/curtains/three work. Paper Shaders stays the
# COMPOSED-effects source; this fills the license-clean slot LYGIA was rejected
# for (Prosperity 3.0.0 — not open source; never re-propose it).
# Both repos are frozen-by-design reference math: pin by commit SHA, per-file
# raw fetches (verified working 2026-08-03; total ~120KB of text).
# COMPLIANCE: psrdnoise has NO upstream LICENSE file — MIT lives in the in-file
# headers + README ("All GLSL code in this repository is published under the
# permissive MIT license", (c) 2021 Stefan Gustavson and Ian McEwan), so this
# function authors LICENSE-NOTICE.md and hard-fails if any file loses its MIT
# header. webgl-noise HAS a LICENSE file (the 2011 Ashima Arts / 2011-2016
# Stefan Gustavson MIT grant — note: it contains the grant text, not the words
# "MIT License", so the gate greps "Permission is hereby granted").
sync_noise() {
  local d="$VENDOR/noise"
  say "Noise: stegu webgl-noise + psrdnoise reference GLSL/WGSL @ ${NOISE_WEBGL_SHA:0:7}/${NOISE_PSRD_SHA:0:7}"

  # Curation filter AS DATA — the only files allowed in.
  # webgl-noise src/: simplex 2/3/4D + analytic-gradient 3D, classic+periodic
  # 2/3/4D, and the cellular/Worley quartet the first researcher pass omitted.
  local wn_files=(noise2D noise3D noise3Dgrad noise4D
    classicnoise2D classicnoise3D classicnoise4D
    cellular2D cellular2x2 cellular2x2x2 cellular3D)
  # psrdnoise src/: all GLSL variants incl. -min and the mediump mobile variant,
  # plus the two WGSL ports (future-proof for any later WebGPU surface).
  local ps_files=(psrdnoise2.glsl psrdnoise3.glsl psrddnoise2.glsl psrddnoise3.glsl
    psrdnoise2-min.glsl psrdnoise3-min.glsl mpsrdnoise2.glsl
    psrdnoise2.wgsl psrdnoise3.wgsl)
  # EXCLUDED as data (reasons are law, not vibes):
  #   webgl-noise src/psrdnoise2D.glsl — 2016-era draft superseded by the 2021
  #     stegu/psrdnoise rewrite vendored below; a second home for the same
  #     function is a routing regression (adding-a-source.md step 3).
  #   psrdnoise hlsl/ — no HLSL surface exists in the arsenal.
  #   Both repos' demos/docs/images — reference math only, ~120KB total.

  # stage in $TMP; the live vendor dir is replaced only after every gate passes
  local stage="$TMP/noise-stage"
  rm -rf "$stage"; mkdir -p "$stage/webgl-noise" "$stage/psrdnoise"

  local f
  for f in "${wn_files[@]}"; do
    fetch "https://raw.githubusercontent.com/stegu/webgl-noise/$NOISE_WEBGL_SHA/src/$f.glsl" \
      "$stage/webgl-noise/$f.glsl" \
      || { fail "noise webgl-noise $f.glsl @ pin (keeping previous copy)"; return; }
  done
  fetch "https://raw.githubusercontent.com/stegu/webgl-noise/$NOISE_WEBGL_SHA/LICENSE" \
    "$stage/webgl-noise/LICENSE" \
    || { fail "noise webgl-noise LICENSE @ pin"; return; }
  grep -q "Permission is hereby granted" "$stage/webgl-noise/LICENSE" \
    || { fail "noise webgl-noise LICENSE is not the MIT grant text — STOP and re-audit before vendoring"; return; }

  for f in "${ps_files[@]}"; do
    fetch "https://raw.githubusercontent.com/stegu/psrdnoise/$NOISE_PSRD_SHA/src/$f" \
      "$stage/psrdnoise/$f" \
      || { fail "noise psrdnoise $f @ pin (keeping previous copy)"; return; }
  done

  # gates: every shader file keeps its in-file MIT header (for psrdnoise the
  # header IS the license — losing it is a compliance failure, not cosmetics),
  # no file is truncated (<1KB; smallest at pin is psrdnoise2-min.glsl 1,719 B),
  # and the total matches the audited payload (~120KB; floor 100KB).
  local total=0 bytes
  for f in "$stage/webgl-noise"/*.glsl "$stage/psrdnoise"/*; do
    grep -qi "MIT" "$f" \
      || { fail "noise $(basename "$f") lost its in-file MIT header — keeping previous copy"; return; }
    bytes=$(wc -c < "$f" | tr -d ' ')
    [ "$bytes" -ge 1000 ] \
      || { fail "noise $(basename "$f") is ${bytes}B (<1KB — truncated) — keeping previous copy"; return; }
    total=$((total + bytes))
  done
  [ "$total" -ge 100000 ] \
    || { fail "noise payload total ${total}B (<100KB floor; audit 2026-08: ~120KB) — keeping previous copy"; return; }

  # authored LICENSE-NOTICE for psrdnoise (no upstream LICENSE file exists —
  # same class as the shadergradient licenses.tsv precedent)
  cat > "$stage/psrdnoise/LICENSE-NOTICE.md" <<NOTICE
# psrdnoise — license notice (authored by alex-style sync; no upstream LICENSE file exists)

stegu/psrdnoise ships NO top-level LICENSE file (GitHub license detector: None).
The MIT grant lives in two upstream places, both verified at pinned commit
$NOISE_PSRD_SHA:

1. README.md, section "LICENSE": "All GLSL code in this repository is published
   under the permissive MIT license" — followed by the full grant text,
   "Copyright 2021 Stefan Gustavson and Ian McEwan".
2. Every vendored file's header carries the complete MIT text (or a short MIT
   pointer in the -min/mpsrdnoise variants).

The in-file headers are therefore the operative license text. NEVER strip them
from vendored or project copies — sync and the arsenal self-test hard-fail if
a file loses its MIT header.
NOTICE

  # function-routing TSV (BLOCKING adoption condition: ships in the SAME change
  # as the files — raw GLSL without a "which noise for which job" index is dead
  # weight). Authored as data here, like the review-packs allowlist precedent.
  # cost_tier is explicit so mpsrdnoise2 wins on the mobile tier over
  # psrddnoise3 (the audit's named misuse risk).
  cat > "$stage/functions.tsv" <<'TSV'
# function	file	dims	tiling	derivatives	cost_tier	use_for
snoise	webgl-noise/noise2D.glsl	2D	no	no	cheap	general 2D simplex: grain, wobble, domain-warp input
snoise	webgl-noise/noise3D.glsl	3D	no	no	medium	animated 2D fields (x, y, time): smoke, clouds, fog
snoise	webgl-noise/noise3Dgrad.glsl	3D	no	analytic gradient (out vec3)	medium-high	flow/curl fields without 4x finite-difference taps
snoise	webgl-noise/noise4D.glsl	4D	no	no	high	animated 3D fields (xyz + time); loop via circle trick
cnoise	webgl-noise/classicnoise2D.glsl	2D	no	no	cheap	classic Perlin look, softer than simplex
pnoise	webgl-noise/classicnoise2D.glsl	2D	yes (rep param)	no	cheap	tiling 2D classic: repeating paper/fabric textures
cnoise	webgl-noise/classicnoise3D.glsl	3D	no	no	medium	classic Perlin volumes
pnoise	webgl-noise/classicnoise3D.glsl	3D	yes (rep param)	no	medium	looping animated classic tiles
cnoise	webgl-noise/classicnoise4D.glsl	4D	no	no	high	classic Perlin space+time
pnoise	webgl-noise/classicnoise4D.glsl	4D	yes (rep param)	no	high	fully seamless space AND time loops
cellular	webgl-noise/cellular2D.glsl	2D	no	no	medium	Worley F1/F2: cells, voronoi, caustics, cracked surfaces
cellular2x2	webgl-noise/cellular2x2.glsl	2D	no	no	cheap	fast Worley (2x2 window; F2 approximate) — mobile cellular
cellular2x2x2	webgl-noise/cellular2x2x2.glsl	3D	no	no	medium	fast 3D Worley (2x2x2 window; F2 approximate)
cellular	webgl-noise/cellular3D.glsl	3D	no	no	high	accurate 3D Worley F1/F2
psrdnoise	psrdnoise/psrdnoise2.glsl	2D	yes (any integer period)	analytic gradient (out vec2)	medium	THE default tiling noise: seamless loops + rotating-gradient flow via alpha
psrdnoise	psrdnoise/psrdnoise3.glsl	3D	yes (any integer period)	analytic gradient (out vec3)	high	tiling 3D volumes with flow
psrddnoise	psrdnoise/psrddnoise2.glsl	2D	yes	analytic 1st + 2nd derivatives	high	curl noise, advection, crease/ridge shaping
psrddnoise	psrdnoise/psrddnoise3.glsl	3D	yes	analytic 1st + 2nd derivatives	very-high	full-featured 3D flow — desktop only, never mobile
psrdnoise	psrdnoise/psrdnoise2-min.glsl	2D	yes	analytic gradient	medium	code-golfed psrdnoise2, same API, smallest source
psrdnoise	psrdnoise/psrdnoise3-min.glsl	3D	yes	analytic gradient	high	code-golfed psrdnoise3, same API
mpsrdnoise	psrdnoise/mpsrdnoise2.glsl	2D	yes	analytic gradient	cheap (mediump-safe)	MOBILE DEFAULT: correct on 16-bit half-float GPUs
psrdnoise2	psrdnoise/psrdnoise2.wgsl	2D	yes	analytic (struct return)	medium	WGSL port — future WebGPU surfaces only
psrdnoise3	psrdnoise/psrdnoise3.wgsl	3D	yes	analytic (struct return)	high	WGSL port — future WebGPU surfaces only
TSV
  local nrows
  nrows=$(grep -cv '^#' "$stage/functions.tsv")
  [ "$nrows" -eq 23 ] \
    || { fail "noise functions.tsv has $nrows rows (want 23) — keeping previous copy"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Noise: 20 shader files (${total}B) + functions.tsv (23 rows) + licenses vendored @ webgl-noise ${NOISE_WEBGL_SHA:0:7} / psrdnoise ${NOISE_PSRD_SHA:0:7}"
}

# ============================================================================
# R3F-DREI FRAGMENT for scripts/sync.sh (Wave 3)
# Orchestrator integration:
#   1. Pin vars (go in the "Pinned versions" block at the top of sync.sh —
#      see pins.txt):
#        R3F_FIBER_DOCS_VERSION="9.7.0"
#        DREI_DOCS_VERSION="10.7.7"
R3F_FIBER_DOCS_VERSION="9.7.0"
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "r3f-drei"; case statement gains:
#        r3f-drei) sync_r3f_drei ;;
#   4. MANIFEST jq gains: --arg r3f_docs "$R3F_FIBER_DOCS_VERSION"
#      --arg drei_docs "$DREI_DOCS_VERSION" and, inside .pinned:
#      "r3f_docs: $r3f_docs, drei_docs: $drei_docs" (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- r3f + drei docs pack
# DOCS + PINS PACK ONLY (judge mandate): vendoring the r3f/drei RUNTIME would
# re-open the rejected pinned-three-infrastructure debate — users npm-install
# into their own project; the arsenal vendors only the two llms-full.txt doc
# artifacts for GREP-ONLY consumption (they join the never-read-fully table in
# SKILL.md) plus the pins-and-traps card sources/r3f-drei.md.
# The artifacts carry NO upstream version stamp, so pinning is URL + byte floor
# + PIN.json (sync date + byte sizes) for staleness detection; the
# R3F/DREI_DOCS_VERSION pins are the versions the CARD's pins-and-traps content
# was audited against (audit 2026-08: r3f 9.7.0 peer react ">=19 <19.3", drei
# 10.7.7 latest with 11.0.0 alphas publishing since 2026-01). Re-sync + re-audit
# the card when drei 11 goes STABLE — a docs pack contradicting the installed
# major is worse than no pack.
# HARD ADOPTION CONDITION (recorded here so a partial integration fails loud):
# this source ships only if the 3D asset shelf (vendor/assets-3d/, HDRI tier
# minimum) lands in the same wave — drei Environment presets fetch raw.githack
# at RUNTIME by default (CUBEMAP_ROOT in core/useEnvironment.js), and without
# local HDRIs the card's trap fix has nothing to point at.
sync_r3f_drei() {
  local d="$VENDOR/r3f-drei"
  say "r3f + drei: llms-full.txt docs pack (grep-only) — card audited at r3f $R3F_FIBER_DOCS_VERSION / drei $DREI_DOCS_VERSION"

  # stage in $TMP; the live vendor dir is replaced only after every gate passes
  local stage="$TMP/r3f-drei-stage"
  rm -rf "$stage"; mkdir -p "$stage"

  fetch "https://r3f.docs.pmnd.rs/llms-full.txt" "$stage/r3f-llms-full.txt" \
    || { fail "r3f-drei: r3f llms-full.txt fetch (keeping previous copy)"; return; }
  fetch "https://drei.docs.pmnd.rs/llms-full.txt" "$stage/drei-llms-full.txt" \
    || { fail "r3f-drei: drei llms-full.txt fetch (keeping previous copy)"; return; }

  # gates: byte floors (audit 2026-08-03: 168,170 / 206,334 B), non-HTML
  # content (a docs-host outage page must never replace the text artifact),
  # first-line identity markers, and page-count floors (audit: 20 / 134 pages).
  local r3f_bytes drei_bytes
  r3f_bytes=$(wc -c < "$stage/r3f-llms-full.txt" | tr -d ' ')
  drei_bytes=$(wc -c < "$stage/drei-llms-full.txt" | tr -d ' ')
  [ "$r3f_bytes" -ge 150000 ] \
    || { fail "r3f-drei: r3f artifact ${r3f_bytes}B (<150KB floor; audit: 168,170B) — keeping previous copy"; return; }
  [ "$drei_bytes" -ge 190000 ] \
    || { fail "r3f-drei: drei artifact ${drei_bytes}B (<190KB floor; audit: 206,334B) — keeping previous copy"; return; }
  local f
  for f in "$stage/r3f-llms-full.txt" "$stage/drei-llms-full.txt"; do
    head -c 512 "$f" | grep -qi '<!doctype\|<html' \
      && { fail "r3f-drei: $(basename "$f") is an HTML page, not the text export — keeping previous copy"; return; }
  done
  head -c 100 "$stage/r3f-llms-full.txt" | grep -q "React Three Fiber" \
    || { fail "r3f-drei: r3f artifact lost its identity header — keeping previous copy"; return; }
  head -c 100 "$stage/drei-llms-full.txt" | grep -q "Drei" \
    || { fail "r3f-drei: drei artifact lost its identity header — keeping previous copy"; return; }
  local r3f_pages drei_pages
  r3f_pages=$(grep -c '<page ' "$stage/r3f-llms-full.txt" || true)
  drei_pages=$(grep -c '<page ' "$stage/drei-llms-full.txt" || true)
  [ "${r3f_pages:-0}" -ge 15 ] \
    || { fail "r3f-drei: r3f artifact has $r3f_pages <page> blocks (<15 floor; audit: 20) — keeping previous copy"; return; }
  [ "${drei_pages:-0}" -ge 100 ] \
    || { fail "r3f-drei: drei artifact has $drei_pages <page> blocks (<100 floor; audit: 134) — keeping previous copy"; return; }
  # routing-critical content: the staging grammar (Environment et al.) is the
  # reason this pack exists — a reshaped export without it must not land.
  grep -q 'path="/staging/environment"' "$stage/drei-llms-full.txt" \
    || { fail "r3f-drei: drei artifact lost /staging/environment — reshaped export, keeping previous copy"; return; }

  # staleness pin: no upstream version stamp exists, so sync date + byte sizes
  # ARE the drift detector (tailark PIN.json precedent); docs_valid_at records
  # the versions the card's pins-and-traps content was audited against.
  jq -n --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --arg r3f "$R3F_FIBER_DOCS_VERSION" --arg drei "$DREI_DOCS_VERSION" \
        --argjson r3fb "$r3f_bytes" --argjson dreib "$drei_bytes" \
        '{synced_at: $date,
          artifacts: {
            "r3f-llms-full.txt": {url: "https://r3f.docs.pmnd.rs/llms-full.txt", bytes: $r3fb},
            "drei-llms-full.txt": {url: "https://drei.docs.pmnd.rs/llms-full.txt", bytes: $dreib}},
          docs_valid_at: {r3f: $r3f, drei: $drei,
            react_peer: ">=19 <19.3 (r3f 9.7.0 peerDependencies — silent floor AND ceiling)",
            note: "re-sync + re-audit sources/r3f-drei.md when drei 11 goes stable; never take 11.x alphas"}}' \
    > "$stage/PIN.json" \
    || { fail "r3f-drei: PIN.json write"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "r3f + drei: 2 doc artifacts ($r3f_bytes + $drei_bytes bytes, $r3f_pages + $drei_pages pages) + PIN.json vendored (grep-only)"
}

# ---------------------------------------------------------------- main
ALL_SOURCES=(magicui kokonutui reactbits motion-primitives gsap motion lenis phosphor animista vanta shadergradient recent layers radix-colors paper-shaders svgl review-packs tailark origin fancy atropos curtains model-viewer assets-3d media-chrome vfx-js noise r3f-drei)
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
    radix-colors)       sync_radix_colors ;;
    paper-shaders)      sync_paper_shaders ;;
    svgl)               sync_svgl ;;
    review-packs)       sync_review_packs ;;
    tailark)            sync_tailark ;;
    origin)             sync_origin ;;
    fancy)              sync_fancy ;;
    atropos)            sync_atropos ;;
    curtains)           sync_curtains ;;
    model-viewer)       sync_model_viewer ;;
    assets-3d)          sync_assets_3d ;;
    media-chrome)       sync_media_chrome ;;
    vfx-js)             sync_vfx_js ;;
    noise)              sync_noise ;;
    r3f-drei)           sync_r3f_drei ;;
    *) warn "unknown source: $s" ;;
  esac
done

# manifest
jq -n --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      --arg phosphor "$PHOSPHOR_CORE_VERSION" --arg lenis "$LENIS_VERSION" \
      --arg radix_colors "$RADIX_COLORS_VERSION" --arg paper_shaders "$PAPER_SHADERS_VERSION" \
      --arg axe "$AXE_CORE_VERSION" --arg tailark_blocks "$TAILARK_BLOCKS_SHA" \
      --arg origin_coss "$ORIGIN_COSS_SHA" --arg fancy_commit "$FANCY_COMMIT" \
      --arg atropos "$ATROPOS_VERSION" --arg curtains "$CURTAINS_VERSION" --arg curtains_commit "$CURTAINS_COMMIT" \
      --arg model_viewer "$MODEL_VIEWER_VERSION" --arg khronos_gltf "$KHRONOS_GLTF_SHA" \
      --arg media_chrome "$MEDIA_CHROME_VERSION" --arg player_style "$PLAYER_STYLE_SHA" \
      --arg vfx_js "$VFX_JS_VERSION" --arg noise_webgl "$NOISE_WEBGL_SHA" --arg noise_psrd "$NOISE_PSRD_SHA" \
      --arg drei_docs "$DREI_DOCS_VERSION" --arg r3f_docs "$R3F_FIBER_DOCS_VERSION" \
      --argjson failures "$(printf '%s\n' "${FAILURES[@]:-}" | jq -R . | jq -s 'map(select(length>0))')" \
      '{synced_at: $date, pinned: {phosphor_core: $phosphor, lenis: $lenis, radix_colors: $radix_colors, paper_shaders: $paper_shaders, axe_core: $axe, tailark_blocks: $tailark_blocks, origin_coss: $origin_coss, fancy_commit: $fancy_commit, atropos: $atropos, curtains: $curtains, curtains_commit: $curtains_commit, model_viewer: $model_viewer, khronos_gltf: $khronos_gltf, media_chrome: $media_chrome, player_style: $player_style, vfx_js: $vfx_js, noise_webgl: $noise_webgl, noise_psrd: $noise_psrd, drei_docs: $drei_docs, r3f_docs: $r3f_docs}, failures: $failures}' \
  > "$VENDOR/MANIFEST.json"

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  warn "sync finished with ${#FAILURES[@]} failure(s):"
  printf '  - %s\n' "${FAILURES[@]}" >&2
  exit 1
fi
say "sync complete — all sources vendored under $VENDOR"
