# Progress Tracker

## Current Phase
01 — Architecture and design system (foundation refactor Phase 5 complete; roadmap design-system refinement remains pending)

## Current Lesson
00-foundation and 03-public-shell

## Current Specification
`context/architecture_context.md`, `context/implementation_roadmap.md`, `lessons/00-foundation/`, `lessons/03-public-shell/01-app-shell.spec.md`, `lessons/03-public-shell/05-loading-experience.spec.md`, `lessons/07-projects/01-project-data-model.spec.md`

## Overall Completion
Architecture baseline is documented; foundation refactor Phases 1–5 and the first static public shell are implemented. Later feature-roadmap phases are not started.

## Completed
- Read all six required context files and inventoried workspace, lessons, and existing assets.
- Confirmed portfolio-only starter, with no existing app scaffold or Git metadata at the start of work.
- Initialized this as a standalone local Git repository. No remote or commit has been created.
- Established separate repository architecture and recorded ADR-001 through ADR-006.
- Documented all 17 required architecture topics and implementation roadmap.
- Updated all six mandatory context files.
- Added standalone React/TypeScript/Vite app scaffold and documented local workflow.
- Added ESLint flat config and strict TypeScript linting; development-only lint tools are excluded from the client build.
- Added structured project content with unique slug/title and safe repository URL validation.
- Foundation refactor Phase 2: introduced version-1 content documents and validation for Projects, About, Education, Experience, Achievements, Links, and Field Notes. Existing content moved without changing visible wording or project facts; Experience remains empty rather than fabricated.
- Foundation refactor Phase 2: centralized primary routes, navigation labels, metadata, route resolution, active-route checks, and prerender path discovery in `src/content/routes.ts`. Project detail routes continue deriving from project slugs.
- Foundation refactor Phase 3: split app composition, route selection, shared header/footer/project index, and page compositions into `src/app/`, `src/components/`, and `src/pages/`. `src/content/routes.ts` remains the only route registry.
- Foundation refactor Phase 3: the skip link now targets `#main-content`; every rendered page has exactly one semantic `<main id="main-content">`. Navigation and page links remain native anchors; active-route and focus styling behavior are regression-tested.
- Foundation refactor Phase 4A: removed the global browser React entry. All current routes render to static HTML at build time, use ordinary links, and load the shared stylesheet directly; no current component requires client-side state or hydration. React remains in the build-time prerender path.
- Added ADR-007: keep the current portfolio static, and add isolated client code only when a real interactive feature requires it.
- Implemented semantic responsive public shell, project index/details, about, lab/Field Notes placeholders, contact path, active navigation, and reduced-motion CSS.
- Added prerendering of primary routes and project detail routes from the structured project records, with route-specific titles.
- Kept the celestial motif CSS-based; did not add the final loading animation or artificial delay.
- Added/updated applicable lesson specifications and roadmap.
- Established reusable design tokens for color, type, spacing, content width, motion timing, and easing; interactive links meet 44px target height.
- Reviewed the supplied orbital/grain visual image and 16-page image-only moodboard; recorded their usable cues without treating moodboard loading imagery as the final loading reference.

## In Progress
- Foundation refactor Phases 1–5, Visual Polish Passes 1–2, and reference-aligned visual QA refinement are complete. Browser accessibility trees were inspected for Home and representative pages. Screenshot-based inspection at target viewports remains unavailable. Further design-system refinement can continue as a separate pass.

## Blocked
- Project source repositories beyond supplied Vetra/Seika links are not present here; do not claim unverified stacks/details/statistics.
- Owner loading-video reference is pending by instruction.

## Next Required Action
- Review the visual QA/refinement checkpoint before choosing another design or feature pass. Do not implement future Lab islands until explicitly started.

