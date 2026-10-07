import { projects } from './projects'
import { canonicalOrigin } from './site'

const homeDescription = 'Jatin Choudhary is a computer engineering student building software prototypes across AI-assisted creative workflows and machine-learning applications.'

export const primaryRoutes = [
  { key: 'home', path: '/', title: 'Jatin Choudhary — Computer Engineering Student', description: homeDescription, navLabel: 'Home' },
  { key: 'work', path: '/work', title: 'Work — Jatin Choudhary', description: 'A project index featuring software work by Jatin Choudhary.', navLabel: 'Work' },
  { key: 'lab', path: '/lab', title: 'Lab — Jatin Choudhary', description: 'Experiments and small instruments. New work will appear here when it is ready to share.', navLabel: 'Lab' },
  { key: 'field-notes', path: '/field-notes', title: 'Field Notes — Jatin Choudhary', description: 'Engineering notes from work in progress.', navLabel: 'Field Notes' },
  { key: 'about', path: '/about', title: 'About — Jatin Choudhary', description: 'About Jatin Choudhary, a computer engineering student building software prototypes and exploring AI/ML and software engineering.', navLabel: 'About' },
  { key: 'contact', path: '/contact', title: 'Contact — Jatin Choudhary', description: 'Contact Jatin Choudhary for a conversation or collaboration.', navLabel: 'Contact' },
] as const

export const projectRoutePattern = '/work/:slug'
export const projectRoutePrefix = '/work/'
export const navigationRoutes = primaryRoutes.filter((route) => route.navLabel)
export type PrimaryRoute = (typeof primaryRoutes)[number]
export type RouteKey = PrimaryRoute['key']

export function getPrimaryRoute(key: RouteKey): PrimaryRoute {
  const route = primaryRoutes.find((item) => item.key === key)
  if (!route) throw new Error(`Unknown route key: ${key}`)
  return route
}

export function projectDetailPath(slug: string): string {
  return `${projectRoutePrefix}${slug}`
}

export function getRouteMetadata(path: string) {
  const primaryRoute = primaryRoutes.find((route) => route.path === path)
  if (primaryRoute) return makeMetadata(primaryRoute.title, primaryRoute.description, path)
  const project = path.startsWith(projectRoutePrefix)
    ? projects.find((item) => projectDetailPath(item.slug) === path)
    : undefined
  if (project) return makeMetadata(`${project.title} — Jatin Choudhary`, project.summary ?? `Project entry for ${project.title} in Jatin Choudhary's portfolio.`, path)
  return { title: 'Page not found — Jatin Choudhary', description: 'The requested page was not found.' }
}

function makeMetadata(title: string, description: string, path: string) {
  return { title, description, canonicalPath: path, canonicalUrl: canonicalOrigin ? new URL(path, canonicalOrigin).href : undefined }
}

export function getPrerenderPaths(): string[] {
  return [...primaryRoutes.map((route) => route.path), ...projects.map(({ slug }) => projectDetailPath(slug))]
}

export function resolveRoute(path: string): { kind: 'primary'; route: PrimaryRoute } | { kind: 'project'; slug: string } | { kind: 'not-found' } {
  const route = primaryRoutes.find((item) => item.path === path)
  if (route) return { kind: 'primary', route }
  if (path.startsWith(projectRoutePrefix)) {
    const slug = path.slice(projectRoutePrefix.length)
    if (projects.some((project) => project.slug === slug)) return { kind: 'project', slug }
  }
  return { kind: 'not-found' }
}

export function isNavigationRouteActive(key: RouteKey, path: string): boolean {
  const route = primaryRoutes.find((item) => item.key === key)
  return route !== undefined && (path === route.path || (key === 'work' && path.startsWith(projectRoutePrefix)))
}
