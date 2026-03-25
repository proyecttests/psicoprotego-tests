/**
 * @file app/[lang]/test/[testId]/resultado/ResultadoClient.tsx
 * @description Muestra el resultado de un test compartido via URL.
 *
 * Decodifica el token ?d=BASE64, reconstruye las respuestas, ejecuta el scoring
 * y renderiza un ResultCard en modo lectura (sin reset, sin re-share).
 *
 * Preserva todas las respuestas individuales para análisis externo / PDF.
 */

'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { decodeAnswers } from '@/utils/shareEncoding'
import { getScoringFunction } from '@/utils/scoringFunctions'
import type { TestLangFile } from '@/types/test'
import type { TestDefinitionForScoring } from '@/utils/scoringFunctions'
import ResultCard from '@/components/results/ResultCard'

interface ResultadoClientProps {
  lang: string
  testId: string
}

const UI: Record<string, {
  loading: string
  errorTitle: string
  errorInvalidLink: string
  errorTestNotFound: string
  tryTest: string
  sharedBy: string
}> = {
  es: {
    loading:          'Cargando resultado…',
    errorTitle:       'No se pudo cargar el resultado',
    errorInvalidLink: 'El enlace no es válido o ha expirado.',
    errorTestNotFound:'No se encontró el test.',
    tryTest:          'Hacer el test',
    sharedBy:         'Resultado compartido',
  },
  en: {
    loading:          'Loading result…',
    errorTitle:       'Could not load result',
    errorInvalidLink: 'The link is invalid or has expired.',
    errorTestNotFound:'Test not found.',
    tryTest:          'Take the test',
    sharedBy:         'Shared result',
  },
  pt: {
    loading:          'Carregando resultado…',
    errorTitle:       'Não foi possível carregar o resultado',
    errorInvalidLink: 'O link é inválido ou expirou.',
    errorTestNotFound:'Teste não encontrado.',
    tryTest:          'Fazer o teste',
    sharedBy:         'Resultado compartilhado',
  },
}

export default function ResultadoClient({ lang, testId }: ResultadoClientProps) {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const ui           = UI[lang] ?? UI['es']

  type State = 'loading' | 'ready' | 'error'
  const [state,      setState]      = React.useState<State>('loading')
  const [errorMsg,   setErrorMsg]   = React.useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result,     setResult]     = React.useState<any>(null)
  const [testDef,    setTestDef]    = React.useState<TestLangFile | null>(null)
  const [maxScore,   setMaxScore]   = React.useState(0)

  React.useEffect(() => {
    const token = searchParams.get('d')
    if (!token) {
      setErrorMsg(ui.errorInvalidLink)
      setState('error')
      return
    }

    const answers = decodeAnswers(token)
    if (!answers) {
      setErrorMsg(ui.errorInvalidLink)
      setState('error')
      return
    }

    const load = async () => {
      try {
        const metaRes = await fetch(`/data/tests/${testId}/metadata.json`)
        if (!metaRes.ok) throw new Error(ui.errorTestNotFound)
        const meta = await metaRes.json() as { availableLangs: string[] }

        const resolvedLang = meta.availableLangs.includes(lang) ? lang : 'es'
        const langRes = await fetch(`/data/tests/${testId}/${resolvedLang}.json`)
        if (!langRes.ok) throw new Error(ui.errorTestNotFound)
        const langData = await langRes.json() as TestLangFile

        const testDefForScoring: TestDefinitionForScoring = {
          id:       langData.id,
          name:     langData.name,
          lang:     langData.lang,
          questions: langData.questions as import('@/utils/scoringFunctions').QuestionWithScoring[],
          scoring:  langData.scoring,
        }

        const messages = { [testId]: { [resolvedLang]: langData.results } }
        const scoringFn = getScoringFunction(langData.scoringFunction ?? 'scoreStandard')
        const scored    = scoringFn(testDefForScoring, answers, messages, resolvedLang)

        const max = langData.scoring.reduce((acc, r) => Math.max(acc, r.max ?? 0), 0)

        setTestDef(langData)
        setResult(scored)
        setMaxScore(max)
        setState('ready')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : ui.errorInvalidLink)
        setState('error')
      }
    }

    void load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
            style={{ borderTopColor: 'var(--color-primary)' }}
          />
          <p className="text-sm">{ui.loading}</p>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <p className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>
            {ui.errorTitle}
          </p>
          <p className="mt-2 text-sm text-gray-500">{errorMsg}</p>
          <button
            type="button"
            onClick={() => router.push(`/${lang}/test/${testId}`)}
            className="btn-primary mt-6"
          >
            {ui.tryTest}
          </button>
        </div>
      </div>
    )
  }

  if (!result || !testDef) return null

  const mockTestData = {
    id:       testId,
    name:     testDef.name,
    lang,
    version:  testDef.version,
    questions: testDef.questions,
    scoring:  testDef.scoring,
  }

  return (
    <div className="flex flex-col">
      {/* Banner: shared result */}
      <div
        className="py-2 text-center text-xs font-medium"
        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
      >
        {ui.sharedBy}
      </div>

      <div className="flex flex-1 items-start justify-center py-8 px-4">
        <ResultCard
          result={result}
          testData={mockTestData as Parameters<typeof ResultCard>[0]['testData']}
          onReset={() => router.push(`/${lang}/test/${testId}`)}
          lang={lang}
          testId={testId}
          maxScore={maxScore}
          // No onShare — read-only mode
        />
      </div>
    </div>
  )
}
