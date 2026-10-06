import Link from 'next/link'
import Wordmark from '@/components/brand/Wordmark'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Macro', href: '/macro' },
  { label: 'Videos', href: '/videos' },
  { label: 'Articles', href: '/archive' },
  { label: 'About', href: '/about' },
  { label: 'Method', href: '/method' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--pom-ink)', color: 'var(--pom-paper)', padding: '64px 36px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>
        <div>
          <Wordmark size={20} color="var(--pom-paper)" />
          <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 13, lineHeight: 1.7, color: 'rgba(247,244,237,0.6)', marginTop: 16, maxWidth: 220 }}>
            Data stories, 42 seconds at a time.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 16 }}>
            Navigation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NAV.map(l => (
              <Link key={l.href} href={l.href} style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, color: 'rgba(247,244,237,0.75)', textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 16 }}>
            Data
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/method" style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, color: 'rgba(247,244,237,0.75)', textDecoration: 'none' }}>
              Methodology
            </Link>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 16 }}>
            Follow
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ label: 'TikTok', href: 'https://www.tiktok.com/@pointofmu_' }, { label: 'GitHub', href: 'https://github.com/andremt/pointofmu/tree/main/analysis' }].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Geist", sans-serif', fontSize: 14, color: 'rgba(247,244,237,0.75)', textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1080, margin: '48px auto 0', borderTop: '1px solid rgba(247,244,237,0.12)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'rgba(247,244,237,0.35)' }}>
          © {new Date().getFullYear()} pointofμ · All data sourced & cited
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'rgba(247,244,237,0.35)' }}>
          Built with Next.js · Hosted on Vercel
        </span>
      </div>
    </footer>
  )
}
