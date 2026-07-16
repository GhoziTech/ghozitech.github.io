import { lazy, Suspense, useRef } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { Hero } from './components/Hero'
import { IdentityProfile } from './components/IdentityProfile'
import { ProjectJourney } from './components/ProjectJourney'
import { CertificateVault } from './components/CertificateVault'
import { Journey } from './components/Journey'
import { Skills } from './components/Skills'
import { HumanSide } from './components/HumanSide'
import { Contact } from './components/Contact'
import { CursorFx } from './components/CursorFx'
import { useScrollEngine } from './hooks/useScrollEngine'
import { usePageMotion } from './hooks/usePageMotion'

const ExperienceCanvas = lazy(() => import('./experience/ExperienceCanvas').then((module) => ({ default: module.ExperienceCanvas })))

function Portfolio() {
  const progress = useRef(0)
  const { motionEnabled } = useApp()
  useScrollEngine(progress, motionEnabled)
  usePageMotion(motionEnabled)

  return (
    <>
      <a className="skip-link" href="#identity">Skip to content</a>
      <Preloader />
      <CursorFx />
      <Suspense fallback={<div className="webgl-fallback" aria-hidden="true" />}><ExperienceCanvas progress={progress} motionEnabled={motionEnabled} /></Suspense>
      <div className="grain" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <IdentityProfile />
        <ProjectJourney />
        <Journey />
        <CertificateVault />
        <Skills />
        <HumanSide />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return <AppProvider><Portfolio /></AppProvider>
}
