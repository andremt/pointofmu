'use client'
import { useRef, useState } from 'react'
import { getVideo } from '@/lib/videos'
import VideoModal from './VideoModal'

const PALETTES = [
  { bg: 'var(--pom-ink)', fg: 'var(--pom-paper)', accent: 'var(--pom-pink)' },
  { bg: 'var(--pom-pink)', fg: '#fff', accent: 'var(--pom-yellow)' },
  { bg: 'var(--pom-yellow)', fg: 'var(--pom-ink)', accent: 'var(--pom-pink)' },
  { bg: 'var(--pom-blue)', fg: '#fff', accent: 'var(--pom-yellow)' },
  { bg: 'var(--pom-cream)', fg: 'var(--pom-ink)', accent: 'var(--pom-blue)' },
]

interface Props {
  slug: string
  title: string
  kicker?: string
  duration?: string
  palette?: number
  size?: 'sm' | 'md' | 'lg'
  fullBleed?: boolean
}

export default function VideoCard({ slug, title, kicker, duration, palette = 0, size = 'md', fullBleed }: Props) {
  const pal = PALETTES[palette % PALETTES.length]
  const progressRef = useRef<HTMLDivElement>(null)
  const [scrub, setScrub] = useState(0)
  const [open, setOpen] = useState(false)
  const video = getVideo(slug)

  const heights: Record<string, number> = { sm: 160, md: 220, lg: 300 }
  const h = heights[size]

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    setScrub(Math.max(0, Math.min(1, x)))
    if (progressRef.current) progressRef.current.style.width = `${x * 100}%`
  }

  return (
    <>
    <div
      onClick={() => setOpen(true)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(true) }}
      style={{ borderRadius: fullBleed ? 0 : 12, overflow: 'hidden', background: pal.bg, color: pal.fg, position: 'relative', height: h, flexShrink: 0, cursor: 'pointer' }}
    >
      <div
        onMouseMove={onMove}
        onMouseLeave={() => { setScrub(0); if (progressRef.current) progressRef.current.style.width = '0%' }}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20, boxSizing: 'border-box' }}
      >
        {kicker && (
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: pal.accent, marginBottom: 8 }}>
            μ · {kicker}
          </span>
        )}
        <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: size === 'lg' ? 26 : 18, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.2, marginBottom: 12 }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {duration && (
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, opacity: 0.7 }}>{duration}</span>
          )}
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, opacity: 0.55, transform: `scale(${1 + scrub * 0.3})`, transition: 'transform 0.1s ease', display: 'inline-block' }}>
            ▶
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: pal.accent, width: 0, transition: 'width 0.05s linear' }} ref={progressRef} />
      </div>
    </div>
    <VideoModal open={open} onClose={() => setOpen(false)} src={video?.src} tiktokUrl={video?.tiktokUrl} />
    </>
  )
}
