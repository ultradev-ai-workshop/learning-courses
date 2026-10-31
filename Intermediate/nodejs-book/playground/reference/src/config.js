// Reads settings from environment variables, with defaults and validation (Chapter 2).
export function loadConfig(env = process.env) {
  const int = (name, def, min, max) => {
    const raw = env[name];
    if (raw === undefined || raw === "") return def;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be an integer from ${min} to ${max}, got "${raw}"`);
    return n;
  };
  return Object.freeze({
    port: int("PORT", 3000, 0, 65535),
    dataFile: env.DATA_FILE ?? "data/notes.json",
    logLevel: env.LOG_LEVEL ?? "info",
    maxBodyBytes: int("MAX_BODY_BYTES", 10_000, 100, 1_000_000),
  });
}
