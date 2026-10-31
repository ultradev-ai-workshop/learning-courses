/* Problem Set — shared page logic. Data comes from problems.js (window.PROBLEM_SET), so pages work from file://. */
(function () {
  'use strict';
  var KEY = 'problems.progress.v1';
  var DIFFS = [
    ['easy', 'Easy', 'Warm-ups: loops, strings, arithmetic.'],
    ['medium', 'Medium', 'Classic data-structure and algorithm problems.'],
    ['hard', 'Hard', 'Dynamic programming, graphs, backtracking.'],
    ['oop', 'Object-oriented', 'Design classes, then drive them with a command script.']
  ];
  var set = window.PROBLEM_SET || { problems: [] };
  var byId = {};
  set.problems.forEach(function (p, i) { p.index = i; byId[p.id] = p; });

  // ---------- progress (per browser, localStorage) ----------
  function load() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
  }
  function save(all) { try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* storage blocked: progress just isn't kept */ } }
  function entry(id) { return load()[id] || { passed: {}, solved: false }; }
  function update(id, fn) {
    var all = load(); var e = all[id] || { passed: {}, solved: false };
    e.passed = e.passed || {};
    fn(e); e.at = Date.now(); all[id] = e; save(all); return e;
  }
  function status(id) {
    var e = load()[id];
    if (!e) return 'new';
    if (e.solved) return 'solved';
    return Object.keys(e.passed || {}).length ? 'tried' : 'new';
  }
  function resetAll() { save({}); }

  // ---------- output comparison (same rules as the command-line runner) ----------
  function normalise(text) {
    var rows = String(text).replace(/\r\n?/g, '\n').split('\n').map(function (r) { return r.replace(/\s+$/, ''); });
    while (rows.length && rows[rows.length - 1] === '') rows.pop();
    return rows;
  }
  function compare(got, want) {
    var g = normalise(got), w = normalise(want);
    for (var i = 0; i < Math.max(g.length, w.length); i++) {
      var a = i < g.length ? g[i] : null, b = i < w.length ? w[i] : null;
      if (a !== b) return { ok: false, line: i + 1, got: a, want: b, gotLines: g.length, wantLines: w.length };
    }
    return { ok: true, lines: w.length };
  }

  // ---------- DOM helpers ----------
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function copyText(text, btn) {
    function done(ok) {
      if (!btn) return;
      var old = btn.dataset.label || btn.textContent; btn.dataset.label = old;
      btn.textContent = ok ? 'Copied ✓' : 'Select & copy';
      setTimeout(function () { btn.textContent = old; }, 1300);
    }
    function fallback() {
      var t = el('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      t.remove(); done(ok);
    }
    if (navigator.clipboard && window.isSecureContext !== false) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    else fallback();
  }
  function copyButton(getText, label) {
    var b = el('button', { type: 'button', class: 'btn small', text: label || 'Copy' });
    b.addEventListener('click', function () { copyText(typeof getText === 'function' ? getText() : getText, b); });
    return b;
  }
  function pane(title, text, opts) {
    opts = opts || {};
    var pre = el('pre', null, [el('code', { text: text })]);
    var head = el('div', { class: 'head' }, [el('span', { text: title }), opts.copy === false ? null : copyButton(text)]);
    return el('div', { class: 'pane' }, [head, pre]);
  }
  function badge(diff) {
    var d = DIFFS.filter(function (x) { return x[0] === diff; })[0];
    return el('span', { class: 'badge ' + diff, text: d ? (diff === 'oop' ? 'OOP' : d[1]) : diff });
  }
  function runnerCommand(id) { return 'python3 runner/run-tests.py ' + id + ' -- <command that runs your solution>'; }

  window.ProblemApp = {
    set: set, problems: set.problems, byId: byId, DIFFS: DIFFS,
    progress: { load: load, entry: entry, update: update, status: status, resetAll: resetAll },
    compare: compare, normalise: normalise, el: el, pane: pane, badge: badge, copyButton: copyButton, copyText: copyText,
    runnerCommand: runnerCommand
  };
})();
