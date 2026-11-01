// Generates questions.json for the Spring Boot Study Book.
//
// Three sources:
//   1. knowledge tables and hand-written questions (tools/qfacts.mjs), taken from the chapters;
//   2. computed questions: SpEL, cron, path patterns, Duration/DataSize, relaxed binding, profile
//      expressions, Bean Validation, rollback rules, Jackson naming, conversion, ordering, back-off and
//      Reactor pipelines — every answer AND every distractor is produced by running the real Spring/Java
//      API in tools/qharness (one JVM for all tasks);
//   3. selection: exactly 1000 questions, ~40% easy / 45% medium / 15% hard, 10–15% multi-answer,
//      every topic covered.
// Each computed question stores its harness task(s), so tools/verify-questions.mjs can re-run them.
//
// Usage:  node tools/gen-questions.mjs && node tools/verify-questions.mjs && node tools/make-questions-js.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runHarness } from "./qharness.mjs";
import { ANNOTATIONS, CHAPTERS, ENDPOINTS, EXCEPTIONS, HANDWRITTEN, HOWTOS, JAVA, MIGRATIONS, PROPAGATIONS, PROPERTIES, STARTERS, STATUSES, TABLES } from "./qfacts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = 1000;
const SHARE = { easy: 0.4, medium: 0.45, hard: 0.15 };
const MULTI_MAX = 0.14, MULTI_MIN = 0.10;

// ---------------------------------------------------------------- seeded random
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rand = mulberry32(20261101);
const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (arr, k) => shuffle(arr).slice(0, k);
const uniq = (arr) => [...new Set(arr)];
const code = (s) => `<code>${s.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code>`;   // questions are rendered as text; keep plain
const plain = (s) => s;

// ---------------------------------------------------------------- pool
const pool = [];
const seen = new Set();
function add(q) {
  const correct = uniq(q.correct.map(String));
  const key = q.topic + "|" + q.question + "|" + (q.code ?? "") + "|" + correct.slice().sort().join("¦");
  if (seen.has(key)) return;
  const wrong = uniq(q.wrong.map(String)).filter((w) => !correct.includes(w));
  const nOptions = Math.min(q.nOptions ?? 4, correct.length + wrong.length);
  if (nOptions < 4 || correct.length === 0) return;
  const chosenWrong = sample(wrong, nOptions - correct.length);
  if (chosenWrong.length + correct.length < 4) return;
  const options = shuffle([...correct, ...chosenWrong]);
  const answer = correct.map((c) => options.indexOf(c)).sort((a, b) => a - b);
  let question = q.question;
  if (answer.length > 1 && !/select all/.test(question)) question += " (select all that apply)";
  seen.add(key);
  pool.push({ topic: q.topic, difficulty: q.difficulty, question, ...(q.code ? { code: q.code } : {}), options, answer,
    explanation: q.explanation, template: q.template, ...(q.run ? { run: q.run } : {}) });
}

// ---------------------------------------------------------------- 1. tables
// Items whose descriptions overlap must never be each other's distractors.
const CONFLICTS = [
  ["@Component", "@Service", "@Repository", "@RestController", "@Bean"],
  ["@SpringBootApplication", "@ComponentScan", "@EnableAutoConfiguration", "@SpringBootConfiguration"],
  ["@ConfigurationProperties", "@ConfigurationPropertiesScan", "@EnableConfigurationProperties", "@Value"],
  ["@Cacheable", "@CachePut"], ["@Valid", "@Validated"], ["@MockitoBean", "@MockitoSpyBean"],
  ["@RequestMapping", "@RestController"], ["@ConditionalOnBean", "@ConditionalOnMissingBean", "@ConditionalOnSingleCandidate"],
  ["@ConditionalOnClass", "@ConditionalOnMissingClass"], ["@ConditionalOnProperty", "@ConditionalOnBooleanProperty"],
  ["@Retryable", "@EnableResilientMethods"], ["@ConcurrencyLimit", "@EnableResilientMethods"], ["@Endpoint", "@ReadOperation"],
  ["@HttpExchange", "@ImportHttpServices"], ["@PreAuthorize", "@EnableMethodSecurity", "@PostFilter"],
  ["@SpringBootTest", "@AutoConfigureMockMvc", "@WebMvcTest"], ["@Transactional", "@Lock"],
  ["/actuator/health", "/actuator/health/liveness", "/actuator/health/readiness"], ["/actuator/metrics", "/actuator/prometheus"],
  ["spring.http.clients.read-timeout", "spring.http.clients.connect-timeout"], ["map", "flatMap", "concatMap"],
  ["PasswordEncoder", "DelegatingPasswordEncoder"], ["JwtDecoder", "JwtAuthenticationConverter"], ["authentication", "UserDetailsService"],
  ["optional()", "single()"], ["update()", "update(keyHolder, \"id\")"], ["LibraryService", "CatalogService"],
  ["graceful shutdown", "preStop hook"], ["AOT cache (-XX:AOTCache)", "GraalVM native image"],
  ["@Profile", "@ConditionalOnProperty"], ["@Fallback", "@Primary"], ["@Lazy", "@Scope(\"prototype\")"],
];
const conflict = (a, b) => CONFLICTS.some((g) => g.includes(a) && g.includes(b));

function twoWay(rows, topicOf, { fwd, rev, fwdDiff = "easy", revDiff = "medium", template }) {
  rows.forEach((row, i) => {
    const [left, right] = row;
    const topic = topicOf(row);
    const others = rows.filter((r, j) => j !== i && !conflict(left, r[0]));
    const sameTopic = others.filter((r) => topicOf(r) === topic);
    const wrongLeft = uniq([...shuffle(sameTopic), ...shuffle(others)].map((r) => r[0])).filter((x) => x !== left).slice(0, 6);
    const wrongRight = uniq([...shuffle(sameTopic), ...shuffle(others)].map((r) => r[1])).filter((x) => x !== right).slice(0, 6);
    add({ topic, difficulty: fwdDiff, question: fwd(right), correct: [left], wrong: wrongLeft, template: template + "-fwd",
      explanation: `${left}: ${right}.` });
    add({ topic, difficulty: revDiff, question: rev(left), correct: [right], wrong: wrongRight, template: template + "-rev",
      explanation: `${left}: ${right}.` });
  });
}

