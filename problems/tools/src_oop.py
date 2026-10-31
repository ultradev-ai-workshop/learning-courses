"""Object-oriented problems O01–O25: design classes, then drive them with a command script.

Every OOP problem reads commands from standard input (first line: number of commands) and prints
exact responses, so a solution in Java, C++, C#, Python, TypeScript, Kotlin… can be checked the same way.
Money is always handled in integer cents and printed with two decimals.
"""
import math
from collections import OrderedDict, deque, defaultdict
from common import P, rng, lines, out

def money(c):
    sign = "-" if c < 0 else ""
    return f"{sign}{abs(c) // 100}.{abs(c) % 100:02d}"
def cmds(t):
    l = lines(t); return [x.split() for x in l[1:1 + int(l[0])]]
def script(*rows):
    return f"{len(rows)}\n" + "\n".join(rows) + "\n"

COMMON_IO = "The first line contains <code>q</code>, the number of commands; each of the next <code>q</code> lines is one command. Names never contain spaces."

# ---------------------------------------------------------------- O01
def o01(t):
    acc, res = {}, []
    for c in cmds(t):
        k = c[0]
        if k == "OPEN":
            if c[1] in acc: res.append("ERROR account exists")
            else: acc[c[1]] = {"type": c[2], "bal": 0}; res.append(f"OPENED {c[1]}")
        elif c[1] not in acc: res.append("ERROR no such account")
        elif k == "DEPOSIT":
            a = int(c[2])
            if a <= 0: res.append("ERROR invalid amount")
            else: acc[c[1]]["bal"] += a; res.append(f"BALANCE {c[1]} {money(acc[c[1]]['bal'])}")
        elif k == "WITHDRAW":
            a, x = int(c[2]), acc[c[1]]; limit = -50000 if x["type"] == "CHECKING" else 0
            if a <= 0: res.append("ERROR invalid amount")
            elif x["bal"] - a < limit: res.append("ERROR insufficient funds")
            else: x["bal"] -= a; res.append(f"BALANCE {c[1]} {money(x['bal'])}")
        elif k == "TRANSFER":
            a = int(c[3])
            if c[2] not in acc: res.append("ERROR no such account"); continue
            x = acc[c[1]]; limit = -50000 if x["type"] == "CHECKING" else 0
            if a <= 0: res.append("ERROR invalid amount")
            elif x["bal"] - a < limit: res.append("ERROR insufficient funds")
            else: x["bal"] -= a; acc[c[2]]["bal"] += a; res.append(f"TRANSFERRED {money(a)}")
        elif k == "INTEREST":
            x = acc[c[1]]
            if x["type"] != "SAVINGS": res.append("ERROR not a savings account")
            else: x["bal"] += x["bal"] * 2 // 100; res.append(f"BALANCE {c[1]} {money(x['bal'])}")
        elif k == "BALANCE": res.append(f"BALANCE {c[1]} {money(acc[c[1]]['bal'])}")
    return out(*res)
P("O01", "Bank Accounts", "oop", ["encapsulation", "inheritance"], ["encapsulation", "inheritance", "validation in methods"],
  """Model a bank with an abstract <code>Account</code> and two subclasses. Balances are kept in <strong>integer cents</strong> and are never modified directly from outside the class.
<ul><li><code>SavingsAccount</code>: can't go below 0; <code>INTEREST</code> adds 2% of the balance, rounded down to a whole cent.</li>
<li><code>CheckingAccount</code>: may be overdrawn down to −500.00 (−50000 cents); it has no interest.</li></ul>
Commands: <code>OPEN name SAVINGS|CHECKING</code>, <code>DEPOSIT name cents</code>, <code>WITHDRAW name cents</code>, <code>TRANSFER from to cents</code>, <code>INTEREST name</code>, <code>BALANCE name</code>.""",
  COMMON_IO,
  """<code>OPENED name</code>; deposits, withdrawals, interest and balance print <code>BALANCE name X.YY</code>; transfers print <code>TRANSFERRED X.YY</code>. Errors, checked in this order:
<code>ERROR account exists</code>, <code>ERROR no such account</code> (either account), <code>ERROR invalid amount</code> (amount ≤ 0), <code>ERROR insufficient funds</code>, <code>ERROR not a savings account</code>. A failed command changes nothing.""",
  ["1 ≤ q ≤ 10<sup>4</sup>", "amounts are integers in cents, |amount| ≤ 10<sup>9</sup>"],
  [(script("OPEN ana SAVINGS", "OPEN ben CHECKING", "DEPOSIT ana 10000", "WITHDRAW ben 30000", "TRANSFER ana ben 2500", "INTEREST ana", "INTEREST ben", "WITHDRAW ben 30000"),
    "Ben's checking account may go to −300.00; interest on 75.00 is 1.50; Ben is at −275.00 after the transfer, so withdrawing 300.00 more would reach −575.00, below the −500.00 limit.")],
  [script("BALANCE nobody", "OPEN x SAVINGS", "OPEN x CHECKING", "DEPOSIT x 0", "WITHDRAW x 1"),
   script("OPEN a CHECKING", "WITHDRAW a 50000", "WITHDRAW a 1", "DEPOSIT a 1", "BALANCE a"),
   script("OPEN s SAVINGS", "DEPOSIT s 99", "INTEREST s", "DEPOSIT s 4901", "INTEREST s", "TRANSFER s ghost 10", "TRANSFER s s 10", "BALANCE s")], o01,
  oop={"design": ["abstract class <code>Account</code> { name, balance (private); deposit(), withdraw(), canWithdraw(amount) }",
                  "<code>SavingsAccount</code> extends Account — overrides the withdrawal limit and adds addInterest()",
                  "<code>CheckingAccount</code> extends Account — overrides the overdraft limit",
                  "<code>Bank</code> owns a map name → Account and turns commands into method calls"],
       "patterns": ["Template Method (withdraw uses an overridable limit)"],
       "principles": ["encapsulation: no public setter for balance", "Liskov substitution: the Bank works with Account references"]})

# ---------------------------------------------------------------- O02
def o02(t):
    shapes, res = [], []
    for c in cmds(t):
        k = c[0]
        if k == "CIRCLE": shapes.append(("Circle", math.pi * float(c[1]) ** 2, 2 * math.pi * float(c[1])))
        elif k == "RECT": w, h = float(c[1]), float(c[2]); shapes.append(("Rectangle", w * h, 2 * (w + h)))
        elif k == "SQUARE": s = float(c[1]); shapes.append(("Square", s * s, 4 * s))
        elif k == "TRIANGLE":
            a, b, cc = map(float, c[1:4])
            if a + b <= cc or a + cc <= b or b + cc <= a: res.append("ERROR invalid triangle"); continue
            s = (a + b + cc) / 2; shapes.append(("Triangle", math.sqrt(s * (s - a) * (s - b) * (s - cc)), a + b + cc))
        elif k == "LIST":
            for i, (n, a, p) in enumerate(shapes, 1): res.append(f"{i} {n} area={a:.2f} perimeter={p:.2f}")
        elif k == "TOTAL": res.append(f"TOTAL area={sum(s[1] for s in shapes):.2f}")
        elif k == "LARGEST":
            res.append("NONE" if not shapes else f"LARGEST {max(shapes, key=lambda s: s[1])[0]}")
    return out(*res)
P("O02", "Shapes and Polymorphism", "oop", ["polymorphism", "abstraction"], ["abstract methods", "dynamic dispatch"],
  """Create an abstract <code>Shape</code> with <code>area()</code>, <code>perimeter()</code> and <code>name()</code>, and the concrete shapes Circle, Rectangle, Square and Triangle. A collection of <code>Shape</code> references must be processed without checking concrete types.
Commands: <code>CIRCLE r</code>, <code>RECT w h</code>, <code>SQUARE s</code>, <code>TRIANGLE a b c</code> (add a shape; a triangle that violates the triangle inequality is rejected), <code>LIST</code>, <code>TOTAL</code>, <code>LARGEST</code>.""",
  COMMON_IO,
  """Adding prints nothing, except <code>ERROR invalid triangle</code>. <code>LIST</code> prints one line per shape: <code>i Name area=A perimeter=P</code> (1-based, insertion order). <code>TOTAL</code> prints <code>TOTAL area=A</code>. <code>LARGEST</code> prints <code>LARGEST Name</code> (the first one on ties) or <code>NONE</code>.
Numbers use exactly two decimals (standard printf <code>%.2f</code>). Use π from your math library; triangle area by Heron's formula.""",
  ["1 ≤ q ≤ 1000", "0 &lt; dimensions ≤ 1000"],
  [(script("CIRCLE 1", "RECT 3 4", "TRIANGLE 3 4 5", "TRIANGLE 1 2 10", "LIST", "TOTAL", "LARGEST"), "The 1-2-10 triangle is impossible. A circle of radius 1 has area π ≈ 3.14.")],
  [script("LIST", "TOTAL", "LARGEST"), script("SQUARE 2", "RECT 1 4", "LARGEST", "CIRCLE 0.5", "LIST"), script("TRIANGLE 2 2 4", "TRIANGLE 5 5 6", "CIRCLE 10", "TOTAL", "LIST")], o02,
  oop={"design": ["interface/abstract class <code>Shape</code>: area(), perimeter(), name()", "<code>Circle</code>, <code>Rectangle</code>, <code>Triangle</code> implement Shape",
                  "<code>Square</code> — composes or extends Rectangle (discuss: is a Square-extends-Rectangle design safe if shapes are mutable?)",
                  "a <code>ShapeFactory</code> that validates input and builds shapes"],
       "patterns": ["Factory Method"], "principles": ["polymorphism instead of type checks", "Open/Closed: adding a shape doesn't change LIST/TOTAL"]})

# ---------------------------------------------------------------- O03
def o03(t):
    emps, res = OrderedDict(), []
    def pay(e):
        if e["type"] == "SALARIED": return e["a"] // 12
        if e["type"] == "HOURLY":
            h = e.get("h", 0); reg = min(h, 40); ot = max(0, h - 40)
            return e["a"] * reg + e["a"] * ot * 3 // 2
        return e["a"] + e.get("s", 0) * e["b"] // 100
    for c in cmds(t):
        k = c[0]
        if k == "HIRE":
            if c[2] in emps: res.append("ERROR duplicate id"); continue
            typ = c[1]; e = {"type": typ, "name": c[3], "a": int(c[4])}
            if typ == "COMMISSION": e["b"] = int(c[5])
            emps[c[2]] = e; res.append(f"HIRED {c[2]}")
        elif k in ("HOURS", "SALES"):
            e = emps.get(c[1])
            if not e: res.append("ERROR no such employee")
            elif (k == "HOURS") != (e["type"] == "HOURLY") and (k == "SALES") != (e["type"] == "COMMISSION"): res.append("ERROR wrong employee type")
            else: e["h" if k == "HOURS" else "s"] = e.get("h" if k == "HOURS" else "s", 0) + int(c[2])
        elif k == "PAYROLL":
            total = 0
            for i, e in emps.items():
                p = pay(e); total += p; res.append(f"{i} {e['name']} {e['type']} {money(p)}")
                e["h"] = e["s"] = 0
            res.append(f"TOTAL {money(total)}")
    return out(*res)
