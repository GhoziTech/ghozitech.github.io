import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePageMotion(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const cleanups: Array<() => void> = []

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              once: true,
            },
          },
        )
      })



      const profileCards = gsap.utils.toArray<HTMLElement>('.profile-bento-card')
      if (profileCards.length) {
        gsap.fromTo(
          profileCards,
          { y: 40, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.profile-bento',
              start: 'top 85%',
              once: true,
            },
          },
        )
      }

      gsap.utils.toArray<HTMLElement>('.project-chapter').forEach((chapter) => {
        const panel = chapter.querySelector<HTMLElement>('.project-panel')
        const title = chapter.querySelector<HTMLElement>('.project-title')
        if (!panel || !title) return
        gsap.fromTo(
          panel,
          { rotateY: -8, rotateX: 5, scale: 0.84, opacity: 0.25 },
          {
            rotateY: 7,
            rotateX: -3,
            scale: 1.02,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: chapter,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
        gsap.fromTo(
          title,
          { xPercent: -12 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: chapter,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
      })

      const vault = document.querySelector<HTMLElement>('.certificate-vault')
      const track = document.querySelector<HTMLElement>('.certificate-track')
      if (vault && track && window.innerWidth > 800) {
        const amount = () => Math.max(0, track.scrollWidth - window.innerWidth + 96)
        gsap.to(track, {
          x: () => -amount(),
          ease: 'none',
          scrollTrigger: {
            trigger: vault,
            start: 'top top',
            end: () => `+=${Math.max(window.innerHeight * 2.6, amount() + window.innerHeight)}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
      }

      if (window.matchMedia('(pointer:fine)').matches) {
        gsap.utils.toArray<HTMLElement>('.button, .icon-button, .menu-button, .brand').forEach((element) => {
          const handleMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect()
            const x = event.clientX - (rect.left + rect.width / 2)
            const y = event.clientY - (rect.top + rect.height / 2)
            gsap.to(element, {
              x: x * 0.18,
              y: y * 0.18,
              duration: 0.42,
              ease: 'power3.out',
              overwrite: true,
            })
          }
          const handleLeave = () => {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.65,
              ease: 'elastic.out(1, 0.45)',
              overwrite: true,
            })
          }
          element.addEventListener('pointermove', handleMove)
          element.addEventListener('pointerleave', handleLeave)
          cleanups.push(() => {
            element.removeEventListener('pointermove', handleMove)
            element.removeEventListener('pointerleave', handleLeave)
          })
        })
      }
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      context.revert()
    }
  }, [enabled])
}
