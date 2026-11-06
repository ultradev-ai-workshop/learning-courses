// Hand-written questions, part 6: more depth for every chapter (scenarios and "which is true" checks).
export default function part6(h) {
  // Tailwind scale facts (Chapter 11): p-N / m-N = N × 0.25rem, text sizes
  const SPACING = [[1, "0.25rem (4px)"], [2, "0.5rem (8px)"], [3, "0.75rem (12px)"], [4, "1rem (16px)"], [6, "1.5rem (24px)"], [8, "2rem (32px)"], [12, "3rem (48px)"]];
  const ALL = SPACING.map((s) => s[1]);
  for (const [n, v] of SPACING) {
    const prop = n % 2 ? "m" : "p";
    h("css", "easy", `In Tailwind CSS, how much ${prop === "p" ? "padding" : "margin"} does ${prop}-${n} give?`, ["*" + v, ...ALL.filter((x) => x !== v).slice(0, 3)], `Spacing utilities use steps of 0.25rem: ${n} × 0.25rem = ${v}.`);
  }
  for (const [cls, size] of [["text-sm", "14px"], ["text-base", "16px"], ["text-lg", "18px"], ["text-xl", "20px"], ["text-2xl", "24px"], ["text-3xl", "30px"]]) {
    h("css", "easy", `Which font size does Tailwind's ${cls} set?`, ["*" + size, ...["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"].filter((x) => x !== size).slice(0, 3)], `${cls} = ${size} (the book measured text-3xl as 30px).`);
  }
  for (const [cls, v] of [["rounded", "4px"], ["rounded-lg", "8px"], ["rounded-full", "a fully rounded pill/circle"], ["font-bold", "font-weight 700"], ["font-semibold", "font-weight 600"]]) {
    h("css", "medium", `What does the Tailwind class ${cls} set?`, ["*" + v, ...["4px", "8px", "a fully rounded pill/circle", "font-weight 700", "font-weight 600", "12px"].filter((x) => x !== v).slice(0, 3)], `${cls}: ${v}.`);
  }

  // what
  h("what", "medium", "Which are part of what the book calls 'full-stack' in one Next.js project? (select all that apply)", ["*Pages", "*Server-side data access", "*An HTTP API", "A separate mobile app binary"], "Pages, data and API share one codebase.");
  h("what", "hard", "Which statement about Next.js and React versions is right?", ["*The App Router uses React canary features bundled with Next.js; you still list react in package.json", "Next.js forks React", "Next.js only works with React 16", "You must not install react"], "From the docs' React version handling section.");
  h("what", "medium", "What does 'code splitting' mean in Next.js?", ["*Each route loads only the JavaScript it needs", "Splitting files into server and client folders", "Minifying CSS", "Writing smaller functions"], "Automatic per-route bundles.");
  h("what", "easy", "Which is a framework?", ["*Next.js", "React", "Lodash", "Zod"], "React, Lodash and Zod are libraries.");
  h("what", "medium", "In the bakery analogy, partial prerendering is…", ["*a sandwich on bread baked this morning, filled while you watch", "bread baked before opening", "a sandwich made entirely to order", "a fresh batch when the old one gets stale"], "Static shell + personal part now.");
  h("what", "hard", "Your product page shows a description (weekly changes) and a price from a cookie-based country. How does Next.js 16 render it?", ["*Description in the cached static shell; price streamed per request in Suspense", "The whole page per request", "The whole page at build time", "Entirely in the browser"], "Partial prerendering.");
  h("what", "medium", "Where does a static Server Component's console.log appear in production?", ["*In the build output (it runs during next build)", "In the browser console", "Nowhere", "On every request"], "Static pages render at build time.");
  h("what", "easy", "What does 'prerendered' mean?", ["*Rendered ahead of time (at build or revalidation) and stored", "Rendered in the browser", "Rendered twice", "Not rendered"], "Served instantly afterwards.");
  h("what", "medium", "Which needs does Next.js NOT cover out of the box?", ["*A message queue for background jobs", "Routing", "Server rendering", "Image optimization"], "Use a dedicated service for queues.");
  h("what", "medium", "What does 'Backend for Frontend' mean in the docs?", ["*Next.js acts as the web front end's server layer, calling other back-end services", "Next.js replaces every back end", "A CSS methodology", "A testing pattern"], "A guide in the docs.");

  // install
  h("install", "medium", "Which linters can create-next-app set up?", ["*ESLint or Biome (or none)", "Only ESLint", "Only Prettier", "TSLint"], "ESLint is the default.");
  h("install", "easy", "What does npm run dev print as the local address by default?", ["*http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:5173", "https://localhost"], "Port 3000.");
  h("install", "medium", "Which TypeScript version does Next.js require at minimum?", ["*5.1", "4.0", "3.9", "6.0"], "From the Installation page.");
  h("install", "medium", "What is the /_not-found route in the route table?", ["*The built-in 404 page", "A missing file", "An error", "The about page"], "Customise it with not-found.tsx.");

  // layouts
  h("layouts", "medium", "Which of these keep their state when navigating between /shop/shoes and /shop/hats? (select all that apply)", ["*A counter in app/shop/layout.tsx", "*A counter in app/layout.tsx", "A counter in app/shop/shoes/page.tsx", "A counter in app/shop/template.tsx"], "Layouts persist; pages and templates re-mount.");
  h("layouts", "hard", "Why are layouts faster on navigation than re-rendering whole pages?", ["*The server only sends the part below the shared layout", "Layouts are cached in localStorage", "Layouts skip hydration", "They use web workers"], "Partial rendering on navigation.");

  // serverclient
  h("serverclient", "medium", "Which statement about Server Functions as props is true?", ["*A Server Function can be passed from a Server Component to a Client Component", "Only arrow functions can be passed", "No functions can ever be passed", "Only in layouts"], "The error message mentions \"use server\".");
  h("serverclient", "hard", "On first load, in which order does the browser use what it receives?", ["*HTML preview → RSC Payload to reconcile → JavaScript to hydrate", "JavaScript → HTML → RSC", "RSC → HTML → CSS", "CSS → RSC → HTML"], "From the docs' 'How do they work' section.");
  h("serverclient", "medium", "What does client-only (the package) do?", ["*Marks modules that must never run on the server", "Makes a component render only in dev", "Disables SSR globally", "Nothing in Next.js"], "The opposite of server-only.");
  h("serverclient", "easy", "Which hook is NOT allowed in a Server Component?", ["*useState", "None of them are", "use (for promises) is never allowed", "All are allowed"], "Server Components don't have state.");
  h("serverclient", "medium", "Is installing the server-only package required?", ["*No: Next.js recognises the import itself (installing is optional)", "Yes, always", "Only with Turbopack", "Only in production"], "Linters may want it installed.");

  // fetching
  h("fetching", "medium", "Which is a meaningful loading state for a book list?", ["*Grey skeleton lines shaped like the list", "An empty white page", "An alert('loading')", "A redirect"], "Shape it like the content.");
  h("fetching", "hard", "React.cache values set outside a \"use cache\" function are…", ["*not visible inside it: cached functions have an isolated scope", "shared with it", "copied into the cache key", "an error"], "Pass data into cached functions as arguments.");
  h("fetching", "medium", "What does the 'Measuring…' page in Chapter 6 show for two 500 ms calls?", ["*~1000 ms sequential, ~500 ms parallel", "~500 ms for both", "~1000 ms for both", "~250 ms parallel"], "Rounded to 100 ms.");
  h("fetching", "easy", "Which fetch requests are memoized in one render?", ["*Identical ones (same URL and options)", "All fetches", "None", "Only POSTs"], "Automatic request memoization.");

  // mutating
  h("mutating", "medium", "What's a good reason to put Server Functions in a separate actions.ts file?", ["*Client Components can import them, and they're grouped per feature", "It's required for forms", "They run faster", "To avoid TypeScript"], "\"use server\" at the top of the file.");
  h("mutating", "hard", "An action runs `if (!user) throw new Error(\"Unauthorized\")`. In production, what does the user see?", ["*The nearest error boundary with a generic message", "\"Unauthorized\" in the form", "A 401 page", "Nothing"], "Return expected errors; throw for real failures.");
  h("mutating", "medium", "What does progressive enhancement require from the form?", ["*Its action is a Server Action (not an onSubmit handler)", "A Client Component", "JavaScript enabled", "A Route Handler"], "Plain HTML forms post without JS.");

  // caching
  h("caching", "medium", "Which statement about Suspense is true (per the caching docs)?", ["*Suspense provides a fallback but doesn't itself make a component dynamic", "Suspense makes everything inside dynamic", "Suspense caches its children", "Suspense is required for static pages"], "Synchronous work inside still completes during prerendering.");
  h("caching", "hard", "A cached function captures a variable from its enclosing scope. What happens to that value?", ["*It becomes part of the cache key", "It's ignored", "It's an error", "It's re-read on every call"], "Arguments and captured values form the key.");

  // revalidating
  h("revalidating", "medium", "Which tells you the page was served from cache past its revalidate time?", ["*x-nextjs-cache: STALE", "x-nextjs-cache: HIT", "cache-control: no-store", "x-powered-by"], "The next request after the refresh shows HIT.");
  h("revalidating", "hard", "Two cached functions share the tag books. updateTag(\"books\") refreshes…", ["*both of them", "only the first one called", "only the page", "neither"], "Tags group entries.");

  // errors
  h("errors", "medium", "Which file would you create to show 'We don't have that book' for unknown /books/[id]?", ["*app/books/[id]/not-found.tsx", "app/books/[id]/error.tsx", "app/404.tsx", "pages/404.tsx"], "Shown when the page calls notFound().");
  h("errors", "medium", "What's the difference between retry() and reset() in error.tsx?", ["*retry re-fetches and re-renders; reset re-renders without re-fetching", "They're the same", "reset reloads the page", "retry clears the cache"], "The docs recommend retry() in most cases.");

  // images
  h("images", "medium", "What does decoding=\"async\" on <Image>'s output do?", ["*Lets the browser decode the image off the main thread", "Loads it lazily", "Compresses it", "Nothing"], "Part of the generated <img>.");
  h("images", "medium", "Why does the optimizer cache resized images?", ["*Resizing is expensive; the next request for the same size reuses the result", "Browsers require it", "For SEO", "To save bandwidth on the client only"], "Stored in .next/cache/images when self-hosting.");

  // metadata
  h("metadata", "medium", "What did the generated icon (app/icon.tsx) produce in the head?", ["*<link rel=\"icon\" href=\"/icon?…\" sizes=\"32x32\" type=\"image/png\">", "A favicon.ico", "An SVG inline", "Nothing"], "Checked in the browser.");
  h("metadata", "easy", "Which type do you use for a page's static metadata?", ["*Metadata from next", "Head from next/head", "SEO from next/seo", "Meta from react"], "export const metadata: Metadata = {…}.");

  // routes
  h("routes", "medium", "What does the context (second) argument of a handler contain?", ["*params (a promise) for dynamic segments", "The request body", "The cookies", "The response"], "Type it with RouteContext.");
  h("routes", "medium", "How do you set a cookie in a Route Handler response? (select all that apply)", ["*response.cookies.set(...) on a NextResponse", "*(await cookies()).set(...) from next/headers", "document.cookie", "localStorage.setItem"], "Both work in Route Handlers.");

  // proxy
  h("proxy", "medium", "Proxy matchers must be…", ["*constants that can be analysed at build time", "functions", "computed at runtime from env vars", "regular expressions only"], "Dynamic values are ignored.");
  h("proxy", "medium", "Which of these redirect with 307 by default?", ["*NextResponse.redirect()", "redirects with permanent: true", "a rewrite", "NextResponse.next()"], "307 Temporary Redirect.");
  h("proxy", "easy", "What is the main use of a rewrite?", ["*Show different content at the same URL (A/B tests, maintenance pages)", "Change the URL in the address bar", "Block bots", "Compress responses"], "The browser keeps its URL.");

  // envauth
  h("envauth", "medium", "How should you generate SESSION_SECRET?", ["*With a random generator such as openssl rand -base64 32", "Use the app name", "Use the user's password", "Leave it empty"], "Long and random.");
  h("envauth", "medium", "Why is getCurrentUser returning { name, role } safer than returning the whole user?", ["*Nothing sensitive (email, password hash) can reach a component or the browser", "It's faster", "It's cached", "TypeScript requires it"], "That's a DTO.");

  // testing
  h("testing", "medium", "What does test.each([...]) do in Vitest?", ["*Runs the same test for each row of inputs", "Runs tests in parallel processes", "Retries failing tests", "Skips tests"], "Used for the validation cases.");
  h("testing", "medium", "Why did the capstone e2e test check the title after navigating?", ["*To verify generateMetadata output as the user sees it", "Titles are required by Playwright", "To test CSS", "To check performance"], "A real browser check.");

  // deploying
  h("deploying", "medium", "Which statement about Docker for development is in the docs?", ["*Prefer local npm run dev on Mac and Windows for better performance", "Always develop in Docker", "Docker is required", "Docker breaks Fast Refresh always"], "Docker is excellent for production.");
  h("deploying", "medium", "Which data must a standalone deployment of the capstone also contain?", ["*data/books.json (copy it or check file tracing)", "Only server.js", "The tests", "AGENTS.md"], "The app reads it at runtime.");
  h("deploying", "hard", "Why should you build once and deploy the same artifact to every instance?", ["*So build IDs, encryption keys and assets match across instances", "Builds are slow", "Next.js forbids rebuilding", "For SEO"], "Avoids version skew and action errors.");
  h("deploying", "easy", "What does output: \"export\" make next build do?", ["*Write static HTML/CSS/JS into out/", "Start a server", "Create a Docker image", "Upload to Vercel"], "Any static host can serve it.");
  h("deploying", "medium", "What does after() schedule?", ["*Work that runs after the response has been sent", "A redirect", "A cron job", "A rebuild"], "Give the server time to finish it on shutdown.");
  h("deploying", "medium", "Which feature needs a custom loader or unoptimized images in a static export?", ["*next/image optimization", "next/font", "Link", "Metadata"], "There's no server to optimize images.");

  // project
  h("project", "medium", "Which capstone file enforces the optimistic /admin check?", ["*proxy.ts", "app/admin/layout.tsx", "lib/books.ts", "next.config.ts"], "Real checks are in lib/dal.ts and the actions.");
  h("project", "easy", "Which demo account is an admin in the capstone?", ["*ada@example.com", "ben@example.com", "admin@example.com", "root@localhost"], "Ben is a reader.");
  h("project", "medium", "What does the capstone's API return for /api/books/999?", ["*{\"error\":\"not found\"} with status 404", "An empty array", "A redirect", "500"], "Checked with curl.");
  h("project", "medium", "How did the sitemap change after adding a book?", ["*It listed one more URL, because it reads the same tagged data", "It didn't change", "It was deleted", "It needed a rebuild"], "updateTag refreshed it.");
  h("project", "hard", "Which Chapter 19 feature uses .bind?", ["*Delete and mark-read buttons binding the book ID to Server Actions", "The search form", "The login form", "The sitemap"], "The action still re-checks permissions.");

  // react
  h("react", "medium", "In a Client Component, where should you read localStorage?", ["*In useEffect (after hydration)", "At the top of the module", "During render", "In a Server Component"], "localStorage doesn't exist on the server.");
  h("react", "easy", "Which hook makes an input controlled?", ["*useState holding its value, with value and onChange", "useRef only", "useEffect", "useContext"], "The value always comes from state.");

  // pages
  h("pages", "medium", "What does revalidate: 3600 in getStaticProps do?", ["*Regenerates the page at most once an hour (ISR)", "Expires the page after an hour", "Caches API calls", "Nothing"], "The build showed Revalidate 1h.");
  h("pages", "medium", "InferGetStaticPropsType<typeof getStaticProps> gives…", ["*The props type the page receives", "The params type", "A runtime validator", "The return status"], "Used with satisfies GetStaticProps.");
}
