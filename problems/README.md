# Problem Set

100 language-neutral problems: E01–E25 (easy), M01–M25 (medium), H01–H25 (hard) and O01–O25
(object-oriented, driven by command scripts). Open `index.html` in a browser; no server needed.

## Solving

- Read stdin, write stdout. Templates for Python, JavaScript, Java and C++ are in `guide.html`.
- Check one test on the problem page (paste your output), or run all of them:

```sh
python3 runner/run-tests.py E01 -- python3 e01.py
node runner/run-tests.mjs  O08 -- java Main
```

- Test files: `tests/<ID>/NN.in` and `NN.out`. Comparison ignores line endings, trailing spaces
  and trailing blank lines.

## Maintaining (spoiler warning)

`tools/src_*.py` contain **reference solutions** — they compute every expected output and are
never shown on the pages. Don't open them if you want to solve the problems yourself.

| Command | What it does |
| --- | --- |
| `python3 tools/build.py` | regenerate `problems.json`, `problems.js` and `tests/` |
| `python3 tools/crosscheck.py` | compare tricky solvers with brute force on random inputs |
| `python3 tools/check-guide.py` | build and run every template in `guide.html` |
| `node tools/e2e.mjs` | headless-Chrome test of the pages (checker, progress, mobile) |

Progress is stored in the browser under `localStorage["problems.progress.v1"]`.
