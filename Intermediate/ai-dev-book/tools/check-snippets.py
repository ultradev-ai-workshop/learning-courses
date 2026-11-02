"""Run every code block in the book with the current Python.

- Blocks with data-file="*.py" (or data-lang="python") run as scripts.
- Blocks with data-lang="pycon" (REPL sessions) run as doctests; the expected
  output shown in the book must match.  REPL blocks on one page share one
  namespace, like a single interpreter session.
- An output block may use ... to match anything (timings, IDs).
- data-norun skips a block (needs input, files, network, or is meant to fail).
- data-fresh starts a new REPL namespace for that block.
- data-save writes the block to data-file inside the page's work folder (not run).
- Shell blocks with data-run execute each `$ cmd` line there and compare output.

Every page's work folder starts with a copy of playground/ (llmkit.py and the docs/
corpus), and a mock Messages API runs for the whole check: ANTHROPIC_BASE_URL and
OPENAI_BASE_URL point at it, so code written for the real SDKs runs unchanged and offline.

FIX=1 rewrites output blocks that differ with the real output (review the printed diff!).

Usage:  ~/.local/share/aibook/venv/bin/python tools/check-snippets.py [page.html ...]
"""
import doctest
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLAYGROUND = os.path.join(ROOT, 'playground')
BLOCK = re.compile(r'<script type="text/plain" class="code"([^>]*)>(.*?)</script>', re.S)


def dedent(src):
    src = src.replace('<\\/script>', '</' + 'script>').replace('\t', '    ')
    lines = src.split('\n')
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    widths = [len(l) - len(l.lstrip(' ')) for l in lines if l.strip()]
    m = min(widths) if widths else 0
    return '\n'.join(l[m:] for l in lines)


def attr(attrs, name):
    m = re.search(name + r'="([^"]*)"', attrs)
    return m.group(1) if m else None


def lang_of(attrs):
    lang = attr(attrs, 'data-lang')
    if lang:
        return lang
    f = attr(attrs, 'data-file') or ''
    ext = f.rsplit('.', 1)[-1].lower() if '.' in f else ''
    return {'py': 'python', 'json': 'json', 'txt': 'text', 'sh': 'shell'}.get(ext, 'python' if not f else 'text')


def run_shell(code, workdir):
    """Run each `$ cmd` line; the lines after it are the expected output."""
    problems = []
    steps = []
    for line in code.split('\n'):
        if line.startswith('$ '):
            steps.append([line[2:], []])
        elif steps:
            steps[-1][1].append(line)
    env = dict(os.environ, PYTHONSTARTUP='', NO_COLOR='1', PYTHON_COLORS='0')
    for cmd, expected in steps:
        cmd = re.sub(r'\bpython3\b', sys.executable, cmd)
        r = subprocess.run(cmd, shell=True, cwd=workdir, stdout=subprocess.PIPE,
                           stderr=subprocess.STDOUT, text=True, timeout=90, env=env)
        got = r.stdout.strip()
        want = '\n'.join(expected).strip()
        if want and not doctest.OutputChecker().check_output(
                want + '\n', got + '\n', doctest.ELLIPSIS | doctest.NORMALIZE_WHITESPACE):
            problems.append(f'$ {cmd}\n--- book\n{want}\n--- real\n{got}')
    return problems


