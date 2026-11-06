// Shared types, and the constant tables they are derived from (Chapters 3, 6, 9, 14).
import type { BookId, LoanId, MemberId } from "./ids.js";

export const FORMATS = ["hardcover", "paperback", "ebook"] as const;
export type Format = (typeof FORMATS)[number];

export interface Book {
  readonly id: BookId;
  title: string;
  author: string;
  year: number;
  format: Format;
  copies: number;
}

export const LOAN_POLICY = {
  student: { maxLoans: 3, days: 21 },
  staff: { maxLoans: 10, days: 42 },
  guest: { maxLoans: 1, days: 7 },
} as const satisfies Record<string, { maxLoans: number; days: number }>;
export type MemberType = keyof typeof LOAN_POLICY;

export interface Member {
  readonly id: MemberId;
  name: string;
  type: MemberType;
  email?: string;
}

export interface Loan {
  readonly id: LoanId;
  bookId: BookId;
  memberId: MemberId;
  borrowedOn: Date;
  due: Date;
  returnedOn?: Date;
}

/** Success or a reason, without exceptions (Chapter 4). */
export type Result<T> = { ok: true; value: T } | { ok: false; reason: string };

export type LoanEvent =
  | { type: "borrowed"; loanId: LoanId; bookId: BookId; memberId: MemberId }
  | { type: "returned"; loanId: LoanId; lateDays: number }
  | { type: "fined"; loanId: LoanId; cents: number };
