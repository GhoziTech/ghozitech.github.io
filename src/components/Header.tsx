import { Languages, Menu, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { copy } from '../data/copy'
import { useApp } from '../context/AppContext'

const sections = ['identity', 'profile', 'projects', 'journey', 'skills', 'human', 'contact']

function smoothScrollTo(id: string) {
  const node = document.getElementById(id)
  if (!node) return
  node.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Header() {
  const { language, setLanguage, motionEnabled, setMotionEnabled } = useApp()
  const t = copy[language]
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('identity')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: '-20% 0px -55% 0px' },
    )
    sections.forEach((id) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  return (
    <header className="site-header">
      <a href="#identity" className="brand" aria-label="Hafid Ghozi home" onClick={(event) => { event.preventDefault(); smoothScrollTo('identity') }}>
        <span>HG</span><i />
      </a>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
        {sections.map((id, index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault()
              smoothScrollTo(id)
              setOpen(false)
            }}
          >
            <small>{String(index + 1).padStart(2, '0')}</small>{t.nav[index]}
          </a>
        ))}
      </nav>
      <div className="header-tools">
        <button className="icon-button" onClick={() => setMotionEnabled(!motionEnabled)} aria-label={motionEnabled ? 'Reduce motion' : 'Enable motion'} aria-pressed={motionEnabled}>
          <Sparkles size={17} />
        </button>
        <div className="language-switcher" aria-label="Language selector">
          <Languages size={15} />
          {(['de', 'en', 'id'] as const).map((item) => (
            <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>
          ))}
        </div>
        <button className="menu-button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className="page-progress" aria-hidden="true"><span /></div>
    </header>
  )
}
