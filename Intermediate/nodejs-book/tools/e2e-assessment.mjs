// End-to-end test of assessment.html over file:// in headless Chrome (DevTools protocol).
// Usage: node tools/e2e-assessment.mjs [path-to-chrome]
// Writes screenshots to tools/screenshots/.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.argv[2] || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const SHOTS = join(ROOT, 'tools', 'screenshots');
mkdirSync(SHOTS, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (cond, msg) => { console.log(`${cond ? '✓' : '✘'} ${msg}`); if (!cond) failures++; };

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--allow-file-access-from-files',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'e2e-'))}`, '--window-size=1200,1000', 'about:blank'], { stdio: 'ignore' });

let ws, nextId = 1; const pending = new Map();
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
  while (Date.now() < end) { try { if (await evaluate(expr)) return true; } catch { /* page loading */ } await sleep(100); }
  return false;
}
async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(SHOTS, name), Buffer.from(data, 'base64'));
  console.log(`  saved tools/screenshots/${name}`);
}

try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(200); } }
  const page = targets.find((t) => t.type === 'page');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); }
  });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  const url = 'file://' + join(ROOT, 'assessment.html');
  await send('Page.navigate', { url });
  check(await waitFor(`document.getElementById('pool-size').textContent === '1000'`), 'question bank loads over file:// (questions.js fallback)');
  await evaluate(`localStorage.clear(); true`);

  // ---- start an attempt
  await evaluate(`document.getElementById('btn-start').click(); true`);
  const info = await evaluate(`(() => {
    const s = window.__assessment.state().attempt, A = window.__assessment;
    const qs = s.ids.map(A.byId);
    const tpl = {}; qs.forEach(q => { if (q.template) tpl[q.template] = (tpl[q.template] || 0) + 1; });
    return { n: s.ids.length, unique: new Set(s.ids).size, topics: new Set(qs.map(q => q.topic)).size,
      maxTpl: Math.max(0, ...Object.values(tpl)), visible: !document.getElementById('quiz').classList.contains('hidden') };
  })()`);
  check(info.visible, 'question screen is shown');
  check(info.n === 50 && info.unique === 50, `50 unique questions (${info.n}/${info.unique})`);
  check(info.topics === 18, `all 18 topics covered (${info.topics})`);
  check(info.maxTpl <= 2, `at most 2 questions per template (max ${info.maxTpl})`);

  // ---- keyboard: 1 toggles first option, ArrowRight moves on
  const key = (k) => evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(k)}, bubbles: true })); true`);
  await key('1');
  const afterKey = await evaluate(`(() => { const s = window.__assessment.state().attempt; return (s.picks[s.ids[0]] || []).length; })()`);
  await key('1');
  const afterKey2 = await evaluate(`(() => { const s = window.__assessment.state().attempt; return (s.picks[s.ids[0]] || []).length; })()`);
  await key('ArrowRight');
  const cur = await evaluate(`window.__assessment.state().attempt.current`);
  check(afterKey === 1 && afterKey2 === 0 && cur === 1, 'keyboard 1 toggles an option and → moves to the next question');

  // ---- answer: 20 correct, 15 wrong, 15 blank
  await evaluate(`(() => {
    const A = window.__assessment, s = A.state().attempt;
    s.ids.forEach((id, i) => {
      const q = A.byId(id); A.go(i);
      if (i < 20) q.answer.forEach(a => A.toggle(a));
      else if (i < 35) { const wrong = q.options.map((_, k) => k).find(k => !q.answer.includes(k)); A.toggle(wrong); }
    });
    A.go(3); return true;
  })()`);
  const counter = await evaluate(`document.getElementById('q-count').textContent`);
  check(/35 answered/.test(counter), `progress counter shows 35 answered ("${counter}")`);
  await shot('question-dark.png');

  // ---- resume after reload
  await send('Page.reload');
  check(await waitFor(`!document.getElementById('btn-resume').classList.contains('hidden')`), 'Resume button appears after reloading mid-attempt');
  await evaluate(`document.getElementById('btn-resume').click(); true`);
  const kept = await evaluate(`Object.keys(window.__assessment.state().attempt.picks).filter(k => window.__assessment.state().attempt.picks[k].length).length`);
  check(kept === 35, `saved answers survive the reload (${kept})`);

  // ---- submit: the in-page dialog replaces window.confirm
  await evaluate(`window.__nativeConfirm = 0; window.confirm = () => { window.__nativeConfirm++; return true; }; document.getElementById('btn-submit').click(); true`);
  const dlg = await evaluate(`(() => { const d = document.querySelector('dialog.confirm-dialog[open]');
    return d && { text: d.textContent, focused: document.activeElement?.dataset.confirm }; })()`);
  check(!!dlg && /15 unanswered questions/.test(dlg.text), `in-page dialog opens and reports 15 unanswered ("${dlg?.text.slice(0, 60)}…")`);
  check(dlg?.focused === "no", 'the safe "Keep answering" button has focus');
  await sleep(400);                                    // let the open animation finish
  await shot('confirm-dark.png');
  await evaluate(`document.querySelector('dialog.confirm-dialog [data-confirm="no"]').click(); true`);
  const jumped = await evaluate(`({ open: !!document.querySelector('dialog[open]'), current: window.__assessment.state().attempt.current, done: !!window.__assessment.state().attempt.done })`);
  check(!jumped.open && jumped.current === 35 && !jumped.done, `"Keep answering" closes the dialog and jumps to the first unanswered question (#${jumped.current + 1})`);
  await evaluate(`document.getElementById('btn-submit').click(); true`);
  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true })); true`);
  const keyIgnored = await evaluate(`(() => { const s = window.__assessment.state().attempt; return !(s.picks[s.ids[s.current]] || []).length; })()`);
  check(keyIgnored, 'keyboard shortcuts are ignored while the dialog is open');
  await evaluate(`document.querySelector('dialog.confirm-dialog [data-confirm="yes"]').click(); true`);
  const res = await evaluate(`({ native: window.__nativeConfirm, score: window.__assessment.state().attempt.result.score,
    text: document.getElementById('r-score').textContent, rows: document.querySelectorAll('#r-table tr').length - 1,
    visible: !document.getElementById('results').classList.contains('hidden') })`);
  check(res.native === 0, 'the browser\'s native confirm() is never used');
  check(res.visible && res.score === 20, `score equals the number answered correctly (${res.score} / 50, "${res.text}")`);
  check(res.rows === 18, `score-by-chapter table has a row per chapter (${res.rows})`);
  const filt = async (f) => evaluate(`document.querySelector('[data-filter="${f}"]').click(); document.querySelectorAll('#r-review .review').length`);
  const fw = await filt('wrong'), fr = await filt('right'), fa = await filt('all');
  check(fw === 30 && fr === 20 && fa === 50, `review filters: incorrect ${fw}, correct ${fr}, all ${fa}`);
  const hist = await evaluate(`JSON.parse(localStorage.getItem('nodeBook.assessment.v1')).history.length`);
  check(hist === 1, 'attempt stored in localStorage history');
  await evaluate(`window.scrollTo(0, 0); true`);
  await shot('results-dark.png');
  await filt('wrong');
  await evaluate(`document.getElementById('r-review').scrollIntoView(); true`);
  await shot('review-dark.png');

  // ---- dark-mode contrast (WCAG): primary button, body text, chips, option text
  const colors = await evaluate(`(() => {
    const cs = (sel) => { const e = document.querySelector(sel); const s = getComputedStyle(e); return [s.color, s.backgroundColor]; };
    return { btn: cs('#btn-again'), body: [getComputedStyle(document.body).color, getComputedStyle(document.body).backgroundColor],
      muted: [getComputedStyle(document.querySelector('.a-meta')).color, getComputedStyle(document.body).backgroundColor] };
  })()`);
  const parse = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = ([a, b]) => { const [x, y] = [lum(parse(a)), lum(parse(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  for (const [name, pair] of Object.entries(colors)) check(ratio(pair) >= 4.5, `dark-mode contrast ${name}: ${ratio(pair).toFixed(1)}:1 (${pair.join(' on ')})`);
} catch (e) {
  failures++; console.error('✘ error:', e.message);
} finally {
  try { ws?.close(); } catch { /* ignore */ }
  chrome.kill();
}
console.log(failures ? `\n${failures} check(s) failed` : '\nall end-to-end checks passed');
process.exit(failures ? 1 : 0);