P("O03", "Employee Payroll", "oop", ["inheritance", "polymorphism"], ["abstract methods", "state reset"],
  """Model employees with an abstract <code>Employee</code> (id, name) and three kinds of pay, each computing its own monthly pay in cents:
<ul><li><code>SALARIED annualCents</code> → annual / 12, rounded down.</li>
<li><code>HOURLY rateCents</code> → rate × hours, where hours above 40 are paid at 1.5× (overtime part rounded down).</li>
<li><code>COMMISSION baseCents percent</code> → base + sales × percent / 100, rounded down.</li></ul>
Commands: <code>HIRE TYPE id name amount [percent]</code>, <code>HOURS id h</code> (hourly staff only, accumulates), <code>SALES id cents</code> (commission staff only, accumulates), <code>PAYROLL</code>.""",
  COMMON_IO,
  """<code>HIRED id</code> or <code>ERROR duplicate id</code>. HOURS/SALES print nothing, or <code>ERROR no such employee</code> / <code>ERROR wrong employee type</code>.
<code>PAYROLL</code> prints one line per employee in hiring order: <code>id name TYPE X.YY</code>, then <code>TOTAL X.YY</code>; afterwards all recorded hours and sales reset to 0.""",
  ["1 ≤ q ≤ 10<sup>4</sup>", "all amounts are integers ≤ 10<sup>9</sup>"],
  [(script("HIRE SALARIED e1 ana 6000000", "HIRE HOURLY e2 ben 2000", "HIRE COMMISSION e3 chen 100000 10", "HOURS e2 45", "SALES e3 250000", "SALES e2 5", "PAYROLL"),
    "Ana: 60000.00 / 12 = 5000.00. Ben: 40 × 20.00 + 5 × 30.00 = 950.00. Chen: 1000.00 + 10% of 2500.00 = 1250.00.")],
  [script("PAYROLL", "HOURS x 3", "HIRE HOURLY h1 x 1000", "HIRE HOURLY h1 y 1000"),
   script("HIRE HOURLY h zed 1999", "HOURS h 41", "PAYROLL", "PAYROLL"), script("HIRE SALARIED s a 100", "HIRE COMMISSION c b 0 33", "SALES c 1001", "HOURS s 10", "PAYROLL")], o03,
  oop={"design": ["abstract class <code>Employee</code> { id, name; abstract monthlyPay(); resetPeriod() }", "<code>SalariedEmployee</code>, <code>HourlyEmployee</code>, <code>CommissionEmployee</code>",
                  "<code>Payroll</code> iterates Employee references in hiring order"],
       "patterns": [], "principles": ["polymorphism: PAYROLL never asks for the type to compute pay", "each subclass owns its own extra state (hours, sales)"]})

# ---------------------------------------------------------------- O04
def o04(t):
    books, members, res = {}, {}, []
    for c in cmds(t):
        k = c[0]
        if k == "ADDBOOK": books[c[1]] = {"title": c[2], "copies": int(c[3]), "out": 0}; res.append(f"BOOK {c[1]} {c[2]}")
        elif k == "JOIN": members[c[1]] = {"limit": 5 if c[2] == "PREMIUM" else 2, "has": []}; res.append(f"MEMBER {c[1]}")
        elif k == "BORROW":
            m, b = members.get(c[1]), books.get(c[2])
            if not m or not b: res.append("ERROR unknown member or book")
            elif c[2] in m["has"]: res.append("ERROR already borrowed")
            elif len(m["has"]) >= m["limit"]: res.append("ERROR limit reached")
            elif b["out"] >= b["copies"]: res.append("ERROR no copies available")
            else: b["out"] += 1; m["has"].append(c[2]); res.append(f"BORROWED {c[2]} {c[1]}")
        elif k == "RETURN":
            m = members.get(c[1])
            if not m or c[2] not in m["has"]: res.append("ERROR not borrowed")
            else: m["has"].remove(c[2]); books[c[2]]["out"] -= 1; res.append(f"RETURNED {c[2]} {c[1]}")
        elif k == "AVAILABLE":
            b = books.get(c[1]); res.append("ERROR unknown book" if not b else f"AVAILABLE {c[1]} {b['copies'] - b['out']}")
        elif k == "LOANS":
            m = members.get(c[1]); res.append("ERROR unknown member" if not m else "LOANS " + (" ".join(sorted(m["has"])) if m["has"] else "none"))
    return out(*res)
P("O04", "Library Management", "oop", ["encapsulation", "composition", "inheritance"], ["associations between objects", "business rules in methods"],
  """Model a library with <code>Book</code> (id, title, number of copies), <code>Member</code> (regular members may hold 2 books at once, premium members 5) and a <code>Library</code> that manages loans.
Commands: <code>ADDBOOK id title copies</code>, <code>JOIN name REGULAR|PREMIUM</code>, <code>BORROW name bookId</code>, <code>RETURN name bookId</code>, <code>AVAILABLE bookId</code>, <code>LOANS name</code>.""",
  COMMON_IO,
  """<code>BOOK id title</code>, <code>MEMBER name</code>, <code>BORROWED bookId name</code>, <code>RETURNED bookId name</code>, <code>AVAILABLE bookId n</code>, and <code>LOANS b1 b2 …</code> (book ids sorted) or <code>LOANS none</code>.
BORROW errors, checked in order: <code>ERROR unknown member or book</code>, <code>ERROR already borrowed</code> (a member can't hold two copies of the same book), <code>ERROR limit reached</code>, <code>ERROR no copies available</code>. Others: <code>ERROR not borrowed</code>, <code>ERROR unknown book</code>, <code>ERROR unknown member</code>.""",
  ["1 ≤ q ≤ 10<sup>4</sup>", "ids and titles have no spaces"],
  [(script("ADDBOOK b1 Dune 1", "ADDBOOK b2 Emma 2", "JOIN ana REGULAR", "JOIN ben PREMIUM", "BORROW ana b1", "BORROW ben b1", "BORROW ana b2", "BORROW ana b2", "RETURN ana b1", "BORROW ben b1", "LOANS ana", "AVAILABLE b1"),
    "Only one Dune exists; Ana can't borrow the same book twice; once Dune is returned, Ben can borrow it.")],
  [script("BORROW x y", "RETURN x y", "AVAILABLE z", "LOANS q"),
   script("ADDBOOK a A 5", "ADDBOOK b B 5", "ADDBOOK c C 5", "JOIN r REGULAR", "BORROW r a", "BORROW r b", "BORROW r c", "RETURN r a", "BORROW r c", "LOANS r")], o04,
  oop={"design": ["<code>Book</code> { id, title, totalCopies, loanedCopies }", "abstract <code>Member</code> { name; abstract maxLoans() } → <code>RegularMember</code>, <code>PremiumMember</code>",
                  "<code>Library</code> { books, members; borrow(), giveBack() } — enforces the rules", "optionally a <code>Loan</code> class linking a Member and a Book"],
       "patterns": [], "principles": ["the Library coordinates; Book and Member protect their own invariants", "composition: the Library has Books and Members"]})

# ---------------------------------------------------------------- O05
def o05(t):
    res = []; spots = {}; parked = {}
    order = ["SMALL", "MEDIUM", "LARGE"]; fits = {"MOTORCYCLE": 0, "CAR": 1, "TRUCK": 2}
    for c in cmds(t):
        k = c[0]
        if k == "LEVEL":
            for typ, n in zip(order, map(int, c[1:4])): spots[typ] = [None] * n
            res.append(f"LEVEL {c[1]} {c[2]} {c[3]}")
        elif k == "PARK":
            v, plate = c[1], c[2]
            if plate in parked: res.append("ERROR already parked"); continue
            for typ in order[fits[v]:]:
                if None in spots[typ]:
                    i = spots[typ].index(None); spots[typ][i] = plate; parked[plate] = (typ, i); res.append(f"PARKED {plate} {typ} {i + 1}"); break
            else: res.append(f"FULL {plate}")
        elif k == "LEAVE":
            if c[1] not in parked: res.append("ERROR not parked")
            else: typ, i = parked.pop(c[1]); spots[typ][i] = None; res.append(f"LEFT {c[1]} {typ} {i + 1}")
        elif k == "FREE": res.append("FREE " + " ".join(f"{typ}={spots[typ].count(None)}" for typ in order))
    return out(*res)
P("O05", "Parking Lot", "oop", ["inheritance", "polymorphism", "encapsulation"], ["modelling rules with types", "resource allocation"],
  """A parking lot has small, medium and large spots, numbered from 1 within each size. A motorcycle fits any spot, a car fits medium or large, a truck needs large. A vehicle always takes the <strong>smallest size that fits</strong> and, within that size, the lowest free number.
Commands: <code>LEVEL small medium large</code> (create the lot; always the first command), <code>PARK MOTORCYCLE|CAR|TRUCK plate</code>, <code>LEAVE plate</code>, <code>FREE</code>.""",
  COMMON_IO,
  "<code>LEVEL s m l</code>; <code>PARKED plate SIZE n</code> or <code>FULL plate</code> or <code>ERROR already parked</code>; <code>LEFT plate SIZE n</code> or <code>ERROR not parked</code>; <code>FREE SMALL=a MEDIUM=b LARGE=c</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>", "0 ≤ spots per size ≤ 1000"],
  [(script("LEVEL 1 1 1", "PARK CAR c1", "PARK CAR c2", "PARK TRUCK t1", "PARK MOTORCYCLE m1", "PARK MOTORCYCLE m2", "LEAVE c1", "PARK TRUCK t2", "FREE"),
    "c2 overflows into the large spot, so t1 finds no room; m1 takes the small spot and m2 finds every spot taken. When c1 leaves only a medium spot is free, which a truck can't use.")],
  [script("LEVEL 0 0 0", "PARK MOTORCYCLE m", "LEAVE m", "FREE"), script("LEVEL 2 0 1", "PARK MOTORCYCLE a", "PARK MOTORCYCLE b", "PARK MOTORCYCLE c", "PARK MOTORCYCLE a", "LEAVE a", "PARK MOTORCYCLE d", "FREE")], o05,
  oop={"design": ["abstract <code>Vehicle</code> { plate; abstract smallestSpot() } → <code>Motorcycle</code>, <code>Car</code>, <code>Truck</code>", "<code>ParkingSpot</code> { size, number, occupant }",
                  "<code>ParkingLot</code> { spots by size; park(vehicle), leave(plate) }"],
       "patterns": ["Strategy (the allocation rule could be swapped)"], "principles": ["the vehicle knows what it needs; the lot decides where it goes"]})

