'use client'
import { useDeskProgress } from './useDeskProgress'

export default function MarkReadToggle({ slug, storageKey }: { slug: string; storageKey: string }) {
  const { done, toggle, loaded } = useDeskProgress(storageKey)
  const isDone = done.includes(slug)

  return (
    <button
      onClick={() => toggle(slug)}
      style={{
        fontFamily: '"Geist", sans-serif', fontSize: 13, fontWeight: 600,
        padding: '9px 16px', borderRadius: 999,
        border: `1.5px solid ${isDone ? 'var(--pom-pink)' : 'var(--pom-rule)'}`,
        background: isDone ? 'var(--pom-pink)' : 'transparent',
        color: isDone ? '#fff' : 'var(--pom-ink)',
        cursor: 'pointer', opacity: loaded ? 1 : 0,
      }}
    >
      {isDone ? '✓ Read' : 'Mark read'}
    </button>
  )
}
