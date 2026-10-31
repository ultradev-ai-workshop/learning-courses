// Generates the 1000-question pool for the React Beginner Book assessment.
// ~200 hand-written questions + template questions whose answers are computed by running real JS.
// Usage: node gen-questions.mjs <outDir>
import fs from 'fs';
import path from 'path';

const OUT = process.argv[2] || '.';
const TARGET = 1000;

// ---------- seeded random ----------
let seed = 20261030;
function rand() {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (arr, n) => shuffle(arr).slice(0, n);

// ---------- formatting ----------
function fmt(v) {
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'number') return Number.isNaN(v) ? 'NaN' : String(v);
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.length ? `[${v.map(fmt).join(', ')}]` : '[]';
  if (typeof v === 'object') {
    const e = Object.entries(v);
    return e.length ? `{ ${e.map(([k, x]) => `${k}: ${fmt(x)}`).join(', ')} }` : '{}';
  }
  return String(v);
}
const L = (...lines) => lines.join('\n');

// ---------- storage ----------
const Q = [];
const seen = new Set();
function add({ topic, difficulty = 'easy', question, code = null, options, correct, explanation, template = null }) {
  if (new Set(options).size !== options.length) return false;
  if (!correct.length) return false;
  const key = question + '|' + (code || '') + '|' + [...options].sort().join('§');
  if (seen.has(key)) return false;
  seen.add(key);
  const order = shuffle(options.map((_, i) => i));
  Q.push({
    topic, difficulty, template, question, code,
    options: order.map((i) => options[i]),
    answer: order.map((orig, idx) => (correct.includes(orig) ? idx : -1)).filter((i) => i >= 0),
    explanation,
  });
  return true;
}

// hand-written: options starting with '*' are correct
function h(topic, difficulty, question, options, explanation, code = null) {
  const correct = [];
  const clean = options.map((o, i) => { if (o.startsWith('*')) { correct.push(i); return o.slice(1); } return o; });
  if (!add({ topic, difficulty, question, code, options: clean, correct, explanation })) {
    throw new Error('Duplicate or invalid hand-written question: ' + question);
  }
}

// generated single-answer: correct string + candidate wrong strings
const FALLBACKS = ['undefined', 'null', 'An error is thrown', '[]', 'NaN', 'true', 'false'];
function single(topic, difficulty, question, code, correctStr, wrongs, explanation, template) {
  const pool = [...new Set(wrongs.filter((w) => w !== correctStr))];
  for (const f of FALLBACKS) { if (pool.length >= 3) break; if (f !== correctStr && !pool.includes(f)) pool.push(f); }
  const chosen = sample(pool, 3);
  return add({ topic, difficulty, question, code, options: [correctStr, ...chosen], correct: [0], explanation, template });
}
// generated multi-answer: items [{ text, ok }]
function multi(topic, difficulty, question, code, items, explanation, template) {
  if (!items.some((i) => i.ok) || !items.some((i) => !i.ok)) return false;
  return add({ topic, difficulty, question, code, options: items.map((i) => i.text), correct: items.map((i, k) => (i.ok ? k : -1)).filter((k) => k >= 0), explanation, template });
}

// =====================================================================
// HAND-WRITTEN QUESTIONS
// =====================================================================

// ---- JS refresher (appendix) ----
h('js', 'easy', 'What is the difference between const and let?', ['*A const variable cannot be reassigned; a let variable can', 'const makes objects and arrays completely unchangeable', 'let is only allowed inside functions', 'There is no difference'], 'const prevents reassignment of the variable. The object or array it points to can still be changed.');
h('js', 'easy', 'Is this code allowed?', ['*Yes: const stops reassignment, not mutation of the array', 'No: you cannot push into a const array', 'Only in strict mode', 'Only if the array is empty'], 'const blocks `items = somethingElse`, but you can still call methods like push on the same array.', L('const items = [];', 'items.push(1);'));
h('js', 'medium', 'How do you return an object literal from an arrow function in one line?', ['*() => ({ name: \'Asha\' })', '() => { name: \'Asha\' }', '() => return { name: \'Asha\' }', '() => [name: \'Asha\']'], 'Wrap the object in parentheses. Otherwise the braces are read as a function body.');
h('js', 'easy', 'Which syntax creates a template literal?', ['*`Hello, ${name}!`', '\'Hello, ${name}!\'', '"Hello, {name}!"', '`Hello, {{name}}!`'], 'Template literals use backticks and ${...} for embedded expressions.');
h('js', 'easy', 'What is `{ name }` shorthand for in an object literal?', ['*{ name: name }', '{ name: undefined }', '{ "name": "name" }', '[name]'], 'Shorthand property names use the variable name as both the key and the value.');
h('js', 'medium', 'What does `...` do in `function sum(...nums) {}`?', ['*Collects all the arguments into an array (rest parameter)', 'Spreads nums into separate arguments', 'Makes nums optional', 'Copies the function'], 'In a parameter list, ... is the rest syntax: it gathers the remaining arguments into an array.');
h('js', 'easy', 'Which of these are falsy in JavaScript? (select all that apply)', ['*0', '*\'\' (an empty string)', '*null', '\'0\' (a string)', '[] (an empty array)'], 'The falsy values are false, 0, -0, 0n, \'\', null, undefined and NaN. Empty arrays and objects are truthy.');
h('js', 'medium', 'What is the difference between `a ?? b` and `a || b`?', ['*?? falls back to b only when a is null or undefined; || falls back for any falsy a', 'They are identical', '?? only works with numbers', '|| only works with booleans'], '?? (nullish coalescing) keeps values like 0 and \'\', which || would replace.');
h('js', 'easy', 'What does `user?.address?.city` return when user is null?', ['*undefined', 'null', 'It throws a TypeError', '\'\''], 'Optional chaining stops and returns undefined when the value on its left is null or undefined.');
h('js', 'easy', 'What does `===` check?', ['*Equality of value AND type, without type conversion', 'Equality after converting types', 'Only the type', 'Whether two variables have the same name'], 'Strict equality never converts types: \'5\' === 5 is false.');
h('js', 'medium', 'Why is `{ a: 1 } === { a: 1 }` false?', ['*Objects are compared by reference, and these are two different objects', 'Because === converts them to strings first', 'Because object keys are unordered', 'It is actually true'], 'Two separately created objects are never === to each other, even if their contents match. React relies on this to detect changes.');
h('js', 'easy', 'What is the key difference between map() and forEach()?', ['*map() returns a new array; forEach() returns undefined', 'forEach() is faster and returns a new array', 'map() changes the original array', 'There is no difference'], 'Use map when you want a transformed array, for example to turn data into JSX.');
h('js', 'medium', 'What does fetch(url) return?', ['*A Promise that resolves to a Response object', 'The JSON data directly', 'A string of HTML', 'undefined until the data arrives'], 'You usually call res.json(), which returns another Promise, to get the parsed data.');
h('js', 'medium', 'What does `await` do inside an async function?', ['*Pauses that function until the Promise settles, then gives you its value', 'Blocks the entire browser', 'Makes the code run twice', 'Converts a value into a Promise and returns immediately'], 'await pauses only the async function. The rest of the page keeps running.');
h('js', 'hard', 'What is a closure?', ['*A function that remembers the variables from the place where it was created', 'A function that closes the browser tab', 'A way to end a loop early', 'A private class field'], 'Event handlers in React are closures: they remember the props and state of the render that created them.');
h('js', 'easy', 'Which import matches `export default function Card() {}`?', ['*import Card from \'./Card\'', 'import { Card } from \'./Card\'', 'import * as Card from \'./Card\'', 'require Card from \'./Card\''], 'Default exports are imported without braces, and you can choose any name.');
h('js', 'medium', 'Which of these return a new array and leave the original unchanged? (select all that apply)', ['*map', '*filter', '*slice', 'push', 'splice'], 'push and splice change the original array. map, filter and slice return new ones.');

// ---- Chapter 1: Getting started ----
h('setup', 'easy', 'What is React?', ['*A JavaScript library for building user interfaces', 'A database', 'A CSS framework', 'A programming language'], 'React builds UIs out of components.');
h('setup', 'easy', 'Which command creates a new React project with Vite?', ['*npm create vite@latest my-app -- --template react', 'npm install react-app', 'npx react new my-app', 'vite init react my-app'], 'This scaffolds a Vite project from the React template.');
h('setup', 'easy', 'What does `npm run dev` do in a Vite project?', ['*Starts the development server with instant updates', 'Builds production files into dist/', 'Installs dependencies', 'Deletes node_modules'], 'The dev server serves your app and updates it as you save.');
h('setup', 'easy', 'Which file in a Vite project starts React with createRoot()?', ['*src/main.jsx', 'index.html', 'src/App.jsx', 'vite.config.js'], 'main.jsx finds #root and renders <App /> into it.');
h('setup', 'easy', 'What element in index.html does React render into?', ['*<div id="root"></div>', '<body id="app">', '<react-root>', '<main id="react">'], 'createRoot(document.getElementById(\'root\')) takes over that element.');
h('setup', 'medium', 'Which package provides createRoot for web pages?', ['*react-dom/client', 'react', 'vite', 'react-native'], 'react-dom connects React to the browser DOM.');
h('setup', 'medium', 'What is true about <StrictMode>? (select all that apply)', ['*It runs some of your code twice in development to find bugs', '*It renders no visible UI of its own', 'It makes the production build faster', 'It disables all console warnings'], 'StrictMode is a development-only checking tool.');
h('setup', 'easy', 'Which folder should you never edit by hand?', ['*node_modules', 'src', 'public', 'src/components'], 'node_modules is recreated by npm install, so your changes would be lost.');
h('setup', 'easy', 'What does `npm run build` produce?', ['*An optimised production version in dist/', 'A running dev server', 'A new React project', 'A test report'], 'The build bundles and minifies your app for deployment.');
h('setup', 'medium', 'What is HMR (Hot Module Replacement)?', ['*Updating changed modules in the browser without a full page reload', 'A React Hook for state', 'A routing library', 'A testing framework'], 'HMR is why your edits appear instantly when you save.');
h('setup', 'medium', 'Why might console.log in a component print twice during development?', ['*StrictMode calls components twice to detect impure code', 'There is a bug in Vite', 'Two browser tabs are open', 'React 19 always logs twice in production'], 'This happens only in development. Production renders once.');
h('setup', 'medium', 'Which ways of starting a new React app do the official docs recommend? (select all that apply)', ['*A framework such as Next.js or React Router', '*A build tool such as Vite', 'Opening index.html directly from Finder', 'Copying React files out of node_modules'], 'Frameworks suit full apps; build tools like Vite suit learning and custom setups.');
h('setup', 'easy', 'What does "declarative" UI mean in React?', ['*You describe what the UI should look like for the current data, and React updates the DOM', 'You write every DOM change step by step', 'You declare CSS variables', 'You must use classes'], 'UI = f(state): you change the data, and React works out the DOM changes.');
h('setup', 'easy', 'What does the React Developer Tools browser extension add?', ['*A Components tab showing your component tree with props and state', 'A new code editor', 'A CSS preprocessor', 'A database viewer'], 'It\'s the best way to inspect a running React app.');

// ---- Chapter 2: Components & JSX ----
h('jsx', 'easy', 'Component names must start with…', ['*A capital letter', 'A lowercase letter', 'An underscore', 'The word "use"'], 'React treats lowercase tags as HTML elements.');
h('jsx', 'easy', 'What can a component return as its root?', ['*A single element or a Fragment', 'Several sibling elements with no wrapper', 'Only a <div>', 'Only a string'], 'Wrap siblings in <>...</> or a parent element.');
h('jsx', 'easy', 'What is <>...</> called?', ['*A Fragment', 'A Portal', 'A Template', 'A Slot'], 'Fragments group elements without adding a DOM node.');
h('jsx', 'medium', 'Which of these are valid JSX? (select all that apply)', ['*<img src="a.png" />', '*<br />', '<img src="a.png">', '<input value="x">'], 'In JSX every tag must be closed, so self-closing tags need a slash.');
h('jsx', 'easy', 'How do you write a comment inside JSX markup?', ['*{/* comment */}', '<!-- comment -->', '// comment', '# comment'], 'JSX comments are JavaScript comments inside braces.');
h('jsx', 'medium', 'Which inline style is correct JSX?', ['*style={{ marginTop: 8 }}', 'style="margin-top: 8px"', 'style={marginTop: 8}', 'style={{ "margin-top": 8 }}'], 'style takes an object with camelCase keys. A plain number means pixels.');
h('jsx', 'medium', 'What can you put inside { } in JSX? (select all that apply)', ['*A variable', '*A function call like formatDate(d)', '*A ternary expression', 'An if statement'], 'Braces accept expressions, not statements.');
h('jsx', 'medium', 'Why should you not define a component inside another component?', ['*It is re-created on every render, which resets its state and slows things down', 'It is a syntax error', 'React does not allow nested functions', 'It makes the component private, which is not allowed'], 'Always define components at the top level of the file.');
h('jsx', 'medium', 'What does this component return?', ['*undefined (the JSX on the next line is ignored)', 'The <h1> element', 'A syntax error is always thrown', 'An empty string'], 'With nothing after return on the same line, JavaScript returns immediately. Wrap multi-line JSX in parentheses.', L('function Title() {', '  return', '    <h1>Hello</h1>;', '}'));
h('jsx', 'easy', 'How many default exports can one file have?', ['*One', 'Unlimited', 'Two', 'None'], 'Use named exports when a file shares several things.');
h('jsx', 'easy', 'Which extension should files containing JSX use in a Vite project?', ['*.jsx', '.js', '.html', '.json'], 'Vite expects JSX in .jsx (or .tsx) files.');
h('jsx', 'medium', 'What does "Failed to resolve import ./components/Profile" usually mean?', ['*The path or filename is wrong (including capital letters)', 'Profile has a syntax error', 'React is not installed', 'The component returns null'], 'Check the folder, the spelling and the case of the file name.');
h('jsx', 'medium', 'How do you write aria-label in JSX?', ['*aria-label (the dash is kept)', 'ariaLabel', 'aria_label', 'arialabel'], 'aria-* and data-* attributes keep their dashes in JSX.');
h('jsx', 'hard', 'Why can\'t you write `<{tag}>` to choose a tag dynamically?', ['*Braces are not allowed in the tag-name position; use a capitalised variable instead: const Tag = tag; <Tag />', 'Because tags must always be strings', 'Because React only supports div', 'You can; it works fine'], 'Assign the tag to a capitalised variable and use that variable as the tag.');
h('jsx', 'easy', 'JSX is converted into…', ['*Regular JavaScript function calls', 'HTML files on disk', 'CSS', 'JSON'], 'Your build tool compiles JSX into JavaScript that creates React elements.');