# ---------------------------------------------------------------- O06
def o06(t):
    inv, res = OrderedDict(), []
    for c in cmds(t):
        k = c[0]
        if k == "ADD":
            if c[1] in inv: res.append("ERROR duplicate sku"); continue
            inv[c[1]] = {"name": c[2], "price": int(c[3]), "qty": int(c[4]), "min": int(c[5])}; res.append(f"ADDED {c[1]}")
        elif c[1:] and c[1] not in inv and k != "REPORT": res.append("ERROR unknown sku")
        elif k == "RESTOCK": inv[c[1]]["qty"] += int(c[2]); res.append(f"STOCK {c[1]} {inv[c[1]]['qty']}")
        elif k == "SELL":
            p = inv[c[1]]; n = int(c[2])
            if n > p["qty"]: res.append("ERROR insufficient stock")
            else:
                p["qty"] -= n; res.append(f"SOLD {c[1]} {n} {money(n * p['price'])}")
                if p["qty"] <= p["min"]: res.append(f"ALERT low stock {c[1]} {p['qty']}")
        elif k == "PRICE": inv[c[1]]["price"] = int(c[2]); res.append(f"PRICE {c[1]} {money(int(c[2]))}")
        elif k == "REPORT":
            for s, p in inv.items(): res.append(f"{s} {p['name']} qty={p['qty']} value={money(p['qty'] * p['price'])}")
            res.append(f"TOTAL {money(sum(p['qty'] * p['price'] for p in inv.values()))}")
    return out(*res)
P("O06", "Inventory with Low-Stock Alerts", "oop", ["encapsulation", "events"], ["invariants", "derived values", "notifications"],
  """Design a <code>Product</code> (sku, name, unit price in cents, quantity, minimum level) and an <code>Inventory</code>. Selling that brings the quantity to or below the minimum level must raise a low-stock alert (think: an event a listener could react to).
Commands: <code>ADD sku name priceCents qty minLevel</code>, <code>RESTOCK sku n</code>, <code>SELL sku n</code>, <code>PRICE sku cents</code>, <code>REPORT</code>.""",
  COMMON_IO,
  """<code>ADDED sku</code> / <code>ERROR duplicate sku</code>; <code>STOCK sku qty</code>; <code>SOLD sku n X.YY</code> (n × price), followed by <code>ALERT low stock sku qty</code> when qty ≤ min after the sale; <code>PRICE sku X.YY</code>.
<code>REPORT</code>: one line per product in insertion order, <code>sku name qty=Q value=X.YY</code>, then <code>TOTAL X.YY</code>. Errors: <code>ERROR unknown sku</code>, <code>ERROR insufficient stock</code>.""",
  ["1 ≤ q ≤ 10<sup>4</sup>"],
  [(script("ADD p1 pen 150 10 3", "ADD p2 book 1299 2 1", "SELL p1 6", "SELL p1 2", "SELL p2 5", "RESTOCK p1 10", "REPORT"),
    "After selling 8 pens only 2 remain (≤ 3), so the second sale triggers an alert.")],
  [script("REPORT", "SELL x 1", "ADD a A 100 0 0", "SELL a 0", "ADD a B 1 1 1"), script("ADD a A 999 5 5", "SELL a 1", "PRICE a 1000", "REPORT")], o06,
  oop={"design": ["<code>Product</code> { sku, name, priceCents, quantity, minLevel; sell(n), restock(n), stockValue() }",
                  "<code>Inventory</code> { products; listeners }", "<code>StockListener</code> interface with onLowStock(product) — the printer is one implementation"],
       "patterns": ["Observer (low-stock listeners)"], "principles": ["Product protects quantity ≥ 0", "derived values (value) are computed, not stored"]})

# ---------------------------------------------------------------- O07
def o07(t):
    res = []; cont = None
    for c in cmds(t):
        k = c[0]
        if k == "NEW": cont = {"kind": c[1], "items": deque()}; res.append(f"NEW {c[1]}")
        elif k == "ADD": cont["items"].append(c[1])
        elif k == "REMOVE":
            it = cont["items"]
            if not it: res.append("EMPTY")
            else: res.append(it.pop() if cont["kind"] == "STACK" else it.popleft())
        elif k == "PEEK":
            it = cont["items"]; res.append("EMPTY" if not it else it[-1] if cont["kind"] == "STACK" else it[0])
        elif k == "SIZE": res.append(len(cont["items"]))
        elif k == "DUMP":
            it = list(cont["items"]); seq = list(reversed(it)) if cont["kind"] == "STACK" else it
            res.append(" ".join(seq) if seq else "EMPTY")
    return out(*res)
P("O07", "Generic Container Interface", "oop", ["interfaces", "generics"], ["programming to an interface", "generic types"],
  """Define a generic interface <code>Container&lt;T&gt;</code> with <code>add</code>, <code>remove</code>, <code>peek</code>, <code>size</code> and <code>isEmpty</code>, and two implementations: <code>Stack&lt;T&gt;</code> (LIFO) and <code>Queue&lt;T&gt;</code> (FIFO), implemented with your own linked nodes or arrays (not the library's stack/queue). The driver must only use the interface type.
Commands: <code>NEW STACK|QUEUE</code> (replace the current container with a new empty one), <code>ADD value</code>, <code>REMOVE</code>, <code>PEEK</code>, <code>SIZE</code>, <code>DUMP</code>.""",
  COMMON_IO,
  "<code>NEW KIND</code>; ADD prints nothing; REMOVE and PEEK print the value or <code>EMPTY</code>; SIZE prints the count; DUMP prints values in removal order (the next one to be removed first), or <code>EMPTY</code>.",
  ["1 ≤ q ≤ 10<sup>5</sup>", "the first command is always NEW"],
  [(script("NEW STACK", "ADD a", "ADD b", "ADD c", "DUMP", "REMOVE", "PEEK", "NEW QUEUE", "ADD a", "ADD b", "REMOVE", "DUMP"), "The stack removes c first; the queue removes a first.")],
  [script("NEW QUEUE", "REMOVE", "PEEK", "SIZE", "DUMP"), script("NEW STACK", "ADD 1", "REMOVE", "REMOVE", "ADD 2", "ADD 3", "SIZE", "NEW STACK", "SIZE")], o07,
  oop={"design": ["interface <code>Container&lt;T&gt;</code>", "<code>Stack&lt;T&gt;</code> and <code>Queue&lt;T&gt;</code> implement it", "a private <code>Node&lt;T&gt;</code> class for the linked structure"],
       "patterns": ["Iterator (for DUMP, optional)"], "principles": ["depend on abstractions (Dependency Inversion)", "information hiding: nodes never leak"]})

# ---------------------------------------------------------------- O08
def o08(t):
    l = lines(t); cap = int(l[1].split()[1]); cache = OrderedDict(); res = []
    for c in cmds(t)[1:]:
        if c[0] == "GET":
            if c[1] in cache: cache.move_to_end(c[1]); res.append(cache[c[1]])
            else: res.append("MISS")
        elif c[0] == "PUT":
            if c[1] in cache: cache.move_to_end(c[1])
            elif len(cache) >= cap: old = cache.popitem(last=False)[0]; res.append(f"EVICT {old}")
            cache[c[1]] = c[2]
        else: res.append("KEYS " + (" ".join(reversed(cache)) if cache else "none"))
    return out(*res)
P("O08", "LRU Cache", "oop", ["data structures", "encapsulation"], ["hash map + doubly linked list", "O(1) operations"],
  """Implement an <code>LRUCache</code> class with a fixed capacity. <code>get</code> and <code>put</code> must run in O(1): combine a hash map with a doubly linked list (don't use a ready-made LRU or ordered-dict class). When the cache is full, <code>put</code> of a new key evicts the least recently used key. Both get (on a hit) and put mark a key as most recently used.
Commands: the first command is <code>CAPACITY n</code>; then <code>PUT key value</code>, <code>GET key</code>, <code>KEYS</code>.""",
  COMMON_IO,
  "<code>GET</code> prints the value or <code>MISS</code>; <code>PUT</code> prints <code>EVICT key</code> only when it evicts; <code>KEYS</code> prints <code>KEYS k1 k2 …</code> from most to least recently used, or <code>KEYS none</code>.",
  ["1 ≤ q ≤ 2·10<sup>5</sup>", "1 ≤ n ≤ 10<sup>5</sup>"],
  [(script("CAPACITY 2", "PUT a 1", "PUT b 2", "GET a", "PUT c 3", "GET b", "KEYS", "PUT a 9", "GET a"), "Reading a makes b the least recently used, so adding c evicts b. Updating an existing key never evicts.")],
  [script("CAPACITY 1", "GET x", "PUT x 1", "PUT y 2", "GET x", "GET y", "KEYS"), script("CAPACITY 3", "KEYS", "PUT a 1", "PUT b 2", "PUT c 3", "GET a", "GET b", "PUT d 4", "PUT e 5", "KEYS")], o08,
  oop={"design": ["<code>LRUCache&lt;K,V&gt;</code> { capacity; Map&lt;K, Node&gt;; head/tail sentinels }", "private <code>Node</code> { key, value, prev, next }", "private helpers moveToFront(node), removeLast()"],
       "patterns": [], "principles": ["encapsulate the linked list completely", "sentinel nodes remove edge cases"]})

# ---------------------------------------------------------------- O09
def o09(t):
    state = "IDLE"; credit = 0; items = {}; res = []
    for c in cmds(t):
        k = c[0]
        if k == "STOCK": items[c[1]] = [int(c[2]), int(c[3])]; res.append(f"STOCKED {c[1]}")
        elif k == "COIN":
            v = int(c[1])
            if v not in (5, 10, 25, 100): res.append(f"REJECTED {v}")
            else: credit += v; state = "HAS_CREDIT"; res.append(f"CREDIT {money(credit)}")
        elif k == "SELECT":
            if state == "IDLE": res.append("INSERT COINS"); continue
            it = items.get(c[1])
            if not it or it[1] == 0: res.append("SOLD OUT")
            elif credit < it[0]: res.append(f"NEED {money(it[0] - credit)}")
            else:
                it[1] -= 1; change = credit - it[0]; credit = 0; state = "IDLE"
                res.append(f"VEND {c[1]} CHANGE {money(change)}")
        elif k == "CANCEL":
            res.append(f"REFUND {money(credit)}" if state == "HAS_CREDIT" else "NOTHING TO REFUND"); credit = 0; state = "IDLE"
        elif k == "STATE": res.append(state)
    return out(*res)
