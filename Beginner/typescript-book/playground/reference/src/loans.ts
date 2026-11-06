// Borrowing and returning: discriminated unions, Result values and status derivation (Chapters 4, 12, 13).
import { traced, type EventLog } from "./audit.js";
import type { Catalog } from "./catalog.js";
import { addDays, daysBetween, lateFee } from "./fees.js";
import { LoanId, type BookId, type MemberId } from "./ids.js";
import type { MemberDirectory } from "./members.js";
import { InMemoryRepository } from "./repository.js";
import type { Loan, Result } from "./types.js";

export const LoanStatus = { Active: "active", Overdue: "overdue", Returned: "returned" } as const;
export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];

export function statusOf(loan: Pick<Loan, "due" | "returnedOn">, today: Date): LoanStatus {
  if (loan.returnedOn !== undefined) return LoanStatus.Returned;
  return daysBetween(loan.due, today) > 0 ? LoanStatus.Overdue : LoanStatus.Active;
}

export interface Returned { loan: Loan; lateDays: number; fee: number }

export class LoanService {
  readonly loans = new InMemoryRepository<Loan>();
  #next = 1;
  readonly #catalog: Catalog;
  readonly #members: MemberDirectory;
  readonly #log: EventLog;

  constructor(catalog: Catalog, members: MemberDirectory, log: EventLog) {
    this.#catalog = catalog;
    this.#members = members;
    this.#log = log;
  }

  openLoans(filter: (loan: Loan) => boolean = () => true): Loan[] {
    return this.loans.list((l) => l.returnedOn === undefined && filter(l));
  }

  available(bookId: BookId): number {
    const book = this.#catalog.find(bookId);
    return book === undefined ? 0 : book.copies - this.openLoans((l) => l.bookId === bookId).length;
  }

  @traced
  borrow(bookId: BookId, memberId: MemberId, today: Date): Result<Loan> {
    const book = this.#catalog.find(bookId);
    if (book === undefined) return { ok: false, reason: `no book ${bookId}` };
    const policy = this.#members.policyFor(memberId);
    if (policy === undefined) return { ok: false, reason: `no member ${memberId}` };
    if (this.available(bookId) <= 0) return { ok: false, reason: `"${book.title}" has no copies left` };
    const open = this.openLoans((l) => l.memberId === memberId).length;
    if (open >= policy.maxLoans) return { ok: false, reason: `loan limit (${policy.maxLoans}) reached` };

    const loan = this.loans.add({
      id: LoanId(`L${this.#next++}`), bookId, memberId, borrowedOn: today, due: addDays(today, policy.days),
    });
    this.#log.emit({ type: "borrowed", loanId: loan.id, bookId, memberId });
    return { ok: true, value: loan };
  }

  @traced
  giveBack(loanId: LoanId, today: Date): Result<Returned> {
    const loan = this.loans.get(loanId);
    if (loan === undefined) return { ok: false, reason: `no loan ${loanId}` };
    if (loan.returnedOn !== undefined) return { ok: false, reason: `loan ${loanId} is already returned` };

    const lateDays = Math.max(0, daysBetween(loan.due, today));
    const fee = lateFee(lateDays);
    const updated = this.loans.update(loanId, { returnedOn: today });
    this.#log.emit({ type: "returned", loanId, lateDays });
    if (fee > 0) this.#log.emit({ type: "fined", loanId, cents: fee });
    return { ok: true, value: { loan: updated, lateDays, fee } };
  }
}
