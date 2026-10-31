// End-to-end test of the problem pages over file:// in headless Chrome (DevTools protocol).
// Usage: node tools/e2e.mjs [path-to-chrome]      Writes screenshots to tools/screenshots/.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.argv[2] || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9341;
const SHOTS = join(ROOT, 'tools', 'screenshots');
mkdirSync(SHOTS, { recursive: true });
const DATA = JSON.parse(readFileSync(join(ROOT, 'problems.json'), 'utf8')).problems;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (cond, msg) => { console.log(`${cond ? '✓' : '✘'} ${msg}`); if (!cond) failures++; };

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--allow-file-access-from-files',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'e2e-'))}`, '--window-size=1200,1000', 'about:blank'], { stdio: 'ignore' });

let ws, nextId = 1; const pending = new Map(); const errors = [];
function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
async function evaluate(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
async function waitFor(expr, ms = 8000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { try { if (await evaluate(expr)) return true; } catch { /* page loading */ } await sleep(80); }
  return false;
}
async function open(path) {
  await send('Page.navigate', { url: 'file://' + join(ROOT, path) });
  await waitFor(`document.readyState === 'complete'`);
  await sleep(60);
}
async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(SHOTS, name), Buffer.from(data, 'base64'));
  console.log(`  saved tools/screenshots/${name}`);
}
const paste = (text) => `(() => { const t = document.querySelector('#check textarea'); t.value = ${JSON.stringify(text)};
  [...document.querySelectorAll('#check .btn.primary')].find(b => b.textContent === 'Check').click();
  return document.querySelector('#check .result')?.className || ''; })()`;

