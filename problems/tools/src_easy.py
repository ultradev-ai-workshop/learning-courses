"""Easy problems E01–E25: input/output, loops, conditions, strings, arrays and basic maths."""
from common import P, rng, lines, ints, out

# ---------------------------------------------------------------- E01
def e01(t):
    a, b = ints(t)
    q = abs(a) // abs(b) * (1 if (a >= 0) == (b > 0) else -1) if b else None
    r = a - b * q if b else None
    return out(a + b, a - b, a * b, q if b else "undefined", r if b else "undefined")
P("E01", "Arithmetic Basics", "easy", ["math", "io"], ["reading input", "integer arithmetic", "division rules"],
  """Read two integers <code>a</code> and <code>b</code> and print the results of the five basic integer operations, one per line:
<ol><li>the sum <code>a + b</code></li><li>the difference <code>a − b</code></li><li>the product <code>a × b</code></li>
<li>the quotient of <code>a / b</code> <strong>truncated toward zero</strong> (so −7 / 2 = −3)</li>
<li>the remainder, defined as <code>a − b × quotient</code> (so it has the sign of <code>a</code>)</li></ol>
If <code>b</code> is 0, print <code>undefined</code> for both the quotient and the remainder.""",
  "One line with two integers <code>a</code> and <code>b</code>, separated by a space.",
  "Five lines: sum, difference, product, quotient, remainder.",
  ["−10<sup>9</sup> ≤ a, b ≤ 10<sup>9</sup> (the product can exceed 32 bits: use 64-bit integers)"],
  [("17 5\n", "17 / 5 = 3.4, truncated to 3; 17 − 5 × 3 = 2."), ("-7 2\n", "−3.5 truncates toward zero to −3; the remainder is −7 − 2 × (−3) = −1.")],
  ["0 3\n", "5 0\n", "-8 -3\n", "1000000000 1000000000\n", "-1000000000 7\n", "9 -4\n"], e01,
  hints=["Languages disagree on integer division of negatives (Python floors, Java/C/JS-trunc truncate). Implement truncation explicitly if needed.",
         "Use a 64-bit type (long / long long / BigInt or Number in JS) for the product."])

# ---------------------------------------------------------------- E02
def e02(t):
    n = int(t)
    return out(*["FizzBuzz" if i % 15 == 0 else "Fizz" if i % 3 == 0 else "Buzz" if i % 5 == 0 else i for i in range(1, n + 1)])
P("E02", "FizzBuzz", "easy", ["loops", "conditions"], ["loops", "modulo", "condition order"],
  """Print the numbers from 1 to <code>n</code>, one per line, but print <code>Fizz</code> instead of multiples of 3,
<code>Buzz</code> instead of multiples of 5, and <code>FizzBuzz</code> instead of multiples of both 3 and 5.""",
  "One integer <code>n</code>.", "<code>n</code> lines as described.", ["1 ≤ n ≤ 1000"],
  [("15\n", "15 is a multiple of both 3 and 5, so the last line is FizzBuzz.")], ["1\n", "5\n", "30\n", "100\n"], e02,
  hints=["Check the \"both\" case (divisible by 15) before the single cases."])

# ---------------------------------------------------------------- E03
def e03(t):
    ys = ints(t)[1:]
    return out(*["YES" if y % 400 == 0 or (y % 4 == 0 and y % 100 != 0) else "NO" for y in ys])
P("E03", "Leap Years", "easy", ["conditions"], ["boolean logic", "modulo"],
  """In the Gregorian calendar, a year is a leap year if it is divisible by 4, <em>except</em> years divisible by 100,
which are leap years only if they are also divisible by 400. For each given year print <code>YES</code> if it is a leap year, otherwise <code>NO</code>.""",
  "The first line contains <code>q</code>, the number of years. The next line contains <code>q</code> years separated by spaces.",
  "<code>q</code> lines, each <code>YES</code> or <code>NO</code>.", ["1 ≤ q ≤ 1000", "1 ≤ year ≤ 10<sup>9</sup>"],
  [("4\n2024 1900 2000 2023\n", "1900 is divisible by 100 but not by 400, so it is not a leap year; 2000 is.")],
  ["1\n4\n", "3\n100 400 800\n", "5\n1 2 3 4 5\n", "4\n1600 1700 1800 2400\n"], e03)

# ---------------------------------------------------------------- E04
def e04(t):
    return out(t.rstrip("\n")[::-1])
