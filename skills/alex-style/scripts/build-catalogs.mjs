#!/usr/bin/env node
// alex-style catalog builder — distills vendor/ into grep-able TSV indexes at vendor/_index/.
// Re-run after every sync.sh. No dependencies, pure Node.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = dirname(dirname(fileURLToPath(import.meta.url)));
const V = join(SKILL, 'vendor');
const OUT = join(V, '_index');
mkdirSync(OUT, { recursive: true });

const clean = (s) => (s ?? '').toString().replace(/[\t\n\r]+/g, ' ').trim();
const tsv = (rows) => rows.map((r) => r.map(clean).join('\t')).join('\n') + '\n';
const write = (name, header, rows) => {
  writeFileSync(join(OUT, name), `# ${header}\n` + tsv(rows));
  console.log(`${name}: ${rows.length} rows`);
};
const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'));

// ---------------------------------------------------------------- components.tsv
{
  const rows = [];
  const push = (source, name, title, desc, deps, regDeps, file) =>
    rows.push([source, name, title, desc, (deps ?? []).join(','), (regDeps ?? []).join(','), file]);

  const magic = readJSON(join(V, 'magicui/registry.json'));
  for (const it of magic.items.filter((i) => i.type === 'registry:ui'))
    push('magicui', it.name, it.title ?? it.name, it.description, it.dependencies, it.registryDependencies,
      `vendor/magicui/r/${it.name}.json`);

  const koko = readJSON(join(V, 'kokonutui/registry.json'));
  const kokoNames = new Set(koko.items.map((i) => i.name));
  for (const it of koko.items)
    push('kokonutui', it.name, it.title ?? it.name, it.description, it.dependencies, it.registryDependencies,
      `vendor/kokonutui/r/${it.name}.json`);
  // extra published components fetched beyond the index
  for (const f of readdirSync(join(V, 'kokonutui/r'))) {
    const name = f.replace(/\.json$/, '');
    if (kokoNames.has(name)) continue;
    try {
      const it = readJSON(join(V, 'kokonutui/r', f));
      push('kokonutui', name, it.title ?? name, it.description, it.dependencies, it.registryDependencies,
        `vendor/kokonutui/r/${f}`);
    } catch { /* skip non-item files */ }
  }

  const rb = readJSON(join(V, 'reactbits/registry.json'));
  for (const it of rb.items.filter((i) => i.name.endsWith('-TS-TW')))
    push('reactbits', it.name, it.title ?? it.name.replace(/-TS-TW$/, ''), it.description,
      it.dependencies, it.registryDependencies, `vendor/reactbits/r/${it.name}.json`);

  const mp = readJSON(join(V, 'motion-primitives/registry.json'));
  for (const it of mp.items)
    push('motion-primitives', it.name, it.title ?? it.name, it.description, it.dependencies,
      it.registryDependencies, `vendor/motion-primitives/core/${it.name}.tsx`);

  // ---------------------------------------------------------------- fancy
  // *** SPLICE SNIPPET — this block lives INSIDE the components.tsv block of
  // build-catalogs.mjs, immediately BEFORE its write('components.tsv', ...)
  // call. It uses that block's push() helper and `rows` array (plus the
  // top-level V/join/existsSync/readJSON). Do NOT give fancy its own TSV:
  // the 8 curated items are deliberately indexed beside the other component
  // sources so one grep finds them — reached intentionally via the `wild:`
  // description prefix (sources/fancy.md is law: one showpiece per page,
  // banned from dashboards per recipes.md #dashboard-shell). ***
  {
    // Must mirror the `components` array in sync_fancy(). Support hooks/utils
    // (calculate-position, svg-path-to-vertices, use-*) are registry_deps,
    // NOT rows — indexing them would pollute component grep with non-components.
    // Upstream descriptions are useless ("A ui component.") — curated routing
    // text lives HERE as data, every one wild:-prefixed (adoption mandate).
    const FANCY_DESC = {
      'gravity':
        'wild: physics gravity playground — any React child becomes a falling/draggable matter-js body (words, chips, logos, svg); PRIMARY for physics/falling/draggable (reactbits FallingText demoted: uncancelled rAF + double engine-step defects)',
      'cursor-attractor-and-gravity':
        'wild: physics attractor — matter-js bodies gravitate toward the cursor or an attractor point; pointer-based, needs a touch fallback on mobile',
      'elastic-line':
        'wild: elastic svg line that bends toward the pointer and springs back on release — section divider / footer flourish',
      'gooey-svg-filter':
        'wild: gooey liquid metaball SVG filter primitive for morphing menus, nav blobs, pixel trails — NO Safari support, feature-gate + static fallback mandatory',
      'pixelate-svg-filter':
        'wild: pixelate mosaic 8-bit SVG filter primitive — retro pixelation of any element, text or image — NO Safari support, feature-gate + static fallback mandatory',
      'text-along-path':
        'wild: text flowing along an arbitrary svg path — curved or circular text, auto-loop or scroll-driven offset',
      'element-along-svg-path':
        'wild: react elements traveling along an svg path — auto or scroll-driven progress, pause on hover',
      'marquee-along-svg-path':
        'wild: infinite marquee / logo ticker along a curved svg path — draggable, scroll-velocity aware, rolling z-index',
    };
    const before = rows.length;
    for (const [name, desc] of Object.entries(FANCY_DESC)) {
      const p = join(V, 'fancy/r', `${name}.json`);
      // fail loud: a missing curated item means a broken vendor dir — a silently
      // thinner index is worse than a build failure
      if (!existsSync(p)) throw new Error(`fancy: curated item ${name} missing from vendor/fancy/r — run: bash scripts/sync.sh fancy`);
      const it = readJSON(p);
      const regDeps = it.registryDependencies ?? [];
      // never index an unpatched copy: live-site URLs would route agents/CLIs
      // back to upstream's defective payloads (the whole point of the fork)
      if (regDeps.some((u) => /fancycomponents\.dev/.test(u)))
        throw new Error(`fancy: ${name} registryDependencies still point at the live site — sync patch 1 missing; refusing to index an unpatched copy`);
      if (!it._vendoredFrom)
        throw new Error(`fancy: ${name} lacks the _vendoredFrom stamp — copy bypassed sync_fancy (unpatched); re-run: bash scripts/sync.sh fancy`);
      // these five MUST carry in-content patch markers (physics: poly-decomp ESM
      // + lodash.debounce; path trio: use-client) — gooey/pixelate are zero-patch
      if (['gravity', 'cursor-attractor-and-gravity', 'text-along-path', 'element-along-svg-path', 'marquee-along-svg-path'].includes(name)
          && !(it.files?.[0]?.content ?? '').includes('PATCHED(alex-style)'))
        throw new Error(`fancy: ${name} payload lacks its PATCHED(alex-style) markers — vendor copy is not the patched fork`);
      // registry_deps column carries LOCAL vendored paths (vendor/fancy/r/*.json),
      // not shadcn part names — sources/fancy.md documents the difference
      push('fancy', name, it.title ?? name, desc, it.dependencies, regDeps, `vendor/fancy/r/${name}.json`);
    }
    if (rows.length - before !== 8)
      throw new Error(`fancy: expected exactly 8 curated rows, pushed ${rows.length - before}`);
  }
  write('components.tsv', 'source	name	title	description	npm_deps	registry_deps	vendored_file', rows);
}

