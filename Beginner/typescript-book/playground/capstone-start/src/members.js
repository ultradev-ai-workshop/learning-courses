// Members and their loan policies.
export const LOAN_POLICY = {
  student: { maxLoans: 3, days: 21 },
  staff: { maxLoans: 10, days: 42 },
  guest: { maxLoans: 1, days: 7 },
};

export class MemberDirectory {
  #members = new Map();

  static fromJson(text) {
    const dir = new MemberDirectory();
    for (const m of JSON.parse(text)) dir.add(m);
    return dir;
  }

  add(member) {
    this.#members.set(member.id, member);
    return member;
  }

  get(id) {
    return this.#members.get(id);
  }

  list() {
    return [...this.#members.values()];
  }

  policyFor(id) {
    return LOAN_POLICY[this.get(id).type];
  }
}
