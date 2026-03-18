'use client'

import { useRouter } from 'next/navigation'
import TestInterstitial from '@/views/TestInterstitial'

export default function TestInterstitialRoute({
  params,
}: {
  params: { lang: string; testId: string }
}) {
  const router = useRouter()
  const { lang, testId } = params

  return (
    <TestInterstitial
      testId={testId}
      lang={lang}
      onContinue={() => router.push(`/${lang}/test/${testId}/play`)}
      onCancel={() => router.back()}
    />
  )
}
