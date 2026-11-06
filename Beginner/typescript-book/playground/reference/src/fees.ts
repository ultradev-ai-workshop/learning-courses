// Late fees and dates (Chapters 2 and 5).
export const DAY_MS = 86_400_000;

export interface FeeOptions {
  perDay?: number;
  cap?: number;
}

/** Cents owed for a return `daysLate` days after the due date. */
export function lateFee(daysLate: number, { perDay = 25, cap = 500 }: FeeOptions = {}): number {
  if (daysLate <= 0) return 0;
  return Math.min(daysLate * perDay, cap);
}

/** Whole days from `from` to `to` (negative if `to` is earlier), ignoring the time of day. */
export function daysBetween(from: Date, to: Date): number {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end - start) / DAY_MS);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const formatCents = (cents: number): string => `€${(cents / 100).toFixed(2)}`;