// ---- Chapter 3: Props ----
h('props', 'easy', 'How does a component receive its props?', ['*As a single object passed as its first argument', 'As separate function arguments', 'From global variables', 'Only through this.props'], 'React calls Avatar({ person, size }).');
h('props', 'easy', 'What is `function Avatar({ person, size })` an example of?', ['*Object destructuring of props', 'The spread operator', 'Rest parameters', 'Currying'], 'Destructuring pulls the named props out of the props object.');
h('props', 'easy', 'Can a component change its own props?', ['*No, props are read-only', 'Yes, any time', 'Only string props', 'Only inside an Effect'], 'Props belong to the parent. Use state for values that change.');
h('props', 'medium', 'When is a default prop value (`{ size = 100 }`) used? (select all that apply)', ['*When the prop is not passed', '*When the prop is passed as undefined', 'When the prop is null', 'When the prop is 0'], 'Defaults apply only to missing or undefined values.');
h('props', 'easy', 'Content placed between <Card> and </Card> is received as…', ['*The children prop', 'The content prop', 'props.inner', 'A slot named default'], 'Use {children} in Card to render it.');
h('props', 'medium', 'What does `<Avatar {...props} />` do?', ['*Passes every prop in the props object on to Avatar', 'Copies Avatar\'s state', 'Removes all the props', 'Merges context into props'], 'Spread forwards all the props. Use it sparingly.');
h('props', 'easy', 'Which passes the NUMBER 100 as a prop?', ['*<Avatar size={100} />', '<Avatar size="100" />', '<Avatar size=100 />', '<Avatar size:{100} />'], 'Quotes make a string; braces pass a JavaScript value.');
h('props', 'easy', 'In which direction do props flow?', ['*From parent to child', 'From child to parent', 'In both directions automatically', 'Between siblings directly'], 'Data flows down. Children talk back by calling functions that were passed down.');
h('props', 'medium', 'How can a child tell its parent that something happened?', ['*By calling a function the parent passed as a prop', 'By changing its props', 'By importing the parent', 'By editing the parent\'s state variable directly'], 'For example: <Button onClick={handleClick} />.');
h('props', 'easy', 'Which of these can be passed as props? (select all that apply)', ['*Strings', '*Functions', '*JSX elements', '*Objects and arrays'], 'Any JavaScript value can be a prop.');
h('props', 'medium', 'Can a component read its own `key` from props?', ['*No: React uses key itself and does not pass it to the component', 'Yes, as props.key', 'Only inside lists', 'Only in development'], 'Pass the ID again under a different name if the component needs it.');
h('props', 'medium', 'What happens when a parent re-renders and passes new prop values?', ['*The child re-renders with the new props', 'The child keeps the old props forever', 'React throws an error', 'The child must call refresh()'], 'Props are a snapshot for each render.');

// ---- Chapter 4: Conditions & lists ----
h('lists', 'easy', 'What does a component that returns null render?', ['*Nothing', 'The text "null"', 'An error', 'An empty <div>'], 'Returning null is a valid way to render nothing.');
h('lists', 'easy', 'What does `{isPacked ? \'✅\' : \'❌\'}` render when isPacked is false?', ['*❌', '✅', 'Both', 'Nothing'], 'The ternary picks the second value when the condition is false.');
h('lists', 'easy', 'Which array method is normally used to turn data into a list of JSX elements?', ['*map()', 'forEach()', 'for...in', 'push()'], 'map returns a new array, which React can render.');
h('lists', 'medium', 'What is wrong with this code?', ['*The curly braces create a function body, so nothing is returned', 'It is missing an import', 'li cannot be used inside map', 'Nothing is wrong'], 'Use parentheses, or write an explicit return.', 'people.map(p => { <li>{p}</li> })');
h('lists', 'medium', 'What must be true of keys in a list? (select all that apply)', ['*Unique among siblings', '*Stable between renders', 'Unique across the whole app', 'Always numbers'], 'Keys only need to be unique within the same list.');
h('lists', 'medium', 'Why is key={Math.random()} a bad idea?', ['*Every render produces new keys, so React re-creates every item and loses its state', 'Random numbers are not allowed in JSX', 'Keys must be strings', 'It works perfectly'], 'Keys must be stable. Generate IDs when you create the data, not while rendering.');
h('lists', 'medium', 'When is it acceptable to use the array index as a key?', ['*When the list is never reordered, filtered, or has items inserted or removed', 'Always', 'Never', 'Only for lists of strings'], 'Indexes shift when the list changes, which causes bugs.');
h('lists', 'medium', 'How do you give a key to a group of elements returned from map()?', ['*Use <Fragment key={id}>...</Fragment>', 'Put the key on <>...</>', 'Use <React.Key>', 'It\'s impossible'], 'The short <> syntax cannot take a key.');
h('lists', 'easy', 'Where should the key go?', ['*On the outermost element returned from map()', 'On the <ul>', 'On the text inside the item', 'On the component definition'], 'React needs the key on each item in the array.');
h('lists', 'easy', 'What does array.filter(fn) return?', ['*A new array containing the items for which fn returned true', 'The first matching item', 'A boolean', 'The same array, modified'], 'filter never changes the original array.');
h('lists', 'medium', 'For which of these values does React render nothing? (select all that apply)', ['*false', '*null', '*undefined', '0'], 'React renders the number 0, so watch out for count && ....');
h('lists', 'easy', 'Which is the most readable approach for complex conditional UI?', ['*Assign JSX to a variable with if/else before the return', 'Nest five ternaries inline', 'Use a switch inside JSX braces', 'Put each branch in a separate file'], 'JSX is just a value, so build it step by step.');

// ---- Chapter 5: Purity & UI tree ----
h('purity', 'easy', 'What makes a component "pure"?', ['*Same inputs give the same output, and it does not change anything that existed before it rendered', 'It has no props', 'It has no state', 'It only uses CSS'], 'Pure components are predictable and safe to re-run.');
h('purity', 'medium', 'Which of these should NOT happen while rendering? (select all that apply)', ['*Changing a variable declared outside the component', '*Calling fetch()', '*Setting document.title', 'Creating a local array and pushing items into it'], 'Local mutation is fine. Changing the outside world is a side effect.');
h('purity', 'easy', 'Is it OK to mutate a variable you created during the same render?', ['*Yes: local mutation is invisible to the outside', 'No, never', 'Only arrays', 'Only in StrictMode'], 'The problem is only changing data that existed before the render.');
h('purity', 'medium', 'Why does StrictMode call components twice in development?', ['*To reveal impure components that behave differently on a second call', 'To make the app faster', 'To pre-load data', 'To test CSS'], 'Pure components give the same result twice.');
h('purity', 'easy', 'Where should side effects go first?', ['*In event handlers', 'In the component body', 'In the key prop', 'In CSS'], 'Effects (useEffect) are the last resort.');
h('purity', 'medium', 'Why is calling items.sort() on an array prop a problem?', ['*sort() mutates the parent\'s array, which makes the component impure', 'sort() does not work on props', 'It makes the list unsorted', 'There is no problem'], 'Use toSorted() or [...items].sort().');
h('purity', 'easy', 'What does the render tree contain?', ['*Components and which component rendered which', 'Only HTML tags', 'Files and their imports', 'CSS rules'], 'The module dependency tree is the one that shows imports.');
h('purity', 'easy', 'What does the module dependency tree show?', ['*Which files import which', 'Which components render which', 'The CSS cascade', 'The order of state updates'], 'Bundlers use it to decide what to ship.');
h('purity', 'easy', 'What is a leaf component?', ['*A component that renders no other components', 'The root component', 'A component with state', 'A component in a separate file'], 'Leaves are usually small and re-render often.');
h('purity', 'medium', 'What benefits does purity bring? (select all that apply)', ['*React can safely skip re-rendering when the inputs haven\'t changed', '*Components can render on a server with the same result', '*Tools like the React Compiler can optimise the code', 'You are allowed to mutate props'], 'Purity is what makes React\'s optimisations safe.');
h('purity', 'medium', 'Why can the render tree be different from one render to the next?', ['*Conditional rendering can show different components', 'React randomly reorders components', 'Imports change at runtime', 'It can\'t: the tree is always the same'], 'For example: {isLoggedIn ? <Dashboard /> : <Login />}.');

// ---- Chapter 6: Events ----
h('events', 'easy', 'Which is the correct way to attach a click handler?', ['*onClick={handleClick}', 'onClick={handleClick()}', 'onclick="handleClick()"', 'onClick="handleClick"'], 'Pass the function itself, without calling it.');
h('events', 'easy', 'What happens with onClick={handleClick()}?', ['*handleClick runs during rendering, not on click', 'handleClick runs on every click', 'Nothing ever happens', 'It runs on double-click'], 'The parentheses call the function immediately.');
h('events', 'easy', 'How do you call remove(id) when a button is clicked?', ['*onClick={() => remove(id)}', 'onClick={remove(id)}', 'onClick={remove, id}', 'onClick="remove(id)"'], 'Wrap the call in an arrow function.');
h('events', 'easy', 'What is the naming convention for event handlers and event props?', ['*Functions are named handleX; props are named onX', 'Functions are named onX; props are named handleX', 'Both use doX', 'There is no convention'], 'For example: <Toolbar onPlay={handlePlay} />.');
h('events', 'easy', 'What is event bubbling?', ['*The event runs on the clicked element, then on each of its parents', 'The event runs only on the parent', 'The event is cancelled', 'The event runs twice on the same element'], 'Handlers on ancestors run after the target\'s handler.');
h('events', 'easy', 'What does e.stopPropagation() do?', ['*Stops handlers on parent elements from running', 'Stops the browser\'s default behaviour', 'Removes the handler', 'Reloads the page'], 'Use preventDefault() for default browser behaviour.');
h('events', 'easy', 'How do you stop a form submission from reloading the page?', ['*Call e.preventDefault() in onSubmit', 'Call e.stopPropagation()', 'Return false from the component', 'Remove the <form> tag'], 'preventDefault cancels the browser\'s built-in action.');
h('events', 'easy', 'Are side effects (like changing state or sending requests) allowed in event handlers?', ['*Yes, event handlers are the best place for them', 'No, handlers must be pure', 'Only in onSubmit', 'Only in class components'], 'Handlers don\'t run during rendering, so they don\'t need to be pure.');
h('events', 'medium', 'What is the difference between e.target and e.currentTarget?', ['*target is the element that was clicked; currentTarget is the element whose handler is running', 'They are always the same', 'currentTarget is the clicked element', 'target is the window'], 'They differ when an event bubbles up to a parent\'s handler.');
h('events', 'easy', 'When does onChange fire on a text <input> in React?', ['*On every change to the value (every keystroke)', 'Only when the input loses focus', 'Only on Enter', 'Only on page load'], 'React\'s onChange behaves like the browser\'s input event.');
h('events', 'easy', 'How do you read whether a checkbox is ticked in onChange?', ['*e.target.checked', 'e.target.value', 'e.checked', 'e.target.ticked'], 'Checkboxes use checked; text inputs use value.');
h('events', 'easy', 'Which of these are valid React event props? (select all that apply)', ['*onClick', '*onMouseEnter', '*onKeyDown', 'onclick', 'on-click'], 'React event props are camelCase.');

