/* Python Study Book — final assessment.
   Loads questions.json (or questions.js when opened from disk), picks 50 questions
   stratified across chapters, scores exact-match multi-select answers, and keeps
   progress and history in localStorage. */
(function () {
  'use strict';

  var PER_ATTEMPT = 50;
  var PASS = 0.7;
  var REVISIT = 0.6;
  var MAX_PER_TEMPLATE = 2;
  var STORE_KEY = 'pyBook.assessment.v1';

  var bank = null;       // { chapters, questions }
  var byId = {};
  var state = load();    // { attempt, best, history }
  var reviewFilter = 'all';

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
    renderStart();
  }

  // ---------------- start screen ----------------
  function renderStart() {
    $('pool-size').textContent = bank.questions.length;
    var best = state.best;
    $('best').textContent = best ? 'Best score so far: ' + best.score + ' / ' + best.total + ' (' + best.pct + '%) on ' + best.date + '.' : 'No attempts yet.';
    $('btn-resume').classList.toggle('hidden', !(state.attempt && !state.attempt.done));

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
        ul.appendChild(el('li', null, h.date + ': ' + h.score + ' / ' + h.total + ' (' + h.pct + '%)' + (h.pct >= PASS * 100 ? ' ✓' : '')));
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
    state.attempt = { ids: qs.map(function (q) { return q.id; }), orders: orders, picks: {}, current: 0, done: false, started: new Date().toISOString() };
    save();
    renderQuestion();
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
  }

  function toggle(orig) {
    var a = state.attempt, q = current();
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

  // ---------------- submit and results ----------------
  function submit() {
    var a = state.attempt;
    var missing = a.ids.length - answeredCount();
    if (missing > 0 && !window.confirm(missing + ' question(s) are unanswered and will score 0. Submit anyway?')) return;
    a.done = true;
    var score = a.ids.filter(function (id) { return sameSet(a.picks[id] || [], byId[id].answer); }).length;
    var pct = Math.round(100 * score / a.ids.length);
    var rec = { score: score, total: a.ids.length, pct: pct, date: new Date().toISOString().slice(0, 10) };
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
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && e.target.type !== 'checkbox') return;
    var q = current();
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
  };

  start();
})();
