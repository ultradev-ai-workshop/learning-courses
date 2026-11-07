# Orbit: the Tailwind CSS Study Book capstone

A landing page and a dashboard for a fictional habit tracker, built with **Next.js 16** and
**Tailwind CSS 4.3**, installed the way the Tailwind docs' Next.js guide describes (PostCSS).
Chapter 19 of the [Tailwind CSS Study Book](https://learn.coderhop.com/Beginner/tailwind-book/19-project.html)
walks through every file.

```bash
npm install
npm run dev        # http://localhost:3000 and /dashboard
npm run build && npm start
npm run format     # Prettier + prettier-plugin-tailwindcss sorts the classes
```

What it uses, by chapter: theme tokens and semantic colours (8), class-based dark mode with no
flash (7), components with variant lookups (10), a custom `container-page` utility with `@variant` (11),
responsive layouts (6, 13), subgrid pricing cards (13), container queries (18), `group-open` and
`aria-[current=page]` variants (5), CSS-variable widths from data (3), gradients and backdrop blur (16).
