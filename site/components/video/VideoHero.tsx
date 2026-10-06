'use client'
import { useRef, useState } from 'react'

interface Props {
  title: string
  kicker?: string
  duration?: string
  src?: string
}

export default function VideoHero({ title, kicker, duration, src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  if (src) {
    return (
      <div style={{ background: 'var(--pom-ink)', display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
          <video
            ref={videoRef}
            src={src}
            playsInline
            onEnded={() => setPlaying(false)}
            style={{ width: '100%', borderRadius: 16, display: 'block', background: '#000' }}
          />
          {!playing && (
            <button
              onClick={toggle}
              style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', background: 'rgba(14,14,16,0.45)',
                border: 'none', cursor: 'pointer', borderRadius: 16, gap: 16,
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--pom-pink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22, color: '#fff', marginLeft: 4 }}>▶</span>
              </div>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'rgba(247,244,237,0.6)',
              }}>
                {duration}
              </span>
            </button>
          )}
          {playing && (
            <button
              onClick={toggle}
              style={{
                position: 'absolute', inset: 0, background: 'transparent',
                border: 'none', cursor: 'pointer', borderRadius: 16,
              }}
            />
          )}
        </div>
      </div>
    )
  }

  // fallback placeholder
  return (
    <div style={{ background: 'var(--pom-ink)', minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: 180, height: 180, background: 'var(--pom-pink)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, fontSize: 72, color: '#fff', fontFamily: '"Instrument Serif", serif', fontStyle: 'italic' }}>
        μ
      </div>
      {kicker && (
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 16 }}>
          μ · {kicker}
        </p>
      )}
      <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(28px,5vw,48px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--pom-paper)', textAlign: 'center', maxWidth: 640, lineHeight: 1.15, marginBottom: 20 }}>
        {title}
      </h1>
      {duration && (
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'rgba(247,244,237,0.5)' }}>{duration}</span>
      )}
    </div>
  )
}
