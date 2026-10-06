import TopNav from '@/components/nav/TopNav'
import Footer from '@/components/ui/Footer'
import Ticker from '@/components/nav/Ticker'
import IlmanenDashboard from './IlmanenDashboard'

export const metadata = { title: 'Five Factor Strategies' }

export default function IlmanenPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <Ticker items={['Factor Strategies', 'FX Carry', 'Trend Following', 'Value', 'BAB', 'Signal Stack', 'Ilmanen']} />

      {/* Hero header */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 36px 0' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 20 }}>
          μ · Macro quant · Ilmanen
        </div>
        <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px,6vw,64px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.05, color: 'var(--pom-ink)', margin: '0 0 24px', maxWidth: 680 }}>
          Five factor strategies, built from scratch.
        </h1>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.7, color: 'var(--pom-ink-soft)', maxWidth: 620, marginBottom: 64 }}>
          I spent a semester reading Ilmanen&apos;s <em>Expected Returns</em> and wondering, do these strategies actually hold up when you implement them yourself with real data? Here&apos;s what I found.
        </p>

        {/* Stats row, 5 strategy sharpes as quick summary */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 64, borderTop: '2px solid var(--pom-ink)', paddingTop: 32 }}>
          {[
            { label: 'FX Carry',     sharpe: '-0.09', color: 'var(--pom-ink-soft)' },
            { label: 'Trend',        sharpe: '0.36',  color: 'var(--pom-blue)' },
            { label: 'Value',        sharpe: '0.22',  color: 'var(--pom-blue)' },
            { label: 'BAB',          sharpe: '1.06',  color: 'var(--pom-pink)' },
            { label: 'Signal Stack', sharpe: '-0.34', color: 'var(--pom-ink-soft)' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 32, color: s.color, lineHeight: 1 }}>{s.sharpe}</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)', marginTop: 4 }}>Sharpe ratio</div>
            </div>
          ))}
        </div>
      </div>

      <IlmanenDashboard />
      <Footer />
    </div>
  )
}
