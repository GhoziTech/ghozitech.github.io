import { Code2, Cpu, Languages, TerminalSquare } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { skills } from '../data/profile'
import { copy } from '../data/copy'
import { useApp } from '../context/AppContext'

const groups = [
  { label: 'Programming', summary: 'Core coding languages for logic, automation, and backend tasks.', items: skills.programming, icon: Code2, accent: '#6ef2ff' },
  { label: 'Web Technology', summary: 'Frontend and CMS technologies used to build responsive websites.', items: skills.web, icon: Cpu, accent: '#9b7cff' },
  { label: 'Development Tools', summary: 'Tools that support workflow, collaboration, and project delivery.', items: skills.tools, icon: TerminalSquare, accent: '#72f0b0' },
  { label: 'Languages', summary: 'Communication languages for work, learning, and international goals.', items: ['Indonesian · Native', 'German · B2', 'English · Basic'], icon: Languages, accent: '#ffb86b' },
] as const

const proficiency = [91, 88, 84, 80, 76, 72, 68]

export function Skills() {
  const { language } = useApp()
  const t = copy[language]
  const [activeIndex, setActiveIndex] = useState(0)
  const active = groups[activeIndex]
  const activeItems = useMemo(() => active.items.map((item, index) => ({ item, score: proficiency[index % proficiency.length] })), [active])
  const ActiveIcon = active.icon

  return (
    <section id="skills" className="skills-section section-shell">
      <div className="skills-heading" data-reveal>
        <span className="eyebrow">05 / {t.skillsLabel}</span>
        <h2>{t.skillsTitle}</h2>
      </div>
      <div className="skill-showcase">
        <div className="skill-reactor-panel" data-reveal>
          <div className="skill-reactor-core" aria-hidden="true">
            <div className="skill-reactor-photo-wrap">
              <img src="/profile.webp" alt="Hafid Ghozi Al Ghifari" className="skill-reactor-photo" />
            </div>
            <i /><i /><i />
          </div>
          <div className="skill-reactor-copy">
            <small>ACTIVE CLUSTER</small>
            <h3>{active.label}</h3>
            <p>{active.summary}</p>
          </div>
          <div className="skill-orbit-buttons">
            {groups.map((group, index) => {
              const Icon = group.icon
              return (
                <button
                  type="button"
                  key={group.label}
                  className={activeIndex === index ? 'active' : ''}
                  style={{ '--group-accent': group.accent } as CSSProperties}
                  onClick={() => setActiveIndex(index)}
                >
                  <Icon size={18} />
                  <span>{group.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="skill-detail-panel" data-reveal>
          <div className="skill-detail-head">
            <div className="skill-detail-icon"><ActiveIcon size={22} /></div>
            <div>
              <small>KNOWLEDGE MAP</small>
              <h3>{active.label}</h3>
            </div>
          </div>
          <div className="skill-bars">
            {activeItems.map(({ item, score }) => (
              <article key={item}>
                <div>
                  <strong>{item}</strong>
                  <small>{score}%</small>
                </div>
                <span><i style={{ width: `${score}%`, background: active.accent }} /></span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