twoWay(ANNOTATIONS, (r) => r[2], { fwd: (d) => `Which annotation ${d}?`, rev: (a) => `What does ${a} do?`, fwdDiff: "easy", revDiff: "easy", template: "annotation" });
twoWay(STARTERS, (r) => r[2], { fwd: (d) => `Which dependency matches: ${d}?`, rev: (a) => `What does the dependency ${a} provide?`, fwdDiff: "medium", revDiff: "easy", template: "starter" });
twoWay(PROPERTIES, (r) => r[2], { fwd: (d) => `Which property matches: ${d}?`, rev: (p) => `What does the property ${p} do?`, fwdDiff: "medium", revDiff: "medium", template: "property" });
twoWay(EXCEPTIONS, (r) => r[2], { fwd: (d) => `Which exception do you typically get when ${d}?`, rev: (e) => `What typically causes ${e}?`, fwdDiff: "medium", revDiff: "medium", template: "exception" });
twoWay(ENDPOINTS, () => "ch18", { fwd: (d) => `Which Actuator endpoint shows ${d}?`, rev: (e) => `What does ${e} show?`, fwdDiff: "easy", revDiff: "medium", template: "endpoint" });
twoWay(PROPAGATIONS, () => "ch15", { fwd: (d) => `Which propagation ${d}?`, rev: (p) => `What does Propagation.${p} do?`, fwdDiff: "medium", revDiff: "medium", template: "propagation" });
twoWay(MIGRATIONS, () => "migration", { fwd: (d) => `In Spring Boot 4, ${d} replaces which Boot 3 item?`, rev: (o) => `What replaces ${o} in Spring Boot 4?`, fwdDiff: "medium", revDiff: "medium", template: "migration" });
twoWay(JAVA, () => "java", { fwd: (d) => `Which Java feature matches: ${d}?`, rev: (f) => `What does "${f}" mean in modern Java?`, fwdDiff: "easy", revDiff: "easy", template: "java" });
twoWay(HOWTOS.map(([p, s]) => [s, p]), () => "howto", { fwd: (p) => `How do you ${p}?`, rev: (s) => `Which problem does this solve: ${s}?`, fwdDiff: "medium", revDiff: "easy", template: "howto" });
for (const [topic, label, rows] of TABLES) {
  twoWay(rows, () => topic, { fwd: (d) => `Which ${label} matches: ${d}?`, rev: (x) => `${x} — which description fits?`, fwdDiff: "easy", revDiff: "medium", template: "table-" + topic });
}
STATUSES.forEach(([situation, status, topic]) => {
  const wrong = uniq(STATUSES.map((s) => s[1])).filter((s) => s !== status);
  add({ topic, difficulty: "easy", question: `Which HTTP status fits: ${situation}?`, correct: [status], wrong, template: "status",
    explanation: `${status} — ${situation}.` });
});

// ---------------------------------------------------------------- 2. hand-written
for (const [topic, difficulty, question, options, answer, explanation, codeText] of HANDWRITTEN) {
  add({ topic, difficulty, question, correct: answer.map((i) => options[i]), wrong: options.filter((_, i) => !answer.includes(i)),
    nOptions: options.length, explanation, template: "handwritten", ...(codeText ? { code: codeText } : {}) });
}

