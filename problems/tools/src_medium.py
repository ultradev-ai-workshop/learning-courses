"""Medium problems M01–M25: stacks, hashing, two pointers, sorting, matrices, recursion and simulation."""
from collections import Counter, deque
from itertools import permutations
from common import P, rng, lines, ints, out

# ---------------------------------------------------------------- M01
def m01(t):
    res = []
    for s in lines(t)[1:]:
        st, pairs, ok = [], {")": "(", "]": "[", "}": "{"}, True
        for c in s:
            if c in "([{": st.append(c)
            elif c in pairs:
                if not st or st.pop() != pairs[c]: ok = False; break
        res.append("BALANCED" if ok and not st else "NOT BALANCED")
    return out(*res)
P("M01", "Balanced Brackets", "medium", ["stacks", "strings"], ["stack", "matching pairs"],
  "A string is balanced if every opening bracket <code>( [ {</code> is closed by the matching closing bracket in the correct order. Characters other than brackets are ignored. For each line print <code>BALANCED</code> or <code>NOT BALANCED</code>.",
  "The first line contains <code>q</code>; each of the next <code>q</code> lines contains one string (it may be empty).", "<code>q</code> lines.",
  ["1 ≤ q ≤ 100", "0 ≤ length ≤ 10<sup>5</sup>"],
  [("3\n{[()()]}\n([)]\nf(a[1], {b})\n", "In ([)] the ] closes while ( is still open, so it is not balanced.")],
  ["2\n(\n)\n", "3\n\n((()))\n())(\n", "2\n{{{{}}}}[\n[](){}\n"], m01,
  hints=["Push opening brackets; on a closing bracket the top of the stack must be its partner.", "At the end the stack must be empty."])

# ---------------------------------------------------------------- M02
def m02(t):
    l = lines(t); n, target = ints(l[0]); xs = ints(l[1]); seen = {}
    for j, x in enumerate(xs):
        if target - x in seen: return out(f"{seen[target - x]} {j}")
        seen.setdefault(x, j)
    return out("NONE")
def m02_tests():
    r = rng(2); xs = [r.randint(-1000, 1000) for _ in range(2000)]
    return ["2 10\n5 5\n", "4 100\n1 2 3 4\n", "6 0\n-3 1 3 2 -1 3\n", f"2000 {xs[700] + xs[1900]}\n" + " ".join(map(str, xs)) + "\n"]
P("M02", "Two Sum", "medium", ["hashing", "arrays"], ["hash map lookups", "O(n) instead of O(n²)"],
  """Find two different positions <code>i &lt; j</code> with <code>a[i] + a[j] = target</code>. If several pairs exist, choose the pair with the
<strong>smallest j</strong>, and for that j the <strong>smallest i</strong>. Print the 0-based indices <code>i j</code>, or <code>NONE</code>.""",
  "The first line has <code>n</code> and <code>target</code>; the second has <code>n</code> integers.", "<code>i j</code> or <code>NONE</code>.",
  ["2 ≤ n ≤ 10<sup>5</sup>", "|a[i]|, |target| ≤ 10<sup>9</sup>"],
  [("5 9\n2 7 11 15 1\n", "2 + 7 = 9 at indices 0 and 1."), ("4 6\n3 2 4 3\n", "j = 2 works with i = 1 (2 + 4); that comes before the pair (0, 3).")], m02_tests, m02,
  hints=["Scan j from left to right and look up target − a[j] among values seen so far (store each value's first index)."])

# ---------------------------------------------------------------- M03
def m03(t):
    s = t.rstrip("\n"); best = (0, 0); last = {}; lo = 0
    for i, c in enumerate(s):
        if c in last and last[c] >= lo: lo = last[c] + 1
        last[c] = i
        if i - lo + 1 > best[1] - best[0]: best = (lo, i + 1)
    return out(f"{best[1] - best[0]} {s[best[0]:best[1]]}")
P("M03", "Longest Unique Substring", "medium", ["strings", "sliding window"], ["sliding window", "last-seen positions"],
  "Find the longest substring (contiguous) with no repeated characters. Print its length and the substring itself; if several have the same maximal length, print the one that starts first.",
  "One line containing a string of printable ASCII characters without spaces.", "The length and the substring, separated by a space.",
  ["1 ≤ length ≤ 10<sup>5</sup>"],
  [("abcabcbb\n", "abc has length 3 and appears first."), ("pwwkew\n", "wke (length 3); pwke is not a substring.")], ["bbbbb\n", "a\n", "abcdefg\n", "dvdf\n", "abba\n", "tmmzuxt\n"], m03,
  hints=["Keep a window [lo, i] with unique characters; when a repeat appears inside the window, move lo past its previous position."])

