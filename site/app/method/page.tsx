import TopNav from '@/components/nav/TopNav'
import Footer from '@/components/ui/Footer'
import SourceTable from '@/components/ui/SourceTable'

export const metadata = { title: 'Method' }

export default function MethodPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 36px 80px' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 12 }}>
          μ · Methodology
        </div>
        <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(32px,5vw,52px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 24 }}>
          How I work
        </h1>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 48, maxWidth: 640 }}>
          Every data point in every story is sourced from one of the datasets below. I analyse publicly available data. All raw data is available for download.
        </p>

        <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 24 }}>
          Datasets
        </h2>
        <SourceTable />

      </div>
      <Footer />
    </div>
  )
}
