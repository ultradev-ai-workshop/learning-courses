"""Hard problems H01–H25: dynamic programming, graphs, backtracking and advanced data structures."""
import bisect
import heapq
from collections import deque, defaultdict
from functools import lru_cache
from common import P, rng, lines, ints, out

def rand_list(seed, n, lo, hi):
    r = rng(seed); return [r.randint(lo, hi) for _ in range(n)]

# ---------------------------------------------------------------- H01
def h01(t):
    xs = ints(lines(t)[1]); tails = []
    for x in xs:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return out(len(tails))
P("H01", "Longest Increasing Subsequence", "hard", ["dynamic programming", "binary search"], ["patience sorting", "O(n log n) DP"],
  "Find the length of the longest <strong>strictly</strong> increasing subsequence (elements need not be contiguous). An O(n²) solution passes the small tests; the largest test needs O(n log n).",
  "The first line contains <code>n</code>; the second contains <code>n</code> integers.", "One integer: the length.", ["1 ≤ n ≤ 2·10<sup>5</sup>", "|value| ≤ 10<sup>9</sup>"],
  [("8\n10 9 2 5 3 7 101 18\n", "One longest subsequence is 2 3 7 101 (length 4).")],
  lambda: ["1\n5\n", "5\n5 4 3 2 1\n", "6\n1 1 1 1 1 1\n", "7\n0 8 4 12 2 10 6\n", "3000\n" + " ".join(map(str, rand_list(101, 3000, -10**6, 10**6))) + "\n",
           "100000\n" + " ".join(map(str, rand_list(102, 100000, -10**9, 10**9))) + "\n"], h01,
  hints=["Keep tails[k] = the smallest possible tail of an increasing subsequence of length k + 1; each new value replaces the first tail ≥ it."])

# ---------------------------------------------------------------- H02
def edit(a, b):
    prev = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        cur = [i] + [0] * len(b)
        for j in range(1, len(b) + 1):
            cur[j] = prev[j - 1] if a[i - 1] == b[j - 1] else 1 + min(prev[j - 1], prev[j], cur[j - 1])
        prev = cur
    return prev[-1]
def h02(t):
    a, b = (lines(t) + [""])[:2]
    return out(edit(a, b))
P("H02", "Edit Distance", "hard", ["dynamic programming", "strings"], ["2-D DP", "memory optimisation"],
  "The edit (Levenshtein) distance is the minimum number of single-character insertions, deletions and substitutions that turn string A into string B. Print it.",
  "Two lines: A and B (either may be empty).", "One integer.", ["0 ≤ |A|, |B| ≤ 2000"],
  [("horse\nros\n", "horse → rorse (substitute h) → rose (delete r) → ros (delete e): 3."), ("intention\nexecution\n", "5 operations.")],
  ["\nabc\n", "same\nsame\n", "kitten\nsitting\n", "a\n\n", "abcdefghij\njihgfedcba\n", "x" * 1500 + "\n" + "y" * 1500 + "\n"], h02,
  hints=["dp[i][j] = distance between the first i chars of A and the first j chars of B. Only the previous row is needed."])

# ---------------------------------------------------------------- H03
def h03(t):
    l = lines(t); n, W = ints(l[0]); dp = [0] * (W + 1)
    for line in l[1:1 + n]:
        w, v = ints(line)
        for c in range(W, w - 1, -1): dp[c] = max(dp[c], dp[c - w] + v)
    return out(dp[W])
def h03_tests():
    r = rng(103); items = "\n".join(f"{r.randint(1, 1000)} {r.randint(1, 10**6)}" for _ in range(100))
    return ["1 5\n10 100\n", "3 0\n1 1\n2 2\n3 3\n", "4 10\n5 10\n4 40\n6 30\n3 50\n", f"100 10000\n{items}\n"]
P("H03", "0/1 Knapsack", "hard", ["dynamic programming"], ["capacity DP", "iterating capacity downwards"],
  "You have <code>n</code> items with weight and value, and a bag with capacity <code>W</code>. Each item can be taken at most once. Print the maximum total value whose total weight does not exceed W.",
  "The first line has <code>n W</code>; then <code>n</code> lines <code>weight value</code>.", "One integer: the maximum value.", ["1 ≤ n ≤ 100", "0 ≤ W ≤ 10<sup>4</sup>", "1 ≤ weight ≤ 1000, 1 ≤ value ≤ 10<sup>6</sup>"],
  [("4 7\n1 1\n3 4\n4 5\n5 7\n", "Take the items of weight 3 and 4: value 4 + 5 = 9.")], h03_tests, h03,
  hints=["dp[c] = best value with capacity c; loop c from W down to the item's weight so each item is used once."])

# ---------------------------------------------------------------- H04
def h04(t):
    l = lines(t); n, amount = ints(l[0]); coins = ints(l[1]); INF = float("inf"); dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]: dp[a] = dp[a - c] + 1
    ways = [1] + [0] * amount
    for c in coins:
        for a in range(c, amount + 1): ways[a] = (ways[a] + ways[a - c]) % 1_000_000_007
    return out(dp[amount] if dp[amount] != INF else -1, ways[amount])
