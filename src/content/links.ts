import source from '../../content/links.json'
import { parseContentDocument } from './content-document'
import { parseLinks } from './portfolio'

export const linksDocument = parseContentDocument(source, parseLinks)
export const links = linksDocument.data
