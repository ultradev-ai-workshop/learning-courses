// Runs one scripted day at the library.  Usage: npm start
import { readFileSync } from "node:fs";
import { Catalog } from "./catalog.js";
import { formatCents } from "./fees.js";
import { LoanService } from "./loans.js";
import { MemberDirectory } from "./members.js";

const dataDir = new URL("../data/", import.meta.url);
const catalog = Catalog.fromJson(readFileSync(new URL("books.json", dataDir), "utf8"));
const members = MemberDirectory.fromJson(readFileSync(new URL("members.json", dataDir), "utf8"));
const events = [];
const service = new LoanService(catalog, members, (e) => events.push(e));

const show = (r, describe) => console.log(r.ok ? `  ✓ ${describe(r.value)}` : `  ✗ ${r.reason}`);
const day = (d) => new Date(2026, 10, d);

console.log(`${catalog.size} books, ${members.list().length} members`);
show(service.borrow("b1", "m1", day(2)), (l) => `${l.id} due ${l.due.toDateString()}`);
show(service.borrow("b2", "m3", day(2)), (l) => `${l.id} due ${l.due.toDateString()}`);
show(service.borrow("b4", "m3", day(3)), (l) => l.id);
show(service.giveBack("L2", day(12)), (r) => `back ${r.lateDays} day(s) late, fee ${formatCents(r.fee)}`);
console.log(`Events: ${events.map((e) => e.type).join(", ")}`);
