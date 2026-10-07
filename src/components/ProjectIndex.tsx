import { projects } from '../content/projects'
import { projectDetailPath } from '../content/routes'

export function ProjectIndex() {
  return (
    <section className="project-index" aria-labelledby="selected-work">
      <div className="section-marker"><span>01 — SELECTED INDEX</span><span>PROJECTS / {String(projects.length).padStart(2, '0')}</span></div>
      <h2 id="selected-work">Selected projects</h2>
      <ul>
        {projects.map((project, index) => (
          <li key={project.slug}>
            <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
            <div className="project-index-entry">
              <a className="project-title" href={`${projectDetailPath(project.slug)}/`}>{project.title}</a>
              {project.summary && <p className="project-summary">{project.summary}</p>}
              {project.technologies && project.technologies.length > 0 && (
                <p className="project-index-technologies"><span>TECH</span>{project.technologies.join(' · ')}</p>
              )}
            </div>
            <div className="project-index-actions">
              <a className="project-case-link" href={`${projectDetailPath(project.slug)}/`} aria-label={`Explore ${project.title} case study`}>EXPLORE CASE STUDY ↗</a>
              {project.repository && <a className="project-link" href={project.repository} target="_blank" rel="noreferrer">REPOSITORY ↗</a>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
