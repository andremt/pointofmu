import Link from 'next/link'
import FocusTimerButton from './FocusTimerButton'

interface Props {
  kicker: string
  title: string
  firstStep: string
  href?: string
  hrefLabel?: string
}

export default function NextActionCard({ kicker, title, firstStep, href, hrefLabel }: Props) {
  return (
    <div style={{
      background: 'var(--pom-ink)', color: 'var(--pom-paper)', borderRadius: 20,
      padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)' }}>
        {kicker}
      </div>
      <h1 style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(24px,4vw,34px)', lineHeight: 1.2, margin: 0 }}>
        {title}
      </h1>
      <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 16, lineHeight: 1.6, color: 'rgba(247,244,237,0.8)', margin: 0, maxWidth: 560 }}>
        {firstStep}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
        <FocusTimerButton minutes={15} />
        {href && (
          <Link href={href} style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, color: 'var(--pom-paper)', opacity: 0.75, textDecoration: 'underline', textUnderlineOffset: 4 }}>
            {hrefLabel ?? 'Open primer →'}
          </Link>
        )}
      </div>
    </div>
  )
}
