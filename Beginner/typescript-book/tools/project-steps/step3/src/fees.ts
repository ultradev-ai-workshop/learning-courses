export interface FeeOptions { perDay?: number; cap?: number }

export function lateFee(daysLate: number, options?: FeeOptions): number {
  if (daysLate <= 0) return 0;
  const perDay = options.perDay || 25;
  const cap = options.cap || 500;
  return Math.min(daysLate * perDay, cap);
}
