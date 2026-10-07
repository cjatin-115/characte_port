# Loading Experience — State and Failure Specification

## Owner constraint

Do not design or finalize loading-screen visuals until the owner provides a reference video. Never add a minimum-duration timer or artificial delay. Initial route content should render immediately from prerendered HTML.

## Future state contract

- Track critical asset/video preload independently from application shell readiness.
- States: `idle → preloading → ready | failed`; visual transition may begin only after both the video frame is ready and the app shell is ready.
- Transition has an explicit `reduced-motion` path that skips motion and reveals the application.
- Preload timeout/error/missing media yields a static fallback and leaves navigation/content available.
- State is observable for diagnostics but contains no user secrets; noncritical media never blocks readiness.

## Current implementation

No loading overlay, loading animation, client-side coordinator, or asynchronous preload is rendered. The conceptual lifecycle is covered by a small build/test-only transition contract in `scripts/loading-state-machine.mjs`; it is not shipped to browsers and does not control page visibility. Since the current site has no meaningful asynchronous resources, browser runtime remains zero-JS and static HTML is the immediate usable site. Implement a runtime coordinator only when real required assets exist and the owner provides the loading reference video.
