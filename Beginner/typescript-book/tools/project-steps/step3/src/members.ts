import type { Member, MemberType } from "./types.js";

export const LOAN_POLICY: Record<MemberType, { maxLoans: number; days: number }> = {
  student: { maxLoans: 3, days: 21 },
  staff: { maxLoans: 10, days: 42 },
  guest: { maxLoans: 1, days: 7 },
};

export class MemberDirectory {
  #members = new Map<string, Member>();
  add(member: Member): Member { this.#members.set(member.id, member); return member; }
  get(id: string): Member | undefined { return this.#members.get(id); }
  policyFor(id: string) {
    return LOAN_POLICY[this.get(id).type];
  }
}