// ---------------------------------------------------------------- 2b. category questions (select all that apply)
const CATEGORIES = [
  ["ch07", "hard", "Which of these features are applied through a proxy, so a call from inside the same bean bypasses them?",
    ["@Transactional", "@Cacheable", "@Async", "@PreAuthorize", "@Retryable", "@Validated method validation", "@ConcurrencyLimit"],
    ["@Bean", "@Value", "@Entity", "@Profile", "@ConfigurationProperties", "@PostConstruct", "@Id"],
    "Proxy-based features only see calls that go through the proxy; @Bean, @Value and @Profile are processed when the container builds beans."],
  ["ch02", "easy", "Which of these annotations mark classes that component scanning registers as beans?",
    ["@Component", "@Service", "@Repository", "@Controller", "@RestController", "@Configuration"],
    ["@Bean", "@Autowired", "@Value", "@Entity", "@Transactional", "@Qualifier"],
    "The stereotypes are all meta-annotated with @Component; @Bean marks factory methods, not classes."],
  ["ch16", "medium", "Which of these are Spring Boot test slices (they start only part of the application)?",
    ["@WebMvcTest", "@DataJpaTest", "@RestClientTest", "@JsonTest", "@WebFluxTest", "@JdbcTest"],
    ["@SpringBootTest", "@MockitoBean", "@TestConfiguration", "@ActiveProfiles", "@Transactional", "@AutoConfigureMockMvc"],
    "Slices configure one layer; @SpringBootTest starts everything."],
  ["ch11", "easy", "Which HTTP methods are idempotent, so a timed-out call can be retried safely?",
    ["GET", "PUT", "DELETE", "HEAD", "OPTIONS"], ["POST", "PATCH"],
    "Repeating an idempotent request leaves the server in the same state; POST and PATCH may not."],
  ["ch15", "medium", "Which of these exceptions roll back a plain @Transactional method by default (they are unchecked)?",
    ["DataAccessException", "DuplicateKeyException", "ConstraintViolationException", "ResourceAccessException", "IllegalStateException", "HttpClientErrorException"],
    ["IOException", "TimeoutException", "Exception", "SQLException", "InterruptedException", "CloneNotSupportedException"],
    "RuntimeExceptions and Errors roll back; checked exceptions commit unless rollbackFor says otherwise."],
  ["migration", "medium", "Which of these Boot 4 starters have a different name than in Boot 3?",
    ["spring-boot-starter-webmvc", "spring-boot-starter-aspectj", "spring-boot-starter-security-oauth2-resource-server", "spring-boot-starter-security-oauth2-client"],
    ["spring-boot-starter-data-jpa", "spring-boot-starter-actuator", "spring-boot-starter-validation", "spring-boot-starter-cache", "spring-boot-starter-security"],
    "web → webmvc, aop → aspectj, oauth2-* → security-oauth2-*."],
  ["ch18", "medium", "Which of these Actuator endpoints can reveal sensitive information and should not be public?",
    ["/actuator/env", "/actuator/heapdump", "/actuator/threaddump", "/actuator/configprops"],
    ["/actuator/health", "/actuator/health/liveness", "/actuator/health/readiness"],
    "Expose only what you need (often health, info, prometheus) and protect the rest."],
  ["ch12", "medium", "Which of these block the calling thread?",
    ["JdbcTemplate.query(…)", "Thread.sleep(100)", "mono.block()", "RestClient … .body(String.class)"],
    ["webClient.get() … .bodyToMono(String.class)", "Mono.delay(Duration.ofMillis(100))", "flux.map(…)", "Mono.just(1)"],
    "Building and returning a reactive pipeline doesn't block; JDBC, sleep, block() and RestClient do."],
];
for (const [topic, difficulty, question, yesAll, noAll, explanation] of CATEGORIES) {
  for (let rep = 0; rep < 14; rep++) {
    const k = Math.min(yesAll.length, ri(2, 3));
    const yes = sample(yesAll, k), no = sample(noAll, Math.min(noAll.length, 5 - k));
    add({ topic, difficulty, question, correct: yes, wrong: no, nOptions: yes.length + no.length, template: "category", explanation });
  }
}

// ---------------------------------------------------------------- 3. computed (harness)
const tasks = [];
const T = (task) => { tasks.push(task); return tasks.length - 1; };
const computed = [];   // { build(results) → question spec }

// --- SpEL (ch06)
const SPEL_TEMPLATES = [
  (r) => [`items.?[#this > ${r.k}].size()`, [`items.?[#this >= ${r.k}].size()`, `items.size()`, `items.?[#this < ${r.k}].size()`, `items.?[#this > ${r.k + 1}].size()`]],
  (r) => [`items.![#this * ${r.m}]`, [`items.![#this + ${r.m}]`, `items.?[#this > ${r.m}]`, `items.![#this * ${r.m + 1}]`, `items.![#this]`]],
  (r) => [`items.?[#this % 2 == 0].![#this * ${r.m}]`, [`items.?[#this % 2 == 1].![#this * ${r.m}]`, `items.![#this * ${r.m}]`, `items.?[#this % 2 == 0]`, `items.?[#this % 3 == 0].![#this * ${r.m}]`]],
  (r) => [`items.^[#this > ${r.k}]`, [`items.$[#this > ${r.k}]`, `items.^[#this >= ${r.k}]`, `items.^[#this < ${r.k}]`, `items[0]`]],
  (r) => [`items.$[#this < ${r.k}]`, [`items.^[#this < ${r.k}]`, `items.$[#this <= ${r.k}]`, `items.$[#this > ${r.k}]`, `items[items.size() - 1]`]],
  (r) => [`name?.toUpperCase() ?: 'none'`, [`nickname?.toUpperCase() ?: 'none'`, `name ?: 'none'`, `name.toLowerCase()`, `'none'`]],
  (r) => [`items.size() > ${r.k} ? 'many' : 'few'`, [`items.size() >= ${r.k} ? 'many' : 'few'`, `items.size() < ${r.k} ? 'many' : 'few'`, `'many'`, `'few'`]],
  (r) => [`items[${r.i}] + items[${r.i + 1}]`, [`items[${r.i}] * items[${r.i + 1}]`, `items[${r.i - 1 < 0 ? 0 : r.i - 1}] + items[${r.i}]`, `items[${r.i + 1}] - items[${r.i}]`, `items.size() + ${r.i}`]],
  (r) => [`T(java.lang.Math).max(items[0], items[${r.i + 1}])`, [`T(java.lang.Math).min(items[0], items[${r.i + 1}])`, `items[0] - items[${r.i + 1}]`, `items[${r.i + 1}]`, `items[0]`]],
  (r) => [`{${r.a}, ${r.b}, ${r.c}}.![#this * #this]`, [`{${r.a}, ${r.b}, ${r.c}}.![#this + #this]`, `{${r.a}, ${r.b}, ${r.c}}.?[#this > ${r.b}]`, `{${r.c}, ${r.b}, ${r.a}}.![#this * #this]`, `{${r.a}, ${r.b}}.![#this * #this]`]],
];
for (let n = 0; n < 220; n++) {
  const items = Array.from({ length: ri(4, 7) }, () => ri(1, 20));
  const r = { k: ri(3, 15), m: ri(2, 5), i: ri(0, 2), a: ri(1, 6), b: ri(2, 9), c: ri(3, 12) };
  const tIdx = n % SPEL_TEMPLATES.length;
  const [expr, variants] = SPEL_TEMPLATES[tIdx](r);
  const root = { items, name: pick(["ada", "grace", null]), nickname: null };
  const main = T({ kind: "spel", expr, root });
  const vs = variants.map((v) => T({ kind: "spel", expr: v, root }));
  computed.push({ topic: "ch06", difficulty: tIdx >= 2 && tIdx <= 4 ? "hard" : tIdx === 6 || tIdx === 7 ? "easy" : "medium", template: "spel",
    build: (res) => ({ question: "What does this SpEL expression evaluate to (root object shown as JSON)?",
      code: `root = ${JSON.stringify(root)}\n${expr}`, correct: [res[main]], wrong: vs.map((i) => res[i]),
      explanation: `Evaluated with Spring's SpelExpressionParser: .?[] selects, .![] projects, ^[] / $[] pick the first / last match, ?. and ?: guard nulls.`,
      run: { tasks: [tasks[main]], expect: [res[main]] } }) });
}

