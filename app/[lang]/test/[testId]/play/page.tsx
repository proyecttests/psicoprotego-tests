'use client'

import TestContainer from '@/components/test-framework/TestContainer'

export default function TestPlayRoute({
  params,
}: {
  params: { lang: string; testId: string }
}) {
  const { lang, testId } = params
  return <TestContainer testId={testId} lang={lang} />
}
