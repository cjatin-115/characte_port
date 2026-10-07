# Future Lab Boundaries

This document defines boundaries only. It does not create Lab routes, interactive modules, providers, endpoints, or client bundles.

## Static portfolio

Portfolio pages, navigation, content, project details, and fallback pages remain prerendered HTML/CSS. A future Lab experiment may add its own isolated client entry only when implemented; it must not restore global React hydration or make unrelated routes depend on JavaScript.

## Oracle — future contract

- Input is an explicit projection of public, validated portfolio content: published project descriptions, public skills, education, experience, achievements, public links, and published Field Notes.
- No filesystem traversal, arbitrary repository reads, environment variables, deployment/repository credentials, private files, user data, or internal build metadata are available to the feature.
- Provider integration, if later approved and implemented, belongs behind a separately reviewed provider boundary. Credentials must not be shipped to browser code. No provider, key, API, endpoint, database, or chat implementation exists now.
- Empty or unpublished content stays absent; this contract does not authorize inventing portfolio facts.

## Snake — future contract

- Game state, loop, input handling, rendering, assets, and persistence (if ever needed) belong to a feature-local module.
- The game must not write global route, shell, or portfolio content state and must not require global hydration.
- No game code, canvas, controls, assets, or persistence exists now.

## Loading and failure

Each future island owns its own loading/failure behavior and has a static explanation or fallback in its host page. Failure or delayed loading must not block portfolio navigation or content. Reduced-motion and keyboard/touch equivalents are required before an island ships.

## Ikigai boundary

Ikigai remains a separate control/publishing product and repository. It has no portfolio runtime dependency, API calls, authentication, or synchronization path.
