'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const res = await fetch('/api/desk/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push(params.get('from') || '/desk')
      router.refresh()
    } else {
      setError(true)
    }
  }

  return (
    <form onSubmit={submit} style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 32, color: 'var(--pom-paper)', textAlign: 'center', marginBottom: 8 }}>
        the desk
      </div>
      <input
        type="password"
        autoFocus
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          fontFamily: '"Geist", sans-serif',
          fontSize: 16,
          padding: '14px 16px',
          borderRadius: 10,
          border: `1.5px solid ${error ? 'var(--pom-pink)' : 'rgba(247,244,237,0.2)'}`,
          background: 'rgba(247,244,237,0.05)',
          color: 'var(--pom-paper)',
          outline: 'none',
        }}
      />
      {error && (
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--pom-pink)', textAlign: 'center' }}>
          wrong password
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        style={{
          fontFamily: '"Geist", sans-serif',
          fontSize: 15,
          fontWeight: 600,
          padding: '13px 16px',
          borderRadius: 10,
          border: 'none',
          background: 'var(--pom-pink)',
          color: '#fff',
          cursor: loading || !password ? 'default' : 'pointer',
          opacity: loading || !password ? 0.6 : 1,
        }}
      >
        {loading ? 'Checking…' : 'Enter'}
      </button>
    </form>
  )
}

export default function DeskLoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pom-ink)', padding: 24 }}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
