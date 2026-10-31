const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const list = new Intl.ListFormat("en", { type: "conjunction" });

export const formatCents = (cents) => money.format(cents / 100);

export function summarize(results, catalog) {
  const { paid = [], failed = [] } = Object.groupBy(results, (r) => r.status);
  const revenue = paid.reduce((sum, r) => sum + r.cents, 0);
  const byCustomer = Map.groupBy(paid, (r) => r.customer);
  const topCustomer = [...byCustomer]
    .map(([name, rs]) => [name, rs.reduce((s, r) => s + r.cents, 0)])
    .toSorted(([a, x], [b, y]) => y - x || a.localeCompare(b))[0];
  const lowStock = [...catalog].filter((b) => b.stock <= 1).map((b) => `${b.title} (${b.stock})`);
  return { paid: paid.length, failed: failed.length, revenue, topCustomer, lowStock };
}

export function render(summary, results) {
  const lines = results
    .toSorted((a, b) => a.id.localeCompare(b.id))
    .map((r) => (r.status === "paid"
      ? `✓ ${r.id} ${r.customer.padEnd(5)} ${formatCents(r.cents).padStart(8)}  ${r.receipt}`
      : `✗ ${r.id} ${r.customer.padEnd(5)} ${r.reason}`));
  const [name, cents] = summary.topCustomer ?? ["—", 0];
  return [
    ...lines,
    "─".repeat(44),
    `${summary.paid} paid, ${summary.failed} failed · revenue ${formatCents(summary.revenue)}`,
    `top customer: ${name} (${formatCents(cents)})`,
    `low stock: ${summary.lowStock.length ? list.format(summary.lowStock) : "none"}`,
  ].join("\n");
}
