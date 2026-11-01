/* Spring Boot Study Book — final assessment.
   Loads questions.json (or questions.js when opened from disk), picks 50 questions
   stratified across chapters, scores exact-match multi-select answers, and keeps
   progress and history in localStorage. Each attempt has a 50-minute time limit: the clock is
   wall-clock based (it keeps running across reloads), and at 0:00 the answers are submitted. */
(function () {
  'use strict';

  var PER_ATTEMPT = 50;
  var PASS = 0.7;
  var REVISIT = 0.6;
  var MAX_PER_TEMPLATE = 2;
  var TIME_LIMIT_MS = 50 * 60 * 1000;
  var WARN_MS = 5 * 60 * 1000, DANGER_MS = 60 * 1000;
  var ANNOUNCE_AT = [10, 5, 1];          // minutes left announced to screen readers
  var STORE_KEY = 'springBook.assessment.v1';   // distinct from the other books: file:// pages share localStorage

  var bank = null;       // { chapters, questions }
  var byId = {};
  var state = load();    // { attempt, best, history }
  var reviewFilter = 'all';
  var ticker = null;
  var announced = {};

  // ---------------- storage (every access wrapped: storage may be blocked) ----------------
  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && typeof s === 'object') return { attempt: s.attempt || null, best: s.best || null, history: s.history || [] };
      }
    } catch (e) { /* ignore */ }
    return { attempt: null, best: null, history: [] };
  }
  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------------- helpers ----------------
  function $(id) { return document.getElementById(id); }
  function show(id) {
    ['loading', 'start', 'quiz', 'results'].forEach(function (s) { $(s).classList.toggle('hidden', s !== id); });
    window.scrollTo(0, 0);
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function chapterLabel(topic) {
    var c = bank.chapters[topic];
    return c ? (/^\d/.test(c.number) ? 'Ch. ' + c.number : 'App. ' + c.number) + ' · ' + c.title : topic;
  }
  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var s = {}; a.forEach(function (x) { s[x] = true; });
    return b.every(function (x) { return s[x]; });
  }

  // ---------------- loading ----------------
  function start() {
    fetchJson().then(ready, function () {
      // file:// blocks fetch, so fall back to the script version of the bank
      var s = document.createElement('script');
      s.src = 'questions.js';
      s.onload = function () { window.QUESTION_BANK ? ready(window.QUESTION_BANK) : fail(); };
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }
  function fetchJson() {
    if (!window.fetch || location.protocol === 'file:') return Promise.reject(new Error('no fetch'));
    return fetch('questions.json').then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }
  function fail() {
    $('loading').innerHTML = '<p class="pitfall">⚠️ Could not load the question bank. Make sure <code>questions.json</code> and <code>questions.js</code> are next to this page.</p>';
  }
  function ready(data) {
    bank = data;
    bank.questions.forEach(function (q) { byId[q.id] = q; });
    // drop a saved attempt that no longer matches the bank
    if (state.attempt && !state.attempt.ids.every(function (id) { return byId[id]; })) { state.attempt = null; save(); }
    // time ran out while the page was closed: submit what was answered
    if (state.attempt && !state.attempt.done && state.attempt.deadline && remaining() <= 0) { finishAttempt(true); return; }
    renderStart();
  }

  // ---------------- start screen ----------------
  function renderStart() {
    $('pool-size').textContent = bank.questions.length;
    var best = state.best;
    $('best').textContent = best ? 'Best score so far: ' + best.score + ' / ' + best.total + ' (' + best.pct + '%) on ' + best.date + '.' : 'No attempts yet.';
    var open = state.attempt && !state.attempt.done;
    $('btn-resume').classList.toggle('hidden', !open);
    if (open) $('btn-resume').textContent = 'Resume unfinished attempt · ' + Math.max(1, Math.ceil(remaining() / 60000)) + ' min left';

    var counts = {};
    bank.questions.forEach(function (q) { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    var table = $('pool-table');
    table.innerHTML = '';
    var head = el('tr'); ['Chapter', 'Questions'].forEach(function (h) { head.appendChild(el('th', null, h)); });
    table.appendChild(head);
    Object.keys(bank.chapters).forEach(function (t) {
      var tr = el('tr');
      var td = el('td'); var a = el('a', null, chapterLabel(t)); a.href = bank.chapters[t].file; td.appendChild(a);
      tr.appendChild(td); tr.appendChild(el('td', null, String(counts[t] || 0)));
      table.appendChild(tr);
    });

    var hist = $('history');
    hist.innerHTML = '';
    if (state.history.length) {
      hist.appendChild(el('h2', null, 'Recent attempts'));
      var ul = el('ul');
      state.history.slice().reverse().forEach(function (h) {
        ul.appendChild(el('li', null, h.date + ': ' + h.score + ' / ' + h.total + ' (' + h.pct + '%)' + (h.pct >= PASS * 100 ? ' ✓' : '') +
          (h.timedOut ? ' · time ran out' : h.time ? ' · ' + h.time : '')));
      });
      hist.appendChild(ul);
    }
    show('start');
  }

  // ---------------- picking: stratified round-robin across topics ----------------
  function pick() {
    var pools = {};
    shuffle(bank.questions).forEach(function (q) { (pools[q.topic] = pools[q.topic] || []).push(q); });
    var topics = shuffle(Object.keys(pools));
    var perTemplate = {};
    var chosen = [];
    var progress = true;
    while (chosen.length < PER_ATTEMPT && progress) {
      progress = false;
      for (var i = 0; i < topics.length && chosen.length < PER_ATTEMPT; i++) {
        var pool = pools[topics[i]];
        while (pool.length) {
          var q = pool.shift();
          var t = q.template;
          if (t && (perTemplate[t] || 0) >= MAX_PER_TEMPLATE) continue;
          if (t) perTemplate[t] = (perTemplate[t] || 0) + 1;
          chosen.push(q);
          progress = true;
          break;
        }
      }
    }
    return shuffle(chosen);
  }

  function newAttempt() {
    var qs = pick();
    var orders = {};
    qs.forEach(function (q) { orders[q.id] = shuffle(q.options.map(function (_, i) { return i; })); });
    var now = Date.now();
    state.attempt = { ids: qs.map(function (q) { return q.id; }), orders: orders, picks: {}, current: 0, done: false,
      started: new Date(now).toISOString(), deadline: now + TIME_LIMIT_MS };
    announced = {};
    save();
    renderQuestion();
  }

  // ---------------- timer ----------------
  function remaining() { return state.attempt && state.attempt.deadline ? state.attempt.deadline - Date.now() : TIME_LIMIT_MS; }
  function fmt(ms) {
    var t = Math.max(0, Math.ceil(ms / 1000));
    return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  }
  function startTimer() {
    if (!state.attempt.deadline) { state.attempt.deadline = Date.now() + TIME_LIMIT_MS; save(); }   // attempts saved before the time limit existed
    if (!ticker) ticker = setInterval(tick, 1000);
    tick();
  }
  function stopTimer() { if (ticker) { clearInterval(ticker); ticker = null; } }
  function tick() {
    var a = state.attempt;
    if (!a || a.done) { stopTimer(); return; }
    var left = remaining();
    var clock = $('q-timer');
    clock.textContent = '⏱ ' + fmt(left);
    clock.classList.toggle('warn', left <= WARN_MS && left > DANGER_MS);
    clock.classList.toggle('danger', left <= DANGER_MS);
    clock.setAttribute('aria-label', 'Time left ' + fmt(left));
    ANNOUNCE_AT.forEach(function (m) {
      if (left <= m * 60000 && left > (m * 60000 - 5000) && !announced[m]) {
        announced[m] = true;
        $('q-timer-live').textContent = m + (m === 1 ? ' minute' : ' minutes') + ' left';
      }
    });
    if (left <= 0) timeUp();
  }
  function timeUp() {
    stopTimer();
    var dlg = document.querySelector('dialog.confirm-dialog[open]');   // close a pending "submit?" dialog
    if (dlg) dlg.dispatchEvent(new Event('cancel', { cancelable: true }));
    Array.prototype.forEach.call(document.querySelectorAll('#quiz input, #quiz button'), function (x) { x.disabled = true; });
    finishAttempt(true);
  }

  // ---------------- question screen ----------------
  function current() { return byId[state.attempt.ids[state.attempt.current]]; }
  function answeredCount() {
    var p = state.attempt.picks;
    return state.attempt.ids.filter(function (id) { return p[id] && p[id].length; }).length;
  }

  function renderQuestion() {
    var a = state.attempt, q = current(), n = a.ids.length;
    $('q-count').textContent = 'Question ' + (a.current + 1) + ' of ' + n + ' · ' + answeredCount() + ' answered';
    $('q-topic').textContent = chapterLabel(q.topic);
    var d = $('q-diff'); d.textContent = q.difficulty; d.className = 'chip ' + q.difficulty;
    $('q-progress').style.width = (100 * answeredCount() / n) + '%';
    $('q-text').textContent = q.question;
    var code = $('q-code');
    code.classList.toggle('hidden', !q.code);
    code.textContent = q.code || '';

    var box = $('q-options');
    box.innerHTML = '';
    var picks = a.picks[q.id] || [];
    a.orders[q.id].forEach(function (orig, shown) {
      var label = el('label', 'opt' + (picks.indexOf(orig) >= 0 ? ' checked' : ''));
      var cb = el('input'); cb.type = 'checkbox'; cb.checked = picks.indexOf(orig) >= 0;
      cb.addEventListener('change', function () { toggle(orig); });
      label.appendChild(cb);
      label.appendChild(el('span', 'key', String(shown + 1)));
      label.appendChild(el('span', 'txt', q.options[orig]));
      box.appendChild(label);
    });

    $('btn-prev').disabled = a.current === 0;
    $('btn-next').disabled = a.current === n - 1;

    var grid = $('q-grid');
    grid.innerHTML = '';
    a.ids.forEach(function (id, i) {
      var b = el('button', null, String(i + 1));
      b.type = 'button';
      if (a.picks[id] && a.picks[id].length) b.classList.add('answered');
      if (i === a.current) b.classList.add('current');
      b.setAttribute('aria-label', 'Go to question ' + (i + 1));
      b.addEventListener('click', function () { go(i); });
      grid.appendChild(b);
    });
    show('quiz');
    startTimer();
  }

  function toggle(orig) {
    var a = state.attempt, q = current();
    if (a.done || remaining() <= 0) return;
    var p = (a.picks[q.id] || []).slice();
    var i = p.indexOf(orig);
    if (i >= 0) p.splice(i, 1); else p.push(orig);
    a.picks[q.id] = p;
    save();
    var y = window.scrollY;
    renderQuestion();
    window.scrollTo(0, y);
  }
  function go(i) {
    var a = state.attempt;
    if (i < 0 || i >= a.ids.length) return;
    a.current = i;
    save();
    renderQuestion();
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

  // ---------------- submit and results ----------------
  function submit() {
    var a = state.attempt;
    var missing = a.ids.length - answeredCount();
    if (missing === 0) return finishAttempt();
    confirmDialog({
      title: 'Submit with unanswered questions?',
      message: 'You have ' + missing + ' unanswered question' + (missing === 1 ? '' : 's') +
        '. Unanswered questions score 0. Keep answering to jump to the first one, or submit now.',
      cancelText: 'Keep answering',
      confirmText: 'Submit anyway',
    }).then(function (yes) {
      if (a.done) return;                                   // the clock ran out while the dialog was open
      if (yes) return finishAttempt();
      var first = a.ids.findIndex(function (id) { return !(a.picks[id] && a.picks[id].length); });
      if (first >= 0) go(first);
    });
  }

  function finishAttempt(timedOut) {
    var a = state.attempt;
    if (a.done) return;
    stopTimer();
    a.done = true;
    var score = a.ids.filter(function (id) { return sameSet(a.picks[id] || [], byId[id].answer); }).length;
    var pct = Math.round(100 * score / a.ids.length);
    var end = timedOut && a.deadline ? a.deadline : Date.now();
    var used = a.started ? Math.min(TIME_LIMIT_MS, end - Date.parse(a.started)) : null;
    var rec = { score: score, total: a.ids.length, pct: pct, date: new Date().toISOString().slice(0, 10),
      timedOut: !!timedOut, time: used != null ? fmt(used) : null };
    state.history.push(rec);
    state.history = state.history.slice(-20);
    if (!state.best || score > state.best.score) state.best = rec;
    a.result = rec;
    save();
    reviewFilter = 'all';
    renderResults();
  }

  function renderResults() {
    var a = state.attempt, r = a.result;
    var passed = r.pct >= PASS * 100;
    var s = $('r-score');
    s.textContent = r.score + ' / ' + r.total + ' · ' + r.pct + '%';
    s.className = 'score-big ' + (passed ? 'pass' : 'fail');
    $('r-message').textContent = passed
      ? '🎉 Passed! You scored at least 70%. Review the misses below to close the remaining gaps.'
      : 'Not yet: the pass mark is 70%. Revisit the chapters below and try a new random set.';
    $('r-time').textContent = r.timedOut
      ? '⏰ Time\'s up — the 50 minutes ran out and your answers were submitted automatically. Unanswered questions score 0.'
      : r.time ? '⏱ Finished in ' + r.time + ' of the 50 minutes.' : '';
    $('r-time').className = r.timedOut ? 'pitfall' : 'muted';

    // per-chapter breakdown
    var per = {};
    a.ids.forEach(function (id) {
      var q = byId[id];
      var p = per[q.topic] = per[q.topic] || { right: 0, total: 0 };
      p.total++;
      if (sameSet(a.picks[id] || [], q.answer)) p.right++;
    });
    var table = $('r-table');
    table.innerHTML = '';
    var head = el('tr'); ['Chapter', 'Score', ''].forEach(function (h) { head.appendChild(el('th', null, h)); });
    table.appendChild(head);
    var weak = [];
    Object.keys(bank.chapters).forEach(function (t) {
      if (!per[t]) return;
      var p = per[t], ratio = p.right / p.total;
      if (ratio < REVISIT) weak.push(t);
      var tr = el('tr');
      var td = el('td'); var link = el('a', null, chapterLabel(t)); link.href = bank.chapters[t].file; td.appendChild(link);
      tr.appendChild(td);
      tr.appendChild(el('td', null, p.right + ' / ' + p.total));
      var bt = el('td'); var bar = el('div', 'bar' + (ratio < REVISIT ? ' low' : '')); var fill = el('div');
      fill.style.width = Math.round(100 * ratio) + '%'; bar.appendChild(fill); bt.appendChild(bar); tr.appendChild(bt);
      table.appendChild(tr);
    });

    var rv = $('r-revisit');
    rv.innerHTML = '';
    if (weak.length) {
      var box = el('div', 'tip');
      box.appendChild(el('p', null, '💡 Worth revisiting (under 60% this time):'));
      var ul = el('ul');
      weak.forEach(function (t) {
        var li = el('li'); var link = el('a', null, chapterLabel(t)); link.href = bank.chapters[t].file;
        li.appendChild(link); ul.appendChild(li);
      });
      box.appendChild(ul);
      rv.appendChild(box);
    }
    renderReview();
    show('results');
  }

  function renderReview() {
    var a = state.attempt;
    Array.prototype.forEach.call($('r-filters').querySelectorAll('button'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-filter') === reviewFilter);
    });
    var box = $('r-review');
    box.innerHTML = '';
    a.ids.forEach(function (id, n) {
      var q = byId[id], picks = a.picks[id] || [];
      var right = sameSet(picks, q.answer);
      if (reviewFilter === 'right' && !right) return;
      if (reviewFilter === 'wrong' && right) return;
      var item = el('div', 'review ' + (right ? 'right' : 'wrong'));
      item.appendChild(el('div', 'a-meta', (right ? '✔ ' : '✘ ') + 'Question ' + (n + 1) + ' · ' + chapterLabel(q.topic) + ' · ' + q.difficulty));
      item.appendChild(el('div', 'q-text', q.question));
      if (q.code) item.appendChild(el('pre', 'q-code', q.code));
      var ul = el('ul');
      a.orders[id].forEach(function (orig) {
        var isC = q.answer.indexOf(orig) >= 0, picked = picks.indexOf(orig) >= 0;
        var mark = isC ? '✔ ' : picked ? '✘ ' : '   ';
        var li = el('li', isC ? 'is-correct' : picked ? 'picked-wrong' : '', mark + q.options[orig] + (picked ? '   ← your pick' : ''));
        ul.appendChild(li);
      });
      item.appendChild(ul);
      if (!picks.length) item.appendChild(el('p', 'muted', 'You left this one unanswered.'));
      item.appendChild(el('p', null, q.explanation));
      box.appendChild(item);
    });
    if (!box.children.length) box.appendChild(el('p', 'muted', 'Nothing to show for this filter.'));
  }

  // ---------------- events ----------------
  $('btn-start').addEventListener('click', newAttempt);
  $('btn-resume').addEventListener('click', function () { renderQuestion(); });
  $('btn-prev').addEventListener('click', function () { go(state.attempt.current - 1); });
  $('btn-next').addEventListener('click', function () { go(state.attempt.current + 1); });
  $('btn-submit').addEventListener('click', submit);
  $('btn-again').addEventListener('click', newAttempt);
  Array.prototype.forEach.call($('r-filters').querySelectorAll('button'), function (b) {
    b.addEventListener('click', function () { reviewFilter = b.getAttribute('data-filter'); renderReview(); });
  });
  document.addEventListener('keydown', function (e) {
    if ($('quiz').classList.contains('hidden') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector('dialog[open]')) return;     // shortcuts pause while a dialog is open
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && e.target.type !== 'checkbox') return;
    var q = current();
    if (state.attempt.done) return;
    if (/^[1-6]$/.test(e.key)) {
      var shown = +e.key - 1, order = state.attempt.orders[q.id];
      if (shown < order.length) { e.preventDefault(); toggle(order[shown]); }
    } else if (e.key === 'ArrowRight') { e.preventDefault(); go(state.attempt.current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(state.attempt.current - 1); }
  });

  // expose a tiny hook for automated end-to-end tests
  window.__assessment = {
    state: function () { return state; },
    byId: function (id) { return byId[id]; },
    toggle: toggle, go: go, submit: submit, newAttempt: newAttempt,
    expireIn: function (ms) { state.attempt.deadline = Date.now() + ms; save(); tick(); },   // tests: move the deadline
  };

  start();
})();
