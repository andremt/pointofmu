import Link from "next/link"

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/macro", label: "Macro" },
  { href: "/videos", label: "Videos" },
  { href: "/archive", label: "Articles" },
  { href: "/about", label: "About" },
]

export default function TopNav() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 sm:px-9 py-6 max-w-5xl mx-auto">
      <Link href="/" className="font-serif italic text-xl text-ink">
        pointof<span className="text-pink">μ</span>
      </Link>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-ink hover:text-pink transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