// ---- Chapter 7: State ----
h('state', 'easy', 'Why doesn\'t changing a local variable update the screen? (select all that apply)', ['*Local variables reset on every render', '*Changing a local variable does not trigger a re-render', 'Because local variables are const', 'Because React forbids variables'], 'useState solves both problems.');
h('state', 'easy', 'What does useState return?', ['*An array: [currentValue, setterFunction]', 'Just the value', 'An object { value, set }', 'A Promise'], 'Destructure it: const [x, setX] = useState(0).');
h('state', 'easy', 'When is the initial value passed to useState used?', ['*Only on the first render', 'On every render', 'Whenever the setter is called', 'Never'], 'After that, React gives you the stored value.');
h('state', 'easy', 'What does calling a state setter do?', ['*Stores the new value and asks React to re-render', 'Immediately changes the variable in the current render', 'Reloads the page', 'Nothing until you call render()'], 'The new value appears in the next render.');
h('state', 'medium', 'Right after setCount(5), what does console.log(count) print in the same handler?', ['*The old value from this render', '5', 'undefined', 'An error'], 'State is a snapshot for each render.');
h('state', 'easy', 'Where are you allowed to call useState?', ['*At the top level of a component or custom Hook', 'Inside if statements', 'Inside loops', 'Inside event handlers'], 'Hooks must be called in the same order on every render.');
h('state', 'easy', 'Two <Counter /> elements are rendered side by side. How is their state related?', ['*Each one has its own independent state', 'They share one state', 'The second one has no state', 'It depends on the props'], 'State belongs to a component\'s position in the tree.');
h('state', 'easy', 'In React terms, what does "rendering" mean?', ['*React calling your component function', 'The browser painting pixels', 'Writing HTML files', 'Downloading JavaScript'], 'The commit step is what updates the DOM.');
h('state', 'medium', 'What happens during the commit phase?', ['*React applies the minimal necessary changes to the DOM', 'React calls every component again', 'React downloads data', 'React clears all state'], 'If nothing changed, React doesn\'t touch the DOM.');
h('state', 'medium', 'What is batching?', ['*React waits until the event handler finishes, then re-renders once with all the updates', 'React renders each setState immediately', 'Grouping components into folders', 'Combining CSS files'], 'Batching avoids half-updated screens and extra renders.');
h('state', 'easy', 'When should you use the updater form setX(prev => ...)?', ['*When the next value depends on the previous value', 'Never', 'Only for strings', 'Only inside Effects'], 'It\'s always safe for updates such as increments and toggles.');
h('state', 'easy', 'What is a "controlled" input?', ['*An input whose value comes from state and updates through onChange', 'An input with a ref', 'An input that is disabled', 'An input inside a form'], 'React is the single source of truth for its value.');
h('state', 'easy', 'What are the three steps of a React update, in order?', ['*Trigger → Render → Commit', 'Render → Trigger → Commit', 'Commit → Render → Trigger', 'Mount → Fetch → Paint'], 'Trigger (state changes), render (call components), commit (update the DOM).');
h('state', 'medium', 'Why should input values from number fields be converted with Number()?', ['*e.target.value is always a string', 'Numbers are not allowed in state', 'React requires it', 'To make the input controlled'], '\'5\' + 1 === \'51\', so convert first.');

// ---- Chapter 8: Objects & arrays in state ----
h('immutability', 'easy', 'What is "mutation"?', ['*Changing an existing object or array in place', 'Creating a new copy', 'Calling a setter', 'Re-rendering a component'], 'Treat state as read-only and replace it instead.');
h('immutability', 'easy', 'Which correctly updates only the name in a person object in state?', ['*setPerson({ ...person, name: \'Asha\' })', 'person.name = \'Asha\'; setPerson(person)', 'setPerson(person.name = \'Asha\')', 'setPerson({ name: \'Asha\' }) (when the other fields must be kept)'], 'Spread copies the old fields, then you override one.');
h('immutability', 'medium', 'How deep does the spread syntax copy?', ['*Only one level (a shallow copy)', 'All nested levels', 'Two levels', 'It doesn\'t copy at all'], 'Copy each nested level you change.');
h('immutability', 'easy', 'Which removes the item with a given id without mutating?', ['*items.filter(i => i.id !== id)', 'items.splice(index, 1)', 'delete items[index]', 'items.pop()'], 'filter returns a new array.');
h('immutability', 'medium', 'What is the bug in this code?', ['*The copy holds the same objects, so changing copy[0].done mutates the original todo', 'You cannot spread arrays', 'Arrays cannot be copied', 'There is no bug'], 'Spread is shallow, so create a new object for the item you change.', L('const copy = [...todos];', 'copy[0].done = true;', 'setTodos(copy);'));
h('immutability', 'easy', 'Which library lets you write mutation-style code that produces immutable updates?', ['*Immer', 'Axios', 'Lodash', 'jQuery'], 'Immer uses a draft object and makes the copies for you.');
h('immutability', 'medium', 'What does `[e.target.name]: e.target.value` inside an object literal do?', ['*Uses the input\'s name as a computed property key', 'Creates an array', 'Destructures the event', 'Is a syntax error'], 'It lets one handler update any field.');
h('immutability', 'medium', 'Why does React need a NEW object or array to notice a change?', ['*It compares the old and new state by reference (Object.is)', 'It deep-compares every field', 'It watches the object for mutations', 'It re-renders on every mutation automatically'], 'Same reference means "nothing changed".');
h('immutability', 'medium', 'How do you insert an item at position i without mutating?', ['*[...arr.slice(0, i), item, ...arr.slice(i)]', 'arr.splice(i, 0, item)', 'arr[i] = item', 'arr.push(item, i)'], 'slice returns copies of each part.');
h('immutability', 'easy', 'How should you update one item inside an array of objects?', ['*Use map() and return a new object for the matching item', 'Find it and change its property directly', 'Use splice() to replace it in place', 'Re-create the whole array by hand'], 'For example: todos.map(t => t.id === id ? { ...t, done: !t.done } : t).');

// ---- Chapter 9: Structuring & sharing state ----
h('structure', 'medium', 'Which are recommended principles for structuring state? (select all that apply)', ['*Group related state', '*Avoid contradictions', '*Avoid redundant state', 'Store every value you display'], 'Also: avoid duplication and avoid deep nesting.');
h('structure', 'easy', 'firstName and lastName are in state. How should you get fullName?', ['*Calculate it during render: const fullName = firstName + \' \' + lastName', 'Keep it in a third state variable', 'Update it in an Effect', 'Store it in a ref'], 'Don\'t store what you can calculate.');
h('structure', 'medium', 'What is the problem with useState(props.color)?', ['*The state won\'t update if the prop changes later', 'It is a syntax error', 'Props cannot be read inside useState', 'It causes an infinite loop'], 'Only copy a prop if you deliberately want to ignore later changes (call it initialColor).');
h('structure', 'easy', 'To remember which item is selected, what should you store?', ['*The selected item\'s ID', 'A copy of the selected item object', 'The index plus a copy', 'Nothing'], 'Look up the item from the ID during render so it is never stale.');
h('structure', 'easy', 'Instead of the booleans isSending and isSent, it is better to use…', ['*A single status variable: \'typing\' | \'sending\' | \'sent\'', 'Three more booleans', 'A ref', 'Context'], 'One status value can never contradict itself.');
h('structure', 'easy', 'What does "lifting state up" mean?', ['*Moving state to the closest common parent of the components that need it', 'Moving state into a child', 'Storing state in localStorage', 'Using a global variable'], 'Then pass the state down with props and handlers.');
h('structure', 'medium', 'What is a "controlled" component, in the sense used for lifting state?', ['*One whose important information is driven by props from its parent', 'One that uses refs', 'One with no props', 'One that is memoised'], 'Uncontrolled components keep that information in their own local state.');
h('structure', 'easy', 'What does "single source of truth" mean for state?', ['*Each unique piece of state lives in exactly one component', 'All state lives in App', 'State is stored on the server', 'Every component has a copy'], 'Other components receive it as props.');
h('structure', 'easy', 'Two sibling components need the same state. Where should it live?', ['*In their closest common parent', 'In the first sibling', 'In both siblings, kept in sync', 'In a ref'], 'Pass it down to both.');
h('structure', 'medium', 'What helps with deeply nested state that is painful to update?', ['*Flattening (normalising) it, with items referencing each other by ID', 'Nesting it even more', 'Copying it into refs', 'Using more Effects'], 'Flat structures are easier to update immutably.');

// ---- Chapter 10: Preserving state & reducers ----
h('preserving', 'easy', 'What is React state tied to?', ['*The component\'s position in the UI tree', 'The component\'s file name', 'The variable name', 'The props'], 'Same component, same position: same state.');
h('preserving', 'easy', 'How can you force a component to reset its state?', ['*Give it a different key', 'Change one of its props', 'Call forceUpdate()', 'Re-import it'], 'A new key means React treats it as a different component.');
h('preserving', 'easy', 'What is the signature of a reducer function?', ['*(state, action) => nextState', '(action) => void', '(state) => action', '(dispatch, state) => JSX'], 'Reducers calculate the next state from the current state and an action.');
h('preserving', 'easy', 'What does useReducer return?', ['*[state, dispatch]', '[state, setState]', '{ state, reducer }', 'dispatch only'], 'Call dispatch(action) to request a change.');
h('preserving', 'easy', 'What should an action describe?', ['*What happened (for example \'added\', \'deleted\')', 'How to change the DOM', 'Which component to re-render', 'The CSS to apply'], 'The reducer decides how state changes in response.');
h('preserving', 'easy', 'Which rule applies to reducers?', ['*They must be pure: no side effects or mutations', 'They must fetch data', 'They must call setState', 'They must return JSX'], 'Reducers run during rendering.');
h('preserving', 'medium', 'Why use a reducer? (select all that apply)', ['*It keeps all the update logic in one place', '*It is easy to test as a plain function', '*You can log every action for debugging', 'It always needs less code than useState'], 'Reducers trade a little more code for clarity in complex components.');
h('preserving', 'easy', 'Where does the name "reducer" come from?', ['*The array method reduce()', 'Redux only', 'It reduces bundle size', 'It reduces re-renders'], 'Both take "the result so far + the next item" and return a new result.');
h('preserving', 'medium', 'Where should you generate a random ID for a new item when using a reducer?', ['*In the event handler, before dispatching', 'Inside the reducer', 'In the component body during render', 'In the key prop'], 'Reducers must be pure, and random values are not.');
h('preserving', 'medium', 'A <Counter /> is hidden with style={{ display: \'none\' }}. What happens to its state?', ['*It is kept, because the component stays mounted', 'It is reset', 'React throws an error', 'It moves to the parent'], 'Only unmounting (removing it from the tree) destroys state.');

// ---- Chapter 11: Context ----
h('context', 'easy', 'What is "prop drilling"?', ['*Passing props through many components that don\'t use them', 'Testing props', 'Removing unused props', 'Passing props with spread'], 'Context solves it.');
h('context', 'easy', 'What are the three steps of using context?', ['*Create it, provide it, use it', 'Import, export, render', 'Mount, update, unmount', 'Fetch, cache, render'], 'createContext → <Ctx value> → useContext(Ctx).');
h('context', 'medium', 'Which of these provide a context value in React 19? (select all that apply)', ['*<ThemeContext value="dark">', '*<ThemeContext.Provider value="dark">', '<ThemeContext.Consumer value="dark">', '<Provider context={ThemeContext}>'], 'React 19 allows the shorter form. .Provider still works.');
h('context', 'easy', 'When is the default value from createContext(default) used?', ['*When there is no matching provider above the component', 'Always', 'Only on the first render', 'Never'], 'Providers override the default.');
h('context', 'easy', 'Nested providers give different values. Which one does a component read?', ['*The closest provider above it', 'The outermost provider', 'The first one rendered', 'A random one'], 'Context works like CSS inheritance.');
h('context', 'medium', 'Before reaching for context, what should you try? (select all that apply)', ['*Passing props', '*Passing JSX as children', 'Global variables', 'localStorage'], 'Context makes data flow less obvious.');
h('context', 'medium', 'Which are good uses for context? (select all that apply)', ['*The theme (light/dark)', '*The current logged-in user', '*The language or locale', 'The value of every input in a single form'], 'Context suits data that many distant components need.');
h('context', 'medium', 'What happens when a provider\'s value changes?', ['*Every component that reads that context re-renders', 'Nothing until you refresh', 'Only the provider re-renders', 'React throws an error'], 'Consumers always get the latest value.');
h('context', 'medium', 'Why wrap useContext(TasksContext) in a custom useTasks() Hook?', ['*It hides the details and gives components a clear, simple API', 'It is required by React', 'It makes context faster', 'It avoids re-renders'], 'You can also add helpful errors when the provider is missing.');
h('context', 'hard', 'Why put the data and dispatch into two separate contexts?', ['*Components that only dispatch don\'t need to read the data, and the separation keeps responsibilities clear', 'React requires one value per context', 'dispatch cannot be put in context with data', 'To avoid using reducers'], 'It\'s a common pattern for scaling up with a reducer and context.');

