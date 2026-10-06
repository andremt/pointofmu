import fs from "fs"
import path from "path"
import matter from "gray-matter"

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles")

export interface ArticleTimestamp {
  time: string
  label: string
  note: string
}

export interface ArticleMeta {
  slug: string
  title: string
  dek: string
  kicker: string
  date: string
  author: string
  n: number | null
  readTime: string
  hasVideo: boolean
  tiktokUrl?: string
  timestamps?: ArticleTimestamp[]
}

export interface Article extends ArticleMeta {
  content: string
}

function parseDate(dateStr: string): number {
  const d = Date.parse(dateStr)
  if (!Number.isNaN(d)) return d
  // "May 2026" style, no day
  const d2 = Date.parse(`${dateStr} 1`)
  return Number.isNaN(d2) ? 0 : d2
}

export function getAllArticles(): Article[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"))
  const articles = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8")
    const { data, content } = matter(raw)
    return {
      slug,
      content,
      ...(data as Omit<ArticleMeta, "slug">),
    }
  })
  return articles.sort((a, b) => parseDate(b.date) - parseDate(a.date))
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  return { slug, content, ...(data as Omit<ArticleMeta, "slug">) }
}
