#!/usr/bin/env python3
"""Run your solution against the official tests of a problem.

Usage:
    python3 runner/run-tests.py E01 -- python3 my_solution.py
    python3 runner/run-tests.py M13 -- java Main
    python3 runner/run-tests.py H06 -- ./a.out
    python3 runner/run-tests.py O08 --timeout 5 -- node lru.js

Everything after `--` is the command that runs your program. Each test's input is sent to its
standard input and its standard output is compared with the expected output. Line endings and
trailing spaces at the end of lines (and blank lines at the very end) are ignored; everything
else must match exactly.
"""
import argparse, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESTS = os.path.join(ROOT, "tests")
GREEN, RED, DIM, RESET = ("\033[32m", "\033[31m", "\033[2m", "\033[0m") if sys.stdout.isatty() else ("",) * 4


def normalise(text):
    rows = [r.rstrip() for r in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    while rows and rows[-1] == "":
        rows.pop()
    return rows


def first_difference(got, want):
    for i in range(max(len(got), len(want))):
        g = got[i] if i < len(got) else "<missing line>"
        w = want[i] if i < len(want) else "<no more lines expected>"
        if g != w:
            return i + 1, g, w
    return None


def short(s, n=120):
    return s if len(s) <= n else s[:n] + f"… ({len(s)} chars)"


def main():
    if "--" not in sys.argv:
        sys.exit(__doc__)
    split = sys.argv.index("--")
    ap = argparse.ArgumentParser(description="Run a solution against a problem's tests.")
    ap.add_argument("problem", help="problem id, e.g. E01, m13, H06, O08")
    ap.add_argument("--timeout", type=float, default=10, help="seconds per test (default 10)")
    ap.add_argument("--stop", action="store_true", help="stop at the first failing test")
    args = ap.parse_args(sys.argv[1:split])
    command = sys.argv[split + 1:]
    if not command:
        sys.exit("error: give the command that runs your solution after --")

    pid = args.problem.upper()
    folder = os.path.join(TESTS, pid)
    if not os.path.isdir(folder):
        sys.exit(f"error: no tests for {pid!r} (expected a folder {folder})")
    names = sorted(f[:-3] for f in os.listdir(folder) if f.endswith(".in"))

    passed = 0
    for name in names:
        with open(os.path.join(folder, name + ".in"), newline="") as f: given = f.read()
        with open(os.path.join(folder, name + ".out"), newline="") as f: want = normalise(f.read())
        start = time.perf_counter()
        try:
            run = subprocess.run(command, input=given, capture_output=True, text=True, timeout=args.timeout)
        except subprocess.TimeoutExpired:
            print(f"{RED}✗ test {name}: time limit exceeded ({args.timeout:g}s){RESET}")
            if args.stop: break
            continue
        except FileNotFoundError:
            sys.exit(f"error: command not found: {command[0]}")
        took = time.perf_counter() - start
        diff = first_difference(normalise(run.stdout), want)
        if diff is None and run.returncode == 0:
            passed += 1
            print(f"{GREEN}✓ test {name}{RESET} {DIM}{took * 1000:.0f} ms{RESET}")
            continue
        if diff is None:
            print(f"{RED}✗ test {name}: correct output but the program exited with code {run.returncode}{RESET}")
        else:
            line, g, w = diff
            print(f"{RED}✗ test {name}: first difference on line {line}{RESET}")
            print(f"    expected: {short(w)!r}")
            print(f"    got:      {short(g)!r}")
            if len(given) <= 300:
                print(f"    input:    {DIM}{given.rstrip()!r}{RESET}")
            else:
                print(f"    input:    {DIM}{os.path.join(folder, name + '.in')}{RESET}")
        if run.stderr.strip():
            print(f"    stderr:   {DIM}{short(run.stderr.strip().splitlines()[-1])}{RESET}")
        if args.stop: break

    total = len(names)
    colour = GREEN if passed == total else RED
    print(f"{colour}{pid}: {passed}/{total} tests passed{RESET}")
    sys.exit(0 if passed == total else 1)


if __name__ == "__main__":
    main()
