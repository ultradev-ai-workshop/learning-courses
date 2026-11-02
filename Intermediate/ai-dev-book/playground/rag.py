import anthropic
from assemble import assemble
from retrievers import default_index

SYSTEM = ("You are DocsPilot. Answer only from the provided documents. "
          "If they don't contain the answer, say you couldn't find it in the docs.")
_index = None


def answer(question, client=None, k=4, budget_tokens=600):
    global _index
    _index = _index or default_index()
    client = client or anthropic.Anthropic()
    by_id = {c.id: c for c in _index.chunks}
    chunks, _ = assemble([by_id[i] for i in _index.hybrid(question, k)], budget_tokens)
    content = [{"type": "document", "title": c.path,
                "source": {"type": "text", "media_type": "text/plain", "data": c.text},
                "citations": {"enabled": True}} for c in chunks]
    content.append({"type": "text", "text": f"<question>{question}</question>"})
    res = client.messages.create(model="claude-sonnet-5-5", max_tokens=1500, system=SYSTEM,
                                 messages=[{"role": "user", "content": content}])
    text, citations = "", []
    for block in res.content:
        if block.type == "text":
            text += block.text
            for cit in block.citations or []:
                citations.append({"doc": cit.document_title, "quote": cit.cited_text})
    return text, citations, [c.id for c in chunks]