// ---- Chapter 12: Refs ----
h('refs', 'easy', 'What does useRef(0) return?', ['*An object { current: 0 }', 'The number 0', '[0, setRef]', 'A DOM element'], 'You read and write ref.current.');
h('refs', 'easy', 'What happens when you change ref.current?', ['*Nothing re-renders', 'The component re-renders', 'React throws an error', 'The page reloads'], 'That\'s the main difference from state.');
h('refs', 'easy', 'When should you use a ref instead of state?', ['*For values that are not shown on screen, such as timer IDs', 'For anything displayed in the UI', 'For props', 'For context values'], 'If it affects the render output, use state.');
h('refs', 'medium', 'Should you read or write ref.current during rendering?', ['*Avoid it; use refs in event handlers and Effects', 'Yes, always', 'Only write, never read', 'Only in StrictMode'], 'React doesn\'t know when refs change, so rendering would become unpredictable.');
h('refs', 'easy', 'How do you get the DOM node of an input?', ['*Create a ref and pass it: <input ref={inputRef} />', 'document.querySelector inside render', 'this.input', 'props.dom'], 'React sets inputRef.current to the element.');
h('refs', 'medium', 'When does React set inputRef.current to the DOM element?', ['*During the commit, after the element is created', 'Before rendering', 'When useRef is first called', 'Only after a click'], 'During the first render it is still null.');
h('refs', 'easy', 'How do you focus an input stored in inputRef?', ['*inputRef.current.focus()', 'inputRef.focus()', 'focus(inputRef)', 'inputRef.current = focus'], 'current is the real DOM element.');
h('refs', 'medium', 'In React 19, how does your own component accept a ref?', ['*As a normal prop named ref', 'It can\'t', 'Only with useImperativeHandle', 'Through context'], 'Older code used forwardRef.');
h('refs', 'medium', 'Which DOM operations through refs are safe? (select all that apply)', ['*Focusing an element', '*Scrolling an element into view', '*Measuring an element\'s size', 'Removing elements that React rendered'], 'Don\'t change the parts of the DOM that React manages.');
h('refs', 'hard', 'What does flushSync(() => setState(x)) do?', ['*Forces React to update the DOM synchronously before the next line runs', 'Delays the update', 'Cancels the update', 'Saves state to disk'], 'It\'s useful, for example, to scroll to a newly added item.');
h('refs', 'easy', 'Where should you store a setInterval ID so you can clear it later?', ['*In a ref', 'In state', 'In a local variable inside the component body', 'In context'], 'The ID is not displayed, and it must survive re-renders.');

// ---- Chapter 13: Effects ----
h('effects', 'easy', 'When do Effects run?', ['*After React commits the render to the screen', 'Before rendering', 'During rendering', 'Only on click'], 'That lets them reach the DOM and outside systems.');
h('effects', 'easy', 'An Effect with NO dependency array runs…', ['*After every render', 'Only once', 'Never', 'Only on unmount'], 'Add dependencies to control when it runs.');
h('effects', 'easy', 'An Effect with an empty array [] runs…', ['*Only after the first render (mount), in production', 'After every render', 'Never', 'Every second'], 'In development, StrictMode runs it twice to test the cleanup.');
h('effects', 'easy', 'What is the cleanup function?', ['*A function returned from the Effect, run before the Effect re-runs and on unmount', 'A function that deletes state', 'The second argument of useEffect', 'A garbage collector'], 'It should undo what the Effect set up.');
h('effects', 'medium', 'Why does an Effect run as setup → cleanup → setup in development?', ['*StrictMode re-mounts components to check that the cleanup works', 'There is a bug in React', 'Because of HMR', 'Because the dependency array is wrong'], 'Fix the cleanup rather than trying to prevent this.');
h('effects', 'medium', 'Which of these usually do NOT need an Effect? (select all that apply)', ['*Calculating values from props or state', '*Reacting to a button click', '*Resetting all state when a prop changes', 'Subscribing to a browser event'], 'Subscriptions to outside systems are what Effects are for.');
h('effects', 'medium', 'How do you avoid showing stale results when fetching in an Effect?', ['*Set an "ignore" flag in the cleanup and check it before setting state', 'Fetch twice', 'Use a longer timeout', 'Remove the dependency array'], 'The cleanup runs before the next fetch starts.');
h('effects', 'medium', 'Who decides an Effect\'s dependencies?', ['*Your code: every reactive value used inside must be listed', 'You can choose any values you like', 'React decides randomly', 'Only the parent component'], 'To remove a dependency, change the code so it isn\'t needed.');
h('effects', 'hard', 'What is useEffectEvent for?', ['*Reading the latest props or state inside an Effect without making them dependencies', 'Handling click events', 'Running Effects twice', 'Replacing useEffect entirely'], 'Use it only for logic called from inside Effects.');
h('effects', 'hard', 'An object is created in the component body and used as a dependency. What happens?', ['*The Effect re-runs after every render, because the object is new each time', 'The Effect runs only once', 'React deep-compares it', 'React throws an error'], 'Create the object inside the Effect, or depend on primitive values.');
h('effects', 'medium', 'What causes an infinite loop in this code?', ['*The Effect sets state on every render, which triggers another render', 'useEffect cannot set state', 'count is const', 'Nothing: it runs once'], 'Ask whether you really need an Effect here.', L('useEffect(() => {', '  setCount(count + 1);', '});'));
h('effects', 'medium', 'From the Effect\'s point of view, what are its two jobs?', ['*Start synchronising, and stop synchronising', 'Mount and update', 'Fetch and render', 'Create and delete state'], 'It may do this many times as the dependencies change.');
h('effects', 'medium', 'What is useMemo used for?', ['*Caching an expensive calculation between renders', 'Running side effects', 'Storing DOM refs', 'Creating context'], 'For example: useMemo(() => filterTodos(todos, tab), [todos, tab]).');

// ---- Chapter 14: Custom Hooks ----
h('hooks', 'easy', 'How must a custom Hook be named?', ['*useSomething (use + a capital letter)', 'SomethingHook', 'hookSomething', 'Any name'], 'The name tells React and the linter that the Rules of Hooks apply.');
h('hooks', 'easy', 'What do custom Hooks share between components?', ['*Logic, not state', 'State', 'DOM elements', 'Props'], 'Each call has its own independent state.');
h('hooks', 'medium', 'Two components call useOnlineStatus(). How many isOnline states exist?', ['*Two independent ones', 'One shared one', 'None', 'It depends on render order'], 'Each call is like calling useState separately.');
h('hooks', 'easy', 'A function named useFormat calls no Hooks. What should you do?', ['*Rename it to a normal name, such as formatX', 'Keep the name', 'Add a useState to it', 'Convert it into a component'], 'Only functions that call Hooks should start with use.');
h('hooks', 'easy', 'What can a custom Hook call? (select all that apply)', ['*useState', '*useEffect', '*Other custom Hooks', 'Nothing: Hooks cannot call Hooks'], 'Custom Hooks are built out of other Hooks.');
h('hooks', 'easy', 'When does the code inside a custom Hook run?', ['*On every render of the component that uses it', 'Only once', 'Only on mount', 'Only when its inputs change'], 'That\'s why it always sees the latest props and state.');
h('hooks', 'medium', 'Which are good reasons to write a custom Hook? (select all that apply)', ['*The same Effect logic is repeated in several components', '*To give a complicated Effect a clear, descriptive name', 'To wrap a plain calculation that uses no Hooks', 'To share one piece of state between unrelated components'], 'To share state itself, lift it up or use context.');
h('hooks', 'medium', 'What does useState(() => expensiveRead()) do?', ['*Runs expensiveRead only on the first render (lazy initial state)', 'Runs it on every render', 'Stores the function as state', 'Throws an error'], 'Pass a function, not its result.');
h('hooks', 'medium', 'Why do the docs discourage generic Hooks like useMount(fn)?', ['*They hide dependencies and don\'t describe a concrete purpose', 'They are slower', 'They are not allowed', 'They cannot use useEffect'], 'Prefer focused Hooks such as useChatRoom(roomId).');
h('hooks', 'easy', 'What can a custom Hook return?', ['*Any value: an array, an object, a function, a number…', 'Only JSX', 'Only an array of two items', 'Nothing'], 'Pick whatever shape is easiest to use.');

// ---- Chapter 15: Thinking in React ----
h('thinking', 'easy', 'What is the correct order of the "Thinking in React" steps?', ['*Break into components → static version → find minimal state → decide where it lives → add inverse data flow', 'Add state → write CSS → break into components → test', 'Static version → add Effects → break into components', 'Find state → write reducers → add context → build UI'], 'Building static first keeps typing separate from thinking.');
h('thinking', 'easy', 'What does the static version use?', ['*Only props (no state)', 'Only state', 'Effects', 'Context'], 'Interactivity comes later.');
h('thinking', 'medium', 'When is a piece of data NOT state? (select all that apply)', ['*It stays the same over time', '*It is passed in from a parent via props', '*It can be calculated from existing state or props', 'It changes when the user types'], 'What remains is the minimal state.');
h('thinking', 'easy', 'In the product table, is the filtered product list state?', ['*No: it is calculated from the products, the search text and the checkbox', 'Yes', 'Only if there are many products', 'It should be a ref'], 'Derived values are calculated during render.');
h('thinking', 'easy', 'Where should a piece of state live?', ['*In the closest common parent of all the components that use it', 'Always in App', 'In the deepest component', 'In context by default'], 'If there is no natural parent, create one.');
h('thinking', 'easy', 'What is "inverse data flow"?', ['*Children call handler props so that the parent can update its state', 'Data flowing from child state into the parent state automatically', 'Reversing an array', 'Rendering from bottom to top'], 'For example: onFilterTextChange={setFilterText}.');
h('thinking', 'easy', 'What is the single responsibility principle for components?', ['*Each component should ideally do one thing', 'Each app should have one component', 'Each component can have only one prop', 'Each file can have only one line'], 'Split a component when it grows too many jobs.');
h('thinking', 'medium', 'You give an input value={filterText} but no onChange. What happens when you type?', ['*Nothing changes: the input is controlled and its state never updates', 'It works normally', 'React crashes', 'The page reloads'], 'Add onChange to update the state.');
h('thinking', 'medium', 'In FilterableProductTable, which of these are state? (select all that apply)', ['*The search text', '*The "only in stock" checkbox', 'The original product list (a prop)', 'The filtered product list'], 'Only two pieces of state are needed.');
h('thinking', 'easy', 'What is one-way data flow?', ['*Data passes down from parent to child through props', 'Data passes up automatically', 'Data flows between siblings', 'Only one component may have data'], 'Inverse flow uses callbacks, not automatic syncing.');

const HAND = Q.length;

// =====================================================================
// TEMPLATE GENERATORS
// =====================================================================
const T = {};

T['js-map'] = () => {
  const arr = Array.from({ length: ri(3, 4) }, () => ri(1, 9));
  const k = ri(2, 5);
  const op = pick([
    { src: `x => x * ${k}`, f: (x) => x * k },
    { src: `x => x + ${k}`, f: (x) => x + k },
    { src: `x => x - ${k}`, f: (x) => x - k },
    { src: 'x => x * x', f: (x) => x * x },
    { src: 'x => x % 2 === 0', f: (x) => x % 2 === 0 },
    { src: "x => 'item' + x", f: (x) => 'item' + x },
  ]);
  const res = arr.map(op.f);
  return single('js', 'easy', 'What does this code log?', L(`const nums = ${fmt(arr)};`, `console.log(nums.map(${op.src}));`),
    fmt(res), [fmt(arr), fmt([...res].reverse()), fmt(res.slice(0, -1)), fmt(arr.filter((x) => op.f(x))), 'undefined'],
    'map() calls the function on every item and returns a NEW array of the results, the same length as the original.', 'js-map');
};

T['js-filter'] = () => {
  const arr = Array.from({ length: 5 }, () => ri(1, 12));
  const n = ri(3, 8);
  const p = pick([
    { src: `x => x > ${n}`, f: (x) => x > n },
    { src: `x => x <= ${n}`, f: (x) => x <= n },
    { src: 'x => x % 2 === 0', f: (x) => x % 2 === 0 },
    { src: 'x => x % 2 !== 0', f: (x) => x % 2 !== 0 },
  ]);
  const res = arr.filter(p.f);
  const first = arr.find(p.f);
  return single('js', 'easy', 'What does this code log?', L(`const nums = ${fmt(arr)};`, `console.log(nums.filter(${p.src}));`),
    fmt(res), [fmt(arr.filter((x) => !p.f(x))), fmt(arr), first !== undefined ? fmt([first]) : '[0]', String(res.length), fmt(arr.map(p.f))],
    'filter() returns a new array with only the items for which the function returns true.', 'js-filter');
};

T['js-reduce'] = () => {
  const arr = Array.from({ length: ri(3, 5) }, () => ri(1, 9));
  const kind = pick(['sum', 'sum-init', 'max', 'count-even']);
  let code, res, wrongs, expl;
  if (kind === 'sum' || kind === 'sum-init') {
    const init = kind === 'sum' ? 0 : ri(5, 20);
    const sum = arr.reduce((a, x) => a + x, 0);
    res = sum + init;
    code = L(`const nums = ${fmt(arr)};`, `console.log(nums.reduce((total, x) => total + x, ${init}));`);
    wrongs = [String(sum + init + arr.length), String(sum === res ? sum + 1 : sum), String(arr[arr.length - 1] + init), `'${arr.join('')}'`];
    expl = `reduce starts with ${init} and adds each item: ${init} + ${arr.join(' + ')} = ${res}.`;
  } else if (kind === 'max') {
    res = arr.reduce((m, x) => Math.max(m, x), 0);
    code = L(`const nums = ${fmt(arr)};`, 'console.log(nums.reduce((max, x) => Math.max(max, x), 0));');
    wrongs = [String(Math.min(...arr)), String(arr.reduce((a, x) => a + x, 0)), String(arr[arr.length - 1] === res ? arr[0] : arr[arr.length - 1]), '0'];
    expl = 'Each step keeps the larger of the running max and the current item.';
  } else {
    res = arr.reduce((c, x) => (x % 2 === 0 ? c + 1 : c), 0);
    code = L(`const nums = ${fmt(arr)};`, 'console.log(nums.reduce((count, x) => x % 2 === 0 ? count + 1 : count, 0));');
    wrongs = [String(arr.length - res), String(arr.length), String(res + 1), fmt(arr.filter((x) => x % 2 === 0))];
    expl = 'It counts the even numbers by adding 1 for each one.';
  }
  return single('js', 'medium', 'What does this code log?', code, String(res), wrongs, expl, 'js-reduce');
};