P("E04", "Reverse a String", "easy", ["strings"], ["string indexing", "loops"],
  "Read one line of text and print it reversed, character by character. Spaces and punctuation are reversed too.",
  "One line of printable ASCII text (it may contain spaces).", "The reversed line.", ["1 ≤ length ≤ 10<sup>5</sup>"],
  [("hello world\n", "Every character, including the space, is reversed.")], ["a\n", "racecar\n", "Page & Spine!\n", "  two spaces  \n", "12345\n"], e04,
  hints=["Read the whole line, not just the first word — many input functions stop at whitespace."])

# ---------------------------------------------------------------- E05
def e05(t):
    s = [c.lower() for c in t.rstrip("\n") if c.isalnum()]
    return out("YES" if s == s[::-1] else "NO")
P("E05", "Palindrome Sentence", "easy", ["strings"], ["filtering characters", "case-insensitive comparison", "two pointers"],
  """A sentence is a palindrome if it reads the same forwards and backwards after removing every character that is not a letter or digit
and ignoring upper/lower case. Print <code>YES</code> if the given line is a palindrome, otherwise <code>NO</code>.""",
  "One line of ASCII text.", "<code>YES</code> or <code>NO</code>.", ["1 ≤ length ≤ 10<sup>5</sup>"],
  [("A man, a plan, a canal: Panama\n", "Keeping only letters and digits in lower case gives amanaplanacanalpanama, which is a palindrome."), ("race a car\n", "raceacar reversed is racaecar.")],
  ["!!!\n", "No lemon, no melon\n", "ab\n", "12321\n", "Was it a car or a cat I saw?\n", "0P\n"], e05,
  hints=["A line with no letters or digits is an empty string after filtering — and the empty string is a palindrome."])

# ---------------------------------------------------------------- E06
def e06(t):
    s = t.rstrip("\n").lower()
    v = sum(c in "aeiou" for c in s)
    c = sum(ch.isalpha() and ch not in "aeiou" for ch in s)
    return out(f"vowels {v}", f"consonants {c}")
P("E06", "Vowels and Consonants", "easy", ["strings"], ["character classification", "counting"],
  "Count the vowels (a, e, i, o, u — upper or lower case) and the consonants (all other English letters) in a line. Ignore digits, spaces and punctuation.",
  "One line of ASCII text.", "Two lines: <code>vowels V</code> and <code>consonants C</code>.", ["1 ≤ length ≤ 10<sup>5</sup>"],
  [("Hello, World!\n", "Vowels: e, o, o (3). Consonants: H, l, l, W, r, l, d (7).")], ["AEIOU\n", "rhythm\n", "123 !?\n", "The quick brown fox jumps over the lazy dog\n"], e06,
  hints=["'y' counts as a consonant here."])

# ---------------------------------------------------------------- E07
def e07(t):
    xs = ints(t)[1:]
    return out(f"min {min(xs)}", f"max {max(xs)}", f"sum {sum(xs)}")
def e07_tests():
    r = rng(7)
    return ["1\n-5\n", "3\n0 0 0\n", "6\n" + " ".join(str(r.randint(-10**9, 10**9)) for _ in range(6)) + "\n",
            "200\n" + " ".join(str(r.randint(-1000, 1000)) for _ in range(200)) + "\n"]
P("E07", "Min, Max and Sum", "easy", ["arrays"], ["arrays", "accumulators", "64-bit sums"],
  "Given <code>n</code> integers, print the smallest value, the largest value and the sum of all values.",
  "The first line contains <code>n</code>. The second line contains <code>n</code> integers.",
  "Three lines: <code>min X</code>, <code>max Y</code>, <code>sum S</code>.", ["1 ≤ n ≤ 10<sup>5</sup>", "−10<sup>9</sup> ≤ value ≤ 10<sup>9</sup> (the sum needs 64 bits)"],
  [("5\n3 -1 7 0 2\n", "min −1, max 7, sum 3 − 1 + 7 + 0 + 2 = 11.")], e07_tests, e07,
  hints=["Initialise min/max with the first element, not with 0."])

# ---------------------------------------------------------------- E08
def e08(t):
    n = int(t); f = 1
    for i in range(2, n + 1): f *= i
    return out(f)
