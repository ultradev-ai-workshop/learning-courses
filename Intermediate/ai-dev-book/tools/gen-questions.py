"""Generate questions.json: 1000 questions over the 15 chapters and 6 appendices.

Sources: tools/qdata.py (term tables, true/false statements, hand-written scenarios) plus
computed questions. Every computed question stores a Python snippet in run.code whose
printed output is the correct option; tools/verify-questions.py re-runs them all.

Usage:  ~/.local/share/aibook/venv/bin/python tools/gen-questions.py
"""
import itertools
import json
import os
import random
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from qdata import TOPICS, TABLES, FACTS, SCENARIOS  # noqa: E402

TOTAL = 1000
TARGET = {"easy": 400, "medium": 450, "hard": 150}
rng = random.Random(2026)
pool = {t: [] for t in TOPICS}
seen_questions = set()


def add(topic, difficulty, question, correct, wrong, explanation, template, code=None, run=None):
    options = list(correct) + list(wrong)
    if len(set(options)) != len(options) or not 4 <= len(options) <= 6:
        return
    key = (question, tuple(sorted(correct)))
    if key in seen_questions:
        return
    seen_questions.add(key)
    order = list(range(len(options)))
    rng.shuffle(order)
    shuffled = [options[i] for i in order]
    answer = sorted(shuffled.index(c) for c in correct)
    q = {"topic": topic, "difficulty": difficulty, "question": question, "options": shuffled,
         "answer": answer, "explanation": explanation, "template": f"{template}-{topic}"}
    if code:
        q["code"] = code
    if run:
        q["run"] = run
    pool[topic].append(q)


# ---------------------------------------------------------------- tables
for topic, rows in TABLES.items():
    for term, definition in rows:
        others = [r for r in rows if r[0] != term]
        picks = rng.sample(others, 3)
        add(topic, "easy", f"{term}: which description fits?", [definition], [d for _, d in picks],
            f"{term}: {definition}.", "table-fwd")
        picks = rng.sample(others, 3)
        add(topic, "medium", f"Which term matches: {definition}?", [term], [t for t, _ in picks],
            f"{term}: {definition}.", "table-rev")

# ---------------------------------------------------------------- statements
for topic, (true, false) in FACTS.items():
    for t in true:
        add(topic, "easy", "Which statement is true?", [t], rng.sample(false, 3),
            f"True: {t}", "fact-true")
    for f in false:
        add(topic, "medium", "Which statement is false?", [f], rng.sample(true, 3),
            f"False: {f}", "fact-false")
    combos = list(itertools.product(itertools.combinations(true, 2), itertools.combinations(false, 2)))
    rng.shuffle(combos)
    for ts, fs in combos[:6]:
        add(topic, "hard", "Which statements are true? (Select all that apply.)", list(ts), list(fs),
            "True: " + " ".join(ts) + " The others are false.", "fact-multi")

# ---------------------------------------------------------------- scenarios
for topic, items in SCENARIOS.items():
    for difficulty, question, correct, wrong, explanation in items:
        add(topic, difficulty, question, correct, wrong, explanation, "scenario")

# ---------------------------------------------------------------- computed
PRICES = {"claude-haiku-5-5": (0.10, 0.50), "claude-sonnet-5-5": (2.00, 10.00), "claude-opus-5-5": (4.00, 20.00)}
PRICE_TABLE = ("PRICES = {'claude-haiku-5-5': (0.10, 0.50), 'claude-sonnet-5-5': (2.00, 10.00), "
               "'claude-opus-5-5': (4.00, 20.00)}\n")


def money(x, places=4):
    return f"${x:,.{places}f}"


def numeric_options(value, fmt, wrongs):
    correct = fmt(value)
    out = []
    for w in wrongs:
        s = fmt(w)
        if s != correct and s not in out:
            out.append(s)
    return correct, out[:3]


def computed(topic, difficulty, question, code, explanation, wrong_values, fmt, template):
    """code must print the correct answer; wrong_values are plausible mistakes."""
    out = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=60, cwd=os.path.join(ROOT, "playground"))
    if out.returncode:
        raise SystemExit(f"{template}: snippet failed\n{code}\n{out.stderr}")
    value = out.stdout.strip()
    wrong = [w for w in dict.fromkeys(fmt(v) for v in wrong_values) if w != value][:3]
    if len(wrong) < 3:
        return
    add(topic, difficulty, question, [value], wrong, explanation, template,
        code=code.split("# ---\n", 1)[-1] if "# ---\n" in code else None, run={"code": code, "expect": value})


