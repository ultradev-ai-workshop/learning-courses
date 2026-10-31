// Structured JSON logging to stdout, with levels, child loggers and redaction (Chapter 15).
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 };
const SECRET = new Set(["password", "token", "authorization"]);

export function createLogger({ level = "info", base = {}, out = process.stdout, now = () => new Date().toISOString() } = {}) {
  const min = LEVELS[level] ?? LEVELS.info;
  const write = (lvl, msg, fields = {}) => {
    if (LEVELS[lvl] < min) return;
    const entry = { level: lvl, time: now(), msg, ...base };
    for (const [k, v] of Object.entries(fields)) {
      entry[k] = SECRET.has(k.toLowerCase()) ? "[redacted]" : v instanceof Error ? { name: v.name, message: v.message } : v;
    }
    out.write(JSON.stringify(entry) + "\n");
  };
  return {
    debug: (m, f) => write("debug", m, f),
    info: (m, f) => write("info", m, f),
    warn: (m, f) => write("warn", m, f),
    error: (m, f) => write("error", m, f),
    child: (more) => createLogger({ level, base: { ...base, ...more }, out, now }),
  };
}
