# playground

Your practice project for the JavaScript Study Book (Node 24+, ideally 26 LTS).

## Get it

```bash
git clone https://github.com/coder-hop/js-book-playground.git playground
cd playground
```

Repository: https://github.com/coder-hop/js-book-playground (or use *Code → Download ZIP*).
Cloning into a folder named `playground` keeps every path in the book (`playground/...`) exactly as written.
This repository holds only the practice project; the lessons are in the JavaScript Study Book.

**Full guide:** the "Using the Playground" page in the book's sidebar (`playground-howto.html`):
setup, the everyday loop, which chapter adds which file, tests, and troubleshooting.

- `package.json` has `"type": "module"`, so every `.js` file here is an ES module.
- Exercises marked **playground** tell you which file to create.
- `reference/` is the finished Chapter 16 project (async order processor):

      cd reference
      npm start          # node src/cli.js data/orders.json
      npm test           # node --test
