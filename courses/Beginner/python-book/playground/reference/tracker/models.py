"""Data model: categories, money helpers and the Expense record."""
from dataclasses import dataclass
from datetime import date
from enum import StrEnum, auto


class Category(StrEnum):
    FOOD = auto()
    RENT = auto()
    TRANSPORT = auto()
    FUN = auto()
    BOOKS = auto()
    MISC = auto()

    @classmethod
    def parse(cls, text):
        """Turn user text into a Category, with a helpful error."""
        try:
            return cls(text.strip().lower())
        except ValueError:
            choices = ", ".join(cls)
            raise ValueError(f"unknown category {text!r} (choose from: {choices})") from None


def parse_amount(text):
    """Turn '12.5' or '12,50' into whole cents.

    >>> parse_amount("12.5"), parse_amount("0,99"), parse_amount("7")
    (1250, 99, 700)
    """
    text = text.strip().replace(",", ".")
    whole, _, frac = text.partition(".")
    if not whole.isdigit() or (frac and not frac.isdigit()) or len(frac) > 2:
        raise ValueError(f"not a valid amount: {text!r}")
    cents = int(whole) * 100 + int(frac.ljust(2, "0"))
    if cents <= 0:
        raise ValueError("amount must be positive")
    return cents


def format_money(cents, currency="€"):
    """Format whole cents for display.

    >>> format_money(123456), format_money(-350)
    ('€1,234.56', '-€3.50')
    """
    sign = "-" if cents < 0 else ""
    whole, rest = divmod(abs(cents), 100)
    return f"{sign}{currency}{whole:,}.{rest:02d}"


@dataclass
class Expense:
    id: int
    day: date
    category: Category
    cents: int
    note: str = ""

    def to_dict(self):
        """A JSON-friendly dict (dates and enums become strings)."""
        return {"id": self.id, "day": self.day.isoformat(), "category": str(self.category),
                "cents": self.cents, "note": self.note}

    @classmethod
    def from_dict(cls, data):
        return cls(id=data["id"], day=date.fromisoformat(data["day"]),
                   category=Category(data["category"]), cents=data["cents"],
                   note=data.get("note", ""))
