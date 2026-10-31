// Smoke test: start the real server, drive it with the real CLI, then shut down gracefully.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { rm } from "node:fs/promises";
import { startServer } from "../src/server.js";

const run = promisify(execFile);
await rm("data/smoke.json", { force: true });
const app = await startServer({ PORT: "0", DATA_FILE: "data/smoke.json", LOG_LEVEL: "silent" });
const env = { ...process.env, NOTES_URL: `http://localhost:${app.port}`, NO_COLOR: "1" };

async function notes(...args) {
  try {
    const { stdout } = await run(process.execPath, ["src/cli.js", ...args], { env });
    console.log(`▶ notes ${args.join(" ")}\n${stdout.trimEnd()}`);
  } catch (err) {
    console.log(`▶ notes ${args.join(" ")}\n${err.stderr.trimEnd()}  (exit ${err.code})`);
  }
}

await notes("add", "Buy oat milk", "-t", "home");
await notes("add", "Write chapter 16", "-t", "work", "-t", "book");
await notes("done", "1");
await notes("list");
await notes("list", "-t", "work");
await notes("rm", "9");
await notes("add", "");
await app.stop();
console.log("server stopped; notes saved:", app.store.list().length);
