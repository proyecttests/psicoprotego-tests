/**
 * @file app/[lang]/page.tsx
 * @description Homepage por idioma — lista de tests disponibles.
 *
 * - generateStaticParams() → SSG para es/en/pt
 * - generateMetadata()     → título genérico por idioma
 * - Server Component       → lee tests del filesystem en build time
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { TestLangFile, TestMetadata } from '@/types/test'

// ── Constantes ────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testpsycho.com'
const LANGS    = ['es', 'en', 'pt'] as const

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  pageTitle: string
  pageSubtitle: string
  validated: string
  questions: string
  startBtn: string
  metaTitle: string
  metaDescription: string
}> = {
  es: {
    pageTitle:       'Tests Psicológicos',
    pageSubtitle:    'Herramientas validadas para conocer tu bienestar emocional',
    validated:       'Validado',
    questions:       'preguntas',
    startBtn:        'Empezar test',
    metaTitle:       'Tests Psicológicos — TestPsycho',
    metaDescription: 'Cuestionarios psicológicos validados: ansiedad, depresión y más. Gratis, privado y en español.',
  },
  en: {
    pageTitle:       'Psychological Tests',
    pageSubtitle:    'Validated tools to understand your emotional well-being',
    validated:       'Validated',
    questions:       'questions',
    startBtn:        'Start test',
    metaTitle:       'Psychological Tests — TestPsycho',
    metaDescription: 'Validated psychological questionnaires: anxiety, depression and more. Free, private, and in English.',
  },
  pt: {
    pageTitle:       'Testes Psicológicos',
    pageSubtitle:    'Ferramentas validadas para conhecer o seu bem-estar emocional',
    validated:       'Validado',
    questions:       'perguntas',
    startBtn:        'Iniciar teste',
    metaTitle:       'Testes Psicológicos — TestPsycho',
    metaDescription: 'Questionários psicológicos validados: ansiedade, depressão e mais. Gratuito, privado e em português.',
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface TestCard {
  testId:    string
  name:      string
  hook:      string
  duration:  string
  itemCount: number
  validated: boolean
}

async function loadAllTests(lang: string): Promise<TestCard[]> {
  const testsDir = path.join(process.cwd(), 'public', 'data', 'tests')

  let entries: string[]
  try {
    entries = await fs.readdir(testsDir)
  } catch {
    return []
  }

  const cards: TestCard[] = []

  for (const testId of entries) {
    try {
      const metaRaw = await fs.readFile(
        path.join(testsDir, testId, 'metadata.json'), 'utf-8'
      ).catch(() => null)
      if (!metaRaw) continue

      const meta = JSON.parse(metaRaw) as TestMetadata
      if (!meta.availableLangs.includes(lang)) continue

      const langRaw =
        await fs.readFile(path.join(testsDir, testId, `${lang}.json`), 'utf-8').catch(() => null) ??
        await fs.readFile(path.join(testsDir, testId, 'es.json'),       'utf-8').catch(() => null)
      if (!langRaw) continue

      const langData = JSON.parse(langRaw) as TestLangFile

      cards.push({
        testId,
        name:      langData.name,
        hook:      langData.landing.hook,
        duration:  meta.timeToComplete,
        itemCount: meta.itemCount,
        validated: meta.validated,
      })
    } catch {
      // skip broken entries
    }
  }

  return cards
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
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

  const tests = await loadAllTests(lang)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary-800 sm:text-4xl">
          {ui.pageTitle}
        </h1>
        <p className="mt-3 text-base text-primary-600 sm:text-lg">
          {ui.pageSubtitle}
        </p>
      </div>

      {/* Test grid */}
      <ul className="grid gap-5 sm:grid-cols-2">
        {tests.map((test) => (
          <li key={test.testId}>
            <Link
              href={`/${lang}/test/${test.testId}`}
              className="group flex h-full flex-col rounded-2xl border border-primary-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-primary-400"
            >
              {/* Badges */}
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary-100 px-3 py-0.5 text-xs font-medium text-primary-700">
                  {test.duration}
                </span>
                <span className="rounded-full bg-primary-100 px-3 py-0.5 text-xs font-medium text-primary-700">
                  {test.itemCount} {ui.questions}
                </span>
                {test.validated && (
                  <span className="rounded-full bg-accent-100 px-3 py-0.5 text-xs font-semibold text-accent-700">
                    {ui.validated}
                  </span>
                )}
              </div>

              {/* Name */}
              <h2 className="mb-2 font-serif text-lg font-bold text-primary-800 group-hover:text-primary-600">
                {test.name}
              </h2>

              {/* Hook */}
              <p className="flex-1 text-sm text-primary-600 leading-relaxed">
                {test.hook}
              </p>

              {/* CTA */}
              <span className="mt-5 inline-block self-start rounded-full bg-primary-800 px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-primary-700">
                {ui.startBtn}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
