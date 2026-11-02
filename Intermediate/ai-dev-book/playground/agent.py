import json
import time
from dataclasses import dataclass, field


@dataclass
class Budget:
    max_steps: int = 10
    max_input_tokens: int = 200_000
    max_output_tokens: int = 20_000
    max_seconds: float = 90.0


@dataclass
class Result:
    answer: str | None
    stop: str                 # end_turn, step_budget, token_budget, time_budget, ...
    steps: int
    input_tokens: int = 0
    output_tokens: int = 0
    trace: list = field(default_factory=list)


def run_agent(client, registry, goal, system="You are DocsPilot.", budget=Budget(),
              model="claude-sonnet-5-5", clock=time.monotonic):
    deadline = clock() + budget.max_seconds
    messages = [{"role": "user", "content": goal}]
    r = Result(None, "step_budget", 0)
    seen = set()
    for r.steps in range(1, budget.max_steps + 1):
        if clock() > deadline:
            r.stop = "time_budget"
            return r
        res = client.messages.create(model=model, max_tokens=4096, system=system,
                                     tools=registry.definitions(), messages=messages)
        r.input_tokens += res.usage.input_tokens
        r.output_tokens += res.usage.output_tokens
        messages.append({"role": "assistant", "content": res.content})
        if res.stop_reason != "tool_use":
            r.answer = "".join(b.text for b in res.content if b.type == "text")
            r.stop = res.stop_reason
            return r
        if r.input_tokens > budget.max_input_tokens or r.output_tokens > budget.max_output_tokens:
            r.stop = "token_budget"
            return r
        results = []
        for b in (b for b in res.content if b.type == "tool_use"):
            signature = (b.name, json.dumps(b.input, sort_keys=True))
            if signature in seen:                                         # loop detection
                content, is_error = "You already made this exact call. Use the earlier result.", True
            else:
                seen.add(signature)
                content, is_error = registry.run(b.name, b.input)
            r.trace.append(f"{b.name}({json.dumps(b.input)}){' ERROR' if is_error else ''}")
            results.append({"type": "tool_result", "tool_use_id": b.id, "content": content, "is_error": is_error})
        messages.append({"role": "user", "content": results})
    return r
