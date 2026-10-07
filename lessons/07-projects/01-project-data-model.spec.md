# Project Content Model — Specification

## Schema

Each project has a stable URL-safe unique `slug`, non-empty display `title`, a required publication `status` (`not-ready`, `draft`, or `published`), and optional verified content. The public project set contains only `published` records. Current optional case-study fields are summary, role, technologies, problem, approach, implementation, solution, outcome, limitations, and repository. Add fields only when source facts and the UI need are established.

## Validation

- Project content is version-controlled JSON and imported at build time.
- Reject invalid/duplicate slugs, empty titles, and repository links not using HTTPS GitHub URLs.
- Reject missing or unsupported publication states. Unpublished records must not enter the index, route registry, metadata, prerender output, or sitemap.
- Text is rendered as escaped text, never injected as HTML.
- Adding a project requires a content record, not a UI component edit; prerender script consumes the same record set for detail paths.
- Missing details are omitted; do not fabricate project statistics, stack, dates, or outcomes.

## Initial verified data

Project set: Miraaj, Vetra, Seika, Ikigai, Forecast-Buster, and Luma / LedgerOS. HAR System is removed. Miraaj and Forecast-Buster are published with evidence-bounded descriptions; Vetra, Seika, Ikigai, and Luma / LedgerOS remain unpublished until source evidence is sufficient. Repository URLs are retained for Vetra, Seika, and LedgerOS, but unpublished links do not render publicly.