def check_page(path):
    text = open(path, encoding='utf-8').read()
    ok = fail = skip = 0
    fixes = []       # (start, end, new text) for FIX=1
    last_py = None   # (stdout, end offset) of the previous script block
    globs = {'__name__': '__main__'}
    parser = doctest.DocTestParser()
    flags = doctest.ELLIPSIS | doctest.NORMALIZE_WHITESPACE
    workdir = tempfile.mkdtemp(prefix='book-')    # shared by all blocks of this page
    shutil.copytree(PLAYGROUND, workdir, dirs_exist_ok=True, ignore=shutil.ignore_patterns('__pycache__', 'reference'))
    sys.path.insert(0, workdir)
    for i, m in enumerate(BLOCK.finditer(text), 1):
        attrs, code = m.group(1), dedent(m.group(2))
        lang = lang_of(attrs)
        line = text.count('\n', 0, m.start()) + 1
        where = f'{os.path.basename(path)}:{line} ({attr(attrs, "data-file") or lang})'
        if 'data-save' in attrs:
            # Write the block to the work folder (a module or data file used later).
            target = os.path.join(workdir, attr(attrs, 'data-file'))
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, 'w', encoding='utf-8') as f:
                f.write(code + '\n')
            skip += 1
            last_py = None
            continue
        if lang == 'text' and last_py and 'data-nocompare' not in attrs \
                and '<script' not in text[last_py[1]:m.start()]:
            # An output block right after a script block must match its real output.
            want, got = dedent(code), dedent(last_py[0])
            same = want == got or ('...' in want and doctest.OutputChecker().check_output(
                want + '\n', got + '\n', doctest.ELLIPSIS))
            if not same:
                fail += 1
                if os.environ.get('FIX'):
                    fixes.append((m.start(2), m.end(2), '\n' + dedent(last_py[0]).replace('</' + 'script>', '<\\/script>') + '\n'))
                print(f'FAIL {where}: output differs\n--- book\n{code.strip()}\n--- real\n{last_py[0].strip()}\n')
            else:
                ok += 1
            last_py = None
            continue
        last_py = None
        if lang == 'shell' and 'data-run' in attrs:
            problems = run_shell(code, workdir)
            if problems:
                fail += 1
                print(f'FAIL {where}\n' + '\n'.join(problems) + '\n')
            else:
                ok += 1
            continue
        if 'data-norun' in attrs or lang not in ('python', 'pycon'):
            skip += 1
            continue
        if lang == 'python':
            r = subprocess.run([sys.executable, '-c', code], cwd=workdir, capture_output=True,
                               text=True, timeout=90, input='')
            if r.returncode != 0:
                fail += 1
                print(f'FAIL {where}\n{r.stderr.strip()[-800:]}\n')
            else:
                ok += 1
                last_py = (r.stdout, m.end())
        else:
            if 'data-fresh' in attrs:
                globs = {'__name__': '__main__'}
            cwd = os.getcwd()
            os.chdir(workdir)
            try:
                test = parser.get_doctest(code, globs, where, path, 0)
                runner = doctest.DocTestRunner(optionflags=flags, verbose=False)
                out = []
                runner.run(test, out=out.append, clear_globs=False)
            finally:
                os.chdir(cwd)
            globs = test.globs
            if runner.failures:
                fail += 1
                print(f'FAIL {where}\n' + ''.join(out)[-1500:])
            else:
                ok += 1
    if fixes:
        for start, end, new in reversed(fixes):
            text = text[:start] + new + text[end:]
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'FIXED {len(fixes)} output block(s) in {os.path.basename(path)}')
    # Forget modules imported from this page's work folder.
    sys.path.remove(workdir)
    for name, mod in list(sys.modules.items()):
        if (getattr(mod, '__file__', None) or '').startswith(workdir):
            del sys.modules[name]
    shutil.rmtree(workdir, ignore_errors=True)
    return ok, fail, skip


def main():
    global anthropic
    try:
        import anthropic
    except ModuleNotFoundError:
        sys.exit('Run this with the book venv: ~/.local/share/aibook/venv/bin/python')
    sys.path.insert(0, PLAYGROUND)
    import llmkit
    server = llmkit.mock_api()
    url = server.__enter__()
    os.environ.update(ANTHROPIC_BASE_URL=url, ANTHROPIC_API_KEY='test',
                      OPENAI_BASE_URL=url + '/v1', OPENAI_API_KEY='test', PYDANTIC_AI_NO_BANNER='1')
    sys.path.remove(PLAYGROUND)
    del sys.modules['llmkit']
    pages = sys.argv[1:] or sorted(
        os.path.join(ROOT, f) for f in os.listdir(ROOT)
        if f.endswith('.html') and (f[0].isdigit() or f.startswith(('appendix', 'playground', 'glossary'))))
    total = [0, 0, 0]
    for p in pages:
        ok, fail, skip = check_page(p)
        total[0] += ok; total[1] += fail; total[2] += skip
        print(f'{os.path.basename(p):28} ok={ok:3} fail={fail:2} skipped={skip:2}')
    print(f'TOTAL ok={total[0]} fail={total[1]} skipped={total[2]}  (Python {sys.version.split()[0]}, anthropic {anthropic.__version__})')
    sys.exit(1 if total[1] else 0)


if __name__ == '__main__':
    main()
