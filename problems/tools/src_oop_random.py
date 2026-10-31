"""Adds one seeded random stress script to every OOP problem (imported by build.py after src_oop).

The scripts mix valid and invalid commands so every error path is exercised at scale.
"""
import common
from common import rng


def script(rows):
    return f"{len(rows)}\n" + "\n".join(rows) + "\n"


def g01(r):
    names = ["ana", "ben", "chen", "dee", "eli"]; rows = []
    for _ in range(400):
        n = r.choice(names); k = r.random()
        if k < .12: rows.append(f"OPEN {n} {r.choice(['SAVINGS', 'CHECKING'])}")
        elif k < .35: rows.append(f"DEPOSIT {n} {r.choice([0, -5, r.randint(1, 90000)])}")
        elif k < .55: rows.append(f"WITHDRAW {n} {r.randint(-10, 80000)}")
        elif k < .75: rows.append(f"TRANSFER {n} {r.choice(names + ['ghost'])} {r.randint(0, 60000)}")
        elif k < .87: rows.append(f"INTEREST {n}")
        else: rows.append(f"BALANCE {r.choice(names + ['ghost'])}")
    return rows


def g02(r):
    rows = []
    for _ in range(300):
        k = r.random()
        if k < .2: rows.append(f"CIRCLE {r.randint(1, 50)}.{r.randint(0, 9)}")
        elif k < .4: rows.append(f"RECT {r.randint(1, 99)} {r.randint(1, 99)}")
        elif k < .55: rows.append(f"SQUARE {r.randint(1, 60)}")
        elif k < .8: rows.append(f"TRIANGLE {r.randint(1, 20)} {r.randint(1, 20)} {r.randint(1, 20)}")
        elif k < .87: rows.append("TOTAL")
        elif k < .94: rows.append("LARGEST")
        else: rows.append("LIST")
    return rows


def g03(r):
    rows, ids = [], []
    for i in range(300):
        k = r.random()
        if k < .2 or not ids:
            t = r.choice(["SALARIED", "HOURLY", "COMMISSION"]); eid = f"e{r.randint(1, 15)}"; ids.append(eid)
            amt = {"SALARIED": r.randint(1_000_000, 12_000_000), "HOURLY": r.randint(900, 6000), "COMMISSION": r.randint(0, 300000)}[t]
            rows.append(f"HIRE {t} {eid} n{i} {amt}" + (f" {r.randint(1, 30)}" if t == "COMMISSION" else ""))
        elif k < .55: rows.append(f"HOURS {r.choice(ids + ['zz'])} {r.randint(1, 30)}")
        elif k < .9: rows.append(f"SALES {r.choice(ids + ['zz'])} {r.randint(1, 500000)}")
        else: rows.append("PAYROLL")
    return rows + ["PAYROLL"]


def g04(r):
    rows = [f"ADDBOOK b{i} T{i} {r.randint(1, 3)}" for i in range(8)] + [f"JOIN m{i} {r.choice(['REGULAR', 'PREMIUM'])}" for i in range(6)]
    for _ in range(400):
        k = r.random(); m = f"m{r.randint(0, 6)}"; b = f"b{r.randint(0, 8)}"
        if k < .45: rows.append(f"BORROW {m} {b}")
        elif k < .8: rows.append(f"RETURN {m} {b}")
        elif k < .9: rows.append(f"AVAILABLE {b}")
        else: rows.append(f"LOANS {m}")
    return rows


def g05(r):
    rows, plates = [f"LEVEL {r.randint(2, 6)} {r.randint(2, 6)} {r.randint(1, 4)}"], []
    for i in range(400):
        if r.random() < .5 or not plates:
            p = f"p{r.randint(0, 11)}"; plates.append(p); rows.append(f"PARK {r.choice(['MOTORCYCLE', 'CAR', 'TRUCK'])} {p}")
        elif r.random() < .9: rows.append(f"LEAVE p{r.randint(0, 11)}")
        else: rows.append("FREE")
    return rows + ["FREE"]


def g06(r):
    rows = [f"ADD s{i} item{i} {r.randint(50, 5000)} {r.randint(0, 40)} {r.randint(0, 10)}" for i in range(10)]
    for _ in range(400):
        k = r.random(); s = f"s{r.randint(0, 11)}"
        if k < .45: rows.append(f"SELL {s} {r.randint(1, 12)}")
        elif k < .7: rows.append(f"RESTOCK {s} {r.randint(1, 30)}")
        elif k < .85: rows.append(f"PRICE {s} {r.randint(1, 9999)}")
        elif k < .9: rows.append(f"ADD s{r.randint(0, 14)} extra 100 5 1")
        else: rows.append("REPORT")
    return rows


def g07(r):
    rows = ["NEW STACK"]
    for _ in range(500):
        k = r.random()
        if k < .45: rows.append(f"ADD v{r.randint(0, 99)}")
        elif k < .7: rows.append("REMOVE")
        elif k < .8: rows.append("PEEK")
        elif k < .87: rows.append("SIZE")
        elif k < .95: rows.append("DUMP")
        else: rows.append(f"NEW {r.choice(['STACK', 'QUEUE'])}")
    return rows


