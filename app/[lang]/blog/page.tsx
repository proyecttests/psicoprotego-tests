/**
 * @file app/[lang]/blog/page.tsx
 * @description Blog listing page — SSG, shows all posts for the current lang.
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllBlogPosts } from '@/utils/blog'
import BlogTracker from '@/components/blog/BlogTracker'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = ['es', 'en', 'pt']

const UI: Record<string, {
  heroTitle: string
  heroSubtitle: string
  readMore: string
  minRead: string
  noPostsYet: string
  metaTitle: string
  metaDescription: string
}> = {
  es: {
    heroTitle:       'Blog de Psicología',
    heroSubtitle:    'Artículos basados en evidencia para entender mejor tu mente y tus relaciones.',
    readMore:        'Leer artículo →',
    minRead:         'min de lectura',
    noPostsYet:      'Próximamente nuevos artículos.',
    metaTitle:       'Blog de Psicología — Psicoprotego',
    metaDescription: 'Artículos de psicología basados en evidencia: apego, ansiedad, relaciones y bienestar emocional.',
  },
  en: {
    heroTitle:       'Psychology Blog',
    heroSubtitle:    'Evidence-based articles to better understand your mind and relationships.',
    readMore:        'Read article →',
    minRead:         'min read',
    noPostsYet:      'New articles coming soon.',
    metaTitle:       'Psychology Blog — Psicoprotego',
    metaDescription: 'Evidence-based psychology articles: attachment, anxiety, relationships and emotional well-being.',
  },
  pt: {
    heroTitle:       'Blog de Psicologia',
    heroSubtitle:    'Artigos baseados em evidências para entender melhor sua mente e seus relacionamentos.',
    readMore:        'Ler artigo →',
    minRead:         'min de leitura',
    noPostsYet:      'Novos artigos em breve.',
    metaTitle:       'Blog de Psicologia — Psicoprotego',
    metaDescription: 'Artigos de psicologia baseados em evidências: apego, ansiedade, relacionamentos e bem-estar emocional.',
  },
}

export async function generateStaticParams() {
  return LANGS
    .filter((lang) => getAllBlogPosts(lang).length > 0)
    .map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const ui = UI[lang] ?? UI['es']
  return {
    title:       ui.metaTitle,
    description: ui.metaDescription,
    alternates: { canonical: `${SITE_URL}/${lang}/blog` },
    openGraph: {
      title:       ui.metaTitle,
      description: ui.metaDescription,
      url:         `${SITE_URL}/${lang}/blog`,
      type:        'website',
    },
  }
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const ui = UI[lang]
  if (!ui) notFound()

  const posts = getAllBlogPosts(lang)

  return (
    <>
      <BlogTracker slug="list" lang={lang} />
      <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen">
      {/* Hero */}
      <section
        className="w-full py-14 px-4"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="font-['Source_Serif_4',serif] text-4xl font-bold text-white sm:text-5xl"
          >
            {ui.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-green-100">
            {ui.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-lg" style={{ color: 'var(--color-primary)' }}>
            {ui.noPostsYet}
          </p>
        ) : (
          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="group block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
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

                  <h2
                    className="mb-2 font-['Source_Serif_4',serif] text-xl font-bold group-hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {post.title}
                  </h2>

                  <p className="mb-4 text-sm text-neutral-600 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{post.date} · {post.readTime} {ui.minRead}</span>
                    <span style={{ color: 'var(--color-accent)' }} className="font-medium">
                      {ui.readMore}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    </>
  )
}
