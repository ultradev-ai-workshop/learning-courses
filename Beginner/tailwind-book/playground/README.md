# tailwindcss-playground

The practice project for the [Tailwind CSS Study Book](https://learn.coderhop.com/Beginner/tailwind-book/index.html).

- **The starter** (this folder) is a Vite project with Tailwind CSS 4.3 installed through
  `@tailwindcss/vite`, the way the docs recommend. It has one page per chapter in `chapters/`,
  where you do the exercises marked *playground*.
- **`reference/`** is the finished capstone from Chapter 19: **Orbit**, a Next.js 16 app with
  Tailwind installed through PostCSS (the Tailwind docs' Next.js guide). It has its own
  `package.json` and README.

## Start

```bash
git clone https://github.com/coderhop-learning/tailwindcss-playground.git
cd tailwindcss-playground
npm install
npm run dev                 # http://localhost:5173
```

Open `http://localhost:5173/chapters/05/` for Chapter 5, and so on. Edit a page, save, and the
browser updates immediately.

```bash
npm run build               # builds every page into dist/
npm run format              # Prettier + prettier-plugin-tailwindcss sorts your classes
```

## The reference solution

```bash
cd reference
npm install
npm run dev                 # http://localhost:3000 and /dashboard
```

## Files

| Path | What it is |
| --- | --- |
| `src/style.css` | `@import "tailwindcss";` for every chapter page |
| `chapters/07/style.css` | Chapter 7's stylesheet with class-based dark mode |
| `chapters/appendix-a/old.html` | A v3 page to upgrade |
| `chapters/appendix-b/` | Markdown output to style with the Typography plugin |
| `vite.config.js` | The Tailwind plugin, and every chapter page as a build input |
| `.prettierrc` | Class sorting |
