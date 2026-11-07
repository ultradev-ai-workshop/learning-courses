import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Every chapters/<name>/index.html is its own page, so `npm run build` builds them all.
const pages = { main: resolve(import.meta.dirname, "index.html") };
for (const dir of readdirSync(resolve(import.meta.dirname, "chapters"))) {
  const page = resolve(import.meta.dirname, "chapters", dir, "index.html");
  if (existsSync(page)) pages[dir] = page;
}

export default defineConfig({
  plugins: [tailwindcss()],
  build: { rollupOptions: { input: pages } },
});
