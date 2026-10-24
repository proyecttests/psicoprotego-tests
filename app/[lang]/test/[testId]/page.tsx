/**
 * @file app/[lang]/test/[testId]/page.tsx
 * @description Landing page del test — Server Component.
 *
 * - generateStaticParams() → SSG auto-descubierto desde /public/data/tests/
 * - generateMetadata()     → title, description, OG, hreflang
 * - JSON-LD inline         → FAQPage + BreadcrumbList + MedicalWebPage
 * - Sin 'use client'       → HTML estático en build time
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { TestContent, TestLangFile, TestMetadata } from '@/types/test'
import TestLandingPage from '@/views/TestLandingPage'
import { discoverTests } from '@/utils/discoverTests'

// ── Constantes ────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testpsycho.com'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function loadTestData(
  testId: string,
  lang: string,
): Promise<{ langData: TestLangFile; metadata: TestMetadata } | null> {
  const dir = path.join(process.cwd(), 'public', 'data', 'tests', testId)

  try {
    const metaRaw = await fs.readFile(path.join(dir, 'metadata.json'), 'utf-8').catch(() => null)
    if (!metaRaw) return null

    const langRaw =
      await fs.readFile(path.join(dir, `${lang}.json`), 'utf-8').catch(() => null) ??
      await fs.readFile(path.join(dir, 'es.json'), 'utf-8').catch(() => null)
    if (!langRaw) return null

    return {
      metadata: JSON.parse(metaRaw) as TestMetadata,
      langData: JSON.parse(langRaw) as TestLangFile,
    }
  } catch {
    return null
  }
}

/**
 * Contenido clínico de la landing (`es.content.json`). Solo se usa si está completo:
 * con algún `[PENDIENTE]` se devuelve null y la landing sigue con el bloque `landing` de es.json.
 */
async function loadTestContent(testId: string, lang: string): Promise<TestContent | null> {
  if (lang !== 'es') return null
  const file = path.join(process.cwd(), 'public', 'data', 'tests', testId, 'es.content.json')
  const raw = await fs.readFile(file, 'utf-8').catch(() => null)
  if (!raw || raw.includes('[PENDIENTE]')) return null
  try {
    return JSON.parse(raw) as TestContent
  } catch {
    return null
  }
}

const UI_BREADCRUMB: Record<string, { home: string; tests: string }> = {
  es: { home: 'Inicio',  tests: 'Tests' },
  en: { home: 'Home',   tests: 'Tests' },
  pt: { home: 'Início', tests: 'Testes' },
}

function buildJsonLd(
  langData: TestLangFile,
  metadata: TestMetadata,
  lang: string,
  testId: string,
  content: TestContent | null,
): object[] {
  const url = `${SITE_URL}/${lang}/test/${testId}`
  const faq = content?.faq ?? langData.landing.faq
  const description = content?.hero.subtitle ?? langData.landing.description
  const bc  = UI_BREADCRUMB[lang] ?? UI_BREADCRUMB['es']
  const schemas: object[] = []

  // BreadcrumbList
  schemas.push({
    '@context':      'https://schema.org',
    '@type':         'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: bc.home,        item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: bc.tests,       item: `${SITE_URL}/${lang}/test` },
      { '@type': 'ListItem', position: 3, name: langData.name,  item: url },
    ],
  })

  // FAQPage
  if (faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type':    'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type':        'Question',
        name:           item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  }

  // MedicalWebPage (solo psicométricos validados)
  if (metadata.category === 'psychometric' && metadata.validated) {
    const orig = metadata.validationDetails.original
    schemas.push({
      '@context':      'https://schema.org',
      '@type':         'MedicalWebPage',
      name:            langData.name,
      description,
      url,
      audience:        { '@type': 'Patient' },
      medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
      citation:        `${orig.reference} — ${orig.journal}`,
      ...(orig.doi ? { sameAs: `https://doi.org/${orig.doi}` } : {}),
      ...(metadata.condition ? {
        about: [{ '@type': 'MedicalCondition', name: metadata.condition }],
      } : {}),
      ...(metadata.tags?.length ? {
        keywords: metadata.tags.join(', '),
      } : {}),
    })
  }

  return schemas
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const tests = await discoverTests()
  return tests.flatMap(({ testId, langs }) => langs.map((lang) => ({ lang, testId })))
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; testId: string }>
}): Promise<Metadata> {
  const { lang, testId } = await params
  const data = await loadTestData(testId, lang)
  if (!data) return { title: 'Test — Psicoprotego' }

  const { langData, metadata } = data
  const url = `${SITE_URL}/${lang}/test/${testId}`
  const content = await loadTestContent(testId, lang)
  const description = content?.hero.subtitle ?? langData.landing.description

  return {
    title:       `${langData.name} — TestPsycho`,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        metadata.availableLangs.map((l) => [l, `/${l}/test/${testId}`])
      ),
    },
    openGraph: {
      title:       langData.name,
      description,
      url,
      locale:      lang,
      type:        'website',
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TestLandingRoute({
  params,
}: {
  params: Promise<{ lang: string; testId: string }>
}) {
  const { lang, testId } = await params
  const data = await loadTestData(testId, lang)
  if (!data) notFound()

  const { langData, metadata } = data
  const content = await loadTestContent(testId, lang)
  const schemas = buildJsonLd(langData, metadata, lang, testId, content)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <TestLandingPage
        langData={langData}
        content={content}
        metadata={metadata}
        lang={lang}
        testId={testId}
      />
    </>
  )
}
