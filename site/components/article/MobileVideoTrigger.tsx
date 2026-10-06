'use client'
import { useState } from 'react'
import VideoModal from '../video/VideoModal'

interface Props {
  title: string
  src?: string
  tiktokUrl?: string
  duration?: string
}

/** Rendered outside .article-aside (which is display:none below 860px), so this
 *  is the only way mobile readers can reach the video, .article-mobile-video
 *  in globals.css hides it on desktop and shows it on mobile, the inverse of
 *  the sidebar rule. */
export default function MobileVideoTrigger({ title, src, tiktokUrl, duration }: Props) {
  const [open, setOpen] = useState(false)
  if (!src && !tiktokUrl) return null

  return (
    <div className="article-mobile-video">
      <div
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(true) }}
        style={{
          background: 'var(--pom-ink)', borderRadius: 14, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: 'var(--pom-pink)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16,
        }}>
          ▶
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--pom-paper)', lineHeight: 1.3 }}>
            Watch the summary
          </div>
          <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 13, color: 'rgba(247,244,237,0.6)', lineHeight: 1.3 }}>
            {title}
          </div>
        </div>
        {duration && (
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'rgba(247,244,237,0.5)', flexShrink: 0 }}>
            {duration}
          </span>
        )}
      </div>

      <VideoModal open={open} onClose={() => setOpen(false)} src={src} tiktokUrl={tiktokUrl} />
    </div>
  )
}
