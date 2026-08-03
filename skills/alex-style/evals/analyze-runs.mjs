#!/usr/bin/env node
// Call-monitoring analyzer for alex-style eval runs.
// Parses workflow subagent transcripts and writes monitor.json into each
// matching run directory (iteration-N/<eval>/<config>/).
// It NEVER writes timing.json — that filename belongs to the skill-creator
// harness (notification-derived); duration/tokens live in monitor.json.
//
// Usage: node analyze-runs.mjs <workflow-transcript-dir> <iteration-dir>
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const [tdir, iterDir] = process.argv.slice(2);
if (!tdir || !iterDir) {
  console.error('usage: analyze-runs.mjs <workflow-transcript-dir> <iteration-dir>');
  process.exit(1);
}

// ---- policy: grep-only file patterns + vendor slugs (evals/policy.json) ----
// Built-ins are a fallback only; policy.json is the source of truth and must be
// kept in sync with SKILL.md's token-discipline table and vendor/.
const BUILTIN_POLICY = {
  grep_only_patterns: [
    'llms-full\\.txt', 'animista/keyframes\\.css', 'phosphor/icons\\.ts',
    'gsap/llms\\.txt', 'motion/llms\\.txt',
    '_index/icons\\.tsv', '_index/inspiration\\.tsv', '_index/components\\.tsv',
    '_index/logos\\.tsv',
  ],
  vendor_slugs: [
    '_index', 'animista', 'gsap', 'kokonutui', 'layers', 'lenis', 'magicui',
    'motion', 'motion-primitives', 'phosphor', 'reactbits', 'recent',
    'shadergradient', 'vanta',
  ],
};
const policyPath = join(dirname(fileURLToPath(import.meta.url)), 'policy.json');
let policy = BUILTIN_POLICY;
try {
  policy = { ...BUILTIN_POLICY, ...JSON.parse(readFileSync(policyPath, 'utf8')) };
} catch {
  console.warn(`warning: ${policyPath} missing or unreadable — falling back to built-in policy (may lag SKILL.md)`);
}
const FORBIDDEN = policy.grep_only_patterns.map((p) => new RegExp(p));
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const VENDOR_RE = new RegExp(`\\bvendor\\/(${policy.vendor_slugs.map(escRe).join('|')})\\b`);

// Bash commands that dump file contents — a cat/head/sed of a grep-only file
// is a full read. Checked per pipe segment so `grep x file | head` stays legal.
const DUMP_CMD = /^\s*(?:\w+=\S+\s+)*(cat|head|tail|sed|less|more)\b/;
// Grader/aggregator/analyst transcripts quote the same run paths as runners;
// skip any transcript whose FIRST prompt carries grading vocabulary.
const GRADER_MARKERS = /\b(grade|grading|grader|assertions?)\b/i;
const GRADER_COMBO = /\bpassed\b[\s\S]{0,400}\bevidence\b|\bevidence\b[\s\S]{0,400}\bpassed\b/i;

const best = new Map(); // "<eval>/<config>" -> { stats, toolUses }

