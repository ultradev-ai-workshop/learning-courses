import { describe, expect, it } from "vitest";
import { parseNewBook } from "@/lib/validation";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};

describe("parseNewBook", () => {
  it("accepts a valid book and trims text", () => {
    const r = parseNewBook(form({ title: " Dune ", author: "Frank Herbert", year: "1965", genre: "sci-fi" }));
    expect(r).toEqual({ ok: true, data: { title: "Dune", author: "Frank Herbert", year: 1965, genre: "sci-fi" } });
  });
  it("reports every invalid field", () => {
    const r = parseNewBook(form({ title: "", author: "", year: "65000", genre: "cookbooks" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["author", "genre", "title", "year"]);
  });
});
