"""llmkit: the book's offline toolkit.

Everything here runs without a network connection or an API key, and gives the same
result on every run, so every example in the book can be checked automatically.

- tokenize(), count_tokens()     a toy tokenizer (real tokenizers differ, the ideas don't)
- TinyLM                         a next-token model you can train in a second
- embed(), cosine()              a small deterministic embedding model
- load_docs(), ONCALL, TICKETS   the DocsPilot sample company: docs, on-call rota, tickets
- FakeAnthropic                  a drop-in fake for anthropic.Anthropic() in tests
- mock_api()                     a local HTTP server that speaks the Messages API, so the
                                 real anthropic / openai SDKs run against it unchanged

Run `python llmkit.py serve` to start the mock server and print the environment
variables that point the real SDKs at it.
"""
from __future__ import annotations

import contextlib
import hashlib
import json
import math
import os
import random
import re
import threading
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent

# ---------------------------------------------------------------- models and prices
# USD per million tokens (input, output), from the Claude pricing page, October 2026.
PRICES = {
    "claude-opus-5-5": (4.00, 20.00),
    "claude-sonnet-5-5": (2.00, 10.00),
    "claude-haiku-5-5": (0.10, 0.50),
}
KNOWN_MODELS = set(PRICES) | {"claude-fable-5-1", "claude-opus-5", "claude-sonnet-5", "claude-opus-4-8"}
# Models that reject forced tool_choice ("any" / "tool") with a 400.
NO_FORCED_TOOLS = {"claude-opus-5-5", "claude-sonnet-5-5", "claude-fable-5-1"}


def cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Price of one request in USD."""
    pin, pout = PRICES[model]
    return input_tokens * pin / 1e6 + output_tokens * pout / 1e6


# ---------------------------------------------------------------- tokens
_PIECE = re.compile(r" ?[A-Za-z]+| ?[0-9]{1,3}| ?[^\sA-Za-z0-9]|\s+")


def tokenize(text: str) -> list[str]:
    """Split text into tokens: words keep their leading space, long words are cut into
    pieces of 4 letters, numbers into groups of up to 3 digits, punctuation stays alone."""
    out = []
    for piece in _PIECE.findall(text):
        word = piece.lstrip(" ")
        if word.isalpha() and len(word) > 6:
            lead = piece[: len(piece) - len(word)]
            parts = [word[i:i + 4] for i in range(0, len(word), 4)]
            out.append(lead + parts[0])
            out.extend(parts[1:])
        else:
            out.append(piece)
    return out


def count_tokens(text: str) -> int:
    return len(tokenize(text))


# ---------------------------------------------------------------- a tiny language model
def softmax(scores: dict, temperature: float = 1.0) -> dict:
    """Turn scores into probabilities. Lower temperature sharpens, higher flattens."""
    if temperature <= 0:
        best = max(scores, key=scores.get)
        return {k: (1.0 if k == best else 0.0) for k in scores}
    m = max(scores.values())
    exps = {k: math.exp((v - m) / temperature) for k, v in scores.items()}
    total = sum(exps.values())
    return {k: v / total for k, v in exps.items()}


class TinyLM:
    """A bigram model: the next word depends only on the previous word.
    Real LLMs condition on the whole context with a neural network, but the
    generation loop (predict a distribution, pick one token, append, repeat) is the same."""

    def __init__(self, corpus: str):
        self.counts: dict[str, dict[str, int]] = {}
        words = corpus.lower().split()
        for a, b in zip(words, words[1:]):
            self.counts.setdefault(a, {}).setdefault(b, 0)
            self.counts[a][b] += 1

    def next_probs(self, word: str, temperature: float = 1.0) -> dict:
        nxt = self.counts.get(word.lower())
        if not nxt:
            return {}
        scores = {w: math.log(c) for w, c in nxt.items()}
        probs = softmax(scores, temperature)
        return dict(sorted(probs.items(), key=lambda kv: (-kv[1], kv[0])))

    def generate(self, prompt: str, max_words: int = 8, temperature: float = 1.0, seed: int = 0) -> str:
        rng = random.Random(seed)
        words = prompt.lower().split()
        for _ in range(max_words):
            probs = self.next_probs(words[-1], temperature)
            if not probs:
                break
            r, acc = rng.random(), 0.0
            for w, p in probs.items():
                acc += p
                if r <= acc:
                    words.append(w)
                    break
            else:
                words.append(next(iter(probs)))
        return " ".join(words)


# ---------------------------------------------------------------- embeddings
STOP = set("a an the is are was were be to of in on for and or with at by it this that how do does i my me we our "
           "you your can what when where which who why from as if not no yes".split())
# Words in one group share a meaning, so they land in the same direction.
SYNONYMS = [
    "password credential credentials login signin sign-in logon passphrase",
    "reset recover forgot forgotten lost restore",
    "deploy deployment release ship rollout",
    "rollback revert undo",
    "database db postgres postgresql sql",
    "failover failback replica standby",
    "outage incident downtime down unavailable",
    "payment payments checkout billing card",
    "oncall on-call pager paged rota rotation",
    "vpn tunnel remote",
    "secret secrets key keys token vault",
    "slow latency lag timeout timeouts",
    "error errors failure failing failed fail exception",
    "laptop machine computer setup install",
    "queue kafka topic broker message messages",
    "cat kitten feline",
    "dog puppy canine",
]
_GROUP = {}
for _i, _line in enumerate(SYNONYMS):
    for _w in _line.split():
        _GROUP[_w] = f"#{_i}"


def _norm(word: str) -> str:
    word = word.lower()
    if word in _GROUP:
        return _GROUP[word]
    for suffix in ("ing", "ed", "es", "s"):
        if word.endswith(suffix) and len(word) - len(suffix) >= 3:
            stem = word[: -len(suffix)]
            if stem in _GROUP:
                return _GROUP[stem]
            if suffix == "s":
                return stem
    return word


def _bucket(feature: str, dim: int, model: str = "toy-1") -> tuple[int, float]:
    if model != "toy-1":
        feature = model + "|" + feature
    h = hashlib.sha256(feature.encode()).digest()
    return int.from_bytes(h[:4], "big") % dim, 1.0


def embed(text: str, dim: int = 256, model: str = "toy-1") -> list[float]:
    """A deterministic embedding: each meaningful word (synonyms share an id) and a few
    character trigrams are hashed into a fixed-size vector, which is then normalized.
    A different `model` name hashes differently, like a different embedding model."""
    vec = [0.0] * dim
    for word in re.findall(r"[a-z0-9][a-z0-9-]*", text.lower()):
        if word in STOP:
            continue
        key = _norm(word)
        i, s = _bucket("w:" + key, dim, model)
        vec[i] += s
        if not key.startswith("#"):
            padded = f"^{key}$"
            for j in range(len(padded) - 2):
                i, s = _bucket("t:" + padded[j:j + 3], dim, model)
                vec[i] += 0.1 * s
    n = math.sqrt(sum(x * x for x in vec)) or 1.0
    return [round(x / n, 6) for x in vec]


def cosine(a, b) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a)) or 1.0
    nb = math.sqrt(sum(y * y for y in b)) or 1.0
    return dot / (na * nb)


# ---------------------------------------------------------------- the DocsPilot sample company
@dataclass
class Doc:
    id: str
    title: str
    text: str
    meta: dict = field(default_factory=dict)


def load_docs(folder: str | Path | None = None) -> list[Doc]:
    """The sample internal docs (runbooks, ADRs, guides) in playground/docs."""
    folder = Path(folder) if folder else HERE / "docs"
    docs = []
    for p in sorted(folder.glob("*.md")):
        text = p.read_text(encoding="utf-8")
        title = text.splitlines()[0].lstrip("# ").strip()
        kind = p.stem.split("-")[0]
        docs.append(Doc(p.stem, title, text, {"kind": kind, "path": f"docs/{p.name}"}))
    return docs


ONCALL = {"payments": "priya", "platform": "marco", "data": "lena", "web": "sam"}
TICKETS = {
    "OPS-101": {"title": "Checkout returns 502 for EU users", "status": "open", "team": "payments", "severity": "SEV2"},
    "OPS-102": {"title": "Nightly export job slow", "status": "in_progress", "team": "data", "severity": "SEV3"},
    "OPS-103": {"title": "Login page typo", "status": "closed", "team": "web", "severity": "SEV4"},
}


# ---------------------------------------------------------------- the fake model's "brain"
class APIError(Exception):
    def __init__(self, status: int, kind: str, message: str):
        super().__init__(message)
        self.status, self.kind, self.message = status, kind, message

    def body(self):
        return {"type": "error", "error": {"type": self.kind, "message": self.message}}


def _text_of(content) -> str:
    if isinstance(content, str):
        return content
    return " ".join(b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text")


def validate(req: dict) -> None:
    """The checks the real API makes that matter most in this book."""
    bad = lambda msg: APIError(400, "invalid_request_error", msg)
    model = req.get("model")
    if not model:
        raise bad("model: Field required")
    if model not in KNOWN_MODELS:
        raise APIError(404, "not_found_error", f"model: {model}")
    if not isinstance(req.get("max_tokens"), int) or req["max_tokens"] < 1:
        raise bad("max_tokens: Field required (a positive integer)")
    for p in ("temperature", "top_p", "top_k"):
        if p in req:
            raise bad(f"{p}: sampling parameters are not supported on this model; use output_config.effort")
    msgs = req.get("messages")
    if not msgs:
        raise bad("messages: at least one message is required")
    if msgs[0].get("role") != "user":
        raise bad("messages: the first message must use the user role")
    if msgs[-1].get("role") == "assistant":
        raise bad("messages: this model does not support assistant message prefill; the last message must be a user message")
    th = req.get("thinking") or {}
    if th.get("type") == "disabled" and model in {"claude-opus-5-5", "claude-fable-5-1"}:
        raise bad("thinking: type 'disabled' is not supported on this model; lower output_config.effort instead")
    if th.get("type") == "enabled":
        raise bad("thinking: budget_tokens is not supported on this model; use {'type': 'adaptive'}")
    tc = (req.get("tool_choice") or {}).get("type")
    if tc in ("any", "tool") and model in NO_FORCED_TOOLS:
        raise bad(f'tool_choice: type "tool" and "any" are not supported for this model.')
    tool_names = {t.get("name") for t in req.get("tools") or []}
    seen_ids = set()
    for i, m in enumerate(msgs):
        if m.get("role") not in ("user", "assistant", "system"):
            raise bad(f"messages.{i}.role: must be 'user' or 'assistant'")
        content = m.get("content")
        if content in (None, "", []):
            raise bad(f"messages.{i}.content: must not be empty")
        if isinstance(content, list):
            for b in content:
                t = b.get("type")
                if t == "tool_use":
                    seen_ids.add(b.get("id"))
                    if b.get("name") not in tool_names:
                        raise bad(f"messages.{i}: tool_use '{b.get('name')}' has no matching tool definition")
                if t == "tool_result" and b.get("tool_use_id") not in seen_ids:
                    raise bad(f"messages.{i}: tool_result block(s) provided with id {b.get('tool_use_id')!r} "
                              "but no matching tool_use block in the previous assistant message")
    for t in req.get("tools") or []:
        if "type" not in t and not isinstance(t.get("input_schema"), dict):
            raise bad(f"tools: '{t.get('name')}' needs an input_schema")


def sample_from_schema(schema: dict, hint: str = "", root: dict | None = None) -> object:
    """A minimal valid instance of a JSON Schema (what constrained decoding guarantees)."""
    root = root or schema
    if "$ref" in schema:                                  # "#/$defs/Severity"
        target = root
        for part in schema["$ref"].lstrip("#/").split("/"):
            target = target[part]
        return sample_from_schema(target, hint, root)
    if "const" in schema:
        return schema["const"]
    if "enum" in schema:
        return schema["enum"][0]
    for key in ("anyOf", "oneOf", "allOf"):
        if key in schema:
            return sample_from_schema(schema[key][0], hint, root)
    t = schema.get("type")
    if isinstance(t, list):
        t = t[0]
    if t == "object" or "properties" in schema:
        props = schema.get("properties", {})
        req = schema.get("required", list(props))
        return {k: sample_from_schema(props[k], k, root) for k in props if k in req}
    if t == "array":
        n = max(1, schema.get("minItems", 1))
        return [sample_from_schema(schema.get("items", {"type": "string"}), hint, root) for _ in range(n)]
    if t == "integer":
        return max(1, schema.get("minimum", 1))
    if t == "number":
        return float(schema.get("minimum", 1))
    if t == "boolean":
        return True
    if t == "null":
        return None
    return f"example {hint}".strip()


def _words(s: str) -> set:
    return {_norm(w) for w in re.findall(r"[a-z]+", s.lower()) if w not in STOP}


def _fill_args(schema: dict, question: str, tool_description: str = "") -> dict:
    """Arguments for a tool call: values the question mentions (an enum value, an example
    named in the parameter description, an ID such as OPS-101), else a minimal valid value."""
    args = sample_from_schema(schema)
    props = schema.get("properties", {})
    words = re.findall(r"[A-Za-z0-9_-]+", question)
    lower = [w.lower() for w in words]
    ids = re.findall(r"\b[A-Z]{2,}-\d+\b", question)
    for k in args:
        p = props.get(k, {})
        if p.get("type") not in (None, "string"):
            continue
        examples = " ".join(re.findall(r"(?:such as|e\.g\.|for example|like)\s+([^.;:()]+)", tool_description))
        candidates = (list(p.get("enum", [])) or re.findall(r"[a-z][a-z0-9_-]+", p.get("description", ""))
                      + re.findall(r"[a-z][a-z0-9_-]+", examples))
        hit = next((c for c in candidates if c.lower() in lower and c.lower() not in STOP), None)
        if ids and ("id" in k.lower() or "key" in k.lower() or "ticket" in k.lower()):
            args[k] = ids[0]
        elif hit:
            args[k] = hit
        elif "query" in k.lower() or "question" in k.lower() or "text" in k.lower():
            args[k] = question
    return args


def brain(req: dict) -> dict:
    """Decide the reply for a validated request. Deterministic, and honest about being a fake."""
    msgs = req["messages"]
    last = msgs[-1]["content"]
    tools = [t for t in req.get("tools") or [] if "input_schema" in t]
    fmt = (req.get("output_config") or {}).get("format")
    if isinstance(last, list) and any(b.get("type") == "tool_result" for b in last):
        results = [b for b in last if b.get("type") == "tool_result"]
        parts = []
        for r in results:
            c = r.get("content")
            parts.append(c if isinstance(c, str) else _text_of(c))
        return {"content": [{"type": "text", "text": "Based on the tool results: " + "; ".join(parts)}],
                "stop_reason": "end_turn"}
    question = _text_of(last)
    system = req.get("system") or ""
    system = system if isinstance(system, str) else " ".join(b.get("text", "") for b in system)
    if "Your output fields are:" in system:           # DSPy's chat adapter: reply in its field format
        tail = system.split("Your output fields are:", 1)[1].split("All interactions", 1)[0]
        fields = re.findall(r"`(\w+)`", tail)
        m = re.search(r"## \]\]\n(.*?)(?:\n\n|$)", question, re.S)      # the first input field's value
        about = (m.group(1) if m else question).strip()[:60]
        body = "".join(f"[[ ## {f} ## ]]\nexample {f} for: {about}\n\n" for f in fields)
        return {"content": [{"type": "text", "text": body + "[[ ## completed ## ]]"}], "stop_reason": "end_turn"}
    docs = [b for b in last if isinstance(b, dict) and b.get("type") == "document"] if isinstance(last, list) else []
    cited = [(i, d) for i, d in enumerate(docs) if (d.get("citations") or {}).get("enabled")]
    if cited:                                   # quote the first sentence of the best-matching document
        q = _words(question)
        i, d = max(cited, key=lambda x: (len(q & _words(x[1]["source"].get("data", ""))), -x[0]))
        data = d["source"].get("data", "")
        sentences = [x.strip() for x in re.split(r"(?<=[.!?])\s+|\n+", data) if len(x.strip()) > 12]
        sentences = [re.sub(r"^(\d+\.|[-*])\s+", "", x) for x in sentences] or [data.strip()]
        sentence = max(sentences, key=lambda x: (len(q & _words(x)), -sentences.index(x)))
        start = data.find(sentence)
        return {"content": [
            {"type": "text", "text": "According to the docs: "},
            {"type": "text", "text": sentence, "citations": [{
                "type": "char_location", "cited_text": sentence, "document_index": i,
                "document_title": d.get("title"), "start_char_index": start,
                "end_char_index": start + len(sentence)}]}], "stop_reason": "end_turn"}
    if tools and (req.get("tool_choice") or {}).get("type") != "none":
        q = _words(question)
        best = max(tools, key=lambda t: len(q & _words(t["name"].replace("_", " ") + " " + t.get("description", ""))))
        if q & _words(best["name"].replace("_", " ") + " " + best.get("description", "")):
            args = _fill_args(best["input_schema"], question, best.get("description", ""))
            digest = hashlib.sha256(json.dumps(msgs, sort_keys=True).encode()).hexdigest()[:12]
            return {"content": [{"type": "text", "text": f"I'll call {best['name']}."},
                                {"type": "tool_use", "id": f"toolu_{digest}", "name": best["name"], "input": args}],
                    "stop_reason": "tool_use"}
    if fmt and fmt.get("type") == "json_schema":
        return {"content": [{"type": "text", "text": json.dumps(sample_from_schema(fmt["schema"]))}],
                "stop_reason": "end_turn"}
    return {"content": [{"type": "text", "text": f"(mock reply) You said: {question[:80]}"}], "stop_reason": "end_turn"}


def _input_tokens(req: dict) -> int:
    parts = [json.dumps(req.get("system", ""))] + [json.dumps(m) for m in req.get("messages", [])]
    parts += [json.dumps(t) for t in req.get("tools") or []]
    return sum(count_tokens(p) for p in parts)


_CACHE: dict[str, float] = {}         # prompt-cache key -> expiry time
CACHE_MIN_TOKENS = 1024               # the mock's minimum cacheable prefix (real minimums vary by model)


def _cache_usage(req: dict, total: int) -> dict:
    """Prompt caching: the prefix up to the last cache_control breakpoint (tools -> system -> messages)."""
    blocks = [("tools", t) for t in req.get("tools") or []]
    system = req.get("system")
    if isinstance(system, list):
        blocks += [("system", b) for b in system]
    elif system:
        blocks.append(("system", {"type": "text", "text": system}))
    for m in req["messages"]:
        content = m["content"] if isinstance(m["content"], list) else [{"type": "text", "text": m["content"]}]
        blocks += [(m["role"], b) for b in content]
    marks = [i for i, (_, b) in enumerate(blocks) if isinstance(b, dict) and b.get("cache_control")]
    if req.get("cache_control") and blocks:
        marks.append(len(blocks) - 1)                     # automatic caching: the last block
    if not marks:
        return {"input_tokens": total, "cache_creation_input_tokens": 0, "cache_read_input_tokens": 0}
    prefix = blocks[: max(marks) + 1]
    clean = [(k, {x: y for x, y in b.items() if x != "cache_control"}) for k, b in prefix]
    tokens = sum(count_tokens(json.dumps(b)) for _, b in clean)
    if tokens < CACHE_MIN_TOKENS:
        return {"input_tokens": total, "cache_creation_input_tokens": 0, "cache_read_input_tokens": 0}
    key = hashlib.sha256(json.dumps([req["model"], clean], sort_keys=True).encode()).hexdigest()
    ttl = 3600 if any(b.get("cache_control", {}).get("ttl") == "1h" for _, b in prefix) else 300
    import time as _time
    now = _time.time()
    hit = _CACHE.get(key, 0) > now
    _CACHE[key] = now + ttl                                # a hit refreshes the TTL
    rest = max(total - tokens, 0)
    return {"input_tokens": rest, "cache_creation_input_tokens": 0 if hit else tokens,
            "cache_read_input_tokens": tokens if hit else 0}


_THREADS: dict[str, dict] = {}       # message id -> history and tools, for SDK helpers that continue a thread


def respond(req: dict, reply: dict | None = None) -> dict:
    """Validate a Messages API request and build the full response body."""
    thread = req.pop("thread", None) or {}
    if thread.get("type") == "continue":
        prev = _THREADS.get(thread.get("previous_message_id"))
        if prev is None:
            raise APIError(404, "not_found_error", "thread: unknown previous_message_id")
        req = {**{k: v for k, v in prev.items() if k != "messages"}, **req,
               "messages": prev["messages"] + req["messages"]}
    validate(req)
    reply = reply or brain(req)
    content = reply["content"]
    stop = reply.get("stop_reason", "end_turn")
    out_tokens = sum(count_tokens(b.get("text", "") or json.dumps(b.get("input", {}))) for b in content)
    for seq in req.get("stop_sequences") or []:
        for b in content:
            if b["type"] == "text" and seq in b["text"]:
                b["text"] = b["text"].split(seq)[0]
                stop = "stop_sequence"
    if out_tokens > req["max_tokens"] and content and content[0]["type"] == "text":
        content = [{"type": "text", "text": "".join(tokenize(content[0]["text"])[: req["max_tokens"]])}]
        out_tokens, stop = req["max_tokens"], "max_tokens"
    digest = hashlib.sha256(json.dumps(req, sort_keys=True).encode()).hexdigest()[:20]
    if thread:
        _THREADS[f"msg_{digest}"] = {**{k: req[k] for k in ("tools", "system") if k in req},
                                     "messages": req["messages"] + [{"role": "assistant", "content": content}]}
    return {"id": f"msg_{digest}", "type": "message", "role": "assistant", "model": req["model"],
            "content": content, "stop_reason": stop, "stop_sequence": None,
            "usage": {**_cache_usage(req, _input_tokens(req)), "output_tokens": out_tokens}}


# ---------------------------------------------------------------- FakeAnthropic: a test double
class _Messages:
    def __init__(self, owner):
        self._owner = owner

    def create(self, **params):
        from anthropic.types import Message   # real SDK types, so code written against the fake works on the real client
        req = json.loads(json.dumps(params, default=_jsonable))
        self._owner.calls.append(req)
        replies = self._owner.replies
        scripted = None
        if replies is not None:
            if not replies:
                raise AssertionError("FakeAnthropic: no scripted replies left")
            scripted = replies.pop(0)
            if callable(scripted):
                scripted = scripted(req)
            scripted = _as_reply(scripted)
        try:
            body = respond(req, scripted)
        except APIError as e:
            import anthropic, httpx2
            response = httpx2.Response(e.status, request=httpx2.Request("POST", "https://fake.local/v1/messages"), json=e.body())
            raise anthropic.APIStatusError(e.message, response=response, body=e.body()) from None
        return Message.model_validate(body)

    def count_tokens(self, **params):
        from anthropic.types import MessageTokensCount
        return MessageTokensCount(input_tokens=_input_tokens(json.loads(json.dumps(params, default=_jsonable))))


def _jsonable(o):
    if hasattr(o, "model_dump"):
        return o.model_dump(exclude_none=True)
    raise TypeError(type(o).__name__)


def _as_reply(r) -> dict:
    """Script entries: "text", {"tool": name, "input": {...}}, or a full {"content": [...]} dict."""
    if isinstance(r, str):
        return {"content": [{"type": "text", "text": r}], "stop_reason": "end_turn"}
    if "tool" in r:
        calls = r["tool"] if isinstance(r["tool"], list) else [{"name": r["tool"], "input": r.get("input", {})}]
        blocks = [{"type": "tool_use", "id": f"toolu_{i + 1:02d}_{c['name']}", "name": c["name"], "input": c["input"]}
                  for i, c in enumerate(calls)]
        return {"content": blocks, "stop_reason": "tool_use"}
    return r


class FakeAnthropic:
    """Stands in for anthropic.Anthropic() in tests and in this book's examples.

    FakeAnthropic()                     replies with the mock brain (echoes, simple tool calls)
    FakeAnthropic(replies=[...])        replies with the scripted entries, in order
    .calls                              every request it received, as plain dicts
    """

    def __init__(self, replies: list | None = None):
        self.replies = list(replies) if replies is not None else None
        self.calls: list[dict] = []
        self.messages = _Messages(self)


# ---------------------------------------------------------------- mock_api: the Messages API over HTTP
class _Handler(BaseHTTPRequestHandler):
    server_version = "llmkit-mock"

    def log_message(self, *args):
        pass

    def _send(self, status, body, headers=(), content_type="application/json"):
        data = body if isinstance(body, bytes) else json.dumps(body).encode()
        self.send_response(status)
        self.send_header("content-type", content_type)
        if self.path.startswith("/v1/messages"):
            st = self.server.state
            self.send_header("anthropic-ratelimit-requests-limit", str(st["rpm"]))
            self.send_header("anthropic-ratelimit-requests-remaining", str(max(st["rpm"] - len(st["requests"]), 0)))
            self.send_header("anthropic-ratelimit-requests-reset", "2026-11-01T12:01:00Z")
        self.send_header("request-id", "req_mock_" + hashlib.sha256(data).hexdigest()[:12])
        for k, v in headers:
            self.send_header(k, v)
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        state = self.server.state
        length = int(self.headers.get("content-length", 0))
        try:
            req = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            return self._send(400, APIError(400, "invalid_request_error", "body is not valid JSON").body())
        state["requests"].append({"path": self.path, "body": req})
        if self.path.startswith("/v1/chat/completions") or self.path.startswith("/v1/embeddings"):
            return self._openai(req)
        key = self.headers.get("x-api-key") or self.headers.get("authorization") or ""
        if not key:
            return self._send(401, APIError(401, "authentication_error", "x-api-key header is required").body())
        if key.removeprefix("Bearer ").startswith("bad"):          # the mock's stand-in for a revoked key
            return self._send(401, APIError(401, "authentication_error", "invalid x-api-key").body())
        if state["fail"] > 0:
            state["fail"] -= 1
            status = state["fail_status"]
            kind = {429: "rate_limit_error", 529: "overloaded_error"}.get(status, "api_error")
            return self._send(status, APIError(status, kind, "mock failure").body(), [("retry-after", "0")])
        try:
            if self.path.startswith("/v1/messages/batches"):
                return self._batch_create(req)
            if self.path.startswith("/v1/messages/count_tokens"):
                validate({**req, "max_tokens": 1})
                return self._send(200, {"input_tokens": _input_tokens(req)})
            if self.path.startswith("/v1/messages"):
                body = respond(req)
                return self._stream(body) if req.get("stream") else self._send(200, body)
        except APIError as e:
            return self._send(e.status, e.body())
        self._send(404, APIError(404, "not_found_error", self.path).body())

    def _batch_create(self, req):
        results = []
        for r in req.get("requests", []):
            try:
                results.append({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": respond(dict(r["params"]))}})
            except APIError as e:
                results.append({"custom_id": r["custom_id"], "result": {"type": "errored", "error": e.body()}})
        bid = "msgbatch_" + hashlib.sha256(json.dumps(req, sort_keys=True).encode()).hexdigest()[:16]
        self.server.state["batches"][bid] = {"results": results, "polls": 0}
        return self._send(200, self._batch_body(bid))

    def _batch_body(self, bid):
        b = self.server.state["batches"][bid]
        ended = b["polls"] >= 2                          # the mock "finishes" on the second retrieve
        ok = sum(r["result"]["type"] == "succeeded" for r in b["results"])
        counts = {"processing": 0 if ended else len(b["results"]), "succeeded": ok if ended else 0,
                  "errored": len(b["results"]) - ok if ended else 0, "canceled": 0, "expired": 0}
        base = f"http://{self.headers.get('host')}"
        return {"id": bid, "type": "message_batch", "processing_status": "ended" if ended else "in_progress",
                "request_counts": counts, "created_at": "2026-11-01T12:00:00Z",
                "expires_at": "2026-11-02T12:00:00Z", "ended_at": "2026-11-01T12:05:00Z" if ended else None,
                "archived_at": None, "cancel_initiated_at": None,
                "results_url": f"{base}/v1/messages/batches/{bid}/results" if ended else None}

    def do_GET(self):
        m = re.match(r"/v1/messages/batches/(msgbatch_\w+)(/results)?", self.path)
        if not m or m.group(1) not in self.server.state["batches"]:
            return self._send(404, APIError(404, "not_found_error", self.path).body())
        b = self.server.state["batches"][m.group(1)]
        if m.group(2):
            lines = "\n".join(json.dumps(r) for r in b["results"]) + "\n"
            return self._send(200, lines.encode(), content_type="application/binary")
        b["polls"] += 1
        return self._send(200, self._batch_body(m.group(1)))

    def _stream(self, body):
        def ev(name, data):
            self.wfile.write(f"event: {name}\ndata: {json.dumps(data)}\n\n".encode())
        self.send_response(200)
        self.send_header("content-type", "text/event-stream")
        self.end_headers()
        start = {**body, "content": [], "stop_reason": None, "usage": {**body["usage"], "output_tokens": 1}}
        ev("message_start", {"type": "message_start", "message": start})
        for i, b in enumerate(body["content"]):
            if b["type"] == "text":
                ev("content_block_start", {"type": "content_block_start", "index": i, "content_block": {"type": "text", "text": ""}})
                for tok in tokenize(b["text"]):
                    ev("content_block_delta", {"type": "content_block_delta", "index": i, "delta": {"type": "text_delta", "text": tok}})
            else:
                ev("content_block_start", {"type": "content_block_start", "index": i,
                                           "content_block": {**b, "input": {}}})
                ev("content_block_delta", {"type": "content_block_delta", "index": i,
                                           "delta": {"type": "input_json_delta", "partial_json": json.dumps(b["input"])}})
            ev("content_block_stop", {"type": "content_block_stop", "index": i})
        ev("message_delta", {"type": "message_delta", "delta": {"stop_reason": body["stop_reason"], "stop_sequence": None},
                             "usage": {"output_tokens": body["usage"]["output_tokens"]}})
        ev("message_stop", {"type": "message_stop"})

    def _openai(self, req):
        if self.path.startswith("/v1/embeddings"):
            inputs = req["input"] if isinstance(req["input"], list) else [req["input"]]
            data = [{"object": "embedding", "index": i, "embedding": embed(t)} for i, t in enumerate(inputs)]
            return self._send(200, {"object": "list", "data": data, "model": req.get("model", "mock"),
                                    "usage": {"prompt_tokens": sum(map(count_tokens, inputs)), "total_tokens": sum(map(count_tokens, inputs))}})
        last = req["messages"][-1]
        text = last["content"] if isinstance(last["content"], str) else _text_of(last["content"])
        answer = f"(mock reply) You said: {text[:80]}"
        pt = sum(count_tokens(json.dumps(m)) for m in req["messages"])
        self._send(200, {"id": "chatcmpl-mock", "object": "chat.completion", "created": 0, "model": req.get("model"),
                         "choices": [{"index": 0, "finish_reason": "stop",
                                      "message": {"role": "assistant", "content": answer}}],
                         "usage": {"prompt_tokens": pt, "completion_tokens": count_tokens(answer),
                                   "total_tokens": pt + count_tokens(answer)}})


@contextlib.contextmanager
def mock_api(fail_first: int = 0, fail_status: int = 529, port: int = 0, rpm: int = 50):
    """Run the mock Messages API on localhost for the duration of a `with` block.

    with mock_api() as url:
        client = anthropic.Anthropic(base_url=url, api_key="test")
    The server records every request in url.requests. fail_first=N makes the first N
    requests fail with fail_status (529 overloaded, 429 rate limited, 500...).
    Any API key works, except keys starting with "bad", which get a 401."""
    server = ThreadingHTTPServer(("127.0.0.1", port), _Handler)
    server.state = {"fail": fail_first, "fail_status": fail_status, "requests": [], "batches": {}, "rpm": rpm}
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = _URL(f"http://127.0.0.1:{server.server_address[1]}")
    url.requests = server.state["requests"]
    try:
        yield url
    finally:
        server.shutdown()
        server.server_close()


class _URL(str):
    requests: list


if __name__ == "__main__":
    import sys
    if sys.argv[1:2] == ["serve"]:
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
        with mock_api(port=port) as url:
            print(f"Mock Messages API on {url}  (Ctrl+C to stop). In another terminal:")
            print(f"  export ANTHROPIC_BASE_URL={url} ANTHROPIC_API_KEY=test")
            print(f"  export OPENAI_BASE_URL={url}/v1 OPENAI_API_KEY=test")
            try:
                threading.Event().wait()
            except KeyboardInterrupt:
                pass
    else:
        print(__doc__)
