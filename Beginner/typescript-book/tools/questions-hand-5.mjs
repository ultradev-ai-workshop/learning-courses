// Hand-written questions, part 5: a second, harder pass over every chapter.
export function part5(h) {
  h('why', 'hard', 'Which statement about TypeScript and runtime performance is true?', ['*The emitted code runs at the same speed as equivalent hand-written JavaScript', 'TypeScript code runs about 10× faster', 'Type annotations slow the program down', 'TypeScript adds runtime checks that cost time'], 'TS 7 made the compiler faster, not your program.');
  h('why', 'medium', 'Which is NOT a good reason to adopt TypeScript?', ['*To validate API input automatically at runtime', 'Safer refactoring across many files', 'Better editor autocomplete', 'Catching typos before running'], 'Runtime validation still needs code or a schema library.');
  h('why', 'medium', 'What does the editor use to show TypeScript errors as you type?', ['*The same compiler, through the TypeScript language service', 'A separate linter', 'Node.js', 'The browser'], 'Editor and tsc report the same errors when they use the same version.');
  h('why', 'hard', 'A colleague says "TypeScript is a different language, so our JS skills are wasted." What is the best answer?', ['*TypeScript is JavaScript plus types: all runtime knowledge carries over', 'They are right; it must be learned from scratch', 'TypeScript replaces JavaScript runtimes', 'Only syntax carries over'], 'The runtime semantics are exactly JavaScript\'s.');
  h('why', 'easy', 'What happens to an interface declaration in the emitted JavaScript?', ['*It disappears completely', 'It becomes a class', 'It becomes an object', 'It becomes a comment'], 'Interfaces are types only.');

  h('basics', 'hard', 'Which is true about `tsc` exit codes?', ['*Non-zero when there are errors, even though files were emitted', 'Always 0 if files were emitted', 'Always non-zero in watch mode', 'Exit codes are not used'], 'CI relies on the non-zero exit code.');
  h('basics', 'medium', 'Which value of target is the default in TypeScript 7?', ['*The newest (esnext)', 'es5', 'es2015', 'es2020'], 'Pick the oldest runtime you support explicitly.');
  h('basics', 'medium', 'Which statement about annotating local variables is right?', ['*Only annotate when there is no initial value or inference is too narrow/wide', 'Always annotate every variable', 'Never annotate variables', 'Annotations are required under strict'], 'Repeating the inferred type adds noise.');
  h('basics', 'hard', 'With strict off, what is the type of an untyped parameter?', ['*any (silently)', 'unknown', 'never', 'An error'], 'noImplicitAny turns this into TS7006.');
  h('basics', 'medium', 'What is the purpose of `tsc --init`?', ['*Create a commented starter tsconfig.json', 'Install TypeScript', 'Initialise a git repo', 'Create a package.json'], 'In TS 7 it writes a strict, modern config.');

  h('everyday', 'hard', 'Why does `["b1", 2]` not fit `string[] | number[]`?', ['*Its type is (string | number)[], which matches neither member', 'Arrays can\'t be unions', 'Because 2 is a literal', 'It does fit'], 'Array of unions ≠ union of arrays.');
  h('everyday', 'medium', 'Which statement about bigint is true?', ['*It is a separate primitive for arbitrarily large integers, written like 100n', 'It is an alias for number', 'It is a TypeScript-only type', 'It allows decimals'], 'number and bigint can\'t be mixed without conversion.');
  h('everyday', 'medium', 'When does `as` refuse to compile?', ['*When the two types can\'t possibly overlap, like string to number', 'Never', 'Always for any', 'When used on JSON'], 'Forcing it with as unknown as T is lying to the compiler.');
  h('everyday', 'easy', 'What is a type alias?', ['*A name for any type, created with type Name = ...', 'A new runtime type', 'A class', 'An interface that can be merged'], 'Aliases don\'t create new, distinct types.');

  h('narrowing', 'hard', 'Which check narrows `x: string[] | string` to string[]?', ['*Array.isArray(x)', 'typeof x === "object" && x', 'x instanceof String', '"length" in x'], 'Array.isArray is a built-in type guard.');
  h('narrowing', 'medium', 'What does a user-defined type guard return at runtime?', ['*A boolean', 'The narrowed value', 'A type', 'Nothing'], 'The `x is T` part exists only for the checker.');
  h('narrowing', 'hard', 'Why is `function isBook(v: unknown): v is Book { return true; }` dangerous?', ['*TypeScript trusts the predicate without checking its body', 'It doesn\'t compile', 'It throws', 'It narrows to never'], 'A wrong predicate is as unsafe as as.');
  h('narrowing', 'medium', 'Inside `if (x === y)` with x: string | number and y: string | boolean, what is x?', ['*string', 'string | number', 'number', 'never'], 'Equal values must share a type.');
  h('narrowing', 'medium', 'What does narrowing by assignment mean?', ['*After x = 1, x is number until the next assignment', 'Variables can\'t be reassigned', 'Assignments widen types', 'It only works for const'], 'The declared type still limits what you may assign.');

  h('functions', 'hard', 'Why should a function declaration that only throws be annotated `: never`?', ['*Its inferred type is void, so control flow analysis wouldn\'t know code after it is unreachable', 'It doesn\'t compile otherwise', 'For performance', 'Arrow functions need it'], 'Function expressions and arrows that only throw infer never.');
  h('functions', 'medium', 'How do you type a function that accepts any number of numbers?', ['*(...nums: number[]) => number', '(nums: number...) => number', '(number[]) => number', '(...number) => number'], 'Rest parameters use array or tuple types.');
  h('functions', 'medium', 'Which overload order is correct?', ['*Specific overloads first, general ones last', 'General first', 'Alphabetical', 'Order doesn\'t matter'], 'TypeScript picks the first matching overload.');
  h('functions', 'hard', 'What is the type of a function that takes another function and returns a function with the same parameters?', ['*<A extends unknown[], R>(fn: (...a: A) => R) => (...a: A) => R', '(fn: Function) => Function', '(fn: any) => any', '<T>(fn: T) => void'], 'Tuple type parameters capture whole parameter lists.');

  h('objects', 'hard', 'Which declaration makes a nested config fully immutable in types?', ['*A recursive DeepReadonly type', 'Readonly<T>', 'as const on the type', 'readonly on the outer property'], 'Readonly is shallow.');
  h('objects', 'medium', 'What does `[string, number?]` describe?', ['*A tuple whose second element is optional', 'An array of strings and numbers', 'A required pair', 'An invalid type'], 'Its length is 1 | 2.');
  h('objects', 'medium', 'Can interfaces extend multiple interfaces?', ['*Yes: interface C extends A, B {}', 'No, only one', 'Only with &', 'Only classes can'], 'Conflicting properties are reported.');
  h('objects', 'medium', 'Which describes a function property in an object type?', ['*onSave: (id: string) => void', 'onSave(): function', 'onSave: Function<string>', 'function onSave'], 'Or a method signature onSave(id: string): void.');

  h('classes', 'hard', 'Why can a class instance with a public field `name` be passed to `function greet(x: { name: string })`?', ['*Its instance type has the required member', 'Classes are converted to objects', 'greet accepts any', 'Only because of implements'], 'Structural typing applies to class instances.');
  h('classes', 'medium', 'Which keyword declares a member that subclasses must implement?', ['*abstract', 'virtual', 'override', 'interface'], 'Only allowed in abstract classes.');
  h('classes', 'medium', 'Can an interface describe a class\'s static side?', ['*Yes, with a construct signature and static members on a separate type', 'No', 'Only with implements static', 'Only for abstract classes'], 'implements checks only the instance side.');
  h('classes', 'hard', 'What is printed by `class A { x = 1 } console.log(JSON.stringify(new A()))` when x is declared `private`?', ['*{"x":1}', '{}', 'An error', 'undefined'], 'private is compile-time only.');

  h('generics', 'hard', 'What does `function f<T>(x: T): T` infer for `f(["a", 1])`?', ['*(string | number)[]', '[string, number]', 'any[]', 'unknown'], 'Arrays widen unless a const type parameter is used.');
  h('generics', 'medium', 'Can a type parameter have both a constraint and a default?', ['*Yes: <T extends object = {}>', 'No', 'Only in classes', 'Only in interfaces'], 'The default must satisfy the constraint.');
  h('generics', 'medium', 'Which signature correctly types a typed event emitter\'s on method?', ['*on<E extends keyof Events>(name: E, fn: (p: Events[E]) => void): void', 'on(name: string, fn: Function): void', 'on<E>(name: E, fn: any): void', 'on(name: keyof any, fn: () => void): void'], 'The payload type follows the event name.');

  h('keyof', 'hard', 'What is keyof of a union `keyof (A | B)`?', ['*Only the keys common to A and B', 'All keys of A and B', 'never', 'string'], 'You can only safely access keys every member has.');
  h('keyof', 'medium', 'What does `typeof import("./catalog.js")` give?', ['*The type of the module namespace object', 'A string', 'The file path', 'An error'], 'Useful for typing dynamic imports.');
  h('keyof', 'medium', 'Which gives the type of the second parameter of fn?', ['*Parameters<typeof fn>[1]', 'typeof fn[1]', 'keyof fn[1]', 'fn["1"]'], 'Indexed access on the Parameters tuple.');

  h('conditional', 'hard', 'What does `T extends unknown ? Box<T> : never` do for a union T?', ['*Wraps each member in its own Box (distribution)', 'Returns one Box of the union', 'Returns never', 'Is a syntax error'], 'A common trick to force distribution.');
  h('conditional', 'medium', 'What does Awaited<T> do that a simple Promise<infer V> pattern doesn\'t?', ['*Unwraps nested promises and thenables recursively', 'Unwraps arrays', 'Runs the promise', 'Nothing more'], 'It models what await really does.');
  h('conditional', 'medium', 'Which utility is NOT built with a conditional type?', ['*Pick', 'Exclude', 'NonNullable (in older versions)', 'ReturnType'], 'Pick is a mapped type.');

  h('mapped', 'hard', 'What does a mapped type over keyof T do with T\'s optional properties by default?', ['*Keeps them optional (homomorphic mapping)', 'Makes them required', 'Removes them', 'Turns them into never'], 'Add -? to remove the modifier.');
  h('mapped', 'medium', 'Which mapped type turns every property into a function returning it?', ['*{ [K in keyof T]: () => T[K] }', '{ [K in T]: () => K }', '{ [K: keyof T]: Function }', 'Record<T, Function>'], 'Indexed access T[K] gives each property type.');
  h('mapped', 'medium', 'How do you build a union of event names "onBorrow" | "onReturn" from "borrow" | "return"?', ['*`on${Capitalize<E>}`', '"on" + E', 'Uppercase<E>', 'keyof E'], 'Template literal types map over unions.');

  h('utility', 'hard', 'What is `Partial<Readonly<T>>` compared with `Readonly<Partial<T>>`?', ['*Equivalent: both make every property readonly and optional', 'The first is deep', 'The second is invalid', 'They are opposites'], 'Modifier mappings compose.');
  h('utility', 'medium', 'Which utility type would you use for a function that patches a record?', ['*Partial<T>', 'Required<T>', 'Pick<T, never>', 'Record<string, T>'], 'Callers pass only the changed fields.');
  h('utility', 'medium', 'What does Extract<Shape, { kind: "circle" }> give for a discriminated union Shape?', ['*The circle member of the union', 'never', 'Shape', '{ kind: "circle" }'], 'Members assignable to { kind: "circle" } are kept.');

  h('enums', 'hard', 'How many keys does Object.keys return for `enum D { Up, Down }`?', ['*4', '2', '0', '1'], 'Numeric enums include reverse-mapping keys "0" and "1".');
  h('enums', 'medium', 'What does a declare enum (ambient enum) emit?', ['*Nothing: it describes an enum that exists elsewhere', 'A full object', 'A const enum', 'A union'], 'Ambient declarations never emit code.');
  h('enums', 'medium', 'What is the inferred yield type of `function* ids() { yield "b1"; yield "b2"; }`?', ['*"b1" | "b2"', 'string', 'Generator', 'void'], 'The yield type is the union of the yielded expression types; here two string literals.');

  h('compat', 'hard', 'Why is `const x: {} = "text"` allowed?', ['*{} means "any non-nullish value", and strings have no missing members', '{} means object only', 'It is not allowed', 'Because of any'], 'Use object or Record<string, unknown> for objects.');
  h('compat', 'medium', 'Which type accepts every value except null and undefined?', ['*{}', 'object', 'unknown', 'any'], 'object excludes primitives; unknown includes nullish values.');
  h('compat', 'medium', 'Is `(x: unknown) => void` assignable to `(x: string) => void`?', ['*Yes: it accepts more', 'No', 'Only with strict off', 'Only for methods'], 'Contravariant parameters.');
  h('compat', 'hard', 'Is `() => "a"` assignable to `() => string | number`?', ['*Yes: return types may be more specific', 'No', 'Only with as', 'Only for arrow functions'], 'Return types are covariant.');

  h('modules', 'hard', 'Why should libraries avoid augmenting built-ins like Array in their public types?', ['*It changes the types for every consumer\'s whole program', 'It doesn\'t compile', 'It breaks tree shaking', 'It is removed in TS 7'], 'Prefer plain functions.');
  h('modules', 'medium', 'Which file extension is always ESM under nodenext?', ['*.mts', '.cts', '.ts', '.d.ts'], '.cts is always CommonJS; .ts follows package.json "type".');
  h('modules', 'medium', 'What does `export =` belong to?', ['*CommonJS-style module declarations', 'ES modules', 'Namespaces only', 'Barrel files'], 'Mostly seen in older .d.ts files.');

  h('decorators', 'hard', 'What does a class decorator that returns a new class do?', ['*Replaces the decorated class with the returned one', 'Adds the class to a registry', 'Throws', 'Nothing'], 'Usually you return a subclass or nothing.');
  h('decorators', 'medium', 'Where do decorators appear in the capstone reference?', ['*@traced on LoanService.borrow and giveBack', 'On every class', 'Nowhere', 'On the tests'], 'It logs each call with its arguments.');
  h('decorators', 'medium', 'Can decorators be used on plain functions (not class members)?', ['*No, only on classes and class members', 'Yes, anywhere', 'Only on arrow functions', 'Only in .d.ts files'], 'The proposal covers classes and their elements.');

  h('declarations', 'hard', 'Why does `types: []` (the TS 7 default) not stop `import express from "express"` from being typed?', ['*types only limits global @types packages; imported packages are always resolved', 'It does stop it', 'express has no types', 'Because of skipLibCheck'], 'The import pulls in @types/express automatically.');
  h('declarations', 'medium', 'What is a triple-slash directive like `/// <reference types="node" />`?', ['*An old way to include declarations in a file', 'A comment style', 'An import of a JS file', 'A test directive'], 'Mostly replaced by imports and the types option.');
  h('declarations', 'medium', 'What does `export declare function f(): void;` in a .d.ts mean?', ['*The module exports a function f that is implemented in JavaScript', 'f is declared but never exported', 'f must be implemented in the .d.ts', 'f is deprecated'], 'Generated declarations use declare everywhere.');

  h('config', 'hard', 'Why might a file get different errors in the editor than in `npm run check`?', ['*The editor uses the nearest tsconfig.json and possibly another TS version', 'Editors don\'t use TypeScript', 'npm run check is always wrong', 'Because of source maps'], 'Open the project root and use the workspace TypeScript version.');
  h('config', 'medium', 'Which option enables faster rebuilds for a single project?', ['*incremental', 'composite', 'watch', 'skipLibCheck'], 'It writes a .tsbuildinfo file.');
  h('config', 'medium', 'Which option includes JavaScript files in the program?', ['*allowJs', 'checkJs', 'jsx', 'module'], 'checkJs additionally type-checks them.');

  h('project', 'hard', 'Why does the capstone build with tsc instead of running .ts files directly?', ['*Every run is type-checked and .d.ts files are produced', 'Node can\'t run TypeScript', 'tsc is faster', 'Decorators need Node 26'], 'Exercise 8 shows how to run it with type stripping too.');
  h('project', 'medium', 'Which chapter tool keeps the report formatter for each column correctly typed?', ['*The Columns<T> mapped type', 'An enum', 'A namespace', 'A decorator'], 'format receives T[K] for its column.');
  h('project', 'medium', 'What did `npm run check:start` (checkJs on the JS app) report first?', ['*Errors caused by default parameter values typing callbacks too narrowly', 'The memberID typo', 'Missing semicolons', 'Nothing'], 'The typo was found after adding types in step 2.');

  h('javacs', 'hard', 'How do you make a TypeScript class compare by name like a Java class?', ['*Add a private or #private member (or a brand)', 'Add implements', 'Make it abstract', 'Use a namespace'], 'Private members make classes nominal.');
  h('javacs', 'medium', 'Which TypeScript construct replaces Java\'s `instanceof Interface` checks?', ['*A type guard that checks the shape', 'instanceof with the interface', 'typeof Interface', 'A cast'], 'Interfaces don\'t exist at runtime.');
  h('javacs', 'medium', 'Is method overloading by signature with separate bodies supported?', ['*No: overload signatures share one implementation', 'Yes, like Java', 'Only in classes', 'Only for constructors'], 'Check the arguments in the single body.');

  h('tooling', 'hard', 'Why are type-stripping runners fast?', ['*They skip type checking and only delete types', 'They use the Go compiler', 'They cache results', 'They run in parallel'], 'Keep tsc --noEmit as the spell checker.');
  h('tooling', 'medium', 'Which file holds a flat ESLint configuration for typescript-eslint?', ['*eslint.config.mjs', '.eslintrc.ts', 'tsconfig.json', 'package.json "lint"'], 'Using tseslint.config(...).');
  h('tooling', 'medium', 'Which release cadence does TypeScript roughly follow?', ['*A minor release about every three months', 'One release a year', 'Weekly releases', 'No fixed cadence'], 'Read the release notes before upgrading.');

  h('config', 'medium', 'Which option is NOT part of the strict family?', ['*noUnusedLocals', 'noImplicitThis', 'strictFunctionTypes', 'alwaysStrict'], 'noUnusedLocals and noUnusedParameters are separate style checks.');
  h('config', 'easy', 'Which file should list "typescript" as a devDependency?', ['*package.json', 'tsconfig.json', '.npmrc', 'README.md'], 'Pin the version there so everyone uses the same compiler.');
  h('config', 'hard', 'What does `"types": ["node"]` NOT do?', ['*Install @types/node', 'Load Node\'s global types such as process', 'Limit global type packages to node', 'Make Buffer available to the checker'], 'You still need npm install -D @types/node.');
  h('config', 'medium', 'What does the jsx option set by tsc --init mean if you don\'t use JSX?', ['*Nothing harmful; you can remove it', 'Your code must be React', 'Files must end in .tsx', 'It enables DOM types'], 'It only affects .tsx files.');
  h('modules', 'medium', 'What does `import "./polyfills.js";` (a side-effect import) do?', ['*Runs the module for its side effects without importing names', 'Imports only types', 'Is an error', 'Imports the default export'], 'noUncheckedSideEffectImports checks that such paths resolve.');
  h('modules', 'hard', 'Why is a namespace containing only types erasable while one with values isn\'t?', ['*Type-only namespaces emit nothing; value namespaces emit an object', 'All namespaces emit nothing', 'All namespaces emit objects', 'Namespaces are always errors in TS 7'], 'erasableSyntaxOnly allows type-only namespaces.');
  h('tooling', 'medium', 'Which statement about TypeScript 7 and editors is true?', ['*Editors get faster responses from the native compiler', 'Editors no longer show errors', 'VS Code needs a plugin to use TS 7', 'TS 7 removed the language service'], 'The language service is powered by the same native compiler.');
  h('tooling', 'hard', 'A tool says "Cannot find module typescript" after upgrading to 7.0. What is the likely cause?', ['*It loads TypeScript\'s JavaScript API, which 7.0 doesn\'t provide stably; give it TypeScript 6', 'TS 7 renamed the package', 'Node is too old', 'The tsconfig is invalid'], 'Install @typescript/typescript6 or follow the tool\'s upgrade notes.');
  h('narrowing', 'easy', 'Which operator safely reads a property of a possibly undefined value?', ['*?.', '!.', '??', '&&='], 'Optional chaining returns undefined instead of throwing.');
  h('declarations', 'easy', 'Which npm scope holds DefinitelyTyped packages?', ['*@types', '@typescript', '@definitely', '@ts'], 'e.g. @types/node, @types/express.');
  h('objects', 'easy', 'Which type describes an object with any string keys and number values?', ['*Record<string, number>', 'Map<number>', 'object<number>', 'number{}'], 'Equivalent to { [key: string]: number }.');
  h('generics', 'easy', 'What is T in `Array<T>` called?', ['*A type parameter', 'A generic constraint', 'An index signature', 'A template literal'], 'Filled in by a type argument such as string.');
}
