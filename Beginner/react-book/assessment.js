// Final assessment: picks 50 random questions from questions.json, spread across all topics.
// Every question allows one or more answers. A question scores 1 point only when the
// selection matches the correct answers exactly. Each attempt has a 50-minute limit: the clock is
// wall-clock based (it keeps running across reloads) and at 0:00 the answers are submitted.

const COUNT = 50;
const PASS = 0.7;
const MAX_PER_TEMPLATE = 2; // keep generated question types varied
const STORE_KEY = 'react-book-assessment';
const TIME_LIMIT_MS = 50 * 60 * 1000;
const WARN_MS = 5 * 60 * 1000, DANGER_MS = 60 * 1000;
const ANNOUNCE_AT = [10, 5, 1];

const TOPICS = {
  js: ['JavaScript refresher', 'appendix-js-refresher.html'],
  setup: ['1 · Getting Started', '01-getting-started.html'],
  jsx: ['2 · Components & JSX', '02-components-and-jsx.html'],
  props: ['3 · Props', '03-props.html'],
  lists: ['4 · Conditions & Lists', '04-conditions-and-lists.html'],
  purity: ['5 · Pure Components & UI Tree', '05-pure-components-ui-tree.html'],
  events: ['6 · Responding to Events', '06-events.html'],
  state: ['7 · State & Rendering', '07-state.html'],
  immutability: ['8 · Objects & Arrays in State', '08-objects-and-arrays-in-state.html'],
  structure: ['9 · Structuring & Sharing State', '09-structuring-and-sharing-state.html'],
  preserving: ['10 · Preserving State & Reducers', '10-preserving-state-and-reducers.html'],
  context: ['11 · Context', '11-context.html'],
  refs: ['12 · Refs', '12-refs.html'],
  effects: ['13 · Effects', '13-effects.html'],
  hooks: ['14 · Custom Hooks', '14-custom-hooks.html'],
  thinking: ['15 · Thinking in React', '15-thinking-in-react.html'],
};

const app = document.getElementById('app');
let bank = [];
let attempt = null; // { questions: [...], answers: [[idx...]], current, finished }
let reviewFilter = 'all';
let ticker = null;
let announced = {};

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable: ignore */ }
}
const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
const topicLabel = (t) => (TOPICS[t] || [t])[0];

// ---------- loading ----------
async function loadBank() {
  try {
    const res = await fetch('questions.json');
    if (!res.ok) throw new Error(res.status);
    return (await res.json()).questions;
  } catch {
    // Pages opened from disk (file://) can't fetch, so use the script copy instead.
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'questions.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window.QUESTION_BANK.questions;
  }
}

// ---------- picking questions ----------
function pickQuestions() {
  const byTopic = {};
  for (const q of shuffle(bank)) (byTopic[q.topic] ||= []).push(q);
  const topics = shuffle(Object.keys(byTopic));
  const perTemplate = {};
  const chosen = [];
  let progress = true;
  while (chosen.length < COUNT && progress) {
    progress = false;
    for (const t of topics) {
      if (chosen.length >= COUNT) break;
      const list = byTopic[t];
      while (list.length) {
        const q = list.pop();
        if (q.template && (perTemplate[q.template] || 0) >= MAX_PER_TEMPLATE) continue;
        if (q.template) perTemplate[q.template] = (perTemplate[q.template] || 0) + 1;
        chosen.push(q);
        progress = true;
        break;
      }
    }
  }
  // Shuffle the option order per attempt so answers can't be memorised by position
  return shuffle(chosen).map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answer: order.map((orig, idx) => (q.answer.includes(orig) ? idx : -1)).filter((i) => i >= 0),
    };
  });
}

// ---------- timer ----------
function newAttempt() {
  const now = Date.now();
  announced = {};
  return { questions: pickQuestions(), answers: Array(COUNT).fill(null).map(() => []), current: 0, finished: false,
    started: now, deadline: now + TIME_LIMIT_MS };
}
const remaining = () => (attempt && attempt.deadline ? attempt.deadline - Date.now() : TIME_LIMIT_MS);
function fmt(ms) {
  const t = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}
