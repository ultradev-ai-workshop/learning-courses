// Builds every example in the book with the pinned Tailwind CSS (tools/package.json) and checks that
// every output shown on the page is the real one. Screenshots on the pages are produced here too.
//
// How a page is checked
// - Blocks with data-file="…" are files of a small project. data-app="name" puts a block in another
//   project of the same page (default "main"); writing the same file twice in one project is an error.
//   Output blocks belong to the project of the code block before them (or their own data-app).
// - Three kinds of project:
//     CLI (default)  index.html + input.css. input.css defaults to `@import "tailwindcss";` and an
//                    index.html without <html> is wrapped in a page that links output.css. Built with
//                    `tailwindcss -i input.css -o output.css` (the @tailwindcss/cli).
//     Vite           any project with vite.config.ts/js: built with `vite build`, dist/ is served.
//     Next.js        any project with app/page.tsx: built with `next build`, served with `next start`.
//   If the build fails, a data-lang="errors" block must match its output (and a passing build with one FAILS).
// - Output blocks, checked in page order:
//     data-lang="css" data-css="utilities"  → that part of output.css, verbatim: utilities | theme |
//                                             components | base | properties | rest (all but the
//                                             header, theme and base) | full. data-grep="re" keeps matching lines.
//     data-lang="text" data-url="index.html" → document.body.innerText in headless Chrome
//       data-eval="expr"                     → the value of a JS expression instead
//       data-width="400"                     → the viewport width (default 1000)
//       data-scheme="dark"                   → emulates prefers-color-scheme: dark
//       data-steps="hover:#b; focus:#i; click:#x; fill:#i=hi\nthere; press:Tab; wait:300; width:500; scheme:dark; eval:js"
//     data-lang="shot" data-shot="name"      → screenshot saved to shots/name.png (same attributes as text,
//       plus data-clip="selector" or "viewport", default the body's content). The block's text is the image's alt text.
//     data-lang="shell" data-run             → each "$ cmd" line runs in the project folder.
// - data-node runs a .mjs/.js block with Node; the text block after it must match its output.
//   data-norun skips a block; data-nocompare shows an output unchecked.
// - In expected output a line "..." matches any number of lines, and "…" inside a line matches any
//   text (timings). Blank lines are ignored when comparing browser text.
//
// Usage: node tools/check-snippets.mjs [page.html ...] [--keep]     (run `npm install` in tools/ first)
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TOOLS, '..');
const WORK = join(TOOLS, '.work');
const SHOTS = join(ROOT, 'shots');
const BIN = join(TOOLS, 'node_modules', '.bin');
if (!existsSync(join(BIN, 'tailwindcss'))) { console.error('tailwindcss not found: run `npm install` in tools/ first'); process.exit(2); }
const KEEP = process.argv.includes('--keep');
const FIX = process.argv.includes('--fix');   // write the real outputs into mismatched output blocks (review the diff!)
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BLOCK = /<script type="text\/plain" class="code"((?:[^>"]|"[^"]*")*)>([\s\S]*?)<\/script>/g;
const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', NEXT_TELEMETRY_DISABLED: '1', CI: '1',
  PATH: BIN + ':' + dirname(process.execPath) + ':' + process.env.PATH };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- project baselines
export const PAGE = (body, title = 'Example') => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="./output.css" rel="stylesheet">
</head>
<body>
${body.split('\n').map((l) => (l ? '  ' + l : l)).join('\n')}
</body>
</html>
`;
const VITE_BASE = { 'package.json': JSON.stringify({ name: 'vite-example', private: true, version: '0.0.0', type: 'module',
  scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' } }, null, 2) + '\n' };
// create-next-app 16.4.5 --no-tailwind, then the Tailwind docs' Next.js guide (PostCSS)
export const NEXT_BASE = {
  'package.json': JSON.stringify({ name: 'next-example', version: '0.1.0', private: true,
    scripts: { dev: 'next dev', build: 'next build', start: 'next start' } }, null, 2) + '\n',
  'next.config.ts': `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
`,
  'postcss.config.mjs': `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`,
  'tsconfig.json': JSON.stringify({
    compilerOptions: { target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true, strict: true,
      noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true,
      jsx: 'react-jsx', incremental: true, plugins: [{ name: 'next' }], paths: { '@/*': ['./*'] } },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts', '.next/dev/types/**/*.ts', '**/*.mts'],
    exclude: ['node_modules'] }, null, 2) + '\n',
  'app/globals.css': '@import "tailwindcss";\n',
  'app/layout.tsx': `import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
};

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
  return { sh: 'shell', txt: 'text' }[f.split('.').pop()] || 'code';
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
function run(cmd, args, cwd, timeout = 240000) {
  const r = spawnSync(cmd, args, { cwd, env, encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status ?? 1, out: stripAnsi((r.stdout || '') + (r.stderr || '')) };
}

// Split compiled CSS into its top-level statements, so a block can show one layer verbatim.
export function topLevel(css) {
  const out = []; let depth = 0, start = 0, q = null;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === '\\') { i++; continue; }   // escaped character in a selector, e.g. .content-\[\'Hi\'\]
    if (c === '"' || c === "'") q = c;
    else if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? css.length : e + 1; if (!depth) start = i + 1; }
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (!depth) { out.push(css.slice(start, i + 1).trim()); start = i + 1; } }
    else if (c === ';' && !depth) { out.push(css.slice(start, i + 1).trim()); start = i + 1; }
  }
  return out.filter(Boolean);
}
export function cssPart(css, part) {
  const st = topLevel(css);
  const isLayer = (s, n) => s.startsWith(`@layer ${n} {`);
  let pick;
  if (part === 'full') return css.trim();
  if (part === 'rest') pick = st.filter((s) => !/^@layer (theme|base) \{/.test(s) && !/^@layer [\w, ]+;$/.test(s));
  else pick = st.filter((s) => isLayer(s, part));
  return pick.join('\n');
}

// ---------------------------------------------------------------- headless Chrome (CDP)
class Browser {
  async start() {
    this.port = 9400 + Math.floor(Math.random() * 400);
    this.proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none',
      `--remote-debugging-port=${this.port}`, '--no-first-run', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'twbook-chrome-'))}`, 'about:blank'], { stdio: 'ignore' });
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
  }
  send(method, params = {}) { const id = this.id++; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })); }
  async setup(width, scheme) {
    this.width = width;
    await this.send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false });
    await this.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme || 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  async settle() {
    for (let i = 0; i < 100; i++) { if ((await this.eval('document.readyState').catch(() => '')) === 'complete') break; await sleep(50); }
    await this.eval('document.fonts ? document.fonts.ready.then(() => 1) : 1').catch(() => 0);
    let last = '', same = 0;
    for (let i = 0; i < 60 && same < 4; i++) { await sleep(60); const t = await this.eval('document.body ? document.body.innerText : ""').catch(() => ''); same = t === last ? same + 1 : 0; last = t; }
  }
  async goto(url) { await this.send('Page.navigate', { url }); await sleep(100); await this.settle(); }
  async center(sel) {
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; })()`);
    if (!r) throw new Error('no element ' + sel);
    return r;
  }
  async step(s, base) {
    const [op, ...restParts] = s.split(':'); const rest = restParts.join(':').trim();
    const q = (sel) => `document.querySelector(${JSON.stringify(sel)})`;
    if (op === 'hover') { const { x, y } = await this.center(rest); await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); }
    else if (op === 'click') { const { x, y } = await this.center(rest);
      for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }); }
    else if (op === 'focus') await this.eval(`(() => { const e = ${q(rest)}; if (!e) throw new Error('no element'); e.focus({ focusVisible: true }); })()`);
    else if (op === 'fill') {
      const j = rest.indexOf(']='); const i = j >= 0 ? j + 1 : rest.indexOf('=');
      const sel = rest.slice(0, i), val = rest.slice(i + 1).replace(/\\n/g, '\n');   // \n in the attribute types a new line
      await this.eval(`(() => { const e = ${q(sel)}; if (!e) throw new Error('no element'); e.focus(); })()`);
      await this.eval(`${q(sel)}.select ? ${q(sel)}.select() : 0`);
      await this.send('Input.insertText', { text: val });
      await this.eval(`${q(sel)}.blur()`);
    } else if (op === 'press') {
      const codes = { Tab: 9, Enter: 13, Escape: 27, Space: 32 };
      await this.send('Input.dispatchKeyEvent', { type: 'keyDown', key: rest === 'Space' ? ' ' : rest, code: rest, windowsVirtualKeyCode: codes[rest] || 0, text: rest === 'Enter' ? '\r' : rest === 'Space' ? ' ' : undefined });
      await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key: rest === 'Space' ? ' ' : rest, code: rest, windowsVirtualKeyCode: codes[rest] || 0 });
    }
    else if (op === 'wait') { await sleep(Number(rest)); return; }
    else if (op === 'width') { await this.setup(Number(rest), this.scheme); }
    else if (op === 'scheme') { this.scheme = rest; await this.setup(this.width, rest); }
    else if (op === 'eval') await this.eval(rest);
    else if (op === 'goto') { await this.goto(base + rest); return; }
    else throw new Error('unknown step ' + s);
    await sleep(150);
  }
  async shot(file, clipSel) {
    // the example pages have no body margin (Preflight): give unclipped screenshots some breathing room
    if (!clipSel) await this.eval("document.body.style.padding = '20px'");
    const box = clipSel === 'viewport' ? await this.eval('({ x: 0, y: 0, width: innerWidth, height: innerHeight })') : await this.eval(`(() => {
      const sel = ${JSON.stringify(clipSel || '')};
      const els = sel ? [document.querySelector(sel)] : [...document.body.children].filter((e) => !/^(SCRIPT|STYLE)$/.test(e.tagName));
      if (!els.length || !els[0]) return null;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const e of els) { const b = e.getBoundingClientRect(); if (!b.width && !b.height) continue; x0 = Math.min(x0, b.left); y0 = Math.min(y0, b.top); x1 = Math.max(x1, b.right); y1 = Math.max(y1, b.bottom); }
      if (!sel) { x0 = 0; y0 = 0; x1 = document.documentElement.clientWidth; y1 = Math.max(y1, 0) + 20; }
      return { x: Math.max(0, x0 + scrollX), y: Math.max(0, y0 + scrollY), width: Math.ceil(x1 - x0), height: Math.ceil(y1 - y0) };
    })()`);
    if (!box || !box.width || !box.height) throw new Error('nothing to screenshot');
    await this.eval('scrollTo(0, 0)');
    const r = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...box, scale: 2 } });
    const png = Buffer.from(r.data, 'base64');
    mkdirSync(dirname(file), { recursive: true });
    if (!existsSync(file) || !readFileSync(file).equals(png)) writeFileSync(file, png);
    return box;
  }
  stop() { try { this.ws.close(); } catch {} this.proc.kill(); }
}
let browser = null;
async function getBrowser() { if (!browser) { browser = new Browser(); await browser.start(); } return browser; }