// --- cron (ch08)
const CRONS = ["0 */15 * * * *", "0 0 3 * * MON-FRI", "0 30 9 1 * *", "0 0 12 * * SAT,SUN", "0 0 0 L * *", "@daily", "@hourly", "0 0 8 * * MON#1",
  "*/10 * * * * *", "0 45 18 * * *", "0 0 */6 * * *", "0 0 9-17 * * MON-FRI", "0 0 0 1 1 *", "0 15 10 ? * 6L", "0 0 22 * * FRI", "0 5 0 * 8 *"];
for (let n = 0; n < 110; n++) {
  const cron = CRONS[n % CRONS.length];
  const from = `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}T${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`;
  const main = T({ kind: "cron", expr: cron, from });
  const others = sample(CRONS.filter((c) => c !== cron), 5).map((c) => T({ kind: "cron", expr: c, from }));
  computed.push({ topic: "ch08", difficulty: /L|#|\?/.test(cron) ? "hard" : "medium", template: "cron",
    build: (res) => ({ question: `A @Scheduled(cron = "${cron}") job: when is its next run after ${from.replace("T", " ")}?`,
      correct: [res[main]], wrong: others.map((i) => res[i]),
      explanation: `Spring cron has six fields (second minute hour day-of-month month day-of-week); computed with CronExpression.parse("${cron}").next(…).`,
      run: { tasks: [tasks[main]], expect: [res[main]] } }) });
}

// --- path patterns (ch09)
const PATTERN_SETS = [
  ["/books/{id}", "/books/new", "/books/**", "/books/{id}/reviews"],
  ["/api/{version}/books", "/api/v1/books", "/api/**", "/api/v1/{resource}"],
  ["/files/{*path}", "/files/*.png", "/files/docs/**", "/files/{name}"],
  ["/users/{id}", "/users/me", "/users/*", "/**"],
  ["/shop/{category}/{item}", "/shop/books/{item}", "/shop/**", "/shop/books/new"],
];
const PATHS = ["/books/new", "/books/42", "/books/42/reviews", "/books/42/reviews/7", "/api/v1/books", "/api/v2/books", "/api/v1/authors",
  "/files/a.png", "/files/docs/x/y.txt", "/files/readme", "/users/me", "/users/7", "/users/7/loans", "/shop/books/new", "/shop/books/dune", "/shop/toys/kite"];
for (let n = 0; n < 90; n++) {
  const set = PATTERN_SETS[n % PATTERN_SETS.length];
  const path = pick(PATHS.filter((p) => p.split("/")[1] === set[0].split("/")[1]));
  const main = T({ kind: "pathWinner", patterns: set, path });
  computed.push({ topic: "ch09", difficulty: "hard", template: "path-winner",
    build: (res) => res[main] === "none" ? null : ({ question: `These handler mappings exist: ${set.join(", ")}. Which one handles GET ${path}?`,
      correct: [res[main]], wrong: set.filter((p) => p !== res[main]).concat(["none (404)"]),
      explanation: `The most specific matching pattern wins (fewer variables and wildcards; literals beat variables) — computed with PathPattern.SPECIFICITY_COMPARATOR.`,
      run: { tasks: [tasks[main]], expect: [res[main]] } }) });
}
const MATCH_PATTERNS = ["/books/{id}", "/books/**", "/files/*.png", "/files/{*path}", "/api/v{n}/**", "/img/**/*.jpg", "/users/{id:\\d+}", "/docs/*"];
const MATCH_PATHS = ["/books/42", "/books", "/books/42/reviews", "/files/a.png", "/files/a/b.png", "/files/x.txt", "/api/v1/books", "/api/books", "/img/a/b/c.jpg", "/img/c.jpg",
  "/users/42", "/users/me", "/docs/guide", "/docs/a/b"];
for (const pattern of MATCH_PATTERNS) {
  for (let rep = 0; rep < 6; rep++) {
    const root = pattern.split("/")[1];
    const paths = sample(uniq([...shuffle(MATCH_PATHS.filter((p) => p.split("/")[1] === root)).slice(0, 4), ...shuffle(MATCH_PATHS)]), 5);
    const idx = paths.map((p) => T({ kind: "pathMatch", pattern, path: p }));
    computed.push({ topic: "ch09", difficulty: "medium", template: "path-match",
      build: (res) => {
        const yes = paths.filter((_, i) => res[idx[i]] === "true"), no = paths.filter((_, i) => res[idx[i]] === "false");
        if (yes.length < 2 || no.length < 1) return null;
        return { question: `Which request paths match the pattern ${pattern}?`, correct: yes, wrong: no, nOptions: 5,
          explanation: `{x} matches one segment, * part of a segment, ** any number of segments, {*x} the rest of the path; computed with PathPatternParser.`,
          run: { tasks: idx.map((i) => tasks[i]), expect: idx.map((i) => res[i]) } };
      } });
  }
}
const VAR_CASES = [["/files/{*path}", "/files/2026/report.pdf", "path"], ["/books/{id}/reviews/{rid}", "/books/9/reviews/3", "rid"], ["/api/v{version}/books", "/api/v2/books", "version"],
  ["/files/{*path}", "/files/a", "path"], ["/shop/{category}/{item}", "/shop/toys/kite", "category"], ["/users/{id:\\d+}", "/users/77", "id"], ["/{lang}/docs/{page}", "/en/docs/intro", "page"]];
