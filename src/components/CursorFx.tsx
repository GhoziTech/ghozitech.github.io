import { useEffect, useMemo, useRef, useState } from 'react'

type Particle = { id: number; x: number; y: number; size: number; hue: 'cyan' | 'violet' }

export function CursorFx() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 })
  const [particles, setParticles] = useState<Particle[]>([])
  const particleId = useRef(0)
  const finePointer = useMemo(() => window.matchMedia('(pointer:fine)').matches, [])

  useEffect(() => {
    if (!finePointer) return

    let frame = 0
    let spawnTick = 0
    const animate = () => {
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.18
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.18
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${pointer.current.x}px, ${pointer.current.y}px, 0)`
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pointer.current.tx}px, ${pointer.current.ty}px, 0)`
      frame = requestAnimationFrame(animate)
    }

    const handleMove = (event: PointerEvent) => {
      pointer.current.tx = event.clientX
      pointer.current.ty = event.clientY
      const speed = Math.abs(event.movementX) + Math.abs(event.movementY)
      const now = performance.now()
      if (speed > 4 && now - spawnTick > 45) {
        spawnTick = now
        const particle: Particle = {
          id: particleId.current++,
          x: event.clientX,
          y: event.clientY,
          size: 10 + Math.random() * 16,
          hue: Math.random() > 0.5 ? 'cyan' : 'violet',
        }
        setParticles((current) => [...current.slice(-12), particle])
      }
    }

    const handleLeave = () => {
      document.body.classList.add('cursor-hidden')
    }
    const handleEnter = () => {
      document.body.classList.remove('cursor-hidden')
    }

    frame = requestAnimationFrame(animate)
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('mouseout', handleLeave)
    window.addEventListener('mouseover', handleEnter)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('mouseout', handleLeave)
      window.removeEventListener('mouseover', handleEnter)
    }
  }, [finePointer])

  useEffect(() => {
    if (!particles.length) return
    const timeout = window.setTimeout(() => {
      setParticles((current) => current.slice(1))
    }, 420)
    return () => window.clearTimeout(timeout)
  }, [particles])

  if (!finePointer) return null

  return (
    <div className="cursor-fx" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`cursor-particle ${particle.hue}`}
          style={{ left: particle.x, top: particle.y, width: particle.size, height: particle.size }}
        />
      ))}
    </div>
  )
}