function startTimer() {
  if (!attempt.deadline) { attempt.started = Date.now(); attempt.deadline = attempt.started + TIME_LIMIT_MS; persist(); }
  document.getElementById('timer-bar').classList.remove('hidden');
  if (!ticker) ticker = setInterval(tick, 1000);
  tick();
}
function stopTimer() {
  if (ticker) { clearInterval(ticker); ticker = null; }
  document.getElementById('timer-bar').classList.add('hidden');
}
function tick() {
  if (!attempt || attempt.finished) { stopTimer(); return; }
  const left = remaining();
  const clock = document.getElementById('timer');
  clock.textContent = `⏱ ${fmt(left)}`;
  clock.classList.toggle('warn', left <= WARN_MS && left > DANGER_MS);
  clock.classList.toggle('danger', left <= DANGER_MS);
  clock.setAttribute('aria-label', `Time left ${fmt(left)}`);
  ANNOUNCE_AT.forEach((m) => {
    if (left <= m * 60000 && left > m * 60000 - 5000 && !announced[m]) {
      announced[m] = true;
      document.getElementById('timer-live').textContent = `${m} minute${m === 1 ? '' : 's'} left`;
    }
  });
  if (left <= 0) timeUp();
}
function timeUp() {
  stopTimer();
  const dlg = document.querySelector('dialog.confirm-dialog[open]');   // close a pending "submit?" dialog
  if (dlg) dlg.dispatchEvent(new Event('cancel', { cancelable: true }));
  app.querySelectorAll('input, button').forEach((x) => { x.disabled = true; });
  finish(true);
}

// ---------- screens ----------
function renderStart() {
  const history = load(STORE_KEY + '-history', []);
  const best = history.length ? Math.max(...history.map((h) => h.score)) : null;
  const saved = load(STORE_KEY + '-progress', null);
  const counts = {};
  bank.forEach((q) => { counts[q.topic] = (counts[q.topic] || 0) + 1; });

  app.innerHTML = `
    <p class="lead">${COUNT} questions picked at random from a pool of <strong>${bank.length}</strong>, spread across every chapter and the JavaScript refresher. Each attempt gets a new mix.</p>
    <div class="goals">
      <strong>How it works</strong>
      <ul>
        <li>Every question lets you pick <strong>one or more</strong> answers. Some have a single correct answer, and others have several.</li>
        <li>A question scores <strong>1 point</strong> only if your selection matches the correct answers <strong>exactly</strong>.</li>
        <li>You can move back and forth and change answers before submitting. Keyboard: <code>1</code>–<code>6</code> toggle options, <code>←</code>/<code>→</code> move between questions.</li>
        <li>You have <strong>50 minutes</strong>. The clock starts when you press Start and keeps running even if you leave the page; at <strong>0:00</strong> the assessment locks and your answers are submitted automatically.</li>
        <li>Pass mark: <strong>${Math.round(PASS * 100)}%</strong> (${Math.ceil(PASS * COUNT)} of ${COUNT}). At the end you'll see a per-chapter breakdown and explanations.</li>
      </ul>
    </div>
    ${best !== null ? `<p class="muted">Your best score so far: <strong>${best} / ${COUNT}</strong> across ${history.length} attempt${history.length === 1 ? '' : 's'}.</p>` : ''}
    <div class="nav" style="justify-content:flex-start">
      ${saved && !saved.finished ? `<button class="btn primary" id="resume">Resume unfinished attempt${saved.deadline ? ` · ${Math.max(1, Math.ceil((saved.deadline - Date.now()) / 60000))} min left` : ''}</button>` : ''}
      <button class="btn ${saved && !saved.finished ? '' : 'primary'}" id="start">Start a new assessment</button>
    </div>
    <details style="margin-top:24px"><summary class="muted">Question pool by topic</summary>
      <div class="table-wrap"><table>
        <tr><th>Topic</th><th>Questions in pool</th></tr>
        ${Object.keys(TOPICS).filter((t) => counts[t]).map((t) => `<tr><td><a href="${TOPICS[t][1]}">${esc(TOPICS[t][0])}</a></td><td>${counts[t]}</td></tr>`).join('')}
      </table></div>
    </details>`;

  document.getElementById('start').onclick = () => {
    attempt = newAttempt();
    persist();
    renderQuestion();
  };
  const resume = document.getElementById('resume');
  if (resume) resume.onclick = () => { attempt = saved; renderQuestion(); };
}

function persist() { save(STORE_KEY + '-progress', attempt); }

