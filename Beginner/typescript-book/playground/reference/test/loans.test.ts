// Tests with Node's built-in runner, written in TypeScript and run from dist/.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BookId, Catalog, EventLog, lateFee, LoanId, LoanService, MemberDirectory, MemberId, statusOf, type Book } from "../src/index.js";

const day = (d: number) => new Date(2026, 10, d);
const book = (id: string, copies = 1): Book => ({ id: BookId(id), title: `Book ${id}`, author: "A", year: 2000, format: "paperback", copies });

function setup() {
  const catalog = new Catalog().add(book("b1", 1)).add(book("b2", 2));
  const members = new MemberDirectory();
  members.add({ id: MemberId("m1"), name: "Ana", type: "guest" });       // guest: 1 loan, 7 days
  members.add({ id: MemberId("m2"), name: "Ben", type: "staff" });
  const log = new EventLog();
  return { service: new LoanService(catalog, members, log), log };
}

describe("lateFee", () => {
  it("is 0 when on time and capped at 500", () => {
    assert.equal(lateFee(0), 0);
    assert.equal(lateFee(3), 75);
    assert.equal(lateFee(100), 500);
  });
});

describe("LoanService", () => {
  it("lends a book with the member's loan period", () => {
    const { service } = setup();
    const r = service.borrow(BookId("b1"), MemberId("m1"), day(1));
    assert.ok(r.ok);
    assert.equal(r.value.due.getDate(), 8);
  });

  it("refuses when no copies are left or the limit is reached", () => {
    const { service } = setup();
    service.borrow(BookId("b1"), MemberId("m2"), day(1));
    const noCopies = service.borrow(BookId("b1"), MemberId("m1"), day(1));
    assert.deepEqual(noCopies, { ok: false, reason: '"Book b1" has no copies left' });
    service.borrow(BookId("b2"), MemberId("m1"), day(1));
    const limit = service.borrow(BookId("b2"), MemberId("m1"), day(1));
    assert.deepEqual(limit, { ok: false, reason: "loan limit (1) reached" });
  });

  it("charges a late fee and emits events on return", () => {
    const { service, log } = setup();
    service.borrow(BookId("b1"), MemberId("m1"), day(1));
    const r = service.giveBack(LoanId("L1"), day(11));
    assert.ok(r.ok);
    assert.equal(r.value.lateDays, 3);
    assert.equal(r.value.fee, 75);
    assert.deepEqual(log.events.map((e) => e.type), ["borrowed", "returned", "fined"]);
    assert.equal(statusOf(r.value.loan, day(20)), "returned");
  });

  it("rejects returning twice", () => {
    const { service } = setup();
    service.borrow(BookId("b1"), MemberId("m1"), day(1));
    service.giveBack(LoanId("L1"), day(2));
    assert.deepEqual(service.giveBack(LoanId("L1"), day(3)), { ok: false, reason: "loan L1 is already returned" });
  });
});
