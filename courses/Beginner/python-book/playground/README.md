# playground

Your practice project for the Python Study Book.

**Full guide:** open `../playground-howto.html` ("Using the Playground" in the book's sidebar):
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
