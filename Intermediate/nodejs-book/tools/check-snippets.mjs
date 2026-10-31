// Run every code block in the book with the current Node.
//
// - Blocks with data-file="*.js|*.mjs|*.cjs" or data-lang="js" run as scripts (ES modules by
//   default: the work folder has package.json {"type": "module"}).
// - An output block (data-lang="text") right after a script block must match its real output.
// - data-lang="repl" blocks are REPL transcripts: "> " input, "... " continuation, other lines
//   are the expected output (console.log output, then the echoed value as util.inspect shows it,
//   or "Uncaught Type: message"). An input with no output lines below it is not compared
//   (the book omits the REPL's "undefined" echoes). REPL blocks on one page share one context.
// - Node-specific: .ts/.mts files run natively (type stripping); data-stderr compares stdout+stderr
//   merged in real order; data-exit allows a non-zero exit code; data-args="a b" passes CLI
//   arguments; data-stdin="text" (\n for newlines) is piped to standard input.
// - data-norun skips a block; data-fresh starts a new REPL context; data-save writes the block to
//   data-file in the page's work folder; shell blocks with data-run execute each "$ cmd" line.
// - In expected output, a line containing only "..." matches any number of lines.
//
// Usage: ~/.local/node26/bin/node tools/check-snippets.mjs [page.html ...]
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import util from 'node:util';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.execPath;
const BLOCK = /<script type="text\/plain" class="code"([^>]*)>([\s\S]*?)<\/script>/g;

function dedent(src) {
  const lines = src.replace(/<\\\/script>/gi, '</' + 'script>').replace(/\t/g, '    ').split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const min = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(Number.isFinite(min) ? min : 0)).join('\n');
}
const attr = (a, n) => (a.match(new RegExp(n + '="([^"]*)"')) || [])[1];
function langOf(a) {
  const l = attr(a, 'data-lang');
  if (l) return l;
  const f = attr(a, 'data-file') || '';
  const ext = f.split('.').pop();
  return { js: 'js', mjs: 'js', cjs: 'js', ts: 'js', mts: 'js', cts: 'js', json: 'json', txt: 'text', sh: 'shell' }[ext] || (f ? 'text' : 'js');
}

