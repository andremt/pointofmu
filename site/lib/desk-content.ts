import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const OMSCS_DIR = path.join(process.cwd(), 'content', 'desk', 'omscs')
const LSAT_DIR = path.join(process.cwd(), 'content', 'desk', 'lsat')

export interface DeskDoc {
  slug: string
  content: string
  data: Record<string, unknown>
}

function slugsIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).map(f => f.replace(/\.mdx$/, ''))
}

function readDoc(dir: string, slug: string): DeskDoc | null {
  const filePath = path.join(dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
  return { slug, content, data }
}

export function getOmscsUnitSlugs(): string[] {
  return slugsIn(OMSCS_DIR)
}

export function getOmscsUnit(slug: string): DeskDoc | null {
  return readDoc(OMSCS_DIR, slug)
}

export function getLsatTopicSlugs(): string[] {
  return slugsIn(LSAT_DIR)
}

export function getLsatTopic(slug: string): DeskDoc | null {
  return readDoc(LSAT_DIR, slug)
}
