import { fieldNotes } from '../content/field-notes'
import { SimplePage } from './SimplePage'

export function FieldNotesPage() {
  return <SimplePage title="Field Notes" index="03"><p>{fieldNotes.emptyState}</p></SimplePage>
}
