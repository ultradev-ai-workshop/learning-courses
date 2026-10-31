// Hand-written questions for the JavaScript Study Book assessment.
// h(topic, difficulty, question, options, explanation, code?)
// Options starting with "*" are correct (the "*" is stripped).
// Written as template literals; never put a dollar sign directly before "{" in the text.

export function addHandwritten(h) {
  // ---------------- Chapter 1: intro ----------------
  h('intro', 'easy', `What is ECMAScript?`,
    ['*The language specification that JavaScript engines implement', 'A JavaScript framework', 'The browser DOM API', 'Node.js’s module system'],
    `ECMA-262 defines the language; engines like V8 implement it and hosts add APIs.`);
  h('intro', 'easy', `Which of these is a host (runtime) API rather than part of the language?`,
    ['*document.querySelector', 'Array.prototype.map', 'Promise', 'JSON.parse'],
    `The DOM comes from the browser; Array, Promise and JSON are ECMAScript built-ins.`);
  h('intro', 'easy', `Which edition is also called ES6?`,
    ['*ES2015', 'ES2016', 'ES5', 'ES2020'],
    `The 6th edition was published in 2015; editions are named by year since then.`);
  h('intro', 'medium', `At which TC39 stage is a proposal included in the next yearly edition?`,
    ['*Stage 4', 'Stage 3', 'Stage 2', 'Stage 1'],
    `Stage 4 means finished: two shipping implementations and tests.`);
  h('intro', 'medium', `Which statements about ES modules are true? (select all that apply)`,
    ['*They are always in strict mode', '*Top-level this is undefined', '*Top-level await is allowed', 'Top-level var creates a global property'],
    `Module scope is private and strict; top-level await arrived in ES2022.`);
  h('intro', 'easy', `In Node, which file is always treated as an ES module?`,
    ['*.mjs', '.cjs', '.js without package.json', '.json'],
    `.mjs is always ESM; .js depends on the nearest package.json "type".`);
  h('intro', 'medium', `In sloppy mode, what happens when you assign to an undeclared variable?`,
    ['*A global variable is silently created', 'ReferenceError', 'SyntaxError', 'Nothing happens'],
    `Strict mode turns this into a ReferenceError instead.`);
  h('intro', 'medium', `Which feature was NOT part of ES2015?`,
    ['*async/await', 'Promises', 'Classes', 'Arrow functions'],
    `async/await arrived in ES2017.`);
  h('intro', 'hard', `Why does "use strict" at the top of a module change nothing?`,
    ['*Modules are already strict', 'Modules ignore directives', 'It must be inside a function', 'It only works in browsers'],
    `ES module and class code is always strict mode.`);
  h('intro', 'easy', `What is globalThis?`,
    ['*The standard name for the global object in every environment', 'A Node-only object', 'An alias for this in classes', 'A deprecated API'],
    `ES2020 unified window, self and global under one name.`);
  h('intro', 'medium', `Which engine runs JavaScript in Node.js and Chrome?`,
    ['*V8', 'SpiderMonkey', 'JavaScriptCore', 'Chakra'],
    `SpiderMonkey is Firefox's engine and JavaScriptCore is Safari's.`);
  h('intro', 'hard', `Which statements about feature detection are true? (select all that apply)`,
    ['*typeof Object.groupBy === "function" checks support safely', '*It works regardless of engine version numbers', 'You should check Node’s version string instead', 'It requires try/catch around every check'],
    `Ask whether the feature exists rather than guessing from version strings.`);

  // ---------------- Chapter 2: types ----------------
  h('types', 'easy', `What does typeof null return?`,
    ['*"object"', '"null"', '"undefined"', '"symbol"'],
    `A historic bug that can't be fixed without breaking the web; check x === null instead.`);
  h('types', 'easy', `Which declaration allows re-assignment but not re-declaration in the same scope?`,
    ['*let', 'const', 'var', 'function'],
    `let can be re-assigned; const cannot; var allows both.`);
  h('types', 'medium', `What does const guarantee for const cart = [];?`,
    ['*The name cart can’t be re-assigned', 'The array can’t be changed', 'The array is frozen deeply', 'Nothing in modules'],
    `const freezes the binding, not the value; use Object.freeze for the value.`);
  h('types', 'medium', `What is the temporal dead zone (TDZ)?`,
    ['*The time between entering a scope and a let/const/class declaration running, when the name throws if used', 'The time a promise is pending', 'Code after a return statement', 'Unreachable code in a switch'],
    `Reading a let before its declaration line runs throws ReferenceError.`);
  h('types', 'easy', `How many primitive types does JavaScript have?`,
    ['*7', '5', '6', '8'],
    `undefined, null, boolean, number, bigint, string and symbol; objects are the 8th type but not primitive.`);
  h('types', 'medium', `Which checks reliably detect an array? (select all that apply)`,
    ['*Array.isArray(x)', '*x instanceof Array (same realm)', 'typeof x === "array"', 'typeof x === "object"'],
    `typeof never returns "array"; Array.isArray also works across realms.`);
  h('types', 'hard', `Why is Symbol("id") === Symbol("id") false?`,
    ['*Every Symbol() call creates a unique value', 'Symbols compare by description length', 'Symbols cannot be compared', 'Because === converts them to strings'],
    `Use Symbol.for("id") for a shared registry symbol.`);
  h('types', 'medium', `What does 1n + 1 do?`,
    ['*Throws TypeError: cannot mix BigInt and other types', 'Returns 2n', 'Returns 2', 'Returns "11"'],
    `Convert explicitly: 1n + BigInt(1) or Number(1n) + 1.`);
  h('types', 'easy', `Which copies an object deeply, including nested arrays and Dates?`,
    ['*structuredClone(obj)', '{ ...obj }', 'Object.assign({}, obj)', 'obj.slice()'],
    `Spread and Object.assign are shallow; structuredClone recurses.`);
  h('types', 'hard', `Which statements about hoisting are true? (select all that apply)`,
    ['*Function declarations can be called before their line', '*var variables read as undefined before their line', 'const arrow functions can be called before their line', 'class declarations are fully hoisted'],
    `let/const/class are hoisted into the TDZ; only function declarations are fully initialised.`);
  h('types', 'medium', `What is 0.1 + 0.2 === 0.3?`,
    ['*false', 'true', 'TypeError', 'NaN'],
    `Binary floating point can't represent 0.1 exactly; compare with a tolerance.`);
  h('types', 'easy', `Which literal uses a numeric separator (ES2021)?`,
    ['*1_000_000', '1,000,000', '1.000.000', '1 000 000'],
    `Underscores are ignored by the parser and improve readability.`);

  // ---------------- Chapter 3: control ----------------
  h('control', 'easy', `How many falsy values are there?`,
    ['*8', '6', '5', '7'],
    `false, 0, -0, 0n, "", null, undefined and NaN.`);
  h('control', 'easy', `Which comparison does switch use for its cases?`,
    ['*===', '==', 'Object.is', 'SameValueZero'],
    `case "1" never matches the number 1.`);
  h('control', 'medium', `What does for…in iterate over?`,
    ['*Enumerable string keys, including inherited ones', 'Array values', 'Map entries', 'Only own keys'],
    `Use for…of for values and Object.keys for own keys only.`);
  h('control', 'medium', `What is the optional catch binding (ES2019)?`,
    ['*Writing catch { … } without (err)', 'catch that never runs', 'A catch for promises only', 'try without catch or finally'],
    `Useful when the error object isn't needed.`);
  h('control', 'medium', `What does new Error("x", { cause: err }) do?`,
    ['*Creates an error that keeps err as its cause', 'Throws err immediately', 'Copies err’s stack', 'Merges both messages'],
    `Error cause (ES2022) chains a low-level error into a meaningful one.`);
  h('control', 'hard', `What happens when finally contains a return?`,
    ['*It overrides the try/catch result and swallows thrown errors', 'It is a SyntaxError', 'It runs only on success', 'It is ignored'],
    `Keep finally for clean-up; never return from it.`);
  h('control', 'easy', `Which statement leaves an outer loop from inside a nested loop?`,
    ['*break outerLabel;', 'continue;', 'break;', 'return outer;'],
    `Labels let break/continue target an enclosing loop.`);
  h('control', 'medium', `Which errors does AggregateError represent?`,
    ['*Several errors at once, in an errors array', 'A syntax error in an aggregate function', 'Errors from Array.reduce', 'Only network errors'],
    `Promise.any rejects with an AggregateError when all inputs reject.`);
  h('control', 'medium', `Why can’t you break out of array.forEach?`,
    ['*The callback is a separate function; break is only valid in loop statements', 'forEach is asynchronous', 'break throws inside arrays', 'forEach copies the array'],
    `Use for…of with break, or some/find, which stop early.`);
  h('control', 'hard', `Which loops run their body at least once? (select all that apply)`,
    ['*do { … } while (cond)', 'while (cond) { … }', 'for (;cond;) { … }', 'for (const x of []) { … }'],
    `Only do…while checks the condition after the first pass.`);
  h('control', 'easy', `Which of these is truthy?`,
    ['*"false"', '0n', 'NaN', '""'],
    `Any non-empty string is truthy.`);
  h('control', 'medium', `What should a custom error class set so logs show its type?`,
    ['*this.name', 'this.type', 'this.code', 'Error.prototype.kind'],
    `Set name in the constructor, or use new.target.name.`);

  // ---------------- Chapter 4: functions ----------------
  h('functions', 'easy', `When does a default parameter value apply?`,
    ['*When the argument is undefined', 'When the argument is falsy', 'When the argument is null', 'Only when no arguments are passed at all'],
    `null, 0 and "" are real values and keep the default from applying.`);
  h('functions', 'easy', `What does ...rest in a parameter list produce?`,
    ['*A real array of the remaining arguments', 'An array-like arguments object', 'A Set', 'A string'],
    `Rest parameters replace the old arguments object.`);
  h('functions', 'medium', `What is "this" inside an arrow function?`,
    ['*The this of the surrounding scope where the arrow was written', 'Always undefined', 'The object the arrow is called on', 'The global object'],
    `Arrows have lexical this; call/apply/bind can't change it.`);
  h('functions', 'medium', `In a module, what is this inside a plain call f()?`,
    ['*undefined', 'globalThis', 'The module object', 'f itself'],
    `Strict mode gives plain calls an undefined this.`);
  h('functions', 'medium', `What does fn.bind(obj) return?`,
    ['*A new function whose this is permanently obj', 'The result of calling fn', 'fn with obj as its first argument', 'obj with fn attached'],
    `A bound function ignores later call/apply this values.`);
  h('functions', 'hard', `Why does const fns = []; for (var i = 0; i < 3; i++) fns.push(() => i); give [3, 3, 3] when called?`,
    ['*All closures share one function-scoped i, which is 3 after the loop', 'Arrow functions copy values late', 'push stores references to numbers', 'var is block scoped'],
    `let creates a fresh binding per iteration and gives [0, 1, 2].`);
  h('functions', 'easy', `How do you return an object literal from a concise arrow?`,
    ['*() => ({ ok: true })', '() => { ok: true }', '() => return { ok: true }', '() => [ok: true]'],
    `Without parentheses the braces are read as a function body.`);
  h('functions', 'medium', `What is a closure?`,
    ['*A function plus the variables from the scope where it was created', 'A function that has returned', 'An IIFE', 'A function with no parameters'],
    `Closures keep outer variables alive after the outer function returns.`);
  h('functions', 'hard', `Which statements about arrow functions are true? (select all that apply)`,
    ['*They have no own arguments object', '*They can’t be used with new', '*They have no prototype property', 'call() can change their this'],
    `Arrows are lightweight functions with lexical this, arguments and super.`);
  h('functions', 'easy', `What does a function return when it has no return statement?`,
    ['*undefined', 'null', '0', 'The last expression'],
    `Only concise arrow bodies return their expression implicitly.`);
  h('functions', 'medium', `What is f.length for function f(a, b = 2, ...c) {}?`,
    ['*1', '3', '2', '0'],
    `length counts parameters before the first default or rest parameter.`);
  h('functions', 'medium', `Which pattern fixes a method losing this when passed as a callback? (select all that apply)`,
    ['*obj.method.bind(obj)', '*(…args) => obj.method(…args)', 'const m = obj.method; m()', 'obj.method.call'],
    `Bind it, or keep the method call inside a wrapper.`);

  // ---------------- Chapter 5: operators ----------------
  h('operators', 'easy', `What does 0 ?? 10 evaluate to?`,
    ['*0', '10', 'null', 'false'],
    `?? only replaces null and undefined.`);
  h('operators', 'easy', `What does user?.address?.city give when user is null?`,
    ['*undefined', 'TypeError', 'null', '""'],
    `Optional chaining short-circuits on null/undefined.`);
  h('operators', 'medium', `Which assigns only when the current value is null or undefined?`,
    ['*a ??= b', 'a ||= b', 'a &&= b', 'a = a || b'],
    `||= assigns for any falsy value, including 0 and "".`);
  h('operators', 'medium', `Why is -2 ** 2 a SyntaxError?`,
    ['*Unary minus before ** is ambiguous, so parentheses are required', '** needs BigInt', 'Negative numbers can’t be squared', '** is right-associative'],
    `Write (-2) ** 2 or -(2 ** 2).`);
  h('operators', 'medium', `What does Object.is(NaN, NaN) return, and NaN === NaN?`,
    ['*true and false', 'false and false', 'true and true', 'false and true'],
    `Object.is uses SameValue; === never equates NaN.`);
  h('operators', 'hard', `Which use SameValueZero (so NaN equals NaN, +0 equals -0)? (select all that apply)`,
    ['*Array.prototype.includes', '*Map keys', '*Set membership', 'Array.prototype.indexOf'],
    `indexOf uses === and can't find NaN.`);
  h('operators', 'easy', `What does const { a: x = 5 } = { a: undefined } give x?`,
    ['*5', 'undefined', 'null', 'TypeError'],
    `Defaults in destructuring apply for undefined.`);
  h('operators', 'medium', `What does { ...a, ...b } do when both have a key "x"?`,
    ['*b’s value wins (later spreads override)', 'a’s value wins', 'It throws', 'Both are kept in an array'],
    `Properties are copied left to right.`);
  h('operators', 'medium', `Is object spread a deep copy?`,
    ['*No, nested objects are shared', 'Yes, always', 'Only for arrays', 'Only in strict mode'],
    `Use structuredClone for deep copies.`);
  h('operators', 'hard', `Why is a || b ?? c a SyntaxError?`,
    ['*Mixing ?? with || or && requires explicit parentheses', '?? must come first', '|| is not allowed with null', 'Only two operands are allowed'],
    `Write (a || b) ?? c or a || (b ?? c).`);
  h('operators', 'easy', `What does "5" + 3 evaluate to?`,
    ['*"53"', '8', 'NaN', 'TypeError'],
    `+ concatenates when either side is a string.`);
  h('operators', 'medium', `Which is the one widely accepted use of ==?`,
    ['*x == null to test for null or undefined', 'x == 0 to test falsiness', 'x == "" to test empty strings', 'x == true for booleans'],
    `x == null matches exactly null and undefined.`);

  // ---------------- Chapter 6: text ----------------
  h('text', 'easy', `What does Number("12px") return?`,
    ['*NaN', '12', '"12"', 'TypeError'],
    `Number needs the whole string to be numeric; parseInt parses a prefix.`);
  h('text', 'easy', `What does "😀".length return?`,
    ['*2', '1', '4', '0'],
    `Strings are UTF-16; this emoji needs a surrogate pair.`);
  h('text', 'medium', `What type does (12.5).toFixed(2) return?`,
    ['*string', 'number', 'bigint', 'Decimal'],
    `toFixed formats for display and returns "12.50".`);
  h('text', 'medium', `In new Date(2026, 9, 30), which month is meant?`,
    ['*October', 'September', 'November', 'Invalid date'],
    `Date months are 0-based; Temporal months are 1-based.`);
  h('text', 'medium', `What does a tag function receive for tag\`a\${x}b\`?`,
    ['*An array of literal strings and the interpolated values', 'One joined string', 'Only the values', 'A RegExp'],
    `strings has one more element than values.`);
  h('text', 'hard', `Why does (1.005).toFixed(2) give "1.00"?`,
    ['*1.005 is stored as 1.00499999…, which rounds down', 'toFixed truncates', 'toFixed uses banker’s rounding', 'A bug in V8'],
    `Work in integer cents for money.`);
  h('text', 'easy', `Which method replaces every occurrence of a substring (ES2021)?`,
    ['*replaceAll', 'replace', 'substitute', 'splitJoin'],
    `replace with a string only replaces the first occurrence.`);
  h('text', 'medium', `What does String.raw\`C:\\new\` produce?`,
    ['*The text C:\\new with the backslash kept', 'C: followed by a newline and "ew"', 'C:new', 'A SyntaxError'],
    `String.raw keeps escape sequences uninterpreted.`);
  h('text', 'medium', `Which Intl API picks "1st/2nd/3rd" suffixes?`,
    ['*Intl.PluralRules with type "ordinal"', 'Intl.NumberFormat', 'Intl.Collator', 'Intl.ListFormat'],
    `select(n) returns categories like "one", "two", "few", "other".`);
  h('text', 'hard', `Which Temporal type represents a calendar date without time or zone?`,
    ['*Temporal.PlainDate', 'Temporal.Instant', 'Temporal.ZonedDateTime', 'Temporal.Duration'],
    `Instant is a point in time; ZonedDateTime adds a real time zone.`);
  h('text', 'easy', `What is Number.MAX_SAFE_INTEGER?`,
    ['*2^53 − 1', '2^31 − 1', '2^64', 'Infinity'],
    `Beyond it, integers lose precision; use BigInt.`);
  h('text', 'medium', `Which compare strings in human dictionary order? (select all that apply)`,
    ['*a.localeCompare(b)', '*new Intl.Collator("en").compare', 'a < b', 'Array.prototype.sort() with no comparator'],
    `< and the default sort compare UTF-16 code units, so "Z" < "a".`);

  // ---------------- Chapter 7: regex ----------------
  h('regex', 'easy', `Which flag makes a regex find all matches?`,
    ['*g', 'i', 'm', 's'],
    `i ignores case, m makes ^/$ per line, s lets . match newlines.`);
  h('regex', 'easy', `What does \\d match?`,
    ['*A digit', 'A letter', 'Whitespace', 'Any character'],
    `\\w is a word character and \\s whitespace.`);
  h('regex', 'medium', `How do you name a capture group (ES2018)?`,
    ['*(?<name>…)', '(?name…)', '(name:…)', '{name}…'],
    `Access it as match.groups.name and in replacements as $<name>.`);
  h('regex', 'medium', `What does the lazy quantifier +? do?`,
    ['*Matches as few characters as possible', 'Makes the group optional', 'Matches at least one, greedily', 'Turns off backtracking'],
    `Greedy .* grabs as much as possible; .*? as little.`);
  h('regex', 'medium', `What does str.matchAll(re) require?`,
    ['*The g flag on re', 'The y flag', 'A string pattern', 'Named groups'],
    `It throws TypeError for a non-global regex.`);
  h('regex', 'hard', `Why can reusing /x/g with .test() give alternating true/false?`,
    ['*The regex keeps lastIndex between calls', 'test() is random', 'g regexes are slower', 'Strings are cached'],
    `Drop the g flag for yes/no checks.`);
  h('regex', 'easy', `What does (?<=€)\\d+ match in "€42"?`,
    ['*42', '€42', '€', 'Nothing'],
    `Lookbehind checks context without consuming it.`);
  h('regex', 'medium', `Which flag enables \\p{L} Unicode property escapes? (select all that apply)`,
    ['*u', '*v', 'g', 'y'],
    `v is the upgraded unicodeSets mode (ES2024).`);
  h('regex', 'hard', `What is RegExp.escape (ES2025) for?`,
    ['*Safely building a regex from user text', 'Removing flags', 'Escaping HTML', 'Converting regex to string'],
    `It escapes characters like . + ( so they match literally.`);
  h('regex', 'medium', `In replace, what does $& insert?`,
    ['*The whole match', 'The first group', 'A literal ampersand', 'The input string'],
    `$1…$9 are groups, $<name> named groups.`);
  h('regex', 'easy', `What does ^ mean outside a character class?`,
    ['*Start of input (or line with m)', 'Negation', 'Exponent', 'Any character'],
    `Inside [^…] it negates the class.`);
  h('regex', 'medium', `What does the y (sticky) flag do?`,
    ['*Matches only exactly at lastIndex', 'Matches anywhere', 'Ignores case', 'Allows . to match newlines'],
    `Useful for tokenizers that consume input step by step.`);

  // ---------------- Chapter 8: arrays ----------------
  h('arrays', 'easy', `What does [10, 9, 1].sort() return?`,
    ['*[1, 10, 9]', '[1, 9, 10]', '[10, 9, 1]', '[9, 10, 1]'],
    `The default sort compares strings; pass (a, b) => a - b for numbers.`);
  h('arrays', 'easy', `Which method returns a sorted copy without mutating (ES2023)?`,
    ['*toSorted', 'sort', 'sorted', 'orderBy'],
    `Also toReversed, toSpliced and with.`);
  h('arrays', 'medium', `What does push return?`,
    ['*The new length', 'The pushed item', 'The array', 'undefined'],
    `pop/shift return the removed item; splice returns removed items.`);
  h('arrays', 'medium', `What does [].reduce((a, b) => a + b) do?`,
    ['*Throws TypeError (no initial value on an empty array)', 'Returns 0', 'Returns undefined', 'Returns []'],
    `Always pass the initial value.`);
  h('arrays', 'medium', `Which methods mutate the array? (select all that apply)`,
    ['*splice', '*reverse', '*fill', 'slice', 'toSorted'],
    `slice and the to… methods return new arrays.`);
  h('arrays', 'hard', `Why does ["1", "2", "3"].map(parseInt) give [1, NaN, NaN]?`,
    ['*map passes the index as parseInt’s radix', 'parseInt can’t parse strings', 'map skips holes', 'NaN is the default'],
    `Use .map(Number) or .map((s) => parseInt(s, 10)).`);
  h('arrays', 'easy', `Which method finds the last matching element (ES2023)?`,
    ['*findLast', 'lastIndexOf', 'find', 'reverseFind'],
    `findLastIndex returns its index.`);
  h('arrays', 'medium', `What does new Array(3) create?`,
    ['*An array of length 3 with empty holes', '[3]', '[undefined, undefined, undefined] without holes', '[0, 0, 0]'],
    `Use Array.of(3) for [3] or Array.from({ length: 3 }) for real slots.`);
  h('arrays', 'medium', `What does [[1, [2]], [3]].flat() return?`,
    ['*[1, [2], 3]', '[1, 2, 3]', '[[1, [2]], [3]]', '[1, [2], [3]]'],
    `flat defaults to depth 1; use flat(Infinity) for full flattening.`);
  h('arrays', 'hard', `Which statements about typed arrays are true? (select all that apply)`,
    ['*They have a fixed length', '*Integer views wrap on overflow', '*Several views can share one ArrayBuffer', 'They support push'],
    `Uint8ClampedArray clamps instead of wrapping.`);
  h('arrays', 'easy', `What does arr.at(-1) return?`,
    ['*The last element', 'undefined', 'The first element', '-1'],
    `at (ES2022) accepts negative indexes.`);
  h('arrays', 'medium', `Is Array.prototype.sort stable?`,
    ['*Yes, guaranteed since ES2019', 'No, never', 'Only for numbers', 'Only in Node'],
    `Equal elements keep their original order.`);

  // ---------------- Chapter 9: collections ----------------
  h('collections', 'easy', `What key types can a Map use?`,
    ['*Any value, including objects', 'Only strings', 'Strings and symbols', 'Only primitives'],
    `Objects as Map keys compare by identity.`);
  h('collections', 'easy', `How do you get the number of entries in a Set?`,
    ['*set.size', 'set.length', 'set.count()', 'Object.keys(set).length'],
    `Map and Set both have size.`);
  h('collections', 'medium', `What does map["k"] = 1 do on a Map?`,
    ['*Sets an ordinary property, not a Map entry', 'Adds an entry', 'Throws', 'Nothing'],
    `Use map.set("k", 1).`);
  h('collections', 'medium', `Which Set method returns elements in either set but not both (ES2025)?`,
    ['*symmetricDifference', 'difference', 'intersection', 'union'],
    `difference keeps elements only in the first set.`);
  h('collections', 'medium', `What does Object.groupBy return?`,
    ['*A null-prototype object of arrays', 'A Map', 'An array of arrays', 'A Set'],
    `Map.groupBy returns a Map, allowing non-string keys.`);
  h('collections', 'hard', `Which statements about WeakMap are true? (select all that apply)`,
    ['*Keys must be objects (or non-registered symbols)', '*It is not iterable', '*Entries don’t keep keys alive', 'It has a size property'],
    `Entries can vanish whenever the garbage collector runs.`);
  h('collections', 'easy', `What does [...new Set([3, 1, 3])] give?`,
    ['*[3, 1]', '[1, 3]', '[3, 1, 3]', '[3]'],
    `Sets keep insertion order and drop duplicates.`);
  h('collections', 'medium', `In which order does a Map iterate?`,
    ['*Insertion order', 'Sorted by key', 'Random', 'Integer keys first'],
    `Objects order integer-like keys first; Maps never reorder.`);
  h('collections', 'hard', `What does map.getOrInsertComputed(key, fn) do?`,
    ['*Returns the existing value, or calls fn, stores and returns its result', 'Always calls fn', 'Throws if the key exists', 'Returns a promise'],
    `It's the new upsert helper; fn only runs for missing keys.`);
  h('collections', 'medium', `Which can be WeakSet members? (select all that apply)`,
    ['*{}', '*[]', '"text"', '42'],
    `Primitives aren't allowed as weak keys.`);
  h('collections', 'easy', `When should you prefer a Map over a plain object?`,
    ['*For dynamic dictionaries with frequent adds/removes or non-string keys', 'For JSON data', 'For fixed-shape records', 'Never'],
    `Objects suit records and JSON; Maps suit dictionaries.`);
  h('collections', 'medium', `Do Set methods like union change the original set?`,
    ['*No, they return a new Set', 'Yes, union mutates', 'Only intersection mutates', 'Only if called with a Map'],
    `All the ES2025 composition methods are non-mutating.`);

  // ---------------- Chapter 10: objects ----------------
  h('objects', 'easy', `What is { title } shorthand for?`,
    ['*{ title: title }', '{ "title": undefined }', '{ [title]: title }', 'A destructuring pattern'],
    `Shorthand properties (ES2015) reuse the variable name.`);
  h('objects', 'medium', `In what order does Object.keys list { b: 1, 2: 1, a: 1, 1: 1 }?`,
    ['*["1", "2", "b", "a"]', '["b", "2", "a", "1"]', '["a", "b", "1", "2"]', '["2", "1", "b", "a"]'],
    `Integer-like keys come first in ascending order, then strings in insertion order.`);
  h('objects', 'easy', `Which checks for an OWN property only?`,
    ['*Object.hasOwn(obj, "k")', '"k" in obj', 'obj.k !== undefined', 'for…in'],
    `in also finds inherited keys.`);
  h('objects', 'medium', `What do properties created with Object.defineProperty default to?`,
    ['*writable, enumerable and configurable all false', 'All true', 'Only enumerable false', 'Only writable false'],
    `Assignment creates properties with all flags true.`);
  h('objects', 'medium', `Which listing methods include symbol keys? (select all that apply)`,
    ['*Reflect.ownKeys', '*Object.getOwnPropertySymbols', 'Object.keys', 'JSON.stringify'],
    `Spread and Object.assign also copy enumerable symbols.`);
  h('objects', 'hard', `What happens to a getter when you copy an object with spread?`,
    ['*Its current value is copied as a plain data property', 'The getter is copied', 'It is skipped', 'Spread throws'],
    `Spread reads properties; use Object.getOwnPropertyDescriptors to copy accessors.`);
  h('objects', 'medium', `What does Object.freeze NOT do?`,
    ['*Freeze nested objects', 'Prevent adding properties', 'Prevent changing values', 'Prevent deleting properties'],
    `It's shallow; deep-freeze recursively if needed.`);
  h('objects', 'easy', `Which transforms an object’s values?`,
    ['*Object.fromEntries(Object.entries(o).map(…))', 'o.map(…)', 'Object.map(o, …)', 'o.forEach(…)'],
    `Objects have no map; go through entries.`);
  h('objects', 'hard', `Which does structuredClone NOT preserve? (select all that apply)`,
    ['*Class prototypes', '*Getters', 'Dates', 'Maps'],
    `It throws on functions and returns plain objects for class instances.`);
  h('objects', 'medium', `Why is JSON.stringify(a) === JSON.stringify(b) a poor equality check?`,
    ['*Key order and dropped values (undefined, functions) make it unreliable', 'It is too slow', 'It throws for numbers', 'It always returns true'],
    `Use util.isDeepStrictEqual or assert.deepStrictEqual.`);
  h('objects', 'easy', `What does Object.create(null) create?`,
    ['*An object with no prototype', 'null', 'An empty array', 'A frozen object'],
    `Useful for dictionaries without inherited keys like "toString".`);
  h('objects', 'medium', `What does a computed key { [k]: v } do?`,
    ['*Uses the value of expression k as the property name', 'Creates a symbol', 'Creates an array', 'Uses the literal name "k"'],
    `Any expression works inside the brackets.`);

  // ---------------- Chapter 11: classes ----------------
  h('classes', 'easy', `What does typeof class A {} return?`,
    ['*"function"', '"class"', '"object"', '"constructor"'],
    `Classes are special functions that require new.`);
  h('classes', 'easy', `How do you declare a truly private field?`,
    ['*#name', '_name', 'private name', 'static name'],
    `# fields are enforced by the language (ES2022).`);
  h('classes', 'medium', `What must a subclass constructor do before using this?`,
    ['*Call super(...)', 'Call this.init()', 'Return an object', 'Nothing'],
    `this is uninitialised until super returns.`);
  h('classes', 'medium', `Where do class methods live?`,
    ['*On the class’s prototype object', 'On each instance', 'On the global object', 'In a closure'],
    `Fields live on each instance.`);
  h('classes', 'medium', `What does #balance in obj test?`,
    ['*Whether obj has that private field (brand check)', 'Whether balance is enumerable', 'A public property', 'It is a SyntaxError'],
    `Only allowed inside the class body.`);
  h('classes', 'hard', `Which statements about class fields with arrow functions are true? (select all that apply)`,
    ['*Each instance gets its own copy', '*this is bound to the instance', 'They live on the prototype', 'super can call them'],
    `Useful for event handlers; costs memory per instance.`);
  h('classes', 'easy', `What runs once when a class is defined (ES2022)?`,
    ['*A static { } block', 'The constructor', 'Every method', 'A getter'],
    `Static blocks initialise static state.`);
  h('classes', 'medium', `What does Object.getPrototypeOf(new Book()) return?`,
    ['*Book.prototype', 'Book', 'Object', 'null'],
    `Instances link to the class's prototype object.`);
  h('classes', 'hard', `Are class declarations hoisted like function declarations?`,
    ['*No, they are in the TDZ until their line runs', 'Yes, fully', 'Only static members', 'Only in modules'],
    `Using a class before its declaration throws ReferenceError.`);
  h('classes', 'medium', `What is a mixin in JavaScript?`,
    ['*A function that takes a base class and returns an extended class', 'A class with two parents', 'An interface', 'A private method'],
    `JavaScript has single inheritance; mixins compose behaviour.`);
  h('classes', 'easy', `How do you call the parent’s version of an overridden method?`,
    ['*super.method()', 'parent.method()', 'this.super.method()', 'base.method()'],
    `super works in methods and constructors.`);
  h('classes', 'medium', `Which statements about class bodies are true? (select all that apply)`,
    ['*They run in strict mode', '*Methods are non-enumerable', 'Fields are shared on the prototype', 'They can be called without new'],
    `Calling a class without new throws TypeError.`);

  // ---------------- Chapter 12: async ----------------
  h('async', 'easy', `When does a setTimeout(fn, 0) callback run?`,
    ['*After the current code and all pending microtasks', 'Immediately', 'Before promise callbacks', 'After exactly 0 ms, interrupting code'],
    `Timers are macrotasks.`);
  h('async', 'easy', `What does an async function always return?`,
    ['*A promise', 'The awaited value', 'undefined', 'A generator'],
    `Returned values become fulfilment values.`);
  h('async', 'medium', `Which combinator never rejects?`,
    ['*Promise.allSettled', 'Promise.all', 'Promise.any', 'Promise.race'],
    `It reports each outcome as fulfilled or rejected.`);
  h('async', 'medium', `What does Promise.any reject with when all inputs reject?`,
    ['*AggregateError', 'The first error', 'The last error', 'undefined'],
    `Its errors array holds every rejection reason.`);
  h('async', 'medium', `Why is ids.forEach(async (id) => { await save(id); }) a bug?`,
    ['*forEach ignores the returned promises, so nothing waits and errors go unhandled', 'async isn’t allowed in callbacks', 'save runs twice', 'forEach is synchronous so await throws'],
    `Use for…of with await, or Promise.all(ids.map(save)).`);
  h('async', 'hard', `Which run as microtasks? (select all that apply)`,
    ['*Promise then/catch/finally callbacks', '*Code after await', '*queueMicrotask callbacks', 'setTimeout callbacks'],
    `Timers, I/O and events are macrotasks.`);
  h('async', 'medium', `What does Promise.withResolvers() (ES2024) return?`,
    ['*{ promise, resolve, reject }', 'A resolved promise', 'An AbortController', 'A function'],
    `Lets you settle a promise from outside its executor.`);
  h('async', 'easy', `Does the Promise executor function run synchronously?`,
    ['*Yes, immediately during new Promise(...)', 'No, as a microtask', 'No, as a macrotask', 'Only after then is called'],
    `Only the reactions (then callbacks) are asynchronous.`);
  h('async', 'hard', `Why use return await inside try in an async function?`,
    ['*So a rejection is caught by the surrounding catch', 'It is faster', 'It is required syntax', 'It prevents unhandled rejections globally'],
    `return promise exits before it settles, bypassing catch.`);
  h('async', 'medium', `How do you cancel a fetch after 5 seconds?`,
    ['*fetch(url, { signal: AbortSignal.timeout(5000) })', 'fetch(url).cancel(5000)', 'setTimeout(() => fetch.abort(), 5000)', 'Promise.race only'],
    `AbortSignal makes the request reject with an abort/timeout error.`);
  h('async', 'medium', `What does Node do by default with an unhandled promise rejection?`,
    ['*Terminates the process with an error', 'Ignores it', 'Logs a warning only', 'Retries the promise'],
    `Always handle rejections.`);
  h('async', 'easy', `Where can you use top-level await?`,
    ['*In ES modules', 'In any script', 'Only inside classes', 'Only in CommonJS'],
    `Classic scripts and CommonJS need an async wrapper.`);

  // ---------------- Chapter 13: iterators ----------------
  h('iterators', 'easy', `Which method makes an object iterable?`,
    ['*[Symbol.iterator]()', 'next()', 'iterate()', 'forEach()'],
    `It must return an iterator with next().`);
  h('iterators', 'easy', `What does an iterator’s next() return?`,
    ['*An object { value, done }', 'The next value only', 'A promise', 'A boolean'],
    `done is true when the sequence ends.`);
  h('iterators', 'medium', `What happens when you call a generator function?`,
    ['*It returns a generator object without running the body', 'It runs to the first yield', 'It runs completely', 'It returns an array'],
    `The body starts on the first next().`);
  h('iterators', 'medium', `Are plain objects iterable with for…of?`,
    ['*No; use Object.entries(obj)', 'Yes, over values', 'Yes, over keys', 'Only frozen ones'],
    `They lack [Symbol.iterator].`);
  h('iterators', 'medium', `What does yield* other do?`,
    ['*Yields every value from another iterable', 'Yields the iterable as one value', 'Returns other', 'Pauses forever'],
    `Delegation is handy for recursion and wrapping.`);
  h('iterators', 'hard', `Which are lazy iterator helpers (ES2025)? (select all that apply)`,
    ['*map', '*filter', '*take', 'toArray', 'reduce'],
    `toArray, reduce, forEach, some, every and find consume the iterator.`);
  h('iterators', 'hard', `What happens to a generator’s finally block when a for…of loop breaks early?`,
    ['*It runs, because break calls return() on the iterator', 'It never runs', 'It runs on the next iteration', 'It throws'],
    `Cleanup code in generators is reliable.`);
  h('iterators', 'easy', `Which loop consumes an async iterable?`,
    ['*for await (const x of src)', 'for (const x of src)', 'for (const x in src)', 'while (await src.next())'],
    `Async generators and Node streams are async iterables.`);
  h('iterators', 'medium', `What does the first next(value) call do with value?`,
    ['*Ignores it; it only starts the generator', 'Becomes the first yield result', 'Becomes the return value', 'Throws'],
    `Values sent later become the result of the paused yield.`);
  h('iterators', 'medium', `Why is [...infiniteGenerator()] a problem?`,
    ['*Spread consumes until done, which never happens', 'Spread only takes 10 items', 'Generators can’t be spread', 'It returns undefined'],
    `Use .take(n).toArray() or break manually.`);
  h('iterators', 'easy', `Which built-ins are iterable? (select all that apply)`,
    ['*Map', '*String', '*Set', 'Plain object'],
    `Also arrays, typed arrays and arguments.`);
  h('iterators', 'medium', `What does Array.fromAsync (ES2026) do?`,
    ['*Collects an async iterable (or promises) into an array', 'Makes arrays async', 'Converts to a generator', 'Runs map in parallel threads'],
    `It's like Array.from but awaits each value.`);

  // ---------------- Chapter 14: modules ----------------
  h('modules', 'easy', `How many default exports can a module have?`,
    ['*At most one', 'Any number', 'Exactly one', 'None in Node'],
    `Named exports are unlimited.`);
  h('modules', 'easy', `Which is required in ESM import paths for local files?`,
    ['*The file extension, e.g. ./money.js', 'A leading /', 'Quotes are optional', 'The .mjs extension only'],
    `ESM never guesses extensions.`);
  h('modules', 'medium', `What are imported bindings?`,
    ['*Live, read-only views of the exporter’s variables', 'Copies made at import time', 'Writable globals', 'Promises'],
    `Changes made by the exporting module are visible to importers.`);
  h('modules', 'medium', `How often is a module’s top-level code executed when imported by 5 files?`,
    ['*Once', 'Five times', 'Once per import statement', 'Never'],
    `Modules are singletons per realm.`);
  h('modules', 'medium', `What does import() return?`,
    ['*A promise for the module namespace object', 'The module synchronously', 'A string', 'A generator'],
    `Dynamic import works in scripts and CommonJS too.`);
  h('modules', 'hard', `Which syntax imports JSON in modern Node/browsers (ES2025)?`,
    ['*import data from "./x.json" with { type: "json" }', 'import data from "./x.json" assert { type: "json" }', 'import json from "./x.json"', 'require.json("./x.json")'],
    `assert was the earlier, removed spelling.`);
  h('modules', 'medium', `What replaces __dirname in ES modules on Node?`,
    ['*import.meta.dirname', 'process.cwd()', 'module.dirname', '__dirname still works'],
    `import.meta.filename replaces __filename.`);
  h('modules', 'hard', `Which statements are true? (select all that apply)`,
    ['*export * from "./a.js" re-exports a’s named exports', '*export * as ns from "./a.js" re-exports a namespace', 'export * also re-exports the default export', 'Re-exports evaluate the module twice'],
    `Default exports must be re-exported explicitly.`);
  h('modules', 'easy', `Which package.json field makes .js files ES modules?`,
    ['*"type": "module"', '"module": true', '"esm": "yes"', '"main": "module"'],
    `Use .cjs for CommonJS files in such a package.`);
  h('modules', 'medium', `How do you use require() inside an ES module?`,
    ['*createRequire(import.meta.url) from node:module', 'It is global', 'import require from "require"', 'It is impossible'],
    `Usually you'd just import instead.`);
  h('modules', 'medium', `What does import.meta.main tell you in Node 24+?`,
    ['*Whether this module was the entry point run directly', 'The package main field', 'The main thread id', 'Whether it is in a worker'],
    `Like Python's if __name__ == "__main__".`);
  h('modules', 'easy', `What does import "./polyfills.js" do?`,
    ['*Runs the module for its side effects without importing names', 'Imports the default export', 'Imports everything as a namespace', 'Nothing'],
    `Used for setup or polyfills.`);

  // ---------------- Chapter 15: meta ----------------
  h('meta', 'easy', `What is a Proxy trap?`,
    ['*A handler function that intercepts an operation like get or set', 'A debugging breakpoint', 'An error type', 'A private field'],
    `Operations without a trap pass through to the target.`);
  h('meta', 'medium', `What is Reflect used for inside traps?`,
    ['*Performing the default behaviour of the operation', 'Logging', 'Creating symbols', 'Freezing objects'],
    `Reflect has one function per trap with matching arguments.`);
  h('meta', 'medium', `What method does a using declaration call at block exit?`,
    ['*[Symbol.dispose]()', 'close()', 'finalize()', 'return()'],
    `await using calls [Symbol.asyncDispose]().`);
  h('meta', 'medium', `In what order are several using resources disposed?`,
    ['*Reverse order of declaration', 'Declaration order', 'Random', 'Alphabetical'],
    `Like nested try/finally blocks.`);
  h('meta', 'hard', `What happens if both the block and a dispose method throw?`,
    ['*A SuppressedError is thrown containing both errors', 'Only the block’s error survives', 'Only the dispose error survives', 'The process exits'],
    `error is the newer error and suppressed the earlier one.`);
  h('meta', 'easy', `Which symbol controls conversion to numbers and strings?`,
    ['*Symbol.toPrimitive', 'Symbol.iterator', 'Symbol.toStringTag', 'Symbol.species'],
    `It receives a hint: "number", "string" or "default".`);
  h('meta', 'medium', `How does modern JavaScript garbage collection decide what to free?`,
    ['*Objects unreachable from roots are freed (mark-and-sweep)', 'Objects with zero references only, so cycles leak', 'Objects older than a minute', 'Only when you call gc()'],
    `Cycles are collected if nothing reachable points at them.`);
  h('meta', 'hard', `Which are common causes of memory leaks? (select all that apply)`,
    ['*Forgotten setInterval callbacks', '*Listeners never removed', '*Unbounded caches in a Map', 'Local variables in short functions'],
    `Leaks are references you forgot to drop.`);
  h('meta', 'medium', `Why shouldn’t program logic depend on FinalizationRegistry callbacks?`,
    ['*Their timing is up to the engine and they may never run', 'They run synchronously', 'They throw errors', 'They are deprecated'],
    `Use them only for optimisations.`);
  h('meta', 'easy', `What does Symbol.for("app.id") === Symbol.for("app.id") return?`,
    ['*true', 'false', 'TypeError', 'undefined'],
    `Symbol.for uses a global registry; Symbol() always creates a new symbol.`);
  h('meta', 'medium', `What does Proxy.revocable return?`,
    ['*{ proxy, revoke }', 'A frozen proxy', 'A WeakRef', 'A promise'],
    `After revoke(), any operation on the proxy throws TypeError.`);
  h('meta', 'hard', `Why can private #fields fail through a Proxy of a class instance?`,
    ['*Methods run with this = proxy, which lacks the private field', 'Proxies copy objects', 'Private fields are enumerable', 'Reflect hides them'],
    `Brand checks see the proxy, not the target.`);

  // ---------------- Chapter 16: project ----------------
  h('project', 'easy', `Why does the order processor reserve stock before charging?`,
    ['*So concurrent orders can’t sell the same copies during the slow payment', 'Payments need stock ids', 'It is faster', 'To avoid using async'],
    `Reserve, then charge, then roll back on failure.`);
  h('project', 'medium', `What happens to reserved stock when payment fails?`,
    ['*It is released in the catch block (rollback)', 'It stays reserved', 'It is deleted', 'The process exits'],
    `Every recorded reservation is released.`);
  h('project', 'medium', `Which errors are retried by withRetry?`,
    ['*Only errors marked with cause.retryable', 'All errors', 'Only TypeErrors', 'None'],
    `Declined cards aren't retried.`);
  h('project', 'medium', `Why does processAll use an async generator?`,
    ['*To stream each result as soon as it’s ready while limiting concurrency', 'Generators are faster', 'To avoid promises', 'Because for…of requires it'],
    `for await consumes results incrementally.`);
  h('project', 'hard', `Why are unexpected errors (bugs) re-thrown in processOrder?`,
    ['*So they surface instead of being hidden as failed orders', 'To retry them', 'To log them twice', 'Because ShopError requires it'],
    `Only ShopError subclasses become failed results.`);
  h('project', 'easy', `Which Node API parses --verbose and -c 3 in cli.js?`,
    ['*util.parseArgs', 'process.args', 'yargs', 'commander'],
    `Built in, no dependency needed.`);
  h('project', 'medium', `How do the tests check the concurrency limit?`,
    ['*By injecting a fake pay function that counts calls in flight', 'By measuring wall time', 'By reading Node internals', 'They don’t'],
    `Dependency injection makes behaviour observable.`);
  h('project', 'easy', `Why are progress messages written with console.error?`,
    ['*stderr keeps stdout clean for the report', 'They are errors', 'console.log is slower', 'To change colours'],
    `Redirecting stdout then captures only the report.`);
  h('project', 'medium', `How is the catalog loaded in cli.js?`,
    ['*As a JSON module with import attributes', 'With require()', 'With fetch', 'With eval'],
    `with { type: "json" }.`);
  h('project', 'hard', `Which design choices protect stock consistency? (select all that apply)`,
    ['*#stock is private and changed only via reserve/release', '*Rollback releases every recorded reservation', '*Reservation happens before the slow payment', 'Retrying declined cards'],
    `Retries are about transient gateway errors, not consistency.`);
  h('project', 'medium', `What does AbortSignal.timeout(timeoutMs) cap in processOrder?`,
    ['*The total time for all payment attempts of one order', 'Each attempt separately', 'The whole batch', 'Nothing in tests'],
    `One signal is shared by the retries.`);
  h('project', 'easy', `What runs main() only when cli.js is executed directly?`,
    ['*if (import.meta.main)', 'if (require.main === module)', 'if (process.main)', 'export default main'],
    `Tests can import cli.js without running it.`);

  // ---------------- Appendix A: es5 ----------------
  h('es5', 'easy', `What is the scope of a var declared inside a for loop?`,
    ['*The whole enclosing function', 'The loop block', 'The loop iteration', 'Global always'],
    `let would be block scoped.`);
  h('es5', 'easy', `What was an IIFE used for?`,
    ['*Creating a private scope before modules existed', 'Running code asynchronously', 'Defining classes', 'Importing files'],
    `Immediately Invoked Function Expression.`);
  h('es5', 'medium', `Why did ES5 code write var self = this?`,
    ['*Inner callbacks have their own this, so the outer one was saved', 'To copy the object', 'To make this global', 'Strict mode required it'],
    `Arrow functions make it unnecessary.`);
  h('es5', 'medium', `In ES5, where were shared methods of a "class" defined?`,
    ['*On the constructor’s prototype object', 'Inside the constructor on this', 'On the global object', 'In a closure'],
    `Constructor.prototype.method = function () {…}.`);
  h('es5', 'hard', `Why does ES5 inheritance set Child.prototype.constructor = Child?`,
    ['*Object.create(Parent.prototype) leaves constructor pointing at Parent', 'It makes instanceof work', 'It enables super', 'It is required syntax'],
    `class extends sets this up automatically.`);
  h('es5', 'medium', `What is the error-first callback convention?`,
    ['*callback(err, result) with err null on success', 'callback(result, err)', 'Throwing before calling back', 'Returning errors from callbacks'],
    `promisify turns such APIs into promises.`);
  h('es5', 'easy', `What is the modern replacement for arguments?`,
    ['*Rest parameters (...args)', 'this.args', 'Function.args', 'Spread in calls'],
    `Rest gives a real array and works in arrows.`);
  h('es5', 'medium', `What is wrong with x = x || 10 for a quantity?`,
    ['*It replaces a valid 0 with 10', 'It is a syntax error', 'It always returns 10', 'It is slower'],
    `Use a default parameter or x ?? 10.`);
  h('es5', 'hard', `Which ES5 idioms have direct modern replacements? (select all that apply)`,
    ['*indexOf(x) !== -1 → includes(x)', '*"a" + b → template literals', '*callbacks → async/await', 'prototype chains → removed entirely'],
    `Classes still use the prototype chain underneath.`);
  h('es5', 'easy', `What does ES5 code use instead of let for block-local values?`,
    ['*var, often inside an IIFE', 'const', 'block', 'local'],
    `ES5 has no block scope for variables.`);
  h('es5', 'medium', `What did ES5 use to copy own properties of an object?`,
    ['*A for…in loop with hasOwnProperty checks', 'Spread syntax', 'structuredClone', 'Object.fromEntries'],
    `Spread and Object.assign came in ES2015/2018.`);
  h('es5', 'medium', `What does calling a constructor function without new do in sloppy mode?`,
    ['*Sets properties on the global object and returns undefined', 'Throws TypeError', 'Returns a new object anyway', 'Returns null'],
    `Classes throw instead.`);

  // ---------------- Appendix B: tooling ----------------
  h('tooling', 'easy', `Which command runs a package’s "test" script?`,
    ['*npm test', 'npm run-tests', 'node test', 'npm exec test'],
    `npm start is the other built-in shortcut.`);
  h('tooling', 'easy', `What does node -p "1 + 1" do?`,
    ['*Evaluates the expression and prints 2', 'Prints the code', 'Starts the REPL', 'Runs a file named 1 + 1'],
    `-e evaluates without printing.`);
  h('tooling', 'medium', `What does "^1.4.2" allow?`,
    ['*>=1.4.2 and <2.0.0', '>=1.4.2 and <1.5.0', 'Exactly 1.4.2', 'Any version'],
    `~1.4.2 allows only patch updates.`);
  h('tooling', 'medium', `Why use npm ci in CI pipelines?`,
    ['*It installs exactly what package-lock.json records, from a clean slate', 'It is the only command that works offline', 'It updates dependencies', 'It skips devDependencies always'],
    `Reproducible builds.`);
  h('tooling', 'medium', `Which is better for setting a failure exit code: process.exitCode = 1 or process.exit(1)?`,
    ['*process.exitCode = 1, so pending output is flushed', 'process.exit(1), it is faster', 'They are identical', 'Neither works in ESM'],
    `exit() stops immediately.`);
  h('tooling', 'easy', `What does node --test run?`,
    ['*Test files such as *.test.js using the built-in runner', 'npm test', 'ESLint', 'Only files in /test'],
    `Combine with --watch for re-runs.`);
  h('tooling', 'hard', `Which belong in devDependencies? (select all that apply)`,
    ['*Test frameworks', '*Linters and formatters', 'A runtime HTTP client used by the app', 'A database driver used in production'],
    `devDependencies aren't needed at run time.`);
  h('tooling', 'medium', `What is process.argv[2] for node app.js --fast?`,
    ['*"--fast"', '"app.js"', '"node"', 'undefined'],
    `Index 0 is node, 1 is the script.`);
  h('tooling', 'easy', `Which flag pauses Node at the first line for a debugger?`,
    ['*--inspect-brk', '--debug-first', '--pause', '--trace'],
    `Then open chrome://inspect.`);
  h('tooling', 'medium', `Which Node release lines become LTS?`,
    ['*Even-numbered ones', 'Odd-numbered ones', 'Every release', 'Only x.0 releases'],
    `Use the active LTS in production.`);
  h('tooling', 'medium', `What does --env-file=.env do?`,
    ['*Loads KEY=value lines into process.env', 'Creates a .env file', 'Encrypts environment variables', 'Sets NODE_ENV only'],
    `Built into Node 20.6+.`);
  h('tooling', 'hard', `Which assertions compare deeply? (select all that apply)`,
    ['*assert.deepEqual from node:assert/strict', '*assert.deepStrictEqual', 'assert.equal', 'assert.ok'],
    `In strict mode deepEqual is deepStrictEqual.`);
}
