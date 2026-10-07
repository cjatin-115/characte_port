import source from '../../content/experience.json'
import { parseContentDocument } from './content-document'
import { parseExperience } from './portfolio'

export const experienceDocument = parseContentDocument(source, parseExperience)
export const experience = experienceDocument.data
