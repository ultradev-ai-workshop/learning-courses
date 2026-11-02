from docspilot_tools import registry           # get_oncall, get_ticket (Chapter 5)
from retrievers import default_index           # Chapter 7

_index = default_index()
_by_id = {c.id: c for c in _index.chunks}


@registry.tool
def search_docs(query: str) -> list:
    """Searches the internal engineering docs (runbooks, ADRs, guides, policies). Returns the
    3 best sections with their title. Use for how-to and policy questions."""
    return [{"section": _by_id[i].path, "text": _by_id[i].text[:300]} for i in _index.hybrid(query, 3)]