## Architectural Decisions Made
- See `architecture_context.md` ADR-001–ADR-007.
- This workspace is the independent public portfolio repository, not a monorepo.
- Portfolio uses React/TypeScript/Vite and prerenders static route files; core content has no API dependency.
- Current public routes ship static HTML/CSS without client JavaScript; React is used at build time for prerendering.
- Phase 4B defines the loading lifecycle in a build/test-only transition contract; no browser coordinator is warranted while the portfolio has no asynchronous critical resources. Failure falls through to static HTML, and reduced motion skips ENTER.
- Phase 5 adds factual route-specific SEO metadata, configurable canonical-origin handling, conditional sitemap output, permissive robots output, and a static 404. No production origin or hosting provider is configured. Security-header policy and host requirements are documented in `deployment/README.md`.
- Future Oracle and Snake boundaries are documented in `context/future_lab_boundaries.md`; neither feature is implemented. Ikigai remains unconnected.
- Visual Polish Pass 1 refined palette/type/layout tokens and responsive CSS, improved visible project-index hierarchy, active/hover/focus treatments, and project-detail styling. No content strings, routes, project records, dependencies, or runtime architecture changed.
- Visual Polish Pass 2 adapted the existing monochrome system toward warm charcoal/stone, enlarged and lightened the CSS orbital artwork, layered restrained grain and a lower fade, and strengthened thin orbital/topographic texture. The local phone screenshot is inspiration only; its watermark, text, and interface were not reused. No content or architecture changes.
- Visual QA refinement hid the decorative orbit caption below the existing mobile breakpoint to avoid hero-copy overlap. CSS geometry and contrast were inspected; exact viewport rendering remains unverified without screenshot/emulation controls.

## Design Decisions Made
- The Orbital Archive uses restrained monochrome celestial geometry and editorial layout, informed by supplied grain/orbit references.
- Tokens define display/interface/technical font roles, responsive type sizes, spacing, color, and reduced-motion timing.
- Project details stay intentionally sparse until source material is verified.
- No final loading screen until the owner supplies a reference video.

## Deferred
- Further typography/design-system refinement, downloadable resume, richer project details/case studies, Field Notes content, Lab experiments, dynamic contact API, reviews.
- Ikigai web/API repositories and implementation; vault, music, monitoring, notes, publishing, and native mobile.
- Loading visual and readiness coordinator implementation until the reference video determines timing and behavior.
- Production canonical origin and sitemap output until the owner confirms the deployed HTTPS origin; deployment-provider-specific headers until the host is selected.

## Known Bugs
- No known build/type errors. Browser accessibility trees were checked for Home and representative pages; screenshot-based visual checks at requested widths remain outstanding.
- Lab, Field Notes, and project details currently contain intentional placeholders. Deployment host and production origin remain unselected; canonical URLs and sitemap are intentionally absent until an authoritative HTTPS origin is supplied.

## Performance Issues
- Production output contains no client JavaScript assets or entry points. After visual QA refinement, CSS is 13.12 KB raw / 3.75 KB gzip (up 5.13 KB raw / 0.91 KB gzip from the 7.99 KB / 2.84 KB Phase 4A baseline for responsive editorial styling, lunar shading, grain, and linework). Compared with the Phase 3 bundle (236.96 KB raw / 73.77 KB gzip JS), browser-delivered JavaScript is removed; React remains build-time only. No field metrics or Core Web Vitals audit yet.

## Security Issues
- No secrets are present. Dynamic contact/review handling and vault are not implemented; apply their planned controls before launch.

## Files Changed Recently
- Visual QA refinement: responsive orbit-caption visibility, regression assertion, and tracker entry.
- Visual Polish Passes 1–2: design tokens, global CSS, project-index heading visibility, project-detail styling, and tracker entries. No project/content data, route architecture, dependencies, or client runtime changes.

