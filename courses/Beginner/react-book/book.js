// Shared script for the React Beginner Book:
// builds the sidebar, the prev/next pager, and turns raw code blocks into styled ones.

const PARTS = [
  { part: "Start here", chapters: [
    ["01-getting-started.html", "Getting Started"],
  ]},
  { part: "Describing the UI", chapters: [
    ["02-components-and-jsx.html", "Components & JSX"],
    ["03-props.html", "Props"],
    ["04-conditions-and-lists.html", "Conditions & Lists"],
    ["05-pure-components-ui-tree.html", "Pure Components & the UI Tree"],
  ]},
  { part: "Adding Interactivity", chapters: [
    ["06-events.html", "Responding to Events"],
    ["07-state.html", "State & Rendering"],
    ["08-objects-and-arrays-in-state.html", "Objects & Arrays in State"],
  ]},
  { part: "Managing State", chapters: [
    ["09-structuring-and-sharing-state.html", "Structuring & Sharing State"],
    ["10-preserving-state-and-reducers.html", "Preserving State & Reducers"],
    ["11-context.html", "Context"],
  ]},
  { part: "Escape Hatches", chapters: [
    ["12-refs.html", "Refs"],
    ["13-effects.html", "Effects"],
    ["14-custom-hooks.html", "Custom Hooks"],
  ]},
  { part: "Putting it together", chapters: [
    ["15-thinking-in-react.html", "Thinking in React (Project)"],
  ]},
  { part: "Appendix & Assessment", chapters: [
    ["appendix-js-refresher.html", "JavaScript Refresher", "A"],
    ["assessment.html", "Final Assessment", "✓"],
  ]},
];

const ALL = PARTS.flatMap((p) => p.chapters);
const here = decodeURIComponent(location.pathname.split("/").pop() || "index.html");

function buildSidebar() {
  const el = document.getElementById("sidebar");
  if (!el) return;
  // Back to the course launcher (notes/index.html); outside <details> so it shows on phones too
  let html = '<a class="all-courses" href="../../../index.html">← All courses</a>';
  html += '<details open><summary>Chapters</summary>';
  html += '<a class="book-title" href="index.html">⚛️ React Beginner Book</a>';
  for (const p of PARTS) {
    html += `<div class="part">${p.part}</div><ol>`;
    for (const [file, title, label] of p.chapters) {
      const n = label ?? ALL.findIndex((c) => c[0] === file) + 1;
      const cur = file === here ? " current" : "";
      html += `<li><a class="ch${cur}" href="${file}"><span class="n">${n}</span>${title}</a></li>`;
    }
    html += "</ol>";
  }
  html += "</details>";
  el.innerHTML = html;
  if (window.matchMedia("(max-width: 860px)").matches) el.querySelector("details").open = false;
}

function buildPager() {
  const el = document.getElementById("pager");
  if (!el) return;
  const i = ALL.findIndex((c) => c[0] === here);
  const prev = i > 0 ? ALL[i - 1] : i === 0 ? ["index.html", "Contents"] : null;
  const next = i >= 0 && i < ALL.length - 1 ? ALL[i + 1] : i === -1 ? ALL[0] : null;
  let html = "";
  if (prev) html += `<a class="prev" href="${prev[0]}"><small>← Previous</small>${prev[1]}</a>`;
  if (next) html += `<a class="next" href="${next[0]}"><small>Next →</small>${next[1]}</a>`;
  el.innerHTML = html;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function dedent(text) {
  const lines = text.replace(/^\n+|\s+$/g, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const min = Math.min(...indents);
  return lines.map((l) => l.slice(min)).join("\n");
}

function highlight(code) {
  // Only comments are highlighted: // line comments, {/* JSX comments */}, /* block comments */
  return escapeHtml(code)
    .replace(/(\{\/\*[\s\S]*?\*\/\})/g, '<span class="tok-c">$1</span>')
    .replace(/(^|[^:"'\w])(\/\/[^\n]*)/g, '$1<span class="tok-c">$2</span>')
    .replace(/(^|\s)(\/\*[\s\S]*?\*\/)/g, '$1<span class="tok-c">$2</span>');
}

function buildCodeBlocks() {
  document.querySelectorAll('script[type="text/plain"].code').forEach((s) => {
    // A literal </script> would end the block early, so pages write <\/script> instead
    const code = dedent(s.textContent.replace(/<\\\/script>/g, "</script>"));
    const fig = document.createElement("figure");
    fig.className = "code";
    const label = s.dataset.file || s.dataset.lang || "";
    fig.innerHTML =
      `<div class="code-head"><span>${escapeHtml(label)}</span><button type="button">Copy</button></div>` +
      `<pre><code>${highlight(code)}</code></pre>`;
    fig.querySelector("button").addEventListener("click", async (e) => {
      try {
        await navigator.clipboard.writeText(code);
        e.target.textContent = "Copied!";
      } catch {
        e.target.textContent = "Select & copy";
      }
      setTimeout(() => (e.target.textContent = "Copy"), 1500);
    });
    s.replaceWith(fig);
  });
}

buildSidebar();
buildPager();
buildCodeBlocks();
