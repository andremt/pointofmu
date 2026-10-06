import TopicGrid from '@/components/desk/TopicGrid'
import { OMSCS_UNITS } from '@/lib/desk-schedule'

export default function OmscsIndexPage() {
  const items = OMSCS_UNITS.map(u => ({
    slug: u.slug,
    title: `Unit ${u.unit}, ${u.title}`,
    subtitle: u.dueDate ? `${u.dueAssignment} · due ${u.dueDate}` : u.dueAssignment,
  }))

  return (
    <div>
      <h1 style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 32, marginBottom: 12 }}>
        ISYE 6420, Bayesian Statistics
      </h1>
      <div style={{
        fontFamily: '"Geist", sans-serif', fontSize: 13, lineHeight: 1.6, color: 'var(--pom-ink-soft)',
        background: 'var(--pom-cream)', border: '1px solid var(--pom-rule)', borderRadius: 10,
        padding: '12px 16px', marginBottom: 28, maxWidth: 640,
      }}>
        These primers are for learning during the semester. Georgia Tech&rsquo;s honor code bans using
        LLM-derived notes on the actual exam &mdash; don&rsquo;t bring anything from here into the midterm or final window.
      </div>
      <TopicGrid items={items} basePath="/desk/omscs" storageKey="desk-omscs-read" />
    </div>
  )
}
