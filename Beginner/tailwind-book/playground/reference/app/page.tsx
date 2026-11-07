import { ButtonLink } from "@/components/button";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/cn";
import { features, plans } from "@/lib/data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="container-page py-20 text-center sm:py-28">
          <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase dark:text-brand-400">
            Habit tracker
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-balance motion-safe:animate-fade-up sm:text-6xl">
            Small habits,{" "}
            <span className="bg-linear-to-r from-brand-500 to-sky-500 bg-clip-text text-transparent">
              big results
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted">
            Orbit turns your goals into daily habits, keeps your streaks alive,
            and shows you what works.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/dashboard" size="lg">
              Start for free
            </ButtonLink>
            <ButtonLink href="#features" variant="secondary" size="lg">
              See how it works
            </ButtonLink>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 bg-surface-muted py-20">
          <div className="container-page grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-line"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-xl dark:bg-brand-700/30">
                  {f.icon}
                </span>
                <h2 className="mt-4 font-semibold">{f.title}</h2>
                <p className="mt-2 text-sm text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing: subgrid keeps names, blurbs, prices and lists aligned across cards */}
        <section id="pricing" className="container-page scroll-mt-20 py-20">
          <h2 className="text-center font-display text-3xl font-bold">
            Simple pricing
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "row-span-4 grid grid-rows-subgrid gap-3 rounded-2xl p-6 ring-1",
                  p.featured
                    ? "bg-brand-600 text-white ring-brand-600 md:-my-3 md:py-9"
                    : "bg-surface ring-line",
                )}
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p
                  className={cn(
                    "text-sm",
                    p.featured ? "text-brand-100" : "text-muted",
                  )}
                >
                  {p.blurb}
                </p>
                <p className="text-4xl font-bold tabular-nums">
                  ${p.price}
                  <span
                    className={cn(
                      "text-sm font-normal",
                      p.featured ? "text-brand-100" : "text-muted",
                    )}
                  >
                    /month
                  </span>
                </p>
                <ul className="space-y-1 text-sm">
                  {p.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ: <details> + group-open, no JavaScript */}
        <section
          id="faq"
          className="container-page max-w-3xl scroll-mt-20 pb-24"
        >
          <h2 className="font-display text-3xl font-bold">Questions</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {[
              [
                "Is there a free plan?",
                "Yes. Starter is free forever, with up to three habits.",
              ],
              [
                "Can I use it offline?",
                "Yes. Orbit syncs your progress when you are back online.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {q}
                  <span
                    className="text-muted transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        Built with Next.js and Tailwind CSS.
      </footer>
    </>
  );
}
