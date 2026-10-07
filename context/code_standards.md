# Code Standards

## General

Prefer simple, readable, strictly typed code. Validate data at boundaries. Keep components and modules focused; avoid `any`, unsafe casts, duplicate contracts, and giant files.

## Repository and data

Respect independent repository boundaries. Keep the portfolio static-first and Ikigai API contracts versioned. Store public portfolio facts as schema-validated structured content. Never hardcode unverified details. Never allow a content editor to write arbitrary source paths.

## Security

No secrets in frontend code, logs, URLs, analytics, or cloud AI context. Every private endpoint authenticates, authorizes against the resource, validates, handles errors, and applies limits. Do not trust the client for identity/ownership. Encrypt sensitive data before persistence per the vault design; no implementation should claim zero-knowledge until reviewed.

## Frontend

Use semantic HTML, native controls, design tokens, explicit focus, and reduced-motion variants. Use links for navigation, isolate/lazy-load optional heavy features, and optimize media/fonts. Avoid arbitrary CSS values and unnecessary client state/effects.

## API and workers

Use typed, safe errors; timeouts and bounds for external calls; idempotency for retried jobs; provider adapters; tenant-scoped persistence; and non-secret structured observability. Defend outbound URL fetches against SSRF.

## Verification and docs

Run checks relevant to the phase and state exactly what ran. Security-sensitive behavior needs focused tests. Do not claim visual/performance QA without evidence. Record decisions rather than obvious code. Update progress tracker after meaningful phases, ADR log when architecture changes, and the relevant spec as a feature is completed.
