"""Shared helpers for the problem set sources (reference solvers live next to each problem).

Each problem is declared with P(...). The `solve` function is a PRIVATE reference implementation
used only to compute expected outputs for the tests; it is never shown on the problem pages.
"""
import random

PROBLEMS = []


def P(pid, title, difficulty, tags, concepts, statement, input_fmt, output_fmt, constraints,
      examples, tests, solve, hints=(), oop=None):
    """examples: list of (input_text, explanation_html); tests: extra input texts (or a callable returning them)."""
    PROBLEMS.append(dict(
        id=pid, title=title, difficulty=difficulty, tags=list(tags), concepts=list(concepts),
        statement=statement.strip(), input=input_fmt.strip(), output=output_fmt.strip(),
        constraints=list(constraints), examples=list(examples),
        tests=list(tests() if callable(tests) else tests), solve=solve, hints=list(hints), oop=oop,
    ))


def rng(seed):
    return random.Random(seed)


def lines(text):
    return text.strip("\n").split("\n")


def ints(text):
    return list(map(int, text.split()))


def out(*rows):
    return "\n".join(str(r) for r in rows) + "\n"
