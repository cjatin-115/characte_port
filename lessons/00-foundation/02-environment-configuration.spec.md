# Environment Configuration

- Core public pages require no runtime environment variables or API secrets.
- `.env` files are ignored; `.env.example` is allowed only for documented local public/build settings and contains placeholders, never credentials.
- Do not expose secrets through `VITE_*` variables; Vite client variables are public bundle data.
- Later dynamic service endpoints/config belong in the separate API/client deployment with server-side secret management.
- Static build remains deterministic from committed content and a locked npm dependency tree.
