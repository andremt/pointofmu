import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getOmscsUnit, getOmscsUnitSlugs } from '@/lib/desk-content'
import { OMSCS_UNITS } from '@/lib/desk-schedule'
import MarkReadToggle from '@/components/desk/MarkReadToggle'

export async function generateStaticParams() {
  return getOmscsUnitSlugs().map(unit => ({ unit }))
}

export default async function OmscsUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit: slug } = await params
  const doc = getOmscsUnit(slug)
  const meta = OMSCS_UNITS.find(u => u.slug === slug)
  if (!doc || !meta) notFound()

  return (
    <div style={{ maxWidth: 680 }}>
      <Link href="/desk/omscs" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--pom-ink-soft)', textDecoration: 'none' }}>
        ← all units
      </Link>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', margin: '20px 0 8px' }}>
        Unit {meta.unit} · ~{meta.estMinutes} min · {meta.dueAssignment}{meta.dueDate ? ` · due ${meta.dueDate}` : ''}
      </div>
      <h1 style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(28px,5vw,44px)', lineHeight: 1.15, margin: '0 0 20px' }}>
        {meta.title}
      </h1>

      <div style={{
        background: 'var(--pom-cream)', border: '1px solid var(--pom-rule)', borderRadius: 12,
        padding: '18px 20px', marginBottom: 28,
      }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--pom-ink-soft)', marginBottom: 10 }}>
          First step
        </div>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          {meta.firstStep}
        </p>
      </div>

      <article style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--pom-ink)' }}>
        <MDXRemote source={doc.content} />
      </article>

      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--pom-rule)' }}>
        <MarkReadToggle slug={slug} storageKey="desk-omscs-read" />
      </div>
    </div>
  )
}
