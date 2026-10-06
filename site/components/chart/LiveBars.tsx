'use client'
import { useEffect, useRef } from 'react'

const BARS = 7
const COLORS = ['var(--pom-pink)', 'var(--pom-blue)', 'var(--pom-yellow)', 'var(--pom-pink)', 'var(--pom-blue)', 'var(--pom-yellow)', 'var(--pom-pink)']

export default function LiveBars({ height = 80 }: { height?: number }) {
  const phaseRef = useRef(0)
  const frameRef = useRef<number>(0)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const tick = () => {
      phaseRef.current += 0.04
      barsRef.current.forEach((el, i) => {
        if (!el) return
        const v = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(phaseRef.current + i * 0.9))
        el.style.height = `${v * 100}%`
      })
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height, padding: '0 4px' }}>
      {Array.from({ length: BARS }).map((_, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: '100%' }}>
          <div
            ref={el => { barsRef.current[i] = el }}
            style={{ width: '100%', background: COLORS[i], borderRadius: '3px 3px 0 0', transition: 'height 0.12s ease', height: '50%' }}
          />
        </div>
      ))}
    </div>
  )
}
