'use client'
import { useState } from 'react'
import { POM_SOURCES } from '@/lib/sources'

export default function Cite({ id, children }: { id: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const src = POM_SOURCES[id]

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ borderBottom: '2px solid var(--pom-pink)', cursor: 'help', color: 'inherit' }}
      >
        {children}
      </span>
      {open && src && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--pom-ink)', color: 'var(--pom-paper)', borderRadius: 8, padding: '12px 16px',
          width: 260, fontSize: 12, lineHeight: 1.5, zIndex: 100, boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          fontFamily: '"JetBrains Mono", monospace', whiteSpace: 'normal', display: 'block',
        }}>
          <strong style={{ color: 'var(--pom-pink)', display: 'block', marginBottom: 4 }}>{src.title}</strong>
          <span style={{ opacity: 0.7 }}>{src.org} · n={src.n?.toLocaleString()}</span>
          <span style={{ display: 'block', marginTop: 4, opacity: 0.55 }}>{src.method}</span>
          {src.flavor && <span style={{ display: 'block', marginTop: 6, fontStyle: 'italic', opacity: 0.8, fontFamily: '"Instrument Serif", serif', fontSize: 13 }}>{src.flavor}</span>}
        </span>
      )}
    </span>
  )
}
