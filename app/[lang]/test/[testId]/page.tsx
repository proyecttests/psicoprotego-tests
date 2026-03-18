'use client'

import { useRouter } from 'next/navigation'
import TestLandingPage from '@/views/TestLandingPage'

export default function TestLandingRoute({
  params,
}: {
  params: { lang: string; testId: string }
}) {
  const router = useRouter()
  const { lang, testId } = params

  return (
    <TestLandingPage
      testId={testId}
      lang={lang}
      onStart={() => router.push(`/${lang}/test/${testId}/start`)}
    />
  )
}
