import { Aperture, BrainCircuit, Camera, ExternalLink, Film, Mountain, Trophy, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { copy } from '../data/copy'
import { useApp } from '../context/AppContext'

const interests = [
  { icon: Camera, name: 'Photography', code: 'OBSERVE' },
  { icon: Film, name: 'Video Editing', code: 'SEQUENCE' },
  { icon: BrainCircuit, name: 'Artificial Intelligence', code: 'EXPLORE' },
  { icon: Aperture, name: 'Modern Technology', code: 'DISCOVER' },
  { icon: Trophy, name: 'Football & Badminton', code: 'ENERGY' },
  { icon: Mountain, name: 'Hiking', code: 'PERSPECTIVE' },
]

const gallery = [
  { src: '/gallery/mirror-selfie.jpg', title: 'Professional Presence', meta: 'Formal portrait' },
  { src: '/gallery/award-stage.jpg', title: 'Recognition', meta: 'Award presentation' },
  { src: '/gallery/community.jpg', title: 'Collaboration', meta: 'Community and teamwork' },
  { src: '/gallery/family-award.jpg', title: 'Celebration', meta: 'Achievement with family' },
  { src: '/gallery/award-detail.jpg', title: 'Award Detail', meta: 'Technology programmer' },
  { src: '/gallery/football.jpg', title: 'Sport', meta: 'Movement and discipline' },
  { src: '/gallery/rajawali-1.jpg', title: 'Rajawali Summit', meta: 'Outdoor journey' },
  { src: '/gallery/rajawali-2.jpg', title: 'Summit Portrait', meta: 'Adventure side' },
  { src: '/gallery/slamet.jpg', title: 'Mount Slamet', meta: 'Endurance and mindset' },
] as const

function GalleryPreview({ item, onClose, closeLabel }: { item: (typeof gallery)[number]; onClose: () => void; closeLabel: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    const closeOnEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEsc)
    return () => window.removeEventListener('keydown', closeOnEsc)
  }, [onClose])

  return (
    <dialog ref={dialogRef} className="photo-preview-dialog" onClose={onClose}>
      <button className="dialog-close" onClick={onClose} aria-label={closeLabel}><X size={16} /></button>
      <div className="photo-preview-layout">
        <img src={item.src} alt={item.title} />
        <div className="photo-preview-copy">
          <small>PHOTO PREVIEW</small>
          <h3>{item.title}</h3>
          <p>{item.meta}</p>
          <button onClick={onClose}>{closeLabel} <ExternalLink size={15} /></button>
        </div>
      </div>
    </dialog>
  )
}

function PhotoButton({ item, className, onOpen }: { item: (typeof gallery)[number]; className: string; onOpen: () => void }) {
  return (
    <button type="button" className={`human-photo-card ${className}`} onClick={onOpen} aria-label={`Open ${item.title}`}>
      <img src={item.src} alt={item.title} loading="lazy" />
      <span className="human-photo-shade" />
      <span className="human-photo-label"><strong>{item.title}</strong><small>{item.meta}</small></span>
      <span className="human-photo-preview">Preview</span>
    </button>
  )
}

export function HumanSide() {
  const { language } = useApp()
  const t = copy[language]
  const [selected, setSelected] = useState<(typeof gallery)[number] | null>(null)
  const [lead, recognition, collaboration, ...rest] = gallery
  const signalsHeading = {
    de: 'Die menschliche Ebene hinter den Systemen: visuelle Gestaltung, Bewegung, Disziplin und Neugier.',
    en: 'The human layer behind the systems: visual craft, movement, discipline, and curiosity.',
    id: 'Lapisan manusia di balik sistem: visual, gerak, disiplin, dan rasa ingin tahu.',
  }[language]

  return (
    <section id="human" className="human-side section-shell human-side-clean">
      <div className="human-heading" data-reveal>
        <span className="eyebrow">06 / {t.humanLabel}</span>
        <h2>{t.humanTitle}</h2>
      </div>

      <div className="human-feature-layout" data-reveal>
        <PhotoButton item={lead} className="human-photo-lead" onOpen={() => setSelected(lead)} />
        <div className="human-feature-stack">
          <PhotoButton item={recognition} className="human-photo-feature" onOpen={() => setSelected(recognition)} />
          <PhotoButton item={collaboration} className="human-photo-feature" onOpen={() => setSelected(collaboration)} />
        </div>
      </div>

      <div className="human-gallery-clean" data-reveal>
        {rest.map((item) => (
          <PhotoButton key={item.src} item={item} className="human-photo-grid" onOpen={() => setSelected(item)} />
        ))}
      </div>

      <div className="human-interest-section" data-reveal>
        <div className="human-interest-heading">
          <span className="eyebrow">HUMAN SIGNALS</span>
          <h3>{signalsHeading}</h3>
        </div>
        <div className="human-interest-list-clean">
          {interests.map(({ icon: Icon, name, code }, index) => (
            <article key={name}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <Icon size={20} />
              <div><strong>{name}</strong><small>{code}</small></div>
            </article>
          ))}
        </div>
      </div>

      {selected && <GalleryPreview item={selected} onClose={() => setSelected(null)} closeLabel={t.close} />}
    </section>
  )
}
