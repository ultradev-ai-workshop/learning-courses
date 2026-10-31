"""Build and run every code template in guide.html on the demo inputs and compare with the expected output.

Run:  python3 tools/check-guide.py      (needs python3, node, javac/java and g++ on PATH)
"""
import html, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUTS = {"io": ("3\n4 -1 10\n", "8 -2 20\ncount 3\n"),
          "oop": ("3\nADD ana 5\nSHOW ana\nSHOW bob\n", "ana 5\nERROR unknown name\n")}
# Large input to make sure the templates read everything (and quickly).
BIG = list(range(-50000, 50000))
INPUTS["io-big"] = (f"{len(BIG)}\n" + " ".join(map(str, BIG)) + "\n", " ".join(str(2 * x) for x in BIG) + f"\ncount {len(BIG)}\n")

page = open(os.path.join(ROOT, "guide.html")).read()
blocks = re.findall(r'<script type="text/plain" class="code"([^>]*)>(.*?)</script>', page, re.S)
bad = 0
for attrs, code in blocks:
    a = dict(re.findall(r'data-([\w-]+)="([^"]*)"', attrs))
    with tempfile.TemporaryDirectory() as d:
        with open(os.path.join(d, a["file"]), "w") as f: f.write(html.unescape(code) if "&lt;" in code else code)
        if a.get("build"):
            b = subprocess.run(a["build"], shell=True, cwd=d, capture_output=True, text=True)
            if b.returncode:
                print(f"FAIL {a['lang']} {a['file']}: build failed\n{b.stderr}"); bad += 1; continue
        cases = [a.get("input", "io")] + (["io-big"] if a.get("input", "io") == "io" else [])
        for case in cases:
            given, want = INPUTS[case]
            r = subprocess.run(a["run"], shell=True, cwd=d, input=given, capture_output=True, text=True, timeout=30)
            ok = r.stdout.replace("\r\n", "\n") == want and r.returncode == 0
            bad += not ok
            print(f"{'ok  ' if ok else 'FAIL'} {a['group']:>3} {a['lang']:<10} {case:<6} {r.stdout[:60]!r}" + ("" if ok else f" stderr={r.stderr[-300:]!r}"))
print(f"{len(blocks)} templates checked, {bad} failures")
sys.exit(1 if bad else 0)
