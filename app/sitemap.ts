import type { MetadataRoute } from 'next'
import testsIndex from '@/generated/testsIndex'
import { SUPPORTED_LANGS } from '@/config/brand'

const BASE   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS: readonly string[] = SUPPORTED_LANGS

const STATIC_PAGES = ['', 'acerca-de', 'contacto', 'privacidad', 'cookies', 'aviso-legal', 'ayuda-urgente']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Root redirect
  entries.push({ url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 })

  // Static pages
  for (const lang of LANGS) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url:             `${BASE}/${lang}${page ? `/${page}` : ''}`,
        lastModified:    new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority:        page === '' ? 0.9 : page === 'ayuda-urgente' ? 0.5 : 0.6,
      })
    }
  }

  // Test landing pages
  for (const test of testsIndex) {
    for (const lang of test.availableLangs as string[]) {
      if (!LANGS.includes(lang)) continue
      entries.push({
        url:             `${BASE}/${lang}/test/${test.testId}`,
        lastModified:    new Date(),
        changeFrequency: 'monthly',
        priority:        0.8,
      })
    }
  }

  return entries
}
