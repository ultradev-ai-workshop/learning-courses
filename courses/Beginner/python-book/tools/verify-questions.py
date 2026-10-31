"""Re-check generated questions in questions.json with the real Python interpreter.

For every template whose answer can be computed by running code, this script
runs it and compares the result with the option marked correct.
Knowledge templates (module-for-a-task, Java-to-Python mappings, ...) can't be
executed; they are listed as "not executable" and spot-checked by hand.

Usage:  python3.15 tools/verify-questions.py
"""
import contextlib
import io
import json
import os
import re
import subprocess
import sys
import tempfile
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'playground', 'reference'))

PRELUDE = 'import math, sys\nfrom decimal import Decimal\nfrom fractions import Fraction\nfrom pathlib import PurePosixPath as Path\n'


def run(code, cwd):
    r = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True, cwd=cwd, timeout=20)
    return r.returncode, r.stdout, r.stderr


def exc_name(stderr):
    m = re.search(r'^(\w+(?:Error|Exception|Iteration|Exit))\b', stderr.strip().splitlines()[-1]) if stderr.strip() else None
    return m.group(1) if m else None


def ev(expr):
    return eval(expr, {'__builtins__': __builtins__, **_ns()})


def _ns():
    ns = {}
    exec(PRELUDE, ns)
    return ns


def correct_set(q):
    return {q['options'][i] for i in q['answer']}


