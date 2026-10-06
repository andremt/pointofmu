import BigStat from '@/components/ui/BigStat'
import NextActionCard from '@/components/desk/NextActionCard'
import ProgressSummary from '@/components/desk/ProgressSummary'
import { OMSCS_EVENTS, LSAT_TARGET, STUDY_BLOCKS, OMSCS_UNITS, LSAT_TOPICS } from '@/lib/desk-schedule'

function daysUntil(iso: string): number {
  const now = new Date()
  const target = new Date(iso)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function nextOccurrence(block: (typeof STUDY_BLOCKS)[number]): Date | null {
  const now = new Date()
  const until = new Date(`${block.until}T23:59:59`)
  const cursor = new Date(now)
  for (let i = 0; i < 8; i++) {
    if (cursor.getDay() === block.dayOfWeek) {
      const [h, m] = block.startTime.split(':').map(Number)
      const candidate = new Date(cursor)
      candidate.setHours(h, m, 0, 0)
      if (candidate.getTime() >= now.getTime() && candidate <= until) return candidate
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return null
}

export default function DeskDashboard() {
  const now = new Date()
  const nextEvent = OMSCS_EVENTS
    .filter(e => new Date(e.start) >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]

  const blockOccurrences = STUDY_BLOCKS
    .map(b => ({ block: b, date: nextOccurrence(b) }))
    .filter((x): x is { block: (typeof STUDY_BLOCKS)[number]; date: Date } => x.date !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const nextOmscsBlock = blockOccurrences.find(x => x.block.track === 'omscs')
  const nextLsatBlock = blockOccurrences.find(x => x.block.track === 'lsat')

  const deadlineIsUrgent = nextEvent && daysUntil(nextEvent.start) <= 7

  // Match the next deadline to its unit for a concrete first step.
  const relatedUnit = nextEvent
    ? OMSCS_UNITS.find(u => u.dueAssignment.toLowerCase().includes(nextEvent.title.match(/Homework \d/)?.[0]?.toLowerCase() ?? '\0'))
    : undefined

  const hero = deadlineIsUrgent && nextEvent
    ? {
        kicker: `${daysUntil(nextEvent.start)} day${daysUntil(nextEvent.start) === 1 ? '' : 's'} out`,
        title: nextEvent.title,
        firstStep: relatedUnit?.firstStep ?? nextEvent.note ?? 'Open the unit primer and take the first small step.',
        href: relatedUnit ? `/desk/omscs/${relatedUnit.slug}` : undefined,
      }
    : nextOmscsBlock
    ? {
        kicker: 'This weekend',
        title: nextOmscsBlock.block.title,
        firstStep: OMSCS_UNITS[0].firstStep,
        href: '/desk/omscs',
        hrefLabel: 'Open unit primers →',
      }
    : {
        kicker: 'Right now',
        title: 'Pick one small thing',
        firstStep: 'Nothing urgent is due. Open either track and mark one primer read.',
        href: '/desk/omscs',
      }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <NextActionCard {...hero} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
        <BigStat
          value={nextEvent ? String(daysUntil(nextEvent.start)) : '-'}
          label="days to next OMSCS deadline"
          size="md"
        />
        <BigStat
          value={nextLsatBlock ? String(daysUntil(nextLsatBlock.date.toISOString())) : '-'}
          label="days to next LSAT block"
          accent="var(--pom-blue)"
          size="md"
        />
        <BigStat
          value={String(daysUntil(LSAT_TARGET.start))}
          label="days to LSAT window (est.)"
          accent="var(--pom-yellow)"
          size="md"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        <ProgressSummary href="/desk/omscs" title="ISYE 6420 primers" total={OMSCS_UNITS.length} storageKey="desk-omscs-read" palette="ink" />
        <ProgressSummary href="/desk/lsat" title="LSAT primers" total={LSAT_TOPICS.length} storageKey="desk-lsat-read" palette="blue" />
      </div>

      <div style={{ fontFamily: '"Geist", sans-serif', fontSize: 13, color: 'var(--pom-ink-soft)', borderTop: '1px solid var(--pom-rule)', paddingTop: 20 }}>
        Subscribe this section to your calendar for auto-updating deadlines and study blocks:{' '}
        <code style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>pointofmu.com/desk/calendar.ics?token=...</code>
        {' '}(ask the desk for your token).
      </div>
    </div>
  )
}