T['js-find'] = () => {
  const arr = shuffle([...new Set(Array.from({ length: 6 }, () => ri(1, 15)))]).slice(0, 5);
  const n = ri(4, 16);
  const method = pick(['find', 'findIndex']);
  const res = method === 'find' ? arr.find((x) => x > n) : arr.findIndex((x) => x > n);
  const matches = arr.filter((x) => x > n);
  return single('js', 'medium', 'What does this code log?', L(`const nums = ${fmt(arr)};`, `console.log(nums.${method}(x => x > ${n}));`),
    fmt(res), [fmt(matches), method === 'find' ? String(arr.findIndex((x) => x > n)) : fmt(arr.find((x) => x > n)), 'true', method === 'find' ? 'null' : '0', 'undefined'],
    method === 'find' ? 'find() returns the FIRST item that matches, or undefined if none do.' : 'findIndex() returns the index of the first match, or -1 if none match.', 'js-find');
};

T['js-some-every'] = () => {
  const arr = Array.from({ length: 4 }, () => ri(1, 10));
  const n = ri(2, 9);
  const method = pick(['some', 'every']);
  const res = arr[method]((x) => x > n);
  return single('js', 'easy', 'What does this code log?', L(`const nums = ${fmt(arr)};`, `console.log(nums.${method}(x => x > ${n}));`),
    String(res), [String(!res), fmt(arr.filter((x) => x > n)), 'undefined'],
    method === 'some' ? 'some() is true if AT LEAST ONE item passes the test.' : 'every() is true only if ALL items pass the test.', 'js-some-every');
};

T['js-index-includes'] = () => {
  const pool = ['apple', 'banana', 'cherry', 'mango', 'kiwi', 'grape', 'pear'];
  const arr = sample(pool, 4);
  const target = rand() < 0.7 ? pick(arr) : pick(pool.filter((f) => !arr.includes(f)));
  const method = pick(['indexOf', 'includes']);
  const res = arr[method](target);
  const wrongs = method === 'indexOf'
    ? [String(res + 1), String(res === -1 ? 0 : -1), 'true', 'undefined']
    : [String(!res), String(arr.indexOf(target)), 'undefined'];
  return single('js', 'easy', 'What does this code log?', L(`const fruits = ${fmt(arr)};`, `console.log(fruits.${method}('${target}'));`),
    String(res), wrongs, method === 'indexOf' ? 'indexOf returns the position (starting at 0), or -1 if the value is not found.' : 'includes returns true or false.', 'js-index-includes');
};

T['js-destructure-default'] = () => {
  const key = pick(['size', 'theme', 'lang', 'limit', 'color']);
  const def = pick(["'medium'", '10', "'en'", "'blue'"]);
  const defVal = eval(def);
  const variant = pick(['missing', 'undefined', 'null', 'zero', 'empty', 'value']);
  const valMap = { undefined: 'undefined', null: 'null', zero: '0', empty: "''", value: "'custom'" };
  const objSrc = variant === 'missing' ? '{ id: 1 }' : `{ id: 1, ${key}: ${valMap[variant]} }`;
  const obj = eval('(' + objSrc + ')');
  const { [key]: res = defVal } = obj;
  return single('js', 'medium', `What is the value of ${key}?`, L(`const options = ${objSrc};`, `const { ${key} = ${def} } = options;`, `console.log(${key});`),
    fmt(res), [fmt(defVal), 'undefined', 'null', "'custom'", '0', 'An error is thrown'],
    'A destructuring default is used only when the value is missing or undefined. It is NOT used for null, 0 or empty strings.', 'js-destructure-default');
};

T['js-destructure-rename'] = () => {
  const key = pick(['city', 'title', 'price', 'score']);
  const alias = pick(['town', 'label', 'amount', 'points']);
  const val = pick(["'Pune'", "'Hello'", '499', '42']);
  const askAlias = rand() < 0.6;
  const code = L(`const data = { ${key}: ${val} };`, `const { ${key}: ${alias} } = data;`, `console.log(${askAlias ? alias : key});`);
  const correct = askAlias ? fmt(eval(val)) : `ReferenceError: ${key} is not defined`;
  return single('js', 'hard', 'What happens when this code runs?', code, correct,
    [fmt(eval(val)), 'undefined', `'${key}'`, `ReferenceError: ${alias} is not defined`, `ReferenceError: ${key} is not defined`],
    `{ ${key}: ${alias} } reads data.${key} into a NEW variable called ${alias}. No variable named ${key} is created.`, 'js-destructure-rename');
};

T['js-array-destructure'] = () => {
  const pool = ['red', 'green', 'blue', 'cyan', 'pink', 'gold'];
  const arr = sample(pool, ri(3, 4));
  const kind = pick(['skip', 'rest', 'default', 'swap']);
  if (kind === 'skip') {
    const [, , c] = arr;
    return single('js', 'easy', 'What does this code log?', L(`const colors = ${fmt(arr)};`, 'const [a, , c] = colors;', 'console.log(c);'),
      fmt(c), [fmt(arr[1]), fmt(arr[0]), 'undefined', fmt(arr[arr.length - 1])], 'Empty slots between commas skip items: c gets the item at index 2.', 'js-array-destructure');
  }
  if (kind === 'rest') {
    const [, ...rest] = arr;
    return single('js', 'medium', 'What does this code log?', L(`const colors = ${fmt(arr)};`, 'const [first, ...rest] = colors;', 'console.log(rest);'),
      fmt(rest), [fmt(arr), fmt(arr.slice(0, -1)), fmt(arr[1]), fmt([arr[0]])], 'The rest element collects all the remaining items into a new array.', 'js-array-destructure');
  }
  if (kind === 'default') {
    const short = arr.slice(0, 1);
    return single('js', 'medium', 'What does this code log?', L(`const colors = ${fmt(short)};`, "const [main, accent = 'black'] = colors;", 'console.log(accent);'),
      "'black'", ['undefined', fmt(short[0]), 'null', 'An error is thrown'], 'There is no second item, so the default \'black\' is used.', 'js-array-destructure');
  }
  const a = ri(1, 9); let b = ri(1, 9); if (b === a) b = a + 1;
  return single('js', 'medium', 'What does this code log?', L(`let a = ${a};`, `let b = ${b};`, '[a, b] = [b, a];', 'console.log(a, b);'),
    `${b} ${a}`, [`${a} ${b}`, `${b} ${b}`, `${a} ${a}`, 'An error is thrown'], 'Array destructuring swaps the two values in one line.', 'js-array-destructure');
};

T['js-spread-merge'] = () => {
  const keys = sample(['theme', 'size', 'lang', 'color', 'mode', 'speed'], 3);
  const vals = sample(['dark', 'light', 'en', 'hi', 'fast', 'slow', 'big', 'small'], 4);
  const o1 = { [keys[0]]: vals[0], [keys[1]]: vals[1] };
  const o2 = { [keys[1]]: vals[2], [keys[2]]: vals[3] };
  const order = pick(['12', '21', 'override']);
  let expr, r;
  if (order === '12') { expr = '{ ...defaults, ...user }'; r = { ...o1, ...o2 }; }
  else if (order === '21') { expr = '{ ...user, ...defaults }'; r = { ...o2, ...o1 }; }
  else { expr = `{ ...defaults, ${keys[1]}: 'custom' }`; r = { ...o1, [keys[1]]: 'custom' }; }
  const ask = pick(['key', 'count']);
  const code = L(`const defaults = ${fmt(o1)};`, `const user = ${fmt(o2)};`, `const merged = ${expr};`, ask === 'key' ? `console.log(merged.${keys[1]});` : 'console.log(Object.keys(merged).length);');
  if (ask === 'key') {
    return single('js', 'medium', 'What does this code log?', code, fmt(r[keys[1]]), [fmt(vals[1]), fmt(vals[2]), "'custom'", 'undefined'],
      'With spread, LATER properties overwrite earlier ones that have the same key.', 'js-spread-merge');
  }
  const n = Object.keys(r).length;
  return single('js', 'medium', 'What does this code log?', code, String(n), [String(n + 1), String(n - 1), '4'], 'Keys that appear in both objects are only counted once in the merged object.', 'js-spread-merge');
};

T['js-nullish-or'] = () => {
  const vals = [0, '', null, undefined, false, 'Asha', 7, NaN];
  const v = pick(vals);
  const op = pick(['??', '||', '&&']);
  const d = "'fallback'";
  const res = op === '??' ? (v ?? 'fallback') : op === '||' ? (v || 'fallback') : (v && 'fallback');
  return single('js', 'medium', 'What does this code log?', L(`const value = ${fmt(v)};`, `console.log(value ${op} ${d});`),
    fmt(res), [fmt(v), "'fallback'", 'true', 'false', 'undefined', 'null'],
    '?? falls back only for null/undefined. || falls back for any falsy value. && returns the left side if it is falsy, otherwise the right side.', 'js-nullish-or');
};

T['js-optional-chaining'] = () => {
  const city = pick(['Pune', 'Delhi', 'Leeds', 'Austin']);
  const users = [
    { src: `{ profile: { city: '${city}' } }`, v: { profile: { city } } },
    { src: '{ profile: null }', v: { profile: null } },
    { src: '{}', v: {} },
    { src: 'null', v: null },
  ];
  const u = pick(users);
  const kind = pick(['chain', 'chain-default', 'no-chain']);
  let expr, res;
  if (kind === 'chain') { expr = 'user?.profile?.city'; res = fmt(u.v?.profile?.city); }
  else if (kind === 'chain-default') { expr = "user?.profile?.city ?? 'Unknown'"; res = fmt(u.v?.profile?.city ?? 'Unknown'); }
  else {
    expr = 'user.profile.city';
    try { res = fmt(u.v.profile.city); } catch { res = 'A TypeError is thrown'; }
  }
  return single('js', 'medium', 'What happens when this code runs?', L(`const user = ${u.src};`, `console.log(${expr});`),
    res, [`'${city}'`, 'undefined', "'Unknown'", 'A TypeError is thrown', 'null'],
    '?. stops and returns undefined when the left side is null or undefined. Without it, reading a property of null or undefined throws a TypeError.', 'js-optional-chaining');
};

T['js-template'] = () => {
  const a = ri(2, 9), b = ri(2, 9);
  const kind = pick(['sum', 'name', 'ternary']);
  if (kind === 'sum') {
    return single('js', 'easy', 'What does this code log?', L(`const a = ${a};`, `const b = ${b};`, 'console.log(`${a} + ${b} = ${a + b}`);'),
      `'${a} + ${b} = ${a + b}'`, [`'${a} + ${b} = ${a}${b}'`, "'${a} + ${b} = ${a + b}'", `'a + b = ${a + b}'`, `'${a + b} = ${a + b}'`],
      'Inside ${...}, the expression is evaluated, so a + b is added as numbers.', 'js-template');
  }
  if (kind === 'name') {
    const name = pick(['asha', 'ben', 'chen', 'divya']);
    return single('js', 'easy', 'What does this code log?', L(`const name = '${name}';`, 'console.log(`Hello, ${name.toUpperCase()}!`);'),
      `'Hello, ${name.toUpperCase()}!'`, [`'Hello, ${name}!'`, "'Hello, ${name.toUpperCase()}!'", `'Hello, name.toUpperCase()!'`, 'An error is thrown'],
      'Any expression, including method calls, can go inside ${...}.', 'js-template');
  }
  const n = ri(0, 3);
  return single('js', 'medium', 'What does this code log?', L(`const n = ${n};`, "console.log(`${n} item${n === 1 ? '' : 's'}`);"),
    `'${n} item${n === 1 ? '' : 's'}'`, [`'${n} items'`, `'${n} item'`, `'${n} item${n === 1 ? 's' : ''}'`, "'n items'"],
    'A ternary inside ${...} is a common way to pluralise words.', 'js-template');
};

T['js-falsy-multi'] = () => {
  const pool = [
    { text: '0', ok: true }, { text: "'' (empty string)", ok: true }, { text: 'null', ok: true }, { text: 'undefined', ok: true },
    { text: 'NaN', ok: true }, { text: 'false', ok: true }, { text: "'0' (a string)", ok: false }, { text: "'false' (a string)", ok: false },
    { text: '[] (empty array)', ok: false }, { text: '{} (empty object)', ok: false }, { text: '-1', ok: false }, { text: "' ' (a space)", ok: false },
  ];
  return multi('js', 'medium', 'Which of these values are falsy? (select all that apply)', null, sample(pool, 5),
    'The falsy values are false, 0, -0, 0n, \'\', null, undefined and NaN. Everything else, including [] and {}, is truthy.', 'js-falsy-multi');
};

