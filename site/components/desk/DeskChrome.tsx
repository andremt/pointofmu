'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const LINKS = [
  { href: '/desk', label: 'Today' },
  { href: '/desk/omscs', label: 'ISYE 6420' },
  { href: '/desk/lsat', label: 'LSAT' },
]

export default function DeskChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/desk/login') {
    return <>{children}</>
  }

  async function logout() {
    await fetch('/api/desk/auth', { method: 'DELETE' })
    router.push('/desk/login')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', borderBottom: '1px solid var(--pom-rule)', fontFamily: '"Geist", sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 20, color: 'var(--pom-ink)' }}>the desk</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {LINKS.map(l => {
              const active = pathname === l.href
              return (
                <Link key={l.href} href={l.href} style={{ fontSize: 14, fontWeight: 500, color: 'var(--pom-ink)', padding: '8px 12px', borderRadius: 999, opacity: active ? 1 : 0.55, textDecoration: active ? 'underline' : 'none', textUnderlineOffset: 4, textDecorationColor: 'var(--pom-pink)' }}>
                  {l.label}
                </Link>
              )
            })}
          </div>
        </div>
        <button onClick={logout} style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--pom-ink-soft)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}>
          Log out
        </button>
      </nav>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '40px 24px 100px' }}>
        {children}
      </div>
    </div>
  )
}
