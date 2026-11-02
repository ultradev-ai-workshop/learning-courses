import json
import statistics
import time
from graders import abstained, citations_valid, retrieved_expected
from judge import judge


def run_case(case, answer_fn, judge_client, title_of=None):
    t0 = time.perf_counter()
    text, citations, sent = answer_fn(case["q"])
    row = {"id": case["id"], "ms": (time.perf_counter() - t0) * 1000, "tags": case.get("tags", [])}
    if title_of:                                                       # code grader
        row["citations_valid"] = citations_valid(citations, {title_of(i) for i in sent})
    else:
        row["citations_valid"] = True
    if case.get("answerable", True) is False:
        row["pass"] = abstained(text)                                     # code grader
    else:
        row["retrieved"] = retrieved_expected(sent, case["expected_doc"])  # code grader
        v = judge(judge_client, case["q"], case["reference"], json.dumps(sent), text)   # LLM grader
        row["pass"] = row["retrieved"] and v.correct and v.grounded and row["citations_valid"]
    return row


def run(cases, answer_fn, judge_client, repeats=3, title_of=None):
    rows = [run_case(c, answer_fn, judge_client, title_of) for c in cases for _ in range(repeats)]
    report = {"n": len(rows), "pass_rate": round(sum(r["pass"] for r in rows) / len(rows), 3),
              "p95_ms": round(statistics.quantiles([r["ms"] for r in rows], n=20)[18], 1)}
    by_tag = {}
    for r in rows:
        for t in r["tags"]:
            by_tag.setdefault(t, []).append(r["pass"])
    report["by_tag"] = {t: round(sum(v) / len(v), 2) for t, v in sorted(by_tag.items())}
    return report, rows


def gate(report, baseline, tolerance=0.02):
    """Fail on real regressions, not on noise."""
    if report["pass_rate"] < baseline["pass_rate"] - tolerance:
        raise SystemExit(f"REGRESSION: pass rate {report['pass_rate']} < baseline {baseline['pass_rate']}")
    return "ok"
