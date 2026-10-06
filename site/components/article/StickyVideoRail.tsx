'use client'
import { useState } from 'react'
import TikTokEmbed from './TikTokEmbed'
import VideoModal from '../video/VideoModal'
import type { Timestamp } from '@/lib/mdx'

interface Props {
  tiktokUrl?: string
  videoSlug?: string
  videoSrc?: string
  videoDuration?: string
  timestamps?: Timestamp[]
  title: string
}

export default function StickyVideoRail({ tiktokUrl, videoSlug, videoSrc, videoDuration, timestamps, title }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Video */}
      {tiktokUrl ? (
        <TikTokEmbed url={tiktokUrl} />
      ) : videoSlug ? (
        <div
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(true) }}
          style={{ background: 'var(--pom-ink)', borderRadius: 16, aspectRatio: '9/16', maxHeight: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, cursor: 'pointer' }}
        >
          <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 48, fontStyle: 'italic', color: 'var(--pom-pink)' }}>μ</div>
          <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 16, fontStyle: 'italic', color: 'var(--pom-paper)', textAlign: 'center', lineHeight: 1.3 }}>
            {title}
          </div>
          <div style={{ background: 'var(--pom-pink)', color: '#fff', borderRadius: 999, padding: '10px 22px', fontFamily: '"Geist", sans-serif', fontSize: 13, fontWeight: 600 }}>
            Watch the summary →
          </div>
          {videoDuration && (
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'rgba(247,244,237,0.5)' }}>
              {videoDuration}
            </span>
          )}
        </div>
      ) : null}

      <VideoModal open={open} onClose={() => setOpen(false)} src={videoSrc} />

      {/* Timestamp annotations */}
      {timestamps && timestamps.length > 0 && (
        <div style={{ background: 'var(--pom-cream)', borderRadius: 12, border: '1px solid var(--pom-rule)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--pom-rule)' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)' }}>
              μ · In the video
            </span>
          </div>
          {timestamps.map((t, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < timestamps.length - 1 ? '1px solid var(--pom-rule)' : 'none', alignItems: 'flex-start' }}
            >
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: 'var(--pom-pink)', flexShrink: 0, paddingTop: 1 }}>
                {t.time}
              </span>
              <div>
                <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--pom-ink)', marginBottom: t.note ? 3 : 0 }}>
                  {t.label}
                </div>
                {t.note && (
                  <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 12, color: 'var(--pom-ink-soft)', lineHeight: 1.5 }}>
                    {t.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TikTok CTA */}
      {tiktokUrl && (
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#010101', color: '#fff', borderRadius: 999, padding: '10px 18px', fontFamily: '"Geist", sans-serif', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
        >
          <TikTokIcon /> Watch on TikTok
        </a>
      )}
    </div>
  )
}

function TikTokIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z"/>
    </svg>
  )
}
