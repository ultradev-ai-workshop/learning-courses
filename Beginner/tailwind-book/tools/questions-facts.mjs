// Fact questions generated from tables in the Tailwind docs (and in the book): packages, CLI options,
// directives, theme namespaces, breakpoints, renamed utilities, version history.
// add({ topic, difficulty, question, options, explanation, template }) — options starting with "*" are correct.

const INTEGRATIONS = [
  ["a Vite project (or a framework built on Vite)", "@tailwindcss/vite"],
  ["a project without a JavaScript build tool, using a command", "@tailwindcss/cli"],
  ["a framework that already runs PostCSS, such as Next.js or Angular", "@tailwindcss/postcss"],
  ["a quick experiment in one HTML file, with no install", "@tailwindcss/browser (the Play CDN)"],
  ["a Next.js app using the Turbopack loader create-next-app sets up", "@tailwindcss/turbopack"],
  ["a webpack project (added in v4.2)", "@tailwindcss/webpack"],
];
const CLI = [
  ["-i, --input", "The CSS file to read (the one with @import \"tailwindcss\")"],
  ["-o, --output", "The file to write the generated CSS to"],
  ["-w, --watch", "Rebuild whenever a file changes"],
  ["-m, --minify", "Optimise and minify the output"],
  ["--optimize", "Optimise the output without minifying it"],
  ["--cwd", "The folder to start scanning from"],
  ["--map", "Write a source map"],
  ["--silent", "Print errors only (no version or timing lines)"],
];
const DIRECTIVES = [
  ["@import \"tailwindcss\"", "Imports the theme, Preflight and the utilities, each in its layer", "install"],
  ["@theme", "Defines theme variables, which also create utility classes", "theme"],
  ["@source", "Adds or excludes paths to scan, or safelists classes", "custom"],
  ["@utility", "Defines a custom utility that works with variants", "custom"],
  ["@variant", "Applies a Tailwind variant to declarations inside your own CSS", "custom"],
  ["@custom-variant", "Defines a new variant from a selector or at-rule", "custom"],
  ["@apply", "Copies the declarations of existing utilities into a CSS rule", "reusing"],
  ["@reference", "Makes a stylesheet's theme and utilities known without outputting its CSS", "reusing"],
  ["@plugin", "Loads a JavaScript plugin such as @tailwindcss/typography", "plugins"],
  ["@config", "Loads a legacy tailwind.config.js file", "upgrade"],
  ["@layer components", "Holds component classes that utilities can still override", "reusing"],
  ["@layer base", "Holds element defaults such as heading and link styles", "custom"],
];
const FUNCTIONS = [
  ["--alpha(var(--color-sky-500) / 50%)", "A colour with 50% opacity, via color-mix()", "theme"],
  ["--spacing(4)", "Four times the --spacing unit, i.e. calc(var(--spacing) * 4)", "theme"],
  ["--theme(--color-sky-500)", "The value of a theme variable (it fails the build if the variable doesn't exist)", "install"],
  ["--value(integer)", "In a functional @utility, accepts a bare integer such as the 3 in depth-3", "custom"],
  ["--modifier(integer)", "In a functional @utility, reads the part after a slash, such as /60", "custom"],
  ["--default(4)", "In a functional @utility (v4.3), the value used when the class has no suffix", "custom"],
];
const NAMESPACES = [
  ["--color-*", "bg-*, text-*, border-*, fill-* and every other colour utility"],
  ["--font-*", "font-family utilities such as font-sans"],
  ["--text-*", "font-size utilities such as text-xl"],
  ["--font-weight-*", "font-weight utilities such as font-bold"],
  ["--tracking-*", "letter-spacing utilities such as tracking-wide"],
  ["--leading-*", "line-height utilities such as leading-tight"],
  ["--breakpoint-*", "responsive variants such as sm:"],
  ["--container-*", "container query variants such as @sm: and sizes such as max-w-md"],
  ["--radius-*", "border-radius utilities such as rounded-lg"],
  ["--shadow-*", "box-shadow utilities such as shadow-md"],
  ["--blur-*", "blur filter utilities such as blur-md"],
  ["--ease-*", "transition-timing-function utilities such as ease-out"],
  ["--animate-*", "animation utilities such as animate-spin"],
  ["--perspective-*", "perspective utilities such as perspective-near"],
  ["--aspect-*", "aspect-ratio utilities such as aspect-video"],
  ["--text-shadow-*", "text-shadow utilities such as text-shadow-sm"],
];
const BREAKPOINTS = [["sm", "40rem (640px)"], ["md", "48rem (768px)"], ["lg", "64rem (1024px)"], ["xl", "80rem (1280px)"], ["2xl", "96rem (1536px)"]];
const CONTAINERS = [["@3xs", "16rem"], ["@2xs", "18rem"], ["@xs", "20rem"], ["@sm", "24rem"], ["@md", "28rem"], ["@lg", "32rem"], ["@xl", "36rem"], ["@2xl", "42rem"], ["@3xl", "48rem"], ["@4xl", "56rem"], ["@5xl", "64rem"], ["@6xl", "72rem"], ["@7xl", "80rem"]];
const RENAMES = [
  ["shadow-sm", "shadow-xs"], ["shadow", "shadow-sm"], ["drop-shadow-sm", "drop-shadow-xs"], ["blur-sm", "blur-xs"], ["blur", "blur-sm"],
  ["rounded-sm", "rounded-xs"], ["rounded", "rounded-sm"], ["outline-none", "outline-hidden"], ["ring", "ring-3 ring-blue-500"],
  ["bg-gradient-to-r", "bg-linear-to-r"], ["flex-shrink-0", "shrink-0"], ["flex-grow", "grow"], ["overflow-ellipsis", "text-ellipsis"],
  ["decoration-slice", "box-decoration-slice"], ["bg-opacity-50 bg-black", "bg-black/50"], ["!font-bold", "font-bold!"], ["bg-[--brand]", "bg-(--brand)"],
  ["backdrop-blur", "backdrop-blur-sm"], ["start-0", "inset-s-0"],
];
const FEATURES = [
  ["text-shadow-* utilities", "4.1"], ["mask-* utilities", "4.1"], ["wrap-break-word and wrap-anywhere", "4.1"], ["pointer-fine: and pointer-coarse: variants", "4.1"],
  ["@source inline() safelisting", "4.1"], ["user-valid: and user-invalid: variants", "4.1"], ["the mauve, olive, mist and taupe colours", "4.2"],
  ["logical block utilities such as pbs-* and mbe-*", "4.2"], ["inset-s-* and inset-e-* (replacing start-* and end-*)", "4.2"], ["font-features-[…]", "4.2"],
  ["scrollbar-thin, scrollbar-thumb-* and scrollbar-track-*", "4.3"], ["@container-size", "4.3"], ["zoom-* utilities", "4.3"], ["tab-* (tab-size) utilities", "4.3"],
  ["stacked @variant such as @variant hover:focus", "4.3"], ["--default() in functional utilities", "4.3"], ["the --silent CLI option", "4.3"],
];
const VIEWPORT = [["h-screen", "100vh"], ["h-dvh", "100dvh (dynamic: changes as browser bars show and hide)"], ["h-svh", "100svh (small: with browser bars visible)"], ["h-lvh", "100lvh (large: with browser bars hidden)"]];
const LAYERS = [["theme", "the design tokens as CSS variables on :root"], ["base", "Preflight and your element defaults"], ["components", "your reusable component classes"], ["utilities", "the generated utility classes"]];
const PROSE = [["prose", "Adds typography styles to all HTML inside it"], ["prose-lg", "Makes the prose typography larger"], ["prose-slate", "Uses the slate grey scale for prose text"], ["dark:prose-invert", "Light prose text on dark backgrounds in dark mode"], ["not-prose", "Opts a block out of the prose styles"], ["max-w-none", "Removes the 65ch maximum width of prose"], ["prose-a:text-sky-700", "Colours links inside prose"], ["prose-headings:font-serif", "Changes the font of headings inside prose"]];