# ---------------------------------------------------------------- M04
def m04(t):
    iv = sorted(tuple(ints(x)) for x in lines(t)[1:]); res = []
    for a, b in iv:
        if res and a <= res[-1][1]: res[-1][1] = max(res[-1][1], b)
        else: res.append([a, b])
    return out(len(res), *[f"{a} {b}" for a, b in res])
P("M04", "Merge Intervals", "medium", ["sorting", "arrays"], ["sorting by start", "greedy merging"],
  "Merge all overlapping closed intervals [a, b]. Intervals that touch (e.g. [1, 3] and [3, 5]) also merge. Print the merged intervals sorted by start.",
  "The first line contains <code>n</code>; each of the next <code>n</code> lines contains <code>a b</code> with a ≤ b.", "The number of merged intervals, then one interval per line.",
  ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ a ≤ b ≤ 10<sup>9</sup>"],
  [("4\n1 3\n8 10\n2 6\n15 18\n", "[1,3] and [2,6] overlap into [1,6].")], ["2\n1 4\n4 5\n", "1\n5 5\n", "3\n1 10\n2 3\n4 5\n", "4\n5 6\n1 2\n3 4\n7 8\n"], m04)

# ---------------------------------------------------------------- M05
def m05(t):
    import bisect
    l = lines(t); xs = ints(l[1]); res = []
    for x in ints(l[3]):
        i = bisect.bisect_left(xs, x)
        res.append(f"FOUND {i}" if i < len(xs) and xs[i] == x else f"NOT FOUND {i}")
    return out(*res)
def m05_tests():
    r = rng(5); xs = sorted(r.sample(range(-10**6, 10**6), 1000)); qs = [r.choice(xs) for _ in range(5)] + [r.randint(-10**6, 10**6) for _ in range(5)]
    return ["1\n5\n3\n4 5 6\n", "5\n1 1 2 2 3\n4\n1 2 3 0\n", f"1000\n{' '.join(map(str, xs))}\n10\n{' '.join(map(str, qs))}\n"]
P("M05", "Binary Search", "medium", ["searching"], ["binary search", "lower bound"],
  "Given a sorted list (non-decreasing, duplicates allowed), answer queries: print <code>FOUND i</code> with the <strong>first</strong> index where the value occurs, or <code>NOT FOUND i</code> where <code>i</code> is the index at which the value would be inserted to keep the list sorted.",
  "Line 1: <code>n</code>. Line 2: <code>n</code> sorted integers. Line 3: <code>q</code>. Line 4: <code>q</code> query values.", "<code>q</code> lines.",
  ["1 ≤ n, q ≤ 10<sup>5</sup>", "|value| ≤ 10<sup>9</sup>", "Each query must run in O(log n)"],
  [("5\n1 3 3 5 9\n3\n3 4 10\n", "3 first appears at index 1; 4 would be inserted at index 3; 10 at the end (5).")], m05_tests, m05,
  hints=["Search for the first index whose value is ≥ x (lower bound)."])

# ---------------------------------------------------------------- M06
def rle_enc(s):
    out_, i = [], 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]: j += 1
        out_.append(f"{j - i}{s[i]}"); i = j
    return "".join(out_)
def rle_dec(s):
    import re
    return "".join(c * int(n) for n, c in re.findall(r"(\d+)(\D)", s))
def m06(t):
    res = []
    for line in lines(t)[1:]:
        cmd, s = line.split(" ", 1)
        res.append(rle_enc(s) if cmd == "ENCODE" else rle_dec(s))
    return out(*res)
P("M06", "Run-Length Encoding", "medium", ["strings"], ["grouping runs", "parsing numbers"],
  "Run-length encoding writes each run of equal characters as its length followed by the character: <code>aaabcc</code> → <code>3a1b2c</code>. Process commands <code>ENCODE text</code> and <code>DECODE text</code>. Texts to encode contain only letters; counts in encoded texts may have several digits.",
  "The first line contains <code>q</code>; each following line is a command.", "The result of each command on its own line.", ["1 ≤ q ≤ 100", "decoded length ≤ 10<sup>5</sup>"],
  [("2\nENCODE aaabcc\nDECODE 3a1b2c\n", "The two commands are inverses of each other."), ("1\nENCODE wwwwwwwwwwwwb\n", "Twelve w's become 12w.")],
  ["1\nENCODE x\n", "2\nDECODE 10z\nDECODE 1a1b1c\n", "1\nENCODE aAaA\n"], m06)

