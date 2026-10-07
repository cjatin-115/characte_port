import { links } from '../content/links'
import { SimplePage } from './SimplePage'

export function ContactPage() {
  const email = links.find((link) => link.href.startsWith('mailto:'))!
  return <SimplePage title="Contact" index="05"><p>For a conversation or collaboration, write to <a className="text-link" href={email.href}>{email.label}</a></p></SimplePage>
}
