import re
from llmkit import count_tokens, TICKETS

PATTERNS = {
    "api_key": re.compile(r"\bsk-[A-Za-z0-9_-]{16,}\b"),
    "aws_key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "email": re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b"),
    "card": re.compile(r"\b(?:\d[ -]?){13,16}\b"),
}


def redact(text):
    found = []
    for name, pat in PATTERNS.items():
        if pat.search(text):
            found.append(name)
            text = pat.sub(f"[{name.upper()}]", text)
    return text, found


def check_input(question, max_tokens=2000):
    if count_tokens(question) > max_tokens:
        raise ValueError(f"question too long ({count_tokens(question)} tokens)")
    return redact(question)


def check_output(answer):
    answer, found = redact(answer)
    unknown = [k for k in re.findall(r"\bOPS-\d+\b", answer) if k not in TICKETS]
    for k in unknown:
        answer = answer.replace(k, f"{k} (unverified)")
    return answer, found, unknown
