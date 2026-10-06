import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Timestamp {
  time: string;
  label: string;
  note?: string;
}

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export interface ArticleMeta {
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  date: string;
  author: string;
  n: number | null;
  readTime: string;
  hasVideo: boolean;
  tiktokUrl?: string;
  timestamps?: Timestamp[];
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx')).map(f => f.replace(/\.mdx$/, ''));
}

export function getArticle(slug: string): { meta: ArticleMeta; content: string } | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
  return {
    meta: {
      slug,
      title:      data.title      ?? '',
      dek:        data.dek        ?? '',
      kicker:     data.kicker     ?? '',
      date:       data.date       ?? '',
      author:     data.author     ?? 'the μ desk',
      n:          data.n          ?? null,
      readTime:   data.readTime   ?? '5 min',
      hasVideo:   data.hasVideo   ?? false,
      tiktokUrl:  data.tiktokUrl  ?? undefined,
      timestamps: data.timestamps ?? undefined,
    },
    content,
  };
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map(slug => getArticle(slug)?.meta)
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as ArticleMeta[];
}
