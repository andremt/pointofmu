'use client'
import { useEffect } from 'react'
import Script from 'next/script'

type TikTokWindow = Window & { tiktok?: { embed?: { init?: () => void } } }

interface Props {
  url: string
}

export default function TikTokEmbed({ url }: Props) {
  const videoId = url.split('/').pop()?.split('?')[0] ?? ''

  useEffect(() => {
    const w = window as TikTokWindow
    w.tiktok?.embed?.init?.()
  }, [url])

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--pom-ink)' }}>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: '100%', minWidth: 0, margin: 0, border: 'none' }}
      >
        <section />
      </blockquote>
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
    </div>
  )
}
