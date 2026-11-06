// Opens every page of the book in headless Chrome at desktop (1280px) and phone (390px) width and
// reports JavaScript errors, horizontal page scroll, missing sidebar/pager, unrendered code blocks
// and broken local links.
// Usage: node tools/check-pages.mjs [path-to-chrome]
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.argv[2] || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${PORT}`, "--allow-file-access-from-files",
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "pages-"))}`, "about:blank"], { stdio: "ignore" });

let ws, nextId = 1; const pending = new Map(); const errors = [];
const send = (method, params = {}) => { const id = nextId++; ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => pending.set(id, { res, rej })); };
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.value;

const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html")).sort();
let problems = 0;
try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(200); } }
  ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
  });
  await send("Page.enable"); await send("Runtime.enable");
  for (const [label, width, mobile] of [["desktop", 1280, false], ["390px", 390, true]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile });
    for (const page of pages) {
      errors.length = 0;
      await send("Page.navigate", { url: "file://" + join(ROOT, page) });
      for (let i = 0; i < 60 && (await evaluate("document.readyState").catch(() => "")) !== "complete"; i++) await sleep(50);
      await sleep(150);
      const info = await evaluate(`(() => {
        const doc = document.documentElement;
        const wide = [...document.querySelectorAll('main *')].filter((e) => e.getBoundingClientRect().right > doc.clientWidth + 1 && !e.closest('pre, .table-wrap, .codeblock, .q-code'));
        return {
          overflow: doc.scrollWidth - doc.clientWidth,
          wide: wide.slice(0, 3).map((e) => e.tagName + '.' + e.className + ':' + (e.textContent || '').slice(0, 40)),
          sidebar: !!document.querySelector('#sidebar .brand'),
          pager: document.querySelectorAll('#pager a').length,
          raw: document.querySelectorAll('script[type="text/plain"].code').length,
          links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !/^(https?:|mailto:|#)/.test(h)),
        };
      })()`);
      const bad = [];
      if (errors.length) bad.push(`JS errors: ${errors.join(" | ").slice(0, 200)}`);
      if (info.overflow > 0) bad.push(`horizontal scroll ${info.overflow}px ${JSON.stringify(info.wide)}`);
      if (!info.sidebar) bad.push("no sidebar");
      if (!info.pager && page !== "assessment.html") bad.push("no pager links");
      if (info.raw) bad.push(`${info.raw} unrendered code blocks`);
      if (label === "desktop") for (const href of info.links) {
        const file = join(ROOT, href.split("#")[0]);
        if (!existsSync(file)) bad.push(`broken link ${href}`);
      }
      if (bad.length) { problems += bad.length; console.log(`✘ ${label.padEnd(7)} ${page}: ${bad.join("; ")}`); }
    }
    console.log(`${label}: checked ${pages.length} pages`);
  }
} finally {
  chrome.kill();
}
console.log(problems ? `${problems} problem(s)` : "all pages OK: no JS errors, no horizontal scroll, sidebar/pager/code rendered, local links resolve");
process.exit(problems ? 1 : 0);
