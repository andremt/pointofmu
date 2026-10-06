import TopNav from '@/components/nav/TopNav'
import StoryCard from '@/components/ui/StoryCard'
import Footer from '@/components/ui/Footer'
import { getAllArticles } from '@/lib/mdx'

export const metadata = { title: 'Archive' }

const PLACEHOLDER = [
  { slug: '2026-05-first-date-cost', title: 'How Much Does a First Date Cost in 2026?', dek: 'I analyzed 11,042 first-date receipts so you don\'t have to.', kicker: 'economics', date: 'May 2026', readTime: '6 min' },
  { slug: '2026-04-streaming-shame', title: 'Your Streaming Habits Are Embarrassing', dek: 'Four thousand people shared their listening history. The truth is awkward.', kicker: 'culture', date: 'Apr 2026', readTime: '5 min' },
  { slug: '2026-03-nba-clutch', title: 'NBA Players Choke Under Pressure', dek: 'The data on last-minute shots is damning.', kicker: 'sports', date: 'Mar 2026', readTime: '4 min' },
  { slug: '2026-02-cpi-food', title: 'The Real Price of Eating Out', dek: 'CPI says +23%. My receipts say more.', kicker: 'economics', date: 'Feb 2026', readTime: '5 min' },
  { slug: '2026-01-tiktok-fyp', title: 'The Algorithm Knows You Better Than You Do', dek: 'I ran 80 identical accounts for 14 days. They diverged on day 3.', kicker: 'tech', date: 'Jan 2026', readTime: '7 min' },
  { slug: '2025-12-hinge-data', title: 'I Audited 200 Hinge Matches', dek: 'What actually predicts a second date? Not what you think.', kicker: 'dating', date: 'Dec 2025', readTime: '6 min' },
]

export default function ArchivePage() {
  const articles = getAllArticles()
  const items = articles.length > 0 ? articles : PLACEHOLDER

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '60px 36px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 12 }}>
            μ · All stories
          </div>
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(32px,5vw,52px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)' }}>
            Archive
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {items.map((a, i) => (
            <StoryCard key={a.slug} {...a} palette={i % 6} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
