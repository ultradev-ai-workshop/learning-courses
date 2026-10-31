/* Python Study Book — shared sidebar, pager and code-block renderer. */
(function () {
  'use strict';

  // One list drives the sidebar, the pager and the index page.
  // Each chapter: [file, title, label?]  (label overrides the number shown)
  var PARTS = [
    { part: 'Start here', chapters: [
      ['playground-howto.html', 'Using the Playground', '▶']
    ]},
    { part: 'Part I · Getting Started', chapters: [
      ['01-setup.html', 'Meet Python & the Interpreter'],
      ['02-basics.html', 'Numbers, Text & Lists']
    ]},
    { part: 'Part II · Control Flow & Functions', chapters: [
      ['03-control.html', 'Making Decisions & Loops'],
      ['04-match.html', 'Pattern Matching with match'],
      ['05-functions.html', 'Functions in Depth']
    ]},
    { part: 'Part III · Data Structures', chapters: [
      ['06-lists.html', 'Lists & Comprehensions'],
      ['07-collections.html', 'Tuples, Sets & Dictionaries']
    ]},
    { part: 'Part IV · Modules, I/O & Errors', chapters: [
      ['08-modules.html', 'Modules & Packages'],
      ['09-io.html', 'Input & Output'],
      ['10-exceptions.html', 'Errors & Exceptions']
    ]},
    { part: 'Part V · Object-Oriented Python', chapters: [
      ['11-classes.html', 'Classes'],
      ['12-iterators.html', 'Iterators & Generators']
    ]},
    { part: 'Part VI · Standard Library & Ecosystem', chapters: [
      ['13-stdlib1.html', 'Standard Library Tour I'],
      ['14-stdlib2.html', 'Standard Library Tour II'],
      ['15-venv.html', 'Virtual Environments & pip']
    ]},
    { part: 'Part VII · Putting It Together', chapters: [
      ['16-project.html', 'Project: CLI Expense Tracker']
    ]},
    { part: 'Appendix & Assessment', chapters: [
      ['appendix-fromjava.html', 'From Java & JavaScript to Python', 'A'],
      ['appendix-shell.html', 'Terminal, Paths & Text Encoding', 'B'],
      ['assessment.html', 'Final Assessment', '✓']
    ]}
  ];
  window.BOOK_PARTS = PARTS;
  var COURSES_HOME = '../../index.html';

  function currentFile() {
    var f = location.pathname.split('/').pop();
    return f === '' ? 'index.html' : decodeURIComponent(f);
  }

  function flat() {
    var out = [];
    PARTS.forEach(function (p) {
      p.chapters.forEach(function (c) {
        var num = c[2] || String(parseInt(c[0], 10));
        out.push({ file: c[0], title: c[1], num: num, part: p.part });
      });
    });
    return out;
  }

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------- sidebar ----------
  function buildSidebar() {
    var nav = document.getElementById('sidebar');
    if (!nav) return;
    var here = currentFile();
    // Back to the course launcher (learning-courses/index.html); outside <details> so it shows on phones too
    nav.appendChild(el('a', { href: COURSES_HOME, 'class': 'all-courses' }, '← All courses'));
    nav.appendChild(el('a', { href: '../../problems/index.html', 'class': 'all-courses' }, '🧩 Practice problems'));
    var det = el('details');
    det.appendChild(el('summary', null, '☰ Python Study Book — chapters'));
    var brand = el('a', { href: 'index.html', 'class': 'brand' });
    brand.innerHTML = '🐍 Python <span>Study Book</span>';
    det.appendChild(brand);
    PARTS.forEach(function (p) {
      det.appendChild(el('div', { 'class': 'part' }, p.part));
      var ol = el('ol');
      p.chapters.forEach(function (c) {
        var li = el('li');
        var a = el('a', { href: c[0] });
        if (c[0] === here) { a.className = 'current'; a.setAttribute('aria-current', 'page'); }
        a.appendChild(el('span', { 'class': 'num' }, c[2] || String(parseInt(c[0], 10))));
        a.appendChild(el('span', null, c[1]));
        li.appendChild(a);
        ol.appendChild(li);
      });
      det.appendChild(ol);
    });
    // Open on desktop, collapsed on phones.
    if (window.matchMedia('(min-width: 901px)').matches) det.open = true;
    nav.appendChild(det);
  }

  // ---------- pager ----------
  function buildPager() {
    var pager = document.getElementById('pager');
    if (!pager) return;
    var list = [{ file: 'index.html', title: 'Home', num: '' }].concat(flat());
    var i = list.findIndex(function (x) { return x.file === currentFile(); });
    if (i < 0) return;
    function link(item, cls, dir) {
      var a = el('a', { href: item.file, 'class': cls });
      a.appendChild(el('small', null, dir));
      var prefix = /^[0-9A-Z]/.test(item.num) ? item.num + '. ' : '';   // no "▶." or "✓." prefixes
      a.appendChild(document.createTextNode(prefix + item.title));
      return a;
    }
    if (i > 0) pager.appendChild(link(list[i - 1], 'prev', '← Previous'));
    else pager.appendChild(el('span', { 'class': 'spacer' }));
    if (i < list.length - 1) pager.appendChild(link(list[i + 1], 'next', 'Next →'));
    else pager.appendChild(el('span', { 'class': 'spacer' }));
  }

  // ---------- code blocks ----------
  function dedent(src) {
    src = src.replace(/<\\\/script>/gi, '</' + 'script>').replace(/\t/g, '    ');
    var lines = src.split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    var min = Infinity;
    lines.forEach(function (l) {
      if (l.trim() === '') return;
      var m = l.match(/^ */)[0].length;
      if (m < min) min = m;
    });
    if (min === Infinity) min = 0;
    return lines.map(function (l) { return l.slice(min); }).join('\n');
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function span(cls, s) { return '<span class="tok-' + cls + '">' + esc(s) + '</span>'; }

  var PY_KW = ('False None True and as assert async await break case class continue def del elif else ' +
    'except finally for from global if import in is lambda lazy match nonlocal not or pass raise return try ' +
    'type while with yield self').split(' ');
  var PY_KW_SET = {};
  PY_KW.forEach(function (k) { PY_KW_SET[k] = true; });

  // A small Python tokenizer: strings (incl. triple and prefixed), comments, keywords, numbers.
  function highlightPython(src) {
    var out = '', i = 0, n = src.length;
    while (i < n) {
      var ch = src[i];
      if (ch === '#') {
        var end = src.indexOf('\n', i); if (end < 0) end = n;
        out += span('c', src.slice(i, end)); i = end; continue;
      }
      var m = /^([rRbBfFuUtT]{0,2})('''|"""|'|")/.exec(src.slice(i, i + 5));
      if (m && (m[1] === '' || !/[A-Za-z0-9_]/.test(src[i - 1] || ''))) {
        var q = m[2], j = i + m[0].length;
        while (j < n) {
          if (src[j] === '\\') { j += 2; continue; }
          if (src.substr(j, q.length) === q) { j += q.length; break; }
          if (q.length === 1 && src[j] === '\n') break;
          j++;
        }
        out += span('s', src.slice(i, j)); i = j; continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        var w = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i))[0];
        out += PY_KW_SET[w] ? span('k', w) : esc(w); i += w.length; continue;
      }
      if (/[0-9]/.test(ch) && !/[A-Za-z0-9_]/.test(src[i - 1] || '')) {
        var num = /^(0[xXoObB][0-9a-fA-F_]+|[0-9][0-9_]*(\.[0-9_]*)?([eE][+-]?[0-9]+)?j?)/.exec(src.slice(i))[0];
        out += span('n', num); i += num.length; continue;
      }
      out += esc(ch); i++;
    }
    return out;
  }

  function highlightPycon(src) {
    return src.split('\n').map(function (line) {
      if (line === '<BLANKLINE>') return '';      // doctest's marker for an empty output line
      var m = /^(>>> |\.\.\. |>>>$|\.\.\.$)(.*)$/.exec(line);
      if (m) return span('p', m[1]) + highlightPython(m[2]);
      return span('o', line);
    }).join('\n');
  }

  function highlightShell(src) {
    return src.split('\n').map(function (line) {
      var m = /^(\$ |PS> |&gt; )(.*)$/.exec(line);
      if (/^\s*#/.test(line)) return span('c', line);
      if (m) {
        var rest = m[2], c = rest.indexOf(' #');
        if (c >= 0) return span('p', m[1]) + esc(rest.slice(0, c)) + span('c', rest.slice(c));
        return span('p', m[1]) + esc(rest);
      }
      return span('o', line);
    }).join('\n');
  }

  function langOf(node) {
    var lang = node.getAttribute('data-lang');
    if (lang) return lang;
    var file = node.getAttribute('data-file') || '';
    var ext = file.split('.').pop().toLowerCase();
    return { py: 'python', json: 'json', txt: 'text', sh: 'shell', toml: 'text', cfg: 'text', csv: 'text', ini: 'text' }[ext] || 'python';
  }

  function renderCodeBlocks() {
    var nodes = document.querySelectorAll('script[type="text/plain"].code');
    Array.prototype.forEach.call(nodes, function (node) {
      var code = dedent(node.textContent);
      var lang = langOf(node);
      var html;
      if (lang === 'python') html = highlightPython(code);
      else if (lang === 'pycon') html = highlightPycon(code);
      else if (lang === 'shell') html = highlightShell(code);
      else html = esc(code);

      var wrap = el('div', { 'class': 'codeblock' });
      var head = el('div', { 'class': 'code-head' });
      var label = node.getAttribute('data-file') ||
        ({ pycon: 'python REPL', shell: 'terminal', text: 'output' }[lang] || lang);
      head.appendChild(el('span', null, label));
      var btn = el('button', { type: 'button', 'class': 'copy' }, 'Copy');
      btn.addEventListener('click', function () {
        // For REPL blocks, copy only the typed lines (without prompts or output).
        var text = code;
        if (lang === 'pycon') {
          text = code.split('\n').filter(function (l) { return /^(>>>|\.\.\.)/.test(l); })
            .map(function (l) { return l.replace(/^(>>> ?|\.\.\. ?)/, ''); }).join('\n');
        } else if (lang === 'shell') {
          text = code.split('\n').filter(function (l) { return /^\$ /.test(l); })
            .map(function (l) { return l.slice(2); }).join('\n') || code;
        }
        var done = function () { btn.textContent = 'Copied ✓'; setTimeout(function () { btn.textContent = 'Copy'; }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else { fallbackCopy(text); done(); }
      });
      head.appendChild(btn);
      var pre = el('pre');
      var c = el('code');
      c.innerHTML = html;
      pre.appendChild(c);
      wrap.appendChild(head);
      wrap.appendChild(pre);
      node.parentNode.replaceChild(wrap, node);
    });
  }

  function fallbackCopy(text) {
    var ta = el('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  // ---------- index cards ----------
  function buildCards() {
    var box = document.getElementById('cards');
    if (!box) return;
    var blurbs = window.BOOK_BLURBS || {};
    PARTS.forEach(function (p) {
      box.appendChild(el('h2', null, p.part));
      var grid = el('div', { 'class': 'cards' });
      p.chapters.forEach(function (c) {
        var a = el('a', { href: c[0], 'class': 'card' });
        var label = !c[2] ? 'Chapter ' + parseInt(c[0], 10) : c[2] === '✓' ? 'Assessment' : c[2] === '▶' ? 'Start here' : 'Appendix ' + c[2];
        a.appendChild(el('div', { 'class': 'num' }, label));
        a.appendChild(el('h3', null, c[1]));
        if (blurbs[c[0]]) a.appendChild(el('p', null, blurbs[c[0]]));
        grid.appendChild(a);
      });
      box.appendChild(grid);
    });
  }

  function init() {
    buildSidebar();
    buildCards();
    renderCodeBlocks();
    buildPager();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
