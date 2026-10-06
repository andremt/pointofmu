import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getAllArticles, getArticleBySlug } from "@/lib/articles"
import StickyVideoRail from "@/components/StickyVideoRail"

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return { title: `${article.title} · pointofμ`, description: article.dek }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-9 py-12 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 md:gap-12">
      <article className="min-w-0">
        <div className="kicker mb-4">
          μ · {article.kicker} · {article.date} · {article.readTime}
        </div>
        <h1 className="font-serif italic text-3xl sm:text-4xl leading-tight mb-6">{article.title}</h1>
        <div className="prose prose-ink max-w-none">
          <MDXRemote source={article.content} />
        </div>
      </article>
      <aside className="md:sticky md:top-12 h-fit">
        <StickyVideoRail articleSlug={article.slug} hasVideo={article.hasVideo} tiktokUrl={article.tiktokUrl} />
      </aside>
    </div>
  )
}