P("E08", "Factorial", "easy", ["math", "loops"], ["loops", "64-bit overflow"],
  "Print <code>n!</code> (n factorial), the product 1 × 2 × … × n. By definition 0! = 1.",
  "One integer <code>n</code>.", "One integer, <code>n!</code>.", ["0 ≤ n ≤ 20 (20! = 2432902008176640000 still fits in a signed 64-bit integer)"],
  [("5\n", "1 × 2 × 3 × 4 × 5 = 120.")], ["0\n", "1\n", "10\n", "20\n", "13\n"], e08,
  hints=["13! already overflows a 32-bit int."])

# ---------------------------------------------------------------- E09
def e09(t):
    n = int(t); a, b, r = 0, 1, []
    for _ in range(n): r.append(a); a, b = b, a + b
    return out(" ".join(map(str, r)))
P("E09", "Fibonacci Sequence", "easy", ["loops", "math"], ["iteration", "sequences"],
  "The Fibonacci sequence starts 0, 1 and every next term is the sum of the two before it. Print the first <code>n</code> terms on one line, separated by single spaces.",
  "One integer <code>n</code>.", "The first <code>n</code> terms separated by spaces.", ["1 ≤ n ≤ 90 (term 90 fits in 64 bits)"],
  [("10\n", "0 1 1 2 3 5 8 13 21 34.")], ["1\n", "2\n", "3\n", "50\n", "90\n"], e09,
  hints=["Use a loop with two variables; recursion without memoisation is exponentially slow."])

# ---------------------------------------------------------------- E10
def is_prime(n):
    if n < 2: return False
    if n % 2 == 0: return n == 2
    i = 3
    while i * i <= n:
        if n % i == 0: return False
        i += 2
    return True
def e10(t):
    return out(*["PRIME" if is_prime(x) else "NOT PRIME" for x in ints(t)[1:]])
P("E10", "Prime Checker", "easy", ["math", "loops"], ["trial division", "square-root bound"],
  "A prime is an integer greater than 1 whose only divisors are 1 and itself. For each query print <code>PRIME</code> or <code>NOT PRIME</code>.",
  "The first line contains <code>q</code>. The second line contains <code>q</code> integers.",
  "<code>q</code> lines.", ["1 ≤ q ≤ 1000", "0 ≤ x ≤ 10<sup>12</sup> — checking divisors only up to √x is required for speed"],
  [("5\n2 15 17 1 97\n", "1 is not prime by definition; 15 = 3 × 5.")],
  ["3\n0 1 2\n", "4\n999999937 1000000007 1000000000 7919\n", "2\n999999999989 1000000000000\n", "6\n4 9 25 49 121 169\n"], e10,
  hints=["If x has a divisor d > √x then it also has x/d < √x, so stop at √x."])

# ---------------------------------------------------------------- E11
from math import gcd
def e11(t):
    a, b = ints(t)
    return out(f"gcd {gcd(a, b)}", f"lcm {a // gcd(a, b) * b}")
P("E11", "GCD and LCM", "easy", ["math"], ["Euclid's algorithm", "overflow-safe LCM"],
  "Print the greatest common divisor and the least common multiple of two positive integers.",
  "One line with two integers <code>a</code> and <code>b</code>.", "Two lines: <code>gcd G</code> and <code>lcm L</code>.",
  ["1 ≤ a, b ≤ 10<sup>9</sup>", "The LCM can reach 10<sup>18</sup>: compute it as a / gcd × b to avoid overflow"],
  [("12 18\n", "gcd(12, 18) = 6 and lcm = 12 / 6 × 18 = 36.")], ["7 13\n", "1 1\n", "1000000000 999999999\n", "48 180\n", "100 25\n"], e11,
  hints=["Euclid: gcd(a, b) = gcd(b, a mod b), with gcd(a, 0) = a."])

# ---------------------------------------------------------------- E12
def e12(t):
    s = t.strip(); steps = 0
    while len(s) > 1:
        s = str(sum(int(c) for c in s)); steps += 1
    return out(f"{s} {steps}")
P("E12", "Digital Root", "easy", ["math", "strings"], ["digit manipulation", "loops"],
  """Repeatedly replace a number by the sum of its digits until a single digit remains. Print that digit (the <em>digital root</em>)
and the number of replacement steps needed.""",
  "One non-negative integer written in decimal. It can have up to 1000 digits, so read it as a string.",
  "Two integers separated by a space: the digital root and the number of steps.", ["0 ≤ number < 10<sup>1000</sup>", "no leading zeros (except the number 0 itself)"],
  [("9875\n", "9+8+7+5 = 29 → 2+9 = 11 → 1+1 = 2: root 2 after 3 steps."), ("7\n", "Already a single digit: 0 steps.")],
  ["0\n", "10\n", "99999999999999999999\n", "123456789\n", "1" + "0" * 999 + "\n"], e12)

