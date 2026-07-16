import { useState, type CSSProperties } from 'react'
import type { Project } from '../data/projects'

export function ProjectCover({ project, index }: { project: Project; index: number }) {
  const [activeImage, setActiveImage] = useState(project.cover)
  const thumbs = project.gallery?.length ? [project.cover, ...project.gallery] : [project.cover]

  return (
    <div className={`project-cover cover-${index % 4}`} style={{ '--accent': project.accent, '--secondary': project.secondary } as CSSProperties}>
      <div className="cover-grid" />
      <div className="cover-orbit orbit-a" />
      <div className="cover-orbit orbit-b" />
      <div className="cover-hud cover-hud-top"><span>PORTAL</span><span>{project.year}</span></div>
      <div className="cover-viewport">
        <img src={activeImage} alt={`${project.title} preview`} loading="lazy" />
        <div className="cover-glow" />
      </div>
      <div className="cover-scan" />
      <div className="cover-footer">
        <span className="cover-index">0{index + 1}</span>
        {thumbs.length > 1 && (
          <div className="cover-thumbs" aria-label={`${project.title} gallery previews`}>
            {thumbs.map((thumb, thumbIndex) => (
              <button
                type="button"
                key={thumb}
                className={thumb === activeImage ? 'is-active' : ''}
                aria-label={`Preview ${thumbIndex + 1}`}
                onMouseEnter={() => setActiveImage(thumb)}
                onFocus={() => setActiveImage(thumb)}
                onClick={() => setActiveImage(thumb)}
              >
                <img src={thumb} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
