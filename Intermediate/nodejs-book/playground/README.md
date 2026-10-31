# Node.js Study Book — playground

Your workspace for the exercises marked **playground**. Each one adds a file here, and together
they grow into the Chapter 16 project (a notes REST API).

```sh
cd playground
node --version            # 24 or newer (the book uses 26)
node hello.js             # run a file
node --watch hello.js     # re-run on every save
npm test                  # run every *.test.js with node:test
```

- `package.json` sets `"type": "module"`, so `.js` files are ES modules.
- `reference/` holds the finished Chapter 16 project. Try `cd reference && npm test`
  and `node scripts/smoke.js`. Don't copy from it until you've tried the exercises.
- Generated files (`playground-data/`, `data/`, logs) are safe to delete at any time.
