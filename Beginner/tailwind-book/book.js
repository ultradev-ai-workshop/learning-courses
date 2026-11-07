/* Tailwind CSS Study Book — shared sidebar, pager, code-block and screenshot renderer. */
(function () {
  'use strict';

  // One list drives the sidebar, the pager and the index page.
  // Each chapter: [file, title, label?]  (label overrides the number shown)
  var PARTS = [
    { part: 'Start here', chapters: [
      ['playground-howto.html', 'Using the Playground', '▶'],
      ['faq.html', 'FAQ: Tailwind vs Regular CSS', '?']
    ]},
    { part: 'Part I · Getting Started', chapters: [
      ['01-what.html', 'What Tailwind CSS Is'],
      ['02-install.html', 'Installing Tailwind'],
      ['03-utility-first.html', 'Styling with Utility Classes'],
      ['04-editor.html', 'Editor Setup & Class Order']
    ]},
    { part: 'Part II · Core Concepts', chapters: [
      ['05-states.html', 'Hover, Focus & Other States'],
      ['06-responsive.html', 'Responsive Design'],
      ['07-dark-mode.html', 'Dark Mode'],
      ['08-theme.html', 'Theme Variables & Colors'],
      ['09-arbitrary.html', 'Arbitrary Values & Properties'],
      ['10-reusing.html', 'Reusing Styles'],
      ['11-custom.html', 'Custom Styles, Directives & Detection']
    ]},
    { part: 'Part III · Utilities in Depth', chapters: [
      ['12-layout.html', 'Layout & Positioning'],
      ['13-flex-grid.html', 'Flexbox & Grid'],
      ['14-spacing-sizing.html', 'Spacing & Sizing'],
      ['15-typography.html', 'Typography'],
      ['16-color-effects.html', 'Backgrounds, Borders & Effects'],
      ['17-motion.html', 'Transitions, Transforms & Animation'],
      ['18-modern.html', 'Container Queries & Modern CSS']
    ]},
    { part: 'Part IV · Project', chapters: [
      ['19-project.html', 'Capstone: Tailwind in Next.js']
    ]},
    { part: 'Appendix & Assessment', chapters: [
      ['appendix-upgrade.html', 'Coming from v2 or v3', 'A'],
      ['appendix-plugins.html', 'Plugins: Typography & Forms', 'B'],
      ['appendix-react.html', 'Tailwind with React Components', 'C'],
      ['glossary.html', 'Glossary', 'G'],
      ['assessment.html', 'Final Assessment', '✓']
    ]}
  ];
  window.BOOK_PARTS = PARTS;
  var COURSES_HOME = '../../index.html';
  // A simple wave mark in Tailwind's colours: used by the sidebar brand and the index page heading.
  var TW_MARK = '<svg class="tw-mark" viewBox="0 0 54 33" aria-hidden="true"><path fill="#38bdf8" fill-rule="evenodd" clip-rule="evenodd" ' +
    'd="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/></svg>';
  window.TW_MARK = TW_MARK;

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
    det.appendChild(el('summary', null, '☰ Tailwind CSS Study Book — chapters'));
    var brand = el('a', { href: 'index.html', 'class': 'brand' });
    brand.innerHTML = TW_MARK + ' Tailwind CSS <span>Study Book</span>';
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

  var JS_KW = ('async await break case catch class const continue debugger default delete do else export extends ' +
    'false finally for from function get if import in instanceof let new null of return set static super switch this ' +
    'throw true try typeof undefined using var void while with yield ' +
    // TypeScript-only words
    'type interface enum implements private protected public readonly abstract declare namespace module keyof ' +
    'infer is asserts satisfies as unique never unknown any override accessor string number boolean bigint symbol object').split(' ');
  var JS_KW_SET = {};
  JS_KW.forEach(function (k) { JS_KW_SET[k] = true; });

  // A small JavaScript tokenizer: strings, template literals, comments, regex literals, keywords, numbers.
  function highlightJs(src) {
    var out = '', i = 0, n = src.length, prevSig = '';
    while (i < n) {
      var ch = src[i], two = src.substr(i, 2);
      if (two === '//') {
        var end = src.indexOf('\n', i); if (end < 0) end = n;
        out += span('c', src.slice(i, end)); i = end; continue;
      }
      if (two === '/*') {
        var e2 = src.indexOf('*/', i + 2); e2 = e2 < 0 ? n : e2 + 2;
        out += span('c', src.slice(i, e2)); i = e2; continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        var j = i + 1;
        while (j < n && src[j] !== ch) { if (src[j] === '\\') j++; if (ch !== '`' && src[j] === '\n') break; j++; }
        j = Math.min(j + 1, n);
        out += span('s', src.slice(i, j)); i = j; prevSig = 's'; continue;
      }
      // a "/" starts a regex literal when it can't be division
      if (ch === '/' && (prevSig === '' || /[(,=:[!&|?{};+\-*%<>~^]$/.test(prevSig) || prevSig === 'kw')) {
        var k = i + 1, inClass = false;
        while (k < n && src[k] !== '\n') {
          if (src[k] === '\\') { k += 2; continue; }
          if (src[k] === '[') inClass = true; else if (src[k] === ']') inClass = false;
          else if (src[k] === '/' && !inClass) break;
          k++;
        }
        if (src[k] === '/') {
          k++; while (k < n && /[a-z]/.test(src[k])) k++;
          out += span('s', src.slice(i, k)); i = k; prevSig = 's'; continue;
        }
      }
      if (/[A-Za-z_$#]/.test(ch)) {
        var w = /^[#A-Za-z_$][A-Za-z0-9_$]*/.exec(src.slice(i))[0];
        var isKw = JS_KW_SET[w] && src[i - 1] !== '.';
        out += isKw ? span('k', w) : esc(w); i += w.length;
        prevSig = isKw && /^(return|typeof|case|in|of|yield|await|void|delete|new|throw)$/.test(w) ? 'kw' : 'id';
        continue;
      }
      if (/[0-9]/.test(ch) && !/[A-Za-z0-9_$]/.test(src[i - 1] || '')) {
        var num = /^(0[xXoObB][0-9a-fA-F_]+n?|[0-9][0-9_]*(\.[0-9_]*)?([eE][+-]?[0-9]+)?n?)/.exec(src.slice(i))[0];
        out += span('n', num); i += num.length; prevSig = 'n'; continue;
      }
      if (!/\s/.test(ch)) prevSig = ch;
      out += esc(ch); i++;
    }
    return out;
  }

  // REPL transcripts: "> " input, "... " continuation, everything else is output
  function highlightRepl(src) {
    return src.split('\n').map(function (line) {
      var m = /^(> |\.\.\. |>$)(.*)$/.exec(line);
      if (m) return span('p', m[1]) + highlightJs(m[2]);
      if (/^Uncaught /.test(line)) return '<span class="tok-err">' + esc(line) + '</span>';
      return span('o', line);
    }).join('\n');
  }

  function highlightShell(src) {
    return src.split('\n').map(function (line) {
      var m = /^(\$ |PS> )(.*)$/.exec(line);
      if (/^\s*#/.test(line)) return span('c', line);
      if (m) {
        var rest = m[2], c = rest.indexOf(' #');
        if (c >= 0) return span('p', m[1]) + esc(rest.slice(0, c)) + span('c', rest.slice(c));
        return span('p', m[1]) + esc(rest);
      }
      return span('o', line);
    }).join('\n');
  }

  // HTML / JSX markup: tags, attributes, and class lists (the heart of a Tailwind book)
  function highlightHtml(src) {
    var out = '', i = 0, n = src.length;
    while (i < n) {
      if (src.substr(i, 4) === '<!--') {
        var e = src.indexOf('-->', i); e = e < 0 ? n : e + 3;
        out += span('c', src.slice(i, e)); i = e; continue;
      }
      var m = /^<\/?[A-Za-z][\w.-]*/.exec(src.slice(i));
      if (m) {
        out += esc(m[0].slice(0, m[0][1] === '/' ? 2 : 1)) + span('t', m[0].replace(/^<\/?/, '')); i += m[0].length;
        // attributes until the closing >
        while (i < n && src[i] !== '>') {
          var am = /^([\s]+)|^([:@A-Za-z_][\w:.-]*)|^(=)|^("[^"]*"|'[^']*'|\{[^}]*\})|^(\/)/.exec(src.slice(i));
          if (!am) { out += esc(src[i]); i++; continue; }
          var tok = am[0];
          if (am[2]) { out += span('a', tok); i += tok.length; continue; }
          if (am[4]) {
            var prev = out.slice(-60);
            out += /(class|className)<\/span>=$/.test(prev) ? span('cls', tok) : span('s', tok);
            i += tok.length; continue;
          }
          out += esc(tok); i += tok.length;
        }
        if (src[i] === '>') { out += '&gt;'; i++; }
        continue;
      }
      out += esc(src[i]); i++;
    }
    return out;
  }
  function highlightCss(src) {
    var out = '', i = 0, n = src.length, inBlock = 0;
    while (i < n) {
      var ch = src[i], rest = src.slice(i), m;
      if (rest.indexOf('/*') === 0) { var e = src.indexOf('*/', i + 2); e = e < 0 ? n : e + 2; out += span('c', src.slice(i, e)); i = e; continue; }
      if (ch === '"' || ch === "'") { var j = src.indexOf(ch, i + 1); j = j < 0 ? n : j + 1; out += span('s', src.slice(i, j)); i = j; continue; }
      if ((m = /^@[\w-]+/.exec(rest))) { out += span('at', m[0]); i += m[0].length; continue; }
      if ((m = /^--[\w-]+(\\\*)?(-\*)?/.exec(rest))) { out += span('v', m[0]); i += m[0].length; continue; }
      if (ch === '{') inBlock++;
      if (ch === '}') inBlock = Math.max(0, inBlock - 1);
      // a selector: text before "{" at the start of a line
      if ((m = /^[.#:&*\[][^{};\n]*(?=\s*\{)/.exec(rest)) && /(^|\n)\s*$/.test(src.slice(0, i))) { out += span('sel', m[0]); i += m[0].length; continue; }
      if ((m = /^-?\d+(\.\d+)?(%|[a-z]+)?/.exec(rest)) && !/[\w-]/.test(src[i - 1] || '')) { out += span('n', m[0]); i += m[0].length; continue; }
      out += esc(ch); i++;
    }
    return out;
  }

  function langOf(node) {
    var lang = node.getAttribute('data-lang');
    if (lang) return lang;
    var file = node.getAttribute('data-file') || '';
    var ext = file.split('.').pop().toLowerCase();
    return { ts: 'ts', mts: 'ts', cts: 'ts', tsx: 'ts', js: 'js', jsx: 'js', mjs: 'js', cjs: 'js', json: 'json', txt: 'text', sh: 'shell', html: 'html', css: 'css', svg: 'html', local: 'text', env: 'text', md: 'text' }[ext] || (file.indexOf('.env') === 0 ? 'text' : 'ts');
  }

  function renderCodeBlocks() {
    var nodes = document.querySelectorAll('script[type="text/plain"].code');
    Array.prototype.forEach.call(nodes, function (node) {
      var code = dedent(node.textContent);
      var lang = langOf(node);
      var html;
      if (lang === 'shot') { renderShot(node, code); return; }
      if (lang === 'ts' || lang === 'js' || lang === 'java') html = /\.(tsx|jsx)$/.test(node.getAttribute('data-file') || '') ? highlightTsx(code) : highlightJs(code);
      else if (lang === 'html') html = highlightHtml(code);
      else if (lang === 'css') html = highlightCss(code);
      else if (lang === 'repl') html = highlightRepl(code);
      else if (lang === 'shell') html = highlightShell(code);
      else html = esc(code);

      var wrap = el('div', { 'class': 'codeblock' });
      var head = el('div', { 'class': 'code-head' });
      var url = node.getAttribute('data-url');
      var label = node.getAttribute('data-file') || node.getAttribute('data-title') ||
        (node.getAttribute('data-css') ? 'generated CSS · ' + ({ utilities: '@layer utilities', theme: '@layer theme', base: '@layer base', components: '@layer components', rest: 'output.css (without theme and base)', full: 'output.css' }[node.getAttribute('data-css')] || 'output.css') : null) ||
        (url != null || node.getAttribute('data-eval') ? '🌐 browser' + (node.getAttribute('data-width') ? ' · ' + node.getAttribute('data-width') + 'px wide' : '') + (node.getAttribute('data-scheme') === 'dark' ? ' · dark' : '') + (node.getAttribute('data-eval') ? ' · computed values' : '') : null) ||
        ({ repl: 'node REPL', shell: 'terminal', text: 'output', js: 'javascript', ts: 'typescript', errors: 'build errors', html: 'html', css: 'css' }[lang] || lang);
      if (url != null || node.getAttribute('data-eval')) wrap.className += ' browser';
      head.appendChild(el('span', null, label));
      var btn = el('button', { type: 'button', 'class': 'copy' }, 'Copy');
      btn.addEventListener('click', function () {
        // For REPL and terminal blocks, copy only the typed lines (without prompts or output).
        var text = code;
        if (lang === 'repl') {
          text = code.split('\n').filter(function (l) { return /^(> |\.\.\. |>$)/.test(l); })
            .map(function (l) { return l.replace(/^(> ?|\.\.\. ?)/, ''); }).join('\n');
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

  // JSX: JavaScript with markup; the markup parts get the HTML colours
  function highlightTsx(src) {
    // split on lines that look like markup (start with < after indentation, or contain className=)
    return src.split('\n').map(function (line) {
      return /^\s*<\/?[A-Za-z>]|className=|^\s*\{\/\*/.test(line) ? highlightHtml(line) : highlightJs(line);
    }).join('\n');
  }

  // Screenshots taken by tools/check-snippets.mjs (data-lang="shot" data-shot="name")
  function renderShot(node, alt) {
    var name = node.getAttribute('data-shot');
    var fig = el('figure', { 'class': 'shot' });
    var head = el('div', { 'class': 'code-head' });
    var w = node.getAttribute('data-width') || '1000';
    head.appendChild(el('span', null, '🖼 rendered in Chrome · ' + w + 'px wide' + (node.getAttribute('data-scheme') === 'dark' ? ' · dark mode' : '')));
    var st = node.getAttribute('data-steps') || '';
    var hm = /(hover|focus):/.exec(st);
    if (hm) head.appendChild(el('span', null, hm[1] === 'hover' ? 'mouse over' : 'focused'));
    fig.appendChild(head);
    var frame = el('div', { 'class': 'frame' });
    var img = el('img', { src: 'shots/' + name + '.png', alt: alt.replace(/\s+/g, ' ').trim(), loading: 'lazy' });
    img.addEventListener('load', function () { img.style.width = Math.round(img.naturalWidth / 2) + 'px'; });
    frame.appendChild(img);
    fig.appendChild(frame);
    var cap = node.getAttribute('data-caption');
    if (cap) fig.appendChild(el('figcaption', null, cap));
    node.parentNode.replaceChild(fig, node);
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
        var label = !c[2] ? 'Chapter ' + parseInt(c[0], 10) : c[2] === '✓' ? 'Assessment' : c[2] === '▶' ? 'Start here' : c[2] === 'G' || c[2] === '?' ? 'Reference' : 'Appendix ' + c[2];
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
