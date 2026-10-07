import source from '../../content/education.json'
import { parseContentDocument } from './content-document'
import { parseEducation } from './portfolio'

export const educationDocument = parseContentDocument(source, parseEducation)
export const education = educationDocument.data