export function addFacts(add, R) {
  const one = (topic, difficulty, question, correct, pool, explanation, template) => {
    const wrong = R.shuffle(pool.filter((x) => x !== correct)).slice(0, 3);
    add({ topic, difficulty, question, options: ["*" + correct, ...wrong], explanation, template });
  };
  for (const [what, pkg] of INTEGRATIONS) one("install", "easy", `Which package plugs Tailwind into ${what}?`, pkg, INTEGRATIONS.map((x) => x[1]), `${pkg} is the integration for ${what}.`, "install-package");
  for (const [flag, does] of CLI) {
    one("install", "medium", `What does the Tailwind CLI option ${flag.split(", ").map((f) => "`" + f + "`").join(" / ")} do?`, does, CLI.map((x) => x[1]), `${flag}: ${does}.`, "install-cli");
    one("install", "medium", `Which CLI option should you use to: ${does.toLowerCase()}?`, flag, CLI.map((x) => x[0]), `${flag}: ${does}.`, "install-cli-r");
  }
  for (const [dir, does, topic] of DIRECTIVES) {
    one(topic, "medium", `What does \`${dir}\` do?`, does, DIRECTIVES.map((x) => x[1]), `${dir}: ${does}.`, `${topic}-directive`);
    one(topic, "medium", `Which directive ${does.charAt(0).toLowerCase() + does.slice(1).replace(/^defines/, "defines")}?`, dir, DIRECTIVES.map((x) => x[0]), `${dir}: ${does}.`, `${topic}-directive-r`);
  }
  for (const [fn, does, topic] of FUNCTIONS) one(topic, "hard", `What does \`${fn}\` mean in Tailwind's CSS?`, does, FUNCTIONS.map((x) => x[1]), `${fn}: ${does}.`, `${topic}-function`);
  for (const [ns, utils] of NAMESPACES) {
    one("theme", "medium", `A theme variable in the \`${ns}\` namespace creates which utilities?`, utils, NAMESPACES.map((x) => x[1]), `${ns} → ${utils}.`, "theme-namespace");
    one("theme", "medium", `To add a new value for ${utils.split(" such as ")[0].replace(" and every other colour utility", "")}, which namespace do you use in @theme?`, ns, NAMESPACES.map((x) => x[0]), `${ns} → ${utils}.`, "theme-namespace-r");
  }
  for (const [bp, size] of BREAKPOINTS) one("responsive", "easy", `At what minimum width does the \`${bp}:\` variant start to apply?`, size, BREAKPOINTS.map((x) => x[1]), `${bp}: is @media (width >= ${size.split(" ")[0]}).`, "responsive-bp");
  for (const [v, size] of CONTAINERS) one("modern", "medium", `The container variant \`${v}:\` applies when the container is at least…`, size, CONTAINERS.map((x) => x[1]), `${v}: is @container (width >= ${size}).`, "modern-container");
  for (const [old, now] of RENAMES) one("upgrade", "medium", `In v3 you wrote \`${old}\`. What do you write in v4 for the same result?`, now, RENAMES.map((x) => x[1]), `v3 ${old} → v4 ${now} (Appendix A).`, "upgrade-rename");
  for (const [feat, ver] of FEATURES) add({ topic: ver === "4.3" ? "modern" : ver === "4.2" ? "spacing" : "effects", difficulty: "hard", question: `Which Tailwind release added ${feat}?`, options: ["*" + ver, ...["4.0", "4.1", "4.2", "4.3"].filter((v) => v !== ver).slice(0, 3)], explanation: `${feat} arrived in Tailwind CSS ${ver}.`, template: "version" });
  for (const [cls, css] of VIEWPORT) one("spacing", "medium", `What height does \`${cls}\` set?`, css, VIEWPORT.map((x) => x[1]), `${cls} = ${css}.`, "spacing-viewport");
  for (const [layer, holds] of LAYERS) one("what", "easy", `What does the \`${layer}\` layer of Tailwind's output contain?`, holds, LAYERS.map((x) => x[1]), `@layer ${layer}: ${holds}. The order is theme, base, components, utilities.`, "what-layer");
  for (const [cls, does] of PROSE) one("plugins", "easy", `With the Typography plugin, what does \`${cls}\` do?`, does, PROSE.map((x) => x[1]), `${cls}: ${does}.`, "plugins-prose");
}
