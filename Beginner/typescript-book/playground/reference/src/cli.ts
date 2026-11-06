// Runs one scripted day at the library and prints a report.
// Usage: npm start   (builds with tsc, then runs dist/src/cli.js)
import { readFileSync } from "node:fs";
import { EventLog } from "./audit.js";
import { Catalog } from "./catalog.js";
import { formatCents } from "./fees.js";
import { BookId, LoanId, MemberId } from "./ids.js";
import { LoanService, statusOf } from "./loans.js";
import { MemberDirectory } from "./members.js";
import { table } from "./report.js";
import type { Loan, Result } from "./types.js";

const dataDir = new URL("../../data/", import.meta.url);
const catalog = Catalog.fromJson(readFileSync(new URL("books.json", dataDir), "utf8"));
const members = MemberDirectory.fromJson(readFileSync(new URL("members.json", dataDir), "utf8"));
const log = new EventLog();
const service = new LoanService(catalog, members, log);

let fines = 0;
log.on("fined", (e) => { fines += e.cents; });

function show<T>(r: Result<T>, describe: (value: T) => string): void {
  console.log(r.ok ? `  ✓ ${describe(r.value)}` : `  ✗ ${r.reason}`);
}
const day = (d: number) => new Date(2026, 10, d);
const titleOf = (loan: Loan) => catalog.find(loan.bookId)?.title ?? "?";

console.log(`${catalog.size} books, ${members.list().length} members`);
show(service.borrow(BookId("b1"), MemberId("m1"), day(2)), (l) => `${l.id} due ${l.due.toDateString()}`);
show(service.borrow(BookId("b2"), MemberId("m3"), day(2)), (l) => `${l.id} due ${l.due.toDateString()}`);
show(service.borrow(BookId("b2"), MemberId("m2"), day(3)), (l) => l.id);
show(service.borrow(BookId("b4"), MemberId("m3"), day(3)), (l) => l.id);
show(service.giveBack(LoanId("L2"), day(12)), (r) => `${titleOf(r.loan)} back ${r.lateDays} day(s) late, fee ${formatCents(r.fee)}`);
show(service.borrow(BookId("b2"), MemberId("m2"), day(12)), (l) => `${l.id} due ${l.due.toDateString()}`);

const today = day(25);
console.log(`\nOpen loans on ${today.toDateString()}:`);
console.log(table(
  service.openLoans().map((l) => ({ id: l.id, title: titleOf(l), member: members.get(l.memberId)?.name ?? "?", due: l.due, status: statusOf(l, today) })),
  { id: { header: "Loan" }, title: { header: "Title" }, member: { header: "Member" }, due: { header: "Due", format: (d) => d.toDateString() }, status: { header: "Status" } },
));
console.log(`\nEvents: ${log.events.map((e) => e.type).join(", ")}`);
console.log(`Fines collected: ${formatCents(fines)}`);
