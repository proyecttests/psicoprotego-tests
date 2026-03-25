/**
 * @file utils/shareEncoding.ts
 * @description Encode/decode de respuestas de test para URLs compartibles.
 *
 * v1: base64(JSON { v:1, a: {q1:0, q2:1, ...} }) — objeto con claves (compat)
 * v2: base64(JSON { v:2, a: [0,1,...] }) — array ordenado por clave numérica
 *
 * v2 es ~45% más corto. Requiere que el decoder conozca las claves
 * (disponibles en la definición del test, cargada en ResultadoClient).
 *
 * URL resultante: /[lang]/test/[testId]/resultado?d=TOKEN
 */

import type { AnswersMap } from '@/types/test'

/** Ordena claves de pregunta numéricamente: q1, q2, ..., q10 */
function sortKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''), 10) || 0
    const nb = parseInt(b.replace(/\D/g, ''), 10) || 0
    return na - nb
  })
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json)
  let binary  = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64Url(token: string): string {
  const padded = token.replace(/-/g, '+').replace(/_/g, '/')
  const pad    = (4 - (padded.length % 4)) % 4
  const binary = atob(padded + '='.repeat(pad))
  const bytes  = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Codifica respuestas en token URL-safe (formato v2: array ordenado).
 * ~45% más corto que v1 para tests con muchas preguntas.
 */
export function encodeAnswers(answers: AnswersMap): string {
  const keys   = sortKeys(Object.keys(answers))
  const values = keys.map((k) => answers[k])
  return toBase64Url(JSON.stringify({ v: 2, a: values }))
}

/**
 * Decodifica token v1 (objeto) sin conocer las claves del test.
 * Devuelve null para tokens v2 (necesitan questionIds).
 */
export function decodeAnswers(token: string): AnswersMap | null {
  try {
    const payload = JSON.parse(fromBase64Url(token)) as { v: number; a: unknown }
    if (payload.v === 1 && payload.a && typeof payload.a === 'object' && !Array.isArray(payload.a)) {
      return payload.a as AnswersMap
    }
    // v2 requires question IDs — caller must use decodeAnswersV2
    return null
  } catch {
    return null
  }
}

/**
 * Decodifica token v1 o v2 dado el array ordenado de IDs de pregunta.
 * Usar en ResultadoClient donde ya se ha cargado el JSON del test.
 */
export function decodeAnswersWithKeys(token: string, questionIds: string[]): AnswersMap | null {
  try {
    const payload = JSON.parse(fromBase64Url(token)) as { v: number; a: unknown }

    if (payload.v === 1 && payload.a && typeof payload.a === 'object' && !Array.isArray(payload.a)) {
      return payload.a as AnswersMap
    }

    if (payload.v === 2 && Array.isArray(payload.a)) {
      const sortedIds = sortKeys(questionIds)
      const entries   = (payload.a as Array<string | number | boolean>).map(
        (val, i) => [sortedIds[i], val] as [string, string | number | boolean]
      )
      return Object.fromEntries(entries) as AnswersMap
    }

    return null
  } catch {
    return null
  }
}

/** Construye la URL larga de resultado compartible. */
export function buildShareUrl(lang: string, testId: string, answers: AnswersMap): string {
  const token  = encodeAnswers(answers)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/${lang}/test/${testId}/resultado?d=${token}`
}

/**
 * Construye la URL compartible y la acorta vía /api/shorten.
 * Devuelve la URL corta si el servidor responde, o la larga como fallback.
 */
export async function buildShortShareUrl(lang: string, testId: string, answers: AnswersMap): Promise<string> {
  const longUrl = buildShareUrl(lang, testId, answers)
  try {
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: longUrl }),
    })
    if (res.ok) {
      const { slug } = (await res.json()) as { slug: string }
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      return `${origin}/r/${slug}`
    }
  } catch { /* fallback to long URL */ }
  return longUrl
}

