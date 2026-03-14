/**
 * @file components/test-framework/TestContainer.tsx
 * @description Orquestador principal del framework de tests psicológicos.
 *
 * Responsabilidades:
 * 1. Cargar la definición del test desde /data/tests.json
 * 2. Cargar los mensajes desde /data/messages.json
 * 3. Gestionar el flujo de estados: loading → disclaimer-before → answering → result | error
 * 4. Filtrar preguntas condicionales (showIf)
 * 5. Detectar red flags durante las respuestas
 * 6. Calcular el score final y mapear al mensaje correcto
 * 7. Auto-avanzar en preguntas Likert (pasa onAdvance a QuestionRenderer)
 * 8. Scroll automático al cambiar de pregunta
 *
 * Uso:
 * ```tsx
 * <TestContainer testId="gad7" lang="es" />
 * ```
 */

import React from 'react'
import type {
  TestDefinition,
  MessagesMap,
  TestState,
  AnswersMap,
  Question,
} from '@/types/test'

import Header           from '@/components/common/Header'
import Footer           from '@/components/common/Footer'
import Disclaimer       from '@/components/common/Disclaimer'
import ProgressBar      from './ProgressBar'
import QuestionRenderer from './QuestionRenderer'
import ResultCard       from '@/components/results/ResultCard'
import { getScoringFunction } from '@/utils/scoringFunctions'
import type { ScoringResult, TestDefinitionForScoring } from '@/utils/scoringFunctions'
import { trackEvent } from '@/config/analytics'

// ── Props ────────────────────────────────────────────────────────────────────

interface TestContainerProps {
  /** Identificador del test a cargar (debe coincidir con el `id` en tests.json) */
  testId: string
  /** Código de idioma (debe coincidir con un `lang` en messages.json) */
  lang?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Evalúa si una pregunta debe mostrarse según su condición `showIf`.
 */
function shouldShowQuestion(question: Question, answers: AnswersMap): boolean {
  if (!question.showIf) return true
  const { questionId, value } = question.showIf
  return answers[questionId] === value
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * TestContainer — orquestador principal del test psicológico.
 *
 * @param testId - ID del test en tests.json
 * @param lang   - Idioma de los mensajes (por defecto 'es')
 */
const TestContainer: React.FC<TestContainerProps> = ({ testId, lang = 'es' }) => {
  // ── Estado ─────────────────────────────────────────────────────────────────
  const [uiState,    setUiState]    = React.useState<TestState>('loading')
  const [testDef,    setTestDef]    = React.useState<TestDefinition | null>(null)
  const [messages,   setMessages]   = React.useState<MessagesMap | null>(null)
  const [answers,    setAnswers]    = React.useState<AnswersMap>({})
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [result,     setResult]     = React.useState<ScoringResult | null>(null)
  const [errorMsg,   setErrorMsg]   = React.useState<string>('')

  // ── Carga de datos ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        const [testsRes, messagesRes] = await Promise.all([
          fetch('/data/tests.json'),
          fetch('/data/messages.json'),
        ])

        if (!testsRes.ok)    throw new Error(`Error cargando tests.json: ${testsRes.status}`)
        if (!messagesRes.ok) throw new Error(`Error cargando messages.json: ${messagesRes.status}`)

        const testsData    = await testsRes.json()    as { tests: TestDefinition[] }
        const messagesData = await messagesRes.json() as MessagesMap

        const foundTest = testsData.tests.find((t) => t.id === testId && t.lang === lang)
        if (!foundTest) throw new Error(`Test "${testId}" (lang: ${lang}) no encontrado.`)

