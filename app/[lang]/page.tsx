/**
 * @file app/[lang]/page.tsx
 * @description Homepage por idioma — hero, stats, category nav, test grid, bottom CTA.
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { loadTestCards, discoverLangs, discoverCategories } from '@/utils/discoverTests'
import TestGrid from '@/components/common/TestGrid'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  // Hero
  heroHeadline:  string
  heroSubtitle:  string
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
  // Meta
  metaTitle:       string
  metaDescription: string
}> = {
  es: {
    heroHeadline:    'Entiende cómo funciona tu mente',
    heroSubtitle:    'Tests psicológicos gratuitos, validados y 100% privados',
    statsTests:      'tests disponibles',
    statsFree:       'Gratuito',
    statsNoReg:      'Sin registro',
    statsPrivate:    'Privado',
    allLabel:        'Todos',
    validated:       'Validado',
    questions:       'preguntas',
    startBtn:        'Empezar test',
    empty:           'No hay tests disponibles.',
    metaTitle:       'Tests Psicológicos Gratuitos — Psicoprotego',
    metaDescription: 'Cuestionarios psicológicos validados: ansiedad y depresión. GAD-7 y PHQ-9 gratuitos, privados y sin registro.',
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
      languages: { es: '/es' },
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


      </div>


    </div>
  )
}
