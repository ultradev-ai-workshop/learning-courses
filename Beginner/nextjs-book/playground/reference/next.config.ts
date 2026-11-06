import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // create-next-app sets this to true. With Next.js 16.4.5 we saw pages lose their <title> after an
  // updateTag when the first request was a client navigation (see Chapter 19, "A note on Partial
  // Prefetching"). Set it back to true on a newer version and run `npm run test:e2e` to check.
  partialPrefetching: false,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
