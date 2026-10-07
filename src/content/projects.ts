import projectDocument from '../../content/projects.json'
import { parseContentDocument, requireText } from './content-document'

export type Project = {
  slug: string
  title: string
  status: 'not-ready' | 'draft' | 'published'
  repository?: string
  summary?: string
  role?: string
  technologies?: string[]
  problem?: string
  approach?: string
  implementation?: string
  solution?: string
  outcome?: string
  limitations?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSafeRepositoryUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'github.com'
  } catch {
    return false
  }
}

export function parseProjects(value: unknown): Project[] {
  if (!Array.isArray(value)) throw new Error('Project content must be a list')
  const slugs = new Set<string>()
  return value.map((entry): Project => {
    if (!isRecord(entry) || typeof entry.slug !== 'string' || entry.slug.trim().length === 0 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
      throw new Error('Every project needs a valid slug')
    }
    if (slugs.has(entry.slug)) throw new Error(`Duplicate project slug: ${entry.slug}`)
    slugs.add(entry.slug)
    const title = requireText(entry.title, `Project ${entry.slug} needs a title`)
    if (entry.status !== 'not-ready' && entry.status !== 'draft' && entry.status !== 'published') {
      throw new Error(`Project ${entry.slug} status must be not-ready, draft, or published`)
    }
    if (entry.repository !== undefined && !isSafeRepositoryUrl(entry.repository)) {
      throw new Error(`Project ${entry.slug} has an invalid repository link`)
    }
    const summary = optionalProjectText(entry, 'summary', entry.slug)
    const role = optionalProjectText(entry, 'role', entry.slug)
    const problem = optionalProjectText(entry, 'problem', entry.slug)
    const approach = optionalProjectText(entry, 'approach', entry.slug)
    const implementation = optionalProjectText(entry, 'implementation', entry.slug)
    const solution = optionalProjectText(entry, 'solution', entry.slug)
    const outcome = optionalProjectText(entry, 'outcome', entry.slug)
    const limitations = optionalProjectText(entry, 'limitations', entry.slug)
    const technologies = entry.technologies === undefined ? undefined : parseTechnologies(entry.technologies, entry.slug)
    return {
      slug: entry.slug,
      title,
      status: entry.status,
      ...(entry.repository === undefined ? {} : { repository: entry.repository }),
      ...(summary === undefined ? {} : { summary }),
      ...(role === undefined ? {} : { role }),
      ...(technologies === undefined ? {} : { technologies }),
      ...(problem === undefined ? {} : { problem }),
      ...(approach === undefined ? {} : { approach }),
      ...(implementation === undefined ? {} : { implementation }),
      ...(solution === undefined ? {} : { solution }),
      ...(outcome === undefined ? {} : { outcome }),
      ...(limitations === undefined ? {} : { limitations }),
    }
  })
}

function optionalProjectText(entry: Record<string, unknown>, field: string, slug: string): string | undefined {
  return entry[field] === undefined ? undefined : requireText(entry[field], `Project ${slug} ${field}`)
}

function parseTechnologies(value: unknown, slug: string): string[] {
  if (!Array.isArray(value)) throw new Error(`Project ${slug} has invalid technologies`)
  return value.map((technology) => requireText(technology, `Project ${slug} technology`))
}

export const projectsDocument = parseContentDocument(projectDocument, parseProjects)
export const projectCatalog = projectsDocument.data
export const projects = projectCatalog.filter((project) => project.status === 'published')
