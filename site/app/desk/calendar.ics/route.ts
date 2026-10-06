import { NextRequest, NextResponse } from 'next/server'
import { OMSCS_EVENTS, LSAT_TARGET, STUDY_BLOCKS, OMSCS_UNITS, LSAT_TOPICS, OMSCS_SESSIONS } from '@/lib/desk-schedule'

const SITE = 'https://pointofmu.com'
const BYDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

function fmt(iso: string): string {
  // "2026-09-13T23:59:00" -> "20260913T235900"
  return iso.replace(/[-:]/g, '').replace(/\.\d+$/, '')
}

function fmtDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '')
}

function escapeText(s: string): string {
  return s.replace(/[\\,;]/g, m => '\\' + m).replace(/\n/g, '\\n')
}

// Pure calendar-date arithmetic in UTC, so it's unaffected by the server's local timezone, // the ISO strings in desk-schedule.ts are wall-clock ET with no offset, so we only ever
// shift the date part and keep the time-of-day string as-is.
function minusDays(iso: string, days: number): string {
  const [datePart, timePart] = iso.split('T')
  const d = new Date(`${datePart}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - days)
  const newDatePart = d.toISOString().slice(0, 10)
  return timePart ? `${newDatePart}T${timePart}` : newDatePart
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function firstOccurrence(fromIso: string, dayOfWeek: number): string {
  const d = new Date(`${fromIso}T00:00:00Z`)
  const offset = (dayOfWeek - d.getUTCDay() + 7) % 7
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

const VTIMEZONE = `BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE`

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token || token !== process.env.DESK_ICS_TOKEN) {
    return new NextResponse('Not found', { status: 404 })
  }

  const stamp = fmt(new Date().toISOString().slice(0, 19))
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//pointofmu//the desk//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:the desk',
    VTIMEZONE,
  ]

  // Deadlines and the LSAT window itself.
  for (const ev of [...OMSCS_EVENTS, LSAT_TARGET]) {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${ev.id}@pointofmu.com`)
    lines.push(`DTSTAMP:${stamp}Z`)
    if (ev.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${fmtDate(ev.start)}`)
      lines.push(`DTEND;VALUE=DATE:${fmtDate(ev.end)}`)
    } else {
      lines.push(`DTSTART;TZID=America/New_York:${fmt(ev.start)}`)
      lines.push(`DTEND;TZID=America/New_York:${fmt(ev.end)}`)
    }
    lines.push(`SUMMARY:${escapeText(ev.title)}`)
    if (ev.note) lines.push(`DESCRIPTION:${escapeText(ev.note)}`)
    lines.push('END:VEVENT')
  }

  // 2-weeks-out reminders, one per OMSCS deadline plus the LSAT window.
  for (const ev of OMSCS_EVENTS) {
    const reminderStart = minusDays(ev.start, 14)
    const reminderEnd = minusDays(ev.end, 14)
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:reminder-${ev.id}@pointofmu.com`)
    lines.push(`DTSTAMP:${stamp}Z`)
    lines.push(`DTSTART;TZID=America/New_York:${fmt(reminderStart)}`)
    lines.push(`DTEND;TZID=America/New_York:${fmt(reminderEnd)}`)
    lines.push(`SUMMARY:${escapeText(`2 weeks out, ${ev.title}`)}`)
    const desc = [ev.note, `Full plan: ${SITE}/desk`].filter(Boolean).join('\n\n')
    lines.push(`DESCRIPTION:${escapeText(desc)}`)
    lines.push('END:VEVENT')
  }
  {
    const reminderStart = minusDays(LSAT_TARGET.start, 14)
    const reminderEnd = minusDays(LSAT_TARGET.end, 14)
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:reminder-${LSAT_TARGET.id}@pointofmu.com`)
    lines.push(`DTSTAMP:${stamp}Z`)
    lines.push(`DTSTART;VALUE=DATE:${fmtDate(reminderStart)}`)
    lines.push(`DTEND;VALUE=DATE:${fmtDate(reminderEnd)}`)
    lines.push(`SUMMARY:${escapeText('2 weeks out, LSAT window approaching (tentative)')}`)
    lines.push(`DESCRIPTION:${escapeText(`Confirm your exact LSAT date if you haven't yet.\n\nFull plan: ${SITE}/desk/lsat`)}`)
    lines.push('END:VEVENT')
  }

  // OMSCS Saturday sessions, each dated occurrence tagged to its specific unit primer.
  const omscsB1 = STUDY_BLOCKS.find(b => b.id === 'omscs-saturday-1')!
  const omscsB2 = STUDY_BLOCKS.find(b => b.id === 'omscs-saturday-2')!
  for (const session of OMSCS_SESSIONS) {
    const unit = OMSCS_UNITS.find(u => u.slug === session.unitSlug)
    if (!unit) continue
    const block = session.block === 1 ? omscsB1 : omscsB2
    const start = `${session.date}T${block.startTime}:00`
    const end = `${session.date}T${block.endTime}:00`
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:omscs-${session.date}-b${session.block}@pointofmu.com`)
    lines.push(`DTSTAMP:${stamp}Z`)
    lines.push(`DTSTART;TZID=America/New_York:${fmt(start)}`)
    lines.push(`DTEND;TZID=America/New_York:${fmt(end)}`)
    lines.push(`SUMMARY:${escapeText(`Unit ${unit.unit}, ${unit.title} (${session.label})`)}`)
    lines.push(`DESCRIPTION:${escapeText(`${unit.firstStep}\n\nResource: ${SITE}/desk/omscs/${unit.slug}`)}`)
    lines.push('END:VEVENT')
  }

  // LSAT Sunday sessions, rotate through the topic list weekly, two topics per week,
  // so each dated occurrence links to a specific primer rather than a generic block.
  const lsatB1 = STUDY_BLOCKS.find(b => b.id === 'lsat-sunday-1')!
  const lsatB2 = STUDY_BLOCKS.find(b => b.id === 'lsat-sunday-2')!
  const lsatUntil = new Date(`${lsatB1.until}T00:00:00Z`)
  let cursor = firstOccurrence(lsatB1.from, 0)
  let weekIndex = 0
  while (new Date(`${cursor}T00:00:00Z`) <= lsatUntil) {
    for (const [block, blockNum] of [[lsatB1, 1], [lsatB2, 2]] as const) {
      const topic = LSAT_TOPICS[(weekIndex * 2 + (blockNum - 1)) % LSAT_TOPICS.length]
      const start = `${cursor}T${block.startTime}:00`
      const end = `${cursor}T${block.endTime}:00`
      lines.push('BEGIN:VEVENT')
      lines.push(`UID:lsat-${cursor}-b${blockNum}@pointofmu.com`)
      lines.push(`DTSTAMP:${stamp}Z`)
      lines.push(`DTSTART;TZID=America/New_York:${fmt(start)}`)
      lines.push(`DTEND;TZID=America/New_York:${fmt(end)}`)
      lines.push(`SUMMARY:${escapeText(`LSAT, ${topic.title}`)}`)
      lines.push(`DESCRIPTION:${escapeText(`${topic.firstStep}\n\nResource: ${SITE}/desk/lsat/${topic.slug}`)}`)
      lines.push('END:VEVENT')
    }
    cursor = addDays(cursor, 7)
    weekIndex++
  }

  // Tuesday light review stays a plain recurring block, content is whatever's in the
  // question log that week, not a fixed topic, so there's nothing to tag per-occurrence.
  const lsatTuesday = STUDY_BLOCKS.find(b => b.id === 'lsat-tuesday-light')!
  {
    const firstDate = firstOccurrence(lsatTuesday.from, lsatTuesday.dayOfWeek)
    const until = lsatTuesday.until.replace(/-/g, '') + 'T235959Z'
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${lsatTuesday.id}@pointofmu.com`)
    lines.push(`DTSTAMP:${stamp}Z`)
    lines.push(`DTSTART;TZID=America/New_York:${firstDate.replace(/-/g, '')}T${lsatTuesday.startTime.replace(':', '')}00`)
    lines.push(`DTEND;TZID=America/New_York:${firstDate.replace(/-/g, '')}T${lsatTuesday.endTime.replace(':', '')}00`)
    lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${BYDAY[lsatTuesday.dayOfWeek]};UNTIL=${until}`)
    lines.push(`SUMMARY:${escapeText(lsatTuesday.title)}`)
    lines.push(`DESCRIPTION:${escapeText(`Blind review recent misses and log a few questions.\n\nResource: ${SITE}/desk/lsat`)}`)
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  return new NextResponse(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="the-desk.ics"',
    },
  })
}
