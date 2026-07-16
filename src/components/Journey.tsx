import { BriefcaseBusiness, GraduationCap, Languages, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { copy } from '../data/copy'
import { useApp } from '../context/AppContext'

type JourneyLanguage = 'de' | 'en' | 'id'
type JourneyCategory = 'experience' | 'education' | 'language'

interface JourneyItem {
  year: string
  title: string
  body: string
  details: string[]
  icon: typeof BriefcaseBusiness
  category: JourneyCategory
}

const journey: Record<JourneyLanguage, JourneyItem[]> = {
  de: [
    { year: '2023–2024', title: 'Freelance Webentwickler', body: 'Responsive Websites mit HTML, CSS, JavaScript und WordPress; Abstimmung mit Kunden und Umsetzung individueller Lösungen.', details: ['Landing Pages und Firmenwebsites', 'Kundenspezifische UI-Umsetzung', 'Responsive Frontend-Struktur'], icon: BriefcaseBusiness, category: 'experience' },
    { year: '2024', title: 'Verkäufer · CV Arafah Group', body: 'Kundenberatung, Warenverkauf, Regalpflege und Bestandsprüfung.', details: ['Kommunikation mit Kunden', 'Verantwortung für Warenbestand', 'Serviceorientiertes Arbeiten'], icon: BriefcaseBusiness, category: 'experience' },
    { year: '2024–2025', title: 'Einjährige Fachausbildung Informatik', body: 'Islamic Digital Boarding College · praktische Grundlagen in Informatik und Webtechnologien.', details: ['Programmierungsgrundlagen', 'Webentwicklung und Praxis', 'Technologieprojekte im Lernumfeld'], icon: GraduationCap, category: 'education' },
    { year: 'Juni 2021 – Mai 2023', title: 'Oberschule · PKBM KENANGAN', body: 'Allgemeinbildende Schulphase mit weiterführender Vorbereitung auf den nächsten Bildungsweg.', details: ['Abschluss der Oberschulphase', 'Grundlagenfächer und Selbstständigkeit', 'Lernkontinuität bis 2023'], icon: GraduationCap, category: 'education' },
    { year: 'Juli 2017 – Juni 2020', title: 'Mittelschule · Ngudi Ilmu Karangpandan', body: 'Mittlere Schulbildung mit Aufbau grundlegender akademischer und persönlicher Kompetenzen.', details: ['Schulische Kernfächer', 'Disziplin und Lernroutine', 'Weiterführung zur Oberschule'], icon: GraduationCap, category: 'education' },
    { year: 'Juli 2011 – Juni 2017', title: 'Grundschule · SD Muhammadiyah 7', body: 'Grundschulzeit als Basis für Lernen, soziale Entwicklung und frühe Selbstorganisation.', details: ['Frühe Bildungsgrundlage', 'Soziale und persönliche Entwicklung', 'Basis für den weiteren Schulweg'], icon: GraduationCap, category: 'education' },
    { year: '2024–2026', title: 'Deutschkurs · Bright Education Indonesia', body: 'Deutsch bis B2-Niveau als Vorbereitung auf Ausbildung und berufliche Kommunikation.', details: ['Prüfungsorientiertes Lernen', 'Sprechen, Schreiben, Lesen, Hören', 'Vorbereitung auf Deutschland'], icon: Languages, category: 'language' },
  ],
  en: [
    { year: '2023–2024', title: 'Freelance Web Developer', body: 'Responsive websites with HTML, CSS, JavaScript, and WordPress; client communication and tailored implementation.', details: ['Landing pages and business websites', 'Client-specific UI implementation', 'Responsive frontend structure'], icon: BriefcaseBusiness, category: 'experience' },
    { year: '2024', title: 'Sales Assistant · CV Arafah Group', body: 'Customer service, product sales, shelf restocking, and inventory checks.', details: ['Customer communication', 'Stock responsibility', 'Service-oriented workflow'], icon: BriefcaseBusiness, category: 'experience' },
    { year: '2024–2025', title: 'One-year Vocational IT Training', body: 'Islamic Digital Boarding College · practical foundations in IT and web technologies.', details: ['Programming fundamentals', 'Web development practice', 'Technology projects in training'], icon: GraduationCap, category: 'education' },
    { year: 'June 2021 – May 2023', title: 'Senior High School · PKBM KENANGAN', body: 'General secondary education phase preparing for the next educational path.', details: ['Completed upper-secondary phase', 'Core subjects and independence', 'Continuous study until 2023'], icon: GraduationCap, category: 'education' },
    { year: 'July 2017 – June 2020', title: 'Junior High School · Ngudi Ilmu Karangpandan', body: 'Middle-school education focused on foundational academic and personal development.', details: ['Core school subjects', 'Discipline and study routine', 'Preparation for higher schooling'], icon: GraduationCap, category: 'education' },
    { year: 'July 2011 – June 2017', title: 'Elementary School · SD Muhammadiyah 7', body: 'Primary-school period building the base for learning, social growth, and early self-management.', details: ['Early educational foundation', 'Social and personal growth', 'Basis for the next school stages'], icon: GraduationCap, category: 'education' },
    { year: '2024–2026', title: 'German Course · Bright Education Indonesia', body: 'German up to B2 level for vocational training and professional communication.', details: ['Exam-oriented study', 'Speaking, writing, reading, listening', 'Preparation for Germany'], icon: Languages, category: 'language' },
  ],
  id: [
    { year: '2023–2024', title: 'Freelance Web Developer', body: 'Membuat website responsif dengan HTML, CSS, JavaScript, dan WordPress serta menerapkan kebutuhan klien.', details: ['Landing page dan website bisnis', 'Implementasi UI sesuai kebutuhan klien', 'Struktur frontend responsif'], icon: BriefcaseBusiness, category: 'experience' },
    { year: '2024', title: 'Sales Assistant · CV Arafah Group', body: 'Melayani pelanggan, menjual produk, mengisi rak, dan memeriksa stok.', details: ['Komunikasi dengan pelanggan', 'Tanggung jawab stok barang', 'Alur kerja berorientasi layanan'], icon: BriefcaseBusiness, category: 'experience' },
    { year: '2024–2025', title: 'Pendidikan Kejuruan Informatika Satu Tahun', body: 'Islamic Digital Boarding College · dasar praktis informatika dan teknologi web.', details: ['Dasar pemrograman', 'Praktik web development', 'Proyek teknologi di lingkungan belajar'], icon: GraduationCap, category: 'education' },
    { year: 'Juni 2021 – Mei 2023', title: 'SMA · PKBM KENANGAN', body: 'Fase pendidikan sekolah lanjutan dengan persiapan menuju jenjang berikutnya.', details: ['Menuntaskan fase sekolah lanjutan', 'Pelajaran inti dan kemandirian', 'Konsistensi belajar hingga 2023'], icon: GraduationCap, category: 'education' },
    { year: 'Juli 2017 – Juni 2020', title: 'SMP · Ngudi Ilmu Karangpandan', body: 'Pendidikan menengah yang membangun dasar akademik dan perkembangan pribadi.', details: ['Mata pelajaran inti', 'Disiplin dan rutinitas belajar', 'Persiapan menuju jenjang berikutnya'], icon: GraduationCap, category: 'education' },
    { year: 'Juli 2011 – Juni 2017', title: 'SD · SD Muhammadiyah 7', body: 'Masa sekolah dasar sebagai fondasi belajar, perkembangan sosial, dan kemandirian awal.', details: ['Fondasi pendidikan awal', 'Perkembangan sosial dan pribadi', 'Dasar menuju tahap sekolah berikutnya'], icon: GraduationCap, category: 'education' },
    { year: '2024–2026', title: 'Kursus Bahasa Jerman · Bright Education Indonesia', body: 'Bahasa Jerman sampai tingkat B2 untuk persiapan Ausbildung dan komunikasi profesional.', details: ['Belajar terarah untuk ujian', 'Sprechen, Schreiben, Lesen, Hören', 'Persiapan menuju Jerman'], icon: Languages, category: 'language' },
  ],
}

const categoryLabels = {
  de: { all: 'Alles', experience: 'Erfahrung', education: 'Bildung', language: 'Sprachen' },
  en: { all: 'All', experience: 'Experience', education: 'Education', language: 'Language' },
  id: { all: 'Semua', experience: 'Pengalaman', education: 'Pendidikan', language: 'Bahasa' },
} as const

export function Journey() {
  const { language } = useApp()
  const t = copy[language]
  const items = journey[language]
  const [filter, setFilter] = useState<'all' | JourneyCategory>('all')
  const filteredItems = useMemo(() => (filter === 'all' ? items : items.filter((item) => item.category === filter)), [filter, items])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = filteredItems[Math.min(activeIndex, Math.max(filteredItems.length - 1, 0))] ?? items[0]

  return (
    <section id="journey" className="journey-section section-shell">
      <div className="section-intro" data-reveal>
        <span className="eyebrow">04 / {t.journeyLabel}</span>
        <h2>{t.journeyTitle}</h2>
      </div>

      <div className="journey-metrics" data-reveal>
        <article><strong>{String(items.length).padStart(2, '0')}</strong><span>Timeline Cards</span></article>
        <article><strong>B2</strong><span>German Track</span></article>
        <article><strong>2026</strong><span>Ausbildung Target</span></article>
      </div>

      <div className="journey-console">
        <div className="journey-sidebar" data-reveal>
          <div className="journey-filter">
            {(['all', 'experience', 'education', 'language'] as const).map((key) => (
              <button
                type="button"
                key={key}
                className={filter === key ? 'active' : ''}
                onClick={() => {
                  setFilter(key)
                  setActiveIndex(0)
                }}
              >
                {categoryLabels[language][key]}
              </button>
            ))}
          </div>
          <div className="journey-entries">
            {filteredItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button type="button" key={`${item.title}-${item.year}`} className={activeItem.title === item.title ? 'journey-node active' : 'journey-node'} onClick={() => setActiveIndex(index)}>
                  <span className="journey-node-icon"><Icon size={16} /></span>
                  <div>
                    <small>{item.year}</small>
                    <strong>{item.title}</strong>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="journey-detail" data-reveal>
          <div className="journey-detail-head">
            <div>
              <span className="eyebrow">ARCHIVE / ACTIVE ENTRY</span>
              <h3>{activeItem.title}</h3>
            </div>
            <div className="journey-year-chip">{activeItem.year}</div>
          </div>
          <p>{activeItem.body}</p>
          <div className="journey-detail-points">
            {activeItem.details.map((detail) => (
              <div key={detail}><Sparkles size={14} /><span>{detail}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