P("O09", "Vending Machine (State Pattern)", "oop", ["state machine", "polymorphism"], ["State pattern", "transitions"],
  """Model a vending machine whose behaviour depends on its state: <code>IDLE</code> (no credit) or <code>HAS_CREDIT</code>. Implement each state as its own class (the State pattern) instead of if/else chains on a status field.
Commands: <code>STOCK item priceCents count</code>, <code>COIN cents</code> (accepted coins: 5, 10, 25, 100), <code>SELECT item</code>, <code>CANCEL</code>, <code>STATE</code>.""",
  COMMON_IO,
  """<code>STOCKED item</code>; <code>CREDIT X.YY</code> or <code>REJECTED v</code> (an invalid coin changes nothing); SELECT prints <code>INSERT COINS</code> (in IDLE), <code>SOLD OUT</code> (unknown item or count 0), <code>NEED X.YY</code> (the missing amount; the credit stays), or <code>VEND item CHANGE X.YY</code> (back to IDLE).
CANCEL prints <code>REFUND X.YY</code> or <code>NOTHING TO REFUND</code>; STATE prints the state name.""",
  ["1 ≤ q ≤ 10<sup>4</sup>"],
  [(script("STOCK cola 125 1", "SELECT cola", "COIN 100", "COIN 3", "SELECT cola", "COIN 25", "COIN 25", "SELECT cola", "STATE", "COIN 100", "SELECT cola", "CANCEL"),
    "1.00 isn't enough for 1.25; with 1.50 the cola vends with 0.25 change; the second cola is sold out and the coin is refunded.")],
  [script("STATE", "CANCEL", "COIN 5", "STATE", "CANCEL", "STATE"), script("STOCK a 5 2", "COIN 5", "SELECT a", "COIN 10", "SELECT b", "SELECT a", "SELECT a")], o09,
  oop={"design": ["interface <code>MachineState</code> { insertCoin(), select(), cancel() }", "<code>IdleState</code>, <code>HasCreditState</code>", "<code>VendingMachine</code> { currentState, credit, inventory; setState() }"],
       "patterns": ["State"], "principles": ["each state class handles only its own behaviour", "adding a MAINTENANCE state wouldn't touch the others"]})

# ---------------------------------------------------------------- O10
def o10(t):
    seq = ["RED", "GREEN", "YELLOW"]; dur = {"RED": 30, "GREEN": 25, "YELLOW": 5}; i = 0; left = 30; res = []; mode = "NORMAL"
    for c in cmds(t):
        k = c[0]
        if k == "TICK":
            for _ in range(int(c[1])):
                if mode == "FLASHING": continue
                left -= 1
                if left == 0: i = (i + 1) % 3; left = dur[seq[i]]
            res.append(f"{('FLASHING YELLOW' if mode == 'FLASHING' else seq[i])}" + ("" if mode == "FLASHING" else f" {left}"))
        elif k == "PEDESTRIAN":
            if mode == "NORMAL" and seq[i] == "GREEN" and left > 10: left = 10; res.append("SHORTENED")
            else: res.append("IGNORED")
        elif k == "FAULT": mode = "FLASHING"; res.append("FLASHING YELLOW")
        elif k == "RESET": mode = "NORMAL"; i = 0; left = 30; res.append("RED 30")
    return out(*res)
P("O10", "Traffic Light Controller", "oop", ["state machine"], ["State pattern", "time-driven transitions"],
  """A traffic light cycles RED (30 s) → GREEN (25 s) → YELLOW (5 s) → RED … and starts in RED with 30 seconds left. A <code>FAULT</code> switches it to flashing yellow, where time doesn't advance, until <code>RESET</code> (back to RED with 30 s).
A pedestrian button shortens a GREEN light to 10 seconds remaining, but only if more than 10 seconds are left; otherwise it is ignored.
Commands: <code>TICK s</code> (advance s seconds, one second at a time; when the remaining time reaches 0 the light changes and its full duration starts), <code>PEDESTRIAN</code>, <code>FAULT</code>, <code>RESET</code>.""",
  COMMON_IO,
  "After TICK: <code>COLOR remaining</code>, or <code>FLASHING YELLOW</code> in fault mode. PEDESTRIAN: <code>SHORTENED</code> or <code>IGNORED</code>. FAULT: <code>FLASHING YELLOW</code>. RESET: <code>RED 30</code>.",
  ["1 ≤ q ≤ 1000", "1 ≤ s ≤ 10<sup>4</sup>"],
  [(script("TICK 29", "TICK 1", "PEDESTRIAN", "TICK 10", "TICK 4", "TICK 1", "FAULT", "TICK 100", "RESET"),
    "After 30 s the light turns GREEN (25 s); the button cuts it to 10 s; 10 s later it is YELLOW (5 s left).")],
  [script("PEDESTRIAN", "TICK 60", "TICK 60", "TICK 1"), script("TICK 30", "TICK 16", "PEDESTRIAN", "PEDESTRIAN", "FAULT", "PEDESTRIAN", "RESET", "TICK 90")], o10,
  oop={"design": ["abstract <code>LightState</code> { color(), duration(), next(), onPedestrian(light) }", "<code>Red</code>, <code>Green</code>, <code>Yellow</code>, <code>FlashingYellow</code>", "<code>TrafficLight</code> { state, remaining; tick() }"],
       "patterns": ["State"], "principles": ["the green state alone knows how to react to the pedestrian button"]})

# ---------------------------------------------------------------- O11
def o11(t):
    cart = OrderedDict(); coupon = None; res = []
    def subtotal(): return sum(p * q for p, q in cart.values())
    def discount():
        s = subtotal()
        if coupon is None: return 0
        kind, v = coupon
        if kind == "PERCENT": return s * v // 100
        if kind == "FIXED": return min(v, s)
        if kind == "BOGO": return sum((q // 2) * p for p, q in cart.values())
        return 0
    for c in cmds(t):
        k = c[0]
        if k == "ADD":
            p, q = int(c[2]), int(c[3])
            if c[1] in cart: cart[c[1]] = (cart[c[1]][0], cart[c[1]][1] + q)
            else: cart[c[1]] = (p, q)
            res.append(f"CART {c[1]} x{cart[c[1]][1]}")
        elif k == "REMOVE":
            if c[1] in cart: del cart[c[1]]; res.append(f"REMOVED {c[1]}")
            else: res.append("ERROR not in cart")
        elif k == "COUPON":
            kind = c[1]
            if kind not in ("PERCENT", "FIXED", "BOGO"): res.append("ERROR unknown coupon"); continue
            coupon = (kind, int(c[2]) if len(c) > 2 else 0); res.append(f"COUPON {kind}")
        elif k == "TOTAL":
            s, d = subtotal(), discount(); res.append(f"SUBTOTAL {money(s)} DISCOUNT {money(d)} TOTAL {money(s - d)}")
    return out(*res)
P("O11", "Shopping Cart with Discount Strategies", "oop", ["strategy", "polymorphism"], ["Strategy pattern", "replaceable algorithms"],
  """A cart holds items (name, unit price in cents, quantity). At most one coupon is active at a time; applying a new coupon replaces the old one. Implement each coupon type as a separate strategy class:
<ul><li><code>PERCENT p</code>: p% off the subtotal, rounded down to a cent.</li><li><code>FIXED cents</code>: a fixed amount off, never below 0.</li>
<li><code>BOGO</code>: buy one, get one free — for each item line, every second unit is free.</li></ul>
Commands: <code>ADD name priceCents qty</code> (adding an existing name increases its quantity and keeps the original price), <code>REMOVE name</code>, <code>COUPON TYPE [value]</code>, <code>TOTAL</code>.""",
  COMMON_IO,
  "<code>CART name xQ</code> (the new quantity), <code>REMOVED name</code> / <code>ERROR not in cart</code>, <code>COUPON TYPE</code> / <code>ERROR unknown coupon</code>, and <code>SUBTOTAL X.YY DISCOUNT X.YY TOTAL X.YY</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>"],
  [(script("ADD tea 450 3", "ADD cake 300 1", "TOTAL", "COUPON BOGO", "TOTAL", "COUPON PERCENT 15", "TOTAL", "COUPON FIXED 99999", "TOTAL"),
    "BOGO makes one of the 3 teas free (−4.50); 15% of 16.50 is 2.475 → 2.47; a fixed coupon can't exceed the subtotal.")],
  [script("TOTAL", "REMOVE x", "COUPON FREE", "COUPON PERCENT 50", "TOTAL"), script("ADD a 1 1", "ADD a 999 4", "COUPON BOGO", "TOTAL", "REMOVE a", "TOTAL")], o11,
  oop={"design": ["interface <code>DiscountStrategy</code> { discountFor(cart) }", "<code>PercentOff</code>, <code>FixedOff</code>, <code>BuyOneGetOne</code>, <code>NoDiscount</code> (Null Object)",
                  "<code>Cart</code> { lines; strategy; subtotal(), total() }"],
       "patterns": ["Strategy", "Null Object"], "principles": ["Open/Closed: a new coupon is a new class"]})

# ---------------------------------------------------------------- O12
def o12(t):
    subs = defaultdict(list); res = []
    for c in cmds(t):
        k = c[0]
        if k == "SUBSCRIBE":
            if c[1] in subs[c[2]]: res.append("ERROR already subscribed")
            else: subs[c[2]].append(c[1]); res.append(f"SUBSCRIBED {c[1]} {c[2]}")
        elif k == "UNSUBSCRIBE":
            if c[1] not in subs[c[2]]: res.append("ERROR not subscribed")
            else: subs[c[2]].remove(c[1]); res.append(f"UNSUBSCRIBED {c[1]} {c[2]}")
        elif k == "PUBLISH":
            topic, msg = c[1], " ".join(c[2:]); targets = list(subs[topic]) + [s for s in subs["*"] if s not in subs[topic]]
            res.append(f"PUBLISHED {topic} to {len(targets)}")
            for s in targets: res.append(f"  {s} <- {topic}: {msg}")
    return out(*res)
P("O12", "Event Bus (Observer Pattern)", "oop", ["observer", "interfaces"], ["Observer pattern", "decoupling publishers and subscribers"],
  """Build an event bus where subscribers register for topics, and publishing to a topic notifies them in subscription order. The special topic <code>*</code> receives every event; a subscriber registered both to a topic and to <code>*</code> is notified only once (in its position in the topic's list).
Commands: <code>SUBSCRIBE name topic</code>, <code>UNSUBSCRIBE name topic</code>, <code>PUBLISH topic message words…</code>.""",
  COMMON_IO,
  """<code>SUBSCRIBED name topic</code> / <code>ERROR already subscribed</code>; <code>UNSUBSCRIBED name topic</code> / <code>ERROR not subscribed</code>.
PUBLISH prints <code>PUBLISHED topic to N</code> followed by N lines <code>␣␣name &lt;- topic: message</code> (two leading spaces): first the topic's subscribers, then the <code>*</code> subscribers not already notified.""",
  ["1 ≤ q ≤ 10<sup>4</sup>"],
  [(script("SUBSCRIBE ana orders", "SUBSCRIBE log *", "SUBSCRIBE ben orders", "PUBLISH orders new order o1", "UNSUBSCRIBE ana orders", "PUBLISH stock low on b1", "SUBSCRIBE log orders", "PUBLISH orders paid"),
    "The logger hears every topic via *, but only once even after also subscribing to orders.")],
  [script("PUBLISH quiet nobody listens", "UNSUBSCRIBE x y", "SUBSCRIBE a t", "SUBSCRIBE a t"), script("SUBSCRIBE z *", "SUBSCRIBE a *", "PUBLISH x hi", "UNSUBSCRIBE z *", "PUBLISH x bye")], o12,
  oop={"design": ["interface <code>Subscriber</code> { onEvent(topic, message) }", "<code>EventBus</code> { Map&lt;topic, List&lt;Subscriber&gt;&gt;; subscribe(), unsubscribe(), publish() }", "<code>NamedSubscriber</code> prints the notification line"],
       "patterns": ["Observer", "Publish–Subscribe"], "principles": ["publishers don't know their subscribers"]})

# ---------------------------------------------------------------- O13
def o13(t):
    text = ""; undo, redo = [], []; res = []
    for line in lines(t)[1:]:
        k, _, arg = line.partition(" ")
        if k == "TYPE": undo.append(text); redo.clear(); text += arg
        elif k == "DELETE": n = int(arg); undo.append(text); redo.clear(); text = text[:max(0, len(text) - n)]
        elif k == "UNDO":
            if undo: redo.append(text); text = undo.pop()
            else: res.append("NOTHING TO UNDO"); continue
        elif k == "REDO":
            if redo: undo.append(text); text = redo.pop()
            else: res.append("NOTHING TO REDO"); continue
        if k in ("TYPE", "DELETE", "UNDO", "REDO", "SHOW"): res.append(f"[{text}]")
    return out(*res)
P("O13", "Text Editor with Undo/Redo (Command Pattern)", "oop", ["command pattern"], ["Command pattern", "undo/redo stacks"],
  """Implement a tiny text editor where every edit is a command object that knows how to <code>execute()</code> and <code>undo()</code> itself. Keep an undo stack and a redo stack; any new edit clears the redo stack.
Commands: <code>TYPE text</code> (appends everything after the first space, including further spaces), <code>DELETE n</code> (removes the last n characters, or all of them if there are fewer), <code>UNDO</code>, <code>REDO</code>, <code>SHOW</code>.""",
  COMMON_IO,
  "After TYPE, DELETE, a successful UNDO/REDO, and SHOW: the whole text in brackets, <code>[text]</code>. A failed UNDO/REDO prints <code>NOTHING TO UNDO</code> / <code>NOTHING TO REDO</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>", "total text length ≤ 10<sup>5</sup>"],
  [(script("TYPE Hello", "TYPE  world", "DELETE 6", "UNDO", "UNDO", "REDO", "TYPE !", "REDO", "SHOW"),
    "The second TYPE appends \" world\" (with its leading space). Typing after an undo clears the redo history.")],
  [script("UNDO", "REDO", "SHOW", "DELETE 5", "UNDO", "UNDO"), script("TYPE abc", "DELETE 99", "UNDO", "TYPE   x  ", "SHOW", "UNDO", "UNDO", "REDO", "REDO", "REDO")], o13,
  oop={"design": ["interface <code>EditCommand</code> { execute(doc), undo(doc) }", "<code>TypeCommand</code> (remembers what it appended), <code>DeleteCommand</code> (remembers what it removed)",
                  "<code>Document</code> { text }", "<code>Editor</code> { undoStack, redoStack; run(command), undo(), redo() }"],
       "patterns": ["Command"], "principles": ["each command stores just enough state to reverse itself"]})

