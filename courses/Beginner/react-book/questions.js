// Generated from questions.json by tools/make-questions-js.mjs. Do not edit.
window.QUESTION_BANK = {
 "version": 1,
 "generated": "2026-10-30",
 "total": 1000,
 "questions": [
  {
   "id": 1,
   "topic": "js",
   "difficulty": "easy",
   "question": "What is the difference between const and let?",
   "options": [
    "const makes objects and arrays completely unchangeable",
    "A const variable cannot be reassigned; a let variable can",
    "let is only allowed inside functions",
    "There is no difference"
   ],
   "answer": [
    1
   ],
   "explanation": "const prevents reassignment of the variable. The object or array it points to can still be changed."
  },
  {
   "id": 2,
   "topic": "js",
   "difficulty": "easy",
   "question": "Is this code allowed?",
   "code": "const items = [];\nitems.push(1);",
   "options": [
    "Yes: const stops reassignment, not mutation of the array",
    "Only if the array is empty",
    "No: you cannot push into a const array",
    "Only in strict mode"
   ],
   "answer": [
    0
   ],
   "explanation": "const blocks `items = somethingElse`, but you can still call methods like push on the same array."
  },
  {
   "id": 3,
   "topic": "js",
   "difficulty": "medium",
   "question": "How do you return an object literal from an arrow function in one line?",
   "options": [
    "() => [name: 'Asha']",
    "() => ({ name: 'Asha' })",
    "() => { name: 'Asha' }",
    "() => return { name: 'Asha' }"
   ],
   "answer": [
    1
   ],
   "explanation": "Wrap the object in parentheses. Otherwise the braces are read as a function body."
  },
  {
   "id": 4,
   "topic": "js",
   "difficulty": "easy",
   "question": "Which syntax creates a template literal?",
   "options": [
    "\"Hello, {name}!\"",
    "`Hello, {{name}}!`",
    "`Hello, ${name}!`",
    "'Hello, ${name}!'"
   ],
   "answer": [
    2
   ],
   "explanation": "Template literals use backticks and ${...} for embedded expressions."
  },
  {
   "id": 5,
   "topic": "js",
   "difficulty": "easy",
   "question": "What is `{ name }` shorthand for in an object literal?",
   "options": [
    "{ name: name }",
    "[name]",
    "{ \"name\": \"name\" }",
    "{ name: undefined }"
   ],
   "answer": [
    0
   ],
   "explanation": "Shorthand property names use the variable name as both the key and the value."
  },
  {
   "id": 6,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does `...` do in `function sum(...nums) {}`?",
   "options": [
    "Spreads nums into separate arguments",
    "Makes nums optional",
    "Collects all the arguments into an array (rest parameter)",
    "Copies the function"
   ],
   "answer": [
    2
   ],
   "explanation": "In a parameter list, ... is the rest syntax: it gathers the remaining arguments into an array."
  },
  {
   "id": 7,
   "topic": "js",
   "difficulty": "easy",
   "question": "Which of these are falsy in JavaScript? (select all that apply)",
   "options": [
    "[] (an empty array)",
    "'0' (a string)",
    "'' (an empty string)",
    "null",
    "0"
   ],
   "answer": [
    2,
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Empty arrays and objects are truthy."
  },
  {
   "id": 8,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the difference between `a ?? b` and `a || b`?",
   "options": [
    "?? falls back to b only when a is null or undefined; || falls back for any falsy a",
    "|| only works with booleans",
    "?? only works with numbers",
    "They are identical"
   ],
   "answer": [
    0
   ],
   "explanation": "?? (nullish coalescing) keeps values like 0 and '', which || would replace."
  },
  {
   "id": 9,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does `user?.address?.city` return when user is null?",
   "options": [
    "undefined",
    "''",
    "null",
    "It throws a TypeError"
   ],
   "answer": [
    0
   ],
   "explanation": "Optional chaining stops and returns undefined when the value on its left is null or undefined."
  },
  {
   "id": 10,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does `===` check?",
   "options": [
    "Only the type",
    "Whether two variables have the same name",
    "Equality of value AND type, without type conversion",
    "Equality after converting types"
   ],
   "answer": [
    2
   ],
   "explanation": "Strict equality never converts types: '5' === 5 is false."
  },
  {
   "id": 11,
   "topic": "js",
   "difficulty": "medium",
   "question": "Why is `{ a: 1 } === { a: 1 }` false?",
   "options": [
    "Because === converts them to strings first",
    "Objects are compared by reference, and these are two different objects",
    "It is actually true",
    "Because object keys are unordered"
   ],
   "answer": [
    1
   ],
   "explanation": "Two separately created objects are never === to each other, even if their contents match. React relies on this to detect changes."
  },
  {
   "id": 12,
   "topic": "js",
   "difficulty": "easy",
   "question": "What is the key difference between map() and forEach()?",
   "options": [
    "map() changes the original array",
    "map() returns a new array; forEach() returns undefined",
    "There is no difference",
    "forEach() is faster and returns a new array"
   ],
   "answer": [
    1
   ],
   "explanation": "Use map when you want a transformed array, for example to turn data into JSX."
  },
  {
   "id": 13,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does fetch(url) return?",
   "options": [
    "undefined until the data arrives",
    "A string of HTML",
    "A Promise that resolves to a Response object",
    "The JSON data directly"
   ],
   "answer": [
    2
   ],
   "explanation": "You usually call res.json(), which returns another Promise, to get the parsed data."
  },
  {
   "id": 14,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does `await` do inside an async function?",
   "options": [
    "Makes the code run twice",
    "Blocks the entire browser",
    "Pauses that function until the Promise settles, then gives you its value",
    "Converts a value into a Promise and returns immediately"
   ],
   "answer": [
    2
   ],
   "explanation": "await pauses only the async function. The rest of the page keeps running."
  },
  {
   "id": 15,
   "topic": "js",
   "difficulty": "hard",
   "question": "What is a closure?",
   "options": [
    "A function that remembers the variables from the place where it was created",
    "A private class field",
    "A way to end a loop early",
    "A function that closes the browser tab"
   ],
   "answer": [
    0
   ],
   "explanation": "Event handlers in React are closures: they remember the props and state of the render that created them."
  },
  {
   "id": 16,
   "topic": "js",
   "difficulty": "easy",
   "question": "Which import matches `export default function Card() {}`?",
   "options": [
    "import * as Card from './Card'",
    "import Card from './Card'",
    "import { Card } from './Card'",
    "require Card from './Card'"
   ],
   "answer": [
    1
   ],
   "explanation": "Default exports are imported without braces, and you can choose any name."
  },
  {
   "id": 17,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these return a new array and leave the original unchanged? (select all that apply)",
   "options": [
    "push",
    "splice",
    "map",
    "filter",
    "slice"
   ],
   "answer": [
    2,
    3,
    4
   ],
   "explanation": "push and splice change the original array. map, filter and slice return new ones."
  },
  {
   "id": 18,
   "topic": "setup",
   "difficulty": "easy",
   "question": "What is React?",
   "options": [
    "A JavaScript library for building user interfaces",
    "A programming language",
    "A CSS framework",
    "A database"
   ],
   "answer": [
    0
   ],
   "explanation": "React builds UIs out of components."
  },
  {
   "id": 19,
   "topic": "setup",
   "difficulty": "easy",
   "question": "Which command creates a new React project with Vite?",
   "options": [
    "npm install react-app",
    "npm create vite@latest my-app -- --template react",
    "vite init react my-app",
    "npx react new my-app"
   ],
   "answer": [
    1
   ],
   "explanation": "This scaffolds a Vite project from the React template."
  },
  {
   "id": 20,
   "topic": "setup",
   "difficulty": "easy",
   "question": "What does `npm run dev` do in a Vite project?",
   "options": [
    "Installs dependencies",
    "Deletes node_modules",
    "Builds production files into dist/",
    "Starts the development server with instant updates"
   ],
   "answer": [
    3
   ],
   "explanation": "The dev server serves your app and updates it as you save."
  },
  {
   "id": 21,
   "topic": "setup",
   "difficulty": "easy",
   "question": "Which file in a Vite project starts React with createRoot()?",
   "options": [
    "index.html",
    "src/main.jsx",
    "src/App.jsx",
    "vite.config.js"
   ],
   "answer": [
    1
   ],
   "explanation": "main.jsx finds #root and renders <App /> into it."
  },
  {
   "id": 22,
   "topic": "setup",
   "difficulty": "easy",
   "question": "What element in index.html does React render into?",
   "options": [
    "<main id=\"react\">",
    "<body id=\"app\">",
    "<react-root>",
    "<div id=\"root\"></div>"
   ],
   "answer": [
    3
   ],
   "explanation": "createRoot(document.getElementById('root')) takes over that element."
  },
  {
   "id": 23,
   "topic": "setup",
   "difficulty": "medium",
   "question": "Which package provides createRoot for web pages?",
   "options": [
    "react-dom/client",
    "vite",
    "react-native",
    "react"
   ],
   "answer": [
    0
   ],
   "explanation": "react-dom connects React to the browser DOM."
  },
  {
   "id": 24,
   "topic": "setup",
   "difficulty": "medium",
   "question": "What is true about <StrictMode>? (select all that apply)",
   "options": [
    "It disables all console warnings",
    "It makes the production build faster",
    "It renders no visible UI of its own",
    "It runs some of your code twice in development to find bugs"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "StrictMode is a development-only checking tool."
  },
  {
   "id": 25,
   "topic": "setup",
   "difficulty": "easy",
   "question": "Which folder should you never edit by hand?",
   "options": [
    "public",
    "src/components",
    "src",
    "node_modules"
   ],
   "answer": [
    3
   ],
   "explanation": "node_modules is recreated by npm install, so your changes would be lost."
  },
  {
   "id": 26,
   "topic": "setup",
   "difficulty": "easy",
   "question": "What does `npm run build` produce?",
   "options": [
    "A new React project",
    "A running dev server",
    "A test report",
    "An optimised production version in dist/"
   ],
   "answer": [
    3
   ],
   "explanation": "The build bundles and minifies your app for deployment."
  },
  {
   "id": 27,
   "topic": "setup",
   "difficulty": "medium",
   "question": "What is HMR (Hot Module Replacement)?",
   "options": [
    "A React Hook for state",
    "Updating changed modules in the browser without a full page reload",
    "A testing framework",
    "A routing library"
   ],
   "answer": [
    1
   ],
   "explanation": "HMR is why your edits appear instantly when you save."
  },
  {
   "id": 28,
   "topic": "setup",
   "difficulty": "medium",
   "question": "Why might console.log in a component print twice during development?",
   "options": [
    "Two browser tabs are open",
    "React 19 always logs twice in production",
    "StrictMode calls components twice to detect impure code",
    "There is a bug in Vite"
   ],
   "answer": [
    2
   ],
   "explanation": "This happens only in development. Production renders once."
  },
  {
   "id": 29,
   "topic": "setup",
   "difficulty": "medium",
   "question": "Which ways of starting a new React app do the official docs recommend? (select all that apply)",
   "options": [
    "Opening index.html directly from Finder",
    "Copying React files out of node_modules",
    "A build tool such as Vite",
    "A framework such as Next.js or React Router"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "Frameworks suit full apps; build tools like Vite suit learning and custom setups."
  },
  {
   "id": 30,
   "topic": "setup",
   "difficulty": "easy",
   "question": "What does \"declarative\" UI mean in React?",
   "options": [
    "You describe what the UI should look like for the current data, and React updates the DOM",
    "You must use classes",
    "You write every DOM change step by step",
    "You declare CSS variables"
   ],
   "answer": [
    0
   ],
   "explanation": "UI = f(state): you change the data, and React works out the DOM changes."
  },
  {
   "id": 31,
   "topic": "setup",
   "difficulty": "easy",
   "question": "What does the React Developer Tools browser extension add?",
   "options": [
    "A database viewer",
    "A new code editor",
    "A Components tab showing your component tree with props and state",
    "A CSS preprocessor"
   ],
   "answer": [
    2
   ],
   "explanation": "It's the best way to inspect a running React app."
  },
  {
   "id": 32,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "Component names must start with…",
   "options": [
    "A capital letter",
    "The word \"use\"",
    "An underscore",
    "A lowercase letter"
   ],
   "answer": [
    0
   ],
   "explanation": "React treats lowercase tags as HTML elements."
  },
  {
   "id": 33,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "What can a component return as its root?",
   "options": [
    "A single element or a Fragment",
    "Only a <div>",
    "Only a string",
    "Several sibling elements with no wrapper"
   ],
   "answer": [
    0
   ],
   "explanation": "Wrap siblings in <>...</> or a parent element."
  },
  {
   "id": 34,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "What is <>...</> called?",
   "options": [
    "A Fragment",
    "A Slot",
    "A Template",
    "A Portal"
   ],
   "answer": [
    0
   ],
   "explanation": "Fragments group elements without adding a DOM node."
  },
  {
   "id": 35,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Which of these are valid JSX? (select all that apply)",
   "options": [
    "<img src=\"a.png\" />",
    "<input value=\"x\">",
    "<img src=\"a.png\">",
    "<br />"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "In JSX every tag must be closed, so self-closing tags need a slash."
  },
  {
   "id": 36,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write a comment inside JSX markup?",
   "options": [
    "<!-- comment -->",
    "// comment",
    "{/* comment */}",
    "# comment"
   ],
   "answer": [
    2
   ],
   "explanation": "JSX comments are JavaScript comments inside braces."
  },
  {
   "id": 37,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Which inline style is correct JSX?",
   "options": [
    "style={{ \"margin-top\": 8 }}",
    "style={marginTop: 8}",
    "style={{ marginTop: 8 }}",
    "style=\"margin-top: 8px\""
   ],
   "answer": [
    2
   ],
   "explanation": "style takes an object with camelCase keys. A plain number means pixels."
  },
  {
   "id": 38,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "What can you put inside { } in JSX? (select all that apply)",
   "options": [
    "A function call like formatDate(d)",
    "A variable",
    "An if statement",
    "A ternary expression"
   ],
   "answer": [
    0,
    1,
    3
   ],
   "explanation": "Braces accept expressions, not statements."
  },
  {
   "id": 39,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Why should you not define a component inside another component?",
   "options": [
    "It is re-created on every render, which resets its state and slows things down",
    "React does not allow nested functions",
    "It is a syntax error",
    "It makes the component private, which is not allowed"
   ],
   "answer": [
    0
   ],
   "explanation": "Always define components at the top level of the file."
  },
  {
   "id": 40,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "What does this component return?",
   "code": "function Title() {\n  return\n    <h1>Hello</h1>;\n}",
   "options": [
    "The <h1> element",
    "A syntax error is always thrown",
    "undefined (the JSX on the next line is ignored)",
    "An empty string"
   ],
   "answer": [
    2
   ],
   "explanation": "With nothing after return on the same line, JavaScript returns immediately. Wrap multi-line JSX in parentheses."
  },
  {
   "id": 41,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How many default exports can one file have?",
   "options": [
    "None",
    "One",
    "Two",
    "Unlimited"
   ],
   "answer": [
    1
   ],
   "explanation": "Use named exports when a file shares several things."
  },
  {
   "id": 42,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "Which extension should files containing JSX use in a Vite project?",
   "options": [
    ".jsx",
    ".html",
    ".js",
    ".json"
   ],
   "answer": [
    0
   ],
   "explanation": "Vite expects JSX in .jsx (or .tsx) files."
  },
  {
   "id": 43,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "What does \"Failed to resolve import ./components/Profile\" usually mean?",
   "options": [
    "Profile has a syntax error",
    "React is not installed",
    "The path or filename is wrong (including capital letters)",
    "The component returns null"
   ],
   "answer": [
    2
   ],
   "explanation": "Check the folder, the spelling and the case of the file name."
  },
  {
   "id": 44,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "How do you write aria-label in JSX?",
   "options": [
    "aria_label",
    "ariaLabel",
    "aria-label (the dash is kept)",
    "arialabel"
   ],
   "answer": [
    2
   ],
   "explanation": "aria-* and data-* attributes keep their dashes in JSX."
  },
  {
   "id": 45,
   "topic": "jsx",
   "difficulty": "hard",
   "question": "Why can't you write `<{tag}>` to choose a tag dynamically?",
   "options": [
    "Because tags must always be strings",
    "Because React only supports div",
    "Braces are not allowed in the tag-name position; use a capitalised variable instead: const Tag = tag; <Tag />",
    "You can; it works fine"
   ],
   "answer": [
    2
   ],
   "explanation": "Assign the tag to a capitalised variable and use that variable as the tag."
  },
  {
   "id": 46,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "JSX is converted into…",
   "options": [
    "Regular JavaScript function calls",
    "HTML files on disk",
    "CSS",
    "JSON"
   ],
   "answer": [
    0
   ],
   "explanation": "Your build tool compiles JSX into JavaScript that creates React elements."
  },
  {
   "id": 47,
   "topic": "props",
   "difficulty": "easy",
   "question": "How does a component receive its props?",
   "options": [
    "As a single object passed as its first argument",
    "From global variables",
    "Only through this.props",
    "As separate function arguments"
   ],
   "answer": [
    0
   ],
   "explanation": "React calls Avatar({ person, size })."
  },
  {
   "id": 48,
   "topic": "props",
   "difficulty": "easy",
   "question": "What is `function Avatar({ person, size })` an example of?",
   "options": [
    "Currying",
    "Rest parameters",
    "The spread operator",
    "Object destructuring of props"
   ],
   "answer": [
    3
   ],
   "explanation": "Destructuring pulls the named props out of the props object."
  },
  {
   "id": 49,
   "topic": "props",
   "difficulty": "easy",
   "question": "Can a component change its own props?",
   "options": [
    "Only string props",
    "Yes, any time",
    "No, props are read-only",
    "Only inside an Effect"
   ],
   "answer": [
    2
   ],
   "explanation": "Props belong to the parent. Use state for values that change."
  },
  {
   "id": 50,
   "topic": "props",
   "difficulty": "medium",
   "question": "When is a default prop value (`{ size = 100 }`) used? (select all that apply)",
   "options": [
    "When the prop is passed as undefined",
    "When the prop is not passed",
    "When the prop is 0",
    "When the prop is null"
   ],
   "answer": [
    0,
    1
   ],
   "explanation": "Defaults apply only to missing or undefined values."
  },
  {
   "id": 51,
   "topic": "props",
   "difficulty": "easy",
   "question": "Content placed between <Card> and </Card> is received as…",
   "options": [
    "A slot named default",
    "The children prop",
    "The content prop",
    "props.inner"
   ],
   "answer": [
    1
   ],
   "explanation": "Use {children} in Card to render it."
  },
  {
   "id": 52,
   "topic": "props",
   "difficulty": "medium",
   "question": "What does `<Avatar {...props} />` do?",
   "options": [
    "Removes all the props",
    "Passes every prop in the props object on to Avatar",
    "Merges context into props",
    "Copies Avatar's state"
   ],
   "answer": [
    1
   ],
   "explanation": "Spread forwards all the props. Use it sparingly."
  },
  {
   "id": 53,
   "topic": "props",
   "difficulty": "easy",
   "question": "Which passes the NUMBER 100 as a prop?",
   "options": [
    "<Avatar size=100 />",
    "<Avatar size=\"100\" />",
    "<Avatar size:{100} />",
    "<Avatar size={100} />"
   ],
   "answer": [
    3
   ],
   "explanation": "Quotes make a string; braces pass a JavaScript value."
  },
  {
   "id": 54,
   "topic": "props",
   "difficulty": "easy",
   "question": "In which direction do props flow?",
   "options": [
    "From parent to child",
    "From child to parent",
    "Between siblings directly",
    "In both directions automatically"
   ],
   "answer": [
    0
   ],
   "explanation": "Data flows down. Children talk back by calling functions that were passed down."
  },
  {
   "id": 55,
   "topic": "props",
   "difficulty": "medium",
   "question": "How can a child tell its parent that something happened?",
   "options": [
    "By importing the parent",
    "By editing the parent's state variable directly",
    "By changing its props",
    "By calling a function the parent passed as a prop"
   ],
   "answer": [
    3
   ],
   "explanation": "For example: <Button onClick={handleClick} />."
  },
  {
   "id": 56,
   "topic": "props",
   "difficulty": "easy",
   "question": "Which of these can be passed as props? (select all that apply)",
   "options": [
    "Strings",
    "JSX elements",
    "Objects and arrays",
    "Functions"
   ],
   "answer": [
    0,
    1,
    2,
    3
   ],
   "explanation": "Any JavaScript value can be a prop."
  },
  {
   "id": 57,
   "topic": "props",
   "difficulty": "medium",
   "question": "Can a component read its own `key` from props?",
   "options": [
    "Yes, as props.key",
    "No: React uses key itself and does not pass it to the component",
    "Only in development",
    "Only inside lists"
   ],
   "answer": [
    1
   ],
   "explanation": "Pass the ID again under a different name if the component needs it."
  },
  {
   "id": 58,
   "topic": "props",
   "difficulty": "medium",
   "question": "What happens when a parent re-renders and passes new prop values?",
   "options": [
    "The child must call refresh()",
    "The child re-renders with the new props",
    "React throws an error",
    "The child keeps the old props forever"
   ],
   "answer": [
    1
   ],
   "explanation": "Props are a snapshot for each render."
  },
  {
   "id": 59,
   "topic": "lists",
   "difficulty": "easy",
   "question": "What does a component that returns null render?",
   "options": [
    "The text \"null\"",
    "An empty <div>",
    "An error",
    "Nothing"
   ],
   "answer": [
    3
   ],
   "explanation": "Returning null is a valid way to render nothing."
  },
  {
   "id": 60,
   "topic": "lists",
   "difficulty": "easy",
   "question": "What does `{isPacked ? '✅' : '❌'}` render when isPacked is false?",
   "options": [
    "Both",
    "❌",
    "Nothing",
    "✅"
   ],
   "answer": [
    1
   ],
   "explanation": "The ternary picks the second value when the condition is false."
  },
  {
   "id": 61,
   "topic": "lists",
   "difficulty": "easy",
   "question": "Which array method is normally used to turn data into a list of JSX elements?",
   "options": [
    "push()",
    "forEach()",
    "for...in",
    "map()"
   ],
   "answer": [
    3
   ],
   "explanation": "map returns a new array, which React can render."
  },
  {
   "id": 62,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What is wrong with this code?",
   "code": "people.map(p => { <li>{p}</li> })",
   "options": [
    "It is missing an import",
    "li cannot be used inside map",
    "Nothing is wrong",
    "The curly braces create a function body, so nothing is returned"
   ],
   "answer": [
    3
   ],
   "explanation": "Use parentheses, or write an explicit return."
  },
  {
   "id": 63,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What must be true of keys in a list? (select all that apply)",
   "options": [
    "Always numbers",
    "Stable between renders",
    "Unique among siblings",
    "Unique across the whole app"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "Keys only need to be unique within the same list."
  },
  {
   "id": 64,
   "topic": "lists",
   "difficulty": "medium",
   "question": "Why is key={Math.random()} a bad idea?",
   "options": [
    "Every render produces new keys, so React re-creates every item and loses its state",
    "Keys must be strings",
    "It works perfectly",
    "Random numbers are not allowed in JSX"
   ],
   "answer": [
    0
   ],
   "explanation": "Keys must be stable. Generate IDs when you create the data, not while rendering."
  },
  {
   "id": 65,
   "topic": "lists",
   "difficulty": "medium",
   "question": "When is it acceptable to use the array index as a key?",
   "options": [
    "Only for lists of strings",
    "Always",
    "When the list is never reordered, filtered, or has items inserted or removed",
    "Never"
   ],
   "answer": [
    2
   ],
   "explanation": "Indexes shift when the list changes, which causes bugs."
  },
  {
   "id": 66,
   "topic": "lists",
   "difficulty": "medium",
   "question": "How do you give a key to a group of elements returned from map()?",
   "options": [
    "Use <React.Key>",
    "Use <Fragment key={id}>...</Fragment>",
    "Put the key on <>...</>",
    "It's impossible"
   ],
   "answer": [
    1
   ],
   "explanation": "The short <> syntax cannot take a key."
  },
  {
   "id": 67,
   "topic": "lists",
   "difficulty": "easy",
   "question": "Where should the key go?",
   "options": [
    "On the component definition",
    "On the text inside the item",
    "On the <ul>",
    "On the outermost element returned from map()"
   ],
   "answer": [
    3
   ],
   "explanation": "React needs the key on each item in the array."
  },
  {
   "id": 68,
   "topic": "lists",
   "difficulty": "easy",
   "question": "What does array.filter(fn) return?",
   "options": [
    "The same array, modified",
    "The first matching item",
    "A boolean",
    "A new array containing the items for which fn returned true"
   ],
   "answer": [
    3
   ],
   "explanation": "filter never changes the original array."
  },
  {
   "id": 69,
   "topic": "lists",
   "difficulty": "medium",
   "question": "For which of these values does React render nothing? (select all that apply)",
   "options": [
    "0",
    "null",
    "false",
    "undefined"
   ],
   "answer": [
    1,
    2,
    3
   ],
   "explanation": "React renders the number 0, so watch out for count && ...."
  },
  {
   "id": 70,
   "topic": "lists",
   "difficulty": "easy",
   "question": "Which is the most readable approach for complex conditional UI?",
   "options": [
    "Nest five ternaries inline",
    "Assign JSX to a variable with if/else before the return",
    "Use a switch inside JSX braces",
    "Put each branch in a separate file"
   ],
   "answer": [
    1
   ],
   "explanation": "JSX is just a value, so build it step by step."
  },
  {
   "id": 71,
   "topic": "purity",
   "difficulty": "easy",
   "question": "What makes a component \"pure\"?",
   "options": [
    "It has no props",
    "It has no state",
    "Same inputs give the same output, and it does not change anything that existed before it rendered",
    "It only uses CSS"
   ],
   "answer": [
    2
   ],
   "explanation": "Pure components are predictable and safe to re-run."
  },
  {
   "id": 72,
   "topic": "purity",
   "difficulty": "medium",
   "question": "Which of these should NOT happen while rendering? (select all that apply)",
   "options": [
    "Changing a variable declared outside the component",
    "Calling fetch()",
    "Creating a local array and pushing items into it",
    "Setting document.title"
   ],
   "answer": [
    0,
    1,
    3
   ],
   "explanation": "Local mutation is fine. Changing the outside world is a side effect."
  },
  {
   "id": 73,
   "topic": "purity",
   "difficulty": "easy",
   "question": "Is it OK to mutate a variable you created during the same render?",
   "options": [
    "Yes: local mutation is invisible to the outside",
    "Only arrays",
    "Only in StrictMode",
    "No, never"
   ],
   "answer": [
    0
   ],
   "explanation": "The problem is only changing data that existed before the render."
  },
  {
   "id": 74,
   "topic": "purity",
   "difficulty": "medium",
   "question": "Why does StrictMode call components twice in development?",
   "options": [
    "To pre-load data",
    "To test CSS",
    "To reveal impure components that behave differently on a second call",
    "To make the app faster"
   ],
   "answer": [
    2
   ],
   "explanation": "Pure components give the same result twice."
  },
  {
   "id": 75,
   "topic": "purity",
   "difficulty": "easy",
   "question": "Where should side effects go first?",
   "options": [
    "In event handlers",
    "In the key prop",
    "In the component body",
    "In CSS"
   ],
   "answer": [
    0
   ],
   "explanation": "Effects (useEffect) are the last resort."
  },
  {
   "id": 76,
   "topic": "purity",
   "difficulty": "medium",
   "question": "Why is calling items.sort() on an array prop a problem?",
   "options": [
    "sort() does not work on props",
    "It makes the list unsorted",
    "There is no problem",
    "sort() mutates the parent's array, which makes the component impure"
   ],
   "answer": [
    3
   ],
   "explanation": "Use toSorted() or [...items].sort()."
  },
  {
   "id": 77,
   "topic": "purity",
   "difficulty": "easy",
   "question": "What does the render tree contain?",
   "options": [
    "Only HTML tags",
    "Files and their imports",
    "CSS rules",
    "Components and which component rendered which"
   ],
   "answer": [
    3
   ],
   "explanation": "The module dependency tree is the one that shows imports."
  },
  {
   "id": 78,
   "topic": "purity",
   "difficulty": "easy",
   "question": "What does the module dependency tree show?",
   "options": [
    "The order of state updates",
    "Which files import which",
    "Which components render which",
    "The CSS cascade"
   ],
   "answer": [
    1
   ],
   "explanation": "Bundlers use it to decide what to ship."
  },
  {
   "id": 79,
   "topic": "purity",
   "difficulty": "easy",
   "question": "What is a leaf component?",
   "options": [
    "The root component",
    "A component that renders no other components",
    "A component in a separate file",
    "A component with state"
   ],
   "answer": [
    1
   ],
   "explanation": "Leaves are usually small and re-render often."
  },
  {
   "id": 80,
   "topic": "purity",
   "difficulty": "medium",
   "question": "What benefits does purity bring? (select all that apply)",
   "options": [
    "Components can render on a server with the same result",
    "React can safely skip re-rendering when the inputs haven't changed",
    "You are allowed to mutate props",
    "Tools like the React Compiler can optimise the code"
   ],
   "answer": [
    0,
    1,
    3
   ],
   "explanation": "Purity is what makes React's optimisations safe."
  },
  {
   "id": 81,
   "topic": "purity",
   "difficulty": "medium",
   "question": "Why can the render tree be different from one render to the next?",
   "options": [
    "Conditional rendering can show different components",
    "It can't: the tree is always the same",
    "React randomly reorders components",
    "Imports change at runtime"
   ],
   "answer": [
    0
   ],
   "explanation": "For example: {isLoggedIn ? <Dashboard /> : <Login />}."
  },
  {
   "id": 82,
   "topic": "events",
   "difficulty": "easy",
   "question": "Which is the correct way to attach a click handler?",
   "options": [
    "onClick=\"handleClick\"",
    "onclick=\"handleClick()\"",
    "onClick={handleClick()}",
    "onClick={handleClick}"
   ],
   "answer": [
    3
   ],
   "explanation": "Pass the function itself, without calling it."
  },
  {
   "id": 83,
   "topic": "events",
   "difficulty": "easy",
   "question": "What happens with onClick={handleClick()}?",
   "options": [
    "handleClick runs on every click",
    "Nothing ever happens",
    "handleClick runs during rendering, not on click",
    "It runs on double-click"
   ],
   "answer": [
    2
   ],
   "explanation": "The parentheses call the function immediately."
  },
  {
   "id": 84,
   "topic": "events",
   "difficulty": "easy",
   "question": "How do you call remove(id) when a button is clicked?",
   "options": [
    "onClick=\"remove(id)\"",
    "onClick={remove(id)}",
    "onClick={remove, id}",
    "onClick={() => remove(id)}"
   ],
   "answer": [
    3
   ],
   "explanation": "Wrap the call in an arrow function."
  },
  {
   "id": 85,
   "topic": "events",
   "difficulty": "easy",
   "question": "What is the naming convention for event handlers and event props?",
   "options": [
    "There is no convention",
    "Both use doX",
    "Functions are named onX; props are named handleX",
    "Functions are named handleX; props are named onX"
   ],
   "answer": [
    3
   ],
   "explanation": "For example: <Toolbar onPlay={handlePlay} />."
  },
  {
   "id": 86,
   "topic": "events",
   "difficulty": "easy",
   "question": "What is event bubbling?",
   "options": [
    "The event runs on the clicked element, then on each of its parents",
    "The event is cancelled",
    "The event runs twice on the same element",
    "The event runs only on the parent"
   ],
   "answer": [
    0
   ],
   "explanation": "Handlers on ancestors run after the target's handler."
  },
  {
   "id": 87,
   "topic": "events",
   "difficulty": "easy",
   "question": "What does e.stopPropagation() do?",
   "options": [
    "Reloads the page",
    "Stops the browser's default behaviour",
    "Stops handlers on parent elements from running",
    "Removes the handler"
   ],
   "answer": [
    2
   ],
   "explanation": "Use preventDefault() for default browser behaviour."
  },
  {
   "id": 88,
   "topic": "events",
   "difficulty": "easy",
   "question": "How do you stop a form submission from reloading the page?",
   "options": [
    "Return false from the component",
    "Call e.preventDefault() in onSubmit",
    "Call e.stopPropagation()",
    "Remove the <form> tag"
   ],
   "answer": [
    1
   ],
   "explanation": "preventDefault cancels the browser's built-in action."
  },
  {
   "id": 89,
   "topic": "events",
   "difficulty": "easy",
   "question": "Are side effects (like changing state or sending requests) allowed in event handlers?",
   "options": [
    "Only in class components",
    "No, handlers must be pure",
    "Yes, event handlers are the best place for them",
    "Only in onSubmit"
   ],
   "answer": [
    2
   ],
   "explanation": "Handlers don't run during rendering, so they don't need to be pure."
  },
  {
   "id": 90,
   "topic": "events",
   "difficulty": "medium",
   "question": "What is the difference between e.target and e.currentTarget?",
   "options": [
    "currentTarget is the clicked element",
    "They are always the same",
    "target is the window",
    "target is the element that was clicked; currentTarget is the element whose handler is running"
   ],
   "answer": [
    3
   ],
   "explanation": "They differ when an event bubbles up to a parent's handler."
  },
  {
   "id": 91,
   "topic": "events",
   "difficulty": "easy",
   "question": "When does onChange fire on a text <input> in React?",
   "options": [
    "Only when the input loses focus",
    "Only on Enter",
    "Only on page load",
    "On every change to the value (every keystroke)"
   ],
   "answer": [
    3
   ],
   "explanation": "React's onChange behaves like the browser's input event."
  },
  {
   "id": 92,
   "topic": "events",
   "difficulty": "easy",
   "question": "How do you read whether a checkbox is ticked in onChange?",
   "options": [
    "e.target.ticked",
    "e.target.value",
    "e.target.checked",
    "e.checked"
   ],
   "answer": [
    2
   ],
   "explanation": "Checkboxes use checked; text inputs use value."
  },
  {
   "id": 93,
   "topic": "events",
   "difficulty": "easy",
   "question": "Which of these are valid React event props? (select all that apply)",
   "options": [
    "onClick",
    "onMouseEnter",
    "onclick",
    "onKeyDown",
    "on-click"
   ],
   "answer": [
    0,
    1,
    3
   ],
   "explanation": "React event props are camelCase."
  },
  {
   "id": 94,
   "topic": "state",
   "difficulty": "easy",
   "question": "Why doesn't changing a local variable update the screen? (select all that apply)",
   "options": [
    "Because local variables are const",
    "Local variables reset on every render",
    "Because React forbids variables",
    "Changing a local variable does not trigger a re-render"
   ],
   "answer": [
    1,
    3
   ],
   "explanation": "useState solves both problems."
  },
  {
   "id": 95,
   "topic": "state",
   "difficulty": "easy",
   "question": "What does useState return?",
   "options": [
    "An array: [currentValue, setterFunction]",
    "A Promise",
    "An object { value, set }",
    "Just the value"
   ],
   "answer": [
    0
   ],
   "explanation": "Destructure it: const [x, setX] = useState(0)."
  },
  {
   "id": 96,
   "topic": "state",
   "difficulty": "easy",
   "question": "When is the initial value passed to useState used?",
   "options": [
    "Whenever the setter is called",
    "On every render",
    "Only on the first render",
    "Never"
   ],
   "answer": [
    2
   ],
   "explanation": "After that, React gives you the stored value."
  },
  {
   "id": 97,
   "topic": "state",
   "difficulty": "easy",
   "question": "What does calling a state setter do?",
   "options": [
    "Immediately changes the variable in the current render",
    "Reloads the page",
    "Stores the new value and asks React to re-render",
    "Nothing until you call render()"
   ],
   "answer": [
    2
   ],
   "explanation": "The new value appears in the next render."
  },
  {
   "id": 98,
   "topic": "state",
   "difficulty": "medium",
   "question": "Right after setCount(5), what does console.log(count) print in the same handler?",
   "options": [
    "undefined",
    "An error",
    "The old value from this render",
    "5"
   ],
   "answer": [
    2
   ],
   "explanation": "State is a snapshot for each render."
  },
  {
   "id": 99,
   "topic": "state",
   "difficulty": "easy",
   "question": "Where are you allowed to call useState?",
   "options": [
    "Inside event handlers",
    "At the top level of a component or custom Hook",
    "Inside loops",
    "Inside if statements"
   ],
   "answer": [
    1
   ],
   "explanation": "Hooks must be called in the same order on every render."
  },
  {
   "id": 100,
   "topic": "state",
   "difficulty": "easy",
   "question": "Two <Counter /> elements are rendered side by side. How is their state related?",
   "options": [
    "They share one state",
    "Each one has its own independent state",
    "The second one has no state",
    "It depends on the props"
   ],
   "answer": [
    1
   ],
   "explanation": "State belongs to a component's position in the tree."
  },
  {
   "id": 101,
   "topic": "state",
   "difficulty": "easy",
   "question": "In React terms, what does \"rendering\" mean?",
   "options": [
    "The browser painting pixels",
    "Downloading JavaScript",
    "React calling your component function",
    "Writing HTML files"
   ],
   "answer": [
    2
   ],
   "explanation": "The commit step is what updates the DOM."
  },
  {
   "id": 102,
   "topic": "state",
   "difficulty": "medium",
   "question": "What happens during the commit phase?",
   "options": [
    "React applies the minimal necessary changes to the DOM",
    "React downloads data",
    "React calls every component again",
    "React clears all state"
   ],
   "answer": [
    0
   ],
   "explanation": "If nothing changed, React doesn't touch the DOM."
  },
  {
   "id": 103,
   "topic": "state",
   "difficulty": "medium",
   "question": "What is batching?",
   "options": [
    "React waits until the event handler finishes, then re-renders once with all the updates",
    "Combining CSS files",
    "Grouping components into folders",
    "React renders each setState immediately"
   ],
   "answer": [
    0
   ],
   "explanation": "Batching avoids half-updated screens and extra renders."
  },
  {
   "id": 104,
   "topic": "state",
   "difficulty": "easy",
   "question": "When should you use the updater form setX(prev => ...)?",
   "options": [
    "When the next value depends on the previous value",
    "Never",
    "Only for strings",
    "Only inside Effects"
   ],
   "answer": [
    0
   ],
   "explanation": "It's always safe for updates such as increments and toggles."
  },
  {
   "id": 105,
   "topic": "state",
   "difficulty": "easy",
   "question": "What is a \"controlled\" input?",
   "options": [
    "An input with a ref",
    "An input whose value comes from state and updates through onChange",
    "An input inside a form",
    "An input that is disabled"
   ],
   "answer": [
    1
   ],
   "explanation": "React is the single source of truth for its value."
  },
  {
   "id": 106,
   "topic": "state",
   "difficulty": "easy",
   "question": "What are the three steps of a React update, in order?",
   "options": [
    "Commit → Render → Trigger",
    "Trigger → Render → Commit",
    "Mount → Fetch → Paint",
    "Render → Trigger → Commit"
   ],
   "answer": [
    1
   ],
   "explanation": "Trigger (state changes), render (call components), commit (update the DOM)."
  },
  {
   "id": 107,
   "topic": "state",
   "difficulty": "medium",
   "question": "Why should input values from number fields be converted with Number()?",
   "options": [
    "React requires it",
    "To make the input controlled",
    "Numbers are not allowed in state",
    "e.target.value is always a string"
   ],
   "answer": [
    3
   ],
   "explanation": "'5' + 1 === '51', so convert first."
  },
  {
   "id": 108,
   "topic": "immutability",
   "difficulty": "easy",
   "question": "What is \"mutation\"?",
   "options": [
    "Creating a new copy",
    "Calling a setter",
    "Re-rendering a component",
    "Changing an existing object or array in place"
   ],
   "answer": [
    3
   ],
   "explanation": "Treat state as read-only and replace it instead."
  },
  {
   "id": 109,
   "topic": "immutability",
   "difficulty": "easy",
   "question": "Which correctly updates only the name in a person object in state?",
   "options": [
    "setPerson(person.name = 'Asha')",
    "setPerson({ name: 'Asha' }) (when the other fields must be kept)",
    "setPerson({ ...person, name: 'Asha' })",
    "person.name = 'Asha'; setPerson(person)"
   ],
   "answer": [
    2
   ],
   "explanation": "Spread copies the old fields, then you override one."
  },
  {
   "id": 110,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "How deep does the spread syntax copy?",
   "options": [
    "Two levels",
    "It doesn't copy at all",
    "Only one level (a shallow copy)",
    "All nested levels"
   ],
   "answer": [
    2
   ],
   "explanation": "Copy each nested level you change."
  },
  {
   "id": 111,
   "topic": "immutability",
   "difficulty": "easy",
   "question": "Which removes the item with a given id without mutating?",
   "options": [
    "items.pop()",
    "delete items[index]",
    "items.filter(i => i.id !== id)",
    "items.splice(index, 1)"
   ],
   "answer": [
    2
   ],
   "explanation": "filter returns a new array."
  },
  {
   "id": 112,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "What is the bug in this code?",
   "code": "const copy = [...todos];\ncopy[0].done = true;\nsetTodos(copy);",
   "options": [
    "You cannot spread arrays",
    "Arrays cannot be copied",
    "There is no bug",
    "The copy holds the same objects, so changing copy[0].done mutates the original todo"
   ],
   "answer": [
    3
   ],
   "explanation": "Spread is shallow, so create a new object for the item you change."
  },
  {
   "id": 113,
   "topic": "immutability",
   "difficulty": "easy",
   "question": "Which library lets you write mutation-style code that produces immutable updates?",
   "options": [
    "Axios",
    "Lodash",
    "Immer",
    "jQuery"
   ],
   "answer": [
    2
   ],
   "explanation": "Immer uses a draft object and makes the copies for you."
  },
  {
   "id": 114,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "What does `[e.target.name]: e.target.value` inside an object literal do?",
   "options": [
    "Creates an array",
    "Uses the input's name as a computed property key",
    "Destructures the event",
    "Is a syntax error"
   ],
   "answer": [
    1
   ],
   "explanation": "It lets one handler update any field."
  },
  {
   "id": 115,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Why does React need a NEW object or array to notice a change?",
   "options": [
    "It compares the old and new state by reference (Object.is)",
    "It watches the object for mutations",
    "It re-renders on every mutation automatically",
    "It deep-compares every field"
   ],
   "answer": [
    0
   ],
   "explanation": "Same reference means \"nothing changed\"."
  },
  {
   "id": 116,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "How do you insert an item at position i without mutating?",
   "options": [
    "[...arr.slice(0, i), item, ...arr.slice(i)]",
    "arr.push(item, i)",
    "arr[i] = item",
    "arr.splice(i, 0, item)"
   ],
   "answer": [
    0
   ],
   "explanation": "slice returns copies of each part."
  },
  {
   "id": 117,
   "topic": "immutability",
   "difficulty": "easy",
   "question": "How should you update one item inside an array of objects?",
   "options": [
    "Find it and change its property directly",
    "Use splice() to replace it in place",
    "Use map() and return a new object for the matching item",
    "Re-create the whole array by hand"
   ],
   "answer": [
    2
   ],
   "explanation": "For example: todos.map(t => t.id === id ? { ...t, done: !t.done } : t)."
  },
  {
   "id": 118,
   "topic": "structure",
   "difficulty": "medium",
   "question": "Which are recommended principles for structuring state? (select all that apply)",
   "options": [
    "Store every value you display",
    "Group related state",
    "Avoid redundant state",
    "Avoid contradictions"
   ],
   "answer": [
    1,
    2,
    3
   ],
   "explanation": "Also: avoid duplication and avoid deep nesting."
  },
  {
   "id": 119,
   "topic": "structure",
   "difficulty": "easy",
   "question": "firstName and lastName are in state. How should you get fullName?",
   "options": [
    "Keep it in a third state variable",
    "Store it in a ref",
    "Calculate it during render: const fullName = firstName + ' ' + lastName",
    "Update it in an Effect"
   ],
   "answer": [
    2
   ],
   "explanation": "Don't store what you can calculate."
  },
  {
   "id": 120,
   "topic": "structure",
   "difficulty": "medium",
   "question": "What is the problem with useState(props.color)?",
   "options": [
    "It causes an infinite loop",
    "Props cannot be read inside useState",
    "It is a syntax error",
    "The state won't update if the prop changes later"
   ],
   "answer": [
    3
   ],
   "explanation": "Only copy a prop if you deliberately want to ignore later changes (call it initialColor)."
  },
  {
   "id": 121,
   "topic": "structure",
   "difficulty": "easy",
   "question": "To remember which item is selected, what should you store?",
   "options": [
    "The selected item's ID",
    "The index plus a copy",
    "A copy of the selected item object",
    "Nothing"
   ],
   "answer": [
    0
   ],
   "explanation": "Look up the item from the ID during render so it is never stale."
  },
  {
   "id": 122,
   "topic": "structure",
   "difficulty": "easy",
   "question": "Instead of the booleans isSending and isSent, it is better to use…",
   "options": [
    "Three more booleans",
    "A ref",
    "Context",
    "A single status variable: 'typing' | 'sending' | 'sent'"
   ],
   "answer": [
    3
   ],
   "explanation": "One status value can never contradict itself."
  },
  {
   "id": 123,
   "topic": "structure",
   "difficulty": "easy",
   "question": "What does \"lifting state up\" mean?",
   "options": [
    "Moving state into a child",
    "Using a global variable",
    "Moving state to the closest common parent of the components that need it",
    "Storing state in localStorage"
   ],
   "answer": [
    2
   ],
   "explanation": "Then pass the state down with props and handlers."
  },
  {
   "id": 124,
   "topic": "structure",
   "difficulty": "medium",
   "question": "What is a \"controlled\" component, in the sense used for lifting state?",
   "options": [
    "One with no props",
    "One whose important information is driven by props from its parent",
    "One that uses refs",
    "One that is memoised"
   ],
   "answer": [
    1
   ],
   "explanation": "Uncontrolled components keep that information in their own local state."
  },
  {
   "id": 125,
   "topic": "structure",
   "difficulty": "easy",
   "question": "What does \"single source of truth\" mean for state?",
   "options": [
    "State is stored on the server",
    "Each unique piece of state lives in exactly one component",
    "All state lives in App",
    "Every component has a copy"
   ],
   "answer": [
    1
   ],
   "explanation": "Other components receive it as props."
  },
  {
   "id": 126,
   "topic": "structure",
   "difficulty": "easy",
   "question": "Two sibling components need the same state. Where should it live?",
   "options": [
    "In their closest common parent",
    "In both siblings, kept in sync",
    "In the first sibling",
    "In a ref"
   ],
   "answer": [
    0
   ],
   "explanation": "Pass it down to both."
  },
  {
   "id": 127,
   "topic": "structure",
   "difficulty": "medium",
   "question": "What helps with deeply nested state that is painful to update?",
   "options": [
    "Using more Effects",
    "Nesting it even more",
    "Flattening (normalising) it, with items referencing each other by ID",
    "Copying it into refs"
   ],
   "answer": [
    2
   ],
   "explanation": "Flat structures are easier to update immutably."
  },
  {
   "id": 128,
   "topic": "preserving",
   "difficulty": "easy",
   "question": "What is React state tied to?",
   "options": [
    "The component's position in the UI tree",
    "The variable name",
    "The props",
    "The component's file name"
   ],
   "answer": [
    0
   ],
   "explanation": "Same component, same position: same state."
  },
  {
   "id": 129,
   "topic": "preserving",
   "difficulty": "easy",
   "question": "How can you force a component to reset its state?",
   "options": [
    "Call forceUpdate()",
    "Give it a different key",
    "Re-import it",
    "Change one of its props"
   ],
   "answer": [
    1
   ],
   "explanation": "A new key means React treats it as a different component."
  },
  {
   "id": 130,
   "topic": "preserving",
   "difficulty": "easy",
   "question": "What is the signature of a reducer function?",
   "options": [
    "(action) => void",
    "(dispatch, state) => JSX",
    "(state) => action",
    "(state, action) => nextState"
   ],
   "answer": [
    3
   ],
   "explanation": "Reducers calculate the next state from the current state and an action."
  },
  {
   "id": 131,
   "topic": "preserving",
   "difficulty": "easy",
   "question": "What does useReducer return?",
   "options": [
    "[state, dispatch]",
    "{ state, reducer }",
    "[state, setState]",
    "dispatch only"
   ],
   "answer": [
    0
   ],
   "explanation": "Call dispatch(action) to request a change."
  },
  {
   "id": 132,
   "topic": "preserving",
   "difficulty": "easy",
   "question": "What should an action describe?",
   "options": [
    "What happened (for example 'added', 'deleted')",
    "Which component to re-render",
    "The CSS to apply",
    "How to change the DOM"
   ],
   "answer": [
    0
   ],
   "explanation": "The reducer decides how state changes in response."
  },
  {
   "id": 133,
   "topic": "preserving",
   "difficulty": "easy",
   "question": "Which rule applies to reducers?",
   "options": [
    "They must be pure: no side effects or mutations",
    "They must fetch data",
    "They must return JSX",
    "They must call setState"
   ],
   "answer": [
    0
   ],
   "explanation": "Reducers run during rendering."
  },
  {
   "id": 134,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Why use a reducer? (select all that apply)",
   "options": [
    "It keeps all the update logic in one place",
    "It always needs less code than useState",
    "It is easy to test as a plain function",
    "You can log every action for debugging"
   ],
   "answer": [
    0,
    2,
    3
   ],
   "explanation": "Reducers trade a little more code for clarity in complex components."
  },
  {
   "id": 135,
   "topic": "preserving",
   "difficulty": "easy",
   "question": "Where does the name \"reducer\" come from?",
   "options": [
    "Redux only",
    "The array method reduce()",
    "It reduces re-renders",
    "It reduces bundle size"
   ],
   "answer": [
    1
   ],
   "explanation": "Both take \"the result so far + the next item\" and return a new result."
  },
  {
   "id": 136,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Where should you generate a random ID for a new item when using a reducer?",
   "options": [
    "In the event handler, before dispatching",
    "Inside the reducer",
    "In the component body during render",
    "In the key prop"
   ],
   "answer": [
    0
   ],
   "explanation": "Reducers must be pure, and random values are not."
  },
  {
   "id": 137,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "A <Counter /> is hidden with style={{ display: 'none' }}. What happens to its state?",
   "options": [
    "React throws an error",
    "It moves to the parent",
    "It is kept, because the component stays mounted",
    "It is reset"
   ],
   "answer": [
    2
   ],
   "explanation": "Only unmounting (removing it from the tree) destroys state."
  },
  {
   "id": 138,
   "topic": "context",
   "difficulty": "easy",
   "question": "What is \"prop drilling\"?",
   "options": [
    "Passing props through many components that don't use them",
    "Testing props",
    "Removing unused props",
    "Passing props with spread"
   ],
   "answer": [
    0
   ],
   "explanation": "Context solves it."
  },
  {
   "id": 139,
   "topic": "context",
   "difficulty": "easy",
   "question": "What are the three steps of using context?",
   "options": [
    "Fetch, cache, render",
    "Create it, provide it, use it",
    "Import, export, render",
    "Mount, update, unmount"
   ],
   "answer": [
    1
   ],
   "explanation": "createContext → <Ctx value> → useContext(Ctx)."
  },
  {
   "id": 140,
   "topic": "context",
   "difficulty": "medium",
   "question": "Which of these provide a context value in React 19? (select all that apply)",
   "options": [
    "<ThemeContext.Consumer value=\"dark\">",
    "<ThemeContext value=\"dark\">",
    "<ThemeContext.Provider value=\"dark\">",
    "<Provider context={ThemeContext}>"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "React 19 allows the shorter form. .Provider still works."
  },
  {
   "id": 141,
   "topic": "context",
   "difficulty": "easy",
   "question": "When is the default value from createContext(default) used?",
   "options": [
    "Never",
    "Always",
    "Only on the first render",
    "When there is no matching provider above the component"
   ],
   "answer": [
    3
   ],
   "explanation": "Providers override the default."
  },
  {
   "id": 142,
   "topic": "context",
   "difficulty": "easy",
   "question": "Nested providers give different values. Which one does a component read?",
   "options": [
    "The outermost provider",
    "A random one",
    "The closest provider above it",
    "The first one rendered"
   ],
   "answer": [
    2
   ],
   "explanation": "Context works like CSS inheritance."
  },
  {
   "id": 143,
   "topic": "context",
   "difficulty": "medium",
   "question": "Before reaching for context, what should you try? (select all that apply)",
   "options": [
    "Passing JSX as children",
    "Passing props",
    "Global variables",
    "localStorage"
   ],
   "answer": [
    0,
    1
   ],
   "explanation": "Context makes data flow less obvious."
  },
  {
   "id": 144,
   "topic": "context",
   "difficulty": "medium",
   "question": "Which are good uses for context? (select all that apply)",
   "options": [
    "The language or locale",
    "The value of every input in a single form",
    "The current logged-in user",
    "The theme (light/dark)"
   ],
   "answer": [
    0,
    2,
    3
   ],
   "explanation": "Context suits data that many distant components need."
  },
  {
   "id": 145,
   "topic": "context",
   "difficulty": "medium",
   "question": "What happens when a provider's value changes?",
   "options": [
    "Every component that reads that context re-renders",
    "Only the provider re-renders",
    "React throws an error",
    "Nothing until you refresh"
   ],
   "answer": [
    0
   ],
   "explanation": "Consumers always get the latest value."
  },
  {
   "id": 146,
   "topic": "context",
   "difficulty": "medium",
   "question": "Why wrap useContext(TasksContext) in a custom useTasks() Hook?",
   "options": [
    "It makes context faster",
    "It is required by React",
    "It hides the details and gives components a clear, simple API",
    "It avoids re-renders"
   ],
   "answer": [
    2
   ],
   "explanation": "You can also add helpful errors when the provider is missing."
  },
  {
   "id": 147,
   "topic": "context",
   "difficulty": "hard",
   "question": "Why put the data and dispatch into two separate contexts?",
   "options": [
    "Components that only dispatch don't need to read the data, and the separation keeps responsibilities clear",
    "To avoid using reducers",
    "React requires one value per context",
    "dispatch cannot be put in context with data"
   ],
   "answer": [
    0
   ],
   "explanation": "It's a common pattern for scaling up with a reducer and context."
  },
  {
   "id": 148,
   "topic": "refs",
   "difficulty": "easy",
   "question": "What does useRef(0) return?",
   "options": [
    "A DOM element",
    "[0, setRef]",
    "The number 0",
    "An object { current: 0 }"
   ],
   "answer": [
    3
   ],
   "explanation": "You read and write ref.current."
  },
  {
   "id": 149,
   "topic": "refs",
   "difficulty": "easy",
   "question": "What happens when you change ref.current?",
   "options": [
    "Nothing re-renders",
    "The component re-renders",
    "The page reloads",
    "React throws an error"
   ],
   "answer": [
    0
   ],
   "explanation": "That's the main difference from state."
  },
  {
   "id": 150,
   "topic": "refs",
   "difficulty": "easy",
   "question": "When should you use a ref instead of state?",
   "options": [
    "For context values",
    "For values that are not shown on screen, such as timer IDs",
    "For anything displayed in the UI",
    "For props"
   ],
   "answer": [
    1
   ],
   "explanation": "If it affects the render output, use state."
  },
  {
   "id": 151,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Should you read or write ref.current during rendering?",
   "options": [
    "Avoid it; use refs in event handlers and Effects",
    "Yes, always",
    "Only write, never read",
    "Only in StrictMode"
   ],
   "answer": [
    0
   ],
   "explanation": "React doesn't know when refs change, so rendering would become unpredictable."
  },
  {
   "id": 152,
   "topic": "refs",
   "difficulty": "easy",
   "question": "How do you get the DOM node of an input?",
   "options": [
    "this.input",
    "document.querySelector inside render",
    "Create a ref and pass it: <input ref={inputRef} />",
    "props.dom"
   ],
   "answer": [
    2
   ],
   "explanation": "React sets inputRef.current to the element."
  },
  {
   "id": 153,
   "topic": "refs",
   "difficulty": "medium",
   "question": "When does React set inputRef.current to the DOM element?",
   "options": [
    "Only after a click",
    "Before rendering",
    "During the commit, after the element is created",
    "When useRef is first called"
   ],
   "answer": [
    2
   ],
   "explanation": "During the first render it is still null."
  },
  {
   "id": 154,
   "topic": "refs",
   "difficulty": "easy",
   "question": "How do you focus an input stored in inputRef?",
   "options": [
    "inputRef.focus()",
    "inputRef.current.focus()",
    "inputRef.current = focus",
    "focus(inputRef)"
   ],
   "answer": [
    1
   ],
   "explanation": "current is the real DOM element."
  },
  {
   "id": 155,
   "topic": "refs",
   "difficulty": "medium",
   "question": "In React 19, how does your own component accept a ref?",
   "options": [
    "As a normal prop named ref",
    "Through context",
    "Only with useImperativeHandle",
    "It can't"
   ],
   "answer": [
    0
   ],
   "explanation": "Older code used forwardRef."
  },
  {
   "id": 156,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which DOM operations through refs are safe? (select all that apply)",
   "options": [
    "Removing elements that React rendered",
    "Focusing an element",
    "Scrolling an element into view",
    "Measuring an element's size"
   ],
   "answer": [
    1,
    2,
    3
   ],
   "explanation": "Don't change the parts of the DOM that React manages."
  },
  {
   "id": 157,
   "topic": "refs",
   "difficulty": "hard",
   "question": "What does flushSync(() => setState(x)) do?",
   "options": [
    "Cancels the update",
    "Saves state to disk",
    "Forces React to update the DOM synchronously before the next line runs",
    "Delays the update"
   ],
   "answer": [
    2
   ],
   "explanation": "It's useful, for example, to scroll to a newly added item."
  },
  {
   "id": 158,
   "topic": "refs",
   "difficulty": "easy",
   "question": "Where should you store a setInterval ID so you can clear it later?",
   "options": [
    "In a local variable inside the component body",
    "In a ref",
    "In state",
    "In context"
   ],
   "answer": [
    1
   ],
   "explanation": "The ID is not displayed, and it must survive re-renders."
  },
  {
   "id": 159,
   "topic": "effects",
   "difficulty": "easy",
   "question": "When do Effects run?",
   "options": [
    "During rendering",
    "After React commits the render to the screen",
    "Only on click",
    "Before rendering"
   ],
   "answer": [
    1
   ],
   "explanation": "That lets them reach the DOM and outside systems."
  },
  {
   "id": 160,
   "topic": "effects",
   "difficulty": "easy",
   "question": "An Effect with NO dependency array runs…",
   "options": [
    "Only on unmount",
    "Only once",
    "After every render",
    "Never"
   ],
   "answer": [
    2
   ],
   "explanation": "Add dependencies to control when it runs."
  },
  {
   "id": 161,
   "topic": "effects",
   "difficulty": "easy",
   "question": "An Effect with an empty array [] runs…",
   "options": [
    "Only after the first render (mount), in production",
    "After every render",
    "Every second",
    "Never"
   ],
   "answer": [
    0
   ],
   "explanation": "In development, StrictMode runs it twice to test the cleanup."
  },
  {
   "id": 162,
   "topic": "effects",
   "difficulty": "easy",
   "question": "What is the cleanup function?",
   "options": [
    "A function returned from the Effect, run before the Effect re-runs and on unmount",
    "The second argument of useEffect",
    "A garbage collector",
    "A function that deletes state"
   ],
   "answer": [
    0
   ],
   "explanation": "It should undo what the Effect set up."
  },
  {
   "id": 163,
   "topic": "effects",
   "difficulty": "medium",
   "question": "Why does an Effect run as setup → cleanup → setup in development?",
   "options": [
    "Because of HMR",
    "StrictMode re-mounts components to check that the cleanup works",
    "Because the dependency array is wrong",
    "There is a bug in React"
   ],
   "answer": [
    1
   ],
   "explanation": "Fix the cleanup rather than trying to prevent this."
  },
  {
   "id": 164,
   "topic": "effects",
   "difficulty": "medium",
   "question": "Which of these usually do NOT need an Effect? (select all that apply)",
   "options": [
    "Subscribing to a browser event",
    "Reacting to a button click",
    "Calculating values from props or state",
    "Resetting all state when a prop changes"
   ],
   "answer": [
    1,
    2,
    3
   ],
   "explanation": "Subscriptions to outside systems are what Effects are for."
  },
  {
   "id": 165,
   "topic": "effects",
   "difficulty": "medium",
   "question": "How do you avoid showing stale results when fetching in an Effect?",
   "options": [
    "Use a longer timeout",
    "Remove the dependency array",
    "Set an \"ignore\" flag in the cleanup and check it before setting state",
    "Fetch twice"
   ],
   "answer": [
    2
   ],
   "explanation": "The cleanup runs before the next fetch starts."
  },
  {
   "id": 166,
   "topic": "effects",
   "difficulty": "medium",
   "question": "Who decides an Effect's dependencies?",
   "options": [
    "You can choose any values you like",
    "Only the parent component",
    "Your code: every reactive value used inside must be listed",
    "React decides randomly"
   ],
   "answer": [
    2
   ],
   "explanation": "To remove a dependency, change the code so it isn't needed."
  },
  {
   "id": 167,
   "topic": "effects",
   "difficulty": "hard",
   "question": "What is useEffectEvent for?",
   "options": [
    "Replacing useEffect entirely",
    "Reading the latest props or state inside an Effect without making them dependencies",
    "Running Effects twice",
    "Handling click events"
   ],
   "answer": [
    1
   ],
   "explanation": "Use it only for logic called from inside Effects."
  },
  {
   "id": 168,
   "topic": "effects",
   "difficulty": "hard",
   "question": "An object is created in the component body and used as a dependency. What happens?",
   "options": [
    "React throws an error",
    "The Effect runs only once",
    "The Effect re-runs after every render, because the object is new each time",
    "React deep-compares it"
   ],
   "answer": [
    2
   ],
   "explanation": "Create the object inside the Effect, or depend on primitive values."
  },
  {
   "id": 169,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What causes an infinite loop in this code?",
   "code": "useEffect(() => {\n  setCount(count + 1);\n});",
   "options": [
    "count is const",
    "useEffect cannot set state",
    "The Effect sets state on every render, which triggers another render",
    "Nothing: it runs once"
   ],
   "answer": [
    2
   ],
   "explanation": "Ask whether you really need an Effect here."
  },
  {
   "id": 170,
   "topic": "effects",
   "difficulty": "medium",
   "question": "From the Effect's point of view, what are its two jobs?",
   "options": [
    "Create and delete state",
    "Mount and update",
    "Start synchronising, and stop synchronising",
    "Fetch and render"
   ],
   "answer": [
    2
   ],
   "explanation": "It may do this many times as the dependencies change."
  },
  {
   "id": 171,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is useMemo used for?",
   "options": [
    "Running side effects",
    "Storing DOM refs",
    "Caching an expensive calculation between renders",
    "Creating context"
   ],
   "answer": [
    2
   ],
   "explanation": "For example: useMemo(() => filterTodos(todos, tab), [todos, tab])."
  },
  {
   "id": 172,
   "topic": "hooks",
   "difficulty": "easy",
   "question": "How must a custom Hook be named?",
   "options": [
    "Any name",
    "hookSomething",
    "useSomething (use + a capital letter)",
    "SomethingHook"
   ],
   "answer": [
    2
   ],
   "explanation": "The name tells React and the linter that the Rules of Hooks apply."
  },
  {
   "id": 173,
   "topic": "hooks",
   "difficulty": "easy",
   "question": "What do custom Hooks share between components?",
   "options": [
    "Props",
    "DOM elements",
    "State",
    "Logic, not state"
   ],
   "answer": [
    3
   ],
   "explanation": "Each call has its own independent state."
  },
  {
   "id": 174,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "Two components call useOnlineStatus(). How many isOnline states exist?",
   "options": [
    "One shared one",
    "None",
    "It depends on render order",
    "Two independent ones"
   ],
   "answer": [
    3
   ],
   "explanation": "Each call is like calling useState separately."
  },
  {
   "id": 175,
   "topic": "hooks",
   "difficulty": "easy",
   "question": "A function named useFormat calls no Hooks. What should you do?",
   "options": [
    "Keep the name",
    "Convert it into a component",
    "Rename it to a normal name, such as formatX",
    "Add a useState to it"
   ],
   "answer": [
    2
   ],
   "explanation": "Only functions that call Hooks should start with use."
  },
  {
   "id": 176,
   "topic": "hooks",
   "difficulty": "easy",
   "question": "What can a custom Hook call? (select all that apply)",
   "options": [
    "useEffect",
    "Other custom Hooks",
    "Nothing: Hooks cannot call Hooks",
    "useState"
   ],
   "answer": [
    0,
    1,
    3
   ],
   "explanation": "Custom Hooks are built out of other Hooks."
  },
  {
   "id": 177,
   "topic": "hooks",
   "difficulty": "easy",
   "question": "When does the code inside a custom Hook run?",
   "options": [
    "Only once",
    "Only on mount",
    "Only when its inputs change",
    "On every render of the component that uses it"
   ],
   "answer": [
    3
   ],
   "explanation": "That's why it always sees the latest props and state."
  },
  {
   "id": 178,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "Which are good reasons to write a custom Hook? (select all that apply)",
   "options": [
    "The same Effect logic is repeated in several components",
    "To share one piece of state between unrelated components",
    "To give a complicated Effect a clear, descriptive name",
    "To wrap a plain calculation that uses no Hooks"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "To share state itself, lift it up or use context."
  },
  {
   "id": 179,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "What does useState(() => expensiveRead()) do?",
   "options": [
    "Runs expensiveRead only on the first render (lazy initial state)",
    "Throws an error",
    "Runs it on every render",
    "Stores the function as state"
   ],
   "answer": [
    0
   ],
   "explanation": "Pass a function, not its result."
  },
  {
   "id": 180,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "Why do the docs discourage generic Hooks like useMount(fn)?",
   "options": [
    "They are slower",
    "They cannot use useEffect",
    "They are not allowed",
    "They hide dependencies and don't describe a concrete purpose"
   ],
   "answer": [
    3
   ],
   "explanation": "Prefer focused Hooks such as useChatRoom(roomId)."
  },
  {
   "id": 181,
   "topic": "hooks",
   "difficulty": "easy",
   "question": "What can a custom Hook return?",
   "options": [
    "Nothing",
    "Only an array of two items",
    "Any value: an array, an object, a function, a number…",
    "Only JSX"
   ],
   "answer": [
    2
   ],
   "explanation": "Pick whatever shape is easiest to use."
  },
  {
   "id": 182,
   "topic": "thinking",
   "difficulty": "easy",
   "question": "What is the correct order of the \"Thinking in React\" steps?",
   "options": [
    "Add state → write CSS → break into components → test",
    "Break into components → static version → find minimal state → decide where it lives → add inverse data flow",
    "Static version → add Effects → break into components",
    "Find state → write reducers → add context → build UI"
   ],
   "answer": [
    1
   ],
   "explanation": "Building static first keeps typing separate from thinking."
  },
  {
   "id": 183,
   "topic": "thinking",
   "difficulty": "easy",
   "question": "What does the static version use?",
   "options": [
    "Context",
    "Only state",
    "Only props (no state)",
    "Effects"
   ],
   "answer": [
    2
   ],
   "explanation": "Interactivity comes later."
  },
  {
   "id": 184,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "When is a piece of data NOT state? (select all that apply)",
   "options": [
    "It is passed in from a parent via props",
    "It can be calculated from existing state or props",
    "It stays the same over time",
    "It changes when the user types"
   ],
   "answer": [
    0,
    1,
    2
   ],
   "explanation": "What remains is the minimal state."
  },
  {
   "id": 185,
   "topic": "thinking",
   "difficulty": "easy",
   "question": "In the product table, is the filtered product list state?",
   "options": [
    "Only if there are many products",
    "It should be a ref",
    "No: it is calculated from the products, the search text and the checkbox",
    "Yes"
   ],
   "answer": [
    2
   ],
   "explanation": "Derived values are calculated during render."
  },
  {
   "id": 186,
   "topic": "thinking",
   "difficulty": "easy",
   "question": "Where should a piece of state live?",
   "options": [
    "In context by default",
    "In the closest common parent of all the components that use it",
    "Always in App",
    "In the deepest component"
   ],
   "answer": [
    1
   ],
   "explanation": "If there is no natural parent, create one."
  },
  {
   "id": 187,
   "topic": "thinking",
   "difficulty": "easy",
   "question": "What is \"inverse data flow\"?",
   "options": [
    "Rendering from bottom to top",
    "Data flowing from child state into the parent state automatically",
    "Children call handler props so that the parent can update its state",
    "Reversing an array"
   ],
   "answer": [
    2
   ],
   "explanation": "For example: onFilterTextChange={setFilterText}."
  },
  {
   "id": 188,
   "topic": "thinking",
   "difficulty": "easy",
   "question": "What is the single responsibility principle for components?",
   "options": [
    "Each component can have only one prop",
    "Each app should have one component",
    "Each component should ideally do one thing",
    "Each file can have only one line"
   ],
   "answer": [
    2
   ],
   "explanation": "Split a component when it grows too many jobs."
  },
  {
   "id": 189,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "You give an input value={filterText} but no onChange. What happens when you type?",
   "options": [
    "React crashes",
    "It works normally",
    "Nothing changes: the input is controlled and its state never updates",
    "The page reloads"
   ],
   "answer": [
    2
   ],
   "explanation": "Add onChange to update the state."
  },
  {
   "id": 190,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In FilterableProductTable, which of these are state? (select all that apply)",
   "options": [
    "The search text",
    "The filtered product list",
    "The original product list (a prop)",
    "The \"only in stock\" checkbox"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "Only two pieces of state are needed."
  },
  {
   "id": 191,
   "topic": "thinking",
   "difficulty": "easy",
   "question": "What is one-way data flow?",
   "options": [
    "Data passes up automatically",
    "Data flows between siblings",
    "Only one component may have data",
    "Data passes down from parent to child through props"
   ],
   "answer": [
    3
   ],
   "explanation": "Inverse flow uses callbacks, not automatic syncing."
  },
  {
   "id": 192,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 6, 12, 2, 5];\nconsole.log(nums.filter(x => x > 6));",
   "options": [
    "[3, 6, 2, 5]",
    "[false, false, true, false, false]",
    "[12]",
    "[3, 6, 12, 2, 5]"
   ],
   "answer": [
    2
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 193,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [5, 6, 2];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "14",
    "'562'",
    "2",
    "13"
   ],
   "answer": [
    3
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 5 + 6 + 2 = 13.",
   "template": "js-reduce"
  },
  {
   "id": 194,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [14, 11, 3, 8, 10];\nconsole.log(nums.find(x => x > 15));",
   "options": [
    "-1",
    "null",
    "[]",
    "undefined"
   ],
   "answer": [
    3
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 195,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [10, 5, 7, 8];\nconsole.log(nums.every(x => x > 4));",
   "options": [
    "[10, 5, 7, 8]",
    "true",
    "undefined",
    "false"
   ],
   "answer": [
    1
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 196,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['banana', 'kiwi', 'grape', 'mango'];\nconsole.log(fruits.includes('grape'));",
   "options": [
    "false",
    "undefined",
    "2",
    "true"
   ],
   "answer": [
    3
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 197,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of size?",
   "code": "const options = { id: 1, size: 0 };\nconst { size = 'blue' } = options;\nconsole.log(size);",
   "options": [
    "undefined",
    "'blue'",
    "0",
    "An error is thrown"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 198,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { city: 'Pune' };\nconst { city: town } = data;\nconsole.log(town);",
   "options": [
    "ReferenceError: town is not defined",
    "'Pune'",
    "undefined",
    "'city'"
   ],
   "answer": [
    1
   ],
   "explanation": "{ city: town } reads data.city into a NEW variable called town. No variable named city is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 199,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['pink', 'green', 'red', 'blue'];\nconst [first, ...rest] = colors;\nconsole.log(rest);",
   "options": [
    "['pink', 'green', 'red', 'blue']",
    "'green'",
    "['pink', 'green', 'red']",
    "['green', 'red', 'blue']"
   ],
   "answer": [
    3
   ],
   "explanation": "The rest element collects all the remaining items into a new array.",
   "template": "js-array-destructure"
  },
  {
   "id": 200,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { speed: 'dark', color: 'slow' };\nconst user = { color: 'light', lang: 'en' };\nconst merged = { ...defaults, color: 'custom' };\nconsole.log(merged.color);",
   "options": [
    "'custom'",
    "undefined",
    "'slow'",
    "'light'"
   ],
   "answer": [
    0
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 201,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = false;\nconsole.log(value ?? 'fallback');",
   "options": [
    "'fallback'",
    "null",
    "undefined",
    "false"
   ],
   "answer": [
    3
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 202,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: { city: 'Delhi' } };\nconsole.log(user.profile.city);",
   "options": [
    "null",
    "A TypeError is thrown",
    "'Delhi'",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 203,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const name = 'chen';\nconsole.log(`Hello, ${name.toUpperCase()}!`);",
   "options": [
    "'Hello, chen!'",
    "'Hello, ${name.toUpperCase()}!'",
    "'Hello, name.toUpperCase()!'",
    "'Hello, CHEN!'"
   ],
   "answer": [
    3
   ],
   "explanation": "Any expression, including method calls, can go inside ${...}.",
   "template": "js-template"
  },
  {
   "id": 204,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "'' (empty string)",
    "false",
    "NaN",
    "0",
    "[] (empty array)"
   ],
   "answer": [
    0,
    1,
    2,
    3
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 205,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "unshift()",
    "reverse()",
    "slice()",
    "toReversed()",
    "toSorted()"
   ],
   "answer": [
    2,
    3,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 206,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof 'hi');",
   "options": [
    "'object'",
    "'array'",
    "'string'",
    "'function'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 207,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "console.log(null === undefined);",
   "options": [
    "true",
    "false",
    "undefined",
    "A TypeError is thrown"
   ],
   "answer": [
    1
   ],
   "explanation": "Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.",
   "template": "js-equality"
  },
  {
   "id": 208,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const a = { count: 1 };\nconst b = { ...a };\nb.count = 2;\nconsole.log(a.count, a === b);",
   "options": [
    "2 false",
    "3 true",
    "1 false",
    "1 true"
   ],
   "answer": [
    2
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 209,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['d', 'c', 'e', 'b', 'f'];\nconsole.log(letters.slice(1, 2));",
   "options": [
    "['c']",
    "['d']",
    "['c', 'd']",
    "[]"
   ],
   "answer": [
    0
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 210,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [9, 115, 2, 26, 34];\nconsole.log(nums.toSorted((a, b) => b - a));",
   "options": [
    "[115, 34, 26, 9, 2]",
    "[115, 2, 26, 34, 9]",
    "[9, 115, 2, 26, 34]",
    "[2, 9, 26, 34, 115]"
   ],
   "answer": [
    0
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 211,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { email: 1, name: 2 };\nconsole.log(Object.values(user));",
   "options": [
    "2",
    "['email', 1]",
    "[1, 2]",
    "['email', 'name']"
   ],
   "answer": [
    2
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 212,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "3 3 3",
    "1 2 3",
    "0 1 2",
    "2 2 2"
   ],
   "answer": [
    0
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 3 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 213,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const count = 5;\nreturn <div>{count && <b>New!</b>}</div>;",
   "options": [
    "The text \"false\"",
    "<b>New!</b>",
    "The text \"null\"",
    "Nothing"
   ],
   "answer": [
    1
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 214,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 7. After one click, what does the <h1> show?",
   "code": "const [count, setCount] = useState(7);\nfunction handleClick() {\n  setCount(count + 1);\n}\n// ...\nreturn <h1>{count}</h1>;",
   "options": [
    "undefined",
    "7",
    "8",
    "9"
   ],
   "answer": [
    2
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 215,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setName('x');\n  setEmail(true);\n  setError('x');\n  setAge('x');\n}",
   "options": [
    "5",
    "0",
    "1",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 216,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 3, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'decrement' });\ndispatch({ type: 'decrement' });",
   "options": [
    "3",
    "undefined",
    "2",
    "1"
   ],
   "answer": [
    2
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 217,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('toolbar')}>\n  <div onClick={() => console.log('panel')}>\n    <div onClick={() => console.log('row')}>\n      <button onClick={() => console.log('button')}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "button",
    "button → row",
    "toolbar → panel → row → button",
    "button → row → panel → toolbar"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 218,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 4 times with roomId = 'random', 'general', 'music', 'music'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "1",
    "4",
    "3",
    "0"
   ],
   "answer": [
    2
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 219,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Form's state?",
   "code": "{flag ? <Form color=\"red\" /> : <Form color=\"blue\" />}",
   "options": [
    "The state is kept",
    "It depends on the browser",
    "React throws an error",
    "The state is reset"
   ],
   "answer": [
    0
   ],
   "explanation": "Same component type at the same position, so the state is kept; only the props changed.",
   "template": "react-preserve"
  },
  {
   "id": 220,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'soap', done: true },\n  { id: 2, text: 'rice', done: false },\n  { id: 3, text: 'bread', done: false },\n  { id: 4, text: 'tea', done: true },\n  { id: 5, text: 'eggs', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "5",
    "0",
    "2",
    "3"
   ],
   "answer": [
    2
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 221,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 80 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={0} />",
   "options": [
    "0",
    "null",
    "undefined",
    "'115' (a string)"
   ],
   "answer": [
    0
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 222,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"autofocus\" in JSX?",
   "options": [
    "Autofocus",
    "autoFocus",
    "autofocus",
    "AUTOFOCUS"
   ],
   "answer": [
    1
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 223,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "At the top level of a component function",
    "Inside an event handler function",
    "Inside a regular helper function (not a Hook)",
    "Inside a useEffect callback"
   ],
   "answer": [
    0
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 224,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: An interval ID for a stopwatch?",
   "options": [
    "useRef",
    "useContext",
    "Calculate it during render (no Hook)",
    "useState"
   ],
   "answer": [
    0
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 225,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Resetting all form fields when switching to a different contact?",
   "options": [
    "In the event handler",
    "An Effect (useEffect)",
    "A key on the component",
    "Calculate it during rendering"
   ],
   "answer": [
    2
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 226,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "products is state. Which expressions correctly create the NEXT state to sort the list by name, without mutating? (select all that apply)",
   "options": [
    "products.sort(byName)",
    "[...products].sort(byName)",
    "products.reverse().sort(byName)",
    "products.toSorted(byName)"
   ],
   "answer": [
    1,
    3
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 227,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: The text the user typed into a search box?",
   "options": [
    "Store it in a global variable",
    "Store it in a ref",
    "Calculate it during render",
    "Keep it in state"
   ],
   "answer": [
    3
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 228,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('blue');\n\n<ThemeContext value=\"light\">\n  <ThemeContext value=\"contrast\">\n    <ThemeContext value=\"dark\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'dark'",
    "'blue'",
    "'light'",
    "'contrast'"
   ],
   "answer": [
    3
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 229,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render cities (shape { code, name, country }) with cities.map(city => <Row ... />). Which key is best?",
   "options": [
    "key=\"city\"",
    "key={city.code}",
    "key={index}",
    "key={Math.random()}"
   ],
   "answer": [
    1
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 230,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Card.jsx\nexport function Card() { ... }\n\n// App.jsx\nimport Card from './Card';",
   "options": [
    "Error: React is not defined",
    "It works, but the component renders nothing",
    "It works",
    "Error: the module does not provide that export"
   ],
   "answer": [
    3
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 231,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run logout when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={function () { logout(); }}",
    "onClick={(e) => logout(e)}",
    "onClick={logout}",
    "onClick={logout()}"
   ],
   "answer": [
    0,
    1,
    2
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 232,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 2 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(0);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "2",
    "4",
    "0",
    "1"
   ],
   "answer": [
    0
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 233,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 5 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(1);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "Clicked 6",
    "Clicked 5",
    "Clicked 1",
    "Clicked 2"
   ],
   "answer": [
    2
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 234,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a signup form, which of these should be STATE? (select all that apply)",
   "options": [
    "Whether the form is valid (both fields filled in)",
    "The email input value",
    "The submit status (typing/sending/sent)",
    "The label text \"Email\", which never changes"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 235,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 9, 6];\nconsole.log(nums.map(x => x * x));",
   "options": [
    "[36, 81, 49]",
    "[49, 81, 36]",
    "undefined",
    "[7, 9, 6]"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 236,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 4, 8, 6, 7];\nconsole.log(nums.filter(x => x % 2 !== 0));",
   "options": [
    "2",
    "[3]",
    "[3, 7]",
    "[true, false, false, false, true]"
   ],
   "answer": [
    2
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 237,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 2, 4, 1];\nconsole.log(nums.reduce((max, x) => Math.max(max, x), 0));",
   "options": [
    "6",
    "13",
    "0",
    "1"
   ],
   "answer": [
    0
   ],
   "explanation": "Each step keeps the larger of the running max and the current item.",
   "template": "js-reduce"
  },
  {
   "id": 238,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [9, 13, 3, 10, 5];\nconsole.log(nums.find(x => x > 15));",
   "options": [
    "true",
    "-1",
    "undefined",
    "null"
   ],
   "answer": [
    2
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 239,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 3, 9, 1];\nconsole.log(nums.some(x => x > 2));",
   "options": [
    "[6, 3, 9]",
    "false",
    "true",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 240,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['grape', 'pear', 'mango', 'kiwi'];\nconsole.log(fruits.includes('pear'));",
   "options": [
    "false",
    "true",
    "undefined",
    "1"
   ],
   "answer": [
    1
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 241,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of size?",
   "code": "const options = { id: 1, size: null };\nconst { size = 'en' } = options;\nconsole.log(size);",
   "options": [
    "undefined",
    "An error is thrown",
    "null",
    "'en'"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 242,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { price: 'Hello' };\nconst { price: town } = data;\nconsole.log(price);",
   "options": [
    "ReferenceError: price is not defined",
    "'price'",
    "undefined",
    "'Hello'"
   ],
   "answer": [
    0
   ],
   "explanation": "{ price: town } reads data.price into a NEW variable called town. No variable named price is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 243,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const colors = ['pink', 'red', 'gold', 'green'];\nconst [a, , c] = colors;\nconsole.log(c);",
   "options": [
    "'red'",
    "'gold'",
    "'pink'",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "Empty slots between commas skip items: c gets the item at index 2.",
   "template": "js-array-destructure"
  },
  {
   "id": 244,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { color: 'light', speed: 'small' };\nconst user = { speed: 'en', theme: 'fast' };\nconst merged = { ...defaults, ...user };\nconsole.log(Object.keys(merged).length);",
   "options": [
    "2",
    "3",
    "4",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "Keys that appear in both objects are only counted once in the merged object.",
   "template": "js-spread-merge"
  },
  {
   "id": 245,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 7;\nconsole.log(value || 'fallback');",
   "options": [
    "false",
    "null",
    "true",
    "7"
   ],
   "answer": [
    3
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 246,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: null };\nconsole.log(user?.profile?.city);",
   "options": [
    "A TypeError is thrown",
    "'Unknown'",
    "'Pune'",
    "undefined"
   ],
   "answer": [
    3
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 247,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const name = 'divya';\nconsole.log(`Hello, ${name.toUpperCase()}!`);",
   "options": [
    "'Hello, divya!'",
    "An error is thrown",
    "'Hello, ${name.toUpperCase()}!'",
    "'Hello, DIVYA!'"
   ],
   "answer": [
    3
   ],
   "explanation": "Any expression, including method calls, can go inside ${...}.",
   "template": "js-template"
  },
  {
   "id": 248,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "NaN",
    "'0' (a string)",
    "-1",
    "' ' (a space)",
    "'' (empty string)"
   ],
   "answer": [
    0,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 249,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "shift()",
    "toReversed()",
    "push()",
    "toSorted()",
    "map()"
   ],
   "answer": [
    1,
    3,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 250,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof Symbol());",
   "options": [
    "'number'",
    "'string'",
    "'symbol'",
    "'boolean'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 251,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "console.log(({ a: 1 }) === ({ a: 1 }));",
   "options": [
    "false",
    "A TypeError is thrown",
    "undefined",
    "true"
   ],
   "answer": [
    0
   ],
   "explanation": "Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.",
   "template": "js-equality"
  },
  {
   "id": 252,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const a = { count: 1 };\nconst b = { ...a };\nb.count = 2;\nconsole.log(a.count, a === b);",
   "options": [
    "2 false",
    "1 false",
    "2 true",
    "3 true"
   ],
   "answer": [
    1
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 253,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['a', 'e', 'b', 'f', 'd'];\nconsole.log(letters.slice(-2));",
   "options": [
    "['f', 'd', 'a']",
    "['f', 'd']",
    "['d']",
    "['a', 'e']"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 254,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const nums = [119, 27, 6, 39, 7];\nconsole.log(nums.toSorted());",
   "options": [
    "[119, 39, 27, 7, 6]",
    "[6, 7, 27, 39, 119]",
    "[119, 27, 6, 39, 7]",
    "[119, 27, 39, 6, 7]"
   ],
   "answer": [
    3
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 255,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { role: 1, city: 2 };\nconsole.log(Object.values(user));",
   "options": [
    "2",
    "[1, 2]",
    "['role', 1]",
    "['role']"
   ],
   "answer": [
    1
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 256,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (var i = 0; i < 5; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "1 2 3 4 5",
    "5 5 5 5 5",
    "4 4 4 4 4",
    "0 1 2 3 4"
   ],
   "answer": [
    1
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 5 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 257,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const total = 0;\nreturn <div>{total > 0 && <b>New!</b>}</div>;",
   "options": [
    "The text \"0\"",
    "<b>New!</b>",
    "Nothing",
    "The text \"false\""
   ],
   "answer": [
    2
   ],
   "explanation": "The left side is now a true/false value, so a stray \"0\" can never appear.",
   "template": "react-and-render"
  },
  {
   "id": 258,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 4. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 4);\n  setNumber(number + 2);\n  setNumber(n => n + 5);\n}}>Click</button>",
   "options": [
    "4",
    "12",
    "11",
    "9"
   ],
   "answer": [
    2
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (4), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 259,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 6. What is logged after one click?",
   "code": "const [count, setCount] = useState(6);\nfunction handleClick() {\n  setCount(c => c + 3);\n  console.log(count);\n}",
   "options": [
    "3",
    "9",
    "12",
    "6"
   ],
   "answer": [
    3
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 260,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setError(true);\n  setStatus(true);\n}",
   "options": [
    "3",
    "1",
    "2",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 261,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 1, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });",
   "options": [
    "5",
    "4",
    "6",
    "1"
   ],
   "answer": [
    0
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 262,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('menu')}>\n  <div onClick={() => console.log('toolbar')}>\n    <div onClick={() => console.log('panel')}>\n      <button onClick={() => console.log('button')}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "button",
    "button → panel",
    "menu → toolbar → panel → button",
    "button → panel → toolbar → menu"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 263,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 6 times with roomId = 'music', 'music', 'music', 'music', 'music', 'music'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, []);",
   "options": [
    "1",
    "6",
    "7",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 264,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Counter's state?",
   "code": "{flag ? <Counter key=\"a\" /> : <Counter key=\"a\" />}",
   "options": [
    "It depends on the browser",
    "The state is reset",
    "React throws an error",
    "The state is kept"
   ],
   "answer": [
    3
   ],
   "explanation": "Same type, same position, same key: React sees the same component.",
   "template": "react-preserve"
  },
  {
   "id": 265,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'eggs', done: true },\n  { id: 2, text: 'rice', done: true },\n  { id: 3, text: 'soap', done: true },\n  { id: 4, text: 'milk', done: true },\n  { id: 5, text: 'jam', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "1",
    "undefined",
    "5",
    "0"
   ],
   "answer": [
    3
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 266,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 40 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={55} />",
   "options": [
    "55",
    "40",
    "null",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 267,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"maxlength\" in JSX?",
   "options": [
    "MAXLENGTH",
    "Maxlength",
    "maxlength",
    "maxLength"
   ],
   "answer": [
    3
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 268,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useRef? (select all that apply)",
   "options": [
    "Inside a regular helper function (not a Hook)",
    "At the top level of a component function",
    "Inside a .map() callback in JSX",
    "At the top level of a custom Hook (useSomething)",
    "Inside an if statement"
   ],
   "answer": [
    1,
    3
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 269,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: The total price of the items in the cart (cart is in state)?",
   "options": [
    "useState",
    "useRef",
    "Calculate it during render (no Hook)",
    "useContext"
   ],
   "answer": [
    2
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 270,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Showing a filtered list based on a search query in state?",
   "options": [
    "Calculate it during rendering",
    "An Effect (useEffect)",
    "A key on the component",
    "In the event handler"
   ],
   "answer": [
    0
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 271,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "tasks is state. Which expressions correctly create the NEXT state to sort the list by name, without mutating? (select all that apply)",
   "options": [
    "[...tasks].sort(byName)",
    "tasks.toSorted(byName)",
    "tasks.sort(byName)",
    "tasks.reverse().sort(byName)"
   ],
   "answer": [
    0,
    1
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 272,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: The total price, given the cart items in state?",
   "options": [
    "Store it in a global variable",
    "Keep it in state",
    "Calculate it during render",
    "Store it in a ref"
   ],
   "answer": [
    2
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 273,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('sepia');\n\n<ThemeContext value=\"contrast\">\n  <ThemeContext value=\"light\">\n    <ThemeContext value=\"blue\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'sepia'",
    "'blue'",
    "'contrast'",
    "'light'"
   ],
   "answer": [
    3
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 274,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render messages (shape { messageId, text, sentAt }) with messages.map(message => <Row ... />). Which key is best?",
   "options": [
    "key={Math.random()}",
    "key={index}",
    "key={message.messageId}",
    "key={message.text}"
   ],
   "answer": [
    2
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 275,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Button.jsx\nexport function Button() { ... }\n\n// App.jsx\nimport { Button as MyButton } from './Button';",
   "options": [
    "Error: the module does not provide that export",
    "It works, but the component renders nothing",
    "Error: React is not defined",
    "It works"
   ],
   "answer": [
    3
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 276,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run openMenu when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={() => openMenu()}",
    "onClick={openMenu()}",
    "onClick={() => openMenu}",
    "onClick={openMenu}",
    "onClick={function () { openMenu(); }}"
   ],
   "answer": [
    0,
    3,
    4
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 277,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 3 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(0);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "1",
    "3",
    "0",
    "6"
   ],
   "answer": [
    1
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 278,
   "topic": "refs",
   "difficulty": "medium",
   "question": "After 5 clicks, what is countRef.current?",
   "code": "const countRef = useRef(2);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "2",
    "7",
    "5",
    "3"
   ],
   "answer": [
    1
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 279,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a todo app, which of these should be STATE? (select all that apply)",
   "options": [
    "The text in the \"new todo\" input",
    "The current filter (all/active/done)",
    "The list of todos",
    "The number of remaining todos"
   ],
   "answer": [
    0,
    1,
    2
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 280,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [2, 2, 2, 7];\nconsole.log(nums.map(x => x - 3));",
   "options": [
    "undefined",
    "[-1, -1, -1, 4]",
    "[2, 2, 2, 7]",
    "[-1, -1, -1]"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 281,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 9, 4, 2, 2];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "[3, 9]",
    "[4, 2, 2]",
    "[4]",
    "[false, false, true, true, true]"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 282,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [2, 7, 4];\nconsole.log(nums.reduce((count, x) => x % 2 === 0 ? count + 1 : count, 0));",
   "options": [
    "[2, 4]",
    "3",
    "2",
    "1"
   ],
   "answer": [
    2
   ],
   "explanation": "It counts the even numbers by adding 1 for each one.",
   "template": "js-reduce"
  },
  {
   "id": 283,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [8, 3, 7, 14, 10];\nconsole.log(nums.find(x => x > 10));",
   "options": [
    "true",
    "undefined",
    "14",
    "3"
   ],
   "answer": [
    2
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 284,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 4, 3, 10];\nconsole.log(nums.every(x => x > 2));",
   "options": [
    "[6, 4, 3, 10]",
    "true",
    "undefined",
    "false"
   ],
   "answer": [
    1
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 285,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['mango', 'kiwi', 'grape', 'apple'];\nconsole.log(fruits.indexOf('banana'));",
   "options": [
    "true",
    "0",
    "undefined",
    "-1"
   ],
   "answer": [
    3
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 286,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of color?",
   "code": "const options = { id: 1, color: 'custom' };\nconst { color = 10 } = options;\nconsole.log(color);",
   "options": [
    "null",
    "'custom'",
    "undefined",
    "An error is thrown"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 287,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { title: 499 };\nconst { title: town } = data;\nconsole.log(town);",
   "options": [
    "undefined",
    "'title'",
    "499",
    "ReferenceError: title is not defined"
   ],
   "answer": [
    2
   ],
   "explanation": "{ title: town } reads data.title into a NEW variable called town. No variable named title is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 288,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['green', 'cyan', 'pink'];\nconst [first, ...rest] = colors;\nconsole.log(rest);",
   "options": [
    "['green', 'cyan']",
    "['green']",
    "['green', 'cyan', 'pink']",
    "['cyan', 'pink']"
   ],
   "answer": [
    3
   ],
   "explanation": "The rest element collects all the remaining items into a new array.",
   "template": "js-array-destructure"
  },
  {
   "id": 289,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { size: 'small', speed: 'en' };\nconst user = { speed: 'fast', theme: 'dark' };\nconst merged = { ...defaults, speed: 'custom' };\nconsole.log(merged.speed);",
   "options": [
    "'fast'",
    "'custom'",
    "'en'",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 290,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = null;\nconsole.log(value && 'fallback');",
   "options": [
    "true",
    "false",
    "null",
    "'fallback'"
   ],
   "answer": [
    2
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 291,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: null };\nconsole.log(user.profile.city);",
   "options": [
    "A TypeError is thrown",
    "null",
    "'Unknown'",
    "'Pune'"
   ],
   "answer": [
    0
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 292,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const a = 3;\nconst b = 3;\nconsole.log(`${a} + ${b} = ${a + b}`);",
   "options": [
    "'3 + 3 = 6'",
    "'6 = 6'",
    "'3 + 3 = 33'",
    "'a + b = 6'"
   ],
   "answer": [
    0
   ],
   "explanation": "Inside ${...}, the expression is evaluated, so a + b is added as numbers.",
   "template": "js-template"
  },
  {
   "id": 293,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "'false' (a string)",
    "0",
    "{} (empty object)",
    "'' (empty string)",
    "null"
   ],
   "answer": [
    1,
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 294,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "shift()",
    "toReversed()",
    "toSorted()",
    "pop()",
    "slice()"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 295,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof {});",
   "options": [
    "'null'",
    "'string'",
    "'object'",
    "'number'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 296,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "console.log('5' === 5);",
   "options": [
    "A TypeError is thrown",
    "undefined",
    "true",
    "false"
   ],
   "answer": [
    3
   ],
   "explanation": "Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.",
   "template": "js-equality"
  },
  {
   "id": 297,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const a = { count: 1 };\nconst b = a;\nb.count = 2;\nconsole.log(a.count, a === b);",
   "options": [
    "1 true",
    "2 false",
    "1 false",
    "2 true"
   ],
   "answer": [
    3
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 298,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['f', 'e', 'd', 'b', 'a'];\nconsole.log(letters.slice(3));",
   "options": [
    "['f', 'e', 'd', 'b', 'a']",
    "['f', 'e']",
    "['a']",
    "['b', 'a']"
   ],
   "answer": [
    3
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 299,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [4, 28, 112, 3, 62];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[3, 4, 28, 62, 112]",
    "[112, 28, 3, 4, 62]",
    "[112, 62, 28, 4, 3]",
    "[4, 28, 112, 3, 62]"
   ],
   "answer": [
    0
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 300,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { age: 1, email: 2, city: 3 };\nconsole.log(Object.entries(user)[0]);",
   "options": [
    "['age', 1]",
    "[1, 2, 3]",
    "3",
    "['age', 'email', 'city']"
   ],
   "answer": [
    0
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 301,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (let i = 0; i < 4; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "1 2 3 4",
    "3 3 3 3",
    "4 4 4 4",
    "0 1 2 3"
   ],
   "answer": [
    3
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 4 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 302,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const score = 5;\nreturn <div>{score > 0 && <b>New!</b>}</div>;",
   "options": [
    "Nothing",
    "The text \"false\"",
    "The text \"0\"",
    "<b>New!</b>"
   ],
   "answer": [
    3
   ],
   "explanation": "The left side is now a true/false value, so a stray \"0\" can never appear.",
   "template": "react-and-render"
  },
  {
   "id": 303,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 3. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 5);\n  setNumber(n => n + 4);\n  setNumber(n => n + 1);\n  setNumber(n => n + 1);\n}}>Click</button>",
   "options": [
    "4",
    "14",
    "3",
    "15"
   ],
   "answer": [
    1
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (3), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 304,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 8. What is alerted after one click?",
   "code": "const [count, setCount] = useState(8);\nfunction handleClick() {\n  setCount(count + 1);\n  setTimeout(() => alert(count), 3000);\n}",
   "options": [
    "undefined",
    "8",
    "10",
    "1"
   ],
   "answer": [
    1
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 305,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setCity(null);\n  setAge(1);\n}",
   "options": [
    "3",
    "1",
    "2",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 306,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 2, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'add', amount: 2 });\ndispatch({ type: 'reset' });\ndispatch({ type: 'add', amount: 2 });",
   "options": [
    "1",
    "7",
    "2",
    "3"
   ],
   "answer": [
    2
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 307,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('card')}>\n  <div onClick={() => console.log('toolbar')}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "button → toolbar",
    "button",
    "button → toolbar → card",
    "card → toolbar → button"
   ],
   "answer": [
    2
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 308,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 4 times with roomId = 'general', 'general', 'general', 'general'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "4",
    "5",
    "0",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 309,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Timer's state?",
   "code": "{flag ? <Timer /> : <Chat />}",
   "options": [
    "The state is reset",
    "The state is kept",
    "React throws an error",
    "It depends on the browser"
   ],
   "answer": [
    0
   ],
   "explanation": "A different component type at the same position resets the state.",
   "template": "react-preserve"
  },
  {
   "id": 310,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'bread', done: true },\n  { id: 2, text: 'jam', done: false },\n  { id: 3, text: 'tea', done: false },\n  { id: 4, text: 'milk', done: true },\n  { id: 5, text: 'soap', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "3",
    "4",
    "2",
    "5"
   ],
   "answer": [
    0
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 311,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 50 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={75} />",
   "options": [
    "'75' (a string)",
    "0",
    "50",
    "75"
   ],
   "answer": [
    3
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 312,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"onkeydown\" in JSX?",
   "options": [
    "onKeyDown",
    "Onkeydown",
    "ONKEYDOWN",
    "onkeydown"
   ],
   "answer": [
    0
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 313,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useRef? (select all that apply)",
   "options": [
    "Inside an if statement",
    "Inside a regular helper function (not a Hook)",
    "At the top level of a component function",
    "Inside an event handler function"
   ],
   "answer": [
    2
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 314,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: Whether a form is submitting (the button shows a spinner)?",
   "options": [
    "useState",
    "useContext",
    "useRef",
    "Calculate it during render (no Hook)"
   ],
   "answer": [
    0
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 315,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Starting a setInterval while a clock is visible?",
   "options": [
    "A key on the component",
    "Calculate it during rendering",
    "An Effect (useEffect)",
    "In the event handler"
   ],
   "answer": [
    2
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 316,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "tasks is state. Which expressions correctly create the NEXT state to reverse the list, without mutating? (select all that apply)",
   "options": [
    "tasks.sort().reverse()",
    "tasks.reverse()",
    "tasks.toReversed()",
    "[...tasks].reverse()"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 317,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: The list of results matching the search text?",
   "options": [
    "Calculate it during render",
    "Keep it in state",
    "Store it in a global variable",
    "Store it in a ref"
   ],
   "answer": [
    0
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 318,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button A get?",
   "code": "const ThemeContext = createContext('blue');\n\n<ThemeContext value=\"sepia\">\n  <ThemeContext value=\"dark\">\n    <ThemeContext value=\"light\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'dark'",
    "'sepia'",
    "'light'",
    "'blue'"
   ],
   "answer": [
    2
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 319,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render songs (shape { trackId, title, artist }) with songs.map(song => <Row ... />). Which key is best?",
   "options": [
    "key={song.title}",
    "key={song.trackId}",
    "key={index}",
    "key=\"song\""
   ],
   "answer": [
    1
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 320,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Gallery.jsx\nexport default function Gallery() { ... }\n\n// App.jsx\nimport { Gallery } from './Gallery';",
   "options": [
    "Error: React is not defined",
    "Error: the module does not provide that export",
    "It works, but the component renders nothing",
    "It works"
   ],
   "answer": [
    1
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 321,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run openMenu when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={openMenu()}",
    "onClick={() => openMenu}",
    "onClick=\"openMenu()\"",
    "onClick={(e) => openMenu(e)}",
    "onClick={() => openMenu()}"
   ],
   "answer": [
    3,
    4
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 322,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 4 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(3);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "4",
    "11",
    "7",
    "3"
   ],
   "answer": [
    3
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 323,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 2 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(4);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "Clicked 4",
    "Clicked 2",
    "Clicked 6",
    "Clicked 5"
   ],
   "answer": [
    0
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 324,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [4, 8, 4];\nconsole.log(nums.map(x => x - 3));",
   "options": [
    "undefined",
    "[1, 5, 1]",
    "[1, 5]",
    "[4, 8, 4]"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 325,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 6, 8, 1, 10];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "[6, 6, 8, 10]",
    "[6, 6, 8, 1, 10]",
    "[1]",
    "[true, true, true, false, true]"
   ],
   "answer": [
    0
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 326,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [5, 5, 7, 8, 2];\nconsole.log(nums.reduce((total, x) => total + x, 6));",
   "options": [
    "8",
    "33",
    "'55782'",
    "27"
   ],
   "answer": [
    1
   ],
   "explanation": "reduce starts with 6 and adds each item: 6 + 5 + 5 + 7 + 8 + 2 = 33.",
   "template": "js-reduce"
  },
  {
   "id": 327,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 2, 8, 1, 12];\nconsole.log(nums.findIndex(x => x > 14));",
   "options": [
    "0",
    "true",
    "[]",
    "-1"
   ],
   "answer": [
    3
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 328,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 9, 6, 8];\nconsole.log(nums.some(x => x > 5));",
   "options": [
    "undefined",
    "true",
    "false",
    "[9, 6, 8]"
   ],
   "answer": [
    1
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 329,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['banana', 'kiwi', 'pear', 'grape'];\nconsole.log(fruits.indexOf('banana'));",
   "options": [
    "-1",
    "true",
    "0",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 330,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of theme?",
   "code": "const options = { id: 1, theme: null };\nconst { theme = 'medium' } = options;\nconsole.log(theme);",
   "options": [
    "'medium'",
    "An error is thrown",
    "null",
    "0"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 331,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { price: 'Hello' };\nconst { price: label } = data;\nconsole.log(price);",
   "options": [
    "'price'",
    "ReferenceError: price is not defined",
    "undefined",
    "'Hello'"
   ],
   "answer": [
    1
   ],
   "explanation": "{ price: label } reads data.price into a NEW variable called label. No variable named price is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 332,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['gold', 'cyan', 'blue'];\nconst [first, ...rest] = colors;\nconsole.log(rest);",
   "options": [
    "['cyan', 'blue']",
    "'cyan'",
    "['gold', 'cyan']",
    "['gold']"
   ],
   "answer": [
    0
   ],
   "explanation": "The rest element collects all the remaining items into a new array.",
   "template": "js-array-destructure"
  },
  {
   "id": 333,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { lang: 'fast', size: 'hi' };\nconst user = { size: 'dark', speed: 'en' };\nconst merged = { ...defaults, ...user };\nconsole.log(Object.keys(merged).length);",
   "options": [
    "2",
    "4",
    "undefined",
    "3"
   ],
   "answer": [
    3
   ],
   "explanation": "Keys that appear in both objects are only counted once in the merged object.",
   "template": "js-spread-merge"
  },
  {
   "id": 334,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 0;\nconsole.log(value || 'fallback');",
   "options": [
    "null",
    "undefined",
    "'fallback'",
    "false"
   ],
   "answer": [
    2
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 335,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: { city: 'Pune' } };\nconsole.log(user.profile.city);",
   "options": [
    "'Pune'",
    "'Unknown'",
    "A TypeError is thrown",
    "null"
   ],
   "answer": [
    0
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 336,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const a = 7;\nconst b = 8;\nconsole.log(`${a} + ${b} = ${a + b}`);",
   "options": [
    "'${a} + ${b} = ${a + b}'",
    "'7 + 8 = 15'",
    "'15 = 15'",
    "'7 + 8 = 78'"
   ],
   "answer": [
    1
   ],
   "explanation": "Inside ${...}, the expression is evaluated, so a + b is added as numbers.",
   "template": "js-template"
  },
  {
   "id": 337,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "'' (empty string)",
    "undefined",
    "'false' (a string)",
    "NaN",
    "' ' (a space)"
   ],
   "answer": [
    0,
    1,
    3
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 338,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "splice()",
    "map()",
    "shift()",
    "toSpliced()",
    "filter()"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 339,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "console.log(typeof []);",
   "options": [
    "'function'",
    "'undefined'",
    "'string'",
    "'object'"
   ],
   "answer": [
    3
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 340,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "console.log([1, 2] === [1, 2]);",
   "options": [
    "true",
    "A TypeError is thrown",
    "undefined",
    "false"
   ],
   "answer": [
    3
   ],
   "explanation": "Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.",
   "template": "js-equality"
  },
  {
   "id": 341,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const a = { count: 1 };\nconst b = a;\nb.count = 2;\nconsole.log(a.count, a === b);",
   "options": [
    "3 true",
    "2 false",
    "2 true",
    "1 true"
   ],
   "answer": [
    2
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 342,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['c', 'e', 'f', 'b', 'a'];\nconsole.log(letters.slice(3));",
   "options": [
    "['a']",
    "['c', 'e']",
    "['b', 'a', 'c']",
    "['b', 'a']"
   ],
   "answer": [
    3
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 343,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [101, 9, 24, 2, 98];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[101, 98, 24, 9, 2]",
    "[101, 9, 24, 2, 98]",
    "[101, 2, 24, 9, 98]",
    "[2, 9, 24, 98, 101]"
   ],
   "answer": [
    3
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 344,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { role: 1, age: 2 };\nconsole.log(Object.values(user));",
   "options": [
    "2",
    "['role']",
    "[1, 2]",
    "['role', 'age']"
   ],
   "answer": [
    2
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 345,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (let i = 0; i < 2; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "2 2",
    "0 1",
    "1 1",
    "1 2"
   ],
   "answer": [
    1
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 2 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 346,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const total = 5;\nreturn <div>{total && <b>New!</b>}</div>;",
   "options": [
    "The text \"null\"",
    "The text \"0\"",
    "The text \"false\"",
    "<b>New!</b>"
   ],
   "answer": [
    3
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 347,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 1. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 2);\n  setNumber(n => n + 1);\n}}>Click</button>",
   "options": [
    "4",
    "1",
    "5",
    "2"
   ],
   "answer": [
    0
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (1), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 348,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 2. What is logged after one click?",
   "code": "const [count, setCount] = useState(2);\nfunction handleClick() {\n  setCount(c => c + 3);\n  console.log(count);\n}",
   "options": [
    "8",
    "5",
    "undefined",
    "2"
   ],
   "answer": [
    3
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 349,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setEmail(1);\n  setStatus('x');\n}",
   "options": [
    "1",
    "0",
    "3",
    "2"
   ],
   "answer": [
    0
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 350,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 2, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'add', amount: 3 });\ndispatch({ type: 'add', amount: 6 });",
   "options": [
    "12",
    "13",
    "11",
    "2"
   ],
   "answer": [
    0
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 351,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('panel')}>\n  <div onClick={() => console.log('menu')}>\n    <div onClick={() => console.log('page')}>\n      <button onClick={() => console.log('button')}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "button",
    "button → page → menu → panel",
    "panel → menu → page → button",
    "button → page"
   ],
   "answer": [
    1
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 352,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'music', 'general', 'general', 'general', 'music' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "1",
    "0",
    "4",
    "3"
   ],
   "answer": [
    3
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 353,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Counter's state?",
   "code": "{flag ? <Counter key=\"Sarah\" /> : <Counter key=\"Sarah\" />}",
   "options": [
    "The state is reset",
    "It depends on the browser",
    "The state is kept",
    "React throws an error"
   ],
   "answer": [
    2
   ],
   "explanation": "Same type, same position, same key: React sees the same component.",
   "template": "react-preserve"
  },
  {
   "id": 354,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'rice', done: false },\n  { id: 2, text: 'soap', done: true },\n  { id: 3, text: 'milk', done: false },\n  { id: 4, text: 'bread', done: false },\n  { id: 5, text: 'tea', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "1",
    "4",
    "0",
    "5"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 355,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 20 }) {\n  return <img width={size} />;\n}\n\n<Avatar size=\"50\" />",
   "options": [
    "0",
    "'50' (a string)",
    "20",
    "null"
   ],
   "answer": [
    1
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 356,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"onclick\" in JSX?",
   "options": [
    "Onclick",
    "ONCLICK",
    "onClick",
    "onclick"
   ],
   "answer": [
    2
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 357,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useContext? (select all that apply)",
   "options": [
    "Inside a .map() callback in JSX",
    "After an early return statement",
    "Inside a useEffect callback",
    "At the top level of a component function"
   ],
   "answer": [
    3
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 358,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: The number of items in a list that is stored in state?",
   "options": [
    "Calculate it during render (no Hook)",
    "useContext",
    "useRef",
    "useState"
   ],
   "answer": [
    0
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 359,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Navigating to a \"thanks\" page after a successful form submit?",
   "options": [
    "Calculate it during rendering",
    "A key on the component",
    "An Effect (useEffect)",
    "In the event handler"
   ],
   "answer": [
    3
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 360,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "items is state. Which expressions correctly create the NEXT state to add newItem to the end, without mutating? (select all that apply)",
   "options": [
    "items[items.length] = newItem",
    "items.concat(newItem)",
    "[...items, newItem]",
    "items.unshift(newItem)"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 361,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: Whether the \"Next\" button is disabled on the last page?",
   "options": [
    "Store it in a global variable",
    "Store it in a ref",
    "Keep it in state",
    "Calculate it during render"
   ],
   "answer": [
    3
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 362,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('blue');\n\n<ThemeContext value=\"sepia\">\n  <ThemeContext value=\"light\">\n    <ThemeContext value=\"contrast\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'sepia'",
    "'light'",
    "'blue'",
    "'contrast'"
   ],
   "answer": [
    1
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 363,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render users (shape { id, name, email }) with users.map(user => <Row ... />). Which key is best?",
   "options": [
    "key=\"user\"",
    "key={Math.random()}",
    "key={user.name}",
    "key={user.id}"
   ],
   "answer": [
    3
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 364,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Header.jsx\nexport function Header() { ... }\n\n// App.jsx\nimport { Header as MyHeader } from './Header';",
   "options": [
    "Error: React is not defined",
    "Error: the module does not provide that export",
    "It works",
    "It works, but the component renders nothing"
   ],
   "answer": [
    2
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 365,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run openMenu when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick=\"openMenu()\"",
    "onClick={(e) => openMenu(e)}",
    "onClick={openMenu}",
    "onClick={function () { openMenu(); }}",
    "onClick={() => openMenu}"
   ],
   "answer": [
    1,
    2,
    3
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 366,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 4 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(1);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "9",
    "5",
    "1",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 367,
   "topic": "refs",
   "difficulty": "medium",
   "question": "After 4 clicks, what is countRef.current?",
   "code": "const countRef = useRef(0);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "undefined",
    "1",
    "4",
    "0"
   ],
   "answer": [
    2
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 368,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a todo app, which of these should be STATE? (select all that apply)",
   "options": [
    "The number of remaining todos",
    "The current filter (all/active/done)",
    "Whether the \"Clear completed\" button is visible",
    "The filtered list of todos"
   ],
   "answer": [
    1
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 369,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [1, 9, 4];\nconsole.log(nums.map(x => x + 3));",
   "options": [
    "[7, 12, 4]",
    "[4, 12, 7]",
    "[1, 9, 4]",
    "[4, 12]"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 370,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 6, 7, 2, 6];\nconsole.log(nums.filter(x => x > 6));",
   "options": [
    "1",
    "[7]",
    "[3, 6, 2, 6]",
    "[3, 6, 7, 2, 6]"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 371,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 2, 2];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "'622'",
    "2",
    "13",
    "10"
   ],
   "answer": [
    3
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 6 + 2 + 2 = 10.",
   "template": "js-reduce"
  },
  {
   "id": 372,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [7, 2, 15, 13, 3];\nconsole.log(nums.findIndex(x => x > 6));",
   "options": [
    "7",
    "0",
    "[7, 15, 13]",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 373,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 9, 3, 4];\nconsole.log(nums.some(x => x > 9));",
   "options": [
    "[]",
    "undefined",
    "false",
    "true"
   ],
   "answer": [
    2
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 374,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['mango', 'kiwi', 'cherry', 'apple'];\nconsole.log(fruits.includes('mango'));",
   "options": [
    "true",
    "undefined",
    "0",
    "false"
   ],
   "answer": [
    0
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 375,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of size?",
   "code": "const options = { id: 1, size: 0 };\nconst { size = 10 } = options;\nconsole.log(size);",
   "options": [
    "'custom'",
    "0",
    "An error is thrown",
    "null"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 376,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { title: 499 };\nconst { title: points } = data;\nconsole.log(points);",
   "options": [
    "499",
    "'title'",
    "ReferenceError: title is not defined",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "{ title: points } reads data.title into a NEW variable called points. No variable named title is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 377,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['gold'];\nconst [main, accent = 'black'] = colors;\nconsole.log(accent);",
   "options": [
    "null",
    "'gold'",
    "'black'",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "There is no second item, so the default 'black' is used.",
   "template": "js-array-destructure"
  },
  {
   "id": 378,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { speed: 'light', size: 'slow' };\nconst user = { size: 'small', theme: 'big' };\nconst merged = { ...user, ...defaults };\nconsole.log(Object.keys(merged).length);",
   "options": [
    "undefined",
    "2",
    "3",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "Keys that appear in both objects are only counted once in the merged object.",
   "template": "js-spread-merge"
  },
  {
   "id": 379,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = '';\nconsole.log(value && 'fallback');",
   "options": [
    "''",
    "undefined",
    "null",
    "'fallback'"
   ],
   "answer": [
    0
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 380,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: null };\nconsole.log(user.profile.city);",
   "options": [
    "'Unknown'",
    "A TypeError is thrown",
    "undefined",
    "'Pune'"
   ],
   "answer": [
    1
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 381,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const name = 'ben';\nconsole.log(`Hello, ${name.toUpperCase()}!`);",
   "options": [
    "'Hello, ben!'",
    "'Hello, BEN!'",
    "'Hello, name.toUpperCase()!'",
    "'Hello, ${name.toUpperCase()}!'"
   ],
   "answer": [
    1
   ],
   "explanation": "Any expression, including method calls, can go inside ${...}.",
   "template": "js-template"
  },
  {
   "id": 382,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "'' (empty string)",
    "[] (empty array)",
    "null",
    "0",
    "-1"
   ],
   "answer": [
    0,
    2,
    3
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 383,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "toSpliced()",
    "slice()",
    "reverse()",
    "shift()",
    "splice()"
   ],
   "answer": [
    2,
    3,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 384,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof true);",
   "options": [
    "'array'",
    "'undefined'",
    "'boolean'",
    "'object'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 385,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const list = [1, 2];\nconst next = list;\nnext.push(3);\nconsole.log(list.length, list === next);",
   "options": [
    "1 true",
    "2 false",
    "1 false",
    "3 true"
   ],
   "answer": [
    3
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 386,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['b', 'c', 'f', 'd', 'e'];\nconsole.log(letters.slice(3));",
   "options": [
    "['d', 'e']",
    "['b', 'c']",
    "['b', 'c', 'f', 'd', 'e']",
    "['d', 'e', 'b']"
   ],
   "answer": [
    0
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 387,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const nums = [5, 7, 24, 99, 100];\nconsole.log(nums.toSorted());",
   "options": [
    "[5, 7, 24, 99, 100]",
    "undefined",
    "[100, 24, 5, 7, 99]",
    "[100, 99, 24, 7, 5]"
   ],
   "answer": [
    2
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 388,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { role: 1, name: 2, email: 3, age: 4 };\nconsole.log(Object.values(user));",
   "options": [
    "[1, 2, 3, 4]",
    "['role', 1]",
    "4",
    "['role']"
   ],
   "answer": [
    0
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 389,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "1 2 3",
    "3 3 3",
    "0 1 2",
    "2 2 2"
   ],
   "answer": [
    2
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 3 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 390,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const items = false;\nreturn <div>{items && <b>New!</b>}</div>;",
   "options": [
    "The text \"0\"",
    "The text \"false\"",
    "The text \"null\"",
    "Nothing"
   ],
   "answer": [
    3
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 391,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 2. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 5);\n  setNumber(n => n + 3);\n  setNumber(number + 5);\n}}>Click</button>",
   "options": [
    "3",
    "15",
    "7",
    "8"
   ],
   "answer": [
    2
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (2), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 392,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 5. After one click, what does the <h1> show?",
   "code": "const [count, setCount] = useState(5);\nfunction handleClick() {\n  setCount(count + 1);\n}\n// ...\nreturn <h1>{count}</h1>;",
   "options": [
    "7",
    "5",
    "6",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 393,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setName('x');\n  setCity(1);\n  setError('x');\n}",
   "options": [
    "4",
    "1",
    "0",
    "3"
   ],
   "answer": [
    1
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 394,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 2, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'reset' });\ndispatch({ type: 'reset' });\ndispatch({ type: 'decrement' });",
   "options": [
    "2",
    "-2",
    "-1",
    "3"
   ],
   "answer": [
    2
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 395,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('toolbar')}>\n  <div onClick={e => { e.stopPropagation(); console.log('panel'); }}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "panel → button",
    "button → panel",
    "button",
    "button → panel → toolbar"
   ],
   "answer": [
    1
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 396,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'general', 'music', 'music', 'music', 'music'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, []);",
   "options": [
    "0",
    "1",
    "3",
    "5"
   ],
   "answer": [
    1
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 397,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'bread', done: false },\n  { id: 2, text: 'eggs', done: true },\n  { id: 3, text: 'milk', done: true },\n  { id: 4, text: 'rice', done: false },\n  { id: 5, text: 'tea', done: false },\n  { id: 6, text: 'soap', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "4",
    "3",
    "0",
    "6"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 398,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 70 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={105} />",
   "options": [
    "105",
    "null",
    "0",
    "'105' (a string)"
   ],
   "answer": [
    0
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 399,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"rowspan\" in JSX?",
   "options": [
    "ROWSPAN",
    "rowSpan",
    "rowspan",
    "Rowspan"
   ],
   "answer": [
    1
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 400,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useEffect? (select all that apply)",
   "options": [
    "Inside a .map() callback in JSX",
    "Inside an event handler function",
    "At the top level of a component function",
    "Inside a for loop"
   ],
   "answer": [
    2
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 401,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: How many times a button was clicked, only sent to analytics?",
   "options": [
    "Calculate it during render (no Hook)",
    "useContext",
    "useRef",
    "useState"
   ],
   "answer": [
    2
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 402,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Computing fullName from firstName and lastName?",
   "options": [
    "In the event handler",
    "A key on the component",
    "An Effect (useEffect)",
    "Calculate it during rendering"
   ],
   "answer": [
    3
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 403,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "products is state. Which expressions correctly create the NEXT state to remove the item with id, without mutating? (select all that apply)",
   "options": [
    "products.filter(x => x.id !== id)",
    "products.pop()",
    "products.splice(index, 1)",
    "delete products[index]"
   ],
   "answer": [
    0
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 404,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: The current page number of a paginated list?",
   "options": [
    "Store it in a global variable",
    "Calculate it during render",
    "Store it in a ref",
    "Keep it in state"
   ],
   "answer": [
    3
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 405,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button A get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"dark\">\n  <ThemeContext value=\"contrast\">\n    <ThemeContext value=\"blue\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'contrast'",
    "'dark'",
    "'blue'",
    "'light'"
   ],
   "answer": [
    2
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 406,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render orders (shape { orderNo, total, status }) with orders.map(order => <Row ... />). Which key is best?",
   "options": [
    "key={index}",
    "key={order.orderNo}",
    "key={order.status}",
    "key=\"order\""
   ],
   "answer": [
    1
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 407,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Avatar.jsx\nexport default function Avatar() { ... }\n\n// App.jsx\nimport Thing from './Avatar';",
   "options": [
    "It works, but the component renders nothing",
    "Error: the module does not provide that export",
    "Error: React is not defined",
    "It works"
   ],
   "answer": [
    3
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 408,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run openMenu when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={(e) => openMenu(e)}",
    "onClick={openMenu()}",
    "onClick=\"openMenu()\"",
    "onClick={() => openMenu()}"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 409,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 2 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(5);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "7",
    "5",
    "9",
    "6"
   ],
   "answer": [
    0
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 410,
   "topic": "refs",
   "difficulty": "medium",
   "question": "After 2 clicks, what is countRef.current?",
   "code": "const countRef = useRef(3);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "3",
    "2",
    "4",
    "5"
   ],
   "answer": [
    3
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 411,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a todo app, which of these should be STATE? (select all that apply)",
   "options": [
    "Whether the \"Clear completed\" button is visible",
    "The list of todos",
    "The filtered list of todos",
    "The text in the \"new todo\" input",
    "The current filter (all/active/done)",
    "The number of remaining todos"
   ],
   "answer": [
    1,
    3,
    4
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 412,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 8, 7, 4];\nconsole.log(nums.map(x => x + 5));",
   "options": [
    "[12, 13, 12, 9]",
    "[7, 8, 7, 4]",
    "[9, 12, 13, 12]",
    "[12, 13, 12]"
   ],
   "answer": [
    0
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 413,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 5, 4, 1, 6];\nconsole.log(nums.filter(x => x > 8));",
   "options": [
    "[0]",
    "[false, false, false, false, false]",
    "[]",
    "[7, 5, 4, 1, 6]"
   ],
   "answer": [
    2
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 414,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [8, 3, 3, 6, 5];\nconsole.log(nums.reduce((max, x) => Math.max(max, x), 0));",
   "options": [
    "8",
    "3",
    "5",
    "25"
   ],
   "answer": [
    0
   ],
   "explanation": "Each step keeps the larger of the running max and the current item.",
   "template": "js-reduce"
  },
  {
   "id": 415,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [4, 1, 5, 12, 8];\nconsole.log(nums.findIndex(x => x > 14));",
   "options": [
    "-1",
    "[]",
    "true",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 416,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [1, 2, 6, 3];\nconsole.log(nums.every(x => x > 3));",
   "options": [
    "false",
    "true",
    "undefined",
    "[6]"
   ],
   "answer": [
    0
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 417,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['cherry', 'banana', 'mango', 'grape'];\nconsole.log(fruits.indexOf('grape'));",
   "options": [
    "3",
    "4",
    "-1",
    "true"
   ],
   "answer": [
    0
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 418,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of limit?",
   "code": "const options = { id: 1, limit: 0 };\nconst { limit = 'medium' } = options;\nconsole.log(limit);",
   "options": [
    "undefined",
    "An error is thrown",
    "'custom'",
    "0"
   ],
   "answer": [
    3
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 419,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { title: 'Hello' };\nconst { title: label } = data;\nconsole.log(label);",
   "options": [
    "'Hello'",
    "undefined",
    "'title'",
    "ReferenceError: title is not defined"
   ],
   "answer": [
    0
   ],
   "explanation": "{ title: label } reads data.title into a NEW variable called label. No variable named title is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 420,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const colors = ['gold', 'cyan', 'pink', 'blue'];\nconst [a, , c] = colors;\nconsole.log(c);",
   "options": [
    "undefined",
    "'pink'",
    "'cyan'",
    "'gold'"
   ],
   "answer": [
    1
   ],
   "explanation": "Empty slots between commas skip items: c gets the item at index 2.",
   "template": "js-array-destructure"
  },
  {
   "id": 421,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { lang: 'slow', mode: 'hi' };\nconst user = { mode: 'light', size: 'fast' };\nconst merged = { ...defaults, mode: 'custom' };\nconsole.log(merged.mode);",
   "options": [
    "'custom'",
    "'hi'",
    "undefined",
    "'light'"
   ],
   "answer": [
    0
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 422,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 7;\nconsole.log(value || 'fallback');",
   "options": [
    "true",
    "false",
    "'fallback'",
    "7"
   ],
   "answer": [
    3
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 423,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: { city: 'Delhi' } };\nconsole.log(user.profile.city);",
   "options": [
    "null",
    "'Unknown'",
    "'Delhi'",
    "A TypeError is thrown"
   ],
   "answer": [
    2
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 424,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const n = 3;\nconsole.log(`${n} item${n === 1 ? '' : 's'}`);",
   "options": [
    "'n items'",
    "'3 items'",
    "'3 item'",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "A ternary inside ${...} is a common way to pluralise words.",
   "template": "js-template"
  },
  {
   "id": 425,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "-1",
    "[] (empty array)",
    "'false' (a string)",
    "'' (empty string)",
    "NaN"
   ],
   "answer": [
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 426,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "reverse()",
    "toReversed()",
    "fill()",
    "concat()",
    "unshift()"
   ],
   "answer": [
    1,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 427,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "console.log(typeof new Date());",
   "options": [
    "'boolean'",
    "'object'",
    "'number'",
    "'undefined'"
   ],
   "answer": [
    1
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 428,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "console.log(null == undefined);",
   "options": [
    "undefined",
    "true",
    "A TypeError is thrown",
    "false"
   ],
   "answer": [
    1
   ],
   "explanation": "Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.",
   "template": "js-equality"
  },
  {
   "id": 429,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const a = { count: 1 };\nconst b = a;\nb.count = 2;\nconsole.log(a.count, a === b);",
   "options": [
    "2 true",
    "2 false",
    "1 false",
    "3 true"
   ],
   "answer": [
    0
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 430,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['a', 'e', 'f', 'c', 'd'];\nconsole.log(letters.slice(-1));",
   "options": [
    "['a', 'e', 'f', 'c', 'd']",
    "['d']",
    "['a']",
    "[]"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 431,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [9, 8, 69, 119, 30];\nconsole.log(nums.toSorted((a, b) => b - a));",
   "options": [
    "[8, 9, 30, 69, 119]",
    "[119, 69, 30, 9, 8]",
    "[119, 30, 69, 8, 9]",
    "[9, 8, 69, 119, 30]"
   ],
   "answer": [
    1
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 432,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { email: 1, name: 2, role: 3, city: 4 };\nconsole.log(Object.entries(user)[0]);",
   "options": [
    "4",
    "[1, 2, 3, 4]",
    "['email', 1]",
    "['email', 'name', 'role', 'city']"
   ],
   "answer": [
    2
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 433,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const count = '';\nreturn <div>{count && <b>New!</b>}</div>;",
   "options": [
    "The text \"false\"",
    "The text \"null\"",
    "The text \"0\"",
    "Nothing"
   ],
   "answer": [
    3
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 434,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 0. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 4);\n  setNumber(n => n + 2);\n  setNumber(50);\n}}>Click</button>",
   "options": [
    "50",
    "1",
    "51",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (0), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 435,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 7. What is alerted after one click?",
   "code": "const [count, setCount] = useState(7);\nfunction handleClick() {\n  setCount(count + 5);\n  alert(count);\n}",
   "options": [
    "7",
    "5",
    "undefined",
    "12"
   ],
   "answer": [
    0
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 436,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setError(null);\n  setStatus(1);\n}",
   "options": [
    "1",
    "2",
    "0",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 437,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 1, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'add', amount: 6 });\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'reset' });",
   "options": [
    "9",
    "1",
    "0",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 438,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('page')}>\n  <div onClick={() => console.log('toolbar')}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "page → toolbar → button",
    "button",
    "button → toolbar",
    "button → toolbar → page"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 439,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'general', 'travel', 'travel', 'travel', 'music' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "5",
    "4",
    "6",
    "3"
   ],
   "answer": [
    3
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 440,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false and back to true. What happens to Timer's state?",
   "code": "{flag && <Timer />}",
   "options": [
    "It depends on the browser",
    "React throws an error",
    "The state is reset",
    "The state is kept"
   ],
   "answer": [
    2
   ],
   "explanation": "When flag becomes false, the component is removed; when it comes back, it starts fresh.",
   "template": "react-preserve"
  },
  {
   "id": 441,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'eggs', done: true },\n  { id: 2, text: 'soap', done: false },\n  { id: 3, text: 'jam', done: false },\n  { id: 4, text: 'rice', done: true },\n  { id: 5, text: 'tea', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "3",
    "5",
    "0",
    "4"
   ],
   "answer": [
    0
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 442,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 80 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={null} />",
   "options": [
    "'85' (a string)",
    "null",
    "85",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 443,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"datetime\" in JSX?",
   "options": [
    "Datetime",
    "datetime",
    "DATETIME",
    "dateTime"
   ],
   "answer": [
    3
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 444,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useRef? (select all that apply)",
   "options": [
    "After an early return statement",
    "At the top level of a custom Hook (useSomething)",
    "Inside a .map() callback in JSX",
    "Inside a useEffect callback"
   ],
   "answer": [
    1
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 445,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: Whether a dropdown menu is open?",
   "options": [
    "useState",
    "Calculate it during render (no Hook)",
    "useContext",
    "useRef"
   ],
   "answer": [
    0
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 446,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "tasks is state. Which expressions correctly create the NEXT state to mark the item with id as done, without mutating? (select all that apply)",
   "options": [
    "tasks.map(x => x.id === id ? { ...x, done: true } : x)",
    "tasks.map(x => { if (x.id === id) x.done = true; return x; })",
    "tasks.find(x => x.id === id).done = true",
    "[...tasks].map(x => x.id === id ? { ...x, done: true } : x)"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 447,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('dark');\n\n<ThemeContext value=\"sepia\">\n  <ThemeContext value=\"blue\">\n    <ThemeContext value=\"light\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'sepia'",
    "'blue'",
    "'light'",
    "'dark'"
   ],
   "answer": [
    1
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 448,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render songs (shape { trackId, title, artist }) with songs.map(song => <Row ... />). Which key is best?",
   "options": [
    "key={song.trackId}",
    "key={index}",
    "key=\"song\"",
    "key={Math.random()}"
   ],
   "answer": [
    0
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 449,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Gallery.jsx\nexport function Gallery() { ... }\n\n// App.jsx\nimport { Gallery } from './Gallery';",
   "options": [
    "Error: React is not defined",
    "It works, but the component renders nothing",
    "It works",
    "Error: the module does not provide that export"
   ],
   "answer": [
    2
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 450,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run logout when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={logout}",
    "onClick={(e) => logout(e)}",
    "onClick={() => logout}",
    "onClick={function () { logout(); }}",
    "onClick={() => logout()}"
   ],
   "answer": [
    0,
    1,
    3,
    4
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 451,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 3 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(5);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "3",
    "5",
    "11",
    "8"
   ],
   "answer": [
    1
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 452,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 6 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(4);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "Clicked 5",
    "Clicked 6",
    "Clicked 10",
    "Clicked 4"
   ],
   "answer": [
    3
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 453,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a product table, which of these should be STATE? (select all that apply)",
   "options": [
    "The \"only in stock\" checkbox",
    "The product list passed in as a prop",
    "The number of visible products",
    "The filtered products"
   ],
   "answer": [
    0
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 454,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [8, 1, 7, 9];\nconsole.log(nums.map(x => x * 4));",
   "options": [
    "[32, 4, 28]",
    "[32, 4, 28, 36]",
    "undefined",
    "[8, 1, 7, 9]"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 455,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [11, 11, 5, 5, 1];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "[11, 11, 5, 5, 1]",
    "[0]",
    "[]",
    "0"
   ],
   "answer": [
    2
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 456,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [1, 7, 3, 5];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "20",
    "5",
    "17",
    "16"
   ],
   "answer": [
    3
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 1 + 7 + 3 + 5 = 16.",
   "template": "js-reduce"
  },
  {
   "id": 457,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 12, 2, 13, 9];\nconsole.log(nums.findIndex(x => x > 6));",
   "options": [
    "0",
    "1",
    "true",
    "12"
   ],
   "answer": [
    1
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 458,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [2, 3, 2, 9];\nconsole.log(nums.some(x => x > 7));",
   "options": [
    "[9]",
    "false",
    "true",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 459,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['cherry', 'banana', 'grape', 'pear'];\nconsole.log(fruits.indexOf('pear'));",
   "options": [
    "true",
    "4",
    "3",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 460,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of size?",
   "code": "const options = { id: 1, size: 0 };\nconst { size = 'medium' } = options;\nconsole.log(size);",
   "options": [
    "An error is thrown",
    "0",
    "'medium'",
    "null"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 461,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { score: 'Pune' };\nconst { score: label } = data;\nconsole.log(score);",
   "options": [
    "ReferenceError: label is not defined",
    "ReferenceError: score is not defined",
    "'score'",
    "'Pune'"
   ],
   "answer": [
    1
   ],
   "explanation": "{ score: label } reads data.score into a NEW variable called label. No variable named score is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 462,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const colors = ['gold', 'blue', 'green'];\nconst [a, , c] = colors;\nconsole.log(c);",
   "options": [
    "'blue'",
    "undefined",
    "'gold'",
    "'green'"
   ],
   "answer": [
    3
   ],
   "explanation": "Empty slots between commas skip items: c gets the item at index 2.",
   "template": "js-array-destructure"
  },
  {
   "id": 463,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { theme: 'light', mode: 'small' };\nconst user = { mode: 'big', speed: 'dark' };\nconst merged = { ...defaults, mode: 'custom' };\nconsole.log(merged.mode);",
   "options": [
    "'big'",
    "'small'",
    "undefined",
    "'custom'"
   ],
   "answer": [
    3
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 464,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = NaN;\nconsole.log(value || 'fallback');",
   "options": [
    "'fallback'",
    "null",
    "true",
    "false"
   ],
   "answer": [
    0
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 465,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: { city: 'Pune' } };\nconsole.log(user?.profile?.city ?? 'Unknown');",
   "options": [
    "null",
    "'Pune'",
    "undefined",
    "'Unknown'"
   ],
   "answer": [
    1
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 466,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const name = 'asha';\nconsole.log(`Hello, ${name.toUpperCase()}!`);",
   "options": [
    "'Hello, ${name.toUpperCase()}!'",
    "'Hello, ASHA!'",
    "'Hello, asha!'",
    "An error is thrown"
   ],
   "answer": [
    1
   ],
   "explanation": "Any expression, including method calls, can go inside ${...}.",
   "template": "js-template"
  },
  {
   "id": 467,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "-1",
    "undefined",
    "'false' (a string)",
    "' ' (a space)",
    "'0' (a string)"
   ],
   "answer": [
    1
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 468,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "unshift()",
    "toSorted()",
    "toSpliced()",
    "filter()",
    "push()"
   ],
   "answer": [
    1,
    2,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 469,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "console.log(typeof null);",
   "options": [
    "'null'",
    "'boolean'",
    "'undefined'",
    "'object'"
   ],
   "answer": [
    3
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 470,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['f', 'e', 'c', 'a', 'b'];\nconsole.log(letters.slice(-1));",
   "options": [
    "[]",
    "['b', 'f']",
    "['b']",
    "['f']"
   ],
   "answer": [
    2
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 471,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [78, 4, 8, 24, 120];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[4, 8, 24, 78, 120]",
    "[120, 78, 24, 8, 4]",
    "[78, 4, 8, 24, 120]",
    "[120, 24, 4, 78, 8]"
   ],
   "answer": [
    0
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 472,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { age: 1, city: 2 };\nconsole.log(Object.entries(user)[0]);",
   "options": [
    "['age', 'city']",
    "['age']",
    "[1, 2]",
    "['age', 1]"
   ],
   "answer": [
    3
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 473,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (var i = 0; i < 4; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "3 3 3 3",
    "0 1 2 3",
    "4 4 4 4",
    "1 2 3 4"
   ],
   "answer": [
    2
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 4 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 474,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const total = true;\nreturn <div>{total && <b>New!</b>}</div>;",
   "options": [
    "<b>New!</b>",
    "The text \"null\"",
    "The text \"0\"",
    "Nothing"
   ],
   "answer": [
    0
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 475,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 3. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(50);\n  setNumber(n => n + 5);\n}}>Click</button>",
   "options": [
    "3",
    "4",
    "55",
    "56"
   ],
   "answer": [
    2
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (3), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 476,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 8. What is alerted after one click?",
   "code": "const [count, setCount] = useState(8);\nfunction handleClick() {\n  setCount(count + 2);\n  alert(count);\n}",
   "options": [
    "10",
    "8",
    "2",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 477,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setAge(1);\n  setName('x');\n  setEmail('x');\n  setCity(true);\n}",
   "options": [
    "0",
    "4",
    "1",
    "5"
   ],
   "answer": [
    2
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 478,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 0, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'reset' });\ndispatch({ type: 'add', amount: 4 });\ndispatch({ type: 'decrement' });",
   "options": [
    "0",
    "4",
    "3",
    "2"
   ],
   "answer": [
    2
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 479,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('page')}>\n  <div onClick={e => { e.stopPropagation(); console.log('panel'); }}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "page → panel → button",
    "button → panel",
    "panel → button",
    "button"
   ],
   "answer": [
    1
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 480,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 6 times with roomId = 'music', 'music', 'music', 'music', 'music', 'travel'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n});",
   "options": [
    "3",
    "0",
    "6",
    "7"
   ],
   "answer": [
    2
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 481,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Counter's state?",
   "code": "<Counter isActive={flag} />",
   "options": [
    "The state is kept",
    "It depends on the browser",
    "The state is reset",
    "React throws an error"
   ],
   "answer": [
    0
   ],
   "explanation": "It is the same component at the same position; only a prop changed.",
   "template": "react-preserve"
  },
  {
   "id": 482,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'bread', done: false },\n  { id: 2, text: 'tea', done: false },\n  { id: 3, text: 'milk', done: false },\n  { id: 4, text: 'jam', done: false },\n  { id: 5, text: 'eggs', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "2",
    "1",
    "5",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 483,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 40 }) {\n  return <img width={size} />;\n}\n\n<Avatar size=\"55\" />",
   "options": [
    "55",
    "'55' (a string)",
    "null",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 484,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"srcset\" in JSX?",
   "options": [
    "Srcset",
    "SRCSET",
    "srcset",
    "srcSet"
   ],
   "answer": [
    3
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 485,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useContext? (select all that apply)",
   "options": [
    "Inside a useEffect callback",
    "Inside a .map() callback in JSX",
    "Inside an event handler function",
    "At the top level of a component function"
   ],
   "answer": [
    3
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 486,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: A reference to an <input> element, used to focus it?",
   "options": [
    "Calculate it during render (no Hook)",
    "useState",
    "useRef",
    "useContext"
   ],
   "answer": [
    2
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 487,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Keeping a third-party map widget in sync with props?",
   "options": [
    "An Effect (useEffect)",
    "A key on the component",
    "Calculate it during rendering",
    "In the event handler"
   ],
   "answer": [
    0
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 488,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "items is state. Which expressions correctly create the NEXT state to insert newItem at index i, without mutating? (select all that apply)",
   "options": [
    "[...items.slice(0, i), newItem, ...items.slice(i)]",
    "items[i] = newItem",
    "items.toSpliced(i, 0, newItem)",
    "items.splice(i, 0, newItem)"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 489,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: Whether the form can be submitted (both fields filled in)?",
   "options": [
    "Store it in a ref",
    "Calculate it during render",
    "Keep it in state",
    "Store it in a global variable"
   ],
   "answer": [
    1
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 490,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button C get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"blue\">\n  <ThemeContext value=\"sepia\">\n    <ThemeContext value=\"contrast\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'sepia'",
    "'light'",
    "'contrast'",
    "'blue'"
   ],
   "answer": [
    3
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 491,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Avatar.jsx\nexport default function Avatar() { ... }\n\n// App.jsx\nimport { Avatar } from './Avatar';",
   "options": [
    "Error: the module does not provide that export",
    "Error: React is not defined",
    "It works, but the component renders nothing",
    "It works"
   ],
   "answer": [
    0
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 492,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run openMenu when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={(e) => openMenu(e)}",
    "onClick={openMenu}",
    "onClick={() => openMenu()}",
    "onClick={() => openMenu}"
   ],
   "answer": [
    0,
    1,
    2
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 493,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 2 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(0);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "0",
    "2",
    "4",
    "1"
   ],
   "answer": [
    0
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 494,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 2 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(0);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "Clicked 0",
    "undefined",
    "Clicked 2",
    "Clicked 1"
   ],
   "answer": [
    0
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 495,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a signup form, which of these should be STATE? (select all that apply)",
   "options": [
    "The password input value",
    "The submit status (typing/sending/sent)",
    "Whether the form is valid (both fields filled in)",
    "The label text \"Email\", which never changes",
    "The email input value"
   ],
   "answer": [
    0,
    1,
    4
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 496,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 2, 4];\nconsole.log(nums.map(x => x % 2 === 0));",
   "options": [
    "[true, true]",
    "[6, 2, 4]",
    "undefined",
    "[true, true, true]"
   ],
   "answer": [
    3
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 497,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [2, 6, 9, 11, 4];\nconsole.log(nums.filter(x => x % 2 !== 0));",
   "options": [
    "[9, 11]",
    "[2, 6, 9, 11, 4]",
    "[9]",
    "[2, 6, 4]"
   ],
   "answer": [
    0
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 498,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [8, 4, 9, 4];\nconsole.log(nums.reduce((total, x) => total + x, 13));",
   "options": [
    "42",
    "38",
    "25",
    "'8494'"
   ],
   "answer": [
    1
   ],
   "explanation": "reduce starts with 13 and adds each item: 13 + 8 + 4 + 9 + 4 = 38.",
   "template": "js-reduce"
  },
  {
   "id": 499,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [15, 2, 4, 14, 8];\nconsole.log(nums.find(x => x > 11));",
   "options": [
    "15",
    "true",
    "[15, 14]",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 500,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [9, 6, 2, 10];\nconsole.log(nums.some(x => x > 7));",
   "options": [
    "true",
    "[9, 10]",
    "undefined",
    "false"
   ],
   "answer": [
    0
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 501,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['apple', 'banana', 'cherry', 'kiwi'];\nconsole.log(fruits.includes('banana'));",
   "options": [
    "undefined",
    "1",
    "false",
    "true"
   ],
   "answer": [
    3
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 502,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of lang?",
   "code": "const options = { id: 1, lang: null };\nconst { lang = 'en' } = options;\nconsole.log(lang);",
   "options": [
    "'custom'",
    "undefined",
    "null",
    "'en'"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 503,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { score: 'Pune' };\nconst { score: amount } = data;\nconsole.log(score);",
   "options": [
    "ReferenceError: score is not defined",
    "ReferenceError: amount is not defined",
    "'score'",
    "'Pune'"
   ],
   "answer": [
    0
   ],
   "explanation": "{ score: amount } reads data.score into a NEW variable called amount. No variable named score is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 504,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['pink'];\nconst [main, accent = 'black'] = colors;\nconsole.log(accent);",
   "options": [
    "'pink'",
    "'black'",
    "undefined",
    "An error is thrown"
   ],
   "answer": [
    1
   ],
   "explanation": "There is no second item, so the default 'black' is used.",
   "template": "js-array-destructure"
  },
  {
   "id": 505,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { size: 'big', lang: 'fast' };\nconst user = { lang: 'slow', theme: 'hi' };\nconst merged = { ...defaults, ...user };\nconsole.log(merged.lang);",
   "options": [
    "undefined",
    "'custom'",
    "'slow'",
    "'fast'"
   ],
   "answer": [
    2
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 506,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = undefined;\nconsole.log(value && 'fallback');",
   "options": [
    "false",
    "undefined",
    "true",
    "'fallback'"
   ],
   "answer": [
    1
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 507,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = null;\nconsole.log(user?.profile?.city);",
   "options": [
    "undefined",
    "A TypeError is thrown",
    "null",
    "'Unknown'"
   ],
   "answer": [
    0
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 508,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const a = 9;\nconst b = 9;\nconsole.log(`${a} + ${b} = ${a + b}`);",
   "options": [
    "'18 = 18'",
    "'9 + 9 = 99'",
    "'9 + 9 = 18'",
    "'${a} + ${b} = ${a + b}'"
   ],
   "answer": [
    2
   ],
   "explanation": "Inside ${...}, the expression is evaluated, so a + b is added as numbers.",
   "template": "js-template"
  },
  {
   "id": 509,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "false",
    "-1",
    "NaN",
    "null",
    "'' (empty string)"
   ],
   "answer": [
    0,
    2,
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 510,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "toSorted()",
    "splice()",
    "toSpliced()",
    "map()",
    "pop()"
   ],
   "answer": [
    0,
    2,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 511,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof 'hi');",
   "options": [
    "'number'",
    "'string'",
    "'boolean'",
    "'null'"
   ],
   "answer": [
    1
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 512,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['c', 'f', 'd', 'b', 'a'];\nconsole.log(letters.slice(2, 3));",
   "options": [
    "['c', 'f', 'd', 'b', 'a']",
    "[]",
    "['c']",
    "['d']"
   ],
   "answer": [
    3
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 513,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [41, 7, 19, 9, 116];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[41, 7, 19, 9, 116]",
    "[116, 19, 41, 7, 9]",
    "[7, 9, 19, 41, 116]",
    "[116, 41, 19, 9, 7]"
   ],
   "answer": [
    2
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 514,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { email: 1, city: 2, role: 3, name: 4 };\nconsole.log(Object.entries(user)[0]);",
   "options": [
    "['email', 1]",
    "['email', 'city', 'role', 'name']",
    "['email']",
    "[1, 2, 3, 4]"
   ],
   "answer": [
    0
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 515,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const items = 5;\nreturn <div>{items && <b>New!</b>}</div>;",
   "options": [
    "The text \"null\"",
    "<b>New!</b>",
    "The text \"false\"",
    "Nothing"
   ],
   "answer": [
    1
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 516,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 2. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 2);\n  setNumber(number + 5);\n}}>Click</button>",
   "options": [
    "7",
    "9",
    "2",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (2), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 517,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 0. What is alerted after one click?",
   "code": "const [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 4);\n  alert(count);\n}",
   "options": [
    "undefined",
    "4",
    "8",
    "0"
   ],
   "answer": [
    3
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 518,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setName('x');\n  setEmail(null);\n  setAge('x');\n}",
   "options": [
    "1",
    "4",
    "0",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 519,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 3, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'add', amount: 3 });\ndispatch({ type: 'increment' });",
   "options": [
    "3",
    "9",
    "10",
    "8"
   ],
   "answer": [
    1
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 520,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('page')}>\n  <div onClick={e => { e.stopPropagation(); console.log('card'); }}>\n    <div onClick={() => console.log('panel')}>\n      <button onClick={() => console.log('button')}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "button → panel → card → page",
    "button → panel → card",
    "card → panel → button",
    "button"
   ],
   "answer": [
    1
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 521,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 4 times with roomId = 'random', 'music', 'music', 'travel' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, []);",
   "options": [
    "0",
    "2",
    "1",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 522,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Editor's state?",
   "code": "<Editor isActive={flag} />",
   "options": [
    "The state is reset",
    "The state is kept",
    "React throws an error",
    "It depends on the browser"
   ],
   "answer": [
    1
   ],
   "explanation": "It is the same component at the same position; only a prop changed.",
   "template": "react-preserve"
  },
  {
   "id": 523,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'bread', done: true },\n  { id: 2, text: 'jam', done: true },\n  { id: 3, text: 'tea', done: false },\n  { id: 4, text: 'soap', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "0",
    "3",
    "2",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 524,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 90 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={null} />",
   "options": [
    "90",
    "undefined",
    "120",
    "null"
   ],
   "answer": [
    3
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 525,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useEffect? (select all that apply)",
   "options": [
    "Inside an event handler function",
    "Inside an if statement",
    "At the top level of a custom Hook (useSomething)",
    "Inside a useEffect callback"
   ],
   "answer": [
    2
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 526,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: A WebSocket connection object?",
   "options": [
    "Calculate it during render (no Hook)",
    "useState",
    "useRef",
    "useContext"
   ],
   "answer": [
    2
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 527,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Connecting to a chat server while the ChatRoom is on screen?",
   "options": [
    "In the event handler",
    "A key on the component",
    "An Effect (useEffect)",
    "Calculate it during rendering"
   ],
   "answer": [
    2
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 528,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "items is state. Which expressions correctly create the NEXT state to sort the list by name, without mutating? (select all that apply)",
   "options": [
    "items.sort(byName)",
    "[...items].sort(byName)",
    "items.toSorted(byName)",
    "items.reverse().sort(byName)"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 529,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: The selected item object, when items and selectedId are in state?",
   "options": [
    "Store it in a global variable",
    "Store it in a ref",
    "Calculate it during render",
    "Keep it in state"
   ],
   "answer": [
    2
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 530,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('dark');\n\n<ThemeContext value=\"sepia\">\n  <ThemeContext value=\"light\">\n    <ThemeContext value=\"blue\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'blue'",
    "'dark'",
    "'sepia'",
    "'light'"
   ],
   "answer": [
    3
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 531,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render songs (shape { trackId, title, artist }) with songs.map(song => <Row ... />). Which key is best?",
   "options": [
    "key={Math.random()}",
    "key={song.trackId}",
    "key={song.title}",
    "key=\"song\""
   ],
   "answer": [
    1
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 532,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run logout when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={() => logout}",
    "onClick={function () { logout(); }}",
    "onClick={logout()}",
    "onClick={(e) => logout(e)}",
    "onClick={() => logout()}"
   ],
   "answer": [
    1,
    3,
    4
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 533,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 6 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(1);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "2",
    "7",
    "6",
    "1"
   ],
   "answer": [
    1
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 534,
   "topic": "refs",
   "difficulty": "medium",
   "question": "After 3 clicks, what is countRef.current?",
   "code": "const countRef = useRef(3);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "6",
    "4",
    "undefined",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 535,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [9, 1, 3, 7];\nconsole.log(nums.map(x => x + 5));",
   "options": [
    "[12, 8, 6, 14]",
    "[14, 6, 8, 12]",
    "[14, 6, 8]",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 536,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [2, 9, 10, 7, 2];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "[2]",
    "[9, 7]",
    "3",
    "[2, 10, 2]"
   ],
   "answer": [
    3
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 537,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 7, 5, 3, 3];\nconsole.log(nums.reduce((count, x) => x % 2 === 0 ? count + 1 : count, 0));",
   "options": [
    "4",
    "1",
    "2",
    "[6]"
   ],
   "answer": [
    1
   ],
   "explanation": "It counts the even numbers by adding 1 for each one.",
   "template": "js-reduce"
  },
  {
   "id": 538,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [12, 10, 7, 11];\nconsole.log(nums.find(x => x > 5));",
   "options": [
    "true",
    "0",
    "undefined",
    "12"
   ],
   "answer": [
    3
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 539,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [2, 4, 1, 10];\nconsole.log(nums.every(x => x > 5));",
   "options": [
    "false",
    "true",
    "[10]",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 540,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['cherry', 'banana', 'mango', 'kiwi'];\nconsole.log(fruits.indexOf('cherry'));",
   "options": [
    "-1",
    "0",
    "undefined",
    "true"
   ],
   "answer": [
    1
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 541,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of color?",
   "code": "const options = { id: 1, color: '' };\nconst { color = 10 } = options;\nconsole.log(color);",
   "options": [
    "10",
    "''",
    "An error is thrown",
    "null"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 542,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { score: 42 };\nconst { score: amount } = data;\nconsole.log(amount);",
   "options": [
    "42",
    "'score'",
    "ReferenceError: score is not defined",
    "ReferenceError: amount is not defined"
   ],
   "answer": [
    0
   ],
   "explanation": "{ score: amount } reads data.score into a NEW variable called amount. No variable named score is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 543,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['red', 'green', 'blue', 'pink'];\nconst [first, ...rest] = colors;\nconsole.log(rest);",
   "options": [
    "['red', 'green', 'blue', 'pink']",
    "['green', 'blue', 'pink']",
    "['red']",
    "['red', 'green', 'blue']"
   ],
   "answer": [
    1
   ],
   "explanation": "The rest element collects all the remaining items into a new array.",
   "template": "js-array-destructure"
  },
  {
   "id": 544,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { color: 'big', size: 'hi' };\nconst user = { size: 'light', theme: 'dark' };\nconst merged = { ...defaults, size: 'custom' };\nconsole.log(merged.size);",
   "options": [
    "undefined",
    "'light'",
    "'custom'",
    "'hi'"
   ],
   "answer": [
    2
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 545,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = null;\nconsole.log(value && 'fallback');",
   "options": [
    "undefined",
    "true",
    "null",
    "'fallback'"
   ],
   "answer": [
    2
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 546,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = {};\nconsole.log(user.profile.city);",
   "options": [
    "null",
    "'Leeds'",
    "A TypeError is thrown",
    "'Unknown'"
   ],
   "answer": [
    2
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 547,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "{} (empty object)",
    "0",
    "[] (empty array)",
    "'0' (a string)",
    "undefined"
   ],
   "answer": [
    1,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 548,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "map()",
    "reverse()",
    "pop()",
    "concat()",
    "slice()"
   ],
   "answer": [
    0,
    3,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 549,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof {});",
   "options": [
    "'number'",
    "'undefined'",
    "'null'",
    "'object'"
   ],
   "answer": [
    3
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 550,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['e', 'b', 'd', 'a', 'f'];\nconsole.log(letters.slice(1, 2));",
   "options": [
    "['e', 'b', 'd', 'a', 'f']",
    "['b']",
    "[]",
    "['b', 'e']"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 551,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const nums = [28, 62, 101, 8, 2];\nconsole.log(nums.toSorted());",
   "options": [
    "[28, 62, 101, 8, 2]",
    "[101, 62, 28, 8, 2]",
    "[101, 2, 28, 62, 8]",
    "[2, 8, 28, 62, 101]"
   ],
   "answer": [
    2
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 552,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { email: 1, city: 2 };\nconsole.log(Object.values(user));",
   "options": [
    "['email', 'city']",
    "2",
    "['email', 1]",
    "[1, 2]"
   ],
   "answer": [
    3
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 553,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const items = undefined;\nreturn <div>{items && <b>New!</b>}</div>;",
   "options": [
    "The text \"null\"",
    "The text \"0\"",
    "Nothing",
    "The text \"false\""
   ],
   "answer": [
    2
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 554,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 9. After one click, what does the <h1> show?",
   "code": "const [count, setCount] = useState(9);\nfunction handleClick() {\n  setCount(count + 5);\n}\n// ...\nreturn <h1>{count}</h1>;",
   "options": [
    "5",
    "14",
    "undefined",
    "9"
   ],
   "answer": [
    1
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 555,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setError('x');\n  setName(null);\n  setCity(null);\n}",
   "options": [
    "1",
    "3",
    "0",
    "4"
   ],
   "answer": [
    0
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 556,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 2, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'decrement' });\ndispatch({ type: 'add', amount: 5 });\ndispatch({ type: 'decrement' });\ndispatch({ type: 'decrement' });",
   "options": [
    "3",
    "4",
    "2",
    "5"
   ],
   "answer": [
    1
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 557,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('toolbar')}>\n  <div onClick={() => console.log('page')}>\n    <div onClick={() => console.log('card')}>\n      <button onClick={e => { e.stopPropagation(); console.log('button'); }}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "toolbar → page → card → button",
    "button → card → page → toolbar",
    "button → card",
    "button"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 558,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'random', 'random', 'random', 'general', 'general' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, []);",
   "options": [
    "6",
    "1",
    "0",
    "3"
   ],
   "answer": [
    1
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 559,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Form's state?",
   "code": "{flag ? <Form /> : <Panel />}",
   "options": [
    "The state is kept",
    "The state is reset",
    "It depends on the browser",
    "React throws an error"
   ],
   "answer": [
    1
   ],
   "explanation": "A different component type at the same position resets the state.",
   "template": "react-preserve"
  },
  {
   "id": 560,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'jam', done: false },\n  { id: 2, text: 'bread', done: false },\n  { id: 3, text: 'eggs', done: true },\n  { id: 4, text: 'tea', done: false },\n  { id: 5, text: 'milk', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "5",
    "0",
    "3",
    "2"
   ],
   "answer": [
    3
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 561,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 30 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={undefined} />",
   "options": [
    "30",
    "'45' (a string)",
    "0",
    "null"
   ],
   "answer": [
    0
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 562,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"class\" in JSX?",
   "options": [
    "className",
    "class",
    "Class",
    "CLASS"
   ],
   "answer": [
    0
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 563,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useEffect? (select all that apply)",
   "options": [
    "At the top level of a custom Hook (useSomething)",
    "Inside a .map() callback in JSX",
    "At the top level of a component function",
    "Inside an event handler function",
    "Inside a regular helper function (not a Hook)"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 564,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: A <video> element to call play() on?",
   "options": [
    "useContext",
    "Calculate it during render (no Hook)",
    "useState",
    "useRef"
   ],
   "answer": [
    3
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 565,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Sending a POST request when the user clicks Submit?",
   "options": [
    "Calculate it during rendering",
    "A key on the component",
    "In the event handler",
    "An Effect (useEffect)"
   ],
   "answer": [
    2
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 566,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: isEmpty for a list that is in state?",
   "options": [
    "Store it in a ref",
    "Calculate it during render",
    "Keep it in state",
    "Store it in a global variable"
   ],
   "answer": [
    1
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 567,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('contrast');\n\n<ThemeContext value=\"light\">\n  <Layout>\n    <Sidebar>\n      <Button />  {/* A */}\n    </Sidebar>\n  </Layout>\n</ThemeContext>\n<ThemeContext value=\"blue\">\n  <Button />    {/* B */}\n</ThemeContext>\n<Button />      {/* C */}",
   "options": [
    "'dark'",
    "'light'",
    "'blue'",
    "'contrast'"
   ],
   "answer": [
    2
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 568,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Card.jsx\nexport default function Card() { ... }\n\n// App.jsx\nimport { Card } from './Card';",
   "options": [
    "Error: the module does not provide that export",
    "Error: React is not defined",
    "It works",
    "It works, but the component renders nothing"
   ],
   "answer": [
    0
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 569,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run openMenu when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick=\"openMenu()\"",
    "onClick={openMenu()}",
    "onClick={function () { openMenu(); }}",
    "onClick={() => openMenu()}",
    "onClick={openMenu}"
   ],
   "answer": [
    2,
    3,
    4
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 570,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 6 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(3);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "15",
    "3",
    "9",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 571,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 5 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(4);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "Clicked 9",
    "Clicked 5",
    "Clicked 4",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 572,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a product table, which of these should be STATE? (select all that apply)",
   "options": [
    "The number of visible products",
    "The \"only in stock\" checkbox",
    "The search text",
    "The product list passed in as a prop",
    "The filtered products"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 573,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 3, 6, 3];\nconsole.log(nums.map(x => x * x));",
   "options": [
    "[49, 9, 36]",
    "undefined",
    "[49, 9, 36, 9]",
    "[9, 36, 9, 49]"
   ],
   "answer": [
    2
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 574,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [4, 8, 9, 3, 6];\nconsole.log(nums.filter(x => x % 2 !== 0));",
   "options": [
    "[false, false, true, true, false]",
    "[9, 3]",
    "[4, 8, 6]",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 575,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 6, 4, 4];\nconsole.log(nums.reduce((total, x) => total + x, 16));",
   "options": [
    "20",
    "'6644'",
    "36",
    "40"
   ],
   "answer": [
    2
   ],
   "explanation": "reduce starts with 16 and adds each item: 16 + 6 + 6 + 4 + 4 = 36.",
   "template": "js-reduce"
  },
  {
   "id": 576,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [11, 8, 9, 3, 12];\nconsole.log(nums.find(x => x > 13));",
   "options": [
    "[]",
    "null",
    "-1",
    "undefined"
   ],
   "answer": [
    3
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 577,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 10, 2, 3];\nconsole.log(nums.every(x => x > 4));",
   "options": [
    "undefined",
    "[7, 10]",
    "true",
    "false"
   ],
   "answer": [
    3
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 578,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['mango', 'banana', 'grape', 'kiwi'];\nconsole.log(fruits.includes('banana'));",
   "options": [
    "1",
    "false",
    "undefined",
    "true"
   ],
   "answer": [
    3
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 579,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of limit?",
   "code": "const options = { id: 1, limit: undefined };\nconst { limit = 'blue' } = options;\nconsole.log(limit);",
   "options": [
    "undefined",
    "'blue'",
    "0",
    "null"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 580,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { title: 42 };\nconst { title: points } = data;\nconsole.log(title);",
   "options": [
    "undefined",
    "'title'",
    "ReferenceError: points is not defined",
    "ReferenceError: title is not defined"
   ],
   "answer": [
    3
   ],
   "explanation": "{ title: points } reads data.title into a NEW variable called points. No variable named title is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 581,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const colors = ['blue', 'green', 'pink', 'gold'];\nconst [a, , c] = colors;\nconsole.log(c);",
   "options": [
    "'pink'",
    "'blue'",
    "'gold'",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "Empty slots between commas skip items: c gets the item at index 2.",
   "template": "js-array-destructure"
  },
  {
   "id": 582,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { color: 'fast', mode: 'small' };\nconst user = { mode: 'hi', size: 'slow' };\nconst merged = { ...defaults, ...user };\nconsole.log(Object.keys(merged).length);",
   "options": [
    "undefined",
    "3",
    "4",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "Keys that appear in both objects are only counted once in the merged object.",
   "template": "js-spread-merge"
  },
  {
   "id": 583,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 'Asha';\nconsole.log(value || 'fallback');",
   "options": [
    "'Asha'",
    "null",
    "false",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 584,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = {};\nconsole.log(user?.profile?.city ?? 'Unknown');",
   "options": [
    "A TypeError is thrown",
    "null",
    "'Unknown'",
    "'Austin'"
   ],
   "answer": [
    2
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 585,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const name = 'ben';\nconsole.log(`Hello, ${name.toUpperCase()}!`);",
   "options": [
    "An error is thrown",
    "'Hello, name.toUpperCase()!'",
    "'Hello, ben!'",
    "'Hello, BEN!'"
   ],
   "answer": [
    3
   ],
   "explanation": "Any expression, including method calls, can go inside ${...}.",
   "template": "js-template"
  },
  {
   "id": 586,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "'false' (a string)",
    "0",
    "undefined",
    "'0' (a string)",
    "NaN"
   ],
   "answer": [
    1,
    2,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 587,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "toSorted()",
    "reverse()",
    "sort()",
    "concat()",
    "pop()"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 588,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof {});",
   "options": [
    "'boolean'",
    "'string'",
    "'array'",
    "'object'"
   ],
   "answer": [
    3
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 589,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "console.log(0 === -0);",
   "options": [
    "undefined",
    "true",
    "A TypeError is thrown",
    "false"
   ],
   "answer": [
    1
   ],
   "explanation": "Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.",
   "template": "js-equality"
  },
  {
   "id": 590,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['e', 'a', 'f', 'b', 'c'];\nconsole.log(letters.slice(1, 4));",
   "options": [
    "['e', 'a', 'f']",
    "['e', 'a', 'f', 'b', 'c']",
    "['a', 'f', 'b']",
    "['f', 'b']"
   ],
   "answer": [
    2
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 591,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [95, 22, 2, 119, 6];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[95, 22, 2, 119, 6]",
    "[119, 95, 22, 6, 2]",
    "[119, 2, 22, 6, 95]",
    "[2, 6, 22, 95, 119]"
   ],
   "answer": [
    3
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 592,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { name: 1, email: 2, role: 3 };\nconsole.log(Object.values(user));",
   "options": [
    "[1, 2, 3]",
    "['name']",
    "['name', 'email', 'role']",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 593,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (var i = 0; i < 2; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "1 1",
    "2 2",
    "0 1",
    "1 2"
   ],
   "answer": [
    1
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 2 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 594,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const items = 0;\nreturn <div>{items && <b>New!</b>}</div>;",
   "options": [
    "The text \"null\"",
    "<b>New!</b>",
    "The text \"false\"",
    "The text \"0\""
   ],
   "answer": [
    3
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 595,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 4. What is alerted after one click?",
   "code": "const [count, setCount] = useState(4);\nfunction handleClick() {\n  setCount(count + 2);\n  alert(count);\n}",
   "options": [
    "4",
    "2",
    "6",
    "8"
   ],
   "answer": [
    0
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 596,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setCity(true);\n  setEmail(1);\n  setStatus(1);\n}",
   "options": [
    "4",
    "1",
    "3",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 597,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 5, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'decrement' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'reset' });",
   "options": [
    "0",
    "1",
    "5",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 598,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('menu')}>\n  <div onClick={() => console.log('toolbar')}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "button",
    "button → toolbar",
    "menu → toolbar → button",
    "button → toolbar → menu"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 599,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'travel', 'travel', 'travel', 'music', 'music'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n});",
   "options": [
    "5",
    "6",
    "0",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 600,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Form's state?",
   "code": "{flag ? <div><Form /></div> : <section><Form /></section>}",
   "options": [
    "The state is reset",
    "React throws an error",
    "It depends on the browser",
    "The state is kept"
   ],
   "answer": [
    0
   ],
   "explanation": "The parent element type changed (div → section), so the whole subtree is reset.",
   "template": "react-preserve"
  },
  {
   "id": 601,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'soap', done: true },\n  { id: 2, text: 'rice', done: false },\n  { id: 3, text: 'bread', done: true },\n  { id: 4, text: 'milk', done: true },\n  { id: 5, text: 'tea', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "2",
    "3",
    "0",
    "4"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 602,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 80 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={0} />",
   "options": [
    "null",
    "'125' (a string)",
    "0",
    "80"
   ],
   "answer": [
    2
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 603,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"colspan\" in JSX?",
   "options": [
    "colSpan",
    "Colspan",
    "colspan",
    "COLSPAN"
   ],
   "answer": [
    0
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 604,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useContext? (select all that apply)",
   "options": [
    "At the top level of a component function",
    "Inside a useEffect callback",
    "After an early return statement",
    "Inside a for loop",
    "At the top level of a custom Hook (useSomething)"
   ],
   "answer": [
    0,
    4
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 605,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "products is state. Which expressions correctly create the NEXT state to insert newItem at index i, without mutating? (select all that apply)",
   "options": [
    "products.splice(i, 0, newItem)",
    "products.toSpliced(i, 0, newItem)",
    "[...products.slice(0, i), newItem, ...products.slice(i)]",
    "products[i] = newItem"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 606,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: Which tab is currently selected?",
   "options": [
    "Store it in a ref",
    "Calculate it during render",
    "Keep it in state",
    "Store it in a global variable"
   ],
   "answer": [
    2
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 607,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button C get?",
   "code": "const ThemeContext = createContext('blue');\n\n<ThemeContext value=\"dark\">\n  <ThemeContext value=\"sepia\">\n    <ThemeContext value=\"light\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'dark'",
    "'blue'",
    "'light'",
    "'sepia'"
   ],
   "answer": [
    0
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 608,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render orders (shape { orderNo, total, status }) with orders.map(order => <Row ... />). Which key is best?",
   "options": [
    "key={order.orderNo}",
    "key={index}",
    "key={Math.random()}",
    "key=\"order\""
   ],
   "answer": [
    0
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 609,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Card.jsx\nexport default function Card() { ... }\nexport function Icon() { ... }\n\n// App.jsx\nimport Card, { Icon } from './Card';",
   "options": [
    "Error: React is not defined",
    "It works, but the component renders nothing",
    "Error: the module does not provide that export",
    "It works"
   ],
   "answer": [
    3
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 610,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run handleClick when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={handleClick()}",
    "onClick=\"handleClick()\"",
    "onClick={(e) => handleClick(e)}",
    "onClick={function () { handleClick(); }}"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 611,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 4 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(0);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "4",
    "0",
    "8",
    "1"
   ],
   "answer": [
    1
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 612,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 4 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(0);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "undefined",
    "Clicked 0",
    "Clicked 4",
    "Clicked 1"
   ],
   "answer": [
    1
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 613,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 3, 8, 3];\nconsole.log(nums.map(x => x * 3));",
   "options": [
    "[3, 3, 8, 3]",
    "undefined",
    "[9, 24, 9, 9]",
    "[9, 9, 24, 9]"
   ],
   "answer": [
    3
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 614,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [4, 8, 12, 5, 8];\nconsole.log(nums.filter(x => x <= 8));",
   "options": [
    "4",
    "[true, true, false, true, true]",
    "[12]",
    "[4, 8, 5, 8]"
   ],
   "answer": [
    3
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 615,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [9, 5, 3, 1];\nconsole.log(nums.reduce((max, x) => Math.max(max, x), 0));",
   "options": [
    "1",
    "9",
    "0",
    "18"
   ],
   "answer": [
    1
   ],
   "explanation": "Each step keeps the larger of the running max and the current item.",
   "template": "js-reduce"
  },
  {
   "id": 616,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [2, 11, 7, 1];\nconsole.log(nums.findIndex(x => x > 15));",
   "options": [
    "0",
    "undefined",
    "-1",
    "[]"
   ],
   "answer": [
    2
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 617,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [2, 6, 3, 3];\nconsole.log(nums.some(x => x > 3));",
   "options": [
    "undefined",
    "false",
    "true",
    "[6]"
   ],
   "answer": [
    2
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 618,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['kiwi', 'cherry', 'pear', 'grape'];\nconsole.log(fruits.includes('pear'));",
   "options": [
    "false",
    "true",
    "undefined",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 619,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of limit?",
   "code": "const options = { id: 1, limit: undefined };\nconst { limit = 10 } = options;\nconsole.log(limit);",
   "options": [
    "null",
    "0",
    "10",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 620,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { score: 'Pune' };\nconst { score: town } = data;\nconsole.log(score);",
   "options": [
    "ReferenceError: score is not defined",
    "undefined",
    "ReferenceError: town is not defined",
    "'score'"
   ],
   "answer": [
    0
   ],
   "explanation": "{ score: town } reads data.score into a NEW variable called town. No variable named score is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 621,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['gold'];\nconst [main, accent = 'black'] = colors;\nconsole.log(accent);",
   "options": [
    "'black'",
    "undefined",
    "An error is thrown",
    "null"
   ],
   "answer": [
    0
   ],
   "explanation": "There is no second item, so the default 'black' is used.",
   "template": "js-array-destructure"
  },
  {
   "id": 622,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { color: 'hi', size: 'dark' };\nconst user = { size: 'small', mode: 'slow' };\nconst merged = { ...user, ...defaults };\nconsole.log(merged.size);",
   "options": [
    "'small'",
    "'dark'",
    "undefined",
    "'custom'"
   ],
   "answer": [
    1
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 623,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = undefined;\nconsole.log(value || 'fallback');",
   "options": [
    "null",
    "'fallback'",
    "undefined",
    "true"
   ],
   "answer": [
    1
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 624,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: null };\nconsole.log(user?.profile?.city);",
   "options": [
    "undefined",
    "null",
    "A TypeError is thrown",
    "'Unknown'"
   ],
   "answer": [
    0
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 625,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const n = 1;\nconsole.log(`${n} item${n === 1 ? '' : 's'}`);",
   "options": [
    "undefined",
    "'1 items'",
    "'1 item'",
    "'n items'"
   ],
   "answer": [
    2
   ],
   "explanation": "A ternary inside ${...} is a common way to pluralise words.",
   "template": "js-template"
  },
  {
   "id": 626,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "NaN",
    "{} (empty object)",
    "'false' (a string)",
    "null",
    "false"
   ],
   "answer": [
    0,
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 627,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "toSpliced()",
    "toSorted()",
    "splice()",
    "slice()",
    "unshift()"
   ],
   "answer": [
    2,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 628,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof undefined);",
   "options": [
    "'string'",
    "'array'",
    "'undefined'",
    "'function'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 629,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const list = [1, 2];\nconst next = list;\nnext.push(3);\nconsole.log(list.length, list === next);",
   "options": [
    "2 false",
    "2 true",
    "1 true",
    "3 true"
   ],
   "answer": [
    3
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 630,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['c', 'a', 'd', 'f', 'e'];\nconsole.log(letters.slice(0, 4));",
   "options": [
    "['a', 'd', 'f']",
    "['c', 'a', 'd', 'f']",
    "undefined",
    "['c', 'a', 'd', 'f', 'e']"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 631,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const nums = [27, 6, 120, 5, 76];\nconsole.log(nums.toSorted());",
   "options": [
    "[5, 6, 27, 76, 120]",
    "[120, 27, 5, 6, 76]",
    "[120, 76, 27, 6, 5]",
    "[27, 6, 120, 5, 76]"
   ],
   "answer": [
    1
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 632,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { age: 1, name: 2 };\nconsole.log(Object.values(user));",
   "options": [
    "['age', 1]",
    "2",
    "['age']",
    "[1, 2]"
   ],
   "answer": [
    3
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 633,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const unread = false;\nreturn <div>{unread && <b>New!</b>}</div>;",
   "options": [
    "The text \"false\"",
    "The text \"0\"",
    "Nothing",
    "<b>New!</b>"
   ],
   "answer": [
    2
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 634,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 4. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 5);\n  setNumber(n => n + 1);\n  setNumber(number + 5);\n  setNumber(n => n + 4);\n}}>Click</button>",
   "options": [
    "19",
    "14",
    "4",
    "13"
   ],
   "answer": [
    3
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (4), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 635,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 5. What is logged after one click?",
   "code": "const [count, setCount] = useState(5);\nfunction handleClick() {\n  setCount(c => c + 3);\n  console.log(count);\n}",
   "options": [
    "5",
    "3",
    "8",
    "11"
   ],
   "answer": [
    0
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 636,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setName(1);\n  setCity('x');\n  setStatus('x');\n}",
   "options": [
    "4",
    "0",
    "3",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 637,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 2, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'reset' });\ndispatch({ type: 'add', amount: 6 });\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'reset' });",
   "options": [
    "0",
    "2",
    "5",
    "1"
   ],
   "answer": [
    0
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 638,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 6 times with roomId = 'music', 'music', 'music', 'travel', 'travel', 'travel'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "3",
    "6",
    "7",
    "2"
   ],
   "answer": [
    3
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 639,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Timer's state?",
   "code": "{flag ? <Timer key=\"a\" /> : <Timer key=\"a\" />}",
   "options": [
    "The state is reset",
    "React throws an error",
    "The state is kept",
    "It depends on the browser"
   ],
   "answer": [
    2
   ],
   "explanation": "Same type, same position, same key: React sees the same component.",
   "template": "react-preserve"
  },
  {
   "id": 640,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'eggs', done: false },\n  { id: 2, text: 'soap', done: false },\n  { id: 3, text: 'rice', done: false },\n  { id: 4, text: 'milk', done: true },\n  { id: 5, text: 'bread', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "3",
    "2",
    "5",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 641,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 60 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={null} />",
   "options": [
    "'75' (a string)",
    "undefined",
    "null",
    "0"
   ],
   "answer": [
    2
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 642,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "At the top level of a component function",
    "Inside a for loop",
    "After an early return statement",
    "Inside an if statement"
   ],
   "answer": [
    0
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 643,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Fetching search results for the current query?",
   "options": [
    "An Effect (useEffect)",
    "In the event handler",
    "A key on the component",
    "Calculate it during rendering"
   ],
   "answer": [
    0
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 644,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "tasks is state. Which expressions correctly create the NEXT state to remove the item with id, without mutating? (select all that apply)",
   "options": [
    "tasks.filter(x => x.id !== id)",
    "tasks.pop()",
    "tasks.splice(index, 1)",
    "delete tasks[index]",
    "tasks.toSpliced(index, 1)"
   ],
   "answer": [
    0,
    4
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 645,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button A get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"blue\">\n  <ThemeContext value=\"contrast\">\n    <ThemeContext value=\"sepia\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'contrast'",
    "'light'",
    "'blue'",
    "'sepia'"
   ],
   "answer": [
    3
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 646,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Profile.jsx\nexport function Profile() { ... }\n\n// App.jsx\nimport { Profile as MyProfile } from './Profile';",
   "options": [
    "Error: the module does not provide that export",
    "Error: React is not defined",
    "It works",
    "It works, but the component renders nothing"
   ],
   "answer": [
    2
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 647,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run handleClick when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={function () { handleClick(); }}",
    "onClick={() => handleClick}",
    "onClick={handleClick}",
    "onClick={(e) => handleClick(e)}",
    "onClick={handleClick()}"
   ],
   "answer": [
    0,
    2,
    3
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 648,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 5 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(0);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "5",
    "0",
    "10",
    "1"
   ],
   "answer": [
    1
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 649,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 6 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(0);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "undefined",
    "Clicked 1",
    "Clicked 6",
    "Clicked 0"
   ],
   "answer": [
    3
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 650,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [5, 3, 9, 2];\nconsole.log(nums.map(x => x + 4));",
   "options": [
    "[9, 7, 13, 6]",
    "undefined",
    "[9, 7, 13]",
    "[5, 3, 9, 2]"
   ],
   "answer": [
    0
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 651,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 11, 6, 8, 11];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "[false, false, true, true, false]",
    "2",
    "[7, 11, 6, 8, 11]",
    "[6, 8]"
   ],
   "answer": [
    3
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 652,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [7, 5, 3, 9];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "'7539'",
    "25",
    "9",
    "24"
   ],
   "answer": [
    3
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 7 + 5 + 3 + 9 = 24.",
   "template": "js-reduce"
  },
  {
   "id": 653,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [8, 12, 3, 14, 15];\nconsole.log(nums.findIndex(x => x > 11));",
   "options": [
    "12",
    "0",
    "1",
    "true"
   ],
   "answer": [
    2
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 654,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 1, 5, 5];\nconsole.log(nums.every(x => x > 9));",
   "options": [
    "true",
    "false",
    "undefined",
    "[]"
   ],
   "answer": [
    1
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 655,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['banana', 'kiwi', 'cherry', 'apple'];\nconsole.log(fruits.includes('grape'));",
   "options": [
    "undefined",
    "false",
    "-1",
    "true"
   ],
   "answer": [
    1
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 656,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of limit?",
   "code": "const options = { id: 1 };\nconst { limit = 'blue' } = options;\nconsole.log(limit);",
   "options": [
    "'custom'",
    "An error is thrown",
    "'blue'",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 657,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { score: 42 };\nconst { score: label } = data;\nconsole.log(score);",
   "options": [
    "'score'",
    "ReferenceError: score is not defined",
    "undefined",
    "42"
   ],
   "answer": [
    1
   ],
   "explanation": "{ score: label } reads data.score into a NEW variable called label. No variable named score is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 658,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['pink', 'cyan', 'red', 'gold'];\nconst [first, ...rest] = colors;\nconsole.log(rest);",
   "options": [
    "['pink']",
    "['pink', 'cyan', 'red', 'gold']",
    "['cyan', 'red', 'gold']",
    "'cyan'"
   ],
   "answer": [
    2
   ],
   "explanation": "The rest element collects all the remaining items into a new array.",
   "template": "js-array-destructure"
  },
  {
   "id": 659,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { mode: 'hi', speed: 'dark' };\nconst user = { speed: 'fast', color: 'big' };\nconst merged = { ...defaults, ...user };\nconsole.log(merged.speed);",
   "options": [
    "undefined",
    "'dark'",
    "'fast'",
    "'custom'"
   ],
   "answer": [
    2
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 660,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = undefined;\nconsole.log(value && 'fallback');",
   "options": [
    "true",
    "'fallback'",
    "null",
    "undefined"
   ],
   "answer": [
    3
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 661,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = {};\nconsole.log(user?.profile?.city ?? 'Unknown');",
   "options": [
    "'Unknown'",
    "'Leeds'",
    "A TypeError is thrown",
    "null"
   ],
   "answer": [
    0
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 662,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const a = 8;\nconst b = 9;\nconsole.log(`${a} + ${b} = ${a + b}`);",
   "options": [
    "'${a} + ${b} = ${a + b}'",
    "'a + b = 17'",
    "'8 + 9 = 89'",
    "'8 + 9 = 17'"
   ],
   "answer": [
    3
   ],
   "explanation": "Inside ${...}, the expression is evaluated, so a + b is added as numbers.",
   "template": "js-template"
  },
  {
   "id": 663,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "[] (empty array)",
    "null",
    "{} (empty object)",
    "'false' (a string)",
    "0"
   ],
   "answer": [
    1,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 664,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "pop()",
    "shift()",
    "toSorted()",
    "sort()",
    "reverse()"
   ],
   "answer": [
    0,
    1,
    3,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 665,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "console.log(typeof []);",
   "options": [
    "'number'",
    "'array'",
    "'string'",
    "'object'"
   ],
   "answer": [
    3
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 666,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['c', 'e', 'b', 'f', 'd'];\nconsole.log(letters.slice(-3));",
   "options": [
    "['b', 'f', 'd', 'c']",
    "['b', 'f', 'd']",
    "['c', 'e', 'b', 'f', 'd']",
    "['c', 'e', 'b']"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 667,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [111, 2, 3, 12, 75];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[2, 3, 12, 75, 111]",
    "[111, 75, 12, 3, 2]",
    "[111, 2, 3, 12, 75]",
    "[111, 12, 2, 3, 75]"
   ],
   "answer": [
    0
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 668,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { city: 1, email: 2 };\nconsole.log(Object.values(user));",
   "options": [
    "['city']",
    "['city', 'email']",
    "2",
    "[1, 2]"
   ],
   "answer": [
    3
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 669,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const unread = '';\nreturn <div>{unread && <b>New!</b>}</div>;",
   "options": [
    "The text \"null\"",
    "<b>New!</b>",
    "Nothing",
    "The text \"false\""
   ],
   "answer": [
    2
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 670,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 2. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 4);\n  setNumber(10);\n}}>Click</button>",
   "options": [
    "3",
    "2",
    "10",
    "11"
   ],
   "answer": [
    2
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (2), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 671,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 5. After one click, what does the <h1> show?",
   "code": "const [count, setCount] = useState(5);\nfunction handleClick() {\n  setCount(count + 4);\n}\n// ...\nreturn <h1>{count}</h1>;",
   "options": [
    "undefined",
    "4",
    "5",
    "9"
   ],
   "answer": [
    3
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 672,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setName(true);\n  setAge('x');\n}",
   "options": [
    "1",
    "3",
    "2",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 673,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 3, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'add', amount: 3 });",
   "options": [
    "8",
    "3",
    "4",
    "9"
   ],
   "answer": [
    3
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 674,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('row')}>\n  <div onClick={() => console.log('page')}>\n    <div onClick={() => console.log('panel')}>\n      <button onClick={() => console.log('button')}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "button",
    "button → panel",
    "row → page → panel → button",
    "button → panel → page → row"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 675,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'general', 'general', 'random', 'music', 'music'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n});",
   "options": [
    "1",
    "5",
    "4",
    "6"
   ],
   "answer": [
    1
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 676,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Editor's state?",
   "code": "{flag ? <Editor key=\"Taylor\" /> : <Editor key=\"b\" />}",
   "options": [
    "The state is reset",
    "It depends on the browser",
    "The state is kept",
    "React throws an error"
   ],
   "answer": [
    0
   ],
   "explanation": "Different keys tell React these are different components.",
   "template": "react-preserve"
  },
  {
   "id": 677,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'eggs', done: true },\n  { id: 2, text: 'milk', done: true },\n  { id: 3, text: 'bread', done: false },\n  { id: 4, text: 'rice', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "2",
    "0",
    "4",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 678,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 40 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={undefined} />",
   "options": [
    "'80' (a string)",
    "0",
    "40",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 679,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"crossorigin\" in JSX?",
   "options": [
    "crossorigin",
    "CROSSORIGIN",
    "Crossorigin",
    "crossOrigin"
   ],
   "answer": [
    3
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 680,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "Inside a for loop",
    "At the top level of a custom Hook (useSomething)",
    "Inside an event handler function",
    "Inside a regular helper function (not a Hook)"
   ],
   "answer": [
    1
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 681,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: The full name built from firstName and lastName state?",
   "options": [
    "useState",
    "useContext",
    "Calculate it during render (no Hook)",
    "useRef"
   ],
   "answer": [
    2
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 682,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Converting a Celsius value in state to Fahrenheit for display?",
   "options": [
    "In the event handler",
    "Calculate it during rendering",
    "A key on the component",
    "An Effect (useEffect)"
   ],
   "answer": [
    1
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 683,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "tasks is state. Which expressions correctly create the NEXT state to add newItem to the end, without mutating? (select all that apply)",
   "options": [
    "tasks.unshift(newItem)",
    "tasks[tasks.length] = newItem",
    "tasks.push(newItem)",
    "[...tasks, newItem]",
    "tasks.concat(newItem)"
   ],
   "answer": [
    3,
    4
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 684,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: Whether a modal dialog is open?",
   "options": [
    "Calculate it during render",
    "Store it in a ref",
    "Keep it in state",
    "Store it in a global variable"
   ],
   "answer": [
    2
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 685,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button C get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"sepia\">\n  <ThemeContext value=\"contrast\">\n    <ThemeContext value=\"dark\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'contrast'",
    "'sepia'",
    "'dark'",
    "'light'"
   ],
   "answer": [
    1
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 686,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render cities (shape { code, name, country }) with cities.map(city => <Row ... />). Which key is best?",
   "options": [
    "key={Math.random()}",
    "key={city.code}",
    "key={index}",
    "key={city.name}"
   ],
   "answer": [
    1
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 687,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Avatar.jsx\nexport default function Avatar() { ... }\n\n// App.jsx\nimport Avatar from './Avatar';",
   "options": [
    "Error: the module does not provide that export",
    "Error: React is not defined",
    "It works",
    "It works, but the component renders nothing"
   ],
   "answer": [
    2
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 688,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 3 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(4);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "10",
    "5",
    "7",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 689,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a product table, which of these should be STATE? (select all that apply)",
   "options": [
    "The filtered products",
    "The number of visible products",
    "The search text",
    "The product list passed in as a prop"
   ],
   "answer": [
    2
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 690,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [4, 7, 7, 6];\nconsole.log(nums.map(x => 'item' + x));",
   "options": [
    "['item4', 'item7', 'item7']",
    "[4, 7, 7, 6]",
    "['item4', 'item7', 'item7', 'item6']",
    "['item6', 'item7', 'item7', 'item4']"
   ],
   "answer": [
    2
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 691,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 7, 5, 12, 8];\nconsole.log(nums.filter(x => x <= 8));",
   "options": [
    "[true, true, true, false, true]",
    "4",
    "[12]",
    "[6, 7, 5, 8]"
   ],
   "answer": [
    3
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 692,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 5, 7, 7];\nconsole.log(nums.reduce((count, x) => x % 2 === 0 ? count + 1 : count, 0));",
   "options": [
    "[6]",
    "1",
    "4",
    "3"
   ],
   "answer": [
    1
   ],
   "explanation": "It counts the even numbers by adding 1 for each one.",
   "template": "js-reduce"
  },
  {
   "id": 693,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [3, 13, 5, 7];\nconsole.log(nums.findIndex(x => x > 14));",
   "options": [
    "[]",
    "true",
    "-1",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 694,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [2, 10, 10, 4];\nconsole.log(nums.some(x => x > 9));",
   "options": [
    "false",
    "true",
    "undefined",
    "[10, 10]"
   ],
   "answer": [
    1
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 695,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['banana', 'kiwi', 'apple', 'cherry'];\nconsole.log(fruits.includes('banana'));",
   "options": [
    "undefined",
    "true",
    "false",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 696,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of theme?",
   "code": "const options = { id: 1 };\nconst { theme = 10 } = options;\nconsole.log(theme);",
   "options": [
    "10",
    "'custom'",
    "undefined",
    "An error is thrown"
   ],
   "answer": [
    0
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 697,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "let a = 8;\nlet b = 5;\n[a, b] = [b, a];\nconsole.log(a, b);",
   "options": [
    "5 8",
    "8 5",
    "5 5",
    "8 8"
   ],
   "answer": [
    0
   ],
   "explanation": "Array destructuring swaps the two values in one line.",
   "template": "js-array-destructure"
  },
  {
   "id": 698,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { size: 'fast', lang: 'light' };\nconst user = { lang: 'small', mode: 'hi' };\nconst merged = { ...user, ...defaults };\nconsole.log(Object.keys(merged).length);",
   "options": [
    "3",
    "4",
    "undefined",
    "2"
   ],
   "answer": [
    0
   ],
   "explanation": "Keys that appear in both objects are only counted once in the merged object.",
   "template": "js-spread-merge"
  },
  {
   "id": 699,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = '';\nconsole.log(value || 'fallback');",
   "options": [
    "false",
    "'fallback'",
    "''",
    "true"
   ],
   "answer": [
    1
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 700,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: null };\nconsole.log(user.profile.city);",
   "options": [
    "undefined",
    "null",
    "'Pune'",
    "A TypeError is thrown"
   ],
   "answer": [
    3
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 701,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const a = 7;\nconst b = 7;\nconsole.log(`${a} + ${b} = ${a + b}`);",
   "options": [
    "'7 + 7 = 77'",
    "'7 + 7 = 14'",
    "'14 = 14'",
    "'a + b = 14'"
   ],
   "answer": [
    1
   ],
   "explanation": "Inside ${...}, the expression is evaluated, so a + b is added as numbers.",
   "template": "js-template"
  },
  {
   "id": 702,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "false",
    "NaN",
    "null",
    "0",
    "{} (empty object)"
   ],
   "answer": [
    0,
    1,
    2,
    3
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 703,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "shift()",
    "toSpliced()",
    "toReversed()",
    "pop()",
    "map()"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 704,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "console.log(typeof null);",
   "options": [
    "'string'",
    "'function'",
    "'undefined'",
    "'object'"
   ],
   "answer": [
    3
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 705,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['b', 'a', 'e', 'c', 'd'];\nconsole.log(letters.slice(-3));",
   "options": [
    "['b', 'a', 'e']",
    "['b', 'a', 'e', 'c', 'd']",
    "['e', 'c', 'd']",
    "['c', 'd']"
   ],
   "answer": [
    2
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 706,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [15, 4, 87, 8, 115];\nconsole.log(nums.toSorted((a, b) => b - a));",
   "options": [
    "[115, 15, 4, 8, 87]",
    "[4, 8, 15, 87, 115]",
    "[15, 4, 87, 8, 115]",
    "[115, 87, 15, 8, 4]"
   ],
   "answer": [
    3
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 707,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { role: 1, email: 2, city: 3 };\nconsole.log(Object.keys(user));",
   "options": [
    "['role', 'email', 'city']",
    "[1, 2, 3]",
    "3",
    "['role', 1]"
   ],
   "answer": [
    0
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 708,
   "topic": "js",
   "difficulty": "hard",
   "question": "Which numbers are logged, in order?",
   "code": "for (let i = 0; i < 5; i++) {\n  setTimeout(() => console.log(i));\n}",
   "options": [
    "0 1 2 3 4",
    "5 5 5 5 5",
    "1 2 3 4 5",
    "4 4 4 4 4"
   ],
   "answer": [
    0
   ],
   "explanation": "let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already 5 when the timers run.",
   "template": "js-closure-loop"
  },
  {
   "id": 709,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const score = 0;\nreturn <div>{score > 0 && <b>New!</b>}</div>;",
   "options": [
    "The text \"0\"",
    "<b>New!</b>",
    "Nothing",
    "The text \"false\""
   ],
   "answer": [
    2
   ],
   "explanation": "The left side is now a true/false value, so a stray \"0\" can never appear.",
   "template": "react-and-render"
  },
  {
   "id": 710,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 1. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 2);\n  setNumber(20);\n  setNumber(n => n + 4);\n  setNumber(30);\n}}>Click</button>",
   "options": [
    "2",
    "1",
    "30",
    "31"
   ],
   "answer": [
    2
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (1), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 711,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 0. After one click, what does the <h1> show?",
   "code": "const [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n}\n// ...\nreturn <h1>{count}</h1>;",
   "options": [
    "0",
    "1",
    "undefined",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 712,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setCity(1);\n  setAge(1);\n}",
   "options": [
    "2",
    "1",
    "3",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 713,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 0, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'decrement' });",
   "options": [
    "3",
    "2",
    "1",
    "4"
   ],
   "answer": [
    1
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 714,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('toolbar')}>\n  <div onClick={() => console.log('page')}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "button → page",
    "toolbar → page → button",
    "button",
    "button → page → toolbar"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 715,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 4 times with roomId = 'random', 'random', 'music', 'music' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "5",
    "1",
    "4",
    "2"
   ],
   "answer": [
    3
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 716,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false and back to true. What happens to Scoreboard's state?",
   "code": "{flag && <Scoreboard />}",
   "options": [
    "React throws an error",
    "The state is reset",
    "It depends on the browser",
    "The state is kept"
   ],
   "answer": [
    1
   ],
   "explanation": "When flag becomes false, the component is removed; when it comes back, it starts fresh.",
   "template": "react-preserve"
  },
  {
   "id": 717,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'rice', done: false },\n  { id: 2, text: 'tea', done: false },\n  { id: 3, text: 'milk', done: true },\n  { id: 4, text: 'bread', done: false },\n  { id: 5, text: 'eggs', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "5",
    "3",
    "2",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 718,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 70 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={0} />",
   "options": [
    "0",
    "undefined",
    "70",
    "80"
   ],
   "answer": [
    0
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 719,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "At the top level of a custom Hook (useSomething)",
    "Inside a useEffect callback",
    "Inside a .map() callback in JSX",
    "After an early return statement",
    "At the top level of a component function"
   ],
   "answer": [
    0,
    4
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 720,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "items is state. Which expressions correctly create the NEXT state to remove the item with id, without mutating? (select all that apply)",
   "options": [
    "items.filter(x => x.id !== id)",
    "items.pop()",
    "items.toSpliced(index, 1)",
    "items.splice(index, 1)",
    "delete items[index]"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 721,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: The number of unread messages, given the messages array in state?",
   "options": [
    "Calculate it during render",
    "Store it in a global variable",
    "Store it in a ref",
    "Keep it in state"
   ],
   "answer": [
    0
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 722,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button C get?",
   "code": "const ThemeContext = createContext('dark');\n\n<ThemeContext value=\"contrast\">\n  <ThemeContext value=\"sepia\">\n    <ThemeContext value=\"light\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'sepia'",
    "'dark'",
    "'contrast'",
    "'light'"
   ],
   "answer": [
    2
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 723,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Card.jsx\nexport default function Card() { ... }\n\n// App.jsx\nimport Card from './Card';",
   "options": [
    "It works, but the component renders nothing",
    "Error: React is not defined",
    "It works",
    "Error: the module does not provide that export"
   ],
   "answer": [
    2
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 724,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run openMenu when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={() => openMenu()}",
    "onClick={openMenu()}",
    "onClick={function () { openMenu(); }}",
    "onClick={() => openMenu}"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 725,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 6 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(0);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "6",
    "1",
    "0",
    "12"
   ],
   "answer": [
    2
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 726,
   "topic": "refs",
   "difficulty": "medium",
   "question": "After 3 clicks, what is countRef.current?",
   "code": "const countRef = useRef(0);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "0",
    "1",
    "undefined",
    "3"
   ],
   "answer": [
    3
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 727,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 3, 9, 4];\nconsole.log(nums.map(x => 'item' + x));",
   "options": [
    "['item4', 'item9', 'item3', 'item3']",
    "['item3', 'item3', 'item9', 'item4']",
    "['item3', 'item3', 'item9']",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 728,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 9, 1, 4, 11];\nconsole.log(nums.filter(x => x <= 4));",
   "options": [
    "[7, 9, 11]",
    "[1, 4]",
    "[1]",
    "[7, 9, 1, 4, 11]"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 729,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [7, 8, 3];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "18",
    "19",
    "3",
    "'783'"
   ],
   "answer": [
    0
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 7 + 8 + 3 = 18.",
   "template": "js-reduce"
  },
  {
   "id": 730,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [11, 9, 8, 10];\nconsole.log(nums.findIndex(x => x > 13));",
   "options": [
    "-1",
    "undefined",
    "true",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 731,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [1, 8, 7, 4];\nconsole.log(nums.some(x => x > 7));",
   "options": [
    "true",
    "false",
    "[8]",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 732,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['pear', 'mango', 'grape', 'cherry'];\nconsole.log(fruits.indexOf('mango'));",
   "options": [
    "undefined",
    "1",
    "true",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 733,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of theme?",
   "code": "const options = { id: 1, theme: undefined };\nconst { theme = 'en' } = options;\nconsole.log(theme);",
   "options": [
    "'custom'",
    "'en'",
    "An error is thrown",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 734,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { score: 499 };\nconst { score: label } = data;\nconsole.log(score);",
   "options": [
    "undefined",
    "499",
    "'score'",
    "ReferenceError: score is not defined"
   ],
   "answer": [
    3
   ],
   "explanation": "{ score: label } reads data.score into a NEW variable called label. No variable named score is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 735,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['pink'];\nconst [main, accent = 'black'] = colors;\nconsole.log(accent);",
   "options": [
    "An error is thrown",
    "null",
    "'black'",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "There is no second item, so the default 'black' is used.",
   "template": "js-array-destructure"
  },
  {
   "id": 736,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { size: 'small', mode: 'en' };\nconst user = { mode: 'hi', lang: 'slow' };\nconst merged = { ...defaults, mode: 'custom' };\nconsole.log(merged.mode);",
   "options": [
    "undefined",
    "'custom'",
    "'hi'",
    "'en'"
   ],
   "answer": [
    1
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 737,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 7;\nconsole.log(value && 'fallback');",
   "options": [
    "7",
    "undefined",
    "'fallback'",
    "true"
   ],
   "answer": [
    2
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 738,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = null;\nconsole.log(user?.profile?.city);",
   "options": [
    "null",
    "undefined",
    "'Unknown'",
    "'Austin'"
   ],
   "answer": [
    1
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 739,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const name = 'asha';\nconsole.log(`Hello, ${name.toUpperCase()}!`);",
   "options": [
    "'Hello, ${name.toUpperCase()}!'",
    "An error is thrown",
    "'Hello, ASHA!'",
    "'Hello, name.toUpperCase()!'"
   ],
   "answer": [
    2
   ],
   "explanation": "Any expression, including method calls, can go inside ${...}.",
   "template": "js-template"
  },
  {
   "id": 740,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "'false' (a string)",
    "false",
    "' ' (a space)",
    "NaN",
    "0"
   ],
   "answer": [
    1,
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 741,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "filter()",
    "splice()",
    "pop()",
    "toReversed()",
    "reverse()"
   ],
   "answer": [
    1,
    2,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 742,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof 'hi');",
   "options": [
    "'boolean'",
    "'string'",
    "'number'",
    "'undefined'"
   ],
   "answer": [
    1
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 743,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "console.log(NaN === NaN);",
   "options": [
    "undefined",
    "true",
    "A TypeError is thrown",
    "false"
   ],
   "answer": [
    3
   ],
   "explanation": "Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.",
   "template": "js-equality"
  },
  {
   "id": 744,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const list = [1, 2];\nconst next = list;\nnext.push(3);\nconsole.log(list.length, list === next);",
   "options": [
    "2 true",
    "3 true",
    "1 false",
    "2 false"
   ],
   "answer": [
    1
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 745,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['c', 'e', 'd', 'a', 'f'];\nconsole.log(letters.slice(2));",
   "options": [
    "['c', 'e', 'd', 'a', 'f']",
    "['d', 'a', 'f']",
    "['a', 'f']",
    "['c', 'e', 'd']"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 746,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [4, 52, 22, 8, 106];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[106, 22, 4, 52, 8]",
    "[4, 52, 22, 8, 106]",
    "[4, 8, 22, 52, 106]",
    "[106, 52, 22, 8, 4]"
   ],
   "answer": [
    2
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 747,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { role: 1, age: 2 };\nconsole.log(Object.keys(user));",
   "options": [
    "2",
    "['role', 'age']",
    "['role']",
    "[1, 2]"
   ],
   "answer": [
    1
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 748,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const total = '';\nreturn <div>{total && <b>New!</b>}</div>;",
   "options": [
    "The text \"null\"",
    "Nothing",
    "The text \"false\"",
    "The text \"0\""
   ],
   "answer": [
    1
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 749,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 2. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 2);\n  setNumber(50);\n  setNumber(n => n + 4);\n}}>Click</button>",
   "options": [
    "2",
    "55",
    "6",
    "54"
   ],
   "answer": [
    3
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (2), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 750,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 5. What is alerted after one click?",
   "code": "const [count, setCount] = useState(5);\nfunction handleClick() {\n  setCount(count + 4);\n  alert(count);\n}",
   "options": [
    "9",
    "5",
    "4",
    "13"
   ],
   "answer": [
    1
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 751,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setStatus(true);\n  setCity(null);\n  setError(1);\n  setName(null);\n}",
   "options": [
    "0",
    "4",
    "5",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 752,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 2, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'add', amount: 3 });\ndispatch({ type: 'increment' });\ndispatch({ type: 'decrement' });\ndispatch({ type: 'decrement' });",
   "options": [
    "5",
    "3",
    "2",
    "4"
   ],
   "answer": [
    3
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 753,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('card')}>\n  <div onClick={() => console.log('toolbar')}>\n    <div onClick={() => console.log('menu')}>\n      <button onClick={() => console.log('button')}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "button",
    "card → toolbar → menu → button",
    "button → menu",
    "button → menu → toolbar → card"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 754,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 6 times with roomId = 'travel', 'travel', 'travel', 'travel', 'travel', 'travel'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n});",
   "options": [
    "2",
    "1",
    "7",
    "6"
   ],
   "answer": [
    3
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 755,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Editor's state?",
   "code": "{flag ? <Editor /> : <Panel />}",
   "options": [
    "The state is reset",
    "It depends on the browser",
    "React throws an error",
    "The state is kept"
   ],
   "answer": [
    0
   ],
   "explanation": "A different component type at the same position resets the state.",
   "template": "react-preserve"
  },
  {
   "id": 756,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'milk', done: true },\n  { id: 2, text: 'bread', done: false },\n  { id: 3, text: 'rice', done: false },\n  { id: 4, text: 'eggs', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "0",
    "3",
    "1",
    "4"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 757,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 30 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={null} />",
   "options": [
    "undefined",
    "'60' (a string)",
    "0",
    "null"
   ],
   "answer": [
    3
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 758,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"accept-charset\" in JSX?",
   "options": [
    "acceptCharset",
    "AcceptCharset",
    "ACCEPT-CHARSET",
    "accept_charset"
   ],
   "answer": [
    0
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 759,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "Inside a .map() callback in JSX",
    "Inside an event handler function",
    "At the top level of a component function",
    "After an early return statement"
   ],
   "answer": [
    2
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 760,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "todos is state. Which expressions correctly create the NEXT state to sort the list by name, without mutating? (select all that apply)",
   "options": [
    "todos.reverse().sort(byName)",
    "todos.sort(byName)",
    "[...todos].sort(byName)",
    "todos.toSorted(byName)"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 761,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button C get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"sepia\">\n  <Panel>\n    <ThemeContext value=\"blue\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </Panel>\n</ThemeContext>\n<Button />        {/* C */}",
   "options": [
    "'dark'",
    "'blue'",
    "'light'",
    "'sepia'"
   ],
   "answer": [
    2
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 762,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render songs (shape { trackId, title, artist }) with songs.map(song => <Row ... />). Which key is best?",
   "options": [
    "key={index}",
    "key={song.trackId}",
    "key={song.title}",
    "key={Math.random()}"
   ],
   "answer": [
    1
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 763,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run save when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={function () { save(); }}",
    "onClick={save()}",
    "onClick={save}",
    "onClick={() => save}",
    "onClick=\"save()\""
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 764,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 6 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(1);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "7",
    "13",
    "1",
    "2"
   ],
   "answer": [
    2
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 765,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 5, 5];\nconsole.log(nums.map(x => x * x));",
   "options": [
    "[7, 5, 5]",
    "[49, 25, 25]",
    "[49, 25]",
    "[25, 25, 49]"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 766,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [8, 4, 7, 4, 9];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "3",
    "[8]",
    "[7, 9]",
    "[8, 4, 4]"
   ],
   "answer": [
    3
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 767,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [7, 5, 3, 1];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "'7531'",
    "1",
    "17",
    "16"
   ],
   "answer": [
    3
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 7 + 5 + 3 + 1 = 16.",
   "template": "js-reduce"
  },
  {
   "id": 768,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [1, 10, 4, 6];\nconsole.log(nums.find(x => x > 4));",
   "options": [
    "undefined",
    "10",
    "1",
    "[10, 6]"
   ],
   "answer": [
    1
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 769,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [5, 5, 5, 9];\nconsole.log(nums.some(x => x > 3));",
   "options": [
    "undefined",
    "[5, 5, 5, 9]",
    "false",
    "true"
   ],
   "answer": [
    3
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 770,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['cherry', 'grape', 'pear', 'apple'];\nconsole.log(fruits.includes('apple'));",
   "options": [
    "true",
    "undefined",
    "false",
    "3"
   ],
   "answer": [
    0
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 771,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of theme?",
   "code": "const options = { id: 1 };\nconst { theme = 'en' } = options;\nconsole.log(theme);",
   "options": [
    "undefined",
    "'custom'",
    "'en'",
    "An error is thrown"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 772,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { price: 'Hello' };\nconst { price: amount } = data;\nconsole.log(price);",
   "options": [
    "'Hello'",
    "ReferenceError: amount is not defined",
    "ReferenceError: price is not defined",
    "'price'"
   ],
   "answer": [
    2
   ],
   "explanation": "{ price: amount } reads data.price into a NEW variable called amount. No variable named price is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 773,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "let a = 6;\nlet b = 7;\n[a, b] = [b, a];\nconsole.log(a, b);",
   "options": [
    "6 7",
    "7 6",
    "6 6",
    "7 7"
   ],
   "answer": [
    1
   ],
   "explanation": "Array destructuring swaps the two values in one line.",
   "template": "js-array-destructure"
  },
  {
   "id": 774,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { size: 'fast', lang: 'small' };\nconst user = { lang: 'hi', speed: 'big' };\nconst merged = { ...defaults, lang: 'custom' };\nconsole.log(Object.keys(merged).length);",
   "options": [
    "1",
    "4",
    "3",
    "2"
   ],
   "answer": [
    3
   ],
   "explanation": "Keys that appear in both objects are only counted once in the merged object.",
   "template": "js-spread-merge"
  },
  {
   "id": 775,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = undefined;\nconsole.log(value || 'fallback');",
   "options": [
    "null",
    "false",
    "true",
    "'fallback'"
   ],
   "answer": [
    3
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 776,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = null;\nconsole.log(user.profile.city);",
   "options": [
    "A TypeError is thrown",
    "'Austin'",
    "null",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 777,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const n = 0;\nconsole.log(`${n} item${n === 1 ? '' : 's'}`);",
   "options": [
    "undefined",
    "'0 item'",
    "'n items'",
    "'0 items'"
   ],
   "answer": [
    3
   ],
   "explanation": "A ternary inside ${...} is a common way to pluralise words.",
   "template": "js-template"
  },
  {
   "id": 778,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "undefined",
    "0",
    "{} (empty object)",
    "NaN",
    "'' (empty string)"
   ],
   "answer": [
    0,
    1,
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 779,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "concat()",
    "slice()",
    "toSpliced()",
    "reverse()",
    "splice()"
   ],
   "answer": [
    0,
    1,
    2
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 780,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof 'hi');",
   "options": [
    "'array'",
    "'object'",
    "'string'",
    "'null'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 781,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const list = [1, 2];\nconst next = list;\nnext.push(3);\nconsole.log(list.length, list === next);",
   "options": [
    "1 false",
    "3 true",
    "1 true",
    "2 true"
   ],
   "answer": [
    1
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 782,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['c', 'a', 'b', 'e', 'd'];\nconsole.log(letters.slice(1, 4));",
   "options": [
    "['c', 'a', 'b']",
    "['c', 'a', 'b', 'e', 'd']",
    "['a', 'b', 'e']",
    "['a', 'b', 'e', 'c']"
   ],
   "answer": [
    2
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 783,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [52, 5, 27, 104, 5];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[104, 52, 27, 5, 5]",
    "[104, 27, 5, 5, 52]",
    "[5, 5, 27, 52, 104]",
    "[52, 5, 27, 104, 5]"
   ],
   "answer": [
    2
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 784,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { email: 1, name: 2, role: 3, age: 4 };\nconsole.log(Object.values(user));",
   "options": [
    "[1, 2, 3, 4]",
    "['email', 'name', 'role', 'age']",
    "['email', 1]",
    "['email']"
   ],
   "answer": [
    0
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 785,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const total = true;\nreturn <div>{total && <b>New!</b>}</div>;",
   "options": [
    "<b>New!</b>",
    "Nothing",
    "The text \"false\"",
    "The text \"0\""
   ],
   "answer": [
    0
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 786,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 0. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(50);\n  setNumber(number + 1);\n  setNumber(n => n + 2);\n}}>Click</button>",
   "options": [
    "53",
    "2",
    "1",
    "3"
   ],
   "answer": [
    3
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (0), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 787,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 2. What is logged after one click?",
   "code": "const [count, setCount] = useState(2);\nfunction handleClick() {\n  setCount(c => c + 5);\n  console.log(count);\n}",
   "options": [
    "12",
    "7",
    "undefined",
    "2"
   ],
   "answer": [
    3
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 788,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setStatus('x');\n  setAge(1);\n  setCity(true);\n}",
   "options": [
    "0",
    "3",
    "4",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 789,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 1, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'decrement' });\ndispatch({ type: 'add', amount: 5 });\ndispatch({ type: 'reset' });",
   "options": [
    "-1",
    "6",
    "0",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 790,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('card')}>\n  <div onClick={() => console.log('toolbar')}>\n    <div onClick={e => { e.stopPropagation(); console.log('menu'); }}>\n      <button onClick={() => console.log('button')}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "card → toolbar → menu → button",
    "menu → button",
    "button → menu → toolbar → card",
    "button → menu"
   ],
   "answer": [
    3
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 791,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'music', 'general', 'random', 'travel', 'general' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "4",
    "5",
    "0",
    "1"
   ],
   "answer": [
    1
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 792,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Form's state?",
   "code": "{flag ? <Form key=\"home\" /> : <Form key=\"home\" />}",
   "options": [
    "React throws an error",
    "It depends on the browser",
    "The state is kept",
    "The state is reset"
   ],
   "answer": [
    2
   ],
   "explanation": "Same type, same position, same key: React sees the same component.",
   "template": "react-preserve"
  },
  {
   "id": 793,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'soap', done: true },\n  { id: 2, text: 'bread', done: true },\n  { id: 3, text: 'milk', done: true },\n  { id: 4, text: 'tea', done: true },\n  { id: 5, text: 'rice', done: true },\n  { id: 6, text: 'jam', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "5",
    "1",
    "6",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 794,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 50 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={0} />",
   "options": [
    "null",
    "0",
    "70",
    "50"
   ],
   "answer": [
    1
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 795,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "Inside a useEffect callback",
    "At the top level of a custom Hook (useSomething)",
    "Inside a .map() callback in JSX",
    "Inside a regular helper function (not a Hook)"
   ],
   "answer": [
    1
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 796,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button A get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"contrast\">\n  <ThemeContext value=\"dark\">\n    <ThemeContext value=\"blue\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'blue'",
    "'light'",
    "'dark'",
    "'contrast'"
   ],
   "answer": [
    0
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 797,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render orders (shape { orderNo, total, status }) with orders.map(order => <Row ... />). Which key is best?",
   "options": [
    "key={Math.random()}",
    "key=\"order\"",
    "key={order.orderNo}",
    "key={order.status}"
   ],
   "answer": [
    2
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 798,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run save when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={save}",
    "onClick={(e) => save(e)}",
    "onClick=\"save()\"",
    "onClick={() => save}",
    "onClick={save()}"
   ],
   "answer": [
    0,
    1
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 799,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 5 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(5);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "10",
    "15",
    "5",
    "6"
   ],
   "answer": [
    0
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 800,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 3 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(3);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "Clicked 4",
    "Clicked 3",
    "undefined",
    "Clicked 6"
   ],
   "answer": [
    1
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 801,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 1, 7];\nconsole.log(nums.map(x => x - 5));",
   "options": [
    "[-2, -4]",
    "[-2, -4, 2]",
    "[2, -4, -2]",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 802,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 9, 9, 4, 4];\nconsole.log(nums.filter(x => x % 2 !== 0));",
   "options": [
    "3",
    "[7, 9, 9]",
    "[7]",
    "[7, 9, 9, 4, 4]"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 803,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [7, 4, 8, 2, 6];\nconsole.log(nums.reduce((count, x) => x % 2 === 0 ? count + 1 : count, 0));",
   "options": [
    "1",
    "4",
    "[4, 8, 2, 6]",
    "5"
   ],
   "answer": [
    1
   ],
   "explanation": "It counts the even numbers by adding 1 for each one.",
   "template": "js-reduce"
  },
  {
   "id": 804,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [3, 9, 5, 10, 7];\nconsole.log(nums.find(x => x > 8));",
   "options": [
    "9",
    "null",
    "1",
    "true"
   ],
   "answer": [
    0
   ],
   "explanation": "find() returns the FIRST item that matches, or undefined if none do.",
   "template": "js-find"
  },
  {
   "id": 805,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [10, 8, 10, 5];\nconsole.log(nums.some(x => x > 7));",
   "options": [
    "false",
    "true",
    "undefined",
    "[10, 8, 10]"
   ],
   "answer": [
    1
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 806,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['grape', 'banana', 'apple', 'pear'];\nconsole.log(fruits.includes('cherry'));",
   "options": [
    "undefined",
    "true",
    "false",
    "-1"
   ],
   "answer": [
    2
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 807,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of color?",
   "code": "const options = { id: 1, color: 0 };\nconst { color = 10 } = options;\nconsole.log(color);",
   "options": [
    "undefined",
    "0",
    "An error is thrown",
    "10"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 808,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { price: 'Pune' };\nconst { price: town } = data;\nconsole.log(price);",
   "options": [
    "undefined",
    "ReferenceError: town is not defined",
    "'price'",
    "ReferenceError: price is not defined"
   ],
   "answer": [
    3
   ],
   "explanation": "{ price: town } reads data.price into a NEW variable called town. No variable named price is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 809,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['green'];\nconst [main, accent = 'black'] = colors;\nconsole.log(accent);",
   "options": [
    "An error is thrown",
    "'green'",
    "'black'",
    "null"
   ],
   "answer": [
    2
   ],
   "explanation": "There is no second item, so the default 'black' is used.",
   "template": "js-array-destructure"
  },
  {
   "id": 810,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { speed: 'small', mode: 'dark' };\nconst user = { mode: 'hi', theme: 'fast' };\nconst merged = { ...defaults, mode: 'custom' };\nconsole.log(merged.mode);",
   "options": [
    "'dark'",
    "'hi'",
    "undefined",
    "'custom'"
   ],
   "answer": [
    3
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 811,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 0;\nconsole.log(value && 'fallback');",
   "options": [
    "'fallback'",
    "0",
    "null",
    "false"
   ],
   "answer": [
    1
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 812,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const n = 2;\nconsole.log(`${n} item${n === 1 ? '' : 's'}`);",
   "options": [
    "undefined",
    "'n items'",
    "'2 item'",
    "'2 items'"
   ],
   "answer": [
    3
   ],
   "explanation": "A ternary inside ${...} is a common way to pluralise words.",
   "template": "js-template"
  },
  {
   "id": 813,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "0",
    "null",
    "' ' (a space)",
    "NaN",
    "[] (empty array)"
   ],
   "answer": [
    0,
    1,
    3
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 814,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "reverse()",
    "toSpliced()",
    "fill()",
    "map()",
    "concat()"
   ],
   "answer": [
    1,
    3,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 815,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof {});",
   "options": [
    "'boolean'",
    "'number'",
    "'object'",
    "'string'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 816,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['d', 'c', 'e', 'a', 'f'];\nconsole.log(letters.slice(0, 1));",
   "options": [
    "[]",
    "['d']",
    "['d', 'c', 'e', 'a', 'f']",
    "['d', 'c']"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 817,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [26, 67, 5, 2, 112];\nconsole.log(nums.toSorted((a, b) => b - a));",
   "options": [
    "[2, 5, 26, 67, 112]",
    "[112, 2, 26, 5, 67]",
    "[112, 67, 26, 5, 2]",
    "[26, 67, 5, 2, 112]"
   ],
   "answer": [
    2
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 818,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { email: 1, role: 2, name: 3, city: 4 };\nconsole.log(Object.keys(user));",
   "options": [
    "['email', 1]",
    "['email', 'role', 'name', 'city']",
    "[1, 2, 3, 4]",
    "4"
   ],
   "answer": [
    1
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 819,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const total = true;\nreturn <div>{total && <b>New!</b>}</div>;",
   "options": [
    "<b>New!</b>",
    "The text \"false\"",
    "Nothing",
    "The text \"null\""
   ],
   "answer": [
    0
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 820,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 2. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 2);\n  setNumber(n => n + 5);\n}}>Click</button>",
   "options": [
    "9",
    "10",
    "3",
    "7"
   ],
   "answer": [
    0
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (2), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 821,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 0. What is alerted after one click?",
   "code": "const [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setTimeout(() => alert(count), 3000);\n}",
   "options": [
    "undefined",
    "0",
    "1",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 822,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setEmail('x');\n  setName(1);\n  setCity(null);\n}",
   "options": [
    "4",
    "1",
    "3",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 823,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 2, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'add', amount: 4 });\ndispatch({ type: 'increment' });",
   "options": [
    "8",
    "9",
    "4",
    "10"
   ],
   "answer": [
    1
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 824,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('page')}>\n  <div onClick={e => { e.stopPropagation(); console.log('row'); }}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "button → row → page",
    "page → row → button",
    "button → row",
    "button"
   ],
   "answer": [
    2
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 825,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Scoreboard's state?",
   "code": "{flag ? <Scoreboard key=\"Taylor\" /> : <Scoreboard key=\"Ben\" />}",
   "options": [
    "The state is kept",
    "It depends on the browser",
    "The state is reset",
    "React throws an error"
   ],
   "answer": [
    2
   ],
   "explanation": "Different keys tell React these are different components.",
   "template": "react-preserve"
  },
  {
   "id": 826,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'jam', done: false },\n  { id: 2, text: 'bread', done: true },\n  { id: 3, text: 'milk', done: true },\n  { id: 4, text: 'rice', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "1",
    "0",
    "3",
    "4"
   ],
   "answer": [
    0
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 827,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 50 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={undefined} />",
   "options": [
    "null",
    "'95' (a string)",
    "50",
    "0"
   ],
   "answer": [
    2
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 828,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "After an early return statement",
    "At the top level of a component function",
    "At the top level of a custom Hook (useSomething)",
    "Inside a for loop",
    "Inside an event handler function"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 829,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "todos is state. Which expressions correctly create the NEXT state to mark the item with id as done, without mutating? (select all that apply)",
   "options": [
    "todos.find(x => x.id === id).done = true",
    "[...todos].map(x => x.id === id ? { ...x, done: true } : x)",
    "todos.map(x => x.id === id ? { ...x, done: true } : x)",
    "todos.map(x => { if (x.id === id) x.done = true; return x; })"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 830,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"blue\">\n  <Panel>\n    <ThemeContext value=\"sepia\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </Panel>\n</ThemeContext>\n<Button />        {/* C */}",
   "options": [
    "'sepia'",
    "'light'",
    "'contrast'",
    "'blue'"
   ],
   "answer": [
    3
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 831,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render cities (shape { code, name, country }) with cities.map(city => <Row ... />). Which key is best?",
   "options": [
    "key={city.name}",
    "key=\"city\"",
    "key={index}",
    "key={city.code}"
   ],
   "answer": [
    3
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 832,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Header.jsx\nexport default function Header() { ... }\n\n// App.jsx\nimport { Header } from './Header';",
   "options": [
    "It works",
    "Error: React is not defined",
    "Error: the module does not provide that export",
    "It works, but the component renders nothing"
   ],
   "answer": [
    2
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 833,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run save when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={(e) => save(e)}",
    "onClick={function () { save(); }}",
    "onClick={() => save}",
    "onClick={save}",
    "onClick={() => save()}"
   ],
   "answer": [
    0,
    1,
    3,
    4
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 834,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a todo app, which of these should be STATE? (select all that apply)",
   "options": [
    "The number of remaining todos",
    "The filtered list of todos",
    "The list of todos",
    "The text in the \"new todo\" input"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 835,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 5, 1];\nconsole.log(nums.map(x => x * x));",
   "options": [
    "[49, 25, 1]",
    "[7, 5, 1]",
    "undefined",
    "[49, 25]"
   ],
   "answer": [
    0
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 836,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [11, 1, 12, 3, 11];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "[false, false, true, false, false]",
    "[12]",
    "[11, 1, 12, 3, 11]",
    "[11, 1, 3, 11]"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 837,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [9, 5, 8, 6];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "6",
    "28",
    "29",
    "32"
   ],
   "answer": [
    1
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 9 + 5 + 8 + 6 = 28.",
   "template": "js-reduce"
  },
  {
   "id": 838,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [3, 1, 13, 15, 14];\nconsole.log(nums.findIndex(x => x > 10));",
   "options": [
    "2",
    "13",
    "undefined",
    "true"
   ],
   "answer": [
    0
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 839,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [7, 2, 10, 5];\nconsole.log(nums.every(x => x > 4));",
   "options": [
    "true",
    "undefined",
    "false",
    "[7, 10, 5]"
   ],
   "answer": [
    2
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 840,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['grape', 'pear', 'cherry', 'kiwi'];\nconsole.log(fruits.indexOf('cherry'));",
   "options": [
    "undefined",
    "3",
    "true",
    "2"
   ],
   "answer": [
    3
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 841,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of theme?",
   "code": "const options = { id: 1, theme: null };\nconst { theme = 'medium' } = options;\nconsole.log(theme);",
   "options": [
    "null",
    "'medium'",
    "0",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 842,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { city: 'Hello' };\nconst { city: label } = data;\nconsole.log(label);",
   "options": [
    "ReferenceError: label is not defined",
    "'city'",
    "'Hello'",
    "ReferenceError: city is not defined"
   ],
   "answer": [
    2
   ],
   "explanation": "{ city: label } reads data.city into a NEW variable called label. No variable named city is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 843,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['cyan'];\nconst [main, accent = 'black'] = colors;\nconsole.log(accent);",
   "options": [
    "undefined",
    "An error is thrown",
    "null",
    "'black'"
   ],
   "answer": [
    3
   ],
   "explanation": "There is no second item, so the default 'black' is used.",
   "template": "js-array-destructure"
  },
  {
   "id": 844,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { color: 'light', lang: 'en' };\nconst user = { lang: 'slow', speed: 'big' };\nconst merged = { ...defaults, ...user };\nconsole.log(Object.keys(merged).length);",
   "options": [
    "2",
    "undefined",
    "4",
    "3"
   ],
   "answer": [
    3
   ],
   "explanation": "Keys that appear in both objects are only counted once in the merged object.",
   "template": "js-spread-merge"
  },
  {
   "id": 845,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 7;\nconsole.log(value ?? 'fallback');",
   "options": [
    "true",
    "undefined",
    "7",
    "'fallback'"
   ],
   "answer": [
    2
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 846,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = null;\nconsole.log(user?.profile?.city ?? 'Unknown');",
   "options": [
    "undefined",
    "A TypeError is thrown",
    "null",
    "'Unknown'"
   ],
   "answer": [
    3
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 847,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const a = 2;\nconst b = 5;\nconsole.log(`${a} + ${b} = ${a + b}`);",
   "options": [
    "'a + b = 7'",
    "'2 + 5 = 25'",
    "'7 = 7'",
    "'2 + 5 = 7'"
   ],
   "answer": [
    3
   ],
   "explanation": "Inside ${...}, the expression is evaluated, so a + b is added as numbers.",
   "template": "js-template"
  },
  {
   "id": 848,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "0",
    "'0' (a string)",
    "null",
    "'' (empty string)",
    "[] (empty array)"
   ],
   "answer": [
    0,
    2,
    3
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 849,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "sort()",
    "slice()",
    "toSpliced()",
    "shift()",
    "toSorted()"
   ],
   "answer": [
    1,
    2,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 850,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "console.log(typeof null);",
   "options": [
    "'array'",
    "'boolean'",
    "'number'",
    "'object'"
   ],
   "answer": [
    3
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 851,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['e', 'd', 'b', 'f', 'c'];\nconsole.log(letters.slice(0, 2));",
   "options": [
    "['e', 'd']",
    "['d']",
    "['e', 'd', 'b', 'f', 'c']",
    "['e', 'd', 'b']"
   ],
   "answer": [
    0
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 852,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const nums = [5, 44, 3, 27, 106];\nconsole.log(nums.toSorted());",
   "options": [
    "[3, 5, 27, 44, 106]",
    "[106, 27, 3, 44, 5]",
    "[5, 44, 3, 27, 106]",
    "[106, 44, 27, 5, 3]"
   ],
   "answer": [
    1
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 853,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { role: 1, name: 2, email: 3 };\nconsole.log(Object.entries(user)[0]);",
   "options": [
    "['role']",
    "3",
    "['role', 1]",
    "[1, 2, 3]"
   ],
   "answer": [
    2
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 854,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const items = null;\nreturn <div>{items && <b>New!</b>}</div>;",
   "options": [
    "<b>New!</b>",
    "The text \"null\"",
    "The text \"false\"",
    "Nothing"
   ],
   "answer": [
    3
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 855,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 2. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 1);\n  setNumber(n => n + 1);\n  setNumber(20);\n}}>Click</button>",
   "options": [
    "21",
    "3",
    "20",
    "2"
   ],
   "answer": [
    2
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (2), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 856,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 8. What is alerted after one click?",
   "code": "const [count, setCount] = useState(8);\nfunction handleClick() {\n  setCount(count + 5);\n  setTimeout(() => alert(count), 3000);\n}",
   "options": [
    "13",
    "5",
    "18",
    "8"
   ],
   "answer": [
    3
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 857,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setCity(null);\n  setStatus(true);\n  setError(true);\n}",
   "options": [
    "0",
    "3",
    "4",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 858,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 5, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'add', amount: 2 });\ndispatch({ type: 'add', amount: 3 });\ndispatch({ type: 'add', amount: 6 });",
   "options": [
    "19",
    "18",
    "17",
    "5"
   ],
   "answer": [
    1
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 859,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('menu')}>\n  <div onClick={() => console.log('card')}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "button → card → menu",
    "button → card",
    "button",
    "menu → card → button"
   ],
   "answer": [
    0
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 860,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 4 times with roomId = 'travel', 'general', 'music', 'music' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n});",
   "options": [
    "4",
    "0",
    "2",
    "1"
   ],
   "answer": [
    0
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 861,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Scoreboard's state?",
   "code": "<div style={{ display: flag ? 'block' : 'none' }}><Scoreboard /></div>",
   "options": [
    "The state is kept",
    "React throws an error",
    "The state is reset",
    "It depends on the browser"
   ],
   "answer": [
    0
   ],
   "explanation": "Hiding with CSS keeps the component mounted, so its state survives.",
   "template": "react-preserve"
  },
  {
   "id": 862,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'tea', done: false },\n  { id: 2, text: 'rice', done: false },\n  { id: 3, text: 'soap', done: false },\n  { id: 4, text: 'milk', done: false },\n  { id: 5, text: 'bread', done: true },\n  { id: 6, text: 'eggs', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "0",
    "4",
    "2",
    "3"
   ],
   "answer": [
    2
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 863,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 80 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={undefined} />",
   "options": [
    "undefined",
    "80",
    "125",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 864,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useRef? (select all that apply)",
   "options": [
    "Inside an event handler function",
    "Inside an if statement",
    "Inside a .map() callback in JSX",
    "At the top level of a component function"
   ],
   "answer": [
    3
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 865,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('contrast');\n\n<ThemeContext value=\"light\">\n  <ThemeContext value=\"blue\">\n    <ThemeContext value=\"dark\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'blue'",
    "'dark'",
    "'light'",
    "'contrast'"
   ],
   "answer": [
    0
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 866,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run logout when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={logout()}",
    "onClick={() => logout()}",
    "onClick=\"logout()\"",
    "onClick={logout}"
   ],
   "answer": [
    1,
    3
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 867,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 4 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(1);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "2",
    "5",
    "1",
    "4"
   ],
   "answer": [
    2
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 868,
   "topic": "refs",
   "difficulty": "medium",
   "question": "You click 5 times and nothing else re-renders. What does the button show?",
   "code": "const countRef = useRef(2);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "Clicked 2",
    "Clicked 7",
    "Clicked 5",
    "Clicked 3"
   ],
   "answer": [
    0
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 869,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a signup form, which of these should be STATE? (select all that apply)",
   "options": [
    "The email input value",
    "The label text \"Email\", which never changes",
    "The password input value",
    "Whether the form is valid (both fields filled in)"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 870,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [8, 5, 8];\nconsole.log(nums.map(x => x * 4));",
   "options": [
    "[8, 5, 8]",
    "[32, 20]",
    "[32, 20, 32]",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 871,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [8, 10, 8, 9, 7];\nconsole.log(nums.filter(x => x % 2 === 0));",
   "options": [
    "3",
    "[8]",
    "[8, 10, 8, 9, 7]",
    "[8, 10, 8]"
   ],
   "answer": [
    3
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 872,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [4, 6, 3];\nconsole.log(nums.reduce((total, x) => total + x, 0));",
   "options": [
    "'463'",
    "13",
    "14",
    "16"
   ],
   "answer": [
    1
   ],
   "explanation": "reduce starts with 0 and adds each item: 0 + 4 + 6 + 3 = 13.",
   "template": "js-reduce"
  },
  {
   "id": 873,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [9, 5, 11, 8];\nconsole.log(nums.findIndex(x => x > 4));",
   "options": [
    "undefined",
    "0",
    "9",
    "[9, 5, 11, 8]"
   ],
   "answer": [
    1
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 874,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 7, 3, 10];\nconsole.log(nums.some(x => x > 8));",
   "options": [
    "false",
    "[10]",
    "true",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 875,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['grape', 'mango', 'cherry', 'kiwi'];\nconsole.log(fruits.indexOf('cherry'));",
   "options": [
    "3",
    "2",
    "undefined",
    "-1"
   ],
   "answer": [
    1
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 876,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of color?",
   "code": "const options = { id: 1 };\nconst { color = 'en' } = options;\nconsole.log(color);",
   "options": [
    "An error is thrown",
    "'en'",
    "0",
    "'custom'"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 877,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { title: 'Pune' };\nconst { title: points } = data;\nconsole.log(points);",
   "options": [
    "ReferenceError: title is not defined",
    "ReferenceError: points is not defined",
    "'Pune'",
    "'title'"
   ],
   "answer": [
    2
   ],
   "explanation": "{ title: points } reads data.title into a NEW variable called points. No variable named title is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 878,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const colors = ['blue'];\nconst [main, accent = 'black'] = colors;\nconsole.log(accent);",
   "options": [
    "An error is thrown",
    "'blue'",
    "'black'",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "There is no second item, so the default 'black' is used.",
   "template": "js-array-destructure"
  },
  {
   "id": 879,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { lang: 'hi', size: 'fast' };\nconst user = { size: 'slow', mode: 'dark' };\nconst merged = { ...user, ...defaults };\nconsole.log(merged.size);",
   "options": [
    "'slow'",
    "'custom'",
    "'fast'",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 880,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = undefined;\nconsole.log(value ?? 'fallback');",
   "options": [
    "'fallback'",
    "true",
    "undefined",
    "false"
   ],
   "answer": [
    0
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 881,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "{} (empty object)",
    "undefined",
    "'0' (a string)",
    "' ' (a space)",
    "false"
   ],
   "answer": [
    1,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 882,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "unshift()",
    "toReversed()",
    "push()",
    "slice()",
    "fill()"
   ],
   "answer": [
    1,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 883,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof undefined);",
   "options": [
    "'undefined'",
    "'array'",
    "'number'",
    "'function'"
   ],
   "answer": [
    0
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 884,
   "topic": "immutability",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "const a = { count: 1 };\nconst b = { ...a };\nb.count = 2;\nconsole.log(a.count, a === b);",
   "options": [
    "2 true",
    "1 true",
    "1 false",
    "2 false"
   ],
   "answer": [
    2
   ],
   "explanation": "Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.",
   "template": "js-equality-ref"
  },
  {
   "id": 885,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['f', 'c', 'b', 'd', 'e'];\nconsole.log(letters.slice(2));",
   "options": [
    "['f', 'c', 'b']",
    "['b', 'd', 'e', 'f']",
    "['f', 'c', 'b', 'd', 'e']",
    "['b', 'd', 'e']"
   ],
   "answer": [
    3
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 886,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [110, 91, 9, 26, 9];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[110, 91, 9, 26, 9]",
    "[9, 9, 26, 91, 110]",
    "[110, 91, 26, 9, 9]",
    "[110, 26, 9, 9, 91]"
   ],
   "answer": [
    1
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 887,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { age: 1, name: 2 };\nconsole.log(Object.keys(user));",
   "options": [
    "['age']",
    "['age', 'name']",
    "['age', 1]",
    "2"
   ],
   "answer": [
    1
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 888,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const score = true;\nreturn <div>{score && <b>New!</b>}</div>;",
   "options": [
    "The text \"null\"",
    "The text \"false\"",
    "<b>New!</b>",
    "Nothing"
   ],
   "answer": [
    2
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 889,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 0. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 2);\n  setNumber(number + 4);\n}}>Click</button>",
   "options": [
    "0",
    "4",
    "5",
    "6"
   ],
   "answer": [
    1
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (0), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 890,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 5. What is alerted after one click?",
   "code": "const [count, setCount] = useState(5);\nfunction handleClick() {\n  setCount(count + 4);\n  setTimeout(() => alert(count), 3000);\n}",
   "options": [
    "4",
    "5",
    "undefined",
    "13"
   ],
   "answer": [
    1
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 891,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setAge(true);\n  setName(1);\n  setCity(null);\n}",
   "options": [
    "3",
    "4",
    "1",
    "0"
   ],
   "answer": [
    2
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 892,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 5, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'increment' });",
   "options": [
    "3",
    "8",
    "9",
    "5"
   ],
   "answer": [
    1
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 893,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('page')}>\n  <div onClick={() => console.log('toolbar')}>\n    <div onClick={() => console.log('card')}>\n      <button onClick={e => { e.stopPropagation(); console.log('button'); }}>Click</button>\n    </div>\n  </div>\n</div>",
   "options": [
    "button → card → toolbar → page",
    "page → toolbar → card → button",
    "button",
    "button → card"
   ],
   "answer": [
    2
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 894,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'music', 'music', 'music', 'music', 'music' and is then removed from the screen. How many times does the cleanup run in total?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n});",
   "options": [
    "0",
    "2",
    "5",
    "6"
   ],
   "answer": [
    2
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 895,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Timer's state?",
   "code": "{flag ? <Timer /> : <p>Paused</p>}",
   "options": [
    "The state is reset",
    "React throws an error",
    "The state is kept",
    "It depends on the browser"
   ],
   "answer": [
    0
   ],
   "explanation": "<Timer> is replaced by a <p>, so it unmounts and its state is destroyed.",
   "template": "react-preserve"
  },
  {
   "id": 896,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'milk', done: true },\n  { id: 2, text: 'bread', done: false },\n  { id: 3, text: 'rice', done: false },\n  { id: 4, text: 'eggs', done: false },\n  { id: 5, text: 'soap', done: false },\n  { id: 6, text: 'jam', done: true },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "4",
    "2",
    "6",
    "3"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 897,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 90 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={135} />",
   "options": [
    "0",
    "null",
    "135",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 898,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useState? (select all that apply)",
   "options": [
    "After an early return statement",
    "Inside an event handler function",
    "Inside a for loop",
    "At the top level of a custom Hook (useSomething)"
   ],
   "answer": [
    3
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 899,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: How many times a button was clicked, shown in the button label?",
   "options": [
    "useState",
    "useRef",
    "Calculate it during render (no Hook)",
    "useContext"
   ],
   "answer": [
    0
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 900,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "tasks is state. Which expressions correctly create the NEXT state to insert newItem at index i, without mutating? (select all that apply)",
   "options": [
    "[...tasks.slice(0, i), newItem, ...tasks.slice(i)]",
    "tasks.splice(i, 0, newItem)",
    "tasks.toSpliced(i, 0, newItem)",
    "tasks[i] = newItem"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 901,
   "topic": "structure",
   "difficulty": "easy",
   "question": "How should you handle: The value of an \"only in stock\" checkbox?",
   "options": [
    "Store it in a global variable",
    "Store it in a ref",
    "Calculate it during render",
    "Keep it in state"
   ],
   "answer": [
    3
   ],
   "explanation": "If a value can be calculated from existing props or state, calculate it during render instead of storing it.",
   "template": "react-derive-or-state"
  },
  {
   "id": 902,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button C get?",
   "code": "const ThemeContext = createContext('light');\n\n<ThemeContext value=\"dark\">\n  <ThemeContext value=\"contrast\">\n    <ThemeContext value=\"sepia\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'contrast'",
    "'light'",
    "'sepia'",
    "'dark'"
   ],
   "answer": [
    3
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 903,
   "topic": "lists",
   "difficulty": "easy",
   "question": "You render messages (shape { messageId, text, sentAt }) with messages.map(message => <Row ... />). Which key is best?",
   "options": [
    "key={index}",
    "key={Math.random()}",
    "key=\"message\"",
    "key={message.messageId}"
   ],
   "answer": [
    3
   ],
   "explanation": "Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.",
   "template": "react-key-choice"
  },
  {
   "id": 904,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Profile.jsx\nexport function Profile() { ... }\n\n// App.jsx\nimport { Profile } from './Profile';",
   "options": [
    "It works",
    "Error: the module does not provide that export",
    "It works, but the component renders nothing",
    "Error: React is not defined"
   ],
   "answer": [
    0
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 905,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run logout when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={(e) => logout(e)}",
    "onClick=\"logout()\"",
    "onClick={() => logout()}",
    "onClick={logout()}"
   ],
   "answer": [
    0,
    2
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 906,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 3 times. What does B show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(2);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "5",
    "2",
    "3",
    "8"
   ],
   "answer": [
    1
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 907,
   "topic": "refs",
   "difficulty": "medium",
   "question": "After 6 clicks, what is countRef.current?",
   "code": "const countRef = useRef(1);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "1",
    "7",
    "2",
    "6"
   ],
   "answer": [
    1
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 908,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a chat app, which of these should be STATE? (select all that apply)",
   "options": [
    "The message draft",
    "The selected contact's ID",
    "The list of contacts passed in as a prop",
    "The count of unread messages (messages are in state)",
    "The selected contact object (contacts are in state)"
   ],
   "answer": [
    0,
    1
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 909,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [8, 2, 8, 6];\nconsole.log(nums.map(x => x % 2 === 0));",
   "options": [
    "[true, true, true, true]",
    "[8, 2, 8, 6]",
    "[true, true, true]",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 910,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 6, 8, 2, 3];\nconsole.log(nums.filter(x => x > 5));",
   "options": [
    "[2, 3]",
    "[6, 6, 8]",
    "[6]",
    "3"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 911,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [9, 4, 7];\nconsole.log(nums.reduce((max, x) => Math.max(max, x), 0));",
   "options": [
    "0",
    "9",
    "7",
    "4"
   ],
   "answer": [
    1
   ],
   "explanation": "Each step keeps the larger of the running max and the current item.",
   "template": "js-reduce"
  },
  {
   "id": 912,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [2, 13, 15, 14];\nconsole.log(nums.findIndex(x => x > 9));",
   "options": [
    "true",
    "undefined",
    "[13, 15, 14]",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 913,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [8, 6, 7, 6];\nconsole.log(nums.every(x => x > 9));",
   "options": [
    "true",
    "undefined",
    "[]",
    "false"
   ],
   "answer": [
    3
   ],
   "explanation": "every() is true only if ALL items pass the test.",
   "template": "js-some-every"
  },
  {
   "id": 914,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['banana', 'pear', 'cherry', 'kiwi'];\nconsole.log(fruits.includes('banana'));",
   "options": [
    "0",
    "false",
    "true",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "includes returns true or false.",
   "template": "js-index-includes"
  },
  {
   "id": 915,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of theme?",
   "code": "const options = { id: 1, theme: null };\nconst { theme = 'blue' } = options;\nconsole.log(theme);",
   "options": [
    "'custom'",
    "'blue'",
    "null",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 916,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { city: 'Hello' };\nconst { city: label } = data;\nconsole.log(city);",
   "options": [
    "ReferenceError: label is not defined",
    "'Hello'",
    "'city'",
    "ReferenceError: city is not defined"
   ],
   "answer": [
    3
   ],
   "explanation": "{ city: label } reads data.city into a NEW variable called label. No variable named city is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 917,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "let a = 4;\nlet b = 8;\n[a, b] = [b, a];\nconsole.log(a, b);",
   "options": [
    "8 8",
    "8 4",
    "4 4",
    "4 8"
   ],
   "answer": [
    1
   ],
   "explanation": "Array destructuring swaps the two values in one line.",
   "template": "js-array-destructure"
  },
  {
   "id": 918,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { mode: 'hi', theme: 'small' };\nconst user = { theme: 'fast', color: 'dark' };\nconst merged = { ...user, ...defaults };\nconsole.log(merged.theme);",
   "options": [
    "'fast'",
    "undefined",
    "'custom'",
    "'small'"
   ],
   "answer": [
    3
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 919,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = null;\nconsole.log(user.profile.city);",
   "options": [
    "A TypeError is thrown",
    "null",
    "'Unknown'",
    "'Leeds'"
   ],
   "answer": [
    0
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 920,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "'false' (a string)",
    "-1",
    "'' (empty string)",
    "false",
    "NaN"
   ],
   "answer": [
    2,
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 921,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)",
   "options": [
    "reverse()",
    "toSpliced()",
    "filter()",
    "push()",
    "toSorted()"
   ],
   "answer": [
    1,
    2,
    4
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 922,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof 'hi');",
   "options": [
    "'undefined'",
    "'null'",
    "'string'",
    "'array'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 923,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['f', 'c', 'd', 'e', 'a'];\nconsole.log(letters.slice(-2));",
   "options": [
    "['e', 'a', 'f']",
    "['e', 'a']",
    "['f', 'c']",
    "['a']"
   ],
   "answer": [
    1
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 924,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [112, 8, 3, 27, 45];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[112, 27, 3, 45, 8]",
    "[3, 8, 27, 45, 112]",
    "[112, 8, 3, 27, 45]",
    "[112, 45, 27, 8, 3]"
   ],
   "answer": [
    1
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 925,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { age: 1, role: 2, city: 3 };\nconsole.log(Object.keys(user));",
   "options": [
    "['age', 'role', 'city']",
    "[1, 2, 3]",
    "3",
    "['age']"
   ],
   "answer": [
    0
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 926,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const total = false;\nreturn <div>{total && <b>New!</b>}</div>;",
   "options": [
    "The text \"0\"",
    "The text \"false\"",
    "The text \"null\"",
    "Nothing"
   ],
   "answer": [
    3
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 927,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 5. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(number + 5);\n  setNumber(number + 1);\n}}>Click</button>",
   "options": [
    "5",
    "11",
    "6",
    "7"
   ],
   "answer": [
    2
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (5), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 928,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 5. After one click, what does the <h1> show?",
   "code": "const [count, setCount] = useState(5);\nfunction handleClick() {\n  setCount(count + 1);\n}\n// ...\nreturn <h1>{count}</h1>;",
   "options": [
    "6",
    "5",
    "7",
    "1"
   ],
   "answer": [
    0
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 929,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setEmail(true);\n  setError('x');\n  setStatus(null);\n  setCity(true);\n}",
   "options": [
    "1",
    "4",
    "5",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 930,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 5, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'decrement' });\ndispatch({ type: 'reset' });\ndispatch({ type: 'increment' });\ndispatch({ type: 'reset' });\ndispatch({ type: 'decrement' });",
   "options": [
    "-2",
    "5",
    "4",
    "-1"
   ],
   "answer": [
    3
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 931,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('menu')}>\n  <div onClick={() => console.log('toolbar')}>\n    <button onClick={e => { e.stopPropagation(); console.log('button'); }}>Click</button>\n  </div>\n</div>",
   "options": [
    "button → toolbar → menu",
    "button",
    "menu → toolbar → button",
    "button → toolbar"
   ],
   "answer": [
    1
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 932,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 5 times with roomId = 'travel', 'general', 'general', 'general', 'general'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, []);",
   "options": [
    "5",
    "6",
    "3",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 933,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Form's state?",
   "code": "{flag ? <Form /> : <Profile />}",
   "options": [
    "It depends on the browser",
    "The state is reset",
    "React throws an error",
    "The state is kept"
   ],
   "answer": [
    1
   ],
   "explanation": "A different component type at the same position resets the state.",
   "template": "react-preserve"
  },
  {
   "id": 934,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'milk', done: true },\n  { id: 2, text: 'soap', done: false },\n  { id: 3, text: 'jam', done: false },\n  { id: 4, text: 'eggs', done: false },\n  { id: 5, text: 'tea', done: false },\n  { id: 6, text: 'rice', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "1",
    "5",
    "6",
    "0"
   ],
   "answer": [
    1
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 935,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 50 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={90} />",
   "options": [
    "90",
    "null",
    "'90' (a string)",
    "50"
   ],
   "answer": [
    0
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 936,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"contenteditable\" in JSX?",
   "options": [
    "CONTENTEDITABLE",
    "contentEditable",
    "contenteditable",
    "Contenteditable"
   ],
   "answer": [
    1
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 937,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useContext? (select all that apply)",
   "options": [
    "Inside a regular helper function (not a Hook)",
    "At the top level of a component function",
    "Inside an event handler function",
    "Inside a for loop"
   ],
   "answer": [
    1
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 938,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "products is state. Which expressions correctly create the NEXT state to add newItem to the end, without mutating? (select all that apply)",
   "options": [
    "products.push(newItem)",
    "[...products, newItem]",
    "products.concat(newItem)",
    "products.unshift(newItem)",
    "products[products.length] = newItem"
   ],
   "answer": [
    1,
    2
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 939,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('contrast');\n\n<ThemeContext value=\"light\">\n  <Layout>\n    <Sidebar>\n      <Button />  {/* A */}\n    </Sidebar>\n  </Layout>\n</ThemeContext>\n<ThemeContext value=\"dark\">\n  <Button />    {/* B */}\n</ThemeContext>\n<Button />      {/* C */}",
   "options": [
    "'contrast'",
    "'dark'",
    "'light'",
    "'blue'"
   ],
   "answer": [
    1
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 940,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Header.jsx\nexport default function Header() { ... }\n\n// App.jsx\nimport Header from './Header';",
   "options": [
    "It works, but the component renders nothing",
    "It works",
    "Error: the module does not provide that export",
    "Error: React is not defined"
   ],
   "answer": [
    1
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 941,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run handleClick when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={handleClick}",
    "onClick={function () { handleClick(); }}",
    "onClick=\"handleClick()\"",
    "onClick={handleClick()}",
    "onClick={() => handleClick()}"
   ],
   "answer": [
    0,
    1,
    4
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 942,
   "topic": "hooks",
   "difficulty": "medium",
   "question": "You click the button in A 4 times. What does A show?",
   "code": "function useCounter() {\n  const [n, setN] = useState(5);\n  return [n, () => setN(n + 1)];\n}\n\nfunction A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }\nfunction B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }",
   "options": [
    "4",
    "6",
    "9",
    "5"
   ],
   "answer": [
    2
   ],
   "explanation": "Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.",
   "template": "react-hook-independent"
  },
  {
   "id": 943,
   "topic": "thinking",
   "difficulty": "medium",
   "question": "In a product table, which of these should be STATE? (select all that apply)",
   "options": [
    "The \"only in stock\" checkbox",
    "The product list passed in as a prop",
    "The number of visible products",
    "The search text"
   ],
   "answer": [
    0,
    3
   ],
   "explanation": "It's not state if it never changes, comes from props, or can be calculated from other state or props.",
   "template": "react-thinking-multi"
  },
  {
   "id": 944,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [5, 9, 6, 6];\nconsole.log(nums.map(x => 'item' + x));",
   "options": [
    "['item5', 'item9', 'item6', 'item6']",
    "['item5', 'item9', 'item6']",
    "undefined",
    "['item6', 'item6', 'item9', 'item5']"
   ],
   "answer": [
    0
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 945,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [9, 10, 10, 10, 5];\nconsole.log(nums.filter(x => x <= 5));",
   "options": [
    "[9, 10, 10, 10]",
    "[5]",
    "[9, 10, 10, 10, 5]",
    "[false, false, false, false, true]"
   ],
   "answer": [
    1
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 946,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [5, 1, 2];\nconsole.log(nums.reduce((max, x) => Math.max(max, x), 0));",
   "options": [
    "1",
    "0",
    "5",
    "8"
   ],
   "answer": [
    2
   ],
   "explanation": "Each step keeps the larger of the running max and the current item.",
   "template": "js-reduce"
  },
  {
   "id": 947,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [6, 15, 10, 3];\nconsole.log(nums.findIndex(x => x > 6));",
   "options": [
    "1",
    "0",
    "[15, 10]",
    "true"
   ],
   "answer": [
    0
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 948,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [3, 9, 9, 7];\nconsole.log(nums.some(x => x > 6));",
   "options": [
    "[9, 9, 7]",
    "true",
    "false",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 949,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['pear', 'kiwi', 'grape', 'cherry'];\nconsole.log(fruits.indexOf('grape'));",
   "options": [
    "2",
    "3",
    "true",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 950,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of color?",
   "code": "const options = { id: 1, color: undefined };\nconst { color = 10 } = options;\nconsole.log(color);",
   "options": [
    "10",
    "null",
    "An error is thrown",
    "0"
   ],
   "answer": [
    0
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 951,
   "topic": "js",
   "difficulty": "hard",
   "question": "What happens when this code runs?",
   "code": "const data = { city: 42 };\nconst { city: label } = data;\nconsole.log(label);",
   "options": [
    "42",
    "undefined",
    "ReferenceError: label is not defined",
    "ReferenceError: city is not defined"
   ],
   "answer": [
    0
   ],
   "explanation": "{ city: label } reads data.city into a NEW variable called label. No variable named city is created.",
   "template": "js-destructure-rename"
  },
  {
   "id": 952,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "let a = 2;\nlet b = 8;\n[a, b] = [b, a];\nconsole.log(a, b);",
   "options": [
    "8 2",
    "2 8",
    "An error is thrown",
    "2 2"
   ],
   "answer": [
    0
   ],
   "explanation": "Array destructuring swaps the two values in one line.",
   "template": "js-array-destructure"
  },
  {
   "id": 953,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { theme: 'hi', size: 'en' };\nconst user = { size: 'dark', speed: 'small' };\nconst merged = { ...defaults, ...user };\nconsole.log(merged.size);",
   "options": [
    "'en'",
    "'custom'",
    "undefined",
    "'dark'"
   ],
   "answer": [
    3
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 954,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = null;\nconsole.log(value && 'fallback');",
   "options": [
    "true",
    "false",
    "null",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 955,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = null;\nconsole.log(user?.profile?.city);",
   "options": [
    "A TypeError is thrown",
    "undefined",
    "'Austin'",
    "null"
   ],
   "answer": [
    1
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 956,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "{} (empty object)",
    "'0' (a string)",
    "undefined",
    "'' (empty string)",
    "' ' (a space)"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 957,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "toSpliced()",
    "fill()",
    "map()",
    "unshift()",
    "concat()"
   ],
   "answer": [
    1,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 958,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "console.log(typeof () => {});",
   "options": [
    "'boolean'",
    "'function'",
    "'string'",
    "'array'"
   ],
   "answer": [
    1
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 959,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['a', 'c', 'f', 'e', 'd'];\nconsole.log(letters.slice(1, 2));",
   "options": [
    "['c']",
    "[]",
    "['a']",
    "['a', 'c', 'f', 'e', 'd']"
   ],
   "answer": [
    0
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 960,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [3, 54, 4, 118, 17];\nconsole.log(nums.toSorted((a, b) => a - b));",
   "options": [
    "[118, 54, 17, 4, 3]",
    "[3, 4, 17, 54, 118]",
    "[118, 17, 3, 4, 54]",
    "[3, 54, 4, 118, 17]"
   ],
   "answer": [
    1
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 961,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { age: 1, city: 2 };\nconsole.log(Object.keys(user));",
   "options": [
    "['age', 1]",
    "[1, 2]",
    "['age']",
    "['age', 'city']"
   ],
   "answer": [
    3
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 962,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const count = false;\nreturn <div>{count && <b>New!</b>}</div>;",
   "options": [
    "Nothing",
    "The text \"false\"",
    "<b>New!</b>",
    "The text \"null\""
   ],
   "answer": [
    0
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 963,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 2. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(number + 1);\n  setNumber(n => n + 3);\n  setNumber(n => n + 5);\n  setNumber(50);\n}}>Click</button>",
   "options": [
    "2",
    "3",
    "51",
    "50"
   ],
   "answer": [
    3
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (2), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 964,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 8. What is logged after one click?",
   "code": "const [count, setCount] = useState(8);\nfunction handleClick() {\n  setCount(c => c + 5);\n  console.log(count);\n}",
   "options": [
    "8",
    "5",
    "undefined",
    "18"
   ],
   "answer": [
    0
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  },
  {
   "id": 965,
   "topic": "state",
   "difficulty": "medium",
   "question": "How many re-renders does ONE click cause?",
   "code": "function handleClick() {\n  setError(null);\n  setEmail(null);\n  setStatus(null);\n  setCity(1);\n}",
   "options": [
    "4",
    "5",
    "0",
    "1"
   ],
   "answer": [
    3
   ],
   "explanation": "React batches all the state updates in one event handler into a single re-render.",
   "template": "react-batching"
  },
  {
   "id": 966,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "Starting from 4, what is the state after these dispatches?",
   "code": "function reducer(count, action) {\n  switch (action.type) {\n    case 'increment': return count + 1;\n    case 'decrement': return count - 1;\n    case 'reset': return 0;\n    case 'add': return count + action.amount;\n  }\n}\n\ndispatch({ type: 'increment' });\ndispatch({ type: 'add', amount: 2 });\ndispatch({ type: 'decrement' });\ndispatch({ type: 'add', amount: 5 });\ndispatch({ type: 'decrement' });",
   "options": [
    "9",
    "4",
    "10",
    "5"
   ],
   "answer": [
    2
   ],
   "explanation": "Apply each action in order; the reducer returns the next state each time.",
   "template": "react-reducer-seq"
  },
  {
   "id": 967,
   "topic": "events",
   "difficulty": "medium",
   "question": "You click the button. What is logged, in order?",
   "code": "<div onClick={() => console.log('toolbar')}>\n  <div onClick={() => console.log('panel')}>\n    <button onClick={() => console.log('button')}>Click</button>\n  </div>\n</div>",
   "options": [
    "button → panel → toolbar",
    "toolbar → panel → button",
    "button",
    "button → panel"
   ],
   "answer": [
    0
   ],
   "explanation": "Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.",
   "template": "react-bubbling"
  },
  {
   "id": 968,
   "topic": "effects",
   "difficulty": "hard",
   "question": "The component renders 6 times with roomId = 'travel', 'travel', 'travel', 'travel', 'general', 'music'. In production (no StrictMode), how many times does the Effect's setup run?",
   "code": "useEffect(() => {\n  const conn = connect(roomId);\n  return () => conn.disconnect();\n}, [roomId]);",
   "options": [
    "3",
    "1",
    "4",
    "6"
   ],
   "answer": [
    0
   ],
   "explanation": "No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.",
   "template": "react-effect-runs"
  },
  {
   "id": 969,
   "topic": "preserving",
   "difficulty": "medium",
   "question": "flag toggles from true to false. What happens to Scoreboard's state?",
   "code": "{flag ? <Scoreboard /> : <p>Paused</p>}",
   "options": [
    "React throws an error",
    "It depends on the browser",
    "The state is reset",
    "The state is kept"
   ],
   "answer": [
    2
   ],
   "explanation": "<Scoreboard> is replaced by a <p>, so it unmounts and its state is destroyed.",
   "template": "react-preserve"
  },
  {
   "id": 970,
   "topic": "lists",
   "difficulty": "easy",
   "question": "How many <li> elements are rendered?",
   "code": "const todos = [\n  { id: 1, text: 'soap', done: true },\n  { id: 2, text: 'rice', done: true },\n  { id: 3, text: 'milk', done: false },\n  { id: 4, text: 'bread', done: false },\n  { id: 5, text: 'jam', done: false },\n  { id: 6, text: 'tea', done: false },\n];\n\nreturn (\n  <ul>\n    {todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)}\n  </ul>\n);",
   "options": [
    "0",
    "6",
    "4",
    "5"
   ],
   "answer": [
    2
   ],
   "explanation": "filter keeps only the matching todos, and map turns each one into an <li>.",
   "template": "react-list-count"
  },
  {
   "id": 971,
   "topic": "props",
   "difficulty": "medium",
   "question": "What is the value of size inside Avatar?",
   "code": "function Avatar({ size = 20 }) {\n  return <img width={size} />;\n}\n\n<Avatar />",
   "options": [
    "0",
    "20",
    "null",
    "undefined"
   ],
   "answer": [
    1
   ],
   "explanation": "A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.",
   "template": "react-props-default"
  },
  {
   "id": 972,
   "topic": "jsx",
   "difficulty": "easy",
   "question": "How do you write the HTML attribute \"fill-opacity\" in JSX?",
   "options": [
    "fillOpacity",
    "fill-opacity",
    "FillOpacity",
    "fill_opacity"
   ],
   "answer": [
    0
   ],
   "explanation": "Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.",
   "template": "react-jsx-attr"
  },
  {
   "id": 973,
   "topic": "state",
   "difficulty": "medium",
   "question": "Where is it valid to call useRef? (select all that apply)",
   "options": [
    "Inside an event handler function",
    "At the top level of a component function",
    "Inside a for loop",
    "After an early return statement"
   ],
   "answer": [
    1
   ],
   "explanation": "Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.",
   "template": "react-hook-where"
  },
  {
   "id": 974,
   "topic": "refs",
   "difficulty": "medium",
   "question": "Which is the best fit for: The filtered list of products for the current search text?",
   "options": [
    "useState",
    "useContext",
    "Calculate it during render (no Hook)",
    "useRef"
   ],
   "answer": [
    2
   ],
   "explanation": "Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.",
   "template": "react-ref-or-state"
  },
  {
   "id": 975,
   "topic": "effects",
   "difficulty": "medium",
   "question": "What is the best way to handle: Clearing a comment box when the userId prop changes?",
   "options": [
    "A key on the component",
    "Calculate it during rendering",
    "An Effect (useEffect)",
    "In the event handler"
   ],
   "answer": [
    0
   ],
   "explanation": "Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.",
   "template": "react-effect-needed"
  },
  {
   "id": 976,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "products is state. Which expressions correctly create the NEXT state to remove the item with id, without mutating? (select all that apply)",
   "options": [
    "delete products[index]",
    "products.pop()",
    "products.toSpliced(index, 1)",
    "products.filter(x => x.id !== id)"
   ],
   "answer": [
    2,
    3
   ],
   "explanation": "Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.",
   "template": "react-immutable-multi"
  },
  {
   "id": 977,
   "topic": "context",
   "difficulty": "medium",
   "question": "Button reads useContext(ThemeContext). Which value does Button B get?",
   "code": "const ThemeContext = createContext('blue');\n\n<ThemeContext value=\"light\">\n  <ThemeContext value=\"dark\">\n    <ThemeContext value=\"sepia\">\n      <Button />  {/* A */}\n    </ThemeContext>\n    <Button />    {/* B */}\n  </ThemeContext>\n  <Button />      {/* C */}\n</ThemeContext>",
   "options": [
    "'dark'",
    "'blue'",
    "'sepia'",
    "'light'"
   ],
   "answer": [
    0
   ],
   "explanation": "A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.",
   "template": "react-context-nearest"
  },
  {
   "id": 978,
   "topic": "jsx",
   "difficulty": "medium",
   "question": "Does this import work?",
   "code": "// Header.jsx\nexport default function Header() { ... }\n\n// App.jsx\nimport Thing from './Header';",
   "options": [
    "It works",
    "Error: React is not defined",
    "It works, but the component renders nothing",
    "Error: the module does not provide that export"
   ],
   "answer": [
    0
   ],
   "explanation": "Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or \"as\" to rename).",
   "template": "react-import-export"
  },
  {
   "id": 979,
   "topic": "events",
   "difficulty": "medium",
   "question": "Which of these run save when the button is CLICKED (and not before)? (select all that apply)",
   "options": [
    "onClick={(e) => save(e)}",
    "onClick={save}",
    "onClick={() => save()}",
    "onClick={save()}"
   ],
   "answer": [
    0,
    1,
    2
   ],
   "explanation": "Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.",
   "template": "react-pass-vs-call"
  },
  {
   "id": 980,
   "topic": "refs",
   "difficulty": "medium",
   "question": "After 3 clicks, what is countRef.current?",
   "code": "const countRef = useRef(2);\n\nreturn (\n  <button onClick={() => { countRef.current = countRef.current + 1; }}>\n    Clicked {countRef.current}\n  </button>\n);",
   "options": [
    "3",
    "undefined",
    "5",
    "2"
   ],
   "answer": [
    2
   ],
   "explanation": "Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.",
   "template": "react-ref-no-render"
  },
  {
   "id": 981,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [1, 8, 3];\nconsole.log(nums.map(x => x + 2));",
   "options": [
    "[3, 10]",
    "[5, 10, 3]",
    "undefined",
    "[3, 10, 5]"
   ],
   "answer": [
    3
   ],
   "explanation": "map() calls the function on every item and returns a NEW array of the results, the same length as the original.",
   "template": "js-map"
  },
  {
   "id": 982,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 3, 3, 4, 9];\nconsole.log(nums.filter(x => x > 7));",
   "options": [
    "[6, 3, 3, 4, 9]",
    "[6, 3, 3, 4]",
    "[9]",
    "1"
   ],
   "answer": [
    2
   ],
   "explanation": "filter() returns a new array with only the items for which the function returns true.",
   "template": "js-filter"
  },
  {
   "id": 983,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [8, 7, 9, 5, 7];\nconsole.log(nums.reduce((count, x) => x % 2 === 0 ? count + 1 : count, 0));",
   "options": [
    "2",
    "1",
    "5",
    "[8]"
   ],
   "answer": [
    1
   ],
   "explanation": "It counts the even numbers by adding 1 for each one.",
   "template": "js-reduce"
  },
  {
   "id": 984,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [14, 9, 8, 11, 5];\nconsole.log(nums.findIndex(x => x > 6));",
   "options": [
    "undefined",
    "[14, 9, 8, 11]",
    "0",
    "14"
   ],
   "answer": [
    2
   ],
   "explanation": "findIndex() returns the index of the first match, or -1 if none match.",
   "template": "js-find"
  },
  {
   "id": 985,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const nums = [6, 10, 7, 4];\nconsole.log(nums.some(x => x > 3));",
   "options": [
    "undefined",
    "true",
    "[6, 10, 7, 4]",
    "false"
   ],
   "answer": [
    1
   ],
   "explanation": "some() is true if AT LEAST ONE item passes the test.",
   "template": "js-some-every"
  },
  {
   "id": 986,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const fruits = ['grape', 'kiwi', 'cherry', 'mango'];\nconsole.log(fruits.indexOf('pear'));",
   "options": [
    "0",
    "true",
    "undefined",
    "-1"
   ],
   "answer": [
    3
   ],
   "explanation": "indexOf returns the position (starting at 0), or -1 if the value is not found.",
   "template": "js-index-includes"
  },
  {
   "id": 987,
   "topic": "js",
   "difficulty": "medium",
   "question": "What is the value of theme?",
   "code": "const options = { id: 1, theme: 0 };\nconst { theme = 10 } = options;\nconsole.log(theme);",
   "options": [
    "10",
    "0",
    "undefined",
    "'custom'"
   ],
   "answer": [
    1
   ],
   "explanation": "A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.",
   "template": "js-destructure-default"
  },
  {
   "id": 988,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const colors = ['red', 'blue', 'pink'];\nconst [a, , c] = colors;\nconsole.log(c);",
   "options": [
    "'pink'",
    "'blue'",
    "'red'",
    "undefined"
   ],
   "answer": [
    0
   ],
   "explanation": "Empty slots between commas skip items: c gets the item at index 2.",
   "template": "js-array-destructure"
  },
  {
   "id": 989,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const defaults = { lang: 'dark', color: 'light' };\nconst user = { color: 'hi', size: 'slow' };\nconst merged = { ...user, ...defaults };\nconsole.log(merged.color);",
   "options": [
    "'hi'",
    "'custom'",
    "undefined",
    "'light'"
   ],
   "answer": [
    3
   ],
   "explanation": "With spread, LATER properties overwrite earlier ones that have the same key.",
   "template": "js-spread-merge"
  },
  {
   "id": 990,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const value = 'Asha';\nconsole.log(value || 'fallback');",
   "options": [
    "null",
    "true",
    "'fallback'",
    "'Asha'"
   ],
   "answer": [
    3
   ],
   "explanation": "?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.",
   "template": "js-nullish-or"
  },
  {
   "id": 991,
   "topic": "js",
   "difficulty": "medium",
   "question": "What happens when this code runs?",
   "code": "const user = { profile: { city: 'Austin' } };\nconsole.log(user?.profile?.city);",
   "options": [
    "A TypeError is thrown",
    "null",
    "undefined",
    "'Austin'"
   ],
   "answer": [
    3
   ],
   "explanation": "?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.",
   "template": "js-optional-chaining"
  },
  {
   "id": 992,
   "topic": "js",
   "difficulty": "medium",
   "question": "Which of these values are falsy? (select all that apply)",
   "options": [
    "' ' (a space)",
    "'false' (a string)",
    "{} (empty object)",
    "NaN",
    "undefined"
   ],
   "answer": [
    3,
    4
   ],
   "explanation": "The falsy values are false, 0, -0, 0n, '', null, undefined and NaN. Everything else, including [] and {}, is truthy.",
   "template": "js-falsy-multi"
  },
  {
   "id": 993,
   "topic": "immutability",
   "difficulty": "medium",
   "question": "Which of these array methods CHANGE (mutate) the original array? (select all that apply)",
   "options": [
    "splice()",
    "slice()",
    "shift()",
    "push()",
    "toReversed()"
   ],
   "answer": [
    0,
    2,
    3
   ],
   "explanation": "Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.",
   "template": "js-mutating-multi"
  },
  {
   "id": 994,
   "topic": "js",
   "difficulty": "hard",
   "question": "What does this code log?",
   "code": "console.log(typeof new Date());",
   "options": [
    "'number'",
    "'string'",
    "'object'",
    "'boolean'"
   ],
   "answer": [
    2
   ],
   "explanation": "Watch out: typeof [] and typeof null are both \"object\", and typeof NaN is \"number\". Use Array.isArray() to check for arrays.",
   "template": "js-typeof"
  },
  {
   "id": 995,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const letters = ['e', 'd', 'f', 'c', 'b'];\nconsole.log(letters.slice(0, 3));",
   "options": [
    "['e', 'd', 'f']",
    "['e', 'd', 'f', 'c', 'b']",
    "['e', 'd', 'f', 'c']",
    "['d', 'f']"
   ],
   "answer": [
    0
   ],
   "explanation": "slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.",
   "template": "js-slice"
  },
  {
   "id": 996,
   "topic": "js",
   "difficulty": "medium",
   "question": "What does this code log?",
   "code": "const nums = [104, 27, 6, 8, 93];\nconsole.log(nums.toSorted((a, b) => b - a));",
   "options": [
    "[104, 27, 6, 8, 93]",
    "[6, 8, 27, 93, 104]",
    "[104, 93, 27, 8, 6]",
    "undefined"
   ],
   "answer": [
    2
   ],
   "explanation": "Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.",
   "template": "js-sort"
  },
  {
   "id": 997,
   "topic": "js",
   "difficulty": "easy",
   "question": "What does this code log?",
   "code": "const user = { email: 1, role: 2 };\nconsole.log(Object.entries(user)[0]);",
   "options": [
    "[1, 2]",
    "2",
    "['email', 'role']",
    "['email', 1]"
   ],
   "answer": [
    3
   ],
   "explanation": "Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.",
   "template": "js-object-keys"
  },
  {
   "id": 998,
   "topic": "lists",
   "difficulty": "medium",
   "question": "What does the <div> contain?",
   "code": "const count = null;\nreturn <div>{count && <b>New!</b>}</div>;",
   "options": [
    "The text \"false\"",
    "Nothing",
    "<b>New!</b>",
    "The text \"null\""
   ],
   "answer": [
    1
   ],
   "explanation": "x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and '', but it DOES render the number 0.",
   "template": "react-and-render"
  },
  {
   "id": 999,
   "topic": "state",
   "difficulty": "hard",
   "question": "number is 0. After ONE click, what is number on the next render?",
   "code": "<button onClick={() => {\n  setNumber(n => n + 3);\n  setNumber(n => n + 4);\n}}>Click</button>",
   "options": [
    "8",
    "7",
    "4",
    "1"
   ],
   "answer": [
    1
   ],
   "explanation": "React queues the updates. setNumber(number + a) replaces the value using the snapshot (0), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.",
   "template": "react-state-queue"
  },
  {
   "id": 1000,
   "topic": "state",
   "difficulty": "medium",
   "question": "count is 8. What is alerted after one click?",
   "code": "const [count, setCount] = useState(8);\nfunction handleClick() {\n  setCount(count + 4);\n  setTimeout(() => alert(count), 3000);\n}",
   "options": [
    "4",
    "16",
    "12",
    "8"
   ],
   "answer": [
    3
   ],
   "explanation": "State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.",
   "template": "react-snapshot"
  }
 ]
};
