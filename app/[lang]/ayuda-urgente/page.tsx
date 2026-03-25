/**
 * @file app/[lang]/ayuda-urgente/page.tsx
 * @description Página de recursos de ayuda urgente — Server Component + SSG.
 *
 * generateStaticParams() auto-descubre langs desde /src/data/help-resources/.
 * Añadir un idioma nuevo = soltar fr.json en esa carpeta. Sin tocar código.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import HelpResourcesPage, { type HelpData } from '@/views/HelpResourcesPage'

// ── Constantes ────────────────────────────────────────────────────────────────

const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testpsycho.com'
const HELP_DATA_DIR = path.join(process.cwd(), 'src', 'data', 'help-resources')

// ── Auto-discovery ────────────────────────────────────────────────────────────

async function discoverHelpLangs(): Promise<string[]> {
  try {
    const files = await fs.readdir(HELP_DATA_DIR)
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
  } catch {
    return ['es']
  }
}

async function loadHelpData(lang: string): Promise<unknown> {
  try {
    const raw = await fs.readFile(path.join(HELP_DATA_DIR, `${lang}.json`), 'utf-8')
      .catch(() => fs.readFile(path.join(HELP_DATA_DIR, 'es.json'), 'utf-8'))
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const langs = await discoverHelpLangs()
  return langs.map((lang) => ({ lang }))
}

// ── generateMetadata ──────────────────────────────────────────────────────────

const META_DESCRIPTION: Record<string, string> = {
  es: 'Recursos de crisis, líneas de ayuda y apoyo psicológico urgente disponibles 24 horas.',
  en: 'Crisis resources, helplines and urgent psychological support. Available 24 hours.',
  pt: 'Recursos de crise, linhas de apoio e suporte psicológico urgente. Disponíveis 24 horas.',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const data = await loadHelpData(lang)
  if (!data) return { title: 'Ayuda — Psicoprotego' }

  const page = (data as { page?: { title?: string } }).page
  const url  = `${SITE_URL}/${lang}/ayuda-urgente`
  const langs = await discoverHelpLangs()

  return {
    title:       `${page?.title ?? 'Ayuda urgente'} — Psicoprotego`,
    description: META_DESCRIPTION[lang] ?? META_DESCRIPTION['es'],
    robots:      { index: false, follow: true },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(langs.map((l) => [l, `/${l}/ayuda-urgente`])),
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
  const langs = await discoverHelpLangs()
  if (!langs.includes(lang)) notFound()

  const data = await loadHelpData(lang)
  if (!data) notFound()

  return <HelpResourcesPage lang={lang} data={data as unknown as HelpData} />
}