# ch01: cost of one request
for _ in range(60):
    model = rng.choice(list(PRICES))
    tin, tout = rng.choice([800, 2_000, 3_100, 6_000, 10_000, 25_000]), rng.choice([50, 200, 400, 1_000, 2_500])
    pin, pout = PRICES[model]
    v = tin * pin / 1e6 + tout * pout / 1e6
    code = PRICE_TABLE + f"pin, pout = PRICES['{model}']\nprint(f\"${{{tin} * pin / 1e6 + {tout} * pout / 1e6:,.4f}}\")"
    computed(rng.choice(["ch01", "ch01", "ch15", "ch11", "ch03"]), "medium", f"One request to {model} uses {tin:,} input and {tout:,} output tokens "
             f"(${pin} / ${pout} per million). What does it cost?", code,
             "Cost = input × input price + output × output price, per million tokens.",
             [tin * pout / 1e6 + tout * pin / 1e6, (tin + tout) * pin / 1e6, v * 10, v / 2, (tin + tout) * pout / 1e6],
             money, "cost-one")

# ch01: monthly cost
for _ in range(10):
    model = rng.choice(["claude-haiku-5-5", "claude-sonnet-5-5"])
    req = rng.choice([10_000, 40_000, 120_000])
    tin, tout = rng.choice([1_500, 3_100, 6_000]), rng.choice([150, 250, 400])
    pin, pout = PRICES[model]
    v = req * (tin * pin + tout * pout) / 1e6
    code = PRICE_TABLE + f"pin, pout = PRICES['{model}']\nprint(f\"${{{req} * ({tin} * pin + {tout} * pout) / 1e6:,.2f}}\")"
    computed("ch01", "hard", f"A feature makes {req:,} requests a month on {model}, each with {tin:,} input and "
             f"{tout:,} output tokens. Monthly cost?", code, "requests × (input × in-price + output × out-price) / 1e6.",
             [v * 10, v / 10, req * (tin + tout) * pin / 1e6, req * (tin + tout) * pout / 1e6], lambda x: money(x, 2), "cost-month")

