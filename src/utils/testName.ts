/**
 * @file utils/testName.ts
 * @description Nombre visible de un test, leído del disco en el servidor (metadatos de las rutas
 * del flujo: start, play y resultado). Sin peticiones HTTP: no depende de la URL pública.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

export async function getTestName(testId: string, lang: string): Promise<string | null> {
  const dir = path.join(process.cwd(), 'public', 'data', 'tests', testId)
  const raw =
    await fs.readFile(path.join(dir, `${lang}.json`), 'utf-8').catch(() => null) ??
    await fs.readFile(path.join(dir, 'es.json'), 'utf-8').catch(() => null)
  if (!raw) return null
  try {
    return (JSON.parse(raw) as { name?: string }).name ?? null
  } catch {
    return null
  }
}
