import TopNav from '@/components/nav/TopNav'
import VideoHero from '@/components/video/VideoHero'
import TikTokEmbed from '@/components/article/TikTokEmbed'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { getVideo } from '@/lib/videos'
import { notFound } from 'next/navigation'

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = getVideo(slug)

  if (!video) notFound()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav theme="ink" />

      {video.src ? (
        <VideoHero
          title={video.title}
          kicker={video.kicker}
          duration={video.duration}
          src={video.src}
        />
      ) : video.tiktokUrl ? (
        <div style={{ maxWidth: 400, margin: '48px auto 0', padding: '0 24px' }}>
          <TikTokEmbed url={video.tiktokUrl} />
        </div>
      ) : null}

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 20 }}>
          μ · EP {String(video.episode).padStart(3, '0')} · {video.date}
        </div>

        <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(26px,4vw,40px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-ink)', lineHeight: 1.2, marginBottom: 32 }}>
          {video.title}
        </h1>

        <div style={{ padding: '24px 28px', background: 'var(--pom-cream)', borderRadius: 12, border: '1.5px solid var(--pom-rule)', marginBottom: 40 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 12 }}>
            tl;dr
          </div>
          <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, lineHeight: 1.75, color: 'var(--pom-ink)', margin: 0 }}>
            {video.tldr}
          </p>
        </div>

        {video.articleSlug && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--pom-ink-soft)', letterSpacing: '0.04em' }}>
              Full analysis
            </span>
            <Link
              href={`/articles/${video.articleSlug}`}
              style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--pom-pink)', textDecoration: 'none', borderBottom: '1px solid var(--pom-pink)', paddingBottom: 1 }}
            >
              Read the article →
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
