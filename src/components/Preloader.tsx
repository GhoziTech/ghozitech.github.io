import { useEffect, useState } from 'react'

export function Preloader() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem('identity-reactor-loaded') !== '1')
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    if (!visible) return
    let frame = 0
    const interval = window.setInterval(() => {
      frame += 1
      setProgress((value) => Math.min(94, value + Math.max(2, Math.round((100 - value) / 8))))
      if (frame > 12) window.clearInterval(interval)
    }, 80)
    const done = window.setTimeout(() => {
      setProgress(100)
      window.setTimeout(() => {
        sessionStorage.setItem('identity-reactor-loaded', '1')
        setVisible(false)
      }, 260)
    }, 1200)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(done)
    }
  }, [visible])

  if (!visible) return null
  return (
    <div className="preloader" aria-live="polite">
      <div className="preloader-mark">HG</div>
      <p>CALIBRATING IDENTITY</p>
      <div className="preloader-line"><span style={{ width: `${progress}%` }} /></div>
      <small>{String(progress).padStart(3, '0')}</small>
    </div>
  )
}
