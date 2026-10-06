'use client'
import { useState } from 'react'
import { POM_SOURCES, Source } from '@/lib/sources'

export default function SourceTable() {
  const [hovered, setHovered] = useState<string | null>(null)
  const sources = Object.values(POM_SOURCES)

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Geist", sans-serif', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--pom-ink)' }}>
            {['Dataset', 'Organization', 'n', 'Method'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-ink-soft)', fontWeight: 500 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.map((src: Source) => (
            <tr
              key={src.id}
              onMouseEnter={() => setHovered(src.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ borderBottom: '1px solid var(--pom-rule)', background: hovered === src.id ? 'var(--pom-cream)' : 'transparent', transition: 'background 0.15s ease', cursor: 'default' }}
            >
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--pom-ink)' }}>{src.title}</td>
              <td style={{ padding: '14px 16px', color: 'var(--pom-ink-soft)' }}>{src.org}</td>
              <td style={{ padding: '14px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--pom-ink-soft)' }}>{src.n?.toLocaleString()}</td>
              <td style={{ padding: '14px 16px', color: 'var(--pom-ink-soft)', maxWidth: 280 }}>{src.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
