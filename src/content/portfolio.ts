import { requireList, requireRecord, requireText } from './content-document'

export type AboutContent = {
  eyebrow: string
  heading: string
  headingEmphasis: string
  introduction: string
  interests: string
}
export type EducationEntry = {
  institution: string
  qualification?: string
  location?: string
  expectedGraduation?: string
  cgpa?: string
}
export type ExperienceEntry = { organization: string; role?: string; period?: string; description?: string }
export type AchievementEntry = { title: string; description?: string; period?: string }
export type PortfolioLink = { label: string; href: string; external: boolean }
export type FieldNoteEntry = { slug: string; title: string; summary?: string; date?: string }
export type FieldNotesContent = { entries: FieldNoteEntry[]; emptyState: string }

function optionalText(record: Record<string, unknown>, field: string, label: string): string | undefined {
  return record[field] === undefined ? undefined : requireText(record[field], `${label} ${field}`)
}

export function parseAbout(value: unknown): AboutContent {
  const data = requireRecord(value, 'About content')
  return {
    eyebrow: requireText(data.eyebrow, 'About eyebrow'),
    heading: requireText(data.heading, 'About heading'),
    headingEmphasis: requireText(data.headingEmphasis, 'About heading emphasis'),
    introduction: requireText(data.introduction, 'About introduction'),
    interests: requireText(data.interests, 'About interests'),
  }
}

export function parseEducation(value: unknown): EducationEntry[] {
  return requireList(value, 'Education content').map((value) => {
    const data = requireRecord(value, 'Education entry')
    const qualification = optionalText(data, 'qualification', 'Education')
    const location = optionalText(data, 'location', 'Education')
    const expectedGraduation = optionalText(data, 'expectedGraduation', 'Education')
    const cgpa = optionalText(data, 'cgpa', 'Education')
    return {
      institution: requireText(data.institution, 'Education institution'),
      ...(qualification === undefined ? {} : { qualification }),
      ...(location === undefined ? {} : { location }),
      ...(expectedGraduation === undefined ? {} : { expectedGraduation }),
      ...(cgpa === undefined ? {} : { cgpa }),
    }
  })
}

export function parseExperience(value: unknown): ExperienceEntry[] {
  return requireList(value, 'Experience content').map((value) => {
    const data = requireRecord(value, 'Experience entry')
    const role = optionalText(data, 'role', 'Experience')
    const period = optionalText(data, 'period', 'Experience')
    const description = optionalText(data, 'description', 'Experience')
    return {
      organization: requireText(data.organization, 'Experience organization'),
      ...(role === undefined ? {} : { role }),
      ...(period === undefined ? {} : { period }),
      ...(description === undefined ? {} : { description }),
    }
  })
}

export function parseAchievements(value: unknown): AchievementEntry[] {
  return requireList(value, 'Achievements content').map((value) => {
    const data = requireRecord(value, 'Achievement entry')
    const description = optionalText(data, 'description', 'Achievement')
    const period = optionalText(data, 'period', 'Achievement')
    return {
      title: requireText(data.title, 'Achievement title'),
      ...(description === undefined ? {} : { description }),
      ...(period === undefined ? {} : { period }),
    }
  })
}

export function parseLinks(value: unknown): PortfolioLink[] {
  return requireList(value, 'Links content').map((value) => {
    const data = requireRecord(value, 'Link entry')
    const href = requireText(data.href, 'Link href')
    if (!/^(https:\/\/|mailto:)[^\s]+$/i.test(href)) throw new Error('Link href must use HTTPS or mailto')
    if (data.external !== undefined && typeof data.external !== 'boolean') throw new Error('Link external must be boolean')
    return {
      label: requireText(data.label, 'Link label'),
      href,
      external: data.external === true,
    }
  })
}

export function parseFieldNotes(value: unknown): FieldNotesContent {
  const data = requireRecord(value, 'Field Notes content')
  const entries = requireList(data.entries, 'Field Notes entries').map((value) => {
    const entry = requireRecord(value, 'Field Note entry')
    const summary = optionalText(entry, 'summary', 'Field Note')
    const date = optionalText(entry, 'date', 'Field Note')
    return {
      slug: requireText(entry.slug, 'Field Note slug'),
      title: requireText(entry.title, 'Field Note title'),
      ...(summary === undefined ? {} : { summary }),
      ...(date === undefined ? {} : { date }),
    }
  })
  return { entries, emptyState: requireText(data.emptyState, 'Field Notes empty state') }
}