# ---------------------------------------------------------------- M07
def m07(t):
    groups = {}
    for w in ints_or_words(t):
        groups.setdefault("".join(sorted(w)), []).append(w)
    gs = sorted(sorted(g) for g in groups.values())
    return out(len(gs), *[" ".join(g) for g in gs])
def ints_or_words(t): return lines(t)[1].split()
P("M07", "Group Anagrams", "medium", ["hashing", "strings", "sorting"], ["canonical keys", "hash maps of lists"],
  "Group words that are anagrams of each other (same letters, same counts). Sort the words inside each group alphabetically, then sort the groups by their first word. Print the number of groups and then each group on one line.",
  "The first line contains <code>n</code>; the second contains <code>n</code> lower-case words.", "The group count, then one line per group.",
  ["1 ≤ n ≤ 10<sup>4</sup>", "1 ≤ word length ≤ 20"],
  [("6\neat tea tan ate nat bat\n", "Groups: {ate, eat, tea}, {nat, tan}, {bat}; sorted by first word: ate…, bat, nat….")],
  ["1\nsolo\n", "3\nab ba ab\n", "5\nlisten silent enlist google gogole\n"], m07,
  hints=["Use the sorted letters of a word as its key."])

# ---------------------------------------------------------------- M08
def m08(t):
    l = lines(t); r, c = ints(l[0]); m = [ints(x) for x in l[1:1 + r]]; res = []
    top, bot, left, right = 0, r - 1, 0, c - 1
    while top <= bot and left <= right:
        res += [m[top][j] for j in range(left, right + 1)]; top += 1
        res += [m[i][right] for i in range(top, bot + 1)]; right -= 1
        if top <= bot: res += [m[bot][j] for j in range(right, left - 1, -1)]; bot -= 1
        if left <= right: res += [m[i][left] for i in range(bot, top - 1, -1)]; left += 1
    return out(" ".join(map(str, res)))
P("M08", "Spiral Matrix", "medium", ["matrices", "simulation"], ["boundary tracking"],
  "Print the elements of an <code>r × c</code> matrix in clockwise spiral order, starting at the top-left corner.",
  "The first line has <code>r c</code>; then <code>r</code> rows of <code>c</code> integers.", "All elements on one line, space-separated.", ["1 ≤ r, c ≤ 100"],
  [("3 3\n1 2 3\n4 5 6\n7 8 9\n", "Right along the top, down the right side, left along the bottom, up, then the centre: 1 2 3 6 9 8 7 4 5.")],
  ["1 1\n5\n", "1 4\n1 2 3 4\n", "4 1\n1\n2\n3\n4\n", "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n", "4 3\n1 2 3\n4 5 6\n7 8 9\n10 11 12\n"], m08,
  hints=["Keep four boundaries (top, bottom, left, right) and shrink them after each side; check they haven't crossed before the bottom and left passes."])

# ---------------------------------------------------------------- M09
def m09(t):
    l = lines(t); a_r, a_c = ints(l[0]); A = [ints(x) for x in l[1:1 + a_r]]
    k = 1 + a_r; b_r, b_c = ints(l[k]); B = [ints(x) for x in l[k + 1:k + 1 + b_r]]
    if a_c != b_r: return out("IMPOSSIBLE")
    return out(*[" ".join(str(sum(A[i][x] * B[x][j] for x in range(a_c))) for j in range(b_c)) for i in range(a_r)])
P("M09", "Matrix Multiplication", "medium", ["matrices", "math"], ["triple loop", "dimension checks"],
  "Multiply matrix A (n × m) by matrix B (p × q). The product exists only when m = p; otherwise print <code>IMPOSSIBLE</code>.",
  "A's dimensions and rows, then B's dimensions and rows (same format as E22).", "The n × q product, one row per line, or <code>IMPOSSIBLE</code>.",
  ["1 ≤ all dimensions ≤ 50", "|element| ≤ 1000 (results fit in 64 bits)"],
  [("2 3\n1 2 3\n4 5 6\n3 2\n7 8\n9 10\n11 12\n", "Row 1 · column 1 = 1·7 + 2·9 + 3·11 = 58.")], ["1 1\n3\n1 1\n-4\n", "2 2\n1 2\n3 4\n3 1\n1\n2\n3\n", "2 2\n1 0\n0 1\n2 2\n5 6\n7 8\n"], m09)

# ---------------------------------------------------------------- M10
VALS = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"), (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
def to_roman(n):
    s = ""
    for v, r in VALS:
        while n >= v: s += r; n -= v
    return s
def from_roman(s):
    m = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}; tot = 0
    for i, c in enumerate(s):
        tot += -m[c] if i + 1 < len(s) and m[c] < m[s[i + 1]] else m[c]
    return tot