// ---------------------------------------------------------------- icons.tsv
{
  const src = readFileSync(join(V, 'phosphor/icons.ts'), 'utf8');
  const rows = [];
  // anchor at top-level array entries (4-space indent) so nested `alias:` objects don't match;
  // an optional `alias:` line may sit between pascal_name and categories
  const entryRe = /\n {4}name: "([^"]+)",\n {4}pascal_name: "([^"]+)",(?:\n {4}alias: \{ name: "([^"]+)"[^}]*\},)?\n {4}categories:\s*\[([^\]]*)\][\s\S]*?\n {4}tags: \[([\s\S]*?)\]/g;
  let m;
  while ((m = entryRe.exec(src))) {
    const cats = m[4].replace(/IconCategory\./g, '').replace(/\s+/g, '').toLowerCase();
    const tags = [...m[5].matchAll(/"([^"]+)"/g)].map((t) => t[1]).filter((t) => t !== '*new*' && t !== '*updated*');
    if (m[3]) tags.push(`alias:${m[3]}`);
    rows.push([m[1], m[2], cats, tags.join(',')]);
  }
  write('icons.tsv', 'name	pascal_name	categories	tags', rows);
}

// ---------------------------------------------------------------- animista.tsv
{
  const rows = [];
  const seen = new Set();
  const metaRoot = join(V, 'animista/meta');
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.ts') && e.name !== 'index.ts' ? [join(dir, e.name)] : []);
  if (existsSync(metaRoot)) {
    for (const file of walk(metaRoot)) {
      const src = readFileSync(file, 'utf8');
      const category = dirname(file).split('/').pop();
      const family = file.split('/').pop().replace(/\.ts$/, '');
      const duration = src.match(/duration\s*=\s*'([^']+)'/)?.[1] ?? '';
      const easing = src.match(/timingFns\s*=\s*'([^']+)'/)?.[1] ?? '';
      const mode = src.match(/mode\s*=\s*'([^']+)'/)?.[1] ?? '';
      for (const km of src.matchAll(/'([a-z0-9-]+)':\s*'\{/g)) {
        rows.push([km[1], family, category, duration, easing, mode]);
        seen.add(km[1]);
      }
    }
  }
  // names present in the full keyframes dump but missing from meta
  const css = readFileSync(join(V, 'animista/keyframes.css'), 'utf8');
  for (const km of css.matchAll(/@(?:-webkit-)?keyframes\s+([a-zA-Z0-9-]+)/g))
    if (!seen.has(km[1])) { rows.push([km[1], '', '', '', '', '']); seen.add(km[1]); }
  write('animista.tsv', 'animation	family	category	default_duration	default_easing	default_fill_mode', rows);
}

// ---------------------------------------------------------------- vanta.tsv
{
  const rows = [];
  const srcDir = join(V, 'vanta/src');
  for (const f of readdirSync(srcDir).filter((f) => /^vanta\.[a-z0-9]+\.js$/.test(f))) {
    const effect = f.match(/^vanta\.([a-z0-9]+)\.js$/)[1];
    const src = readFileSync(join(srcDir, f), 'utf8');
    const m = src.match(/defaultOptions\s*=\s*\{([\s\S]*?)\n\s*\}/)
      ?? src.match(/getDefaultOptions\s*\(\)\s*\{[\s\S]*?return\s*\{([\s\S]*?)\n\s*\}/); // halo-style
    const opts = m
      ? m[1].replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').replace(/,\s*$/, '').trim()
      : '';
    rows.push([effect, `vendor/vanta/dist/vanta.${effect}.min.js`, opts.slice(0, 400)]);
  }
  write('vanta.tsv', 'effect	dist_file	default_options', rows);
}

// ---------------------------------------------------------------- shadergradient-presets.tsv
{
  const src = readFileSync(join(V, 'shadergradient/presets.ts'), 'utf8');
  const rows = [];
  // shape: presets = { key: { title: '...', props: { ... } }, ... }
  const KEYS = ['type', 'animate', 'color1', 'color2', 'color3', 'uSpeed', 'uDensity', 'uStrength',
    'uAmplitude', 'brightness', 'grain', 'lightType', 'envPreset', 'reflection'];
  for (const m of src.matchAll(/\n {2}([a-zA-Z0-9_]+): \{\n {4}title: '([^']+)'([\s\S]*?)\n {2}\},/g)) {
    const body = m[3];
    const props = KEYS.flatMap((k) => {
      const pm = body.match(new RegExp(`\\b${k}: ('[^']*'|[-\\d.]+)`));
      return pm ? [`${k}=${pm[1].replace(/'/g, '')}`] : [];
    });
    rows.push([m[1], m[2], props.join(' ')]);
  }
  write('shadergradient-presets.tsv', 'preset_key	title	key_props', rows);
}

// ---------------------------------------------------------------- palettes.tsv (Layers)
{
  const data = readJSON(join(V, 'layers/palettes.json'));
  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  };
  const rows = (data.palettes ?? []).map((p) => {
    const colors = (p.colors ?? []).map((c) => c.hex);
    const lums = colors.map(lum);
    // tag by usable background candidates: a near-black => works for dark UI, a near-white => light UI
    const tags = [];
    if (Math.min(...lums) < 0.18) tags.push('dark-ui');
    if (Math.max(...lums) > 0.82) tags.push('light-ui');
    return [p.id, tags.join(',') || 'accent-only', colors.join(',')];
  });
  write('palettes.tsv', 'palette_id	ui_fit	hex_colors (5-6 per palette)', rows);
}

// ---------------------------------------------------------------- inspiration.tsv (recent + layers shots)
{
  const rows = [];
  const jsonl = (p) => existsSync(p)
    ? readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  const catName = (c) => (typeof c === 'object' && c !== null ? c.slug ?? c.name ?? '' : c ?? '');
  for (const it of jsonl(join(V, 'recent/items.all.jsonl')))
    rows.push(['recent', it.format ?? '', catName(it.category), it.title, it.description ?? it.tagline ?? '', it.source ?? '']);
  for (const s of jsonl(join(V, 'layers/shots.jsonl')))
    rows.push(['layers', 'shot', '', s.title ?? '', s.description ?? '', s.imageUrl ?? '']);
  write('inspiration.tsv', 'origin	format	category	title	description	source_url', rows);
}

// ---------------------------------------------------------------- recent tools & skills tables
{
  const jsonl = (p) => existsSync(p)
    ? readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  const mdEsc = (s) => clean(s).replace(/\|/g, '\\|');
  const tools = jsonl(join(V, 'recent/items.tools.jsonl'));
  const skills = jsonl(join(V, 'recent/items.skills.jsonl'));
  let md = '# Curated design tools & agent skills (from recent.design)\n\n## Agent skills\n\n| Skill | Description | Install | GitHub |\n|---|---|---|---|\n';
  for (const s of skills)
    md += `| ${mdEsc(s.title)} | ${mdEsc(s.description ?? s.tagline)} | \`${clean(s.installCommand)}\` | ${clean(s.githubUrl)} (${s.githubStars ?? '?'}★) |\n`;
  md += '\n## Tools\n\n| Tool | Description |\n|---|---|\n';
  for (const t of tools) md += `| ${mdEsc(t.title)} | ${mdEsc(t.description ?? t.tagline)} |\n`;
  writeFileSync(join(OUT, 'recent-tools-skills.md'), md);
  console.log(`recent-tools-skills.md: ${skills.length} skills, ${tools.length} tools`);
}

