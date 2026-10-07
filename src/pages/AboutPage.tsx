import { about } from '../content/about'
import { education } from '../content/education'

export function AboutPage() {
  return <main id="main-content" className="page-content"><p className="eyebrow">{about.eyebrow}</p><h1>{about.heading}<br /><em>{about.headingEmphasis}</em></h1><div className="about-copy"><p>{about.introduction}</p>{education.map((entry) => <p key={entry.institution}>{entry.qualification ? `${entry.qualification} at ` : ''}{entry.institution}{entry.location ? `, ${entry.location}` : ''}{entry.expectedGraduation ? `. Expected graduation: ${entry.expectedGraduation}` : ''}{entry.cgpa ? `. CGPA: ${entry.cgpa}` : ''}.</p>)}<p>{about.interests}</p></div></main>
}
