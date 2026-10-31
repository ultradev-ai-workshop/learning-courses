// The HTTP application: routes, body parsing, validation, errors and request logging.
import http from "node:http";
import { randomUUID } from "node:crypto";
import { on } from "node:events";
import { Router } from "./router.js";
import { HttpError } from "./errors.js";

const MAX_TEXT = 500;

export function validateNote(body, { partial = false } = {}) {
  const errors = [];
  const out = {};
  if (!partial || "text" in body) {
    if (typeof body.text !== "string" || !body.text.trim()) errors.push("text must be a non-empty string");
    else if (body.text.length > MAX_TEXT) errors.push(`text must be at most ${MAX_TEXT} characters`);
    else out.text = body.text.trim();
  }
  if ("tags" in body) {
    if (!Array.isArray(body.tags) || !body.tags.every((t) => typeof t === "string" && /^[a-z0-9-]{1,20}$/.test(t))) {
      errors.push("tags must be an array of short lower-case words");
    } else out.tags = [...new Set(body.tags)];
  }
  if ("done" in body) {
    if (typeof body.done !== "boolean") errors.push("done must be true or false");
    else out.done = body.done;
  }
  if (partial && Object.keys(out).length === 0 && errors.length === 0) errors.push("nothing to update");
  if (errors.length) throw new HttpError(422, "invalid note", errors);
  return out;
}

async function readJson(req, limit) {
  if (!req.headers["content-type"]?.startsWith("application/json")) throw new HttpError(415, "expected application/json");
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new HttpError(413, "body too large");
    chunks.push(chunk);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("not an object");
    return value;
  } catch {
    throw new HttpError(400, "body must be a JSON object");
  }
}

function send(res, status, data, headers = {}) {
  if (status === 204) return res.writeHead(204, headers).end();
  res.writeHead(status, { "Content-Type": "application/json", ...headers }).end(JSON.stringify(data));
}

function parseId(params) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "id must be a positive integer");
  return id;
}

export function createApp({ store, logger, maxBodyBytes = 10_000, isReady = () => true }) {
  const router = new Router()
    .get("/health", ({ res }) => send(res, isReady() ? 200 : 503, { status: isReady() ? "ok" : "unavailable" }))
    .get("/notes", ({ res, query }) => send(res, 200, store.list({ tag: query.get("tag") ?? undefined, q: query.get("q") ?? undefined })))
    .post("/notes", async ({ req, res }) => {
      const note = await store.create(validateNote(await readJson(req, maxBodyBytes)));
      send(res, 201, note, { Location: `/notes/${note.id}` });
    })
    .get("/notes/:id", ({ res, params }) => {
      const note = store.get(parseId(params));
      if (!note) throw new HttpError(404, "note not found");
      send(res, 200, note);
    })
    .patch("/notes/:id", async ({ req, res, params }) => {
      const id = parseId(params);
      const changes = validateNote(await readJson(req, maxBodyBytes), { partial: true });
      const note = await store.update(id, changes);
      if (!note) throw new HttpError(404, "note not found");
      send(res, 200, note);
    })
    .delete("/notes/:id", async ({ res, params }) => {
      if (!(await store.remove(parseId(params)))) throw new HttpError(404, "note not found");
      send(res, 204);
    })
    .get("/events", async ({ req, res }) => {
      // Server-sent events: one message per store change, until the client disconnects.
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
      res.write(": connected\n\n");
      const ac = new AbortController();
      res.on("close", () => ac.abort());
      const forward = (type) => (async () => {
        for await (const [note] of on(store, type, { signal: ac.signal })) res.write(`event: ${type}\ndata: ${JSON.stringify(note)}\n\n`);
      })().catch((err) => { if (err.name !== "AbortError") throw err; });
      await Promise.all(["created", "updated", "deleted"].map(forward));
    });

  return http.createServer(async (req, res) => {
    const requestId = randomUUID().slice(0, 8);
    const log = logger.child({ requestId });
    const started = performance.now();
    res.on("finish", () => log.info("request", { method: req.method, url: req.url, status: res.statusCode, ms: Math.round(performance.now() - started) }));
    try {
      const url = new URL(req.url, "http://localhost");
      const found = router.match(req.method, url.pathname);
      if (!found.handler) throw new HttpError(found.status, found.status === 404 ? "not found" : "method not allowed");
      await found.handler({ req, res, params: found.params, query: url.searchParams });
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message, ...(err.details && { details: err.details }) });
      log.error("unexpected error", { err });
      if (!res.headersSent) send(res, 500, { error: "internal error" });
      else res.destroy();
    }
  });
}