// ---------------------------------------------------------------- radix-colors.tsv
{
  const cssDir = join(V, 'radix-colors/css');
  // Designated gray pairing, verified from radix-ui/themes getMatchingGrayColor()
  // (docs' Natural-pairing table + gold/bronze→sand which the docs table omits).
  const GRAY_PAIR = {
    tomato: 'mauve', red: 'mauve', ruby: 'mauve', crimson: 'mauve',
    pink: 'mauve', plum: 'mauve', purple: 'mauve', violet: 'mauve',
    iris: 'slate', indigo: 'slate', blue: 'slate', sky: 'slate', cyan: 'slate',
    mint: 'sage', teal: 'sage', jade: 'sage', green: 'sage',
    grass: 'olive', lime: 'olive',
    yellow: 'sand', amber: 'sand', orange: 'sand', brown: 'sand', gold: 'sand', bronze: 'sand',
  };
  const ROLE = (s) => (s <= 2 ? 'app-bg' : s <= 5 ? 'component-state' : s <= 8 ? 'border' : s <= 10 ? 'solid-accent' : 'text');
  const GRAYS = new Set(['gray', 'mauve', 'slate', 'sage', 'olive', 'sand']);
  // step -> hex from the plain-hex :root block (p3/alpha values never match this regex)
  const parseScale = (file) => {
    const out = {};
    for (const m of readFileSync(join(cssDir, file), 'utf8').matchAll(/--[a-z]+-(\d+):\s*(#[0-9a-fA-F]{6});/g))
      out[Number(m[1])] ??= m[2].toLowerCase();
    return out;
  };
  // WCAG relative luminance → contrast vs white; step9_foreground=dark when < 3.0
  // (mechanically prevents the sky/mint/lime/yellow/amber white-text trap, measured to 1.26:1)
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const whiteContrast = (hex) => 1.05 / (lum(hex) + 0.05);
  const scales = readdirSync(cssDir)
    .filter((f) => /^[a-z]+\.css$/.test(f)) // 31 solid scales; excludes -dark/-alpha and black/white alpha
    .map((f) => f.replace(/\.css$/, ''))
    .sort();
  const rows = [];
  for (const scale of scales) {
    const light = parseScale(`${scale}.css`);
    const dark = parseScale(`${scale}-dark.css`);
    const fg9 = whiteContrast(light[9]) < 3.0 ? 'dark' : 'white';
    for (let step = 1; step <= 12; step++) {
      if (!light[step] || !dark[step]) throw new Error(`radix-colors: ${scale} step ${step} missing a hex`);
      rows.push([scale, step, light[step], dark[step], ROLE(step), GRAYS.has(scale) ? '-' : GRAY_PAIR[scale], fg9]);
    }
  }
  if (rows.length !== 31 * 12) throw new Error(`radix-colors: expected 372 rows, got ${rows.length} — refusing to write a bad index`);
  write('radix-colors.tsv', 'scale	step	light_hex	dark_hex	semantic_role	gray_pairing	step9_foreground', rows);
}

// ---------------------------------------------------------------- paper-shaders.tsv
{
  const rows = [];
  const shaderDir = join(V, 'paper-shaders/dist/shaders');
  const docsDir = join(V, 'paper-shaders/docs/shaders');
  // params that ShaderMount handles generically — kept out of key_params (speed gets its own column)
  const SIZING = new Set(['fit', 'scale', 'rotation', 'offsetX', 'offsetY', 'originX', 'originY',
    'worldWidth', 'worldHeight', 'speed', 'frame', 'style']);
  // curated mood/use-case tags (not derivable from upstream data)
  const MOODS = {
    'color-panels': 'hero,pseudo-3d,vibrant,brand',
    'dithering': 'retro-print,texture,lofi,ambient',
    'dot-grid': 'texture,pattern,subtle,dashboard-safe',
    'dot-orbit': 'pattern,playful,energetic',
    'fluted-glass': 'image-filter,glass,elegant,editorial',
    'gem-smoke': 'ambient,smoke,luxury,dark-mode',
    'god-rays': 'hero,dramatic,light,atmospheric',
    'grain-gradient': 'ambient,gradient,texture,hero',
    'halftone-cmyk': 'retro-print,image-filter,editorial',
    'halftone-dots': 'retro-print,image-filter,editorial,comic',
    'heatmap': 'sci-fi,data-glow,image-filter,dark-mode',
    'image-dithering': 'retro-print,image-filter,pixel-art,lofi',
    'liquid-metal': 'liquid,metallic,futuristic,hero',
    'mesh-gradient': 'ambient,gradient,hero,organic',
    'metaballs': 'liquid,playful,organic,blob',
    'neuro-noise': 'ambient,sci-fi,network,dark-mode',
    'paper-texture': 'texture,print,subtle,paper',
    'perlin-noise': 'texture,organic,generative',
    'pulsing-border': 'accent,glow,frame,cta',
    'simplex-noise': 'ambient,gradient,organic',
    'smoke-ring': 'ambient,smoke,organic,dark-mode',
    'spiral': 'hypnotic,retro,graphic',
    'static-mesh-gradient': 'gradient,hero,zero-cost,ambient',
    'static-radial-gradient': 'gradient,hero,zero-cost',
    'swirl': 'retro,graphic,vibrant,candy',
    'voronoi': 'pattern,cellular,tech',
    'warp': 'ambient,gradient,liquid,dreamy',
    'water': 'liquid,organic,ambient,caustics',
    'waves': 'pattern,line-art,subtle,texture',
  };
  for (const f of readdirSync(shaderDir).filter((f) => f.endsWith('.js')).sort()) {
    const name = f.replace(/\.js$/, '');
    const docFile = join(docsDir, `${name}.md`);
    let desc = '', params = '', presets = '', anim;
    if (existsSync(docFile)) {
      const md = readFileSync(docFile, 'utf8');
      desc = md.match(/\n# [^\n]+\n\n> ([^\n]+)\n/)?.[1] ?? '';
      // <ParamField path="x" type="y" default="z"> — skip generic sizing params
      params = [...md.matchAll(/<ParamField path="([^"]+)"(?: type="[^"]*")?(?: default="([^"]*)")?/g)]
        .filter((m) => !SIZING.has(m[1]))
        .map((m) => (m[2] !== undefined ? `${m[1]}=${m[2]}` : m[1]))
        .join(' ').slice(0, 400);
      // animated iff the speed param defaults above 0; default=0 or absent = static out of the box
      const speedDefault = md.match(/path="speed" type="number" default="([^"]*)"/)?.[1];
      anim = speedDefault === undefined ? 'static (no speed param)'
        : parseFloat(speedDefault) > 0 ? 'animated (speed=0 → zero-cost static frame)'
        : 'static-default (speed=0 built in)';
      const presetSection = md.match(/\n## Presets\n([\s\S]*?)(\n## |$)/)?.[1] ?? '';
      presets = [...presetSection.matchAll(/\n### (.+)/g)].map((m) => m[1]).join(',');
    } else {
      // gem-smoke has no upstream doc page — derive from the dist source
      const src = readFileSync(join(shaderDir, f), 'utf8');
      const infra = new Set(['u_resolution', 'u_time', 'u_image', 'u_imageAspectRatio', 'u_isImage', 'u_colorsCount']);
      params = [...new Set([...src.matchAll(/u_([a-zA-Z]+)/g)].map((m) => `u_${m[1]}`))]
        .filter((u) => !infra.has(u)).map((u) => u.slice(2)).join(' ');
      anim = /u_time/.test(src.split('fragColor')[1] ?? src)
        ? 'animated (speed=0 → zero-cost static frame)' : 'static (no speed param)';
      desc = '(no upstream doc page — params derived from dist source)';
    }
    rows.push([name, params, anim, MOODS[name] ?? '', presets, desc,
      `vendor/paper-shaders/dist/shaders/${name}.js`,
      existsSync(docFile) ? `vendor/paper-shaders/docs/shaders/${name}.md` : '']);
  }
  if (rows.length < 29) throw new Error(`paper-shaders.tsv: only ${rows.length} shaders found (want >=29) — bad vendor dir?`);
  write('paper-shaders.tsv', 'shader	key_params	animated_vs_static	mood_tags	presets	description	dist_file	doc_file', rows);
}

// ---------------------------------------------------------------- logos.tsv (SVGL)
{
  const data = readJSON(join(V, 'svgl/index.json'));
  const base = (u) => (u ?? '').toString().split('/').pop() ?? '';
  const pair = (r) => (typeof r === 'object' && r !== null ? [base(r.light), base(r.dark)] : [base(r), '']);
  const rows = [];
  const seen = new Map(); // slug -> light file (upstream carries literal duplicate entries, e.g. pycharm ids 360/365)
  let missing = 0;
  for (const it of data) {
    const [light, dark] = pair(it.route);
    const [wLight, wDark] = it.wordmark ? pair(it.wordmark) : ['', ''];
    const name = light.replace(/\.svg$/, '').replace(/[-_]light$/, ''); // aws_light.svg -> aws; nvidia-icon-light.svg -> nvidia-icon
    if (seen.get(name) === light) continue; // exact duplicate brand row — keep one
    seen.set(name, light);
    for (const f of [light, dark, wLight, wDark])
      if (f && !existsSync(join(V, 'svgl/library', f))) missing++;
    rows.push([name, it.title, Array.isArray(it.category) ? it.category.join(',') : it.category,
      light, dark, wLight, wDark, it.brandUrl ?? '']);
  }
  // fail-loud: a broken/truncated index must never overwrite a good TSV (filenames are unguessable without it)
  if (rows.length < 500) throw new Error(`logos.tsv: only ${rows.length} rows (<500 floor) — svgl index is broken, refusing to write`);
  if (missing > 0) console.warn(`logos.tsv WARNING: ${missing} referenced SVGs missing from vendor/svgl/library — re-run: bash scripts/sync.sh svgl`);
  write('logos.tsv', 'name	title	category	route_light	route_dark	wordmark_light	wordmark_dark	brand_url', rows);
}

// ---------------------------------------------------------------- review-rules.tsv (review-packs / axe-core)
{
  const md = readFileSync(join(V, 'review-packs/axe/rule-descriptions.md'), 'utf8');
  const allow = new Set(readJSON(join(V, 'review-packs/axe/allowlist.json')).runOnly.values);
  if (allow.size !== 22)
    throw new Error(`review-rules: allowlist has ${allow.size} rules — the closed set is exactly 22`);
  const unentity = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const rows = [];
  // table rows: | [rule-id](deque-url) | description | impact | tags | issue type | ACT |
  for (const line of md.split('\n')) {
    const m = line.match(/^\| \[([a-z0-9-]+)\]/);
    if (!m) continue;
    const c = line.split('|').map((s) => s.trim()); // c[2]=description c[3]=impact c[4]=tags
    rows.push([m[1], c[3], c[4].replace(/,\s+/g, ','), unentity(c[2]), allow.has(m[1]) ? 'yes' : 'no']);
  }
  // fail loud — a short/empty index here would silently gut the Phase 4 axe pass
  if (rows.length < 100)
    throw new Error(`review-rules: parsed only ${rows.length} rules — rule-descriptions.md format changed?`);
  const ids = new Set(rows.map((r) => r[0]));
  for (const id of allow)
    if (!ids.has(id)) throw new Error(`review-rules: allowlisted '${id}' absent from rule-descriptions.md — engine/doc version skew`);
  write('review-rules.tsv', 'rule_id	impact	wcag_tags	description	in_allowlist', rows);
}

// ---------------------------------------------------------------- sections.tsv (Tailark)
// DEDICATED class-scoped index (judge mandate) — marketing sections live here,
// NEVER in components.tsv: "pricing" must not surface three kits plus component
// hits in one grep, and the kit column is what makes the one-kit-per-project
// law enforceable at grep time.
{
  const dir = join(V, 'tailark');
  const reg = readJSON(join(dir, 'registry.json'));
  // Bundled dupes are excluded from vendor/ by sync (they already live at
  // vendor/motion-primitives/core/*.tsx and vendor/magicui/r/border-beam.json)
  // but stay in the dep graph so their npm deps (motion) roll up into blocks.
  const DUPES = new Set(['motion-primitives-animated-group', 'motion-primitives-infinite-slider',
    'motion-primitives-progressive-blur', 'motion-primitives-text-effect', 'magic-ui-border-beam']);
  // Heavy deps are flag-with-tag, never silently dropped (judge allows either;
  // flagging keeps the catalog honest about what exists). swiper/three ship in
  // the repo package.json but touch no radix payload today — scanned anyway so
  // a future pin can't sneak them in unflagged.
  const HEAVY = new Set(['recharts', 'dotted-map', 'swiper', 'three']);
  const byName = new Map(reg.items.map((i) => [i.name, i]));
  const npmClosure = (name, seen = new Set()) => {
    if (seen.has(name)) return new Set();
    seen.add(name);
    const it = byName.get(name);
    if (!it) throw new Error(`sections.tsv: registryDependency '${name}' missing from registry.json — closure broken, refusing to write`);
    const out = new Set(it.dependencies ?? []);
    for (const dep of it.registryDependencies ?? [])
      for (const d of npmClosure(dep.replace(/^@tailark-oss\//, ''), seen)) out.add(d);
    return out;
  };
  const rows = [];
  for (const it of reg.items) {
    if (it.type !== 'registry:block' && it.type !== 'registry:page') continue;
    const kit = it.name.split('-')[0];
    if (!['dusk', 'mist', 'veil'].includes(kit))
      throw new Error(`sections.tsv: '${it.name}' has unknown kit '${kit}' — upstream naming changed, refusing to write`);
    const category = it.type === 'registry:page'
      ? 'full-page'
      : it.name.replace(/^(dusk|mist|veil)-/, '').replace(/-\d+$/, '');
    const payload = `tailark/r/${it.name}.json`;
    if (!existsSync(join(V, payload)))
      throw new Error(`sections.tsv: payload ${payload} not vendored — re-run: bash scripts/sync.sh tailark`);
    const deps = [...npmClosure(it.name)].sort();
    const heavy = deps.filter((d) => HEAVY.has(d));
    rows.push([it.name, kit, category, it.description ?? '', deps.join(','),
      heavy.length ? `HEAVY:${heavy.join('+')}` : '', `vendor/${payload}`]);
  }
  // fail loud — a truncated index would silently hide sections from routing
  if (rows.length < 150)
    throw new Error(`sections.tsv: only ${rows.length} rows (<150 floor; audit: 160 blocks+pages) — refusing to write`);
  for (const kit of ['dusk', 'mist', 'veil'])
    if (!rows.some((r) => r[1] === kit))
      throw new Error(`sections.tsv: kit '${kit}' has zero rows — registry reshaped, refusing to write`);
  // known-heavy at pin 8139698: dusk-features-7 + dusk-landing-4/7/9 (recharts+dotted-map).
  // If any of them is present but unflagged, the heavy detection broke — fail, don't ship a lying flag.
  for (const n of ['dusk-features-7', 'dusk-landing-4', 'dusk-landing-7', 'dusk-landing-9']) {
    const r = rows.find((x) => x[0] === n);
    if (r && !r[5]) throw new Error(`sections.tsv: ${n} should carry a HEAVY flag (recharts/dotted-map) — detection broken`);
  }
  console.log(`sections.tsv: ${rows.filter((r) => r[5]).length} heavy-flagged of ${rows.length} sections`);
  write('sections.tsv', 'name	kit	category	description	npm_deps	heavy_deps	vendored_file', rows);
}

// ============================================================================
// ORIGIN FRAGMENT for scripts/build-catalogs.mjs (Wave 2)
// Drop this block in alongside the other index blocks (uses the existing
// readJSON/write/clean helpers and V; needs `existsSync` + `join`, already
// imported at the top of build-catalogs.mjs). The licenses.tsv row for
// 'origin' ships separately in license-row.txt.
// ============================================================================

// ---------------------------------------------------------------- application-ui.tsv (Origin UI)
{
  // Dedicated CLASS-SCOPED index (judge mandate): Origin serves application/
  // form/data UI only, so it gets its own TSV instead of components.tsv —
  // its 646 utilitarian rows must never become the second-best answer inside
  // the marketing/animation grep surface.
  const reg = readJSON(join(V, 'origin/registry.json'));
  const rows = [];
  const census = { component: 0, ui: 0, hook: 0, lib: 0 };
  let navbarRows = 0, backfilled = 0;
  const missingPayloads = [];
  for (const it of reg.items) {
    const type = it.type.replace(/^registry:/, '');
    census[type] = (census[type] ?? 0) + 1;
    // TAG NORMALIZATION (judge mandate), applied at build time — never edit the
    // vendored registry.json:
    //  1. Upstream ships ONE malformed comma-joined tag string 'navbar, navigation'
    //     on all 20 navbar items; split on commas so exact-tag matching
    //     (awk -F'\t' '$3 ~ /(^|,)navbar(,|$)/') works, not just substring grep.
    //  2. 47 items (40 ui primitives, 5 hooks, 1 lib, 1 component: 'tree') carry
    //     no tags at all; backfill name-as-tag so grep routing reaches the
    //     primitives instead of leaving them invisible.
    let tags = (it.meta?.tags ?? []).flatMap((t) => t.split(',')).map((t) => t.trim()).filter(Boolean);
    if (tags.length === 0) { tags = [it.name]; backfilled++; }
    if (tags.includes('navbar')) navbarRows++;
    // upstream carries NO title/description fields — derive an honest label
    const title = type === 'component' && /^comp-\d+$/.test(it.name)
      ? `${tags.slice(0, 3).join('/')} — variant ${it.name.replace(/^comp-/, '')}`
      : `${it.name} (${type === 'ui' ? 'ui primitive' : type})`;
    if (!existsSync(join(V, 'origin/r', `${it.name}.json`))) missingPayloads.push(it.name);
    rows.push([it.name, type, tags.join(','), title, (it.dependencies ?? []).join(','),
      `vendor/origin/r/${it.name}.json`]);
  }
  // fail-loud gates: the registry is FROZEN at the pinned SHA, so these are
  // EXACT equalities, not floors — any drift means a deliberate SHA bump that
  // must re-verify counts, or a broken vendor dir. Never write a bad index.
  if (rows.length !== 646)
    throw new Error(`application-ui: ${rows.length} rows (frozen registry has exactly 646) — refusing to write`);
  if (census.component !== 600 || census.ui !== 40 || census.hook !== 5 || census.lib !== 1)
    throw new Error(`application-ui: type census ${JSON.stringify(census)} != {component:600,ui:40,hook:5,lib:1}`);
  if (navbarRows !== 20)
    throw new Error(`application-ui: ${navbarRows} rows tagged 'navbar' after normalization (want exactly 20) — malformed-tag split broke`);
  if (backfilled !== 47)
    throw new Error(`application-ui: backfilled name-as-tag on ${backfilled} rows (want exactly 47: 40 ui + 5 hook + 1 lib + 1 component)`);
  if (missingPayloads.length > 0)
    throw new Error(`application-ui: ${missingPayloads.length} rows without vendored payloads (${missingPayloads.slice(0, 5).join(', ')}…) — re-run: bash scripts/sync.sh origin`);
  write('application-ui.tsv', 'name	type	tags	description_or_title	npm_deps	payload_file', rows);
}

// ============================================================================
// ASSETS-3D FRAGMENT for scripts/build-catalogs.mjs (Wave 3)
// Drop this block in alongside the other index blocks (uses the existing
// readFileSync/existsSync/readJSON/write helpers, V and join). ONE import
// change needed at the top of build-catalogs.mjs: add `statSync` to the
// node:fs import list (byte-equality verification needs it).
// The licenses.tsv rows for 'polyhaven-assets' + 'khronos-gltf' ship
// separately in license-row.txt.
// ============================================================================

// ---------------------------------------------------------------- assets-3d.tsv (3D asset shelf)
{
  // Class-scoped index (adding-a-source.md #10): HDRIs/glbs are an ASSET shelf,
  // never rows in components.tsv. Source of truth is the ledger
  // vendor/assets-3d/assets.tsv (curation filter as data, incl. evidence-backed
  // exclusion rows — sync_assets_3d writes it and gates byte-equality at sync
  // time; this block RE-verifies bytes on disk so a hand-edited vendor dir can
  // never publish a lying index). Only status=vendored rows are indexed: the
  // core glb tier (owner sign-off, ASSETS3D_TIER=core) and the exclusion
  // evidence stay in the ledger, out of the routing surface.
  const ledgerPath = join(V, 'assets-3d/assets.tsv');
  if (!existsSync(ledgerPath))
    throw new Error('assets-3d: ledger vendor/assets-3d/assets.tsv missing — run: bash scripts/sync.sh assets-3d');
  const ledger = readFileSync(ledgerPath, 'utf8')
    .split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('\t'));
  const rows = [];
  let excluded = 0, pending = 0;
  for (const [file, kind, tags, bytes, license, , url, usage, status] of ledger) {
    if (status === 'excluded') { excluded++; continue; }
    if (status === 'core-tier-pending-signoff') { pending++; continue; }
    if (status !== 'vendored')
      throw new Error(`assets-3d: unknown ledger status '${status}' on ${file} — refusing to write`);
    const p = join(V, 'assets-3d', file);
    if (!existsSync(p))
      throw new Error(`assets-3d: ledger says ${file} is vendored but it is missing — re-run: bash scripts/sync.sh assets-3d`);
    const disk = statSync(p).size;
    // byte-equality vs the ledger (audit mandate) — a drifted asset must fail
    // loud here, never silently swap content under a stable filename
    if (String(disk) !== bytes)
      throw new Error(`assets-3d: ${file} is ${disk} bytes on disk, ledger pins ${bytes} — content drifted, refusing to index`);
    if (license !== 'CC0')
      throw new Error(`assets-3d: ${file} license '${license}' != CC0 — only CC0 assets may be indexed`);
    rows.push([`vendor/assets-3d/${file}`, kind, tags, bytes, license, url, usage]);
  }
  // shape gates: HDRI tier = exactly 2 hdri rows; SheenChair/ToyCar are either
  // vendored (core tier signed off) or pending — never missing; the 8 exclusion
  // rows are evidence and may never be dropped by a ledger rewrite.
  const hdris = rows.filter((r) => r[1] === 'hdri').length;
  const models = rows.filter((r) => r[1] === 'model').length;
  if (hdris !== 2)
    throw new Error(`assets-3d: ${hdris} vendored hdri rows (want exactly 2: venice_sunset_1k + studio_small_03_1k)`);
  if (models + pending !== 2)
    throw new Error(`assets-3d: ${models} vendored + ${pending} pending model rows (want 2 total: SheenChair/ToyCar)`);
  if (excluded !== 8)
    throw new Error(`assets-3d: ${excluded} exclusion rows (want exactly 8: DamagedHelmet, MaterialsVariantsShoe, FlightHelmet, ABeautifulGame, MosquitoInAmber, BoomBox, Lantern, WaterBottle)`);
  // license evidence must exist and still read all-CC0 for BOTH core-tier
  // models, vendored or not (the Khronos repo has no top-level license — the
  // per-model metadata.json legal[] arrays ARE the license, string "CC0" +
  // publicdomain/zero/1.0 URL, not the SPDX id)
  for (const m of ['SheenChair', 'ToyCar']) {
    const meta = readJSON(join(V, 'assets-3d/models', `${m}.metadata.json`));
    if (!Array.isArray(meta.legal) || meta.legal.length < 1
        || !meta.legal.every((e) => e.license === 'CC0' && /publicdomain\/zero\/1\.0/.test(e.licenseUrl ?? '')))
      throw new Error(`assets-3d: ${m}.metadata.json legal[] is not all-CC0 — the model may not sit on the shelf`);
  }
  write('assets-3d.tsv', 'file	kind	mood_tags	bytes	license	source_url	usage', rows);
}

// ============================================================================
// MEDIA-CHROME FRAGMENT for scripts/build-catalogs.mjs (Wave 3)
// Drop this block in alongside the other index blocks (uses the existing
// readJSON/write helpers plus V/join/existsSync/readdirSync/readFileSync, all
// already imported at the top of build-catalogs.mjs). The licenses.tsv row for
// 'media-chrome' ships separately in license-row.txt.
// ============================================================================

// ---------------------------------------------------------------- player-themes.tsv (media-chrome)
{
  // CLASS-SCOPED index (judge mandate): 'branded inline video player' routes
  // ONLY here — 3 curated player.style themes, deliberately tiny so routing
  // never mistakes a novelty theme for an answer. Mood text is curated data
  // (upstream descriptions are npm-blurb prose); the controls census is
  // extracted from each vendored template at build time so the index can never
  // claim controls a theme doesn't render.
  const THEMES = {
    minimal: 'clean thin bottom control bar, transparent controls, tooltips off — the default pick for product demos and testimonials on marketing pages',
    microvideo: 'compact overlay chrome for small inline/short-form clips — icon controls only, no time text; best at narrow widths',
    sutro: 'flagship cinematic theme (Mux) — settings/rendition/captions/playback-rate menus, chapter + preview thumbnails on the time range; the full-featured pick',
  };
  // PERMANENT EXCLUSIONS (trade-dress law, sources/media-chrome.md): if one of
  // these ever appears in the vendor dir, someone bypassed sync_media_chrome.
  const LOOKALIKES = ['notflix', 'yt', 'vimeonova', 'winamp', 'instaplay'];
  const tdir = join(V, 'media-chrome/themes');
  const present = existsSync(tdir) ? readdirSync(tdir).filter((n) => !n.startsWith('.')) : [];
  for (const n of present) {
    if (LOOKALIKES.includes(n))
      throw new Error(`player-themes: brand-lookalike theme '${n}' in vendor dir — permanently excluded on trade-dress grounds; re-run: bash scripts/sync.sh media-chrome`);
    if (!(n in THEMES))
      throw new Error(`player-themes: theme '${n}' is outside the owner-approved allowlist (minimal/microvideo/sutro) — a non-allowlisted theme reaching the index would hand routing a novelty answer; refusing to write`);
  }
  const rows = [];
  for (const [name, mood] of Object.entries(THEMES)) {
    const dir = join(tdir, name);
    // fail loud: a missing allowlisted theme means a broken vendor dir — a
    // silently thinner index is worse than a build failure
    if (!existsSync(join(dir, 'template.html')))
      throw new Error(`player-themes: allowlisted theme '${name}' missing from vendor/media-chrome/themes — run: bash scripts/sync.sh media-chrome`);
    const pkg = readJSON(join(dir, 'package.json'));
    if (pkg.license !== 'MIT')
      throw new Error(`player-themes: theme '${name}' package.json license '${pkg.license}' != MIT — refusing to index`);
    const tpl = readFileSync(join(dir, 'template.html'), 'utf8');
    const controls = [...new Set([...tpl.matchAll(/<media-([a-z-]+)/g)].map((m) => m[1]))]
      .filter((c) => c !== 'controller' && c !== 'control-bar').sort();
    if (controls.length < 5)
      throw new Error(`player-themes: theme '${name}' census found only ${controls.length} controls — template reshaped, re-audit before indexing`);
    rows.push([name, pkg.name, mood, controls.join(','), tpl.length,
      `vendor/media-chrome/themes/${name}/template.html`]);
  }
  if (rows.length !== 3)
    throw new Error(`player-themes: ${rows.length} rows (want exactly 3: the owner-approved allowlist) — refusing to write`);
  write('player-themes.tsv', 'theme	npm_pkg	mood	controls	template_bytes	template_file', rows);
}

// ============================================================================
// VFX-JS FRAGMENT for scripts/build-catalogs.mjs (Wave 3)
// Drop this block in alongside the other index blocks (uses the existing
// readFileSync/write helpers and V/join from the top of build-catalogs.mjs).
// The licenses.tsv row for 'vfx-js' ships separately in license-row.txt.
// ============================================================================

// ---------------------------------------------------------------- vfx-presets.tsv (VFX-JS)
{
  // Dedicated CLASS-SCOPED index (adding-a-source.md §10): preset effects ON
  // real DOM media route here — never into components.tsv, and never as a
  // second background answer (backgrounds stay paper-shaders/vanta/
  // shadergradient; custom-shader/DOM-synced scroll distortion is curtains.js).
  //
  // GROUND TRUTH (perf audit 2026-08-03, pinned 1.1.0): the shipped shaders
  // map in constants.js carries 23 keys — 22 effect presets + the 'none'
  // identity copy shader. That is MORE than the docs claim (and more than the
  // gate audit's 17): rgbGlitch, invert, grayscale, vignette and chromatic
  // ship undocumented. The curated META below is the filter as data; the
  // parser fail-louds in BOTH directions so a version bump that adds or
  // removes presets forces a deliberate re-curation, never a silent drift.
  const src = readFileSync(join(V, 'vfx-js/lib/esm/constants.js'), 'utf8');
  const body = src.match(/export const shaders = \{([\s\S]*)\n\};/)?.[1];
  if (!body) throw new Error('vfx-presets: shaders map not found in constants.js — upstream reshaped, refusing to write');
  const shipped = [...body.matchAll(/\n    ([a-zA-Z0-9]+):/g)].map((m) => m[1]);

  // columns: class (closed set: media-fx|motion-fx|transition) / character /
  // animation (continuous = time-driven every frame; static = no time term,
  // zero motion; static-at-speed-0 = animated cycle, freezes at speed:0;
  // enter-leave = driven by viewport enter/leave uniforms only) /
  // uniform_params (custom uniforms read from the GLSL; '-' = time/mouse
  // plumbing only) / mobile_safe (audit judgment: yes | caution | no) /
  // use_case tags. text-headline-EXPERIMENTAL tags the presets sanctioned
  // for the experimental text mode — single headlines only, never body copy.
  const META = {
    uvGradient: ['media-fx', 'animated UV-gradient fill masked by element alpha', 'continuous', '-', 'yes', 'logo-tint,text-headline-EXPERIMENTAL,brand-moment'],
    rainbow: ['media-fx', 'hue-cycling colorize over luminance', 'continuous', '-', 'yes', 'logo-tint,playful-accent,text-headline-EXPERIMENTAL'],
    glitch: ['media-fx', 'broken-signal glitch: scanline tears + chromatic aberration bursts', 'continuous', '-', 'caution (up to 9 texture taps in bursts; pixelRatio 1 + <=2 elements on mobile)', 'hover-glitch,showreel-tile,hero-image,text-headline-EXPERIMENTAL'],
    pixelate: ['media-fx', 'mosaic pixelation, block size oscillates with time', 'continuous', '-', 'yes', 'retro-reveal,hover-tile'],
    rgbGlitch: ['media-fx', 'intermittent RGB channel tear bursts (undocumented upstream)', 'continuous', '-', 'yes', 'glitch-accent,music-culture'],
    rgbShift: ['media-fx', 'analog scanline RGB channel separation', 'continuous', '-', 'yes', 'vhs-footage,retro-media'],
    halftone: ['media-fx', 'rotated-grid CMY halftone dots (grid size hardcoded upstream)', 'static', '-', 'no (15 texture taps/fragment — heaviest preset; desktop pointer:fine, small areas only)', 'editorial-print,poster-image'],
    sinewave: ['motion-fx', 'RGB wave displacement with x-blur', 'continuous', '-', 'caution (9 texture taps)', 'liquid-media,underwater'],
    shine: ['motion-fx', 'rotating radial light sweep (flattens color to highlight)', 'continuous', '-', 'yes', 'logo-shine,badge,text-headline-EXPERIMENTAL'],
    blink: ['motion-fx', 'brightness pulse ~0.8Hz (below flash-risk thresholds; still motion)', 'continuous', '-', 'yes', 'attention-pulse,terminal-cursor'],
    spring: ['motion-fx', 'elastic scale wobble', 'continuous', '-', 'yes', 'sticker-pop,playful-logo'],
    duotone: ['media-fx', 'two-color gradient map; cycles when speed>0', 'static-at-speed-0', 'color1,color2,speed', 'yes', 'brand-duotone,scroll-linked-footage,editorial-video'],
    tritone: ['media-fx', 'three-color gradient map; cycles when speed>0', 'static-at-speed-0', 'color1,color2,color3,speed', 'yes', 'brand-tritone,poster-video'],
    hueShift: ['media-fx', 'fixed hue rotation by uniform', 'static', 'shift', 'yes', 'theme-match-media,hover-tint'],
    warpTransition: ['transition', 'horizontal scanline warp on viewport enter/leave', 'enter-leave', 'enterTime,leaveTime (auto-fed)', 'yes', 'scroll-entrance,gallery-swap'],
    slitScanTransition: ['transition', 'slit-scan wipe reveal on enter/leave', 'enter-leave', 'enterTime,leaveTime (auto-fed)', 'yes', 'scroll-entrance,section-reveal'],
    pixelateTransition: ['transition', 'mosaic resolve-in on enter/leave', 'enter-leave', 'enterTime,leaveTime (auto-fed)', 'yes', 'scroll-entrance,retro-reveal'],
    focusTransition: ['transition', 'double-image defocus converge on enter', 'enter-leave', 'intersection (auto-fed)', 'yes', 'scroll-entrance,photo-gallery'],
    invert: ['media-fx', 'color inversion (undocumented upstream)', 'static', '-', 'yes', 'dark-mode-media,hover-invert'],
    grayscale: ['media-fx', 'luminance grayscale (undocumented upstream)', 'static', '-', 'yes', 'muted-media,team-photos'],
    vignette: ['media-fx', 'edge-darkening vignette (undocumented upstream)', 'static', 'intensity,radius,power', 'yes', 'photo-frame,cinematic-still'],
    chromatic: ['media-fx', 'radial chromatic-aberration lens (undocumented upstream)', 'static', 'intensity,radius,power', 'yes', 'lens-look,hero-photo'],
  };

  // fail-loud in BOTH directions ('none' is plumbing — the identity copy
  // shader — deliberately not indexed as an effect row)
  const curated = new Set(Object.keys(META));
  for (const name of shipped) {
    if (name === 'none') continue;
    if (!curated.has(name))
      throw new Error(`vfx-presets: constants.js ships uncurated preset '${name}' — audit it and extend META deliberately (never index blind)`);
  }
  for (const name of curated) {
    if (!shipped.includes(name))
      throw new Error(`vfx-presets: curated preset '${name}' missing from constants.js — upstream removed it; re-audit card + TSV before writing`);
  }
  if (!shipped.includes('none'))
    throw new Error("vfx-presets: identity shader 'none' missing from constants.js — map reshaped, refusing to write");

  const rows = Object.entries(META).map(([name, m]) => [name, ...m]);
  if (rows.length !== 22)
    throw new Error(`vfx-presets: ${rows.length} rows != 22 (constants.js @1.1.0 ships 23 keys incl. 'none') — refusing to write`);
  write('vfx-presets.tsv', 'preset	class	character	animation	uniform_params	mobile_safe	use_case', rows);
}

// ---------------------------------------------------------------- licenses.tsv (curated)
{
  const rows = [
    ['magicui', 'MIT', 'yes', 'no', 'vendor/magicui/LICENSE.md'],
    ['kokonutui', 'MIT', 'yes', 'no', 'vendor/kokonutui/LICENSE'],
    ['motion-primitives', 'MIT', 'yes', 'no', 'vendor/motion-primitives/LICENSE.md'],
    ['reactbits', 'MIT + Commons Clause', 'NO - selling/sublicensing/redistributing the components themselves is banned, INCLUDING ported/rewritten versions; shipping inside an app/site/product is fine', 'no', 'vendor/reactbits/LICENSE.md'],
    ['gsap', 'Webflow GSAP Standard License (free, commercial + AI use OK)', 'no component resale question; do NOT bundle gsap runtime files into paid template packs - declare as npm dep; no no-code animation tools competing with Webflow', 'no', 'https://gsap.com/standard-license'],
    ['motion', 'MIT (core); Motion+ is paid/private', 'yes (core only)', 'no', 'upstream LICENSE.md (motiondivision/motion)'],
    ['lenis', 'MIT', 'yes', 'no', 'upstream LICENSE (darkroomengineering/lenis)'],
    ['phosphor', 'MIT', 'yes', 'no', 'vendor/phosphor/LICENSE'],
    ['animista', 'FreeBSD (2-clause BSD), (c) 2017 Ana Travas', 'yes', 'YES - ship the FULL license text (notice + conditions + disclaimer) with distributed CSS; a one-line comment alone does not satisfy it', 'vendor/animista/LICENSE.txt'],
    ['vanta', 'MIT', 'yes', 'no', 'vendor/vanta/LICENSE.md'],
    ['radix-colors', 'MIT', 'yes', 'no', 'vendor/radix-colors/LICENSE'],
    ['paper-shaders', 'Apache-2.0 at >=0.0.77 ONLY (0.0.47-0.0.76 are PolyForm Shield - never downgrade/float; pinned 0.0.78)', 'yes', 'YES - ship vendor/paper-shaders/LICENSE AND NOTICE alongside redistributed dist files (Apache 2.0 s4d NOTICE preservation)', 'vendor/paper-shaders/LICENSE'],
    ['svgl', 'MIT (collection/code only) — every logo remains a TRADEMARK of its owner; MIT does not license the marks', 'redistribution of the collection: yes (MIT); use in apps/sites: nominative use only (real stacks/integrations, never fabricated customer walls or implied endorsement); reselling as a logo pack: NOT covered', 'no', 'vendor/svgl/LICENSE'],
    ['tailark', 'MIT (upstream file is LICENCE.md, British spelling; (c) 2025 Irung) — embedded core-* brand SVGs (Spotify, Vercel, Claude, OpenAI…) remain TRADEMARKS of their owners', 'code/blocks: yes (MIT); brand SVGs: nominative use only — NEVER ship placeholder logo clouds as fake customer walls or implied endorsement (replace via svgl law before ship)', 'no', 'vendor/tailark/LICENSE'],
    ['origin', 'MIT — apps/origin subtree of cosscom/coss ONLY ("Originally Copyright (c) 2025 Origin UI"); the monorepo ROOT is AGPLv3 - never vendor or copy anything from that repo outside apps/origin/', 'yes (the vendored apps/origin payloads; standard MIT)', 'no', 'vendor/origin/LICENSE.md'],
    ['fancy', 'MIT, (c) 2024 Daniel Petho', 'yes (MIT) - but vendored copies are an alex-style PATCHED FORK of a curated 8-item subset (registryDependencies localized, use-client added, poly-decomp ESM import, lodash.debounce); redistributing/refreshing from the live site instead reintroduces the four patched defects', 'no', 'vendor/fancy/LICENSE'],
    ['atropos', 'MIT, (c) 2021 Vladimir Kharlampidi — verified MIT at all 23 published versions (relicense history clean)', 'yes (MIT) - vendored copy is a 15-file curated subset of the npm tarball with per-file byte pins (vendor/atropos/PIN.json); refresh only via sync.sh atropos, never by re-downloading upstream ad hoc (feature-frozen upstream: future fixes are PATCHED(alex-style) in-vendor)', 'no', 'vendor/atropos/LICENSE'],
['curtains', 'MIT, (c) 2018 Martin Laxenaire', 'yes (MIT) - vendored examples are STRIPPED of bundled third-party runtimes (locomotive-scroll.min.js/.css: one-smoothing-layer law, lenis wiring in sources/curtains.md supersedes; stale gsap.min.js: GSAP routes via vendor/gsap pins) - never re-fetch the stripped files; upstream frozen at 8.1.6 (maintenance mode, no tags - the arsenal owns patches)', 'no', 'vendor/curtains/LICENSE.txt'],
// MODEL-VIEWER row for the licenses.tsv block in scripts/build-catalogs.mjs
// (insert into the `rows` array; keep adjacent to the other Apache source, paper-shaders)
    ['model-viewer', 'Apache-2.0 at pinned 4.3.1 (file-level LICENSE in tarball; no upstream NOTICE file at this version; bundle embeds standard BSD-3-Clause lit headers - compatible)', 'yes - ship vendor/model-viewer/LICENSE alongside redistributed dist files', 'no', 'vendor/model-viewer/LICENSE'],
// Two rows for the licenses block in build-catalogs.mjs (audit condition:
// "licenses.tsv gains polyhaven-assets and khronos-gltf rows"). Insert after
// the 'shadergradient' row so the no-classic-LICENSE-file cases read together.

    ['polyhaven-assets', 'CC0 1.0 public-domain dedication - declared site-wide (polyhaven.com/license: "CC0 means absolute freedom"; redistribution incl. in sold products explicitly allowed) AND page-level per asset (both vendored HDRIs verified 2026-08-03)', 'yes - redistribute/resell freely (CC0); shelf law still applies: scaffolding/lighting assets, never shipped as the final client asset without replacement', 'no (CC0) - provenance recorded anyway in vendor/assets-3d/assets.tsv + LICENSE-NOTICE.md (audit trail)', 'vendor/assets-3d/LICENSE-NOTICE.md'],
    ['khronos-gltf', 'NO top-level repo license (GitHub API license: null, verified 2026-08-03) - per-model metadata.json legal[] arrays ARE the license; shelf rule: EVERY entry must be CC0 (string "CC0" + publicdomain/zero/1.0 URL, not the SPDX id). SheenChair 1x CC0 (Chadwick/Wayfair), ToyCar 2x CC0 verified @ pin 2bac6f8c; DamagedHelmet et al. excluded as evidence rows in assets.tsv', 'CC0 models: yes; NEVER vendor/copy any other model without checking its OWN metadata.json first - the repo mixes CC0/CC-BY/CC-BY-NC/SCEA', 'no for the all-CC0 shelf models; CC-BY models are owner-opt-in ONLY with an attribution row added to assets.tsv first', 'vendor/assets-3d/models/<Name>.metadata.json (adjacent to every glb)'],
// licenses.tsv row for the curated block in build-catalogs.mjs (and the same
// row lands in vendor/_index/licenses.tsv when the block is re-run):
    ['media-chrome', 'MIT, (c) 2020 Mux, Inc. — media-chrome 4.19.2 vanilla web-components subset + player.style themes minimal/microvideo/sutro (each MIT per its vendored package.json); NOTE the LICENSE file has no "MIT License" heading, it opens with the copyright + permission grant', 'yes (MIT) - vendored copy is a curated VANILLA SUBSET (40-file ESM closure + iife/all.js; dist/react, cjs and menu/cast/airplay/live controls excluded — React consumers install media-chrome@4.19.2 from npm and import media-chrome/react); brand-lookalike player.style themes (notflix, yt, vimeonova, winamp, instaplay) are PERMANENTLY excluded on trade-dress grounds - never vendor, never imitate', 'no', 'vendor/media-chrome/LICENSE'],
    ['vfx-js', 'MIT at all 23 published versions (verified in registry 2026-08-03; the 0.1.0-era three dep was removed at 0.13.0 - 1.x is zero-dep)', 'yes (MIT) - wart: the package internally vendors a port of matt-way/gifuct-js (MIT upstream) WITHOUT its copyright header; upstream hygiene defect inherited when redistributing, recorded not blocking', 'no', 'vendor/vfx-js/LICENSE'],
    ['noise', 'MIT twice over — webgl-noise: LICENSE file ((C) 2011 Ashima Arts + 2011-2016 Stefan Gustavson; grant text without the words "MIT License"); psrdnoise: MIT via in-file headers + README ONLY, NO upstream LICENSE file exists ((c) 2021 Stefan Gustavson and Ian McEwan; authored notice at vendor/noise/psrdnoise/LICENSE-NOTICE.md — shadergradient precedent)', 'yes (MIT) - the in-file MIT headers ARE the operative license text for psrdnoise: never strip them from vendored or project copies (sync + self-test hard-fail on a missing header); LYGIA remains rejected (Prosperity 3.0.0, not open source) and Shadertoy transcription stays banned (CC-BY-NC default) - this source is the only sanctioned shader-noise origin', 'no (MIT notice preservation only - the headers travel with the code)', 'vendor/noise/webgl-noise/LICENSE + vendor/noise/psrdnoise/LICENSE-NOTICE.md'],
    ['r3f-drei', 'MIT (both pmndrs packages, verified in the npm registry at the pinned docs versions r3f 9.7.0 / drei 10.7.7); vendored artifacts are the projects\' own llms-full.txt doc exports', 'docs pack for local grep only - the r3f/drei RUNTIME is never vendored (users npm-install into their project; vendoring it would re-open the rejected pinned-three-infrastructure debate); environment lighting answers cite LOCAL vendor/assets-3d HDRIs, never a drei preset (presets runtime-fetch raw.githack - hard rule 1 violation)', 'no', 'upstream LICENSE (pmndrs/react-three-fiber, pmndrs/drei)'],
    ['video-policy', 'policy card only, nothing vendored - Coverr License + Pexels License + Pixabay Content License (2026 terms; every row browser-verified 2026-08-03; Pixabay/Pexels 403 curl - re-verify via the Playwright path)', 'NEVER vendor or redistribute stock video FILES - all three licenses prohibit standalone redistribution (Pexels "Don\'t redistribute or sell...on other stock photo or wallpaper platforms"; Pixabay "cannot sell or distribute Content...on a Standalone basis"; Coverr FAQ "No you\'re not" + no compiling into a competing service); projects download their own footage into the shipped site/app; hotlinking banned', 'Coverr: YES for free-tier downloads (2026 summary block requires credit; longform contradicts on-page - attribute to be safe; Coverr+ exempt); Pexels/Pixabay: no (appreciated)', 'sources/video-policy.md'],
    ['wig', 'MIT (Copyright 2025 Vercel Labs)', 'yes', 'no', 'vendor/review-packs/wig/LICENSE'],
    ['axe-core', 'MPL-2.0 (file-level copyleft)', 'yes WITH conditions - redistribute axe.min.js ONLY unmodified (header intact) with its LICENSE alongside; never ship in product builds - the Phase 4 review-time copy in the served dir MUST be deleted after the run', 'YES - the MPL-2.0 license file (and LICENSE-3RD-PARTY.txt) must travel with any redistributed copy of axe.min.js', 'vendor/review-packs/axe/LICENSE'],
    ['shadergradient', 'MIT per package.json + README ONLY - no LICENSE file exists upstream; flag legal if formal text is required', 'yes (with the above caveat)', 'no', 'package.json declaration only'],
    ['recent', 'none - third-party copyrighted work; robots signals: ai-train=no, use=reference', 'NEVER - metadata for design direction only; never copy imagery', 'n/a', 'no terms page exists'],
    ['layers', 'none - uploaders retain all IP', 'NEVER - metadata/palette reference only; never copy imagery', 'n/a', 'https://layers.to/legal/terms-and-conditions'],
  ];
  write('licenses.tsv', 'source	license	resale_or_redistribution	attribution_required	license_ref', rows);
}

console.log('\ncatalog build complete →', OUT);