        if (!cancelled) {
          setTestDef(foundTest)
          setMessages(messagesData)
          setUiState(foundTest.disclaimerBefore ? 'disclaimer-before' : 'answering')
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Error desconocido')
          setUiState('error')
        }
      }
    }

    void loadData()
    return () => { cancelled = true }
  }, [testId, lang])

  // ── Preguntas visibles ─────────────────────────────────────────────────────
  const visibleQuestions = React.useMemo(() => {
    if (!testDef) return []
    return testDef.questions.filter((q) => shouldShowQuestion(q, answers))
  }, [testDef, answers])

  const currentQuestion = visibleQuestions[currentIdx] ?? null
  const isLastQuestion  = currentIdx === visibleQuestions.length - 1

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAnswer = (questionId: string, value: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    trackEvent('question_answered', { testId, questionId, answer: value })
  }

  /**
   * Avanza a la siguiente pregunta (con scroll suave a top) o finaliza el test.
   * También es el callback de auto-avance que se pasa a LikertScale.
   */
  const handleNext = () => {
    if (!testDef || !messages) return

    if (!isLastQuestion) {
      setCurrentIdx((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit({ ...answers })
    }
  }

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = (finalAnswers: AnswersMap) => {
    if (!testDef || !messages) return

    const scoringFn = getScoringFunction('scoreGAD7')
    const scored = scoringFn(
      testDef as unknown as TestDefinitionForScoring,
      finalAnswers,
      messages as Record<string, Record<string, unknown>>,
      lang,
    )

    if (scored.resultType === 'CRISIS' && !scored.message) {
      setErrorMsg(`No se encontró mensaje de crisis para "${testId}" (lang: ${lang}).`)
      setUiState('error')
      return
    }

    trackEvent('test_completed', {
      testId,
      score: scored.score,
      category: scored.category?.label,
    })

    if (scored.resultType === 'CRISIS' || (scored.redFlags && scored.redFlags.length > 0)) {
      trackEvent('red_flag_detected', {
        testId,
        flagCount: scored.redFlags?.length ?? 0,
        severity: 'critical',
      })
    }

    setResult(scored)
    setUiState('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    trackEvent('test_reset', { testId })
    setAnswers({})
    setCurrentIdx(0)
    setResult(null)
    setUiState(testDef?.disclaimerBefore ? 'disclaimer-before' : 'answering')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Helpers de render ──────────────────────────────────────────────────────

  const currentAnswered = currentQuestion
    ? answers[currentQuestion.id] !== undefined
    : false

  // Footer de crisis solo cuando hay un resultado de tipo CRISIS
  const showCrisisFooter = result?.resultType === 'CRISIS'

  // ── Render por estado ──────────────────────────────────────────────────────

  if (uiState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-gray-500">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200" style={{ borderTopColor: 'var(--color-primary)' }}
            aria-hidden="true"
          />
          <p className="text-sm font-medium">Cargando cuestionario…</p>
        </div>
      </div>
    )
  }

  if (uiState === 'error') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div
            role="alert"
            className="max-w-md rounded-xl border border-red-300 bg-red-50 p-6 text-center shadow-sm"
          >
            <span aria-hidden="true" className="text-4xl">⚠️</span>
            <h1 className="mt-3 text-lg font-semibold text-red-800">Error al cargar el test</h1>
            <p className="mt-2 text-sm text-red-700">{errorMsg}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-5"
            >
              Recargar página
            </button>
          </div>
        </main>
        <Footer showCrisisFooter={false} />
      </div>
    )
  }

  if (uiState === 'disclaimer-before') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header testName={testDef?.name} />
        <main className="flex flex-1 items-start justify-center pt-8">
          <Disclaimer
            type="before"
            testName={testDef?.name ?? ''}
            customText={testDef?.disclaimerBefore}
            onContinue={() => setUiState('answering')}
            onCancel={() => window.history.back()}
          />
        </main>
        <Footer showCrisisFooter={false} />
      </div>
    )
  }

  if (uiState === 'result' && result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header testName={testDef?.name} />
        <main className="flex flex-1 items-start justify-center py-8">
          <ResultCard
            result={result}
            testData={testDef}
            onReset={handleReset}
            type={result.resultType}
          />
        </main>
        <Footer showCrisisFooter={showCrisisFooter} />
      </div>
    )
  }

  // Answering
  if (!currentQuestion) return null

  const questionNumber = currentIdx + 1

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        testName={testDef?.name}
        currentQuestion={questionNumber}
        totalQuestions={visibleQuestions.length}
      />

      <main
        className="flex flex-1 flex-col items-center px-4 py-6 sm:px-6"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="w-full max-w-2xl">
          {/* ── Barra de progreso ────────────────────────────────────────── */}
          <ProgressBar
            currentQuestion={questionNumber}
            totalQuestions={visibleQuestions.length}
          />

          {/* ── Tarjeta de pregunta ──────────────────────────────────────── */}
          <div className="card mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Pregunta {questionNumber}
            </p>
            <h2 className="mb-6 text-xl font-semibold leading-snug text-gray-800">
              {currentQuestion.text}
            </h2>

            {/* Renderizador dinámico del tipo de pregunta.
                Para Likert: pasa onAdvance={handleNext} si no es la última pregunta,
                lo que activa el auto-avance ~400ms tras selección. */}
            <QuestionRenderer
              question={currentQuestion}
              answers={answers}
              onChange={handleAnswer}
              onAdvance={
                currentQuestion.type === 'likert' && !isLastQuestion
                  ? handleNext
                  : undefined
              }
            />
          </div>

          {/* ── Botones de navegación ────────────────────────────────────── */}
          <div className="mt-6 flex items-center justify-between gap-4">
            {currentIdx > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
                aria-label="Ir a la pregunta anterior"
              >
                ← Anterior
              </button>
            ) : (
              <div aria-hidden="true" />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswered}
              className="btn-primary"
              aria-label={isLastQuestion ? 'Finalizar y ver resultados' : 'Ir a la siguiente pregunta'}
            >
              {isLastQuestion ? 'Ver resultados →' : 'Siguiente →'}
            </button>
          </div>

          {!currentAnswered && (
            <p aria-live="polite" className="mt-3 text-center text-xs text-gray-400">
              Selecciona una respuesta para continuar
            </p>
          )}
        </div>
      </main>

      <Footer showCrisisFooter={false} />
    </div>
  )
}

export default TestContainer
