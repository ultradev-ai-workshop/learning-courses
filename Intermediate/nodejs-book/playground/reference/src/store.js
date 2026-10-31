// Notes kept in memory and persisted to a JSON file with atomic writes (Chapters 8 and 9).
// Emits "created", "updated" and "deleted" events with the affected note.
import { EventEmitter } from "node:events";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

export class NotesStore extends EventEmitter {
  #file;
  #notes = new Map();
  #nextId = 1;
  #saving = Promise.resolve();          // writes are chained so they never overlap

  constructor(file) {
    super();
    this.#file = file;
  }

  async load() {
    try {
      const { nextId, notes } = JSON.parse(await readFile(this.#file, "utf8"));
      this.#notes = new Map(notes.map((n) => [n.id, n]));
      this.#nextId = nextId;
    } catch (err) {
      if (err.code !== "ENOENT") throw err;   // a missing file just means "no notes yet"
    }
    return this;
  }

  list({ tag, q } = {}) {
    let notes = [...this.#notes.values()];
    if (tag) notes = notes.filter((n) => n.tags.includes(tag));
    if (q) notes = notes.filter((n) => n.text.toLowerCase().includes(q.toLowerCase()));
    return notes;
  }

  get(id) {
    return this.#notes.get(id) ?? null;
  }

  async create({ text, tags = [] }, now = new Date()) {
    const note = { id: this.#nextId++, text, tags, done: false, createdAt: now.toISOString(), updatedAt: now.toISOString() };
    this.#notes.set(note.id, note);
    await this.#save();
    this.emit("created", note);
    return note;
  }

  async update(id, changes, now = new Date()) {
    const note = this.#notes.get(id);
    if (!note) return null;
    Object.assign(note, changes, { updatedAt: now.toISOString() });
    await this.#save();
    this.emit("updated", note);
    return note;
  }

  async remove(id) {
    const note = this.#notes.get(id);
    if (!note) return false;
    this.#notes.delete(id);
    await this.#save();
    this.emit("deleted", note);
    return true;
  }

  #save() {
    const snapshot = JSON.stringify({ nextId: this.#nextId, notes: [...this.#notes.values()] }, null, 2) + "\n";
    this.#saving = this.#saving.then(async () => {
      await mkdir(dirname(this.#file), { recursive: true });
      const tmp = `${this.#file}.${randomUUID()}.tmp`;
      await writeFile(tmp, snapshot);
      await rename(tmp, this.#file);   // atomic: readers never see a half-written file
    });
    return this.#saving;
  }
}
