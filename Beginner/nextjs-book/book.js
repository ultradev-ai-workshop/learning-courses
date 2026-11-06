/* Next.js Study Book — shared sidebar, pager and code-block renderer. */
(function () {
  'use strict';

  // One list drives the sidebar, the pager and the index page.
  // Each chapter: [file, title, label?]  (label overrides the number shown)
  var PARTS = [
    { part: 'Start here', chapters: [
      ['playground-howto.html', 'Using the Playground', '▶'],
      ['faq.html', 'FAQ', '?']
    ]},
    { part: 'Part I · Foundations', chapters: [
      ['01-what.html', 'What Next.js Is (and Isn\'t)'],
      ['02-install.html', 'Installation & Project Structure'],
      ['03-layouts-pages.html', 'Layouts and Pages'],
      ['04-linking.html', 'Linking, Navigating & Dynamic Routes']
    ]},
    { part: 'Part II · Rendering & Data', chapters: [
      ['05-server-client.html', 'Server and Client Components'],
      ['06-fetching.html', 'Fetching Data & Streaming'],
      ['07-mutating.html', 'Mutating Data: Server Actions & Forms'],
      ['08-caching.html', 'Caching with Cache Components'],
      ['09-revalidating.html', 'Revalidating'],
      ['10-errors.html', 'Error Handling']
    ]},
    { part: 'Part III · Styling & Assets', chapters: [
      ['11-css.html', 'CSS & Tailwind'],
      ['12-images-fonts.html', 'Images & Fonts'],
      ['13-metadata.html', 'Metadata & OG Images']
    ]},
    { part: 'Part IV · The Backend Side', chapters: [
      ['14-route-handlers.html', 'Route Handlers'],
      ['15-proxy.html', 'Proxy'],
      ['16-env-auth.html', 'Environment Variables & Auth Basics'],
      ['17-testing.html', 'Testing with Vitest & Playwright']
    ]},
    { part: 'Part V · Ship It', chapters: [
      ['18-deploying.html', 'Deploying, Self-hosting & Upgrading'],
      ['19-project.html', 'Capstone: Reading List App']
    ]},
    { part: 'Appendix & Assessment', chapters: [
      ['appendix-react.html', 'React & TypeScript for Next.js', 'A'],
      ['appendix-pages-router.html', 'Pages Router & Migrating', 'B'],
      ['glossary.html', 'Glossary', 'G'],
      ['assessment.html', 'Final Assessment', '✓']
    ]}
  ];
  window.BOOK_PARTS = PARTS;
  var COURSES_HOME = '../../index.html';
  // The Next.js mark (simplified, one colour): used by the sidebar brand and the index page heading.
  var NEXT_MARK = '<svg class="next-mark" viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="90" fill="currentColor"/>' +
    '<path d="M149.5 157.5 69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.7 9.5-7.3Z" fill="var(--bg)"/><rect x="115" y="54" width="12" height="72" fill="var(--bg)"/></svg>';
  window.NEXT_MARK = NEXT_MARK;

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
    det.appendChild(el('summary', null, '☰ Next.js Study Book — chapters'));
    var brand = el('a', { href: 'index.html', 'class': 'brand' });
    brand.innerHTML = NEXT_MARK + ' Next.js <span>Study Book</span>';
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

  function langOf(node) {
    var lang = node.getAttribute('data-lang');
    if (lang) return lang;
    var file = node.getAttribute('data-file') || '';
    var ext = file.split('.').pop().toLowerCase();
    return { ts: 'ts', mts: 'ts', cts: 'ts', tsx: 'ts', js: 'js', jsx: 'js', mjs: 'js', cjs: 'js', json: 'json', txt: 'text', sh: 'shell', html: 'html', css: 'css', local: 'text', env: 'text', md: 'text' }[ext] || (file.indexOf('.env') === 0 ? 'text' : 'ts');
  }

  function renderCodeBlocks() {
    var nodes = document.querySelectorAll('script[type="text/plain"].code');
    Array.prototype.forEach.call(nodes, function (node) {
      var code = dedent(node.textContent);
      var lang = langOf(node);
      var html;
      if (lang === 'ts' || lang === 'js' || lang === 'java') html = highlightJs(code);
      else if (lang === 'repl') html = highlightRepl(code);
      else if (lang === 'shell') html = highlightShell(code);
      else html = esc(code);

      var wrap = el('div', { 'class': 'codeblock' });
      var head = el('div', { 'class': 'code-head' });
      var url = node.getAttribute('data-url');
      var label = node.getAttribute('data-file') || node.getAttribute('data-title') ||
        (url ? '🌐 browser · localhost:3000' + url : null) ||
        ({ repl: 'node REPL', shell: 'terminal', text: 'output', js: 'javascript', ts: 'typescript', errors: 'next build errors' }[lang] || lang);
      if (url) wrap.className += ' browser';
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