def g08(r):
    rows = [f"CAPACITY {r.randint(3, 8)}"]
    for _ in range(600):
        k = r.random(); key = f"k{r.randint(0, 14)}"
        if k < .5: rows.append(f"PUT {key} {r.randint(0, 999)}")
        elif k < .95: rows.append(f"GET {key}")
        else: rows.append("KEYS")
    return rows


def g09(r):
    rows = [f"STOCK {x} {r.choice([45, 60, 125, 150, 200])} {r.randint(0, 4)}" for x in ("cola", "chips", "gum", "water")]
    for _ in range(400):
        k = r.random()
        if k < .5: rows.append(f"COIN {r.choice([5, 10, 25, 100, 1, 50, 3])}")
        elif k < .8: rows.append(f"SELECT {r.choice(['cola', 'chips', 'gum', 'water', 'candy'])}")
        elif k < .9: rows.append("CANCEL")
        else: rows.append("STATE")
    return rows


def g10(r):
    rows = []
    for _ in range(300):
        k = r.random()
        if k < .7: rows.append(f"TICK {r.choice([1, 2, 3, 5, 7, 10, 13, 25, 30, 61])}")
        elif k < .92: rows.append("PEDESTRIAN")
        elif k < .935: rows.append("FAULT")
        else: rows.append("RESET")
    return rows


def g11(r):
    items = ["tea", "cake", "milk", "jam", "bread"]; rows = []
    for _ in range(300):
        k = r.random()
        if k < .45: rows.append(f"ADD {r.choice(items)} {r.randint(1, 2500)} {r.randint(1, 6)}")
        elif k < .55: rows.append(f"REMOVE {r.choice(items)}")
        elif k < .75:
            c = r.choice(["PERCENT", "FIXED", "BOGO", "GIFT"])
            rows.append(f"COUPON {c}" + {"PERCENT": f" {r.randint(1, 90)}", "FIXED": f" {r.randint(1, 20000)}", "BOGO": "", "GIFT": " 5"}[c])
        else: rows.append("TOTAL")
    return rows


def g12(r):
    names = ["ana", "ben", "log", "audit", "mail"]; topics = ["orders", "stock", "users", "*"]; rows = []
    for _ in range(300):
        k = r.random()
        if k < .35: rows.append(f"SUBSCRIBE {r.choice(names)} {r.choice(topics)}")
        elif k < .5: rows.append(f"UNSUBSCRIBE {r.choice(names)} {r.choice(topics)}")
        else: rows.append(f"PUBLISH {r.choice(topics[:3])} event {r.randint(1, 999)}" + (" with details" if r.random() < .3 else ""))
    return rows


def g13(r):
    rows = []
    for _ in range(400):
        k = r.random()
        if k < .35: rows.append("TYPE " + r.choice(["a", "bc", " d", "e f", "  ", "xyz", "Hi!"]))
        elif k < .5: rows.append(f"DELETE {r.randint(1, 6)}")
        elif k < .72: rows.append("UNDO")
        elif k < .92: rows.append("REDO")
        else: rows.append("SHOW")
    return rows


def g14(r):
    rows = [f"LET v{i} {r.randint(-12, 12)}/{r.choice([1, 2, 3, 4, 6, -5, 7])}" for i in range(6)]
    for _ in range(300):
        k = r.random(); a, b, c = (f"v{r.randint(0, 7)}" for _ in range(3))
        if k < .15: rows.append(f"LET {a} {r.randint(-9, 9)}/{r.randint(-4, 9)}")
        elif k < .85: rows.append(f"{r.choice(['ADD', 'SUB', 'MUL', 'DIV'])} v{r.randint(0, 5)} {b} {c}")
        else: rows.append(f"CMP {a} {b}")
    return rows


def g15(r):
    cur = ["EUR", "USD", "GBP", "JPY"]; rows = []
    for _ in range(300):
        k = r.random()
        if k < .4: rows.append(f"ADD {r.randint(0, 10**7)} {r.choice(cur)}")
        elif k < .8: rows.append(f"CONVERT {r.randint(0, 10**9)} {r.choice(cur)} {r.choice(cur)}")
        else: rows.append(f"TOTAL {r.choice(cur)}")
    return rows


def g16(r):
    sp = ["DOG", "CAT", "DUCK", "FISH", "EAGLE", "PENGUIN", "DRAGON"]; rows = []
    for i in range(120):
        k = r.random()
        if k < .6: rows.append(f"ADD {r.choice(sp)} a{i}")
        elif k < .8: rows.append(f"CAN {r.choice(['WALK', 'SWIM', 'FLY'])}")
        elif k < .9: rows.append("SPEAK")
        else: rows.append("MOVE")
    return rows


