import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SplitReveal({ text, className = '' }: { text: string; className?: string }) {
  const rootRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const words = root.querySelectorAll<HTMLElement>('[data-word]')
    const context = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 115, opacity: 0, rotateX: -24 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.05,
          stagger: 0.055,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            once: true,
          },
        },
      )
    }, root)
    return () => context.revert()
  }, [text])

  return (
    <h2 ref={rootRef} className={`split-reveal ${className}`.trim()} aria-label={text}>
      {text.split(' ').map((word, index) => (
        <span className="split-word-mask" key={`${word}-${index}`} aria-hidden="true">
          <span data-word>{word}</span>
          {index < text.split(' ').length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </h2>
  )
}
