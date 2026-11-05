/**
 * @file config/site.ts
 * @description URL pública de la app y enlaces a la web de Psicoprotego.
 *
 * SITE_URL alimenta canónicas, sitemap, robots, Open Graph y JSON-LD. Sale de
 * NEXT_PUBLIC_SITE_URL; sin ella, la URL de producción en Vercel. Cuando la app se sirva
 * en otra dirección (p. ej. psicoprotego.es/tests), basta con cambiar esa variable.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego-tests.vercel.app').replace(/\/+$/, '')

/** Dominio visible de la app, sin protocolo (imágenes para compartir) */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '')

/** Web principal y blog de Psicoprotego */
export const MAIN_SITE_URL = 'https://psicoprotego.es/'
export const BLOG_URL      = 'https://psicoprotego.es/articulos/'

/** Nombre visible de cada `condition` de metadata.json (el slug no lleva tildes ni espacios). */
const CONDITION_LABELS: Record<string, string> = {
  depresion:          'depresión',
  'sintomas-fisicos': 'síntomas físicos',
}

export function conditionLabel(condition: string) {
  return CONDITION_LABELS[condition] ?? condition
}