def g17(r):
    dirs = ["/"]; files = []; rows = []
    for i in range(300):
        k = r.random(); base = r.choice(dirs).rstrip("/")
        if k < .2:
            p = f"{base}/d{r.randint(0, 6)}"; rows.append(f"MKDIR {p}"); dirs.append(p)
        elif k < .5:
            p = f"{base}/f{r.randint(0, 6)}.txt"; rows.append(f"TOUCH {p} {r.randint(0, 999)}"); files.append(p)
        elif k < .65: rows.append(f"DU {r.choice(dirs + files + ['/missing'])}")
        elif k < .8: rows.append(f"LS {r.choice(dirs + files)}")
        elif k < .88: rows.append(f"TREE {r.choice(dirs)}")
        elif k < .94 or len(dirs) < 3: rows.append(f"RM {r.choice(files + ['/nope'])}")
        else:
            gone = r.choice(dirs[1:]); rows.append(f"RM {gone}")
            dirs = [d for d in dirs if d != gone and not d.startswith(gone + "/")]
            files = [f for f in files if not f.startswith(gone + "/")]
    return rows + ["TREE /"]


def g18(r):
    rows = [f"ROOM {n} {t} {r.randint(5000, 40000)}" for n, t in
            [("101", "SINGLE"), ("102", "SINGLE"), ("201", "DOUBLE"), ("202", "DOUBLE"), ("203", "DOUBLE"), ("301", "SUITE")]]
    for _ in range(300):
        k = r.random()
        if k < .6:
            a = r.randint(0, 30); rows.append(f"BOOK g{r.randint(0, 50)} {r.choice(['SINGLE', 'DOUBLE', 'DOUBLE', 'SUITE'])} {a} {a + r.choice([1, 1, 2, 2, 3, 4, 5, 0])}")
        elif k < .8: rows.append(f"CANCEL {r.randint(1, 120)}")
        else: rows.append(f"OCCUPANCY {r.randint(0, 35)}")
    return rows


def g19(r):
    lv = ["DEBUG", "INFO", "WARN", "ERROR"]; rows = [f"HANDLER h{i} {r.choice(lv)}" for i in range(4)]
    for _ in range(300):
        rows.append(f"LOG {r.choice(lv)} message {r.randint(1, 999)}" if r.random() < .95 else f"HANDLER h{len(rows)} {r.choice(lv)}")
    return rows


def g20(r):
    rows = [f"CONFIG {r.randint(2, 6)} {r.randint(0, 2)}"]; now = {}
    for _ in range(600):
        u = f"u{r.randint(0, 5)}"; now[u] = now.get(u, 0) + r.choice([0, 0, 0, 1, 1, 2, 5])
        rows.append(f"REQ {u} {now[u]}")
    return rows


def g21(r):
    pieces = ["KING", "QUEEN", "ROOK", "BISHOP", "KNIGHT"]; sq = lambda: f"{'abcdefgh'[r.randint(0, 7)]}{r.randint(1, 8)}"
    return [f"MOVES {r.choice(pieces)} {sq()}" if r.random() < .4 else f"CHECK {r.choice(pieces)} {sq()} {sq()}" for _ in range(300)]


def g22(r):
    rows = []
    for _ in range(200):
        k = r.random()
        if k < .45: rows.append(f"RANGE {r.randint(-30, 30)} {r.randint(-30, 30)} {r.choice([-7, -3, -1, 0, 1, 2, 5])}")
        elif k < .75: rows.append(f"TAKE {r.randint(-50, 50)} {r.randint(-9, 9)} {r.randint(0, 15)}")
        else:
            a = ",".join(r.choice("abcdef") for _ in range(r.randint(1, 6))); b = ",".join(str(r.randint(0, 9)) for _ in range(r.randint(1, 6)))
            rows.append(f"ZIP {a} {b}")
    return rows


def g23(r):
    rows = []
    for _ in range(40):
        rows.append("NEW")
        for _ in range(r.randint(3, 12)): rows.append(f"MOVE {r.randint(0, 4)} {r.randint(1, 3)}" if r.random() < .1 else f"MOVE {r.randint(1, 3)} {r.randint(1, 3)}")
        rows.append("BOARD")
    return rows


def g24(r):
    words = ["your", "order", "has", "shipped", "today", "and", "will", "arrive", "soon", "ok"]; rows = []
    for _ in range(200):
        u = f"user{r.randint(0, 6)}"
        if r.random() < .3: rows.append(f"PREFER {u} " + ",".join(r.choice(["EMAIL", "SMS", "PUSH", "PUSH", "FAX"]) for _ in range(r.randint(1, 3))))
        else: rows.append(f"NOTIFY {u} " + " ".join(r.choice(words) for _ in range(r.randint(1, 9))))
    return rows


def g25(r):
    n = r.randint(8, 30); rows = [f"BUILDING {n}"]
    for _ in range(300):
        rows.append(f"CALL {r.randint(0, n + 1)}" if r.random() < .55 else f"STEP {r.randint(1, 12)}")
    return rows + ["STEP 100"]


GENERATORS = {f"O{i:02d}": globals()[f"g{i:02d}"] for i in range(1, 26)}

for p in common.PROBLEMS:
    if p["id"] in GENERATORS:
        p["tests"].append(script(GENERATORS[p["id"]](rng(int(p["id"][1:]) * 7919))))
