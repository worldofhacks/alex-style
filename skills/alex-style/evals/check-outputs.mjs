#!/usr/bin/env node
// Mechanical output checks for one alex-style eval run — the five assertions an
// LLM grader is structurally worst at (exhaustive needle-in-haystack scans).
// Writes checks.json alongside monitor.json in the run dir; the grader cites it
// as evidence. Zero deps, resilient to missing files (skips with a reason).
//
// Usage: node check-outputs.mjs <run-dir>   (run-dir = iteration-N/<eval>/<config>)
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';

const runDir = process.argv[2];
if (!runDir) { console.error('usage: check-outputs.mjs <run-dir>'); process.exit(1); }
if (!existsSync(runDir)) { console.error(`run dir not found: ${runDir}`); process.exit(1); }

const outRoot = existsSync(join(runDir, 'outputs')) ? join(runDir, 'outputs') : runDir;
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist']);
const META = new Set(['monitor.json', 'checks.json', 'timing.json', 'grading.json']);

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name), acc); }
    else if (!(dir === outRoot && META.has(e.name))) acc.push(join(dir, e.name));
  }
  return acc;
}
const files = walk(outRoot);
const rel = (f) => relative(outRoot, f);
const read = (f) => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };
const codeFiles = files.filter((f) => /\.(js|mjs|cjs|jsx|ts|tsx)$/i.test(f));
const runtimeFiles = files.filter((f) => /\.(html?|css|js|mjs|cjs|jsx|ts|tsx|svg)$/i.test(f));

// import specifiers per code file: static, side-effect, dynamic, require
const IMPORT_RES = [
  /import\s+(?:[\w*\s{},$]+\s+from\s+)?["']([^"']+)["']/g,
  /import\s*\(\s*["']([^"']+)["']\s*\)/g,
  /require\s*\(\s*["']([^"']+)["']\s*\)/g,
];
function importsOf(src) {
  const specs = [];
  for (const re of IMPORT_RES) for (const m of src.matchAll(re)) specs.push(m[1]);
  return specs;
}
function pkgName(spec) { // null for relative/alias/local imports
  if (/^[./~]/.test(spec) || spec.startsWith('@/')) return null;
  return spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
}

const checks = [];
function run(name, fn) {
  try { checks.push({ check: name, ...fn() }); }
  catch (e) { checks.push({ check: name, passed: null, evidence: `skipped: check crashed (${e.message})` }); }
}