T['js-mutating-multi'] = () => {
  const methods = [
    ['push', 'm'], ['pop', 'm'], ['shift', 'm'], ['unshift', 'm'], ['splice', 'm'], ['sort', 'm'], ['reverse', 'm'], ['fill', 'm'],
    ['map', 'n'], ['filter', 'n'], ['slice', 'n'], ['concat', 'n'], ['toSorted', 'n'], ['toReversed', 'n'], ['toSpliced', 'n'],
  ];
  const ask = pick(['mutate', 'new']);
  const items = sample(methods, 5).map(([m, kind]) => ({ text: m + '()', ok: ask === 'mutate' ? kind === 'm' : kind === 'n' }));
  return multi('immutability', 'medium',
    ask === 'mutate' ? 'Which of these array methods CHANGE (mutate) the original array? (select all that apply)' : 'Which of these array methods return a NEW array and leave the original unchanged? (select all that apply)',
    null, items, 'Mutating: push, pop, shift, unshift, splice, sort, reverse, fill. Non-mutating: map, filter, slice, concat, toSorted, toReversed, toSpliced.', 'js-mutating-multi');
};

T['js-typeof'] = () => {
  const vals = [['[]', 'object'], ['null', 'object'], ['{}', 'object'], ['() => {}', 'function'], ["'hi'", 'string'], ['42', 'number'],
    ['NaN', 'number'], ['undefined', 'undefined'], ['true', 'boolean'], ['new Date()', 'object'], ['Symbol()', 'symbol']];
  const [src, res] = pick(vals);
  const all = ['object', 'function', 'string', 'number', 'undefined', 'boolean', 'array', 'null'];
  return single('js', res === 'object' && src !== '{}' ? 'hard' : 'easy', 'What does this code log?', `console.log(typeof ${src});`,
    `'${res}'`, all.filter((x) => x !== res).map((x) => `'${x}'`),
    'Watch out: typeof [] and typeof null are both "object", and typeof NaN is "number". Use Array.isArray() to check for arrays.', 'js-typeof');
};

T['js-equality'] = () => {
  const cases = [
    ['[1, 2] === [1, 2]', false], ['({ a: 1 }) === ({ a: 1 })', false], ["'5' === 5", false], ["'5' == 5", true],
    ['null == undefined', true], ['null === undefined', false], ['NaN === NaN', false], ['0 === -0', true],
  ];
  const [expr, res] = pick(cases);
  return single('js', 'medium', 'What does this code log?', `console.log(${expr});`, String(res), [String(!res), 'undefined', 'A TypeError is thrown'],
    'Objects and arrays compare by reference. == converts types, but === does not. NaN is never equal to anything, including itself.', 'js-equality');
};

T['js-equality-ref'] = () => {
  const kind = pick(['same', 'spread', 'mutated']);
  const code = kind === 'same'
    ? L('const a = { count: 1 };', 'const b = a;', 'b.count = 2;', 'console.log(a.count, a === b);')
    : kind === 'spread'
      ? L('const a = { count: 1 };', 'const b = { ...a };', 'b.count = 2;', 'console.log(a.count, a === b);')
      : L('const list = [1, 2];', 'const next = list;', 'next.push(3);', 'console.log(list.length, list === next);');
  const res = kind === 'same' ? '2 true' : kind === 'spread' ? '1 false' : '3 true';
  return single('immutability', 'hard', 'What does this code log?', code, res, ['1 true', '2 false', '1 false', '2 true', '3 true', '2 true'].filter((x) => x !== res),
    'Assigning an object to another variable does not copy it: both names point to the same object. Spread makes a new object.', 'js-equality-ref');
};

T['js-slice'] = () => {
  const arr = sample(['a', 'b', 'c', 'd', 'e', 'f'], 5);
  const kind = pick(['range', 'from', 'neg']);
  let call, res;
  if (kind === 'range') { const i = ri(0, 2), j = ri(i + 1, 4); call = `slice(${i}, ${j})`; res = arr.slice(i, j); }
  else if (kind === 'from') { const i = ri(1, 3); call = `slice(${i})`; res = arr.slice(i); }
  else { const i = ri(1, 3); call = `slice(-${i})`; res = arr.slice(-i); }
  return single('js', 'medium', 'What does this code log?', L(`const letters = ${fmt(arr)};`, `console.log(letters.${call});`),
    fmt(res), [fmt(arr), fmt(res.slice(1)), fmt(arr.slice(0, res.length)), fmt([...res, 'x'].slice(0, res.length + 1).filter((x) => x !== 'x').concat(arr.filter((x) => !res.includes(x)).slice(0, 1)))],
    'slice(start, end) copies from start up to (but NOT including) end. Negative numbers count from the end.', 'js-slice');
};

T['js-sort'] = () => {
  const nums = shuffle([ri(1, 9), ri(10, 30), ri(2, 9), ri(31, 99), ri(100, 120)]);
  const kind = pick(['default', 'asc', 'desc']);
  const call = kind === 'default' ? 'toSorted()' : kind === 'asc' ? 'toSorted((a, b) => a - b)' : 'toSorted((a, b) => b - a)';
  const res = kind === 'default' ? nums.toSorted() : kind === 'asc' ? nums.toSorted((a, b) => a - b) : nums.toSorted((a, b) => b - a);
  return single('js', kind === 'default' ? 'hard' : 'medium', 'What does this code log?', L(`const nums = ${fmt(nums)};`, `console.log(nums.${call});`),
    fmt(res), [fmt(nums.toSorted((a, b) => a - b)), fmt(nums.toSorted((a, b) => b - a)), fmt(nums), fmt(nums.toSorted())],
    'Without a compare function, sort/toSorted compares items as STRINGS, so 100 comes before 9. Use (a, b) => a - b for numbers.', 'js-sort');
};

T['js-object-keys'] = () => {
  const keys = sample(['name', 'age', 'city', 'role', 'email'], ri(2, 4));
  const obj = Object.fromEntries(keys.map((k, i) => [k, i + 1]));
  const kind = pick(['keys', 'values', 'entries']);
  const res = kind === 'keys' ? Object.keys(obj) : kind === 'values' ? Object.values(obj) : Object.entries(obj)[0];
  return single('js', 'easy', 'What does this code log?', L(`const user = ${fmt(obj)};`, kind === 'entries' ? 'console.log(Object.entries(user)[0]);' : `console.log(Object.${kind}(user));`),
    fmt(res), [fmt(Object.keys(obj)), fmt(Object.values(obj)), fmt(Object.entries(obj)[0]), String(keys.length), fmt([keys[0]])],
    'Object.keys gives the keys, Object.values gives the values, and Object.entries gives [key, value] pairs.', 'js-object-keys');
};

T['js-closure-loop'] = () => {
  const n = ri(2, 5);
  const kw = pick(['var', 'let']);
  const res = kw === 'var' ? Array(n).fill(n).join(' ') : [...Array(n).keys()].join(' ');
  return single('js', 'hard', 'Which numbers are logged, in order?', L(`for (${kw} i = 0; i < ${n}; i++) {`, '  setTimeout(() => console.log(i));', '}'),
    res, [Array(n).fill(n).join(' '), [...Array(n).keys()].join(' '), [...Array(n).keys()].map((x) => x + 1).join(' '), Array(n).fill(n - 1).join(' ')],
    'let creates a new i for each loop iteration, and each callback closes over its own copy. var shares ONE i, which is already ' + n + ' when the timers run.', 'js-closure-loop');
};

// ---------------- React templates ----------------
T['react-and-render'] = () => {
  const name = pick(['count', 'unread', 'total', 'score', 'items']);
  const vals = [[0, 'The text "0"'], [5, '<b>New!</b>'], ['', 'Nothing'], ["'Asha'", '<b>New!</b>'], [null, 'Nothing'], [false, 'Nothing'], [true, '<b>New!</b>'], [undefined, 'Nothing']];
  const [v, res] = pick(vals);
  const src = typeof v === 'string' && v.startsWith("'") ? v : fmt(v);
  const style = pick(['and', 'gt']);
  if (style === 'gt' && typeof v === 'number') {
    const ok = v > 0 ? '<b>New!</b>' : 'Nothing';
    return single('lists', 'medium', 'What does the <div> contain?', L(`const ${name} = ${src};`, `return <div>{${name} > 0 && <b>New!</b>}</div>;`),
      ok, ['Nothing', 'The text "0"', '<b>New!</b>', 'The text "false"'], 'The left side is now a true/false value, so a stray "0" can never appear.', 'react-and-render');
  }
  return single('lists', 'medium', 'What does the <div> contain?', L(`const ${name} = ${src};`, `return <div>{${name} && <b>New!</b>}</div>;`),
    res, ['Nothing', 'The text "0"', '<b>New!</b>', 'The text "false"', 'The text "null"'],
    'x && y gives x when x is falsy. React renders nothing for false, null, undefined, true and \'\', but it DOES render the number 0.', 'react-and-render');
};

T['react-state-queue'] = () => {
  const n0 = ri(0, 5);
  const ops = Array.from({ length: ri(2, 4) }, () => {
    const t = pick(['replace', 'updater', 'updater', 'set']);
    const a = ri(1, 5);
    return t === 'replace' ? { t, a, src: `setNumber(number + ${a});` } : t === 'updater' ? { t, a, src: `setNumber(n => n + ${a});` } : { t, a: a * 10, src: `setNumber(${a * 10});` };
  });
  if (!ops.some((o) => o.t === 'updater') && !ops.some((o) => o.t === 'replace')) return false;
  let cur = n0;
  for (const o of ops) cur = o.t === 'replace' ? n0 + o.a : o.t === 'updater' ? cur + o.a : o.a;
  const naive = ops.reduce((s, o) => (o.t === 'set' ? o.a : s + o.a), n0);
  const lastOnly = (() => { const o = ops[ops.length - 1]; return o.t === 'set' ? o.a : n0 + o.a; })();
  return single('state', 'hard', `number is ${n0}. After ONE click, what is number on the next render?`,
    L('<button onClick={() => {', ...ops.map((o) => '  ' + o.src), '}}>Click</button>'),
    String(cur), [String(naive), String(lastOnly), String(n0), String(cur + 1), String(n0 + 1)],
    'React queues the updates. setNumber(number + a) replaces the value using the snapshot (' + n0 + '), setNumber(n => n + a) builds on the result of the previous update in the queue, and setNumber(x) replaces it with x.', 'react-state-queue');
};

T['react-snapshot'] = () => {
  const n = ri(0, 9), a = ri(1, 5);
  const kind = pick(['alert', 'timeout', 'log-updater', 'screen']);
  const lines = {
    alert: ['function handleClick() {', `  setCount(count + ${a});`, '  alert(count);', '}'],
    timeout: ['function handleClick() {', `  setCount(count + ${a});`, '  setTimeout(() => alert(count), 3000);', '}'],
    'log-updater': ['function handleClick() {', `  setCount(c => c + ${a});`, '  console.log(count);', '}'],
    screen: ['function handleClick() {', `  setCount(count + ${a});`, '}', '// ...', 'return <h1>{count}</h1>;'],
  }[kind];
  const correct = kind === 'screen' ? String(n + a) : String(n);
  const q = kind === 'screen' ? `count is ${n}. After one click, what does the <h1> show?` : `count is ${n}. What is ${kind === 'log-updater' ? 'logged' : 'alerted'} after one click?`;
  return single('state', 'medium', q, L(`const [count, setCount] = useState(${n});`, ...lines), correct, [String(n + a), String(n), 'undefined', String(a), String(n + 2 * a)],
    'State is a snapshot: the count variable never changes during a render. The new value appears on the NEXT render.', 'react-snapshot');
};

T['react-batching'] = () => {
  const names = sample(['Name', 'Email', 'Age', 'City', 'Status', 'Error'], ri(2, 4));
  const k = names.length;
  return single('state', 'medium', 'How many re-renders does ONE click cause?', L('function handleClick() {', ...names.map((n, i) => `  set${n}(${pick(["'x'", '1', 'true', 'null'])});`), '}'),
    '1', [String(k), String(k + 1), '0'], 'React batches all the state updates in one event handler into a single re-render.', 'react-batching');
};

T['react-reducer-seq'] = () => {
  const start = ri(0, 5);
  const acts = Array.from({ length: ri(3, 5) }, () => pick(['increment', 'increment', 'decrement', 'reset', 'add']));
  const amounts = acts.map(() => ri(2, 6));
  let s = start;
  acts.forEach((a, i) => { s = a === 'increment' ? s + 1 : a === 'decrement' ? s - 1 : a === 'reset' ? 0 : s + amounts[i]; });
  let noReset = start;
  acts.forEach((a, i) => { noReset = a === 'increment' ? noReset + 1 : a === 'decrement' ? noReset - 1 : a === 'reset' ? noReset : noReset + amounts[i]; });
  const dispatches = acts.map((a, i) => (a === 'add' ? `dispatch({ type: 'add', amount: ${amounts[i]} });` : `dispatch({ type: '${a}' });`));
  return single('preserving', 'medium', `Starting from ${start}, what is the state after these dispatches?`,
    L('function reducer(count, action) {', '  switch (action.type) {', "    case 'increment': return count + 1;", "    case 'decrement': return count - 1;", "    case 'reset': return 0;", "    case 'add': return count + action.amount;", '  }', '}', '', ...dispatches),
    String(s), [String(noReset), String(s + 1), String(s - 1), String(start), String(acts.length)],
    'Apply each action in order; the reducer returns the next state each time.', 'react-reducer-seq');
};

