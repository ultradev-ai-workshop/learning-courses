// Fact questions generated from tables in the docs (and in the book): import paths, file
// conventions, cacheLife profiles, CLI commands, route symbols, status codes.
// add({ topic, difficulty, question, options, explanation, template }) — options starting with "*" are correct.

const IMPORTS = [
  ["Link", "next/link", "linking", "easy"], ["useLinkStatus", "next/link", "linking", "medium"],
  ["useRouter (App Router)", "next/navigation", "linking", "easy"], ["usePathname", "next/navigation", "layouts", "easy"],
  ["useSearchParams", "next/navigation", "linking", "easy"], ["useParams", "next/navigation", "linking", "medium"],
  ["notFound", "next/navigation", "errors", "easy"], ["redirect", "next/navigation", "mutating", "easy"],
  ["cookies", "next/headers", "mutating", "easy"], ["headers", "next/headers", "proxy", "easy"],
  ["connection", "next/server", "caching", "medium"], ["NextResponse", "next/server", "routes", "easy"],
  ["NextRequest (type)", "next/server", "routes", "easy"], ["cacheLife", "next/cache", "caching", "easy"],
  ["cacheTag", "next/cache", "revalidating", "easy"], ["updateTag", "next/cache", "revalidating", "easy"],
  ["revalidateTag", "next/cache", "revalidating", "easy"], ["revalidatePath", "next/cache", "mutating", "medium"],
  ["refresh", "next/cache", "mutating", "medium"], ["Image", "next/image", "images", "easy"],
  ["Geist (a Google font)", "next/font/google", "images", "easy"], ["localFont", "next/font/local", "images", "medium"],
  ["ImageResponse", "next/og", "metadata", "medium"], ["Metadata (type)", "next", "metadata", "easy"],
  ["MetadataRoute (type)", "next", "metadata", "medium"], ["NextConfig (type)", "next", "install", "easy"],
  ["Viewport (type)", "next", "metadata", "medium"], ["catchError", "next/error", "errors", "medium"],
  ["Form", "next/form", "project", "medium"], ["useRouter (Pages Router)", "next/router", "pages", "easy"],
  ["Head (Pages Router)", "next/head", "pages", "easy"], ["Suspense", "react", "fetching", "easy"],
  ["cache (request memoization)", "react", "fetching", "medium"], ["use", "react", "fetching", "medium"],
  ["useActionState", "react", "mutating", "medium"], ["useFormStatus", "react-dom", "mutating", "hard"],
  ["useOptimistic", "react", "mutating", "medium"], ["dynamic (lazy loading)", "next/dynamic", "serverclient", "hard"],
];
const MODULES = ["next/link", "next/navigation", "next/headers", "next/server", "next/cache", "next/image", "next/font/google", "next/og", "next", "next/router", "react", "react-dom", "next/error", "next/form", "next/head", "next/dynamic", "next/font/local"];

const FILES = [
  ["page.tsx", "The UI of a route; makes the route segment publicly accessible", "layouts"],
  ["layout.tsx", "Shared UI that wraps a segment and its children and keeps its state on navigation", "layouts"],
  ["template.tsx", "Like a layout, but re-mounted on every navigation", "layouts"],
  ["loading.tsx", "A loading fallback that wraps the page in a Suspense boundary", "fetching"],
  ["error.tsx", "An error boundary (a Client Component) for a route segment", "errors"],
  ["global-error.tsx", "An error boundary that replaces the root layout, with its own <html> and <body>", "errors"],
  ["not-found.tsx", "The UI shown when notFound() is called, or for unmatched URLs at the root", "errors"],
  ["route.ts", "An API endpoint that exports functions named after HTTP methods", "routes"],
  ["default.tsx", "The fallback for a parallel route slot", "linking"],
  ["proxy.ts", "Code that runs before requests reach your routes (formerly middleware.ts)", "proxy"],
  ["instrumentation.ts", "A register() function that runs once when a server instance starts", "deploying"],
  ["opengraph-image.tsx", "Generates the link preview image for a segment", "metadata"],
  ["robots.ts", "Generates robots.txt for crawlers", "metadata"],
  ["sitemap.ts", "Generates sitemap.xml with the site's URLs", "metadata"],
  ["icon.tsx", "Generates the app icon", "metadata"],
  ["next.config.ts", "The Next.js configuration file", "install"],
  ["next-env.d.ts", "Generated TypeScript declarations for Next.js (not edited or committed)", "install"],
  [".env.local", "Local environment variables, loaded into process.env and never committed", "envauth"],
  ["pages/_app.tsx", "The Pages Router component that wraps every page", "pages"],
  ["middleware.ts", "The deprecated name of proxy.ts", "proxy"],
];

const PROFILES = { default: ["5 minutes", "15 minutes", "never"], seconds: ["30 seconds", "1 second", "1 minute"], minutes: ["5 minutes", "1 minute", "1 hour"], hours: ["5 minutes", "1 hour", "1 day"], days: ["5 minutes", "1 day", "1 week"], weeks: ["5 minutes", "1 week", "30 days"], max: ["5 minutes", "30 days", "1 year"] };
const DURATIONS = ["1 second", "30 seconds", "1 minute", "5 minutes", "15 minutes", "1 hour", "1 day", "1 week", "30 days", "1 year", "never"];

