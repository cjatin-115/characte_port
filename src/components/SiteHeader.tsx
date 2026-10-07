import { getPrimaryRoute, isNavigationRouteActive, navigationRoutes } from '../content/routes'

export function SiteHeader({ path }: { path: string }) {
  return (
    <header className="site-header">
      <a className="wordmark" href={getPrimaryRoute('home').path} aria-label="Jatin Choudhary, home">JC<span>®</span></a>
      <nav aria-label="Primary navigation">
        {navigationRoutes.map((item) => (
          <a key={item.path} href={item.path} aria-current={isNavigationRouteActive(item.key, path) ? 'page' : undefined}>
            {item.navLabel}
          </a>
        ))}
      </nav>
      <span className="header-index">INDEPENDENT PRACTICE</span>
    </header>
  )
}
