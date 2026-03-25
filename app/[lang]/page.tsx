/**
 * @file app/[lang]/page.tsx
 * @description Homepage por idioma — hero, stats, category nav, test grid, blog preview, bottom CTA.
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { loadTestCards, discoverLangs, discoverCategories } from '@/utils/discoverTests'
import { getAllBlogPosts } from '@/utils/blog'
import TestGrid from '@/components/common/TestGrid'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  // Hero
  heroHeadline:  string
  heroSubtitle:  string
  heroCta:       string
  // Stats
  statsTests:    string
  statsFree:     string
  statsNoReg:    string
  statsPrivate:  string
  // Categories / grid
  allLabel:      string
  validated:     string
  questions:     string
  startBtn:      string
  empty:         string
  // Blog preview
  blogTitle:     string
  blogReadMore:  string
  blogMinRead:   string
  // Bottom CTA
  bottomCtaText: string
  bottomCtaBtn:  string
  // Meta
  metaTitle:       string
  metaDescription: string
}> = {
  es: {
    heroHeadline:    'Entiende cómo funciona tu mente',
    heroSubtitle:    'Tests psicológicos gratuitos, validados y 100% privados',
    heroCta:         'Empezar con el quiz de apego',
    statsTests:      'tests disponibles',
    statsFree:       'Gratuito',
    statsNoReg:      'Sin registro',
    statsPrivate:    'Privado',
    allLabel:        'Todos',
    validated:       'Validado',
    questions:       'preguntas',
    startBtn:        'Empezar test',
    empty:           'No hay tests disponibles.',
    blogTitle:       'Del blog',
    blogReadMore:    'Leer →',
    blogMinRead:     'min',
    bottomCtaText:   '¿No sabes por dónde empezar?',
    bottomCtaBtn:    'Empieza con el quiz de apego',
    metaTitle:       'Tests Psicológicos Gratuitos — Psicoprotego',
    metaDescription: 'Cuestionarios psicológicos validados: ansiedad, depresión, apego y más. Gratis, privado y sin registro.',
  },
  en: {
    heroHeadline:    'Understand how your mind works',
    heroSubtitle:    'Free, validated psychological tests — 100% private',
    heroCta:         'Start with the attachment quiz',
    statsTests:      'tests available',
    statsFree:       'Free',
    statsNoReg:      'No sign-up',
    statsPrivate:    'Private',
    allLabel:        'All',
    validated:       'Validated',
    questions:       'questions',
    startBtn:        'Start test',
    empty:           'No tests available.',
    blogTitle:       'From the blog',
    blogReadMore:    'Read →',
    blogMinRead:     'min',
    bottomCtaText:   'Not sure where to start?',
    bottomCtaBtn:    'Start with the attachment quiz',
    metaTitle:       'Free Psychological Tests — Psicoprotego',
    metaDescription: 'Validated psychological questionnaires: anxiety, depression, attachment and more. Free, private, no sign-up.',
  },
  pt: {
    heroHeadline:    'Entenda como sua mente funciona',
    heroSubtitle:    'Testes psicológicos gratuitos, validados e 100% privados',
    heroCta:         'Começar com o quiz de apego',
    statsTests:      'testes disponíveis',
    statsFree:       'Gratuito',
    statsNoReg:      'Sem cadastro',
    statsPrivate:    'Privado',
    allLabel:        'Todos',
    validated:       'Validado',
    questions:       'perguntas',
    startBtn:        'Iniciar teste',
    empty:           'Não há testes disponíveis.',
    blogTitle:       'Do blog',
    blogReadMore:    'Ler →',
    blogMinRead:     'min',
    bottomCtaText:   'Não sabe por onde começar?',
    bottomCtaBtn:    'Comece com o quiz de apego',
    metaTitle:       'Testes Psicológicos Gratuitos — Psicoprotego',
    metaDescription: 'Questionários psicológicos validados: ansiedade, depressão, apego e mais. Gratuito, privado e sem cadastro.',
  },
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const langs = await discoverLangs()
  return langs.map((lang) => ({ lang }))
}

// ── generateMetadata ──────────────────────────────────────────────────────────

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
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: { es: '/es', en: '/en', pt: '/pt' },
    },
    openGraph: {
      title:       ui.metaTitle,
      description: ui.metaDescription,
      url:         `${SITE_URL}/${lang}`,
      locale:      lang,
      type:        'website',
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LangHomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const ui = UI[lang]
  if (!ui) notFound()

  const [tests, categories, blogPosts] = await Promise.all([
    loadTestCards(lang),
    discoverCategories(),
    Promise.resolve(getAllBlogPosts(lang).slice(0, 3)),
  ])

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="w-full py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #2d4a3e 0%, #1a3028 100%)' }}
      >
        <div className="mx-auto max-w-3xl">
          <h1 className="font-['Source_Serif_4',serif] text-4xl font-bold text-white sm:text-5xl leading-tight">
            {ui.heroHeadline}
          </h1>
          <p className="mt-4 text-lg text-green-100 sm:text-xl">
            {ui.heroSubtitle}
          </p>
          <div className="mt-8">
            <Link
              href={`/${lang}/test/apego`}
              className="inline-block rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {ui.heroCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-200 bg-white py-4 px-4">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
          <span style={{ color: 'var(--color-primary)' }}>
            <strong>{tests.length}</strong> {ui.statsTests}
          </span>
          <span className="hidden sm:inline text-neutral-300">·</span>
          <span style={{ color: 'var(--color-primary)' }}>{ui.statsFree}</span>
          <span className="hidden sm:inline text-neutral-300">·</span>
          <span style={{ color: 'var(--color-primary)' }}>{ui.statsNoReg}</span>
          <span className="hidden sm:inline text-neutral-300">·</span>
          <span style={{ color: 'var(--color-primary)' }}>{ui.statsPrivate}</span>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-4 py-12">

        {/* ── Category nav ─────────────────────────────────────────────── */}
        {categories.length > 0 && (
          <nav aria-label="Categorías" className="mb-8 flex flex-wrap gap-2 justify-center">
            <Link
              href={`/${lang}`}
              className="rounded-full border border-primary-300 px-4 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-50 transition"
            >
              {ui.allLabel}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${lang}/categoria/${cat}`}
                className="rounded-full border border-primary-300 px-4 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-50 transition capitalize"
              >
                {cat}
              </Link>
            ))}
          </nav>
        )}

        {/* ── Test grid ────────────────────────────────────────────────── */}
        <TestGrid tests={tests} lang={lang} ui={ui} />

        {/* ── Blog preview ─────────────────────────────────────────────── */}
        {blogPosts.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2
                className="font-['Source_Serif_4',serif] text-2xl font-bold"
                style={{ color: 'var(--color-primary)' }}
              >
                {ui.blogTitle}
              </h2>
              <Link
                href={`/${lang}/blog`}
                className="text-sm font-medium transition hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {ui.blogReadMore}
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-3">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="group flex flex-col h-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <h3
                      className="mb-2 text-sm font-bold leading-snug group-hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {post.title}
                    </h3>
                    <p className="flex-1 text-xs text-neutral-500 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <p className="mt-3 text-xs text-neutral-400">
                      {post.date} · {post.readTime} {ui.blogMinRead}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        className="w-full py-12 px-4 text-center"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="mx-auto max-w-xl">
          <p className="mb-5 font-['Source_Serif_4',serif] text-xl font-semibold text-white">
            {ui.bottomCtaText}
          </p>
          <Link
            href={`/${lang}/test/apego`}
            className="inline-block rounded-xl bg-white px-8 py-3 text-sm font-bold transition hover:opacity-90"
            style={{ color: 'var(--color-primary)' }}
          >
            {ui.bottomCtaBtn}
          </Link>
        </div>
      </section>

    </div>
  )
}