def m10(t):
    return out(*[to_roman(int(x)) if x.isdigit() else from_roman(x) for x in lines(t)[1].split()])
P("M10", "Roman Numerals", "medium", ["strings", "math"], ["greedy conversion", "subtractive notation"],
  "Convert each token: integers become Roman numerals and Roman numerals become integers. Use standard subtractive notation (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).",
  "The first line contains <code>q</code>; the second contains <code>q</code> tokens.", "<code>q</code> lines with the converted values.",
  ["1 ≤ q ≤ 1000", "values are between 1 and 3999; Roman inputs are valid and canonical"],
  [("4\n1994 MCMXCIV 58 IX\n", "1994 = M + CM + XC + IV.")], ["3\n1 3999 MMMCMXCIX\n", "4\n4 40 400 CDXLIV\n", "2\n2026 MMXXVI\n"], m10)

# ---------------------------------------------------------------- M11
def m11(t):
    g = [ints(x) for x in lines(t)[:9]]
    def ok(cells):
        v = [x for x in cells if x]
        return len(v) == len(set(v))
    rows = all(ok(r) for r in g); cols = all(ok([g[i][j] for i in range(9)]) for j in range(9))
    boxes = all(ok([g[i][j] for i in range(bi, bi + 3) for j in range(bj, bj + 3)]) for bi in (0, 3, 6) for bj in (0, 3, 6))
    return out("VALID" if rows and cols and boxes else "INVALID")
SUDOKU = """5 3 0 0 7 0 0 0 0
6 0 0 1 9 5 0 0 0
0 9 8 0 0 0 0 6 0
8 0 0 0 6 0 0 0 3
4 0 0 8 0 3 0 0 1
7 0 0 0 2 0 0 0 6
0 6 0 0 0 0 2 8 0
0 0 0 4 1 9 0 0 5
0 0 0 0 8 0 0 7 9
"""
P("M11", "Valid Sudoku", "medium", ["matrices", "hashing"], ["row/column/box checks", "sets"],
  "A partially filled 9 × 9 Sudoku grid is <em>valid</em> if no digit 1–9 repeats in any row, any column or any of the nine 3 × 3 boxes. Empty cells are 0. Print <code>VALID</code> or <code>INVALID</code> (you do not need to check whether it is solvable).",
  "Nine lines of nine digits 0–9 separated by spaces.", "<code>VALID</code> or <code>INVALID</code>.", ["exactly 9 × 9"],
  [(SUDOKU, "Every filled row, column and box has distinct digits.")],
  [SUDOKU.replace("5 3 0", "8 3 0", 1), "\n".join(" ".join("0" for _ in range(9)) for _ in range(9)) + "\n", SUDOKU.replace("0 0 0 0 8 0 0 7 9", "0 0 0 0 8 0 0 7 5"),
   SUDOKU.replace("0 9 8 0 0 0 0 6 0", "0 9 8 0 0 0 0 6 3")], m11,
  hints=["The box index of cell (i, j) is (i / 3) · 3 + j / 3 using integer division."])

# ---------------------------------------------------------------- M12
def m12(t):
    l = lines(t); k = int(l[0].split()[1]); c = Counter(l[1].split())
    return out(*[f"{w} {n}" for w, n in sorted(c.items(), key=lambda x: (-x[1], x[0]))[:k]])
P("M12", "Top K Frequent Words", "medium", ["hashing", "sorting"], ["counting", "multi-key sort"],
  "Print the <code>k</code> most frequent words with their counts, most frequent first; words with equal counts are ordered alphabetically. If there are fewer than k distinct words, print all of them.",
  "The first line has <code>n</code> and <code>k</code>; the second has <code>n</code> lower-case words.", "Up to <code>k</code> lines: <code>word count</code>.",
  ["1 ≤ n ≤ 10<sup>5</sup>", "1 ≤ k ≤ 10<sup>5</sup>"],
  [("8 2\nthe cat the dog the cat a a\n", "the ×3; then cat and a both ×2 — a comes first alphabetically.")], ["1 5\nsolo\n", "6 3\nb a c b a c\n", "5 1\nz y x w v\n"], m12)

# ---------------------------------------------------------------- M13
def m13(t):
    xs = ints(lines(t)[1]); best, bs, be = xs[0], 0, 0; cur, cs = 0, 0
    for i, x in enumerate(xs):
        if i == 0 or cur < 0: cur, cs = x, i
        else: cur += x
        if cur > best: best, bs, be = cur, cs, i
    return out(f"{best} {bs} {be}")
