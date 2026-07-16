import { ArrowUpRight, Github } from 'lucide-react'
import { projects } from '../data/projects'
import { copy } from '../data/copy'
import { useApp } from '../context/AppContext'
import { ProjectCover } from './ProjectCover'

export function ProjectJourney() {
  const { language } = useApp()
  const t = copy[language]
  return (
    <section id="projects" className="projects-section section-shell">
      <div className="section-intro" data-reveal>
        <span className="eyebrow">03 / {t.workLabel}</span>
        <h2>{t.workTitle}</h2>
        <p>{t.workText}</p>
      </div>
      <div className="project-journey">
        {projects.map((project, index) => (
          <article className="project-chapter" key={project.id}>
            <div className="project-panel">
              <ProjectCover project={project} index={index} />
              <div className="project-copy">
                <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
                <h3 className="project-title">{project.title}</h3>
                <p>{project.description[language]}</p>
                <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="project-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">Live preview <ArrowUpRight size={17} /></a>
                  )}
                  {project.repositoryUrl && (
                    <a href={project.repositoryUrl} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
