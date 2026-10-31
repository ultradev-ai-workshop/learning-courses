// Hand-written questions for the Python Study Book assessment.
// h(topic, difficulty, question, options, explanation, code?)
// Options starting with "*" are correct (the "*" is stripped).
// Template literals are used so apostrophes are safe; never write a dollar sign followed by "{" here.

export function addHandwritten(h) {
  // ---------------- Chapter 1: setup ----------------
  h('setup', 'easy', `Which command starts the interactive Python prompt (the REPL) on macOS or Linux?`,
    ['*python3', 'python3 --repl', 'pyrepl', 'python3 -c'],
    `Running the interpreter with no file name starts interactive mode with the >>> prompt.`);
  h('setup', 'easy', `In a script run as \`python3 greet.py Ana Ben\`, what is sys.argv[0]?`,
    ['*\'greet.py\'', '\'Ana\'', '\'python3\'', '[\'Ana\', \'Ben\']'],
    `sys.argv[0] is always the script name; the user's first argument is sys.argv[1].`);
  h('setup', 'easy', `What does the secondary prompt "..." in the REPL mean?`,
    ['*The current statement continues on more lines', 'The REPL is busy computing', 'An error occurred', 'Output was truncated'],
    `After a line ending in a colon (like an if statement) the REPL shows ... until you finish the block with an empty line.`);
  h('setup', 'medium', `You type \`x = 10\` and then \`x * 3\` in the REPL. What is shown?`,
    ['*Nothing for the first line, 30 for the second', '10 then 30', 'Nothing at all', '30 twice'],
    `The REPL echoes the value of expressions, but an assignment produces no output.`);
  h('setup', 'medium', `Which TWO things make \`./tool.py\` runnable directly on macOS/Linux? (select all)`,
    ['*A first line like #!/usr/bin/env python3', '*Execute permission via chmod +x tool.py', 'A main() function', 'An __init__.py file next to it'],
    `The shebang tells the OS which interpreter to use, and the execute bit allows running the file as a program.`);
  h('setup', 'easy', `What encoding does Python assume for .py source files by default?`,
    ['*UTF-8', 'ASCII', 'Latin-1', 'The system locale'],
    `Source files are UTF-8 unless a coding comment on line 1 or 2 says otherwise.`);
  h('setup', 'medium', `What does \`python3 -i script.py\` do?`,
    ['*Runs the script, then stays in the REPL so you can inspect variables', 'Installs the script', 'Runs the script with input disabled', 'Checks the script for syntax errors only'],
    `-i means "inspect interactively after running".`);
  h('setup', 'medium', `When does the file named by PYTHONSTARTUP run?`,
    ['*At the start of every interactive (REPL) session', 'Before every script', 'Only when pip runs', 'When a module is first imported'],
    `PYTHONSTARTUP is read only for interactive sessions; scripts ignore it.`);
  h('setup', 'hard', `In the REPL, after \`19.99 * 3\` echoes 59.97, what does \`_ + 5\` give?`,
    ['*64.97', 'NameError', '5', '59.975'],
    `In interactive mode, _ holds the last echoed result. It does not exist in scripts.`);
  h('setup', 'easy', `Which line raises an error in Python 3?`,
    ['*print "hi"', 'print("hi")', 'print("hi", "there")', 'print()'],
    `print is a function in Python 3; the Python 2 statement form is a SyntaxError.`);
  h('setup', 'medium', `\`python3 add.py 2 3\` runs \`print(sys.argv[1] + sys.argv[2])\`. What is printed?`,
    ['*23', '5', '2 3', 'TypeError'],
    `Command-line arguments are strings, so + concatenates them. Convert with int() first.`);
  h('setup', 'hard', `Why does reading a traceback from the bottom usually help most?`,
    ['*The last line names the exception type and message', 'The bottom shows the first line of the file', 'Python prints tracebacks in random order', 'The top line is always the cause'],
    `The final line states what went wrong; the lines above show the chain of calls that led there.`);

  // ---------------- Chapter 2: basics ----------------
  h('basics', 'easy', `What is the type of \`8 / 4\`?`,
    ['*float', 'int', 'Decimal', 'complex'],
    `True division with / always returns a float, here 2.0.`);
  h('basics', 'easy', `Which expression gives Java-style integer division of 17 by 5 (result 3)?`,
    ['*17 // 5', '17 / 5', '17 % 5', 'int / 17 5'],
    `// is floor division; for positive numbers it matches Java's int division.`);
  h('basics', 'medium', `Why is \`0.1 + 0.2 == 0.3\` False?`,
    ['*0.1 and 0.2 cannot be stored exactly in binary floating point', 'Python rounds 0.3 down', '== compares identity for floats', 'Python floats have only 1 decimal of precision'],
    `Decimal fractions like 0.1 have no exact binary representation, so tiny errors appear. Use math.isclose.`);
  h('basics', 'easy', `What happens on \`word = "Python"; word[0] = "J"\`?`,
    ['*TypeError: strings are immutable', 'word becomes "Jython"', 'IndexError', 'A new variable word[0] is created'],
    `Strings cannot be changed in place; build a new one like "J" + word[1:].`);
  h('basics', 'medium', `What does \`"Python"[4:42]\` return?`,
    ['*\'on\'', 'IndexError', '\'\'', '\'Python\''],
    `Slices clamp out-of-range indexes silently; only single-index access raises IndexError.`);
  h('basics', 'medium', `After \`a = [1, 2]; b = a; b.append(3)\`, what is a?`,
    ['*[1, 2, 3]', '[1, 2]', '[3]', 'Error: a is read-only'],
    `b = a makes a second name for the same list, so changes through b are visible through a.`);
  h('basics', 'easy', `Which creates an independent (shallow) copy of a list \`lst\`? (select all)`,
    ['*lst[:]', '*lst.copy()', '*list(lst)', 'copy = lst'],
    `Slicing, .copy() and list() all build a new list; plain assignment only adds a name.`);
  h('basics', 'medium', `What does \`print(r"C:\\notes")\` print?`,
    ['*C:\\notes', 'C: followed by a newline and otes', 'C:notes', 'SyntaxError'],
    `A raw string keeps backslashes literally, so \\n is not turned into a newline.`);
  h('basics', 'hard', `What does \`a, b = 0, 1\` followed by \`a, b = b, a + b\` (run twice) leave in a and b?`,
    ['*a = 1, b = 2', 'a = 1, b = 1', 'a = 2, b = 3', 'a = 0, b = 1'],
    `The right side is computed first each time: (1, 1) then (1, 2).`);
  h('basics', 'easy', `Which of these is NOT a separate type in Python?`,
    ['*char', 'str', 'int', 'float'],
    `A single character is just a str of length 1.`);
  h('basics', 'medium', `What does \`print("a", "b", sep="-", end="!")\` output?`,
    ['*a-b!', 'a b!', 'a-b-!', 'a-b\\n!'],
    `sep replaces the space between items and end replaces the final newline.`);
  h('basics', 'hard', `What is \`int(-3.7)\` compared with \`-7 // 2\`?`,
    ['*-3 and -4', '-4 and -4', '-3 and -3', '-4 and -3'],
    `int() truncates toward zero; // floors toward minus infinity.`);

  // ---------------- Chapter 3: control ----------------
  h('control', 'easy', `How do you write "else if" in Python?`,
    ['*elif', 'else if', 'elseif', 'elsif'],
    `Python uses the keyword elif.`);
  h('control', 'easy', `Which is Python's version of \`cond ? a : b\`?`,
    ['*a if cond else b', 'cond ? a : b', 'if cond then a else b', 'cond and a or else b'],
    `The conditional expression reads value_if_true if condition else value_if_false.`);
  h('control', 'medium', `When does the else block of a for loop run?`,
    ['*When the loop finishes without hitting break', 'Only when the iterable is empty', 'When an exception occurs', 'After every iteration'],
    `Think of it as "no break": it runs after normal completion, including zero iterations.`);
  h('control', 'medium', `What is wrong with removing items from a list while looping over the same list?`,
    ['*Items can be skipped because indexes shift', 'Python forbids it with a SyntaxError', 'It always raises RuntimeError', 'Nothing, it is the recommended way'],
    `The loop's internal position moves on while remaining items shift left. Build a new list instead.`);
  h('control', 'easy', `What does \`pass\` do?`,
    ['*Nothing; it is a placeholder statement', 'Skips to the next loop iteration', 'Exits the function', 'Ignores the next exception'],
    `pass is needed where syntax requires a statement but no action is wanted.`);
  h('control', 'medium', `Which statement leaves only the innermost loop?`,
    ['*break', 'continue', 'return', 'pass'],
    `break exits the nearest enclosing for/while loop.`);
  h('control', 'easy', `Does \`range(10)\` build a list of ten numbers in memory?`,
    ['*No, it produces numbers lazily on demand', 'Yes, always', 'Only inside a for loop', 'Only for small ranges'],
    `A range object computes values when asked; list(range(10)) makes an actual list.`);
  h('control', 'hard', `Which of these leave a loop WITHOUT running its else clause? (select all)`,
    ['*break', '*return (inside a function)', '*an uncaught exception', 'continue'],
    `continue doesn't end the loop, so the else still runs at normal completion.`);
  h('control', 'medium', `What is the Pythonic way to get both index and item in a loop?`,
    ['*for i, x in enumerate(items):', 'for (i = 0; i < len(items); i++):', 'for i in items.index():', 'for x, i in items:'],
    `enumerate yields (index, item) pairs.`);
  h('control', 'easy', `Which value is truthy?`,
    ['*"0"', '0', '[]', 'None'],
    `Any non-empty string is true, even "0".`);
  h('control', 'hard', `What does this print?`,
    ['*3', '2', '0', 'Nothing'],
    `The loop increments n until it equals 3, then break leaves the loop; the print after the loop shows 3.`,
    `n = 0\nwhile True:\n    n += 1\n    if n == 3:\n        break\nprint(n)`);
  h('control', 'medium', `Which loop prints 5, 4, 3?`,
    ['*for i in range(5, 2, -1): print(i)', 'for i in range(5, 3, -1): print(i)', 'for i in range(3, 6): print(i)', 'for i in range(5, 2): print(i)'],
    `The stop value is excluded, so stopping at 2 keeps 3. A negative step counts down.`);

  // ---------------- Chapter 4: match ----------------
  h('match', 'easy', `In a match statement, what does \`case _:\` do?`,
    ['*Matches anything (the default case)', 'Matches only None', 'Matches an empty string', 'Captures into a variable named _'],
    `_ is the wildcard: it always matches and binds nothing.`);
  h('match', 'medium', `Why is \`case QUIT:\` (with QUIT = "q" defined earlier) a bug?`,
    ['*A bare name is a capture pattern, so it matches everything', 'Constants are not allowed in Python', 'It compares by identity instead of equality', 'match only works with numbers'],
    `Bare names capture; use a literal or a dotted name like Keys.QUIT to compare.`);
  h('match', 'medium', `Does \`case [a, b]:\` match the string "hi"?`,
    ['*No, strings are not treated as sequences by match', 'Yes, with a = "h" and b = "i"', 'Only if the string has two characters', 'It raises TypeError'],
    `str, bytes and bytearray are deliberately excluded from sequence patterns.`);
  h('match', 'easy', `Does a match statement fall through to the next case after one matches?`,
    ['*No, only the first matching case runs', 'Yes, unless you write break', 'Yes, always', 'Only for literal patterns'],
    `There is no fall-through and no break in match.`);
  h('match', 'medium', `Which subjects does \`case {"type": "expense", "amount": a}:\` match? (select all)`,
    ['*{"type": "expense", "amount": 5}', '*{"type": "expense", "amount": 5, "id": 1}', '{"type": "income", "amount": 5}', '["type", "expense"]'],
    `Mapping patterns need at least the listed keys with matching values; extra keys are allowed.`);
  h('match', 'medium', `What type is \`rest\` after \`case [first, *rest]:\` matches (1, 2, 3)?`,
    ['*list', 'tuple', 'the same type as the subject', 'generator'],
    `Star captures in sequence patterns always produce a list.`);
  h('match', 'hard', `What is the problem with \`case int:\`?`,
    ['*It is a capture named int that matches everything', 'It is a SyntaxError', 'It matches only the int class itself', 'Nothing, it checks the type'],
    `Use case int(): to check the type; a bare name captures.`);
  h('match', 'easy', `What does \`|\` mean inside a case pattern?`,
    ['*Either pattern may match (alternatives)', 'Bitwise or', 'Pipe the value into the next case', 'Both patterns must match'],
    `case 401 | 403 | 404: matches any of the three values.`);
  h('match', 'medium', `What is a guard in a case clause?`,
    ['*An if condition after the pattern that must also be true', 'A try/except around the case', 'A type annotation', 'The wildcard case'],
    `case (x, y) if x == y: matches only when the pattern fits AND the condition holds.`);
  h('match', 'hard', `What does \`case ["go", ("north" | "south") as d]:\` bind for "go south".split()?`,
    ['*d = "south"', 'd = ("north", "south")', 'd = ["go", "south"]', 'Nothing; as is not allowed here'],
    `as binds the value matched by the sub-pattern to a name.`);
  h('match', 'medium', `Why do dataclasses support positional class patterns like \`case Point(0, y):\`?`,
    ['*They define __match_args__ automatically', 'All classes support positional patterns', 'Dataclasses are tuples', 'Because of __init__ alone'],
    `__match_args__ tells match which attributes positional sub-patterns refer to.`);
  h('match', 'easy', `If no case matches and there is no wildcard, what happens?`,
    ['*Nothing; execution continues after the match', 'MatchError is raised', 'ValueError is raised', 'The last case runs'],
    `An unmatched match statement simply does nothing.`);

  // ---------------- Chapter 5: functions ----------------
  h('functions', 'easy', `What does a function without a return statement return?`,
    ['*None', '0', 'An empty string', 'It raises an error'],
    `Falling off the end of a function returns None.`);
  h('functions', 'medium', `When are default argument values evaluated?`,
    ['*Once, when the def statement runs', 'On every call', 'Only when the argument is missing', 'At import time of the caller'],
    `That is why a mutable default like [] is shared between calls.`);
  h('functions', 'easy', `What is the recommended default for an optional list parameter?`,
    ['*None, then create the list inside the function', '[]', 'list', '()'],
    `def f(x, items=None): if items is None: items = [] avoids the shared mutable default.`);
  h('functions', 'medium', `In \`def f(a, /, b, *, c):\`, which parameter can ONLY be passed by keyword?`,
    ['*c', 'a', 'b', 'all of them'],
    `Parameters after * are keyword-only; parameters before / are positional-only.`);
  h('functions', 'medium', `What type does \`*args\` collect extra positional arguments into?`,
    ['*tuple', 'list', 'dict', 'set'],
    `*args is a tuple; **kwargs is a dict.`);
  h('functions', 'easy', `Which call spreads the list nums = [3, 6] into range(3, 6)?`,
    ['*range(*nums)', 'range(**nums)', 'range(nums)', 'range(&nums)'],
    `* at the call site unpacks a sequence into positional arguments.`);
  h('functions', 'medium', `What can a lambda body contain?`,
    ['*A single expression', 'Any number of statements', 'Only a return statement', 'A block with if/else statements'],
    `lambda params: expression; statements are not allowed.`);
  h('functions', 'hard', `What does \`[f() for f in [lambda: i for i in range(3)]]\` give?`,
    ['*[2, 2, 2]', '[0, 1, 2]', '[0, 0, 0]', 'NameError'],
    `Each lambda looks up i when called, after the loop finished with i == 2.`);
  h('functions', 'easy', `Are type hints like \`def f(x: int)\` checked by Python at run time?`,
    ['*No, they are not enforced', 'Yes, a TypeError is raised for wrong types', 'Only in the REPL', 'Only for built-in types'],
    `Tools such as mypy use them; the interpreter ignores them when calling.`);
  h('functions', 'medium', `Which names follow PEP 8? (select all)`,
    ['*calculate_total (a function)', '*ExpenseReport (a class)', '*MAX_ITEMS (a constant)', 'calculateTotal (a function)'],
    `snake_case for functions and variables, CamelCase for classes, UPPER_CASE for constants.`);
  h('functions', 'hard', `Which parameter order is valid?`,
    ['*def f(a, /, b, *args, c, **kwargs)', 'def f(**kwargs, *args)', 'def f(*args, a, /)', 'def f(a=1, b)'],
    `Order: positional-only, /, normal, *args, keyword-only, **kwargs. A parameter without a default can't follow one with a default (unless keyword-only).`);
  h('functions', 'medium', `Why does \`parrot(110, voltage=220)\` fail for \`def parrot(voltage, state="a stiff")\`?`,
    ['*voltage receives two values', 'Keyword arguments must come first', '220 is too large', 'state is missing'],
    `110 already fills voltage positionally, so voltage=220 is a duplicate.`);

  // ---------------- Chapter 6: lists ----------------
  h('lists', 'easy', `What does \`nums.sort()\` return?`,
    ['*None', 'The sorted list', 'A new sorted copy', 'True'],
    `In-place methods return None; use sorted(nums) for a new list.`);
  h('lists', 'easy', `Which structure is best for a FIFO queue?`,
    ['*collections.deque with append/popleft', 'list with insert(0)/pop()', 'list with pop(0)', 'set'],
    `deque is fast at both ends; list.pop(0) shifts every element.`);
  h('lists', 'medium', `What is the difference between append([3, 4]) and extend([3, 4]) on [1, 2]?`,
    ['*[1, 2, [3, 4]] vs [1, 2, 3, 4]', '[1, 2, 3, 4] vs [1, 2, [3, 4]]', 'They are identical', 'append raises TypeError'],
    `append adds one object; extend adds each item of the iterable.`);
  h('lists', 'medium', `Where does a filter condition go in a list comprehension?`,
    ['*At the end: [x for x in xs if x > 0]', 'At the start: [if x > 0 x for x in xs]', 'Before for: [x if x > 0 for x in xs]', 'Inside the brackets of range'],
    `A trailing if filters; an if/else before for chooses a value per item.`);
  h('lists', 'hard', `What does \`[[0] * 2] * 2\` followed by \`grid[0][0] = 9\` produce?`,
    ['*[[9, 0], [9, 0]]', '[[9, 0], [0, 0]]', '[[9, 9], [9, 9]]', 'TypeError'],
    `The outer * repeats a reference to the same inner list.`);
  h('lists', 'medium', `Which line flattens \`xss = [[1, 2], [3]]\` into [1, 2, 3]? (select all)`,
    ['*[*xs for xs in xss]   (Python 3.15)', '*[x for xs in xss for x in xs]', '[xs for xs in xss]', '[*xss]'],
    `3.15 allows * unpacking inside comprehensions; the double-for form works everywhere. [*xss] only copies the outer list.`);
  h('lists', 'easy', `What does \`del a[1:3]\` do?`,
    ['*Removes the items at indexes 1 and 2', 'Removes items 1 to 3 inclusive', 'Deletes the variable a', 'Returns the removed items'],
    `del with a slice removes that range; the stop index is excluded.`);
  h('lists', 'medium', `What does \`lst.remove(x)\` do if x appears twice?`,
    ['*Removes only the first occurrence', 'Removes both', 'Raises ValueError', 'Removes the last occurrence'],
    `remove deletes the first matching item and raises ValueError if none.`);
  h('lists', 'medium', `What does \`sorted(["b", "A", "c"])\` return?`,
    ['*[\'A\', \'b\', \'c\']', '[\'b\', \'A\', \'c\']', '[\'c\', \'b\', \'A\']', '[\'A\', \'c\', \'b\']'],
    `Uppercase letters have smaller code points than lowercase ones.`);
  h('lists', 'hard', `What does \`sorted(["bb", "a", "cc", "d"], key=len)\` return?`,
    ['*[\'a\', \'d\', \'bb\', \'cc\']', '[\'a\', \'bb\', \'cc\', \'d\']', '[\'d\', \'a\', \'cc\', \'bb\']', '[\'a\', \'d\', \'cc\', \'bb\']'],
    `Sorting by length is stable, so items with equal length keep their original order.`);
  h('lists', 'easy', `What does \`stack.pop()\` remove from a list used as a stack?`,
    ['*The last item', 'The first item', 'A random item', 'The smallest item'],
    `append pushes to the end and pop() takes from the end: last in, first out.`);
  h('lists', 'medium', `What is \`[0, *range(3), 9]\`?`,
    ['*[0, 0, 1, 2, 9]', '[0, range(0, 3), 9]', '[0, 3, 9]', 'SyntaxError'],
    `* unpacks any iterable into the list display.`);

  // ---------------- Chapter 7: collections ----------------
  h('collections', 'easy', `What does \`{}\` create?`,
    ['*An empty dict', 'An empty set', 'An empty tuple', 'A SyntaxError'],
    `Use set() for an empty set.`);
  h('collections', 'easy', `Which makes a one-item tuple?`,
    ['*(5,)', '(5)', '[5]', 'tuple 5'],
    `The trailing comma makes the tuple; parentheses alone just group.`);
  h('collections', 'medium', `What does \`d.get("x", 0)\` return when "x" is missing?`,
    ['*0', 'None', 'KeyError', 'False'],
    `get returns the given default instead of raising KeyError.`);
  h('collections', 'medium', `Which can be a dict key? (select all)`,
    ['*"food"', '*(1, 2)', '*frozenset({1})', '[1, 2]'],
    `Keys must be hashable; lists are mutable and unhashable.`);
  h('collections', 'easy', `Do dicts remember insertion order in modern Python?`,
    ['*Yes, since Python 3.7', 'No, order is random', 'Only for string keys', 'Only when sorted'],
    `Iteration follows insertion order.`);
  h('collections', 'medium', `What does \`zip("abc", [1, 2])\` produce as a list?`,
    ['*[(\'a\', 1), (\'b\', 2)]', '[(\'a\', 1), (\'b\', 2), (\'c\', None)]', 'ValueError', '[(\'a\', \'b\', \'c\'), (1, 2)]'],
    `zip stops at the shortest input; pass strict=True to get an error instead.`);
  h('collections', 'medium', `What does \`"" or "default"\` evaluate to?`,
    ['*\'default\'', 'True', '\'\'', 'False'],
    `or returns the first truthy operand, or the last one.`);
  h('collections', 'hard', `What does \`1 < 3 > 2 == 2\` evaluate to?`,
    ['*True', 'False', 'TypeError', '2'],
    `Chained comparisons mean 1 < 3 and 3 > 2 and 2 == 2.`);
  h('collections', 'medium', `Which is True?`,
    ['*(1, 2, 3) < (1, 2, 4)', '(1, 3) < (1, 2, 4)', '[2] < [1, 9]', '"b" < "a"'],
    `Sequences compare item by item; the first difference decides.`);
  h('collections', 'medium', `What does \`list(dict.fromkeys(["b", "a", "b"]))\` return?`,
    ['*[\'b\', \'a\']', '[\'a\', \'b\']', '[\'b\', \'a\', \'b\']', '{\'b\', \'a\'}'],
    `dict.fromkeys keeps the first-seen order while removing duplicates.`);
  h('collections', 'hard', `What is new in Python 3.15 about frozendict?`,
    ['*It is a built-in immutable, hashable dict type', 'It replaces dict', 'It is a module in collections', 'It sorts its keys'],
    `PEP 814 added the frozendict built-in.`);
  h('collections', 'easy', `What does \`:=\` do?`,
    ['*Assigns a value inside an expression', 'Compares for identity', 'Declares a constant', 'Swaps two variables'],
    `The walrus operator lets you test and keep a value at once, e.g. if (n := len(xs)) > 4:.`);

  // ---------------- Chapter 8: modules ----------------
  h('modules', 'easy', `What is a module in Python?`,
    ['*A .py file whose top-level names can be imported', 'A compiled .class file', 'A folder of files', 'A function decorator'],
    `The module name is the file name without .py.`);
  h('modules', 'medium', `What is \`__name__\` inside a file that is run directly with python3 file.py?`,
    ['*"__main__"', '"file"', '"file.py"', 'None'],
    `Imported modules get their own name; the script being run is "__main__".`);
  h('modules', 'medium', `How many times does a module's top-level code run if it is imported three times in one program?`,
    ['*Once', 'Three times', 'Zero times', 'Once per importing file'],
    `Imported modules are cached in sys.modules.`);
  h('modules', 'medium', `Your file is named random.py and does import random. What goes wrong?`,
    ['*It imports itself instead of the standard library module', 'Python refuses to run it', 'Nothing', 'The standard module is renamed'],
    `The script's folder comes first in sys.path, shadowing the stdlib module.`);
  h('modules', 'easy', `What marks a regular folder as a package?`,
    ['*An __init__.py file', 'A package.json file', 'A setup.cfg file', 'A __main__ function'],
    `__init__.py runs when the package is first imported.`);
  h('modules', 'hard', `Why does \`python3 shop/cart.py\` fail with "attempted relative import with no known parent package"?`,
    ['*Running by path makes the file __main__ outside any package', 'Relative imports are not allowed in Python 3', 'cart.py has a syntax error', 'The shop folder lacks a .pyc file'],
    `Run it as a module from the parent folder: python3 -m shop.cart.`);
  h('modules', 'medium', `What does \`__all__\` control?`,
    ['*Which names from module import * gives you', 'Which names are private', 'The import order', 'Which submodules load automatically'],
    `__all__ lists the public names for star imports.`);
  h('modules', 'medium', `What are .pyc files in __pycache__?`,
    ['*Cached compiled bytecode for faster loading', 'Encrypted source code', 'Backups of edited files', 'Compiled machine code that runs faster'],
    `They load faster but don't run faster; Python regenerates them when sources change.`);
  h('modules', 'hard', `Which statements about \`lazy import json\` (Python 3.15) are true? (select all)`,
    ['*json is loaded the first time the name is used', '*It is only allowed at module top level', 'It is allowed inside functions', 'lazy from os import * is allowed'],
    `PEP 810 lazy imports are top-level only, and star imports can't be lazy.`);
  h('modules', 'easy', `What does \`dir(module)\` return?`,
    ['*A list of names defined in the module', 'The module file path', 'The module source code', 'The directory the module lives in'],
    `dir() lists attributes; with no argument it lists the current scope's names.`);
  h('modules', 'medium', `Where does pip install third-party packages?`,
    ['*site-packages', '__pycache__', 'the current folder', 'builtins'],
    `site-packages is on sys.path after the standard library.`);
  h('modules', 'easy', `Which import form is generally discouraged in real code?`,
    ['*from module import *', 'import module', 'from module import name', 'import module as alias'],
    `Star imports hide where names come from and can shadow other names.`);

  // ---------------- Chapter 9: io ----------------
  h('io', 'easy', `Which file mode empties an existing file when it is opened?`,
    ['*"w"', '"a"', '"r"', '"x"'],
    `Write mode truncates immediately; append mode adds to the end.`);
  h('io', 'easy', `Why use \`with open(...) as f:\`?`,
    ['*The file is closed automatically, even on errors', 'It makes reading faster', 'It is required for text files', 'It locks the file for other programs'],
    `with guarantees clean-up when the block ends.`);
  h('io', 'medium', `What does \`f.write("x")\` add to the file?`,
    ['*Exactly "x" with no newline', '"x" plus a newline', '"x" plus a space', 'Nothing until close'],
    `write writes exactly the string; print(..., file=f) adds a newline.`);
  h('io', 'medium', `What does \`f"{3.14159:.2f}"\` produce?`,
    ['*\'3.14\'', '\'3.1\'', '\'3.15\'', '\'3.14159\''],
    `.2f means fixed-point with two decimals.`);
  h('io', 'medium', `What does \`f"{count=}"\` print for count = 13?`,
    ['*count=13', '13', 'count', '{count=13}'],
    `The = specifier shows the expression text and its value.`);
  h('io', 'hard', `After \`json.loads(json.dumps({1: (2, 3)}))\`, what do you get?`,
    ['*{\'1\': [2, 3]}', '{1: (2, 3)}', '{\'1\': (2, 3)}', '{1: [2, 3]}'],
    `JSON keys are always strings and arrays come back as lists.`);
  h('io', 'easy', `Which function reads JSON from an open file object?`,
    ['*json.load(f)', 'json.loads(f)', 'json.read(f)', 'f.json()'],
    `load/dump work with files; loads/dumps work with strings.`);
  h('io', 'medium', `What is the difference between str(x) and repr(x) for x = "hi"?`,
    ['*\'hi\' vs "\'hi\'": repr adds quotes', 'They are always identical', 'repr removes quotes', 'str raises for strings'],
    `repr is the developer view, showing the quotes around strings.`);
  h('io', 'hard', `What does a t-string like t"Hi {name}" produce (Python 3.14+)?`,
    ['*A Template object keeping text parts and values separate', 'A str, like an f-string', 'A bytes object', 'A compiled regex'],
    `PEP 750 template strings let libraries process the interpolated values safely.`);
  h('io', 'medium', `What does \`f.read()\` return at the end of a file?`,
    ['*An empty string', 'None', 'EOFError', '-1'],
    `Reading past the end returns "".`);
  h('io', 'hard', `Why can loading a pickle from an untrusted source be dangerous?`,
    ['*Unpickling can execute arbitrary code', 'Pickles are always corrupted', 'It deletes the file', 'It only works on Windows'],
    `Use JSON for data from outside your program.`);
  h('io', 'medium', `Which format spec right-aligns text in a field of width 8?`,
    ['*:>8', ':<8', ':^8', ':8<'],
    `> aligns right, < left, ^ centre.`);

  // ---------------- Chapter 10: exceptions ----------------
  h('exceptions', 'easy', `Which keyword throws an exception in Python?`,
    ['*raise', 'throw', 'except', 'error'],
    `raise ValueError("message") throws.`);
  h('exceptions', 'easy', `When does a finally block run?`,
    ['*Always, whether or not an exception happened', 'Only when an exception happened', 'Only when no exception happened', 'Only when the function returns'],
    `finally runs on every way out of the try statement.`);
  h('exceptions', 'medium', `When does the else block of a try statement run?`,
    ['*Only when the try block raised no exception', 'Only after an exception was handled', 'Always', 'Only if finally is missing'],
    `else holds code that should run only on success.`);
  h('exceptions', 'medium', `Why avoid a bare \`except:\`?`,
    ['*It also catches KeyboardInterrupt and SystemExit and hides bugs', 'It is a SyntaxError', 'It only catches ValueError', 'It makes code slower'],
    `Catch the specific exceptions you expect, or at most Exception.`);
  h('exceptions', 'medium', `What does \`raise ConfigError("bad") from exc\` do?`,
    ['*Raises ConfigError with exc recorded as its __cause__', 'Ignores exc', 'Raises exc instead', 'Converts exc into a warning'],
    `Explicit chaining keeps the original error visible.`);
  h('exceptions', 'hard', `Which statements about except* are true? (select all)`,
    ['*It handles exceptions inside an ExceptionGroup', '*Several except* clauses can run for one group', 'It catches every exception type at once', 'It can be mixed with plain except in the same try'],
    `except* splits a group by type; plain except and except* can't be mixed in one try.`);
  h('exceptions', 'medium', `Which base class should your own exception classes inherit from?`,
    ['*Exception', 'BaseException', 'object', 'Error'],
    `BaseException is reserved for system-exiting exceptions like KeyboardInterrupt.`);
  h('exceptions', 'hard', `What does Python 3.14+ do about \`return\` inside a finally block?`,
    ['*Emits a SyntaxWarning (PEP 765)', 'Raises SyntaxError', 'Silently allows it', 'Ignores the return'],
    `return in finally can swallow exceptions, so Python now warns.`);
  h('exceptions', 'easy', `What does EAFP stand for?`,
    ['*Easier to Ask Forgiveness than Permission', 'Every Action Fails Politely', 'Exceptions Are For Programmers', 'Early Assert, Fail Proud'],
    `Try the operation and handle the failure instead of checking everything first.`);
  h('exceptions', 'medium', `What does \`err.add_note("while loading")\` do?`,
    ['*Attaches extra text that is shown in the traceback', 'Changes the exception message', 'Logs the error to a file', 'Suppresses the exception'],
    `Notes are stored in err.__notes__ and printed below the message.`);
  h('exceptions', 'medium', `Which form is valid in Python 3.14+ to catch two types without as?`,
    ['*except ValueError, TypeError:', 'except ValueError or TypeError:', 'except [ValueError, TypeError]:', 'except ValueError | TypeError as e, f:'],
    `PEP 758 allows dropping the parentheses when no as clause is used.`);
  h('exceptions', 'hard', `KeyError and IndexError share which base class?`,
    ['*LookupError', 'ValueError', 'ArithmeticError', 'OSError'],
    `except LookupError catches both.`);

  // ---------------- Chapter 11: classes ----------------
  h('classes', 'easy', `What is \`self\` in a method?`,
    ['*The instance the method was called on', 'The class itself', 'A keyword like this that is optional', 'The module'],
    `obj.method() passes obj as the first parameter, named self by convention.`);
  h('classes', 'easy', `Which method initialises a new instance?`,
    ['*__init__', '__new__ only', 'constructor', '__create__'],
    `__init__ is called right after the object is created.`);
  h('classes', 'medium', `What is the LEGB order for name lookup?`,
    ['*Local, Enclosing, Global, Built-in', 'Local, External, Global, Base', 'Lexical, Enclosing, Global, Block', 'Global, Local, Enclosing, Built-in'],
    `Python searches those four scopes in that order.`);
  h('classes', 'medium', `Why does \`count += 1\` inside a function raise UnboundLocalError when count is a global?`,
    ['*Assigning makes count local, and it is read before assignment', 'Globals are read-only', 'count must be declared with var', '+= is not allowed on globals'],
    `Use global count, or better, return the new value.`);
  h('classes', 'hard', `What does \`nonlocal x\` do?`,
    ['*Makes x refer to the nearest enclosing function\'s variable', 'Makes x global', 'Deletes x', 'Makes x a class variable'],
    `nonlocal rebinds a variable of an enclosing (non-global) function scope.`);
  h('classes', 'medium', `Why is \`tricks = []\` as a class variable a bug for per-dog tricks?`,
    ['*All instances share the same list', 'Class variables cannot be lists', 'It raises AttributeError', 'Lists are copied on every access'],
    `Create self.tricks = [] in __init__.`);
  h('classes', 'medium', `What does name mangling turn \`self.__secret\` in class Vault into?`,
    ['*self._Vault__secret', 'self.secret', 'self._secret', 'a truly private attribute'],
    `Double-underscore names are renamed to avoid clashes in subclasses.`);
  h('classes', 'medium', `Which methods does @dataclass generate by default? (select all)`,
    ['*__init__', '*__repr__', '*__eq__', '__hash__ for mutable classes'],
    `With eq=True and not frozen, __hash__ is set to None.`);
  h('classes', 'hard', `If you define __eq__ but not __hash__, what happens?`,
    ['*Instances become unhashable (__hash__ is None)', 'Hashing uses id() as before', 'Python raises at class creation', '__hash__ is generated from __eq__'],
    `Equal objects must hash equally, so Python disables the default hash.`);
  h('classes', 'easy', `How do you check whether obj is an instance of Base or any subclass?`,
    ['*isinstance(obj, Base)', 'type(obj) == Base', 'obj is Base', 'Base in obj'],
    `isinstance respects inheritance; comparing types does not.`);
  h('classes', 'medium', `What does super().__init__(...) do in a subclass __init__?`,
    ['*Calls the next class\'s __init__ in the MRO', 'Creates a new parent object', 'Calls __init__ of object only', 'Copies the parent\'s attributes'],
    `super() follows the method resolution order.`);
  h('classes', 'hard', `Which decorator creates an alternative constructor that receives the class?`,
    ['*@classmethod', '@staticmethod', '@property', '@dataclass'],
    `A classmethod gets cls as its first argument, e.g. Expense.from_dict(data).`);

  // ---------------- Chapter 12: iterators ----------------
  h('iterators', 'easy', `Which exception signals that an iterator is exhausted?`,
    ['*StopIteration', 'IndexError', 'EOFError', 'IteratorError'],
    `next() raises StopIteration; for loops handle it for you.`);
  h('iterators', 'easy', `What does calling a generator function return?`,
    ['*A generator object; the body has not started yet', 'The first yielded value', 'A list of all values', 'None'],
    `The body runs only when next() is called.`);
  h('iterators', 'medium', `What happens if you loop twice over the same generator?`,
    ['*The second loop sees no items', 'It restarts automatically', 'TypeError', 'It repeats the last item'],
    `Generators are single-use iterators.`);
  h('iterators', 'medium', `Which methods make a class an iterator? (select all)`,
    ['*__iter__ returning self', '*__next__', '__len__', '__getitem__ only'],
    `An iterator implements both; __iter__ alone makes an iterable.`);
  h('iterators', 'medium', `Which is a generator expression?`,
    ['*(x * x for x in range(3))', '[x * x for x in range(3)]', '{x * x for x in range(3)}', 'lambda x: x * x'],
    `Parentheses instead of brackets make it lazy.`);
  h('iterators', 'hard', `What does \`yield from sub\` do?`,
    ['*Yields every item of sub in turn', 'Returns sub as a list', 'Yields sub as one item', 'Imports sub'],
    `It delegates to another iterable or generator.`);
  h('iterators', 'easy', `Why use sum(x for x in data) instead of sum([x for x in data])?`,
    ['*It avoids building a temporary list', 'It gives a different result', 'It is required syntax', 'It sorts the data'],
    `The generator feeds sum one item at a time.`);
  h('iterators', 'medium', `What does \`next(gen, "done")\` return when gen is exhausted?`,
    ['*\'done\'', 'StopIteration is raised', 'None', 'The last value again'],
    `A default argument replaces the StopIteration.`);
  h('iterators', 'hard', `Does len() work on a generator?`,
    ['*No, generators have no length', 'Yes, it counts the items', 'Only for finite generators', 'Yes, but it consumes it'],
    `Use sum(1 for _ in gen) to count, which consumes it.`);
  h('iterators', 'medium', `Which itertools function gives overlapping pairs like (1, 2), (2, 3)?`,
    ['*pairwise', 'batched', 'chain', 'groupby'],
    `pairwise(iterable) yields consecutive overlapping pairs.`);
  h('iterators', 'medium', `What does contextlib.contextmanager turn a one-yield generator into?`,
    ['*Something usable in a with statement', 'A thread', 'A list', 'An async function'],
    `Code before yield is set-up; code after is clean-up.`);
  h('iterators', 'easy', `Which objects are iterables you can loop over many times? (select all)`,
    ['*list', '*str', '*range', 'a generator object'],
    `Each loop asks the iterable for a fresh iterator; a generator is its own single iterator.`);

  // ---------------- Chapter 13: stdlib1 ----------------
  h('stdlib1', 'easy', `Which module parses command-line options and generates --help?`,
    ['*argparse', 'sys', 'getpass', 'optparse2'],
    `argparse builds full CLIs with usage messages and type conversion.`);
  h('stdlib1', 'medium', `What is the difference between re.match and re.search?`,
    ['*match only matches at the start; search scans the whole string', 'search only matches at the start', 'They are identical', 'match returns a list'],
    `Use fullmatch to require the whole string to match.`);
  h('stdlib1', 'easy', `Why write regex patterns as raw strings like r"\\d+"?`,
    ['*So backslashes reach the re module unchanged', 'Raw strings run faster', 'Regex requires bytes', 'To make them case-insensitive'],
    `Without r, Python would treat some backslash sequences as escapes.`);
  h('stdlib1', 'medium', `Which module should generate a password-reset token?`,
    ['*secrets', 'random', 'math', 'hashlib only'],
    `random is predictable; secrets uses a cryptographically secure source.`);
  h('stdlib1', 'medium', `What does subtracting two date objects give?`,
    ['*A timedelta', 'An int number of days', 'A date', 'A float of seconds'],
    `Use .days on the timedelta.`);
  h('stdlib1', 'easy', `Which stream should error messages go to?`,
    ['*sys.stderr', 'sys.stdout', 'sys.stdin', 'sys.errors'],
    `stderr stays visible when stdout is redirected.`);
  h('stdlib1', 'medium', `What does doctest check?`,
    ['*That >>> examples in docstrings produce the shown output', 'That type hints are correct', 'That code follows PEP 8', 'That functions have docstrings'],
    `It runs the REPL-style examples and compares output.`);
  h('stdlib1', 'medium', `In unittest, which methods are run as tests?`,
    ['*Methods whose names start with test', 'All methods', 'Methods decorated with @test', 'Methods named run'],
    `The test runner discovers test_* methods of TestCase subclasses.`);
  h('stdlib1', 'hard', `Why does the csv module beat line.split(",")?`,
    ['*It handles quoted fields that contain commas', 'It is always faster', 'It converts numbers automatically', 'It ignores empty lines'],
    `"lunch, with Ana" in quotes stays one field.`);
  h('stdlib1', 'medium', `What does Path("a") / "b" / "c.txt" create?`,
    ['*A path a/b/c.txt', 'A division error', 'The string "abc.txt"', 'A list of parts'],
    `pathlib overloads / to join path parts.`);
  h('stdlib1', 'hard', `Which statements about collections.defaultdict(list) are true? (select all)`,
    ['*Missing keys start as an empty list', '*d[k].append(x) works even for new keys', 'It sorts keys automatically', 'Reading d.get(k) creates the key'],
    `Only d[k] triggers the default factory; get() does not.`);
  h('stdlib1', 'easy', `Which module runs other programs safely?`,
    ['*subprocess', 'os.system only', 'shutil', 'glob'],
    `subprocess.run(["git", "status"]) gives output and exit code.`);

  // ---------------- Chapter 14: stdlib2 ----------------
  h('stdlib2', 'easy', `Which type gives exact decimal arithmetic for money?`,
    ['*decimal.Decimal', 'float', 'complex', 'fractions.Fraction only'],
    `Decimal works in base 10, like paper arithmetic.`);
  h('stdlib2', 'medium', `Why should you write Decimal("0.1") rather than Decimal(0.1)?`,
    ['*The float 0.1 is already inexact before Decimal sees it', 'Decimal only accepts strings', 'It is faster', 'Decimal(0.1) raises TypeError'],
    `Decimal(0.1) shows every digit of the binary approximation.`);
  h('stdlib2', 'easy', `What is the default level threshold of the logging module?`,
    ['*WARNING', 'DEBUG', 'INFO', 'ERROR'],
    `debug and info messages are dropped until you lower the level.`);
  h('stdlib2', 'medium', `Which module gives a priority queue where the smallest item comes out first?`,
    ['*heapq', 'bisect', 'array', 'queue.LifoQueue'],
    `heappush and heappop keep the smallest at index 0.`);
  h('stdlib2', 'medium', `What do threads speed up in standard CPython?`,
    ['*Programs that wait on I/O', 'Pure-Python number crunching', 'Nothing at all', 'Only GPU work'],
    `The GIL lets one thread run Python bytecode at a time; waiting releases it.`);
  h('stdlib2', 'medium', `What does string.Template.safe_substitute do with a missing placeholder?`,
    ['*Leaves the placeholder text unchanged', 'Raises KeyError', 'Replaces it with an empty string', 'Replaces it with None'],
    `substitute raises KeyError; safe_substitute leaves $name as is.`);
  h('stdlib2', 'hard', `What does a weak reference do?`,
    ['*Refers to an object without keeping it alive', 'Copies the object', 'Makes the object immutable', 'Speeds up attribute access'],
    `WeakValueDictionary entries vanish when the object is garbage-collected.`);
  h('stdlib2', 'medium', `In struct format "<HHI", what does "<" mean?`,
    ['*Little-endian byte order', 'Less than', 'Signed numbers', 'Align left'],
    `< selects little-endian with standard sizes.`);
  h('stdlib2', 'medium', `What does bisect.bisect(sorted_list, x) return?`,
    ['*The index where x would be inserted to keep the list sorted', 'Whether x is in the list', 'The item closest to x', 'A new sorted list'],
    `It is a binary search for the insertion point.`);
  h('stdlib2', 'easy', `What is a StrEnum member equal to?`,
    ['*Its string value, e.g. Category.FOOD == "food"', 'Its position number', 'Nothing except itself', 'True'],
    `StrEnum members are real strings.`);
  h('stdlib2', 'hard', `Which statements about logging are true? (select all)`,
    ['*log.exception() logs at ERROR and includes the traceback', '*getLogger(__name__) gives a per-module logger', 'logging writes to stdout by default', 'basicConfig must be called in every module'],
    `Configure once at start-up; the default handler writes to stderr.`);
  h('stdlib2', 'medium', `What does pprint help with?`,
    ['*Printing nested data structures readably across lines', 'Printing faster', 'Printing to a printer', 'Colouring output'],
    `pprint breaks long nested containers with indentation.`);

  // ---------------- Chapter 15: venv ----------------
  h('venv', 'easy', `Which command creates a virtual environment in .venv?`,
    ['*python3 -m venv .venv', 'pip install venv', 'python3 venv create', 'virtualenv --global'],
    `The venv module ships with Python.`);
  h('venv', 'easy', `Should a .venv folder be committed to git?`,
    ['*No, commit requirements.txt or pyproject.toml instead', 'Yes, always', 'Only on Windows', 'Only the bin folder'],
    `Venvs are machine-specific and disposable; recreate them from the dependency list.`);
  h('venv', 'medium', `Why prefer \`python -m pip install x\` over \`pip install x\`?`,
    ['*It guarantees pip belongs to that exact Python', 'It is faster', 'It installs globally', 'pip alone is deprecated'],
    `With several Pythons installed, the bare pip may target another one.`);
  h('venv', 'medium', `What does activating a venv change?`,
    ['*It puts .venv/bin first on PATH (and sets VIRTUAL_ENV)', 'It copies Python into your home folder', 'It edits sys.path of every program', 'It installs pip'],
    `That is why calling .venv/bin/python directly works without activating.`);
  h('venv', 'medium', `What does "error: externally-managed-environment" tell you?`,
    ['*Use a virtual environment instead of the system Python', 'Run pip with sudo', 'Your internet is down', 'pip is broken'],
    `PEP 668 protects OS-managed Pythons; never fix it with sudo pip.`);
  h('venv', 'easy', `Which command records exact installed versions?`,
    ['*python -m pip freeze > requirements.txt', 'python -m pip list --save', 'python -m pip record', 'python -m venv --freeze'],
    `freeze prints name==version lines.`);
  h('venv', 'hard', `How can a script detect that it runs inside a venv?`,
    ['*sys.prefix != sys.base_prefix', 'os.environ["VENV"] == "1"', 'sys.version contains "venv"', '__file__ ends with .venv'],
    `Inside a venv, sys.prefix points to the venv while base_prefix points to the base install.`);
  h('venv', 'medium', `What does \`pip install -e .\` do?`,
    ['*Installs the current project in editable mode', 'Installs every package in the folder', 'Exports the environment', 'Erases the environment'],
    `Edits to your source take effect without reinstalling.`);
  h('venv', 'medium', `Which file describes a modern Python project's metadata and dependencies?`,
    ['*pyproject.toml', 'package.json', 'setup.ini', 'requirements.lock'],
    `Packaging tools read pyproject.toml.`);
  h('venv', 'hard', `Which tools are commonly used alongside pip and venv? (select all)`,
    ['*uv (fast installer and venv manager)', '*pytest (testing)', '*ruff (linting and formatting)', 'npm (Python packages)'],
    `npm is for JavaScript packages.`);
  h('venv', 'easy', `On Windows PowerShell, how do you activate .venv?`,
    ['*.venv\\Scripts\\Activate.ps1', 'source .venv/bin/activate', '.venv/bin/activate.fish', 'activate .venv'],
    `Windows venvs use a Scripts folder.`);
  h('venv', 'medium', `Where is the Python Package Index?`,
    ['*pypi.org', 'python.org/packages only', 'npmjs.com', 'github.com/python'],
    `PyPI hosts the packages that pip installs.`);

  // ---------------- Chapter 16: project ----------------
  h('project', 'easy', `Why does the tracker store money as integer cents?`,
    ['*To avoid float rounding errors in totals', 'Because JSON has no floats', 'To save disk space', 'Because Decimal is deprecated'],
    `1250 cents is exact; 12.5 as a float sum can drift.`);
  h('project', 'medium', `Why does main() take argv=None?`,
    ['*So tests can pass their own argument list', 'Because argparse needs None', 'To disable arguments', 'To read from stdin'],
    `parse_args(None) falls back to sys.argv; tests call main(["--file", ...]).`);
  h('project', 'medium', `What does storage.save do to avoid corrupting the data file?`,
    ['*Writes to a temporary file, then replaces the real file in one step', 'Keeps the file open forever', 'Writes twice', 'Uses pickle'],
    `A crash mid-write can't leave a half-written expenses.json.`);
  h('project', 'medium', `Which exit code does the tracker return for "no expense with id 3"?`,
    ['*1', '0', '2', '3'],
    `Expected errors print to stderr and return 1.`);
  h('project', 'hard', `Why does the CLI wrap converters with _arg(convert)?`,
    ['*To turn ValueError into argparse.ArgumentTypeError with our message', 'To make them faster', 'To log every argument', 'Because argparse needs classes'],
    `argparse shows an ArgumentTypeError message directly in its error output.`);
  h('project', 'easy', `Which file lets you run the package with python3 -m tracker?`,
    ['*tracker/__main__.py', 'tracker/__init__.py', 'tracker/cli.py', 'setup.py'],
    `python -m package runs the package's __main__ module.`);
  h('project', 'medium', `What is COMMANDS = {"add": cmd_add, ...} an example of?`,
    ['*A dispatch table: functions stored as values', 'A class hierarchy', 'A generator', 'An enum'],
    `Functions are first-class objects, so a dict can map names to them.`);
  h('project', 'medium', `Why is Category a StrEnum?`,
    ['*Typos become errors, and members still behave like strings', 'Enums are faster than strings', 'JSON requires enums', 'It sorts categories'],
    `Category("pets") raises ValueError; str(Category.FOOD) == "food".`);
  h('project', 'hard', `Why are bugs (unexpected exceptions) NOT caught in main()?`,
    ['*So they show a full traceback during development', 'Python cannot catch them', 'To return exit code 0', 'To keep the file small'],
    `Only expected problems (StorageError, LookupError) become friendly messages.`);
  h('project', 'easy', `Which command lists only food expenses?`,
    ['*python3 -m tracker list --category food', 'python3 -m tracker food', 'python3 -m tracker summary food', 'python3 -m tracker list food'],
    `--category is an option of the list subcommand.`);
  h('project', 'medium', `What does [project.scripts] expenses = "tracker.__main__:main" create after pip install -e .?`,
    ['*An expenses command that calls tracker.__main__.main()', 'A Python module named expenses', 'A shell alias in .zshrc', 'A test suite'],
    `pip generates a small executable in the venv's bin folder.`);
  h('project', 'hard', `Which design choices make invalid data hard to create? (select all)`,
    ['*Integer cents with parse_amount validation', '*Category as an enum', '*Expense as a dataclass with from_dict', 'Catching every exception in main'],
    `Validation at the edges plus precise types; catching everything would hide bugs.`);

  // ---------------- Appendix A: fromjava ----------------
  h('fromjava', 'easy', `What is Python's equivalent of Java's null?`,
    ['*None', 'null', 'nil', 'undefined'],
    `Python has a single "no value" object, None.`);
  h('fromjava', 'easy', `How do you compare two strings for equal content in Python?`,
    ['*a == b', 'a.equals(b)', 'a is b', 'a === b'],
    `== compares values; is compares identity.`);
  h('fromjava', 'medium', `Which is Python's replacement for Java method overloading?`,
    ['*Default values, keyword arguments and *args', 'Multiple def with the same name', 'The @overload decorator at run time', 'Interfaces'],
    `A second def with the same name simply replaces the first.`);
  h('fromjava', 'medium', `In JavaScript [] is truthy. In Python, bool([]) is…`,
    ['*False', 'True', 'TypeError', 'None'],
    `Empty containers are false in Python.`);
  h('fromjava', 'medium', `What happens with "1" + 1 in Python?`,
    ['*TypeError', '"11"', '2', '"2"'],
    `Python is strongly typed: no implicit string/number conversion.`);
  h('fromjava', 'easy', `Python equivalent of Java's this?`,
    ['*self (an explicit first parameter)', 'this', 'me', 'cls in every method'],
    `Methods receive the instance explicitly as self.`);
  h('fromjava', 'hard', `Which patterns become simpler in Python? (select all)`,
    ['*Singleton → a module-level object', '*Strategy → passing a function', '*Iterator → a generator', 'Observer → requires a listener interface'],
    `An observer can be a plain list of callables.`);
  h('fromjava', 'medium', `What is Python's version of Java's checked exceptions?`,
    ['*There are none; any function may raise anything', 'The throws keyword', 'raises annotations enforced at compile time', 'try-with-resources'],
    `Document important exceptions in docstrings.`);
  h('fromjava', 'medium', `Python's version of try-with-resources?`,
    ['*with', 'using', 'try (...)', 'defer'],
    `with closes files and releases locks automatically.`);
  h('fromjava', 'hard', `Why can x is 1000 be unreliable?`,
    ['*Whether equal ints are the same object is an implementation detail', 'is converts to strings', 'is is a SyntaxError for ints', 'Large ints are always cached'],
    `Use == for values; is only for singletons like None.`);
  h('fromjava', 'easy', `What replaces Java's Comparator when sorting?`,
    ['*A key function: sorted(xs, key=len)', 'compareTo methods only', 'sort(cmp=...) is required', 'Collections.sort'],
    `Python asks what to sort by, not how to compare two items.`);
  h('fromjava', 'medium', `Which is a Python stand-in for an interface contract?`,
    ['*An abc.ABC with @abstractmethod, or typing.Protocol', 'The interface keyword', 'A Java annotation', 'A metaclass is required'],
    `Python relies on duck typing, with ABCs or Protocols for formal contracts.`);

  // ---------------- Appendix B: shell ----------------
  h('shell', 'easy', `What does exit code 0 mean?`,
    ['*Success', 'Failure', 'The program crashed', 'No output was produced'],
    `Non-zero exit codes mean failure.`);
  h('shell', 'easy', `What does \`cmd > out.txt\` do?`,
    ['*Sends stdout to out.txt, overwriting it', 'Appends stdout to out.txt', 'Sends stderr to out.txt', 'Reads input from out.txt'],
    `>> appends; 2> redirects stderr.`);
  h('shell', 'medium', `Relative file paths in open() are resolved against…`,
    ['*The current working directory', 'The script\'s folder', 'The home folder', 'The Python installation'],
    `Use Path(__file__).parent to find files next to the script.`);
  h('shell', 'medium', `What is PATH used for?`,
    ['*Finding the program to run when you type a command name', 'Storing Python\'s import paths', 'Listing open files', 'Setting the working directory'],
    `The shell searches PATH's folders left to right.`);
  h('shell', 'medium', `How do you pass "lunch with Ana" as ONE argument?`,
    ['*Put it in quotes', 'Separate words with commas', 'Use underscores only', 'It is impossible'],
    `The shell splits unquoted text on spaces.`);
  h('shell', 'hard', `What does \`a | b\` do?`,
    ['*Connects a\'s stdout to b\'s stdin', 'Runs b only if a fails', 'Runs a and b in either order', 'Redirects stderr'],
    `A pipe streams one program's output into the next.`);
  h('shell', 'medium', `What type does "café".encode("utf-8") return?`,
    ['*bytes', 'str', 'bytearray', 'list'],
    `encode turns text into bytes; decode goes back.`);
  h('shell', 'hard', `You see "CafÃ©" instead of "Café". What happened?`,
    ['*UTF-8 bytes were decoded as Latin-1/cp1252', 'The file was compressed', 'The font is missing', 'Python 3.15 changed accents'],
    `Read the file with encoding="utf-8".`);
  h('shell', 'medium', `In text mode, how does Python read Windows "\\r\\n" line endings?`,
    ['*As "\\n"', 'As "\\r\\n"', 'As "\\r"', 'It raises an error'],
    `Universal newlines translate all endings to "\\n".`);
  h('shell', 'easy', `Where do environment variable values come from in Python?`,
    ['*os.environ (values are strings)', 'sys.argv', 'globals()', 'os.path'],
    `os.environ.get("NAME", default) reads one safely.`);
  h('shell', 'medium', `What does \`a && b\` do in a shell?`,
    ['*Runs b only if a succeeded (exit code 0)', 'Runs b only if a failed', 'Runs both in parallel', 'Pipes a into b'],
    `|| runs the second command only on failure.`);
  h('shell', 'hard', `Which statements about stderr are true? (select all)`,
    ['*It stays on screen when stdout is redirected with >', '*print(..., file=sys.stderr) writes to it', 'It is the same stream as stdout', 'Exit codes are written to it'],
    `stdout and stderr are separate streams; exit codes are a separate number.`);
}
