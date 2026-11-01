// End-to-end test of the assessment's 50-minute time limit over file:// in headless Chrome.
// Usage: node tools/e2e-assessment.mjs [path-to-chrome]
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.argv[2] || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9377;
const SHOTS = join(ROOT, 'tools', 'screenshots');
mkdirSync(SHOTS, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (cond, msg) => { console.log(`${cond ? '✓' : '✘'} ${msg}`); if (!cond) failures++; };
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--allow-file-access-from-files',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'e2e-'))}`, '--window-size=1200,1000', 'about:blank'], { stdio: 'ignore' });
let ws, nextId = 1; const pending = new Map(); const errors = [];
const send = (method, params = {}) => new Promise((resolve) => { const id = nextId++; pending.set(id, resolve); ws.send(JSON.stringify({ id, method, params })); });
async function evaluate(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
async function waitFor(expr, ms = 8000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { try { if (await evaluate(expr)) return true; } catch { /* loading */ } await sleep(100); }
  return false;
}
async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(SHOTS, name), Buffer.from(data, 'base64'));
  console.log(`  saved tools/screenshots/${name}`);
}
try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(200); } }
  ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  const url = 'file://' + join(ROOT, 'assessment.html');
  await send('Page.navigate', { url });
  check(await waitFor(`!!document.getElementById('start')`), 'start screen loads');
  await evaluate(`localStorage.clear(); true`);
  check(/50 minutes/.test(await evaluate(`document.getElementById('app').textContent`)), 'rules mention the 50-minute limit');
  await evaluate(`document.getElementById('start').click(); true`);
  check(await waitFor(`/^⏱ (50:00|49:5\\d)$/.test(document.getElementById('timer').textContent) && !document.getElementById('timer-bar').classList.contains('hidden')`), 'starting shows a 50-minute clock');
  check((await evaluate(`window.__assessment.attempt().deadline - window.__assessment.attempt().started`)) === 50 * 60 * 1000, 'the deadline is 50 minutes after the start');
  await evaluate(`document.querySelector('.opt input').click(); document.getElementById('next').click(); true`);
  check(/^⏱ /.test(await evaluate(`document.getElementById('timer').textContent`)), 'the clock survives re-rendering between questions');
  await evaluate(`window.__assessment.expireIn(4 * 60 * 1000); true`);
  check(await evaluate(`document.getElementById('timer').classList.contains('warn')`), 'the clock turns amber in the last 5 minutes');
  await evaluate(`window.__assessment.expireIn(30 * 1000); true`);
  check(await evaluate(`document.getElementById('timer').classList.contains('danger')`), 'the clock turns red in the last minute');
  await shot('timer-dark.png');
  await evaluate(`document.getElementById('submit').click(); true`);
  check(await waitFor(`!!document.querySelector('dialog[open]')`), 'a submit dialog is open when time runs out');
  await evaluate(`window.__assessment.expireIn(1200); true`);
  check(await waitFor(`!!document.getElementById('again')`, 5000), 'at 0:00 the answers are submitted automatically');
  check(!(await evaluate(`!!document.querySelector('dialog[open]')`)), 'the pending dialog is closed');
  check(/Time's up/.test(await evaluate(`document.getElementById('time-note').textContent`)), 'results explain that time ran out');
  check(await evaluate(`document.getElementById('timer-bar').classList.contains('hidden')`), 'the clock is hidden on the results screen');
  const h = await evaluate(`JSON.parse(localStorage.getItem('react-book-assessment-history')).at(-1)`);
  check(h.timedOut === true, 'history records that time ran out');
  await shot('timeout-dark.png');
  await evaluate(`document.getElementById('again').click(); true`);
  await evaluate(`(() => { const p = JSON.parse(localStorage.getItem('react-book-assessment-progress')); p.deadline = Date.now() - 1000; localStorage.setItem('react-book-assessment-progress', JSON.stringify(p)); return true; })()`);
  await send('Page.navigate', { url });
  check(await waitFor(`!!document.getElementById('time-note') && /Time's up/.test(document.getElementById('time-note').textContent)`), 'an attempt that expired while the page was closed is submitted on reload');
  check(errors.length === 0, 'no JavaScript errors ' + errors.join(' | '));
} catch (e) {
  failures++; console.error('✘ error:', e.message);
} finally {
  try { ws?.close(); } catch { /* ignore */ }
  chrome.kill();
}
console.log(failures ? `\n${failures} check(s) failed` : '\nall end-to-end checks passed');
process.exit(failures ? 1 : 0);
