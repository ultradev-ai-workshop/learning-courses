# playground

Your practice project for the Python Study Book.

## Get it

```bash
git clone https://github.com/coder-hop/python-book-playground.git playground
cd playground
```

Repository: https://github.com/coder-hop/python-book-playground (or use *Code → Download ZIP*).
Cloning into a folder named `playground` keeps every path in the book (`playground/...`) exactly as written.
This repository holds only the practice project; the lessons are in the Python Study Book.

**Full guide:** the "Using the Playground" page in the book's sidebar (`playground-howto.html`):
setup, the everyday loop, which chapter adds which file, tests, and troubleshooting.

Exercises marked **playground** in each chapter ask you to create files here
(`hello.py`, `money.py`, `storage.py`, the `tracker/` package, ...).
Chapter 16 brings them together into a small command-line expense tracker.

`reference/` contains the finished Chapter 16 project, so you can compare
your version with it once you're done:

    cd reference
    python3 -m tracker --file demo.json add 12.50 food --note lunch
    python3 -m tracker --file demo.json summary
    python3 -m unittest -v