# ---------------------------------------------------------------- O14
from fractions import Fraction
def o14(t):
    vals, res = {}, []
    def show(f): return f"{f.numerator}/{f.denominator}" if f.denominator != 1 else str(f.numerator)
    for c in cmds(t):
        k = c[0]
        try:
            if k == "LET":
                n, d = map(int, c[2].split("/")) if "/" in c[2] else (int(c[2]), 1)
                if d == 0: res.append("ERROR zero denominator"); continue
                vals[c[1]] = Fraction(n, d); res.append(f"{c[1]} = {show(vals[c[1]])}")
            elif k in ("ADD", "SUB", "MUL", "DIV"):
                a, b = vals[c[2]], vals[c[3]]
                if k == "DIV" and b == 0: res.append("ERROR division by zero"); continue
                vals[c[1]] = a + b if k == "ADD" else a - b if k == "SUB" else a * b if k == "MUL" else a / b
                res.append(f"{c[1]} = {show(vals[c[1]])}")
            elif k == "CMP":
                a, b = vals[c[1]], vals[c[2]]; res.append(f"{c[1]} {'<' if a < b else '>' if a > b else '=='} {c[2]}")
        except KeyError: res.append("ERROR unknown variable")
    return out(*res)
P("O14", "Immutable Fraction Class", "oop", ["value objects", "immutability", "operator methods"], ["value objects", "normalisation", "equality and ordering"],
  """Write an <strong>immutable</strong> <code>Fraction</code> value class: every operation returns a new Fraction, always stored in lowest terms with a positive denominator. Implement add, subtract, multiply, divide, equality and comparison (via your language's equality/comparison conventions — equals/hashCode/compareTo in Java, operators in C++, …).
Commands: <code>LET name value</code> (value is <code>n</code> or <code>n/d</code>), <code>ADD r a b</code>, <code>SUB r a b</code>, <code>MUL r a b</code>, <code>DIV r a b</code> (store the result in r), <code>CMP a b</code>.""",
  COMMON_IO,
  "LET and the arithmetic commands print <code>name = value</code>, where value is in lowest terms, written <code>n/d</code>, or just <code>n</code> if the denominator is 1. CMP prints <code>a &lt; b</code>, <code>a &gt; b</code> or <code>a == b</code>. Errors: <code>ERROR zero denominator</code>, <code>ERROR division by zero</code>, <code>ERROR unknown variable</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>", "numerators/denominators of inputs ≤ 10<sup>6</sup> in absolute value; results fit in 64 bits"],
  [(script("LET a 1/2", "LET b 2/-6", "ADD c a b", "MUL d a b", "DIV e a b", "CMP a b", "LET f 3/6", "CMP a f"), "2/−6 normalises to −1/3; 1/2 + (−1/3) = 1/6; 3/6 equals 1/2.")],
  [script("LET x 5/0", "LET y 0/7", "LET z 4", "DIV r z y", "ADD r z nope"), script("LET a -3/-9", "LET b 2/3", "SUB c a b", "SUB d c c", "CMP c d", "MUL e b b")], o14,
  oop={"design": ["final/immutable class <code>Fraction</code> { private final num, den; static of(n, d); plus(), minus(), times(), dividedBy(); equals(), hashCode(), compareTo(), toString() }"],
       "patterns": ["Value Object", "Static factory method"], "principles": ["immutability makes Fractions safe to share", "normalise in one place (the constructor/factory)"]})

# ---------------------------------------------------------------- O15
def o15(t):
    rates = {"EUR": 100, "USD": 108, "GBP": 85}; wallet = defaultdict(int); res = []
    for c in cmds(t):
        k = c[0]
        if k == "ADD":
            if c[2] not in rates: res.append("ERROR unknown currency"); continue
            wallet[c[2]] += int(c[1]); res.append(f"WALLET {c[2]} {money(wallet[c[2]])}")
        elif k == "CONVERT":
            amt, f, to = int(c[1]), c[2], c[3]
            if f not in rates or to not in rates: res.append("ERROR unknown currency"); continue
            res.append(f"{money(amt)} {f} = {money(amt * rates[to] // rates[f])} {to}")
        elif k == "TOTAL":
            to = c[1]
            if to not in rates: res.append("ERROR unknown currency"); continue
            res.append(f"TOTAL {money(sum(v * rates[to] // rates[cur] for cur, v in wallet.items()))} {to}")
    return out(*res)
P("O15", "Money and Currencies", "oop", ["value objects", "encapsulation"], ["value objects", "safe arithmetic", "avoiding floating point"],
  """Model a <code>Money</code> value (amount in minor units + currency) and a <code>Wallet</code> holding several currencies. Conversion uses fixed rates relative to EUR: 1 EUR = 1.08 USD = 0.85 GBP. Converting <code>amount</code> from currency F to T gives <code>amount × rate(T) / rate(F)</code> using integer rates EUR=100, USD=108, GBP=85, <strong>rounded down</strong> (each wallet entry is converted and rounded separately for TOTAL).
Commands: <code>ADD cents CUR</code>, <code>CONVERT cents FROM TO</code>, <code>TOTAL CUR</code>.""",
  COMMON_IO,
  "<code>WALLET CUR X.YY</code> (the new balance in that currency), <code>X.YY FROM = Y.YY TO</code>, <code>TOTAL X.YY CUR</code>; <code>ERROR unknown currency</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>", "0 ≤ cents ≤ 10<sup>12</sup>"],
  [(script("ADD 10000 EUR", "ADD 5400 USD", "CONVERT 10000 EUR USD", "CONVERT 108 USD GBP", "TOTAL EUR", "TOTAL GBP", "ADD 5 JPY"), "5400 USD × 100 / 108 = 5000 EUR cents; 108 USD cents × 85 / 108 = 85 GBP cents.")],
  [script("TOTAL USD", "CONVERT 1 GBP EUR", "CONVERT 1 EUR GBP", "TOTAL XXX"), script("ADD 999 GBP", "ADD 1 USD", "ADD 1 EUR", "TOTAL USD", "TOTAL GBP")], o15,
  oop={"design": ["immutable <code>Money</code> { minorUnits, currency; convertTo(currency, rates) }", "<code>Currency</code> enum with its rate", "<code>Wallet</code> { Map&lt;Currency, Money&gt;; add(), total(in) }"],
       "patterns": ["Value Object"], "principles": ["never use binary floating point for money", "an enum makes invalid currencies unrepresentable"]})

# ---------------------------------------------------------------- O16
ANIMALS = {"DOG": ("woof", ["walk", "swim"]), "CAT": ("meow", ["walk"]), "DUCK": ("quack", ["walk", "swim", "fly"]), "FISH": ("...", ["swim"]),
           "EAGLE": ("screech", ["walk", "fly"]), "PENGUIN": ("honk", ["walk", "swim"])}
def o16(t):
    zoo, res = [], []
    for c in cmds(t):
        k = c[0]
        if k == "ADD":
            if c[1] not in ANIMALS: res.append("ERROR unknown species"); continue
            zoo.append((c[2], c[1])); res.append(f"ADDED {c[2]} the {c[1].lower()}")
        elif k == "SPEAK":
            for n, s in zoo: res.append(f"{n}: {ANIMALS[s][0]}")
        elif k == "CAN":
            able = [n for n, s in zoo if c[1].lower() in ANIMALS[s][1]]
            res.append(f"{c[1]}: {' '.join(able) if able else 'none'}")
        elif k == "MOVE":
            for n, s in zoo: res.append(f"{n} can {', '.join(ANIMALS[s][1])}")
    return out(*res)
