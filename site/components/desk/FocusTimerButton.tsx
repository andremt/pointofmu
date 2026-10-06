'use client'
import { useEffect, useRef, useState } from 'react'

export default function FocusTimerButton({ minutes = 15 }: { minutes?: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  function start() {
    setSecondsLeft(minutes * 60)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s === null) return null
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSecondsLeft(null)
  }

  if (secondsLeft === null) {
    return (
      <button
        onClick={start}
        style={{
          fontFamily: '"Geist", sans-serif', fontSize: 14, fontWeight: 600,
          padding: '11px 20px', borderRadius: 999, border: 'none',
          background: 'var(--pom-ink)', color: 'var(--pom-paper)', cursor: 'pointer',
        }}
      >
        Start a {minutes}-min timer →
      </button>
    )
  }

  const mm = Math.floor(secondsLeft / 60)
  const ss = secondsLeft % 60
  const done = secondsLeft === 0

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 20, fontWeight: 600,
        color: done ? 'var(--pom-pink)' : 'var(--pom-ink)', minWidth: 64,
      }}>
        {done ? "time's up" : `${mm}:${ss.toString().padStart(2, '0')}`}
      </span>
      <button
        onClick={stop}
        style={{
          fontFamily: '"Geist", sans-serif', fontSize: 13, color: 'var(--pom-ink-soft)',
          background: 'none', border: '1px solid var(--pom-rule)', borderRadius: 999,
          padding: '6px 14px', cursor: 'pointer',
        }}
      >
        {done ? 'Reset' : 'Stop'}
      </button>
    </div>
  )
}
