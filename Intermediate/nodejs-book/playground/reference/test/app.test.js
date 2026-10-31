import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NotesStore } from "../src/store.js";
import { createApp, validateNote } from "../src/app.js";
import { createLogger } from "../src/logger.js";

describe("validateNote", () => {
  it("trims text and removes duplicate tags", () => {
    assert.deepEqual(validateNote({ text: "  hi ", tags: ["a", "a", "b"] }), { text: "hi", tags: ["a", "b"] });
  });
  it("collects every problem", () => {
    assert.throws(() => validateNote({ text: "", tags: "x", done: "yes" }), (err) => err.status === 422 && err.details.length === 3);
  });
  it("needs at least one field in a partial update", () => {
    assert.throws(() => validateNote({}, { partial: true }), { details: ["nothing to update"] });
  });
});

describe("notes API", () => {
  let dir, file, store, server, base;
  const json = (method, path, body) => fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) });

  before(async () => { dir = await mkdtemp(join(tmpdir(), "notes-test-")); });
  after(() => rm(dir, { recursive: true, force: true }));
  beforeEach(async () => {
    server?.close();
    file = join(dir, `notes-${Date.now()}-${Math.random()}.json`);
    store = await new NotesStore(file).load();
    server = createApp({ store, logger: createLogger({ level: "silent" }), maxBodyBytes: 200 }).listen(0);
    await once(server, "listening");
    base = `http://localhost:${server.address().port}`;
  });
  after(() => server.close());

  it("creates, reads, updates and deletes a note", async () => {
    const created = await json("POST", "/notes", { text: "buy milk", tags: ["home"] });
    assert.equal(created.status, 201);
    const note = await created.json();
    assert.equal(created.headers.get("location"), `/notes/${note.id}`);
    assert.partialDeepStrictEqual(note, { id: 1, text: "buy milk", tags: ["home"], done: false });

    const patched = await (await json("PATCH", "/notes/1", { done: true })).json();
    assert.equal(patched.done, true);
    assert.equal((await fetch(`${base}/notes/1`)).status, 200);
    assert.equal((await fetch(`${base}/notes/1`, { method: "DELETE" })).status, 204);
    assert.equal((await fetch(`${base}/notes/1`)).status, 404);
  });

  it("filters by tag and search text", async () => {
    await json("POST", "/notes", { text: "Buy milk", tags: ["home"] });
    await json("POST", "/notes", { text: "Write report", tags: ["work"] });
    await json("POST", "/notes", { text: "milk the cows", tags: ["farm"] });
    const byTag = await (await fetch(`${base}/notes?tag=work`)).json();
    const byText = await (await fetch(`${base}/notes?q=MILK`)).json();
    assert.deepEqual(byTag.map((n) => n.id), [2]);
    assert.deepEqual(byText.map((n) => n.id), [1, 3]);
  });

  it("answers bad requests with the right status codes", async () => {
    assert.equal((await json("POST", "/notes", { text: "" })).status, 422);
    assert.equal((await fetch(`${base}/notes`, { method: "POST", body: "{}" })).status, 415);
    assert.equal((await fetch(`${base}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" })).status, 400);
    assert.equal((await json("POST", "/notes", { text: "x".repeat(300) })).status, 413);
    assert.equal((await fetch(`${base}/notes/abc`)).status, 400);
    assert.equal((await fetch(`${base}/notes`, { method: "PUT" })).status, 405);
    assert.equal((await fetch(`${base}/nothing`)).status, 404);
  });

  it("persists notes to the JSON file", async () => {
    await json("POST", "/notes", { text: "remember me" });
    const reloaded = await new NotesStore(file).load();       // a fresh store reading the same file
    assert.equal(reloaded.list()[0].text, "remember me");
    assert.equal(JSON.parse(await readFile(file, "utf8")).nextId, 2);
  });

  it("streams changes as server-sent events", async () => {
    const ac = new AbortController();
    const res = await fetch(`${base}/events`, { signal: ac.signal });
    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    await reader.read();                                     // ": connected"
    await json("POST", "/notes", { text: "live!" });
    let text = "";
    while (!text.includes("live!")) text += (await reader.read()).value;
    ac.abort();
    assert.match(text, /event: created\ndata: \{"id":1,"text":"live!"/);
  });
});
