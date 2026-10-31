"""Cross-check the trickier reference solvers against slow brute-force versions on random small inputs.

Run:  python3 tools/crosscheck.py   — prints one line per problem and exits non-zero on any mismatch.
"""
import heapq, itertools, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common, src_easy, src_medium, src_hard, src_oop  # noqa: F401
from common import out

SOLVE = {p["id"]: p["solve"] for p in common.PROBLEMS}
R = common.rng(2026)
def arr(n, lo, hi): return [R.randint(lo, hi) for _ in range(n)]
def nums(xs): return " ".join(map(str, xs))

def m02(t):
    (n, target), a = map(int, t.split("\n")[0].split()), list(map(int, t.split("\n")[1].split()))
    for j in range(len(a)):
        for i in range(j):
            if a[i] + a[j] == target: return out(f"{i} {j}")
    return out("NONE")
def m02_in():
    n = R.randint(1, 8); return f"{n} {R.randint(-6, 6)}\n{nums(arr(n, -4, 4))}\n"

def m03(t):
    s = t.strip("\n"); best = ""
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            if len(set(s[i:j])) == j - i and j - i > len(best): best = s[i:j]
    return out(f"{len(best)} {best}")
def m03_in(): return "".join(R.choice("abcd") for _ in range(R.randint(1, 12))) + "\n"

def m13(t):
    a = list(map(int, t.split("\n")[1].split())); best = None
    for i in range(len(a)):
        for j in range(i, len(a)):
            s = sum(a[i:j + 1])
            if best is None or s > best[0]: best = (s, i, j)
    return out(nums(best))
def m13_in(): n = R.randint(1, 9); return f"{n}\n{nums(arr(n, -5, 5))}\n"

def h01(t):
    a = list(map(int, t.split("\n")[1].split())); d = [1] * len(a)
    for i in range(len(a)):
        for j in range(i):
            if a[j] < a[i]: d[i] = max(d[i], d[j] + 1)
    return out(max(d, default=0))
def h01_in(): n = R.randint(1, 10); return f"{n}\n{nums(arr(n, 0, 6))}\n"

def h02(t):
    a, b = (t.split("\n") + ["", ""])[:2]
    def go(i, j):
        if i == len(a): return len(b) - j
        if j == len(b): return len(a) - i
        if a[i] == b[j]: return go(i + 1, j + 1)
        return 1 + min(go(i + 1, j), go(i, j + 1), go(i + 1, j + 1))
    return out(go(0, 0))
def h02_in(): w = lambda: "".join(R.choice("ab") for _ in range(R.randint(0, 6))); return f"{w()}\n{w()}\n"

def h03(t):
    ls = t.strip("\n").split("\n"); n, W = map(int, ls[0].split()); items = [tuple(map(int, x.split())) for x in ls[1:1 + n]]
    return out(max(sum(v for w, v in c) for k in range(n + 1) for c in itertools.combinations(items, k) if sum(w for w, v in c) <= W))
def h03_in(): n = R.randint(1, 7); return f"{n} {R.randint(0, 15)}\n" + "".join(f"{R.randint(1, 8)} {R.randint(0, 20)}\n" for _ in range(n))

