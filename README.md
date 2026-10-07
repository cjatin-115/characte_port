# Jatin Choudhary — Portfolio

The public portfolio is a standalone, static-first product repository. Ikigai web, API, and future mobile application belong in separate repositories.

## Local development

Requires Node.js 20.19 or newer and npm.

```sh
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

`npm run build` type-checks, builds the CSS asset, and prerenders public routes into `dist/`. React is used only by the build-time renderer; the public output has no JavaScript bundle. For a rendered local preview, run `npm run build` followed by `npm run preview`; the Vite source dev server does not render the React pages because there is intentionally no browser JavaScript entry. `npm run test` rebuilds and checks content, route, metadata, and emitted static files. See [deployment/README.md](deployment/README.md) for the host-agnostic output contract, 404 behavior, canonical-origin setup, and security-header guidance. No API, secrets, or environment variables are needed to build or render core portfolio routes.

## Content

Project records live in the versioned `content/projects.json` document and are validated at module/build time in `src/content/projects.ts`. Each record has a publication state (`not-ready`, `draft`, or `published`); only published records appear in the public index, project routes, prerender output, or sitemap. Keep unsupported details absent until verified. Public case studies currently include Miraaj and Forecast-Buster; Vetra, Seika, Ikigai, and Luma / LedgerOS remain unpublished.

## Architecture and scope

Read all six files under `context/` before architecture work. See `context/architecture_context.md` for decisions and `context/implementation_roadmap.md` for phase boundaries. Feature specifications live in `lessons/`. Future interactive Lab boundaries are documented in `context/future_lab_boundaries.md`; they do not represent implemented features.
