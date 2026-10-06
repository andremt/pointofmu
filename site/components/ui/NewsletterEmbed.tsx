'use client'
import { useState } from 'react'

interface Props {
  variant?: 'inline' | 'full'
}

export default function NewsletterEmbed({ variant = 'inline' }: Props) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('failed')
      setState('done')
    } catch {
      setState('idle')
      alert('Something went wrong, please try again.')
    }
  }

  if (variant === 'full') {
    return (
      <div style={{ background: 'var(--pom-ink)', color: 'var(--pom-paper)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 20 }}>
          μ-letter · Free newsletter
        </div>
        <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(28px,5vw,52px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1, marginBottom: 16, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          Data stories in your inbox, weekly.
        </h2>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, color: 'rgba(247,244,237,0.65)', marginBottom: 40, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          No noise. Just one chart, one story, one minute every week.
        </p>
        <SubForm email={email} setEmail={setEmail} state={state} onSubmit={submit} />
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--pom-cream)', border: '1.5px solid var(--pom-rule)', borderRadius: 16, padding: '32px 28px', maxWidth: 480 }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 12 }}>
        μ-letter
      </div>
      <h3 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.2, marginBottom: 8, color: 'var(--pom-ink)' }}>
        One story, once a week.
      </h3>
      <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 13, color: 'var(--pom-ink-soft)', marginBottom: 20 }}>
        Free. No spam. Unsubscribe anytime.
      </p>
      <SubForm email={email} setEmail={setEmail} state={state} onSubmit={submit} dark={false} />
    </div>
  )
}

function SubForm({ email, setEmail, state, onSubmit, dark = true }: {
  email: string; setEmail: (v: string) => void; state: string; onSubmit: (e: React.FormEvent) => void; dark?: boolean
}) {
  if (state === 'done') {
    return <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: 'var(--pom-pink)', textAlign: 'center' }}>You&apos;re in! μ</p>
  }
  const inputBg = dark ? 'rgba(247,244,237,0.08)' : '#fff'
  const inputColor = dark ? 'var(--pom-paper)' : 'var(--pom-ink)'
  const border = dark ? 'rgba(247,244,237,0.15)' : 'var(--pom-rule)'
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com" required
        style={{ flex: 1, minWidth: 180, background: inputBg, border: `1px solid ${border}`, borderRadius: 999, padding: '10px 18px', fontFamily: '"Geist", sans-serif', fontSize: 14, color: inputColor, outline: 'none' }}
      />
      <button
        type="submit" disabled={state === 'loading'}
        style={{ background: 'var(--pom-pink)', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 22px', fontFamily: '"Geist", sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        {state === 'loading' ? '...' : 'Subscribe →'}
      </button>
    </form>
  )
}
