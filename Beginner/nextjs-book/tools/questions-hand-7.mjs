// Hand-written questions, part 7: scenario questions for the thinner topics.
export default function part7(h) {
  // testing
  h("testing", "easy", "Where do the docs' Vitest examples put test files?", ["*In a __tests__ folder (colocating in app/ also works)", "Only in public/", "Only in .next/", "In next.config.ts"], "Both conventions work.");
  h("testing", "medium", "Which query is best to find a submit button labelled 'Save'?", ["*getByRole(\"button\", { name: \"Save\" })", "querySelector(\".btn\")", "getByTestId(\"x\")", "getElementsByTagName(\"button\")[0]"], "Role and accessible name.");
  h("testing", "medium", "Which command installs Playwright's own browsers?", ["*npx playwright install", "npm i chrome", "npx vitest browsers", "next install-browsers"], "Or use channel: \"chrome\".");
  h("testing", "medium", "What does vi.fn() create?", ["*A mock function that records its calls", "A fake timer", "A test file", "A snapshot"], "Use it to replace dependencies.");
  h("testing", "hard", "Which behaviours can only an E2E test against next start verify? (select all that apply)", ["*Streaming of Suspense boundaries", "*Cache revalidation after an action", "*Proxy redirects", "A pure function's return value"], "Unit tests don't run Next.js.");
  h("testing", "medium", "What does vi.setSystemTime help with?", ["*Testing date logic without depending on today's date", "Running tests faster", "Setting the time zone of the server", "Mocking fetch"], "Or pass dates in as arguments.");
  h("testing", "medium", "toMatchInlineSnapshot stores the snapshot…", ["*inside the test file itself", "in __snapshots__ only", "in the browser", "nowhere"], "As used in Chapter 17.");
  h("testing", "easy", "What should CI run before E2E tests?", ["*npm run build (then npm start for the tests)", "next dev", "Nothing", "npm run export"], "E2E tests need a production server.");

  // images
  h("images", "medium", "Which statement about width and height on <Image> is right?", ["*They set the intrinsic size (aspect ratio); CSS sets the displayed size", "They set the displayed size only", "They're ignored", "They must match the screen"], "Style with CSS, e.g. width: 200, height: auto.");
  h("images", "medium", "Which remotePatterns entry is too permissive?", ["*{ hostname: \"**\" }", "new URL(\"https://covers.example.com/books/**\")", "{ protocol: \"https\", hostname: \"avatars.example.com\", pathname: \"/u/**\" }", "None of these"], "Be as specific as possible.");
  h("images", "easy", "Good alt text for a decorative background swirl is…", ["*\"\" (empty)", "\"swirl\"", "\"image\"", "Leave alt out"], "Screen readers skip it.");
  h("images", "medium", "Which font approach is recommended for best performance?", ["*Variable fonts (all weights in one file)", "One file per weight always", "System fonts only", "Fonts from a CDN link"], "Otherwise specify the weights you need.");
  h("images", "hard", "A grid of covers uses fill without sizes. What's the downside?", ["*The browser may download images much larger than needed", "Images don't show", "The build fails", "Images aren't lazy-loaded"], "sizes tells the browser the box width.");
  h("images", "medium", "Which file does next/font/local's src path resolve relative to?", ["*The file that calls localFont", "public/", "The project root", "node_modules"], "e.g. ./fonts/Brand.woff2.");

  // pages
  h("pages", "medium", "Which file customises the HTML document (<html>, <body>) in the Pages Router?", ["*pages/_document.tsx", "pages/_app.tsx", "pages/index.tsx", "pages/_html.tsx"], "In the App Router: the root layout.");
  h("pages", "medium", "Pages Router: which symbol did the build show for getStaticProps pages?", ["*●", "○", "◐", "ƒ"], "SSG: prerendered as static HTML (uses getStaticProps).");
  h("pages", "medium", "Pages Router: which symbol for getServerSideProps pages?", ["*ƒ", "○", "●", "◐"], "Server-rendered on demand.");
  h("pages", "easy", "Where do API Routes live in the Pages Router?", ["*pages/api/", "app/api/", "api/", "server/"], "The App Router uses route.ts.");
  h("pages", "medium", "Can the Pages Router use Server Actions?", ["*No: they're an App Router feature", "Yes", "Only in _app", "Only with middleware"], "Use API Routes there.");
  h("pages", "hard", "What does getServerSideProps({ req }) give you access to?", ["*The incoming request (headers, cookies) on every request", "Build-time data only", "The browser window", "The React tree"], "The example read the user agent.");

  // react
  h("react", "medium", "What is lifting state up?", ["*Moving shared state to the closest common parent and passing it down", "Using a global store", "Putting state in the URL", "Using refs"], "Siblings then share one source of truth.");
  h("react", "medium", "What does useMemo do?", ["*Caches a computed value between renders until its dependencies change", "Caches data across requests", "Creates refs", "Memoizes components across pages"], "Use only for expensive computations.");
  h("react", "easy", "Which renders a list?", ["*{items.map((i) => <li key={i.id}>{i.name}</li>)}", "{for (const i of items) <li/>}", "<li repeat={items} />", "{items.forEach(...)}"], "map returns an array of elements.");
  h("react", "medium", "Which React 19 API can read context and promises?", ["*use", "useContextAsync", "await in render", "useEffect"], "use(promise) and use(Context).");
  h("react", "hard", "Why compute derived data during render instead of storing it in state?", ["*It can't get out of sync, and needs no effect", "State is slower", "React forbids it", "For SSR only"], "E.g. filtered lists.");

  // deploying
  h("deploying", "medium", "Which platforms offer their own (not verified) Next.js integrations, per the docs? (select all that apply)", ["*Netlify", "*Cloudflare", "*AWS Amplify", "Vercel"], "Vercel is a verified adapter.");
  h("deploying", "easy", "Which command upgrades Next.js before version 16.1?", ["*npx @next/codemod@canary upgrade latest", "npx next upgrade", "npm update next --major", "next migrate"], "next upgrade exists since 16.1.");
  h("deploying", "medium", "Which header does Next.js send so nginx doesn't buffer streamed responses?", ["*X-Accel-Buffering: no", "Cache-Control: no-store", "Transfer-Encoding: none", "X-Stream: on"], "From the Self-Hosting guide.");
  h("deploying", "medium", "Where are prerendered pages and cache entries stored when self-hosting by default?", ["*On disk and in memory, per instance", "In the browser", "In a database", "On Vercel"], "Share them with a cache handler for many instances.");
  h("deploying", "hard", "Which checks belong on a production checklist? (select all that apply)", ["*Every Server Function checks auth and input", "*No secrets in NEXT_PUBLIC_ variables", "*Hosting supports streaming", "Every page is a Client Component"], "From Chapter 18's checklist.");

  // proxy
  h("proxy", "medium", "Which next.config option sets fixed response headers without Proxy?", ["*headers()", "redirects()", "rewrites()", "images"], "It runs first in the execution order.");
  h("proxy", "medium", "Even when _next/data is excluded by a negative matcher, Proxy…", ["*still runs for _next/data routes (by design, for security)", "never runs for them", "fails the build", "redirects them"], "So data routes stay protected.");
  h("proxy", "hard", "Design: send /books to /en/books or /fr/books from a lang cookie or Accept-Language. Which tool?", ["*Proxy with a redirect, plus an app/[lang] root layout", "next.config redirects only", "A Client Component", "A Route Handler"], "Depends on request data.");
  h("proxy", "medium", "What does NextResponse.json() in Proxy do?", ["*Answers the request directly without reaching the route", "Sets a JSON header for the route", "Rewrites to an API", "Logs JSON"], "The API-key example returned 401.");

  // envauth
  h("envauth", "hard", "A Docker image built with NEXT_PUBLIC_API_URL=staging calls staging in production. Fixes? (select all that apply)", ["*Build a separate image per environment", "*Read a server-only variable at request time and pass it down", "Set NEXT_PUBLIC_API_URL at runtime only", "Restart the container"], "Public values are inlined at build time.");
  h("envauth", "medium", "Which loads .env files outside Next.js (a test runner, an ORM config)?", ["*loadEnvConfig from @next/env", "dotenv is required", "process.loadEnv()", "next env"], "The same loader Next.js uses.");
  h("envauth", "medium", "What does timingSafeEqual protect against when comparing password hashes?", ["*Timing attacks that guess bytes from how long a comparison takes", "Wrong encodings", "Empty passwords", "SQL injection"], "Constant-time comparison.");
  h("envauth", "medium", "Where should role checks for 'delete book' happen?", ["*Inside the deleteBook Server Action (and in data access)", "Only in the UI", "Only in Proxy", "In next.config.ts"], "Hide the button and check on the server.");
  h("envauth", "easy", "Why use an auth library instead of rolling your own in production?", ["*They handle OAuth, password resets, rate limiting and many security details", "Next.js requires one", "They're always free", "They avoid cookies"], "The docs list several.");

  // revalidating
  h("revalidating", "medium", "A list of 'trending books' changes on its own several times a day. Which strategy?", ["*Time-based: cacheLife(\"hours\") or \"minutes\"", "updateTag only", "No caching", "A redeploy"], "No event tells you when it changes.");
  h("revalidating", "hard", "Why did the webhook example need a second request before showing 3 books?", ["*revalidateTag marks entries stale: the first request gets stale data and starts the refresh", "The webhook failed", "The cache never refreshes", "Proxy cached it"], "Stale-while-revalidate.");
  h("revalidating", "medium", "What's the limit on a tag's length?", ["*256 characters", "32 characters", "No limit", "8 characters"], "Longer tags are never assigned.");
  h("revalidating", "medium", "Tags are…", ["*case-sensitive strings", "case-insensitive", "numbers only", "URLs"], "\"Books\" and \"books\" differ.");

  // metadata
  h("metadata", "medium", "What does title.default in a layout's metadata do?", ["*Is used for pages that set no title", "Overrides every page's title", "Sets the OG title", "Sets the browser default font"], "The home page used it.");
  h("metadata", "medium", "Which fields does openGraph typically include? (select all that apply)", ["*title", "*description", "*type", "cacheLife"], "Images come from opengraph-image or images.");
  h("metadata", "hard", "Why put metadata about content, not the user, in generateMetadata?", ["*Personal titles leak into history and screenshots, can't be prerendered, and don't help search", "It's not allowed", "It breaks OG images", "It disables streaming"], "Show personal info in the body.");
  h("metadata", "medium", "What does an OG image's size export set?", ["*The image dimensions, also used for og:image:width/height", "The file size limit", "The font size", "The cache size"], "e.g. { width: 1200, height: 630 }.");

  // errors
  h("errors", "medium", "An error.tsx in app/dashboard/stats/ catches errors from…", ["*the stats segment and below, replacing only that part", "the whole app", "the root layout", "only Client Components"], "Errors bubble to the nearest boundary.");
  h("errors", "hard", "Which code throws during the build if not guarded? (select all that apply)", ["*A Server Component that throws on its first render", "*A page that throws without connection() or Suspense", "A Client Component that throws only after hydration", "An onClick handler that throws"], "Prerendering runs the first two.");
  h("errors", "medium", "Why is \"Wrong email or password\" returned, not thrown?", ["*It's an expected error the user can fix", "Throwing is slower", "Errors can't be thrown in actions", "To get a 401"], "Return values for expected errors.");

  // serverclient / fetching / mutating / caching extras
  h("serverclient", "medium", "Which file structure keeps a large layout on the server while adding one interactive part?", ["*layout.tsx (server) imports search.tsx (\"use client\")", "\"use client\" in layout.tsx", "Two layouts", "A template"], "Small client leaves.");
  h("fetching", "medium", "Where should the Suspense boundary go for a slow reviews list on a book page?", ["*Around the reviews component only", "Around the whole page", "Around the root layout", "Nowhere"], "Close to the slow data.");
  h("mutating", "medium", "Which hook gives a form's pending state to a nested button without props?", ["*useFormStatus", "useActionState", "useTransition", "usePending"], "From react-dom.");
  h("caching", "easy", "Which import gives you cacheLife and cacheTag?", ["*next/cache", "next/server", "react", "next/headers"], "Also updateTag and revalidateTag.");
  h("linking", "medium", "What does prefetch={null} vs prefetch={false} mean in the hover-prefetch example?", ["*null restores the default prefetching once hovered; false disables it", "Both disable", "Both enable", "null is an error"], "The docs' HoverPrefetchLink.");
  h("layouts", "medium", "Can a layout read params?", ["*Yes, via its params prop (await it, ideally inside Suspense or a child)", "No", "Only the root layout", "Only with \"use client\""], "Avoid awaiting at the top for unknown params.");
  h("install", "medium", "What does the Network address in next dev's output allow?", ["*Opening the dev server from other devices on your network", "Deploying the app", "Sharing on the internet", "Nothing"], "e.g. testing on your phone.");
  h("what", "medium", "Why does Next.js send both HTML and an RSC payload on first load?", ["*HTML for an instant preview; the payload so React can rebuild the tree and hydrate", "For SEO only", "As a backup", "For older browsers"], "From Chapter 5.");
  h("project", "medium", "Which capstone route reads the session and streams?", ["*/admin", "/", "/robots.txt", "/books/1"], "◐ in the route table.");
  h("project", "medium", "Which file holds the add-book validation schema?", ["*lib/validation.ts", "app/admin/page.tsx", "proxy.ts", "data/books.json"], "Shared by the action and tests.");
  h("routes", "medium", "What happens when a route.ts doesn't define OPTIONS?", ["*Next.js implements OPTIONS automatically and sets the Allow header from the defined methods", "OPTIONS returns 405", "The build fails", "OPTIONS redirects to GET"], "From the route.js reference.");
}
