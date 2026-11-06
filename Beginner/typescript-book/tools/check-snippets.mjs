// Compile and run every code block in the book with the pinned TypeScript compiler.
//
// - Blocks with data-file="*.ts|*.mts|*.js" (or no data-file and no data-lang) are TypeScript
//   snippets. Each one is compiled on its own with tsc (strict, ES modules, @types/node) into
//   out/, then the emitted JavaScript runs with Node.
// - A data-lang="errors" block right after a snippet lists the compiler errors the snippet must
//   produce, in tsc's plain format: "file.ts(line,col): error TSxxxx: message". A snippet that
//   reports errors without such a block FAILS, and so does one that compiles when errors are shown.
// - A data-lang="text" block right after the snippet (or after its errors block) must match the
//   real output of running it. tsc emits JavaScript even when there are type errors, which is how
//   the book shows that types are erased at runtime.
// - data-tsc="flag flag=value …" adds compiler options for that snippet (e.g.
//   data-tsc="noUncheckedIndexedAccess" or data-tsc="strict=false target=es2015").
// - data-save writes the block to data-file in the page's work folder (later snippets can import
//   it, or a shell block can use it). data-norun skips a block. Shell blocks with data-run execute
//   each "$ cmd" line in the work folder (or its data-cwd subfolder) with tsc on the PATH.
// - In expected output, a line containing only "..." matches any number of lines.
//
// --fix-errors copies the real compiler errors into data-lang="errors" blocks that differ
// (review the diff afterwards: outputs must always come from the compiler, never be typed by hand).
//
// Usage: node tools/check-snippets.mjs [--fix-errors] [page.html ...]     (run `npm install` in tools/ first)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TOOLS, '..');
const NODE = process.execPath;
const BIN = join(TOOLS, 'node_modules', '.bin');
const TSC = join(BIN, 'tsc');
if (!existsSync(TSC)) { console.error('tsc not found: run `npm install` in tools/ first'); process.exit(2); }
const FIX = process.argv.includes('--fix-errors');
const BLOCK = /<script type="text\/plain" class="code"([^>]*)>([\s\S]*?)<\/script>/g;

export const BASE_OPTIONS = {
  target: 'es2024', lib: ['es2024'], module: 'nodenext', moduleResolution: 'nodenext', types: ['node'],
  strict: true, moduleDetection: 'force', skipLibCheck: true, rootDir: '.', outDir: 'out',
  allowJs: true, resolveJsonModule: true, pretty: false,
};

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
  return { ts: 'ts', mts: 'ts', cts: 'ts', js: 'ts', mjs: 'ts', json: 'json', txt: 'text', sh: 'shell', java: 'java', cs: 'java' }[ext] || (f ? 'text' : 'ts');
}
function matches(expected, actual) {
  const E = expected.map((l) => l.trimEnd()), A = actual.map((l) => l.trimEnd());
  const go = (i, j) => {
    if (i === E.length) return j === A.length;
    if (E[i].trim() === '...') { for (let k = j; k <= A.length; k++) if (go(i + 1, k)) return true; return false; }
    return j < A.length && E[i].replace(/\s+/g, ' ').trim() === A[j].replace(/\s+/g, ' ').trim() && go(i + 1, j + 1);
  };
  return go(0, 0);
}
const lines = (s) => dedent(s).split('\n');
function parseFlags(spec) {
  const o = {};
  for (const part of (spec || '').split(/\s+/).filter(Boolean)) {
    const [k, v] = part.split('=');
    o[k] = v === undefined ? true : v === 'true' ? true : v === 'false' ? false : /^\[.*\]$/.test(v) ? v.slice(1, -1).split(',') : v;
  }
  return o;
}
const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', PATH: BIN + ':' + dirname(NODE) + ':' + process.env.PATH };

// Compile one file; returns { errors: [lines], js: path of emitted file }
export function compile(workdir, file, flags = {}) {
  const cfg = `tsconfig.__${file.replace(/[^\w.-]/g, '_')}.json`;
  writeFileSync(join(workdir, cfg), JSON.stringify({ compilerOptions: { ...BASE_OPTIONS, ...flags }, files: [file] }, null, 1));
  const r = spawnSync(TSC, ['-p', cfg], { cwd: workdir, encoding: 'utf8', env, timeout: 60000 });
  const errors = (r.stdout + r.stderr).split('\n').map((l) => l.trimEnd()).filter(Boolean);
  const js = join('out', file.replace(/\.(m|c)?ts$/, (m, p) => '.' + (p || '') + 'js'));
  return { errors, js };
}
export function makeWorkdir(prefix = 'tsbook-') {
  const workdir = mkdtempSync(join(tmpdir(), prefix));
  writeFileSync(join(workdir, 'package.json'), '{ "type": "module" }\n');
  symlinkSync(join(TOOLS, 'node_modules'), join(workdir, 'node_modules'));
  return workdir;
}

function runShell(code, workdir, cwd = '') {
  workdir = join(workdir, cwd);
  const steps = [];
  for (const line of code.split('\n')) {
    if (line.startsWith('$ ')) steps.push([line.slice(2), []]);
    else if (steps.length) steps.at(-1)[1].push(line);
  }
  const problems = [];
  for (const [cmd, expected] of steps) {
    const r = spawnSync('/bin/sh', ['-c', `{ ${cmd} ; } 2>&1`], { cwd: workdir, env, encoding: 'utf8', timeout: 60000 });
    const got = (r.stdout || '').replace(/\s+$/, '').split('\n');
    while (expected.length && !expected.at(-1).trim()) expected.pop();
    if (expected.length && !matches(expected, got)) problems.push(`$ ${cmd}\n--- book\n${expected.join('\n')}\n--- real\n${got.join('\n')}`);
  }
  return problems;
}