function renderQuestion() {
  const i = attempt.current;
  const q = attempt.questions[i];
  const picked = attempt.answers[i];
  const answeredCount = attempt.answers.filter((a) => a.length).length;

  app.innerHTML = `
    <div class="q-head">
      <span>Question <strong>${i + 1}</strong> of ${attempt.questions.length} · ${answeredCount} answered</span>
      <span><span class="chip topic">${esc(topicLabel(q.topic))}</span><span class="chip">${esc(q.difficulty)}</span></span>
    </div>
    <div class="progress"><div style="width:${((i + 1) / attempt.questions.length) * 100}%"></div></div>
    <p class="q-text">${esc(q.question)}</p>
    <p class="hint">Select one or more answers.</p>
    ${q.code ? `<pre class="q-code"><code>${esc(q.code)}</code></pre>` : ''}
    <div class="opts">
      ${q.options.map((o, k) => `
        <label class="opt ${picked.includes(k) ? 'selected' : ''}">
          <input type="checkbox" data-k="${k}" ${picked.includes(k) ? 'checked' : ''}>
          <span class="opt-text">${esc(o)}</span>
          <span class="key">${k + 1}</span>
        </label>`).join('')}
    </div>
    <div class="nav">
      <button class="btn" id="prev" ${i === 0 ? 'disabled' : ''}>← Previous</button>
      <span>
        ${i < attempt.questions.length - 1 ? '<button class="btn primary" id="next">Next →</button>' : ''}
        <button class="btn ${i === attempt.questions.length - 1 ? 'primary' : ''}" id="submit">Submit assessment</button>
      </span>
    </div>
    <div class="palette">
      ${attempt.questions.map((_, k) => `<button data-go="${k}" class="${attempt.answers[k].length ? 'answered' : ''} ${k === i ? 'current' : ''}">${k + 1}</button>`).join('')}
    </div>`;

  app.querySelectorAll('.opt input').forEach((box) => {
    box.onchange = () => toggle(Number(box.dataset.k));
  });
  document.getElementById('prev').onclick = () => go(i - 1);
  const next = document.getElementById('next');
  if (next) next.onclick = () => go(i + 1);
  document.getElementById('submit').onclick = submit;
  app.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => go(Number(b.dataset.go)); });
  startTimer();
}

function toggle(k) {
  if (attempt.finished || remaining() <= 0) return;
  const list = attempt.answers[attempt.current];
  attempt.answers[attempt.current] = list.includes(k) ? list.filter((x) => x !== k) : [...list, k].sort();
  persist();
  renderQuestion();
}

function go(i) {
  if (i < 0 || i >= attempt.questions.length) return;
  attempt.current = i;
  persist();
  renderQuestion();
  window.scrollTo({ top: 0 });
}

// ---------------- in-page confirm dialog (replaces the browser's native confirm) ----------------
// Returns a promise for true (confirm) / false (cancel, Esc or a click on the backdrop).
function confirmDialog(opts) {
  if (!document.getElementById('confirm-dialog-style')) {
    var style = document.createElement('style');
    style.id = 'confirm-dialog-style';
    style.textContent =
      '.confirm-dialog{border:1px solid var(--border);border-radius:14px;padding:22px 24px 18px;' +
      'width:min(440px,calc(100vw - 32px));background:var(--panel,var(--surface,#fff));color:var(--text);' +
      'box-shadow:0 20px 50px rgba(0,0,0,.35)}' +
      '.confirm-dialog::backdrop{background:rgba(10,12,16,.55);backdrop-filter:blur(2px)}' +
      '.confirm-dialog[open]{animation:confirm-pop .14s ease-out}' +
      '@keyframes confirm-pop{from{opacity:0;transform:translateY(6px) scale(.98)}}' +
      '.confirm-dialog h2{margin:0 0 8px;padding:0;border:0;font-size:1.15rem;color:var(--heading,var(--text))}' +
      '.confirm-dialog p{margin:0 0 18px;color:var(--muted);line-height:1.5}' +
      '.confirm-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}';
    document.head.appendChild(style);
  }
  return new Promise(function (resolve) {
    var dlg = document.createElement('dialog');
    dlg.className = 'confirm-dialog';
    dlg.setAttribute('aria-labelledby', 'confirm-dialog-title');
    dlg.setAttribute('aria-describedby', 'confirm-dialog-text');
    var h = document.createElement('h2'); h.id = 'confirm-dialog-title'; h.textContent = opts.title;
    var p = document.createElement('p'); p.id = 'confirm-dialog-text'; p.textContent = opts.message;
    var actions = document.createElement('div'); actions.className = 'confirm-actions';
    var cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'btn'; cancel.textContent = opts.cancelText || 'Cancel';
    var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'btn primary'; ok.textContent = opts.confirmText || 'OK';
    ok.setAttribute('data-confirm', 'yes'); cancel.setAttribute('data-confirm', 'no');
    actions.appendChild(cancel); actions.appendChild(ok);
    dlg.appendChild(h); dlg.appendChild(p); dlg.appendChild(actions);
    var done = false;
    function finish(value) {
      if (done) return;
      done = true;
      if (dlg.open) dlg.close();
      dlg.remove();
      resolve(value);
    }
    ok.addEventListener('click', function () { finish(true); });
    cancel.addEventListener('click', function () { finish(false); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); finish(false); });     // Esc
    dlg.addEventListener('click', function (e) { if (e.target === dlg) finish(false); });  // backdrop
    document.body.appendChild(dlg);
    dlg.showModal();
    cancel.focus();                                     // the safe choice is the default
  });
}

