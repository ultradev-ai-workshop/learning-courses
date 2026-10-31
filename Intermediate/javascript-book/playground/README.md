# playground

Your practice project for the JavaScript Study Book (Node 24+, ideally 26 LTS).

**Full guide:** open `../playground-howto.html` ("Using the Playground" in the book's sidebar):
setup, the everyday loop, which chapter adds which file, tests, and troubleshooting.

- `package.json` has `"type": "module"`, so every `.js` file here is an ES module.
- Exercises marked **playground** tell you which file to create.
- `reference/` is the finished Chapter 16 project (async order processor):

      cd reference
      npm start          # node src/cli.js data/orders.json
      npm test           # node --test
