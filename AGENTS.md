<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## What this is

Single Next.js 16 App Router app (not a monorepo). App code lives in `src/app/` — the stock `README.md` still says `app/page.tsx` and is otherwise unedited create-next-app boilerplate; trust the code, not the README.

## Commands

- `npm run dev` — Turbopack dev server. Also (re)writes the auto-generated block above; expect that diff and commit it.
- `npm run lint` — `eslint` (flat config, `eslint-config-next/core-web-vitals` + `/typescript`). No file args needed.
- `npx tsc --noEmit` — typecheck. There is **no** `typecheck` or `test` script, and no test framework, CI, or pre-commit hooks exist. Don't invent one; verification is `lint` + `tsc --noEmit` (+ `npm run build` if behavior matters).

## Configured Next 16 features (see `next.config.ts`)

- `cacheComponents: true` — uncached data reads outside `<Suspense>` fail the build/prerender (and hooks like `usePathname` may require a Suspense boundary). Read `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components*` before touching data fetching or adding Suspense boundaries.
- `reactCompiler: true` — React Compiler runs via `babel-plugin-react-compiler`; no manual memoization needed.
- Tailwind v4 is CSS-first: no `tailwind.config` file. Styles live in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`, custom variants) and load through a Turbopack rule (`@tailwindcss/turbopack`). Style changes go in that CSS, not a JS config.

## UI components (shadcn, Base UI variant)

- `components.json` uses shadcn style **`base-nova`**: primitives come from `@base-ui/react` (Base UI), **not Radix** — e.g. `src/components/ui/button.tsx` imports `@base-ui/react/button`. Don't paste Radix-based examples from older tutorials.
- Add components with the CLI against this config: `npx shadcn add <component>` instead of hand-writing them.
- `cn` comes from the `cn` npm package, re-exported by `src/lib/utils.ts`. Existing code imports it as `import { cn } from "cn"` — match that.
- Path alias `@/*` → `src/*` (`tsconfig.json`).
- `src/components/ui/` is shadcn-owned generated-style code — prefer adding a new component over editing these primitives.
