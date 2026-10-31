"""Filtering and summarising expenses."""
from collections import defaultdict


def select(expenses, *, category=None, month=None):
    """Yield the expenses that match the filters (a lazy generator)."""
    for e in expenses:
        if category is not None and e.category != category:
            continue
        if month is not None and e.day.isoformat()[:7] != month:
            continue
        yield e


def totals_by_category(expenses):
    """Return {category: cents}, biggest first."""
    totals = defaultdict(int)
    for e in expenses:
        totals[e.category] += e.cents
    return dict(sorted(totals.items(), key=lambda kv: kv[1], reverse=True))


def bar(value, biggest, width=20):
    """A text bar chart segment proportional to value / biggest."""
    return "█" * round(width * value / biggest) if biggest else ""
