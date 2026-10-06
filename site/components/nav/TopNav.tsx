'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Wordmark from '@/components/brand/Wordmark'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/macro', label: 'Macro' },
  { href: '/videos', label: 'Videos' },
  { href: '/archive', label: 'Articles' },
  { href: '/about', label: 'About' },
]

export default function TopNav({ theme = 'paper' }: { theme?: 'paper' | 'ink' }) {
  const pathname = usePathname()
  const fg = theme === 'ink' ? 'var(--pom-paper)' : 'var(--pom-ink)'
  const border = theme === 'ink' ? 'rgba(247,244,237,0.18)' : 'var(--pom-rule)'
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 36px', borderBottom: `1px solid ${border}`, background: theme === 'ink' ? 'var(--pom-ink)' : 'transparent', color: fg, fontFamily: '"Geist", sans-serif' }}>
      <Link href="/" style={{ textDecoration: 'none' }}><Wordmark size={18} color={fg} /></Link>
      <div className="top-nav-links">
        {LINKS.map(l => {
          const active = pathname === l.href
          return (
            <Link key={l.href} href={l.href} style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: fg, padding: '8px 14px', borderRadius: 999, opacity: active ? 1 : 0.65, textDecoration: active ? 'underline' : 'none', textUnderlineOffset: 4, textDecorationColor: 'var(--pom-pink)' }}>
              {l.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
