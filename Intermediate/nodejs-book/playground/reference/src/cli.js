#!/usr/bin/env node
// Command-line client for the API (Chapters 2 and 12). Usage: notes list|add|done|rm …
import { parseArgs, styleText } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    url: { type: "string", default: process.env.NOTES_URL ?? "http://localhost:3000" },
    tag: { type: "string", short: "t", multiple: true },
  },
});

async function api(method, path, body) {
  const res = await fetch(new URL(path, values.url), {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(5000),
  });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(`${data.error}${data.details ? ": " + data.details.join("; ") : ""}`);
  return data;
}

const show = (n) => `${styleText(n.done ? "green" : "yellow", n.done ? "✔" : "•")} #${n.id} ${n.text}${n.tags.length ? " [" + n.tags.join(", ") + "]" : ""}`;
const [command, ...rest] = positionals;

try {
  if (command === "list") {
    const notes = await api("GET", `/notes${values.tag ? `?tag=${encodeURIComponent(values.tag[0])}` : ""}`);
    console.log(notes.length ? notes.map(show).join("\n") : "no notes");
  } else if (command === "add") {
    console.log("added", show(await api("POST", "/notes", { text: rest.join(" "), tags: values.tag ?? [] })));
  } else if (command === "done") {
    console.log("updated", show(await api("PATCH", `/notes/${rest[0]}`, { done: true })));
  } else if (command === "rm") {
    await api("DELETE", `/notes/${rest[0]}`);
    console.log(`removed #${rest[0]}`);
  } else {
    console.error("usage: notes list [-t tag] | add <text> [-t tag…] | done <id> | rm <id>  [--url http://…]");
    process.exitCode = 2;
  }
} catch (err) {
  console.error(styleText("red", `error: ${err.message}`));
  process.exitCode = 1;
}
