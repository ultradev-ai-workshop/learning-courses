from llmkit import count_tokens


def assemble(chunks, budget_tokens=600):
    """chunks: best first. Returns the chunks that fit, grouped by document, best document first."""
    picked, used, seen = [], 0, set()
    for c in chunks:
        if c.id in seen:
            continue
        cost = count_tokens(c.path + c.text)
        if used + cost > budget_tokens:
            break
        picked.append(c)
        seen.add(c.id)
        used += cost
    order = {}
    for c in picked:                          # first appearance decides the document's position
        order.setdefault(c.doc_id, len(order))
    return sorted(picked, key=lambda c: (order[c.doc_id], c.id)), used