# ---------------------------------------------------------------- E13
def e13(t):
    return out(len(t.split()))
P("E13", "Word Count", "easy", ["strings"], ["splitting on whitespace"],
  "Count the words in a line. A word is a maximal sequence of non-space characters; words may be separated by several spaces, and the line may start or end with spaces.",
  "One line of text.", "One integer: the number of words.", ["0 ≤ length ≤ 10<sup>5</sup>"],
  [("  the quick   brown fox \n", "Extra spaces don't create empty words: 4 words.")], ["hello\n", "    \n", "a b c d e f\n", "one,two three\n"], e13,
  hints=["Splitting on a single space produces empty strings; split on runs of whitespace instead."])

# ---------------------------------------------------------------- E14
def e14(t):
    from collections import Counter
    c = Counter(ch for ch in t.lower() if "a" <= ch <= "z")
    return out(*[f"{k} {c[k]}" for k in sorted(c)]) if c else out("none")
P("E14", "Letter Frequency", "easy", ["strings", "hashing"], ["counting with a map or array", "sorting keys"],
  "Count how many times each English letter appears in a line, ignoring case and all non-letters. Print the letters that appear, in alphabetical order, with their counts. If no letters appear, print <code>none</code>.",
  "One line of text.", "One line per letter: <code>letter count</code> (letter in lower case).", ["1 ≤ length ≤ 10<sup>5</sup>"],
  [("Hello World\n", "l appears 3 times, o twice, and d, e, h, r, w once.")], ["aAaA\n", "123 !\n", "Zebra\n", "The quick brown fox jumps over the lazy dog\n"], e14,
  hints=["An array of 26 counters indexed by (letter − 'a') is enough."])

# ---------------------------------------------------------------- E15
def e15(t):
    xs = sorted(set(ints(t)[1:]), reverse=True)
    return out(xs[1] if len(xs) > 1 else "NONE")
P("E15", "Second Largest", "easy", ["arrays"], ["single pass", "distinct values"],
  "Print the second largest <em>distinct</em> value in the list, or <code>NONE</code> if every value is the same.",
  "The first line contains <code>n</code>; the second contains <code>n</code> integers.", "One integer, or <code>NONE</code>.",
  ["1 ≤ n ≤ 10<sup>5</sup>", "|value| ≤ 10<sup>9</sup>"],
  [("6\n4 9 1 9 7 3\n", "The largest value is 9 (twice); the second largest distinct value is 7.")],
  ["1\n5\n", "3\n2 2 2\n", "2\n-1 -2\n", "5\n1 2 3 4 5\n", "4\n10 10 9 10\n"], e15,
  hints=["Track the best and second-best while scanning; skip values equal to the best."])

# ---------------------------------------------------------------- E16
def e16(t):
    seen, res = set(), []
    for x in ints(t)[1:]:
        if x not in seen: seen.add(x); res.append(x)
    return out(" ".join(map(str, res)))
P("E16", "Remove Duplicates", "easy", ["arrays", "hashing"], ["sets", "preserving order"],
  "Remove repeated values from a list, keeping only the first occurrence of each value, and print the result in the original order.",
  "The first line contains <code>n</code>; the second contains <code>n</code> integers.", "The remaining values separated by spaces.",
  ["1 ≤ n ≤ 10<sup>5</sup>"],
  [("8\n3 1 3 2 1 5 2 3\n", "Keep the first 3, 1, 2 and 5: 3 1 2 5.")], ["1\n7\n", "4\n9 9 9 9\n", "5\n5 4 3 2 1\n", "6\n-1 1 -1 1 0 0\n"], e16)

# ---------------------------------------------------------------- E17
def e17(t):
    return out(*[bin(x)[2:] for x in ints(t)[1:]])
