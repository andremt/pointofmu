'use client'
import Link from 'next/link'
import { useState } from 'react'

const PALETTES = [
  { bg: 'var(--pom-paper)', border: 'var(--pom-rule)', kicker: 'var(--pom-pink)' },
  { bg: 'var(--pom-ink)', border: 'transparent', kicker: 'var(--pom-yellow)' },
  { bg: 'var(--pom-yellow)', border: 'var(--pom-ink)', kicker: 'var(--pom-ink)' },
  { bg: 'var(--pom-pink)', border: 'transparent', kicker: '#fff' },
  { bg: 'var(--pom-blue)', border: 'transparent', kicker: 'var(--pom-yellow)' },
  { bg: 'var(--pom-cream)', border: 'var(--pom-rule)', kicker: 'var(--pom-blue)' },
]

interface Props {
  slug: string
  title: string
  dek?: string
  kicker?: string
  date?: string
  readTime?: string
  palette?: number
  big?: boolean
}

export default function StoryCard({ slug, title, dek, kicker, date, readTime, palette = 0, big }: Props) {
  const [hovered, setHovered] = useState(false)
  const pal = PALETTES[palette % PALETTES.length]
  const isInk = pal.bg === 'var(--pom-ink)' || pal.bg === 'var(--pom-pink)' || pal.bg === 'var(--pom-blue)'
  const fg = isInk ? 'var(--pom-paper)' : 'var(--pom-ink)'

  return (
    <Link href={`/articles/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: pal.bg,
          border: `1.5px solid ${pal.border}`,
          borderRadius: 16,
          padding: big ? '40px 36px' : '28px 24px',
          color: fg,
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {kicker && (
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: pal.kicker, marginBottom: 14 }}>
            μ · {kicker} {date ? `· ${date}` : ''} {readTime ? `· ${readTime}` : ''}
          </div>
        )}
        <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: big ? 'clamp(24px,4vw,38px)' : 20, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.2, margin: '0 0 12px', color: fg }}>
          {title}
        </h2>
        {dek && (
          <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, lineHeight: 1.6, color: fg, opacity: 0.75, margin: 0 }}>
            {dek}
          </p>
        )}
      </article>
    </Link>
  )
}
