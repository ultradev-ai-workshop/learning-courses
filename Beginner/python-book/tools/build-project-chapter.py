"""Build 16-project.html from a template, inlining the reference project's files.

The chapter's code blocks are copied from playground/reference/, so the book and
the runnable reference project can never drift apart.

Usage: python3 tools/build-project-chapter.py [tools/16-project.template.html]
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, "playground", "reference")


def block(rel):
    with open(os.path.join(REF, rel), encoding="utf-8") as f:
        code = f.read().rstrip("\n").replace("</" + "script>", "<\\/script>")
    return f'<script type="text/plain" class="code" data-file="{rel}" data-save>\n{code}\n</script>'


src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "tools", "16-project.template.html")
template = open(src, encoding="utf-8").read()
html = re.sub(r"\{\{file:([^}]+)\}\}", lambda m: block(m.group(1)), template)
with open(os.path.join(ROOT, "16-project.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("wrote 16-project.html")
