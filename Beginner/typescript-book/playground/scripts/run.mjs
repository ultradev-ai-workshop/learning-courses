// Compile the playground with tsc, then run one exercise's output.
// Usage: npm run ex -- exercises/ch01/hello.ts
import { spawnSync } from "node:child_process";

const file = process.argv[2];
if (!file || !file.endsWith(".ts")) {
  console.error("usage: npm run ex -- exercises/chNN/file.ts");
  process.exit(2);
}
const tsc = spawnSync("npx", ["tsc"], { stdio: "inherit", shell: process.platform === "win32" });
if (tsc.status !== 0) console.error("\n(type errors above; running the emitted JavaScript anyway)\n");
const out = "dist/" + file.replace(/\\/g, "/").replace(/\.ts$/, ".js");
const run = spawnSync(process.execPath, ["--enable-source-maps", out], { stdio: "inherit" });
process.exit(run.status ?? 1);
