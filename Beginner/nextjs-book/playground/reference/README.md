# Reading List — reference solution

The finished capstone of the [Next.js Study Book](https://learn.coderhop.com/Beginner/nextjs-book/19-project.html):
a full-stack Next.js 16.4 app with Cache Components, Server Actions, a signed-cookie login, a JSON API and tests.

## Run it

```bash
npm install
cp .env.example .env.local          # then set SESSION_SECRET (openssl rand -base64 32)
npm run build && npm start          # http://localhost:3000
```

Log in at `/login` as **ada@example.com / correct horse** (admin) or **ben@example.com / battery staple** (reader).

## Test it

```bash
npm run test:run                    # Vitest unit tests
npm run test:e2e                    # Playwright, against a running `npm start`
```

## Where things are

| Path | What |
| --- | --- |
| `data/books.json` | the "database" |
| `lib/books.ts` | cached reads (`use cache` + tags) and writes |
| `lib/session.ts`, `lib/users.ts`, `lib/dal.ts` | sessions, demo users, data access layer |
| `lib/validation.ts`, `lib/reading.ts` | pure logic, unit-tested in `__tests__/` |
| `app/` | pages, layouts, Server Actions, Route Handlers, metadata files |
| `proxy.ts` | optimistic `/admin` check |
| `e2e/` | Playwright tests |
