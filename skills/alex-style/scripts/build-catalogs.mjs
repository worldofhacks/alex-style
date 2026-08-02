#!/usr/bin/env node
// alex-style catalog builder — distills vendor/ into grep-able TSV indexes at vendor/_index/.
// Re-run after every sync.sh. No dependencies, pure Node.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
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
    ['shadergradient', 'MIT per package.json + README ONLY - no LICENSE file exists upstream; flag legal if formal text is required', 'yes (with the above caveat)', 'no', 'package.json declaration only'],
    ['recent', 'none - third-party copyrighted work; robots signals: ai-train=no, use=reference', 'NEVER - metadata for design direction only; never copy imagery', 'n/a', 'no terms page exists'],
    ['layers', 'none - uploaders retain all IP', 'NEVER - metadata/palette reference only; never copy imagery', 'n/a', 'https://layers.to/legal/terms-and-conditions'],
  ];
  write('licenses.tsv', 'source	license	resale_or_redistribution	attribution_required	license_ref', rows);
}

console.log('\ncatalog build complete →', OUT);
