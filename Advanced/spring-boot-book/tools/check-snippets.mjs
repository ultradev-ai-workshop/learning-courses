// Compiles and runs every Java example in the Spring Boot book, and compares outputs.
//
// Per page:
//   <meta name="spring-starters" content="webmvc validation data-jpa h2 ...">  → the Maven dependencies
//   (ids map to spring-boot-starter-<id>; "x-test" ids are test-scoped starters; "h2" and any
//   "group:artifact" are added as plain dependencies).
// Blocks:
//   data-file="Foo.java"            saved under src/main/java/<package path>/ (from its package line);
//                                   files ending in Test.java/Tests.java go to src/test/java
//   data-path="src/..."             explicit save path (properties, SQL, resources…)
//   data-run                        after compiling, run this class's main(); the next output block
//                                   (data-lang="text") must match. data-args="a b" passes arguments.
//   data-test                       run this test class with Maven; the next output block must match
//                                   the surefire summary ("Tests run: 3, Failures: 0, Errors: 0, Skipped: 0")
//   data-norun                      not saved, not run (fragments and alternatives)
//   shell blocks with data-run      each "$ cmd" runs in the project folder (java, mvn on PATH)
//   In expected output, "..." alone matches any lines and inside a line matches any text.
//
// Usage: node tools/check-snippets.mjs [page.html ...]       (env: JAVA_HOME, default ~/.local/jdk25)
import { spawnSync, spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { homedir, tmpdir, availableParallelism } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JAVA_HOME = process.env.JAVA_HOME_SPRING ?? join(homedir(), ".local/jdk25/Contents/Home");
const BOOT = "4.1.2";
const ENV = { ...process.env, JAVA_HOME, PATH: `${JAVA_HOME}/bin:${process.env.PATH}`, NO_COLOR: "1", TZ: "UTC", LC_ALL: "en_US.UTF-8" };
const BLOCK = /<script type="text\/plain" class="code"([^>]*)>([\s\S]*?)<\/script>/g;
const attr = (a, n) => (a.match(new RegExp(`${n}="([^"]*)"`)) || [])[1];
const has = (a, n) => new RegExp(`\\s${n}(\\s|=|$)`).test(a);

function dedent(src) {
  const lines = src.replace(/<\\\/script>/gi, "</" + "script>").replace(/\t/g, "    ").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const min = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(Number.isFinite(min) ? min : 0)).join("\n");
}
function sameLine(e, a) {
  const E = e.replace(/\s+/g, " ").trim(), A = a.replace(/\s+/g, " ").trim();
  if (E === A) return true;
  if (!E.includes("...")) return false;
  return new RegExp("^" + E.split("...").map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$").test(A);
}
function matches(expected, actual) {
  const go = (i, j) => {
    if (i === expected.length) return j === actual.length;
    if (expected[i].trim() === "...") { for (let k = j; k <= actual.length; k++) if (go(i + 1, k)) return true; return false; }
    return j < actual.length && sameLine(expected[i], actual[j]) && go(i + 1, j + 1);
  };
  return go(0, 0);
}
const lines = (s) => s.replace(/\r/g, "").replace(/\n+$/, "").split("\n");

// ---------------------------------------------------------------- pom generation
function pom(starters) {
  const deps = [`<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter</artifactId></dependency>`,
    `<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>`];
  for (const s of starters) {
    if (s === "h2") deps.push(`<dependency><groupId>com.h2database</groupId><artifactId>h2</artifactId><scope>runtime</scope></dependency>`);
    else if (s.includes(":")) { const [g, a, scope] = s.split(":"); deps.push(`<dependency><groupId>${g}</groupId><artifactId>${a}</artifactId>${scope ? `<scope>${scope}</scope>` : ""}</dependency>`); }
    else deps.push(`<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-${s}</artifactId>${s.endsWith("-test") ? "<scope>test</scope>" : ""}</dependency>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>${BOOT}</version><relativePath/></parent>
  <groupId>com.example</groupId><artifactId>book-page</artifactId><version>1.0.0</version>
  <properties><java.version>25</java.version></properties>
  <dependencies>${deps.join("\n    ")}</dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
    <plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-surefire-plugin</artifactId>
    <configuration><argLine>-XX:+EnableDynamicAgentLoading -Xshare:off</argLine><trimStackTrace>true</trimStackTrace></configuration></plugin></plugins></build>
</project>
`;
}
// Quiet defaults so example output is just what the examples print (documented in playground-howto).
const DEFAULT_PROPS = `spring.main.banner-mode=off
spring.main.log-startup-info=false
logging.level.root=WARN
logging.level.org.springframework.boot.autoconfigure=ERROR
spring.jpa.open-in-view=false
server.port=0
`;

const LOGBACK = `<configuration>
  <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
  <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>
  <logger name="io.netty.resolver.dns.DnsServerAddressStreamProviders" level="OFF"/>  <!-- macOS-only native DNS notice -->
  <logger name="org.flywaydb.core.internal.database.base.Database" level="ERROR"/>  <!-- "H2 newer than verified" notice -->
  <root level="WARN"><appender-ref ref="CONSOLE"/></root>
</configuration>
`;

function savePath(a, code) {
  const explicit = attr(a, "data-path");
  if (explicit) return explicit;
  const file = attr(a, "data-file") ?? "";
  if (!file.endsWith(".java")) return null;
  const pkg = (code.match(/^\s*package\s+([\w.]+)\s*;/m) || [])[1];
  const name = basename(file);
  const base = /Tests?\.java$/.test(name) || has(a, "data-test") ? "src/test/java" : "src/main/java";
  return join(base, ...(pkg ? pkg.split(".") : []), name);
}
const fqcn = (code, file) => {
  const pkg = (code.match(/^\s*package\s+([\w.]+)\s*;/m) || [])[1];
  return (pkg ? pkg + "." : "") + basename(file, ".java");
};

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", env: ENV, timeout: opts.timeout ?? 180000, maxBuffer: 64 * 1024 * 1024, ...opts });
  return { status: r.status, out: (r.stdout ?? "") + (opts.merge ? r.stderr ?? "" : ""), err: r.stderr ?? "", signal: r.signal };
}

// ---------------------------------------------------------------- one page
function checkPage(path) {
  const html = readFileSync(path, "utf8");
  const starters = ((html.match(/<meta name="spring-starters" content="([^"]*)"/) || [])[1] ?? "").split(/\s+/).filter(Boolean);
  const dir = mkdtempSync(join(tmpdir(), "springbook-"));
  writeFileSync(join(dir, "pom.xml"), pom(starters));
  mkdirSync(join(dir, "src/main/resources"), { recursive: true });
  writeFileSync(join(dir, "src/main/resources/application.properties"), DEFAULT_PROPS);
  mkdirSync(join(dir, "src/test/resources"), { recursive: true });
  // Boot's console format at WARN, also for plain contexts; <meta name="spring-logback" content="boot"> keeps Boot's own setup
  if (!/<meta name="spring-logback" content="boot">/.test(html)) writeFileSync(join(dir, "src/test/resources/logback-test.xml"), LOGBACK);

  const blocks = [];
  for (const m of html.matchAll(BLOCK)) {
    const a = m[1], code = dedent(m[2]);
    blocks.push({ a, code, start: m.index, end: m.index + m[0].length, raw: m[0], line: html.slice(0, m.index).split("\n").length, lang: attr(a, "data-lang") ?? ((attr(a, "data-file") ?? "").split(".").pop()), file: attr(a, "data-file") });
  }
  let saved = 0;
  for (const b of blocks) {
    if (has(b.a, "data-norun")) continue;
    const p = savePath(b.a, b.code);
    if (!p) continue;
    mkdirSync(dirname(join(dir, p)), { recursive: true });
    const prev = existsSync(join(dir, p)) && p.endsWith("application.properties") ? readFileSync(join(dir, p), "utf8") : "";
    writeFileSync(join(dir, p), (p.endsWith("src/main/resources/application.properties") ? DEFAULT_PROPS + prev.replace(DEFAULT_PROPS, "") : "") + b.code + "\n");
    saved++;
  }

  const result = { page: basename(path), ok: 0, fail: 0, skip: 0, messages: [] };
  const fixes = [];
  const fail = (b, msg) => { result.fail++; result.messages.push(`FAIL ${result.page}:${b.line} (${b.file ?? b.lang})\n${msg}\n`); };
  if (!saved && !blocks.some((b) => b.lang === "shell" && has(b.a, "data-run"))) { rmSync(dir, { recursive: true, force: true }); result.skip = blocks.length; return result; }

  // compile everything once (offline first, online if dependencies are missing)
  const mvnArgs = ["-B", "-q", "test-compile", "dependency:build-classpath", "-Dmdep.outputFile=cp.txt", "-Dmdep.includeScope=test"];
  let c = run("mvn", ["-o", ...mvnArgs], { cwd: dir, merge: true });
  if (c.status !== 0 && /offline|resolve|Could not find artifact|not been downloaded|No plugin found/i.test(c.out)) c = run("mvn", mvnArgs, { cwd: dir, merge: true });
  if (c.status !== 0) {
    result.fail++;
    result.messages.push(`FAIL ${result.page}: compilation failed\n${c.out.split("\n").filter((l) => /ERROR|error:/.test(l)).slice(0, 25).join("\n")}\n`);
    rmSync(dir, { recursive: true, force: true });
    return result;
  }
  const cp = `target/test-classes:target/classes:${readFileSync(join(dir, "cp.txt"), "utf8").trim()}`;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    // the expected output is the next text block; plain source files (no data-run/data-test) may sit in between
    let j = i + 1;
    if ((has(b.a, "data-run") || has(b.a, "data-test")) && b.lang === "java")
      while (j < blocks.length && blocks[j].lang === "java" && !has(blocks[j].a, "data-run") && !has(blocks[j].a, "data-test")) j++;
    const next = blocks[j];
    const between = blocks.slice(i + 1, j);
    const expected = next && (next.lang === "text") && !has(next.a, "data-nocompare") ? lines(next.code) : null;
    if (b.lang === "java" && has(b.a, "data-run") && !has(b.a, "data-norun")) {
      const args = (attr(b.a, "data-args") ?? "").split(" ").filter(Boolean);
      const r = run("java", ["-cp", cp, "-XX:TieredStopAtLevel=1", "-Xshare:auto", fqcn(b.code, b.file), ...args], { cwd: dir, merge: has(b.a, "data-stderr") });
      const out = lines(r.out.replace(/^.*(WARNING: A restricted method|WARNING: java\.lang\.System::load|WARNING: Use --enable-native-access|WARNING: Restricted methods).*\n/gm, ""));
      if (process.env.SHOW) result.messages.push(`OUT ${b.file}:\n${out.join("\n")}\n`);
      if (r.status !== 0 && !has(b.a, "data-exit")) fail(b, `exit ${r.status}${r.signal ? " " + r.signal : ""}\n${(r.err || r.out).split("\n").slice(-30).join("\n")}`);
      else if (expected && !matches(expected, out)) {
        fail(b, `output differs\n--- book\n${expected.join("\n")}\n--- real\n${out.join("\n")}`);
        if (process.env.FIX) fixes.push([next, out.join("\n")]);   // FIX=1: write the real output into the page (review the diff first!)
      }
      else result.ok++;
      if (expected) { between.forEach(() => result.ok++); i = j; }
      continue;
    }
    if (b.lang === "java" && has(b.a, "data-test") && !has(b.a, "data-norun")) {
      const r = run("mvn", ["-o", "-B", "test", `-Dtest=${fqcn(b.code, b.file)}`, "-Dsurefire.failIfNoSpecifiedTests=false"], { cwd: dir, merge: true, timeout: 300000 });
      const summary = (r.out.match(/Tests run: \d+, Failures: \d+, Errors: \d+, Skipped: \d+(?!,)/g) || []).at(-1) ?? "(no summary)";
      if (expected ? !matches(expected, [summary]) : r.status !== 0) fail(b, `test result\n--- book\n${expected?.join("\n") ?? "(passing)"}\n--- real\n${summary}\n${r.out.split("\n").filter((l) => /FAIL|ERROR|expected|Exception/.test(l)).slice(0, 15).join("\n")}`);
      else result.ok++;
      if (expected) { between.forEach(() => result.ok++); i = j; }
      continue;
    }
    if (b.lang === "shell" && has(b.a, "data-run")) {
      const steps = [];
      for (const l of b.code.split("\n")) { if (l.startsWith("$ ")) steps.push([l.slice(2), []]); else if (steps.length) steps.at(-1)[1].push(l); }
      let bad = null;
      for (const [cmd, exp] of steps) {
        const r = run("/bin/sh", ["-c", `{ ${cmd} ; } 2>&1`], { cwd: dir, timeout: 300000 });
        const got = lines(r.out);
        while (exp.length && !exp.at(-1).trim()) exp.pop();
        if (exp.length && !matches(exp, got)) { bad = `$ ${cmd}\n--- book\n${exp.join("\n")}\n--- real\n${got.slice(0, 40).join("\n")}`; break; }
      }
      if (bad) fail(b, bad); else result.ok++;
      continue;
    }
    if (savePath(b.a, b.code) && !has(b.a, "data-norun")) result.ok++;   // compiled successfully
    else result.skip++;
  }
  rmSync(dir, { recursive: true, force: true });
  if (fixes.length) {
    let out = html;
    for (const [blk, text] of fixes.sort((x, y) => y[0].start - x[0].start)) {
      const esc = text.replace(/<\/script>/gi, "<\\/script>");
      out = out.slice(0, blk.start) + blk.raw.replace(/>[\s\S]*<\/script>$/, ">\n" + esc + "\n</script>") + out.slice(blk.end);
    }
    writeFileSync(path, out);
    result.messages.push(`FIXED ${fixes.length} output block(s) in ${result.page}\n`);
  }
  return result;
}

// ---------------------------------------------------------------- main: pages in parallel worker processes
const args = process.argv.slice(2);
if (args[0] === "--worker") {
  process.stdout.write(JSON.stringify(checkPage(args[1])));
  process.exit(0);
}
const pages = args.length ? args.map((p) => (p.includes("/") ? p : join(ROOT, p)))
  : readdirSync(ROOT).filter((f) => /^(\d\d-|appendix-|howto-|playground-howto).*\.html$/.test(f)).sort().map((f) => join(ROOT, f));
const results = [];
let next = 0;
const parallel = Math.max(1, Math.min(4, Math.floor(availableParallelism() / 3)));
await Promise.all(Array.from({ length: parallel }, async () => {
  while (next < pages.length) {
    const p = pages[next++];
    const out = await new Promise((resolve) => {
      const child = spawn(process.execPath, [fileURLToPath(import.meta.url), "--worker", p], { env: ENV });
      let s = ""; child.stdout.on("data", (d) => (s += d)); child.on("close", () => resolve(s));
    });
    try { results.push(JSON.parse(out)); } catch { results.push({ page: basename(p), ok: 0, fail: 1, skip: 0, messages: [`FAIL ${basename(p)}: checker crashed\n${out.slice(-2000)}`] }); }
  }
}));
results.sort((a, b) => a.page.localeCompare(b.page));
const total = { ok: 0, fail: 0, skip: 0 };
for (const r of results) {
  for (const m of r.messages) console.log(m);
  for (const k in total) total[k] += r[k];
  console.log(`${r.page.padEnd(28)} ok=${String(r.ok).padStart(3)} fail=${String(r.fail).padStart(2)} skipped=${String(r.skip).padStart(2)}`);
}
console.log(`TOTAL ok=${total.ok} fail=${total.fail} skipped=${total.skip}  (Spring Boot ${BOOT}, Java ${JAVA_HOME.includes("25") ? "25" : "?"})`);
process.exit(total.fail ? 1 : 0);
