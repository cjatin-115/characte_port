import source from '../../content/about.json'
import { parseContentDocument } from './content-document'
import { parseAbout } from './portfolio'

export const aboutDocument = parseContentDocument(source, parseAbout)
export const about = aboutDocument.data
