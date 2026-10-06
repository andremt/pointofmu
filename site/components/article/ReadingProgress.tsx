'use client'
import { useEffect, useRef } from 'react'

export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? Math.min(1, scrolled / total) : 0
      if (barRef.current) barRef.current.style.width = `${pct * 100}%`
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: 'transparent' }}>
      <div ref={barRef} style={{ height: '100%', background: 'var(--pom-pink)', width: '0%', transition: 'width 0.1s linear' }} />
    </div>
  )
}
