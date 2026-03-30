/**
 * @file app/[lang]/grupo/[testId]/page.tsx
 * @description Página de resultados grupales.
 * Soporta dos modos:
 * - ?code=APE-7K3  → sesión en vivo vía Vercel KV (quizzes)
 * - legacy ?a=...  → URL-encoded (compatibilidad hacia atrás)
 */
import type { Metadata } from 'next'
import GroupResultsView from '@/views/GroupResultsView'
import LiveGroupView from '@/views/LiveGroupView'

export const metadata: Metadata = {
  title: 'Resultados grupales — Psicoprotego',
  robots: 'noindex, nofollow',
}

export default async function GroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; testId: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const { lang, testId } = await params
  const sp = await searchParams
  const code = sp.code?.toUpperCase()

  if (code) {
    return <LiveGroupView lang={lang} testId={testId} code={code} />
  }

  // Legacy URL-based mode
  return <GroupResultsView lang={lang} testId={testId} />
}
