"use client";

// Flips the .dark class on <html> and remembers the choice. The first paint is handled by the
// inline script in app/layout.tsx, so there is no flash of the wrong theme.
export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.theme = dark ? "dark" : "light";
  }
  return (
    <button
      type="button"
      id="theme-toggle"
      onClick={toggle}
      className="rounded-lg p-2 text-muted ring-1 ring-line transition-colors hover:bg-surface-muted hover:text-ink"
    >
      <span className="dark:hidden" aria-hidden="true">
        🌙
      </span>
      <span className="hidden dark:inline" aria-hidden="true">
        ☀️
      </span>
      <span className="sr-only">Toggle dark mode</span>
    </button>
  );
}
