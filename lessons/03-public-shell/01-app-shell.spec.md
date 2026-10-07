# Public App Shell — Specification

## Implemented in foundation phase

- Responsive shell with primary navigation: Home, Work, Lab, Field Notes, About, Contact.
- Route-specific static HTML for all primary pages and known project details.
- Browser-native links/history, accessible active-route state, skip link, semantic landmarks, descriptive document titles, shared footer.
- Home hero and structured project index compose the Orbital Archive foundation.
- No API is needed for normal rendering; unknown facts remain visibly unclaimed.

## Invariants

- The portfolio works with JavaScript disabled for core content because HTML is prerendered.
- Unknown project details are not fabricated; work detail links return to the index.
- No final loading visual until the owner supplies a reference.
- Shell remains usable on narrow screens, keyboard and reduced-motion settings.

## Later refinement

Mobile navigation can gain a disclosure control only if the nav no longer fits; it must expose `aria-expanded`, keyboard behavior, and a visible touch target. Add focus management for client transitions only if navigation becomes SPA-based.
