# Architecture Context

## Product and repository boundaries

These are separate deployable repositories, never a monorepo:

- `jatin-portfolio` — this workspace; public, static-first portfolio.
- `ikigai-web` — private, independently deployable multi-user web client.
- `ikigai-api` — independently deployable modular-monolith API and worker entry points.
- `ikigai-mobile` — a later native mobile application; do not create it until mobile work begins.

The portfolio renders without Ikigai, credentials, or a runtime API. Static public content lives in version-controlled structured files. Dynamic endpoints are limited to features that need them (contact, moderated reviews, and an explicitly isolated AI interaction). No project imports private dashboard code.

## 1. System boundaries and deployment

Each repository owns its dependencies, CI, release, and deployment. The portfolio is a static site on a CDN; Ikigai web is a separately deployable browser client; the API and worker are separate processes from the same modular-monolith codebase. Local development may use a compose file within the API repository, never at a shared monorepo root. Environments are development, staging, and production with separate secrets and data.

## 2. Dependency strategy

Portfolio foundation: TypeScript, React, and Vite, with minimal runtime dependencies. Use browser APIs and CSS/SVG before adding animation, routing, or state libraries. ESLint/typescript-eslint and Node's built-in test runner are development-only checks and do not enter the public bundle. The current Node engine floor is 20.19. Add a dependency only for a concrete requirement, documenting its maintenance/security cost and bundle impact. Keep project content and schemas framework independent. Ikigai API initially uses a typed Node.js service (Fastify), PostgreSQL driver/migration tooling, and explicit module interfaces; avoid microservices and broad provider SDKs. Re-evaluate framework choices when the relevant repository is created, without silently changing these boundaries.

## 3. Frontend architecture

Portfolio routes: `/`, `/work`, `/work/:slug`, `/lab`, `/field-notes`, `/about`, `/contact`. Use static generation/pre-rendering, real links, browser history, and conventional semantic document structure. The current shell, navigation, and pages are emitted as HTML and CSS without a client-side React entry or global hydration; React is used by the build-time prerenderer. Add isolated client code only when an implemented feature requires interaction. Route content is split into small page and feature modules. Future interactive Lab experiments, AI, Snake, and media must be isolated from the static shell; see `context/future_lab_boundaries.md`. Loading readiness tracks actual required resources; no artificial delay and no final bespoke loading animation until the owner supplies a reference video. SEO metadata remains derived from the route registry; canonical URLs and sitemap output require an explicitly configured HTTPS origin. Host-specific deployment headers are documented only after a host is selected. Ikigai web has its own repository, authenticated route shell, and API client; it does not share portfolio bundles.

## 4. Backend architecture

Ikigai API is a modular monolith with explicit auth, users, workspaces, projects, integrations, portfolio publishing, monitoring, messages, reviews, vault, music, notes, notifications, storage, and workers modules. Modules own validation, application services, persistence interfaces, and public contracts. HTTP handlers authenticate/authorize, validate at boundaries, apply limits, then call a module service. Provider APIs are behind adapters. Long-running publishing, health checks, media processing, and notifications run as jobs with idempotency and bounded retries. Start only modules required by an implemented feature.

## 5. Database architecture

PostgreSQL is the source of truth for multi-user, relational product data. Every tenant-owned row carries an owner/workspace key; queries and authorization enforce that boundary. Use migrations, foreign keys, unique constraints, transactions, and soft deletion only where recovery/audit requirements justify it. Redis is optional and deferred until measured needs for distributed rate limits, ephemeral jobs, or caching. Search starts with PostgreSQL full-text/searchable safe metadata; no separate vector database until a specific use case and privacy review warrant it. Static portfolio content stays in Git, not the database.

## 6. Storage architecture

Private user uploads and media use a `StorageProvider` interface with object key, metadata, streaming, deletion, and signed-access operations. Begin with an S3-compatible provider; add per-user Google Drive only through OAuth and an adapter when a feature needs it. Store provider credentials encrypted, scope OAuth access narrowly, and avoid exposing provider tokens to browsers. Postgres stores references and ownership metadata, not large binaries. Vault records are encrypted client-side before persistence and are never sent to object storage as plaintext.

## 7. Authentication architecture

Ikigai API owns authentication. Use a vetted OIDC/identity provider adapter or established auth library rather than custom password cryptography. Issue opaque, rotated server sessions in `HttpOnly`, `Secure`, `SameSite` cookies; protect state-changing cookie-authenticated requests against CSRF. Support MFA/passkeys through the identity layer. Hash session tokens at rest, expire and revoke sessions, rate-limit authentication, and audit security events without secrets. Keep auth provider replaceable and separate from application user IDs.

## 8. Authorization model

Default deny. Every private endpoint independently authenticates and checks an explicit permission against the requested user/workspace and resource. Start with owner and member roles, with feature-level permissions where needed. Never trust client claims for resource ownership, role, tenant, or vault access. Enforce tenant scope in service/repository methods as well as handlers; use database row-level security only as defense in depth after deployment behavior is verified. Publishing, integrations, and vault operations require narrower explicit permissions.

## 9. Integration architecture

Each connection is per user/workspace and provider, with encrypted credentials, granted scopes, status, external account identity, and rotation/revocation state. GitHub, Vercel, Render, UptimeRobot, Google, email, and storage live behind narrow provider adapters. Handle OAuth state/PKCE, signed webhook validation, retries, quotas, timeouts, and provider errors centrally. Never scatter vendor API calls through UI or domain logic. Show stale data with its last-checked time.

## 10. Vault threat model

