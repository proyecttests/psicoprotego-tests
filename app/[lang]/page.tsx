/**
 * @file app/[lang]/page.tsx
 * @description Homepage por idioma — lista de tests con navegación por categoría.
 *
 * - generateStaticParams() → SSG auto-descubierto desde /public/data/tests/
 * - generateMetadata()     → título genérico por idioma
 * - Server Component       → lee tests del filesystem en build time
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { loadTestCards, discoverLangs, discoverCategories } from '@/utils/discoverTests'
import TestGrid from '@/components/common/TestGrid'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testpsycho.com'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  pageTitle: string
  pageSubtitle: string
  allLabel: string
  validated: string
  questions: string
  startBtn: string
  empty: string
  metaTitle: string
  metaDescription: string
}> = {
  es: {
    pageTitle:       'Tests Psicológicos',
    pageSubtitle:    'Herramientas validadas para conocer tu bienestar emocional',
    allLabel:        'Todos',
    validated:       'Validado',
    questions:       'preguntas',
    startBtn:        'Empezar test',
    empty:           'No hay tests disponibles.',
    metaTitle:       'Tests Psicológicos — TestPsycho',
    metaDescription: 'Cuestionarios psicológicos validados: ansiedad, depresión y más. Gratis, privado y en español.',
  },
  en: {
    pageTitle:       'Psychological Tests',
    pageSubtitle:    'Validated tools to understand your emotional well-being',
    allLabel:        'All',
    validated:       'Validated',
    questions:       'questions',
    startBtn:        'Start test',
    empty:           'No tests available.',
    metaTitle:       'Psychological Tests — TestPsycho',
    metaDescription: 'Validated psychological questionnaires: anxiety, depression and more. Free, private, and in English.',
  },
  pt: {
    pageTitle:       'Testes Psicológicos',
    pageSubtitle:    'Ferramentas validadas para conhecer o seu bem-estar emocional',
    allLabel:        'Todos',
    validated:       'Validado',
    questions:       'perguntas',
    startBtn:        'Iniciar teste',
    empty:           'Não há testes disponíveis.',
    metaTitle:       'Testes Psicológicos — TestPsycho',
    metaDescription: 'Questionários psicológicos validados: ansiedade, depressão e mais. Gratuito, privado e em português.',
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

  const [tests, categories] = await Promise.all([
    loadTestCards(lang),
    discoverCategories(),
  ])

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary-800 sm:text-4xl">
          {ui.pageTitle}
        </h1>
        <p className="mt-3 text-base text-primary-600 sm:text-lg">
          {ui.pageSubtitle}
        </p>
      </div>

      {/* Category nav */}
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

      {/* Test grid */}
      <TestGrid tests={tests} lang={lang} ui={ui} />
    </div>
  )
}
