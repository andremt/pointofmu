import Link from "next/link"
import { getAllArticles } from "@/lib/articles"
import ArticleCard from "@/components/ArticleCard"

export default function HomePage() {
  const articles = getAllArticles()
  const [latest, ...rest] = articles
  const recent = rest.slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-9 py-12">
      <div className="kicker mb-4">μ · {latest.kicker} · {latest.date} · {latest.readTime}</div>
      <h1 className="font-serif italic text-3xl sm:text-5xl leading-tight mb-6 max-w-3xl">{latest.title}</h1>
      <p className="text-ink-soft text-lg max-w-2xl mb-6">{latest.dek}</p>
      <Link href={`/articles/${latest.slug}`} className="text-pink font-medium">
        Read latest →
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
        {recent.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>

      <div className="mt-10">
        <Link href="/archive" className="text-pink font-medium">
          All stories →
        </Link>
      </div>
    </div>
  )
}