for (const [pattern, path, v] of VAR_CASES) {
  const main = T({ kind: "pathVar", pattern, path, var: v });
  computed.push({ topic: "ch09", difficulty: "medium", template: "path-var",
    build: (res) => ({ question: `A handler is mapped to ${pattern}. For the request ${path}, what is the value of @PathVariable ${v}?`,
      correct: [res[main]], wrong: uniq([path, path.split("/").pop(), "/" + path.split("/").slice(2).join("/"), path.split("/").slice(2).join("/"), path.split("/")[2], "null"]),
      explanation: `{*${v}} captures the rest of the path including the leading slash; {${v}} captures one segment.`,
      run: { tasks: [tasks[main]], expect: [res[main]] } }) });
}

// --- Duration / DataSize (ch04)
const DURATIONS = ["30s", "1500ms", "2m", "1h", "1d", "PT1M30S", "500", "90m", "PT2H", "10s", "250ms", "3d"];
for (const value of DURATIONS) {
  const main = T({ kind: "duration", value });
  computed.push({ topic: "ch04", difficulty: value === "500" || value.startsWith("PT") ? "medium" : "easy", template: "duration",
    build: (res) => {
      const ms = Number(res[main]);
      return { question: `A Duration property is set to "${value}". How many milliseconds is that?`, correct: [String(ms)],
        wrong: [ms * 1000, ms / 1000, ms * 60, ms / 60, ms + 1000].filter((x) => Number.isInteger(x) && x > 0).map(String),
        explanation: `Boot accepts simple units (ns us ms s m h d), ISO-8601 (PT…), and plain numbers in milliseconds by default.`,
        run: { tasks: [tasks[main]], expect: [res[main]] } };
    } });
}
for (const value of ["10MB", "512KB", "1GB", "2MB", "100B", "64KB", "5MB", "1024"]) {
  const main = T({ kind: "datasize", value });
  computed.push({ topic: "ch04", difficulty: "medium", template: "datasize",
    build: (res) => {
      const b = Number(res[main]);
      return { question: `A DataSize property is set to "${value}". How many bytes is that?`, correct: [String(b)],
        wrong: [b * 1000 / 1024, b / 1024, b * 1024, b * 0.9765625].filter((x) => Number.isInteger(x) && x > 0 && x !== b).map(String).concat([String(b + 1000)]),
        explanation: `DataSize units are powers of 1024 (KB = 1024 bytes, MB = 1024² bytes); a plain number means bytes.`,
        run: { tasks: [tasks[main]], expect: [res[main]] } };
    } });
}

// (No "which environment variables bind?" template: Boot's SystemEnvironmentPropertySource also accepts
//  dotted, dashed and lower-case variants, so most candidate spellings bind — a misleading question.)

// --- profiles (ch03)
const PROFILE_EXPRS = ["prod", "!prod", "prod & eu", "prod & !eu", "dev | test", "(prod | staging) & eu", "!dev & !test", "eu", "staging", "default"];
const ACTIVE_SETS = [["prod"], ["prod", "eu"], ["dev"], ["staging", "eu"], ["test"], ["prod", "us"], ["dev", "eu"]];
for (const active of ACTIVE_SETS) {
  for (let rep = 0; rep < 6; rep++) {
    const exprs = sample(PROFILE_EXPRS.filter((e) => e !== "default"), 5);
    const idx = exprs.map((e) => T({ kind: "profiles", expr: e, active }));
    computed.push({ topic: "ch03", difficulty: "medium", template: "profiles",
      build: (res) => {
        const yes = exprs.filter((_, i) => res[idx[i]] === "true"), no = exprs.filter((_, i) => res[idx[i]] === "false");
        if (yes.length < 2 || no.length < 1) return null;
        return { question: `The active profiles are ${active.join(", ")}. Which @Profile expressions match (so their beans are created)?`,
          correct: yes.map((e) => `@Profile("${e}")`), wrong: no.map((e) => `@Profile("${e}")`), nOptions: 5,
          explanation: `! is not, & is and, | is or; computed with Profiles.of(expression).matches(activeProfiles).`,
          run: { tasks: idx.map((i) => tasks[i]), expect: idx.map((i) => res[i]) } };
      } });
  }
}

// --- Bean Validation (ch06)
const VCASES = {
  NotBlank: ["@NotBlank String", [null, "", "   ", "a", " x ", "ok"]],
  NotEmpty: ["@NotEmpty String", [null, "", "   ", "a", "ok"]],
  Size2to5: ["@Size(min = 2, max = 5) String", [null, "", "a", "ab", "abcde", "abcdef", "   "]],
  Email: ["@Email String", [null, "", "ada@example.com", "ada", "ada@", "a@b"]],
  Pattern5digits: ["@Pattern(regexp = \"\\\\d{5}\") String", [null, "12345", "1234", "123456", "abcde", ""]],
  Min18: ["@Min(18) Integer", [null, 17, 18, 99, 0, -5]],
  Positive: ["@Positive Integer", [null, -1, 0, 1, 42]],
  PositiveOrZero: ["@PositiveOrZero Integer", [null, -1, 0, 1]],
};
for (const [constraint, [decl, values]] of Object.entries(VCASES)) {
  for (let rep = 0; rep < 6; rep++) {
    const vals = sample(values, Math.min(5, values.length));
    const idx = vals.map((v) => T({ kind: "validate", constraint, value: v }));
    const show = (v) => v === null ? "null" : typeof v === "string" ? JSON.stringify(v) : String(v);
    computed.push({ topic: "ch06", difficulty: "medium", template: "validation",
      build: (res) => {
        const yes = vals.filter((_, i) => res[idx[i]] === "true").map(show), no = vals.filter((_, i) => res[idx[i]] === "false").map(show);
        if (yes.length < 1 || no.length < 1 || yes.length + no.length < 4) return null;
        return { question: `A field is declared ${decl}. Which values are valid?`, correct: yes, wrong: no, nOptions: yes.length + no.length,
          explanation: `Most constraints accept null (add @NotNull for required values); @NotBlank rejects whitespace-only strings. Computed with Hibernate Validator.`,
          run: { tasks: idx.map((i) => tasks[i]), expect: idx.map((i) => res[i]) } };
      } });
  }
}

