# Development Tooling

## Runtime and package management

- Node.js 20.19+ and npm; commit `package-lock.json` and use `npm ci` in clean CI environments.
- React + TypeScript + Vite. Strict type checking runs as part of production builds.
- ESLint with ESLint recommended and typescript-eslint recommended flat configurations; lint source, build scripts, and config.
- Use Node's built-in test runner for build/content contract checks; no test framework dependency is needed for the initial schema and generated route checks.

## Commands

- `npm run dev` — local preview.
- `npm run lint` — lint code/config/scripts.
- `npm run typecheck` — strict TypeScript check.
- `npm run test` — build and verify structured content and prerendered routes.
- `npm run build` — production bundle and static prerender.
- `npm run preview` — inspect production output.

## Dependency discipline

ESLint/typescript-eslint are development-only and do not enter the browser bundle. React, React DOM, TypeScript, Vite, and the Vite React plugin are the only application/toolchain dependencies so far. Evaluate any new runtime package for user value, accessibility, maintenance/security, and compressed bundle cost.
