import { lateFee } from "./fees.js";
import type { MemberDirectory } from "./members.js";
import type { Loan } from "./types.js";

export class LoanService {
  #loans = new Map<string, Loan>();
  constructor(private members: MemberDirectory) {}

  openLoans(filter: (loan: Loan) => boolean = () => true): Loan[] {
    return [...this.#loans.values()].filter((l) => l.returnedOn === undefined && filter(l));
  }

  canBorrow(memberId: string): boolean {
    const policy = this.members.policyFor(memberId);
    return this.openLoans((l) => l.memberID === memberId).length < policy.maxLoans;
  }

  fee(lateDays: number): number {
    return lateFee(lateDays);
  }
}
