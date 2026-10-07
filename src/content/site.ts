import siteDocument from '../../content/site.json'
import { parseContentDocument } from './content-document'

type SiteSettings = { canonicalOrigin?: string }

function parseSiteSettings(value: unknown): SiteSettings {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Site settings must be an object')
  const origin = (value as Record<string, unknown>).canonicalOrigin
  if (origin === null || origin === undefined || origin === '') return {}
  if (typeof origin !== 'string') throw new Error('Canonical origin must be an HTTPS origin')
  let parsed: URL
  try {
    parsed = new URL(origin)
  } catch {
    throw new Error('Canonical origin must be an HTTPS origin')
  }
  if (parsed.protocol !== 'https:' || parsed.origin !== origin || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('Canonical origin must be an HTTPS origin without a path, query, or fragment')
  }
  return { canonicalOrigin: parsed.origin }
}

export const siteSettingsDocument = parseContentDocument(siteDocument, parseSiteSettings)
export const canonicalOrigin = siteSettingsDocument.data.canonicalOrigin
