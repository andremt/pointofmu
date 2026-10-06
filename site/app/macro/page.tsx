import TopNav from '@/components/nav/TopNav'
import Footer from '@/components/ui/Footer'
import Ticker from '@/components/nav/Ticker'

export const metadata = { title: 'Macro' }

const PAPERS = [
  {
    title: 'Carry Trade Returns Across Asset Classes',
    authors: 'Koijen, Moskowitz, Pedersen, Vrugt (2018)',
    journal: 'Journal of Finance',
    summary: 'Carry predicts returns across currencies, equities, bonds, and commodities. Replicating the cross-asset carry factor.',
    tag: 'carry',
    status: 'published',
    repo: '/macro/ilmanen',
  },
  {
    title: 'Momentum Everywhere',
    authors: 'Asness, Moskowitz, Pedersen (2013)',
    journal: 'Journal of Finance',
    summary: '12-1 momentum works across 8 asset classes and 40 countries. Reproducing the momentum factor construction and performance.',
    tag: 'momentum',
    status: 'planned',
    repo: null,
  },
  {
    title: 'Global Value and Momentum Strategies',
    authors: 'Faber (2010)',
    journal: 'SSRN',
    summary: 'Simple moving average timing rules applied to global asset allocation. Backtesting the 10-month SMA system.',
    tag: 'trend',
    status: 'planned',
    repo: null,
  },
  {
    title: 'The Death of Diversification Has Been Greatly Exaggerated',
    authors: 'Asness, Frazzini, Pedersen (2012)',
    journal: 'Financial Analysts Journal',
    summary: 'Leverage aversion and low-risk anomaly across asset classes. Replicating BAB (betting against beta) factor.',
    tag: 'risk',
    status: 'planned',
    repo: null,
  },
]

const STATUS_BG: Record<string, string> = {
  'in progress': 'var(--pom-yellow)',
  'planned': 'var(--pom-cream)',
  'published': 'var(--pom-pink)',
}
const STATUS_FG: Record<string, string> = {
  'in progress': 'var(--pom-ink)',
  'planned': 'var(--pom-ink-soft)',
  'published': '#fff',
}

export default function MacroPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <Ticker items={['Macro Quant', 'Paper Replications', 'Open Code', 'Public Data', 'Carry', 'Momentum', 'Trend Following']} />

      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 36px 0' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 20 }}>
          μ · Macro quant
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 48 }}>
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px,6vw,64px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.05, color: 'var(--pom-ink)', margin: 0, maxWidth: 600 }}>
            Replicating the research that moves markets.
          </h1>
          <a
            href="https://github.com/andremt/pointofmu/tree/main/analysis"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid var(--pom-ink)', color: 'var(--pom-ink)', borderRadius: 999, padding: '10px 20px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <GithubIcon /> github.com/andremt/pointofmu
          </a>
        </div>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.7, color: 'var(--pom-ink-soft)', maxWidth: 620, marginBottom: 64 }}>
          Taking seminal macro and quant finance papers, carry, momentum, trend, risk premia, and rebuilding their findings from scratch with public data and open code.
        </p>
      </div>

      {/* Replication log */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 36px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, borderTop: '2px solid var(--pom-ink)', paddingTop: 20 }}>
          <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', margin: 0 }}>
            Replication log
          </h2>
          <a
            href="https://github.com/andremt/pointofmu/tree/main/analysis"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--pom-pink)', textDecoration: 'none', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <GithubIcon size={13} /> All code →
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PAPERS.map((p, i) => (
            <div
              key={i}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--pom-rule)', flexWrap: 'wrap' }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)' }}>
                    μ · {p.tag}
                  </span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)' }}>· {p.journal}</span>
                </div>
                <h3 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 6, lineHeight: 1.2 }}>
                  {p.title}
                </h3>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--pom-ink-soft)', marginBottom: 10 }}>
                  {p.authors}
                </div>
                <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, lineHeight: 1.65, color: 'var(--pom-ink-soft)', margin: 0 }}>
                  {p.summary}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
                <span style={{ background: STATUS_BG[p.status], color: STATUS_FG[p.status], borderRadius: 999, padding: '5px 14px', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', border: p.status === 'planned' ? '1px solid var(--pom-rule)' : 'none' }}>
                  {p.status}
                </span>
                {p.repo && p.status === 'published' && (
                  <a href={p.repo} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--pom-ink)', color: '#fff', borderRadius: 999, padding: '7px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none' }}>
                    View dashboard →
                  </a>
                )}
                {p.repo && p.status !== 'published' && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--pom-ink-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <GithubIcon size={12} /> notebook
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Approach */}
        <div style={{ marginTop: 64, padding: '40px 36px', background: 'var(--pom-cream)', borderRadius: 16, border: '1.5px solid var(--pom-rule)' }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 16 }}>
            Approach
          </div>
          <h3 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 24 }}>
            How these replications work
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginBottom: 32 }}>
            {[
              ['Public data only', 'Yahoo Finance, FRED, Kenneth French data library, BIS. No Bloomberg terminal required.'],
              ['Python + pandas', 'All code on GitHub, Jupyter notebooks you can run locally or in Colab.'],
              ['Show the gaps', "When I can't replicate a result exactly, I document why. Data vintage, index composition, fee assumptions."],
            ].map(([title, body]) => (
              <div key={title}>
                <div style={{ fontFamily: '"Geist", sans-serif', fontWeight: 600, fontSize: 15, color: 'var(--pom-ink)', marginBottom: 6 }}>{title}</div>
                <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 13, lineHeight: 1.65, color: 'var(--pom-ink-soft)' }}>{body}</div>
              </div>
            ))}
          </div>
          <a
            href="https://github.com/andremt/pointofmu/tree/main/analysis"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--pom-pink)', color: '#fff', borderRadius: 999, padding: '11px 24px', fontFamily: '"Geist", sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            <GithubIcon /> View notebooks on GitHub
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
