import { resolveRoute } from '../content/routes'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { FieldNotesPage } from '../pages/FieldNotesPage'
import { HomePage } from '../pages/HomePage'
import { LabPage } from '../pages/LabPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProjectDetailPage } from '../pages/ProjectDetailPage'
import { WorkPage } from '../pages/WorkPage'

export function RouteView({ path }: { path: string }) {
  const resolved = resolveRoute(path)
  if (resolved.kind === 'project') return <ProjectDetailPage slug={resolved.slug} />
  if (resolved.kind === 'not-found') return <NotFoundPage />

  switch (resolved.route.key) {
    case 'home': return <HomePage />
    case 'work': return <WorkPage />
    case 'lab': return <LabPage />
    case 'field-notes': return <FieldNotesPage />
    case 'about': return <AboutPage />
    case 'contact': return <ContactPage />
  }
}