def check(q, cwd):
    """Return (verified: bool|None, detail). None means not executable."""
    t = q.get('template')
    code = q.get('code', '')
    want = correct_set(q)
    opts = q['options']

    if t in {'float-select', 'truthy-select', 'js-falsy', 'hashable-select', 'compare-select', 'decimal-bool'}:
        def ok(o):
            v = ev(o)
            if t == 'float-select':
                return type(v) is float
            if t == 'truthy-select':
                return bool(v)
            if t == 'js-falsy':
                return not bool(v)
            if t == 'hashable-select':
                try:
                    hash(v)
                    return True
                except TypeError:
                    return False
            return v is True
        got = {o for o in opts if ok(o)}
        return got == want, f'got {sorted(got)}'

    if t == 'repl-echo':
        got = set()
        for o in opts:
            ns = {'x': 5}
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                exec(compile(o + '\n', '<repl>', 'single'), ns)
            if buf.getvalue().strip():
                got.add(o)
        return got == want, f'got {sorted(got)}'

    if t == 'kw-call-valid':
        sig = re.search(r'Given (def f\(.*?\))', q['question']).group(1) + ': return 1'
        got = set()
        for o in opts:
            ns = {}
            exec(sig, ns)
            try:
                eval(o, ns)
                got.add(o)
            except TypeError:
                pass
        return got == want, f'got {sorted(got)}'

    if t == 'import-names':
        stmt = re.search(r'After `(.*?)`', q['question']).group(1)
        got = set()
        for o in opts:
            ns = {}
            exec(stmt, ns)
            try:
                eval(o, ns)
                got.add(o)
            except (NameError, AttributeError):
                pass
        return got == want, f'got {sorted(got)}'

    if t == 'version-spec':
        try:
            from pip._vendor.packaging.specifiers import SpecifierSet
        except ImportError:
            return None, 'packaging not available'
        spec = re.search(r'pkg(\S+)\?', q['question']).group(1)
        s = SpecifierSet(spec)
        got = {o for o in opts if s.contains(o, prereleases=True)}
        return got == want, f'got {sorted(got)}'

    if t in {'str-index', 'power-precedence', 'range-list', 'and-or'}:
        if t == 'str-index':
            m = re.search(r'word\[(-?\d+)\] give for word = (.+)\?', q['question'])
            expr = f'{m.group(2)}[{m.group(1)}]'
        elif t == 'power-precedence':
            expr = re.search(r'value of (.+)\?', q['question']).group(1)
        elif t == 'range-list':
            expr = re.search(r'What is (list\(range\(.*\)\))\?', q['question']).group(1)
        else:
            expr = q['question'].split(': ', 1)[1]
        try:
            got = repr(ev(expr))
        except IndexError:
            got = 'IndexError'
        return {got} == want, f'got {got}'

    if t == 'parse-amount':
        from tracker.models import parse_amount
        text = ev(re.search(r'parse_amount\((.+)\) return', q['question']).group(1))
        try:
            got = str(parse_amount(text))
        except ValueError:
            got = 'ValueError'
        return {got} == want, f'got {got}'

    if t == 'format-money':
        from tracker.models import format_money
        got = repr(format_money(int(re.search(r'format_money\((-?\d+)\)', q['question']).group(1))))
        return {got} == want, f'got {got}'

    if t == 'path-parts':
        m = re.search(r'print\(Path\((.+?)\)\.([\w.]+)\)', q['question'])
        got = str(eval(f'Path({m.group(1)}).{m.group(2)}', _ns()))
        return {got} == want, f'got {got}'

    if t == 'argv-value':
        m = re.search(r'You run: python3 (.+?)  — what is (.+) inside', q['question'])
        words = m.group(1).split()
        script = os.path.join(cwd, words[0])
        with open(script, 'w') as f:
            f.write(f'import sys\ntry:\n    print(repr({m.group(2)}))\nexcept IndexError:\n    print("IndexError")\n')
        r = subprocess.run([sys.executable, words[0], *words[1:]], capture_output=True, text=True, cwd=cwd)
        got = r.stdout.strip()
        return {got} == want, f'got {got}'

    if t in {'stream-redirect', 'exit-code'}:
        cmd = code[2:].replace('python3', sys.executable, 1)
        env = dict(os.environ, PYTHONUNBUFFERED='1')     # keep stdout/stderr in terminal order
        r = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, env=env)
        lines = r.stdout.split()
        if t == 'exit-code':
            got = lines[-1]
        else:
            got = 'nothing' if not lines else f'only {lines[0]}' if len(lines) == 1 else f'{lines[0]} and {lines[1]}'
        return {got} == want, f'got {got}'

    if t == 'exception-type':
        rc, out, err = run(code, cwd)
        got = exc_name(err)
        return {got} == want, f'got {got}'

    if code and q['question'].startswith('What does this print') or t in {'try-flow', 'enum-eval'}:
        rc, out, err = run(code, cwd)
        if t == 'try-flow':
            got = ' '.join(out.split()) + (', then a traceback' if rc else '')
        elif t == 'enum-eval' and rc:
            got = exc_name(err)
        elif ' / ' in next(iter(want)):
            got = ' / '.join(l.strip() for l in out.strip().splitlines())
        else:
            if rc:
                last = err.strip().splitlines()[-1]
                prop = re.match(r'nothing \(the (\w+) propagates\)', next(iter(want)))
                got = next(iter(want)) if prop and last == prop.group(1) else exc_name(err) or last
            else:
                got = out.strip()
        return {got} == want, f'got {got!r}'

    return None, 'not executable'


def main():
    data = json.load(open(os.path.join(ROOT, 'questions.json'), encoding='utf-8'))
    stats = defaultdict(Counter)
    failures = []
    with tempfile.TemporaryDirectory() as cwd:
        for q in data['questions']:
            if 'template' not in q:
                continue
            try:
                ok, detail = check(q, cwd)
            except Exception as e:      # a crash in checking is a failure too
                ok, detail = False, f'checker error: {e!r}'
            key = 'ok' if ok else 'unverified' if ok is None else 'FAIL'
            stats[q['template']][key] += 1
            if ok is False:
                failures.append((q, detail))
    for t, c in sorted(stats.items()):
        print(f'{t:20} ' + ' '.join(f'{k}={v}' for k, v in sorted(c.items())))
    total = Counter()
    for c in stats.values():
        total.update(c)
    print('TOTAL', dict(total))
    for q, detail in failures[:25]:
        print(f'\nFAIL #{q["id"]} [{q["template"]}] {q["question"]}\n{q.get("code", "")}\n'
              f'  marked correct: {sorted(correct_set(q))}\n  {detail}')
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()
