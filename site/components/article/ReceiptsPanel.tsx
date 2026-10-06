import { POM_SOURCES, Source } from '@/lib/sources'

interface Props { sourceId: string; downloadUrl?: string }

export default function ReceiptsPanel({ sourceId, downloadUrl }: Props) {
  const src: Source | undefined = POM_SOURCES[sourceId]
  if (!src) return null
  return (
    <aside style={{ background: 'var(--pom-yellow)', border: '1.5px solid var(--pom-ink)', borderRadius: 10, padding: '12px 16px', margin: '10px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, fontStyle: 'italic', color: 'var(--pom-ink)', lineHeight: 1, flexShrink: 0, opacity: 0.7 }}>μ</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: '"Geist", sans-serif', fontWeight: 600, fontSize: 13.5, color: 'var(--pom-ink)' }}>{src.title}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, color: 'var(--pom-ink)', opacity: 0.55 }}>
            {src.org} · n={src.n?.toLocaleString()}
          </span>
        </div>
        <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 11.5, color: 'var(--pom-ink)', opacity: 0.65, marginTop: 1 }}>
          {src.method}
        </div>
      </div>
      {downloadUrl && (
        <a href={downloadUrl} download style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, fontWeight: 600, color: 'var(--pom-ink)', textDecoration: 'none', borderBottom: '1.5px solid var(--pom-ink)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          CSV →
        </a>
      )}
    </aside>
  )
}
