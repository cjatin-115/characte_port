export type ContentDocument<T> = {
  version: number
  data: T
}

export function parseContentDocument<T>(value: unknown, parseData: (data: unknown) => T): ContentDocument<T> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Content document must be an object')
  }
  const document = value as Record<string, unknown>
  if (!Number.isSafeInteger(document.version) || (document.version as number) < 1) {
    throw new Error('Content document needs a positive integer version')
  }
  if (!Object.hasOwn(document, 'data')) throw new Error('Content document needs data')
  return { version: document.version as number, data: parseData(document.data) }
}

export function requireText(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(`${label} must be non-empty text`)
  return value
}

export function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`)
  return value as Record<string, unknown>
}

export function requireList(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be a list`)
  return value
}
