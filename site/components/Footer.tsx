import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-rule mt-24 px-9 py-12 max-w-5xl mx-auto text-sm">
      <div className="font-serif italic text-lg text-ink mb-2">
        pointof<span className="text-pink">μ</span>
      </div>
      <p className="text-ink-soft mb-8">Data stories, 42 seconds at a time.</p>
      <div className="grid grid-cols-3 gap-8">
        <div>
          <div className="kicker mb-3">Navigation</div>
          <ul className="space-y-1.5">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/macro">Macro</Link></li>
            <li><Link href="/videos">Videos</Link></li>
            <li><Link href="/archive">Articles</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/method">Method</Link></li>
          </ul>
        </div>
        <div>
          <div className="kicker mb-3">Data</div>
          <ul className="space-y-1.5">
            <li><Link href="/method">Methodology</Link></li>
          </ul>
        </div>
        <div>
          <div className="kicker mb-3">Follow</div>
          <ul className="space-y-1.5">
            <li>
              <a href="https://www.tiktok.com/@pointofmu_" target="_blank" rel="noreferrer">TikTok</a>
            </li>
            <li>
              <a href="https://github.com/andremt/pointofmu/tree/main/analysis" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-ink-soft text-xs">
        © 2026 pointofμ · All data sourced &amp; cited
        <br />
        Built with Next.js · Hosted on Vercel
      </div>
    </footer>
  )
}
