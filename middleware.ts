/**
 * @file middleware.ts
 * @description Redirige con 308 a la dirección definitiva (SITE_URL) las visitas directas al
 * dominio de Vercel, para que no haya dos copias de la web.
 *
 * El proxy de Apache también llega a Vercel con el dominio de Vercel, así que no se distingue por
 * dominio: el proxy añade la cabecera `x-psicoprotego-proxy` con el valor de PROXY_SECRET, y lo
 * que llega sin ella es una visita directa.
 *
 * Inactivo hasta el cambio a la dirección definitiva: sin PROXY_SECRET, o con SITE_URL aún en
 * Vercel, deja pasar todo.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { SITE_INDEXABLE, SITE_URL } from '@/config/site'

const PROXY_HEADER = 'x-psicoprotego-proxy'

export function middleware(request: NextRequest) {
  const secret = process.env.PROXY_SECRET
  if (!secret || !SITE_INDEXABLE) return NextResponse.next()
  if (request.headers.get(PROXY_HEADER) === secret) return NextResponse.next()

  const { pathname, search } = request.nextUrl
  return NextResponse.redirect(`${SITE_URL}${pathname}${search}`, 308)
}

export const config = {
  // Los recursos estáticos no se redirigen: no cuentan para el SEO y los pide el propio HTML.
  matcher: ['/((?!_next/static|_next/image).*)'],
}