P("E17", "Decimal to Binary", "easy", ["math", "strings"], ["repeated division", "building strings"],
  "Convert each non-negative decimal integer to binary (base 2) without leading zeros. The number 0 is written as <code>0</code>.",
  "The first line contains <code>q</code>; the second contains <code>q</code> integers.", "<code>q</code> lines with the binary representations.",
  ["1 ≤ q ≤ 1000", "0 ≤ x ≤ 10<sup>18</sup>"],
  [("3\n5 0 10\n", "5 = 4 + 1 → 101; 10 = 8 + 2 → 1010.")], ["2\n1 2\n", "1\n1000000000000000000\n", "4\n255 256 1023 1024\n"], e17,
  hints=["Collect remainders of division by 2, then reverse them."])

# ---------------------------------------------------------------- E18
def e18(t):
    n = int(t)
    return out(*[f"{n} x {i} = {n * i}" for i in range(1, 11)])
P("E18", "Multiplication Table", "easy", ["loops", "formatting"], ["loops", "string formatting"],
  "Print the multiplication table of <code>n</code> from 1 to 10, one line per row, in the exact format <code>n x i = product</code> (single spaces).",
  "One integer <code>n</code>.", "Ten lines.", ["−1000 ≤ n ≤ 1000"],
  [("7\n", "The first line is 7 x 1 = 7 and the last is 7 x 10 = 70.")], ["0\n", "1\n", "-3\n", "1000\n"], e18)

# ---------------------------------------------------------------- E19
def e19(t):
    n = int(t)
    return out(*[" " * (n - i) + "*" * (2 * i - 1) for i in range(1, n + 1)])
P("E19", "Star Pyramid", "easy", ["loops", "formatting"], ["nested loops", "exact spacing"],
  """Print a centred pyramid of <code>n</code> rows made of <code>*</code>. Row <code>i</code> (1-based) has <code>n − i</code> leading spaces
followed by <code>2i − 1</code> stars, and <strong>no trailing spaces</strong>.""",
  "One integer <code>n</code>.", "<code>n</code> lines forming the pyramid.", ["1 ≤ n ≤ 50"],
  [("3\n", "Rows: 2 spaces + 1 star, 1 space + 3 stars, 0 spaces + 5 stars.")], ["1\n", "2\n", "5\n", "10\n"], e19,
  hints=["Leading spaces matter; the checker compares them exactly (trailing spaces are ignored)."])

# ---------------------------------------------------------------- E20
def e20(t):
    a, b = lines(t)
    norm = lambda s: sorted(c for c in s.lower() if c.isalpha())
    return out("YES" if norm(a) == norm(b) else "NO")
P("E20", "Anagram Check", "easy", ["strings", "hashing"], ["sorting or counting characters"],
  "Two phrases are anagrams if they use exactly the same letters the same number of times, ignoring case, spaces and punctuation. Print <code>YES</code> or <code>NO</code>.",
  "Two lines, one phrase each.", "<code>YES</code> or <code>NO</code>.", ["1 ≤ length ≤ 10<sup>5</sup> each"],
  [("Listen\nSilent\n", "Both contain e, i, l, n, s, t once."), ("Dormitory\nDirty room!\n", "Spaces and punctuation are ignored: YES.")],
  ["abc\nabd\n", "aab\nabb\n", "A gentleman\nElegant man\n", "x\nx\n"], e20)

# ---------------------------------------------------------------- E21
def e21(t):
    l = lines(t); n, k = ints(l[0]); xs = ints(l[1]); k %= n
    return out(" ".join(map(str, xs[-k:] + xs[:-k] if k else xs)))
P("E21", "Rotate Array", "easy", ["arrays"], ["index arithmetic", "modulo"],
  "Rotate an array to the <strong>right</strong> by <code>k</code> steps: the last <code>k</code> elements move to the front. <code>k</code> may be larger than <code>n</code>.",
  "The first line contains <code>n</code> and <code>k</code>; the second contains <code>n</code> integers.", "The rotated array, space-separated.",
  ["1 ≤ n ≤ 10<sup>5</sup>", "0 ≤ k ≤ 10<sup>9</sup>"],
  [("5 2\n1 2 3 4 5\n", "The last two elements (4, 5) move to the front: 4 5 1 2 3.")], ["1 100\n9\n", "4 4\n1 2 3 4\n", "4 6\n1 2 3 4\n", "3 0\n7 8 9\n"], e21,
  hints=["Rotating by k is the same as rotating by k mod n."])

# ---------------------------------------------------------------- E22
def e22(t):
    l = lines(t); r, c = ints(l[0]); m = [ints(x) for x in l[1:1 + r]]
    return out(*[" ".join(str(m[i][j]) for i in range(r)) for j in range(c)])