## Last QA Result
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run test` passed: 4 content/render contract checks, 0 failures; build generated 13 route `index.html` files.
- Phase 00 baseline rerun on 2026-10-06: `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` all passed. Production output: 232.09 KB JS / 72.28 KB gzip, 7.99 KB CSS / 2.84 KB gzip; 13 route HTML files (6 primary + 7 project detail). The shell currently hydrates the complete prerendered React tree on every route via `hydrateRoot`; route markup is server-rendered first. No route or bundle behavior changed during baseline.
- Foundation refactor Phase 1: escaped all five HTML text-sensitive characters in prerendered `<title>` values; added hostile-title serialization and project-title validation regression checks. Existing project records and normal generated route titles are unchanged. Lint/typecheck/build passed; 6 tests passed. Bundle sizes and 13 emitted routes are unchanged.
- Foundation refactor Phase 2: lint/typecheck passed; all 11 tests passed including the Phase 1 hostile-title regressions; production build passed and emitted 13 route pages. Content/domain version checks and route/content snapshots pass. JS 236.77 KB raw / 73.72 KB gzip; CSS 7.99 KB raw / 2.84 KB gzip. Browser preview content trees for Home, About, and Miraaj were inspected; generated primary metadata and migrated About/Field Notes copy match expected text. No CSS, hydration, or loading changes.
- Foundation refactor Phase 3 completion pass: lint/typecheck/build passed; 15 tests passed, including skip target/landmark uniqueness, native links, current navigation state, keyboard focus CSS, responsive navigation CSS, and Phase 1/2 regressions. Build emits 13 routes (6 primary, 7 details). JS 236.96 KB raw / 73.77 KB gzip; CSS 7.99 KB raw / 2.84 KB gzip. Static review confirms the nav is an `overflow-x:auto` scroll container with non-wrapping links at <=760px, mobile footer links wrap, and no body-level overflow hiding; no CSS changes were made. Runtime checks at 320, 375, 390, 430, 760, and desktop widths were not performed: browser automation stopped because it could not determine the current Windows browser URL safely. Generated HTML and server-rendered page structure were checked instead. Hydration and loading remain unchanged.
- Foundation refactor Phase 4A: lint/typecheck/build passed; all 17 tests passed, including static-output checks for 13 routes, navigation, page content, Phase 1 escaping, Phase 2 content/routes, and Phase 3 landmarks/focus. Build output contains no `.js` assets and emits one CSS asset (7.99 KB raw / 2.84 KB gzip). Route count: 13 (6 primary, 7 project details). No current hydrated islands; `src/main.tsx` removed. CSS source and reduced-motion rules unchanged. Generated HTML, CSS, and tests were inspected. React is retained only for build-time prerendering; no loading coordinator was introduced.
- npm dependency installation reported 0 vulnerabilities.
- Foundation refactor Phase 4B: added an executable build/test-only loading transition contract for normal, failure/fallback, and reduced-motion paths. No browser loading coordinator, timer, animation, async preload, or JS asset was introduced because current routes have no meaningful asynchronous readiness work and the static site is already the fallback. Updated loading specification and tracker. Lint, typecheck, test (19 passing), and build passed. Build emits 13 HTML routes, 7 project records remain, no JS assets/entry points, and one CSS asset at 7.99 KB raw / 2.84 KB gzip. Static HTML tests confirm navigation, main content, and footer remain present without scripts.
- Foundation refactor Phase 5: route registry now supplies route-specific factual titles/descriptions and canonical paths; metadata serializer safely emits Open Graph/Twitter tags and adds canonical/og:url only for a configured HTTPS origin. Build emits a static accessible `404.html` and crawl-allowing `robots.txt`; sitemap generation is conditional on the explicit origin in `content/site.json` (currently null). Documented host-neutral deployment requirements, header policy, and isolated future Oracle/Snake boundaries. No hosting provider/domain, dependency, API, secret, runtime JS, or feature island was added. Quality gates and final measurements recorded in this phase checkpoint.
- Visual Polish Pass 1: expanded semantic color/type/layout/motion tokens and refined global editorial composition, responsive heading sizes, scrollable mobile navigation, project-index heading/rows, reading widths, footer, project detail shell, hover/focus treatments, and 320px metadata wrapping. Content text, route registry, project records, and architecture unchanged. Browser accessibility trees were inspected for Home, About, Vetra detail, and static 404. Screenshot capture/browser viewport controls were unavailable, so no pixel-level visual claim is made. Lint/typecheck/test (22 passing)/build passed; 13 routes, 7 projects, 0 JS assets. CSS 12.52 KB raw / 3.57 KB gzip.
- Visual Polish Pass 2 + visual QA/refinement: reference-driven warm monochrome art direction; prominent CSS lunar sphere with restrained contour rings and hero grain/fade; hidden mobile orbit caption to avoid overlap risk. No screenshot asset reused and no new assets/dependencies. Accessibility tree for built Home was inspected; all static guarantees and content are preserved. Screenshot capture and viewport emulation unavailable, so exact 320–1440px rendering is not confirmed. Lint/typecheck/test (22 passing)/build passed; 13 routes, 7 projects, 0 JS assets. CSS 13.12 KB raw / 3.75 KB gzip. Token contrast against page background: text 15.86:1, secondary 10.64:1, muted 7.34:1, accent 10.23:1, focus 14.35:1.
- Browser inspection confirmed home content and direct prerendered Miraaj and Seika detail routes. No console warnings/errors appeared in the inspected route. Mobile and full accessibility/performance audits not yet run.

## Do Not Repeat
- Do not infer that empty lesson placeholders contain requirements.
- Do not create Ikigai inside this portfolio repository.
- Do not fill unknown project facts with plausible-sounding content.

## Notes For Next Agent Session
- Read all six context files before architecture work.
- Continue the portfolio only in this repository; create separate product repositories for future Ikigai work.
- Update this tracker at every meaningful phase boundary.
- This local repository has no remote or commits yet; do not imply it has been published.

## Project Content Integration
- Replaced the former seven-project public set with the owner-confirmed six-project catalog; HAR System was removed. Added required `not-ready` / `draft` / `published` content states. Only Miraaj and Forecast-Buster are currently published, so the home/work index, generated detail pages, route metadata, and sitemap contain only those projects. Unknown and unpublished slugs resolve to not-found.
- Added evidence-bounded Miraaj and Forecast-Buster content and limitations based on the supplied archaeology; no production, accuracy, live-fetch, or unverified feature claims were added. Vetra, Seika, Ikigai, and Luma / LedgerOS remain in structured content as unpublished records for later work.
- Preserved the static-first build, central route registry, prerenderer, design system, and zero-browser-JS output. `npm run lint`, `npm run typecheck`, `npm test` (23 passing), and `npm run build` passed. Build emits 8 route pages (6 primary and 2 published projects), with no JavaScript assets. Validation confirms future project pages are not generated and their slugs resolve to not-found.

## Portfolio Experience + Published Project Presentation
- Refined the existing project index rows into stronger editorial entries with evidence-based summaries, verified technology text, and direct case-study links. Improved the project detail hierarchy, added data-driven previous/next links over the published project list, and tightened responsive styles without changing the design tokens or introducing assets.
- Expanded the existing Miraaj and Forecast-Buster copy using the supplied archaeology. Miraaj identifies ReelForge AI, the prototype status, verified systems/capabilities, limitations, and explicitly labels the working video-generation pipeline as owner-confirmed. Forecast-Buster identifies Forecast-Guard AI / Problem Statement 26079, its problem, dashboard/service/ML components, interface, and unverified items.
- Vetra, Seika, Ikigai, and Luma / LedgerOS remain unpublished. Static route registry and prerender output still contain only published projects. Lint, typecheck, test (23 passing), and build passed; 8 route HTML files and 0 JavaScript assets. Pixel-level viewport screenshots were not performed.
