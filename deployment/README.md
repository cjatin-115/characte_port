# Static deployment contract

This repository does not select a hosting provider. `npm run build` writes the deployable static site to `dist/`; there is no deployment command and no server/API requirement.

The deployment must serve the site at the origin root because generated asset, route, and robots paths are root-relative. It must support directory-index URLs (for example `/about/` from `dist/about/index.html`) and serve `dist/404.html` as a not-found document with an actual 404 response. Do not configure a single-page-app fallback to `index.html`.

No authoritative production origin is currently configured. Set `canonicalOrigin` in `content/site.json` to the confirmed HTTPS origin, with no path, query, or fragment, before release. Until then, canonical and `og:url` tags are omitted and the build does not emit a sitemap. When configured, the build uses that origin for route canonicals, `og:url`, and the 13-entry sitemap. `robots.txt` always allows public crawling and references the sitemap only when its URL is known.

No secrets, API keys, or runtime/build environment variables are required. Do not place credentials in this static repository or expose them through client assets.

## Header policy for the selected host

Configure headers in the eventual host's settings after verifying its syntax and behavior. The current site emits no browser JavaScript and uses same-origin CSS plus a CSS `data:` texture. A compatible starting policy is:

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'none'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Apply HSTS only after HTTPS is enabled and every included subdomain is confirmed HTTPS-ready. No host-specific header file is committed until a deployment provider is selected. Recheck CSP if a future feature adds external media, styles, scripts, forms, or connections.
