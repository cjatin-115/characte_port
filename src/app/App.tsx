import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { RouteView } from './RouteView'

export default function App({ pathname = '/' }: { pathname?: string }) {
  const path = pathname.replace(/\/$/, '') || '/'
  return <><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader path={path} /><RouteView path={path} /><SiteFooter /></>
}
