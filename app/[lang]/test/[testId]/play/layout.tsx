/**
 * @file app/[lang]/test/[testId]/play/layout.tsx
 * @description Metadatos del test interactivo (la página es un Client Component y no puede exportarlos).
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
    title:  name ? name : 'Test',
    robots: { index: false, follow: true },
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