async function submit() {
  const unanswered = attempt.answers.filter((a) => !a.length).length;
  if (unanswered) {
    const yes = await confirmDialog({
      title: 'Submit with unanswered questions?',
      message: `You have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Unanswered questions score 0. Keep answering to jump to the first one, or submit now.`,
      cancelText: 'Keep answering',
      confirmText: 'Submit anyway',
    });
    if (attempt.finished) return;                     // the clock ran out while the dialog was open
    if (!yes) {
      const first = attempt.answers.findIndex((a) => !a.length);
      if (first >= 0) go(first);
      return;
    }
  }
  finish(false);
}

function finish(timedOut) {
  if (attempt.finished) return;
  stopTimer();
  attempt.finished = true;
  const end = timedOut && attempt.deadline ? attempt.deadline : Date.now();
  attempt.timedOut = !!timedOut;
  attempt.time = attempt.started ? fmt(Math.min(TIME_LIMIT_MS, end - attempt.started)) : null;
  const score = attempt.questions.filter((q, k) => sameSet(q.answer, attempt.answers[k])).length;
  const history = load(STORE_KEY + '-history', []);
  save(STORE_KEY + '-history', [...history, { score, date: new Date().toISOString(), timedOut: attempt.timedOut, time: attempt.time }].slice(-20));
  persist();
  reviewFilter = 'all';
  renderResults();
  window.scrollTo({ top: 0 });
}