// One line: whitespace-insensitive; "..." inside a line matches any text (e.g. "added 1 package in ...").
function sameLine(e, a) {
  const E = e.replace(/\s+/g, ' ').trim(), A = a.replace(/\s+/g, ' ').trim();
  if (E === A) return true;
  if (!E.includes('...')) return false;
  const re = new RegExp('^' + E.split('...').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return re.test(A);
}
// Compare expected vs actual lines; a lone "..." line in expected matches any run of lines.
function matches(expected, actual) {
  const E = expected.map((l) => l.trimEnd()), A = actual.map((l) => l.trimEnd());
  const go = (i, j) => {
    if (i === E.length) return j === A.length;
    if (E[i].trim() === '...') { for (let k = j; k <= A.length; k++) if (go(i + 1, k)) return true; return false; }
    return j < A.length && sameLine(E[i], A[j]) && go(i + 1, j + 1);
  };
  return go(0, 0);
}
const lines = (s) => dedent(s).split('\n').filter((l, i, a) => !(l === '' && i === a.length - 1));

function makeContext(workdir, out) {
  const fmt = (...args) => { out.push(...util.format(...args).split('\n')); };   // console.log returns undefined
  const con = { log: fmt, info: fmt, warn: fmt, error: fmt, table: (x) => fmt(x), dir: (x) => fmt(util.inspect(x)) };
  const ctx = vm.createContext({
    console: con, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, structuredClone,
    URL, URLSearchParams, TextEncoder, TextDecoder, AbortController, AbortSignal, performance, Blob, atob, btoa,
    process: { version: process.version, cwd: () => workdir, argv: ['node', 'repl'], env: {}, platform: process.platform },
  });
  ctx.globalThis = vm.runInContext('globalThis', ctx);
  return ctx;
}

function runRepl(code, ctx, out, where) {
  // group into (input, expected[]) steps
  const steps = [];
  for (const line of code.split('\n')) {
    if (/^> ?/.test(line) && (line.startsWith('> ') || line === '>')) steps.push({ input: [line.slice(2)], expected: [] });
    else if (line.startsWith('... ') || line === '...') { if (steps.length && !steps.at(-1).expected.length) steps.at(-1).input.push(line.slice(4)); else steps.at(-1)?.expected.push(line); }
    else if (steps.length) steps.at(-1).expected.push(line);
  }
  const problems = [];
  for (const s of steps) {
    while (s.expected.length && s.expected.at(-1) === '') s.expected.pop();
    out.length = 0;
    let shown = [];
    try {
      const value = vm.runInContext(s.input.join('\n'), ctx, { filename: 'REPL', timeout: 5000 });
      shown = [...out];
      if (value !== undefined) shown.push(...util.inspect(value, { colors: false }).split('\n'));
    } catch (e) {
      shown = [...out];
      const name = e && e.constructor && e.constructor.name;
      shown.push(e && typeof e === 'object' && 'message' in e ? `Uncaught ${e.name || name}: ${e.message}` : `Uncaught ${util.inspect(e)}`);   // cross-realm errors: no instanceof
    }
    if (s.expected.length && !matches(s.expected, shown)) {
      problems.push(`> ${s.input.join('\n... ')}\n--- book\n${s.expected.join('\n')}\n--- real\n${shown.join('\n')}`);
    }
  }
  return problems;
}

function runShell(code, workdir) {
  const steps = [];
  for (const line of code.split('\n')) {
    if (line.startsWith('$ ')) steps.push([line.slice(2), []]);
    else if (steps.length) steps.at(-1)[1].push(line);
  }
  const problems = [];
  const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', NODE_DISABLE_COLORS: '1', PATH: dirname(NODE) + ':' + process.env.PATH };
  for (const [cmd, expected] of steps) {
    const r = spawnSync('/bin/sh', ['-c', `{ ${cmd} ; } 2>&1`],   // merge stderr for the whole command line
      { cwd: workdir, env, encoding: 'utf8', timeout: 60000 });
    const got = (r.stdout || '').replace(/\s+$/, '').split('\n');
    while (expected.length && !expected.at(-1).trim()) expected.pop();
    if (expected.length && !matches(expected, got)) problems.push(`$ ${cmd}\n--- book\n${expected.join('\n')}\n--- real\n${got.join('\n')}`);
  }
  return problems;
}

function checkPage(path) {
  const text = readFileSync(path, 'utf8');
  const workdir = mkdtempSync(join(tmpdir(), 'nodebook-'));
  writeFileSync(join(workdir, 'package.json'), '{ "type": "module" }\n');
  const out = [];
  let ctx = makeContext(workdir, out);
  let ok = 0, fail = 0, skip = 0, lastJs = null, n = 0;
  for (const m of text.matchAll(BLOCK)) {
    const a = m[1], code = dedent(m[2]), lang = langOf(a), file = attr(a, 'data-file');
    const line = text.slice(0, m.index).split('\n').length;
    const where = `${basename(path)}:${line} (${file || lang})`;
    if (a.includes('data-save')) {
      const target = join(workdir, file);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, code + '\n');
      skip++; lastJs = null; continue;
    }
    if (lang === 'text' && lastJs && !a.includes('data-nocompare') && !text.slice(lastJs.end, m.index).includes('<script')) {
      if (matches(lines(code), lastJs.out)) ok++;
      else { fail++; console.log(`FAIL ${where}: output differs\n--- book\n${code}\n--- real\n${lastJs.out.join('\n')}\n`); }
      lastJs = null; continue;
    }
    lastJs = null;
    if (lang === 'shell' && a.includes('data-run')) {
      const p = runShell(code, workdir);
      if (p.length) { fail++; console.log(`FAIL ${where}\n${p.join('\n')}\n`); } else ok++;
      continue;
    }
    if (a.includes('data-norun') || !['js', 'repl'].includes(lang)) { skip++; continue; }
    if (lang === 'js') {
      const ext = (file && /\.(cjs|ts|mts|cts)$/.exec(file)?.[1]) || 'mjs';
      // Files in a folder (playground/x.js) run at their real path so relative imports work.
      const name = file && file.includes('/') ? file : `__snippet${++n}.${ext}`;
      mkdirSync(dirname(join(workdir, name)), { recursive: true });
      writeFileSync(join(workdir, name), code + '\n');
      const args = (attr(a, 'data-args') || '').split(' ').filter(Boolean).map((x) => `'${x.replace(/'/g, "'\\''")}'`).join(' ');
      const input = attr(a, 'data-stdin')?.replace(/\\n/g, '\n').replace(/&quot;/g, '"');
      const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', NODE_DISABLE_COLORS: '1' };
      delete env.NODE_ENV;
      const r = a.includes('data-stderr')
        ? spawnSync('/bin/sh', ['-c', `exec "${NODE}" ${name} ${args} 2>&1`], { cwd: workdir, encoding: 'utf8', timeout: 20000, env, input })
        : spawnSync('/bin/sh', ['-c', `exec "${NODE}" ${name} ${args}`], { cwd: workdir, encoding: 'utf8', timeout: 20000, env, input });
      const allowed = a.includes('data-exit');
      if ((r.status !== 0 && !allowed) || r.signal) { fail++; console.log(`FAIL ${where} (exit ${r.status}${r.signal ? ' ' + r.signal : ''})\n${((r.stderr || '') + (r.stdout || '')).trim().slice(-900)}\n`); }
      else if (allowed && r.status === 0) { fail++; console.log(`FAIL ${where}: expected a non-zero exit code\n`); }
      else { ok++; lastJs = { out: r.stdout.replace(/\n$/, '').split('\n'), end: m.index + m[0].length }; }
      continue;
    }
    if (a.includes('data-fresh')) ctx = makeContext(workdir, out);
    const problems = runRepl(code, ctx, out, where);
    if (problems.length) { fail++; console.log(`FAIL ${where}\n${problems.join('\n')}\n`); } else ok++;
  }
  rmSync(workdir, { recursive: true, force: true });
  return { ok, fail, skip };
}

const pages = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync(ROOT).filter((f) => /^(\d\d-|appendix-|playground-howto).*\.html$/.test(f)).sort().map((f) => join(ROOT, f));
const total = { ok: 0, fail: 0, skip: 0 };
for (const p of pages) {
  const r = checkPage(p);
  for (const k in total) total[k] += r[k];
  console.log(`${basename(p).padEnd(28)} ok=${String(r.ok).padStart(3)} fail=${String(r.fail).padStart(2)} skipped=${String(r.skip).padStart(2)}`);
}
console.log(`TOTAL ok=${total.ok} fail=${total.fail} skipped=${total.skip}  (Node ${process.version})`);
process.exit(total.fail ? 1 : 0);
void execFileSync;
