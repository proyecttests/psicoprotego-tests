import type { MetadataRoute } from 'next'
import testsIndex from '@/generated/testsIndex'
import { SUPPORTED_LANGS } from '@/config/brand'
import { SITE_URL } from '@/config/site'

const LANGS: readonly string[] = SUPPORTED_LANGS

// Solo URL indexables y sin redirección: ni la raíz (redirige a /es) ni /ayuda-urgente (noindex).
const STATIC_PAGES = ['', 'acerca-de', 'contacto', 'privacidad', 'cookies', 'aviso-legal', 'condiciones']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const lang of LANGS) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url:             `${SITE_URL}/${lang}${page ? `/${page}` : ''}`,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority:        page === '' ? 0.9 : 0.6,
      })
    }
  }

  // Test landing pages
  for (const test of testsIndex) {
    for (const lang of test.availableLangs as string[]) {
      if (!LANGS.includes(lang)) continue
      entries.push({
        url:             `${SITE_URL}/${lang}/test/${test.testId}`,
        changeFrequency: 'monthly',
        priority:        0.8,
      })
    }
  }

  return entries
}
