'use client'
import Link from 'next/link'
import { useDeskProgress } from './useDeskProgress'

export interface TopicGridItem {
  slug: string
  title: string
  subtitle?: string
}

interface Props {
  items: TopicGridItem[]
  basePath: string
  storageKey: string
}

export default function TopicGrid({ items, basePath, storageKey }: Props) {
  const { done, toggle, loaded } = useDeskProgress(storageKey)

  return (
    <div>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--pom-ink-soft)', marginBottom: 20 }}>
        {loaded ? `${done.length}/${items.length} marked read` : ' '}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {items.map(item => {
          const isDone = done.includes(item.slug)
          return (
            <div
              key={item.slug}
              style={{
                border: '1.5px solid var(--pom-rule)', borderRadius: 14, padding: '20px 20px 18px',
                background: isDone ? 'var(--pom-cream)' : 'var(--pom-paper)', position: 'relative',
              }}
            >
              <button
                onClick={() => toggle(item.slug)}
                aria-label={isDone ? 'Mark unread' : 'Mark read'}
                style={{
                  position: 'absolute', top: 16, right: 16, width: 22, height: 22, borderRadius: 6,
                  border: `1.5px solid ${isDone ? 'var(--pom-pink)' : 'var(--pom-rule)'}`,
                  background: isDone ? 'var(--pom-pink)' : 'transparent', color: '#fff',
                  fontSize: 13, lineHeight: '19px', cursor: 'pointer', padding: 0,
                }}
              >
                {isDone ? '✓' : ''}
              </button>
              <Link href={`${basePath}/${item.slug}`} style={{ textDecoration: 'none', color: 'var(--pom-ink)' }}>
                <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 19, lineHeight: 1.3, paddingRight: 28, marginBottom: 6 }}>
                  {item.title}
                </div>
                {item.subtitle && (
                  <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 13, color: 'var(--pom-ink-soft)' }}>
                    {item.subtitle}
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
