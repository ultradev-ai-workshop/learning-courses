// Entry point: config → store → app → listen, with graceful shutdown (Chapters 11 and 15).
import { once } from "node:events";
import { loadConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { NotesStore } from "./store.js";
import { createApp } from "./app.js";

export async function startServer(env = process.env) {
  const config = loadConfig(env);
  const logger = createLogger({ level: config.logLevel, base: { service: "notes-api" } });
  const store = await new NotesStore(config.dataFile).load();
  let shuttingDown = false;
  const server = createApp({ store, logger, maxBodyBytes: config.maxBodyBytes, isReady: () => !shuttingDown });

  server.listen(config.port);
  await once(server, "listening");
  logger.info("listening", { port: server.address().port, dataFile: config.dataFile });

  async function stop(signal = "stop") {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info("shutting down", { signal });
    const closed = once(server, "close");
    server.close();
    server.closeIdleConnections();
    const force = setTimeout(() => server.closeAllConnections(), 5000).unref();
    await closed;
    clearTimeout(force);
    logger.info("stopped");
  }
  return { server, store, port: server.address().port, stop };
}

if (import.meta.main) {
  const app = await startServer();
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => app.stop(signal));
  process.on("unhandledRejection", (reason) => {
    console.error(JSON.stringify({ level: "fatal", msg: "unhandled rejection", reason: String(reason) }));
    process.exit(1);
  });
}
