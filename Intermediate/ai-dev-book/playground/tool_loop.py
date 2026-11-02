MAX_STEPS = 8


def run(client, registry, question, system="You are DocsPilot.", model="claude-sonnet-5-5", trace=None):
    messages = [{"role": "user", "content": question}]
    for step in range(MAX_STEPS):
        res = client.messages.create(model=model, max_tokens=2048, system=system,
                                     tools=registry.definitions(), messages=messages)
        messages.append({"role": "assistant", "content": res.content})
        if res.stop_reason != "tool_use":                     # end_turn, max_tokens, refusal...
            return "".join(b.text for b in res.content if b.type == "text"), messages
        results = []
        for block in res.content:
            if block.type == "tool_use":
                content, is_error = registry.run(block.name, block.input)
                if trace is not None:
                    trace.append((block.name, block.input, is_error))
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": content, "is_error": is_error})
        messages.append({"role": "user", "content": results})  # all results in ONE user turn
    raise RuntimeError(f"tool loop exceeded {MAX_STEPS} steps")