P("E22", "Matrix Transpose", "easy", ["arrays", "matrices"], ["2-D arrays", "nested loops"],
  "Print the transpose of an <code>r × c</code> matrix: row <code>j</code> of the result is column <code>j</code> of the input.",
  "The first line has <code>r</code> and <code>c</code>; then <code>r</code> lines with <code>c</code> integers each.", "<code>c</code> lines with <code>r</code> integers each.",
  ["1 ≤ r, c ≤ 100"], [("2 3\n1 2 3\n4 5 6\n", "Columns (1,4), (2,5), (3,6) become rows.")], ["1 1\n42\n", "1 4\n1 2 3 4\n", "3 1\n7\n8\n9\n", "3 3\n1 2 3\n4 5 6\n7 8 9\n"], e22)

# ---------------------------------------------------------------- E23
def e23(t):
    a, b = ints(t); res = []
    for x in range(a, b + 1):
        s = str(x)
        if sum(int(d) ** len(s) for d in s) == x: res.append(x)
    return out(" ".join(map(str, res)) if res else "NONE")
P("E23", "Armstrong Numbers", "easy", ["math", "loops"], ["digit extraction", "powers"],
  "An Armstrong number equals the sum of its digits each raised to the power of the number of digits (e.g. 153 = 1³ + 5³ + 3³). Print all Armstrong numbers in the inclusive range [a, b] in increasing order, or <code>NONE</code>.",
  "One line with <code>a</code> and <code>b</code>.", "The numbers separated by spaces, or <code>NONE</code>.", ["1 ≤ a ≤ b ≤ 10<sup>6</sup>"],
  [("100 500\n", "153, 370, 371 and 407 are the only 3-digit Armstrong numbers up to 500.")], ["1 9\n", "10 99\n", "1 1000000\n", "500 1000\n"], e23)

# ---------------------------------------------------------------- E24
def e24(t):
    k_line, text = lines(t)[:2]; k = int(k_line) % 26
    def sh(c):
        if "a" <= c <= "z": return chr((ord(c) - 97 + k) % 26 + 97)
        if "A" <= c <= "Z": return chr((ord(c) - 65 + k) % 26 + 65)
        return c
    return out("".join(map(sh, text)))
P("E24", "Caesar Cipher", "easy", ["strings"], ["character codes", "modulo wrap-around"],
  "Encrypt a line with a Caesar cipher: shift every English letter forward by <code>k</code> positions in the alphabet, wrapping from z to a and keeping its case. Other characters are unchanged. <code>k</code> may be negative (shift backwards) or larger than 26.",
  "The first line contains <code>k</code>; the second contains the text.", "The encrypted line.", ["−10<sup>9</sup> ≤ k ≤ 10<sup>9</sup>", "1 ≤ length ≤ 10<sup>5</sup>"],
  [("3\nHello, World!\n", "H→K, e→h, …, d→g; punctuation unchanged."), ("-1\nabc\n", "Shifting back by one: a wraps to z.")],
  ["26\nZz\n", "52\nPage & Spine\n", "-27\nxyz\n", "1000000000\nThe quick brown fox\n"], e24,
  hints=["In languages where % can be negative, use ((x % 26) + 26) % 26."])

# ---------------------------------------------------------------- E25
def e25(t):
    res = []
    for n in ints(t)[1:]:
        s, peak = 0, n
        while n != 1:
            n = n // 2 if n % 2 == 0 else 3 * n + 1; s += 1; peak = max(peak, n)
        res.append(f"{s} {peak}")
    return out(*res)
P("E25", "Collatz Steps", "easy", ["loops", "math"], ["while loops", "64-bit intermediates"],
  "Starting from <code>n</code>, repeatedly apply: if n is even, n = n / 2; otherwise n = 3n + 1, until n becomes 1. For each query print the number of steps taken and the largest value reached (including the start).",
  "The first line contains <code>q</code>; the second contains <code>q</code> starting values.", "<code>q</code> lines: <code>steps peak</code>.",
  ["1 ≤ q ≤ 100", "1 ≤ n ≤ 10<sup>6</sup> (intermediate values can exceed 32 bits)"],
  [("2\n6 1\n", "6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1: 8 steps, peak 16. For 1 no steps are needed.")], ["1\n27\n", "3\n2 3 4\n", "2\n837799 999999\n"], e25)