function checkPage(path) {
  const text = readFileSync(path, 'utf8');
  const fixes = [];
  const workdir = makeWorkdir();
  const blocks = [...text.matchAll(BLOCK)].map((m) => ({ a: m[1], code: dedent(m[2]), index: m.index, end: m.index + m[0].length }));
  const used = new Set();
  let ok = 0, fail = 0, skip = 0, n = 0;
  const say = (b, msg) => { fail++; console.log(`FAIL ${basename(path)}:${text.slice(0, b.index).split('\n').length} (${attr(b.a, 'data-file') || langOf(b.a)}) ${msg}\n`); };
  const adjacent = (x, y) => y && !text.slice(x.end, y.index).includes('<script');
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i], lang = langOf(b.a), file = attr(b.a, 'data-file');
    if (b.a.includes('data-save')) {
      const target = join(workdir, file);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, b.code + '\n'); used.add(file);
      skip++; continue;
    }
    if (lang === 'shell' && b.a.includes('data-run')) {
      const p = runShell(b.code, workdir, attr(b.a, 'data-cwd') || '');
      if (p.length) say(b, '\n' + p.join('\n')); else ok++;
      continue;
    }
    if (lang !== 'ts' || b.a.includes('data-norun')) { skip++; continue; }
    // pick a unique file name; the shown name is what appears in error messages
    const shown = file || `snippet.ts`;
    let real = shown;
    if (used.has(real)) real = `s${++n}/${shown}`;
    used.add(real);
    mkdirSync(dirname(join(workdir, real)), { recursive: true });
    writeFileSync(join(workdir, real), b.code + '\n');
    const { errors, js } = compile(workdir, real, parseFlags(attr(b.a, 'data-tsc')));
    const got = errors.map((l) => l.replace(real, shown));
    let next = blocks[i + 1];
    let bad = false;
    if (adjacent(b, next) && langOf(next.a) === 'errors') {
      if (!matches(lines(next.code), got) && FIX && got.length) { fixes.push([next, got.join('\n')]); fail--; }
      if (!matches(lines(next.code), got)) { say(b, `compiler errors differ\n--- book\n${next.code}\n--- real\n${got.join('\n') || '(no errors)'}`); bad = true; }
      i++; next = blocks[i + 1]; if (!bad) ok++;
      if (!(adjacent(blocks[i], next) && langOf(next.a) === 'text')) continue;
    } else if (got.length) { say(b, `unexpected compiler errors\n${got.join('\n')}`); continue; }
    if (adjacent(blocks[i], next) && langOf(next.a) === 'text' && !next.a.includes('data-nocompare')) {
      i++;
      const r = spawnSync(NODE, [js, ...(attr(b.a, 'data-args') || '').split(' ').filter(Boolean)], { cwd: workdir, encoding: 'utf8', timeout: 20000, env });
      const out = (r.stdout + (r.status ? r.stderr.split('\n').filter((l) => /^\w*Error|^Uncaught/.test(l)).slice(0, 1).join('') : '')).replace(/\n$/, '').split('\n');
      if (matches(lines(next.code), out)) ok++;
      else say(b, `output differs\n--- book\n${next.code}\n--- real\n${out.join('\n')}${r.status ? '\n--- stderr\n' + r.stderr.slice(-600) : ''}`);
    } else {
      const r = spawnSync(NODE, [js], { cwd: workdir, encoding: 'utf8', timeout: 20000, env });
      if (r.status !== 0) say(b, `crashed\n${(r.stderr || '').trim().slice(-700)}`); else ok++;
    }
  }
  rmSync(workdir, { recursive: true, force: true });
  if (fixes.length) {
    let out = text;
    for (const [blk, real] of fixes.reverse()) {
      const open = out.slice(blk.index).match(/^<script[^>]*>/)[0];
      out = out.slice(0, blk.index) + open + '\n' + real.replaceAll('</' + 'script>', '<\\/script>') + '\n</' + 'script>' + out.slice(blk.end);
    }
    writeFileSync(path, out);
    console.log(`  fixed ${fixes.length} errors block(s) in ${basename(path)}`);
  }
  return { ok, fail, skip };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const pages = args.length ? args
    : readdirSync(ROOT).filter((f) => /^(\d\d-|appendix-|playground-howto|faq).*\.html$/.test(f)).sort().map((f) => join(ROOT, f));
  const total = { ok: 0, fail: 0, skip: 0 };
  const tscVersion = spawnSync(TSC, ['--version'], { encoding: 'utf8' }).stdout.trim();
  for (const p of pages) {
    const r = checkPage(p);
    for (const k in total) total[k] += r[k];
    console.log(`${basename(p).padEnd(28)} ok=${String(r.ok).padStart(3)} fail=${String(r.fail).padStart(2)} skipped=${String(r.skip).padStart(2)}`);
  }
  console.log(`TOTAL ok=${total.ok} fail=${total.fail} skipped=${total.skip}  (${tscVersion}, Node ${process.version})`);
  process.exit(total.fail ? 1 : 0);
}
