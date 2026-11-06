# TypeScript Study Book — Playground

The practice project for the [TypeScript Study Book](https://learn.coderhop.com/Beginner/typescript-book/index.html).
Repository: <https://github.com/coderhop-learning/typescript-playground>

## Setup

You need **Node.js 22 or newer** (`node --version`).

```bash
git clone https://github.com/coderhop-learning/typescript-playground.git
cd typescript-playground
npm install          # installs TypeScript 7.0.2 and @types/node
npm run check        # type-checks every exercise; prints nothing when all is well
```

## What's inside

| Folder | What it is |
| --- | --- |
| `exercises/chNN/` | One starter file per "playground" exercise in the book. Each file says which exercise it belongs to. |
| `capstone-start/` | The plain-JavaScript library-loans app that [Chapter 19](https://learn.coderhop.com/Beginner/typescript-book/19-project.html) migrates to TypeScript. It has passing tests and three hidden bugs. |
| `reference/` | The finished capstone: strict TypeScript, tested, publishing `.d.ts` files. Look here only after trying yourself. |
| `scripts/run.mjs` | Compiles the playground and runs one exercise. |

## Commands

| Command | What it does |
| --- | --- |
| `npm run check` | Type-check `exercises/` (`tsc --noEmit`). |
| `npm run ex -- exercises/ch01/hello.ts` | Compile, then run one exercise (from `dist/`). |
| `npm run check:start` | Type-check the JavaScript capstone with `checkJs` (Chapter 19, step 1). |
| `npm run start:js` / `npm run test:js` | Run the JavaScript capstone / its tests. |
| `npm run reference` | Build and run the finished TypeScript capstone. |
| `npm test` | Build the reference and run its tests with `node:test`. |

## Tips

- Every example in the book can also be pasted into the official Playground at <https://www.typescriptlang.org/play/>.
- `tsc` still writes JavaScript when there are type errors (Chapter 2), so `npm run ex` runs your code anyway and tells you about the errors first.
- The book's [Using the Playground](https://learn.coderhop.com/Beginner/typescript-book/playground-howto.html) page has a troubleshooting table.
