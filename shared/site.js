/* coderhop learn — shared site header and theme for every course page.
   Load it in <head> (before the page renders) so the chosen theme applies without a flash:
     <link rel="stylesheet" href="../../shared/site.css"><script src="../../shared/site.js"></script>
   - Theme: light by default; the choice is stored in localStorage ("notes.theme") and shared with the portal.
   - Header: logo (back to the portal), search (this course's chapters, or all courses), YouTube, theme toggle. */
(function () {
  'use strict';
  var KEY = 'notes.theme';
  var YT = 'https://www.youtube.com/@coderhop/videos';
  var root = document.documentElement;

  // ---------- theme (runs immediately) ----------
  function stored() { try { var t = localStorage.getItem(KEY); return t === 'dark' || t === 'light' ? t : null; } catch (e) { return null; } }
  function apply(t) { root.setAttribute('data-theme', t); }
  apply(stored() || 'light');
  window.addEventListener('storage', function (e) { if (e.key === KEY && (e.newValue === 'dark' || e.newValue === 'light')) { apply(e.newValue); paint(); } });

  // where the portal is: the folder above shared/
  var me = document.currentScript && document.currentScript.getAttribute('src');   // as written, e.g. ../../shared/site.js
  var portal = me ? me.replace(/shared\/site\.js(\?.*)?$/, 'index.html') : '/index.html';

  var themeBtn = null;
  function paint() {
    if (!themeBtn) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeBtn.title = themeBtn.getAttribute('aria-label');
    themeBtn.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  }

  var LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="chlg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f46e5"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#chlg)"/><path d="M15 13h13a6 6 0 0 1 6 6v16H21a6 6 0 0 1-6-6z" fill="#fff" opacity=".95"/><path d="M20 20h9M20 25h9" stroke="#4f46e5" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var YT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#ff0033" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/><path fill="#fff" d="m9.6 15.6 6.3-3.6-6.3-3.6z"/></svg>';

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  // pages of this course, from the book's own table of contents (book.js sets window.BOOK_PARTS)
  function pages() {
    var out = [];
    (window.BOOK_PARTS || []).forEach(function (p) {
      p.chapters.forEach(function (c) {
        var label = c[2] || String(parseInt(c[0], 10));
        out.push({ href: c[0], title: c[1], label: /^\d+$/.test(label) ? 'Ch. ' + label : label, part: p.part });
      });
    });
    if (!out.length) {   // books without BOOK_PARTS: use the sidebar's chapter links
      var seen = {};
      [].forEach.call(document.querySelectorAll('#sidebar a[href$=".html"]'), function (a) {
        var href = a.getAttribute('href');
        if (/^(\.\.\/|https?:)/.test(href) || seen[href]) return;
        seen[href] = true;
        var n = a.querySelector('.num, .n');
        var label = n ? n.textContent.trim() : '';
        var title = (a.textContent || '').replace(label, '').trim();
        out.push({ href: href, title: title, label: /^\d+$/.test(label) ? 'Ch. ' + label : label || 'Page', part: '' });
      });
    }
    return out;
  }

  function build() {
    if (document.querySelector('.ch-header')) return;
    var header = el('header', 'ch-header');
    var wrap = el('div', 'ch-wrap');

    var logo = el('a', 'ch-logo');
    logo.href = portal;
    logo.setAttribute('aria-label', 'coderhop learn: all courses');
    logo.innerHTML = LOGO + '<span>coderhop <small>learn</small></span>';
    wrap.appendChild(logo);

    var search = el('div', 'ch-search');
    search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
    var input = el('input');
    input.type = 'search';
    var inCourse = !!(window.BOOK_PARTS || document.getElementById('sidebar'));
    input.placeholder = (inCourse ? 'Search this course…' : 'Search courses…') + '  ( / )';
    input.setAttribute('aria-label', inCourse ? 'Search this course' : 'Search courses');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'ch-results');
    var list = el('ul', 'ch-results');
    list.id = 'ch-results';
    list.setAttribute('role', 'listbox');
    search.appendChild(input);
    search.appendChild(list);
    wrap.appendChild(search);

    var active = -1;
    function render() {
      var q = input.value.trim().toLowerCase();
      list.innerHTML = '';
      active = -1;
      if (!q) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      var words = q.split(/\s+/);
      var hits = pages().filter(function (p) {
        var hay = (p.title + ' ' + p.label + ' ' + p.part).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) >= 0; });
      }).slice(0, 8);
      hits.forEach(function (p) {
        var li = el('li'); li.setAttribute('role', 'option');
        var a = el('a'); a.href = p.href;
        a.appendChild(el('span', 'ch-lbl', p.label));
        a.appendChild(el('span', 'ch-ttl', p.title));
        li.appendChild(a); list.appendChild(li);
      });
      var li = el('li', 'ch-all'); li.setAttribute('role', 'option');
      var a = el('a'); a.href = portal + '?q=' + encodeURIComponent(input.value.trim()) + '#catalog';
      a.textContent = 'Search all courses for “' + input.value.trim() + '” →';
      li.appendChild(a); list.appendChild(li);
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
    function move(d) {
      var items = list.querySelectorAll('a');
      if (!items.length) return;
      active = (active + d + items.length) % items.length;
      [].forEach.call(items, function (x, i) { x.classList.toggle('ch-active', i === active); });
      items[active].scrollIntoView({ block: 'nearest' });
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') {
        var items = list.querySelectorAll('a');
        var target = items[active >= 0 ? active : 0];
        if (target) { e.preventDefault(); location.href = target.href; }
      } else if (e.key === 'Escape') { input.value = ''; render(); input.blur(); }
    });
    document.addEventListener('click', function (e) { if (!search.contains(e.target)) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); } });
    input.addEventListener('focus', function () { if (input.value.trim()) render(); });
    list.hidden = true;

    var yt = el('a', 'ch-yt');
    yt.href = YT; yt.target = '_blank'; yt.rel = 'noopener';
    yt.setAttribute('aria-label', 'coderhop on YouTube');
    yt.innerHTML = YT_ICON + '<span>YouTube</span>';
    wrap.appendChild(yt);

    themeBtn = el('button', 'ch-theme');
    themeBtn.type = 'button';
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* storage blocked: applies to this page only */ }
      paint();
    });
    wrap.appendChild(themeBtn);
    paint();

    header.appendChild(wrap);
    document.body.insertBefore(header, document.body.firstChild);
    root.classList.add('ch-has-header');

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && !e.target.isContentEditable) { e.preventDefault(); input.focus(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