// ---------------------------------------------------------------- servers
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
function staticServer(dir) {
  const srv = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = normalize(join(dir, p));
    if (!f.startsWith(dir)) { res.writeHead(403); return res.end(); }
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!existsSync(f)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(readFileSync(f));
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r({ port: srv.address().port, stop: () => srv.close(), log: () => '' })));
}
let nextPort = 3100 + Math.floor(Math.random() * 500);
async function nextServer(dir) {
  const port = nextPort++;
  const proc = spawn(join(BIN, 'next'), ['start', '-p', String(port)], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  proc.stdout.on('data', (d) => (log += d)); proc.stderr.on('data', (d) => (log += d));
  for (let i = 0; i < 200; i++) { try { await fetch(`http://localhost:${port}/__ping__`); break; } catch { await sleep(100); } }
  return { port, stop: () => proc.kill(), log: () => stripAnsi(log) };
}

// ---------------------------------------------------------------- one page
async function checkPage(path) {
  const text = readFileSync(path, 'utf8');
  const page = basename(path, '.html');
  const blocks = [...text.matchAll(BLOCK)].map((m) => ({ a: m[1], code: dedent(m[2]), index: m.index, end: m.index + m[0].length, line: text.slice(0, m.index).split('\n').length }));
  let ok = 0, fail = 0, skip = 0;
  const fixes = [];
  const say = (b, msg, real) => {
    if (FIX && real != null) { fixes.push({ b, real }); console.log(`fixed ${basename(path)}:${b.line} (${langOf(b.a)})`); return; }
    fail++; console.log(`FAIL ${basename(path)}:${b.line} (${attr(b.a, 'data-file') || langOf(b.a)}) ${msg}\n`);
  };
  const adjacent = (x, y) => y && !text.slice(x.end, y.index).includes('<script');

  const apps = new Map();
  const app = (name) => { if (!apps.has(name)) apps.set(name, { name, files: new Map(), checks: [], errorsBlocks: [] }); return apps.get(name); };
  let lastApp = 'main', lastCode = null;
  const shotNames = new Set();
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i], lang = langOf(b.a), file = attr(b.a, 'data-file');
    if (has(b.a, 'data-norun') || has(b.a, 'data-nocompare')) { skip++; if (lang !== 'text') lastCode = null; continue; }
    const output = ['text', 'errors', 'css', 'shot'].includes(lang) || (lang === 'shell' && !file);
    const appName = attr(b.a, 'data-app') || (output ? lastApp : 'main');
    if (has(b.a, 'data-node')) {
      const next = blocks[i + 1];
      const expect = adjacent(b, next) && langOf(next.a) === 'text' ? next : null;
      app('__node__').checks.push({ kind: 'node', b, file: file || 'snippet.mjs', expect });
      if (expect) i++;
      continue;
    }
    if (file && !attr(b.a, 'data-lang')) {
      const A = app(appName);
      if (A.files.has(file)) { say(b, `${file} is written twice in app "${appName}" (use data-app)`); continue; }
      A.files.set(file, b.code); lastApp = appName; lastCode = b; skip++;
      continue;
    }
    if (lang === 'errors') { if ((lastCode && adjacent(lastCode, b)) || attr(b.a, 'data-app')) app(appName).errorsBlocks.push(b); else say(b, 'errors block without a code block before it'); continue; }
    if (lang === 'shell' && has(b.a, 'data-run')) { app(appName).checks.push({ kind: 'shell', b }); lastApp = appName; continue; }
    if (lang === 'css' && attr(b.a, 'data-css')) { app(appName).checks.push({ kind: 'css', b }); continue; }
    if (lang === 'shot') {
      const n = attr(b.a, 'data-shot');
      if (!n) { say(b, 'shot without data-shot'); continue; }
      if (shotNames.has(n)) { say(b, `shot name ${n} used twice`); continue; }
      shotNames.add(n); app(appName).checks.push({ kind: 'browser', b, shot: n }); continue;
    }
    if (lang === 'text' && (attr(b.a, 'data-url') || attr(b.a, 'data-eval'))) { app(appName).checks.push({ kind: 'browser', b }); continue; }
    skip++;
  }

  // Node snippets
  const nodeApp = apps.get('__node__');
  if (nodeApp) {
    const dir = join(WORK, `${page}-node`);
    rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'package.json'), '{ "type": "module" }\n');
    for (const c of nodeApp.checks) {
      const f = join(dir, c.file); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, c.b.code + '\n');
      const r = run(process.execPath, ['--no-warnings', f], dir, 60000);
      if (!c.expect) { r.code ? say(c.b, 'crashed\n' + r.out.slice(-600)) : ok++; continue; }
      const got = trimBlank(toLines(r.out));
      if (matches(trimBlank(toLines(c.expect.code)), got)) ok++;
      else say(c.expect, `output differs\n--- book\n${c.expect.code}\n--- real\n${got.join('\n')}`, got.join('\n'));
    }
    if (!KEEP) rmSync(dir, { recursive: true, force: true });
    apps.delete('__node__');
  }

  for (const A of apps.values()) {
    if (!A.files.size && !A.checks.length) continue;
    const dir = join(WORK, `${page}-${A.name}`);
    rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
    const kind = [...A.files.keys()].some((f) => /^app\/.*page\.tsx$/.test(f)) ? 'next' : [...A.files.keys()].some((f) => /^vite\.config\.(ts|js|mjs)$/.test(f)) ? 'vite' : 'cli';
    const files = new Map(Object.entries(kind === 'next' ? NEXT_BASE : kind === 'vite' ? VITE_BASE : {}));
    for (const [f, c] of A.files) files.set(f, c + '\n');
    if (kind === 'cli') {
      if (!files.has('input.css')) files.set('input.css', '@import "tailwindcss";\n');
      const html = files.get('index.html');
      if (html && !/<html[\s>]/i.test(html)) files.set('index.html', PAGE(html.trimEnd()));
    }
    for (const [f, c] of files) { const p = join(dir, f); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); }
    let build;
    if (kind === 'cli') build = run(join(BIN, 'tailwindcss'), ['-i', 'input.css', '-o', 'output.css'], dir, 60000);
    else if (kind === 'vite') build = run(join(BIN, 'vite'), ['build'], dir, 120000);
    else build = run(join(BIN, 'next'), ['build'], dir, 300000);
    const buildLines = trimBlank(toLines(build.out.replaceAll(dir + '/', './').replaceAll(`./.work/${page}-${A.name}/`, './')));
    const firstFile = [...A.files.keys()][0];
    const owner = blocks.find((b) => attr(b.a, 'data-file') === firstFile && (attr(b.a, 'data-app') || 'main') === A.name) || blocks[0];
    if (A.errorsBlocks.length) {
      for (const eb of A.errorsBlocks) {
        if (build.code === 0) say(eb, `app "${A.name}" builds, but the page shows a build error`);
        else if (matches(trimBlank(toLines(eb.code)), buildLines)) ok++;
        else say(eb, `build errors differ\n--- book\n${eb.code}\n--- real\n${buildLines.join('\n')}`, buildLines.join('\n'));
      }
      if (build.code !== 0) { for (const c of A.checks) if (c.kind === 'shell') { const r = checkShell(c, dir, null); r ? say(c.b, r.msg, r.real) : ok++; } if (!KEEP) rmSync(dir, { recursive: true, force: true }); continue; }
    } else if (build.code !== 0) {
      say(owner, `app "${A.name}" (${kind}) fails to build\n${buildLines.slice(-40).join('\n')}`);
      if (!KEEP) rmSync(dir, { recursive: true, force: true });
      continue;
    } else ok++;

    const outCss = kind === 'cli' && existsSync(join(dir, 'output.css')) ? readFileSync(join(dir, 'output.css'), 'utf8') : null;
    let server = null;
    const needsServer = A.checks.some((c) => c.kind === 'browser');
    if (needsServer) server = kind === 'next' ? await nextServer(dir) : await staticServer(kind === 'vite' ? join(dir, 'dist') : dir);
    const base = server ? `http://${kind === 'next' ? 'localhost' : '127.0.0.1'}:${server.port}/` : '';
    for (const c of A.checks) {
      const b = c.b;
      if (c.kind === 'shell') { const r = checkShell(c, dir, server?.port); r ? say(b, r.msg, r.real) : ok++; continue; }
      if (c.kind === 'css') {
        if (!outCss) { say(b, 'no output.css (css blocks need a CLI project)'); continue; }
        let got = toLines(cssPart(outCss, attr(b.a, 'data-css')));
        const grep = attr(b.a, 'data-grep');
        if (grep) got = got.filter((l) => new RegExp(grep).test(l));
        got = trimBlank(got);
        const want = trimBlank(toLines(b.code));
        if (matches(want, got)) ok++;
        else say(b, `generated CSS differs (${attr(b.a, 'data-css')})\n--- book\n${want.join('\n')}\n--- real\n${got.join('\n')}`, got.join('\n'));
        continue;
      }
      const br = await getBrowser();
      try {
        br.errors = [];
        br.scheme = attr(b.a, 'data-scheme') || 'light';
        await br.setup(Number(attr(b.a, 'data-width') || 1000), br.scheme);
        const url = attr(b.a, 'data-url') ?? 'index.html';
        await br.goto(base + url.replace(/^\//, ''));
        for (const s of (attr(b.a, 'data-steps') || '').split(';').map((x) => x.trim()).filter(Boolean)) await br.step(s, base);
        if (c.shot) {
          await br.shot(join(SHOTS, c.shot + '.png'), attr(b.a, 'data-clip'));
          if (br.errors.length) say(b, 'JS errors\n' + br.errors.join('\n')); else ok++;
          continue;
        }
        const expr = attr(b.a, 'data-eval') || 'document.body.innerText';
        let val = await br.eval(expr);
        if (typeof val !== 'string') val = JSON.stringify(val, null, 2);
        const got = toLines(val).filter((l) => l.trim());
        const want = toLines(b.code).filter((l) => l.trim());
        if (matches(want, got)) ok++;
        else say(b, `page text differs at ${url} ${attr(b.a, 'data-eval') ? '(eval)' : ''}\n--- book\n${want.join('\n')}\n--- real\n${got.join('\n')}${br.errors.length ? '\n--- JS errors\n' + br.errors.join('\n').slice(0, 600) : ''}\n--- server log\n${server.log().slice(-800)}`, toLines(val).join('\n'));
      } catch (e) { say(b, `browser step failed: ${e.message}\n--- server log\n${server?.log().slice(-800)}`); }
    }
    server?.stop();
    if (!KEEP) rmSync(dir, { recursive: true, force: true });
  }
  if (fixes.length) {
    let out = text;
    for (const { b, real } of fixes.sort((x, y) => y.b.index - x.b.index)) {
      const open = text.slice(b.index, b.end).match(/^<script(?:[^>"]|"[^"]*")*>/)[0];
      out = out.slice(0, b.index) + open + '\n' + real.replace(/<\/script>/gi, '<\\/script>') + '\n</script>' + out.slice(b.end);
    }
    writeFileSync(path, out);
    ok += fixes.length;
  }
  return { ok, fail, skip };
}

function checkShell(c, dir, port) {
  const workdir = join(dir, attr(c.b.a, 'data-cwd') || '');
  const steps = [];
  for (const line of c.b.code.split('\n')) {
    if (line.startsWith('$ ')) steps.push([line.slice(2), []]);
    else if (steps.length) steps.at(-1)[1].push(line);
  }
  const problems = [], realOut = [];
  for (const [cmd, expected] of steps) {
    const real = port ? cmd.replaceAll('localhost:3000', `localhost:${port}`) : cmd;
    const r = spawnSync('/bin/sh', ['-c', `{ ${real} ; } 2>&1`], { cwd: workdir, env, encoding: 'utf8', timeout: 120000 });
    let got = trimBlank(toLines(stripAnsi(r.stdout || '').replaceAll(dir + '/', './')));
    if (port) got = got.map((l) => l.replaceAll(`localhost:${port}`, 'localhost:3000'));
    trimBlank(expected);
    realOut.push('$ ' + cmd, ...(expected.length ? got : []));
    if (expected.length && !matches(expected, got)) problems.push(`$ ${cmd}\n--- book\n${expected.join('\n')}\n--- real\n${got.join('\n')}`);
  }
  return problems.length ? { msg: '\n' + problems.join('\n'), real: realOut.join('\n') } : null;
}

// ---------------------------------------------------------------- main
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const pages = args.length ? args.map((a) => (a.includes('/') ? a : join(ROOT, a)))
    : readdirSync(ROOT).filter((f) => /^(\d\d-|appendix-|playground-howto|faq).*\.html$/.test(f)).sort().map((f) => join(ROOT, f));
  mkdirSync(WORK, { recursive: true });
  const total = { ok: 0, fail: 0, skip: 0 };
  const version = run(join(BIN, 'tailwindcss'), ['--help'], TOOLS).out.split('\n')[0].trim();
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
