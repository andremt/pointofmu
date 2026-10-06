interface Props {
  value: string
  label: string
  accent?: string
  size?: 'md' | 'lg'
}

export default function BigStat({ value, label, accent = 'var(--pom-pink)', size = 'lg' }: Props) {
  const fs = size === 'lg' ? 'clamp(56px,10vw,96px)' : 'clamp(36px,6vw,60px)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontWeight: 400, fontSize: fs, lineHeight: 1, color: accent, letterSpacing: -2 }}>
        {value}
      </span>
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--pom-ink-soft)' }}>
        {label}
      </span>
    </div>
  )
}