def h04(t):
    ls = t.split("\n"); n, amount = map(int, ls[0].split()); coins = sorted(map(int, ls[1].split()))
    ways, best = 0, None
    def go(i, left, used):
        nonlocal ways, best
        if left == 0: ways += 1; best = used if best is None else min(best, used); return
        if i == len(coins): return
        for k in range(left // coins[i] + 1): go(i + 1, left - k * coins[i], used + k)
    go(0, amount, 0)
    return out(best if best is not None else -1, ways % 1_000_000_007)
def h04_in():
    n = R.randint(1, 4); return f"{n} {R.randint(0, 25)}\n{nums(R.sample(range(1, 12), n))}\n"

def h05(t):
    a, b = t.split("\n")[:2]
    return out(max((k for k in range(min(len(a), len(b)) + 1) for c in itertools.combinations(a, k) if re.search(".*".join(map(re.escape, c)), b)), default=0))
def h05_in(): w = lambda: "".join(R.choice("abc") for _ in range(R.randint(1, 7))); return f"{w()}\n{w()}\n"

def h06(t):  # Bellman-Ford
    ls = t.strip("\n").split("\n"); n, m, s = map(int, ls[0].split()); E = [tuple(map(int, x.split())) for x in ls[1:1 + m]]
    d = [None] * (n + 1); d[s] = 0
    for _ in range(n):
        for u, v, w in E:
            for a, b in ((u, v), (v, u)):
                if d[a] is not None and (d[b] is None or d[a] + w < d[b]): d[b] = d[a] + w
    return out(" ".join("INF" if x is None else str(x) for x in d[1:]))
def h06_in():
    n = R.randint(1, 6); m = R.randint(0, 9); return f"{n} {m} {R.randint(1, n)}\n" + "".join(f"{R.randint(1, n)} {R.randint(1, n)} {R.randint(0, 9)}\n" for _ in range(m))

def h10(t):  # Prim
    ls = t.strip("\n").split("\n"); n, m = map(int, ls[0].split()); adj = [[] for _ in range(n + 1)]
    for x in ls[1:1 + m]:
        u, v, w = map(int, x.split()); adj[u].append((w, v)); adj[v].append((w, u))
    seen, total, h = set(), 0, [(0, 1)]
    while h:
        w, u = heapq.heappop(h)
        if u in seen: continue
        seen.add(u); total += w
        for e in adj[u]: heapq.heappush(h, e)
    return out(total if len(seen) == n else "IMPOSSIBLE")
def h10_in():
    n = R.randint(1, 6); m = R.randint(0, 10); return f"{n} {m}\n" + "".join(f"{R.randint(1, n)} {R.randint(1, n)} {R.randint(1, 9)}\n" for _ in range(m))

def h12(t):
    a = list(map(int, t.split("\n")[1].split()))
    return out(sum(max(0, min(max(a[:i + 1]), max(a[i:])) - a[i]) for i in range(len(a))))
def h12_in(): n = R.randint(1, 10); return f"{n}\n{nums(arr(n, 0, 6))}\n"

def h13(t):
    a = list(map(int, t.split("\n")[1].split())); res = []
    for i in range(1, len(a) + 1):
        s = sorted(a[:i]); x = s[i // 2] if i % 2 else (s[i // 2 - 1] + s[i // 2]) / 2
        res.append(str(int(x)) if x == int(x) else f"{x:.1f}")
    return out(*res)
def h13_in(): n = R.randint(1, 9); return f"{n}\n{nums(arr(n, -5, 5))}\n"

def h14(t):
    ls = t.split("\n"); n, k = map(int, ls[0].split()); a = list(map(int, ls[1].split()))
    return out(nums(max(a[i:i + k]) for i in range(n - k + 1)))
def h14_in(): n = R.randint(1, 9); return f"{n} {R.randint(1, n)}\n{nums(arr(n, -5, 5))}\n"

def h15(t):
    a = list(map(int, t.split("\n")[1].split()))
    return out(sum(a[i] > a[j] for i in range(len(a)) for j in range(i + 1, len(a))))
def h15_in(): n = R.randint(1, 10); return f"{n}\n{nums(arr(n, 0, 5))}\n"

def h16(t):
    s = t.strip("\n"); best = s[:1]
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            if s[i:j] == s[i:j][::-1] and j - i > len(best): best = s[i:j]
    return out(f"{len(best)} {best}")
def h16_in(): return "".join(R.choice("aab") for _ in range(R.randint(1, 12))) + "\n"

def h17(t):
    res = []
    for x in t.strip("\n").split("\n")[1:]:
        s, p = x.split(" "); s, p = ("" if s == "-" else s), ("" if p == "-" else p)
        res.append("MATCH" if re.fullmatch(p, s) else "NO MATCH")
    return out(*res)
def h17_in():
    q = 6; rows = []
    for _ in range(q):
        s = "".join(R.choice("ab") for _ in range(R.randint(0, 5))); p = ""
        for _ in range(R.randint(0, 4)): p += R.choice("ab.") + ("*" if R.random() < .4 else "")
        rows.append(f"{s or '-'} {p or '-'}")
    return f"{q}\n" + "\n".join(rows) + "\n"

def h20(t):
    d = list(map(int, t.split("\n")[1].split()))
    def go(i, j):
        if j - i == 1: return 0
        return min(go(i, k) + go(k, j) + d[i] * d[k] * d[j] for k in range(i + 1, j))
    return out(go(0, len(d) - 1))
def h20_in(): n = R.randint(2, 7); return f"{n}\n{nums(arr(n, 1, 9))}\n"

def h21(t):
    a = list(map(int, t.split("\n")[1].split()))
    return out(max((min(a[i:j + 1]) * (j - i + 1) for i in range(len(a)) for j in range(i, len(a))), default=0))
def h21_in(): n = R.randint(1, 9); return f"{n}\n{nums(arr(n, 0, 6))}\n"

def h23(t):
    s, tt = t.split("\n")[:2]; from collections import Counter
    need = Counter(tt); best = None
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            if not need - Counter(s[i:j]) and (best is None or j - i < len(best)): best = s[i:j]
    return out(best or "NONE")
def h23_in(): w = lambda a, b: "".join(R.choice("abC") for _ in range(R.randint(a, b))); return f"{w(1, 10)}\n{w(1, 3)}\n"

def h25(t):
    ls = t.strip("\n").split("\n"); jobs = [tuple(map(int, x.split())) for x in ls[1:1 + int(ls[0])]]; best = 0
    for k in range(len(jobs) + 1):
        for c in itertools.combinations(sorted(jobs), k):
            if all(c[i][1] <= c[i + 1][0] for i in range(len(c) - 1)): best = max(best, sum(x[2] for x in c))
    return out(best)
def h25_in():
    n = R.randint(1, 7); rows = []
    for _ in range(n): a = R.randint(0, 9); rows.append(f"{a} {a + R.randint(1, 5)} {R.randint(1, 20)}")
    return f"{n}\n" + "\n".join(rows) + "\n"

CHECKS = {k.upper(): (v, globals()[k + "_in"]) for k, v in list(globals().items()) if k[0] in "mh" and k[1:].isdigit() and callable(v)}

bad = 0
for pid, (brute, gen) in sorted(CHECKS.items()):
    fails = 0
    for _ in range(400):
        t = gen(); a, b = SOLVE[pid](t), brute(t)
        if a != b:
            fails += 1
            if fails == 1: print(f"{pid} MISMATCH on input:\n{t}reference: {a!r}\nbrute:     {b!r}")
    bad += fails > 0
    print(f"{pid}: {'ok' if not fails else f'{fails} mismatches'} (400 random cases)")
sys.exit(1 if bad else 0)