P("O16", "Animal Kingdom (Interfaces vs Inheritance)", "oop", ["interfaces", "abstract classes"], ["interface segregation", "composition of capabilities"],
  """Model animals with an abstract <code>Animal</code> (name, <code>sound()</code>) and capability <strong>interfaces</strong> <code>Walker</code>, <code>Swimmer</code>, <code>Flyer</code>. Species and abilities:
DOG woof (walk, swim) · CAT meow (walk) · DUCK quack (walk, swim, fly) · FISH ... (swim) · EAGLE screech (walk, fly) · PENGUIN honk (walk, swim).
A penguin is a bird that can't fly — don't give it a fly() that throws! Commands: <code>ADD SPECIES name</code>, <code>SPEAK</code>, <code>CAN WALK|SWIM|FLY</code>, <code>MOVE</code>.""",
  COMMON_IO,
  "<code>ADDED name the species</code> (species in lower case) / <code>ERROR unknown species</code>. SPEAK: <code>name: sound</code> per animal. CAN: <code>ABILITY: names…</code> in insertion order, or <code>none</code>. MOVE: <code>name can a, b, c</code> with abilities in the order walk, swim, fly.",
  ["1 ≤ q ≤ 1000"],
  [(script("ADD DOG rex", "ADD PENGUIN pingu", "ADD EAGLE sam", "ADD DRAGON smaug", "SPEAK", "CAN FLY", "CAN SWIM", "MOVE"), "Penguins swim but can't fly; the type system, not a runtime exception, should say so.")],
  [script("SPEAK", "CAN WALK", "MOVE"), script("ADD FISH nemo", "ADD DUCK don", "ADD CAT tom", "CAN WALK", "CAN FLY", "SPEAK")], o16,
  oop={"design": ["abstract <code>Animal</code> { name; abstract sound() }", "interfaces <code>Walker</code>, <code>Swimmer</code>, <code>Flyer</code>", "<code>Dog extends Animal implements Walker, Swimmer</code>, …",
                  "CAN uses <code>instanceof</code>/type checks on capabilities, or each animal returns its capability set"],
       "patterns": [], "principles": ["Interface Segregation", "Liskov: no subclass may break a promise its parent makes (the classic penguin trap)"]})

# ---------------------------------------------------------------- O17
def o17(t):
    root = {"type": "dir", "children": {}}; res = []
    def walk(path, create=None):
        node = root
        parts = [p for p in path.split("/") if p]
        for i, p in enumerate(parts):
            if node["type"] != "dir": return None
            if p not in node["children"]:
                if create and i == len(parts) - 1: node["children"][p] = create
                elif create == "mkdir-p": node["children"][p] = {"type": "dir", "children": {}}
                else: return None
            node = node["children"][p]
        return node
    def size(n): return n["size"] if n["type"] == "file" else sum(size(x) for x in n["children"].values())
    def tree(n, name, depth):
        res.append("  " * depth + (("/" if name == "/" else f"{name}/") if n["type"] == "dir" else f"{name} ({n['size']})"))
        if n["type"] == "dir":
            for k in sorted(n["children"]): tree(n["children"][k], k, depth + 1)
    for c in cmds(t):
        k = c[0]
        if k == "MKDIR":
            parent = "/".join(c[1].split("/")[:-1]) or "/"
            p = walk(parent)
            if p is None or p["type"] != "dir": res.append("ERROR no such directory")
            elif c[1].split("/")[-1] in p["children"]: res.append("ERROR exists")
            else: p["children"][c[1].split("/")[-1]] = {"type": "dir", "children": {}}; res.append(f"CREATED {c[1]}")
        elif k == "TOUCH":
            parent = "/".join(c[1].split("/")[:-1]) or "/"
            p = walk(parent)
            if p is None or p["type"] != "dir": res.append("ERROR no such directory")
            else:
                name = c[1].split("/")[-1]
                if name in p["children"] and p["children"][name]["type"] == "dir": res.append("ERROR exists")
                else: p["children"][name] = {"type": "file", "size": int(c[2])}; res.append(f"FILE {c[1]} {c[2]}")
        elif k == "DU":
            n = walk(c[1]); res.append("ERROR not found" if n is None else f"SIZE {c[1]} {size(n)}")
        elif k == "LS":
            n = walk(c[1])
            if n is None: res.append("ERROR not found")
            elif n["type"] == "file": res.append(c[1].split("/")[-1])
            else: res.append(" ".join(f"{x}/" if n["children"][x]["type"] == "dir" else x for x in sorted(n["children"])) or "(empty)")
        elif k == "TREE":
            n = walk(c[1])
            if n is None: res.append("ERROR not found")
            else: tree(n, c[1] if c[1] == "/" else c[1].split("/")[-1], 0)
        elif k == "RM":
            parent = "/".join(c[1].split("/")[:-1]) or "/"; p = walk(parent); name = c[1].split("/")[-1]
            if p is None or p["type"] != "dir" or name not in p["children"]: res.append("ERROR not found")
            else: del p["children"][name]; res.append(f"REMOVED {c[1]}")
    return out(*res)
P("O17", "File System Tree (Composite Pattern)", "oop", ["composite pattern", "recursion"], ["Composite pattern", "recursive structures"],
  """Model files and directories with a common abstract <code>Node</code>. A <code>File</code> has a size; a <code>Directory</code> contains nodes, and its size is the sum of everything inside it (recursively). Paths are absolute, like <code>/docs/a.txt</code>; the root is <code>/</code>.
Commands: <code>MKDIR path</code> (the parent must exist), <code>TOUCH path size</code> (create or overwrite a file; the parent must exist), <code>DU path</code>, <code>LS path</code>, <code>TREE path</code>, <code>RM path</code> (removes a file or a whole directory).""",
  COMMON_IO,
  """<code>CREATED path</code>, <code>FILE path size</code>, <code>SIZE path n</code>, <code>REMOVED path</code>. LS lists the children sorted by name on one line, with a trailing <code>/</code> for directories (<code>(empty)</code> if none; a file path lists just its name).
TREE prints the node, then its children sorted by name, indented by 2 spaces per level: directories as <code>name/</code>, files as <code>name (size)</code>; the root prints as <code>/</code>. Errors: <code>ERROR no such directory</code>, <code>ERROR exists</code>, <code>ERROR not found</code>.""",
  ["1 ≤ q ≤ 10<sup>4</sup>", "names contain letters, digits, dots and underscores"],
  [(script("MKDIR /docs", "MKDIR /docs/old", "TOUCH /docs/a.txt 120", "TOUCH /docs/old/b.txt 30", "TOUCH /readme 5", "DU /docs", "DU /", "LS /docs", "TREE /", "RM /docs/old", "DU /"),
    "A directory's size is computed recursively: /docs = 120 + 30.")],
  [script("MKDIR /a/b", "TOUCH /x/y 1", "LS /", "DU /nope", "TREE /"), script("MKDIR /a", "MKDIR /a", "TOUCH /a 3", "TOUCH /f 3", "TOUCH /f 7", "LS /f", "MKDIR /f/g", "RM /f", "LS /a", "RM /zzz")], o17,
  oop={"design": ["abstract <code>Node</code> { name; abstract size(); print(indent) }", "<code>File</code> { size }", "<code>Directory</code> { children: sorted map }", "<code>FileSystem</code> resolves paths"],
       "patterns": ["Composite"], "principles": ["clients treat files and directories uniformly through Node"]})

# ---------------------------------------------------------------- O18
def o18(t):
    rooms, books, res = {}, {}, []; nxt = 1
    for c in cmds(t):
        k = c[0]
        if k == "ROOM": rooms[c[1]] = {"type": c[2], "price": int(c[3]), "bookings": []}; res.append(f"ROOM {c[1]}")
        elif k == "BOOK":
            guest, typ, a, b = c[1], c[2], int(c[3]), int(c[4])
            if a >= b: res.append("ERROR invalid dates"); continue
            for rid in sorted(rooms):
                r = rooms[rid]
                if r["type"] == typ and all(b <= x or a >= y for x, y, _ in r["bookings"]):
                    r["bookings"].append((a, b, nxt)); books[nxt] = (rid, guest, a, b)
                    res.append(f"BOOKING {nxt} {guest} room {rid} {money((b - a) * r['price'])}"); nxt += 1; break
            else: res.append(f"NO AVAILABILITY {typ}")
        elif k == "CANCEL":
            bid = int(c[1])
            if bid not in books: res.append("ERROR no such booking")
            else:
                rid = books.pop(bid)[0]; rooms[rid]["bookings"] = [x for x in rooms[rid]["bookings"] if x[2] != bid]; res.append(f"CANCELLED {bid}")
        elif k == "OCCUPANCY":
            d = int(c[1]); occ = sorted(rid for rid, r in rooms.items() if any(x <= d < y for x, y, _ in r["bookings"]))
            res.append(f"DAY {d}: {' '.join(occ) if occ else 'none'}")
    return out(*res)
P("O18", "Hotel Reservations", "oop", ["composition", "business rules"], ["overlap detection", "id generation"],
  """Rooms have an id, a type (SINGLE, DOUBLE, SUITE) and a nightly price in cents. A booking covers check-in day <code>a</code> to check-out day <code>b</code> (nights a … b−1). A booking request takes the <strong>available room of that type with the smallest id</strong> (string order). Two bookings conflict only if their nights overlap (check-out day = next check-in day is fine). Booking ids are 1, 2, 3, … and are never reused.
Commands: <code>ROOM id TYPE priceCents</code>, <code>BOOK guest TYPE a b</code>, <code>CANCEL bookingId</code>, <code>OCCUPANCY day</code>.""",
  COMMON_IO,
  "<code>ROOM id</code>; <code>BOOKING n guest room id X.YY</code> (nights × price) or <code>NO AVAILABILITY TYPE</code> or <code>ERROR invalid dates</code> (a ≥ b); <code>CANCELLED n</code> / <code>ERROR no such booking</code>; <code>DAY d: ids…</code> (rooms occupied on night d, sorted) or <code>DAY d: none</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>", "0 ≤ a, b ≤ 10<sup>6</sup>"],
  [(script("ROOM 101 SINGLE 8000", "ROOM 102 SINGLE 9000", "BOOK ana SINGLE 1 4", "BOOK ben SINGLE 2 3", "BOOK chen SINGLE 3 5", "BOOK dee SINGLE 4 6", "OCCUPANCY 3", "CANCEL 2", "BOOK eve SINGLE 2 3"),
    "Ben checks out on day 3, so Chen can take room 102 from day 3 (check-out day = next check-in day is fine); Dee gets 101 because Ana checks out on day 4.")],
  [script("BOOK x SUITE 1 2", "CANCEL 1", "ROOM s1 SUITE 50000", "BOOK x SUITE 5 5", "BOOK x SUITE 5 6", "OCCUPANCY 5", "OCCUPANCY 6"), script("ROOM b DOUBLE 100", "ROOM a DOUBLE 200", "BOOK p DOUBLE 1 3", "BOOK q DOUBLE 1 3", "BOOK r DOUBLE 2 4", "CANCEL 1", "CANCEL 1", "BOOK r DOUBLE 2 4")], o18,
  oop={"design": ["<code>Room</code> { id, type, price; isFree(range) }", "<code>DateRange</code> value object { start, end; overlaps(other), nights() }", "<code>Booking</code> { id, guest, room, range }", "<code>Hotel</code> { rooms, bookings, nextId }"],
       "patterns": ["Value Object (DateRange)"], "principles": ["put the overlap rule in exactly one place"]})

