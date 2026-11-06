// Builds and runs every code example in the book with the pinned Next.js (tools/package.json),
// and checks that every output shown on the page is the real one.
//
// How a page is checked
// - Blocks with data-file="app/…", "lib/…", "next.config.ts", "proxy.ts", … are files of a Next.js
//   app. They are written into a fresh project (tools/.work/<page>-<app>/) that starts from the
//   files create-next-app 16.4.5 generates (package.json, tsconfig.json, next.config.ts with
//   cacheComponents) plus a minimal app/layout.tsx. data-app="name" puts a block in another app
//   of the same page (default "main"); writing the same file twice in one app is an error.
// - Each app is built once with `next build` (which also type-checks). If the build fails, a
//   data-lang="errors" block after one of its code blocks must match the build output; a failing
//   build without such a block FAILS, and so does a passing build that has one.
// - The app is then served with `next start`, and output blocks are checked in page order:
//     data-lang="text" data-url="/books/1"   → document.body.innerText in headless Chrome
//       data-steps="click:#add; fill:input[name=q]=dune; press:Enter; wait:300; goto:/x"
//                                             (tap: clicks without waiting for the page to settle)
//                                             → actions run before reading the text
//       data-eval="document.title"            → shows the value of a JS expression instead
//       data-nojs                             → JavaScript is disabled in the page (progressive enhancement)
//     data-lang="shell" data-run              → each "$ cmd" line runs in the app folder;
//       localhost:3000 is rewritten to the real port, and `npm run build` / `npx next build`
//       print the captured build output instead of building again.
// - data-node on a .ts/.mjs/.js block runs it with Node (type stripping); the text block after it
//   must match its output. data-norun skips a block; data-nocompare shows an output unchecked.
// - In expected output a line "..." matches any number of lines, and "…" inside a line matches
//   any text (for timings and hashes). Blank lines are ignored when comparing browser text.
//
// Usage: node tools/check-snippets.mjs [page.html ...] [--keep]     (run `npm install` in tools/ first)
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TOOLS, '..');
const WORK = join(TOOLS, '.work');
const NEXT = join(TOOLS, 'node_modules', '.bin', 'next');
if (!existsSync(NEXT)) { console.error('next not found: run `npm install` in tools/ first'); process.exit(2); }
const KEEP = process.argv.includes('--keep');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BLOCK = /<script type="text\/plain" class="code"([^>]*)>([\s\S]*?)<\/script>/g;
const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', NEXT_TELEMETRY_DISABLED: '1', CI: '1',
  PATH: join(TOOLS, 'node_modules', '.bin') + ':' + dirname(process.execPath) + ':' + process.env.PATH };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- the create-next-app baseline
