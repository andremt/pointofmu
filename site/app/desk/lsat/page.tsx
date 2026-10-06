import TopicGrid from '@/components/desk/TopicGrid'
import { LSAT_TOPICS } from '@/lib/desk-schedule'

export default function LsatIndexPage() {
  const items = LSAT_TOPICS.map(t => ({
    slug: t.slug,
    title: t.title,
    subtitle: t.family,
  }))

  return (
    <div>
      <h1 style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 32, marginBottom: 24 }}>
        LSAT
      </h1>
      <TopicGrid items={items} basePath="/desk/lsat" storageKey="desk-lsat-read" />
    </div>
  )
}
