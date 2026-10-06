export default function Ticker({ items, color = 'var(--pom-ink)', bg = 'var(--pom-yellow)', speed = 40 }: { items: string[]; color?: string; bg?: string; speed?: number }) {
  const content = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', background: bg, color, borderTop: '1px solid var(--pom-ink)', borderBottom: '1px solid var(--pom-ink)', padding: '11px 0' }}>
      <div className="pom-ticker" style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: `pom-marq ${speed}s linear infinite`, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {content.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            {item} <span style={{ color: 'var(--pom-pink)', fontSize: 14 }}>μ</span>
          </span>
        ))}
      </div>
    </div>
  )
}
