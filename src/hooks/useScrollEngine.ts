import { useEffect, type MutableRefObject } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollEngine(progress: MutableRefObject<number>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      progress.current = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const onScroll = () => {
        progress.current = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      ScrollTrigger.refresh()
      return () => window.removeEventListener('scroll', onScroll)
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
    })

    const update = (time: number) => lenis.raf(time * 1000)
    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      progress.current = limit > 0 ? scroll / limit : 0
      document.documentElement.style.setProperty('--page-progress', String(progress.current))
      ScrollTrigger.update()
    }

    lenis.on('scroll', onScroll)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [enabled, progress])
}