try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(200); } }
  ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); }
  });
  await send('Page.enable'); await send('Runtime.enable');

  // ---- index ----
  await open('index.html');
  await evaluate(`localStorage.clear(); sessionStorage.clear(); true`);
  await open('index.html');
  check(await evaluate(`document.querySelectorAll('#list li').length`) === 100, 'index lists all 100 problems');
  check(await evaluate(`document.querySelectorAll('#stats .stat').length`) === 4, 'four progress cards');
  await evaluate(`[...document.querySelectorAll('#chips .chip')].find(b => b.textContent === 'OOP').click(); true`);
  check(await evaluate(`document.querySelectorAll('#list li').length`) === 25, 'OOP filter shows 25');
  await evaluate(`[...document.querySelectorAll('#chips .chip')].find(b => b.textContent === 'All').click();
    const q = document.getElementById('q'); q.value = 'sudoku'; q.dispatchEvent(new Event('input')); true`);
  check(JSON.stringify(await evaluate(`[...document.querySelectorAll('#list .pid')].map(e => e.textContent)`)) === '["M11","H09"]', 'search "sudoku" finds M11 and H09');
  await evaluate(`const q2 = document.getElementById('q'); q2.value = ''; q2.dispatchEvent(new Event('input'));
    const s = document.getElementById('tag'); s.value = 'dynamic programming'; s.dispatchEvent(new Event('change')); true`);
  check(await evaluate(`document.querySelectorAll('#list li').length`) === DATA.filter((p) => p.tags.includes('dynamic programming')).length, 'tag filter matches the data');
  await evaluate(`const s2 = document.getElementById('tag'); s2.value = ''; s2.dispatchEvent(new Event('change')); true`);
  await shot('index-light.png');

  // ---- problem page: checker + progress ----
  const e11 = DATA.find((p) => p.id === 'E11');
  await open('problem.html?id=E11');
  check(await evaluate(`document.querySelector('h1').textContent`) === 'E11 · GCD and LCM', 'problem page title');
  check(await evaluate(`document.querySelectorAll('#check .tbtn').length`) === e11.tests.length, `E11 shows ${e11.tests.length} tests`);
  check(await evaluate(`document.querySelector('#check pre code').textContent`) === e11.tests[0].input, 'first test input shown');
  check((await evaluate(paste('gcd 6\nlcm 99\n'))).includes('bad'), 'wrong output is rejected');
  check((await evaluate(`document.querySelector('#check .result pre').textContent`)).includes('Line 2'), 'mismatch reports line 2');
  check((await evaluate(paste('gcd 6\r\nlcm 36   \n\n\n'))).includes('ok'), 'CRLF, trailing spaces and blank lines are ignored');
  check(await evaluate(`document.querySelector('#check .tbtn').classList.contains('pass')`), 'passed test is marked');
  for (let i = 1; i < e11.tests.length; i++) {
    await evaluate(`document.querySelectorAll('#check .tbtn')[${i}].click(); true`);
    await evaluate(paste(e11.tests[i].output));
  }
  check(await evaluate(`document.getElementById('solvedflag').textContent`) === '✓ Solved', 'all tests passed → solved');
  check((await evaluate(`localStorage.getItem('problems.progress.v1')`)).includes('"solved":true'), 'progress saved in localStorage');
  await evaluate(`document.getElementById('check').scrollIntoView(); true`);
  await shot('problem-solved.png');

  await open('problem.html?id=E12');
  await evaluate(paste(DATA.find((p) => p.id === 'E12').tests[0].output));
  await open('index.html');
  check(await evaluate(`document.querySelector('#list li:nth-child(11) .status').className`) === 'status solved', 'index shows E11 solved');
  check(await evaluate(`document.querySelector('#list li:nth-child(12) .status').className`) === 'status tried', 'index shows E12 started');
  check(await evaluate(`document.querySelector('#stats .num').textContent`) === '1 / 25', 'easy progress 1 / 25');

  // ---- large tests, manual marking, OOP design ----
  await open('problem.html?id=H01');
  const big = DATA.find((p) => p.id === 'H01').tests.findIndex((t) => t.large);
  await evaluate(`document.querySelectorAll('#check .tbtn')[${big}].click(); true`);
  check((await evaluate(`document.querySelector('#check .box').textContent`)).includes('large performance test'), 'large test explains the runner');
  await evaluate(`[...document.querySelectorAll('#check .btn')].find(b => b.textContent === 'Mark as solved').click(); true`);
  check(await evaluate(`document.getElementById('solvedflag').textContent`) === '✓ Solved', 'manual "Mark as solved"');
  await open('problem.html?id=O13');
  check(await evaluate(`[...document.querySelectorAll('h2')].some(h => h.textContent === 'Suggested design')`), 'OOP problem shows the suggested design');
  await shot('problem-oop.png');
  await open('problem.html?id=NOPE');
  check(await evaluate(`document.querySelector('h1').textContent`) === 'Problem not found', 'unknown id handled');

  // ---- every problem renders ----
  let rendered = 0;
  for (const p of DATA) {
    await open(`problem.html?id=${p.id}`);
    const ok = await evaluate(`document.querySelector('h1').textContent.startsWith(${JSON.stringify(p.id)}) && document.querySelectorAll('#check .tbtn').length === ${p.tests.length}`);
    if (ok) rendered++; else console.log(`  ${p.id} did not render correctly`);
  }
  check(rendered === 100, 'all 100 problem pages render with their tests');

  // ---- guide tabs ----
  await open('guide.html');
  check(await evaluate(`document.querySelectorAll('.codeblock').length`) === 8, 'guide shows 8 templates');
  await evaluate(`[...document.querySelectorAll('.tabs[data-group="io"] .chip')].find(b => b.textContent === 'Java').click(); true`);
  check(await evaluate(`[...document.querySelectorAll('.codeblock')].filter(b => !b.hidden).map(b => b.querySelector('.head span').textContent.split(' ')[0]).join()`) === 'Main.java,Main.java', 'language tab switches both groups');
  check(await evaluate(`[...document.querySelectorAll('.codeblock')].some(b => !b.hidden && b.textContent.includes('#include <iostream>'))`) === false, 'C++ hidden after choosing Java');
  await open('guide.html');
  check(await evaluate(`localStorage.getItem('problems.guide.lang')`) === 'Java', 'language choice remembered');

  // ---- launcher + book links ----
  await open('../index.html');
  await evaluate(`[...document.querySelectorAll('.level')].find(b => b.textContent.startsWith('Practice')).click(); true`);
  check(await evaluate(`document.getElementById('launch-btn').getAttribute('href')`) === 'problems/index.html', 'launcher mounts the problem set under Practice');
  check(await evaluate(`[...document.querySelectorAll('#launch-actions a')].map(a => a.getAttribute('href')).join()`) === 'problems/index.html,problems/guide.html', 'launcher extras link to the guide');
  await shot('launcher-practice.png');
  await open('../Beginner/python-book/index.html');
  check(await evaluate(`[...document.querySelectorAll('#sidebar .all-courses')].map(a => a.textContent).join('|')`) === '← All courses|🧩 Practice problems', 'book sidebar has the practice link');

  // ---- dark mode + mobile ----
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await open('problem.html?id=M13'); await shot('problem-dark.png');
  await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 780, deviceScaleFactor: 2, mobile: true });
  for (const page of ['index.html', 'problem.html?id=H06', 'problem.html?id=O17', 'guide.html', '../index.html']) {
    await open(page);
    const w = await evaluate(`document.documentElement.scrollWidth`);
    check(w <= 360, `no horizontal scroll at 360px: ${page} (${w}px)`);
  }
  await open('index.html'); await shot('index-mobile.png');
  await open('problem.html?id=E05'); await shot('problem-mobile.png');

  check(errors.length === 0, `no JavaScript errors${errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''}`);
} catch (e) {
  console.log('✘ crashed:', e); failures++;
} finally {
  chrome.kill();
}
console.log(failures ? `${failures} check(s) failed` : 'all checks passed');
process.exit(failures ? 1 : 0);
