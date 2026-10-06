'use client'
import ReadingProgress from '@/components/article/ReadingProgress'
import StickyVideoRail from '@/components/article/StickyVideoRail'
import MobileVideoTrigger from '@/components/article/MobileVideoTrigger'
import { ArticleMeta } from '@/lib/mdx'
import { VIDEOS } from '@/lib/videos'

interface Props {
  meta: ArticleMeta
  children: React.ReactNode
}

export default function ArticleClient({ meta, children }: Props) {
  const video = VIDEOS.find(v => v.articleSlug === meta.slug)
  const videoSlug = video?.slug
  return (
    <>
      <ReadingProgress />
      <div className={`article-outer${meta.hasVideo ? '' : ' article-outer--narrow'}`}>

        {/* Header */}
        <header style={{ maxWidth: 680, marginBottom: 48 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 20 }}>
            μ · {meta.kicker} · {meta.date} · {meta.readTime}
            {meta.n ? ` · n=${meta.n.toLocaleString()}` : ''}
          </div>
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(32px,6vw,56px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1, color: 'var(--pom-ink)', marginBottom: 20 }}>
            {meta.title}
          </h1>
          {meta.dek && (
            <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 18, lineHeight: 1.65, color: 'var(--pom-ink-soft)', borderLeft: '3px solid var(--pom-pink)', paddingLeft: 20 }}>
              {meta.dek}
            </p>
          )}
        </header>

        {/* Body */}
        {meta.hasVideo ? (
          <>
          <MobileVideoTrigger
            title={meta.title}
            src={video?.src}
            tiktokUrl={meta.tiktokUrl}
            duration={video?.duration}
          />
          <div className="article-grid">
            <article style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--pom-ink)', minWidth: 0 }}>
              {children}
            </article>
            <aside className="article-aside">
              <StickyVideoRail
                tiktokUrl={meta.tiktokUrl}
                videoSlug={videoSlug}
                videoSrc={video?.src}
                videoDuration={video?.duration}
                timestamps={meta.timestamps}
                title={meta.title}
              />
            </aside>
          </div>
          </>
        ) : (
          <article style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--pom-ink)' }}>
            {children}
          </article>
        )}
      </div>
    </>
  )
}