# ---------------------------------------------------------------- O19
def o19(t):
    levels = ["DEBUG", "INFO", "WARN", "ERROR"]; handlers = []; res = []
    for line in lines(t)[1:]:
        p = line.split(" ", 2)
        if p[0] == "HANDLER": handlers.append((p[1], p[2])); res.append(f"HANDLER {p[1]} >= {p[2]}")
        elif p[0] == "LOG":
            lvl, msg = p[1], p[2] if len(p) > 2 else ""; got = [n for n, m in handlers if levels.index(lvl) >= levels.index(m)]
            if not got: res.append(f"DROPPED {lvl}")
            for n in got: res.append(f"{n} [{lvl}] {msg}")
    return out(*res)
P("O19", "Logger with Handler Chain", "oop", ["chain of responsibility", "interfaces"], ["Chain of Responsibility", "level filtering"],
  """Build a logger with an ordered chain of handlers. Each handler has a name and a minimum level (DEBUG &lt; INFO &lt; WARN &lt; ERROR) and writes every message at or above its level, then passes it on along the chain. A message that no handler accepts is dropped.
Commands: <code>HANDLER name MINLEVEL</code> (append to the chain), <code>LOG LEVEL message words…</code>.""",
  COMMON_IO,
  "<code>HANDLER name &gt;= LEVEL</code>; for LOG, one line <code>name [LEVEL] message</code> per accepting handler in chain order, or <code>DROPPED LEVEL</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>"],
  [(script("HANDLER console INFO", "HANDLER pager ERROR", "LOG DEBUG cache warmed", "LOG INFO started", "LOG ERROR disk full"), "DEBUG is below every handler's level; ERROR reaches both.")],
  [script("LOG ERROR nobody listens", "HANDLER all DEBUG", "LOG DEBUG x"), script("HANDLER w WARN", "HANDLER d DEBUG", "HANDLER e ERROR", "LOG WARN careful", "LOG INFO hi there")], o19,
  oop={"design": ["abstract <code>Handler</code> { next; minLevel; handle(msg) → write if accepted, then next.handle(msg) }", "<code>Level</code> enum with ordering", "<code>NamedHandler</code> writes the line"],
       "patterns": ["Chain of Responsibility"], "principles": ["adding a handler doesn't change the logger"]})

# ---------------------------------------------------------------- O20
def o20(t):
    users, res = {}, []; cap = refill = 0
    for c in cmds(t):
        if c[0] == "CONFIG": cap, refill = int(c[1]), int(c[2]); res.append(f"CONFIG capacity={cap} refill={refill}/s"); continue
        user, ts = c[1], int(c[2])
        tokens, last = users.get(user, (cap, ts))
        tokens = min(cap, tokens + (ts - last) * refill)
        if tokens >= 1: tokens -= 1; res.append(f"ALLOW {user} {ts} left={tokens}")
        else: res.append(f"DENY {user} {ts}")
        users[user] = (tokens, ts)
    return out(*res)
P("O20", "Rate Limiter (Token Bucket)", "oop", ["encapsulation", "strategy"], ["token bucket algorithm", "per-key state"],
  """Implement a per-user rate limiter with the token-bucket algorithm. Each user's bucket starts full with <code>capacity</code> tokens and gains <code>refill</code> tokens per second (whole seconds, capped at capacity) based on the time passed since that user's previous request. A request is allowed if at least one token is available (and consumes it).
Commands: <code>CONFIG capacity refillPerSecond</code> (always first), <code>REQ user timestamp</code> (timestamps in seconds, non-decreasing per user).""",
  COMMON_IO,
  "<code>CONFIG capacity=C refill=R/s</code>; <code>ALLOW user ts left=N</code> (tokens left after this request) or <code>DENY user ts</code>.",
  ["1 ≤ q ≤ 10<sup>5</sup>", "0 ≤ refill ≤ 10<sup>3</sup>", "1 ≤ capacity ≤ 10<sup>3</sup>"],
  [(script("CONFIG 2 1", "REQ ana 0", "REQ ana 0", "REQ ana 0", "REQ ben 0", "REQ ana 1", "REQ ana 5", "REQ ana 5"),
    "Ana's bucket empties at time 0; one second later the bucket holds 1 token; by time 5 the bucket is full (2) again. Ben has a separate bucket.")],
  [script("CONFIG 1 0", "REQ x 0", "REQ x 100"), script("CONFIG 3 2", "REQ u 10", "REQ u 10", "REQ u 10", "REQ u 10", "REQ u 11", "REQ u 11", "REQ u 11")], o20,
  oop={"design": ["<code>TokenBucket</code> { capacity, refillRate, tokens, lastTime; tryConsume(now) }", "<code>RateLimiter</code> { Map&lt;user, TokenBucket&gt;; allow(user, now) }", "interface <code>Clock</code> (injectable time — makes it testable)"],
       "patterns": ["Strategy (other algorithms: fixed window, sliding log)"], "principles": ["inject time instead of reading the system clock"]})

