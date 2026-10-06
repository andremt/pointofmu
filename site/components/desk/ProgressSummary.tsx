'use client'
import Link from 'next/link'
import { useDeskProgress } from './useDeskProgress'

interface Props {
  href: string
  title: string
  total: number
  storageKey: string
  palette: 'ink' | 'blue'
}

export default function ProgressSummary({ href, title, total, storageKey, palette }: Props) {
  const { done, loaded } = useDeskProgress(storageKey)
  const bg = palette === 'ink' ? 'var(--pom-ink)' : 'var(--pom-blue)'

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ background: bg, color: 'var(--pom-paper)', borderRadius: 18, padding: '28px 26px', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 22, marginBottom: 14 }}>
          {title}
        </div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, opacity: 0.75 }}>
          {loaded ? `${done.length} / ${total} read` : ' '}
        </div>
        <div style={{ height: 6, background: 'rgba(247,244,237,0.2)', borderRadius: 999, marginTop: 12, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: loaded ? `${(done.length / total) * 100}%` : 0, background: 'var(--pom-pink)', transition: 'width 0.3s ease' }} />
        </div>
      </div>
    </Link>
  )
}
