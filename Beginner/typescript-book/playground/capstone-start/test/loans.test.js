import assert from "node:assert/strict";
import { it } from "node:test";
import { Catalog } from "../src/catalog.js";
import { LoanService } from "../src/loans.js";
import { MemberDirectory } from "../src/members.js";

const day = (d) => new Date(2026, 10, d);

it("lends a book and takes it back on time", () => {
  const catalog = new Catalog().add({ id: "b1", title: "Dune", author: "Frank Herbert", year: 1965, format: "paperback", copies: 1 });
  const members = new MemberDirectory();
  members.add({ id: "m1", name: "Ana", type: "guest" });
  const service = new LoanService(catalog, members);
  const r = service.borrow("b1", "m1", day(1));
  assert.equal(r.ok, true);
  assert.deepEqual(service.giveBack("L1", day(5)).value.fee, 0);
});
