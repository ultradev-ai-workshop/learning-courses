// Builds 19-project.html from tools/19-project.template.html by inserting the files of the finished
// capstone (playground/reference/) as code blocks, so the chapter always shows the real reference code.
// Each marker <!--FILE path--> becomes a data-file block in the checker's "capstone" app.
//
// Usage: node tools/build-project-chapter.mjs && node tools/check-snippets.mjs 19-project.html
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOOLS = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TOOLS, "..");
const REF = join(ROOT, "playground", "reference");

const template = readFileSync(join(TOOLS, "19-project.template.html"), "utf8");
let count = 0;
const out = template.replace(/<!--FILE ([^\s>]+)-->/g, (_, path) => {
  count++;
  const code = readFileSync(join(REF, path), "utf8").replace(/\n$/, "").replace(/<\/script>/gi, "<\\/script>");
  return `<script type="text/plain" class="code" data-file="${path}" data-app="capstone">\n${code}\n</script>`;
});
writeFileSync(join(ROOT, "19-project.html"), out);
console.log(`wrote 19-project.html with ${count} files from playground/reference/`);
