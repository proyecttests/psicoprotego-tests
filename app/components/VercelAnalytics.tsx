'use client'

/**
 * @file app/components/VercelAnalytics.tsx
 * @description Vercel Web Analytics (sin cookies) sin el token del enlace compartido:
 * quita el parámetro `d` y el fragmento (#d=…) de la URL antes de enviar cada evento.
 */

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next'

function stripShareToken(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url)
  url.searchParams.delete('d')
  url.hash = ''
  return { ...event, url: url.toString() }
}

export default function VercelAnalytics() {
  return <Analytics beforeSend={stripShareToken} />
}
