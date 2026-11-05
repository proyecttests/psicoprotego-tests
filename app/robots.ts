import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'

// /_next/ no se bloquea: Google necesita su JS y su CSS para renderizar las páginas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
