/**
 * @file app/[lang]/tag/[tag]/page.tsx
 * @description Página de etiqueta — lista tests que incluyen el tag dado.
 *
 * - noindex (como en WP)
 * - Schema: ItemList
 * - generateStaticParams: auto-descubierto desde metadata.json
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { discoverTagParams, loadTestCards } from '@/utils/discoverTests'
import { getRobots } from '@/utils/siteConfig'
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
  es: { prefix: 'Tests etiquetados:',  validated: 'Validado',  questions: 'preguntas', startBtn: 'Empezar test',  empty: 'No hay tests con esta etiqueta.' },
  en: { prefix: 'Tests tagged:',        validated: 'Validated', questions: 'questions', startBtn: 'Start test',    empty: 'No tests with this tag.' },
  pt: { prefix: 'Testes com etiqueta:', validated: 'Validado',  questions: 'perguntas', startBtn: 'Iniciar teste', empty: 'Não há testes com esta etiqueta.' },
}

function getUI(lang: string) {
  return UI[lang] ?? UI['es']
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  return discoverTagParams()
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>
}): Promise<Metadata> {
  const { lang, tag } = await params
  const ui = getUI(lang)

  const robots = await getRobots('tag')
  return {
    title:   `${ui.prefix} ${tag} — Psicoprotego`,
    robots,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TagPage({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>
}) {
  const { lang, tag } = await params
  const tests = await loadTestCards(lang, { tag })
  if (tests.length === 0) notFound()

  const ui = getUI(lang)

  const schema = {
    '@context':    'https://schema.org',
    '@type':       'ItemList',
    name:          `${ui.prefix} ${tag}`,
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
          <h1 className="font-serif text-3xl font-bold text-primary-800 sm:text-4xl">
            {ui.prefix} <span className="text-accent-600">{tag}</span>
          </h1>
        </div>
        <TestGrid tests={tests} lang={lang} ui={ui} />
      </div>
    </>
  )
}