function renderResults() {
  const qs = attempt.questions;
  const results = qs.map((q, k) => sameSet(q.answer, attempt.answers[k]));
  const score = results.filter(Boolean).length;
  const pct = Math.round((score / qs.length) * 100);
  const passed = score / qs.length >= PASS;

  const topicStats = {};
  qs.forEach((q, k) => {
    const s = (topicStats[q.topic] ||= { right: 0, total: 0 });
    s.total++;
    if (results[k]) s.right++;
  });
  const weak = Object.entries(topicStats).filter(([, s]) => s.right / s.total < 0.6).map(([t]) => t);

  const shown = qs.map((q, k) => ({ q, k })).filter(({ k }) => reviewFilter === 'all' || (reviewFilter === 'wrong' ? !results[k] : results[k]));

  app.innerHTML = `
    <div class="score-card">
      <div class="score-big">${score} / ${qs.length}</div>
      <p style="font-size:1.2rem;margin:6px 0">${pct}% · ${passed ? '🎉 Passed! Great work.' : '📚 Not quite yet. Review the chapters below and try again.'}</p>
      ${attempt.timedOut ? '<p class="callout warn" id="time-note">⏰ Time\'s up — the 50 minutes ran out and your answers were submitted automatically. Unanswered questions score 0.</p>'
        : attempt.time ? `<p class="muted" id="time-note">⏱ Finished in ${attempt.time} of the 50 minutes.</p>` : ''}
      ${weak.length ? `<p class="muted">Worth revisiting: ${weak.map((t) => `<a href="${TOPICS[t]?.[1] || '#'}">${esc(topicLabel(t))}</a>`).join(', ')}</p>` : '<p class="muted">Solid across every topic.</p>'}
      <div class="nav" style="justify-content:center">
        <button class="btn primary" id="again">Take a new random assessment</button>
        <a class="btn" href="index.html" style="text-decoration:none">Back to the book</a>
      </div>
    </div>

    <h2>Score by chapter</h2>
    <div class="table-wrap"><table>
      <tr><th>Topic</th><th>Score</th><th style="width:40%"></th></tr>
      ${Object.keys(TOPICS).filter((t) => topicStats[t]).map((t) => {
        const s = topicStats[t];
        return `<tr><td><a href="${TOPICS[t][1]}">${esc(TOPICS[t][0])}</a></td><td>${s.right} / ${s.total}</td><td><div class="bar"><div style="width:${(s.right / s.total) * 100}%"></div></div></td></tr>`;
      }).join('')}
    </table></div>

    <h2>Review answers</h2>
    <div class="filters">
      <button class="btn ${reviewFilter === 'all' ? 'active' : ''}" data-f="all">All (${qs.length})</button>
      <button class="btn ${reviewFilter === 'wrong' ? 'active' : ''}" data-f="wrong">Incorrect (${qs.length - score})</button>
      <button class="btn ${reviewFilter === 'right' ? 'active' : ''}" data-f="right">Correct (${score})</button>
    </div>
    ${shown.map(({ q, k }) => {
      const mine = attempt.answers[k];
      return `
      <div class="review ${results[k] ? 'right' : 'wrong'}">
        <p class="q-head" style="margin-top:12px"><span><strong>${k + 1}.</strong> ${results[k] ? '✅ Correct' : mine.length ? '❌ Incorrect' : '⚪ Not answered'}</span><span class="chip topic">${esc(topicLabel(q.topic))}</span></p>
        <p class="q-text" style="font-size:1.05rem">${esc(q.question)}</p>
        ${q.code ? `<pre class="q-code"><code>${esc(q.code)}</code></pre>` : ''}
        ${q.options.map((o, j) => {
          const isCorrect = q.answer.includes(j);
          const isPicked = mine.includes(j);
          const cls = isCorrect ? 'correct' : isPicked ? 'picked-wrong' : '';
          const mark = isCorrect ? (isPicked ? '✔ your answer (correct)' : '✔ correct answer') : isPicked ? '✘ your answer' : '';
          return `<div class="r-opt ${cls}">${esc(o)}${mark ? ` <span class="muted">· ${mark}</span>` : ''}</div>`;
        }).join('')}
        <p class="muted" style="margin-top:10px">💡 ${esc(q.explanation)}</p>
      </div>`;
    }).join('') || '<p class="muted">Nothing to show for this filter.</p>'}`;

  document.getElementById('again').onclick = () => {
    attempt = newAttempt();
    persist();
    renderQuestion();
    window.scrollTo({ top: 0 });
  };
  app.querySelectorAll('[data-f]').forEach((b) => { b.onclick = () => { reviewFilter = b.dataset.f; renderResults(); }; });
}

// ---------- keyboard ----------
document.addEventListener('keydown', (e) => {
  if (!attempt || attempt.finished || e.target.matches('input[type=text], textarea')) return;
  if (document.querySelector('dialog[open]')) return;     // shortcuts pause while a dialog is open
  if (e.key === 'ArrowRight') go(attempt.current + 1);
  else if (e.key === 'ArrowLeft') go(attempt.current - 1);
  else if (/^[1-6]$/.test(e.key)) {
    const k = Number(e.key) - 1;
    if (k < attempt.questions[attempt.current].options.length) toggle(k);
  }
});

// ---------- start ----------
loadBank()
  .then((questions) => {
    bank = questions;
    const saved = load(STORE_KEY + '-progress', null);
    if (saved && !saved.finished && saved.deadline && saved.deadline <= Date.now()) {
      attempt = saved;                                   // time ran out while the page was closed
      finish(true);
    } else if (saved && saved.finished && new URLSearchParams(location.search).has('results')) {
      attempt = saved;
      renderResults();
    } else {
      renderStart();
    }
  })
  .catch(() => {
    app.innerHTML = '<p class="callout bad">Could not load the questions. Make sure <code>questions.json</code> and <code>questions.js</code> are in the same folder as this page.</p>';
  });

// tiny hook for automated tests
window.__assessment = {
  attempt: () => attempt,
  expireIn: (ms) => { attempt.deadline = Date.now() + ms; persist(); tick(); },
};
