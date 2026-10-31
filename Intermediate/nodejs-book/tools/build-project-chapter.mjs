// Build 16-project.html from tools/16-project.template.html, inlining the reference project's
// files from playground/reference/, so the book and the runnable project never drift apart.
// Usage: node tools/build-project-chapter.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = join(ROOT, "playground", "reference");
const template = readFileSync(join(ROOT, "tools", "16-project.template.html"), "utf8");
const html = template.replace(/\{\{file:([^}]+)\}\}/g, (_, rel) => {
  const code = readFileSync(join(REF, rel), "utf8").trimEnd().replaceAll("</" + "script>", "<\\/script>");
  return `<script type="text/plain" class="code" data-file="${rel}" data-save>\n${code}\n</script>`;
});
writeFileSync(join(ROOT, "16-project.html"), html);
console.log("wrote 16-project.html");