const CLI = [
  ["next dev", "Start the development server with Fast Refresh", "install"],
  ["next build", "Create a production build: compile, type-check, prerender, print the route table", "install"],
  ["next start", "Serve the production build", "install"],
  ["next typegen", "Generate route types (PageProps, LayoutProps) without a full build", "install"],
  ["next info", "Print system and package versions for bug reports", "install"],
  ["next upgrade", "Upgrade Next.js and React to the latest version", "deploying"],
  ["npx @next/codemod@canary middleware-to-proxy .", "Rename middleware.ts to proxy.ts", "deploying"],
  ["npx vitest run", "Run the Vitest unit tests once (not in watch mode)", "testing"],
  ["npx playwright test", "Run the end-to-end tests in real browsers", "testing"],
  ["npx create-next-app@latest my-app --yes", "Create a new app with the recommended defaults", "install"],
];

const STATUS = [
  ["a Route Handler created a resource", "201", "routes"], ["a DELETE succeeded with no body", "204", "routes"],
  ["the JSON body was invalid", "400", "routes"], ["the caller isn't logged in", "401", "routes"],
  ["the user is logged in but not allowed", "403", "envauth"], ["the requested book doesn't exist", "404", "routes"],
  ["a route.ts file doesn't export the method that was called", "405", "routes"],
  ["redirects: { permanent: true } in next.config.ts", "308", "proxy"], ["NextResponse.redirect() by default", "307", "proxy"],
  ["the optimizer is asked for an image from a host not in remotePatterns", "400", "images"],
  ["notFound() runs after the response has started streaming", "200 (with a noindex meta tag)", "errors"],
];
const CODES = ["200", "201", "204", "301", "302", "307", "308", "400", "401", "403", "404", "405", "500", "200 (with a noindex meta tag)"];

export function addFacts(add, R) {
  for (const [api, mod, topic, difficulty] of IMPORTS) {
    const wrong = R.sample(MODULES.filter((m) => m !== mod), 3);
    add({ topic, difficulty, template: `${topic}-import`, question: `Where do you import \`${api.replace(/ \(.*\)$/, "")}\` from${/\(/.test(api) ? ` (${api.match(/\((.*)\)/)[1]})` : ""}?`,
      options: ["*" + mod, ...wrong], explanation: `${api.replace(/ \(.*\)$/, "")} comes from ${mod}.` });
  }
  for (const [file, purpose, topic] of FILES) {
    const wrong = R.sample(FILES.filter((f) => f[1] !== purpose), 3).map((f) => f[1]);
    add({ topic, difficulty: "easy", template: `${topic}-file`, question: `What is the \`${file}\` file for?`, options: ["*" + purpose, ...wrong], explanation: `${file}: ${purpose}.` });
    const wrongFiles = R.sample(FILES.filter((f) => f[0] !== file), 3).map((f) => f[0]);
    add({ topic, difficulty: "easy", template: `${topic}-file-name`, question: `Which file convention is this? "${purpose}"`, options: ["*" + file, ...wrongFiles], explanation: `${purpose}: that's ${file}.` });
  }
  const PROPS = ["stale", "revalidate", "expire"];
  for (const [profile, values] of Object.entries(PROFILES)) {
    PROPS.forEach((prop, i) => {
      const correct = values[i];
      add({ topic: profile === "seconds" || prop === "revalidate" ? "revalidating" : "caching", difficulty: "medium", template: "cachelife-profile",
        question: `In the built-in cacheLife("${profile}") profile, what is the ${prop} time?`,
        options: ["*" + correct, ...R.sample(DURATIONS.filter((d) => d !== correct), 3)],
        explanation: `${profile}: stale ${values[0]}, revalidate ${values[1]}, expire ${values[2]}.` });
    });
  }
  for (const [cmd, purpose, topic] of CLI) {
    add({ topic, difficulty: "easy", template: `${topic}-cli`, question: `What does \`${cmd}\` do?`,
      options: ["*" + purpose, ...R.sample(CLI.filter((c) => c[1] !== purpose), 3).map((c) => c[1])], explanation: `${cmd}: ${purpose}.` });
  }
  for (const [situation, code, topic] of STATUS) {
    add({ topic, difficulty: "medium", template: `${topic}-status`, question: `Which HTTP status fits (or results) when ${situation}?`,
      options: ["*" + code, ...R.sample(CODES.filter((c) => c !== code), 3)], explanation: `When ${situation}: ${code}.` });
  }
  const SYMBOLS = [["○", "Static: prerendered as static content"], ["◐", "Partial Prerender: a static HTML shell with dynamic server-streamed content"], ["ƒ", "Dynamic: server-rendered on demand"], ["●", "SSG: prerendered as static HTML (uses generateStaticParams or getStaticProps)"]];
  for (const [sym, meaning] of SYMBOLS) {
    add({ topic: sym === "◐" ? "caching" : "linking", difficulty: "easy", template: "route-symbol-meaning", question: `What does the symbol ${sym} mean in the route table printed by next build?`,
      options: ["*" + meaning, ...SYMBOLS.filter((s) => s[0] !== sym).map((s) => s[1])], explanation: `${sym} = ${meaning}.` });
  }
  const DIRECTIVES = [
    ['"use client"', "Marks a file as an entry point to the client bundle (a Client Component boundary)", "serverclient"],
    ['"use server"', "Marks a function, or every export of a file, as a Server Function callable from the client", "mutating"],
    ['"use cache"', "Caches the return value of an async function or component", "caching"],
    ['"use cache: private"', "Caches per user in the browser only, and may read cookies and headers", "caching"],
    ['"use cache: remote"', "Caches in a shared, durable cache handler (e.g. Redis) instead of per-instance memory", "caching"],
  ];
  for (const [d, meaning, topic] of DIRECTIVES) {
    add({ topic, difficulty: "medium", template: `${topic}-directive`, question: `What does the ${d} directive do?`,
      options: ["*" + meaning, ...DIRECTIVES.filter((x) => x[0] !== d).map((x) => x[1]).slice(0, 3)], explanation: `${d}: ${meaning}.` });
  }
}
