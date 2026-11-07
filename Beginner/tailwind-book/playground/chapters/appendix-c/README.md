# Appendix C: Tailwind with React

Create a React app next to this file and port the `Button` from Appendix C:

```bash
npm create vite@latest react-app -- --template react-ts
cd react-app
npm install tailwindcss @tailwindcss/vite clsx tailwind-merge
```

Then add `tailwindcss()` to `vite.config.ts` and `@import "tailwindcss";` to `src/index.css`.
