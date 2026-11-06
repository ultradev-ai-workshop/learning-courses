// Build 19-project.html from tools/19-project.template.html by inlining real project files, so the
// chapter, the playground's capstone-start/ and reference/ folders never drift apart.
//
//   {{file:SOURCE:SHOWN}}  → a data-save code block with the contents of SOURCE (relative to the book
//                            folder), saved as SHOWN in the checker's work folder.
//
// Usage: node tools/build-project-chapter.mjs   (then run tools/check-snippets.mjs 19-project.html)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const template = readFileSync(join(ROOT, "tools", "19-project.template.html"), "utf8");
let count = 0;
const html = template.replace(/\{\{file:([^:}]+):([^}]+)\}\}/g, (_, src, shown) => {
  count++;
  const code = readFileSync(join(ROOT, src), "utf8").trimEnd().replaceAll("</" + "script>", "<\\/script>");
  return `<script type="text/plain" class="code" data-file="${esc(shown)}" data-save>\n${code}\n</script>`;
});
writeFileSync(join(ROOT, "19-project.html"), html);
console.log(`wrote 19-project.html (${count} files inlined)`);
