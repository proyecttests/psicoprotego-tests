/**
 * @file app/[lang]/blog/[slug]/page.tsx
 * @description Blog post detail page — SSG with full content, CTA and related posts.
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBlogPost, getAllBlogPosts, getAllBlogSlugs } from '@/utils/blog'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = ['es', 'en', 'pt']

const UI: Record<string, {
  minRead: string
  relatedTitle: string
  ctaTitle: string
  ctaBtn: string
  backToBlog: string
}> = {
  es: {
    minRead:      'min de lectura',
    relatedTitle: 'Artículos relacionados',
    ctaTitle:     'Pon a prueba lo que has aprendido',
    ctaBtn:       'Hacer el test →',
    backToBlog:   '← Volver al blog',
  },
  en: {
    minRead:      'min read',
    relatedTitle: 'Related articles',
    ctaTitle:     'Put what you have learned to the test',
    ctaBtn:       'Take the test →',
    backToBlog:   '← Back to blog',
  },
  pt: {
    minRead:      'min de leitura',
    relatedTitle: 'Artigos relacionados',
    ctaTitle:     'Ponha em prática o que aprendeu',
    ctaBtn:       'Fazer o teste →',
    backToBlog:   '← Voltar ao blog',
  },
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = []
  for (const lang of LANGS) {
    const slugs = getAllBlogSlugs(lang)
    for (const slug of slugs) {
      params.push({ lang, slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const post = getBlogPost(lang, slug)
  if (!post) return {}

  return {
    title:       `${post.title} — Psicoprotego`,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/${lang}/blog/${slug}` },
    openGraph: {
      title:       post.title,
      description: post.description,
      url:         `${SITE_URL}/${lang}/blog/${slug}`,
      type:        'article',
      publishedTime: post.date,
      tags:        post.tags,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const ui = UI[lang] ?? UI['es']
  const post = getBlogPost(lang, slug)
  if (!post) notFound()

  const allPosts = getAllBlogPosts(lang)
  const related = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen">
      <article className="mx-auto max-w-2xl px-4 py-12">
        {/* Back link */}
        <Link
          href={`/${lang}/blog`}
          className="mb-8 inline-block text-sm font-medium transition hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          {ui.backToBlog}
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-0.5 text-xs font-medium capitalize"
                style={{ backgroundColor: '#e8f5f0', color: 'var(--color-primary)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-['Source_Serif_4',serif] text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: 'var(--color-primary)' }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <p className="mt-3 text-sm text-neutral-500">
          {post.date} · {post.readTime} {ui.minRead}
        </p>

        {/* Content */}
        <div
          className="prose prose-neutral mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          style={{
            lineHeight: '1.8',
            color: '#3d3d3d',
          }}
        />

        {/* Related test CTA */}
        {post.relatedTestId && (
          <div
            className="mt-12 rounded-2xl border p-6 text-center"
            style={{ borderColor: 'var(--color-primary)', backgroundColor: '#f0f7f4' }}
          >
            <p
              className="mb-4 font-['Source_Serif_4',serif] text-xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {ui.ctaTitle}
            </p>
            <Link
              href={`/${lang}/test/${post.relatedTestId}`}
              className="btn-primary"
            >
              {ui.ctaBtn}
            </Link>
          </div>
        )}
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section
          className="border-t border-neutral-200 py-12"
          style={{ backgroundColor: 'white' }}
        >
          <div className="mx-auto max-w-3xl px-4">
            <h2
              className="mb-6 font-['Source_Serif_4',serif] text-2xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {ui.relatedTitle}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${lang}/blog/${p.slug}`}
                    className="group block rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <h3
                      className="mb-2 text-sm font-bold leading-snug group-hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {p.date} · {p.readTime} {ui.minRead}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
