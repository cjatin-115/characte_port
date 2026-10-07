import source from '../../content/field-notes.json'
import { parseContentDocument } from './content-document'
import { parseFieldNotes } from './portfolio'

export const fieldNotesDocument = parseContentDocument(source, parseFieldNotes)
export const fieldNotes = fieldNotesDocument.data