// --- rollback rules (ch15)
const EXCS = ["java.lang.IllegalStateException", "java.lang.IllegalArgumentException", "java.io.IOException", "java.io.FileNotFoundException",
  "java.lang.Exception", "java.lang.RuntimeException", "java.lang.NumberFormatException", "java.util.concurrent.TimeoutException"];
const RULES = [[[], []], [["java.io.IOException"], []], [[], ["java.lang.IllegalArgumentException"]], [["java.lang.Exception"], []],
  [["java.lang.Exception"], ["java.io.FileNotFoundException"]], [[], ["java.lang.RuntimeException"]], [["java.util.concurrent.TimeoutException"], ["java.lang.NumberFormatException"]]];
const ruleText = ([rb, nrb]) => {
  const short = (c) => c.split(".").pop() + ".class";
  const parts = [];
  if (rb.length) parts.push(`rollbackFor = ${short(rb[0])}`);
  if (nrb.length) parts.push(`noRollbackFor = ${short(nrb[0])}`);
  return `@Transactional${parts.length ? "(" + parts.join(", ") + ")" : ""}`;
};
for (const rules of RULES) {
  for (let rep = 0; rep < 6; rep++) {
    const exs = sample(EXCS, 5);
    const idx = exs.map((ex) => T({ kind: "rollback", ex, rollbackFor: rules[0], noRollbackFor: rules[1] }));
    computed.push({ topic: "ch15", difficulty: "hard", template: "rollback",
      build: (res) => {
        const yes = exs.filter((_, i) => res[idx[i]] === "true").map((e) => e.split(".").pop()), no = exs.filter((_, i) => res[idx[i]] === "false").map((e) => e.split(".").pop());
        if (yes.length < 1 || no.length < 1) return null;
        return { question: `A method is annotated ${ruleText(rules)}. Which exceptions thrown from it cause a rollback?`, correct: yes, wrong: no, nOptions: 5,
          explanation: `By default unchecked exceptions roll back and checked ones commit; the most specific matching rule (by inheritance depth) wins. Computed with RuleBasedTransactionAttribute.rollbackOn.`,
          run: { tasks: idx.map((i) => tasks[i]), expect: idx.map((i) => res[i]) } };
      } });
  }
}

// --- Jackson naming (ch09)
const NAMES = ["maxAttachmentSize", "customerName", "orderId", "isbn13Code", "dueOn", "createdAt", "HTTPStatus", "userID"];
for (const name of NAMES) {
  for (const strategy of ["SNAKE_CASE", "KEBAB_CASE"]) {
    const main = T({ kind: "naming", strategy, name });
    const others = ["SNAKE_CASE", "KEBAB_CASE", "UPPER_CAMEL_CASE", "LOWER_DOT_CASE"].filter((s) => s !== strategy).map((s) => T({ kind: "naming", strategy: s, name }));
    computed.push({ topic: "ch09", difficulty: /[A-Z]{2}/.test(name) ? "hard" : "easy", template: "naming",
      build: (res) => ({ question: `With spring.jackson.property-naming-strategy=${strategy}, how is the record component ${name} written in JSON?`,
        correct: [res[main]], wrong: others.map((i) => res[i]).concat([name, name.toLowerCase()]),
        explanation: `Computed with Jackson 3's PropertyNamingStrategies.${strategy}.`,
        run: { tasks: [tasks[main]], expect: [res[main]] } }) });
  }
}

// --- conversion (ch06)
const CONVERSIONS = [["42", "Integer"], [" 7 ", "Integer"], ["yes", "Boolean"], ["on", "Boolean"], ["1", "Boolean"], ["maybe", "Boolean"], ["2026-03-01", "LocalDate"], ["a, b ,c", "List"],
  ["1h", "Duration"], ["12.50", "Double"], ["0x1F", "Integer"], ["9999999999", "Integer"], ["abc", "Character"], ["x", "Character"]];
for (const [value, type] of CONVERSIONS) {
  const main = T({ kind: "convert", value, type });
  computed.push({ topic: "ch06", difficulty: "medium", template: "conversion",
    build: (res) => {
      const r = res[main].startsWith("ERROR") ? "fails with a ConversionFailedException" : res[main];
      return { question: `ApplicationConversionService converts the string "${value}" to ${type === "Duration" ? "Duration (shown in ms)" : type}. What is the result?`,
        correct: [r], wrong: uniq(["fails with a ConversionFailedException", "null", value, value.trim(), "true", "false", "[a, b, c]", "[a, b ,c]", "31", "3600000", "60"].filter((w) => w !== r)),
        explanation: `Spring's default converters trim numbers, accept true/false, yes/no, on/off and 1/0 for booleans, split comma-separated lists, and reject values that don't fit.`,
        run: { tasks: [tasks[main]], expect: [res[main]] } };
    } });
}