def m13_tests():
    r = rng(13); xs = [r.randint(-100, 100) for _ in range(500)]
    return ["1\n-5\n", "4\n-3 -1 -2 -4\n", "5\n1 2 3 4 5\n", "6\n2 -1 2 -1 2 -10\n", f"500\n{' '.join(map(str, xs))}\n"]
P("M13", "Maximum Subarray", "medium", ["arrays", "dynamic programming"], ["Kadane's algorithm"],
  "Find the contiguous non-empty subarray with the largest sum. Print the sum and the 0-based start and end indices. If several subarrays have the same best sum, choose the one with the smallest start, and then the smallest end.",
  "The first line contains <code>n</code>; the second contains <code>n</code> integers.", "<code>sum start end</code>.", ["1 ≤ n ≤ 10<sup>5</sup>", "|value| ≤ 10<sup>4</sup>"],
  [("9\n-2 1 -3 4 -1 2 1 -5 4\n", "4 − 1 + 2 + 1 = 6, from index 3 to 6.")], m13_tests, m13,
  hints=["Keep the best sum ending at the current position: either extend the previous run or start fresh.", "Start a fresh run only when the previous run's sum is negative (a zero-sum prefix keeps the earlier start), and replace the best only when strictly better — that satisfies both tie rules."])

# ---------------------------------------------------------------- M14
def trunc_div(a, b):
    q = abs(a) // abs(b)
    return q if (a >= 0) == (b > 0) else -q
def m14(t):
    res = []
    for line in lines(t)[1:]:
        st = []; err = False
        for tok in line.split():
            if tok in "+-*/" and len(tok) == 1:
                if len(st) < 2: err = True; break
                b, a = st.pop(), st.pop()
                if tok == "/" and b == 0: err = True; break
                st.append(a + b if tok == "+" else a - b if tok == "-" else a * b if tok == "*" else trunc_div(a, b))
            else: st.append(int(tok))
        res.append("ERROR" if err or len(st) != 1 else st[0])
    return out(*res)
P("M14", "Postfix Calculator", "medium", ["stacks", "parsing"], ["stack evaluation", "error handling"],
  "Evaluate expressions in Reverse Polish (postfix) notation, e.g. <code>3 4 + 2 *</code> = 14. Operators are <code>+ - * /</code>; division truncates toward zero. Print <code>ERROR</code> for division by zero or a malformed expression (too few operands, or more than one value left at the end).",
  "The first line contains <code>q</code>; each line is an expression with tokens separated by spaces. Numbers may be negative (e.g. <code>-3</code>).", "<code>q</code> lines: the integer result or <code>ERROR</code>.",
  ["1 ≤ q ≤ 100", "intermediate values fit in 64 bits"],
  [("3\n3 4 + 2 *\n5 1 2 + 4 * + 3 -\n2 +\n", "5 + (1 + 2) × 4 − 3 = 14; \"2 +\" has too few operands.")], ["2\n7 -2 /\n1 0 /\n", "2\n42\n1 2 3\n", "1\n-3 -4 *\n"], m14)

# ---------------------------------------------------------------- M15
def m15(t):
    res = []
    for e in lines(t)[1:]:
        try: res.append(calc(e))
        except ZeroDivisionError: res.append("ERROR")
    return out(*res)
def calc(s):
    toks, i = [], 0
    while i < len(s):
        if s[i].isdigit():
            j = i
            while j < len(s) and s[j].isdigit(): j += 1
            toks.append(int(s[i:j])); i = j
        elif s[i] in "+-*/()": toks.append(s[i]); i += 1
        else: i += 1
    pos = 0
    def expr():
        nonlocal pos
        v = term()
        while pos < len(toks) and toks[pos] in ("+", "-"):
            op = toks[pos]; pos += 1; r = term(); v = v + r if op == "+" else v - r
        return v
    def term():
        nonlocal pos
        v = factor()
        while pos < len(toks) and toks[pos] in ("*", "/"):
            op = toks[pos]; pos += 1; r = factor()
            if op == "/" and r == 0: raise ZeroDivisionError
            v = v * r if op == "*" else trunc_div(v, r)
        return v
    def factor():
        nonlocal pos
        tk = toks[pos]
        if tk == "-": pos += 1; return -factor()
        if tk == "(":
            pos += 1; v = expr(); pos += 1; return v
        pos += 1; return tk
    return expr()
