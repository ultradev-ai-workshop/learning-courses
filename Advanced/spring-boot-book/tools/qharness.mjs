// Runs a batch of question tasks in the Java harness (tools/qharness) and returns the results.
// The harness is compiled on first use with Maven (offline if possible).
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "qharness");
const JAVA_HOME = process.env.JAVA_HOME_SPRING ?? join(homedir(), ".local/jdk25/Contents/Home");
const env = { ...process.env, JAVA_HOME, PATH: `${JAVA_HOME}/bin:${process.env.PATH}` };

function build() {
  if (existsSync(join(DIR, "target/classes/qharness/QHarness.class")) && existsSync(join(DIR, "cp.txt"))) return;
  const mvn = (args) => execFileSync("mvn", ["-q", "-B", ...args], { cwd: DIR, env, stdio: "inherit" });
  try { mvn(["-o", "package", "-DskipTests"]); mvn(["-o", "dependency:build-classpath", "-Dmdep.outputFile=cp.txt"]); }
  catch { mvn(["package", "-DskipTests"]); mvn(["dependency:build-classpath", "-Dmdep.outputFile=cp.txt"]); }
}

export function runHarness(tasks) {
  build();
  const tmp = mkdtempSync(join(tmpdir(), "qharness-"));
  try {
    const file = join(tmp, "tasks.json");
    writeFileSync(file, JSON.stringify(tasks));
    const cp = `${join(DIR, "target/classes")}:${readFileSync(join(DIR, "cp.txt"), "utf8").trim()}`;
    const out = execFileSync(join(JAVA_HOME, "bin/java"), ["-cp", cp, "qharness.QHarness", file], { env, maxBuffer: 256 * 1024 * 1024 }).toString();
    const last = out.trim().split("\n").pop();               // ignore any log lines before the JSON
    const results = JSON.parse(last);
    if (results.length !== tasks.length) throw new Error(`harness returned ${results.length} results for ${tasks.length} tasks`);
    return results;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
