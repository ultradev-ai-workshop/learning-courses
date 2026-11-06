// Step 3: the shapes the JavaScript code was already using, written down once.
export type MemberType = "student" | "staff" | "guest";
export interface Book { id: string; title: string; author: string; year: number; format: string; copies: number }
export interface Member { id: string; name: string; type: MemberType; email?: string }
export interface Loan { id: string; bookId: string; memberId: string; borrowedOn: Date; due: Date; returnedOn?: Date }
export type Result<T> = { ok: true; value: T } | { ok: false; reason: string };
