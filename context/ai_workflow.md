# AI Workflow

## Role and source of truth

Implement only the active phase in `context/implementation_roadmap.md` and the relevant `lessons/**/*.spec.md`. The user's Orbital Archive brief and six context files are authoritative. Treat unknown project details as unknown; inspect project source where available rather than guessing.

## Before architectural work

Read all six files in `context/`: project overview, architecture context, AI workflow, UI context, code standards, and progress tracker. Read the active specification and inspect existing files/architecture. Identify security, accessibility, and performance effects before implementation.

## Workflow

1. Define repository boundary and active phase.
2. Record architecture decisions before substantial code.
3. Implement the smallest maintainable, accessible increment.
4. Verify with checks appropriate to the change; never claim a check that was not run.
5. Update `progress_tracker.md` after every meaningful phase.
6. Record architecture changes in the decision log; record visual-system changes in `ui_context.md`.

## Rules

- No monorepo. No private/dashboard imports in public portfolio.
- Do not invent experience, achievements, links, project technologies, or statistics.
- No secrets in source, browser bundles, logs, or AI prompts; never send vault values to a cloud model.
- Do not silently add major dependencies or change architecture.
- Do not create giant components, arbitrary source rewriting, or artificial loading delays.
- Keep feature modules isolated; load AI, Snake, audio, and heavy visuals only when requested.
- Respect keyboard, screen reader, reduced-motion, touch, and mobile performance needs.
- Do not build future features merely because they are described in the product vision.
- Loading video visual is deferred until the owner supplies a reference.