export const BASE_FILES = {
  'package.json': JSON.stringify({ name: 'book-example', version: '0.1.0', private: true,
    scripts: { dev: 'next dev', build: 'next build', start: 'next start' } }, null, 2) + '\n',
  'next.config.ts': `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
`,
  'tsconfig.json': JSON.stringify({
    compilerOptions: { target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true, strict: true,
      noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true,
      jsx: 'react-jsx', incremental: true, plugins: [{ name: 'next' }], paths: { '@/*': ['./*'] } },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts', '.next/dev/types/**/*.ts', '**/*.mts'],
    exclude: ['node_modules', 'tests', 'e2e'] }, null, 2) + '\n',
  'app/layout.tsx': `export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
};
const TAILWIND_CONFIG = `  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
`;

// ---------------------------------------------------------------- helpers
export function dedent(src) {
  const lines = src.replace(/<\\\/script>/gi, '</' + 'script>').replace(/\t/g, '    ').split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const min = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(Number.isFinite(min) ? min : 0)).join('\n');
}
const unescapeHtml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const attr = (a, n) => { const m = a.match(new RegExp('\\s' + n + '="([^"]*)"')); return m ? unescapeHtml(m[1]) : undefined; };
const has = (a, n) => new RegExp('\\s' + n + '(\\s|=|$)').test(a);
function langOf(a) {
  const l = attr(a, 'data-lang');
  if (l) return l;
  const f = attr(a, 'data-file') || '';
  const ext = f.split('.').pop();
  return { sh: 'shell', txt: 'text', json: 'json', css: 'css', md: 'text', env: 'text' }[ext] || (f ? 'code' : 'code');
}
const lineRe = (e) => new RegExp('^' + e.split('…').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
const norm = (l) => l.replace(/\s+/g, ' ').trim();
export function matches(expected, actual) {
  const E = expected.map(norm), A = actual.map(norm);
  const memo = new Map();
  const go = (i, j) => {
    const key = i * 100000 + j;
    if (memo.has(key)) return memo.get(key);
    let r;
    if (i === E.length) r = j === A.length;
    else if (E[i] === '...') { r = false; for (let k = j; k <= A.length && !r; k++) r = go(i + 1, k); }
    else r = j < A.length && (E[i].includes('…') ? lineRe(E[i]).test(A[j]) : E[i] === A[j]) && go(i + 1, j + 1);
    memo.set(key, r);
    return r;
  };
  return go(0, 0);
}
const toLines = (s) => s.replace(/\r/g, '').split('\n').map((l) => l.trimEnd());
const trimBlank = (ls) => { while (ls.length && !ls[0].trim()) ls.shift(); while (ls.length && !ls.at(-1).trim()) ls.pop(); return ls; };
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '');

function run(cmd, args, cwd, timeout = 240000, extraEnv = {}) {
  const r = spawnSync(cmd, args, { cwd, env: { ...env, ...extraEnv }, encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status ?? 1, out: stripAnsi((r.stdout || '') + (r.stderr || '')) };
}

// ---------------------------------------------------------------- headless Chrome (CDP)
class Browser {
  async start() {
    this.port = 9400 + Math.floor(Math.random() * 400);
    this.proc = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${this.port}`, '--no-first-run',
      `--user-data-dir=${mkdtempSync(join(tmpdir(), 'nextbook-chrome-'))}`, 'about:blank'], { stdio: 'ignore' });
    let targets;
    for (let i = 0; i < 100; i++) { try { targets = await (await fetch(`http://127.0.0.1:${this.port}/json`)).json(); break; } catch { await sleep(100); } }
    this.ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((r) => this.ws.addEventListener('open', r));
    this.id = 1; this.pending = new Map(); this.errors = [];
    this.ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) { const p = this.pending.get(m.id); this.pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
      if (m.method === 'Runtime.exceptionThrown') this.errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
    });
    await this.send('Page.enable'); await this.send('Runtime.enable');
    await this.send('Emulation.setDeviceMetricsOverride', { width: 1100, height: 900, deviceScaleFactor: 1, mobile: false });
  }
  send(method, params = {}) { const id = this.id++; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  async settle() {
    for (let i = 0; i < 100; i++) { if ((await this.eval('document.readyState').catch(() => '')) === 'complete') break; await sleep(50); }
    // wait until the visible text stops changing (streaming, hydration, client effects)
    let last = '', same = 0;
    for (let i = 0; i < 100 && same < 8; i++) { await sleep(100); const t = await this.eval('document.body ? document.body.innerText : ""').catch(() => ''); same = t === last ? same + 1 : 0; last = t; }
  }
  async goto(url) { await this.send('Page.navigate', { url }); await sleep(150); await this.settle(); }
  async step(s, base) {
    const [op, ...restParts] = s.split(':'); const rest = restParts.join(':').trim();
    const q = (sel) => `document.querySelector(${JSON.stringify(sel)})`;
    if (op === 'tap') { await this.eval(`(() => { const e = ${q(rest)}; if (!e) throw new Error('no element'); e.click(); })()`); return; }   // click without waiting for the page to settle
    if (op === 'click') await this.eval(`(() => { const e = ${q(rest)}; if (!e) throw new Error('no element ${rest.replace(/'/g, '')}'); e.click(); })()`);
    else if (op === 'fill') {
      const j = rest.indexOf(']='); const i = j >= 0 ? j + 1 : rest.indexOf('=');   // the '=' after an attribute selector
      const sel = rest.slice(0, i), val = rest.slice(i + 1);
      await this.eval(`(() => { const e = ${q(sel)}; if (!e) throw new Error('no element'); e.focus();
        const proto = e instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : e instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, ${JSON.stringify(val)});
        e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    } else if (op === 'submit') await this.eval(`${q(rest)}.requestSubmit()`);
    else if (op === 'press') { await this.send('Input.dispatchKeyEvent', { type: 'keyDown', key: rest, code: rest, windowsVirtualKeyCode: rest === 'Enter' ? 13 : 0, text: rest === 'Enter' ? '\r' : undefined }); await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key: rest, code: rest }); }
    else if (op === 'wait') { await sleep(Number(rest)); return; }
    else if (op === 'goto') { await this.goto(base + rest); return; }
    else if (op === 'reload') { await this.send('Page.reload'); await sleep(150); }
    else throw new Error('unknown step ' + s);
    await sleep(120); await this.settle();
  }
  stop() { try { this.ws.close(); } catch {} this.proc.kill(); }
}
let browser = null;
async function getBrowser() { if (!browser) { browser = new Browser(); await browser.start(); } return browser; }

// ---------------------------------------------------------------- one page
async function startServer(dir, port) {
  const proc = spawn(NEXT, ['start', '-p', String(port)], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  proc.stdout.on('data', (d) => (log += d)); proc.stderr.on('data', (d) => (log += d));
  for (let i = 0; i < 200; i++) { try { await fetch(`http://localhost:${port}/__ping__`); break; } catch { await sleep(100); } }
  return { proc, log: () => stripAnsi(log) };
}
let nextPort = 3100 + Math.floor(Math.random() * 500);

async function checkPage(path) {
  const text = readFileSync(path, 'utf8');
  const page = basename(path, '.html');
  const blocks = [...text.matchAll(BLOCK)].map((m) => ({ a: m[1], code: dedent(m[2]), index: m.index, end: m.index + m[0].length, line: text.slice(0, m.index).split('\n').length }));
  let ok = 0, fail = 0, skip = 0;
  const say = (b, msg) => { fail++; console.log(`FAIL ${basename(path)}:${b.line} (${attr(b.a, 'data-file') || langOf(b.a)}) ${msg}\n`); };
  const adjacent = (x, y) => y && !text.slice(x.end, y.index).includes('<script');

  // 1. assign blocks to apps
  const apps = new Map();   // name -> { files: Map, checks: [], errorsBlock }
  const app = (name) => { if (!apps.has(name)) apps.set(name, { name, files: new Map(), checks: [], errorsBlocks: [] }); return apps.get(name); };
  let lastApp = 'main', lastCode = null;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i], lang = langOf(b.a), file = attr(b.a, 'data-file');
    if (has(b.a, 'data-norun') || has(b.a, 'data-nocompare')) { skip++; if (lang !== 'text') lastCode = null; continue; }
    const appName = attr(b.a, 'data-app') || (lang === 'text' || lang === 'errors' || (lang === 'shell' && !file) ? lastApp : 'main');
    if (has(b.a, 'data-node')) {
      const next = blocks[i + 1];
      const expect = adjacent(b, next) && langOf(next.a) === 'text' ? next : null;
      app('__node__').checks.push({ kind: 'node', b, file: file || 'snippet.ts', expect });
      if (expect) i++;
      continue;
    }
    if (file && !attr(b.a, 'data-lang')) {
      const A = app(appName);
      if (A.files.has(file)) { say(b, `${file} is written twice in app "${appName}" (use data-app)`); continue; }
      A.files.set(file, b.code); lastApp = appName; lastCode = b; skip++;
      continue;
    }
    if (lang === 'errors') { if (lastCode && adjacent(lastCode, b) || attr(b.a, 'data-app')) { app(appName).errorsBlocks.push(b); } else { say(b, 'errors block without a code block before it'); } continue; }
    if (lang === 'shell' && has(b.a, 'data-run')) { app(appName).checks.push({ kind: 'shell', b }); lastApp = appName; continue; }
    if (lang === 'text' && (attr(b.a, 'data-url') || attr(b.a, 'data-eval'))) { app(appName).checks.push({ kind: 'browser', b }); continue; }
    skip++;
  }

  // 2. Node snippets
  const nodeApp = apps.get('__node__');
  if (nodeApp) {
    const dir = mkdtempSync(join(tmpdir(), 'nextbook-node-'));
    writeFileSync(join(dir, 'package.json'), '{ "type": "module" }\n');
    for (const c of nodeApp.checks) {
      const f = join(dir, c.file); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, c.b.code + '\n');
      const r = run(process.execPath, ['--experimental-strip-types', '--no-warnings', f], dir, 30000);
      if (!c.expect) { r.code ? say(c.b, 'crashed\n' + r.out.slice(-600)) : ok++; continue; }
      const got = trimBlank(toLines(r.out));
      if (matches(trimBlank(toLines(c.expect.code)), got)) ok++;
      else say(c.b, `output differs\n--- book\n${c.expect.code}\n--- real\n${got.join('\n')}`);
    }
    rmSync(dir, { recursive: true, force: true });
    apps.delete('__node__');
  }

  // 3. Next.js apps
  for (const A of apps.values()) {
    if (!A.files.size && !A.checks.length) continue;
    const dir = join(WORK, `${page}-${A.name}`);
    rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
    const files = new Map(Object.entries(BASE_FILES));
    for (const [f, c] of A.files) files.set(f, c + '\n');
    // Tailwind: add the create-next-app loader rule when a stylesheet imports it
    const usesTailwind = [...A.files.values()].some((c) => c.includes('@import "tailwindcss"'));
    if (usesTailwind && !A.files.has('next.config.ts')) files.set('next.config.ts', BASE_FILES['next.config.ts'].replace('  partialPrefetching: true,\n', '  partialPrefetching: true,\n' + TAILWIND_CONFIG));
    for (const [f, c] of files) { const p = join(dir, f); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); }
    // public/ assets used by the image examples
    if (existsSync(join(TOOLS, 'assets'))) for (const f of readdirSync(join(TOOLS, 'assets'))) { mkdirSync(join(dir, 'public'), { recursive: true }); copyFileSync(join(TOOLS, 'assets', f), join(dir, 'public', f)); }
    const build = run(NEXT, ['build'], dir, 300000);
    // show paths the way a reader sees them in their own project: ./app/page.tsx, not ./.work/<page>-<app>/app/page.tsx
    const buildLines = trimBlank(toLines(build.out.replaceAll(`./.work/${page}-${A.name}/`, './')));
    const firstFile = [...A.files.keys()][0];
    const owner = blocks.find((b) => attr(b.a, 'data-file') === firstFile && (attr(b.a, 'data-app') || 'main') === A.name) || blocks[0];
    if (A.errorsBlocks.length) {
      for (const eb of A.errorsBlocks) {
        if (build.code === 0) say(eb, `app "${A.name}" builds, but the page shows a build error`);
        else if (matches(trimBlank(toLines(eb.code)), buildLines)) ok++;
        else say(eb, `build errors differ\n--- book\n${eb.code}\n--- real\n${buildLines.join('\n')}`);
      }
      if (build.code !== 0) { for (const c of A.checks) if (c.kind === 'shell') checkShell(c, dir, null, buildLines); if (!KEEP) rmSync(dir, { recursive: true, force: true }); continue; }
    } else if (build.code !== 0) {
      say(owner, `app "${A.name}" fails to build\n${buildLines.slice(-40).join('\n')}`);
      if (!KEEP) rmSync(dir, { recursive: true, force: true });
      continue;
    } else ok++;   // the build itself (all files type-check and compile)

    const port = nextPort++;
    const server = A.checks.length ? await startServer(dir, port) : null;
    const base = `http://localhost:${port}`;
    for (const c of A.checks) {
      if (c.kind === 'shell') { const r = checkShell(c, dir, port, buildLines); r ? say(c.b, r) : ok++; continue; }
      const b = c.b;
      const br = await getBrowser();
      try {
        br.errors = [];
        const url = attr(b.a, 'data-url');
        const nojs = has(b.a, 'data-nojs');
        await br.send('Emulation.setScriptExecutionDisabled', { value: nojs });
        if (url) await br.goto(base + url);
        for (const s of (attr(b.a, 'data-steps') || '').split(';').map((x) => x.trim()).filter(Boolean)) await br.step(s, base);
        const expr = attr(b.a, 'data-eval') || 'document.body.innerText';
        let val = await br.eval(expr);
        if (typeof val !== 'string') val = JSON.stringify(val, null, 2);
        // blank lines are ignored: Chrome's innerText adds them inconsistently between block elements
        const got = toLines(val).filter((l) => l.trim());
        const want = toLines(b.code).filter((l) => l.trim());
        if (nojs) { br.stop(); browser = null; }   // re-enabling scripts doesn't always stick: start a fresh Chrome
        if (matches(want, got)) ok++;
        else say(b, `page text differs at ${url || expr}\n--- book\n${want.join('\n')}\n--- real\n${got.join('\n')}${br.errors.length ? '\n--- JS errors\n' + br.errors.join('\n').slice(0, 600) : ''}\n--- server log\n${server.log().slice(-800)}`);
      } catch (e) { say(b, `browser step failed: ${e.message}\n--- server log\n${server?.log().slice(-800)}`); }
    }
    if (server) server.proc.kill();
    if (!KEEP) rmSync(dir, { recursive: true, force: true });
  }
  return { ok, fail, skip };
}

function checkShell(c, dir, port, buildLines) {
  const workdir = join(dir, attr(c.b.a, 'data-cwd') || '');
  const steps = [];
  for (const line of c.b.code.split('\n')) {
    if (line.startsWith('$ ')) steps.push([line.slice(2), []]);
    else if (steps.length) steps.at(-1)[1].push(line);
  }
  const problems = [];
  for (const [cmd, expected] of steps) {
    let got;
    if (/^(npm run build|npx next build|next build)$/.test(cmd.trim())) got = buildLines;
    else {
      const real = port ? cmd.replaceAll('localhost:3000', `localhost:${port}`).replaceAll('PORT=3000', `PORT=${port}`) : cmd;
      const r = spawnSync('/bin/sh', ['-c', `{ ${real} ; } 2>&1`], { cwd: workdir, env, encoding: 'utf8', timeout: 60000 });
      got = trimBlank(toLines(stripAnsi(r.stdout || '')));
      if (port) got = got.map((l) => l.replaceAll(`localhost:${port}`, 'localhost:3000'));
    }
    trimBlank(expected);
    if (expected.length && !matches(expected, got)) problems.push(`$ ${cmd}\n--- book\n${expected.join('\n')}\n--- real\n${got.join('\n')}`);
  }
  return problems.length ? '\n' + problems.join('\n') : null;
}

// ---------------------------------------------------------------- main
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const pages = args.length ? args.map((a) => (a.includes('/') ? a : join(ROOT, a)))
    : readdirSync(ROOT).filter((f) => /^(\d\d-|appendix-|playground-howto|faq).*\.html$/.test(f)).sort().map((f) => join(ROOT, f));
  mkdirSync(WORK, { recursive: true });
  const total = { ok: 0, fail: 0, skip: 0 };
  const version = run(NEXT, ['--version'], TOOLS).out.trim();
  try {
    for (const p of pages) {
      const t0 = Date.now();
      const r = await checkPage(p);
      for (const k in total) total[k] += r[k];
      console.log(`${basename(p).padEnd(30)} ok=${String(r.ok).padStart(3)} fail=${String(r.fail).padStart(2)} skipped=${String(r.skip).padStart(3)}  (${Math.round((Date.now() - t0) / 1000)}s)`);
    }
  } finally { browser?.stop(); }
  console.log(`TOTAL ok=${total.ok} fail=${total.fail} skipped=${total.skip}  (${version}, Node ${process.version})`);
  process.exit(total.fail ? 1 : 0);
}
