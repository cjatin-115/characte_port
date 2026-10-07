# Project Initialization — Foundation Specification

## Objective

Establish a maintainable, independently deployable public portfolio application in this repository. This is not a monorepo and does not contain Ikigai.

## Scope

- Keep six required context files and architecture roadmap at repository root.
- Use TypeScript + React + Vite for the static-first client, with strict type checking and minimal dependencies.
- Static output must be deployable to CDN/static hosting; dynamic API calls are not required for core page rendering.
- Add environment example/documentation without credentials; no secret configuration in client bundles.
- Provide a small runnable shell only after architecture choices are recorded.

## Acceptance

- Repository purpose and boundaries are explicit.
- Install, development, typecheck, lint, and build workflows are documented and reproducible.
- No Ikigai code, credentials, fabricated content, or unexplained heavy dependencies.
- App shell is semantic, responsive, keyboard usable, and respects reduced motion.
- Progress tracker records the phase outcome and checks actually run.
