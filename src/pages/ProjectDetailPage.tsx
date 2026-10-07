import { projects } from '../content/projects'
import { getPrimaryRoute, projectDetailPath } from '../content/routes'
import { SimplePage } from './SimplePage'

export function ProjectDetailPage({ slug }: { slug: string }) {
  const projectIndex = projects.findIndex((item) => item.slug === slug)
  const project = projects[projectIndex]
  if (!project) return <SimplePage title="Entry not found" index="404"><p>This archive entry does not exist.</p><a href={`${getPrimaryRoute('work').path}/`} className="text-link">RETURN TO WORK ↗</a></SimplePage>
  const previousProject = projects[projectIndex - 1]
  const nextProject = projects[projectIndex + 1]

  const caseSections: Array<[string, string | undefined]> = [
    ['Problem', project.problem],
    ['Approach', project.approach],
    ['Implementation', project.implementation],
    ['Solution', project.solution],
    ['Outcome', project.outcome],
    ['Limitations', project.limitations],
  ]

  return (
    <main id="main-content" className="page-content project-detail">
      <header className="project-detail-heading">
        <p className="eyebrow">PROJECT {String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
        <h1>{project.title}</h1>
        {project.summary && <p className="project-deck">{project.summary}</p>}
      </header>

      <div className="project-detail-content">
        {caseSections.map(([heading, content]) => content ? (
          <section className="project-case-section" key={heading}>
            <h2>{heading}</h2>
            <p>{content}</p>
          </section>
        ) : null)}

        {(project.role || (project.technologies && project.technologies.length > 0) || project.repository) && (
          <dl className="project-facts">
            {project.role && <div><dt>Role</dt><dd>{project.role}</dd></div>}
            {project.technologies && project.technologies.length > 0 && <div><dt>Technologies</dt><dd>{project.technologies.join(' · ')}</dd></div>}
            {project.repository && <div><dt>Repository</dt><dd><a className="text-link" href={project.repository} target="_blank" rel="noreferrer">VIEW REPOSITORY ↗</a></dd></div>}
          </dl>
        )}

        <nav className="project-detail-navigation" aria-label="Project navigation">
          <a className="text-link project-all-work" href={`${getPrimaryRoute('work').path}/`}>← ALL WORK</a>
          <div className="project-pagination">
            {previousProject && (
              <a className="project-pagination-link" href={`${projectDetailPath(previousProject.slug)}/`} aria-label={`Previous project: ${previousProject.title}`}>
                <span>← PREVIOUS</span><strong>{previousProject.title}</strong>
              </a>
            )}
            {nextProject && (
              <a className="project-pagination-link project-pagination-next" href={`${projectDetailPath(nextProject.slug)}/`} aria-label={`Next project: ${nextProject.title}`}>
                <span>NEXT →</span><strong>{nextProject.title}</strong>
              </a>
            )}
          </div>
        </nav>
      </div>
    </main>
  )
}
