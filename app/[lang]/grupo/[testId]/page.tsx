/**
 * @file app/[lang]/grupo/[testId]/page.tsx
 * @description Página de resultados grupales — combina múltiples resultados
 * compartidos por participantes. Completamente client-side, sin backend.
 */
import type { Metadata } from 'next'
import GroupResultsView from '@/views/GroupResultsView'

export const metadata: Metadata = {
  title: 'Resultados grupales — Psicoprotego',
  robots: 'noindex',
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ lang: string; testId: string }>
}) {
  const { lang, testId } = await params
  return <GroupResultsView lang={lang} testId={testId} />
}
