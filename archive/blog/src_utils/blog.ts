import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPostMeta {
  slug: string
  lang: string
  title: string
  description: string
  date: string        // YYYY-MM-DD
  tags: string[]
  relatedTestId?: string
  readTime: number    // minutes
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string
}

// Estimate read time: ~200 words/min
function calcReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function getAllBlogSlugs(lang: string): string[] {
  const langDir = path.join(BLOG_DIR, lang)
  if (!fs.existsSync(langDir)) return []
  return fs
    .readdirSync(langDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getBlogPost(lang: string, slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, lang, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const contentHtml = marked(content) as string

  return {
    slug,
    lang,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    relatedTestId: data.relatedTestId ?? undefined,
    readTime: calcReadTime(content),
    contentHtml,
  }
}

export function getAllBlogPosts(lang: string): BlogPostMeta[] {
  const slugs = getAllBlogSlugs(lang)
  const posts: BlogPostMeta[] = []

  for (const slug of slugs) {
    const post = getBlogPost(lang, slug)
    if (!post) continue
    const { contentHtml: _html, ...meta } = post
    posts.push(meta)
  }

  // Sort by date descending
  return posts.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })
}
