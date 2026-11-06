import { describe, expect, it } from "vitest";
import { readingStats } from "@/lib/reading";

describe("readingStats", () => {
  it("counts read and unread books", () => {
    expect(readingStats([{ read: true }, { read: false }, { read: true }])).toEqual({ total: 3, read: 2, toRead: 1, percent: 67 });
  });
  it("is 0% for an empty list", () => {
    expect(readingStats([]).percent).toBe(0);
  });
});
