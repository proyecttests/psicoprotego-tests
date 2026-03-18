/**
 * @file app/[lang]/ayuda-urgente/page.tsx
 * @description Página de recursos de ayuda urgente — Server Component + SSG.
 *
 * Ruta única para los tres idiomas:
 *   /es/ayuda-urgente  /en/ayuda-urgente  /pt/ayuda-urgente
 *
 * generateStaticParams() → 3 páginas estáticas en build time.
 * generateMetadata()     → título y descripción por idioma.
 *
 * HelpResourcesPage es Client Component ('use client') porque usa
 * useState para la sección expandible de "otros países".
 */

import type { Metadata } from 'next'
import HelpResourcesPage from '@/views/HelpResourcesPage'

import esData from '@/data/help-resources/es.json'
import enData from '@/data/help-resources/en.json'
import ptData from '@/data/help-resources/pt.json'

// ── Constantes ────────────────────────────────────────────────────────────────

const LANGS = ['es', 'en', 'pt'] as const
type Lang = typeof LANGS[number]

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testpsycho.com'

const DATA_MAP = {
  es: esData,
  en: enData,
  pt: ptData,
} as const

const META_DESCRIPTION: Record<Lang, string> = {
  es: 'Recursos de crisis, líneas de ayuda y apoyo psicológico urgente disponibles 24 horas.',
  en: 'Crisis resources, helplines and urgent psychological support. Available 24 hours.',
  pt: 'Recursos de crise, linhas de apoio e suporte psicológico urgente. Disponíveis 24 horas.',
}

function getData(lang: string) {
  return DATA_MAP[(lang as Lang) in DATA_MAP ? (lang as Lang) : 'es']
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
  const data = getData(lang)
  const url = `${SITE_URL}/${lang}/ayuda-urgente`

  return {
    title:       `${data.page.title} — Psicoprotego`,
    description: META_DESCRIPTION[(lang as Lang) in META_DESCRIPTION ? (lang as Lang) : 'es'],
    robots:      { index: false, follow: true },
    alternates: {
      canonical: url,
      languages: {
        es: `/es/ayuda-urgente`,
        en: `/en/ayuda-urgente`,
        pt: `/pt/ayuda-urgente`,
      },
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AyudaUrgenteRoute({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return <HelpResourcesPage lang={lang} />
}
