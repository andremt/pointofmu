import Link from "next/link"
import type { ArticleMeta } from "@/lib/articles"

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="block border border-rule rounded p-6 hover:border-pink transition-colors bg-cream"
    >
      <div className="kicker mb-2">
        μ · {article.kicker} · {article.date} · {article.readTime}
      </div>
      <h3 className="font-serif italic text-2xl mb-2 leading-snug">{article.title}</h3>
      <p className="text-ink-soft text-sm leading-relaxed">{article.dek}</p>
    </Link>
  )
}
