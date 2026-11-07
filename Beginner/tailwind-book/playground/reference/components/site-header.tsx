import Link from "next/link";
import { ButtonLink } from "./button";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold"
        >
          <span
            className="size-7 rounded-full bg-linear-to-br from-brand-400 to-sky-400"
            aria-hidden="true"
          />
          Orbit
        </Link>
        <nav className="hidden gap-6 text-sm text-muted md:flex">
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="#pricing" className="hover:text-ink">
            Pricing
          </a>
          <a href="#faq" className="hover:text-ink">
            FAQ
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <ButtonLink href="/dashboard" size="sm">
            Open app
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