P("H04", "Coin Change", "hard", ["dynamic programming"], ["unbounded knapsack", "counting combinations"],
  "With unlimited coins of the given denominations, print (1) the minimum number of coins that make exactly <code>amount</code>, or <code>-1</code> if impossible, and (2) the number of different combinations (order doesn't matter) that make the amount, modulo 1 000 000 007.",
  "The first line has <code>n amount</code>; the second has <code>n</code> distinct coin values.", "Two lines: minimum coins, then the number of combinations.",
  ["1 ≤ n ≤ 100", "0 ≤ amount ≤ 10<sup>4</sup>", "1 ≤ coin ≤ 10<sup>4</sup>"],
  [("3 11\n1 2 5\n", "11 = 5 + 5 + 1 uses 3 coins; there are 11 combinations in total."), ("1 3\n2\n", "3 can't be made from 2s: −1, and 0 combinations.")],
  ["2 0\n3 7\n", "4 100\n1 5 10 25\n", "3 10000\n7 13 29\n", "5 9999\n2 4 6 8 10\n"], h04,
  hints=["For counting combinations, loop over coins in the outer loop — that counts each multiset once instead of each ordering."])

# ---------------------------------------------------------------- H05
def h05(t):
    a, b = (lines(t) + [""])[:2]
    prev = [0] * (len(b) + 1)
    for i in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            cur[j] = prev[j - 1] + 1 if a[i - 1] == b[j - 1] else max(prev[j], cur[j - 1])
        prev = cur
    return out(prev[-1])
P("H05", "Longest Common Subsequence", "hard", ["dynamic programming", "strings"], ["2-D DP"],
  "Print the length of the longest common subsequence of two strings (characters in the same relative order, not necessarily contiguous).",
  "Two lines with strings A and B.", "One integer.", ["0 ≤ |A|, |B| ≤ 3000"],
  [("ABCBDAB\nBDCABA\n", "One LCS is BCBA (length 4).")], ["abc\ndef\n", "same\nsame\n", "\nabc\n", "AGGTAB\nGXTXAYB\n", "ab" * 1000 + "\n" + "ba" * 1000 + "\n"], h05)

