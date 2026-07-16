import { Download, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { copy } from '../data/copy'
import { profile } from '../data/profile'
import { useApp } from '../context/AppContext'

export function Contact() {
  const { language } = useApp()
  const t = copy[language]
  return (
    <section id="contact" className="contact-section section-shell">
      <div className="contact-orbit" aria-hidden="true"><span /><span /><span /></div>
      <div className="contact-content" data-reveal>
        <span className="eyebrow">07 / {t.contactLabel}</span>
        <h2>{t.contactTitle}</h2>
        <p>{t.contactText}</p>
        <div className="contact-links">
          <a href={`mailto:${profile.email}`}><Mail />{t.email}</a>
          <a href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle />{t.whatsapp}</a>
          <a href={profile.instagram} target="_blank" rel="noreferrer"><Instagram />{t.instagram}</a>
          <a href={profile.cv} download><Download />{t.downloadCV}</a>
        </div>
        <div className="contact-meta"><span><MapPin size={16} />{profile.location}</span><span>{profile.email}</span></div>
      </div>
      <footer><strong>HG.</strong><span>© 2026 Hafid Ghozi Al Ghifari</span><span>React · Three.js · GSAP</span></footer>
    </section>
  )
}
