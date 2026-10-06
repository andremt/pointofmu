import MuMark from './MuMark'

export default function Wordmark({ size = 22, color = 'var(--pom-ink)' }: { size?: number; color?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color, lineHeight: 1 }}>
      <MuMark size={size * 1.15} color={color} />
      <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: size * 1.55, letterSpacing: -1, fontStyle: 'italic', fontWeight: 400 }}>pointof</span>
      <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: size * 1.55, letterSpacing: -1, fontStyle: 'italic', color: 'var(--pom-pink)', fontWeight: 400, marginLeft: -4 }}>μ</span>
    </div>
  )
}
