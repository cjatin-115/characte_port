import source from '../../content/achievements.json'
import { parseContentDocument } from './content-document'
import { parseAchievements } from './portfolio'

export const achievementsDocument = parseContentDocument(source, parseAchievements)
export const achievements = achievementsDocument.data
