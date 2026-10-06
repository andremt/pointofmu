import TopNav from '@/components/nav/TopNav'
import Ticker from '@/components/nav/Ticker'
import StoryCard from '@/components/ui/StoryCard'
import VideoCard from '@/components/video/VideoCard'
import Footer from '@/components/ui/Footer'
import LiveBars from '@/components/chart/LiveBars'
import { getAllArticles } from '@/lib/mdx'

const TICKER_ITEMS = [
  'Data Stories', 'Labour Share', '42 Seconds', 'NBA Analytics',
  'Marriage Markets', 'Ad Measurement', 'Finishing Luck', 'Yield Curves',
]

export default function HomePage() {
  const articles = getAllArticles()
  const totalDataPoints = articles.reduce((sum, a) => sum + (a.n ?? 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <Ticker items={TICKER_ITEMS} />

      {/* Hero */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 36px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 12 }}>
            μ · Data journalism · 42 seconds at a time
          </div>
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px,5.5vw,68px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.05, color: 'var(--pom-ink)', marginBottom: 16, letterSpacing: -1 }}>
            The data behind<br />everyday life.
          </h1>
          <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 16, lineHeight: 1.65, color: 'var(--pom-ink-soft)', marginBottom: 24, maxWidth: 400 }}>
            I take real papers and public data and test their claims, wages, marriage markets, sports analytics, ad measurement, and turn what I find into stories.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/articles/2026-06-new-yield-paradigm" style={{ background: 'var(--pom-pink)', color: '#fff', borderRadius: 999, padding: '11px 22px', fontFamily: '"Geist", sans-serif', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Read latest →
            </a>
          </div>
        </div>
        <div style={{ background: 'var(--pom-ink)', borderRadius: 20, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-yellow)' }}>
            Across the μ desk
          </div>
          <LiveBars height={64} />
          <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, fontStyle: 'italic', color: 'var(--pom-paper)', lineHeight: 1.2 }}>
            {totalDataPoints.toLocaleString()} data points analyzed across {articles.length} stories
          </div>
        </div>
      </section>

      {/* Latest stories */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 36px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 26, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)' }}>
            Latest stories
          </h2>
          <a href="/archive" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--pom-pink)', textDecoration: 'none', letterSpacing: '0.05em' }}>
            All stories →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {articles.length > 0 ? articles.slice(0, 3).map((a, i) => (
            <StoryCard key={a.slug} slug={a.slug} title={a.title} dek={a.dek} kicker={a.kicker} date={a.date} readTime={a.readTime} palette={i} big={i === 0} />
          )) : (
            <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, color: 'var(--pom-ink-soft)' }}>
              No stories published yet.
            </p>
          )}
        </div>
      </section>

      {/* Videos */}
      <section style={{ background: 'var(--pom-cream)', borderTop: '1px solid var(--pom-rule)', borderBottom: '1px solid var(--pom-rule)', padding: '40px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 26, fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)' }}>
              Short films
            </h2>
            <a href="/videos" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--pom-pink)', textDecoration: 'none', letterSpacing: '0.05em' }}>
              All videos →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
            <VideoCard slug="ep8-marriage-squeeze" title="College Women Kept Marrying. Everyone Else Didn't." kicker="economics" duration="2:01" palette={0} size="lg" />
            <VideoCard slug="ep7-nba-sutva" title="The Mid-Range Shot Is Dead. So Why Are Teams Making More of Them?" kicker="measurement" duration="1:37" palette={3} size="lg" />
            <VideoCard slug="ep5-canadian-wages" title="For the First Time, Men Over 65 Out-Earn Men 25-34." kicker="economics" duration="0:42" palette={1} size="lg" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