T['react-bubbling'] = () => {
  const chain = sample(['page', 'card', 'toolbar', 'panel', 'row', 'menu'], ri(2, 3)).concat(['button']);
  const stopAt = rand() < 0.5 ? -1 : ri(1, chain.length - 1); // index from the outside; -1 = none
  const lines = [];
  chain.forEach((name, i) => {
    const pad = '  '.repeat(i);
    const tag = name === 'button' ? 'button' : 'div';
    const stop = i === stopAt ? 'e.stopPropagation(); ' : '';
    const handler = stop ? `{e => { ${stop}console.log('${name}'); }}` : `{() => console.log('${name}')}`;
    lines.push(tag === 'button' ? `${pad}<button onClick=${handler}>Click</button>` : `${pad}<${tag} onClick=${handler}>`);
  });
  for (let i = chain.length - 2; i >= 0; i--) lines.push('  '.repeat(i) + '</div>');
  const inner = [...chain].reverse();
  const logged = stopAt === -1 ? inner : inner.slice(0, chain.length - stopAt);
  const fmtSeq = (s) => s.join(' → ');
  return single('events', 'medium', 'You click the button. What is logged, in order?', L(...lines),
    fmtSeq(logged), [fmtSeq(inner), fmtSeq([...logged].reverse()), fmtSeq(['button']), fmtSeq(chain), fmtSeq(inner.slice(0, 2))],
    'Clicks bubble from the clicked element up through its parents. e.stopPropagation() stops the event after the current handler.', 'react-bubbling');
};

T['react-effect-runs'] = () => {
  const rooms = ['general', 'travel', 'music', 'random'];
  const seq = [pick(rooms)];
  for (let i = 0; i < ri(3, 5); i++) seq.push(rand() < 0.5 ? seq[seq.length - 1] : pick(rooms));
  const changes = seq.slice(1).filter((v, i) => v !== seq[i]).length;
  const deps = pick(['none', 'empty', 'room']);
  const depSrc = deps === 'none' ? '' : deps === 'empty' ? ', []' : ', [roomId]';
  const ask = pick(['runs', 'cleanups']);
  let res;
  if (ask === 'runs') res = deps === 'none' ? seq.length : deps === 'empty' ? 1 : 1 + changes;
  else res = deps === 'none' ? seq.length : deps === 'empty' ? 1 : changes + 1;
  return single('effects', 'hard',
    ask === 'runs'
      ? `The component renders ${seq.length} times with roomId = ${seq.map((s) => `'${s}'`).join(', ')}. In production (no StrictMode), how many times does the Effect's setup run?`
      : `The component renders ${seq.length} times with roomId = ${seq.map((s) => `'${s}'`).join(', ')} and is then removed from the screen. How many times does the cleanup run in total?`,
    L('useEffect(() => {', '  const conn = connect(roomId);', '  return () => conn.disconnect();', `}${depSrc});`),
    String(res), [String(seq.length), '1', String(changes), String(changes + 2), String(seq.length + 1), '0'],
    'No array: after every render. []: only after the first render. [roomId]: the first render plus every render where roomId changed. The cleanup runs before each re-run and once more on unmount.', 'react-effect-runs');
};

T['react-preserve'] = () => {
  const C = pick(['Counter', 'Timer', 'Editor', 'Scoreboard', 'Form']);
  const D = pick(['Profile', 'Chat', 'Panel'].filter((x) => x !== C));
  const k1 = pick(['Taylor', 'Sarah', 'a', 'home']);
  const k2 = pick(['Ben', 'Chen', 'b', 'work'].filter((x) => x !== k1));
  const cases = [
    [`{flag ? <${C} color="red" /> : <${C} color="blue" />}`, true, 'Same component type at the same position, so the state is kept; only the props changed.'],
    [`{flag ? <${C} /> : <p>Paused</p>}`, false, `<${C}> is replaced by a <p>, so it unmounts and its state is destroyed.`],
    [`{flag ? <div><${C} /></div> : <section><${C} /></section>}`, false, 'The parent element type changed (div → section), so the whole subtree is reset.'],
    [`{flag ? <${C} key="${k1}" /> : <${C} key="${k2}" />}`, false, 'Different keys tell React these are different components.'],
    [`{flag ? <${C} key="${k1}" /> : <${C} key="${k1}" />}`, true, 'Same type, same position, same key: React sees the same component.'],
    [`<div style={{ display: flag ? 'block' : 'none' }}><${C} /></div>`, true, 'Hiding with CSS keeps the component mounted, so its state survives.'],
    [`{flag && <${C} />}`, false, 'When flag becomes false, the component is removed; when it comes back, it starts fresh.'],
    [`{flag ? <${C} /> : <${D} />}`, false, 'A different component type at the same position resets the state.'],
    [`<${C} isActive={flag} />`, true, 'It is the same component at the same position; only a prop changed.'],
  ];
  const [code, kept, expl] = pick(cases);
  return single('preserving', 'medium', `flag toggles from true to false${code.startsWith('{flag &&') ? ' and back to true' : ''}. What happens to ${C}'s state?`, code,
    kept ? 'The state is kept' : 'The state is reset', ['The state is kept', 'The state is reset', 'React throws an error', 'It depends on the browser'], expl, 'react-preserve');
};

T['react-list-count'] = () => {
  const words = ['milk', 'eggs', 'bread', 'rice', 'tea', 'soap', 'jam'];
  const items = sample(words, ri(4, 6)).map((t, i) => ({ id: i + 1, text: t, done: rand() < 0.5 }));
  const showDone = rand() < 0.5;
  const count = items.filter((i) => (showDone ? i.done : !i.done)).length;
  return single('lists', 'easy', 'How many <li> elements are rendered?',
    L(`const todos = [`, ...items.map((i) => `  { id: ${i.id}, text: '${i.text}', done: ${i.done} },`), '];', '', 'return (', '  <ul>',
      `    {todos.filter(t => ${showDone ? 't.done' : '!t.done'}).map(t => <li key={t.id}>{t.text}</li>)}`, '  </ul>', ');'),
    String(count), [String(items.length), String(items.length - count), String(count + 1), '0'],
    'filter keeps only the matching todos, and map turns each one into an <li>.', 'react-list-count');
};

T['react-props-default'] = () => {
  const d = ri(2, 9) * 10;
  const x = d + ri(1, 9) * 5;
  const usages = [['<Avatar />', fmt(d)], [`<Avatar size={${x}} />`, fmt(x)], ['<Avatar size={null} />', 'null'], ['<Avatar size={undefined} />', fmt(d)], ['<Avatar size={0} />', '0'], [`<Avatar size="${x}" />`, `'${x}' (a string)`]];
  const [use, res] = pick(usages);
  return single('props', 'medium', 'What is the value of size inside Avatar?', L(`function Avatar({ size = ${d} }) {`, '  return <img width={size} />;', '}', '', use),
    res, [fmt(d), fmt(x), 'null', '0', 'undefined', `'${x}' (a string)`],
    'A default is used only when the prop is missing or undefined. Quotes pass a string; braces pass a JavaScript value.', 'react-props-default');
};

T['react-jsx-attr'] = () => {
  const table = [['class', 'className'], ['for', 'htmlFor'], ['tabindex', 'tabIndex'], ['onclick', 'onClick'], ['readonly', 'readOnly'], ['maxlength', 'maxLength'],
    ['colspan', 'colSpan'], ['rowspan', 'rowSpan'], ['autofocus', 'autoFocus'], ['stroke-width', 'strokeWidth'], ['fill-opacity', 'fillOpacity'],
    ['contenteditable', 'contentEditable'], ['crossorigin', 'crossOrigin'], ['datetime', 'dateTime'], ['onmouseenter', 'onMouseEnter'], ['onkeydown', 'onKeyDown'],
    ['autocomplete', 'autoComplete'], ['srcset', 'srcSet'], ['aria-label', 'aria-label'], ['data-id', 'data-id'], ['accept-charset', 'acceptCharset']];
  const [html, jsx] = pick(table);
  const camel = html.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const wrongs = [html, camel[0].toUpperCase() + camel.slice(1), html.toUpperCase(), camel === jsx ? html.replace(/-/g, '_') : camel, html.replace(/-/g, '_')];
  return single('jsx', 'easy', `How do you write the HTML attribute "${html}" in JSX?`, null, jsx, wrongs,
    'Most attributes become camelCase in JSX (class → className, for → htmlFor). aria-* and data-* keep their dashes.', 'react-jsx-attr');
};

T['react-hook-where'] = () => {
  const pool = [
    { text: 'At the top level of a component function', ok: true },
    { text: 'At the top level of a custom Hook (useSomething)', ok: true },
    { text: 'Inside an if statement', ok: false }, { text: 'Inside a for loop', ok: false },
    { text: 'Inside an event handler function', ok: false }, { text: 'Inside a useEffect callback', ok: false },
    { text: 'After an early return statement', ok: false }, { text: 'Inside a regular helper function (not a Hook)', ok: false },
    { text: 'Inside a .map() callback in JSX', ok: false },
  ];
  const hook = pick(['useState', 'useEffect', 'useContext', 'useRef']);
  return multi('state', 'medium', `Where is it valid to call ${hook}? (select all that apply)`, null, [pool[rand() < 0.5 ? 0 : 1], ...sample(pool.slice(2), 3), ...(rand() < 0.5 ? [pool[rand() < 0.5 ? 1 : 0]] : [])].filter((v, i, a) => a.indexOf(v) === i),
    'Hooks must be called at the top level of components or custom Hooks, so that they run in the same order on every render.', 'react-hook-where');
};

T['react-ref-or-state'] = () => {
  const pool = [
    ['A timeout ID used to cancel a timer later', 'useRef'], ['The text typed into a search box that is shown on screen', 'useState'],
    ['A reference to an <input> element, used to focus it', 'useRef'], ['Whether a dropdown menu is open', 'useState'],
    ['The full name built from firstName and lastName state', 'Calculate it during render (no Hook)'],
    ['How many times a button was clicked, shown in the button label', 'useState'], ['How many times a button was clicked, only sent to analytics', 'useRef'],
    ['The currently selected tab', 'useState'], ['An interval ID for a stopwatch', 'useRef'],
    ['The filtered list of products for the current search text', 'Calculate it during render (no Hook)'],
    ['A WebSocket connection object', 'useRef'], ['Whether a form is submitting (the button shows a spinner)', 'useState'],
    ['The total price of the items in the cart (cart is in state)', 'Calculate it during render (no Hook)'],
    ['The app-wide theme needed by many deeply nested components', 'useContext'],
    ['The logged-in user, needed by many distant components', 'useContext'], ['A <video> element to call play() on', 'useRef'],
    ['The number of items in a list that is stored in state', 'Calculate it during render (no Hook)'],
  ];
  const [what, ans] = pick(pool);
  return single('refs', 'medium', `Which is the best fit for: ${what}?`, null, ans, ['useState', 'useRef', 'Calculate it during render (no Hook)', 'useContext'],
    'Shown on screen → useState. Remembered but not shown → useRef. Computable → calculate it. Needed deep in the tree → useContext.', 'react-ref-or-state');
};

T['react-effect-needed'] = () => {
  const pool = [
    ['Connecting to a chat server while the ChatRoom is on screen', 'An Effect (useEffect)'], ['Showing a filtered list based on a search query in state', 'Calculate it during rendering'],
    ['Sending a POST request when the user clicks Submit', 'In the event handler'], ['Clearing a comment box when the userId prop changes', 'A key on the component'],
    ['Subscribing to window resize events', 'An Effect (useEffect)'], ['Computing fullName from firstName and lastName', 'Calculate it during rendering'],
    ['Showing a notification after the user clicks Buy', 'In the event handler'], ['Keeping a third-party map widget in sync with props', 'An Effect (useEffect)'],
    ['Resetting all form fields when switching to a different contact', 'A key on the component'], ['Starting a setInterval while a clock is visible', 'An Effect (useEffect)'],
    ['Calculating the cart total from the cart items', 'Calculate it during rendering'], ['Adding an item to the cart when "Add" is clicked', 'In the event handler'],
    ['Converting a Celsius value in state to Fahrenheit for display', 'Calculate it during rendering'], ['Focusing an input when a modal first appears', 'An Effect (useEffect)'],
    ['Navigating to a "thanks" page after a successful form submit', 'In the event handler'], ['Fetching search results for the current query', 'An Effect (useEffect)'],
  ];
  const [what, ans] = pick(pool);
  return single('effects', 'medium', `What is the best way to handle: ${what}?`, null, ans,
    ['An Effect (useEffect)', 'Calculate it during rendering', 'In the event handler', 'A key on the component'],
    'Effects are for synchronising with outside systems. Derived data → calculate it; user actions → handlers; resetting state → key.', 'react-effect-needed');
};

