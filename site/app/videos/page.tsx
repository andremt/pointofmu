import TopNav from '@/components/nav/TopNav'
import Footer from '@/components/ui/Footer'
import VideoCard from '@/components/video/VideoCard'
import { VIDEOS } from '@/lib/videos'

export const metadata = { title: 'Videos' }

export default function VideosPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 36px 100px' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 12 }}>
          μ · Short films
        </div>
        <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(32px,5vw,52px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 48 }}>
          Data stories under two minutes.
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {VIDEOS.map((v, i) => (
            <VideoCard
              key={v.slug}
              slug={v.slug}
              title={v.title}
              kicker={v.kicker}
              duration={v.duration}
              palette={i}
              size="lg"
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
