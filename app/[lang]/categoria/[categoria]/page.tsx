/**
 * @file app/[lang]/categoria/[categoria]/page.tsx
 * @description Página de categoría — lista tests filtrados por topicCategory.
 *
 * - noindex (como en WP): las páginas de categoría no se indexan
 * - Schema: ItemList con los tests de la categoría
 * - generateStaticParams: auto-descubierto desde metadata.json
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { discoverTests, discoverCategories, loadTestCards } from '@/utils/discoverTests'
import TestGrid from '@/components/common/TestGrid'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testpsycho.com'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  prefix: string
  validated: string
  questions: string
  startBtn: string
  empty: string
}> = {
  es: { prefix: 'Tests de',    validated: 'Validado', questions: 'preguntas', startBtn: 'Empezar test', empty: 'No hay tests en esta categoría.' },
  en: { prefix: 'Tests:',      validated: 'Validated', questions: 'questions', startBtn: 'Start test',   empty: 'No tests in this category.' },
  pt: { prefix: 'Testes de',   validated: 'Validado', questions: 'perguntas', startBtn: 'Iniciar teste', empty: 'Não há testes nesta categoria.' },
}

function getUI(lang: string) {
  return UI[lang] ?? UI['es']
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const [tests, categories] = await Promise.all([discoverTests(), discoverCategories()])
  const langs = [...new Set(tests.flatMap((t) => t.langs))]
  return langs.flatMap((lang) => categories.map((categoria) => ({ lang, categoria })))
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; categoria: string }>
}): Promise<Metadata> {
  const { lang, categoria } = await params
  const ui = getUI(lang)

  return {
    title:   `${ui.prefix} ${categoria} — Psicoprotego`,
    robots:  { index: false, follow: true },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ lang: string; categoria: string }>
}) {
  const { lang, categoria } = await params
  const tests = await loadTestCards(lang, { topicCategory: categoria })
  if (tests.length === 0) notFound()

  const ui = getUI(lang)

  // Schema: ItemList
  const schema = {
    '@context':    'https://schema.org',
    '@type':       'ItemList',
    name:          `${ui.prefix} ${categoria}`,
    numberOfItems: tests.length,
    itemListElement: tests.map((t, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      url:       `${SITE_URL}/${lang}/test/${t.testId}`,
      name:      t.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl font-bold text-primary-800 sm:text-4xl capitalize">
            {ui.prefix} {categoria}
          </h1>
        </div>
        <TestGrid tests={tests} lang={lang} ui={ui} />
      </div>
    </>
  )
}
