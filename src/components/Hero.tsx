import { ArrowDownRight, Download, MapPin } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { copy } from '../data/copy'
import { profile } from '../data/profile'
import { useApp } from '../context/AppContext'

const modes = ['HUMAN', 'ANAGLYPH', 'HOLOGRAM', 'CHROME']

const roleVariants = {
  de: [
    'Junior Webentwickler · angehender Fachinformatiker',
    'Junior Webentwickler · angehender Mechatroniker',
  ],
  en: [
    'Junior Web Developer · aspiring IT Specialist',
    'Junior Web Developer · aspiring Mechatronics Specialist',
  ],
  id: [
    'Junior Web Developer · calon Fachinformatiker',
    'Junior Web Developer · calon Mechatroniker',
  ],
} as const

function smoothScrollTo(selector: string) {
  const target = document.querySelector(selector)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Hero() {
  const { language } = useApp()
  const t = copy[language]
  const [mode, setMode] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roleVariants[language].length)
    }, 3000)
    return () => window.clearInterval(interval)
  }, [language])

  useEffect(() => () => {
    delete document.body.dataset.portraitActive
  }, [])

  const activeRole = useMemo(() => roleVariants[language][roleIndex], [language, roleIndex])

  return (
    <section id="identity" className="hero section-shell">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="availability"><i />{t.availability}</div>
          <div className="hero-name" aria-label={profile.name}>
            <span>HAFID</span>
            <span>GHOZI</span>
            <span>AL GHIFARI</span>
          </div>
          <p className="hero-role">01 / IDENTITY · {activeRole}</p>
          <p className="hero-description">{t.heroText}</p>
          <div className="hero-actions">
            <a href="#projects" className="button button-primary" onClick={(event) => { event.preventDefault(); smoothScrollTo('#projects') }}>{t.viewProjects}<ArrowDownRight /></a>
            <a href={profile.cv} download className="button button-ghost"><Download />{t.downloadCV}</a>
          </div>
        </div>
        <div
          className="portrait-ui"
          aria-hidden="true"
          onPointerEnter={() => { document.body.dataset.portraitActive = 'true' }}
          onPointerLeave={() => { delete document.body.dataset.portraitActive; setMode(0) }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const ratio = Math.max(0, Math.min(0.999, (event.clientX - rect.left) / rect.width))
            setMode(Math.floor(ratio * modes.length))
          }}
        >
          <div className="portrait-corners"><i /><i /><i /><i /></div>
          <span className="portrait-mode">MODE / {modes[mode]}</span>
          <span className="portrait-coordinate">MOVE CURSOR ON FACE · {String(mode + 1).padStart(2, '0')} / {String(modes.length).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span><MapPin size={15} />{profile.location}</span>
        <span>DE · EN · ID</span>
        <a href="#profile" onClick={(event) => { event.preventDefault(); smoothScrollTo('#profile') }}>SCROLL TO ENTER <i /></a>
      </div>
    </section>
  )
}
