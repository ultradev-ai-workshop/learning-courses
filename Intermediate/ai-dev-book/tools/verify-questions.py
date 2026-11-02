"""Re-run every computed question's snippet and check that (1) it still prints the stored
value, (2) the marked option is that value, and (3) the value isn't also a distractor.

Usage:  ~/.local/share/aibook/venv/bin/python tools/verify-questions.py
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(ROOT, "questions.json"), encoding="utf-8"))
computed = [q for q in data["questions"] if "run" in q]
bad = 0
for q in computed:
    r = subprocess.run([sys.executable, "-c", q["run"]["code"]], capture_output=True, text=True, timeout=60,
                       cwd=os.path.join(ROOT, "playground"))
    got = r.stdout.strip()
    problems = []
    if r.returncode:
        problems.append("snippet failed: " + r.stderr.strip().splitlines()[-1])
    if got != q["run"]["expect"]:
        problems.append(f"result changed: {q['run']['expect']!r} -> {got!r}")
    marked = [q["options"][i] for i in q["answer"]]
    if marked != [got]:
        problems.append(f"marked {marked} but the snippet printed {got!r}")
    if [o for i, o in enumerate(q["options"]) if i not in q["answer"] and o == got]:
        problems.append("the computed value also appears as a distractor")
    for p in problems:
        bad += 1
        print(f"✘ #{q['id']} ({q['template']}): {p}")
print(f"{len(computed)} computed questions re-run: {bad and f'{bad} problem(s)' or 'all answers confirmed'}")
sys.exit(1 if bad else 0)