# ---------------------------------------------------------------- H06
def h06(t):
    l = lines(t); n, m, s = ints(l[0]); g = defaultdict(list)
    for line in l[1:1 + m]:
        u, v, w = ints(line); g[u].append((v, w)); g[v].append((u, w))
    dist = [None] * (n + 1); dist[s] = 0; pq = [(0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in g[u]:
            if dist[v] is None or d + w < dist[v]: dist[v] = d + w; heapq.heappush(pq, (d + w, v))
    return out(" ".join("INF" if d is None else str(d) for d in dist[1:]))
def h06_tests():
    r = rng(106); n, m = 2000, 8000
    edges = "\n".join(f"{r.randint(1, n)} {r.randint(1, n)} {r.randint(1, 10**6)}" for _ in range(m))
    return ["1 0 1\n", "3 1 1\n1 2 5\n", "4 5 2\n1 2 1\n2 3 2\n1 3 10\n3 4 1\n1 4 100\n", f"{n} {m} 1\n{edges}\n"]
P("H06", "Shortest Paths (Dijkstra)", "hard", ["graphs", "priority queue"], ["Dijkstra's algorithm", "binary heap"],
  "An undirected graph has <code>n</code> nodes (1…n) and <code>m</code> weighted edges with non-negative weights. Print the shortest distance from node <code>s</code> to every node, or <code>INF</code> if unreachable.",
  "The first line has <code>n m s</code>; then <code>m</code> lines <code>u v w</code>. Multiple edges and self-loops may occur.", "One line with <code>n</code> values (distance to node 1, 2, …, n).",
  ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ m ≤ 2·10<sup>5</sup>", "0 ≤ w ≤ 10<sup>6</sup> (distances need 64 bits)"],
  [("5 6 1\n1 2 4\n1 3 1\n3 2 2\n2 4 1\n3 4 5\n4 5 3\n", "1→3→2 costs 3, cheaper than the direct edge of 4; node 5 is reached via 4 (cost 7).")], h06_tests, h06,
  hints=["Use a priority queue keyed by distance and skip stale entries whose distance is larger than the best known."])

# ---------------------------------------------------------------- H07
def h07(t):
    l = lines(t); n, m = ints(l[0]); g = defaultdict(list); indeg = [0] * (n + 1)
    for line in l[1:1 + m]:
        u, v = ints(line); g[u].append(v); indeg[v] += 1
    pq = [i for i in range(1, n + 1) if indeg[i] == 0]; heapq.heapify(pq); order = []
    while pq:
        u = heapq.heappop(pq); order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: heapq.heappush(pq, v)
    return out(" ".join(map(str, order)) if len(order) == n else "CYCLE")
P("H07", "Task Ordering (Topological Sort)", "hard", ["graphs"], ["Kahn's algorithm", "cycle detection", "min-heap"],
  "Tasks 1…n have dependencies <code>u v</code> meaning u must be done before v. Print an order that respects every dependency; if several exist, print the <strong>lexicographically smallest</strong> one (always pick the smallest available task). Print <code>CYCLE</code> if no valid order exists.",
  "The first line has <code>n m</code>; then <code>m</code> lines <code>u v</code>.", "The order, space-separated, or <code>CYCLE</code>.",
  ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ m ≤ 2·10<sup>5</sup>"],
  [("5 4\n3 1\n3 2\n1 4\n2 4\n", "Only 3 and 5 are available at first; pick 3, then 1, 2, 4, 5.")], ["1 0\n", "3 3\n1 2\n2 3\n3 1\n", "4 0\n", "6 6\n6 3\n6 1\n5 1\n5 2\n3 4\n4 2\n"], h07,
  hints=["Kahn's algorithm with a min-heap instead of a plain queue gives the smallest order."])

# ---------------------------------------------------------------- H08
def h08(t):
    n = int(t); count = 0; first = None
    cols, d1, d2, place = set(), set(), set(), []
    def rec(r):
        nonlocal count, first
        if r == n:
            count += 1
            if first is None: first = place[:]
            return
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2: continue
            cols.add(c); d1.add(r - c); d2.add(r + c); place.append(c)
            rec(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c); place.pop()
    rec(0)
    board = ["".join("Q" if first[r] == c else "." for c in range(n)) for r in range(n)] if first else []
    return out(count, *board)
P("H08", "N-Queens", "hard", ["backtracking"], ["backtracking", "constraint sets"],
  "Place <code>n</code> queens on an n × n board so that no two attack each other (same row, column or diagonal). Print the number of solutions, then the <em>first</em> solution in lexicographic order of column positions (rows top to bottom, <code>Q</code> for a queen, <code>.</code> otherwise). If there is no solution, print only 0.",
  "One integer <code>n</code>.", "The count, then n board lines if a solution exists.", ["1 ≤ n ≤ 11"],
  [("4\n", "There are 2 solutions; the first places queens in columns 2, 4, 1, 3 (1-based).")], ["1\n", "2\n", "3\n", "6\n", "8\n", "10\n"], h08,
  hints=["Try columns left to right in each row, and keep sets of used columns and diagonals (r − c and r + c)."])

# ---------------------------------------------------------------- H09
def h09(t):
    g = [list(map(int, x.split())) for x in lines(t)[:9]]
    def legal(r, c):
        used = set(g[r]) | {g[i][c] for i in range(9)} | {g[i][j] for i in range(r // 3 * 3, r // 3 * 3 + 3) for j in range(c // 3 * 3, c // 3 * 3 + 3)}
        return [v for v in range(1, 10) if v not in used]
    def solve():
        best = None
        for r in range(9):
            for c in range(9):
                if g[r][c] == 0:
                    opts = legal(r, c)
                    if best is None or len(opts) < len(best[2]): best = (r, c, opts)
        if best is None: return True
        r, c, opts = best
        for v in opts:
            g[r][c] = v
            if solve(): return True
        g[r][c] = 0
        return False
    def givens_ok():
        for r in range(9):
            for c in range(9):
                v = g[r][c]
                if v:
                    g[r][c] = 0; fine = v in legal(r, c); g[r][c] = v
                    if not fine: return False
        return True
    return out(*[" ".join(map(str, row)) for row in g]) if givens_ok() and solve() else out("NO SOLUTION")
PUZ1 = """5 3 0 0 7 0 0 0 0
6 0 0 1 9 5 0 0 0
0 9 8 0 0 0 0 6 0
8 0 0 0 6 0 0 0 3
4 0 0 8 0 3 0 0 1
7 0 0 0 2 0 0 0 6
0 6 0 0 0 0 2 8 0
0 0 0 4 1 9 0 0 5
0 0 0 0 8 0 0 7 9
"""
PUZ2 = """0 0 0 0 0 0 0 1 2
0 0 0 0 3 5 0 0 0
0 0 0 6 0 0 0 7 0
7 0 0 0 0 0 3 0 0
0 0 0 4 0 0 8 0 0
1 0 0 0 0 0 0 0 0
0 0 0 1 2 0 0 0 0
0 8 0 0 0 0 0 4 0
0 5 0 0 0 0 6 0 0
"""
PUZ3 = """0 2 0 6 0 8 0 0 0
5 8 0 0 0 9 7 0 0
0 0 0 0 4 0 0 0 0
3 7 0 0 0 0 5 0 0
6 0 0 0 0 0 0 0 4
0 0 8 0 0 0 0 1 3
0 0 0 0 2 0 0 0 0
0 0 9 8 0 0 0 3 6
0 0 0 3 0 6 0 9 0
"""
UNSOLVABLE = PUZ1.replace("5 3 0 0 7 0 0 0 0", "5 3 0 0 7 0 0 0 4").replace("0 0 0 0 8 0 0 7 9", "0 0 0 0 8 0 4 7 9")
P("H09", "Sudoku Solver", "hard", ["backtracking"], ["backtracking", "constraint checking"],
  "Fill the empty cells (0) of a 9 × 9 Sudoku so that every row, column and 3 × 3 box contains the digits 1–9 exactly once. The given puzzles have exactly one solution, except one test with none (its givens are already contradictory or lead to a dead end) — print <code>NO SOLUTION</code> for it.",
  "Nine lines of nine digits separated by spaces.", "The solved grid in the same format, or <code>NO SOLUTION</code>.", ["exactly 9 × 9"],
  [(PUZ1, "A classic puzzle; the solved grid starts 5 3 4 6 7 8 9 1 2.")], [PUZ3, PUZ2, UNSOLVABLE], h09,
  hints=["Backtracking: find an empty cell, try each digit that is legal, recurse, and undo on failure.", "Choosing the empty cell with the fewest legal digits first makes hard puzzles much faster — one test is a puzzle built to defeat naive left-to-right backtracking."])

# ---------------------------------------------------------------- H10
def h10(t):
    l = lines(t); n, m = ints(l[0]); edges = sorted((w, u, v) for u, v, w in (ints(x) for x in l[1:1 + m]))
    parent = list(range(n + 1))
    def find(x):
        while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
        return x
    total = used = 0
    for w, u, v in edges:
        a, b = find(u), find(v)
        if a != b: parent[a] = b; total += w; used += 1
    return out(total if used == n - 1 else "IMPOSSIBLE")
def h10_tests():
    r = rng(110); n = 500
    edges = [f"{i} {r.randint(1, i - 1)} {r.randint(1, 10**6)}" for i in range(2, n + 1)] + [f"{r.randint(1, n)} {r.randint(1, n)} {r.randint(1, 10**6)}" for _ in range(2000)]
    return ["1 0\n", "3 1\n1 2 5\n", "4 6\n1 2 1\n2 3 1\n3 4 1\n1 3 1\n2 4 1\n1 4 1\n", f"{n} {len(edges)}\n" + "\n".join(edges) + "\n"]
P("H10", "Minimum Spanning Tree", "hard", ["graphs", "union-find"], ["Kruskal's algorithm", "disjoint set union"],
  "Connect all <code>n</code> cities with roads of minimum total cost. Given the possible undirected roads with costs, print the total cost of a minimum spanning tree, or <code>IMPOSSIBLE</code> if the cities can't all be connected.",
  "The first line has <code>n m</code>; then <code>m</code> lines <code>u v cost</code>.", "One integer or <code>IMPOSSIBLE</code>.", ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ m ≤ 2·10<sup>5</sup>", "1 ≤ cost ≤ 10<sup>6</sup>"],
  [("4 5\n1 2 3\n2 3 1\n3 4 4\n1 3 2\n2 4 5\n", "Choose 2–3 (1), 1–3 (2) and 3–4 (4): total 7.")], h10_tests, h10,
  hints=["Sort edges by cost and add each one that connects two different components (union-find with path compression)."])

# ---------------------------------------------------------------- H11
def h11(t):
    l = lines(t); words = set(l[1].split()); res = []
    for s in l[3:]:
        n = len(s); ways = [0] * (n + 1); ways[0] = 1
        for i in range(1, n + 1):
            for j in range(max(0, i - 20), i):
                if ways[j] and s[j:i] in words: ways[i] = (ways[i] + ways[j]) % 1_000_000_007
        res.append(f"{'YES' if ways[n] else 'NO'} {ways[n]}")
    return out(*res)
P("H11", "Word Break", "hard", ["dynamic programming", "strings"], ["prefix DP", "counting segmentations"],
  "Given a dictionary, decide whether each query string can be split into a sequence of dictionary words (words may be reused), and count the number of different ways to split it (mod 1 000 000 007).",
  "Line 1: <code>d</code>. Line 2: <code>d</code> dictionary words (length ≤ 20). Line 3: <code>q</code>. Then <code>q</code> query strings, one per line.", "<code>q</code> lines: <code>YES ways</code> or <code>NO 0</code>.",
  ["1 ≤ d ≤ 1000", "1 ≤ q ≤ 100", "1 ≤ query length ≤ 5000", "all lower-case letters"],
  [("5\ncat cats and sand dog\n2\ncatsanddog\ncatsandog\n", "catsanddog = cats·and·dog = cat·sand·dog (2 ways); catsandog can't be split.")],
  ["3\na aa aaa\n2\naaaa\nb\n", "2\napple pen\n1\napplepenapple\n", "2\na b\n1\n" + "ab" * 2500 + "\n"], h11,
  hints=["ways[i] = number of ways to split the first i characters; only look back as far as the longest word."])

# ---------------------------------------------------------------- H12
def h12(t):
    h = ints(lines(t)[1]); l, r, lm, rm, water = 0, len(h) - 1, 0, 0, 0
    while l < r:
        if h[l] < h[r]:
            lm = max(lm, h[l]); water += lm - h[l]; l += 1
        else:
            rm = max(rm, h[r]); water += rm - h[r]; r -= 1
    return out(water)
P("H12", "Trapping Rain Water", "hard", ["arrays", "two pointers"], ["two pointers", "prefix maxima"],
  "Bars of width 1 have the given heights. After rain, how many units of water are trapped between them?",
  "The first line contains <code>n</code>; the second contains <code>n</code> non-negative heights.", "One integer (may need 64 bits).", ["1 ≤ n ≤ 2·10<sup>5</sup>", "0 ≤ height ≤ 10<sup>9</sup>"],
  [("12\n0 1 0 2 1 0 1 3 2 1 2 1\n", "6 units of water fill the dips.")],
  lambda: ["1\n5\n", "3\n3 0 3\n", "5\n5 4 3 2 1\n", "6\n4 2 0 3 2 5\n", "5000\n" + " ".join(map(str, rand_list(112, 5000, 0, 10**9))) + "\n"], h12,
  hints=["Water above bar i = min(highest bar to its left, highest to its right) − height[i]."])

# ---------------------------------------------------------------- H13
def h13(t):
    xs = ints(lines(t)[1]); lo, hi, res = [], [], []
    for x in xs:
        if not lo or x <= -lo[0]: heapq.heappush(lo, -x)
        else: heapq.heappush(hi, x)
        if len(lo) > len(hi) + 1: heapq.heappush(hi, -heapq.heappop(lo))
        elif len(hi) > len(lo): heapq.heappush(lo, -heapq.heappop(hi))
        if len(lo) > len(hi): res.append(str(-lo[0]))
        else:
            s = -lo[0] + hi[0]
            res.append(str(s // 2) if s % 2 == 0 else f"{s / 2:.1f}")
    return out(*res)
P("H13", "Running Median", "hard", ["heaps"], ["two heaps", "balancing"],
  "Numbers arrive one at a time. After each arrival print the median of all numbers so far. For an even count the median is the average of the two middle values: print it as an integer if it is whole, otherwise with exactly one decimal (it always ends in .5), e.g. <code>2.5</code> or <code>-0.5</code>.",
  "The first line contains <code>n</code>; the second contains <code>n</code> integers.", "<code>n</code> lines.", ["1 ≤ n ≤ 10<sup>5</sup>", "|value| ≤ 10<sup>9</sup>"],
  [("5\n5 15 1 3 8\n", "Medians: 5, (5+15)/2 = 10, 5, (3+5)/2 = 4, 5.")],
  lambda: ["1\n7\n", "2\n1 2\n", "4\n-1 0 -3 -2\n", "6\n1 1 1 1 1 1\n", "300\n" + " ".join(map(str, rand_list(113, 300, -1000, 1000))) + "\n"], h13,
  hints=["Keep a max-heap of the lower half and a min-heap of the upper half, with sizes differing by at most one."])

# ---------------------------------------------------------------- H14
def h14(t):
    l = lines(t); n, k = ints(l[0]); xs = ints(l[1]); dq, res = deque(), []
    for i, x in enumerate(xs):
        while dq and xs[dq[-1]] <= x: dq.pop()
        dq.append(i)
        if dq[0] <= i - k: dq.popleft()
        if i >= k - 1: res.append(xs[dq[0]])
    return out(" ".join(map(str, res)))
P("H14", "Sliding Window Maximum", "hard", ["queues", "arrays"], ["monotonic deque", "amortised O(n)"],
  "For every window of <code>k</code> consecutive elements, print its maximum. An O(n·k) approach is too slow for the largest test.",
  "The first line has <code>n k</code>; the second has <code>n</code> integers.", "<code>n − k + 1</code> maxima, space-separated.", ["1 ≤ k ≤ n ≤ 2·10<sup>5</sup>"],
  [("8 3\n1 3 -1 -3 5 3 6 7\n", "Windows [1 3 −1], [3 −1 −3], … have maxima 3 3 5 5 6 7.")],
  lambda: ["1 1\n4\n", "5 5\n1 2 3 4 5\n", "5 1\n5 4 3 2 1\n", "6 2\n2 2 2 2 2 2\n", "20000 50\n" + " ".join(map(str, rand_list(114, 20000, -10**6, 10**6))) + "\n"], h14,
  hints=["Keep indices in a deque whose values are decreasing; the front is the window maximum."])

# ---------------------------------------------------------------- H15
def h15(t):
    xs = ints(lines(t)[1])
    def sort(a):
        if len(a) <= 1: return a, 0
        m = len(a) // 2; L, x = sort(a[:m]); R, y = sort(a[m:]); res, i, j, inv = [], 0, 0, x + y
        while i < len(L) and j < len(R):
            if L[i] <= R[j]: res.append(L[i]); i += 1
            else: res.append(R[j]); j += 1; inv += len(L) - i
        return res + L[i:] + R[j:], inv
    return out(sort(xs)[1])
P("H15", "Count Inversions", "hard", ["sorting", "divide and conquer"], ["merge sort", "counting during merge"],
  "An inversion is a pair of positions <code>i &lt; j</code> with <code>a[i] &gt; a[j]</code>. Count the inversions. The largest test needs O(n log n).",
  "The first line contains <code>n</code>; the second contains <code>n</code> integers.", "One integer (up to ~2·10<sup>10</sup>: use 64 bits).", ["1 ≤ n ≤ 2·10<sup>5</sup>"],
  [("5\n2 4 1 3 5\n", "Inversions: (2,1), (4,1), (4,3) → 3.")],
  lambda: ["1\n1\n", "4\n1 2 3 4\n", "4\n4 3 2 1\n", "5\n2 2 2 1 1\n", "50000\n" + " ".join(map(str, rand_list(115, 50000, 1, 10**9))) + "\n"], h15,
  hints=["While merging two sorted halves, taking an element from the right half creates an inversion with every element still left in the left half."])

# ---------------------------------------------------------------- H16
def h16(t):
    s = t.rstrip("\n"); best = (0, 1)
    for c in range(len(s)):
        for l, r in ((c, c), (c, c + 1)):
            while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
            if r - l - 1 > best[1] - best[0]: best = (l + 1, r)
    return out(f"{best[1] - best[0]} {s[best[0]:best[1]]}")
P("H16", "Longest Palindromic Substring", "hard", ["strings", "dynamic programming"], ["expand around centre"],
  "Find the longest contiguous substring that is a palindrome (case-sensitive, all characters count). Print its length and the substring; if several have the maximum length, print the one that starts first.",
  "One line with a string of letters and digits.", "<code>length substring</code>.", ["1 ≤ length ≤ 5000"],
  [("babad\n", "bab and aba both have length 3; bab starts first."), ("cbbd\n", "bb.")],
  ["a\n", "abcde\n", "aaaa\n", "forgeeksskeegfor\n", "abacdfgdcaba\n", "ab" * 1000 + "a\n"], h16,
  hints=["Every palindrome has a centre (a character, or the gap between two characters); expand outward from all 2n − 1 centres."])

# ---------------------------------------------------------------- H17
def h17(t):
    l = lines(t); res = []
    for i in range(1, int(l[0]) + 1):
        s, p = (l[i].split(" ") + [""])[:2]
        s = "" if s == "-" else s; p = "" if p == "-" else p
        @lru_cache(None)
        def m(i, j):
            if j == len(p): return i == len(s)
            first = i < len(s) and p[j] in (s[i], ".")
            if j + 1 < len(p) and p[j + 1] == "*": return m(i, j + 2) or (first and m(i + 1, j))
            return first and m(i + 1, j + 1)
        res.append("MATCH" if m(0, 0) else "NO MATCH")
    return out(*res)
P("H17", "Regular Expression Matching", "hard", ["dynamic programming", "strings", "recursion"], ["memoised recursion", "regex semantics"],
  "Implement simple regular-expression matching over the <strong>whole</strong> string: <code>.</code> matches any single character and <code>x*</code> matches zero or more of the preceding element <code>x</code> (which may be <code>.</code>). Print <code>MATCH</code> or <code>NO MATCH</code>. Don't use your language's regex library — build the matcher yourself.",
  "The first line contains <code>q</code>; each line contains a string and a pattern separated by one space. An empty string or pattern is written as <code>-</code>.", "<code>q</code> lines.",
  ["1 ≤ q ≤ 100", "lengths ≤ 30", "patterns are valid (no * at the start, never two * in a row)"],
  [("4\naa a\naa a*\nab .*\naab c*a*b\n", "a matches only one character; a* covers both; .* matches anything; c* can match zero c's.")],
  ["3\nmississippi mis*is*p*.\n- a*\n- -\n", "3\nab .*c\naaa a*a\naaa ab*a*c*a\n", "2\n- .\nabcd d*\n", "2\naaaaaaaaaaaaaaaaaaaaaaaaab a*a*a*a*a*a*a*a*a*c\naaaaaaaaaaaaaaaaaaaaaaaaab a*a*a*a*a*a*a*a*a*b\n"], h17,
  hints=["match(i, j) = does s[i:] match p[j:]? If p[j+1] is *, either skip x* or consume one matching character and stay at j.", "Memoise (i, j) — the last test explodes without it."])

# ---------------------------------------------------------------- H18
def h18(t):
    l = lines(t); r, c = ints(l[0]); g = l[1:1 + r]
    start = next((i, j) for i in range(r) for j in range(c) if g[i][j] == "S")
    dist = {start: 0}; q = deque([start])
    while q:
        a, b = q.popleft()
        if g[a][b] == "E": return out(dist[(a, b)])
        for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            x, y = a + da, b + db
            if 0 <= x < r and 0 <= y < c and g[x][y] != "#" and (x, y) not in dist: dist[(x, y)] = dist[(a, b)] + 1; q.append((x, y))
    return out(-1)
def h18_tests():
    r = rng(118); R, C = 60, 80
    grid = [[("#" if r.random() < 0.28 else ".") for _ in range(C)] for _ in range(R)]
    grid[0][0], grid[R - 1][C - 1] = "S", "E"
    return ["1 2\nSE\n", "1 3\nS#E\n", "3 3\nS..\n##.\nE..\n", f"{R} {C}\n" + "\n".join("".join(row) for row in grid) + "\n"]
P("H18", "Maze Shortest Path", "hard", ["graphs", "grids"], ["breadth-first search", "unweighted shortest paths"],
  "Find the minimum number of steps from <code>S</code> to <code>E</code> in a grid maze, moving up, down, left or right through open cells (<code>.</code>, <code>S</code>, <code>E</code>), never through walls (<code>#</code>). Print −1 if E can't be reached.",
  "The first line has <code>r c</code>; then <code>r</code> lines of <code>c</code> characters, with exactly one S and one E.", "One integer.", ["1 ≤ r, c ≤ 1000"],
  [("5 5\nS.#..\n..#.#\n.....\n#.##.\n...#E\n", "Go down and around the walls: 8 steps.")], h18_tests, h18,
  hints=["BFS explores cells in order of distance, so the first time you reach E is the shortest path."])

# ---------------------------------------------------------------- H19
def h19(t):
    l = lines(t); n, q = ints(l[0]); parent = list(range(n + 1)); size = [1] * (n + 1); comps = n; res = []
    def find(x):
        while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
        return x
    for cmd in l[1:1 + q]:
        p = cmd.split()
        if p[0] == "UNION":
            a, b = find(int(p[1])), find(int(p[2]))
            if a != b:
                if size[a] < size[b]: a, b = b, a
                parent[b] = a; size[a] += size[b]; comps -= 1
        elif p[0] == "SAME": res.append("YES" if find(int(p[1])) == find(int(p[2])) else "NO")
        elif p[0] == "SIZE": res.append(size[find(int(p[1]))])
        else: res.append(comps)
    return out(*res)
def h19_tests():
    r = rng(119); n = 1000; cmds = []
    for _ in range(3000):
        k = r.random()
        cmds.append(f"UNION {r.randint(1, n)} {r.randint(1, n)}" if k < .5 else f"SAME {r.randint(1, n)} {r.randint(1, n)}" if k < .75 else f"SIZE {r.randint(1, n)}" if k < .95 else "COUNT")
    return ["1 2\nCOUNT\nSIZE 1\n", "3 4\nUNION 1 1\nSAME 1 1\nCOUNT\nSIZE 2\n", f"{n} {len(cmds)}\n" + "\n".join(cmds) + "\n"]
P("H19", "Friend Circles (Union-Find)", "hard", ["union-find", "graphs"], ["disjoint set union", "path compression", "union by size"],
  "There are <code>n</code> people, each initially in their own group. Process commands: <code>UNION a b</code> merges the groups of a and b (prints nothing); <code>SAME a b</code> prints YES/NO; <code>SIZE a</code> prints the size of a's group; <code>COUNT</code> prints the number of groups.",
  "The first line has <code>n q</code>; then <code>q</code> commands.", "One line for every SAME, SIZE and COUNT command.", ["1 ≤ n, q ≤ 2·10<sup>5</sup>"],
  [("5 6\nUNION 1 2\nUNION 3 4\nSAME 1 3\nUNION 2 4\nSIZE 3\nCOUNT\n", "After the three unions {1,2,3,4} and {5} remain.")], h19_tests, h19,
  hints=["Without path compression and union by size, long chains make find() slow."])

# ---------------------------------------------------------------- H20
def h20(t):
    d = ints(lines(t)[1]); n = len(d) - 1; dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = min(dp[i][k] + dp[k + 1][j] + d[i] * d[k + 1] * d[j + 1] for k in range(i, j))
    return out(dp[0][n - 1])
P("H20", "Matrix Chain Multiplication", "hard", ["dynamic programming"], ["interval DP"],
  "Matrices A₁…Aₙ have dimensions given by a list p: Aᵢ is p[i−1] × p[i]. Multiplying an a×b by a b×c matrix costs a·b·c scalar multiplications. Print the minimum total cost to compute A₁·A₂·…·Aₙ by choosing the best parenthesisation.",
  "The first line contains <code>n + 1</code>; the second contains the <code>n + 1</code> dimensions.", "One integer (64-bit).", ["1 ≤ n ≤ 200", "1 ≤ p[i] ≤ 500"],
  [("4\n10 30 5 60\n", "(A₁A₂)A₃ costs 10·30·5 + 10·5·60 = 4500, better than A₁(A₂A₃) = 27000.")],
  lambda: ["2\n5 7\n", "3\n1 2 3\n", "5\n40 20 30 10 30\n", "7\n30 35 15 5 10 20 25\n", "120\n" + " ".join(map(str, rand_list(120, 120, 1, 500))) + "\n"], h20,
  hints=["dp[i][j] = cheapest way to multiply Aᵢ…Aⱼ; try every split point k."])

# ---------------------------------------------------------------- H21
def h21(t):
    h = ints(lines(t)[1]) + [0]; st, best = [], 0
    for i, x in enumerate(h):
        start = i
        while st and st[-1][1] >= x:
            j, y = st.pop(); best = max(best, y * (i - j)); start = j
        st.append((start, x))
    return out(best)
P("H21", "Largest Rectangle in Histogram", "hard", ["stacks", "arrays"], ["monotonic stack"],
  "Bars of width 1 have the given heights. Print the area of the largest rectangle that fits entirely under the histogram.",
  "The first line contains <code>n</code>; the second contains <code>n</code> heights.", "One integer (64-bit).", ["1 ≤ n ≤ 2·10<sup>5</sup>", "0 ≤ height ≤ 10<sup>9</sup>"],
  [("6\n2 1 5 6 2 3\n", "The bars of heights 5 and 6 give a 5 × 2 = 10 rectangle.")],
  lambda: ["1\n7\n", "5\n1 1 1 1 1\n", "5\n5 4 3 2 1\n", "3\n0 0 0\n", "10000\n" + " ".join(map(str, rand_list(121, 10000, 0, 10**9))) + "\n"], h21,
  hints=["Keep a stack of increasing heights; when a lower bar arrives, pop and compute the rectangle each popped bar can extend over."])

# ---------------------------------------------------------------- H22
def h22(t):
    l = lines(t); n, m = ints(l[0]); g = defaultdict(list)
    for line in l[1:1 + m]:
        u, v = ints(line); g[u].append(v); g[v].append(u)
    color = [0] * (n + 1)
    for s in range(1, n + 1):
        if color[s]: continue
        color[s] = 1; q = deque([s])
        while q:
            u = q.popleft()
            for v in g[u]:
                if not color[v]: color[v] = -color[u]; q.append(v)
                elif color[v] == color[u]: return out("NO")
    return out("YES", " ".join(str(i) for i in range(1, n + 1) if color[i] == 1))
P("H22", "Two Teams (Bipartite Check)", "hard", ["graphs"], ["BFS 2-colouring", "disconnected components"],
  "Split <code>n</code> people into two teams so that every pair of rivals (edges) ends up in different teams. If impossible print <code>NO</code>. Otherwise print <code>YES</code> and the members of team A: in each connected group, the smallest-numbered person goes to team A and colours alternate from there (BFS order).",
  "The first line has <code>n m</code>; then <code>m</code> lines <code>u v</code>.", "<code>NO</code>, or <code>YES</code> followed by a line with team A in increasing order.", ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ m ≤ 2·10<sup>5</sup>"],
  [("4 4\n1 2\n2 3\n3 4\n4 1\n", "A 4-cycle alternates: team A = {1, 3}."), ("3 3\n1 2\n2 3\n3 1\n", "A triangle can't be 2-coloured.")],
  ["1 0\n", "5 2\n1 2\n4 5\n", "6 5\n1 2\n2 3\n3 4\n4 5\n5 6\n", "4 4\n1 2\n1 3\n2 3\n3 4\n"], h22,
  hints=["The team of each person is fixed once you fix the first person of each component; a conflict means an odd cycle."])

# ---------------------------------------------------------------- H23
def h23(t):
    s, p = lines(t)[:2]
    from collections import Counter
    need = Counter(p); missing = len(p); best = (0, float("inf")); l = 0
    for r, c in enumerate(s, 1):
        if need[c] > 0: missing -= 1
        need[c] -= 1
        if missing == 0:
            while need[s[l]] < 0: need[s[l]] += 1; l += 1
            if r - l < best[1] - best[0]: best = (l, r)
            need[s[l]] += 1; missing += 1; l += 1
    return out(s[best[0]:best[1]] if best[1] != float("inf") else "NONE")
P("H23", "Minimum Window Substring", "hard", ["strings", "sliding window", "hashing"], ["two pointers", "character counts"],
  "Find the shortest contiguous substring of S that contains every character of T (including duplicates). If several are equally short, print the one that starts first; print <code>NONE</code> if none exists.",
  "Two lines: S and T (letters only, case-sensitive).", "The substring or <code>NONE</code>.", ["1 ≤ |S|, |T| ≤ 10<sup>5</sup>"],
  [("ADOBECODEBANC\nABC\n", "BANC is the shortest window containing A, B and C.")], ["a\na\n", "a\naa\n", "aa\naa\n", "abcabdebac\ncda\n", "xyzzyx\nzz\n"], h23,
  hints=["Expand the right end until the window covers T, then shrink the left end while it still does."])

# ---------------------------------------------------------------- H24
def h24(t):
    l = lines(t); n, m = ints(l[0]); g, rg = defaultdict(list), defaultdict(list)
    for line in l[1:1 + m]:
        u, v = ints(line); g[u].append(v); rg[v].append(u)
    seen, order = [False] * (n + 1), []
    for s in range(1, n + 1):
        if seen[s]: continue
        stack = [(s, iter(g[s]))]; seen[s] = True
        while stack:
            u, it = stack[-1]
            nxt = next((v for v in it if not seen[v]), None)
            if nxt is None: order.append(u); stack.pop()
            else: seen[nxt] = True; stack.append((nxt, iter(g[nxt])))
    comp = [0] * (n + 1); sizes = []
    for s in reversed(order):
        if comp[s]: continue
        c = len(sizes) + 1; comp[s] = c; st = [s]; k = 0
        while st:
            u = st.pop(); k += 1
            for v in rg[u]:
                if not comp[v]: comp[v] = c; st.append(v)
        sizes.append(k)
    return out(len(sizes), " ".join(map(str, sorted(sizes, reverse=True))))
def h24_tests():
    r = rng(124); n, m = 3000, 6000
    edges = "\n".join(f"{r.randint(1, n)} {r.randint(1, n)}" for _ in range(m))
    return ["1 0\n", "2 1\n1 2\n", "3 3\n1 2\n2 3\n3 1\n", "6 7\n1 2\n2 1\n3 4\n4 5\n5 3\n2 3\n6 6\n", f"{n} {m}\n{edges}\n"]
P("H24", "Strongly Connected Components", "hard", ["graphs"], ["Kosaraju or Tarjan", "iterative DFS"],
  "In a directed graph, a strongly connected component is a maximal set of nodes where every node can reach every other. Print the number of SCCs and their sizes in decreasing order.",
  "The first line has <code>n m</code>; then <code>m</code> directed edges <code>u v</code>.", "Line 1: the number of SCCs. Line 2: sizes in decreasing order.", ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ m ≤ 2·10<sup>5</sup>"],
  [("5 5\n1 2\n2 3\n3 1\n3 4\n4 5\n", "{1,2,3} form a cycle; 4 and 5 are each alone: 3 components, sizes 3 1 1.")], h24_tests, h24,
  hints=["Kosaraju: order nodes by DFS finish time, then run DFS on the reversed graph in reverse finish order.", "Use an explicit stack — recursion depth can reach n."])

# ---------------------------------------------------------------- H25
def h25(t):
    jobs = sorted((tuple(ints(x)) for x in lines(t)[1:]), key=lambda j: j[1]); ends = [j[1] for j in jobs]; dp = [0] * (len(jobs) + 1)
    for i, (s, e, w) in enumerate(jobs, 1):
        k = bisect.bisect_right(ends, s, 0, i - 1)
        dp[i] = max(dp[i - 1], dp[k] + w)
    return out(dp[-1])
def h25_tests():
    r = rng(125); rows = []
    for _ in range(2000):
        s = r.randint(0, 10**6); rows.append(f"{s} {s + r.randint(1, 5000)} {r.randint(1, 10**4)}")
    return ["1\n0 10 5\n", "3\n1 2 5\n2 3 6\n3 4 7\n", "3\n1 10 100\n2 3 30\n4 5 30\n", f"2000\n" + "\n".join(rows) + "\n"]
P("H25", "Weighted Job Scheduling", "hard", ["dynamic programming", "sorting", "binary search"], ["DP over sorted intervals", "binary search for compatibility"],
  "Each job has a start time, an end time and a profit. Choose jobs that don't overlap to maximise total profit. A job ending at time t is compatible with one starting at t.",
  "The first line contains <code>n</code>; each line has <code>start end profit</code> with start &lt; end.", "One integer (64-bit): the maximum profit.", ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ times ≤ 10<sup>9</sup>", "1 ≤ profit ≤ 10<sup>4</sup>"],
  [("4\n1 3 50\n2 4 10\n3 5 40\n3 6 70\n", "Jobs 1 and 4 (50 + 70 = 120) don't overlap because job 1 ends at 3 when job 4 starts.")], h25_tests, h25,
  hints=["Sort by end time; dp[i] = max(dp[i−1], profit[i] + dp[last job ending ≤ start[i]]) — find that job by binary search."])
