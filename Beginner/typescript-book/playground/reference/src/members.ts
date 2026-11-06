// Members, stored in the generic repository (Chapters 8 and 9).
import { MemberId } from "./ids.js";
import { InMemoryRepository } from "./repository.js";
import { LOAN_POLICY, type Member, type MemberType } from "./types.js";

const isMemberType = (v: unknown): v is MemberType => typeof v === "string" && Object.hasOwn(LOAN_POLICY, v);

export function parseMember(raw: unknown): Member {
  if (typeof raw !== "object" || raw === null) throw new TypeError("member must be an object");
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.name !== "string") throw new TypeError("member.id and member.name must be strings");
  if (!isMemberType(r.type)) throw new TypeError(`unknown member type: ${String(r.type)}`);
  const member: Member = { id: MemberId(r.id), name: r.name, type: r.type };
  if (typeof r.email === "string") member.email = r.email;
  return member;
}

export class MemberDirectory extends InMemoryRepository<Member> {
  static fromJson(text: string): MemberDirectory {
    const data: unknown = JSON.parse(text);
    if (!Array.isArray(data)) throw new TypeError("members must be an array");
    const dir = new MemberDirectory();
    for (const raw of data) dir.add(parseMember(raw));
    return dir;
  }

  policyFor(id: MemberId) {
    const member = this.get(id);
    return member === undefined ? undefined : LOAN_POLICY[member.type];
  }
}
