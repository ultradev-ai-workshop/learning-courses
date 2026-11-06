// Late fees and dates.
export const DAY_MS = 86_400_000;

/** Cents owed for a return `daysLate` days after the due date. */
export function lateFee(daysLate, options) {
  if (daysLate <= 0) return 0;
  const perDay = options.perDay || 25;
  const cap = options.cap || 500;
  return Math.min(daysLate * perDay, cap);
}

export function daysBetween(from, to) {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end - start) / DAY_MS);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const formatCents = (cents) => `€${(cents / 100).toFixed(2)}`;
