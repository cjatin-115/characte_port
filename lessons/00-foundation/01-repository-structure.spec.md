# Repository Structure — Foundation Specification

## Repository boundary

This checkout is the `jatin-portfolio` product repository. `ikigai-web`, `ikigai-api`, and future `ikigai-mobile` each get independent repositories; never create a shared monorepo root.

## Initial structure

```text
context/                 product, architecture, UI, standards, progress, workflow
content/                 version-controlled public content and schemas
public/                  static media and public assets
src/app/                 entry point and route shell
src/components/          small shared semantic UI primitives
src/features/            isolated page/interaction modules
src/styles/              tokens, base styles, responsive system
lessons/                 feature specifications and acceptance criteria
```

## Boundaries

- Static public content is imported/validated at build time.
- Shared shell contains navigation, footer, readiness, and route-level focus behavior.
- Lab experiments and dynamic features remain isolated and lazy loaded.
- No dashboard/API imports, shared cross-repository source, or secrets in `public/` or client environment variables.
- Future content publishing may update allowlisted data files only through a separate controlled Ikigai API workflow.

## Acceptance

Every directory has a defined purpose; public content additions do not require UI rewrites; optional features can be loaded independently; route navigation remains conventional and browser-history compatible.
