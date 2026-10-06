import TopNav from '@/components/nav/TopNav'
import Footer from '@/components/ui/Footer'
import NewsletterEmbed from '@/components/ui/NewsletterEmbed'

export const metadata = { title: 'μ-letter', robots: { index: false, follow: false } }

export default function NewsletterPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <NewsletterEmbed variant="full" />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '80px 36px' }}>
        <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 28, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 32 }}>
          What you get
        </h2>
        {[
          ['One story', 'Every week, one data story, fully sourced, beautifully charted, under 5 minutes to read.'],
          ['The raw data', 'Every issue links to the underlying dataset. Download it, poke at it, prove me wrong.'],
          ['No noise', 'No sponsored content, no partner deals, no 14-story roundups. Just the thing.'],
          ['Early access', 'Subscribers get articles 48 hours before they go public.'],
        ].map(([title, body]) => (
          <div key={title} style={{ display: 'flex', gap: 20, padding: '20px 0', borderBottom: '1px solid var(--pom-rule)' }}>
            <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, fontStyle: 'italic', color: 'var(--pom-pink)', flexShrink: 0, lineHeight: 1 }}>μ</span>
            <div>
              <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--pom-ink)', marginBottom: 4 }}>{title}</div>
              <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, lineHeight: 1.65, color: 'var(--pom-ink-soft)' }}>{body}</div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
