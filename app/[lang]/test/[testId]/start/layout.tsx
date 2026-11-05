/**
 * @file app/[lang]/test/[testId]/start/layout.tsx
 * @description Metadatos del intersticial con el aviso previo (la página es un Client Component y no puede exportarlos).
 *
 * noindex, follow: es un paso del flujo, sin contenido propio que posicionar; la página que
 * se indexa es la landing del test.
 */

import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTestName } from '@/utils/testName'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; testId: string }>
}): Promise<Metadata> {
  const { lang, testId } = await params
  const name = await getTestName(testId, lang)
  return {
    title:  name ? `Antes de empezar — ${name}` : 'Test',
    robots: { index: false, follow: true },
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