P("M15", "Expression Calculator", "medium", ["parsing", "recursion", "stacks"], ["operator precedence", "recursive descent"],
  "Evaluate integer arithmetic expressions with <code>+ - * /</code>, parentheses and unary minus, using normal precedence (* and / before + and −, left to right). Division truncates toward zero; print <code>ERROR</code> on division by zero. Spaces may appear anywhere.",
  "The first line contains <code>q</code>; each following line is one valid expression.", "<code>q</code> lines: the result or <code>ERROR</code>.",
  ["1 ≤ q ≤ 100", "expression length ≤ 1000", "intermediate values fit in 64 bits"],
  [("3\n2 + 3 * 4\n(2 + 3) * 4\n-(8 - 10) / 3\n", "Multiplication first: 14. Parentheses first: 20. −(−2) / 3 = 2 / 3 → 0.")],
  ["2\n7 / -2\n1 / (2 - 2)\n", "2\n((((5))))\n10 - 2 - 3\n", "1\n2 * (3 + 4) * (5 - 1) / 7 - -3\n"], m15,
  hints=["Write one function per precedence level: expression handles + and −, term handles * and /, factor handles numbers, unary minus and parentheses."])

# ---------------------------------------------------------------- M16
def m16(t):
    n = int(t); s = bytearray([1]) * (n + 1); s[0:2] = b"\x00\x00"[: min(2, n + 1)]
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = bytearray(len(s[i * i::i]))
    ps = [i for i in range(n + 1) if s[i]]
    return out(len(ps), " ".join(map(str, ps[-5:])) if ps else "NONE")
P("M16", "Sieve of Eratosthenes", "medium", ["math", "arrays"], ["sieve", "time complexity"],
  "Count the primes ≤ <code>n</code> and print the (up to) five largest of them in increasing order. Use a sieve: trial division for every number is too slow for the largest inputs.",
  "One integer <code>n</code>.", "Line 1: the count. Line 2: the largest five primes ≤ n (fewer if there are fewer), or <code>NONE</code>.",
  ["0 ≤ n ≤ 10<sup>7</sup>"], [("30\n", "There are 10 primes up to 30; the largest five are 13 17 19 23 29.")], ["1\n", "2\n", "10\n", "1000000\n", "10000000\n"], m16,
  hints=["Mark multiples of each prime p starting from p², and stop at √n."])

# ---------------------------------------------------------------- M17
def m17(t):
    rows = [x.split() for x in lines(t)[1:]]
    rows.sort(key=lambda r: (-int(r[1]), int(r[2]), r[0]))
    return out(*[" ".join(r) for r in rows])
P("M17", "Sort Students", "medium", ["sorting"], ["custom comparators", "multi-key sort"],
  "Sort students by score (highest first); break ties by age (youngest first); then by name (alphabetical, case-sensitive by character code).",
  "The first line contains <code>n</code>; each line has <code>name score age</code>.", "The sorted list in the same format.",
  ["1 ≤ n ≤ 10<sup>5</sup>", "names are unique, without spaces"],
  [("4\nana 90 20\nben 85 19\nchen 90 19\ndee 90 20\n", "chen (90, 19) is youngest among the 90s; ana and dee tie on age, so alphabetical.")], ["1\nsolo 0 1\n", "3\nZed 50 30\nadam 50 30\nBob 50 30\n", "3\nx 1 3\ny 2 2\nz 3 1\n"], m17)

# ---------------------------------------------------------------- M18
def m18(t):
    a, b = lines(t)[:2]
    return out(int(a) + int(b), int(a) * int(b))
def m18_tests():
    r = rng(18)
    big = lambda d: str(r.randint(10 ** (d - 1), 10 ** d - 1))
    return ["0\n0\n", "999999999999\n1\n", f"{big(60)}\n{big(45)}\n", f"{big(300)}\n{big(300)}\n", "1\n99999999999999999999999999\n"]
P("M18", "Big Number Arithmetic", "medium", ["strings", "math"], ["digit-by-digit arithmetic", "carries"],
  "Add and multiply two non-negative integers that may have hundreds of digits — far beyond 64 bits. Implement schoolbook addition and multiplication on digit strings (or use your language's big-integer type and then try it without).",
  "Two lines, each a non-negative integer without leading zeros.", "Two lines: the sum and the product.", ["1 ≤ digits ≤ 500 each"],
  [("123456789123456789\n987654321987654321\n", "The sum and product exceed 64 bits.")], m18_tests, m18,
  hints=["Process digits from the right; for multiplication, digit i × digit j contributes to position i + j."])

# ---------------------------------------------------------------- M19
def m19(t):
    n = int(t); row, res = [1], []
    for _ in range(n):
        res.append(" ".join(map(str, row))); row = [1] + [row[i] + row[i + 1] for i in range(len(row) - 1)] + [1]
    return out(*res)
