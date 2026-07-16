export type ProjectStatus = 'prototype' | 'development' | 'concept' | 'completed'

export interface Project {
  id: string
  title: string
  category: string
  year: string
  status: ProjectStatus
  accent: string
  secondary: string
  description: { de: string; en: string; id: string }
  tags: string[]
  cover: string
  gallery?: string[]
  liveUrl?: string
  repositoryUrl?: string
}

export const projects: Project[] = [
  {
    id: 'motionverse',
    title: 'MOTIONVERSE AI',
    category: 'Camera Interaction / Motion Gaming',
    year: '2026',
    status: 'development',
    accent: '#6ef2ff',
    secondary: '#8f68ff',
    description: {
      de: 'Eine browserbasierte Motion-Gaming-Plattform, bei der Hand- und Körperbewegungen über die Kamera zu direktem Gameplay werden. Die Erlebniswelt umfasst mehrere Spielmodi, ein futuristisches Interface und ein kamerabasiertes Steuerungssystem.',
      en: 'A browser-based motion gaming platform where hand and body movement captured by a camera becomes direct gameplay. The experience includes multiple game modes, a futuristic interface, and a camera-driven control system.',
      id: 'Platform game berbasis browser yang mengubah gerakan tangan dan tubuh melalui kamera menjadi gameplay langsung. Pengalamannya mencakup berbagai mode permainan, antarmuka futuristik, dan sistem kontrol berbasis kamera.',
    },
    tags: ['React', 'TypeScript', 'Computer Vision', 'Camera UX'],
    cover: '/projects/motionverse/cover-1.png',
    gallery: [
      '/projects/motionverse/cover-2.png',
      '/projects/motionverse/cover-3.png',
      '/projects/motionverse/cover-4.png',
    ],
    repositoryUrl: 'https://github.com/GhoziTech/motionverse',
  },
  {
    id: 'survival-german',
    title: 'Survival German Progress Tracker',
    category: 'Educational Technology / Language Learning',
    year: '2026',
    status: 'development',
    accent: '#a78bfa',
    secondary: '#65e7ff',
    description: {
      de: 'Ein interaktives Lernsystem für Deutsch mit Missionen, Fortschrittskontrolle, Zertifikatsmomenten und einer motivierenden UI für reale Alltagssituationen von A1 bis B2.',
      en: 'An interactive German-learning system with missions, progress tracking, certificate moments, and a motivating interface for real-life situations from A1 to B2.',
      id: 'Sistem belajar bahasa Jerman interaktif dengan misi, progress tracker, momen sertifikat, dan antarmuka yang memotivasi untuk situasi nyata dari level A1 sampai B2.',
    },
    tags: ['EdTech', 'Mission UX', 'Progress Tracking', 'Responsive Web'],
    cover: '/projects/survival-german/cover-1.png',
    gallery: [
      '/projects/survival-german/cover-2.png',
      '/projects/survival-german/cover-3.png',
      '/projects/survival-german/cover-4.png',
    ],
  },
  {
    id: 'whatsapp-automation',
    title: 'BOT-WA',
    category: 'Automation / Digital Commerce',
    year: '2026',
    status: 'prototype',
    accent: '#72f0b0',
    secondary: '#6ef2ff',
    description: {
      de: 'Ein WhatsApp-Bot-System für Verkaufs- und Serviceabläufe. Der Fokus liegt auf Zuverlässigkeit, schneller Reaktion, automatisierter Kommunikation und einem Betrieb ohne offizielle API.',
      en: 'A WhatsApp bot system for sales and service flows. The focus is reliability, quick response, automated communication, and continuous operation without the official API.',
      id: 'Sistem bot WhatsApp untuk alur penjualan dan layanan. Fokusnya adalah reliabilitas, respons cepat, komunikasi otomatis, dan operasi berkelanjutan tanpa API resmi.',
    },
    tags: ['Node.js', 'Baileys', 'JavaScript', 'Automation'],
    cover: '/projects/whatsapp-bot/cover.png',
    repositoryUrl: 'https://github.com/GhoziTech/bot-wa',
  },
  {
    id: 'padel-elite',
    title: 'Padel Elite',
    category: 'Sports Venue Website',
    year: '2026',
    status: 'completed',
    accent: '#d4ff40',
    secondary: '#80ff72',
    description: {
      de: 'Ein modernes Premium-Website-Konzept für ein Padel-Center mit klarer Typografie, leistungsstarker Landingpage, Membership-Fokus und Conversion-orientierten CTAs.',
      en: 'A modern premium website concept for a padel center with clear typography, a strong landing page, membership focus, and conversion-oriented CTAs.',
      id: 'Konsep website premium modern untuk pusat padel dengan tipografi yang tegas, landing page kuat, fokus membership, dan CTA yang mendorong konversi.',
    },
    tags: ['Landing Page', 'Premium UI', 'Sports Brand', 'Responsive Web'],
    cover: '/projects/padel-elite/cover.png',
    liveUrl: 'https://padel-elite.lovable.app',
  },
  {
    id: 'velvet-noir',
    title: 'Velvet Noir',
    category: 'Luxury Club / Bar Experience',
    year: '2026',
    status: 'completed',
    accent: '#ffcc66',
    secondary: '#d457ff',
    description: {
      de: 'Ein luxuriöses Website-Erlebnis für Club & Bar mit cineastischer Bildsprache, eleganter Typografie und einer Atmosphäre, die Reservierung und Nightlife-Branding verbindet.',
      en: 'A luxurious club-and-bar website experience with cinematic imagery, elegant typography, and an atmosphere that blends reservations with nightlife branding.',
      id: 'Pengalaman website mewah untuk club & bar dengan visual sinematik, tipografi elegan, dan atmosfer yang memadukan reservasi dengan branding nightlife.',
    },
    tags: ['Luxury Brand', 'Hospitality Web', 'Cinematic UI', 'Reservation CTA'],
    cover: '/projects/velvet-noir/cover.jpg',
    liveUrl: 'https://velvetnoir-luxury.lovable.app/',
  },
]
