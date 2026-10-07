# System Boundaries — Architecture Specification

## Products

1. `jatin-portfolio`: public static-first website; this repository.
2. `ikigai-web`: private multi-user client, separate repository/deployment.
3. `ikigai-api`: modular-monolith API and worker processes, separate repository/deployment.
4. `ikigai-mobile`: future native client, separate repository created when mobile work starts.

## Contracts and ownership

Portfolio owns public structured content and static rendering. Ikigai API owns dynamic user/workspace state, identity integration, private data, integrations, jobs, and controlled portfolio publishing. Mobile and web clients consume versioned API contracts. API and workers share domain modules but are separate deployable process roles. External systems are reached through adapters.

## Required invariants

- Portfolio normal rendering remains available without Ikigai/API.
- Public bundles never import private application code or contain private configuration.
- Portfolio information that does not need runtime freshness is static.
- Ikigai is tenant-aware and server-authorized; no client-only permissions.
- No source-code editing interface; publishing is allowlisted schema-backed content only.
- No feature shares credentials or databases across independently deployed products without an explicit contract.

See `context/architecture_context.md` for data/auth/security/deployment decisions and `context/implementation_roadmap.md` for delivery sequence.
