import type { MetadataRoute } from 'next'
import testsIndex from '@/generated/testsIndex'

const BASE   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS  = ['es', 'en', 'pt', 'ku'] as const

// Static pages present for all langs
const STATIC_PAGES = ['', 'acerca-de', 'contacto', 'privacidad', 'cookies', 'aviso-legal']

// Static pages only for es/en/pt (not ku)
const PARTIAL_PAGES = ['ayuda-urgente']

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
        priority:        page === '' ? 0.9 : 0.6,
      })
    }
    // Partial pages (no ku)
    if (lang !== 'ku') {
      for (const page of PARTIAL_PAGES) {
        entries.push({
          url:             `${BASE}/${lang}/${page}`,
          lastModified:    new Date(),
          changeFrequency: 'monthly',
          priority:        0.5,
        })
      }
    }
  }

  // Test landing pages
  for (const test of testsIndex) {
    for (const lang of test.availableLangs as string[]) {
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
