import { getAllArticles } from "@/lib/articles"
import ArticleCard from "@/components/ArticleCard"

export default function ArchivePage() {
  const articles = getAllArticles()
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-9 py-12">
      <div className="kicker mb-4">μ · All stories</div>
      <h1 className="font-serif italic text-3xl sm:text-5xl mb-12">Archive</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  )
}
