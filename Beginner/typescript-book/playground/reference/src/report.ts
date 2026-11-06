// A plain-text table typed by its rows (Chapter 11).
export type Columns<T> = { [K in keyof T]?: { header: string; format?: (value: T[K]) => string } };

export function table<T extends object>(rows: readonly T[], columns: Columns<T>): string {
  const keys = Object.keys(columns) as (keyof T)[];
  const cell = (row: T, key: keyof T): string => {
    const col = columns[key]!;
    return col.format ? col.format(row[key]) : String(row[key]);
  };
  const grid = [keys.map((k) => columns[k]!.header), ...rows.map((r) => keys.map((k) => cell(r, k)))];
  const widths = keys.map((_, i) => Math.max(...grid.map((line) => line[i]!.length)));
  return grid.map((line) => line.map((c, i) => c.padEnd(widths[i]!)).join("  ").trimEnd()).join("\n");
}