T['react-immutable-multi'] = () => {
  const v = pick(['items', 'todos', 'products', 'tasks']);
  const scenarios = [
    ['add newItem to the end', [[`[...${v}, newItem]`, true], [`${v}.concat(newItem)`, true], [`${v}.push(newItem)`, false], [`${v}[${v}.length] = newItem`, false], [`${v}.unshift(newItem)`, false]]],
    ['remove the item with id', [[`${v}.filter(x => x.id !== id)`, true], [`${v}.toSpliced(index, 1)`, true], [`${v}.splice(index, 1)`, false], [`delete ${v}[index]`, false], [`${v}.pop()`, false]]],
    ['sort the list by name', [[`${v}.toSorted(byName)`, true], [`[...${v}].sort(byName)`, true], [`${v}.sort(byName)`, false], [`${v}.reverse().sort(byName)`, false]]],
    ['reverse the list', [[`${v}.toReversed()`, true], [`[...${v}].reverse()`, true], [`${v}.reverse()`, false], [`${v}.sort().reverse()`, false]]],
    ['mark the item with id as done', [[`${v}.map(x => x.id === id ? { ...x, done: true } : x)`, true], [`${v}.map(x => { if (x.id === id) x.done = true; return x; })`, false], [`${v}.find(x => x.id === id).done = true`, false], [`[...${v}].map(x => x.id === id ? { ...x, done: true } : x)`, true]]],
    ['insert newItem at index i', [[`[...${v}.slice(0, i), newItem, ...${v}.slice(i)]`, true], [`${v}.toSpliced(i, 0, newItem)`, true], [`${v}.splice(i, 0, newItem)`, false], [`${v}[i] = newItem`, false]]],
  ];
  const [task, opts] = pick(scenarios);
  const items = shuffle(opts).slice(0, Math.min(opts.length, ri(4, 5))).map(([text, ok]) => ({ text, ok }));
  return multi('immutability', 'medium', `${v} is state. Which expressions correctly create the NEXT state to ${task}, without mutating? (select all that apply)`, null, items,
    'Produce a new array (spread, filter, map, slice, toSorted, toReversed, toSpliced) and new objects for changed items. push, splice, sort, reverse and direct assignment all mutate.', 'react-immutable-multi');
};

T['react-derive-or-state'] = () => {
  const pool = [
    ['The text the user typed into a search box', 'Keep it in state'], ['The list of results matching the search text', 'Calculate it during render'],
    ['Whether the form can be submitted (both fields filled in)', 'Calculate it during render'], ['Which tab is currently selected', 'Keep it in state'],
    ['The number of unread messages, given the messages array in state', 'Calculate it during render'], ['The value of an "only in stock" checkbox', 'Keep it in state'],
    ['fullName, when firstName and lastName are already in state', 'Calculate it during render'], ['The selected item object, when items and selectedId are in state', 'Calculate it during render'],
    ['Whether a modal dialog is open', 'Keep it in state'], ['The total price, given the cart items in state', 'Calculate it during render'],
    ['isEmpty for a list that is in state', 'Calculate it during render'], ['The current page number of a paginated list', 'Keep it in state'],
    ['Whether the "Next" button is disabled on the last page', 'Calculate it during render'], ['The draft text of a comment', 'Keep it in state'],
  ];
  const [what, ans] = pick(pool);
  return single('structure', 'easy', `How should you handle: ${what}?`, null, ans, ['Keep it in state', 'Calculate it during render', 'Store it in a ref', 'Store it in a global variable'],
    'If a value can be calculated from existing props or state, calculate it during render instead of storing it.', 'react-derive-or-state');
};

T['react-context-nearest'] = () => {
  const vals = sample(['light', 'dark', 'blue', 'sepia', 'contrast'], 4);
  const [def, v1, v2, v3] = vals;
  const s = pick([1, 2, 3]);
  let code, answers;
  if (s === 1) {
    code = L(`const ThemeContext = createContext('${def}');`, '', `<ThemeContext value="${v1}">`, '  <Panel>', `    <ThemeContext value="${v2}">`, '      <Button />  {/* A */}', '    </ThemeContext>', '    <Button />    {/* B */}', '  </Panel>', '</ThemeContext>', '<Button />        {/* C */}');
    answers = { A: v2, B: v1, C: def };
  } else if (s === 2) {
    code = L(`const ThemeContext = createContext('${def}');`, '', `<ThemeContext value="${v1}">`, `  <ThemeContext value="${v2}">`, `    <ThemeContext value="${v3}">`, '      <Button />  {/* A */}', '    </ThemeContext>', '    <Button />    {/* B */}', '  </ThemeContext>', '  <Button />      {/* C */}', '</ThemeContext>');
    answers = { A: v3, B: v2, C: v1 };
  } else {
    code = L(`const ThemeContext = createContext('${def}');`, '', `<ThemeContext value="${v1}">`, '  <Layout>', '    <Sidebar>', '      <Button />  {/* A */}', '    </Sidebar>', '  </Layout>', '</ThemeContext>', `<ThemeContext value="${v2}">`, '  <Button />    {/* B */}', '</ThemeContext>', '<Button />      {/* C */}');
    answers = { A: v1, B: v2, C: def };
  }
  const letter = pick(['A', 'B', 'C']);
  return single('context', 'medium', `Button reads useContext(ThemeContext). Which value does Button ${letter} get?`, code, `'${answers[letter]}'`, vals.map((x) => `'${x}'`),
    'A component reads the value from the CLOSEST provider above it (however deep). With no provider above, it gets the default from createContext.', 'react-context-nearest');
};

T['react-key-choice'] = () => {
  const ents = [
    ['users', '{ id, name, email }', 'user.id', 'user.name'], ['products', '{ sku, title, price }', 'product.sku', 'product.title'],
    ['messages', '{ messageId, text, sentAt }', 'message.messageId', 'message.text'], ['songs', '{ trackId, title, artist }', 'song.trackId', 'song.title'],
    ['orders', '{ orderNo, total, status }', 'order.orderNo', 'order.status'], ['cities', '{ code, name, country }', 'city.code', 'city.name'],
  ];
  const [list, shape, good, dup] = pick(ents);
  const item = good.split('.')[0];
  return single('lists', 'easy', `You render ${list} (shape ${shape}) with ${list}.map(${item} => <Row ... />). Which key is best?`, null,
    `key={${good}}`, [`key={index}`, 'key={Math.random()}', `key={${dup}}`, `key="${item}"`],
    'Use a stable, unique ID from the data. Indexes break when items move, random keys change on every render, and names may repeat.', 'react-key-choice');
};

T['react-import-export'] = () => {
  const N = pick(['Button', 'Profile', 'Card', 'Avatar', 'Gallery', 'Header']);
  const M = pick(['Badge', 'Icon', 'Title'].filter((x) => x !== N));
  const cases = [
    [`export default function ${N}() { ... }`, `import ${N} from './${N}';`, 'It works'],
    [`export default function ${N}() { ... }`, `import { ${N} } from './${N}';`, 'Error: the module does not provide that export'],
    [`export default function ${N}() { ... }`, `import Thing from './${N}';`, 'It works'],
    [`export function ${N}() { ... }`, `import { ${N} } from './${N}';`, 'It works'],
    [`export function ${N}() { ... }`, `import ${N} from './${N}';`, 'Error: the module does not provide that export'],
    [`export function ${N}() { ... }`, `import { ${M} } from './${N}';`, 'Error: the module does not provide that export'],
    [`export function ${N}() { ... }`, `import { ${N} as My${N} } from './${N}';`, 'It works'],
    [L(`export default function ${N}() { ... }`, `export function ${M}() { ... }`), `import ${N}, { ${M} } from './${N}';`, 'It works'],
  ];
  const [exp, imp, res] = pick(cases);
  return single('jsx', 'medium', 'Does this import work?', L(`// ${N}.jsx`, exp, '', '// App.jsx', imp), res,
    ['It works', 'Error: the module does not provide that export', 'It works, but the component renders nothing', 'Error: React is not defined'],
    'Default exports are imported WITHOUT braces (any name). Named exports are imported WITH braces and must use the exact name (or "as" to rename).', 'react-import-export');
};

T['react-pass-vs-call'] = () => {
  const fn = pick(['handleClick', 'save', 'openMenu', 'logout']);
  const pool = [
    [`onClick={${fn}}`, true], [`onClick={${fn}()}`, false], [`onClick={() => ${fn}()}`, true], [`onClick={() => ${fn}}`, false],
    [`onClick="${fn}()"`, false], [`onClick={function () { ${fn}(); }}`, true], [`onClick={(e) => ${fn}(e)}`, true],
  ];
  return multi('events', 'medium', `Which of these run ${fn} when the button is CLICKED (and not before)? (select all that apply)`, null,
    sample(pool, ri(4, 5)).map(([text, ok]) => ({ text, ok })),
    'Pass a function. fn() runs during rendering; () => fn returns the function without calling it; a string is not a valid handler in React.', 'react-pass-vs-call');
};

T['react-hook-independent'] = () => {
  const s = ri(0, 5), k = ri(2, 6);
  const askA = rand() < 0.5;
  return single('hooks', 'medium', `You click the button in A ${k} times. What does ${askA ? 'A' : 'B'} show?`,
    L(`function useCounter() {`, `  const [n, setN] = useState(${s});`, '  return [n, () => setN(n + 1)];', '}', '',
      'function A() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }', 'function B() { const [n, inc] = useCounter(); return <button onClick={inc}>{n}</button>; }'),
    String(askA ? s + k : s), [String(askA ? s : s + k), String(s + 2 * k), String(k), String(s + 1)],
    'Custom Hooks share LOGIC, not state. Each component that calls useCounter gets its own independent n.', 'react-hook-independent');
};

T['react-ref-no-render'] = () => {
  const s = ri(0, 5), k = ri(2, 6);
  const ask = pick(['screen', 'current']);
  return single('refs', 'medium', ask === 'screen' ? `You click ${k} times and nothing else re-renders. What does the button show?` : `After ${k} clicks, what is countRef.current?`,
    L(`const countRef = useRef(${s});`, '', 'return (', '  <button onClick={() => { countRef.current = countRef.current + 1; }}>', '    Clicked {countRef.current}', '  </button>', ');'),
    String(ask === 'screen' ? `Clicked ${s}` : s + k), ask === 'screen' ? [`Clicked ${s + k}`, `Clicked ${k}`, `Clicked ${s + 1}`] : [String(s), String(k), String(s + 1)],
    'Changing ref.current does NOT re-render, so the screen keeps showing the old value even though the ref has changed.', 'react-ref-no-render');
};

T['react-thinking-multi'] = () => {
  const apps = [
    ['a todo app', [['The text in the "new todo" input', true], ['The list of todos', true], ['The number of remaining todos', false], ['The current filter (all/active/done)', true], ['The filtered list of todos', false], ['Whether the "Clear completed" button is visible', false]]],
    ['a chat app', [['The message draft', true], ['The selected contact\'s ID', true], ['The selected contact object (contacts are in state)', false], ['The count of unread messages (messages are in state)', false], ['The list of contacts passed in as a prop', false]]],
    ['a product table', [['The search text', true], ['The "only in stock" checkbox', true], ['The product list passed in as a prop', false], ['The filtered products', false], ['The number of visible products', false]]],
    ['a signup form', [['The email input value', true], ['The password input value', true], ['Whether the form is valid (both fields filled in)', false], ['The submit status (typing/sending/sent)', true], ['The label text "Email", which never changes', false]]],
  ];
  const [app, opts] = pick(apps);
  return multi('thinking', 'medium', `In ${app}, which of these should be STATE? (select all that apply)`, null,
    shuffle(opts).slice(0, ri(4, opts.length)).map(([text, ok]) => ({ text, ok })),
    'It\'s not state if it never changes, comes from props, or can be calculated from other state or props.', 'react-thinking-multi');
};

// ---------- fill the pool ----------
const names = Object.keys(T);
const fails = Object.fromEntries(names.map((n) => [n, 0]));
let guard = 0;
while (Q.length < TARGET && guard < 200000) {
  guard++;
  const live = names.filter((n) => fails[n] < 300);
  if (!live.length) break;
  const n = live[guard % live.length];
  const ok = T[n]();
  fails[n] = ok ? 0 : fails[n] + 1;
}

if (Q.length < TARGET) { console.error(`Only generated ${Q.length} questions`); process.exit(1); }
Q.forEach((q, i) => { q.id = i + 1; });

const byTopic = {}; const byTemplate = {};
Q.forEach((q) => { byTopic[q.topic] = (byTopic[q.topic] || 0) + 1; byTemplate[q.template || 'hand'] = (byTemplate[q.template || 'hand'] || 0) + 1; });
const multiCount = Q.filter((q) => q.answer.length > 1).length;

const out = { version: 1, generated: '2026-10-30', total: Q.length, questions: Q.map(({ id, topic, difficulty, question, code, options, answer, explanation, template }) => ({ id, topic, difficulty, question, ...(code ? { code } : {}), options, answer, explanation, ...(template ? { template } : {}) })) };
fs.writeFileSync(path.join(OUT, 'questions.json'), JSON.stringify(out, null, 1));
console.log({ total: Q.length, handWritten: HAND, generated: Q.length - HAND, multiAnswer: multiCount, byTopic });
console.log(byTemplate);
