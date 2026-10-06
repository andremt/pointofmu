import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import TopNav from '@/components/nav/TopNav'
import Footer from '@/components/ui/Footer'
import ArticleClient from './ArticleClient'
import ReceiptsPanel from '@/components/article/ReceiptsPanel'
import Cite from '@/components/article/Cite'
import BigStat from '@/components/ui/BigStat'
import Pink from '@/components/article/Pink'
import InteractiveChart from '@/components/chart/InteractiveChart'
import InteractiveBarChart from '@/components/chart/InteractiveBarChart'
import { getArticle, getArticleSlugs } from '@/lib/mdx'

export async function generateStaticParams() {
  return getArticleSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return { title: article.meta.title, description: article.meta.dek }
}

const mdxComponents = { Cite, ReceiptsPanel, BigStat, Pink, InteractiveChart, InteractiveBarChart }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const { meta, content } = article
  const rendered = <MDXRemote source={content} components={mdxComponents} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />
      <ArticleClient meta={meta}>
        {rendered}
      </ArticleClient>
      <Footer />
    </div>
  )
}
