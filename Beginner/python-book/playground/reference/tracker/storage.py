"""Loading and saving expenses as JSON."""
import json
from pathlib import Path

from .models import Expense


class StorageError(Exception):
    """The data file exists but cannot be read."""


def load(path):
    path = Path(path)
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return []                                   # first run: nothing saved yet
    try:
        return [Expense.from_dict(item) for item in json.loads(text)]
    except (ValueError, KeyError, TypeError) as exc:   # JSONDecodeError is a ValueError
        raise StorageError(f"{path} is damaged: {exc}") from exc


def save(path, expenses):
    path = Path(path)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps([e.to_dict() for e in expenses], indent=2), encoding="utf-8")
    tmp.replace(path)                               # swap in one step: never half-written


def next_id(expenses):
    return max((e.id for e in expenses), default=0) + 1