Threats include account/session takeover, malicious browser extensions or XSS, weak PIN guessing, lost devices, malicious server/database operators, backup exposure, clipboard leakage, and accidental logging. Server-side storage contains only authenticated ciphertext, non-secret envelope/version metadata, and a minimal audit trail; semantic index fields are explicitly non-secret and user-reviewed. Derive a key-encryption key from a user-entered PIN/passphrase with Argon2id (parameterized and versioned), use a fresh random salt, and wrap a random vault data key; encrypt each record with a vetted authenticated-encryption implementation (WebCrypto AES-GCM with unique random nonces, or a reviewed library where required). Provide an offline recovery key and explain that forgotten credentials without recovery mean data loss. Biometrics only unlock a platform-protected key; never collect biometric templates. Add exponential server-side attempt throttling, short auto-lock, no secret logs/analytics, reveal-on-demand, clipboard clearing where supported, and audit metadata without values. XSS in an unlocked client remains a critical residual risk. Complete independent security review and tests before storing real credentials.

## 11. Content publishing architecture

Portfolio content is schema-validated, version-controlled data files. Ikigai edits only allowlisted content types/fields through versioned schemas; it cannot write arbitrary repository paths or source. A dedicated publishing service creates a content-only commit/branch using a least-privilege GitHub App installation token, validates generated changes, and pushes through a controlled workflow. Deployment remains the repository's existing CI/CD responsibility. Record actor, diff, commit, and outcome. Require preview/review or owner confirmation for publication, prevent path traversal, and never accept executable content. The portfolio remains available if Ikigai or GitHub is unavailable.

## 12. Monitoring architecture

Configured website targets belong to a user/workspace and refer to optional GitHub/Vercel/Render/UptimeRobot connections. Provider adapters gather repository/deployment facts; a scheduled worker performs bounded HTTP/TLS checks and persists timestamped outcomes, response time, status, and incidents. Use per-target intervals, egress allowlists/SSRF defenses, redirect revalidation, DNS/IP checks, timeouts, and response-size limits to prevent probing private networks. Monitoring APIs return stale status honestly and never block portfolio rendering.

## 13. Mobile architecture plan

Create `ikigai-mobile` separately when implementation begins, using React Native/Expo only after confirming native media-control, secure-storage, biometric, background playback, and notification requirements against platform capabilities. It starts at a feature launcher (Portfolio, Projects, Music, Notes, Messages, Vault), then opens dedicated touch-first feature screens. Consume stable versioned API contracts; isolate platform adapters for keychain/keystore, media session, notifications, and offline queue. Native app is not a web wrapper; support one-handed use, reduced battery/network usage, offline states, and per-platform review.

## 14. Performance strategy and budgets

Public routes are static-first with CDN caching and no third-party scripts by default. Starting budgets for the initial route: initial compressed JS <= 150 KB, CSS <= 50 KB, fonts <= 120 KB, hero image <= 250 KB; LCP <= 2.5 s, CLS <= 0.1, INP <= 200 ms at p75 on representative mobile. Treat these as measurable budgets to refine from actual builds and field data. Use responsive AVIF/WebP imagery with dimensions, subset/self-hosted WOFF2 fonts, code splitting, lazy media/experiments, and no idle animation loops. Private dashboard/API data is private/no-store unless explicitly cache-safe; media uses private short-lived signed access. Measure before adding caches or heavy animation.

## 15. Accessibility strategy

Semantic HTML and native controls first. All routes and menus work with keyboard and visible focus; route changes announce headings and manage focus without trapping it. Provide skip navigation, labels, field errors, status announcements, adequate contrast and touch targets. Motion is optional and respects `prefers-reduced-motion`; touch users receive equivalents for hover behaviors. Canvas experiments have textual instructions and controls; essential content never exists only in canvas. Test at narrow viewport sizes and with keyboard/screen-reader checks.

## 16. Deployment architecture

Deploy portfolio static assets independently to CDN hosting (provider selected by repository setup) with immutable hashed assets, cacheable HTML policy, CSP/security headers, and preview deploys. Deploy Ikigai web/API/worker independently, with managed PostgreSQL, object storage, secrets manager, database backups, migration gates, health probes, and rollback. Keep staging/prod identities and data separate. Pin runtimes and lock dependencies; CI runs lint/typecheck/tests/build/security and deployment checks. Do not couple portfolio availability to dashboard deployment.

## Architecture decision log

| ID | Decision | Reason | Revisit when |
|---|---|---|---|
| ADR-001 | Separate repositories for portfolio, Ikigai web, Ikigai API, and later mobile | Independent deployment and product lifecycles are mandatory | Never combine into a monorepo |
| ADR-002 | Static-first portfolio content in version-controlled structured files | Fast rendering and no runtime dashboard dependency | Dynamic content requirement is demonstrated |
| ADR-003 | Ikigai backend starts as a modular monolith | Strong boundaries without premature service operations | A module needs independent scaling/ownership |
| ADR-004 | PostgreSQL is product-data source of truth; object storage behind an interface | Relational consistency and provider portability | Measured scale or product requirement warrants alternatives |
| ADR-005 | Vault client encrypts data before server persistence | Minimize plaintext exposure to the server | Cryptographic/security review finds a safer compatible design |
| ADR-006 | No final loading visual until supplied reference video | Explicit owner direction | Reference arrives |
| ADR-007 | Portfolio routes remain static HTML/CSS with no global React hydration until a real interactive feature needs client behavior | Current pages use native links and have no state, effects, or browser-only interactions | An implemented feature demonstrates a client-side requirement; isolate it as an island |
| ADR-008 | Canonical URLs and sitemap are emitted only when an explicit HTTPS origin is configured; deployment remains host-agnostic until a provider is selected | No authoritative production domain or hosting provider is present in the repository | Configure the verified origin and provider-specific headers during deployment |

Changes to these decisions require an ADR update and a progress-tracker entry.
