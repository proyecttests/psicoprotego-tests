/**
 * @file utils/shareEncoding.ts
 * @description Encode/decode de respuestas de test para URLs compartibles.
 *
 * Formato: URL-safe base64 del JSON { v: 1, a: answers }
 * Ofuscado (no encriptado) — oculta los datos a inspección casual.
 *
 * URL resultante: /[lang]/test/[testId]/resultado?d=TOKEN
 */

import type { AnswersMap } from '@/types/test'

const PAYLOAD_VERSION = 1

/** Codifica las respuestas en un token URL-safe. */
export function encodeAnswers(answers: AnswersMap): string {
  const json  = JSON.stringify({ v: PAYLOAD_VERSION, a: answers })
  const bytes = new TextEncoder().encode(json)
  let binary  = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/** Decodifica un token y devuelve las respuestas, o null si es inválido. */
export function decodeAnswers(token: string): AnswersMap | null {
  try {
    const padded = token.replace(/-/g, '+').replace(/_/g, '/')
    const pad    = (4 - (padded.length % 4)) % 4
    const binary = atob(padded + '='.repeat(pad))
    const bytes  = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json   = new TextDecoder().decode(bytes)
    const payload = JSON.parse(json) as { v: number; a: AnswersMap }
    if (!payload?.a) return null
    return payload.a
  } catch {
    return null
  }
}

/** Construye la URL completa de resultado compartible. */
export function buildShareUrl(lang: string, testId: string, answers: AnswersMap): string {
  const token = encodeAnswers(answers)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/${lang}/test/${testId}/resultado?d=${token}`
}
