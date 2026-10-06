'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import TikTokEmbed from '../article/TikTokEmbed'

interface Props {
  open: boolean
  onClose: () => void
  src?: string
  tiktokUrl?: string
}

/** Fullscreen video overlay, portaled to <body> so it always covers the
 *  whole viewport regardless of where it's mounted (e.g. inside a sidebar
 *  that gets display:none on narrow screens). Click outside, ×, or Escape
 *  all close it. */
export default function VideoModal({ open, onClose, src, tiktokUrl }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted || !open || (!src && !tiktokUrl)) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(14,14,16,0.92)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        style={{
          position: 'absolute', top: 20, right: 24, background: 'transparent', border: 'none',
          color: 'var(--pom-paper)', fontSize: 32, lineHeight: 1, cursor: 'pointer', opacity: 0.75,
        }}
      >
        ×
      </button>
      {src ? (
        <video
          src={src}
          autoPlay
          controls
          playsInline
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, background: '#000', display: 'block' }}
        />
      ) : tiktokUrl ? (
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400 }}>
          <TikTokEmbed url={tiktokUrl} />
        </div>
      ) : null}
    </div>,
    document.body
  )
}