// 1. offline-completeness: no runtime resource loaded from the network.
// Only script src / link href / img src / url() — <a href> (social profiles) is fine.
run('offline-completeness', () => {
  if (!runtimeFiles.length) return { passed: null, evidence: 'skipped: no delivered html/css/js files found' };
  const hits = [];
  const RES = [
    /<script\b[^>]*\bsrc\s*=\s*["']https?:\/\/[^"']+/gi,
    /<link\b[^>]*\bhref\s*=\s*["']https?:\/\/[^"']+/gi,
    /<img\b[^>]*\bsrc\s*=\s*["']https?:\/\/[^"']+/gi,
    /url\(\s*["']?https?:\/\/[^"')]+/gi,
  ];
  for (const f of runtimeFiles) {
    const src = read(f);
    for (const re of RES) for (const m of src.match(re) ?? []) hits.push(`${rel(f)}: ${m.slice(0, 100)}`);
  }
  return { passed: hits.length === 0,
    evidence: hits.length ? hits.slice(0, 10).join(' | ') : `no external script/link/img/url() references across ${runtimeFiles.length} files` };
});

// 2. local-asset-existence: every locally referenced asset exists on disk.
run('local-asset-existence', () => {
  const htmlCss = files.filter((f) => /\.(html?|css)$/i.test(f));
  if (!htmlCss.length) return { passed: null, evidence: 'skipped: no html/css files to scan for asset references' };
  const missing = []; let refs = 0;
  for (const f of htmlCss) {
    const src = read(f);
    const cands = [];
    for (const m of src.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) cands.push(m[1]);
    for (const m of src.matchAll(/url\(\s*["']?([^"')]+?)["']?\s*\)/gi)) cands.push(m[1]);
    for (let c of cands) {
      if (/^(https?:|\/\/|data:|mailto:|tel:|javascript:|#)/i.test(c)) continue;
      c = c.split(/[?#]/)[0];
      if (!c) continue;
      refs++;
      const p = c.startsWith('/') ? join(outRoot, c) : join(dirname(f), c);
      if (!existsSync(p)) missing.push(`${rel(f)} → ${c}`);
    }
  }
  if (!refs) return { passed: true, evidence: 'no local asset references found' };
  return { passed: missing.length === 0,
    evidence: missing.length ? `missing on disk: ${missing.slice(0, 10).join(' | ')}` : `${refs} local references all exist` };
});

// 3. notes-deps-complete: every non-react/next/local import appears in NOTES.md.
run('notes-deps-complete', () => {
  const CORE = new Set(['react', 'react-dom', 'next']);
  const deps = new Map(); // pkg -> example file
  for (const f of codeFiles) {
    for (const spec of importsOf(read(f))) {
      const pkg = pkgName(spec);
      if (pkg && !CORE.has(pkg) && !pkg.startsWith('node:')) deps.set(pkg, deps.get(pkg) ?? rel(f));
    }
  }
  if (!deps.size) return { passed: true, evidence: 'no external npm deps imported (nothing for NOTES.md to list)' };
  const notesFile = files.find((f) => /^notes\.md$/i.test(basename(f)));
  if (!notesFile) return { passed: false, evidence: `deps used but no NOTES.md found: ${[...deps.keys()].join(', ')}` };
  const notes = read(notesFile).toLowerCase();
  const missing = [...deps.keys()].filter((d) => !notes.includes(d.toLowerCase()));
  return { passed: missing.length === 0,
    evidence: missing.length
      ? `missing from ${rel(notesFile)}: ${missing.map((d) => `${d} (used in ${deps.get(d)})`).join(', ')}`
      : `all ${deps.size} deps listed in ${rel(notesFile)}: ${[...deps.keys()].join(', ')}` };
});

// 4. use-client-hygiene: files using hooks or JSX event handlers carry 'use client'.
run('use-client-hygiene', () => {
  const comps = files.filter((f) => /\.(jsx|tsx)$/i.test(f));
  if (!comps.length) return { passed: null, evidence: 'skipped: no .jsx/.tsx component files' };
  const HOOK = /\buse(State|Effect|Ref|Memo|Callback|Reducer|Context|LayoutEffect|Transition|SyncExternalStore|InsertionEffect|ImperativeHandle)\s*\(/;
  const HANDLER = /\bon[A-Z][A-Za-z]*\s*=\s*[{"']/;
  const bad = [];
  for (const f of comps) {
    const src = read(f);
    if (!(HOOK.test(src) || HANDLER.test(src))) continue;
    if (!/(['"])use client\1/.test(src.slice(0, 400))) bad.push(rel(f));
  }
  return { passed: bad.length === 0,
    evidence: bad.length ? `hooks/handlers without 'use client': ${bad.join(', ')}` : `all ${comps.length} component files clean` };
});

// 5. one-icon-family: at most one icon package family across all imports.
// (Inline-SVG visual consistency stays with the LLM grader — this is the import half.)
const ICON_FAMILIES = [
  [/^@phosphor-icons\//, 'phosphor'], [/^phosphor-react$/, 'phosphor'],
  [/^lucide/, 'lucide'], [/^@radix-ui\/react-icons$/, 'radix-icons'],
  [/^@heroicons\//, 'heroicons'], [/^react-icons$/, 'react-icons'],
  [/^@tabler\/icons/, 'tabler'], [/^react-feather$/, 'feather'], [/^feather-icons$/, 'feather'],
  [/^iconoir/, 'iconoir'], [/^@iconify/, 'iconify'], [/^bootstrap-icons$/, 'bootstrap-icons'],
];
run('one-icon-family', () => {
  if (!codeFiles.length) return { passed: null, evidence: 'skipped: no js/ts files to scan for icon imports' };
  const fams = new Map(); // family -> example "pkg in file"
  for (const f of codeFiles) {
    for (const spec of importsOf(read(f))) {
      const pkg = pkgName(spec);
      if (!pkg) continue;
      for (const [re, fam] of ICON_FAMILIES) if (re.test(pkg)) fams.set(fam, fams.get(fam) ?? `${pkg} in ${rel(f)}`);
    }
  }
  if (!fams.size) return { passed: true, evidence: 'no icon package imports (inline SVG consistency is graded by the LLM)' };
  return { passed: fams.size <= 1,
    evidence: `${fams.size} icon famil${fams.size === 1 ? 'y' : 'ies'}: ${[...fams].map(([fam, ex]) => `${fam} (${ex})`).join(', ')}` };
});

const result = { run_dir: runDir, outputs_root: outRoot, files_scanned: files.length, checks };
writeFileSync(join(runDir, 'checks.json'), JSON.stringify(result, null, 2));
for (const c of checks) console.log(`${c.passed === null ? 'SKIP' : c.passed ? 'PASS' : 'FAIL'}\t${c.check}\t${c.evidence}`);
console.log(`\nchecks.json written to ${join(runDir, 'checks.json')}`);