// --- ordering (ch02 / ch07)
for (let n = 0; n < 50; n++) {
  const names = sample(["audit", "security", "tx", "cache", "metrics", "retry", "logging"], 4);
  const orders = sample([-10, 0, 1, 5, 10, 100, 2147483647], 4);           // distinct: no ties to argue about
  const unordered = n % 3 === 0 ? ri(0, 3) : -1;                              // at most one bean without an order
  const beans = names.map((name, i) => (i === unordered ? { name } : { name, order: orders[i] }));
  const main = T({ kind: "order", beans });
  const desc = beans.map((b) => b.order === undefined ? `${b.name} (no order)` : `${b.name} @Order(${b.order === 2147483647 ? "Ordered.LOWEST_PRECEDENCE" : b.order})`).join(", ");
  computed.push({ topic: n % 2 ? "ch07" : "ch02", difficulty: "medium", template: "order",
    build: (res) => {
      const correct = res[main];
      const perms = uniq([names.join(","), names.slice().reverse().join(","), correct.split(",").reverse().join(","), shuffle(names).join(","), shuffle(names).join(","), shuffle(names).join(",")]);
      return { question: n % 2 ? `Four aspects apply to the same method: ${desc}. In what order are they entered (outermost first)?`
        : `A List<Handler> is injected; the beans are ${desc}. In what order does the list contain them?`,
        correct: [correct], wrong: perms,
        explanation: `Lower order values come first (higher precedence); beans without an order are last (lowest precedence). Computed with AnnotationAwareOrderComparator.`,
        run: { tasks: [tasks[main]], expect: [res[main]] } };
    } });
}

// --- back-off (ch11)
for (let n = 0; n < 40; n++) {
  const initial = pick([50, 100, 200, 500]), multiplier = pick([1.5, 2, 3]), max = pick([400, 1000, 2000]), cnt = 4;
  const main = T({ kind: "backoff", initial, multiplier, max, n: cnt });
  const variants = [T({ kind: "backoff", initial, multiplier: multiplier + 1, max, n: cnt }), T({ kind: "backoff", initial, multiplier, max: max * 10, n: cnt }),
    T({ kind: "backoff", initial: initial * 2, multiplier, max, n: cnt })];
  computed.push({ topic: "ch11", difficulty: "hard", template: "backoff",
    build: (res) => ({ question: `A retry uses an exponential back-off with initial delay ${initial} ms, multiplier ${multiplier} and max delay ${max} ms. What are the first ${cnt} delays (ms)?`,
      correct: [res[main]], wrong: variants.map((i) => res[i]).concat([Array.from({ length: cnt }, () => initial).join(",")]),
      explanation: `Each delay is the previous one times the multiplier, capped at the max delay — computed with Spring's ExponentialBackOff (the model behind @Retryable's delay/multiplier/maxDelay).`,
      run: { tasks: [tasks[main]], expect: [res[main]] } }) });
}

// --- Reactor pipelines (ch12)
const OPS = [["filterMod 2"], ["filterMod 3"], ["map* 2"], ["map* 3"], ["map+ 10"], ["take 3"], ["take 2"], ["skip 2"], ["takeLast 2"], ["distinctMod 3"], ["reduceSum"], ["count"]];
for (let n = 0; n < 110; n++) {
  const len = ri(2, 3);
  let ops = sample(OPS, len).flat();
  ops = ops.filter((o, i) => !/reduceSum|count/.test(o) || i === ops.length - 1);   // terminal-ish ops last
  const N = ri(5, 10);
  const main = T({ kind: "reactor", n: N, ops });
  const variants = [T({ kind: "reactor", n: N, ops: ops.slice().reverse() }), T({ kind: "reactor", n: N, ops: ops.slice(0, -1) }), T({ kind: "reactor", n: N + 1, ops }), T({ kind: "reactor", n: N - 1, ops })];
  computed.push({ topic: "ch12", difficulty: len === 3 ? "hard" : "medium", template: "reactor",
    build: (res) => ({ question: "What list does this pipeline emit (collectList)?",
      code: `Flux.range(1, ${N})\n${ops.map((o) => "  ." + reactorCall(o)).join("\n")}`, correct: [res[main]], wrong: variants.map((i) => res[i]),
      explanation: `Operators apply in order to each element; computed by running the pipeline with Project Reactor.`,
      run: { tasks: [tasks[main]], expect: [res[main]] } }) });
}
function reactorCall(op) {
  const [name, k] = op.split(" ");
  return { "filterMod": `filter(x -> x % ${k} == 0)`, "map*": `map(x -> x * ${k})`, "map+": `map(x -> x + ${k})`, take: `take(${k})`, skip: `skip(${k})`,
    takeLast: `takeLast(${k})`, distinctMod: `distinct(x -> x % ${k})`, reduceSum: "reduce(0, Integer::sum)", count: "count()" }[name];
}

// --- computed "which are valid?" questions
function validityQuestion(topic, difficulty, template, question, candidates, mkTask, isYes, explanation, reps = 10) {
  for (let rep = 0; rep < reps; rep++) {
    const vals = sample(candidates, 5);
    const idx = vals.map((v) => T(mkTask(v)));
    computed.push({ topic, difficulty, template,
      build: (res) => {
        const yes = vals.filter((_, i) => isYes(res[idx[i]])), no = vals.filter((_, i) => !isYes(res[idx[i]]));
        if (yes.length < 2 || no.length < 1) return null;
        return { question, correct: yes, wrong: no, nOptions: 5, explanation, run: { tasks: idx.map((i) => tasks[i]), expect: idx.map((i) => res[i]) } };
      } });
  }
}
validityQuestion("ch08", "hard", "cron-valid", "Which of these are valid Spring @Scheduled cron expressions?",
  ["0 0 3 * * *", "0 0 3 * *", "@daily", "0 0 25 * * *", "0 */15 * * * *", "0 0 12 * * SAT,SUN", "* * * * * * *", "0 0 0 L * *", "0 0 0 32 * *", "@weekly", "0 0 9-17 * * MON-FRI", "0 60 * * * *", "@every5m"],
  (expr) => ({ kind: "cronValid", expr }), (r) => r === "true",
  "Spring cron needs six fields (seconds first) or a macro like @daily; values must be in range. Computed with CronExpression.isValidExpression.", 14);
