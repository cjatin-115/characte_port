import { links } from '../content/links'
import { getPrimaryRoute } from '../content/routes'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="wordmark" href={getPrimaryRoute('home').path}>JC<span>®</span></a>
      <span>DESIGNED IN CURIOSITY · BUILT WITH INTENTION</span>
      <div className="footer-links">
        {links.filter((link) => link.external).map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
        ))}
      </div>
    </footer>
  )
}