# ---------------------------------------------------------------- O21
def o21(t):
    res = []
    def moves(p, x, y):
        out_ = set()
        dirs = {"ROOK": [(1, 0), (-1, 0), (0, 1), (0, -1)], "BISHOP": [(1, 1), (1, -1), (-1, 1), (-1, -1)]}
        dirs["QUEEN"] = dirs["ROOK"] + dirs["BISHOP"]
        if p in dirs:
            for dx, dy in dirs[p]:
                a, b = x + dx, y + dy
                while 0 <= a < 8 and 0 <= b < 8: out_.add((a, b)); a += dx; b += dy
        elif p == "KNIGHT":
            out_ = {(x + dx, y + dy) for dx, dy in ((1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1)) if 0 <= x + dx < 8 and 0 <= y + dy < 8}
        elif p == "KING":
            out_ = {(x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and 0 <= x + dx < 8 and 0 <= y + dy < 8}
        return out_
    sq = lambda s: (ord(s[0]) - 97, int(s[1]) - 1)
    name = lambda a, b: f"{chr(a + 97)}{b + 1}"
    for c in cmds(t):
        if c[0] == "MOVES":
            ms = sorted(moves(c[1], *sq(c[2])), key=lambda m: (m[0], m[1]))
            res.append(f"{c[1]} {c[2]}: {len(ms)} " + " ".join(name(*m) for m in ms))
        else:
            res.append("VALID" if sq(c[3]) in moves(c[1], *sq(c[2])) else "INVALID")
    return out(*res)
P("O21", "Chess Piece Moves", "oop", ["polymorphism", "inheritance"], ["polymorphic movement rules", "code reuse for sliding pieces"],
  """On an empty 8 × 8 board (squares a1–h8), each piece type knows how it moves: KING (one square any direction), QUEEN (any distance in 8 directions), ROOK (straight lines), BISHOP (diagonals), KNIGHT (L-shape, jumps). Implement a <code>Piece</code> hierarchy where sliding pieces share one implementation parameterised by directions.
Commands: <code>MOVES PIECE square</code>, <code>CHECK PIECE from to</code>.""",
  COMMON_IO,
  "MOVES: <code>PIECE square: N s1 s2 …</code>, with squares sorted by file (a→h) then rank (1→8). CHECK: <code>VALID</code> or <code>INVALID</code> (moving to the same square is invalid).",
  ["1 ≤ q ≤ 1000"],
  [(script("MOVES KNIGHT b1", "MOVES KING a1", "CHECK BISHOP c1 h6", "CHECK ROOK a1 b2", "CHECK QUEEN d4 d4"), "A knight on b1 has three moves: a3, c3, d2.")],
  [script("MOVES ROOK d4", "MOVES BISHOP a1", "MOVES QUEEN h8"), script("MOVES KNIGHT d4", "MOVES KING e5", "CHECK KNIGHT g1 f3", "CHECK KING e1 e3", "CHECK BISHOP a1 h8")], o21,
  oop={"design": ["abstract <code>Piece</code> { abstract reachable(from): Set&lt;Square&gt;; canMove(from, to) }", "<code>SlidingPiece</code> (directions) → <code>Rook</code>, <code>Bishop</code>, <code>Queen</code>", "<code>StepPiece</code> (offsets) → <code>King</code>, <code>Knight</code>", "<code>Square</code> value object (file, rank)"],
       "patterns": ["Template Method", "Factory (piece by name)"], "principles": ["don't repeat movement code: parameterise it"]})

# ---------------------------------------------------------------- O22
def o22(t):
    res = []
    for c in cmds(t):
        if c[0] == "RANGE":
            a, b, s = int(c[1]), int(c[2]), int(c[3])
            if s == 0: res.append("ERROR zero step"); continue
            xs = list(range(a, b, s)); res.append(" ".join(map(str, xs)) if xs else "EMPTY")
        elif c[0] == "TAKE":
            a, s, n = int(c[1]), int(c[2]), int(c[3]); res.append(" ".join(str(a + i * s) for i in range(n)) if n else "EMPTY")
        elif c[0] == "ZIP":
            a, b = c[1].split(","), c[2].split(","); res.append(" ".join(f"{x}{y}" for x, y in zip(a, b)) if a and b else "EMPTY")
    return out(*res)
P("O22", "Custom Iterators", "oop", ["iterator pattern", "generics"], ["Iterator pattern", "lazy sequences"],
  """Write your own iterator classes (implementing your language's iterator protocol: <code>Iterable/Iterator</code>, <code>__iter__/__next__</code>, <code>[Symbol.iterator]</code>, C++ iterators, …) without building full lists first:
<ul><li><code>RangeIterator(start, stop, step)</code>: like Python's range — stop is exclusive; step may be negative; step 0 is an error.</li>
<li><code>CountIterator(start, step)</code>: infinite arithmetic sequence; <code>TAKE</code> pulls only the first n values.</li>
<li><code>ZipIterator(a, b)</code>: pairs elements of two iterators and stops at the shorter one.</li></ul>
Commands: <code>RANGE start stop step</code>, <code>TAKE start step n</code>, <code>ZIP a,b,c x,y</code> (two comma-separated lists).""",
  COMMON_IO,
  "Values separated by spaces (for ZIP, each pair is concatenated, e.g. <code>ax</code>), <code>EMPTY</code> if there are none, or <code>ERROR zero step</code>.",
  ["1 ≤ q ≤ 1000", "|numbers| ≤ 10<sup>6</sup>, at most 1000 values per line"],
  [(script("RANGE 0 10 3", "RANGE 5 0 -2", "RANGE 1 1 1", "TAKE 7 -3 4", "ZIP a,b,c 1,2"), "Ranges stop before the stop value; ZIP stops when the shorter list runs out.")],
  [script("RANGE 0 5 0", "TAKE 1 1 0", "ZIP x y"), script("RANGE -3 3 1", "RANGE 10 -10 -7", "TAKE 0 0 3", "ZIP p,q,r,s 1,2,3,4")], o22,
  oop={"design": ["<code>RangeIterator</code>, <code>CountIterator</code>, <code>ZipIterator&lt;A,B&gt;</code> implementing the language's iterator interface", "a generic <code>take(iterator, n)</code> helper"],
       "patterns": ["Iterator", "Decorator (Zip/Take wrap other iterators)"], "principles": ["laziness: no list is built for an infinite sequence"]})

# ---------------------------------------------------------------- O23
def o23(t):
    res = []; board = None; turn = "X"; over = False
    def winner():
        lines_ = [[(r, c) for c in range(3)] for r in range(3)] + [[(r, c) for r in range(3)] for c in range(3)] + [[(i, i) for i in range(3)], [(i, 2 - i) for i in range(3)]]
        for ln in lines_:
            v = {board[r][c] for r, c in ln}
            if len(v) == 1 and "." not in v: return v.pop()
        return None
    for c in cmds(t):
        if c[0] == "NEW": board = [["."] * 3 for _ in range(3)]; turn = "X"; over = False; res.append("NEW GAME X to move")
        elif c[0] == "MOVE":
            r, col = int(c[1]) - 1, int(c[2]) - 1
            if over: res.append("ERROR game over")
            elif not (0 <= r < 3 and 0 <= col < 3): res.append("ERROR out of range")
            elif board[r][col] != ".": res.append("ERROR occupied")
            else:
                board[r][col] = turn; w = winner()
                if w: res.append(f"{turn} WINS"); over = True
                elif all(x != "." for row in board for x in row): res.append("DRAW"); over = True
                else: turn = "O" if turn == "X" else "X"; res.append(f"OK {turn} to move")
        elif c[0] == "BOARD": res.extend("".join(row) for row in board)
    return out(*res)
P("O23", "Tic-Tac-Toe Engine", "oop", ["encapsulation", "game state"], ["state validation", "win detection"],
  """Implement a tic-tac-toe game engine (no AI): a <code>Board</code>, a <code>Game</code> that tracks whose turn it is and whether the game is over, and validation of every move. X always starts.
Commands: <code>NEW</code>, <code>MOVE row col</code> (1–3), <code>BOARD</code>.""",
  COMMON_IO,
  "<code>NEW GAME X to move</code>; MOVE prints <code>OK P to move</code> (the next player), <code>X WINS</code>/<code>O WINS</code>, <code>DRAW</code>, or <code>ERROR out of range</code> / <code>ERROR occupied</code> / <code>ERROR game over</code> (an invalid move doesn't change the turn). BOARD prints three lines using X, O and <code>.</code>.",
  ["1 ≤ q ≤ 1000", "the first command is always NEW"],
  [(script("NEW", "MOVE 1 1", "MOVE 2 2", "MOVE 1 2", "MOVE 1 1", "MOVE 3 3", "MOVE 1 3", "MOVE 3 1", "BOARD"), "X completes the top row with (1,3); the move after that is rejected because the game is over.")],
  [script("NEW", "MOVE 0 1", "MOVE 4 4", "BOARD"),
   script("NEW", "MOVE 1 1", "MOVE 1 2", "MOVE 1 3", "MOVE 2 2", "MOVE 2 1", "MOVE 2 3", "MOVE 3 2", "MOVE 3 1", "MOVE 3 3", "BOARD", "NEW", "MOVE 1 3", "MOVE 1 1", "MOVE 2 2", "MOVE 2 1", "MOVE 3 1")], o23,
  oop={"design": ["<code>Board</code> { cells; place(), isFull(), winner() }", "<code>Game</code> { board, currentPlayer, status; play(row, col) }", "<code>Player</code>/<code>Mark</code> enum", "<code>MoveResult</code> value or exceptions for invalid moves"],
       "patterns": [], "principles": ["the Board knows nothing about turns; the Game enforces the rules"]})

# ---------------------------------------------------------------- O24
def o24(t):
    res = []; prefs = {}
    fmt = {"EMAIL": lambda u, m: f"EMAIL to {u}@example.com: {m}", "SMS": lambda u, m: f"SMS to {u}: {m[:20]}" + ("…" if len(m) > 20 else ""), "PUSH": lambda u, m: f"PUSH to {u}: {m.upper()}"}
    for line in lines(t)[1:]:
        p = line.split(" ", 2)
        if p[0] == "PREFER":
            chans = p[2].split(",")
            bad = [c for c in chans if c not in fmt]
            if bad: res.append(f"ERROR unknown channel {bad[0]}")
            else: prefs[p[1]] = chans; res.append(f"PREFS {p[1]} {','.join(chans)}")
        elif p[0] == "NOTIFY":
            u, msg = p[1], p[2]; chans = prefs.get(u, ["EMAIL"])
            for c in chans: res.append(fmt[c](u, msg))
    return out(*res)
P("O24", "Notification Factory", "oop", ["factory", "interfaces"], ["Factory pattern", "polymorphic formatting"],
  """Send notifications through channels created by a factory from their names. Each channel class formats messages its own way:
<ul><li><code>EMAIL</code> → <code>EMAIL to user@example.com: message</code></li><li><code>SMS</code> → <code>SMS to user: …</code> keeping only the first 20 characters, plus <code>…</code> (U+2026) if it was cut</li><li><code>PUSH</code> → <code>PUSH to user: MESSAGE</code> in upper case</li></ul>
Users without preferences get EMAIL. Commands: <code>PREFER user CH1,CH2,…</code>, <code>NOTIFY user message words…</code>.""",
  COMMON_IO,
  "<code>PREFS user CH1,CH2</code> or <code>ERROR unknown channel NAME</code> (the first unknown one; the preferences stay unchanged). NOTIFY prints one line per preferred channel, in the preferred order.",
  ["1 ≤ q ≤ 10<sup>4</sup>", "messages are ASCII"],
  [(script("NOTIFY ana Your order shipped", "PREFER ben SMS,PUSH", "NOTIFY ben Your order o42 has shipped today", "PREFER ben FAX"), "Ben's SMS is cut to 20 characters; FAX isn't a known channel.")],
  [script("PREFER x PUSH,EMAIL,PUSH", "NOTIFY x hi"), script("PREFER y SMS", "NOTIFY y exactly twenty chars", "NOTIFY y twenty-one characters!")], o24,
  oop={"design": ["interface <code>Channel</code> { send(user, message): String }", "<code>EmailChannel</code>, <code>SmsChannel</code>, <code>PushChannel</code>", "<code>ChannelFactory.create(name)</code>", "<code>Notifier</code> { preferences; notify(user, msg) }"],
       "patterns": ["Factory", "Strategy"], "principles": ["adding a channel = one new class + one factory entry"]})

# ---------------------------------------------------------------- O25
def o25(t):
    floors_n = 0; cur = 1; direction = "IDLE"; reqs = set(); res = []
    for c in cmds(t):
        if c[0] == "BUILDING": floors_n = int(c[1]); cur = 1; res.append(f"ELEVATOR at 1 of {floors_n}")
        elif c[0] == "CALL":
            f = int(c[1])
            if not 1 <= f <= floors_n: res.append("ERROR invalid floor")
            elif f == cur: res.append(f"OPEN at {cur}")
            else: reqs.add(f); res.append(f"QUEUED {f}")
        elif c[0] == "STEP":
            for _ in range(int(c[1])):
                if not reqs: direction = "IDLE"; continue
                if direction == "IDLE": direction = "UP" if min(reqs, key=lambda f: (abs(f - cur), f)) > cur else "DOWN"
                if direction == "UP" and not any(f > cur for f in reqs): direction = "DOWN"
                elif direction == "DOWN" and not any(f < cur for f in reqs): direction = "UP"
                cur += 1 if direction == "UP" else -1
                if cur in reqs: reqs.discard(cur); res.append(f"OPEN at {cur}")
                if not reqs: direction = "IDLE"
            res.append(f"AT {cur} {direction}")
    return out(*res)
P("O25", "Elevator Controller", "oop", ["state machine", "encapsulation"], ["SCAN scheduling", "time-step simulation"],
  """Simulate one elevator in a building with floors 1…n, starting at floor 1 and IDLE. Requests are floors to stop at. Scheduling rule (SCAN): when idle and a request exists, head toward the nearest requested floor (ties → the lower floor). Keep moving in the current direction while requests remain in that direction, then reverse. Each step moves one floor; when it arrives at a requested floor, that request is served.
Commands: <code>BUILDING n</code> (always first), <code>CALL floor</code>, <code>STEP k</code> (simulate k steps; an idle elevator doesn't move).""",
  COMMON_IO,
  "<code>ELEVATOR at 1 of n</code>; CALL prints <code>QUEUED f</code>, <code>OPEN at f</code> (already there), or <code>ERROR invalid floor</code>; during STEP print <code>OPEN at f</code> whenever a request is served; after STEP print <code>AT floor UP|DOWN|IDLE</code>.",
  ["1 ≤ q ≤ 10<sup>4</sup>", "2 ≤ n ≤ 100", "1 ≤ k ≤ 1000"],
  [(script("BUILDING 10", "CALL 5", "CALL 3", "STEP 3", "CALL 2", "STEP 5", "CALL 9", "STEP 10"), "It heads up toward 3 (the nearest), continues up to 5, then reverses for 2.")],
  [script("BUILDING 5", "CALL 1", "CALL 6", "STEP 4"), script("BUILDING 20", "CALL 10", "STEP 4", "CALL 2", "CALL 12", "STEP 3", "STEP 20", "CALL 7", "CALL 7", "STEP 1")], o25,
  oop={"design": ["<code>Elevator</code> { floor, direction, requests (sorted set); step() }", "<code>Direction</code> enum", "<code>Scheduler</code> interface (SCAN is one implementation; try FCFS too)", "<code>Building</code> validates floors"],
       "patterns": ["Strategy (scheduling)", "State (direction)"], "principles": ["keep the movement rule separate from request bookkeeping"]})
