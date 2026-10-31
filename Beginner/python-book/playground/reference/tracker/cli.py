"""The command-line interface: argument parsing and the four commands."""
import argparse
import sys
from datetime import date

from . import storage
from .models import Category, Expense, format_money, parse_amount
from .report import bar, select, totals_by_category

DEFAULT_FILE = "expenses.json"


def _arg(convert):
    """Wrap a converter so argparse shows its ValueError message nicely."""
    def wrapper(text):
        try:
            return convert(text)
        except ValueError as exc:
            raise argparse.ArgumentTypeError(str(exc)) from None
    return wrapper


def build_parser():
    parser = argparse.ArgumentParser(prog="expenses", description="A tiny expense tracker.")
    parser.add_argument("--file", default=DEFAULT_FILE, help="data file (default: %(default)s)")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="record an expense")
    add.add_argument("amount", type=_arg(parse_amount))
    add.add_argument("category", type=_arg(Category.parse))
    add.add_argument("--note", default="")
    add.add_argument("--date", dest="day", type=_arg(date.fromisoformat), default=date.today())

    ls = sub.add_parser("list", help="show expenses")
    ls.add_argument("--category", type=_arg(Category.parse))
    ls.add_argument("--month", help="only this month, as YYYY-MM")

    summary = sub.add_parser("summary", help="totals per category")
    summary.add_argument("--month", help="only this month, as YYYY-MM")

    delete = sub.add_parser("delete", help="remove an expense by id")
    delete.add_argument("id", type=int)
    return parser


def cmd_add(args, expenses):
    expense = Expense(storage.next_id(expenses), args.day, args.category, args.amount, args.note)
    expenses.append(expense)
    print(f"added #{expense.id}: {format_money(expense.cents)} {expense.category} on {expense.day}")
    return True                                     # data changed: save it


def cmd_list(args, expenses):
    shown = sorted(select(expenses, category=args.category, month=args.month),
                   key=lambda e: (e.day, e.id))
    if not shown:
        print("no expenses")
        return False
    for e in shown:
        line = f"#{e.id:<3} {e.day}  {e.category:<10}{format_money(e.cents):>11}  {e.note}"
        print(line.rstrip())
    print(f"{len(shown)} expense(s), total {format_money(sum(e.cents for e in shown))}")
    return False


def cmd_summary(args, expenses):
    totals = totals_by_category(select(expenses, month=args.month))
    if not totals:
        print("no expenses")
        return False
    biggest = max(totals.values())
    for category, cents in totals.items():
        print(f"{category:<10}{format_money(cents):>11}  {bar(cents, biggest)}".rstrip())
    print(f"{'total':<10}{format_money(sum(totals.values())):>11}")
    return False


def cmd_delete(args, expenses):
    for i, e in enumerate(expenses):
        if e.id == args.id:
            del expenses[i]
            print(f"deleted #{e.id}")
            return True
    raise LookupError(f"no expense with id {args.id}")


COMMANDS = {"add": cmd_add, "list": cmd_list, "summary": cmd_summary, "delete": cmd_delete}


def main(argv=None):
    args = build_parser().parse_args(argv)          # argv=None means "use sys.argv"
    try:
        expenses = storage.load(args.file)
        if COMMANDS[args.command](args, expenses):
            storage.save(args.file, expenses)
    except (storage.StorageError, LookupError) as err:
        print(f"error: {err}", file=sys.stderr)
        return 1
    return 0
