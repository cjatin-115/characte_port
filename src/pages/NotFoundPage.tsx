import { getPrimaryRoute } from '../content/routes'
import { SimplePage } from './SimplePage'

export function NotFoundPage() {
  return <SimplePage title="Page not found" index="404"><a href={getPrimaryRoute('home').path} className="text-link">RETURN HOME ↗</a></SimplePage>
}
