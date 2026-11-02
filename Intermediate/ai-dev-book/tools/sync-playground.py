"""Copy the modules the chapters build (blocks with data-save and a .py/.txt file name) into
playground/, so later chapters, the project and readers can import them.

A module saved on several pages must have identical code everywhere; this script fails otherwise.
Usage:  python3 tools/sync-playground.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from importlib import import_module
check = import_module('check-snippets')

SKIP = {'mixing.py'}
found = {}
for page in sorted(f for f in os.listdir(ROOT) if re.match(r'\d\d-.*\.html$', f)):
    text = open(os.path.join(ROOT, page), encoding='utf-8').read()
    for m in check.BLOCK.finditer(text):
        attrs = m.group(1)
        name = check.attr(attrs, 'data-file')
        if 'data-save' not in attrs or not name or name in SKIP or not name.endswith(('.py', '.txt', '.jsonl')):
            continue
        code = check.dedent(m.group(2)) + '\n'
        if name in found and found[name][1] != code:
            sys.exit(f'{name}: different code in {found[name][0]} and {page}')
        found[name] = (page, code)
for name, (page, code) in sorted(found.items()):
    target = os.path.join(ROOT, 'playground', name)
    os.makedirs(os.path.dirname(target), exist_ok=True)
    old = open(target, encoding='utf-8').read() if os.path.exists(target) else None
    if old != code:
        with open(target, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f'updated playground/{name}  (from {page})')
print(f'{len(found)} modules in sync')
