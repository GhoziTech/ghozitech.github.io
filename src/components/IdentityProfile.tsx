import { Code2, Languages, MapPin, Radar } from 'lucide-react'
import { copy } from '../data/copy'
import { profile } from '../data/profile'
import { useApp } from '../context/AppContext'
import { ProfileBodyCanvas } from './ProfileBodyCanvas'
import { SplitReveal } from './SplitReveal'

const factsCopy = {
  de: [
    { icon: MapPin, label: 'STANDORT', value: 'Surakarta · Indonesien' },
    { icon: Languages, label: 'SPRACHE', value: 'Deutsch · B2' },
    { icon: Code2, label: 'RICHTUNG', value: 'Webentwicklung · Automatisierung' },
    { icon: Radar, label: 'ZIEL', value: 'Ausbildung 2026' },
  ],
  en: [
    { icon: MapPin, label: 'LOCATION', value: 'Surakarta · Indonesia' },
    { icon: Languages, label: 'LANGUAGE', value: 'German · B2' },
    { icon: Code2, label: 'DIRECTION', value: 'Web Development · Automation' },
    { icon: Radar, label: 'TARGET', value: 'Ausbildung 2026' },
  ],
  id: [
    { icon: MapPin, label: 'LOKASI', value: 'Surakarta · Indonesia' },
    { icon: Languages, label: 'BAHASA', value: 'Bahasa Jerman · B2' },
    { icon: Code2, label: 'ARAH', value: 'Web Development · Automation' },
    { icon: Radar, label: 'TARGET', value: 'Ausbildung 2026' },
  ],
} as const

export function IdentityProfile() {
  const { language, motionEnabled } = useApp()
  const t = copy[language]
  const facts = factsCopy[language]

  return (
    <section id="profile" className="identity-profile profile-split-section section-shell">
      <div className="profile-split-layout">
        <div className="profile-split-copy">
          <div className="profile-copy-inner" data-reveal>
            <span className="eyebrow">02 / {t.identityLabel}</span>
            <SplitReveal text={t.identityTitle} />
            <p className="profile-lead">{t.identityText}</p>
          </div>

          <div className="profile-bento">
            {facts.map(({ icon: Icon, label, value }, index) => (
              <article className={`profile-bento-card bento-card profile-bento-card-${index + 1}`} key={label}>
                <div className="profile-bento-icon"><Icon size={18} /></div>
                <small>{label}</small>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <div className="profile-signature profile-signature-split" data-reveal>
            <span>{profile.initials}</span><i />{profile.email}
          </div>
        </div>

        <div className="profile-model-column">
          <div className="profile-model-sticky">
            <div className="profile-layer-words" aria-hidden="true">
              <span>REACTOR</span>
              <span>SIGNAL</span>
            </div>
            <ProfileBodyCanvas motionEnabled={motionEnabled} />
            <div className="profile-model-caption" aria-hidden="true">
              <span>FULL-BODY DIGITAL TWIN</span>
              <span>CURSOR + SCROLL REACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
