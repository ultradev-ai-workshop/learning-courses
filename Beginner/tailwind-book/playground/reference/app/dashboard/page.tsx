import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { habits } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard · Orbit" };

const stats = [
  { label: "Active habits", value: "3" },
  { label: "Best streak", value: "12 days" },
  { label: "This week", value: "82%" },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-dvh">
      {/* Sidebar: hidden on phones */}
      <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-line bg-surface-muted p-4 md:flex">
        <Link href="/" className="mb-4 font-display text-lg font-bold">
          Orbit
        </Link>
        {["Overview", "Habits", "Insights", "Settings"].map((item, i) => (
          <a
            key={item}
            href="#"
            aria-current={i === 0 ? "page" : undefined}
            className="rounded-md px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:font-semibold aria-[current=page]:text-ink"
          >
            {item}
          </a>
        ))}
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Overview</h1>
          <ThemeToggle />
        </div>

        {/* Stats: a container query, so the cards adapt to the main column, not the screen */}
        <div className="@container mt-6">
          <dl className="grid gap-4 @lg:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-surface p-5 ring-1 ring-line"
              >
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Habits table: scrolls sideways on small screens */}
        <div className="mt-8 overflow-x-auto rounded-xl ring-1 ring-line">
          <table className="w-full min-w-xl text-left text-sm">
            <thead className="bg-surface-muted text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Habit</th>
                <th className="px-4 py-3 font-medium">Streak</th>
                <th className="px-4 py-3 font-medium">Completion</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {habits.map((h) => (
                <tr key={h.name} className="hover:bg-surface-muted">
                  <td className="px-4 py-3 font-medium">{h.name}</td>
                  <td className="px-4 py-3 tabular-nums">{h.streak} days</td>
                  <td className="px-4 py-3">
                    <div className="h-2 w-32 rounded-full bg-line">
                      {/* the width comes from data: a CSS variable set inline, used by a utility */}
                      <div
                        className="h-2 w-(--done) rounded-full bg-brand-500"
                        style={
                          { "--done": `${h.done}%` } as React.CSSProperties
                        }
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={h.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
