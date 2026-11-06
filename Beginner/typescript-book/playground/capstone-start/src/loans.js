// Borrowing and returning books.
import { addDays, daysBetween, lateFee } from "./fees.js";

export function statusOf(loan, today) {
  if (loan.returnedOn !== undefined) return "returned";
  return daysBetween(loan.due, today) > 0 ? "overdue" : "active";
}

export class LoanService {
  #loans = new Map();
  #next = 1;

  constructor(catalog, members, onEvent = () => {}) {
    this.catalog = catalog;
    this.members = members;
    this.onEvent = onEvent;
  }

  openLoans(filter = () => true) {
    return [...this.#loans.values()].filter((l) => l.returnedOn === undefined && filter(l));
  }

  available(bookId) {
    const book = this.catalog.find(bookId);
    return book === undefined ? 0 : book.copies - this.openLoans((l) => l.bookId === bookId).length;
  }

  borrow(bookId, memberId, today) {
    const book = this.catalog.find(bookId);
    if (book === undefined) return { ok: false, reason: `no book ${bookId}` };
    const policy = this.members.policyFor(memberId);
    if (this.available(bookId) <= 0) return { ok: false, reason: `"${book.title}" has no copies left` };
    const open = this.openLoans((l) => l.memberID === memberId).length;
    if (open >= policy.maxLoans) return { ok: false, reason: `loan limit (${policy.maxLoans}) reached` };

    const loan = { id: `L${this.#next++}`, bookId, memberId, borrowedOn: today, due: addDays(today, policy.days) };
    this.#loans.set(loan.id, loan);
    this.onEvent({ type: "borrowed", loanId: loan.id, bookId, memberId });
    return { ok: true, value: loan };
  }

  giveBack(loanId, today) {
    const loan = this.#loans.get(loanId);
    if (loan === undefined) return { ok: false, reason: `no loan ${loanId}` };
    if (loan.returnedOn !== undefined) return { ok: false, reason: `loan ${loanId} is already returned` };

    const lateDays = Math.max(0, daysBetween(loan.due, today));
    const fee = lateFee(lateDays);
    loan.returnedOn = today;
    this.onEvent({ type: "returned", loanId, lateDays });
    if (fee > 0) this.onEvent({ type: "fined", loanId, cents: fee });
    return { ok: true, value: { loan, lateDays, fee } };
  }
}
