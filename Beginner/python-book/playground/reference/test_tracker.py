"""Tests for the expense tracker. Run with: python3 -m unittest -v"""
import io
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from datetime import date
from pathlib import Path

from tracker.cli import main
from tracker.models import Category, Expense, format_money, parse_amount
from tracker.report import select, totals_by_category


class TestModels(unittest.TestCase):
    def test_parse_amount(self):
        self.assertEqual(parse_amount("12.5"), 1250)
        self.assertEqual(parse_amount("0,99"), 99)
        for bad in ["abc", "-3", "1.234", "0", ""]:
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                parse_amount(bad)

    def test_format_money(self):
        self.assertEqual(format_money(123456), "€1,234.56")

    def test_round_trip(self):
        e = Expense(1, date(2026, 10, 1), Category.FOOD, 1250, "lunch")
        self.assertEqual(Expense.from_dict(e.to_dict()), e)


class TestReport(unittest.TestCase):
    def test_totals_and_select(self):
        data = [Expense(1, date(2026, 9, 30), Category.FOOD, 500),
                Expense(2, date(2026, 10, 1), Category.FOOD, 700),
                Expense(3, date(2026, 10, 2), Category.RENT, 90000)]
        october = list(select(data, month="2026-10"))
        self.assertEqual([e.id for e in october], [2, 3])
        self.assertEqual(totals_by_category(october), {Category.RENT: 90000, Category.FOOD: 700})


class TestCli(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.file = str(Path(self.tmp.name) / "data.json")

    def tearDown(self):
        self.tmp.cleanup()

    def run_cli(self, *args):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = main(["--file", self.file, *args])
        return code, out.getvalue(), err.getvalue()

    def test_add_list_delete(self):
        self.run_cli("add", "12.50", "food", "--date", "2026-10-01")
        code, out, _ = self.run_cli("list")
        self.assertEqual(code, 0)
        self.assertIn("€12.50", out)
        self.run_cli("delete", "1")
        self.assertIn("no expenses", self.run_cli("list")[1])

    def test_delete_missing_returns_1(self):
        code, _, err = self.run_cli("delete", "99")
        self.assertEqual(code, 1)
        self.assertIn("no expense with id 99", err)


if __name__ == "__main__":
    unittest.main()