P("M19", "Pascal's Triangle", "medium", ["arrays", "math"], ["building rows from previous rows"],
  "Print the first <code>n</code> rows of Pascal's triangle. Each row starts and ends with 1, and every inner value is the sum of the two values above it.",
  "One integer <code>n</code>.", "<code>n</code> lines, values separated by single spaces (no centring).", ["1 ≤ n ≤ 60 (values fit in 64 bits)"],
  [("5\n", "Row 5 is 1 4 6 4 1.")], ["1\n", "2\n", "10\n", "60\n"], m19)

# ---------------------------------------------------------------- M20
def m20(t):
    l = lines(t)[1].split(); n = len(l)
    xs = list(map(int, l)); res = [0] * n; pre = 1
    for i in range(n): res[i] = pre; pre *= xs[i]
    suf = 1
    for i in range(n - 1, -1, -1): res[i] *= suf; suf *= xs[i]
    return out(" ".join(map(str, res)))
P("M20", "Product Except Self", "medium", ["arrays"], ["prefix and suffix products", "no division"],
  "For each position, print the product of all <em>other</em> elements. Do it without using division (the array may contain zeros).",
  "The first line contains <code>n</code>; the second contains <code>n</code> integers.", "<code>n</code> products, space-separated.",
  ["2 ≤ n ≤ 10<sup>5</sup>", "|value| ≤ 30 and every product fits in a signed 64-bit integer"],
  [("4\n1 2 3 4\n", "24 = 2·3·4, 12 = 1·3·4, 8, 6.")], ["2\n5 7\n", "4\n0 1 2 3\n", "5\n1 0 2 0 3\n", "5\n-1 2 -3 4 -5\n"], m20,
  hints=["result[i] = (product of everything left of i) × (product of everything right of i)."])

# ---------------------------------------------------------------- M21
def m21(t):
    l = lines(t); r, c = ints(l[0]); g = [list(x) for x in l[1:1 + r]]; seen = [[False] * c for _ in range(r)]; sizes = []
    for i in range(r):
        for j in range(c):
            if g[i][j] == "#" and not seen[i][j]:
                q = deque([(i, j)]); seen[i][j] = True; n = 0
                while q:
                    a, b = q.popleft(); n += 1
                    for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        x, y = a + da, b + db
                        if 0 <= x < r and 0 <= y < c and g[x][y] == "#" and not seen[x][y]: seen[x][y] = True; q.append((x, y))
                sizes.append(n)
    return out(len(sizes), " ".join(map(str, sorted(sizes, reverse=True))) if sizes else "0")
def m21_tests():
    r = rng(21); grid = "\n".join("".join(r.choice("#..") for _ in range(40)) for _ in range(25))
    return ["1 1\n.\n", "1 1\n#\n", "3 3\n#.#\n.#.\n#.#\n", "3 5\n#####\n#...#\n#####\n", f"25 40\n{grid}\n"]
P("M21", "Count Islands", "medium", ["graphs", "grids"], ["BFS/DFS flood fill", "visited sets"],
  "A grid has land (<code>#</code>) and water (<code>.</code>). An island is a group of land cells connected horizontally or vertically (not diagonally). Print the number of islands and their sizes in decreasing order.",
  "The first line has <code>r c</code>; then <code>r</code> lines of <code>c</code> characters.", "Line 1: number of islands. Line 2: sizes in decreasing order, or <code>0</code> if there are none.",
  ["1 ≤ r, c ≤ 500"], [("4 5\n##..#\n#...#\n..#..\n.....\n", "Islands of sizes 3 (top-left), 2 (right) and 1 (middle).")], m21_tests, m21,
  hints=["Use an explicit queue or stack: recursion can overflow the call stack on a 500 × 500 island."])

# ---------------------------------------------------------------- M22
def m22(t):
    res = []
    for line in lines(t)[1:]:
        a = ints(line); i = len(a) - 2
        while i >= 0 and a[i] >= a[i + 1]: i -= 1
        if i < 0: res.append("LAST " + " ".join(map(str, sorted(a)))); continue
        j = len(a) - 1
        while a[j] <= a[i]: j -= 1
        a[i], a[j] = a[j], a[i]; a[i + 1:] = reversed(a[i + 1:]); res.append(" ".join(map(str, a)))
    return out(*res)
