'use client'
import { useEffect, useRef, useState } from 'react'
import LineChart, { LineChartPoint } from './LineChart'

interface Props {
  points: LineChartPoint[]
  xLabels?: string[]
  yLabel?: string
  caption?: string
}

export default function StickyScrollChart({ points, xLabels, yLabel, caption }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [hlIndex, setHlIndex] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      const total = rect.height - viewH
      if (total <= 0) { setProgress(1); setHlIndex(points.length - 1); return }
      const p = Math.max(0, Math.min(1, -rect.top / total))
      setProgress(p)
      setHlIndex(Math.floor(p * (points.length - 1)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [points.length])

  return (
    <div ref={containerRef} style={{ height: '250vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '0 24px' }}>
        <LineChart points={points} width={640} height={280} progress={progress} highlightIndex={hlIndex} xLabels={xLabels} yLabel={yLabel} />
        {caption && (
          <p style={{ marginTop: 16, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--pom-ink-soft)', textAlign: 'center', maxWidth: 480 }}>
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}