for (const f of readdirSync(tdir).filter((f) => f.endsWith('.jsonl') && f.startsWith('agent-'))) {
  const lines = readFileSync(join(tdir, f), 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
  if (!lines.length) continue;

  // identify run from the first user prompt (contains .../iteration-N/<eval>/<config>/outputs)
  const firstUser = lines.find((l) => l.type === 'user');
  const promptText = typeof firstUser?.message?.content === 'string'
    ? firstUser.message.content
    : JSON.stringify(firstUser?.message?.content ?? '');
  const m = promptText.match(/iteration-\d+\/([A-Za-z0-9_-]+)\/([a-z_]+_skill)\//);
  if (!m) continue; // not an eval run (e.g. different workflow)
  if (GRADER_MARKERS.test(promptText) || GRADER_COMBO.test(promptText)) {
    console.warn(`skip ${f}: first prompt contains grading markers (grader/aggregator transcript, not the runner)`);
    continue;
  }
  const [, evalName, config] = m;

  const stats = {
    eval: evalName, config, transcript: basename(f),
    output_tokens: 0, peak_context_tokens: 0,
    tool_counts: {}, web_calls: [], curl_like_commands: [], local_preview_calls: 0,
    files_fully_read: [], forbidden_reads: [], grep_count: 0,
    vendor_touches: 0, skill_md_read: false,
  };

  // duration is omitted (not written as 0) when timestamps are missing
  const ts = lines.map((l) => l.timestamp).filter(Boolean);
  if (ts.length > 1) stats.duration_s = Math.round((new Date(ts.at(-1)) - new Date(ts[0])) / 1000);

  for (const l of lines) {
    if (l.type !== 'assistant') continue;
    const u = l.message?.usage;
    if (u) {
      stats.output_tokens += u.output_tokens ?? 0;
      const ctx = (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);
      if (ctx > stats.peak_context_tokens) stats.peak_context_tokens = ctx;
    }
    for (const c of l.message?.content ?? []) {
      if (c.type !== 'tool_use') continue;
      stats.tool_counts[c.name] = (stats.tool_counts[c.name] ?? 0) + 1;
      const input = JSON.stringify(c.input ?? {});

      const mcpFetchLike = /^mcp__/.test(c.name) && /fetch|search/i.test(c.name);
      if (/^(WebFetch|WebSearch)$/.test(c.name) || mcpFetchLike)
        stats.web_calls.push(`${c.name}: ${(c.input?.url ?? c.input?.query ?? c.input?.prompt ?? '').slice(0, 120)}`);
      else if (/browser|playwright|preview/i.test(c.name)) {
        const url = c.input?.url ?? '';
        if (/^https?:\/\//.test(url) && !/localhost|127\.0\.0\.1/.test(url))
          stats.web_calls.push(`${c.name}: ${url.slice(0, 120)}`);
        else stats.local_preview_calls++;
      }
      if (c.name === 'Bash') {
        const cmd = c.input?.command ?? '';
        if (/\b(curl|wget|npm (install|view|i)\b|npx |pip install)/.test(cmd)) {
          const urls = cmd.match(/https?:\/\/[^\s"'<>)]+/g) ?? [];
          const allLocal = urls.length > 0 && urls.every((u2) => /^https?:\/\/(localhost|127\.0\.0\.1)/.test(u2));
          if (allLocal) stats.local_preview_calls++; // localhost preview curls are legitimate
          else stats.curl_like_commands.push(cmd.slice(0, 160));
        }
        if (/\bgrep\b|\brg\b|\bawk\b/.test(cmd)) stats.grep_count++;
        // cat/head/tail/sed/less/more on a grep-only file = forbidden full read
        for (const seg of cmd.split(/[|;&]+/)) {
          if (DUMP_CMD.test(seg) && FORBIDDEN.some((re) => re.test(seg))) {
            stats.forbidden_reads.push(`bash: ${seg.trim().slice(0, 160)}`);
          }
        }
      }
      if (c.name === 'Grep') stats.grep_count++;
      if (c.name === 'Read') {
        const p = c.input?.file_path ?? '';
        const limit = c.input?.limit;
        const partial = c.input?.offset != null || limit != null;
        if (!partial) stats.files_fully_read.push(p);
        // Read with limit > 500 lines on a grep-only file counts as a full read
        const effectivelyFull = !partial || (typeof limit === 'number' && limit > 500);
        if (effectivelyFull && FORBIDDEN.some((re) => re.test(p)))
          stats.forbidden_reads.push(partial ? `${p} (limit ${limit})` : p);
        if (/SKILL\.md$/.test(p) && /alex-style/.test(p)) stats.skill_md_read = true;
      }
      if (VENDOR_RE.test(input) || /alex-style\/vendor\//.test(input)) stats.vendor_touches++;
    }
  }

  // collision guard: several runner-looking transcripts can quote the same run
  // dir; keep the one with the most tool_use entries (the real runner).
  const toolUses = Object.values(stats.tool_counts).reduce((a, b) => a + b, 0);
  const key = `${evalName}/${config}`;
  const prev = best.get(key);
  if (prev) {
    console.warn(`warning: multiple runner transcripts match ${key}: keeping ${
      toolUses > prev.toolUses ? basename(f) : prev.stats.transcript} (${
      Math.max(toolUses, prev.toolUses)} tool uses) over ${
      toolUses > prev.toolUses ? prev.stats.transcript : basename(f)} (${Math.min(toolUses, prev.toolUses)})`);
    if (toolUses <= prev.toolUses) continue;
  }
  best.set(key, { stats, toolUses });
}

const rows = [];
for (const { stats } of best.values()) {
  // hard gates — the two zero-tolerance behaviors the skill exists to enforce
  if (stats.config === 'with_skill') {
    const web_calls_zero = stats.web_calls.length === 0;
    const forbidden_reads_zero = stats.forbidden_reads.length === 0;
    stats.gates = { web_calls_zero, forbidden_reads_zero, passed: web_calls_zero && forbidden_reads_zero };
  }
  const runDir = join(iterDir, stats.eval, stats.config);
  if (!existsSync(runDir)) mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, 'monitor.json'), JSON.stringify(stats, null, 2));
  rows.push(stats);
}

// summary table
rows.sort((a, b) => a.eval.localeCompare(b.eval) || a.config.localeCompare(b.config));
console.log('eval\tconfig\tdur_s\tout_tok\tctx_peak\ttools\tgreps\tvendor\tweb\tpreview\tnet_cmds\tforbidden\tgates');
for (const r of rows) {
  const tools = Object.values(r.tool_counts).reduce((a, b) => a + b, 0);
  console.log([r.eval, r.config, r.duration_s ?? '-', r.output_tokens, r.peak_context_tokens, tools,
    r.grep_count, r.vendor_touches, r.web_calls.length, r.local_preview_calls,
    r.curl_like_commands.length, r.forbidden_reads.length,
    r.gates ? (r.gates.passed ? 'PASS' : 'FAIL') : '-'].join('\t'));
}
console.log(`\n${rows.length} runs analyzed → monitor.json written per run dir (timing.json untouched — it belongs to the harness)`);