# ch01: chat growth
for per, turns in [(200, 5), (200, 10), (100, 20), (300, 8), (150, 12)]:
    total = sum(per * (2 * t - 1) for t in range(1, turns + 1))
    code = f"print(f\"{{sum({per} * (2 * t - 1) for t in range(1, {turns} + 1)):,}}\")"
    computed("ch01", "hard", f"Each message is {per} tokens and every turn resends the whole history (turn t sends "
             f"2t-1 messages). Total input tokens over {turns} turns?", code,
             "The sum of 2t-1 for t = 1..n is n², so total input grows with the square of the turns.",
             [per * turns, per * 2 * turns, total // 2, total * 2], lambda x: f"{int(x):,}", "chat-growth")

# ch01: softmax
for scores, t in [((2.0, 1.0, 0.5), 1.0), ((2.0, 1.0, 0.5), 0.5), ((3.0, 1.0, 0.0), 1.0), ((1.0, 1.0, 0.0), 1.0), ((2.0, 1.0, 0.5), 2.0)]:
    code = (f"import math\ns = {list(scores)}\nt = {t}\ne = [math.exp(x / t) for x in s]\n"
            "print(f'{e[0] / sum(e):.2f}')")
    import math
    e = [math.exp(x / t) for x in scores]
    p = e[0] / sum(e)
    computed("ch01", "hard", f"Raw scores {list(scores)} for three tokens, temperature {t}. "
             "What probability does softmax give the first token (2 decimals)?", code,
             "softmax(s/T): exp(s_i/T) / sum of exp(s_j/T).",
             [1 / 3, scores[0] / sum(scores), min(0.99, p + 0.15), max(0.01, p - 0.15)], lambda x: f"{x:.2f}", "softmax")

# ch03: backoff cap
for attempt in [0, 1, 2, 3, 5, 6, 8]:
    code = f"print(f'{{min(30.0, 0.5 * 2 ** {attempt}):g}} s')"
    v = min(30.0, 0.5 * 2 ** attempt)
    computed("ch03", "medium", f"Full-jitter backoff waits a random time up to min(30, 0.5 × 2^attempt) seconds. "
             f"What is the cap for attempt {attempt}?", code, "Exponential growth, capped at 30 seconds.",
             [0.5 * attempt, 0.5 * 2 ** (attempt + 1) if attempt < 6 else 60.0, 2 ** attempt, 30.0 if v != 30.0 else 15.0],
             lambda x: f"{x:g} s", "backoff")

# ch06: cosine
for a, b in [((1, 0), (1, 1)), ((1, 2), (2, 4)), ((1, 0), (0, 1)), ((3, 4), (4, 3)), ((1, 1), (-1, -1)), ((2, 0, 1), (1, 1, 0))]:
    code = (f"import math\na, b = {list(a)}, {list(b)}\ndot = sum(x * y for x, y in zip(a, b))\n"
            "print(f'{dot / (math.hypot(*a) * math.hypot(*b)):.2f}')")
    dot = sum(x * y for x, y in zip(a, b))
    v = dot / (math.hypot(*a) * math.hypot(*b))
    computed("ch06", "medium", f"What is the cosine similarity of {list(a)} and {list(b)} (2 decimals)?", code,
             "dot(a, b) / (|a| × |b|).", [dot, 1.0 if v != 1 else 0.5, -v if v else 0.5, abs(v) / 2 + 0.3], lambda x: f"{x:.2f}", "cosine")

# ch06: recall@k
for ranks, k in [([1, 3, 0, 2, 7], 3), ([1, 1, 2, 0], 1), ([4, 2, 0, 1, 1, 6], 5), ([2, 2, 3, 1], 2), ([1, 0, 0, 5, 2], 3), ([3, 1, 1, 8, 2], 2), ([6, 1, 0, 2], 5)]:
    code = f"ranks = {ranks}  # rank of the right document per question; 0 = not found\nk = {k}\nprint(f'{{sum(1 for r in ranks if 0 < r <= k) / len(ranks):.2f}}')"
    v = sum(1 for r in ranks if 0 < r <= k) / len(ranks)
    computed("ch06", "medium", f"The right document was found at ranks {ranks} for five-ish questions (0 = not found). "
             f"What is recall@{k}?", code, "recall@k = share of questions whose right item is in the top k.",
             [sum(1 for r in ranks if r == 1) / len(ranks), sum(1 for r in ranks if r > 0) / len(ranks), v / 2, min(1.0, v + 0.2)],
             lambda x: f"{x:.2f}", "recall-k")

# ch07: RRF
lists = [(["a", "b", "c"], ["c", "a"]), (["x", "y", "z"], ["z", "x"]), (["p", "q", "r", "s"], ["s", "r"]), (["m", "n"], ["n", "o", "m"]),
         (["d", "e", "f"], ["f", "e", "d"])]
for la, lb in lists:
    code = (f"A, B = {la}, {lb}\nscores = {{}}\nfor ranking in (A, B):\n    for rank, item in enumerate(ranking, start=1):\n"
            "        scores[item] = scores.get(item, 0) + 1 / (60 + rank)\nprint(' > '.join(sorted(scores, key=lambda i: -scores[i])))")
    items = sorted(set(la) | set(lb))
    perms = [" > ".join(p) for p in itertools.permutations(items)]
    computed("ch07", "hard", f"Fuse list A = {la} and list B = {lb} with reciprocal rank fusion (k = 60). Final order?",
             code, "Each list adds 1/(60 + rank) per item; items high in both lists win.", rng.sample(perms, min(6, len(perms))),
             str, "rrf")

# ch07: MRR
for ranks in [[1, 2, 0], [1, 1, 4], [2, 3, 1, 0], [1, 2, 2, 5], [3, 0, 1]]:
    code = f"ranks = {ranks}  # 0 = not retrieved\nprint(f'{{sum(1 / r if r else 0 for r in ranks) / len(ranks):.2f}}')"
    v = sum(1 / r if r else 0 for r in ranks) / len(ranks)
    computed("ch07", "medium", f"The expected chunk was ranked {ranks} for each question (0 = not retrieved). What is MRR?",
             code, "MRR = average of 1/rank, counting 0 for misses.",
             [sum(1 for r in ranks if r == 1) / len(ranks), sum(ranks) / len(ranks) / 10, min(1, v + 0.15), max(0, v - 0.12)],
             lambda x: f"{x:.2f}", "mrr")

# ch08: agent latency and cost
for steps, sec in [(6, 2.5), (8, 3), (4, 1.5), (10, 2), (5, 4), (12, 1.5), (3, 6)]:
    code = f"print(f'{{{steps} * {sec}:g}} s')"
    computed("ch08", "easy", f"An agent takes {steps} steps of {sec} s each. How long does the user wait?", code,
             "Each step is a full model round trip.", [sec, steps + sec, steps * sec * 2, steps * sec / 2], lambda x: f"{x:g} s", "agent-latency")

# ch10: kappa and Wilson
for human, judge in [([1, 1, 1, 0, 1, 0, 1, 1, 0, 1], [1, 1, 0, 0, 1, 0, 1, 1, 1, 1]),
                     ([1] * 8 + [0] * 2, [1] * 10), ([1, 0, 1, 0, 1, 0, 1, 0], [1, 0, 1, 0, 1, 1, 1, 0])]:
    code = (f"h, j = {human}, {judge}\nn = len(h)\no = sum(a == b for a, b in zip(h, j)) / n\n"
            "ph, pj = sum(h) / n, sum(j) / n\ne = ph * pj + (1 - ph) * (1 - pj)\nprint(f'{(o - e) / (1 - e):.2f}')")
    n = len(human)
    o = sum(a == b for a, b in zip(human, judge)) / n
    computed("ch10", "hard", f"Human labels {human} and judge labels {judge}. What is Cohen's kappa (2 decimals)?", code,
             "kappa = (observed − expected agreement) / (1 − expected).", [o, 1 - o, o / 2 + 0.1, 0.95], lambda x: f"{x:.2f}", "kappa")
for passed, n in [(17, 20), (45, 50), (85, 100), (9, 10), (36, 40), (180, 200)]:
    code = (f"from math import sqrt\np, n, z = {passed} / {n}, {n}, 1.96\nc = (p + z*z/(2*n)) / (1 + z*z/n)\n"
            "h = z * sqrt(p*(1-p)/n + z*z/(4*n*n)) / (1 + z*z/n)\nprint(f'{c - h:.0%}')")
    p = passed / n
    computed("ch10", "hard", f"{passed}/{n} cases pass. What is the lower end of the 95% Wilson interval (whole percent)?", code,
             "Small sets give wide intervals; the lower bound is well below the observed rate.",
             [p, p - 0.02, p - 0.40, 0.5], lambda x: f"{x:.0%}", "wilson")

# ch11: caching and batches
for prefix, rest, req in [(6000, 200, 10), (6000, 1500, 100), (2000, 500, 50), (10000, 300, 20)]:
    code = (f"prefix, rest, req, price = {prefix}, {rest}, {req}, 2.00\n"
            "cached = (prefix * 1.25 + rest + (req - 1) * (prefix * 0.10 + rest)) * price / 1e6\nprint(f'${cached:.4f}')")
    plain = req * (prefix + rest) * 2 / 1e6
    cached = (prefix * 1.25 + rest + (req - 1) * (prefix * 0.10 + rest)) * 2 / 1e6
    computed("ch11", "hard", f"{req} requests reuse a {prefix:,}-token cached prefix plus {rest:,} other input tokens at $2 per "
             "million (write 1.25×, read 0.1×). Total input cost?", code, "One write, then reads at a tenth of the price.",
             [plain, plain * 0.1, cached * 1.25, (req * prefix * 0.1 + req * rest) * 2 / 1e6 * 2], lambda x: f"${x:.4f}", "cache-cost")
for req, tin, tout in [(200_000, 900, 40), (50_000, 3_000, 200), (10_000, 6_000, 400), (400_000, 500, 20), (80_000, 1_200, 60)]:
    code = PRICE_TABLE + f"pin, pout = PRICES['claude-haiku-5-5']\nprint(f\"${{0.5 * {req} * ({tin} * pin + {tout} * pout) / 1e6:,.2f}}\")"
    v = 0.5 * req * (tin * 0.10 + tout * 0.50) / 1e6
    computed("ch11", "medium", f"{req:,} classification requests ({tin} in / {tout} out tokens) on claude-haiku-5-5 via the "
             "Batches API (50% off). Cost?", code, "Batches cost half the normal price.", [v * 2, v / 2, v * 4], lambda x: money(x, 2), "batch-cost")

# ch13 / ch14: precision, recall, F1
for tp, fp, fn in [(8, 5, 2), (40, 10, 10), (9, 1, 6), (30, 30, 0)]:
    for metric, topic in (("precision", "ch13"), ("recall", "ch14"), ("F1", "ch14")):
        code = (f"tp, fp, fn = {tp}, {fp}, {fn}\np, r = tp / (tp + fp), tp / (tp + fn)\n"
                f"print(f'{{{'p' if metric == 'precision' else 'r' if metric == 'recall' else '2 * p * r / (p + r)'}:.2f}}')")
        p, r = tp / (tp + fp), tp / (tp + fn)
        v = {"precision": p, "recall": r, "F1": 2 * p * r / (p + r)}[metric]
        computed(topic, "medium" if metric != "F1" else "hard",
                 f"A SEV1 detector has {tp} true positives, {fp} false positives and {fn} false negatives. What is its {metric}?",
                 code, "precision = tp/(tp+fp); recall = tp/(tp+fn); F1 = 2pr/(p+r).",
                 [p, r, (p + r) / 2, tp / (tp + fp + fn), 1 - v], lambda x: f"{x:.2f}", f"cls-{metric}")

# ch14: quantization
for bits in (8, 4, 3, 2):
    code = f"bits = {bits}\nprint(f'{{2 ** (bits - 1) - 1}} levels each side, {{32 // bits}}x smaller than float32')"
    computed("ch14", "easy", f"Symmetric {bits}-bit quantization: how many positive levels, and how much smaller than float32?",
             code, "Signed b-bit integers have 2^(b-1) − 1 positive levels; 32/b × smaller than float32.",
             [f"{2 ** bits} levels each side, {32 // bits}x smaller than float32",
              f"{2 ** (bits - 1)} levels each side, {16 // bits}x smaller than float32",
              f"{bits} levels each side, {bits}x smaller than float32"], str, "quantize")

# appF: multi-agent calls
for agents, turns in [(3, 4), (5, 6), (2, 10), (4, 3), (6, 5), (3, 7)]:
    code = f"print({agents} * {turns}, 'calls')"
    computed("appF", "easy", f"A crew of {agents} agents, each taking {turns} turns, makes how many model calls?", code,
             "Every agent turn is a model call.", [f"{agents + turns} calls", f"{turns} calls", f"{agents ** 2 * turns} calls"], str, "crew-calls")

# ch09: integrations with and without a protocol
for apps, systems in [(4, 10), (6, 25), (3, 8), (10, 40), (5, 12), (8, 8)]:
    code = f"apps, systems = {apps}, {systems}\nprint(f'{{apps * systems}} without MCP, {{apps + systems}} with MCP')"
    computed("ch09", "easy", f"{apps} AI applications must use {systems} internal systems. How many integrations without and with MCP?",
             code, "Without a protocol every app needs every system (N × M); with MCP each side implements it once (N + M).",
             [f"{apps + systems} without MCP, {apps * systems} with MCP", f"{apps * systems} without MCP, {systems} with MCP",
              f"{apps * systems * 2} without MCP, {apps + systems} with MCP"], str, "mcp-n-m")

# ch15: team budget
for used, limit, ask in [(48_000, 50_000, 3_000), (10_000, 50_000, 4_000), (50_000, 50_000, 100), (49_999, 50_000, 900), (20_000, 25_000, 6_000)]:
    code = (f"used, limit = {used}, {limit}\n# DocsPilot checks the budget BEFORE the call; the call then costs {ask} tokens\n"
            "print('refused (429)' if used >= limit else 'answered, budget then ' + ('exceeded' if used + " + str(ask) + " > limit else 'ok'))")
    computed("ch15", "medium", f"Team payments has used {used:,} of its {limit:,} daily tokens. A question that will cost {ask:,} tokens "
             "arrives. What happens?", code, "The check happens before any model call: only a team already at or over its limit is refused.",
             ["refused (429)", "answered, budget then exceeded", "answered, budget then ok", "degraded answer"], str, "budget")

# ch13: shadow accuracy
for agree, total in [(89, 100), (412, 500), (95, 120), (1730, 2000), (66, 80)]:
    code = f"agree, total = {agree}, {total}\nprint(f'{{agree / total:.1%}}')"
    v = agree / total
    computed("ch13", "easy", f"In shadow mode the model agreed with the human router on {agree} of {total} tickets. Accuracy?",
             code, "Accuracy = agreements / total; then look per class.", [1 - v, v + 0.05, v - 0.05, total / (agree + total)],
             lambda x: f"{x:.1%}", "shadow-acc")

# ch04 / ch05 / ch02: code-output questions (real Python)
CODE_QS = [
    ("ch04", "medium", "What does this print?",
     "from typing import Literal\nfrom pydantic import BaseModel, ValidationError\n# ---\n"
     "class T(BaseModel):\n    severity: Literal['sev1', 'sev2']\ntry:\n    T.model_validate_json('{\"severity\": \"critical\"}')\n    print('valid')\n"
     "except ValidationError as e:\n    print(e.errors()[0]['type'])",
     ["valid", "missing", "string_type"], "Literal values not in the set fail with a literal_error."),
    ("ch04", "medium", "What does this print?",
     "from pydantic import BaseModel, ValidationError\n# ---\nclass T(BaseModel):\n    summary: str\n    services: list[str]\n"
     "try:\n    T.model_validate_json('{\"summary\": \"x\"}')\nexcept ValidationError as e:\n    print(e.errors()[0]['type'], e.errors()[0]['loc'])",
     ["literal_error ('services',)", "missing ('summary',)", "list_type ('services',)"], "A required field that is absent is a 'missing' error."),
    ("ch04", "easy", "What does this print?",
     "from pydantic import BaseModel\n# ---\nclass Incident(BaseModel):\n    started_at: str | None\nprint(Incident.model_validate_json('{\"started_at\": null}').started_at)",
     ["null", "''", "an error"], "A nullable field accepts null, which becomes None."),
    ("ch02", "medium", "What does this print?",
     "# ---\ntext = 'a </doc> b'\nsafe = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')\nprint(f'<doc>{safe}</doc>'.count('</doc>'))",
     ["2", "0", "3"], "Escaping turns the injected </doc> into &lt;/doc&gt;, leaving only the real closing tag."),
    ("ch02", "medium", "What does this print?",
     "import re\n# ---\nreply = '<analysis>slow deploy</analysis><answer>Roll back</answer>'\nm = re.search(r'<answer>(.*?)</answer>', reply)\nprint(m.group(1))",
     ["slow deploy", "<answer>Roll back</answer>", "None"], "The non-greedy group captures only the answer text."),
    ("ch05", "medium", "How many user messages does this build for the tool results?",
     "# ---\ncalls = [('get_oncall', 'web'), ('get_ticket', 'OPS-1'), ('get_oncall', 'data')]\nresults = [{'type': 'tool_result', 'tool_use_id': f'id{i}'} for i, _ in enumerate(calls)]\n"
     "messages = [{'role': 'user', 'content': results}]\nprint(len(messages), 'message with', len(messages[0]['content']), 'results')",
     ["3 message with 1 results", "1 message with 1 results", "3 message with 3 results"], "All results for one assistant turn go in one user message."),
    ("ch03", "easy", "What does this print?",
     "# ---\nRETRYABLE = {408, 409, 429, 500, 502, 503, 504, 529}\nprint([s for s in (400, 401, 404, 429, 529) if s in RETRYABLE])",
     ["[400, 429, 529]", "[401, 429]", "[429]"], "Client errors are fixed, not retried; 429 and 529 are transient."),
    ("ch08", "medium", "What does this print?",
     "import json\n# ---\nseen, out = set(), []\nfor name, args in [('search', {'q': 'db'}), ('search', {'q': 'db'}), ('search', {'q': 'vpn'})]:\n"
     "    sig = (name, json.dumps(args, sort_keys=True))\n    out.append('dup' if sig in seen else 'run')\n    seen.add(sig)\nprint(out)",
     ["['run', 'run', 'run']", "['run', 'dup', 'dup']", "['dup', 'run', 'run']"], "Only an identical name + arguments pair counts as a repeat."),
    ("ch12", "medium", "What does this print?",
     "import re\n# ---\ntext = 'See ![s](https://evil.example/x) and [docs](https://docs.acme.internal)'\nprint(re.sub(r'!\\[([^\\]]*)\\]\\([^)]*\\)', r'[image removed: \\1]', text))",
     ["See  and [docs](https://docs.acme.internal)", "See ![s](https://evil.example/x) and [docs]", "See [image removed: s] and [link removed]"],
     "The image is replaced by text; the plain link is untouched by this pattern."),
    ("ch11", "medium", "What does this print?",
     "# ---\ntokens, rate, cap = 2000, 10000 / 60, 2000\nok = []\nfor n in (800, 800, 800):\n    ok.append(tokens >= n)\n    if tokens >= n:\n        tokens -= n\nprint(ok)",
     ["[True, True, True]", "[True, False, False]", "[False, True, True]"], "The bucket holds 2,000 tokens; the third 800-token request must wait."),
    ("appB", "medium", "What does this print?",
     "import operator\nfrom typing import Annotated, TypedDict\nfrom langgraph.graph import StateGraph, START, END\n# ---\nclass S(TypedDict):\n    log: Annotated[list, operator.add]\n"
     "g = StateGraph(S)\ng.add_node('a', lambda s: {'log': ['a']})\ng.add_node('b', lambda s: {'log': ['b']})\ng.add_edge(START, 'a')\ng.add_edge('a', 'b')\ng.add_edge('b', END)\n"
     "print(g.compile().invoke({'log': ['start']})['log'])",
     ["['b']", "['a', 'b']", "['start', 'b']"], "The reducer appends each update to the existing list."),
    ("appA", "easy", "What does this print?",
     "from langchain_core.runnables import RunnableLambda\n# ---\nchain = RunnableLambda(lambda s: s.strip()) | RunnableLambda(lambda s: s.upper())\nprint(chain.invoke('  sev1 '))",
     ["  SEV1 ", "sev1", "  sev1 "], "The pipe passes each runnable's output to the next."),
    ("appE", "easy", "Which fields does this print?",
     "import dspy\n# ---\nprint(list(dspy.ChainOfThought('ticket -> severity').predict.signature.output_fields))",
     ["['severity']", "['ticket', 'severity']", "['answer']"], "ChainOfThought adds a reasoning field before the declared outputs."),
]
for topic, diff, question, code, wrongs, expl in CODE_QS:
    computed(topic, diff, question, code, expl, wrongs, str, "code-output")


# ---------------------------------------------------------------- select 1000
def select():
    chosen, used = [], set()
    per_topic = {t: len(qs) for t, qs in pool.items()}
    # every topic keeps everything up to a fair share; trim the largest pools first
    share = TOTAL // len(TOPICS)
    for t, qs in pool.items():
        rng.shuffle(qs)
    counts = {t: min(len(qs), share) for t, qs in pool.items()}
    while sum(counts.values()) < TOTAL:
        spare = [t for t in pool if counts[t] < len(pool[t])]
        if not spare:
            raise SystemExit("not enough questions")
        counts[max(spare, key=lambda t: len(pool[t]) - counts[t])] += 1
    for t, qs in pool.items():
        # prefer a mix: sort so that each topic's pick follows the global difficulty target
        by = {d: [q for q in qs if q["difficulty"] == d] for d in TARGET}
        want = {d: round(counts[t] * TARGET[d] / TOTAL) for d in TARGET}
        picked = []
        for d in ("hard", "medium", "easy"):
            picked += by[d][:want[d]]
        rest = [q for q in qs if q not in picked]
        picked += rest[: counts[t] - len(picked)]
        chosen += picked[: counts[t]]
    return chosen


questions = select()
order = list(TOPICS)
questions.sort(key=lambda q: (order.index(q["topic"]), q["template"], q["question"]))
for i, q in enumerate(questions, 1):
    num, title, file = TOPICS[q["topic"]]
    q.update(id=i, chapter=num, chapterFile=file)
    questions[i - 1] = {k: q[k] for k in ("id", "topic", "chapter", "chapterFile", "difficulty", "question", "code",
                                           "options", "answer", "explanation", "template", "run") if k in q}
data = {"version": 1, "topic": "AI for Developers: building with LLMs (Intermediate)", "generated": "2026-11-02",
        "total": len(questions),
        "chapters": {t: {"number": n, "title": ti, "file": f} for t, (n, ti, f) in TOPICS.items()},
        "questions": questions}
with open(os.path.join(ROOT, "questions.json"), "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)

from collections import Counter
print("pool:", {t: len(q) for t, q in pool.items()})
print("total", len(questions), Counter(q["difficulty"] for q in questions),
      "multi", sum(len(q["answer"]) > 1 for q in questions), "computed", sum("run" in q for q in questions))
print("per topic:", dict(Counter(q["topic"] for q in questions)))