validityQuestion("ch06", "medium", "boolean-convert", "Which strings does Spring's conversion service convert to Boolean true?",
  ["true", "TRUE", "yes", "on", "1", "y", "no", "off", "0", "false", "maybe", "enabled"],
  (value) => ({ kind: "convert", value, type: "Boolean" }), (r) => r === "true",
  "true/yes/on/1 (and y) are true, false/no/off/0 (and n) false, anything else fails. Computed with ApplicationConversionService.", 12);
validityQuestion("ch04", "medium", "duration-valid", "Which of these are valid values for a java.time.Duration configuration property?",
  ["30s", "1h30m", "PT1H30M", "10ms", "1.5s", "2d", "90m", "5 s", "PT5S", "100", "1w", "3h"],
  (value) => ({ kind: "duration", value }), (r) => !r.startsWith("ERROR"),
  "Boot accepts a number with one simple unit (ns, us, ms, s, m, h, d), ISO-8601 (PT…), or a plain number (milliseconds). Computed with DurationStyle.", 12);

// ---------------------------------------------------------------- run the harness once for all tasks
console.log(`running ${tasks.length} harness tasks…`);
const results = runHarness(tasks);
let dropped = 0;
for (const c of computed) {
  const spec = c.build(results);
  if (!spec) { dropped++; continue; }
  if (spec.correct.some((x) => String(x).startsWith("ERROR") && !/ConversionFailed/.test(x))) { dropped++; continue; }
  spec.wrong = spec.wrong.filter((w) => w !== undefined && !String(w).startsWith("ERROR"));
  add({ topic: c.topic, difficulty: c.difficulty, template: c.template, ...spec });
}
console.log(`pool: ${pool.length} questions (${dropped} computed templates dropped as ambiguous)`);

// ---------------------------------------------------------------- 4. select exactly 1000
const topics = Object.keys(CHAPTERS);
const quota = { easy: Math.round(TARGET * SHARE.easy), medium: Math.round(TARGET * SHARE.medium) };
quota.hard = TARGET - quota.easy - quota.medium;
const isMulti = (q) => q.answer.length > 1;
const chosen = [];
const used = new Set();
const multiMax = Math.floor(TARGET * MULTI_MAX);
let multi = 0;
// round-robin per difficulty across topics, so every topic is represented
for (const diff of ["hard", "medium", "easy"]) {
  const byTopic = Object.fromEntries(topics.map((t) => [t, shuffle(pool.filter((q) => q.topic === t && q.difficulty === diff))]));
  let need = quota[diff];
  let progress = true;
  while (need > 0 && progress) {
    progress = false;
    for (const t of shuffle(topics)) {
      if (need === 0) break;
      const list = byTopic[t];
      while (list.length) {
        const q = list.shift();
        if (isMulti(q) && multi >= multiMax) continue;
        chosen.push(q); used.add(q); need--; progress = true;
        if (isMulti(q)) multi++;
        break;
      }
    }
  }
  if (need > 0) console.log(`  ⚠ only found ${quota[diff] - need}/${quota[diff]} ${diff} questions`);
}
// balance: every topic gets at least MIN_PER_TOPIC, swapping same-difficulty questions from the largest topics
const MIN_PER_TOPIC = 28;
for (const t of topics) {
  let guard = 0;
  while (chosen.filter((q) => q.topic === t).length < MIN_PER_TOPIC && guard++ < 50) {
    const spare = pool.filter((q) => q.topic === t && !used.has(q) && !(isMulti(q) && multi >= multiMax));
    if (!spare.length) { console.log(`  ⚠ topic ${t}: no spare questions`); break; }
    const incoming = spare[0];
    const counts = Object.fromEntries(topics.map((x) => [x, chosen.filter((q) => q.topic === x).length]));
    const donor = chosen.filter((q) => q.difficulty === incoming.difficulty && counts[q.topic] > MIN_PER_TOPIC + 5 && isMulti(q) === isMulti(incoming))
      .sort((x, y) => counts[y.topic] - counts[x.topic])[0];
    if (!donor) { used.add(incoming); continue; }
    chosen.splice(chosen.indexOf(donor), 1, incoming);
    used.add(incoming);
  }
}
const final = shuffle(chosen).sort((a, b) => topics.indexOf(a.topic) - topics.indexOf(b.topic))
  .map((q, i) => ({ id: i + 1, topic: q.topic, chapter: CHAPTERS[q.topic][0], chapterFile: CHAPTERS[q.topic][2], ...q, topic: q.topic }));
for (const q of final) delete q.difficultyHint;

const out = {
  version: 1,
  topic: "Spring Boot 4 & Spring Framework 7 (Intermediate → Advanced)",
  generated: new Date().toISOString().slice(0, 10),
  total: final.length,
  chapters: Object.fromEntries(Object.entries(CHAPTERS).map(([k, [number, title, file]]) => [k, { number, title, file }])),
  questions: final,
};
writeFileSync(join(ROOT, "questions.json"), JSON.stringify(out, null, 1));
const count = (f) => final.filter(f).length;
console.log(`wrote questions.json: ${final.length} questions; easy ${count((q) => q.difficulty === "easy")}, medium ${count((q) => q.difficulty === "medium")}, hard ${count((q) => q.difficulty === "hard")}; multi-answer ${count(isMulti)} (${Math.round(100 * count(isMulti) / final.length)}%)`);
console.log("per topic: " + topics.map((t) => `${t} ${count((q) => q.topic === t)}`).join(", "));
if (count(isMulti) < TARGET * MULTI_MIN) console.log("  ⚠ multi-answer share below 10%");
