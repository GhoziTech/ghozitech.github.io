import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Language } from '../data/copy'

interface AppContextValue {
  language: Language
  setLanguage: (language: Language) => void
  motionEnabled: boolean
  setMotionEnabled: (enabled: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const preferredReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-language') as Language | null
    return saved && ['de', 'en', 'id'].includes(saved) ? saved : 'de'
  })
  const [motionEnabled, setMotionEnabled] = useState(!preferredReduced)

  useEffect(() => {
    localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, motionEnabled, setMotionEnabled }), [language, motionEnabled])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used inside AppProvider')
  return value
}
