# nextjs-playground

The practice project for the [Next.js Study Book](https://learn.coderhop.com/Beginner/nextjs-book/index.html).

- **The starter** (this folder) is exactly what `npx create-next-app@latest --yes` generates with
  Next.js 16.4.5: TypeScript, Tailwind CSS, ESLint, the App Router, Turbopack and Cache Components.
  The `playground` exercises in each chapter turn it, step by step, into the **Reading List** app.
- **`reference/`** is the finished capstone from Chapter 19, with its own `package.json`, tests and README.

## Start

```bash
git clone https://github.com/coderhop-learning/nextjs-playground.git
cd nextjs-playground
npm install
npm run dev                 # http://localhost:3000
```

Build and run it the way production does (do this often: Chapter 2 explains why):

```bash
npm run build
npm start
```

## The reference solution

```bash
cd reference
npm install
cp .env.example .env.local  # set SESSION_SECRET (openssl rand -base64 32)
npm run build && npm start
```

Log in at `/login` as `ada@example.com` / `correct horse` (admin).

## Which chapter adds what

| Chapter | You add |
| --- | --- |
| 1–2 | the home page text, `lib/books.ts` |
| 3–4 | the header and footer, `/about`, `/books` and `/books/[id]` |
| 5–7 | a "want to read" button, Suspense, the add-book form and its Server Action |
| 8–10 | caching with tags, `updateTag`, `not-found.tsx` and `error.tsx` |
| 11–13 | Tailwind styling, covers with `<Image>`, metadata and OG images |
| 14–16 | the JSON API, `proxy.ts`, login and the data access layer |
| 17–19 | tests, a production build, and the full capstone |
