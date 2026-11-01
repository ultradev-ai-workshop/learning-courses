// Build 20-project.html from tools/20-project.template.html, inlining the reference project's
// files from playground/reference/, so the book and the runnable project never drift apart.
// {{file:path}} becomes a code block saved at that path when the page is checked:
//   *Test.java → data-test, LibraryDemo.java → data-run, pom.xml → shown only (data-norun).
// Usage: node tools/build-project-chapter.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = join(ROOT, "playground", "reference");
const template = readFileSync(join(ROOT, "tools", "20-project.template.html"), "utf8");
const html = template.replace(/\{\{file:([^}]+)\}\}/g, (_, rel) => {
  const code = readFileSync(join(REF, rel), "utf8").trimEnd().replaceAll("</" + "script>", "<\\/script>");
  const name = basename(rel);
  const mode = rel === "pom.xml" ? " data-norun"
    : /Tests?\.java$/.test(name) ? " data-test"
    : name === "LibraryDemo.java" ? " data-run"
    : "";
  const lang = name.endsWith(".sql") ? ' data-lang="sql"' : "";
  const path = rel === "pom.xml" ? "" : ` data-path="${rel}"`;
  return `<script type="text/plain" class="code" data-file="${name}"${path}${lang}${mode}>\n${code}\n</script>`;
});
writeFileSync(join(ROOT, "20-project.html"), html);
console.log("wrote 20-project.html");