P("M22", "Next Permutation", "medium", ["arrays", "combinatorics"], ["lexicographic order", "in-place reversal"],
  "For each sequence, print the next permutation in lexicographic order. If the sequence is already the last permutation (non-increasing), print <code>LAST</code> followed by the first permutation (sorted ascending).",
  "The first line contains <code>q</code>; each following line is a sequence of integers (duplicates allowed).", "<code>q</code> lines.",
  ["1 ≤ q ≤ 100", "1 ≤ length ≤ 10<sup>5</sup>"],
  [("3\n1 2 3\n3 2 1\n1 1 5\n", "1 2 3 → 1 3 2; 3 2 1 is the last one, so wrap around; 1 1 5 → 1 5 1.")], ["2\n7\n1 3 2\n", "2\n2 2 2\n1 5 1\n", "1\n1 2 4 3 3 1\n"], m22,
  hints=["Find the rightmost i with a[i] < a[i+1], swap a[i] with the rightmost element greater than it, then reverse the suffix after i."])

# ---------------------------------------------------------------- M23
def m23(t):
    xs = sorted(set(ints(lines(t)[1]))); res = []
    def rec(i, cur):
        res.append(cur[:])
        for j in range(i, len(xs)): cur.append(xs[j]); rec(j + 1, cur); cur.pop()
    rec(0, [])
    return out(len(res), *[" ".join(map(str, s)) if s else "{}" for s in res])
P("M23", "All Subsets", "medium", ["recursion", "backtracking"], ["backtracking", "lexicographic generation"],
  "Print every subset of a set of distinct integers. Elements inside a subset are in increasing order, and subsets are listed in lexicographic order of those sequences (the empty subset, written <code>{}</code>, comes first). Print the count first.",
  "The first line contains <code>n</code>; the second contains <code>n</code> distinct integers (in any order).", "The number of subsets, then one subset per line.",
  ["0 ≤ n ≤ 12"], [("3\n3 1 2\n", "8 subsets: {}, 1, 1 2, 1 2 3, 1 3, 2, 2 3, 3.")], ["1\n5\n", "2\n-1 1\n", "4\n4 3 2 1\n"], m23,
  hints=["Recursive backtracking that adds elements in increasing order produces exactly this order."])

# ---------------------------------------------------------------- M24
def m24(t):
    ps = sorted(set("".join(p) for p in permutations(t.strip())))
    return out(len(ps), *ps)
P("M24", "Unique Permutations", "medium", ["recursion", "backtracking", "strings"], ["backtracking with duplicates"],
  "Print all <em>distinct</em> permutations of a string in lexicographic (character-code) order, preceded by how many there are.",
  "One string of letters and digits (length ≤ 8). Characters may repeat.", "The count, then one permutation per line.", ["1 ≤ length ≤ 8"],
  [("aba\n", "Only 3 distinct permutations: aab, aba, baa.")], ["a\n", "abc\n", "aabb\n", "Ab1\n"], m24,
  hints=["Sort the characters, and at each position skip a character equal to the previous unused one to avoid duplicates."])

# ---------------------------------------------------------------- M25
def m25(t):
    l = lines(t); cap = int(l[0].split()[1]); q = deque(); res = []
    for cmd in l[1:]:
        p = cmd.split()
        if p[0] == "PUSH":
            if len(q) == cap: res.append("FULL")
            else: q.append(int(p[1]))
        elif p[0] == "POP": res.append(q.popleft() if q else "EMPTY")
        elif p[0] == "PEEK": res.append(q[0] if q else "EMPTY")
        else: res.append(len(q))
    return out(*res)
P("M25", "Circular Queue", "medium", ["queues", "simulation"], ["ring buffer", "head/tail indices"],
  "Implement a fixed-capacity FIFO queue with an array used as a ring buffer (do not shift elements). Commands: <code>PUSH x</code> (print <code>FULL</code> if the queue is full, otherwise nothing), <code>POP</code> (print the removed value or <code>EMPTY</code>), <code>PEEK</code> (print the front value or <code>EMPTY</code>), <code>SIZE</code> (print the count).",
  "The first line has <code>q</code> (commands) and <code>capacity</code>; then <code>q</code> commands.", "One line for every command that prints something.",
  ["1 ≤ q ≤ 10<sup>5</sup>", "1 ≤ capacity ≤ 10<sup>5</sup>"],
  [("7 2\nPUSH 1\nPUSH 2\nPUSH 3\nPOP\nPUSH 4\nPEEK\nSIZE\n", "The third push is rejected (FULL); after popping 1 there is room for 4.")],
  ["3 1\nPOP\nPEEK\nSIZE\n", "6 3\nPUSH 5\nPUSH 6\nPOP\nPOP\nPOP\nSIZE\n", "9 2\nPUSH 1\nPOP\nPUSH 2\nPOP\nPUSH 3\nPUSH 4\nPOP\nPOP\nPOP\n"], m25,
  hints=["Keep head and size; the tail is (head + size) mod capacity."])
